import * as THREE from 'three';
import { FurAsciiEffect } from './FurAsciiEffect.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Selected camera preset, in degrees and normalized model units.
const INITIAL_VIEW = { azimuth: 332.1, elevation: -5, distance: 5.7 };
const GLIDE_SECONDS = 1.1;

export async function createAsciiRabbit(host, signal) {
  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
  renderer.setPixelRatio(1);
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(35, 1, 0.05, 50);
  camera.position.setFromSphericalCoords(INITIAL_VIEW.distance,
    THREE.MathUtils.degToRad(90 - INITIAL_VIEW.elevation), THREE.MathUtils.degToRad(INITIAL_VIEW.azimuth));

  scene.add(new THREE.HemisphereLight(0xffffff, 0x404040, 0.85));
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.7);
  keyLight.position.set(3, 5, 4);
  scene.add(keyLight);
  const rimLight = new THREE.DirectionalLight(0xffffff, 0.8);
  rimLight.position.set(-3, 2, -2);
  scene.add(rimLight);

  const effect = new FurAsciiEffect(renderer);
  host.appendChild(effect.domElement);

  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const controls = new OrbitControls(camera, host);
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.enableDamping = !motion.matches;
  controls.dampingFactor = 1 - Math.exp(-1 / (60 * GLIDE_SECONDS));
  controls.rotateSpeed = .4;
  controls.target.set(0, 0, 0);
  controls.update();

  const anchorAzimuth = controls.getAzimuthalAngle();
  const anchorPolar = controls.getPolarAngle();
  controls.minAzimuthAngle = anchorAzimuth - THREE.MathUtils.degToRad(18);
  controls.maxAzimuthAngle = anchorAzimuth + THREE.MathUtils.degToRad(18);
  controls.minPolarAngle = anchorPolar - THREE.MathUtils.degToRad(8);
  controls.maxPolarAngle = anchorPolar + THREE.MathUtils.degToRad(8);

  let model;
  let mixer;
  let paused = motion.matches;
  let disposed = false;
  let visible = true;
  let dirty = true;
  let frame = 0;
  let lastFrame = performance.now();
  let lastRender = lastFrame;

  function markDirty() { dirty = true; }
  controls.addEventListener('change', markDirty);

  function resize() {
    if (disposed) return;
    const width = Math.max(180, host.clientWidth);
    const height = Math.max(180, host.clientHeight);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    effect.setSize(width, height);
    dirty = true;
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  const intersectionObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; dirty = true; });
  intersectionObserver.observe(host);

  function onMotionChange() {
    paused = motion.matches;
    controls.enableDamping = !motion.matches;
    dirty = true;
  }
  motion.addEventListener('change', onMotionChange);

  function disposeModel(root) {
    root?.traverse((object) => {
      if (!object.isMesh) return;
      object.geometry.dispose();
      for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
        for (const value of Object.values(material)) {
          if (value?.isTexture) { value.source?.data?.close?.(); value.dispose(); }
        }
        material.dispose();
      }
    });
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    motion.removeEventListener('change', onMotionChange);
    signal.removeEventListener('abort', dispose);
    controls.removeEventListener('change', markDirty);
    controls.dispose();
    mixer?.stopAllAction();
    disposeModel(model);
    renderer.dispose();
    renderer.forceContextLoss();
    effect.domElement.remove();
  }
  signal.addEventListener('abort', dispose, { once: true });

  try {
    const gltf = await new GLTFLoader().loadAsync('/models/rabbit.glb');
    if (disposed || signal.aborted) {
      disposeModel(gltf.scene);
      dispose();
      throw new DOMException('Viewer was closed.', 'AbortError');
    }

    model = new THREE.Group();
    model.add(gltf.scene);
    model.updateMatrixWorld(true);
    const bounds = new THREE.Box3().setFromObject(model);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    const scale = 4 / Math.max(size.x, size.y, size.z);
    effect.axis.set(size.x >= size.z ? 1 : 0, 0, size.x >= size.z ? 0 : 1);
    model.scale.setScalar(scale);
    model.position.copy(center).multiplyScalar(-scale);
    scene.add(model);

    mixer = new THREE.AnimationMixer(gltf.scene);
    const clip = gltf.animations.find((animation) => /idle/i.test(animation.name)) || gltf.animations[0];
    if (clip) mixer.clipAction(clip).play();
    resize();

    function animate(now) {
      if (disposed) return;
      frame = requestAnimationFrame(animate);
      const delta = Math.min((now - lastFrame) / 1000, 0.1);
      lastFrame = now;
      if (!visible || document.hidden) return;
      // Smooth coasting with a shorter tail, independent of refresh rate.
      controls.dampingFactor = 1 - Math.exp(-delta / GLIDE_SECONDS);
      controls.update(delta);
      if (!paused) { mixer.update(delta); dirty = true; }
      if (dirty && now - lastRender >= 1000 / 24) {
        effect.render(scene, camera);
        dirty = false;
        lastRender = now;
      }
    }
    effect.render(scene, camera);
    frame = requestAnimationFrame(animate);

    return {
      dispose,
      handleKey(key) {
        if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key)) return false;
        const offset = camera.position.clone().sub(controls.target);
        const spherical = new THREE.Spherical().setFromVector3(offset);
        if (key === 'ArrowLeft') spherical.theta -= 0.12;
        if (key === 'ArrowRight') spherical.theta += 0.12;
        if (key === 'ArrowUp') spherical.phi -= 0.12;
        if (key === 'ArrowDown') spherical.phi += 0.12;
        spherical.phi = THREE.MathUtils.clamp(spherical.phi, controls.minPolarAngle, controls.maxPolarAngle);
        camera.position.copy(controls.target).add(offset.setFromSpherical(spherical));
        controls.update();
        dirty = true;
        return true;
      },
    };
  } catch (error) {
    dispose();
    throw error;
  }
}

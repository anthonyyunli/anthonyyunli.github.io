import * as THREE from 'three';
import { furCharacter } from './fur-shading.js';

const FONT_SIZE = 14;
const LINE_HEIGHT = 15;
const FONT_FAMILY = '"Liberation Mono", Consolas, monospace';

// Sample one rendered pixel per character, rather than rendering a full-size
// canvas and throwing most pixels away. The alpha channel preserves silhouettes.
export class FurAsciiEffect {
  constructor(renderer) {
    this.renderer = renderer;
    this.domElement = document.createElement('pre');
    this.domElement.className = 'rabbit-ascii';
    this.domElement.setAttribute('aria-hidden', 'true');
    Object.assign(this.domElement.style, {
      font: `${FONT_SIZE}px / ${LINE_HEIGHT}px ${FONT_FAMILY}`,
      margin: '0', color: '#e5e5e5', background: 'transparent',
      whiteSpace: 'pre', letterSpacing: '0', overflow: 'hidden',
    });
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d', { willReadFrequently: true });
    this.context.font = `${FONT_SIZE}px ${FONT_FAMILY}`;
    this.characterWidth = this.context.measureText('M').width;
    this.axis = new THREE.Vector3(0, 0, 1);
    this.projected = new THREE.Vector3();
    this.origin = new THREE.Vector3();
  }

  setSize(width, height) {
    this.columns = Math.max(1, Math.floor(width / this.characterWidth));
    this.rows = Math.max(1, Math.floor(height / LINE_HEIGHT));
    this.canvas.width = this.columns;
    this.canvas.height = this.rows;
    this.renderer.setSize(this.columns, this.rows, false);
    this.domElement.style.width = `${this.columns * this.characterWidth}px`;
    this.domElement.style.height = `${this.rows * LINE_HEIGHT}px`;
  }

  render(scene, camera) {
    this.renderer.render(scene, camera);
    const { columns: w, rows: h, context } = this;
    context.clearRect(0, 0, w, h);
    context.drawImage(this.renderer.domElement, 0, 0);
    const { data } = context.getImageData(0, 0, w, h);
    this.origin.set(0, 0, 0).project(camera);
    this.projected.copy(this.axis).project(camera).sub(this.origin);
    let ax = this.projected.x * camera.aspect;
    let ay = -this.projected.y;
    const length = Math.hypot(ax, ay) || 1;
    ax /= length;
    ay /= length;
    const lightAt = (x, y) => {
      const i = (Math.max(0, Math.min(h - 1, y)) * w + Math.max(0, Math.min(w - 1, x))) * 4;
      return data[i + 3] < 32 ? 0 : (data[i] * .2126 + data[i + 1] * .7152 + data[i + 2] * .0722) / 255;
    };
    let output = '';
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        if (data[i + 3] < 38) { output += ' '; continue; }
        // Surface-lighting tangents bend the main body flow around the form.
        const dx = lightAt(x + 1, y) - lightAt(x - 1, y);
        const dy = lightAt(x, y + 1) - lightAt(x, y - 1);
        const tangentSign = (-dy * ax + dx * ay) < 0 ? -1 : 1;
        const flowX = ax * .65 - dy * tangentSign * 2;
        const flowY = ay * .65 + dx * tangentSign * 2 + .28;
        output += furCharacter(lightAt(x, y) * .9, data[i + 3] / 255, flowX, flowY, x, y);
      }
      if (y < h - 1) output += '\n';
    }
    this.domElement.textContent = output;
  }
}

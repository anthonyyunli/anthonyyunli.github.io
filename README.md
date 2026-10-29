# 0xc0ffee.ca

Anthony Li's personal site: Next.js App Router, React, plain CSS, and a Three.js ASCII rabbit. Uses npm and exports static HTML. No UI library, CSS framework, remote fonts, or backend.

## Run

Requires Node.js 20.9+ and npm.

```sh
npm install
npm run dev
```

Open http://localhost:3000. `package-lock.json` pins the four direct dependencies: `next`, `react`, `react-dom`, and `three`.

```sh
npm test
npm run build
```

Tests cover deterministic fur shading. The build exports all pages and public assets to `out/`, ready for a static host. `.openai/hosting.json` configures the existing private Sites preview. Custom-domain/DNS setup for `0xc0ffee.ca` is still pending.

## Where to edit

| Change | File |
| --- | --- |
| Home text and directory links | `src/app/page.js` |
| About photo and paragraphs | `src/app/about/page.js` |
| Blog entries | `src/app/blog/page.js` |
| Project content, links, and images | `src/data/projects.js` |
| Project markup | `src/components/ProjectEntry.js` |
| Photo album controls | `src/components/PhotoAlbum.js` |
| Navigation and footer | `src/components/Header.js`, `Footer.js` |
| Site metadata | `src/app/layout.js` |
| Layout, colors, and responsive rules | `src/app/globals.css` |

Pages are server components. Only navigation state, the rabbit, and the photo album need client JavaScript. Small event handlers remain beside the UI they control; there is no state manager or custom-hook layer.

CSS is grouped by feature, with one mobile breakpoint block at the end. All content pages share `.page-content` to keep prompts aligned. The home split uses `--shell-text-width` to keep the viewport boundary and text width in sync.

## Projects and photos

Add an object to the `projects` array. Each project has `id`, `title`, `role`, `stack`, `description`, and `href`. The directory name links to `href`; the title stays plain text.

- `image` adds one image: `{ src, alt, width, height }`.
- `photos` adds an album: a nonempty array of `{ src, alt, label, width, height, position?, fit? }`. The first item is the thumbnail. `position` controls its crop, for example `50% 12%`. Use `fit: 'contain'` to show an entire UI screenshot.

Put optimized assets in `public/images/`. The About portrait is `about-3499.webp`; Mayhem uses `mayhem.webp`. CanSat starts with IMG_2113, followed by 3949 (1) and IMG_2125. Subs Tracker includes its dashboard, add-plan screen, and annotated wireframe. Original source assets stay in the ignored `temp/` folder.

The album uses a native `<dialog>` with arrow-key navigation and Escape to close. Labels come from the project title. Its only DOM ref is the dialog itself.

The blog is intentionally empty and the résumé is intentionally absent.

## ASCII rabbit

- `src/components/AsciiRabbit.js` loads the viewer and shows loading/error status. Its only DOM ref is the viewport.
- `src/lib/ascii-rabbit.js` owns the scene, camera, animation loop, input listeners, and resource cleanup. Edit `INITIAL_VIEW`, `GLIDE_SECONDS`, and the orbit bounds here.
- `src/lib/FurAsciiEffect.js` converts the rendered model to characters. Edit the font size and line height here.
- `src/lib/fur-shading.js` contains the pure, deterministic character selection, covered by `tests/fur-shading.test.js`.

`createAsciiRabbit(host, signal)` initializes the viewer. Aborting the signal is the single teardown path; the viewer releases its observers, input listeners, animation frame, model, and WebGL context. A failed model load uses the same cleanup. React does not keep a second controller or forward keyboard events.

Dragging orbits within bounds in 2° steps. Damping builds momentum during a drag and lets it decay after release, using a 0.6-second time constant. Camera and rabbit share the 24 FPS redraw loop, without a separate camera timer. Edit `ORBIT_STEP` and `GLIDE_SECONDS` to adjust the feel. Arrow keys keep their normal browser behavior; wheel/pinch zoom stays disabled. Reduced motion freezes animation and removes easing. Hidden or offscreen viewers stop rendering. Three.js loads only on Home.

For a future C++ fluid simulation, add a separate client component and keep generated JavaScript/WebAssembly assets in `public/fluid/`. There is no simulation framework to work around.

The rabbit is based on [RABBIT - Realistic 3D Model (DEMO FREE)](https://sketchfab.com/3d-models/rabbit-realistic-3d-model-demo-free-d70284ea0d7644988bdcd327c3ffb59a) by [WildMesh 3D](https://sketchfab.com/WildMesh_3D), under [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/). Its material is simplified for monochrome rendering; geometry and animation are retained. Keep the footer attribution and `public/models/rabbit.LICENSE.txt`.

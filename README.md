# 0xc0ffee.ca

Anthony Li's personal site. Next.js App Router, React, and plain CSS, using npm. A full-width split-terminal home: an interactive monochrome ASCII rabbit on the left and a centered block of neofetch-style shell output on the right. The design uses black, white, and restrained navy with one continuous borderless two-column terminal layout for projects. The original reference informed the simplicity; the layout and components have their own identity.

## Develop

Requires Node.js 20.9+ and npm.

```sh
npm install
npm run dev
```

Open http://localhost:3000.

## Build

```sh
npm run build
```

Next.js exports static pages to `out/`. Deploy that directory to any static host. The private Sites preview uses the same build output.

## Structure

```text
src/
  app/
    layout.js           shared page shell and metadata
    globals.css         all styles
    page.js             home
    about/page.js       about and achievements
    blog/page.js        empty blog
    projects/page.js    terminal project grid
  components/
    Header.js
    Footer.js
    ProjectEntry.js
    CommandLine.js
  data/projects.js      project descriptions and links
public/
  favicon.svg
  images/               About photo and CanSat album
  models/               rabbit GLB and license
```

There are four direct dependencies: `next`, `react`, `react-dom`, and `three`. Three.js is loaded only by the home-page rabbit viewer. No component library, CSS framework, icon package, or remote font. `package-lock.json` pins the installation.

## Content

Project information comes from the supplied GitHub profile and details provided in chat. Edit `src/data/projects.js` to change project content. The résumé is intentionally left blank. The blog has no placeholder posts; add future routes under `src/app/blog/`.

The home page renders the supplied animated rabbit as monochrome ASCII, using 14px characters and short directional fur strokes. The viewport extends to the shell text's left edge, reclaiming the former inner gutter while preserving the text's horizontal position. The desktop shell has no internal padding. Stable jitter varies the texture without frame-to-frame random flicker. Drag or use arrow keys to orbit up to 18° horizontally and 8° vertically around the selected view; drag inertia decays over 1.1 seconds. Wheel/pinch zoom is disabled. Reduced-motion preferences pause animation automatically.

The selected camera angle is `{ azimuth: 328.1, elevation: 11.5 }`, with distance pulled back slightly to `5.2`, stored in `src/lib/ascii-rabbit.js` as `INITIAL_VIEW`. The temporary camera setup panel has been removed. `npm test` checks the directional fur shading, transparent background, highlights, shadow density, and stable variation.

For a C++ fluid simulation, add an isolated client component and load it only where needed. Emscripten's generated JavaScript/WebAssembly assets can go in `public/fluid/`. The current template does not implement this future experiment.

The site is branded for `0xc0ffee.ca`; custom-domain/DNS configuration is still pending.

## Photos and model

The CanSat album starts with IMG_2113, followed by 3949 (1) and IMG_2125. Its arrows cycle through the photos; opening a photo shows the complete image and supports arrow keys/Escape. The About image is converted from the supplied IMG_3766 HEIC. Original files remain in the local ignored temp folder.

The rabbit is based on [RABBIT - Realistic 3D Model (DEMO FREE)](https://sketchfab.com/3d-models/rabbit-realistic-3d-model-demo-free-d70284ea0d7644988bdcd327c3ffb59a) by [WildMesh 3D](https://sketchfab.com/WildMesh_3D), licensed under [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/). The material is simplified for monochrome rendering; geometry and animation are retained. Attribution appears beside the copyright in the bottom-left footer and the original license is included in public/models/rabbit.LICENSE.txt.

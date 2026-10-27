# 0xc0ffee.ca

Anthony Li's personal site. Next.js App Router, React, and plain CSS, using npm. The layout follows [int0x80.ca](https://github.com/kevlu8/int0x80.ca): a black background, compact header, centered home, and simple bordered content. Terminal styling is limited to monospace type and a cursor.

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
    projects/page.js    project grid
  components/
    Header.js
    Footer.js
    ProjectCard.js
  data/projects.js      project descriptions, links, and details
public/
  favicon.svg
```

There are three direct dependencies: `next`, `react`, and `react-dom`. No component library, CSS framework, icon package, or remote font. `package-lock.json` pins the installation.

## Content

Project information comes from the supplied GitHub profile and details provided in chat. Edit `src/data/projects.js` to change project content. The résumé is intentionally left blank. The blog has no placeholder posts; add future routes under `src/app/blog/`.

For future ASCII animations or a C++ fluid simulation, add an isolated client component and load it only on its experiment page. Emscripten's generated JavaScript/WebAssembly assets can go in `public/fluid/`. The current template does not implement these future experiments.

The site is branded for `0xc0ffee.ca`; custom-domain/DNS configuration is still pending.

# 0xc0ffee.ca

A small terminal-inspired personal site for Anthony Li. Plain HTML, CSS, and a little optional JavaScript. No framework, package install, or build step.

## Run locally

From this directory:

```sh
python3 -m http.server 3000 --directory dist
```

Open http://localhost:3000. The same `dist/` folder can be deployed to any static host.

## Edit

```text
dist/
  index.html           home
  about/index.html     about (résumé intentionally omitted)
  blog/index.html      empty blog index
  projects/index.html  public project links
  assets/style.css     shared visual styles and color tokens
  assets/site.js       optional terminal navigation
  assets/favicon.svg   coffee favicon
```

Navigation is ordinary HTML and works with JavaScript disabled. Keep the shared header/footer consistent when editing. There is no analytics, remote font, runtime API call, or client framework.

### Résumé

The résumé section is intentionally blank, as requested. To add it later, place your PDF at `dist/assets/resume.pdf` and add a link at the HTML comment on the About page. The initial content uses your public GitHub profile and the project/achievement details you supplied in chat.

### Blog

The blog intentionally starts empty. To publish a post, create `dist/blog/your-post/index.html` using the existing page shell, set its unique title and description, and add an ordinary link and publication date to `dist/blog/index.html`. The `.prose` class handles article typography.

### ASCII animations

The home page's static coffee art is a `<pre>` inside `[data-ascii-stage]`. Replace its content from an independent ES module when ready. Respect `prefers-reduced-motion`, pause offscreen work, and keep animated frames out of screen-reader announcements.

### C++ fluid simulation

Keep the simulation independent of the page shell. Compile it to WebAssembly with Emscripten and expose a small initialize/step/destroy interface. Serve the generated `.js` and `.wasm` assets from `dist/assets/fluid/`, then dynamically import the module on a future experiment page. This template includes no simulation or fake demo. A single-threaded WebAssembly build works on ordinary static hosting; a pthread build also needs cross-origin isolation headers.

### Domain

The site is branded for `0xc0ffee.ca`; the Sites preview is private. Connecting the domain requires configuring the host's custom-domain setting and the domain's DNS. Do not point DNS at a private preview if the intended audience is public.

## Sources

- Profile and biography: https://github.com/anthonyyunli and https://github.com/anthonyyunli/anthonyyunli
- Project descriptions: the profile README, linked repositories, and project/achievement details supplied in chat
- Design reference: https://github.com/kevlu8/int0x80.ca — original implementation; no reference source copied

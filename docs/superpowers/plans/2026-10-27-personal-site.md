# 0xc0ffee.ca Implementation Plan

**Goal:** A barebones personal site matching the requested reference, with Home, About, Blog, and Projects.

**User corrections:** Use npm, allow minimal dependencies, and replace the overstyled terminal design with a layout closely following `kevlu8/int0x80.ca`.

**Architecture:** Next.js App Router, React, and React DOM only. Plain CSS, shared header/footer, centralized project data, and static export to `out/`.

## Requirements

- Black background, full-width compact header, centered home title, and simple bordered project/about content following the reference.
- Keep terminal details restrained: monospace text and a small cursor. No command input, decorative coffee illustration, green palette, numbered lists, or homepage project feed.
- Keep the résumé blank and the blog empty. Include only verified GitHub details and the project/achievement information supplied in chat.
- Preserve the existing private preview and project identity.

## Tasks

- [x] Replace static HTML with npm/Next.js source and shared components.
- [x] Simplify the visual design to match the reference.
- [x] Document npm usage, project content, and future ASCII/WebAssembly experiments.
- [x] Install dependencies with npm (three direct dependencies, no reported vulnerabilities).
- [x] Verify production static export, desktop/mobile layouts, navigation, and project disclosures.
Publication: submit the verified source through the Sites workflow; the native deployment history records the final status.

## Verification

- `npm run build`: all four routes statically exported.
- `npm run dev`: all four routes return HTTP 200.
- Real browser: all pages at 1440, 768, 390, and 320px; no horizontal overflow.
- Centered homepage, compact 64px desktop header, and responsive two-column project grid checked.
- Native project disclosures and navigation with JavaScript disabled passed.
- Desktop/mobile screenshots reviewed; no runtime exceptions.

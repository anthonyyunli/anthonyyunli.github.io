# 0xc0ffee.ca Implementation Plan

> **For agentic workers:** Use inline execution for this small static template.

**Goal:** A minimal terminal-style personal website for Anthony Li with Home, About, Blog, and Projects.

**Architecture:** Buildless semantic HTML in `dist/`, one shared stylesheet, and a small optional command navigator. Ordinary links work without JavaScript. Future animations and a C++/WebAssembly experiment can load independently.

**Tech Stack:** HTML, CSS, browser JavaScript. No dependencies or framework.

**Spec:** User request in this conversation: clean reference-inspired layout, stronger terminal styling, four pages, barebones first; ASCII animation and C++ fluid simulation are future work.

## Global Constraints

- Use verified public details from `github.com/anthonyyunli` and its profile README.
- Leave the résumé blank per the user's correction. Include the CanSat, Mayhem, compact detector, and achievement details explicitly supplied in chat. No invented employment, contact details, or blog posts.
- Use a charcoal background, muted green accent, monospace type, plain project lists, responsive layout, and visible keyboard focus.
- Publish the first preview privately through Sites. The requested custom domain is a deployment follow-up.

## Review Focus

- All navigation works directly, including fresh page loads without JavaScript.
- Small screens have no horizontal overflow or obscured navigation.
- The optional command navigator accepts only fixed local routes and never executes code.
- An empty blog accurately communicates that no posts are published.
- Reduced-motion users get a stationary cursor.

## Tasks

- [x] Create the four pages and shared styles, favicon, and optional command navigator.
- [x] Add README instructions for local preview, content edits, blog entries, and future ASCII/WebAssembly modules.
- [x] Verify internal links, document structure, JavaScript syntax, and desktop/mobile rendering where browser access permits.
- [ ] Package, push, and privately publish the static template through Sites.

## Verification

- JavaScript syntax check passed.
- All four HTML pages have one main heading, one active navigation link, working local links/anchors, and available assets.
- Real browser checks passed for all pages at 1440, 768, 390, and 320px, with no horizontal overflow.
- Terminal help, clear, whoami, unknown-command text escaping, keyboard shortcuts, and `cd about` navigation passed.
- Native project disclosures, reduced motion, and navigation without JavaScript passed. No browser runtime exceptions.
- Desktop and mobile screenshots reviewed. Résumé content is omitted; only public GitHub details and the user's explicitly supplied project/achievement details appear.

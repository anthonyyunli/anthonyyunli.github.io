# Route-backed Terminal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make terminal commands share a flat filesystem and URL-derived current directory, with a bottom prompt on content pages.

**Architecture:** One `src/components/Terminal.js` contains the filesystem map, pure parsing/path/command functions, and local UI helpers. Shared website content lives in `src/data/site.js`. Navigation reloads normal static routes.

**Tech Stack:** Existing Next.js, React, JavaScript and CSS; no new dependencies.

**Spec:** `docs/superpowers/specs/2026-10-29-route-backed-terminal-design.md`

## Global Constraints

- One terminal-specific source file; remove HomeTerminal, CommandLine, DirectoryLinks and FakeRemoval modules.
- Preserve cursor, typing activation, eight history entries, 160-character limit, joke commands, galleries, rabbit, and static export.
- URL is the only current-directory authority; history resets on reload.
- Content pages get exactly one prompt at the bottom, before the footer; Home retains its existing placement.
- Preserve the private preview audience.

## Review Focus

- Missing/prototype-named paths must fail without accidental inherited-object lookup.
- A file followed by `/`, `/..`, or another component must fail before path normalization can hide the error.
- Empty quoted tokens, escaped spaces and unfinished input must produce predictable arguments or syntax errors.
- Direct URLs, fragments, Back/Forward and reloads must show the correct directory with one typing listener.
- Long text, cursor scrolling and active prank output must preserve input limits, busy state and timer cleanup.

### Task 1: Implement and verify the shared terminal

**Files:** Create `src/components/Terminal.js`; rename `src/data/projects.js` to `src/data/site.js`; modify Home, About, Blog, Projects, root layout, globals.css and README. Delete the four replaced terminal modules. Add a dependency-free browser command check in `tests/terminal.browser.mjs`.

**Interfaces:** Local `tokenize(line)` returns all argument strings; `resolvePath(cwd, path)` returns a validated canonical map key; `listDirectory(path)` returns listing entries. A plain `commands` table returns data results with `kind` equal to `text`, `listing`, `navigate`, `clear`, or `removal`. Export only default `Terminal` and the `PageTerminal`, `CommandLine`, and `DirectoryLinks` components needed by pages/layout.

- [x] Write browser assertions for root `pwd`, map-derived listings, relative navigation, quoted/escaped paths, file/directory errors, malformed input, argument counts, bottom prompts, and existing interaction behavior.
- [x] Run the first new assertion against the existing site and confirm it fails because `pwd` is unsupported.
- [x] Implement shared content, tokenizer, component-validating path traversal, listings and command functions in the approved file structure. Each ordinary command checks its argument count; `sudo` and `rm -rf` preserve their special behavior.
- [x] Wire one terminal per page, URL-derived paths and shared content/listings. Update static prompts and README; remove replaced modules and stale imports.
- [x] Run the browser checks including all five Review Focus cases, existing tests, static build, and diff whitespace checks. Inspect Home/content-page screenshots and resolve observed failures.
- [x] Obtain one fresh read-only review of the full change and resolve material findings before handing the checked source to the existing Sites workflow.

## Execution Notes

- Execution is inline under the user's explicit instruction to implement the approved design. No additional design/plan approval is needed.
- Ruling: use the existing connected Sites checkout and its source helper rather than introducing a separate worktree, preserving the current source/publication workflow.
- Native browser checks exercise the one JSX terminal module without a transpiler, extra exports, or test-only product hooks.
- The plan checklist is the progress ledger for this single cohesive task; no additional workflow workspace is needed.
- RED: the first browser assertion failed on the prior implementation: `pwd` returned `pwd: command not found` instead of `/`.
- The extended browser suite exposed trimming of escaped trailing spaces. Preserve raw input for tokenization and ignore only whitespace-only submissions; its regression assertion now passes.
- Verification: `node tests/terminal.browser.mjs`, `npm test`, static build, and `git diff --check` all pass. Browser checks cover parsing, path errors, navigation and Back/Forward, cursor/typing guards, responsive alignment at 1440/768/390/320 px, jokes, and the real reload.
- Visual inspection: Home desktop, About desktop, and Projects mobile retain the layout, imagery, and block cursor; content-page prompts align with their opening command.
- Final fresh-context review: no Critical, Important, or Minor findings; no behaviors declined for judgment. The extended browser suite also passes.
- Source implementation is complete. Package/push/publish follows through the Sites helper; its returned SHA and native deployment status are the publication record, avoiding a documentation edit that would change the commit after packaging.

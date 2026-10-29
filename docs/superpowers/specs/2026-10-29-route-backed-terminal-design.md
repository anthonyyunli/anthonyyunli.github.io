# Route-backed terminal design

## Intent

Make the website terminal behave consistently through a small shared filesystem model. Commands should compose through paths and the current directory, and new commands should be ordinary JavaScript functions. Keep the implementation readable, static, and dependency-free.

## Confirmed decisions

- Use a flat filesystem map, as selected by the user.
- Full-page navigation and loss of terminal history on reload are acceptable.
- Add an interactive prompt at the bottom of About, Blog, and Projects.
- Keep the current Home layout, block cursor, typing without clicking, linked listings, and joke commands.
- Consolidate all terminal-specific logic and components in one `Terminal.js`; do not retain separate command-line, listing, or prank component files.

## Approaches

We considered a flat path map and a nested directory tree. The user selected the flat map. It gives each node one canonical key and makes the small site's contents easy to inspect. A nested tree would mirror folders but require more traversal structure.

## Filesystem and paths

The URL pathname determines the current directory. `/` displays as `~`; `/projects/` displays as `~/projects`. Query strings and fragments do not change the directory. Do not store another mutable copy of the current directory.

A flat constant inside `Terminal.js` supplies the initial map:

| Path | Kind | Meaning |
| --- | --- | --- |
| `/` | directory | Home |
| `/about` | directory | About page |
| `/blog` | directory | Blog page, initially empty |
| `/projects` | directory | Projects page |
| `/about/about.txt` | file | Existing About paragraphs |
| `/projects/<id>.txt` | file | Each existing project's summary and source URL |

Keep website content together by renaming the existing `src/data/projects.js` to `src/data/site.js`, retaining its project array and adding the About paragraphs. Pages and terminal files reference those exports instead of copying content. This replaces one content file rather than adding a terminal data layer. File links open the existing About page or the corresponding Projects anchor. Directory links open their canonical page URL.

One path resolver handles relative paths, absolute paths, `.`, `..`, and `~` at the start of a path. Walking above root stays at root. Validate intermediate directories: a file followed by `/` or `/..` must fail instead of becoming valid through string normalization. Paths and commands are case-sensitive.

Directory nodes correspond to actual static Next.js routes. A future page needs its normal route and one map entry. A future text file needs only a map entry. No route-generation framework is required.

### Proposed compatibility changes

Root listings become `about/`, `blog/`, and `projects/`, including Home's initial listing. This makes `cd about` match the displayed directory. The About text is available through `cat about/about.txt` at Home or `cat about.txt` on About.

Remove the old ad hoc `cd about.txt` and `cd home` aliases. Use `cd about`, or `cd` / `cd ~` to return Home. Files produce a normal "not a directory" error when passed to `cd`.

## Command execution

Keep parsing, path operations, and a command table as plain local functions and constants in `Terminal.js`. A command receives all argument tokens and the current directory. It returns data; it does not render React or access the DOM.

A small tokenizer supports whitespace, single/double quoted arguments, and backslash escapes. Unfinished quotes or escapes produce a syntax error. Shell operators, pipelines, globbing, environment expansion, and script execution are outside this first implementation.

Initial commands:

- `whoami`: prints Anthony Li.
- `pwd`: prints the canonical current path, such as `/projects`.
- `ls [path]`: lists immediate children alphabetically, using links. A file argument lists that file.
- `cd [path]`: resolves and validates a directory, then requests full-page navigation. No argument means Home.
- `cat <file>`: prints shared text content; directories and missing paths produce errors.
- `clear`: clears visible command history.
- `sudo`: preserves the exact existing joke for any arguments.
- `rm -rf [target...]`: preserves the existing fake removal animation and reload. Other `rm` input keeps its unsupported-command response.

The ordinary commands validate their argument counts rather than silently dropping extra arguments. Unknown commands and invalid paths produce plain text errors. No `help` command is added.

Use a small set of result kinds: text, listing, navigation, clear, and fake removal. History stores command text, its directory, and result data instead of React elements. Read-only/busy behavior derives from the current result. One renderer handles these results; adding an ordinary command means adding one function to the table.

## UI integration

Reuse the existing terminal input and cursor handling. Rename `HomeTerminal.js` to `Terminal.js` when it becomes shared. Keep Home's instance beneath its existing listing. A route-aware export from the same module renders one bottom instance on other pages, before the footer, using the shared content width and left edge. Avoid another provider or persistent session store.

Each page has exactly one interactive terminal and one typing listener. Reloads start fresh. Direct visits and browser Back/Forward derive the directory from the resulting URL. Static page prompts should also match their location: About uses `~/about $ cat about.txt`; Blog uses `~/blog $ ls`.

`DirectoryLinks` becomes a small local renderer for listing entries supplied by the filesystem, shared by initial Home content and command output. Prompt markup and the prank animation are also local components in the same file. Export only the components needed by page/layout imports. The prank keeps its own timer lifecycle within its local component, with cleanup on unmount. Delete the former `CommandLine.js`, `DirectoryLinks.js`, and `FakeRemoval.js` files after updating their imports.

## Scope and builder choices

Preserve the existing site appearance, galleries, rabbit, footer, keyboard-shortcut guards, eight-entry history limit, and 160-character input limit. No new packages, backend, writable filesystem, persistence, command plugin framework, or extra terminal panels.

The builder may choose node/result property names, error wording, and tokenizer implementation. Within the single terminal module, keep the flat map, path/token helpers, command table, and UI grouped in a readable order. Use local functions where behavior is genuinely shared; do not add providers, command classes, factories, per-command files, or a separate shell engine module.

## Verification

Exercise path resolution, file/directory errors, quoted arguments, directory listings, and commands acting on the same map through focused browser command checks. Use sequences such as `cd projects`, `pwd`, `ls`, and `cd ../blog` across page loads. Keeping terminal code in one JSX module avoids introducing a transpiler or test-only exports just for Node unit tests.

Browser checks cover one bottom prompt per content page, direct URLs and Back/Forward, dynamic prompt paths, clickable listings, cursor editing/scrolling, typing without clicking, existing shortcut guards, and the unchanged sudo/removal jokes. Run the existing tests and static build. Preserve static export and the current private preview audience.

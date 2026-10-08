# Theme Customization — Interview Guide

Decisions for `theme-customization-spec.md`. One decision per question. The spec is updated from this file after the interview ends.

Scope: how a person uses the tool to set drivers. The drivers, primitives, pick rules, and semantic tokens are fixed by `token-system-spec.md` and are not in scope. Default values, ranges, and visual details are Claude's calls. They are recorded as *tunable* and are not asked.

Sources: `theme-customization-spec.md` (section 9 and gaps found in sections 3–7), `token-system-spec.md` sections 3, 5, 6, and 9, `token-rework-interview.md` E1 and E2.

## Questions

Status: `open`, `decided`, `deferred`, or `Claude call`.

### F. Platform

| # | Question | Status |
|---|---|---|
| F1 | Location: docs-site page, standalone Vite app in this repo, or a published artifact. (spec 9.1) | decided |
| F2 | Tool UI: build the tool chrome with handy-ds components (dogfood), or with plain HTML. If dogfood, the chrome must not take the theme under edit. | decided |
| F3 | Users: one person at a time on one machine, or shared state between team members (review, comments). | decided |

### G. Data: load, save, output

| # | Question | Status |
|---|---|---|
| G1 | Load: does the tool open an existing `theme.config.js`? From a file, from pasted text, or from a client repo path? (spec 9.2) | decided |
| G2 | Save: download a file, copy to the clipboard, or write into a client repo. (spec 9.2) | decided |
| G3 | Work in progress: does the tool keep an unsaved theme between sessions? One theme or a list of client themes? | decided |
| G4 | Config metadata: does the output record the client name and the library version it was built against? The config holds only differences from the defaults, so a later default change moves the theme silently. (Links to token spec 9.1.) | decided |
| G5 | Failing config: can the person export a config with contrast failures? The CLI exits 1 on it. | decided |

### H. Navigation and scale

| # | Question | Status |
|---|---|---|
| H1 | Fixed wizard with next/back, or free navigation to any step. (spec 9.3) | decided |
| H2 | Pick disclosure: step 3 holds about 146 color picks. Show all, or a short list of key picks with "show all" for the rest. Which picks are key is a Claude call. | decided |
| H3 | Text styles: how much of the 75 typography picks shows by default. (spec 9.5; same pattern as H2) | decided |
| H4 | Undo/redo and a "changes from default" list. In scope for v1 or not. | decided |

### I. Controls

| # | Question | Status |
|---|---|---|
| I1 | Color picker: a native `<input type="color">` (sRGB hex only) or an OKLCH picker. What happens to a brand color outside sRGB (P3 gamut)? | decided |
| I2 | Hue wheel: view only, or can a person drag the anchors on it? | decided |
| I3 | Web fonts: family drivers are CSS font stacks. How does the preview load a client web font (Google Fonts name, font file upload, or none in v1)? | decided |
| I4 | Typography ratio control: free number or named presets (minor third, major third, ...). | Claude call |
| I5 | Density, base size, and shadow strength ranges and steps. | Claude call |

### J. Accessibility feedback

| # | Question | Status |
|---|---|---|
| J1 | Pair order: a swatch selector disables colors that fail against the paired color. When the person changes the first color of a pair and the second now fails, what happens: show an error, or auto-move the second pick to the nearest passing stop? | decided |
| J2 | Failing derived value: show inline on the token, in the report, or both. (spec 9.6) | decided |
| J3 | Upstream change: a palette or role-map change (steps 1–2) can make existing picks fail. Does the tool warn before the change is applied, or after? | decided |

### K. Preview

| # | Question | Status |
|---|---|---|
| K1 | Preview content: a fixed component sheet, sample page templates (marketing page, form, dashboard), or both. (spec 9.4) | decided |
| K2 | Client pages: can the preview load a client's own site with the theme applied? | decided |
| K3 | Preview layout: one global preview beside every step, or a preview per step that shows only what the step changes. | decided |

### L. Other

| # | Question | Status |
|---|---|---|
| L1 | High contrast mode: in tool v1 or deferred until the token spec defines it. (spec 9.7) | deferred |
| L2 | Build basis: grow the palette grid prototype into the tool, or start fresh and reuse only its logic. `buildTheme()` already does the math. | Claude call |

## Decisions

Recorded in order as each question closes.

### F1. Location: docs-site page

- The tool is a new route in `docs-site/`. It uses the live components and `buildTheme()` directly.
- It replaces the "Theme ⚙" flyout demo.
- Rejected: a standalone app in the repo; a published artifact.

### F3. Users: one person, local

- No server. State lives in the browser and in the exported config file.
- Rejected: shared team state on a server.

### G1, G2. Load and save: file open, download, copy

- Load: open a `theme.config.js` file, or paste its text.
- Save: download the file, or copy its text to the clipboard.
- The tool has no access to a client repo.
- Rejected: read and write in a client repo path; export only.

### H1. Navigation: free, in an ordered list

- A side list shows the 8 steps in the E1 order. A person can open any step at any time.
- Later steps update live.
- Rejected: a fixed wizard with next and back only.

### F2. Tool UI: handy-ds components, default theme

- The tool chrome uses handy-ds components with the default theme.
- The theme under edit applies only inside the preview.
- Rejected: plain HTML and CSS for the chrome.

### G3. Draft: one draft in localStorage

- The current theme saves to browser storage on each change. The exported file is the real record.
- Rejected: a list of named client themes; nothing kept.

### G4. Metadata: client name and library version

- The exported config records the client name and the library version it was built against.
- A later tool or CLI can warn when the library defaults changed after the theme was built.
- Consequence: the driver config needs a metadata key outside the drivers (for example `meta: { client, version }`). `buildTheme()` and `hds-theme` must ignore it. The token spec section 3 must list it.
- Rejected: client name only; no metadata.

### G5. Failing config: export with a warning

- Export works when contrast failures exist. A warning lists the failures.
- The CLI still exits 1 on the config, so the client build catches it.
- Rejected: export blocked until every failure is fixed.

### H2, H3. Pick disclosure: key picks, then "show all"

- Each color category shows a short list of key picks first. A "show all" control opens the rest. The key-pick list is a Claude call (*tunable*).
- Typography shows the `md` size of each role first. The `sm` and `lg` sizes open on demand.
- Rejected: show every pick; show only changed picks with a search field.

### H4. Undo and changes list: both in v1

- Undo and redo apply to driver changes.
- A panel lists every driver that differs from its default, each with a reset control. The list is the same as the export content.
- Rejected: changes list only; per-control reset only.

### I1. Color picker: OKLCH, sRGB clamp

- Primary, secondary, and neutral use a custom OKLCH picker (lightness, chroma, hue) beside the text field.
- A color outside sRGB shows a gamut warning. It maps into sRGB for output. `src/tokens/primitives.ts` already clamps chroma, so the exact anchor is the clamped color.
- Rejected: native `<input type="color">`; keep P3 values with an sRGB fallback.

### I2. Hue wheel: view only

- The wheel shows the slots, the anchors, and the arcs. The anchors change only through the color inputs.
- Rejected: drag the anchors on the wheel.

### I3. Web fonts: Google Fonts name

- A person types a Google Fonts family name. The tool loads the font for the preview.
- The config holds only the CSS font stack. The client app loads the font itself.
- On load of a config, the tool tries the first family of each stack on Google Fonts.
- Rejected: font file upload; both; no web fonts in v1.

### J1. Broken pair: show an error, keep the pick

- When a change to the first color of a pair makes the second pick fail, the second pick stays and shows an error.
- The tool never changes a pick on its own.
- Rejected: auto-move to the nearest passing stop; block the change.

### J2. Failing derived value: inline and in the report

- The token shows an error mark. The contrast report lists the failure too.
- Each report row links to its token.
- Rejected: inline only; report only.

### J3. Upstream failures: after the change, with a count

- A step 1 or step 2 change applies live.
- A failure count shows on the step 3 entry in the side list and in the contrast report. Undo reverts the change.
- Rejected: a confirm prompt before the change.

### L2. Build basis: new code, prototype as reference (Claude call)

- F1 and F2 put the tool in `docs-site/` with handy-ds components. The prototypes are standalone artifacts, so their code does not move over.
- The tool uses `buildTheme()` for all palette and pick math. The prototypes are the visual reference only.

### K1. Preview content: component sheet and sample pages

- A component sheet shows every component in every state.
- Two or three sample pages show real layouts: a marketing page with `hero` and `footer` sections, a form, and a dashboard. The page list is a Claude call (*tunable*).
- A tab switch selects the sheet or a page.
- Rejected: component sheet only; sample pages only.

### K2. Client site: not in v1

- The client checks the theme in its own dev server, with the exported config and the CLI.
- Rejected: load a client URL in a frame.

### K3. Preview layout: global pane and step samples

- One preview pane shows beside every step.
- Each step also shows a small inline sample of what it changes: the grid, the type scale, the radius shapes.
- Rejected: one global preview with no step samples; per-step samples with the full preview at the end.

### L1. High contrast: deferred

- The token spec does not define it yet (token spec section 9.2). The tool adds it when the token spec does.

## Interview complete (2026-10-08)

Every question is decided, deferred, or a Claude call. Next: update `theme-customization-spec.md` from these decisions. G4 also changes the token spec (section 3) and the CLI.

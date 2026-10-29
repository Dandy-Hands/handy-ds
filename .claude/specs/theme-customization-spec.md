# Theme Customization Spec

**Status: draft.** This spec defines the theme customization tool: the visual tool where a person builds a client theme by setting drivers. It replaces `driver-interface-spec.md` (renamed 2026-10-07). The sources are the user's notes of 2026-10-04 (appendix), the token rework interview of 2026-10-06 and 2026-10-07 (`token-rework-interview.md`), and the theme customization interview of 2026-10-08 (`theme-customization-interview.md`). Section 9 lists the open questions.

The drivers, their defaults, and the rules that turn drivers into tokens are in `token-system-spec.md`. This spec covers only how a person sets the drivers. Where the two disagree, the token spec wins.

## 1. Purpose

- The team uses the tool to build a theme for each client. Clients do not use it directly.
- A theme is a set of driver values and nothing else (vision spec section 5). The tool sets drivers only. It never edits semantic tokens or component code.
- The tool replaces hand-editing of `theme.config.js`. Vision spec success criterion: "A person can set every driver through the driver interface, without editing a config file by hand."
- The tool also serves as a theme-building aid: it shows how the palette is generated, so a person can tune the brand colors before picking uses. (User, 2026-10-06: the hue wheel prototype "could be a useful tool in theme building.")

### 1.1 Platform

- **Location.** The tool is a page in `docs-site/`. It replaces the "Theme ⚙" flyout demo (interview F1).
- **Tool UI.** The tool's own UI (side list, panels, controls) uses handy-ds components with the default theme. The theme under edit applies only inside the preview (F2).
- **Users.** One person at a time, on one machine. There is no server (F3).
- **Code.** The tool is new code. It uses `buildTheme()` for all palette and pick math. The prototypes (section 8) are a visual reference only (L2).

## 2. Model: two parts per token type

Each token type has two parts in the tool.

1. **Palette part.** Drivers that shape the primitives. The shape of each primitive set is known in advance: the number of scales, the number of stops, and their names. Only the values change.
2. **Application part.** Pick drivers that choose which primitive each semantic token uses. Every pick has a library default. A person sets only the picks that matter for the client.

A pick stores a reference to a primitive name, such as `primary/600`, not a color value. When a palette driver changes, every pick that points at the changed primitive follows it. The person does not pick again.

## 3. Steps

The tool shows the token types in this order (token rework interview E1). Each step uses only what earlier steps produce.

A side list shows the 9 steps in order. A person can open any step at any time. Later steps update live (interview H1). The tool is not a fixed wizard.

1. Brand colors.
2. Role map.
3. Color application.
4. Typography.
5. Measure.
6. Radius.
7. Border.
8. Elevation.
9. Motion (added 2026-10-28).

### Step 1: Brand colors (color palette part)

Drivers: `color.primary`, `color.secondary`, `color.neutral` or `color.neutralTint`, `color.floor`, `color.contrast`, `color.darkContrast`, `color.darkChroma` (token spec section 3.1).

**Color inputs.**

- Primary, secondary, and neutral each have a text field and an OKLCH color picker (lightness, chroma, hue) (interview I1).
- The text field accepts a hex code and every other CSS color format: `rgb()`, `hsl()`, `oklch()`, and named colors. People often paste values from a brand guide (user decision).
- A color outside sRGB shows a gamut warning. The palette maps it into sRGB, so the anchor cell is the mapped color.
- A value that does not parse shows as an error on the field. The palette keeps its last valid value.
- Secondary is optional. A "use default" option shows where the default secondary lands: primary + 163.6°.
- Neutral is optional. Without it, a tint slider sets the neutral tint at the primary hue.

**Sliders.**

- Chroma floor (0–1): the lowest relative chroma of the 9 generated slots. It keeps a near-gray brand's palette clearly colored.
- Contrast (−1 to +1): bends the lightness stops of every ramp.
- Dark contrast and dark chroma: tune the dark palette. They apply when the preview is in dark mode.

**Live palette grid.** The 11 × 11 primitive grid is always visible and updates live as any driver changes (user decision).

- Rows: the 11 hue slots (`hue-0` to `hue-10`), then the neutral row. White and black show beside the grid.
- Columns: the 11 stops, `50` to `950`, with each stop's lightness value.
- Each row label shows the slot hue in degrees and its relative chroma.
- The anchor cells (the exact primary, secondary, and neutral colors) are marked. The exact brand color is always in the palette.
- Role badges (primary, secondary, danger, ...) show on their rows.
- A light/dark switch shows the light palette or the dark palette.
- Each cell shows its CSS value on hover.

**Hue wheel view.** A circle view shows the slots on the OKLCH hue circle, the two anchors, and the two arcs between them. It shows how the gaps split in proportion to the arc lengths. Reference: the hue wheel prototype (section 8).

The wheel is view only. The anchors change only through the color inputs (interview I2).

### Step 2: Role map

Drivers: `roles.danger`, `roles.warning`, `roles.success`, `roles.info` (token spec section 4.1.4).

- One row per role. Primary, secondary, and neutral show as locked rows.
- Each system role has a row picker: a list of the 11 slots, each with its swatch. The first option is "auto (hue-n)", the proximity default.
- No two system roles can share a slot. The picker disables the slots that other system roles use. A system role can share a slot with an anchor.
- A changed role updates the grid badges and every semantic token that reads the role.

### Step 3: Color application (color application part)

Drivers: `picks.*`, `contexts.*`, `states.step`, `overlay.opacity`, `mode`, `sections` (token spec section 3.2).

**Pick controls.**

- Picks are grouped by element category: Action, Field, Surface, Content, Graphic, Feedback, Focus, Overlay.
- Each category shows its key picks first. A "show all" control opens the rest of the category (interview H2). The key-pick list is *tunable*.
- A color pick uses a swatch selector. The selector shows the role scales (primary, secondary, neutral, danger, warning, success, info), white, black, and `transparent` where the token allows it.
- Data-visualization picks also show the 11 hue slots, because they point at slots on purpose.
- Each pick shows its library default. A "reset" control returns a pick to its default.
- Feedback roles are fixed per sentiment. The person sets four stop picks (bg, border, fg, icon) that all sentiments share, and changes the hue through the role map (step 2).
- Action has one disabled pair for all priorities. Field has its own disabled pair.

**Interaction states.**

- A person picks the default state only. Hover, active, and selected derive from it (+1 stop, +2 stops). The tool shows each derived state next to its default.
- Each derived state has an optional override pick.
- The `states.step` control changes the hover and active offsets for every category.

**Accessibility (blocking).** The rule is WCAG 2 AA (token spec section 5.4).

- After the person picks one color of a pair, the selector for the other color disables every swatch that fails against it. Example: after an action background is picked, the action text picker disables the colors that fail 4.5:1 on it.
- Text pairs need 4.5:1. Non-text pairs (field borders, icons, focus ring, check marks) need 3:1. Disabled states are exempt.
- **Action backgrounds lead.** An action bg selector is limited by 3:1 against the base and raised surface levels (not sunken), not by its fg. The fg selector is limited by 4.5:1 against the bg (interview J4).
- When a new action bg makes the fg fail 4.5:1, and the person has not set that fg, the tool picks the neutral fg with the most contrast in the same undo step. A notice names the new fg. An fg the person set stays and shows an error (J1).
- Pairs are checked in light mode, in dark mode, and in each brand context.
- A derived value that fails (a state offset or a dark palette color) shows as an error on its token. The contrast report (section 4) lists it too, and each report row links to its token (interview J2). The fix is an override pick.
- A `transparent` background is checked against the surfaces behind it.
- When a change to the first color of a pair makes the second pick fail, the second pick stays and shows an error. The tool never changes a pick on its own (interview J1).
- A step 1 or step 2 change (brand colors, role map) applies live, even when it makes picks fail. A failure count shows on the step 3 entry in the side list and in the contrast report. Undo reverts the change (interview J3).

**Dark mode.**

- Dark mode is derived: the same picks resolve against the dark palette. Most themes need no dark picks.
- Each pick has an optional dark override. The tool shows it only when the person opens it, or when a dark-mode pair fails.

**Contexts and sections.**

- A context switch shows the picks for the root, `on-primary`, and `on-secondary`. Context picks show only the tokens a context overrides (token spec section 6.3).
- The `mode` control sets the page default: light, dark, or system.
- A sections list maps a section name (such as `hero` or `footer`) to a mode or a brand context.

**Data visualization.** A preview shows the categorical, sequential, and diverging palettes as swatch strips and as a sample chart.

### Step 4: Typography

Drivers: `typography.family.*`, `typography.baseSize`, `typography.ratio`, `typography.styles` (token spec sections 3.3, 4.6, 7.7).

- Palette part: the heading, body, and mono font stacks, the base size, and the scale ratio. The tool shows the 9 scale steps.
- Application part: a table of the 5 text roles × 3 sizes. Each cell shows a text sample and its picks: family, scale step, weight, leading, and tracking.
- The table shows the `md` size of each role first. The `sm` and `lg` sizes open on demand (interview H3).
- **Web fonts.** A person can type a Google Fonts family name. The tool loads the font for the preview. The config holds only the CSS font stack, and the client app loads the font itself. When the tool loads a config, it tries the first family of each stack on Google Fonts (interview I3).
- The ratio control and the base size range are *tunable*.

### Step 5: Measure

Drivers: `density`, `layout.contentWidth`, `layout.contentWidthNarrow`. One control scales the 4px grid. The preview shows spacing and control heights at the current density. Two sliders set the page widths in px (content width 960 to 1600, narrow content width 480 to 960, step 16). The ranges do not overlap, so the narrow width is never wider than the content width. Density does not scale the page widths.

### Step 6: Radius

Drivers: `radius.control`, `radius.container`, `radius.indicator`, `radius.round`. One step selector per shape role, with a sample shape for each step.

### Step 7: Border

Drivers: `border.control`, `border.container`, `border.divider`, `border.focus`. One step selector per role.

### Step 8: Elevation

Driver: `shadow.strength`. One slider. The preview shows the raised, floating, and modal levels.

### Step 9: Motion

Driver: `motion.duration`. One slider, 0 to 2, step 0.25. 0 turns motion off. The preview replays an entrance animation at the current speed.

## 4. Preview

- The tool shows a live preview of the components with the current driver values (vision spec section 7).
- **Layout.** One preview pane shows beside every step. Each step also shows a small inline sample of what it changes, such as the palette grid, the type scale, or the radius shapes (interview K3).
- **Content.** A tab switch selects one of these (interview K1):
  - A component sheet: every component in every state.
  - Sample pages: a marketing page with `hero` and `footer` sections, a form, and a dashboard. The page list is *tunable*.
- The preview does not load a client's own site. The client checks the theme in its own dev server with the exported config and the CLI (interview K2).
- The preview has a light/dark switch.
- The preview can show the root, `on-primary`, and `on-secondary` side by side. A card inside a brand section shows as a darker brand panel.
- A contrast report lists every failing pair with its mode, context, and ratio.

The prototype in section 8 shows a first version of the color preview: text roles, action states, field states, surfaces, feedback, dividers, data visualization, and the scrim.

## 5. Output

- The tool produces a driver config: the default export of `theme.config.js`, a partial of `defaultDrivers` (token spec section 3).
- The config holds only the values that differ from the defaults.
- The config also holds a `meta` key: `{ client, version }`. `client` is the client name. `version` is the handy-ds version the theme was built with. `meta` is not a driver, and `buildTheme()` ignores it (interview G4).
- **Save.** The person downloads `theme.config.js`, or copies its text to the clipboard (interview G2).
- **Load.** The person opens a `theme.config.js` file, or pastes its text (interview G1). The tool has no access to a client repo.
- **Draft.** The tool saves the current theme to browser storage on each change. It keeps one draft only. The exported file is the real record (interview G3).
- **Contrast failures.** Export works when the config has contrast failures. A warning lists the failures before the export (interview G5).
- A client project turns the config into CSS with the `hds-theme` CLI. A config that fails a contrast rule makes the CLI exit with code 1. When `meta.version` differs from the installed handy-ds version, the CLI prints a warning, because a library default can change under the theme.

## 6. Interface rules

- One control per driver type, fitted to its input: a color field for a color, a swatch selector for a pick, a slider for a number range, a step selector for a named step.
- Every control shows its default and can reset to it.
- Every change updates the grid and the preview live.
- The tool never offers a value that the token spec does not allow. Example: a non-data-visualization pick cannot select a hue slot.
- Undo and redo apply to every driver change (interview H4).
- A changes panel lists every driver that differs from its default, each with a reset control. The list is the same as the export content (interview H4).
- Slider ranges and steps (density, base size, shadow strength) are *tunable* (interview I5).

## 7. Current state

- The tool v1 is built: the `/theme` route of the docs site (`docs-site/src/theme-tool/`). It replaces the "Theme ⚙" flyout, which is removed.
- `buildTheme()` in `src/tokens/` does all palette and pick math. The swatch selectors and the contrast checker share one pair list (`PAIRS` in `src/tokens/contrast.ts`).
- Known limits of v1:
  - Brand-context views list only the tokens a context overrides. A failure on another token in a context has no row to open.
  - A default section (`hero`) can change its target but cannot be removed, because the config merges over the defaults.
  - Base UI popups portal to `<body>`. They follow the preview mode, but not a brand context of the section that opened them.

## 8. Prototypes

- Hue wheel: https://claude.ai/artifact/Hczt1umkUmec3qcqjsvt3J. Compares the palette models on the hue circle.
- Palette grid: https://claude.ai/artifact/1PycWfx6fNhyGQYVRtumNK. The live 11 × 11 grid, color inputs, chroma modes, floor and contrast sliders, neutral controls, role pickers, dark mode, data-visualization preview, semantic preview per context, contrast check, and token list. It still shows 4 surface levels, not 5.

## 9. Open questions

1. **High contrast mode.** Deferred. The tool adds it when the token spec defines it (token spec section 9.2; interview L1).

The other questions of the first draft closed in the theme customization interview of 2026-10-08.

## Appendix: original notes (2026-10-04)

> Role based token selection. Theme Building.
> 1. Choose brand colors (drives the palettes)
>     * There is a color picker to pick or insert the primary color.
>     * The secondary color is, by default, derived from primary but may be picked.
>     * Neutral colors
>     * System colors are defaulted but also may be tuned.
>     * Graph colors are derived from brand primary.
>     * There might be a contrast slider which shifts the lightness of the oklch stops for the swatches.
>     * All of this creates a color palette visually.
>     * The shape of the palette is entirely known up front, it’s the values that change.
> 2. Color application
>     * Colors are applied to tokens categorized by element: action, field, surface, content, graphic, etc. Many of the applications would be defaulted but can be overridden.
>     * When applying colors, the picker contains the primary, secondary, and neutral colors. Chosen colors will disable the selection of inaccessible colors in other selections.
>     * Semantic color assignment is predetermined.
>     * Surfaces have a type of elevation or priority to set the elevations and the background color.
>     * Need to figure out modes. Dark mode would be derived but can be tuned.
> 3. Measures
> 4. Borders
> 5. Roundness
> 6. Shadow
>
> The gist is, there are 2 parts for each type of token (color, measure, shadow, types, etc.) A part that shapes the primitive/refernce palette, and a part that addresses specifc application. I'm fussy on the specific application part save for a few color applications. So a lot of this will need to be worked out.

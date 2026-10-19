# TODO

Running list of planned work. Add an item when the user asks for new work. Check an item off when its work is done.

## Specs

- [x] Rewrite the vision spec (`.claude/specs/design-system-vision-spec.md`) for drivers-only customization, the driver interface, and the component process.
- [x] Update the vision spec driver list (section 6) after the driver rework.

## Tokens and theming

- [x] Rework the drivers.
- [x] Rework the token system.
  - [x] Change the token spec to the eight element categories (Action, Field, Surface, Content, Graphic, Feedback, Focus, Overlay). See `.claude/decisions.md`.
  - [x] Add a data-visualization palette (token family for charts). None exists; `.pi/research/current-token-structures.md` lists it as a gap.
- [x] Simplify the semantic tokens.
- [x] Rewrite `src/tokens/` to the new token spec (`token-system-spec.md`), including `checkTokenName()` for the new grammar.
- [x] Flatten client customization to drivers only.
  - [x] Remove the mapping-level override from `src/tokens/theme.ts` and its test in `src/tokens/tokens.test.ts`.
  - [x] Add palette color pick drivers, so a client picks the exact palette color for each use.
- [x] After the token rework, update `docs/component-conventions.md` and `docs/rules.md` to match.
- [x] Build the tokens as Figma variables in the Handy DS file (`ZC2dMDma0HioGL8CXxzq9W`).
- [x] Rename the typography role `heading` to `headline` (token spec 7.7, `src/tokens/`, Text, tests). The font family pick `typography.family.heading` keeps its name. Decided in `docs/api-conventions.md`.
- [x] Change the typography tokens to 35 (Text spec interview, 2026-10-12): per role `typography/{role}/{family|weight|leading|tracking}`, per role and step `typography/{role}/size/{sm|md|lg}`. Update token spec 7.7 (record the "property last" exception), `src/tokens/`, the driver interface, and the Figma variables and text styles. Do before the Text code.
- [x] Add `measure/size` steps `200` and `300` (8, 12px) for the Meter track height (Meter spec interview, 2026-10-12). Update token spec 7.5, API conventions 5.2, `src/tokens/`, and the Figma variables. Do before the Meter code.
- [ ] Add a contrast check for Feedback `fg` on page surfaces (`surface/base`, `surface/raised`, both modes). Text `tone` uses Feedback `fg` as text color.
- [ ] Decide the order of the token rework and the component re-interviews. Each interview records a token mapping, so a later token change can force parts of every interview to run again.

## Driver interface

- [x] Build out the driver interface: the UI where a user sets each driver.
  - [x] Custom input controls per driver type, e.g. swatch selectors for color drivers.
  - [x] Answer the open questions in `.claude/specs/theme-customization-spec.md` (section 9): location, saving and loading, navigation, preview content, and others.

## Components

- [ ] Run the component process for every component, to confirm each API. Per-component list: `.claude/component-interview-todo.md`.
- [x] Toggle re-interview (2026-10-12): spec reviewed. `ToggleGroup` is the group in a filled track, `Toggle` is the child (Base UI names, restored 2026-10-14); no standalone button, no text prop. Code, docs, and Figma done (2026-10-14). Contrast gap decided (2026-10-14): a pressed button takes `variant`, an idle button takes the next weaker variant, `variant` is `primary | secondary` only. The group is as tall as a Button of the same `size`; the Toggles fill the inside (2026-10-14).
- [ ] Measure the contrast of a pressed `secondary` (outlined) Toggle against `surface/sunken`. The contrast checker has no sunken pair: add one for `surface/sunken` (both modes) and report any failure.
- [x] Switch re-interview (2026-10-14): spec reviewed. `Switch` is one component with one icon per state (`toggle_off`, `toggle_on`), `size` of `500 | 600 | 800`, Field tokens like Checkbox, no group. `Switch.Root` and `Switch.Thumb` are removed. Code and docs done (2026-10-14). Figma built (2026-10-14).
- [x] Slider (2026-10-15): spec, code, docs, and Figma done. `Slider.Root`, `Label`, `Value`, `Control`; `size` of `200 | 300 | 400` is the track height; range and vertical are exposed. The user has not reviewed the spec yet (the token mapping is Claude's call). Figma page `Slider` (60 variants: value, size, state, orientation).
- [ ] Add a contrast pair for `surface/sunken` (both modes) to the contrast checker. Slider and Toggle both depend on it (see the Toggle item).
- [ ] The e2e page test passes for a page that the dev server does not serve: with a stale server on port 5173 (`reuseExistingServer`), `goto('slider')` rendered the Overview page, which has an `h1`, so the test passed. Decide how to make `e2e/pages.spec.ts` check the page title.
- [ ] After every component is done (the list in `.claude/component-interview-todo.md` is fully checked), run several quality passes over all components.
  - [ ] Define the passes with the user first. Candidates: API consistency against `docs/api-conventions.md`, token mapping and contrast, accessibility, docs and Figma against code, and visual consistency across components.
  - [ ] Keep a record of every difference in decisions: where two components decided the same question in different ways, what each chose, why, and what the pass changed. Write it to `.claude/decisions.md` (the file for judgment calls) or a new file the user picks.
  - [ ] After each pass, update the specs, the API docs, the docs pages, and the Figma pages that the pass changed.
- [ ] Text and number inputs (scope set 2026-10-15): split components by the value type they hold. Select-type controls are out of scope for now. Revised 2026-10-15: each string type is its own component that wraps the Base UI `Input`. Interview guide: `docs/component-specs/input/interview-guide-2026-10-15.md`.
  - [x] `TextInput` (renamed from `Input`; plain text, no `type` prop, `start` and `end` slot props). Spec, code, Figma, and docs built 2026-10-15. `control.css` now uses size steps, so `Field.Control`, `NumberField.Group`, Select, Combobox, and `Toolbar.Input` changed with it.
  - [ ] `EmailInput` (validation on blur, typo hint).
  - [ ] `PhoneInput` (masking by country, raw digits as the value).
  - [x] `PasswordInput` (show/hide button). Spec, code, Figma, docs, and e2e built 2026-10-19. Added the internal `Input` base (`src/components/Input.tsx`) that `TextInput` and the typed inputs derive from.
  - [x] `SearchInput` (clear button, `Escape` clears). Spec, code, Figma, docs, and e2e built 2026-10-19.
  - [ ] `UrlInput` (undecided: include now or wait for a client need).
- [ ] Create a date and time component set (future, not part of the input work): `Calendar`, `DatePicker` (with `range`), later `TimeField`. Values are ISO strings (`"2026-10-15"`), range is `{ start, end }`. Needs a spec interview and maybe new semantic tokens (today, in-range, range start and end, outside month). Base UI has no calendar.
- [ ] Create a Carousel component.
- [ ] Create a Section component.
- [ ] Create layout components. Example names, not final: Stack, Grid, Container, Cluster.
- [ ] Add a charting library. Needs the data-visualization palette (Tokens and theming).

- [x] Install Playwright and add it to the component process (`e2e/`, `npm run test:e2e`, code and docs skills, component conventions).
- [ ] Fix the three doc pages that fail `e2e/pages.spec.ts`: `avatar` (404 for a resource), `combobox` (a function as a React child, and `Combobox.Label` used with `Combobox.Input`), `number-field` (an input with both `value` and `defaultValue`).

## Docs

- [ ] Decide the `render` rule with the user, then check every component against it. Proposed rule: a component exposes `render` only when its element varies by context, not by role. Likely keep: Text, Card, Avatar image, router-link parts (Menu item, Navigation Menu link, Tabs tab). Likely omit: Button, Checkbox, Radio, Separator, Meter, Progress. Update `docs/api-conventions.md` section 1 (the escape-hatch rule) and each spec and component that differs.
- [ ] Rewrite the no-raw-numbers rule in `docs/api-conventions.md` section 4 with the user: say where numbers are allowed (counts such as Text `maxLines`) and where they are forbidden.
- [x] Write the component API conventions: what is and is not an API member, member categories, member names, value types, and value names. Size and space props take measure token steps (`"400"`, `"500"`, ...) plus other values.
- [ ] Build a proper MDX template for component docs (`docs/templates/component.mdx`). Not started. Open points: show one props table for the whole API instead of a separate "Base UI API" section (link to Base UI for pass-through behavior), and update the `hds-component-docs` skill and the existing `docs/components/*.mdx` pages to match.

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
- [ ] Toggle re-interview (2026-10-12): spec reviewed. `Toggle` is the group in a filled track, `Toggle.Button` is the child; no standalone button, no text prop. Next: code, docs, Figma. Blocked on a user decision: the pressed fill matches the `surface/sunken` track (contrast 1.0 to 1.4). See the spec, Token mapping notes.
- [ ] Switch re-interview (2026-10-14): spec reviewed. `Switch` is one component with one icon per state (`toggle_off`, `toggle_on`), `size` of `500 | 600 | 800`, Field tokens like Checkbox, no group. `Switch.Root` and `Switch.Thumb` are removed. Code and docs done (2026-10-14). Next: Figma.
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

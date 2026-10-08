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
- [ ] Flatten client customization to drivers only.
  - [ ] Remove the mapping-level override from `src/tokens/theme.ts` and its test in `src/tokens/tokens.test.ts`.
  - [x] Add palette color pick drivers, so a client picks the exact palette color for each use.
- [ ] After the token rework, update `docs/component-conventions.md` and `docs/rules.md` to match.
- [ ] Decide the order of the token rework and the component re-interviews. Each interview records a token mapping, so a later token change can force parts of every interview to run again.

## Driver interface

- [ ] Build out the driver interface: the UI where a user sets each driver.
  - [ ] Custom input controls per driver type, e.g. swatch selectors for color drivers.
  - [ ] Finish the design in `.claude/specs/driver-interface-spec.md`: the application part for each token type, and its open questions.

## Components

- [ ] Run the component process for every component, to confirm each API. Per-component list: `.claude/component-interview-todo.md`.
- [ ] Create a Carousel component.
- [ ] Create a Section component.
- [ ] Create layout components. Example names, not final: Stack, Grid, Container, Cluster.
- [ ] Add a charting library. Needs the data-visualization palette (Tokens and theming).

## Docs

- [ ] Rework the component documentation template (`docs/templates/component.mdx`).

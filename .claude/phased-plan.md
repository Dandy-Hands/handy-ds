# Phased Plan — handy-ds

Source: `.claude/specs/design-system-vision-spec.md`, `.claude/specs/token-system-spec.md`. Each phase closes specific gaps from token-system-spec.md section 10 ("Not Done Yet") or a vision-spec success criterion. Don't start a phase's speculative parts before the phase that needs them — build tooling/scaffolding only as each phase requires it, not upfront.

Phases are grouped into waves. Items separated by `‖` in a wave can run in parallel (see "Delegation" at the end).

## Wave 1 — Tooling, validator, spec decisions (parallel)

### Phase 0 — Minimal tooling (done)
Just enough to run and build one component. No bundler/lint/test config beyond what Phases 1–3 actually need.
- TypeScript (`tsconfig.json`). Agents are the main consumers; types double as their docs.
- `package.json`: `"type": "module"`; declare `react` / `react-dom` as `peerDependencies` + `devDependencies` (currently only present as auto-installed Base UI peers).
- Vite for the dev/demo page. Same tool gives library-mode build in Phase 3.
- Token pipeline tests via `node --test` (zero deps). No component test runner until a real need appears; the demo page covers "renders".
- Replace the placeholder `test` script.
- Exit: can import and render one Base UI component in isolation on the demo page.

### Naming validator (‖ Phase 0) (done)
Closes gap 7 in full. Pure function of spec section 2 + section 6 — no dependency on any other phase.
- Validate both grammars: `hds/prim/{type}/{property}` and `hds/sem/{category}/{type}/[axis]/[state]/{property}`, plus the category-scope rule (section 6: `other` type only from Type/Icon).
- Validate **slash-form names** (the Theme Map source), not emitted CSS names — `--hds-sem-input-color-default-placeholder-fg` can't be parsed back (hyphens in property names + optional segments).
- Exit: `node --test` fails on a bad name.

### Spec decisions (‖ Phase 0, owner: user) (done)
Conflicts visible now — settle before Phase 2 so the Theme Map isn't built on them. Update the spec with each answer.
Status: answered and written into the spec, except gap 5's part-level tables (drafted in Wave 3). Gap 6 (Meter/Progress token source) is already resolved in token-system-spec.md section 9 — dropped from this list.
- Switch: section 4 lists it under Action, section 9 under Input/Field. Pick one.
- Surface `shadow` is typed Color, but the demo value is a full `box-shadow`; `hds/prim/shadow/level-N` is composite too. Decide type (new type, or allow composite under Color).
- Per-category radius/border drivers (vision spec section 6) vs. primitives having no category segment (token spec section 2). Likely answer: per-category driver selects which radius step the Theme Map uses — but that is a mapping-level input, which blurs the two-level model. Needs a call.
- Data Table uses `hds/sem/action/color/tertiary/{state}/bg`; demo has no tertiary bg. Add it.
- Action states lack `selected`/`pressed` — needed by Tabs, Toggle, Toggle Group (section 9 already says "selected/unselected" for Tabs). Add to Action state list.
- Section color rules driver (hero sections) is a context concern, not a primitive — moves to Phase 2.
- Gap 12 (Checkbox/Radio `checked` state): Input/Field has no `checked` state, but Checkbox/Radio are interactive controls, not plain inputs. Answer: treat `checked` as an Action-style interaction state on the Input/Field `color` token — `hds/sem/input/color/default/checked/{fg,bg,border}` plus the other Input/Field states (`disabled` composed with `checked` as needed by the Theme Map). Checkbox/Radio read only Input/Field tokens.
- Nesting `default` inside `on-primary` requires a `[data-context="default"]` reset block. Spec says contexts nest but the demo doesn't show it. Confirm.
- Gap 5: token source for Tabs panel (currently "no category"), and part tables for Navigation Menu / Combobox options.
- Gap 6: token source for Meter and Progress.
- Exit: every item above answered in the spec. No token additions after this point without re-opening it (keeps the Wave 5 fan-out conflict-free).

## Wave 2 — Primitive contract (sequential, small)

### Phase 1a — Driver config + primitive name list
Closes gaps 2–3 and gap 10.
- Define driver config shape (brand color, accent color, typography set + type scale, density, per-category style settings, shadow — vision spec section 6). This config file **is** the driver authoring method (gap 10); a slider/picker tool is out of scope for v1.
- Write the full primitive name list (`hds/prim/*`) and spine constants (base spacing scale, base radius, shadow levels).
- Breakpoints can't be CSS custom properties (they don't work inside `@media`). Emit them as build-time values.
- Exit: primitive name list frozen and passing the naming validator. This is the contract Wave 3 builds against.

## Wave 3 — Values and mapping (parallel)

### Phase 1b — Resolver
Closes gap 1.
- Driver values → primitive scales (color ramps, spacing × density, type scale, shadow levels, radius). Decide the color-ramp algorithm (e.g. OKLCH lightness steps) here.
- Use `culori` for OKLCH math and sRGB gamut clamping rather than hand-rolling.
- Emit primitives as `--hds-prim-*` CSS custom properties.
- Exit: one driver config produces the full primitive file; changing a driver value regenerates it correctly.

### Phase 2 — Semantic tokens + Theme Map (‖ Phase 1b)
Needs only the frozen primitive **names** from Phase 1a, not resolved values.
- Build the Theme Map: default primitive-to-semantic assignment for every token in token-system-spec.md section 7 (all 9 categories). One file per category — keeps Wave 5 agents from colliding.
- Emit `--hds-sem-*` as `var(--hds-prim-*)` references, not resolved values. Makes mapping-level adjustment a one-line CSS override per client.
- Implement `data-context="on-primary"` override + nesting (including the `default` reset block), and the section color rules driver.
- Exit: full semantic token tree renders at `:root`, context override works, every Theme Map name passes the validator.

### Contrast checker (‖ Phase 1b, Phase 2)
Closes gap 8. Pulled forward from the old Phase 6 — a bad ramp algorithm should surface before components are built on it.
- Contrast check per token pair (action fg/bg, feedback fg/bg, input fg/bg, type fg on surface bg) in both `default` and `on-primary` contexts.
- Exit (joint with Phases 1b + 2): `npm test` fails on a contrast violation for the default driver config.

## Wave 4 — First vertical slice (sequential, do not delegate)

### Phase 3 — Button
Closes gap 4 for one component (Action category, checked against a real build). Sets every pattern Wave 5 copies.
- Wrap Base UI `Button` under `hds`, consuming only `hds/sem/action/*` tokens.
- Write the component convention doc: file structure, prop naming, CSS file layout, export pattern (vision spec section 7). Wave 5 agents follow it verbatim.
- Add the invariant check: build fails if any component CSS contains `--hds-prim-`.
- Package it: Vite library-mode build output a separate project can install (moved up from old Phase 9 — Phase 8 examples need it).
- Confirm the mapping-level override path works (point a semantic token at a different primitive shade without touching the component).
- Treat any friction found here as a spec bug to fix before Wave 5, not a one-off workaround.
- Exit: driver change and mapping change each theme the Button with zero component-code edits; convention doc written; package installs in a scratch project.

## Wave 5 — Components + platform examples (fan-out)

### Phase 4/5 — Core and composite components
Closes the rest of gap 4 and gap 5. Old Phases 4 and 5 merged: composites consume category **tokens**, not the Input/Card components, so both only depend on Phase 2 tokens + Phase 3 conventions.
Suggested agent groups:
- Input/Field: Input, Checkbox, Radio, Number Field, Field/Fieldset/Form.
- Surface + Overlay: Card (plain `<div>` + surface tokens — no Base UI primitive), Dialog + backdrop, Popover, Accordion panel. Dialog covers the vision spec's "modals" minimum.
- Feedback: Toast (real component — Base UI Toast has a provider/manager API), plus a plain Alert/Banner.
- Select, Combobox, Autocomplete (Trigger: Input. Popup: Surface. Options: Action).
- Menu, Context Menu, Navigation Menu, Menubar (Items: Action. Popup/panel: Surface).
- Tabs, Toggle, Toggle Group, Toolbar, Switch (Action with `selected` state).
- Data Table (implement against spec section 9 table).
- Meter, Progress (against the gap 6 decision).
- Type, Icon, Divider, Focus: token-only — confirm each needs no component-level change; Separator for Divider.
- Exit: every category from spec section 4 and every composite mapping table in section 9 has a working component that passes the same driver/mapping test as Button, the prim-grep check, and the contrast check.

### Phase 8 — Platform examples (‖ Phase 4/5)
Closes vision-spec section 8 and its success criterion. Lives in `examples/` (or a separate starter repo) — the WordPress data layer and service worker are not part of the component package.
- Headless WordPress example: pick REST vs. WPGraphQL, build the data-fetching layer, install the package.
- PWA example: service worker, manifest, basic offline support, install the package.
- Can start against Button alone; swap in more components as Wave 5 lands.
- Exit: one real WordPress site and one PWA render the same component set correctly.

## Wave 6 — Agent-facing rules

### Phase 7 — Rules doc
Closes gap 9 and vision-spec section 9. Needs the components to exist.
- Which component for which interface need.
- How to set driver values per client (documents the Phase 1a config file).
- Conventions for writing new code against the library: category selection, context mechanism, when to add vs. reuse a token (links the Phase 3 convention doc).
- Exit: someone unfamiliar with the internals can theme a new client using only the rules doc + driver config.

## Later — Versioning and deprecation
Closes gap 11. Only meaningful once a client site ships.
- Pin versions for client installs (packaging itself is done in Phase 3).
- Token change/deprecation policy for tokens already in use on client sites.
- Exit: a client project can install a pinned version and upgrade deliberately.

## Delegation

- **Wave 5 is the real fan-out.** One agent per component group above, each in its own worktree, plus one per platform example. Prerequisites: Phase 3 convention doc, Button as the reference implementation, all token additions settled in Wave 1 spec decisions. Shared files to watch: package exports, `package.json`.
- **Wave 3:** two or three agents (resolver, Theme Map, contrast) is fine once the Phase 1a name list is frozen.
- **Waves 1, 2, 4, 6:** do inline. Either small or pattern-setting — an agent starting cold costs more than it saves, and Phase 3 decisions shape everything after.

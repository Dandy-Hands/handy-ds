# Token Rework — Interview Guide

Decisions for the new `token-system-spec.md`. One decision per question. The spec is written from this file after the interview ends.

Scope: the driver list, the primitive palette shapes, and the semantic token set in eight categories (Action, Field, Surface, Content, Graphic, Feedback, Focus, Overlay). Palette color picks per use replace the fixed recipe. Current code and backwards compatibility are ignored.

Sources: vision spec sections 4–7, `driver-interface-spec.md` (including its open questions), `decisions.md` entries "Element categories (token rework)" and "Drivers-only theming", `.pi/research/*`.

## Questions

Status: `open`, `decided`, or `deferred`.

### A. Color palette (palette part)

| # | Question | Status |
|---|---|---|
| A1 | Which color scales exist, and what are their names? | decided |
| A1a | Two-anchor spacing: how slots are placed between primary and secondary. | decided |
| A1b | Slot count N. | decided |
| A1d | Default secondary hue with an odd N. | decided |
| A1c | System color picks: hue proximity equation and collision rule. | decided |
| A2 | How many stops per scale, their names, and how a driver color maps to a stop. | decided |
| A2b | Chroma of generated slots; low-chroma primary. | decided |
| A3 | How the secondary color derives from the primary color. | decided (A1, A1d) |
| A4 | How the neutral scale derives (driver-interface open question 2). | decided |
| A5 | Contrast slider: in scope or not (open question 4). | decided |
| A6 | Data-visualization palette: types (decided); count, order, stop, override (A6a, open). | decided |
| A6a | Moved to C2 (Graphic): data-viz pick defaults. | moved |
| A7 | Fixed white and black primitives. | decided |

### B. Color application (application part)

| # | Question | Status |
|---|---|---|
| B1 | Role map, and what a pick points to. | decided |
| B2 | Interaction states: picked per state, or derived from the base pick. | decided |
| B3 | Which uses get a pick driver, per category. | merged into C2 |
| B4 | Accessibility rule for the picker (open question 5). | decided |
| B5 | Surface elevation axis: levels, and what each level sets. | decided; revised in D5 (5 levels) |
| B6 | Contexts (`on-primary`) and the section driver under picks. | decided |
| B7 | Modes: dark mode in this spec or deferred (open question 6). | decided (palette part); dark pick overrides and contexts open in B |

### C. Semantic token set

| # | Question | Status |
|---|---|---|
| C1 | Naming grammar: keep `hds/sem/{category}/{type}/[axis]/[state]/{property}` or change it. | decided |
| C2 | Per-category axes, states, and properties (eight categories). | decided |
| C3 | Layout spacing tokens (old gap 13). | decided (D2) |

### D. Non-color token types (open question 1)

| # | Question | Status |
|---|---|---|
| D1 | Typography: palette shape and application. | decided |
| D2 | Measures (space, size): palette shape and application. | decided |
| D3 | Borders: palette shape and application. | decided |
| D4 | Roundness: palette shape and application. | decided |
| D5 | Shadow: palette shape and application. | decided |

### E. Other

| # | Question | Status |
|---|---|---|
| E1 | Driver-interface step order (open question 7). | decided |
| E2 | Interface location, preview, output (open question 8): in scope for this spec or not. | deferred |

## Decisions

Recorded in order as each question closes.

### A1. Palette model: two-anchor hue wheel

- The primary color and the secondary color are both driver colors. Both are anchors on the OKLCH hue circle.
- The system builds a set of harmonious ramps (slots) on the hue circle around and between the two anchors. The slot count is fixed, so the palette shape is known in advance.
- Primitive names do not carry roles. "Primary", "secondary", "danger", and similar words are not primitive scale names. (Slot naming: see A2.)
- Danger, warning, success, and info each select a slot by a hue proximity equation (A1c). The selection is a pick driver with a default.
- The data-visualization palettes derive from the full set of slots (A6).
- Neutral stays a separate low-chroma scale outside the wheel (details: A4).
- Rejected: a wheel from primary only, with secondary as a pick or a slot override.
- Known risks for later questions: a system color that lands on an anchor slot; a low-chroma primary that makes all ramps gray (chroma floor); sRGB gamut at dark stops of yellow hues.

### A1a. Slot spacing: proportional gaps

- The two anchors divide the hue circle into two arcs. N slots give N gaps.
- Each arc gets gaps in proportion to its length: `g1 = clamp(round(N × arc / 360), 1, N − 1)`, `g2 = N − g1`. Gaps are equal inside each arc.
- The secondary color is optional. If it is not set, it defaults to primary + 180°. The two arcs are then equal, and the wheel has equal spacing.
- Rejected: fixed split (half of the gaps per arc); equal wheel with a snap to secondary.
- Reference tool: https://claude.ai/artifact/Hczt1umkUmec3qcqjsvt3J (interactive comparison). The user wants to keep it as a possible theme-building tool.

### A1b. Slot count: 11

- The wheel has 11 slots (hue ramps). The average step is 32.7°. The largest system color miss is about 16°.
- Reason: each ramp has 11 lightness stops (`50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950`). The palette is a square grid of 11 hues × 11 stops.
- This also decides the stop count and stop names for A2.

### A1d. Default secondary hue: primary + 163.6°

- If no secondary color is set, the secondary hue is `primary + floor(N / 2) × 360 / N`. With N = 11, that is primary + 163.6°.
- This is the equal-wheel slot nearest to the complement. The wheel then has equal gaps of 32.7°.
- Rejected: primary + 180°. With an odd N, it gives gaps of 30° on one side and 36° on the other side.

### A1c. System color picks: nearest slot, unique among system colors

- Each system color has a fixed target hue (library constant, tunable): danger 25°, warning 70°, success 145°, info 240°.
- The default pick is the slot with the smallest circular hue distance to the target.
- No two system colors share a slot. Assignment order: danger, success, warning, info. A later color that finds its nearest slot taken gets its next-nearest free slot.
- A system color can share a slot with an anchor (primary or secondary). Example: a red brand gets a danger color on the primary slot.
- Each pick is a driver with this default. A person can override it.
- Rejected: avoid anchor slots too; pure nearest slot with no rule.

### A2. Stops and slot names

- Stops: 11 per ramp, `50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950` (from A1b).
- Which stop a use reads (for example, the action background) is a layer-2 pick with a default. The person overrides it. Layer 1 does not decide it. (User decision.)
- Layer 1 only makes sure the exact anchor color is in the palette, so a person can pick it. Default method (Claude's call, not contested): a fixed OKLCH lightness ladder, the same in every ramp. Each anchor color replaces the stop nearest to its own lightness exactly.
- Color driver input (user decision): primary and secondary accept a hex code and other CSS color formats (rgb(), hsl(), oklch(), named colors), because values are often pasted from a brand guide.
- Driver interface (user request): the 11 × 11 primitive grid is visible and updates live as drivers change. Prototype: https://claude.ai/artifact/1PycWfx6fNhyGQYVRtumNK
- Slot names (Claude's call, follows from A1): `hds/prim/color/hue-{0…10}/{stop}`. `hue-0` is the primary. Slots are numbered clockwise. The secondary slot index depends on the arc split. Neutral, white, and black are separate scales.

### A2b. Generated slot chroma: blend anchors + floor

- Chroma is relative: chroma ÷ the strongest chroma that fits sRGB at that lightness and hue.
- Each anchor ramp keeps its anchor's relative chroma on every stop.
- Each of the 9 generated slots blends relative chroma between the two anchors, by its position on its arc (`t` = 0 at primary, 1 at secondary): `rc = max(floor, rcP + (rcS − rcP) × t)`.
- The floor is a driver (user decision). Default 0.5 (from the prototype). It keeps every generated slot clearly colored, so a near-gray brand still gets usable system colors.
- If secondary is not set, it copies the primary relative chroma.
- Rejected: copy primary + floor; fixed library chroma; blend with no floor.

### A4. Neutral scale: primary tint + optional neutral color

- The neutral scale is outside the wheel. It has 11 stops on the same lightness ladder: `hds/prim/color/neutral/{stop}`.
- Default: tinted from the primary hue. A neutral tint driver sets the relative chroma (0 = pure gray). Default 0.06 (Claude's call; about the current 0.012 absolute chroma).
- An optional neutral color driver (any CSS format) replaces the hue and the tint. It lands exactly on its nearest stop, like an anchor.
- Rejected: tint drivers only; color input only; tint hue from a slot pick.

### A5. Contrast driver: in scope, global

- In scope (user decision). The contrast driver bends the shared lightness ladder: `L' = clamp(0.6 + (L − 0.6) × (1 + 0.3 × k), 0.12, 0.99)`, with `k` from −1 to +1. Default 0 = the base ladder.
- Global (Claude's call; the user did not pick a scope): one driver for all 11 slots and neutral. Every ramp keeps the same lightness per stop, so contrast at a stop is the same across hues.
- Anchors stay exact. An anchor can move to a different stop when the ladder changes.
- The formula and range are prototype values, tunable in the spec.

### B7. Dark mode: derived palette + tuning

- In scope. Dark mode is derived from the light theme, and the person can tune it.
- The system builds a dark palette with the same shape and the same names. The ladder is inverted: stop 50 is the darkest and stop 950 is the lightest. The picks stay the same, so a pick like `surface bg = neutral/50` is light in light mode and dark in dark mode. Most clients set no extra drivers for dark mode.
- Dark-only drivers:
  - Dark contrast: the A5 contrast driver, applied to the dark ladder.
  - Dark chroma: scales relative chroma down for dark mode, because saturated colors look too strong on dark grounds.
  - Optional dark override per pick. Example: keep the exact brand blue on primary actions in dark mode.
- Anchors (Claude's call): the exact anchor color is in the dark palette too, at the mirrored stop (a brand color on light stop 600 is on dark stop 400). Dark chroma does not change the anchor cell. A dark override can point to it.
- Emission (Claude's call, not discussed): a mode driver sets the page default: `light`, `dark`, or `system` (follows `prefers-color-scheme`). `data-mode` on any element overrides it for a subtree (B6). Contexts resolve in the active mode (B6).
- Deferred: other modes, such as high contrast.
- Rejected: derived with no tuning; one palette with a second set of dark picks.

### A6. Data-visualization palette types: all three

- Categorical: one distinct color per data series.
- Sequential: one hue from light to dark, for low-to-high values.
- Diverging: two hues that meet at a light neutral middle.
- Data-visualization colors are semantic tokens (Graphic category). Each one is a pick from the primitive palette (slots and neutral). There are no data-visualization primitives. (User confirmed.)
- The pick defaults (categorical count, order, stop, sequential and diverging sources, system-slot rule) are decided with the Graphic category in C2. Proposal on the table: 8 series, farthest-hue order from the primary slot, one stop pick (default 500), sequential = primary slot stops 100–900, diverging = primary → neutral 100 → farthest slot.

### A7. White and black: keep both

- `hds/prim/color/white` and `hds/prim/color/black` are fixed values, not derived from drivers. A person can pick them like any stop.
- Dark mode (resolved in B5): white and black do not invert. Surface defaults use neutral stops, so no default pick points to white. A person who picks white sets a dark override if needed.

### Section A result: the primitive color palette

- `hds/prim/color/hue-{0…10}/{50…950}`: 121 colors from the two-anchor wheel.
- `hds/prim/color/neutral/{50…950}`: 11 colors.
- `hds/prim/color/white`, `hds/prim/color/black`.
- A dark palette with the same names (B7).
- Color drivers in section A: primary, secondary (optional), floor, neutral tint, neutral color (optional), contrast, dark contrast, dark chroma. The system color picks (A1c) are application drivers.

### B1. Role map; picks point to roles

- A pick driver is the "palette color pick" of vision spec section 5. It sets which palette color one semantic token uses. It has a default, and a person can change it. A semantic token points to a primitive name, so a change to the primitive value flows through automatically.
- A role map sits between the slots and the semantic tokens. Each role points to one whole scale:
  - `primary`: locked to the primary anchor slot.
  - `secondary`: locked to the secondary anchor slot.
  - `neutral`: locked to the neutral scale.
  - `danger`, `warning`, `success`, `info`: each has a row picker in the driver interface. The default is the A1c proximity pick (unique among system colors). A person can select any other slot.
- Roles are emitted as primitive aliases: `hds/prim/color/{role}/{stop}` = the value of the mapped slot stop (for example, `--hds-prim-color-danger-600: var(--hds-prim-color-hue-3-600)`).
- Slots keep plain names in wheel order: `hds/prim/color/hue-{0…10}/{stop}`. This replaces the "anchor named" idea.
- Semantic tokens point only to role scales, white, and black. The exception is data visualization, which points to slots on purpose.
- A pick for a use selects a role and a stop (for example, primary button background = `primary/600`). The semantic-to-primitive mapping is set once. When brand colors change, the role map moves and every semantic token follows. No semantic token drifts to an unrelated hue.
- Rejected: semantic tokens that point to raw slots; a role map that exists only in the build step.

### B2. Interaction states: step offset + optional override

- A person picks the default state only (for example, primary action background = `primary/600`).
- Hover = +1 stop and active = +2 stops on the same role scale. A global state-step driver sets the offsets.
- Dark mode needs no extra rule. The dark ladder is inverted, so the same offset goes lighter.
- Disabled is not an offset. Each category has a disabled pick pair (background, foreground) from neutral.
- Any state can have an optional override pick.
- Claude's calls (not discussed): if an offset goes past stop 950 (or 50), it goes in the other direction instead. A base pick of white or black offsets onto the neutral scale (white → `neutral/50`, `neutral/100`).
- Rejected: offset with no override; a pick for every state; translucent overlay (`color-mix`) layers.

B3 (which uses get a pick) is merged into C2: the uses are the semantic tokens of each category.

### B4. Accessibility rule: WCAG 2 AA, block

- Standard: WCAG 2 contrast ratio.
- Text pairs: 4.5:1. Non-text pairs (input borders, icons, focus ring, check marks): 3:1 (WCAG 1.4.11). Disabled states are exempt.
- Behavior: the picker disables the colors that fail against the paired color. Pairs are checked in light mode and in dark mode.
- Claude's call (not discussed): derived values (B2 state offsets, dark palette) are checked too. A derived value that fails shows as an error in the interface and in the build output. The fix is an override pick.
- Rejected: warn only; AAA; APCA.

### B5. Surface elevation: 4 named levels

| Level | Used for | Default background pick | Shadow |
|---|---|---|---|
| `sunken` | wells, table stripes, input groups | `neutral/200` | none |
| `base` | the page | `neutral/100` | none |
| `raised` | cards, panels | `neutral/50` | level 1 |
| `overlay` | popovers, menus, dialogs | `neutral/50` | level 3 |

- Each level has a background pick and a border pick. The shadow comes from the shadow driver (D5).
- The `striped` state is removed. Table stripes use `sunken`.
- Surface defaults use neutral stops only, never white (user decision). The inverted dark ladder then gives dark surfaces with no extra rule. A person can still pick white.
- Default stops are Claude's call from that decision.
- Known effect: in dark mode the inverted ladder makes `raised` and `overlay` darker than `base`. Shadows and borders still separate them. A client that wants lighter cards in dark mode uses the dark override (B7).
- White and black keep pure values in both modes. They do not invert.
- Rejected: 3 levels; numbered 0–3; 5 levels; per-pick dark defaults from the library; white and black that invert in dark mode.

### B6. Contexts: modes + on-primary + on-secondary

- Mode switching: `data-mode="dark"` or `data-mode="light"` on any element switches its subtree to that palette. A dark band on a light page needs no new picks.
- Brand contexts: `on-primary` and `on-secondary`. Each one is a set of override picks for a subtree (for example, base background = `primary/600`, text = `white`). Each override pick has a default and passes the accessibility rule.
- `data-context="default"` inside another context restores the root picks (kept from the current spec).
- The section driver maps a section name to a mode or a brand context (for example, `hero → on-primary`, `footer → dark`).
- Claude's calls (not discussed): a brand context resolves in the active mode's palette, and its picks can have dark overrides like any pick. Which tokens each context overrides is decided per category in C2.
- Rejected: one brand context; `on-primary` only with no mode switching; modes only.

### C1. Naming grammar: type first

- Grammar: `hds/sem/{type}/[category]/[axis]/[state]/{property}`. Type is the first segment after `sem` (user decision).
- Reason (user): measure, elevation, and typography values are no longer specific to one element category.
- Category scope per type:
  - `color`: has a category segment (the 8 categories). Example: `hds/sem/color/action/primary/hover/bg`.
  - `measure`, `elevation`, `typography`: shared, no category segment.
  - `radius`, `border`: shared, no category segment (user decision). Reason: a category is too coarse for shape. A toggle and a button are both Action, but they can need very different radius.
- The typography type is named `typography`, not `type`, so the word "type" has one meaning: the token type (Claude's call).
- Kept: axis and state appear only where the value varies by them; property is last; context is never in the name.
- Deferred to D3/D4: how shape (radius, border) is controlled. Idea on the table (Claude): shape roles named by purpose, not category (`control`, `container`, `indicator`, `round`). Each role is a driver that picks a radius primitive step. Each component interview records which role each part uses.

### C2. Semantic color set (per category)

#### C2 Action

- Priority axis: `primary`, `secondary`, `tertiary` (user decision). The collision with the color role names `primary` and `secondary` is accepted.
- Destructive actions: a fourth priority, `danger` (user decision). The axis is `primary`, `secondary`, `tertiary`, `danger`. Its default picks come from the danger role. It has the full state set.
- States: `default`, `hover`, `active`, `disabled`, `selected`. The `focus` color state is removed from all Action parts (buttons, tabs, toggles, menu items). The Focus category draws the focus ring. (User decision.)
- `selected` defaults to the active colors. An optional override pick exists per priority.
- Properties: `bg`, `fg`, `border`.
- Picks a person sets: default `bg`/`fg`/`border` per priority (4 × 3 = 12), plus one disabled pair (`bg`, `fg`) for the category. Hover and active come from the B2 offset. The emitted tokens are the full matrix, so components read one token per cell.
- Token shape: `hds/sem/color/action/{priority}/{state}/{property}`.
- Default picks (Claude's call, tunable):

| Priority | bg | fg | border |
|---|---|---|---|
| primary | `primary/600` | `white` | `primary/600` |
| secondary | `transparent` | `primary/700` | `primary/600` |
| tertiary | `transparent` | `primary/700` | `transparent` |
| danger | `danger/600` | `white` | `danger/600` |
| disabled (all) | `neutral/100` | `neutral/400` | `neutral/100` |

- Claude's calls (not discussed): `transparent` is a valid pick value. A `transparent` base cannot take a stop offset, so its hover and active use the role scale of its `fg` pick at stops 50 and 100 (for example, tertiary hover bg = `primary/50`).

#### C2 Field

- No axis (size moved to measure). Token shape: `hds/sem/color/field/{state}/{property}`.
- States: `default`, `hover`, `focus`, `error`, `disabled`, `checked` (user accepted).
- Properties: `bg`, `fg`, `border`, `placeholder`.
- Picks (8): default `bg`, `fg`, `border`, `placeholder`; focus `border` (default `primary/600`); error `border` (default `danger/600`); checked `bg`, `fg` (checked border = checked bg). Hover border comes from the B2 offset. Disabled uses the category pair.
- Focus shows a border color change and the Focus ring.
- Other default picks (Claude's call): `bg` = `neutral/50`, `fg` = `neutral/900`, `border` = `neutral/500` (meets 3:1), `placeholder` = `neutral/600`, checked `bg` = `primary/600`, checked `fg` = `white`, disabled = `neutral/100` / `neutral/400`.

#### C2 Surface

- From B5: `hds/sem/color/surface/{level}/{bg|border}`, levels `sunken`, `base`, `raised`, `overlay`. No states.
- Shadow is not a color token any more. It moves to the `elevation` type (C1, D5).
- Border default picks (Claude's call): `neutral/200` for every level.

#### C2 Content

- Token shape: `hds/sem/color/content/{role}/[state]/fg`.
- Five emphasis roles, shared by text and icons (user accepted). Default picks are Claude's call:

| Role | Used for | Default pick |
|---|---|---|
| `strong` | headings, display text | `neutral/950` |
| `default` | body text, icons | `neutral/900` |
| `muted` | captions, helper text, secondary icons | `neutral/600` |
| `accent` | brand-colored text and icons | `primary/700` |
| `link` | inline links; `hover` state from the B2 offset | `primary/700` |

- Typography roles (heading, body, caption, and others) are part of the `typography` type, separate from these color roles.
- Rejected: link as Action; 3 roles; one color per typography role.

#### C2 Draft: full recommended color set (for user review)

Shown to the user on 2026-10-06 at their request. Graphic, Feedback, Focus, and Overlay are proposals, not decisions yet.

```
hds/sem/color/
├─ action/{primary|secondary|tertiary|danger}/{default|hover|active|disabled|selected}/{bg|fg|border}   60
├─ field/{default|hover|focus|error|disabled|checked}/{bg|fg|border|placeholder}                     24
├─ surface/{sunken|base|raised|overlay}/{bg|border}                                                   8
├─ content/{strong|default|muted|accent|link}/fg  + content/link/hover/fg                              6
├─ graphic/
│  ├─ divider/{default|strong}                                                                        2
│  ├─ categorical/{1…8}                                                                               8
│  ├─ sequential/{1…9}                                                                                9
│  └─ diverging/{1…9}                                                                                 9
├─ feedback/{danger|warning|success|info}/{bg|fg|border|icon}                                        16
├─ focus/ring                                                                                         1
└─ overlay/scrim                                                                                      1
                                                                                           total   144
```

Proposed picks for the new parts:
- Feedback: the role is fixed per sentiment. Four stop picks are shared by all sentiments: `bg` 50, `border` 200, `fg` 900, `icon` 600. Total 4 picks.
- Focus: `ring` = `primary/600`.
- Overlay: `scrim` = `black` + an opacity driver (default 0.5).

Prototype findings (2026-10-06, semantic section of https://claude.ai/artifact/1PycWfx6fNhyGQYVRtumNK). Claude's changes to the draft defaults, pending user review:
- `content/muted` default changed from `neutral/600` to `neutral/700`. `neutral/600` failed 4.5:1 on `surface/base` (4.42) and on `surface/sunken` (3.68).
- No default pick points to white, for foregrounds too (extends the B5 rule). `white` defaults became `neutral/50`. With white text, dark mode failed 63 of 144 pairs, because white does not invert but `primary/600` becomes light. With `neutral/50`, dark mode gives dark text on a light brand fill, and all 144 pairs pass in both modes.
- Brand contexts also override `surface/sunken|raised|overlay` (bg `R/800`, `R/700`, `R/700`; border `R/500`). Without this, cards inside an `on-primary` section kept light backgrounds under white text (1.07:1). Alternative: cards reset to the default context. Not decided.

#### C2 Structure check against PDS (2026-10-06)

- Reviewed the PDS token set (reference CSS files, deleted 2026-10-07): color organized by property (background, content, border, graphic, effect) and role, with `on-` pairs and sparse states. Estimated size for our set in that shape: about 81 color tokens, against 144.
- Decision (user): keep the category matrices as drafted (144 tokens, full per-category control). C1 and the 8 categories stand.
- PDS stays a reference for section D: step-named dimension tokens on one 4px grid (`space-400`, `size-1200`, `border-radius-100`, `border-width-025`), composite elevation tokens with shadow colors in the color set, and alpha variants for shadows and the scrim.
- Cards in brand sections (user decision): context surfaces. `on-primary` and `on-secondary` also override `surface/sunken|raised|overlay` (bg `R/800`, `R/700`, `R/700`; border `R/500`). A card in a hero is a darker brand panel. `data-context="default"` (B6) still resets one card to the light look.

#### C2 Close-out (2026-10-07)

- The user ended the C2 detail work: "We're going a little too far in mapping the tokens to the component. Let's just get done with the token creation."
- The draft full color set (144 tokens) stands as the C2 result, including Graphic, Feedback, Focus, and Overlay as drafted.
- All default pick values are Claude's call and tunable in the spec. This includes the prototype changes (`content/muted` = `neutral/700`; `neutral/50` in place of white defaults, so dark mode passes), categorical colors that may use system slots, and Feedback stops shared by all sentiments.
- Component part mappings are left to each component's spec interview.

### D2. Measure: one grid, step-named semantic tokens

- Primitive: `hds/prim/dimension/{step}` = step ÷ 100 × 4px × density driver. Examples: `025` = 1px, `100` = 4px, `400` = 16px.
- Semantic: two shared groups with no category segment: `hds/sem/measure/space/{step}` (padding, gaps, layout spacing) and `hds/sem/measure/size/{step}` (heights, icon and control sizes). Names are grid steps (user decision, PDS style).
- Each group exposes a curated subset of steps (Claude's call, tunable): space `050, 100, 200, 300, 400, 600, 800, 1000, 1200, 1600, 2400`; size `400, 500, 600, 800, 1000, 1200, 1600, 2400, 3200`.
- C3 (layout spacing, old gap 13) is answered: form gaps, field gaps, and table cell padding read `space` steps.
- Claude's call: density scales `space` and `size` only. Radius and border width do not change with density (D3, D4).
- Rejected: t-shirt names; purpose names.

### D4. Radius: shape roles

- Primitive: `hds/prim/radius/{step}`, fixed values that do not change with density (Claude's call, tunable): `none` 0, `050` 2px, `100` 4px, `200` 8px, `300` 12px, `400` 16px, `600` 24px, `round` 9999px.
- Semantic: `hds/sem/radius/{role}` with four shape roles (user decision): `control` (buttons, inputs, selects), `container` (cards, dialogs, popovers), `indicator` (checkboxes, small chips), `round` (toggles, switch tracks, avatars, pills).
- Each role is a driver that picks a primitive step. Default picks (Claude's call): `control` → `200`, `container` → `300`, `indicator` → `100`, `round` → `round`.
- Each component interview assigns a role to each part. A toggle and a button can differ even though both are Action. A client gets pill buttons by setting `control` → `round`.
- Rejected: step scale with a base-radius driver (PDS); roles plus the step scale.

### D3. Border width: roles like radius

- Primitive: `hds/prim/border/{none|025|050|100}` = 0, 1px, 2px, 4px. Fixed; density does not change them.
- Semantic: `hds/sem/border/{role}` with four roles (user decision): `control` (inputs, outlined buttons), `container` (cards, dialogs, popovers), `divider` (separators, table lines), `focus` (focus ring width).
- Each role is a driver that picks a width. Default picks (Claude's call): `control` → `025`, `container` → `025`, `divider` → `025`, `focus` → `050`. A client can turn off card borders with `container` → `none`.
- No border-style token (solid only), as before.
- Rejected: roles plus a style driver; a step scale.

### D5. Elevation; B5 revised to 5 levels

- One level axis is shared by surface color and elevation (user decision). Order from the user: −1 sunken, 0 page, 1 card, 2 popovers, 3 modal. Token names use words, not numbers, because `elevation--1` reads badly:

| Level | Used for | Surface tokens | Elevation token |
|---|---|---|---|
| `sunken` | wells, table stripes, input groups | yes | none |
| `base` | the page | yes | none |
| `raised` | cards, panels | yes | `elevation/raised` |
| `floating` | menus, popovers, dropdowns, tooltips | yes | `elevation/floating` |
| `modal` | dialogs, drawers | yes | `elevation/modal` |

- This revises B5: `surface/{sunken|base|raised|floating|modal}/{bg|border}`. The old surface level `overlay` is gone, so "overlay" now means only the Overlay category (the scrim). The color set grows from 144 to 146 tokens.
- The scrim belongs to the modal level. It sits between the page and the modal surface. It stays in the Overlay category.
- Primitive (PDS style): `hds/prim/shadow/{level}/{umbra|penumbra|ambient}/{x|y|blur|spread}` for the three shadow levels. Fixed geometry (Claude's call, tunable).
- Shadow color: `black` with alpha from a shadow-strength driver (0 = flat). Black is pure in both modes; `neutral/950` would turn light in the dark palette.
- Semantic: `hds/sem/elevation/{raised|floating|modal}`, each one composite `box-shadow` value (three layers).
- Default surface picks for the new levels (Claude's call): `floating` and `modal` bg = `neutral/50`. Brand contexts override `floating` and `modal` like `raised` (`R/700`).
- Rejected: numbers in token names (−1…3 or 0–4); component-flavored names (`page`, `card`, `popover`).

### D1. Typography: 5 roles × 3 sizes

- Primitives (palette part, from drivers): `hds/prim/typography/family/{heading|body|mono}` (family drivers); `typography/scale/{step}` = base size driver × ratio driver^(step − 3), step 3 = body size, in rem; fixed scales `typography/weight/{regular|medium|semibold|bold}`, `typography/leading/{tight|snug|normal|relaxed}`, `typography/tracking/{tight|normal|wide}`.
- Semantic (application part): `hds/sem/typography/{role}/{size}/{property}` (user decision).
  - Roles: `display`, `heading`, `body`, `label`, `caption`.
  - Sizes: `sm`, `md`, `lg`.
  - Properties: `family`, `size`, `weight`, `leading`, `tracking`.
  - 15 text styles, 75 tokens.
- Each property of each text style is a pick with a default (Claude's call, tunable). Example defaults: display → heading family, bold, tight; body → body family, regular, normal leading; `md` sizes: display 7, heading 5, body 3, label 3, caption 2 (scale steps).
- The mono family is restored for code text.
- Text color is not part of typography. It comes from the Content color roles (C2).
- Rejected: one size per role; step scale only; Material-style role names.

### E1. Driver-interface step order

1. Brand colors: primary, secondary, neutral, floor, contrast, dark tuning. The live 11 × 11 grid shows the result.
2. Role map: danger, warning, success, info rows.
3. Color application: picks per category, contexts, dark overrides.
4. Typography.
5. Measure (density).
6. Radius (shape roles).
7. Border (width roles).
8. Elevation (shadow strength).

Each step uses only what earlier steps produce (user accepted).

### E2. Location, preview, output: deferred

Not part of the token spec. It stays an open question in `driver-interface-spec.md`.

## Interview complete (2026-10-07)

# Client Design System — Token System Spec

**Status:** rewritten 2026-10-07 from the token rework interview (`.claude/specs/token-rework-interview.md`). The interview guide holds the reasoning and the rejected options for each decision. `src/tokens/` implements this spec (2026-10-07).

Values marked *tunable* are defaults chosen by Claude. They can change without a new interview. Everything else is a decision.

## 1. Layers

```
Drivers → Primitives → Semantic Tokens → Components
            (palette part)  (application part)
```

- **Drivers.** The only inputs a client sets. Every driver has a default, so a client sets only the drivers that matter. There is no mapping level and no second level of control.
- **Primitives.** Value sets generated from drivers: the color palette, the dimension grid, radius and border steps, shadows, and type scales. The shape of each set is fixed. Only the values change. Components never read primitives.
- **Semantic tokens.** Named values that point at primitives. Components read semantic tokens only, as CSS custom properties.
- **Components.** A full theme change requires no change to component code.

Each token type has two parts in the driver interface (`theme-customization-spec.md`):

1. **Palette part.** Drivers that shape the primitives.
2. **Application part.** **Pick drivers** that choose which primitive each semantic token uses.

### Pick drivers

A pick driver sets which primitive one semantic token reads. Example: the background of a primary action = `primary/600`. Each pick has a library default. A person overrides it in the driver interface.

A pick stores a reference, not a value. When a driver changes a primitive value, every semantic token that points at it follows.

The pick defaults and the rules that derive states from picks are library code. A client does not change them. If a client needs a result that drivers cannot produce, the team adds or extends a driver for every client.

---

## 2. Naming

Namespace: `hds`. Token names use slash form (`hds/sem/color/action/primary/hover/bg`). CSS custom properties replace `/` with `-` (`--hds-sem-color-action-primary-hover-bg`).

**Primitives:**

```
hds/prim/{type}/{scale}/[{step}]
```

**Semantic tokens:**

```
hds/sem/{type}/[category]/[axis]/[state]/{property}
```

- `type` is always the first segment after `sem`: `color`, `measure`, `radius`, `border`, `elevation`, `typography`, `motion` (added 2026-10-28).
- `category` is present for `color` only. The other types are shared across categories.
- `axis` and `state` are present only where the value varies by them.
- `property` is last. Exception: the typography font size step, `typography/{role}/size/{sm|md|lg}`, puts the step after the property, so the value of Text's `size` prop is the last segment (section 7.7).
- Context and mode are never part of a token name (section 6).

The typography token type is named `typography`, so the word "type" always means the token type.

---

## 3. Drivers

The complete driver list. Section 4 defines how the palette drivers build primitives. Section 5 defines the pick rules.

### 3.1 Color palette part

| Driver | Input | Default | Effect |
|---|---|---|---|
| `color.primary` | any CSS color (hex, `rgb()`, `hsl()`, `oklch()`, named) | required | Anchor 1 of the hue wheel (4.1). |
| `color.secondary` | any CSS color, optional | hue = primary + `floor(N / 2) × 360 / N` (163.6°) | Anchor 2 of the hue wheel. |
| `color.floor` | 0–1 | 0.5 *tunable* | Lowest relative chroma of the 9 generated slots. |
| `color.neutralTint` | 0–0.3 | 0.06 *tunable* | Relative chroma of the neutral scale, at the primary hue. |
| `color.neutral` | any CSS color, optional | none | Replaces the neutral hue and tint. Lands exactly on its stop. |
| `color.contrast` | −1 to +1 | 0 | Bends the light lightness ladder. |
| `color.darkContrast` | −1 to +1 | 0 | Bends the dark lightness ladder. |
| `color.darkChroma` | 0.4–1 | 0.85 *tunable* | Scales relative chroma in the dark palette. |

### 3.2 Color application part

| Driver | Input | Default |
|---|---|---|
| `roles.danger`, `roles.warning`, `roles.success`, `roles.info` | a slot (`hue-0` to `hue-10`) | proximity pick (4.1.4) |
| `picks.{token}` (`{token}` = a color token without `hds/sem/color/`) | a pick value (5.1), or `{ light, dark }` to add a dark override (5.3) | section 7 tables |
| `picks.action/disabled/{bg,fg}` | a pick value: the Action disabled pair for every priority | `neutral/100`, `neutral/400` |
| `states.step` | hover and active offsets in stops | hover 1, active 2 |
| `contexts.on-primary.{token}`, `contexts.on-secondary.{token}` | a pick value, or `{ light, dark }` | section 6.3 |
| `overlay.opacity` | 0–1 | 0.5 *tunable* |
| `mode` | `light`, `dark`, `system` | `light` *tunable* |
| `sections.{name}` | a mode or a brand context | none |

### 3.3 Other types

| Driver | Input | Default |
|---|---|---|
| `typography.family.heading`, `.body`, `.mono` | CSS font stack | *tunable* system stacks |
| `typography.baseSize` | px | 16 |
| `typography.ratio` | number | 1.25 |
| `typography.styles.{role}.{family\|weight\|leading\|tracking}` | a typography pick (7.7) | section 7.7 |
| `typography.styles.{role}.size.{sm\|md\|lg}` | a type scale step, 1–9 | `md` per section 7.7; `sm` and `lg` one step down and up |
| `density` | number, multiplies the grid | 1 |
| `layout.contentWidth` | number, px. The maximum width of page content | 1152 |
| `layout.contentWidthNarrow` | number, px. The maximum width for reading text. Not wider than `contentWidth` | 768 |
| `radius.control`, `.container`, `.indicator`, `.round` | a radius step | `200`, `300`, `100`, `round` *tunable* |
| `border.control`, `.container`, `.divider`, `.focus` | a border step | `025`, `025`, `025`, `050` *tunable* |
| `shadow.strength` | number, 0 = flat | 1 |
| `motion.duration` | number, multiplies every motion duration. 0 = no motion, 2 = twice as slow | 1 |

### 3.4 Config metadata

A driver config can hold a `meta` key: `{ client, version }`. `client` is the client name. `version` is the handy-ds version the theme was built with. `meta` is not a driver and makes no tokens. `buildTheme()` ignores it. The `hds-theme` CLI prints a warning when `meta.version` differs from the installed version (`theme-customization-spec.md` section 5).

---

## 4. Primitives

### 4.1 Color

#### 4.1.1 Hue wheel

The palette has 11 hue ramps (slots) on the OKLCH hue circle, plus neutral, white, and black.

1. The primary and the secondary are anchors. Each anchor slot uses the exact anchor hue.
2. The two anchors cut the circle into two arcs. The 11 slots give 11 gaps.
3. Each arc gets gaps in proportion to its length:
   - `g1 = clamp(round(11 × arc / 360), 1, 10)`, where `arc` is the clockwise distance from primary to secondary.
   - `g2 = 11 − g1`.
4. The gaps are equal inside each arc.
5. Slots are numbered clockwise from the primary: `hue-0` is the primary, and `hue-{g1}` is the secondary.

If `color.secondary` is not set, the secondary hue is primary + 163.6°. The wheel then has 11 equal gaps of 32.7°.

#### 4.1.2 Stops and lightness

Each ramp has 11 stops: `50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950`.

- Every ramp uses the same OKLCH lightness ladder, so a stop has the same contrast in every hue.
- Base ladder *tunable*: `0.975, 0.94, 0.88, 0.80, 0.71, 0.62, 0.53, 0.45, 0.38, 0.30, 0.23`.
- `color.contrast` (k) bends the ladder: `L' = clamp(0.6 + (L − 0.6) × (1 + 0.3 × k), 0.12, 0.99)`. The formula is *tunable*.
- Each anchor color replaces the stop nearest to its own lightness, exactly. The exact brand color is always in the palette. The anchor can move to a different stop when the ladder changes.

#### 4.1.3 Chroma

Chroma is relative: the chroma ÷ the strongest chroma that fits sRGB at that lightness and hue.

- Each anchor ramp keeps its anchor's relative chroma on every stop.
- Each of the 9 generated slots blends between the anchors by its position on its arc (`t` = 0 at primary, 1 at secondary): `rc = max(floor, rcP + (rcS − rcP) × t)`.
- If `color.secondary` is not set, the secondary copies the primary relative chroma.
- The floor keeps every generated slot clearly colored, so a near-gray brand still gets usable system colors.

#### 4.1.4 Role map

A role map gives meaning to slots. Each role points at one whole scale.

| Role | Scale | Set by |
|---|---|---|
| `primary` | the primary anchor slot | locked |
| `secondary` | the secondary anchor slot | locked |
| `neutral` | the neutral scale | locked |
| `danger`, `warning`, `success`, `info` | one slot each | `roles.*` driver |

Default for the system roles (proximity pick):

1. Each role has a target hue *tunable*: danger 25°, warning 70°, success 145°, info 240°.
2. The default is the slot with the smallest circular hue distance to the target.
3. No two system roles share a slot. Assignment order: danger, success, warning, info. A later role takes its next-nearest free slot.
4. A system role can share a slot with an anchor. Example: a red brand gets a danger color on the primary slot.

#### 4.1.5 Neutral, white, black

- **Neutral:** 11 stops on the same ladder, at the primary hue with relative chroma `color.neutralTint`. If `color.neutral` is set, its hue and relative chroma replace the tint, and the color lands exactly on its nearest stop.
- **White and black:** fixed values. They are not derived from drivers. They do not invert in dark mode.

#### 4.1.6 Dark palette

The dark palette has the same shape and the same names.

- The ladder is inverted: stop 50 is the darkest and stop 950 is the lightest.
- `color.darkContrast` bends the dark ladder with the same formula.
- `color.darkChroma` multiplies the relative chroma of every cell except the anchor cells.
- The exact anchor colors are in the dark palette too, at their nearest dark stop.

Picks stay the same in both modes. A pick of `neutral/50` is light in light mode and dark in dark mode.

#### 4.1.7 Color primitive names

```
hds/prim/color/hue-{0…10}/{50…950}     121 slot colors
hds/prim/color/neutral/{50…950}        11
hds/prim/color/white
hds/prim/color/black
hds/prim/color/{role}/{50…950}         role aliases
```

Role aliases point at slot values: `--hds-prim-color-danger-600: var(--hds-prim-color-hue-3-600)`. Semantic tokens point at role aliases, white, and black, never at slots. The exception is data visualization (7.4.2), which points at slots on purpose. Because of the role map, no semantic token drifts to an unrelated hue when the brand colors change.

### 4.2 Dimension

```
hds/prim/dimension/{step}  =  step ÷ 100 × 4px × density
```

Steps *tunable*: `025, 050, 100, 200, 300, 400, 500, 600, 800, 1000, 1200, 1600, 2400, 3200, 6400, 8000, 9600, 12800`. Examples at density 1: `025` = 1px, `100` = 4px, `400` = 16px, `8000` = 320px. The steps `6400` to `12800` (256 to 512px) are component widths (7.5).

### 4.2.1 Page width

```
hds/prim/width/content          =  layout.contentWidth (px)
hds/prim/width/content-narrow   =  layout.contentWidthNarrow (px)
```

Page widths are drivers, so a client sets them. Density does not scale them: a page width must not change when the spacing grid changes (decided 2026-10-20).

### 4.3 Radius

```
hds/prim/radius/{none|050|100|200|300|400|600|round}
```

Fixed values *tunable*: 0, 2, 4, 8, 12, 16, 24px, 9999px. Density does not change them.

### 4.4 Border

```
hds/prim/border/{none|025|050|100}
```

Fixed values: 0, 1, 2, 4px. Density does not change them. Solid only; there is no border-style token.

### 4.5 Shadow

```
hds/prim/shadow/{raised|floating|modal}/{umbra|penumbra|ambient}/{x|y|blur|spread}
```

- Each level has three layers. The geometry is fixed *tunable*, in px as `x y blur spread`:

  | Level | umbra | penumbra | ambient |
  |---|---|---|---|
  | `raised` | 0 1 2 0 | 0 2 4 0 | 0 0 1 0 |
  | `floating` | 0 4 8 −2 | 0 8 16 0 | 0 0 2 0 |
  | `modal` | 0 12 24 −4 | 0 24 48 0 | 0 0 4 0 |

- Layer alphas *tunable*: umbra 0.14, penumbra 0.10, ambient 0.08.
- The color of each layer is `black` with an alpha *tunable* per layer × `shadow.strength`. At strength 0 every shadow is `none`.
- Black is pure in both modes. A neutral shadow color would turn light in the dark palette.

### 4.6 Typography

```
hds/prim/typography/family/{heading|body|mono}
hds/prim/typography/scale/{1…9}          baseSize × ratio^(step − 3), in rem; step 3 = body size
hds/prim/typography/weight/{regular|medium|semibold|bold}      400, 500, 600, 700
hds/prim/typography/leading/{tight|snug|normal|relaxed}        1.1, 1.25, 1.5, 1.65
hds/prim/typography/tracking/{tight|normal|wide}               −0.02em, 0, 0.02em
```

The families come from the family drivers. Weight, leading, and tracking are fixed *tunable*.

Breakpoints are build-time values, not tokens, because CSS custom properties do not work inside `@media`.

### 4.7 Motion

```
hds/prim/motion/duration/{100|150|200|300|500|800}   step in ms × motion.duration
hds/prim/motion/easing/{standard|decelerate}
```

- Duration steps *tunable*. The step name is the length in ms at `motion.duration` 1. Example: `300` = 300ms, or 600ms at `motion.duration` 2.
- Easing values are fixed *tunable*: `standard` = `cubic-bezier(0.2, 0, 0, 1)`, `decelerate` = `cubic-bezier(0.32, 0.72, 0, 1)`.
- Under `prefers-reduced-motion: reduce`, every duration primitive is `0ms`. The theme emits this rule. Components need no reduced-motion rule for token-driven motion.

---

## 5. Pick rules

### 5.1 Pick values

A color pick is one of:

- `{role}/{stop}`: for example `primary/600`, `neutral/50`, `danger/700`.
- `white` or `black`.
- `transparent`.
- `hue-{n}/{stop}`: data-visualization picks only.

### 5.2 Interaction states

A person picks the default state only. The other states derive from it:

- **Hover** = the default pick + `states.step.hover` stops (default 1) on the same scale.
- **Active** = + `states.step.active` stops (default 2).
- **Selected** = the active colors, unless the category has a selected override.
- **Disabled** = the category's disabled pick pair (from neutral). It is not an offset.

Edge rules:

1. An offset that goes past stop 950 goes the other direction instead.
2. A base pick of `white` offsets onto neutral (`neutral/50`, then `neutral/100`). A base pick of `black` offsets onto `neutral/950`, then `neutral/900`.
3. A `transparent` base offsets onto the role scale of its paired foreground pick, at stops 50 and 100. Inside a brand context it offsets onto the context role at stops 700 and 800.

In dark mode the same offsets go lighter, because the dark ladder is inverted. Every derived state can have an optional override pick.

### 5.3 Dark overrides

Any pick can have an optional dark value: `picks: { "{token}": { light, dark } }`. Without it, dark mode resolves the light pick against the dark palette. Default picks never point at white, so dark mode works with no overrides. A person who picks white sets a dark override where contrast needs it.

### 5.4 Accessibility rule

- Standard: WCAG 2 contrast ratio.
- Text pairs: 4.5:1. Non-text pairs (field borders, icons, focus ring, check marks): 3:1 (WCAG 1.4.11). Disabled states are exempt.
- A filled Action background (the default state) needs 3:1 against the `base`, `raised`, `floating`, and `modal` surfaces (WCAG 1.4.11). `sunken` is not checked. A `transparent` background is exempt.
- The driver interface disables the colors that fail against the paired color.
- Pairs are checked in light mode, in dark mode, and in each brand context.
- Derived values (state offsets, the dark palette) are checked too. A derived value that fails is an error in the interface and in the build output. The fix is an override pick.
- A `transparent` background is checked against the surface behind it.
- Media scrim: the image is client content, so the checker tests the worst case, a dark scrim over a white image and a light scrim over a black image, against `content/default/fg` of the matching mode. `strong` needs 4.5:1. `medium` needs 3:1 (large text). `subtle` is decorative and is not checked.

---

## 6. Modes and contexts

### 6.1 Modes

- The `mode` driver sets the page default: `light`, `dark`, or `system` (follows `prefers-color-scheme`).
- `data-mode="dark"` or `data-mode="light"` on any element switches its subtree to that palette. A dark band on a light page needs no new picks.
- A mode element re-declares every color token with the root picks, so it resets any brand context above it. Put `data-context` inside a mode element, not around it.
- Known limit: a dark override inside a brand context is scoped by descendant selectors (`[data-mode="dark"] [data-context="on-primary"]`). A light subtree nested inside a dark one still matches those rules.

### 6.2 Contexts

- Tokens are set at `:root`.
- `data-context="on-primary"` or `data-context="on-secondary"` on an element redefines a subset of semantic tokens for its subtree. Children inherit the redefined values.
- Contexts nest. `data-context="default"` inside another context restores the root picks.
- Only the tokens that a context changes are redefined in its block.
- A brand context resolves in the active mode's palette. Its picks can have dark overrides like any pick.
- The section driver maps a section name to a mode or a brand context, for example `sections: { hero: 'on-primary', footer: 'dark' }`. Page code writes `data-section="hero"`.

### 6.3 Brand context overrides

`R` is the context role (`primary` or `secondary`). Default picks *tunable*:

| Tokens | Pick |
|---|---|
| `surface/base/bg` | `R/600` |
| `surface/sunken/bg` | `R/800` |
| `surface/{raised,floating,modal}/bg` | `R/700` |
| `surface/*/border` | `R/500` |
| `content/{strong,default,accent,link}/fg` | `neutral/50` |
| `content/muted/fg`, `content/link/hover/fg` | `R/50` (`R/100` failed 4.5:1 on `R/600` for most generated hues) |
| `action/primary` (default) | bg `neutral/50`, fg `R/700`, border `neutral/50` |
| `action/secondary` (default) | bg `transparent`, fg `neutral/50`, border `neutral/50` |
| `action/tertiary` (default) | bg `transparent`, fg `neutral/50`, border `transparent` |
| `action/danger` (default) | bg `neutral/50`, fg `danger/700`, border `neutral/50` (`danger/600` was 1.1:1 on `R/600`) |
| `graphic/divider/default`, `/strong` | `R/400`, `R/300` |
| `focus/ring` | `neutral/50` |

Cards in a brand section are darker brand panels. `data-context="default"` on a card restores the light look.

---

## 7. Semantic Token Set

### 7.1 Categories

The `color` type has eight element categories:

| Category | Holds | Axis | States |
|---|---|---|---|
| Action | buttons, triggers, toggles, tabs, menu items | priority: `primary`, `secondary`, `tertiary`, `danger` | `default`, `hover`, `active`, `disabled`, `selected` |
| Field | text inputs, selects, checkboxes, radios | none | `default`, `hover`, `focus`, `error`, `disabled`, `checked` |
| Surface | the page, wells, cards, popovers, dialogs | level: `sunken`, `base`, `raised`, `floating`, `modal` | none |
| Content | text and icons: the foreground on a surface | role: `strong`, `default`, `muted`, `accent`, `link` | `hover` (link only) |
| Graphic | dividers and data visualization | group: `divider`, `categorical`, `sequential`, `diverging` | none |
| Feedback | alerts, toasts | sentiment: `danger`, `warning`, `success`, `info` | none |
| Focus | the focus ring, on every interactive part | none | none |
| Overlay | the modal scrim | none | none |

Notes:

- The Action priority names `primary` and `secondary` also exist as color role names. The collision is accepted.
- Action has no `focus` color state. The Focus category draws the ring.
- Field keeps a `focus` state: a focused field changes its border color and shows the Focus ring.

### 7.2 Color tokens

```
hds/sem/color/
├─ action/{primary|secondary|tertiary|danger}/{default|hover|active|disabled|selected}/{bg|fg|border}  60
├─ field/{default|hover|focus|error|disabled|checked}/{bg|fg|border|placeholder}                    24
├─ surface/{sunken|base|raised|floating|modal}/{bg|border}                                          10
├─ content/{strong|default|muted|accent|link}/fg  +  content/link/hover/fg                            6
├─ graphic/divider/{default|strong}                                                                  2
├─ graphic/categorical/{1…8}                                                                         8
├─ graphic/sequential/{1…9}                                                                          9
├─ graphic/diverging/{1…9}                                                                           9
├─ feedback/{danger|warning|success|info}/{bg|fg|border|icon}                                       16
├─ focus/ring                                                                                        1
├─ overlay/scrim                                                                                     1
└─ overlay/media/{dark|light}/{subtle|medium|strong}                                                 6
                                                                                          total  152
```

Every token in a matrix is emitted. Components read one token per cell and need no `var()` fallbacks.

### 7.3 Color picks and defaults

All default picks are *tunable*.

**Action.** A person sets the default state of each priority and one disabled pair. Hover, active, and selected derive by 5.2. `selected` has an optional override per priority.

| Priority | bg | fg | border |
|---|---|---|---|
| `primary` | `primary/600` | `neutral/50` | `primary/600` |
| `secondary` | `transparent` | `primary/700` | `primary/600` |
| `tertiary` | `transparent` | `primary/700` | `transparent` |
| `danger` | `danger/600` | `neutral/50` | `danger/600` |
| disabled (all priorities) | `neutral/100` | `neutral/400` | `neutral/100` |

**Field.** Eight picks. Hover border derives by 5.2. Disabled uses the pair `neutral/100` / `neutral/400`. The checked border equals the checked bg.

| Pick | Default |
|---|---|
| `bg` | `neutral/50` |
| `fg` | `neutral/900` |
| `border` | `neutral/500` |
| `placeholder` | `neutral/600` |
| focus `border` | `primary/600` |
| error `border` | `danger/600` |
| checked `bg` | `primary/600` |
| checked `fg` | `neutral/50` |

**Surface.** One bg pick and one border pick per level. Default picks use neutral stops only, never white, so the inverted dark ladder gives dark surfaces with no extra rule.

| Level | Used for | bg | border |
|---|---|---|---|
| `sunken` | wells, table stripes, input groups | `neutral/200` | `neutral/200` |
| `base` | the page | `neutral/100` | `neutral/200` |
| `raised` | cards, panels | `neutral/50` | `neutral/200` |
| `floating` | menus, popovers, dropdowns, tooltips | `neutral/50` | `neutral/200` |
| `modal` | dialogs, drawers | `neutral/50` | `neutral/200` |

In dark mode the inverted ladder makes `raised`, `floating`, and `modal` darker than `base`. Shadows and borders still separate them. A client that wants lighter cards in dark mode sets dark overrides.

**Content.** One pick per role, shared by text and icons.

| Role | Used for | Default |
|---|---|---|
| `strong` | headings, display text | `neutral/950` |
| `default` | body text, icons | `neutral/900` |
| `muted` | captions, helper text, secondary icons | `neutral/700` |
| `accent` | brand-colored text and icons | `primary/700` |
| `link` | inline links (hover derives by 5.2) | `primary/700` |

**Graphic.** Dividers: `default` = `neutral/200`, `strong` = `neutral/400`. Data visualization: 7.4.

**Feedback.** The role is fixed per sentiment. Four stop picks are shared by all sentiments: `bg` 50, `border` 200, `fg` 900, `icon` 600. Example: `feedback/warning/fg` = `warning/900`.

**Focus.** `ring` = `primary/600`. Ring width: `border/focus` (7.5).

**Overlay.** `scrim` = `black` at `overlay.opacity`. The scrim belongs to the modal level: it sits between the page and a `modal` surface.

`media/{tone}/{strength}` is the scrim over a Section image or video (decided 2026-10-20). `dark` is black, `light` is white. Alpha: `subtle` 0.2, `medium` 0.5, `strong` 0.6. The alphas are fixed in `src/tokens/theme.ts` (`MEDIA_ALPHA`), not drivers and not picks. A Section with a `dark` scrim sets `data-mode="dark"` and a `light` scrim sets `data-mode="light"`, so the text inside is light on a dark scrim and dark on a light scrim.

### 7.4 Data visualization

Data-visualization colors are semantic tokens in the Graphic category. Each one is a pick from the primitive palette. There are no data-visualization primitives.

#### 7.4.1 Types

- **Categorical** (`graphic/categorical/{1…8}`): one distinct color per data series.
- **Sequential** (`graphic/sequential/{1…9}`): one hue from light to dark, for low-to-high values.
- **Diverging** (`graphic/diverging/{1…9}`): two hues that meet at a light neutral middle.

#### 7.4.2 Default picks

All *tunable*:

- **Categorical.** Series 1 is `hue-0` (the primary slot). Each next series is the slot farthest in hue from every slot already chosen. All series use one stop pick (default 500). Categorical colors may use slots that system roles also use. Each series has an optional override pick.
- **Sequential.** One scale pick (default `primary`) at stops 100–900.
- **Diverging.** Two slot picks (default: `hue-0` and the slot farthest from it). Order: first slot 900, 700, 500, 300; `neutral/100`; second slot 300, 500, 700, 900.

### 7.5 Measure, radius, border

```
hds/sem/measure/space/{step}     padding, gaps, layout spacing
hds/sem/measure/size/{step}      heights, icon and control sizes
hds/sem/measure/width/{step}     component widths: minimum tile and column width, Aside width
hds/sem/measure/width/content    maximum width of page content (Section)
hds/sem/measure/width/content-narrow   maximum width for reading text (Section)
hds/sem/radius/{role}
hds/sem/border/{role}
```

**Measure.** Each token points at the dimension primitive with the same step. Names are grid steps. Each group exposes a subset *tunable*:

- `space`: `050, 100, 200, 300, 400, 600, 800, 1000, 1200, 1600, 2400`.
- `size`: `200, 300, 400, 500, 600, 800, 1000, 1200, 1600, 2400, 3200`.
- `width`: `6400, 8000, 9600, 12800`, 256 to 512px at density 1 (point at the dimension primitive with the same step), and the two named page widths `content` and `content-narrow` (point at the width primitives, driven by `layout.contentWidth` and `layout.contentWidthNarrow`). `size` stops at 128px, too small for a width.

Form gaps, field gaps, and table cell padding read `space` steps.

**Radius.** Four shape roles. Each role is a driver that picks a radius step (3.3).

| Role | Used for |
|---|---|
| `control` | buttons, inputs, selects |
| `container` | cards, dialogs, popovers |
| `indicator` | checkboxes, small chips |
| `round` | toggles, switch tracks, avatars, pills |

Radius is not tied to a color category. A toggle and a button are both Action, but each component spec assigns a shape role to each part. A client gets pill buttons by setting `radius.control` to `round`.

**Border.** Four width roles. Each role is a driver that picks a border step (3.3).

| Role | Used for |
|---|---|
| `control` | inputs, outlined buttons |
| `container` | cards, dialogs, popovers |
| `divider` | separators, table lines |
| `focus` | the focus ring width |

### 7.6 Elevation

```
hds/sem/elevation/{raised|floating|modal}
```

Each token is one composite `box-shadow` value with three layers (4.5). The elevation levels share their names with the surface levels. `sunken` and `base` have no shadow.

### 7.7 Typography

```
hds/sem/typography/{role}/{family|weight|leading|tracking}
hds/sem/typography/{role}/size/{sm|md|lg}
```

- Roles: `display`, `headline`, `body`, `label`, `caption`.
- Sizes: `sm`, `md`, `lg`. Only the font size changes by size step. Family, weight, leading, and tracking belong to the role.
- Leading is unitless and tracking is in `em`, so both follow the font size of each step.
- 5 roles × 4 role properties + 5 roles × 3 sizes = 35 tokens.
- Each token is a pick with a default. The family pick is `heading`, `body`, or `mono`. Each size pick is a scale step. Weight, leading, and tracking picks are steps on their scales.

Default picks *tunable*. The `sm` and `lg` sizes default to one scale step below and above `md`.

| Role | Family | `md` scale step | Weight | Leading | Tracking |
|---|---|---|---|---|---|
| `display` | heading | 7 | bold | tight | tight |
| `headline` | heading | 5 | bold | snug | normal |
| `body` | body | 3 | regular | normal | normal |
| `label` | body | 3 | medium | snug | normal |
| `caption` | body | 2 | regular | normal | normal |

Text color is not part of typography. It comes from the Content color roles.

### 7.9 Motion

```
hds/sem/motion/{role}/{duration|easing}
hds/sem/motion/enter/stagger
```

Added 2026-10-28 (Animate spec, `docs/component-specs/animate/`). Each token points at a fixed primitive *tunable*. There are no pick drivers. The only motion driver is `motion.duration` (3.3).

| Role | Used for | duration | easing |
|---|---|---|---|
| `enter` | page content that enters (Animate) | `500` | `decelerate` |
| `control` | small state changes: a chevron turn, a popup fade, an indicator move | `150` | `standard` |
| `container` | panels that move or change size: a drawer slide, a menu viewport resize | `300` | `decelerate` |

`enter/stagger` = `100`: the delay between staggered children.

The roles `control` and `container` match the radius and border roles. A component transition reads the role of the part that moves. Exception: an indicator that loops (the Button spinner) keeps a literal duration, because a duration of 0 does not stop a loop. Its own reduced-motion rule stops it.

### 7.8 Token count

| Type | Tokens |
|---|---|
| color | 152 |
| measure | 28 |
| radius | 4 |
| border | 4 |
| elevation | 3 |
| typography | 35 |
| motion | 7 |
| **total** | **233** |

---

## 8. Component mapping

Each component's spec interview records which semantic tokens its parts read: color category and axis values, measure steps, radius and border roles, elevation level, and typography style. This spec does not fix part-level mappings. The composite tables of the previous spec (Data Table, Select, Tabs, Switch, Meter, and others) are withdrawn. The component interviews replace them.

---

## 9. Not Done Yet

1. Token change and deprecation plan for tokens in use on client sites (carried over).
2. Other modes, such as high contrast.
3. Driver interface: closed in `theme-customization-spec.md` (interview of 2026-10-08), except high contrast (item 2).
4. Field error text color. It is not a Field token. A component interview decides between `feedback/danger/fg` and a new Content role, and the contrast rule must cover brand contexts.
5. Component CSS reads the new token names through a provisional mapping (old category tokens to the closest new token). Each component re-interview confirms its mapping.

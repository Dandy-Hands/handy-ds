# Current Token Structures — Sketch

Snapshot of the token system as specced (`.claude/specs/token-system-spec.md`) and implemented (`src/tokens/`). Sketch for theming rework; not a spec.

## 1. Pipeline

```
Drivers → Primitives → Theme Map → Semantic Tokens → Components
```

- **Drivers** — hand-set inputs from the client config (`ThemeConfig`). Color choices, density, radius, typography, shadows.
- **Primitives** — generated at build time from drivers. Fixed namespace of slots, values change. Components never read them.
- **Theme Map** — the rule set that maps each semantic token to a primitive (reads the per-category style choices, e.g. `action.radius: lg` → `hds/prim/radius/lg`).
- **Semantic tokens** — emitted as CSS custom properties at `:root`. Named by purpose. The only thing components read.
- **Components** — read semantic tokens via CSS custom properties. Zero changes on a full theme swap.

## 2. Namespaces

```
hds/prim/{type}/{property}
hds/sem/{category}/{type}/[axis]/[state]/{property}
```

- Primitives have no category segment.
- Semantic: `category` + `type` always present; `axis`/`state` only where the value varies; `property` last (bg, fg, border, padding-x, radius…).
- Context is never part of the token name (see §5).

## 3. Primitive Sets (the "palettes")

Every type is a frozen shape with driver-derived values — the shape known up front:

| Type | Slots | Derived from |
|---|---|---|
| color | `{primary,accent,neutral,danger,warning,success,info}/{50…950}` + `white`, `black` | 11-step OKLCH ramp; brand color lands on nearest lightness step (fixed L per step, chroma scaled) |
| space | `{0,1,2,3,4,5,6,8,10,12,16,20,24}` | n × 4px × density |
| radius | `{none,sm,base,lg,xl,full}` | radius driver (base); sm ×0.5, lg ×1.5, xl ×2, full ∞ |
| border | `{none,thin,medium,thick}` | spine constant: 0/1/2/4px (not driver-derived) |
| type | `scale/{1..9}` (3 = body), `leading/{tight,snug,normal,relaxed}`, `tracking/{tight,normal,wide}`, `weight/{regular,medium,semibold,bold}`, `family/{heading,body}` | baseSize × scaleRatio^(n−3), font pairing |
| shadow | `level-{0,1,2,3}` | shadow strength driver (y/blur/alpha triples) |

Breakpoints are build-time exports, not tokens (CSS custom properties don't work in `@media`).

## 4. Semantic Layer — Categories

| Category | Covers | Color axis | States |
|---|---|---|---|
| Action | buttons, triggers, switches, tabs, menu items | priority (primary/secondary/tertiary) | default/hover/active/focus/disabled/selected |
| Input/Field | inputs, selects, checkboxes, radios | none | default/hover/focus/error/disabled/checked |
| Surface | cards, panels, dialog/popup panels | elevation (0–3) | default/striped |
| Type | text styles | role (display/heading/body/label/caption) | none |
| Icon | icons | role (default/secondary/accent) | none |
| Divider | separators | none | none |
| Feedback | alerts, toasts | sentiment (danger/warning/success/info) | none |
| Overlay | modal scrims | none | none |
| Focus | focus ring | none | none |

### Token type vs category scope

| Type | Varies by category? | Notes |
|---|---|---|
| Color | yes | per-category axis/state above |
| Measure | yes | padding, gap, radius, height, thickness, border-width |
| Other | no | font-family/weight, sourced from Type/Icon only |

### Per-category token lists

- **Action** — `color/{priority}/{state}/{bg,fg,border}`; `measure/{size}/{padding-x,padding-y,radius,gap,border-width}` (only Button exposes size; others read `md`)
- **Input/Field** — `color/{state}/{bg,fg,border,placeholder-fg}` (`checked` is a state here); `measure/{size}/{padding-x,padding-y,height,radius,border-width}`
- **Surface** — `color/{elevation}/{state}/{bg,border,shadow}`; `measure/{padding,radius,border-width}`
- **Type** — `color/{role}/fg`; `measure/{role}/[{step 1-3}]/{size,line-height,letter-spacing}`; `other/{role}/{font-family,weight}`
- **Icon** — `color/{role}/fg`; no measure (size inherits or via prop)
- **Divider** — `color/border`; `measure/{weight}/thickness`
- **Feedback** — `color/{sentiment}/{bg,fg,border,icon-fg}`; `measure/{padding,radius,gap,border-width}`
- **Overlay** — `color/bg` only
- **Focus** — `color/stroke`; `measure/stroke-width`

## 5. Contexts

- Semantic tokens set at `:root`.
- `data-context="on-primary"` redefines a subset for the subtree; children inherit; contexts nest; `data-context="default"` restores `:root` values.
- Only tokens that change are redefined in the context block.
- Section driver: `sections: { hero: 'on-primary' }` adds `[data-section="hero"]` to the context selector.
- Launch contexts: `default`, `on-primary`.

## 6. Validation layers

- `checkTokenName()` — validates slash-form names; never emits CSS names as-is (CSS form: `--hds-sem-action-color-primary-hover-bg`).
- `contrast.ts` — text 4.5:1; icons, focus ring, input border, checkmark 3:1; disabled exempt; checked across both contexts and every surface ground.

## 7. Composite mapping (sample)

| Component | Token source |
|---|---|
| Select / Combobox / Autocomplete | Trigger: Input. Popup: Surface. Options: Action. |
| Menu family | Items: Action. Popup: Surface. |
| Tabs | Triggers: Action tertiary (`selected`). Indicator: `action/color/primary/selected/bg`. Panel: no tokens, inherits. |
| Switch | Track: Action secondary (off) / primary selected (on). Thumb: matching fg. |
| Meter / Progress | Track: `surface/color/0/striped/bg`. Fill: feedback icon-fg / action primary bg. |
| Data Table | Rows: Surface. Borders: Divider. Text: Type. Hover/sort: Action tertiary. |

## 8. Known gaps (spec §10 open items)

1. No token change/deprecation plan for tokens already live on client sites.
2. Layout spacing: no tokens for field gaps, form-row spacing, table cell padding (components borrow Input/Field measure).
3. Field error text borrows `feedback/color/danger/fg`; not contrast-checked, fails on on-primary grounds.
4. No graph/data-viz token family (raised in theming rework discussion).

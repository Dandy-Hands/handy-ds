# Internal Spec: Radio

- Status: docs-built
- Date: 2026-09-23
- Interview: `interview-guide-2026-09-23.md` (retroactive)
- Base UI version documented from: `@base-ui/react` 1.8.0 (`@base-ui/react/radio`, `@base-ui/react/radio-group`)
- Code: `src/components/Radio.tsx` (+ shared `Checkbox.css`)

## Description

Radio is one choice out of two to five options that should all stay visible. It renders a circular Field box with a CSS dot as the selected mark. `RadioGroup` owns the selection state and stacks the options. Use Radio for two to five visible choices; use Select beyond that and Checkbox when more than one can be picked.

## Usage

- Do wrap the group in `Fieldset.Root` with a `Fieldset.Legend` (or an `aria-labelledby`) so the group has a name.
- Do label each radio with `Field.Label` or a wrapping `<label>`.
- Don't use it for more than about five options — use `Select`.
- Don't restyle the circle with `className` — checked and state colors come from the theme.

## Base UI API

Wrapped components: `Radio` from `@base-ui/react/radio`, `RadioGroup` from `@base-ui/react/radio-group`. Surface decisions:

| Base UI surface | Decision |
| --- | --- |
| `Root` props (`value`, `checked`, `defaultChecked`, `onCheckedChange`, `name`, `form`, `disabled`, `readOnly`, `nativeButton`, ...) | Exposed — full passthrough on the namespace. |
| `Root`, `Indicator` | Styled with `part()`: `hds-radio`, `hds-radio__indicator`. |
| `Indicator` mark | CSS `::before` dot — no icon injection, unlike Checkbox. |
| `RadioGroup` | Single `part()` — `hds-choice-group` stack (shared with `CheckboxGroup`). |
| `render` on every part | Exposed — passthrough via `part()`. |
| `data-checked`, `data-invalid`, `data-disabled` state attributes | Consumed by CSS. |
| Callback-form `className` / `style` | Available via passthrough, not documented. |

## Extension API

| Prop | Type | Default | Decision |
| --- | --- | --- | --- |
| — | — | — | No extension props. The circle scales with its label (`1.25em` structural size); no `size` axis. |

## Token mapping

> **Provisional (2026-10-07).** The token rework renamed every token. The names below are the provisional mapping from the previous spec (token spec section 9, item 5). This component's re-interview confirms them.

| Part | Tokens |
| --- | --- |
| Circle default | `hds/sem/color/field/default/{bg,border}`; border width `max(1px, hds/sem/measure/space/*`, `hds/sem/measure/size/*`, `hds/sem/radius/control`, `hds/sem/border/control)` (floor) |
| Checked | `hds/sem/color/field/checked/{bg,fg,border}` (gap 12) |
| Hover | `hds/sem/color/field/hover/border` |
| Invalid | `hds/sem/color/field/error/border` |
| Disabled | `hds/sem/color/field/disabled/{bg,border}`; disabled + checked inverted (`disabled-fg` ground, `disabled-bg` mark) |
| Shape | `border-radius: 50%` (structural); dot at `0.45em` of `currentColor` |
| Group gap | `hds/sem/measure/space/*`, `hds/sem/measure/size/*`, `hds/sem/radius/control`, `hds/sem/border/control` (borrowed, gap 13) |

Notes:

- No primitive or driver references; Radio reads only Field tokens (gap 12) and shares `Checkbox.css` with Checkbox.
- The selected mark is structural CSS, not a token — its color is `currentColor` (= `checked-fg`).

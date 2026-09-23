# Internal Spec: Checkbox

- Status: docs-built
- Date: 2026-09-23
- Interview: `interview-guide-2026-09-23.md` (retroactive)
- Base UI version documented from: `@base-ui/react` 1.8.0 (`@base-ui/react/checkbox`, `@base-ui/react/checkbox-group`)
- Code: `src/components/Checkbox.tsx` + `Checkbox.css`

## Description

Checkbox is a yes/no control, or one of several picked from a few options. It renders a square Input/Field box with a built-in check (or dash when indeterminate). `CheckboxGroup` stacks several with shared spacing. Use Checkbox when the value is submitted with a form or several options can be picked at once; use Switch when the change applies immediately.

## Usage

- Do label every checkbox with `Field.Label` or a wrapping `<label>`.
- Do use `indeterminate` for a parent box over a partly selected set.
- Don't use it for an immediate setting — use `Switch`.
- Don't restyle the box with `className` — checked and state colors come from the theme.

## Base UI API

Wrapped components: `Checkbox` from `@base-ui/react/checkbox`, `CheckboxGroup` from `@base-ui/react/checkbox-group`. Surface decisions:

| Base UI surface | Decision |
| --- | --- |
| `Root` props (`checked`, `defaultChecked`, `indeterminate`, `onCheckedChange`, `value`, `name`, `form`, `disabled`, `readOnly`, `parent`, `nativeButton`, ...) | Exposed — full passthrough on the namespace. |
| `Root`, `Indicator` | Styled with `part()`: `hds-checkbox`, `hds-checkbox__indicator`. |
| `Indicator` children | Built-in check and dash glyphs as overridable defaults; CSS shows the right one. |
| `CheckboxGroup` | Single `part()` — `hds-choice-group` stack. |
| `render` on every part | Exposed — passthrough via `part()`. |
| `data-checked`, `data-indeterminate`, `data-invalid`, `data-disabled` state attributes | Consumed by CSS. |
| Callback-form `className` / `style` | Available via passthrough, not documented. |

## Extension API

| Prop | Type | Default | Decision |
| --- | --- | --- | --- |
| — | — | — | No extension props. The box scales with its label (`1.25em` structural size); no `size` axis. |

## Token mapping

| Part | Tokens |
| --- | --- |
| Box default | `hds/sem/input/color/default/{bg,border}`; border width `max(1px, hds/sem/input/measure/md/border-width)` (floor) |
| Checked | `hds/sem/input/color/checked/{bg,fg,border}` (gap 12) |
| Hover | `hds/sem/input/color/hover/border` |
| Invalid | `hds/sem/input/color/error/border` |
| Disabled | `hds/sem/input/color/disabled/{bg,border}`; disabled + checked inverted (`disabled-fg` ground, `disabled-bg` mark) |
| Box radius | `hds/sem/input/measure/md/radius` ÷ 2 |
| Group gap | `hds/sem/input/measure/sm/padding-x` (borrowed, gap 13) |
| Mark glyphs | inherit `currentColor` (= `checked-fg` / inverted disabled colors) |

Notes:

- No primitive or driver references; box size (`1.25em`), the 1px border floor, and the mark glyph geometry are structural literals.
- Checkbox and Radio share `Checkbox.css` and the `checked` Input/Field state.

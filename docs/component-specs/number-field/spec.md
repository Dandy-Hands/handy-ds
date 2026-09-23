# Internal Spec: NumberField

- Status: reviewed (retroactive; owner pre-approved, interview skipped)
- Date: 2026-09-23
- Interview: `interview-guide-2026-09-23.md` (retroactive)
- Base UI version documented from: `@base-ui/react` 1.8.0 (`@base-ui/react/number-field`)
- Code: `src/components/NumberField.tsx` (+ shared `control.css`)

## Description

NumberField is a number input with decrement and increment steppers. The group renders as an Input/Field control: one frame with a − button, the value input, and a + button. Use it for quantities the user nudges up and down; do not use it for a range with no exact number in mind. Base UI supplies the value behavior (stepping, scrubbing, clamping, formatting); the family only styles it.

## Usage

- Do use NumberField for a quantity with an exact value — seats, copies, minutes.
- Don't use it where a Select or Radio fits better: a short known list of options is not a number.
- Don't restyle the group with `className` — size comes from `data-size`, colors from the theme.

## Base UI API

Wrapped component: `NumberField` from `@base-ui/react/number-field`. Surface decisions:

| Base UI surface | Decision |
| --- | --- |
| `Root` props (`value`, `defaultValue`, `min`, `max`, `step`, `smallStep`, `largeStep`, `snapOnStep`, `locale`, `format`, `onValueChange`, ...) | Exposed — full passthrough on the namespace. |
| `Group`, `Input`, `Decrement`, `Increment` | Styled with `part()`: group gets the `.hds-control` look with `data-size: 'md'` default; input and stepper buttons get the inner-part classes. |
| `Decrement` / `Increment` children | Built-in minus/plus glyphs as overridable defaults. |
| `ScrubArea`, `ScrubAreaCursor`, `Clear` | Pass through unstyled — on the namespace, no classes applied. |
| `render` on every part | Exposed — passthrough via `part()`. |
| Callback-form `className` / `style` | Available via passthrough, not documented. |

## Extension API

| Prop | Where | Type | Default | Decision |
| --- | --- | --- | --- | --- |
| `data-size` | `NumberField.Group` | `'sm' \| 'md' \| 'lg'` | `'md'` | Existing Input/Field axis, applied as a data attribute (same shape as `Field.Control`). No other extension props. |

## Token mapping

| Part | Tokens |
| --- | --- |
| Group (any size) | `hds/sem/input/color/{default,hover,focus,error,disabled}/{bg,fg,border,placeholder-fg}` and `hds/sem/input/measure/{sm,md,lg}/{padding-x,padding-y,height,radius,border-width}` (`control.css`) |
| Group focus ring | `hds/sem/focus/color/stroke`, `hds/sem/focus/measure/stroke-width` (frame, via `:has(:focus-visible)`) |
| Stepper button hover | `hds/sem/action/color/tertiary/hover/{bg,fg}` (cross-category borrow) |
| Value text | inherits the control's `hds/sem/type/other/body/*` + `hds/sem/type/measure/body/*` typography |

Notes:

- No primitive or driver references; no new tokens introduced.
- `NumberField.Group` pins the Input/Field `data-size` axis; `Root` and the unstyled parts are context-passive.

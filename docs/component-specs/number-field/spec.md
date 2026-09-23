# Internal Spec: NumberField

- Status: docs-built
- Date: 2026-09-23
- Interview: `interview-guide-2026-09-23.md`
- Base UI version documented from: `@base-ui/react` 1.8.0
- Code status: component exists (`src/components/NumberField.tsx`; look in `src/components/control.css`)

## Description

NumberField is a number input with steppers: a framed text control with minus/plus buttons that nudge the value by a step. Use it for a quantity the user nudges up and down (quantities, counts, sizes); do not use it for a range with no exact number in mind (a slider, which the library does not ship yet). It is the Input/Field category applied to a numeric control — same frame, states, and size axis as Input.

## Usage

- Do use NumberField for quantities the user adjusts in steps, with `min`/`max` clamps and optional `format` for currency/percent/unit display.
- Don't use it when any number in a range is equally fine and no exact value is in mind — there is no slider yet; a plain Input is the interim answer.
- Don't restyle the frame — it is the shared Input/Field control look; size it with `data-size` on `NumberField.Group`.

## Base UI API

One wrapper in `src/components/NumberField.tsx`, spreading the full `@base-ui/react/number-field` namespace:

- `Root` — value logic and clamps: `value`, `defaultValue`, `min`, `max`, `step`, `smallStep`, `largeStep`, `snapOnStep`, `allowOutOfRange`, `allowWheelScrub`, `format` (`Intl.NumberFormatOptions`), `locale`, `onValueChange(value, eventDetails)`, `onValueCommitted(value, eventDetails)`, `disabled`, `readOnly`, `required`, `name`, `form`, `inputRef`. Renders `data-invalid` when the value is out of range.
- `Group` — the styled frame (`part(..., 'hds-control', { 'data-size': 'md' })`).
- `Input` — the inner text input (`hds-control__input`), transparent, inherits the frame.
- `Decrement` / `Increment` — stepper buttons (`hds-control__button`) with built-in minus/plus icons as default `children`.
- `ScrubArea`, `ScrubAreaCursor`, and all hooks — pass through unstyled.

Nothing is renamed or omitted; the Base UI docs apply part for part.

## Extension API

| Prop | Part | Type | Default | Decision |
| --- | --- | --- | --- | --- |
| `data-size` | `Group` | `'sm' \| 'md' \| 'lg'` | `'md'` | Existing Input/Field axis, set as a default prop. Maps to `hds/sem/input/measure/{size}/*`. |

Explicitly rejected:

- a `size` prop on `Root` — the axis lives on the Group, where the styled frame is (matches the Input/Field pattern);
- any additional handy-ds props — `format`/`locale` cover currency/percent/unit display;
- custom stepper icons as props — built-in minus/plus are default `children`, overridable per instance.

## Token mapping

| Part | Tokens |
| --- | --- |
| Group frame (states: default/hover/focus/error/disabled) | `hds/sem/input/color/{state}/{bg,fg,border,placeholder-fg}` |
| Group measures | `hds/sem/input/measure/{sm,md,lg}/{height,padding-x,padding-y,radius,border-width}` |
| Group type | `hds/sem/type/measure/body/*`, `hds/sem/type/measure/label/line-height`, `hds/sem/type/other/body/*` |
| Inner input | transparent; inherits the frame's color tokens |
| Stepper buttons | transparent by default; hover reads `hds/sem/action/color/tertiary/hover/{bg,fg}` |
| Focus ring | `hds/sem/focus/color/stroke`, `hds/sem/focus/measure/stroke-width` (on the frame via `:has(:focus-visible)`) |

Notes:

- Category is Input/Field end to end (token spec section 9: Number Field → Input/Field).
- The error state uses `hds/sem/input/color/error/*` on the frame, driven by `[data-invalid]`.

# Internal Spec: Field

- Status: docs-built
- Date: 2026-09-23
- Interview: `interview-guide-2026-09-23.md` (retroactive)
- Base UI version documented from: `@base-ui/react` 1.8.0 (`@base-ui/react/field`, `@base-ui/react/fieldset`, `@base-ui/react/form`, `@base-ui/react/input`)
- Code: `src/components/Field.tsx` + `Field.css` + `control.css`

## Description

Field is one labelled form value: label, control, description, and error, wired to each other so assistive tech announces them together. `Fieldset` groups related fields; `Form` validates and submits. Bare `Input` is a text input without a Field wrapper, for the rare control with no visible label. The family is the Input/Field category's text-control reference: every text-entry surface (including Select and Combobox triggers) reuses its look through `control.css`.

## Usage

- Do use the full `Field` set (`Field.Root`, `Field.Label`, `Field.Control`, `Field.Description`, `Field.Error`) for any labelled text entry.
- Don't reach for bare `Input` unless the control has no visible label; when you do, give it an `aria-label`.
- Don't set `className` to restyle controls — sizes come from `data-size`, colors from the theme.
- Put forms inside colored sections in a `data-context="default"` container so `Field.Error` text keeps contrast.

## Base UI API

Wrapped components: `Field` from `@base-ui/react/field`, `Fieldset` from `@base-ui/react/fieldset`, `Form` from `@base-ui/react/form`, `Input` from `@base-ui/react/input`. Surface decisions:

| Base UI surface | Decision |
| --- | --- |
| `Field.Root/Label/Control/Description/Error/Item` | All exposed, namespace mirrored; each renders its own DOM and gets a class via `part()`. |
| `Fieldset.Root/Legend` | Exposed, namespace mirrored. |
| `Form` | Exposed as a single `part()` (`hds-form`); validation and submit behavior are Base UI's, untouched. |
| Native input props on `Input` (`type`, `placeholder`, `required`, `aria-*`, ...) | Exposed — full passthrough. `size` the HTML attribute is omitted from the wrapper type so the axis prop can own the name. |
| `render` on every part | Exposed — passthrough via `part()`. |
| `Field.Root` `invalid` prop and Base UI's `data-invalid` attributes | Consumed by CSS for the error state. |
| Callback-form `className` / `style` | Available via passthrough, not documented. |

## Extension API

| Component | Prop | Type | Default | Decision |
| --- | --- | --- | --- | --- |
| `Input` | `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Existing axis. Sets `data-size`; the same axis exists on `Field.Control` as `data-size` (default `md`). |
| `Field`, `Fieldset`, `Form` | — | — | — | No extension props. |

`Field.Control` takes `data-size` directly instead of a prop because it is a Base UI part, and `part()` defaults keep the pattern prop-free.

## Token mapping

| Part | Tokens |
| --- | --- |
| Control (any size) | `hds/sem/input/color/{default,hover,focus,error,disabled}/{bg,fg,border,placeholder-fg}` and `hds/sem/input/measure/{sm,md,lg}/{padding-x,padding-y,height,radius,border-width}` (`control.css`) |
| Group focus ring | `hds/sem/focus/color/stroke`, `hds/sem/focus/measure/stroke-width` (frame drawn with `:has(:focus-visible)`) |
| `Field.Label` | `hds/sem/type/color/label/fg`, `hds/sem/type/measure/label/*`, `hds/sem/type/other/label/*` |
| `Field.Description` | `hds/sem/type/color/caption/fg`, `hds/sem/type/measure/caption/*`, `hds/sem/type/other/caption/*` |
| `Field.Error` | `hds/sem/feedback/color/danger/fg` on the page ground (gap 14, needs review) |
| `Fieldset.Legend` | `hds/sem/type/color/label/fg` + label measure/other tokens |
| `Field` gap | `hds/sem/input/measure/sm/padding-y` (borrowed, gap 13) |
| `Form` / `Fieldset` gap | `hds/sem/input/measure/lg/padding-x` (borrowed, gap 13) |

Notes:

- No primitive or driver references; `control.css` maps the `data-size` axis to private `--_*` properties once, then state rules read them.
- Field label text is contrast-checked in the default context only (gap 14, flagged in decisions.md).

# Internal Spec: Switch

- Status: reviewed (retroactive; owner pre-approved, interview skipped)
- Date: 2026-09-23
- Interview: `interview-guide-2026-09-23.md` (retroactive)
- Base UI version documented from: `@base-ui/react` 1.8.0 (`@base-ui/react/switch`)
- Code: `src/components/Switch.tsx` + `Switch.css`

## Description

Switch is an on/off control whose change takes effect the moment it flips. It renders a pill-shaped track with a sliding thumb. The off state looks like a secondary Action; the on state looks like a primary Action in its `selected` state. Use Switch for immediate settings; use Checkbox when the value is submitted with a form.

## Usage

- Do use Switch for instant settings — a toggle in a preferences panel, a visibility flag.
- Don't use it when the value submits with a form — use `Checkbox`.
- Do label it with `Field.Label` or a wrapping `<label>`.
- Don't restyle the track or thumb with `className` — colors come from the theme.

## Base UI API

Wrapped component: `Switch` from `@base-ui/react/switch`. Surface decisions:

| Base UI surface | Decision |
| --- | --- |
| `Root` props (`checked`, `defaultChecked`, `onCheckedChange`, `value`, `uncheckedValue`, `name`, `form`, `disabled`, `readOnly`, `nativeButton`, ...) | Exposed — full passthrough on the namespace. |
| `Root`, `Thumb` | Styled with `part()`: `hds-switch`, `hds-switch__thumb`. |
| `render` on every part | Exposed — passthrough via `part()`. |
| `data-checked`, `data-disabled` state attributes | Consumed by CSS. |
| Callback-form `className` / `style` | Available via passthrough, not documented. |

## Extension API

| Prop | Type | Default | Decision |
| --- | --- | --- | --- |
| — | — | — | No extension props. Track size (`2.25em × 1.25em`), pill radius (`999px`), and thumb travel (`1em`) are structural literals that scale with the label's font size. |

## Token mapping

| Part | Tokens |
| --- | --- |
| Track off (default, hover, disabled) | `hds/sem/action/color/secondary/{default,hover,disabled}/{bg,border}` |
| Track on | `hds/sem/action/color/primary/selected/{bg,border}` |
| Thumb off / on / disabled | `hds/sem/action/color/secondary/default/fg`, `hds/sem/action/color/primary/selected/fg`, `hds/sem/action/color/secondary/disabled/fg` |

Notes:

- No primitive or driver references; Switch reads only Action tokens (decisions.md Wave 5 Switch entry).
- Thumb slide (`translate: 1em`) and the 150ms transitions are structural; no `prefers-reduced-motion` needed at this scale.

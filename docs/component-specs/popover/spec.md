# Internal Spec: Popover

- Status: reviewed (retroactive; owner pre-approved, interview skipped)
- Date: 2026-09-23
- Interview: `interview-guide-2026-09-23.md` (retroactive)
- Base UI version documented from: `@base-ui/react` 1.8.0 (`@base-ui/react/popover`)
- Code: `src/components/Popover.tsx` + `Popover.css` (+ shared `surface.css`, `action.css`, `Button.css`)

## Description

Popover is extra information or small controls anchored to a trigger, without blocking the page. The popup is a Surface at elevation 2 anchored to its trigger; the page behind stays usable. Use Popover for secondary content; use Menu for a list of commands and Dialog when the task blocks the page.

## Usage

- Do use Popover for clarifying detail: definitions, small forms, help text.
- Don't use it for a list of commands — use `Menu`.
- Don't use it when the content must be read before continuing — use `Dialog`.
- Do anchor it to its trigger and keep the content short.

## Base UI API

Wrapped component: `Popover` from `@base-ui/react/popover`. Surface decisions:

| Base UI surface | Decision |
| --- | --- |
| `Root` props (`open`, `onOpenChange`, `modal`, `delay`, `closeDelay`, ...) | Exposed — full passthrough; `modal` keeps Base UI's non-modal default. |
| `Trigger`, `Close` | Styled with `part()`: `hds-button hds-action`; Close pins `data-priority: 'tertiary'`. Trigger look is overridable with `data-priority` (same decisions-vs-code flag as Dialog). |
| `Portal`, `Positioner`, `Backdrop` | Portal and positioner passthrough; backdrop gets `hds-backdrop` (Overlay tokens). |
| `Popup` | `hds-surface hds-popup hds-popover` with `data-elevation: '2'` — Surface elevation 2 + popup transitions. |
| `Title`, `Description` | `hds-popover__title` (label type), `hds-popover__description` (body color). |
| `openOnHover` / `delay` / `closeDelay` (Trigger) | Exposed — passthrough, not documented (edge-case hover behavior). |
| `render` on every part | Exposed — passthrough via `part()`. |
| `data-open`, `data-starting-style`, `data-ending-style` | Consumed by CSS for popup/backdrop transitions. |
| Callback-form `className` / `style` | Available via passthrough, not documented. |

## Extension API

| Prop | Type | Default | Decision |
| --- | --- | --- | --- |
| — | — | — | No extension props. Elevation is fixed at 2; the popup max-width (`min(24rem, var(--available-width))`) is structural. Positioning options (`sideOffset`, `side`, `align`) go on `Positioner` at the call site. |

## Token mapping

| Part | Tokens |
| --- | --- |
| Popup ground | `hds/sem/surface/color/2/default/{bg,border,shadow}` + `hds/sem/surface/measure/{padding,radius,border-width}` (via `surface.css`) |
| Backdrop | `hds/sem/overlay/color/bg` (only when a backdrop is rendered) |
| Trigger / Close | `hds/sem/action/color/{secondary,tertiary}/*` (all states, via `action.css`) + `hds/sem/action/measure/md/*` |
| Title | `hds/sem/type/color/label/fg`, `hds/sem/type/measure/label/*`, `hds/sem/type/other/label/*` |
| Description | `hds/sem/type/color/body/fg` |
| Focus ring | `hds/sem/focus/color/stroke`, `hds/sem/focus/measure/stroke-width` (from `base.css`) |

Notes:

- No primitive or driver references; popup transitions and max-width are structural literals.
- **Spec change flagged (shared with Dialog):** decisions.md "Triggers carry no styling" does not match the shipped `Trigger`/`Close` classes. Code wins for this spec.

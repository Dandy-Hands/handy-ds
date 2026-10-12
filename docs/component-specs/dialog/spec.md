# Internal Spec: Dialog

- Status: docs-built
- Date: 2026-09-23
- Interview: `interview-guide-2026-09-23.md` (retroactive)
- Base UI version documented from: `@base-ui/react` 1.8.0 (`@base-ui/react/dialog`, `@base-ui/react/alert-dialog`)
- Code: `src/components/Dialog.tsx` + `Dialog.css` (+ shared `surface.css`, `action.css`, `Button.css`)

## Description

Dialog is a task that blocks the page: focus is trapped, the page behind is dimmed by an overlay backdrop. `AlertDialog` is the confirm/cancel variant for destructive actions; it cannot be dismissed by clicking outside. The popup is a Surface at elevation 3; the backdrop is the Overlay category. Use Dialog when the user must finish or dismiss before carrying on; use Popover for extra detail next to a trigger.

## Usage

- Do use Dialog for focused tasks: edit forms, confirmations, blocking choices.
- Do use `AlertDialog` to confirm destructive actions — deletion, permission changes.
- Don't use it for secondary content that shouldn't block — use `Popover`.
- Do give the popup a `Title`; add a `Description` when the reason matters.

## Base UI API

Wrapped components: `Dialog` from `@base-ui/react/dialog`, `AlertDialog` from `@base-ui/react/alert-dialog`. Surface decisions:

| Base UI surface | Decision |
| --- | --- |
| `Root` props (`open`, `onOpenChange`, `modal`, `defaultOpen`, ...) | Exposed — full passthrough; both components keep Base UI's modal defaults (`modal: true`). |
| `Trigger`, `Close` | Styled with `part()`: `hds-button hds-action` (secondary look; `data-priority` overrides). **Flag:** decisions.md "Triggers carry no styling" says these should be unstyled; the shipped code still styles them — code wins, reconcile at review. |
| `Portal`, `Backdrop` | Portal passthrough; Backdrop gets `hds-backdrop` (Overlay tokens). |
| `Popup` | `hds-surface hds-popup hds-dialog` with `data-elevation: '3'` — Surface elevation 3 + popup transitions + centered modal layout. |
| `Title`, `Description` | `hds-dialog__title` (headline type), `hds-dialog__description` (body color). |
| `initialFocus` / `finalFocus` (Popup) | Exposed — passthrough. |
| `render` on every part | Exposed — passthrough via `part()`. |
| `data-open`, `data-starting-style`, `data-ending-style` | Consumed by CSS for popup/backdrop transitions. |
| Callback-form `className` / `style` | Available via passthrough, not documented. |

`AlertDialog` mirrors every decision; the difference is the underlying component's dismissal rules (no outside-click dismiss, no Escape-dependent flow changes beyond Base UI's defaults).

## Extension API

| Prop | Type | Default | Decision |
| --- | --- | --- | --- |
| — | — | — | No extension props on either namespace. Popup elevation is fixed at 3; the popup width (`min(32rem, calc(100vw - 2rem))`) is structural. |

## Token mapping

> **Provisional (2026-10-07).** The token rework renamed every token. The names below are the provisional mapping from the previous spec (token spec section 9, item 5). This component's re-interview confirms them.

| Part | Tokens |
| --- | --- |
| Popup ground | `hds/sem/color/surface/modal/*`, `hds/sem/elevation/modal` + `hds/sem/measure/space/600`, `hds/sem/radius/container`, `hds/sem/border/container` (via `surface.css`) |
| Backdrop | `hds/sem/color/overlay/scrim` |
| Trigger / Close | `hds/sem/color/action/secondary/*` (all states, via `action.css`) + `hds/sem/measure/space/*`, `hds/sem/radius/control`, `hds/sem/border/control` |
| Title | `hds/sem/color/content/strong/fg`, `hds/sem/typography/headline/*` |
| Description | `hds/sem/color/content/default/fg` |
| Description margins | `hds/sem/measure/space/*`, `hds/sem/radius/control`, `hds/sem/border/control`, `hds/sem/measure/space/600`, `hds/sem/radius/container`, `hds/sem/border/container` (structural spacing via tokens) |
| Focus ring | `hds/sem/color/focus/ring`, `hds/sem/border/focus` (from `base.css`) |

Notes:

- No primitive or driver references; popup transitions and centering are structural literals.
- **Spec change flagged:** trigger/close styling contradicts decisions.md ("Triggers carry no styling"); the shipped code keeps the secondary Button look. Code wins for this spec; the decision entry needs an update or the code a change.

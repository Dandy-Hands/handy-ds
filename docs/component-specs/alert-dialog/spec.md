Status:
- spec: reviewed
- code: built
- figma: built
- docs: built

# Internal Spec: Alert Dialog

- Date: 2026-10-28
- Interview: `interview-guide-2026-10-28.md`
- Base UI version documented from: `@base-ui/react` 1.8.0 (`@base-ui/react/alert-dialog`)

## Description

Alert Dialog asks the user one question about an action and waits for an answer, such as "Delete 3 files?". It is one component, `<AlertDialog>`, with props only. It blocks the page, does not close on a click outside, and draws its own two buttons: a cancel button that gets focus first, and a confirm button. Screen readers read the title and the description at once.

## Usage

- Do use Alert Dialog to confirm an action that is destructive or cannot be undone: delete, discard changes, cancel a subscription.
- Do write the result in `description`, such as "You cannot undo this."
- Do name the confirm button with the action ("Delete"), not "OK" or "Yes".
- Don't use Alert Dialog for a task with fields. Use Dialog.
- Don't use Alert Dialog for a message that needs no answer. Use Toast or Alert.

## Base UI API

Wrapped: `Root`, `Portal`, `Backdrop`, `Viewport`, `Popup`, `Title`, `Description`, `Close` (for the cancel button), all rendered inside `<AlertDialog>`. None is exported. `AlertDialog` is a function component, not a namespace.

| Base UI member | Decision |
| --- | --- |
| `Root` `open`, `onOpenChange` | Exposed. The only way to open and close it (one method per task). |
| `Root` `defaultOpen`, `onOpenChangeComplete`, `actionsRef`, `handle`, `triggerId`, `defaultTriggerId`; `createHandle`, `Handle` | Omitted. |
| `Trigger` | Omitted. A normal Button with `onClick` opens it. |
| `Portal`, `Backdrop`, `Viewport` | Rendered inside. The scrim is always rendered. |
| `Popup` `initialFocus` | Not exposed. Fixed to the cancel button. |
| `Popup` `finalFocus` | Omitted. Base UI default: focus goes back to the element that had it before. |
| `Title`, `Description` | Rendered inside from `title` and `description`. |
| `Close` | Not exported. Renders the cancel button. |
| Outside click | Does not close the dialog (Base UI Alert Dialog behavior). |
| Escape | Closes the dialog through `onOpenChange(false)`, the same result as cancel (Base UI default). |
| `render`, `className`, `style` | Omitted on `<AlertDialog>`. |

## Extension API

| Prop | Type | Default | Decision |
| --- | --- | --- | --- |
| `title` | `ReactNode` | required | The question. Accessible name. |
| `description` | `ReactNode` | required | The result of the action. Screen readers read it with the title. Required so that no confirm is a bare "Are you sure?". |
| `confirm` | `ReactNode` | required | Content of the confirm button. |
| `onConfirm` | `() => void` | required | Called on a click of the confirm button. The dialog does not close itself; the caller sets `open` to false (for example after an async delete). |
| `cancel` | `ReactNode` | `'Cancel'` | Content of the cancel button. It gets focus on open and calls `onOpenChange(false)`. |
| `variant` | `'primary' \| 'danger'` | `'primary'` | The confirm button variant. `danger` for a destructive action. The cancel button is always `secondary`. Set as `data-variant`. |

Layout rules:

- One fixed width: `measure/width/9600`, capped to the screen minus the side gap. No `width` prop.
- The box is a column: title, description, button row. No X button.
- Button row: end-aligned; cancel first, confirm last. On a narrow screen the buttons wrap.
- Buttons are Button size `1000`.
- Colors: the page colors and mode, as Dialog (portal context).

## Token mapping

Claude calls (token interview scope). Same ground as Dialog.

| Part | Tokens |
| --- | --- |
| Scrim | `hds/sem/color/overlay/scrim` |
| Box ground | `hds/sem/color/surface/modal/bg`, `hds/sem/color/surface/modal/border`, `hds/sem/elevation/modal`, `hds/sem/radius/container`, `hds/sem/border/container` |
| Box padding | `hds/sem/measure/space/600` |
| Side gap to the screen edge | `hds/sem/measure/space/400` |
| Width | `hds/sem/measure/width/9600` |
| Title | `hds/sem/color/content/strong/fg`, `hds/sem/typography/headline/{family,weight,leading,tracking}`, `hds/sem/typography/headline/size/sm` |
| Description | `hds/sem/color/content/default/fg`, `hds/sem/typography/body/*`, `hds/sem/typography/body/size/md`; top margin `hds/sem/measure/space/200` |
| Gap description to button row | `hds/sem/measure/space/600` |
| Button row gap | `hds/sem/measure/space/200` |
| Cancel button | `hds/sem/color/action/secondary/*` (Button) |
| Confirm button | `hds/sem/color/action/{primary,danger}/*` (Button) |
| Focus ring | `hds/sem/color/focus/ring`, `hds/sem/border/focus` |

Notes:

- Share the box, scrim, and title CSS with Dialog.
- No primitive or driver references.

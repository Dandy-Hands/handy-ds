# AlertDialog

## Usage

AlertDialog asks the user to confirm one action, such as "Delete 3 files?", and waits for an answer. Use it for an action that is destructive or cannot be undone. Don't use it for a task with fields; use Dialog. Don't use it for a message that needs no answer; use Toast or Alert.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | — | Required. Whether the dialog is open. Keep it in state. |
| `onOpenChange` | `(open: boolean) => void` | — | Required. Called with `false` when the user clicks the cancel button or presses `Escape`. Pass the state setter. |
| `title` | `ReactNode` | — | Required. The question, such as "Delete 3 files?". |
| `description` | `ReactNode` | — | Required. The result of the action, such as "You cannot undo this." |
| `confirm` | `ReactNode` | — | Required. The text of the confirm button. Name the action, such as "Delete", not "OK". |
| `onConfirm` | `() => void` | — | Required. Called when the user clicks the confirm button. The dialog stays open until you set `open` to `false`. |
| `cancel` | `ReactNode` | `'Cancel'` | The text of the cancel button. This button gets focus when the dialog opens. |
| `variant` | `'primary' \| 'danger'` | `'primary'` | The look of the confirm button. `primary`: a normal action. `danger`: an action that deletes or destroys something. |

The dialog blocks the page. A click outside does not close it, and it has no X button. AlertDialog accepts no other props.

## Examples

```tsx
const [open, setOpen] = useState(false);

<Button variant="danger" onClick={() => setOpen(true)}>Delete files</Button>
<AlertDialog
  open={open}
  onOpenChange={setOpen}
  title="Delete 3 files?"
  description="You cannot undo this."
  confirm="Delete"
  variant="danger"
  onConfirm={async () => {
    await deleteFiles();
    setOpen(false);
  }}
/>
```

## Contexts

The dialog shows on top of the page, outside the content around the button that opened it. It uses the page colors and mode. A `data-context`, `data-mode`, or `data-section` on an ancestor does not change it.

# Dialog

## Usage

Dialog shows a box over the page for a short task the user must finish or dismiss before going back to the page, such as editing a record or filling a small form. It blocks the page behind it. Don't use it to confirm a destructive action; use AlertDialog. Don't use it for longer content where the page context helps; use Drawer. Don't use it for a small panel that leaves the page usable; use Popover.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | — | Required. Whether the dialog is open. Keep it in state. |
| `onOpenChange` | `(open: boolean) => void` | — | Required. Called when the user closes the dialog with the X button, `Escape`, or a click outside. Pass the state setter. |
| `title` | `ReactNode` | — | Required. The heading at the top of the dialog. Screen readers read it as the dialog name. |
| `width` | `'8000' \| '9600' \| '12800' \| 'full'` | `'9600'` | `8000`: narrow, for a short message. `9600`: standard. `12800`: wide, for a form. `full`: fills the screen with a small gap. Every width shrinks to fit a small screen. |
| `actions` | `ReactNode` | — | The buttons at the bottom, such as Cancel and Save. Put the main action last. The row stays visible while the body scrolls. |
| `disablePointerDismissal` | `boolean` | `false` | With `true`, a click outside does not close the dialog. Use it for a form with unsaved changes. |
| `children` | `ReactNode` | — | The body: text and fields. It scrolls when it is taller than the screen. |

The dialog always has an X button in the top corner. Open it with a normal Button that sets the state. Dialog accepts no other props.

## Examples

```tsx
const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Edit profile</Button>
<Dialog
  open={open}
  onOpenChange={setOpen}
  title="Edit profile"
  width="12800"
  actions={
    <>
      <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
      <Button onClick={save}>Save</Button>
    </>
  }
>
  <Field.Root>
    <Field.Label>Name</Field.Label>
    <TextInput />
  </Field.Root>
</Dialog>
```

```tsx
<Dialog open={expired} onOpenChange={setExpired} title="Session expired"
  actions={<Button onClick={signIn}>Sign in again</Button>}>
  <Text>Sign in again to keep working.</Text>
</Dialog>
```

## Contexts

The dialog shows on top of the page, outside the content around the button that opened it. It uses the page colors and mode. A `data-context`, `data-mode`, or `data-section` on an ancestor does not change it.

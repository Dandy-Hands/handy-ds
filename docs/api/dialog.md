# Dialog

## Usage

Dialog is a task that blocks the page: the user must finish or dismiss before carrying on, and the page behind is dimmed. AlertDialog is the confirm/cancel variant for destructive actions and cannot be dismissed by clicking outside. Don't use Dialog for extra detail next to a trigger — use Popover.

## Props

### Dialog.Root

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` / `defaultOpen` | `boolean` | — | The controlled / initial open state. |
| `onOpenChange` | `(open, eventDetails) => void` | — | Fires when the dialog opens or closes. |
| `modal` | `boolean \| 'trap-focus'` | `true` | `true` traps focus, locks page scroll, and dismisses on outside press (AlertDialog never dismisses on outside press). `'trap-focus'` traps focus without locking scroll. |

### Dialog.Trigger, Dialog.Close

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data-priority` | `'primary' \| 'secondary' \| 'tertiary'` | `'secondary'` | Visual weight of the trigger and close buttons. |

### Dialog.Popup

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `initialFocus` / `finalFocus` | `React.Ref` | — | Element to focus when the dialog opens / after it closes. |

`children` holds part content (backdrop, popup, title, description, close) on every part, and `render` (`ReactElement \| (props, state) => ReactElement`) replaces the rendered element on any part. All standard attributes (`id`, `aria-*`, ...) are also accepted.

## Examples

```tsx
<Dialog.Root>
  <Dialog.Trigger>Edit</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Backdrop />
    <Dialog.Popup>
      <Dialog.Title>Edit profile</Dialog.Title>
      <Dialog.Close>Done</Dialog.Close>
    </Dialog.Popup>
  </Dialog.Portal>
</Dialog.Root>
```

```tsx
<AlertDialog.Root>
  <AlertDialog.Trigger data-priority="primary">Delete</AlertDialog.Trigger>
  <AlertDialog.Portal>
    <AlertDialog.Backdrop />
    <AlertDialog.Popup>
      <AlertDialog.Title>Delete project?</AlertDialog.Title>
      <AlertDialog.Description>This removes it for everyone.</AlertDialog.Description>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Close data-priority="primary">Delete</AlertDialog.Close>
    </AlertDialog.Popup>
  </AlertDialog.Portal>
</AlertDialog.Root>
```

## Contexts

The popup is a Surface: set `data-context="on-primary"` (on a colored ground), `data-context="default"` (back to normal colors), or `data-section="hero"` on any ancestor and its tokens re-resolve automatically.

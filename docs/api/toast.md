# Toast

## Usage

Toast shows a short message in the corner of the screen that closes by itself, such as "Saved". Use it to confirm that an action finished, with an optional Undo button. Don't use it for a message that must stay readable; use Alert. Don't use it to ask a question; use AlertDialog.

## Props

### ToastProvider

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | — | The app. Place one ToastProvider around the whole app. It also shows the toasts. |

### useToast

`const toast = useToast()` returns a function. Call `toast(options)` to show a toast.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | — | Required. The message, one short sentence. For a failure, say what to do next. |
| `tone` | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` | The icon and its color. `info`: neutral news. `success`: an action finished. `warning`: something needs attention soon. `danger`: an action failed; screen readers read it at once. |
| `action` | `{ label: ReactNode; onClick: () => void }` | — | One button in the toast, such as Undo. A click runs `onClick` and closes the toast. |

A toast is always dark, on light and dark pages. It closes after a few seconds, or a little later when it has an action. It pauses while the pointer rests on it. It always has an X button. At most three toasts show at a time.

## Examples

```tsx
<ToastProvider>
  <App />
</ToastProvider>
```

```tsx
const toast = useToast();

async function remove() {
  await deleteMessage(id);
  toast({ title: 'Message deleted', tone: 'success', action: { label: 'Undo', onClick: restore } });
}

toast({ title: 'Could not save. Check your connection and try again.', tone: 'danger' });
```

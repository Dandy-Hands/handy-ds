# Toast

## Usage

Toast is a short-lived message after an action: a stacked notification in a fixed bottom-right viewport. Use it to confirm something that happened, with nothing for the user to do. Don't use it when the user must read or act on the message — use Alert or Dialog. Wrap the app in `Toast.Provider` and render `<Toaster />` once.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `type` (via `add`) | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` | The toast's color and tone. `info` — neutral notice. `success` — confirmed. `warning` — act soon. `danger` — problem. |
| `title` (via `add`) | `ReactNode` | — | Short heading of the toast. |
| `description` (via `add`) | `ReactNode` | — | Detail below the title. |
| `timeout` (via `add` or `Provider`) | `number` | `5000` | Milliseconds before auto-dismiss; `0` keeps the toast until dismissed. |
| `limit` (Provider) | `number` | `3` | Maximum toasts shown at once; extras hide until space frees. |
| `actionProps` (via `add`) | button props | — | Props for the toast's action button. |
| `render` | `ReactElement \| (props, state) => ReactElement` | — | Replaces the rendered element on any part. |
| `children` | `ReactNode` | — | Part content. |

All standard attributes (`id`, `aria-*`, ...) are also accepted.

## Examples

```tsx
// once, at the app root
<Toast.Provider><App /><Toaster /></Toast.Provider>
```

```tsx
// anywhere
const toast = Toast.useToastManager();
toast.add({ title: 'Saved', type: 'success', description: 'Your changes are live.' });
```

## Contexts

No own context handling. Feedback colors are contrast-checked in the default context; the viewport floats above the page and is not placed inside colored sections.

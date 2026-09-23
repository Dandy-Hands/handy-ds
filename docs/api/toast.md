# Toast

## Usage

Toast is a short-lived message confirming something that happened, with nothing for the user to do. Wrap the app once in `Toast.Provider` and render `<Toaster />`, then raise toasts from anywhere with `Toast.useToastManager().add(...)`. Do not use it when the user must read or act on the message — use Alert for persistent messages or Dialog for blocking ones.

## Parts

| Part | Renders | Description |
| --- | --- | --- |
| `Toast.Provider` | `<div>` | App-root wrapper that owns the toast list. Props: `timeout` (default `5000`), `limit`. |
| `Toaster` | portal + viewport | Renders every toast from the nearest Provider. Render once, inside the Provider. |
| `Toast.Content` | `<div>` | Title + Description block. |
| `Toast.Title` | `<h2>` | Bold first line. |
| `Toast.Description` | `<p>` | Supporting second line. |
| `Toast.Action` | `<button>` | Optional action button inside a toast (Action look). |
| `Toast.Close` | `<button>` | Built-in close button with an X icon. |
| `Toast.useToastManager()` | hook | Returns `{ toasts, add, close, update, promise }`. |

## Props

`Toaster`, `Toaster`'s children, and `Toaster` itself take no handy-ds props. Everything is driven by the `add()` options and Provider settings.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | — | `add()` option. The bold first line of the toast. |
| `description` | `ReactNode` | — | `add()` option. Supporting text under the title. |
| `type` | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` | `add()` option; the toast's sentiment. `info` — neutral confirmation. `success` — the action worked. `warning` — it worked, but read this. `danger` — something failed or was destructive. |
| `timeout` | `number` | `5000` | Milliseconds before auto-dismiss; `0` never dismisses. Settable per toast in `add()` and app-wide on `Provider`. |
| `priority` | `'low' \| 'high'` | `'low'` | Announcement urgency. `low` — polite. `high` — urgent. |
| `limit` | `number` | — | `Provider` only. Maximum toasts shown at once. |
| `onClick` | `(event) => void` | — | `Toast.Action` only. Fires when the toast's action button is clicked. |

## Examples

```tsx
// once, at the app root
<Toast.Provider>
  <App />
  <Toaster />
</Toast.Provider>
```

```tsx
// anywhere inside the provider
const toast = Toast.useToastManager();
toast.add({ title: 'Saved', type: 'success' });
toast.add({ title: 'Upload failed', description: 'Try again in a minute.', type: 'danger', timeout: 0 });
```

## Contexts

Toasts render in a portal outside the page tree, so ancestor context overrides do not apply; the Feedback tokens resolve in the default context.

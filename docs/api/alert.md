# Alert

## Usage

Alert is a message that stays on the page: a bordered block colored by sentiment, with an optional heading and icon. Use it when the message is part of the page and must stay readable. Don't use it for a short confirmation after an action — use Toast.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `sentiment` | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` | Message color. `info` — neutral notice. `success` — confirmed. `warning` — act soon. `danger` — problem or destructive. |
| `heading` | `ReactNode` | — | Short heading above the body. |
| `icon` | `ReactNode` | — | Icon in front of the heading, colored with the sentiment's icon color. |
| `render` | `ReactElement \| (props, state) => ReactElement` | — | Replaces the rendered element. |
| `role` | `'alert' \| 'status'` | — | Pass `alert` for urgent announcements, `status` for polite ones, when the alert appears in response to an action. |
| `children` | `ReactNode` | — | Message body. |

All standard attributes (`id`, `aria-*`, `className`, ...) are also accepted.

## Examples

```tsx
<Alert sentiment="warning" heading="Card expiring">
  Update it before 1 March.
</Alert>
```

```tsx
<Alert sentiment="success" heading="Saved" role="status">
  Your changes are live.
</Alert>
```

## Contexts

No own context handling. Feedback colors are contrast-checked in the default context; place alerts inside a `data-context="default"` container on colored sections.

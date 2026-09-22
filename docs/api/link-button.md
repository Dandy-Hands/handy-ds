# LinkButton

## Usage

LinkButton is a link that looks like a Button. Use it for navigation styled as an action, such as "View all" links or calls to action that move to another page. Use Button for actions the user takes in place, such as submitting a form.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `priority` | `'primary' \| 'secondary' \| 'tertiary'` | `'primary'` | Visual weight. `primary` — the view's main action. `secondary` — supporting actions next to the main one. `tertiary` — low-weight inline actions. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Control size. `sm` — dense toolbars and compact layouts. `md` — default. `lg` — hero and marketing contexts. |
| `href` | `string` | — | Destination URL; passed to the rendered `<a>`. |
| `render` | `ReactElement \| (props, state) => ReactElement` | — | Replaces the rendered element or composes with another component. |
| `children` | `ReactNode` | — | Label content. Icons go here — pair with the `Icon` component. |

All standard link attributes (`aria-*`, `target`, `rel`, ...) are also accepted.

## Examples

```tsx
<LinkButton href="/reports">View all reports</LinkButton>
```

```tsx
<LinkButton priority="secondary" size="sm" href="/docs">Read the docs</LinkButton>
```

## Contexts

Honors the theme's context overrides: set `data-context="on-primary"` (on a colored ground), `data-context="default"` (back to normal colors), or `data-section="hero"` on any ancestor and LinkButton's tokens re-resolve automatically.

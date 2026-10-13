# LinkButton

## Usage

LinkButton is a link that looks like a Button. Use it for navigation styled as an action, such as "View all" links or calls to action that move to another page. Use Button for actions the user takes in place, such as submitting a form. For a link inside a sentence, write a plain `<a>`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `href` | `string` | — | The destination URL. |
| `size` | `'800' \| '1000' \| '1200'` | `'1000'` | Link height. `800`: dense toolbars and compact layouts. `1000`: the standard size. `1200`: large, for hero and marketing areas. The label size follows. |
| `width` | `'auto' \| 'full'` | `'auto'` | `auto`: fits the content. `full`: fills the width of its container. |
| `render` | `ReactElement \| (props, state) => ReactElement` | — | Replaces the rendered element, such as a router link: `<LinkButton render={<RouterLink to="/reports" />}>`. |
| `children` | `ReactNode` | — | The content: text, an `Icon`, or both. Give an icon-only link an `aria-label`. |

All other standard link attributes (`target`, `rel`, `download`, `aria-*`, `onClick`, ...) and `ref` are also accepted. LinkButton has one look and takes no `variant`, `disabled`, `className`, or `style`.

## Examples

```tsx
<LinkButton href="/reports">View all reports</LinkButton>
```

```tsx
<LinkButton size="1200" width="full" href="/signup">Start free trial</LinkButton>
```

## Contexts

Honors the theme's context overrides: set `data-context="on-primary"` (on a colored ground), `data-context="default"` (back to normal colors), or `data-section="hero"` on any ancestor and LinkButton's tokens re-resolve automatically.

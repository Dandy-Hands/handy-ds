# Icon

## Usage

Icon wraps an SVG so it takes an icon role color and a size. The SVG must use `currentColor` for its stroke or fill. Don't use it for content images — use `<img>`. Omit `variant` inside a Button or Alert so the icon matches the text around it.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'default' \| 'secondary' \| 'accent'` | inherits the surrounding text color | Role color. `default` — normal icon color. `secondary` — muted. `accent` — brand accent. |
| `size` | `string` | the surrounding font size | Any CSS length, e.g. `'1.5em'`. |
| `label` | `string` | none — the icon is hidden from assistive tech | Accessible name for an icon that carries meaning on its own. |

All standard attributes (`id`, `aria-*`, `className`, ...) are also accepted.

## Examples

```tsx
<Icon label="Search"><SearchSvg /></Icon>
```

```tsx
<Icon variant="accent" size="1.5em" label="New"><StarSvg /></Icon>
```

## Contexts

Honors the theme's context overrides: set `data-context="on-primary"` (on a colored ground), `data-context="default"` (back to normal colors), or `data-section="hero"` on any ancestor and the Icon role tokens re-resolve automatically. Icons without a variant always follow the surrounding text color.

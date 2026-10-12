# Icon

## Usage

Icon shows one icon, either an SVG or a glyph name, in a text color or a status color and at a set size. An SVG must use `currentColor` for its stroke or fill. Don't use it for content images — use `<img>`. Leave `tone` unset inside a Button or Alert so the icon matches the text around it.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `tone` | `'strong' \| 'default' \| 'muted' \| 'accent' \| 'danger' \| 'warning' \| 'success' \| 'info'` | inherits the surrounding text color | Icon color. `strong` — emphasized text color. `default` — normal text color. `muted` — secondary, quieter color. `accent` — brand accent. `danger` — error status. `warning` — caution status. `success` — positive status. `info` — neutral information status. |
| `size` | `'400' \| '500' \| '600' \| '800' \| '1000' \| '1200' \| '1600' \| '2400' \| '3200'` | the surrounding font size | Icon box size as a size step. `400` is the smallest and `3200` the largest. |
| `fill` | `boolean` | `false` | Draws a glyph name filled instead of outlined. Has no effect on an SVG. |
| `label` | `string` | none — the icon is hidden from assistive tech | Accessible name for an icon that carries meaning on its own. |
| `children` | `ReactElement \| string` | — | The icon. An SVG element, or a glyph name such as `'search'`. |

All standard attributes (`id`, `aria-*`, `className`, ...) are also accepted.

## Examples

```tsx
<Icon label="Search">search</Icon>
```

```tsx
<Icon tone="success" size="600" fill label="Saved">check_circle</Icon>
<Icon tone="muted"><StarSvg /></Icon>
```

## Contexts

Honors the theme's context overrides: set `data-context="on-primary"` (on a colored ground), `data-context="default"` (back to normal colors), or `data-section="hero"` on any ancestor and the tone colors re-resolve automatically. An Icon without a tone always follows the surrounding text color.

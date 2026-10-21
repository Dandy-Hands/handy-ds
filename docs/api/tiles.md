# Tiles

## Usage

Tiles places equal-size children in as many columns as fit. Use it for a list of cards, a gallery, or a set of items that all have the same weight. Don't use it when one item must be larger or placed in a chosen column (use Grid), or for a dashboard (use Grid).

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `gap` | space step or `"none"`, or `{ base, sm, md, lg, xl }` of these | `"400"` | Space between tiles. Values are the same as Stack `gap`. |
| `minTileWidth` | `"6400" \| "8000" \| "9600" \| "12800"` | `"8000"` | The smallest width that one tile may have. The grid makes as many columns as fit, and each tile is at least this wide. A larger value gives wider tiles and fewer columns. |
| `render` | `ReactElement \| (props, state) => ReactElement` | — | Replaces the rendered element, e.g. `render={<ul />}`. |
| `children` | `ReactNode` | — | The tiles. |

Tiles in one row have the same height: each tile has the height of the tallest tile in its row. A tile fills its cell only when it is a direct child of Tiles. To keep tiles at their natural height, use Grid with `align="start"`.

All standard attributes (`id`, `aria-*`, `className`, ...) are also accepted.

## Examples

```tsx
<Tiles minTileWidth="9600">
  <Card>…</Card>
  <Card>…</Card>
  <Card>…</Card>
</Tiles>
```

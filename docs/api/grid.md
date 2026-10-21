# Grid

## Usage

Grid places children in columns. Without `cols`, it makes as many columns as fit. With `cols`, it makes that many equal columns, and `Grid.Item` sets how many columns an item covers. Use it for a dashboard or for a page layout with a chosen column count. Don't use it when all items are equal and any column count works (use Tiles).

## Props

`Grid`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `cols` | `1`–`12`, or `{ base, sm, md, lg, xl }` of these | — | Number of equal columns. Absent — as many columns as fit, each at least `minColWidth` wide. |
| `minColWidth` | `"6400" \| "8000" \| "9600" \| "12800"` | `"8000"` | The smallest width that one column may have. Used only when `cols` is absent: the grid then makes as many columns as fit, and each is at least this wide. A larger value gives wider columns and fewer of them. |
| `gap` | space step or `"none"`, or `{ base, sm, md, lg, xl }` of these | `"400"` | Space between rows and between columns. Values are the same as Stack `gap`. |
| `align` | `"start" \| "center" \| "end" \| "stretch"` | `"stretch"` | Vertical position of each item in its cell. |
| `justify` | `"start" \| "center" \| "end" \| "stretch"` | `"stretch"` | Horizontal position of each item in its cell. |
| `render` | `ReactElement \| (props, state) => ReactElement` | — | Replaces the rendered element. |
| `children` | `ReactNode` | — | The items. |

`Grid.Item`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `colSpan` | `1`–`12`, or `{ base, sm, md, lg, xl }` of these | `1` | Number of columns the item covers. A value larger than `cols` covers all columns. |
| `rowSpan` | `1`–`12`, or `{ base, sm, md, lg, xl }` of these | `1` | Number of rows the item covers. |
| `colStart` | `1`–`12`, or `{ base, sm, md, lg, xl }` of these | — | The column line where the item starts. `1` — the first column. |
| `rowStart` | `1`–`12`, or `{ base, sm, md, lg, xl }` of these | — | The row line where the item starts. |
| `align` | `"start" \| "center" \| "end" \| "stretch"`, or a responsive object | — | Vertical position of this item in its cell. Absent — the `Grid` `align`. |
| `justify` | `"start" \| "center" \| "end" \| "stretch"`, or a responsive object | — | Horizontal position of this item in its cell. Absent — the `Grid` `justify`. |
| `render` | `ReactElement \| (props, state) => ReactElement` | — | Replaces the rendered element. |
| `children` | `ReactNode` | — | The item content. |

All standard attributes (`id`, `aria-*`, `className`, ...) are also accepted. In the object form, `base` is required.

## Examples

```tsx
<Grid cols={{ base: 1, md: 2, lg: 4 }}>
  <Grid.Item colSpan={{ base: 1, lg: 2 }}><Card>Revenue chart</Card></Grid.Item>
  <Grid.Item><Card>Users</Card></Grid.Item>
  <Grid.Item><Card>Orders</Card></Grid.Item>
</Grid>
```

```tsx
<Grid cols={{ base: 1, lg: 4 }}>
  <Grid.Item colSpan={{ base: 1, lg: 3 }}>…</Grid.Item>
  <Grid.Item><Aside label="Contents">…</Aside></Grid.Item>
</Grid>
```

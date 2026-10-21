# Flex

## Usage

Flex places its children in a row or a column, with the full set of flexbox controls. Use it when Stack and Inline do not fit: a fixed item beside an item that fills the rest, or a direction that changes with the screen width. Don't use Flex when Stack or Inline does the job.

## Props

`Flex`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `direction` | `"row" \| "column" \| "row-reverse" \| "column-reverse"`, or `{ base, sm, md, lg, xl }` of these | `"row"` | The main axis. `"row"` — left to right. `"column"` — top to bottom. The reverse values flip the order. |
| `gap` | space step or `"none"`, or `{ base, sm, md, lg, xl }` of these | `"400"` | Space between children. Values are the same as Stack `gap`. |
| `wrap` | `boolean` | `true` | Children move to the next line when the line is full. `wrap={false}` keeps one line. |
| `align` | `"start" \| "center" \| "end" \| "baseline" \| "stretch"` | `"stretch"` | Position of the children on the cross axis. |
| `justify` | `"start" \| "center" \| "end" \| "between" \| "around" \| "evenly"` | `"start"` | Distribution of the children on the main axis. `"between"` — space between the children only. `"around"` — equal space around each child. `"evenly"` — equal space everywhere. |
| `render` | `ReactElement \| (props, state) => ReactElement` | — | Replaces the rendered element. |
| `children` | `ReactNode` | — | The items. |

`Flex.Item`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `grow` | `boolean` | `false` | The item takes the free space of the line. |
| `shrink` | `boolean` | `true` | The item may become narrower than its content when the line is full. `shrink={false}` keeps its width. |
| `basis` | `"auto" \| "fit" \| "full"` or a width step, or `{ base, sm, md, lg, xl }` of these | `"auto"` | The starting size of the item on the main axis. `"auto"` — the content size. `"fit"` — shrink to the content. `"full"` — 100% of the line. |
| `align` | `"start" \| "center" \| "end" \| "baseline" \| "stretch"` | — | Position of this item on the cross axis. Absent — the `Flex` `align`. |
| `render` | `ReactElement \| (props, state) => ReactElement` | — | Replaces the rendered element. |
| `children` | `ReactNode` | — | The item content. |

All standard attributes (`id`, `aria-*`, `className`, ...) are also accepted. In the object form, `base` is required.

## Examples

```tsx
<Flex gap="400" wrap={false}>
  <Flex.Item basis="8000"><img src="/team.jpg" alt="Team" /></Flex.Item>
  <Flex.Item grow><Text>A long description that fills the rest of the row.</Text></Flex.Item>
</Flex>
```

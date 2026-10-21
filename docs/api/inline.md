# Inline

## Usage

Inline places its children in one row. When the row is full, the children wrap to the next line. Use it for a row of buttons, tags, or links, or for an icon with a label. Don't use it for a column (use Stack) or for equal-size cards (use Tiles). Don't use it to put a fixed item beside long text that must fill the rest (use Flex).

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `gap` | space step or `"none"`, or `{ base, sm, md, lg, xl }` of these | `"200"` | Space between children, in the row and between lines. Values are the same as Stack `gap`. |
| `align` | `"start" \| "center" \| "end" \| "baseline" \| "stretch"` | `"center"` | Vertical position of the children in a line. `"baseline"` — text baselines line up. `"stretch"` — children fill the line height. |
| `justify` | `"start" \| "center" \| "end" \| "between"` | `"start"` | Horizontal distribution in a line. `"between"` — first child at the start, last child at the end, space between. |
| `render` | `ReactElement \| (props, state) => ReactElement` | — | Replaces the rendered element, e.g. `render={<ul />}`. |
| `children` | `ReactNode` | — | The items. |

All standard attributes (`id`, `aria-*`, `className`, ...) are also accepted.

## Examples

```tsx
<Inline gap="200" justify="between">
  <Text variant="headline" render={<h2 />}>Team</Text>
  <Button variant="primary">Invite</Button>
</Inline>
```

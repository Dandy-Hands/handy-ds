# Stack

## Usage

Stack places its children in one column with a space between them. Use it for the main flow of a page, a form, or a card body. Don't use it for a row (use Inline) or for a grid (use Tiles or Grid).

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `gap` | `"none" \| "050" \| "100" \| "200" \| "300" \| "400" \| "600" \| "800" \| "1000" \| "1200" \| "1600" \| "2400"`, or `{ base, sm, md, lg, xl }` of these | `"400"` | Space between children. `"none"` — no space. The other values are space steps; a larger number is a larger space. The object form changes the value from a screen width up. |
| `align` | `"start" \| "center" \| "end" \| "stretch"` | `"stretch"` | Horizontal position of the children. `"start"`, `"center"`, `"end"` — children keep their own width at that edge. `"stretch"` — children fill the width. |
| `render` | `ReactElement \| (props, state) => ReactElement` | — | Replaces the rendered element, e.g. `render={<ul />}`, without changing the layout. |
| `children` | `ReactNode` | — | The items. |

All standard attributes (`id`, `aria-*`, `className`, ...) are also accepted.

## Examples

```tsx
<Stack gap="600">
  <Text variant="headline" render={<h2 />}>Account</Text>
  <Text>Manage your profile and billing.</Text>
</Stack>
```

```tsx
<Stack gap={{ base: "200", md: "400" }} render={<ul />}>
  <li>One</li>
  <li>Two</li>
</Stack>
```

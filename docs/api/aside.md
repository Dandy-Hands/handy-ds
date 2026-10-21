# Aside

## Usage

Aside is a column of supporting content beside the main content: a side nav, an outline, sources, or related links. Put a `<nav>` element inside an Aside that holds navigation. Don't use it to place itself beside the main content (use Grid) and don't use it for a drawer that opens and closes.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `width` | `"6400" \| "8000" \| "9600" \| "12800" \| "full"`, or `{ base, sm, md, lg, xl }` of these | `"8000"` | Width of the column. A larger value is a wider column. `"full"` — the width of the parent. |
| `sticky` | `boolean` | `false` | The column stays in view while the page scrolls. It scrolls inside itself when it is taller than the screen. |
| `surface` | `"sunken" \| "base" \| "raised" \| "primary" \| "secondary"` | — | Background color. Absent — no background. `sunken` — below the page. `base` — the page. `raised` — above the page, like a panel. `primary`, `secondary` — the brand color; text and controls inside switch to their on-brand colors. |
| `paddingBlock` | space step or `"none"`, or `{ base, sm, md, lg, xl }` of these | `"400"` | Space above and below the content. |
| `paddingInline` | space step or `"none"`, or `{ base, sm, md, lg, xl }` of these | `"400"` | Space at the left and right edges. |
| `render` | `ReactElement \| (props, state) => ReactElement` | — | Replaces the rendered element. |
| `children` | `ReactNode` | — | The content. |

All standard attributes (`id`, `aria-*`, `className`, ...) are also accepted. Add `aria-label` to name the aside. A page with more than one aside needs a name for each.

## Examples

```tsx
<Grid cols={{ base: 1, lg: 4 }}>
  <Grid.Item colSpan={{ base: 1, lg: 3 }}>…</Grid.Item>
  <Grid.Item>
    <Aside sticky aria-label="On this page">
      <nav aria-label="Table of contents">…</nav>
    </Aside>
  </Grid.Item>
</Grid>
```

# Section

## Usage

Section is a full-width band of a page: a hero, a feature row, or a call to action. It has a background and a centered column for its content. Use it for each macro part of a page. Don't use it to group content in a box (use Card) and don't nest a Section in a Section.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `surface` | `"sunken" \| "base" \| "primary" \| "secondary"` | `"base"` | Background color. `sunken` — below the page. `base` — the page. `primary`, `secondary` — the brand color; text and controls inside switch to their on-brand colors. |
| `gradient` | `{ to, direction }` | — | The background runs from `surface` to the `to` level. `to`: `"sunken" \| "base"`, a level of the same color as `surface`. `direction`: `"to-bottom" \| "to-top" \| "to-start" \| "to-end"`. |
| `media` | `{ type: "image", src, fit, position }` or `{ type: "video", src, poster, fit, position }` | — | A background image or video. `fit`: `"cover"` — fill the band and crop. `"contain"` — show the whole picture. `position`: a keyword such as `"center"` or `"top"`. A video needs `poster`. It is muted and loops, and it stays paused for users who prefer reduced motion. |
| `scrim` | `{ tone, strength, direction? }` | — | A layer over `media` that keeps text readable. `tone`: `"dark"` for light text, `"light"` for dark text. `strength`: `"subtle" \| "medium" \| "strong"`. `direction`: as `gradient`; absent — an even layer. Always set `scrim` with `media`. |
| `background` | `ReactNode` | — | A custom layer behind the content, such as a canvas scene. It ignores pointer input and is hidden from screen readers. |
| `paddingBlock` | space step or `"none"`, or `{ base, sm, md, lg, xl }` of these | `"1600"` | Space above and below the content. |
| `paddingInline` | space step or `"none"`, or `{ base, sm, md, lg, xl }` of these | `"400"` | Space at the left and right edges. |
| `contentWidth` | `"default" \| "narrow" \| "full"` | `"default"` | Maximum width of the content column. `default` — the page content width. `narrow` — a narrower width for reading. `full` — no maximum. |
| `height` | `"auto" \| "screen"` or a CSS length such as `"60svh"` | `"auto"` | Height of the band. `screen` — the full screen height. Content can be clipped; prefer `minHeight`. |
| `minHeight` | same as `height` | `"auto"` | Smallest height of the band. |
| `align` | `"start" \| "center" \| "end"` | `"start"` | Vertical position of the content when the band is taller than the content. |
| `render` | `ReactElement \| (props, state) => ReactElement` | — | Replaces the rendered element. |
| `children` | `ReactNode` | — | The content. |

All standard attributes (`id`, `aria-*`, `className`, ...) are also accepted. Add `aria-label` to make the section a named landmark. In the object form of a responsive value, `base` is required.

## Examples

```tsx
<Section surface="primary" gradient={{ to: "sunken", direction: "to-bottom" }} minHeight="60svh" align="center">
  <Stack gap="600">
    <Text variant="display" render={<h1 />}>Build faster</Text>
    <Button variant="primary">Start</Button>
  </Stack>
</Section>
```

```tsx
<Section
  media={{ type: "image", src: "/team.jpg", fit: "cover", position: "center" }}
  scrim={{ tone: "dark", strength: "medium", direction: "to-top" }}
  contentWidth="narrow"
>
  …
</Section>
```

## Contexts

A Section with `surface="primary"` or `"secondary"` sets the brand color context for its content. Set `data-context="default"` on a child to restore normal colors there.

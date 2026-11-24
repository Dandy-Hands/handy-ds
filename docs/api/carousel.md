# Carousel

## Usage

Carousel shows a set of peer items one view at a time, with arrows, dots, swipe, and optional autoplay: case studies, products, testimonials, or hero messages. Don't use it for content every user must read, for steps of a task, or for a set that fits on the page as a grid (use Tiles or Grid).

## Props

### `Carousel`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `aria-label` | `string` | — | Required. Names the set for screen readers, such as `"Customer stories"`. |
| `effect` | `"slide" \| "peek" \| "stack" \| "fade"` | `"slide"` | How slides show and change. `slide`: slides side by side, `perView` at a time, moving sideways; use for card and product rows. `peek`: one center slide, with its neighbors partly visible at the edges, smaller and darkened. `stack`: one center slide, with its neighbors fanned behind it, smaller and darkened. `fade`: one slide at a time that crossfades in place; use for hero banners. |
| `perView` | `1 \| 2 \| 3 \| 4` or a responsive object | `1` | Number of slides in view. Only with `effect="slide"`. |
| `gap` | `"none" \| "200" \| "300" \| "400" \| "600" \| "800"` or a responsive object | `"400"` | Space between slides. Only with `slide` and `peek`. |
| `autoplay` | `boolean` | `false` | Moves to the next slide on a timer and wraps at the end. Shows a pause button. Pauses while the pointer or keyboard focus is on the carousel, and does not start for users who prefer reduced motion. |
| `interval` | `number` | `5000` | Milliseconds each slide shows during autoplay. Only with `autoplay`. |
| `duration` | `number` | `300` | Milliseconds of one change between slides. The theme's motion speed still scales it. |
| `children` | `ReactNode` | — | `Carousel.Slide` elements. |

`id`, `className`, and other `aria-*` attributes are also accepted.

### `Carousel.Slide`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | — | The slide content, such as a Card or a hero layout. |
| `aria-label` | `string` | `"1 of 6"`, ... | The slide's name. Set it only to give a better name than its position. |

`id`, `className`, and other `aria-*` attributes are also accepted.

Responsive objects use the keys `base` (required), `sm`, `md`, `lg`, and `xl`: `perView={{ base: 1, md: 3 }}`.

## Examples

```tsx
<Carousel aria-label="Featured products" perView={{ base: 1, md: 2, lg: 3 }}>
  {products.map((p) => (
    <Carousel.Slide key={p.id}>
      <Card>…</Card>
    </Carousel.Slide>
  ))}
</Carousel>
```

```tsx
<Carousel aria-label="Customer stories" effect="stack" autoplay interval={7000} duration={600}>
  <Carousel.Slide>…</Carousel.Slide>
  <Carousel.Slide>…</Carousel.Slide>
  <Carousel.Slide>…</Carousel.Slide>
</Carousel>
```

## Contexts

Honors the theme's context overrides: inside `data-context="on-primary"` or a `primary` Section, the arrows and dots re-resolve to their on-brand colors.

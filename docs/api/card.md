# Card

## Usage

Card is a box of related content on a surface ground: background, border, shadow, radius, and padding at a chosen elevation. Use it to group content that belongs together on a page. Don't use it when the content only needs spacing — use the app's own layout CSS.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `elevation` | `0 \| 1 \| 2 \| 3` | `1` | Surface level. `0` — flat, on the page ground. `1` — default card. `2` — raised, e.g. over other content. `3` — topmost, modal surfaces. |
| `render` | `ReactElement \| (props, state) => ReactElement` | — | Replaces the rendered element, e.g. `render={<article />}`, without changing the look. |
| `children` | `ReactNode` | — | Card content. |

All standard attributes (`id`, `aria-*`, `className`, ...) are also accepted.

## Examples

```tsx
<Card elevation={2}>
  <Text variant="heading" render={<h3 />}>Plan</Text>
  <Text>Everything in Free, plus…</Text>
</Card>
```

```tsx
<Card render={<article />}>…</Card>
```

## Contexts

Honors the theme's context overrides: set `data-context="on-primary"` (on a colored ground), `data-context="default"` (back to normal colors), or `data-section="hero"` on any ancestor and Card's tokens re-resolve automatically. A `data-context="default"` Card is also the way to restore normal colors inside a colored section.

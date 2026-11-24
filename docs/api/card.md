# Card

## Usage

Card is a box of related content: background, border, shadow, rounded corners, and padding at a chosen elevation. Use it to group content that belongs together, such as a product summary, a project card, or a dashboard tile. Don't use it for spacing alone (use Stack or Grid) or for a full-width page band (use Section).

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `elevation` | `"base" \| "raised" \| "floating" \| "modal"` | `"raised"` | Distance above the page. `"base"` — flat on the page with a border and no shadow (the outlined card). `"raised"` — the normal card. `"floating"` — a card over other content. `"modal"` — the topmost level. |
| `padding` | `"none" \| "200" \| "300" \| "400" \| "600" \| "800" \| "1000" \| "1200"`, or an object keyed by breakpoint | `"600"` | Space between the edge and the content. `"none"` lets a photo run to the card edge. Breakpoint keys: `base` (required), `sm`, `md`, `lg`, `xl`. |
| `render` | `ReactElement \| (props, state) => ReactElement` | — | Replaces the rendered element without a change to the look, e.g. `render={<article />}`. A link or a button element makes the whole card clickable: its border changes color on hover. |
| `children` | `ReactNode` | — | Card content. |

All standard attributes (`id`, `aria-*`, `className`, ...) are also accepted.

## Examples

```tsx
<Card>
  <Stack gap="200">
    <Text variant="headline" render={<h3 />}>Pro plan</Text>
    <Text>Everything in Free, plus team seats.</Text>
  </Stack>
</Card>
```

```tsx
<Card elevation="base" padding={{ base: '400', md: '600' }} render={<a href="/projects/kitchen" />}>
  <Text variant="headline" render={<h3 />}>Kitchen remodel</Text>
</Card>
```

Do not put another link or a button inside a card that is a link.

## Contexts

Inside a colored section (`data-context="on-primary"`, `data-context="on-secondary"`, or a `data-section` mapped to one), a card is a darker brand panel and its content re-resolves automatically. Put `data-context="default"` on the card for the normal light look, for example around a form.

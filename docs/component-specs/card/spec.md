# Internal Spec: Card

- Status: docs-built
- Date: 2026-09-23
- Interview: `interview-guide-2026-09-23.md` (retroactive)
- Base UI version documented from: `@base-ui/react` 1.8.0 (no card primitive — `useRender` + `mergeProps`)
- Code: `src/components/Card.tsx` + `Card.css` (+ shared `surface.css`)

## Description

Card is a box of related content on a Surface ground: background, border, shadow, radius, and padding at a chosen elevation. It has no Base UI primitive — it is a `useRender` component with the same `render` prop as Base UI parts. Use Card to group content that belongs together; use the app's own layout CSS when content only needs spacing.

## Usage

- Do use Card for grouped content: a settings block, a product summary, a dashboard tile.
- Don't use it for pure spacing — layout CSS belongs to the app.
- Do pick the lowest elevation that separates the card from its ground.
- Inside a colored section, put `data-context="default"` on a Card to restore normal colors.

## Base UI API

No Base UI primitive. Card is a single-part `useRender` component (`useRender.ComponentProps<'div'>` + `mergeProps`):

| Surface | Decision |
| --- | --- |
| `render` | Exposed — swap the element (`<article />`, a `RouterLink`, ...) without changing the look. |
| Native `div` props (`id`, `aria-*`, `className`, `style`, ...) | Exposed — full passthrough. |
| Callback-form `className` / `style` | Available via passthrough, not documented. |

## Extension API

| Prop | Type | Default | Decision |
| --- | --- | --- | --- |
| `elevation` | `0 \| 1 \| 2 \| 3` | `1` | Existing axis. Sets `data-elevation`; `surface.css` maps it to the elevation's color triple. |

## Token mapping

| Part | Tokens |
| --- | --- |
| Ground (per elevation) | `hds/sem/surface/color/{0,1,2,3}/default/{bg,border,shadow}` |
| Measure | `hds/sem/surface/measure/{padding,radius,border-width}` |
| Content text color | `hds/sem/type/color/body/fg` (children pick their own roles with `Text`) |

Notes:

- No primitive or driver references; the card's `display: block` is structural.
- Context-passive: a Card inside `data-section`/`data-context` re-resolves automatically; `data-context="default"` on the card itself is the explicit reset.

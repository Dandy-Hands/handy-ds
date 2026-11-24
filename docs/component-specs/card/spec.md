# Internal Spec: Card

Status:
- spec: reviewed
- code: built
- figma: built
- docs: built

- Date: 2026-11-23 (re-interview; replaces the retroactive spec of 2026-09-23)
- Interview: `interview-guide-2026-11-23.md`
- Base UI version documented from: `@base-ui/react` 1.8.0 (no card primitive; `useRender` + `mergeProps`)
- Code: `src/components/Card.tsx` + `Card.css` (+ shared `surface.css`)

## Description

Card is a box of related content on a Surface ground: background, border, shadow, radius, and padding at a chosen elevation. It has no Base UI primitive. It is a `useRender` component with the same `render` prop as Base UI parts. A card whose element is a link or a button shows a hover border, with no prop.

## Usage

- Do use Card for grouped content: a settings block, a product summary, a project card, a dashboard tile.
- Don't use it for spacing alone (use Stack or Grid), or for a full-width page band (use Section).
- Do pick the lowest elevation that separates the card from its ground. `base` is the flat, outlined card.
- Do make a whole card clickable with `render={<a href="…" />}` (or a router link). Don't put a second link or a button inside a card that is a link.
- Inside a colored section, a card is a darker brand panel. Put `data-context="default"` on the card for the light look, for example around a form.

## Base UI API

No Base UI primitive. Card is a single-part `useRender` component (`useRender.ComponentProps<'div'>` + `mergeProps`).

| Surface | Decision |
| --- | --- |
| `render` | Exposed. Swaps the element (`<article>`, `<li>`, `<a>`, a router link) without a change to the look. Kept under the proposed `render` rule (`.claude/TODO.md`): the element varies by context. |
| Native `div` attributes (`id`, `aria-*`, `className`, `data-*`, ...) | Exposed, full passthrough. |
| `style` | Removed from the type (`Omit<..., 'style'>`), per `api-conventions.md` section 1. |
| Callback-form `className` | Available through passthrough, not documented. |

## Extension API

| Prop | Category | Type | Default | Decision |
| --- | --- | --- | --- | --- |
| `elevation` | Axis | `'base' \| 'raised' \| 'floating' \| 'modal'` | `'raised'` | Replaces `0 \| 1 \| 2 \| 3` (api-conventions sections 4 and 6). Set as `data-elevation`. `base` is the flat, outlined card (proposal 2026-11-06 item 11; no `variant="outline"`). `sunken` is not allowed: a well is not a card. |
| `padding` | Measure | `Responsive<'none' \| '200' \| '300' \| '400' \| '600' \| '800' \| '1000' \| '1200'>` | `'600'` | New. Uses: `none` for a photo to the card edge, `300`/`400` for small dashboard tiles. Responsive (api-conventions 5.3) through `responsive('padding', value, spaceValue)`; `data-padding` shows the `base` value. |
| `children` | Content | `ReactNode` | — | Card content. |

Behavior with no prop:

- **Hover.** When the rendered element is `a[href]` or `button`, `:hover` changes the border color to `color/surface/hover/border`. Other elements have no hover. The transition reads `motion/control/{duration,easing}`.
- **Focus.** A link or button card gets the standard focus ring from `base.css`.

Rejected:

- `variant="outline"`: `elevation="base"` already gives a flat card with a border.
- `interactive` boolean: the element decides. A second way to turn on the hover is a second method for one task.
- Always reset a card to default colors in a colored section: decided 2026-11-23 to keep the brand panel. `data-context="default"` is the reset. Closes the "Needs review" entry in `.claude/decisions.md`.
- Parts (`Card.Header`, `Card.Body`, `Card.Footer`): Stack and Text inside the card cover them.

## Token mapping

| Part | Tokens |
| --- | --- |
| Ground (per `elevation`) | `hds/sem/color/surface/{base,raised,floating,modal}/bg` |
| Border color (per `elevation`) | `hds/sem/color/surface/{base,raised,floating,modal}/border` |
| Border color, hover (link or button card) | `hds/sem/color/surface/hover/border` (new, see below) |
| Shadow | `base`: none. `raised`, `floating`, `modal`: `hds/sem/elevation/{raised,floating,modal}` |
| Border width | `hds/sem/border/container` |
| Radius | `hds/sem/radius/container` |
| Padding | `hds/sem/measure/space/{padding}` (`none` = `0`) |
| Text color | `hds/sem/color/content/default/fg` (children pick their own roles through Text) |
| Hover transition | `hds/sem/motion/control/duration`, `hds/sem/motion/control/easing` |
| Focus ring | `base.css` (`hds/sem/color/focus/ring`, `hds/sem/border/focus`) |

New token (token spec change, 2026-11-23):

- `hds/sem/color/surface/hover/border`: one token, no level axis. Default pick `primary/600`. Brand context override `neutral/50`. The token spec records it in sections 6.3, 7.1, 7.2, 7.3, and 7.8. The code phase adds it to `names.ts` and `picks.ts`.

Notes:

- This mapping replaces the provisional mapping (token spec section 9, item 5).
- No primitive or driver references. `display: block` is structural.
- Context-passive: a Card inside `data-section` or `data-context` re-resolves through the theme.

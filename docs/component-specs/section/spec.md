# Internal Spec: Section (with Header and Footer)

Status:
- spec: reviewed
- code: pending
- figma: pending
- docs: pending

- Date: 2026-10-20
- Interview: brainstorm and interview, see `.claude/decisions.md` ("Layout and page-building components").
- Set: page-building component. `Header` and `Footer` are separate components with the same props and implementation as `Section`. Each renders its own native element and has its own short spec: `docs/component-specs/header/spec.md` and `docs/component-specs/footer/spec.md`.
- Code (planned): `src/components/Section.tsx` + `Section.css`; `Header` and `Footer` are thin wrappers in the same file.

## Description

Section is a full-width band of a page. It has a background (a surface color, a gradient, an image, a video, or a custom layer), vertical and side padding, and a centered inner column with a maximum width. Header and Footer are the same band for the top and bottom of a page, rendered as `<header>` and `<footer>`. Section has no Base UI primitive. It is a `useRender` component with the same `render` prop as Base UI parts.

## Usage

- Do use Section for each macro part of a page: a hero, a feature row, a call to action.
- Do use Header for the page header and Footer for the page footer.
- Don't use it to group content in a box. Use `Card`.
- Don't nest a Section in a Section. The inner column already has a width.
- Do put a layout component (`Stack`, `Grid`) inside for the content.

## Base UI API

No Base UI primitive. `useRender.ComponentProps<'section'>` (`'header'` and `'footer'` for the other two) + `mergeProps`:

| Surface | Decision |
| --- | --- |
| `render` | Exposed. |
| Native element props (`id`, `aria-*`, `className`, `data-section`, ...) | Exposed. `style` is removed from the type. `aria-label` names the landmark: a `<section>` is a landmark only with an accessible name. There is no `label` prop (decided 2026-10-20). |

## Extension API

| Prop | Type | Default | Decision |
| --- | --- | --- | --- |
| `surface` | `"sunken" \| "base" \| "primary" \| "secondary"` | `"base"` | Axis (new, see `docs/api-conventions.md` section 6). Background color. No `raised`: raised is the level of a card, a popup, or a modal, not of a band (decided 2026-10-20). `primary` and `secondary` set `data-context="on-primary"` or `"on-secondary"` on the element, so children re-resolve to their on-primary tokens. No `context` or `mode` prop: the page sets the mode. |
| `gradient` | `{ to: "sunken" \| "base", direction: "to-bottom" \| "to-top" \| "to-start" \| "to-end" }` | absent | The background runs from `surface` to the `to` level of the same context. |
| `media` | `{ type: "image", src, fit, position }` or `{ type: "video", src, poster, fit, position }` | absent | A background image or video. `fit`: `"cover" \| "contain"`. `position`: a keyword such as `"center"` or `"top"`. Decorative: no alt text. Video: `poster` required, muted, loops, no controls, paused under `prefers-reduced-motion`, not loaded on a data-saver connection. |
| `scrim` | `{ tone: "dark" \| "light", strength: "subtle" \| "medium" \| "strong", direction?: gradient direction }` | absent | A layer between the media and the content that keeps text readable. `direction` absent: an even layer. **`tone` also sets the mode of the section (decided 2026-10-20):** `dark` sets `data-mode="dark"`, so the text inside is light; `light` sets `data-mode="light"`, so the text is dark. Limit: a mode element re-declares every color token, so it resets a brand context above it (token spec 6.1). |
| `background` | `ReactNode` | absent | A custom layer behind the content (a canvas, WebGL, or Lottie scene). `aria-hidden`, `pointer-events: none`, sits above `media` and below `scrim`. **Breaks `docs/api-conventions.md` section 1** (slot props are only `start` and `end`; `background` is banned as a style prop). Decided by the user on 2026-10-20 to ignore the convention for now; the convention needs an amendment. |
| `paddingBlock` | space step or `"none"`, or a responsive object | `"1600"` | Space above and below the content. |
| `paddingInline` | space step or `"none"`, or a responsive object | `"400"` | Space at the left and right edges (the gutter). |
| `contentWidth` | `"default" \| "narrow" \| "full"` | `"default"` | Maximum width of the inner column. `default`: the `layout.contentWidth` driver. `narrow`: the `layout.contentWidthNarrow` driver. `full`: no maximum. |
| `height` | `"auto"`, `"screen"`, or a CSS length string | `"auto"` | Height of the band. `screen` is `100svh`. **A CSS length is not token-based (decided by the user).** A fixed height can clip content: prefer `minHeight`. |
| `minHeight` | same as `height` | `"auto"` | Smallest height of the band. |
| `align` | `"start" \| "center" \| "end"` | `"start"` | Vertical position of the content in a tall band. |

`Header` only:

| Prop | Type | Default | Decision |
| --- | --- | --- | --- |
| `sticky` | `boolean` | `false` | The header stays at the top of the screen while the page scrolls. A sticky header floats above the content that scrolls beneath it, so it gets the `elevation/raised` shadow (decided 2026-10-20). The color stays the `surface` value. |

`media`, `scrim`, and `background` are mutually compatible, in this order from back to front: `surface` color or `gradient`, `media`, `background`, `scrim`, content. A caller may set `media` and `background` together; the spec does not forbid it.

## Token mapping

| Prop | Tokens |
| --- | --- |
| `surface` | `hds/sem/color/surface/{sunken,base}/bg`; `primary` and `secondary` use `surface/base/bg` inside the brand context |
| `gradient` | the same `surface/{level}/bg` tokens, for both stops |
| `scrim` | `hds/sem/color/overlay/media/{tone}/{strength}` (added 2026-10-20) |
| `paddingBlock`, `paddingInline` | `hds/sem/measure/space/{step}` |
| `contentWidth` | `hds/sem/measure/width/content`, `hds/sem/measure/width/content-narrow` (**new tokens, driven by `layout.contentWidth` and `layout.contentWidthNarrow`**) |
| Content text color | `hds/sem/color/content/default/fg` |
| Sticky header shadow | `hds/sem/elevation/raised` |

No primitive or driver references. `height` and `minHeight` are CSS lengths from the caller.

## Contrast

- Text on `surface` and on both `gradient` stops: the contrast checker covers `surface/{level}/bg` against content text in each context. Pairs: `surface/{sunken,base}` in the default context and in each brand context.
- Text over `media`: the image is client content, so the real result is unknown. The checker tests `content/default/fg` of the section mode against the scrim over pure white (dark tone) and pure black (light tone). `strong` passes 4.5:1 and `medium` passes 3:1. `subtle` is not checked. This is a worst case, not a guarantee.

## CSS

- The band is the element (`hds-section`). A media layer, a background layer, and a scrim layer are absolutely positioned children. An inner element (`hds-section__content`) holds `children`, centered, with `max-width` from the content width token and `padding-inline` from `paddingInline`.
- Axes are data attributes: `data-surface`, `data-content-width`, `data-align`. Responsive values use private custom properties (`--_padding-block-md`), per `docs/api-conventions.md` section 5.3.
- The gradient is `linear-gradient(in oklch <direction>, <surface bg>, <to bg>)`. Both stops are computed inside the brand context.
- Video uses a `<video>` with `muted`, `loop`, `playsInline`, `poster`, and `preload="none"` under data-saver; JS pauses it when `prefers-reduced-motion: reduce` matches.

## Open

- **`background` slot** breaks a convention (see above).
- **Scrim over a gradient or surface only:** allowed (the scrim is independent of `media`). Keep or restrict? It is harmless.
- **Nested contexts:** a `surface="primary"` Section inside a `surface="primary"` Section is already `on-primary`. The inner one sets the same attribute again. No visible change, so no rule is needed.

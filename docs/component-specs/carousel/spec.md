Status:
- spec: reviewed
- code: pending
- figma: pending
- docs: pending

# Internal Spec: Carousel

- Date: 2026-10-29
- Interview: `interview-guide-2026-10-28.md`
- Base UI version documented from: `@base-ui/react` 1.8.0. Base UI has no carousel primitive.
- Category: Content
- Demo: https://claude.ai/artifact/ApjtMyC3tvcMBWp7LXE1aV (prototype; moves every effect with transforms)

## Description

Carousel shows a set of slides one view at a time, with previous and next buttons, dots, swipe, and optional autoplay. It is built for marketing pages: a card row, a hero slideshow, a center slide with its neighbors at the edges, a fanned stack, or a crossfade. The `effect` prop picks one of these, and each effect is one value, so no prop combination can break. It uses no library: native CSS scroll snap moves `slide` and `peek`, and the component's own swipe code moves `stack` and `fade`.

## Usage

- Do use Carousel for a set of peer items that the user browses: case studies, products, testimonials, hero messages.
- Do give it an `aria-label` that names the set ("Customer stories").
- Don't use it to hide content that every user must read. Users rarely see slides after the first.
- Don't use it for steps of a task (use a form or Tabs) or for a grid that fits on the page (use Tiles or Grid).
- Don't put a Carousel in a Section `background`. That layer takes no pointer input.

## Base UI API

None. Base UI has no carousel. `Carousel` is a function component that renders a `section`. `Carousel.Slide` is a function component that renders a `div`.

| Surface | Decision |
| --- | --- |
| `render` | Omitted on both. The root is always a `section` (a named region); a slide is always a box the carousel positions. |
| Native `section` props on `Carousel` (`id`, `aria-*`, `className`) | Passed through. `style` is removed. |
| Native `div` props on `Carousel.Slide` (`id`, `aria-*`, `className`) | Passed through. `style` is removed. |

## Extension API

### `Carousel`

| Prop | Type | Default | Decision |
| --- | --- | --- | --- |
| `aria-label` | `string` | — (required) | The name of the carousel for screen readers. Required in the type. |
| `effect` | `"slide" \| "peek" \| "stack" \| "fade"` | `"slide"` | Behavior. `slide`: slides side by side, `perView` at a time, moving sideways. `peek`: one center slide; the neighbors show partly at the two edges, smaller, under a wash. `stack`: one center slide; the neighbors sit partly behind it, smaller, under a wash that gets darker with depth. `fade`: one slide; slides crossfade in place. |
| `perView` | `Responsive<1 \| 2 \| 3 \| 4>` | `1` | Count of slides in view. `slide` only; the type allows it only with `effect="slide"` (or no `effect`). |
| `gap` | `Responsive<"none" \| "200" \| "300" \| "400" \| "600" \| "800">` | `"400"` | Space between slides, `measure/space` step. `slide` and `peek` only; the type rejects it on `stack` and `fade`. |
| `autoplay` | `boolean` | `false` | Behavior. Moves to the next slide every `interval`. Rules below. |
| `interval` | `number` | `5000` | Milliseconds on each slide during autoplay. Allowed only with `autoplay`. Exception to "no raw numbers" (api-conventions section 4). |
| `duration` | `number` | `300` | Milliseconds of one change between slides. Exception to "no raw numbers". The component writes it as a multiple of the motion token (below), so the theme still scales it. |
| `children` | `ReactNode` | — | `Carousel.Slide` elements. |

`effect`, `perView`, `gap`, and `interval` use a discriminated union, so an agent cannot write a combination that does not work (`perView` with `peek`, `gap` with `fade`, `interval` without `autoplay`).

### `Carousel.Slide`

| Prop | Type | Default | Decision |
| --- | --- | --- | --- |
| `children` | `ReactNode` | — | The slide content: a Card, an image, a full hero layout. |
| `aria-label` | `string` | `"{n} of {total}"` | The slide's name. The default comes from its position; set it only for a better name. |

Removed during the interview: `dim` (always on for `peek` and `stack`), `transition` and `layout` (merged into `effect`).
Not included: a controlled slide index, `loop` (scroll snap cannot wrap), custom arrows, more effects (add when a page needs one).

## Controls

A bar under the slides, in this order: previous button, dots, pause button (autoplay only), next button.

- **Buttons:** library `Button`, `variant="secondary"`, `size="800"`, icon only, with `aria-label` ("Previous slide", "Next slide", "Pause autoplay" / "Start autoplay"). Icons: `chevron_left`, `chevron_right`, `pause`, `play_arrow`.
- **Dots:** one button per page of slides. A page is each start position: `total - perView + 1` for `slide`, `total` for the other effects. The current dot has `aria-current="true"` and is wider. Each dot button is `measure/size/600` square (24px target); the mark inside is small. Label: "Go to slide {n}".
- **One page only** (all slides fit in view): no bar, no autoplay.
- **Ends:** with autoplay off, the previous button is disabled on the first page and the next button on the last page. With autoplay on, both wrap.

## Autoplay

- Moves one page every `interval`. Wraps from the last page to the first.
- The pause button is always shown when `autoplay` is on (WCAG 2.2.2). It toggles between pause and play.
- The timer stops while a mouse pointer is over the carousel, or while keyboard focus is inside it, and starts again when they leave. A swipe or an arrow press restarts the timer.
- Under `prefers-reduced-motion: reduce`, autoplay does not start. The button shows the play state, so the user can start it.
- While autoplay runs, the slide area has `aria-live="off"`. Otherwise it has `aria-live="polite"`, so a manual change is announced.

## Behavior

- **`slide` and `peek`:** the slide row is a native scroll container with `scroll-snap-type: x mandatory` and the scroll bar hidden. Swipe, trackpad, and keyboard scrolling work with no script. Buttons, dots, and autoplay call `scrollTo` with `behavior: "smooth"` (or `"auto"` under reduced motion). An `IntersectionObserver` sets the current page from the scroll position.
- **`peek`:** each slide is 80% of the row width, centered with `scroll-snap-align: center`. Slides that are not current scale to 0.86.
- **`stack` and `fade`:** every slide sits in the same grid cell (`grid-area: 1 / 1`), so the carousel is as tall as its tallest slide. The component positions slides with transforms and opacity. Pointer events give swipe and drag: a move of more than 40px changes the slide. `touch-action: pan-y` keeps vertical page scroll.
- **`stack`:** each slide is 66% of the row width. A slide `d` places from the current one moves `d × 32%` of its width sideways, scales to `1 − 0.14 × |d|`, and sits under the slides nearer the center (`z-index`). Slides more than 2 places away are hidden.
- **Wash:** in `peek` and `stack`, each slide that is not current has a layer over it (`::after`, `pointer-events: none`). The slides stay opaque.
- **Focus:** slides out of view get `inert` and `aria-hidden`, so Tab skips their content.
- **Height:** content sets the height. The carousel sets no fixed height.
- Literal values (80%, 66%, 32%, 0.86, 0.14, 40px) are structure, not theme.

## Token mapping

| Use | Token |
| --- | --- |
| Gap between slides | `hds/sem/measure/space/{gap}` |
| Gap between the slides and the control bar, and between controls | `hds/sem/measure/space/300` |
| Wash, one place from the center (`peek` and `stack`) | `hds/sem/color/overlay/media/dark/medium` |
| Wash, two places from the center (`stack`) | `hds/sem/color/overlay/media/dark/strong` |
| Change between slides (move, scale, crossfade, wash) | `hds/sem/motion/container/duration` × (`duration` / 300), `hds/sem/motion/container/easing` |
| Slide corners (clips the wash) | `hds/sem/radius/container` |
| Dot mark, not current | `hds/sem/color/graphic/divider/strong` |
| Dot mark, current | `hds/sem/color/action/primary/default/bg` |
| Dot mark, hover | `hds/sem/color/content/muted/fg` |
| Dot mark size | `hds/sem/measure/size/200` (current: width `hds/sem/measure/size/600`) |
| Dot mark change | `hds/sem/motion/control/duration`, `hds/sem/motion/control/easing` |
| Buttons | the Button tokens (`secondary`, size `800`) |
| Focus ring | from `base.css` |

`duration` is written as `calc(var(--hds-sem-motion-container-duration) * {duration / 300})`. The `motion.duration` driver then scales it, and reduced motion sets it to `0ms`.

## Open

- A Section `media` slideshow (images that crossfade behind a band, no controls) is a separate TODO item. It can reuse the `fade` code.

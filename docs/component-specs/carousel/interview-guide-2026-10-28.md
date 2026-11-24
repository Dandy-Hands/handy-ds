# Interview Guide: Carousel

- Status: complete
- Started: 2026-10-28
- Component: Carousel (new, library only, `src/components/Carousel.tsx` + `Carousel.css`)
- Base UI version documented from: `@base-ui/react` 1.8.0. Base UI has no carousel primitive, so no Base UI props apply.
- Note: Claude proposes the props, per the user's standing preference (the user leans on Claude for props and confirms the result).
- Demo: https://claude.ai/artifact/ApjtMyC3tvcMBWp7LXE1aV (prototype; moves every effect with transforms).

## 1. Direction

- [x] Q1: Library or native scroll?
  > Claude's call: no library. Native CSS scroll snap moves `slide` and `peek`. `stack` and `fade` cannot scroll natively, so they get the component's own swipe and drag code (with a Playwright test).
- [x] Q2: Autoplay in v1?
  > User: "Yes, the carousel needs autoplay in version one." Claude recommended against it; the user overruled. Details in section 3.
- [x] Q3: What kinds of carousel?
  > User: "You know we're building this for marketing websites right we're gonna need both" (peek and stack). User asked for "slides that are not focused to shrink" and for a fade.
- [x] Q4: Slide part or plain children?
  > User asked: "Are you sure that we don't need a slide component?" Claude changed the proposal to a `Carousel.Slide` part: plain children break with fragments and with components that return several slides, and Swiper and Embla use a slide part.
- [x] Q5: Layout prop plus transition prop, or one prop?
  > User first asked for a `transition` prop with crossfade as one value, then asked whether all could go in one prop. Claude recommended one prop, `effect`: every transition except a sideways move needs one slide in view, so the two props cannot combine freely. User agreed that peek and crossfade do not work together. Name `effect` follows Swiper and Animate.
- [x] Q6: Dim slides out of focus?
  > Claude proposed a `dim` boolean. User: "Let's remove the dim prop and just have it on by default for peak." Then for stack: "it's dim should not be a transparency ... It's dim should be more of a overlay or a scram or wash over the under slides." User agreed to the same wash for `peek`.

## 2. Base UI props

None. Base UI has no carousel.

## 3. Extension props

- [x] `children`: `Carousel.Slide` elements.
- [x] `effect`: `"slide" | "peek" | "stack" | "fade"`, default `"slide"`. `peek` and `stack` shrink the slides out of focus and put a dark wash over them. `fade` crossfades one slide in place.
- [x] `perView`: count of slides in view, responsive, `slide` only. Default `1`.
- [x] `gap`: space between slides, `measure/space` step, responsive (`slide` and `peek`). Default `"400"`. Claude's call.
- [x] `autoplay`: boolean. Pause button always shown, stops on hover and focus, wraps, does not start under reduced motion. User: "All the rest looks good."
- [x] `interval`: number, milliseconds, default `5000`. User: "I think we should make interval a numeric prop because the slideshow might be large and it might be small. It might be subtle or it might be aggressive."
- [x] `duration`: number, milliseconds, default `300`. User: "We'll also need a transition duration prop for the same reason." Written as a multiple of `motion/container/duration`, so the driver and reduced motion still apply. Recorded as an exception in `docs/api-conventions.md` section 4.
- [x] `aria-label`: the carousel's name (native attribute, as on Aside).
- [x] Removed: `dim` (always on for `peek` and `stack`), `transition` and `layout` (merged into `effect`).

## 4. Token mapping

- [x] Previous, next, and pause buttons: the library Button, `secondary`, size `800` (Claude's call).
- [x] Wash over slides out of focus: `color/overlay/media/dark/medium` (one place from the center), `color/overlay/media/dark/strong` (two places).
- [x] Movement and crossfade: `motion/container/duration` (scaled by `duration`) and `motion/container/easing`.
- [x] Dots: `graphic/divider/strong` (not current), `action/primary/default/bg` (current), `content/muted/fg` (hover). Claude's call.

## 5. Related (user agreed 2026-10-29)

- Section has no slideshow background. A Section `media` slideshow is a separate TODO item.
- Section background video has no pause control (WCAG 2.2.2). Added to the TODO.

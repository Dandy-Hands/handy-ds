# Internal Spec: Animate

Status:
- spec: reviewed
- code: built
- figma: skipped (Figma cannot play the effects; decided 2026-10-28)
- docs: built

- Date: 2026-10-28
- Interview: `interview-guide-2026-10-28.md`
- Category: Page building

## Description

Animate plays a one-time entrance animation on each of its children: when the child scrolls into view, or when it first appears. It has no box of its own (`display: contents`), so it never changes the layout around it. It has no Base UI primitive and no animation library: CSS keyframes do the motion, and an `IntersectionObserver` starts the `view` trigger. All timing comes from the motion tokens, so the `motion.duration` driver speeds up, slows down, or turns off every animation.

## Usage

- Do use Animate around page sections, cards, or a list of items that enter the page.
- Do use `trigger="mount"` for content that appears after the page loads: a lazy-loaded section, a result list, a new route.
- Don't use it for hover, press, or open and close effects. Those belong to each component.
- Don't use it around one inline word or a text node. It animates element children only.

## Base UI API

None. Base UI has no animation primitive. Animate is a plain function component that renders one `div`.

| Surface | Decision |
| --- | --- |
| `render` | Omitted. The element has `display: contents`, so a different element adds nothing. |
| Native `div` props (`className`, `id`, `aria-*`) | Omitted. The element has no box to style or label. |

## Extension API

| Prop | Type | Default | Decision |
| --- | --- | --- | --- |
| `effect` | `"fade" \| "fade-up" \| "scale"` | `"fade-up"` | Behavior. The start state of each child. `fade`: opacity 0 to 1. `fade-up`: opacity, and a move up from `measure/space/400` below. `scale`: opacity, and scale from 0.96 to 1. |
| `trigger` | `"view" \| "mount"` | `"view"` | Behavior. `view`: each child animates when it first enters the viewport. A child that is already in view when Animate mounts shows at once, with no animation. This prevents a flash on a server-rendered page. `mount`: each child animates when it is added to the page. |
| `stagger` | `boolean` | `false` | Behavior. Children that start together start one after another, `motion/enter/stagger` apart. The delay stops growing after 8 children. |
| `children` | `ReactNode` | — | Content. Each direct element child animates by itself. |

Each animation runs one time. It does not run again when the child scrolls out of view and back in.

## Token mapping

| Use | Token |
| --- | --- |
| Animation length | `hds/sem/motion/enter/duration` |
| Animation curve | `hds/sem/motion/enter/easing` |
| Delay between staggered children | `hds/sem/motion/enter/stagger` |
| `fade-up` start offset | `hds/sem/measure/space/400` |

The scale start value (0.96) is a literal: it is structure, not theme.

## Behavior

- **No JavaScript, or before hydration:** the `view` children are visible. Only the script hides a child, and only a child that is out of view at mount. Content is never lost when the script fails.
- **`view`:** one `IntersectionObserver` per Animate observes each element child (`threshold: 0.1`). A child that enters gets `data-visible`, and the observer stops watching it. With `stagger`, the children in one observer callback get the index 0, 1, 2, ... in DOM order, written as `--_i`.
- **`mount`:** pure CSS. The animation runs on each child when the browser inserts it. With `stagger`, `:nth-child` rules set `--_i` for children 1 to 8.
- **Reduced motion:** the theme sets every motion duration to `0ms` under `prefers-reduced-motion: reduce` (token spec 7.9). Animate needs no rule of its own: the child appears at once.
- **New children** added later animate by the same trigger. The observer watches them through a `MutationObserver` on the Animate element.

## CSS

Class `hds-animate`, axes `data-effect`, `data-trigger`, `data-stagger`. Keyframes `hds-animate-fade`, `hds-animate-fade-up`, `hds-animate-scale` animate from the start state to the natural state, with `animation-fill-mode: backwards`, so after the animation the child's own transform and opacity apply again (a Card hover transform still works). A `view` child waits with `data-pending` (opacity 0) until it gets `data-visible`.

## Open

- A `trigger="idle"` (after the page finishes loading) is possible later, with no API change.

# Interview Guide: Animate

- Status: complete
- Started: 2026-10-28
- Component: Animate (new, `src/components/Animate.tsx` + `Animate.css`)
- Base UI version documented from: `@base-ui/react` 1.8.0. Base UI has no animation primitive, so no Base UI props apply.
- Note: The user gave the direction in conversation (2026-10-28) and answered the token questions. Claude decided the props, per the user's standing preference (the user leans on Claude for props and confirms the result).

## 1. Direction (user, 2026-10-28)

- [x] Q1: Built into each component, or applied from outside?
  > Outside. "I imagine that there could be some sort of technique where the animations are not directly integrated into the components." Example given: lazy-loaded sections with an entrance animation.
- [x] Q2: Animation library?
  > "no lib now." CSS keyframes plus `IntersectionObserver`. Motion (the library) stays the upgrade path for gesture, spring, or layout animations.
- [x] Q3: Name and scope?
  > `Animate` with a `trigger` prop, so it can take new triggers later. Hover and press stay inside each component (a wrapper hover misses keyboard focus and fights component state styles). Scroll-linked motion (parallax, progress) is a separate component, built only when a page needs it.

## 2. Tokens (user, 2026-10-28)

- [x] Q4: Motion token type?
  > Yes ("Motion token sounds good").
- [x] Q5: Which roles?
  > "Enter + state": tokens for entrance animation and for component state transitions. The literal transition timings in the components move to the tokens, so one driver controls all motion. Claude named the state roles `control` and `container`, after the radius and border roles.
- [x] Q6: Driver?
  > One multiplier, `motion.duration`. 1 is the default, 2 is twice as slow, 0 turns motion off.
- [x] Q7: Figma?
  > Skip. Figma cannot play the effects, and Figma variables cannot apply durations. No component page and no motion variables.

## 3. Props (Claude's calls)

- [x] `effect`: `"fade" | "fade-up" | "scale"`, default `"fade-up"`.
- [x] `trigger`: `"view" | "mount"`, default `"view"`.
- [x] `stagger`: boolean. Children that start together start one after another.
- [x] No `render`, no `className`, no native props: the element has `display: contents`, so it has no box to style.
- [x] No `delay` or `duration` props: timing comes from the motion tokens only.

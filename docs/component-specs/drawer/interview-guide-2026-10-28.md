# Drawer — Spec Interview Guide (2026-10-28)

New component (`[new]` in `.claude/component-interview-todo.md`). Sixth of the Tier 4 overlay set. No code,
docs page, or Figma exists. Wraps `Drawer` from `@base-ui/react/drawer`. Model: the Dialog interview (2026-10-28).

Base UI version documented from: `@base-ui/react` 1.8.0.

Base UI facts:
- Parts: `Root`, `Trigger`, `Portal`, `Backdrop`, `Viewport`, `Popup`, `Content`, `Title`, `Description`,
  `Close`, `SwipeArea` (an edge zone that opens the drawer with a swipe), `Indent` and `IndentBackground` (the
  page shrinks back behind the drawer), `Provider`, `VirtualKeyboardProvider`, plus `createHandle` / `Handle`.
- `Root` props: as Dialog, plus `swipeDirection` (`down` default), `snapPoints`, `snapPoint`, `defaultSnapPoint`,
  `onSnapPointChange`, `snapToSequentialPoints` (snap points: heights where a sheet stops).

## Format

Claude decided the API (the user leans on Claude for props) and showed it for confirmation.

## Decisions

- [x] Q1: The API (Claude's decision).
  > Same as Dialog (`open`, `onOpenChange`, `title`, `actions`, `disablePointerDismissal`, `children`), plus
  > `side` (`inline-end | inline-start | bottom`, default `inline-end`) and `width` (`8000 | 9600 | 12800`,
  > default `9600`). Built in: scrim, page block, X button, Escape, swipe to close, grab bar on `bottom`.
  > Omitted: `top`, snap points, the page shrink effect, swipe from the edge to open, an automatic bottom
  > sheet on phones. Drawer or Dialog rule. Fix the Dialog doc ("Popover or Drawer keep the page usable").
  > "Agree with all the points."

## Token mapping

Claude calls (token interview scope), listed in `spec.md` for review.

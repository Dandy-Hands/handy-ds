# Tooltip — Spec Interview Guide (2026-10-26)

New component (`[new]` in `.claude/component-interview-todo.md`). Second of the Tier 4 overlay set. No code,
docs page, or Figma exists. Model: the Popover interview (2026-10-26). Wraps `Tooltip` from
`@base-ui/react/tooltip`.

Base UI version documented from: `@base-ui/react` 1.8.0.

Base UI facts:
- Parts: `Provider`, `Root`, `Trigger` (button), `Portal`, `Positioner`, `Popup` (div), `Arrow`, `Viewport`,
  plus `createHandle` / `Handle`. No `Title`, `Description`, or `Close`.
- `Root` props: `open`, `defaultOpen`, `onOpenChange`, `onOpenChangeComplete`, `disabled`,
  `disableHoverablePopup` (false), `trackCursorAxis` (`none`), `actionsRef`, `handle`, `triggerId`,
  `defaultTriggerId`, `children`.
- `Trigger` props: `delay` (600 ms), `closeDelay` (0 ms), `closeOnClick` (true), `disabled` (stops the
  tooltip only, not the element), `handle`, `payload`, `render`.
- `Provider` props: `delay`, `closeDelay`, `timeout` (400 ms: a second tooltip opens at once inside it).
- `Portal`, `Positioner`, `Popup` members: same as Popover.

Carried from Popover (2026-10-26): `Popup` renders `Portal` and `Positioner`; `side` is
`top | bottom | inline-start | inline-end`, `align` is `start | center | end`; fixed side gap from a space
token, no offsets; `Trigger` has no look; no `Arrow`; no detached triggers; `className` and `style` omitted.

Library facts:
- Surface levels: `sunken`, `base`, `raised`, `floating`, `modal`. There is no inverse surface token.
- `data-mode="dark"` on an element re-resolves its tokens to dark mode (Section scrim precedent).
- Durations are not sizes: the raw-number rule (API conventions section 4) covers sizes, spaces, widths.

## 1. Shape and look

- [x] Q1: Compound parts (like Popover), or one component with a content prop?
  > "Compound (Recommended)". Parts: `Provider`, `Root`, `Trigger`, `Popup`.
- [x] Q2: Popup look: floating surface (like Popover), or inverted (dark on a light page)?
  > "Inverted (Recommended)". Follow-up on how: "data-mode=\"inverse\" (Recommended)". The theme emits a
  > third mode scope, the opposite of the root mode. Token spec change.
- [x] Q3: Delays: where (`Provider`, `Trigger`, both, neither)?
  > "Provider only (Recommended)". `Provider` takes `delay`, `closeDelay`, `timeout`.
- [x] Q4: Default `side`.
  > "top (Recommended)".

## 2. Base UI surface

- [x] Q5: `disableHoverablePopup`, `trackCursorAxis`, `closeOnClick`, `disabled`, `actionsRef`.
  > "Keep defaults (Recommended)". Popup stays hoverable. Omit `disableHoverablePopup`, `trackCursorAxis`,
  > `actionsRef`. Expose `closeOnClick` on `Trigger`, `disabled` on `Root`.

## 3. Extension props

- [x] Q6: Popup width.
  > "Fixed max 6400 (Recommended)". No prop.

## 4. Token mapping

Claude calls (token interview scope), listed in `spec.md` for review.

## Open items

- Portal context (from Popover): the popup renders outside the trigger's ancestors, so an ancestor's
  `data-context`, `data-mode`, or `data-section` does not reach it. Decide in the Dialog interview.

## Revision 2026-10-28 (Dialog interview follow-up)

- [x] One component that wraps its control.
  > Decided in the Dialog interview: an overlay is one component (`docs/api-conventions.md` section 1), one
  > method per task. Claude proposed: the child is the control, `content` is the panel content, no state code.
  > "Yes, I agree." This replaces the part-based API above. Claude decided the member list under the
  > one-method rule (the user leans on Claude for props).
- [x] Revision 2026-10-28: always dark, not inverse.
  > User: "But there'd be a button in a toast, which should also be inverted. An inverse mode might be a good
  > idea, except that would look pretty dukey in dark mode. I don't know. What do you think?" Claude
  > recommended `data-mode="dark"` in both page modes for Tooltip and Toast. "Oh, brilliant. So toast is
  > always dark mode!?" ... "I like it. Continue." The `inverse` scope is dropped.

# Preview Card — Spec Interview Guide (2026-10-27)

New component (`[new]` in `.claude/component-interview-todo.md`). Third of the Tier 4 overlay set. No code,
docs page, or Figma exists. Model: the Popover and Tooltip interviews (2026-10-26). Wraps `PreviewCard` from
`@base-ui/react/preview-card`.

Base UI version documented from: `@base-ui/react` 1.8.0.

Base UI facts:
- Parts: `Root`, `Trigger` (`<a>`), `Portal`, `Positioner`, `Popup` (div), `Arrow`, `Backdrop`, `Viewport`,
  plus `createHandle` / `Handle`. No `Provider`, `Title`, `Description`, or `Close`.
- `Root` props: `open`, `defaultOpen`, `onOpenChange`, `onOpenChangeComplete`, `actionsRef`, `handle`,
  `triggerId`, `defaultTriggerId`, `children`.
- `Trigger` props: `delay` (600 ms), `closeDelay` (300 ms), `handle`, `payload`, `render`, plus `<a>` attributes.
- `Portal`, `Positioner`, `Popup` members: same as Popover.

## 1. Shape

- [x] Q1: Carry the Popover shape?
  > "Carry Popover (Recommended)". Parts `Root`, `Trigger`, `Popup`. `Popup` renders `Portal` and
  > `Positioner`. Same `side` and `align` unions, default side `bottom`. No `Arrow`, `Backdrop`, `Viewport`,
  > or detached triggers. No Title, Description, or Close parts.
- [x] Q2: Trigger look.
  > "Link look (Recommended)". `content/link/fg`, `content/link/hover/fg`, underline.

## 2. Base UI surface

- [x] Q3: Hover delays.
  > "Fixed (Recommended)". Base UI defaults, 600 ms open and 300 ms close. No props.

## 3. Extension props

- [x] Q4: Popup width.
  > "width + maxWidth (Recommended)". Same as Popover: `width` default `auto`, `maxWidth` default `9600`.

## 4. Token mapping

Claude calls (token interview scope), listed in `spec.md` for review.

## Open items

- The user reviews the token mapping in `spec.md`.
- Portal context: decide in the Dialog interview (from Popover).

## Revision 2026-10-28 (Dialog interview follow-up)

- [x] One component that wraps its control.
  > Decided in the Dialog interview: an overlay is one component (`docs/api-conventions.md` section 1), one
  > method per task. Claude proposed: the child is the control, `content` is the panel content, no state code.
  > "Yes, I agree." This replaces the part-based API above. Claude decided the member list under the
  > one-method rule (the user leans on Claude for props).

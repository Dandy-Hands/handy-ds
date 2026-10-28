# Popover — Spec Interview Guide (2026-10-26)

Re-interview (`[re]` in `.claude/component-interview-todo.md`). First of the Tier 4 overlay set (popover,
tooltip, preview-card, dialog, alert-dialog, drawer, toast). Shape decisions here are likely to carry to
the other floating overlays (Tooltip, Preview Card). Wraps `Popover` from `@base-ui/react/popover`.
The dry-run spec (`spec.md`, 2026-09-23) and code (`src/components/Popover.tsx`, `Popover.css`) exist.

Base UI version documented from: `@base-ui/react` 1.8.0.

Base UI facts:
- Parts: `Root` (no element), `Trigger` (button), `Portal`, `Positioner` (div), `Popup` (div), `Arrow` (div),
  `Backdrop` (div), `Title` (h2), `Description` (p), `Close` (button), `Viewport` (div), plus
  `createHandle` / `Handle` (detached triggers).
- `Root` props: `open`, `defaultOpen`, `onOpenChange`, `onOpenChangeComplete`, `actionsRef`,
  `modal` (`false` | `true` | `'trap-focus'`, default `false`), `triggerId`, `defaultTriggerId`, `handle`,
  `children` (node or payload render function).
- `Trigger` props: `nativeButton`, `handle`, `payload`, `id`, `openOnHover` (false), `delay` (300),
  `closeDelay` (0), `disabled`, `render`.
- `Portal` props: `keepMounted`, `container`.
- `Positioner` props: `anchor`, `positionMethod` (`absolute`), `side` (`bottom`), `sideOffset` (0, px),
  `align` (`center`), `alignOffset` (0, px), `collisionBoundary`, `collisionPadding` (5), `sticky`,
  `arrowPadding` (5), `disableAnchorTracking`, `collisionAvoidance`.
- `Popup` props: `initialFocus`, `finalFocus`, `render`.
- State attributes: `data-open`, `data-closed`, `data-starting-style`, `data-ending-style`, `data-side`,
  `data-align`, `data-popup-open` (trigger), `data-instant`.

Library facts:
- `.claude/decisions.md` "Triggers carry no styling": Popover `Trigger` has no look; the author writes
  `render={<Button />}`. The current code still gives `Trigger` the Button classes (mismatch).
- `surface.css` has the shared popup, positioner, and backdrop rules. Popup max width today:
  `min(24rem, var(--available-width))`. `measure/width/9600` is 384px (24rem) at density 1.
- Raw numbers are banned in members (`docs/api-conventions.md` section 4): `sideOffset` and `alignOffset`
  are pixel numbers.

## 1. Shape of the API

- [x] Q1: Mirror all Base UI parts, or let `Popup` render the portal and positioner?
  > "Popup wraps (Recommended)". `Popup` renders `Portal` and `Positioner` inside and takes the placement
  > props. Parts: `Root`, `Trigger`, `Popup`, `Title`, `Description`, `Close`.
- [x] Q2: Trigger look: none (decisions.md), or Button look by default?
  > "No look (Recommended)". The author writes `render={<Button />}`.

## 2. Base UI surface

- [x] Q3: Hover open (`openOnHover`, `delay`, `closeDelay`).
  > "Omit (Recommended)". Click only. Tooltip and Preview Card cover hover content.
- [x] Q4: Placement members and the offset (pixel numbers).
  > "side + align only (Recommended)". The gap to the trigger is fixed from a space token. No offsets.
- [x] Q5: `modal` and `Backdrop`.
  > "Expose modal, no Backdrop (Recommended)". A scrim means the task blocks the page: use Dialog.
- [x] Q6: `Arrow`.
  > "Omit (Recommended)". Add when a second use appears.
- [x] Q7 + Q8: Detached triggers and remaining members (asked as one question).
  > "Focus only (Recommended)". Keep `initialFocus` and `finalFocus` on `Popup`, `onOpenChangeComplete`
  > on `Root`. Omit `handle`, `createHandle`, `payload`, `triggerId`, `defaultTriggerId`, `Viewport`,
  > `actionsRef`, `keepMounted`, `container`, `anchor`, and the collision members.
- [x] Q10: `Close` content.
  > "Icon button default (Recommended)". No children: a tertiary icon-only X button in the top end corner,
  > `aria-label="Close"`. With children: no look, like `Trigger`.
- [x] Q11: `side` values.
  > "Logical only (Recommended)". `top | bottom | inline-start | inline-end`, default `bottom`.
- [x] Q12: Default `align`.
  > "center (Recommended)". `start | center | end`.

## 3. Extension props

- [x] Q9: Popup width.
  > First answer (cancelled by the user): "Fixed 9600". Changed: "I wanted to change the last answer to
  > multiple widths and a maxWidth prop". Follow-up: "width + maxWidth". `width`: `auto | 6400 | 8000 |
  > 9600 | 12800`, default `auto`. `maxWidth`: `6400 | 8000 | 9600 | 12800`, default `9600`.

## 4. Token mapping

Claude calls (token interview scope), listed in `spec.md` for review.

## Open items

- The user reviews the token mapping in `spec.md` (the Claude calls).
- Tooltip and Preview Card: reuse the Q1 shape (Popup renders Portal and Positioner), Q4 placement, and
  Q11 side values unless their interviews decide otherwise.

## Revision 2026-10-28 (Dialog interview follow-up)

- [x] One component that wraps its control.
  > Decided in the Dialog interview: an overlay is one component (`docs/api-conventions.md` section 1), one
  > method per task. Claude proposed: the child is the control, `content` is the panel content, no state code.
  > "Yes, I agree." This replaces the part-based API above. Claude decided the member list under the
  > one-method rule (the user leans on Claude for props).

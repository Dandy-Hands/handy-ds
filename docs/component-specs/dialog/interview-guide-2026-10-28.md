# Dialog — Spec Interview Guide (2026-10-28)

Re-interview (`[re]` in `.claude/component-interview-todo.md`). Fourth of the Tier 4 overlay set. The dry-run
spec (`spec.md`, 2026-09-23) and code (`src/components/Dialog.tsx`, `Dialog.css`) exist. Wraps `Dialog` from
`@base-ui/react/dialog`.

Base UI version documented from: `@base-ui/react` 1.8.0.

Base UI facts:
- Parts: `Root` (no element, holds the open state), `Trigger` (the button that opens it), `Portal` (moves the
  dialog to the end of the page), `Backdrop` (the scrim), `Viewport` (full-screen scroll area), `Popup` (the
  dialog box), `Title`, `Description`, `Close`, plus `createHandle` / `Handle` (a trigger outside the dialog).
- `Root` props: `open`, `defaultOpen`, `onOpenChange`, `onOpenChangeComplete`, `modal` (`true` default:
  no clicks or scroll on the page), `disablePointerDismissal` (false: a click on the scrim closes it),
  `actionsRef`, `handle`, `triggerId`, `defaultTriggerId`, `children`.
- `Popup` props: `initialFocus`, `finalFocus`. State attributes `data-nested`, `data-nested-dialog-open`.

## 0. Interview format

- The first question set was rejected: "I do not like these quesitons. I do not understand them. We are
  talking about a Dialog. What is a portal in this context? Did you make that up? Also the questions are about
  a popover. Your terminology is indirect and confusing." Then: "Anything that baseui has made up, I'm not
  going to have knowledge of so from hence forth I need you to define them."

## 1. Shape

- [x] Q1: Part name `Popup`.
  > "Oh I see. Let's leave the name for now."
- [x] Q2: One component.
  > "We need to make to so that the agent has a minimal surface area to understand so it doesn't get
  > confused like I am. We need to build it in such a way that all the agent inserts is <Dialog> with
  > children and props. The scrim and popover are implied in <Dialog>. Is that doable?"
  > Claude proposed `trigger`, `title`, and `description` props, an exception in `docs/api-conventions.md`,
  > and to redo Popover, Tooltip, and Preview Card to the same shape. Answer: "ok".

## 2. Behavior and props

- [x] Q3: Block the page always, or let the agent choose (`modal`)?
  > "Always block (Recommended)". No `modal` prop.
- [x] Q4: Close when the user clicks the scrim?
  > "Closes, prop to stop it (Recommended)". `disablePointerDismissal` (Base UI name, not renamed).
- [x] Q5: Close button (X) in the corner.
  > "I think yes, but what about a header slot then to control so titles, etc don't accedently overlap it?"
  > Claude: Dialog draws the header row (title at the start, X at the end), so they cannot overlap; no slot.
  > The X is always shown.
- [x] Q6: Width.
  > "3 widths + full screen". `8000`, `9600` (default), `12800`, `full`.
- [x] Q9: `description` prop.
  > "I don't want a description prop. At least not a string. Unless you tell me what it's use case is.
  > Don't open up the interview. Talk to me." Claude explained the screen-reader use and recommended: no
  > `description` on Dialog, keep it (required, `ReactNode`) on Alert Dialog. "Oh, I see it's for
  > accessibility only."
- [x] Q10: `trigger` prop.
  > "I'm not a frontend developer, so I'm really curious about this `trigger` prop and what the normal
  > convention is. I figured it would be a button or something that opens up the modal, not a modal
  > defining what triggers it. Am I wrong about this? What is the method that we want agents to use for
  > this?" Claude recommended `open` / `onOpenChange` only. "I agree that we should only have one method,
  > and you should choose the most appropriate one for agents. And you should also work this into your
  > future decisioning." No `trigger` prop.
- [x] Q11: `Dialog.Close`.
  > "I agree. Remove dialog close." A Cancel button calls `onOpenChange` code.
- [x] Q12: `defaultOpen`.
  > "If you recommend it and there is an alternative way to do it, go ahead and remove it." Removed.
- [x] Q7: Button row.
  > Claude recommended an `actions` prop (fixed at the bottom while the body scrolls). "Sounds good."
- [x] Q13: Phone screens.
  > Claude recommended: the box shrinks to the screen width with a side gap; `full` fills the screen.
  > "Yes, I agree."
- [x] Q8: Remaining members.
  > Claude call under the one-method rule: omit `initialFocus`, `finalFocus`, `onOpenChangeComplete`,
  > `actionsRef`, `handle`, trigger IDs.

## 3. Token mapping

Claude calls (token interview scope), listed in `spec.md` for review.

## Open items

- Portal context: the dialog moves to the end of the page, so a color mode or brand color set on an
  ancestor does not reach it. Claude call: the dialog uses the page colors and mode. The user can override.

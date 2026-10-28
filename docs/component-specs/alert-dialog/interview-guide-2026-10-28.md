# Alert Dialog — Spec Interview Guide (2026-10-28)

New component (`[new]` in `.claude/component-interview-todo.md`). Fifth of the Tier 4 overlay set. The
dry-run code is in `src/components/Dialog.tsx` (`AlertDialog`, a copy of the Dialog parts). Wraps `AlertDialog`
from `@base-ui/react/alert-dialog`. Model: the Dialog interview (2026-10-28).

Base UI version documented from: `@base-ui/react` 1.8.0.

Base UI facts:
- Same parts as Dialog: `Root`, `Trigger`, `Portal`, `Backdrop`, `Viewport`, `Popup`, `Title`, `Description`,
  `Close`, plus `createHandle` / `Handle`.
- Differences from Dialog: role `alertdialog`, always modal, a click outside does not close it.

## Interview format

The user leans on Claude for the prop decisions ("I just come from a more minimalist component background, so I
really lean on you more for the decisioning. On the props and whatnot"). Claude decided the API and showed it
for confirmation.

## Decisions

- [x] Q1: Why both Alert Dialog and Dialog?
  > "Yes, but what is the value add of having both An alert and a dialog? I'm not against it. I just want to
  > know." Claude: different role, no outside close, focus on the safe button, required message; keep two
  > components so each API stays small. "Okay, if we're going to keep it."
- [x] Q2: Why so many overlays? Keep all 7?
  > "Why does Base UI have so many? What is their reasoning?" Claude: each is one behavior pattern (WAI-ARIA
  > Authoring Practices). "Well, if they're doing it for those reasons, I think it's good enough for me."
  > All 7 are kept, Preview Card too.
- [x] Q3: The API (Claude's decision).
  > `open`, `onOpenChange`, `title`, `description` (required), `confirm`, `onConfirm`, `cancel` (default
  > "Cancel"), `variant` (`primary | danger`). No `children`, no `width`, no X button, no outside close.
  > "Looks good to me."

## Token mapping

Claude calls (token interview scope), listed in `spec.md` for review.

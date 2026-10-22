# OtpInput — Spec Interview Guide (2026-10-21)

New component (`[new]` in `.claude/component-interview-todo.md`). The folder is `otp-field/`. The component name is Q1.

Base UI version documented from: `@base-ui/react` 1.8.0 (`@base-ui/react/otp-field`).

Base UI facts:
- Parts: `Root` (`<div>`, holds state), `Input` (`<input>`, one per slot), `Separator` (the shared Separator).
- Root members: `length` (required), `value`, `defaultValue`, `onValueChange`, `onValueInvalid`, `onValueComplete`, `validationType` (`numeric` default, `alpha`, `alphanumeric`, `none`), `normalizeValue`, `mask`, `inputMode`, `autoComplete` (`one-time-code`), `autoSubmit`, `name`, `form`, `id`, `required`, `disabled`, `readOnly`, `render`, `className`, `style`.
- `Input` has no own members besides native `<input>` attributes. A caller renders `length` Inputs.
- `Root` state: `complete`, `disabled`, `length`, `readOnly`, `required`, `value`, plus the Field state (`valid`, `invalid`, `touched`, `dirty`, `filled`, `focused`).
- `Input` state: `index`, `filled`, `value`.
- The value is one string. Paste fills the slots. Autofill from SMS fills the slots.

Current state in the repo: no OTP component. `Input.tsx` (internal base) wraps the Base UI `Input`. `control.css` holds the shared frame look (`.hds-control`).

## 1. Shape of the API

- [x] Q1: Name and shape. One component with no parts, or the Base UI parts (`Root` + `length` x `Input`)?
- [x] Q2: Slot look. One box per character, or one frame for all characters?
- [x] Q3: Grouping. How does the caller split the code (for example 3 + 3)?

## 2. Base UI surface

- [x] Q4: Character set: `validationType`, `normalizeValue`, `inputMode`.
- [x] Q5: `mask`.
- [x] Q6: Completion: `onValueComplete`, `autoSubmit`, `onValueInvalid`.
- [x] Q7: Value and form members: `value`, `defaultValue`, `onValueChange`, `name`, `form`, `id`, `required`, `disabled`, `readOnly`, `autoComplete`.
- [x] Q8: `render`, `style`, `className`.

## 3. Extension props

- [x] Q9: `size`, and any other extension prop.

## 4. Token mapping

Claude calls (token interview scope): reuse the Field mapping of TextInput for each slot.

## Answers (2026-10-21)

- Q1: single component `OtpInput`, no parts. Rejected: parts; `OtpField`.
- Q2: one box per character. The user asked about paste first: Base UI paste fills all boxes from the focused box. Rejected: one shared frame.
- Q3: `groups` prop of numbers. Later decision: `groups` replaces `length` (default `[6]`). Rejected: no grouping; separator parts.
- Q4: expose `validationType` only. Omit `normalizeValue` and `inputMode`.
- Q5: expose `mask`.
- Q6: expose `onValueComplete` and `onValueInvalid`. Omit `autoSubmit`.
- Q7: expose `value`, `defaultValue`, `onValueChange`, `name`, `form`, `id`, `required`, `disabled`, `readOnly`, `autoComplete`.
- Q8: omit `render` and `style`. `className` goes to the root.
- Q9: `size` (`800 | 1000 | 1200`, default `1000`) and `groups`. Slot labels: built-in English strings.
- Paste into a later box: keep Base UI behavior (cut off at the end).

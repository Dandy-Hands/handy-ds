# NumberInput — Spec Interview Guide (2026-10-21)

Re-interview (`[re]` in `.claude/component-interview-todo.md`). The component today is `NumberField` (`src/components/NumberField.tsx`): a Base UI namespace with `Group`, `Input`, `Decrement`, `Increment`. The earlier guide (`interview-guide-2026-09-23.md`) was retroactive: no interview took place.
The text inputs (`TextInput`, `EmailInput`, and others) are now single components with a `size` prop. This interview decides whether the number control takes the same shape.

Base UI version documented from: `@base-ui/react` 1.8.0 (`@base-ui/react/number-field`).

Base UI facts:
- Parts: `Root` (`<div>`, holds state), `Group` (`<div>`), `Input` (`<input>`), `Increment` and `Decrement` (`<button>`), `ScrubArea` (`<span>`), `ScrubAreaCursor`.
- `Root` members: `value`, `defaultValue`, `onValueChange`, `onValueCommitted`, `min`, `max`, `step`, `smallStep` (Alt), `largeStep` (Shift), `snapOnStep`, `allowOutOfRange`, `allowWheelScrub`, `format` (`Intl.NumberFormatOptions`), `locale`, `name`, `form`, `id`, `required`, `disabled`, `readOnly`, `inputRef`, `render`, `className`, `style`.
- `value` is `number | null`. `null` is an empty field.
- `Input` has `aria-roledescription` (default `'Number field'`).
- State attributes: `data-disabled`, `data-readonly`, `data-required`, `data-scrubbing`, `data-valid`, `data-invalid`, `data-touched`, `data-dirty`, `data-filled`, `data-focused`.

Current state in the repo:
- `control.css` holds the shared frame look (`.hds-control`, `__input`, `__button`). `NumberField.Group` uses it with `data-size`.
- Stepper hover borrows Action tertiary colors.
- The doc page fails `e2e/pages.spec.ts`: an input with both `value` and `defaultValue`.
- `NumberField.tsx` is not in the new single-component shape. It uses `MinusIcon` and `PlusIcon` from `icons.tsx`.

## 1. Shape of the API

- [x] Q1: One component or the Base UI parts? Answer (2026-10-21): single component `NumberInput`, no parts. Renamed from `NumberField`.
- [x] Q2: Steppers. Answer (2026-10-21): boolean `steppers`, off by default. Typed entry is the default, because numbers such as currency are large and typed. Arrow keys always work. With `steppers`, − at the start edge and + at the end edge. Rejected: steppers on by default; two components; stacked ▲▼ buttons.
- [x] Q3: Scrub area. Answer (2026-10-21): omit. Add at the second real use.
- [x] Q4: Unit or symbol. Answer (2026-10-21): `format` (text symbol, follows `locale`) plus `start` and `end` slots (icon, non-Intl text, fixed symbol, button). `format` never draws an icon.

## 2. Extension props

- [x] Q5: `size`. Answer (2026-10-21): accepted. `'800' | '1000' | '1200'`, default `'1000'`, same as TextInput.
- [x] Q6: Other extension props. Answer (2026-10-21): `steppers`, `start`, `end` only. Proposal accepted.

## 3. Base UI surface

- [x] Q7: Value behavior members: `value`, `defaultValue`, `onValueChange`, `onValueCommitted`, `min`, `max`, `step`, `smallStep`, `largeStep`, `snapOnStep`.
- [x] Q8: Entry members. Answer (2026-10-21): expose `allowOutOfRange` (a typed number outside the limits stays and warns, not a silent clamp), `format`, `locale`. Omit `allowWheelScrub` (a page scroll could change a value).
- [x] Q9: Form members: `name`, `form`, `id`, `required`, `disabled`, `readOnly`, `inputRef`, `ref`, `aria-*`.
- [x] Q10: `render` and `style` omitted. `className` goes to the frame. Proposal accepted.
- [x] Q11: Empty value. Exposed as `number | null`; `null` is an empty field.

## 4. Token mapping

Claude calls (token interview scope): reuse the TextInput mapping. Stepper glyph uses the frame color, hover borrows Action tertiary (kept), no divider. See `spec.md`.

# TextInput — Spec Interview Guide (2026-10-15)

New component (`[new]` in `.claude/component-interview-todo.md`). Named `TextInput` (renamed from `Input`, 2026-10-15). Wraps `Input` from `@base-ui/react/input`.
Today `Input` is a small function in `src/components/Field.tsx` with `size: 'sm' | 'md' | 'lg'`. This interview replaces it. The folder keeps the name `input/`.
Textarea and OtpField get their own interviews after this one. NumberField is a re-interview.

Base UI version documented from: `@base-ui/react` 1.8.0.

Base UI facts:
- `Input` renders one `<input>`. It works with `Field` on its own (validity, label, and description wiring).
- Members on top of `<input>` attributes: `value`, `defaultValue`, `onValueChange(value, eventDetails)`, `render`, `className`, `style`.
- State attributes: `data-disabled`, `data-valid`, `data-invalid`, `data-touched`, `data-dirty`, `data-filled`, `data-focused`.

Decisions made before this interview (2026-10-15, in conversation):
- Split inputs by the value type they hold. `TextInput` holds a free string. NumberField holds a number. Date and time are a future component set and are never an `Input` type.
- Revised in conversation (2026-10-15): each string type is its own component, built for the best experience of that type. Every one wraps the Base UI `Input`.
  - `TextInput`: plain free text. Always `type="text"`. The `type` prop is omitted from its types. Frame, plus the `start` and `end` slot props.
  - `EmailInput`: email icon, validation on blur, trims spaces, optional typo hint (for example `gmial.com`).
  - `PhoneInput`: phone icon, masking by country, raw digits as the value. A small set of countries in v1. Client app sets the country.
  - `PasswordInput`: show/hide button, optional strength hint.
  - `SearchInput`: search icon, clear button, `Escape` clears.
  - `UrlInput`: link icon, adds `https://` when missing, validates the URL. Not decided: include now or wait for a client need.
- This replaces the earlier `type` list on `Input` and the built-in buttons on `Input`. `TextInput` sets no defaults. `inputMode` stays a native pass-through. Smart defaults (`inputMode`, `autoComplete`, `autoCapitalize`, `spellCheck`) move into each typed component. A native attribute from the caller overrides a default.
- The slot props `start` and `end` stay on `TextInput` (Q1).
- Each typed component wraps `TextInput`.
- Each typed component gets its own spec interview after `TextInput`.
- Select-type controls are out of scope.

Token facts (token spec 7.1–7.7):
- Field has `default`, `hover`, `focus`, `error`, `disabled` states, each with `bg | fg | border | placeholder`.
- Radius role `control`, border role `control`. Typography `body`.
- `control.css` already holds the shared look (`.hds-control`, `.hds-control__input`, `.hds-control__button`) for Input, Field.Control, Select trigger, Combobox, and NumberField.
- Open gap (token spec section 9, item 4): Field error text color. Not decided here.

## 1. Shape of the API

- [x] Q1: How does a caller add an icon or a unit? Answer (2026-10-15): slot props `start` and `end`, type `ReactNode`. Needed the narrowed rule in `docs/api-conventions.md` section 1 (see `.claude/decisions.md`, "Slot props allowed").
- [x] Q2: Does `TextInput` accept `type`, and which defaults does it set? Answer (2026-10-15): no `type` prop, always `type="text"`, no defaults. `inputMode` is a native pass-through. Per-type defaults move to each typed component's interview.

## 2. Extension props

- [x] Q3: `size`. Answer (2026-10-15): measure steps, same as Button. `TextInputSize = '800' | '1000' | '1200'`, default `'1000'` (32, 40, 48px at density 1). Set as `data-size`. Not responsive. Replaces `sm | md | lg`. `control.css` (`data-size='sm' | 'lg'`) moves to the steps. `Field.Control`, `NumberField.Group`, Select trigger, and Combobox share that file, so their `size` changes with it.
- [x] Q4: Other extension props. Answer (2026-10-15): none. `TextInput` adds `size`, `start`, and `end` only. No `width="full"`: the input fills its `Field` container.

## 3. Base UI surface

- [x] Q5: Members. Answer (2026-10-15):
  - Pass through to the `<input>`, no renaming: `value`, `defaultValue`, `onValueChange`, `name`, `placeholder`, `disabled`, `required`, `inputMode`, `autoComplete`, `maxLength`, `ref`, and all other native attributes.
  - Omit `type` and `style`.
  - `className` goes to the frame (the frame holds the look).
  - `render` stays on the `<input>`.
  - `ref` goes to the `<input>`, so callers can call `focus()`.
  - The frame reads state with `:focus-within` and `:has([data-invalid])`, not a copy of the Base UI state attributes.
- [x] Q6: Built-in buttons. Not applicable to `TextInput` after the split (2026-10-15). Moves to the `PasswordInput` and `SearchInput` interviews.

## 4. Token mapping

Claude calls (token interview scope): colors, radius, border, and focus ring in `spec.md`.

## Open items

- Field error text color (token spec section 9, item 4).
- Field.Control and NumberField.Group share the look. Their `size` must follow the answer to Q3.

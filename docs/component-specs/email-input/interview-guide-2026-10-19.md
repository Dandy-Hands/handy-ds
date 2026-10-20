# EmailInput — Spec Interview Guide (2026-10-19)

New component. Built on the internal `Input` base (`src/components/Input.tsx`), like `TextInput`, `PasswordInput`, and `SearchInput`.
Read `docs/component-specs/password-input/interview-guide-2026-10-15.md` and `docs/component-specs/search-input/interview-guide-2026-10-19.md` first. They set the pattern for a typed input.

Base UI version documented from: `@base-ui/react` 1.8.0.

Facts:
- Base UI has no email component. `EmailInput` is the `Input` base with `type="email"`.
- A native `type="email"` input already trims leading and trailing whitespace from its value (value sanitization). No trim code is needed.
- Native `type="email"` validation accepts `a@b` (no dot in the domain). It reports `validity.typeMismatch` when the value is not an email.
- Inside a `Field.Root`, Base UI validates on blur by default and shows `Field.Error` when `match` fits the validity state. Outside a `Field`, the browser's own validation shows on form submit.
- `PasswordInput` owns `end`. `SearchInput` owns `start` and `end`. `EmailInput` has no built-in button.
- The browser accepts a comma-separated list when `multiple` is set. `EmailInput` is for one address.

Decisions made before this interview (2026-10-15 and 2026-10-19, in conversation):
- Each string type is its own component. `EmailInput` has an email icon, validation, and a typo hint (ideas, not decided).
- Defaults live in the typed component. A native attribute from the caller overrides a default.
- Extras such as a typo hint or a strength hint live outside the component. The caller reads the value with `onValueChange`. (Decided for `PasswordInput`. Check it holds here.)

## 1. Shape of the API

- [x] Q1: Slots. Answer (2026-10-19): the email icon owns `start`. The caller keeps `end` (no built-in button there; a caller can add a badge or a button). The props type is `TextInputProps` without `start`.

## 2. Validation

- [x] Q2: How strict is the check? Answer (2026-10-19): a stricter default. The component sets `pattern="[^@\s]+@[^@\s]+\.[^@\s]+"` (a dot is required in the domain, after the `@`). `a@b` fails. A failed pattern reports `validity.patternMismatch`, so the docs show `<Field.Error match>` (or both keys). A caller overrides `pattern` for an intranet address such as `user@intranet`. Rejected: native only (accepts `a@b`); a custom validity message (more code, a fixed English string). Reason: public client sites; a typo such as `name@gmail` bounces, a missed intranet address is rare.
- [x] Q3: Trim. Answer (2026-10-19): no trim code. The browser trims leading and trailing spaces from a `type="email"` value, so `onValueChange` receives the trimmed value.
- [x] Q4: Typo hint. Answer (2026-10-19): out of v1, as with the strength hint on `PasswordInput`. A caller reads the value with `onValueChange` and shows a hint in `Field.Description`. A shared helper can come later if clients ask.

## 3. Behavior and defaults

- [x] Q5: Defaults. Answer (2026-10-19): `type="email"`, `inputMode="email"`, `autoComplete="email"`, `autoCapitalize="off"`, `spellCheck={false}`, plus the Q2 `pattern`. A native attribute from the caller overrides each default except `type`. `multiple` is omitted (one address).

## 4. Extension props and Base UI surface

- [x] Q6: Extension props and members. Answer (2026-10-19): no new props. `size` and `end` come from `TextInput`. Omitted: `start` (the icon owns it), `type`, `multiple`, `style`. `className` goes to the frame; everything else passes through as in `TextInput`.

## 5. Token mapping

Claude calls (token interview scope): colors, radius, border, and focus ring in `spec.md`. Reuses the `TextInput` mapping.

## Open items

- Field error text color (token spec section 9, item 4).

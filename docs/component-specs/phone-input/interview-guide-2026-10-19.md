# PhoneInput — Spec Interview Guide (2026-10-19)

New component. Built on the internal `Input` base (`src/components/Input.tsx`), like `TextInput`, `PasswordInput`, `SearchInput`, and `EmailInput`.
Read `docs/component-specs/email-input/interview-guide-2026-10-19.md` first. It sets the pattern for a typed input.

Base UI version documented from: `@base-ui/react` 1.8.0.

Facts:
- Base UI has no phone component. `PhoneInput` is the `Input` base with `type="tel"`.
- `type="tel"` does no validation and no formatting. It only picks the phone keypad on mobile.
- `pattern` works on the displayed text, so a masked value can use a `pattern` and report `validity.patternMismatch`, as `EmailInput` does.
- A mask means the text the user sees differs from the value the caller wants. The component must own the displayed text.
- No phone library is installed. Real international formatting needs a library (libphonenumber). A small hand-written set of countries needs none.

Decisions made before this interview (2026-10-15 and 2026-10-19, in conversation):
- `PhoneInput` has a phone icon, masking by country, and raw digits as the value. A small set of countries in v1. The client app sets the country.
- Defaults live in the typed component. A native attribute from the caller overrides a default.
- Extras live outside the component. The caller reads the value with `onValueChange`.

## 1. Shape of the API

- [x] Q1: Slots. Answer (2026-10-19): the phone icon owns `start`. The caller keeps `end`. The props type is `TextInputProps` without `start`.

## 2. Value and country

- [x] Q2: Value. Answer (2026-10-19): raw national digits (`2025550123`). The text shown is `(202) 555-0123`. `onValueChange` receives only the digits. `value` and `defaultValue` are digits. Rejected: E.164 (the caller builds it from the country code and the digits).
- [x] Q3: Country. Answer (2026-10-19): a `country` prop, a typed string union of ISO codes, default `'US'`. v1 ships `US` only (Canada has the same format). One small hand-written mask per country, no library. A country picker and more countries wait for a client need. Rejected: ship `US`, `CA`, `GB` now.

## 3. Masking and validation

- [x] Q4: Mask. Answer (2026-10-19): the component shows `(202) 555-0123` and gives the caller digits only. It strips every non-digit and drops a leading `1` from a paste of 11 digits. It stops at 10 digits. It adds no trailing punctuation (digits `202` show `(202`), so Backspace never stops on a symbol. It restores the caret to the same digit after formatting. `name` goes to a hidden input with the digits, because a native form posts the shown text. The visible input gets no `name`.
- [x] Q5: Check. Answer (2026-10-19): a default `pattern` on the shown text, `\(\d{3}\) \d{3}-\d{4}` for `US`. It reports `patternMismatch`; docs show `<Field.Error match="patternMismatch">`. An empty field is not an error (`required` covers it). A caller overrides `pattern`.

## 4. Behavior and defaults

- [x] Q6: Defaults. Answer (2026-10-19): `type="tel"`, `inputMode="tel"`, `autoComplete="tel-national"`, `spellCheck={false}`, plus the Q5 `pattern`. No `autoCapitalize`. A native attribute from the caller overrides each default except `type`.

## 5. Extension props and Base UI surface

- [x] Q7: Extension props and members. Answer (2026-10-19): one new prop, `country`. `size` and `end` come from `TextInput`. Omitted: `start` (the icon owns it), `type`, `multiple`, `style`. `className` goes to the frame. `name` goes to the hidden input. Added after the build (2026-10-19): the placeholder defaults to the format of the country (`(555) 555-5555` for `US`), because the component owns the mask. A caller overrides it. The other typed inputs have no placeholder default, because the best text depends on the form.

## 6. Token mapping

Claude calls (token interview scope): colors, radius, border, and focus ring in `spec.md`. Reuses the `TextInput` mapping.

## Open items

- Field error text color (token spec section 9, item 4).

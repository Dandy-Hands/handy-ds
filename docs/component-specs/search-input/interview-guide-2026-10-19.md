# SearchInput — Spec Interview Guide (2026-10-19)

New component. Built on the internal `Input` base (`src/components/Input.tsx`), like `TextInput` and `PasswordInput`.
Read `docs/component-specs/password-input/interview-guide-2026-10-15.md` first. It sets the pattern for a typed input with a built-in button.

Base UI version documented from: `@base-ui/react` 1.8.0.

Facts:
- Base UI has no search component. `SearchInput` is the `Input` base with `type="search"`, a search icon, and a clear button.
- The browser draws its own clear "x" in a `type="search"` input (WebKit and Chromium). The component must hide it, or two clear buttons show.
- `PasswordInput` owns the `end` slot with its toggle and keeps `start` for the caller. The slot rules are in the `Input` spec.
- Clearing must work for both a controlled value and an uncontrolled value, and it must call `onValueChange('')`.

Decisions made before this interview (2026-10-15 and 2026-10-19, in conversation):
- Each string type is its own component. `SearchInput` has a search icon, a clear button, and `Escape` clears.
- Defaults live in the typed component. A native attribute from the caller overrides a default.
- Strength-type extras (like a hint) live outside the component. The caller reads the value with `onValueChange`.

## 1. Shape of the API

- [x] Q1: Slots. Answer (2026-10-19): the caller keeps neither. The search icon owns `start`. The clear button owns `end`. The props type is `TextInputProps` without `start` and `end`. A filter button goes outside the frame.
- [x] Q2: Submit. Answer (2026-10-19): no `onSearch` prop. A search field in a `<form role="search">` submits on `Enter` (native). With no form, the caller uses `onKeyDown`. Add a prop when a second use appears.

## 2. Built-in clear button

- [x] Q3: Clear button. Answer (2026-10-19): shows only when the field has text (the `end` slot is empty otherwise, and the field does not shift). Fixed English label `Clear search`, icon `close`. A press sets the value to empty, calls `onValueChange('')`, and moves focus to the input. Works for a controlled and an uncontrolled value. Does not show when `disabled` or `readOnly`. Add a label prop when a client needs another language.
- [x] Q4: `Escape`. Answer (2026-10-19): with text, `Escape` clears the field, calls `onValueChange('')`, keeps focus in the input, and stops the event (the first press clears, the second press can close a parent dialog). When empty, `Escape` passes up unchanged.

## 3. Behavior and defaults

- [x] Q5: Defaults. Answer (2026-10-19): `type="search"`, `inputMode="search"`, `enterKeyHint="search"`, `autoComplete="off"`, `autoCapitalize="off"`, `spellCheck={false}`. A native attribute from the caller overrides each default (except `type`). The CSS hides the browser's own clear button (`::-webkit-search-cancel-button`).
- [x] Q6: Loading state. Answer (2026-10-19): out of v1. A caller shows a spinner outside the field. Add it when a second use appears.

## 4. Extension props and Base UI surface

- [x] Q7: Extension props and members. Answer (2026-10-19): no new props. `SearchInput` has `size` only, from `TextInput`. It omits `start`, `end`, `type`, and `style`. `value`, `defaultValue`, `onValueChange`, native attributes, `ref`, and `render` pass through as in `TextInput`. `className` goes to the frame. The clear button takes no props.

## 5. Token mapping

Claude calls (token interview scope): colors, radius, border, and focus ring in `spec.md`. Reuses the `TextInput` and `PasswordInput` mapping.

## Open items

- Field error text color (token spec section 9, item 4).

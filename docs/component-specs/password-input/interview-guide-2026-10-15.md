# PasswordInput — Spec Interview Guide (2026-10-15)

New component. Wraps `TextInput` (`src/components/TextInput.tsx`), which wraps `Input` from `@base-ui/react/input`.
`TextInput` was decided in `docs/component-specs/input/interview-guide-2026-10-15.md`. Read it first.

Base UI version documented from: `@base-ui/react` 1.8.0.

Facts:
- Base UI has no password component. `PasswordInput` is built from `TextInput` and a button.
- `TextInput` has `size`, `start`, `end`, and passes native input attributes to the `<input>`. `type` is omitted from `TextInput`.
- `PasswordInput` must set `type="password"` or `type="text"`, so it cannot use `TextInput` as it is. See Q1.
- `control.css` has `.hds-control__button` for a button inside the frame (tertiary hover colors).
- Material Symbols glyphs: `visibility`, `visibility_off`.

Decisions made before this interview (2026-10-15, in conversation):
- Each string type is its own component. `PasswordInput` has a show/hide button.
- Smart defaults (`autoComplete`, `autoCapitalize`, `spellCheck`) live in the typed component. A native attribute from the caller overrides a default.
- Optional strength hint was listed as an idea. Not decided.

## 1. Shape of the API

- [x] Q1: Composition. Answer (2026-10-15): an internal base, `Input` (`src/components/Input.tsx`), holds the frame, the slots, the ref merge, and the focus press, and takes a private `type`. `TextInput` calls it with `type="text"`. Every typed component, including `TextInput`, calls it with its own `type`. `Input` is not exported from `index.ts` (assumed internal; the user did not choose between internal and public). `TextInput`'s public API does not change. Rejected: `render` workaround; a copy of the frame in each typed component. The user can change direction later, with 6 to 9 inputs in the end.
- [x] Q2: Slots. Answer (2026-10-15): `PasswordInput` keeps `start` and omits `end`. The toggle owns the `end` slot. The props type is `TextInputProps` without `end`. Rejected: both slots (needs an order rule), no slots (blocks a lock icon).

## 2. Built-in button

- [x] Q3: Toggle state. Answer (2026-10-15): internal state only. The field starts hidden. No reset on blur or on submit in v1. Built so `visible`, `defaultVisible`, and `onVisibleChange` can be added later without a breaking change (add them when a second use appears, or when a client asks for the submit reset). The user wants the component to stay extensible.
- [x] Q4: Button label and icon. Answer (2026-10-15): fixed English label `Show password`, constant, with `aria-pressed` for the state. No label prop in v1. Icon shows the action: `visibility` while hidden, `visibility_off` while shown. Add a label prop when a client needs another language.
- [x] Q5: Focus and keyboard. Answer (2026-10-15): the input keeps focus after a toggle. The toggle button is in the tab order. `disabled` disables the button. `readOnly` leaves the button working.

## 3. Behavior and defaults

- [x] Q6: Defaults. Answer (2026-10-15): `autoComplete="current-password"`, `autoCapitalize="off"`, `spellCheck={false}`. A caller passes `autoComplete="new-password"` for a new password (native attribute overrides the default). No extra prop.
- [x] Q7: Strength hint. Answer (2026-10-15): out. Strength and requirement checks live outside `PasswordInput`. The caller reads the value through `onValueChange` and shows the result in its own markup, such as `Field.Description`. No strength prop or part.

## 4. Extension props and Base UI surface

- [x] Q8: Extension props. Answer (2026-10-15): none new. `PasswordInput` has `size` and `start` from `TextInput`. The toggle button takes no props.
- [x] Q9: Members. Answer (2026-10-15): same as `TextInput` (native attributes and `ref` to the `<input>`, `className` to the frame), plus: `end`, `type`, and `style` omitted. `autoComplete`, `autoCapitalize`, and `spellCheck` are native attributes with defaults (Q6).

## 5. Token mapping

Claude calls (token interview scope): colors, radius, border, and focus ring in `spec.md`. Reuses the `TextInput` mapping.

## Open items

- Field error text color (token spec section 9, item 4).

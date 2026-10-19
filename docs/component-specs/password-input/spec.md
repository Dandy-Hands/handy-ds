Status:
- spec: reviewed
- code: built
- figma: built
- docs: built

# Internal Spec: PasswordInput

- Date: 2026-10-19
- Interview: `interview-guide-2026-10-15.md`
- Base UI version documented from: `@base-ui/react` 1.8.0 (`@base-ui/react/input`)

## Description

PasswordInput is a single-line field for a secret. It renders the shared `Input` base (frame, input, slots) with `type="password"` and a show/hide button in the `end` slot. The field starts hidden. The button switches the input between `type="password"` and `type="text"`. Strength and requirement checks are not part of the component: the caller reads the value with `onValueChange`.

## Usage

- Do use PasswordInput when the user enters or confirms a password.
- Do wrap it in a `Field` when it has a visible label. Use a bare PasswordInput only with an `aria-label`.
- Do pass `autoComplete="new-password"` for a sign-up or a change-password form.
- Don't use it for a value that is not secret. Use TextInput.
- Don't show strength with a prop. Read the value with `onValueChange` and show the result in `Field.Description` or your own markup.

## Base UI API

Built on the internal `Input` base (`src/components/Input.tsx`), which wraps `Input` from `@base-ui/react/input`. The base is not exported from `index.ts`.

| Member | Decision |
| --- | --- |
| `value`, `defaultValue`, `onValueChange` | Exposed on the `<input>`. |
| Native `<input>` attributes (`name`, `placeholder`, `disabled`, `required`, `readOnly`, `inputMode`, `maxLength`, `id`, `aria-*`, ...) | Exposed on the `<input>`. |
| `autoComplete`, `autoCapitalize`, `spellCheck` | Exposed as native attributes with defaults: `current-password`, `off`, `false`. |
| `ref` | Exposed on the `<input>`. |
| `render` | Exposed on the `<input>`. |
| `className` | Exposed on the frame. |
| `type` | Omitted. PasswordInput sets it from the toggle state. |
| `end` | Omitted. The toggle button owns the `end` slot. |
| `size` (HTML attribute), `style` | Omitted. |

## Extension API

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `PasswordInputSize = '800' \| '1000' \| '1200'` | `'1000'` | Control height, a `measure/size` step (32, 40, 48px at density 1). Same axis as TextInput. |
| `start` | `ReactNode` | none | Content before the text, inside the frame. Slot prop. |

No new props. The toggle button takes no props from the caller. The state props `visible`, `defaultVisible`, and `onVisibleChange` can be added when a second use appears (API conventions section 1).

## Behavior

- The field starts hidden (`type="password"`). The button flips it. There is no reset on blur or on submit in v1.
- The button is a native `<button type="button">` with `aria-label="Show password"` and `aria-pressed`. The label is a fixed English string and does not change. A label prop can be added when a client needs another language.
- The icon shows the action: `visibility` while hidden, `visibility_off` while shown. The icon is an `Icon` glyph name and needs the Material Symbols font.
- A pointer press on the button does not move focus away from the input. Keyboard activation keeps focus on the button.
- The button is in the tab order. `disabled` disables the button. `readOnly` leaves it working.

## Token mapping

PasswordInput reuses the TextInput mapping (`docs/component-specs/input/spec.md`) and adds the button.

| Part | Property | Token |
| --- | --- | --- |
| Frame, input, `start` | as TextInput | see the TextInput spec |
| Toggle button | `color` | inherits the `end` slot color: `hds/sem/color/content/muted/fg`; disabled: `hds/sem/color/field/disabled/fg` |
| Toggle button, hover | `background`, `color` | `hds/sem/color/action/tertiary/hover/{bg,fg}` (from `.hds-control__button` in `control.css`) |
| Toggle button | `border-radius` | `hds/sem/radius/control` (private `--_radius`) |
| Toggle button | box size | `1.5em` of the field font size |
| Focus ring | outline | `hds/sem/color/focus/ring`, `hds/sem/border/focus` on the frame |

Notes:

- Claude calls (token interview scope): the colors and shapes above.
- Contrast: the tertiary hover pair is checked by `src/tokens/contrast.ts`. The muted icon color on `field/default/bg` is not in the checker yet (same gap as TextInput).
- Context-passive: all colors re-resolve from ancestor `data-context` and `data-section` overrides.

## Code consequences (for `hds-component-code`)

Built on 2026-10-19:

- `src/components/Input.tsx` is the internal base. `TextInput.tsx` is now a thin wrapper that sets `type="text"`.
- `src/components/PasswordInput.tsx` and `PasswordInput.css`. Exported from `src/index.ts` with `PasswordInputProps` and `PasswordInputSize`.
- Add `docs/components/password-input.mdx` and `e2e/password-input.spec.ts` (the toggle is behavior Base UI does not provide).

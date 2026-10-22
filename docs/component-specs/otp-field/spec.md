Status:
- spec: reviewed
- code: built
- figma: built
- docs: built

# Internal Spec: OtpInput

- Date: 2026-10-21
- Interview: `interview-guide-2026-10-21.md`
- Base UI version documented from: `@base-ui/react` 1.8.0 (`@base-ui/react/otp-field`)
- Folder name: `otp-field/` (the component is named `OtpInput`, like `NumberInput`, `PasswordInput`).

## Description

OtpInput is a row of single-character boxes for a one-time code or a verification code. Each character has its own box. The boxes fill from the first one, and focus moves on as the user types. A paste or an SMS autofill fills all the boxes. The value is one string. The `groups` prop splits the boxes into groups with a separator, such as `3 + 3`.

## Usage

- Do use OtpInput for a short code that the user gets by SMS, email, or an authenticator app, and for a short PIN (with `mask`).
- Do wrap it in a `Field` when it has a visible label. Use a bare OtpInput only with an `aria-label`.
- Do use `onValueComplete` to verify the code when the last box is filled.
- Don't use it for a long or variable-length value. Use TextInput.
- Don't use it for a password. Use PasswordInput.
- Don't use it for a number the user thinks of as a quantity. Use NumberInput.

## Base UI API

Wrapped component: `OTPField` from `@base-ui/react/otp-field`. The component renders `Root`, one `Input` per box, and one `Separator` between groups. The caller does not see the parts.

| Base UI member | Decision |
| --- | --- |
| `length` | Replaced (interview 2026-10-21) by the extension prop `groups`. The component passes the sum of `groups` as `length`. |
| `value`, `defaultValue`, `onValueChange` | Exposed. `value` is a `string`. `''` is an empty field. |
| `onValueComplete` | Exposed. Called when all boxes are filled. |
| `onValueInvalid` | Exposed. Called when typed or pasted text has rejected characters. |
| `validationType` | Exposed. `numeric` (default), `alpha`, `alphanumeric`, `none`. |
| `mask` | Exposed. Boolean, off by default. |
| `autoComplete` | Exposed. Default `one-time-code`. |
| `name`, `form`, `id`, `required`, `disabled`, `readOnly` | Exposed, on `Root`. `id` names the first box. |
| `normalizeValue` | Omitted (interview 2026-10-21). Add at the second real use. |
| `inputMode` | Omitted. `validationType` sets the keyboard. |
| `autoSubmit` | Omitted (interview 2026-10-21). The caller submits in `onValueComplete`. |
| `Input` (the part) | Not exposed. The component renders one `Input` per box. It adds the `aria-label` (below). |
| `Separator` (the part) | Not exposed. The component renders it between groups. |
| `render`, `style` | Omitted. The component owns the elements. The `render` rule is still open (`.claude/TODO.md`). |
| `className` | Exposed on the root. |
| `ref` | Exposed on the root element. |
| `data-disabled`, `data-readonly`, `data-required`, `data-valid`, `data-invalid`, `data-touched`, `data-dirty`, `data-filled`, `data-focused`, `data-complete` | Kept on the parts. The boxes read them. |

Prop routing: the Root members above go to `Root`. Other native attributes (`aria-*`, `data-*`) go to `Root`. The prop type is `Omit<OTPField.Root.Props, 'render' | 'style' | 'length' | 'normalizeValue' | 'inputMode' | 'autoSubmit' | 'children'>` plus `size` and `groups`.

## Extension API

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `groups` | `number[]` | `[6]` | The number of boxes in each group. `[6]` is six boxes. `[3, 3]` is two groups of three with a separator between them. The sum is the code length. Counts are numbers (API conventions section 4). |
| `size` | `OtpInputSize = '800' \| '1000' \| '1200'` | `'1000'` | Box height, a `measure/size` step (32, 40, 48px at density 1). Each box is a square of this size. Set as `data-size`. Same axis as TextInput. Not responsive. |

`mask` is a Base UI member kept as is. It is not an extension prop.

Each box after the first has a built-in `aria-label`: `Character 2 of 6`. The first box takes its name from the `Field` label (Base UI ignores an `aria-label` on it). The strings are English in v1; localization is not in scope. The root has `role="group"`. The caller gives the group its name with `aria-label`, or through a `Field`.

No `width` prop. The row has the width of its boxes and gaps.

## Behavior

- Typing a valid character fills the focused box and moves focus to the next box. Backspace clears the box and moves focus back. Arrow keys move between boxes. Base UI provides this.
- A paste fills the boxes from the focused box. A full code pasted into the first box fills all boxes. A full code pasted into a later box is cut off at the end (decided 2026-10-21: keep this behavior).
- Whitespace is removed from typed and pasted text. Characters that fail `validationType` are dropped and reported to `onValueInvalid`.
- `validationType`: `numeric` accepts 0 to 9 and shows the numeric keyboard. `alpha` accepts letters. `alphanumeric` accepts letters and digits. `none` accepts any character. The last three show the text keyboard.
- `mask` shows each character as a dot after entry. The value stays the real text.
- `onValueComplete` is called when all boxes are filled, and when a full code is pasted over a full value.
- Inside a `Field.Root`, Base UI wires the label, description, and validity. Invalid state shows on every box.
- `disabled` disables all boxes. `readOnly` shows the code and blocks changes.

## Structure

```
<div class="hds-otp-input" role="group" data-size>        Root (className goes here)
  <input class="hds-control hds-otp-input__slot">         one per box
  ...
  <div class="hds-otp-input__separator" role="separator">  between groups only
  <input class="hds-control hds-otp-input__slot">
  ...
</div>
```

## Token mapping

Each box reuses the TextInput frame look (`docs/component-specs/input/spec.md`). All values below are Claude calls (token interview scope).

| Part | Property | Token |
| --- | --- | --- |
| Box | `inline-size`, `block-size` | `hds/sem/measure/size/{size}` (a square) |
| Box | `padding` | none. The character is centered. |
| Box | `border` width | `hds/sem/border/control` |
| Box | `border-radius` | `hds/sem/radius/control` |
| Box, default | `background`, `color`, `border-color` | `hds/sem/color/field/default/{bg,fg,border}` |
| Box, hover | `background`, `color`, `border-color` | `hds/sem/color/field/hover/{bg,fg,border}` |
| Box, focus | `border-color` and outline | `hds/sem/color/field/focus/border`, `hds/sem/color/focus/ring`, `hds/sem/border/focus` |
| Box, invalid | `background`, `color`, `border-color` | `hds/sem/color/field/error/{bg,fg,border}` |
| Box, disabled | `background`, `color`, `border-color` | `hds/sem/color/field/disabled/{bg,fg,border}` |
| Box | font | `hds/sem/typography/body/*`, size `md`; text centered |
| Gap between boxes | `gap` | `hds/sem/measure/space/200` |
| Separator | `inline-size` | `hds/sem/measure/space/300` |
| Separator | `block-size` | `hds/sem/border/divider` |
| Separator | `background` | `hds/sem/color/graphic/divider/strong` |
| Gap around a separator | `margin-inline` | `hds/sem/measure/space/100` |

Notes:

- No new tokens. No primitive or driver references.
- Unlike TextInput, each box is the `<input>` itself, so the box reads `:hover`, `:focus`, `[data-invalid]`, and `:disabled` on itself.
- The separator is a short horizontal line (a dash) centered on the box height.
- Contrast: the Field pairs are checked by `src/tokens/contrast.ts`. `graphic/divider/strong` is a non-text mark; it is decorative, so no new check is needed.
- Context-passive: all colors re-resolve from ancestor `data-context` and `data-section` overrides.

## Code consequences (for `hds-component-code`)

- Create `OtpInput.tsx`. Export `OtpInput`, `OtpInputProps`, and `OtpInputSize` from `src/index.ts` under Form controls.
- Render `Root` with `length = sum(groups)`. Render one `Input` per box with `aria-label` and the box class. Render the shared Separator between groups.
- Share the frame CSS with `control.css`. `control.css` assumes an inline-flex frame with padding; the box needs `padding: 0`, `justify-content: center`, and `text-align: center`. Add a modifier in `OtpInput.css` and do not change `control.css`.
- Warn in development when `groups` has a non-positive or non-integer entry.
- Add `e2e/otp-input.spec.ts` for behavior Base UI does not provide: the `groups` separator count, the slot `aria-label`, and the box size. Base UI covers typing, paste, and focus moves.
- Add `docs/components/otp-input.mdx` with the front matter `category: Form controls`.

## Open points

- `groups` default `[6]` is a Claude call. A caller who wants another length always sets `groups`.
- Pasting a full code into a later box loses characters. Decided to keep (2026-10-21). Revisit if users report it.

## Build notes

- Code, docs, and e2e built 2026-10-21. `e2e/otp-input.spec.ts` covers the group separators, the box labels, the box size, and a full paste.
- The first box has no `aria-label`. Base UI ignores one there and names the first box from the `Field` label. A bare OtpInput with only an `aria-label` on the row leaves the first box without a name; use a `Field`.
- Figma built 2026-10-21: page `OtpInput`. `OtpInput Slot` (15 variants: `size`, `state`; text property `char`) and `OtpInput` (30 variants: `size`, `state`, `groups` of `6` and `3+3`), built from exposed Slot instances. Mask is shown by setting `char` to a dot. Other `groups` have no variant.

# OtpInput

## Usage

OtpInput is a row of single-character boxes for a one-time code or a verification code, such as an SMS or email code. Wrap it in a `Field` when it has a visible label. For a bare OtpInput, give it an `aria-label`. Use `onValueComplete` to check the code when the last box is filled. Don't use it for a long or variable-length value — use TextInput. Don't use it for a password — use PasswordInput.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `groups` | `number[]` | `[6]` | The number of boxes in each group. `[6]` is six boxes. `[3, 3]` is two groups of three, with a separator between them. The sum is the code length. |
| `size` | `'800' \| '1000' \| '1200'` | `'1000'` | Height of each box. Each box is a square. `800`: compact, for dense layouts. `1000`: standard. `1200`: large, for touch layouts. |
| `validationType` | `'numeric' \| 'alpha' \| 'alphanumeric' \| 'none'` | `'numeric'` | Which characters a box accepts. `numeric`: digits 0 to 9, with a number keyboard. `alpha`: letters only. `alphanumeric`: letters and digits. `none`: any character. |
| `mask` | `boolean` | `false` | Shows each entered character as a dot, for a PIN. The value stays the real text. |
| `value` / `defaultValue` | `string` | — | The controlled / initial code. `''` is an empty field. |
| `onValueChange` | `(value: string, eventDetails) => void` | — | Called when the code changes: for each typed character, each deletion, and each paste. |
| `onValueComplete` | `(value: string, eventDetails) => void` | — | Called when all boxes are filled, and when a full code is pasted over a full code. |
| `onValueInvalid` | `(value: string, eventDetails) => void` | — | Called when typed or pasted text has characters that `validationType` rejects. `value` is the text before the characters were removed. |
| `autoComplete` | `string` | `'one-time-code'` | Lets the device fill the code from an SMS or email. |
| `disabled` | `boolean` | `false` | Makes the boxes visible but inert. |
| `readOnly` | `boolean` | `false` | Shows the code but blocks changes. |
| `required` | `boolean` | `false` | The field must have a full code before the form submits. |
| `name` | `string` | — | Identifies the field on form submission. |
| `className` | `string` | — | Class for the outer row. |

All other standard attributes (`id`, `aria-*`, ...) and `ref` are also accepted. `ref` points to the outer row. `id` names the first box. The row takes no `render` and no `style`.

A paste fills the boxes from the focused box. Paste a full code into the first box to fill all boxes. Spaces are removed from typed and pasted text. Each box has a built-in accessible name such as `Character 2 of 6`.

## Examples

```tsx
<Field.Root>
  <Field.Label>Verification code</Field.Label>
  <OtpInput onValueComplete={(code) => verify(code)} />
</Field.Root>
```

```tsx
<Field.Root>
  <Field.Label>PIN</Field.Label>
  <OtpInput groups={[4]} mask size="1200" />
</Field.Root>
```

## Contexts

Honors the theme's context overrides: set `data-context="on-primary"` (on a colored ground), `data-context="default"` (back to normal colors), or `data-section="hero"` on any ancestor and OtpInput's tokens re-resolve automatically.

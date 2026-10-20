# PhoneInput

## Usage

PhoneInput is a single-line field for one phone number. It shows a phone icon and asks the mobile keyboard for the phone keypad. It masks the text, for example `(202) 555-0123`. `onValueChange` and `value` use digits only, for example `2025550123`. Wrap it in a `Field` when it has a visible label. For a bare PhoneInput, give it an `aria-label`. Set `country` to pick the mask; v1 ships `US`. Don't use it for a number from a country it does not ship, or for a value that is not a phone number — use TextInput. To build an international number, join the country code and the digits in your own code.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `country` | `'US'` | `'US'` | Sets the mask, the digit count, and the default `pattern`. |
| `size` | `'800' \| '1000' \| '1200'` | `'1000'` | Height of the field. `800`: compact, for dense layouts. `1000`: standard. `1200`: large, for touch layouts. |
| `end` | `ReactNode` | — | Content after the text, such as a badge or a button. |
| `value` / `defaultValue` | `string` | `''` | The controlled / initial digits. Non-digits are ignored. |
| `onValueChange` | `(digits: string, eventDetails) => void` | — | Called when the digits change. The first argument is digits only. |
| `pattern` | `string` | the country's pattern | The check for a complete number, applied to the shown text. The `US` default needs `(202) 555-0123`. |
| `autoComplete` | `string` | `'tel-national'` | Tells the browser which value to offer. |
| `inputMode` | `string` | `'tel'` | Picks the mobile keypad. |
| `placeholder` | `string` | the country's format, `(555) 555-5555` for `US` | Hint text shown when the field is empty. |
| `disabled` | `boolean` | `false` | Makes the field visible but inert. |
| `readOnly` | `boolean` | `false` | Shows the text but blocks changes. |
| `required` | `boolean` | `false` | The field must have text before the form submits. |
| `name` | `string` | — | Identifies the field on form submission. The form posts the digits, not the masked text. |
| `className` | `string` | — | Class for the outer frame. |
| `render` | `ReactElement \| (props, state) => ReactElement` | — | Replaces the rendered input element. |

All other standard input attributes (`id`, `spellCheck`, `aria-*`, ...) and `ref` are also accepted. `ref` points to the visible input element. The field takes no `type`, `start`, `multiple`, or `style`.

## Examples

```tsx
<Field.Root>
  <Field.Label>Phone</Field.Label>
  <PhoneInput name="phone" required placeholder="(555) 555-5555" />
  <Field.Error match="patternMismatch">Enter a 10-digit phone number.</Field.Error>
</Field.Root>
```

```tsx
<PhoneInput aria-label="Mobile phone" onValueChange={(digits) => setPhone(`+1${digits}`)} />
```

## Contexts

Honors the theme's context overrides: set `data-context="on-primary"` (on a colored ground), `data-context="default"` (back to normal colors), or `data-section="hero"` on any ancestor and PhoneInput's tokens re-resolve automatically.

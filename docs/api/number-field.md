# NumberInput

## Usage

NumberInput is a single-line field for an exact number, such as a price, an amount, a quantity, or a percentage. Wrap it in a `Field` when it has a visible label. For a bare NumberInput, give it an `aria-label`. Set `format` for currency, percent, or a unit. Set `steppers` for a small count such as seats or copies. Don't use it for a value that the user picks by feel in a known range — use Slider. Don't use it for a phone number, a postal code, or an ID — use TextInput or PhoneInput.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'800' \| '1000' \| '1200'` | `'1000'` | Height of the field. `800`: compact, for dense layouts. `1000`: standard. `1200`: large, for touch layouts. |
| `steppers` | `boolean` | `false` | Shows a − button at the start edge and a + button at the end edge. The arrow keys step the value with or without the buttons. |
| `start` | `ReactNode` | — | Content before the number, such as an icon. |
| `end` | `ReactNode` | — | Content after the number, such as a unit or a button. |
| `value` / `defaultValue` | `number \| null` | — | The controlled / initial value. `null` is an empty field. |
| `onValueChange` | `(value: number \| null, eventDetails) => void` | — | Called when the value changes, for each keystroke and each step. |
| `onValueCommitted` | `(value: number \| null, eventDetails) => void` | — | Called when the user finishes a change: on blur after typing, or after a button press. |
| `min` / `max` | `number` | — | The smallest / largest allowed value. |
| `step` | `number \| 'any'` | `1` | Amount added or removed by the arrow keys and the steppers. `'any'` turns step validation off. |
| `smallStep` | `number` | `0.1` | Step while the Alt key is held. |
| `largeStep` | `number` | `10` | Step while the Shift key is held. |
| `snapOnStep` | `boolean` | `false` | A step moves the value to the nearest multiple of the step. |
| `allowOutOfRange` | `boolean` | `false` | A typed number outside `min` and `max` stays, and the field shows the invalid state. Without it, the field changes the number to the limit on blur. The invalid state shows inside a `Field` with `validationMode="onBlur"`. |
| `format` | `Intl.NumberFormatOptions` | — | How the number looks. The value stays a plain number. Currency: `{ style: 'currency', currency: 'USD' }`. Percent: `{ style: 'percent' }`, where `0.5` shows as `50%`. Unit: `{ style: 'unit', unit: 'kilogram' }`. |
| `locale` | `Intl.LocalesArgument` | browser locale | Sets the decimal mark, the group mark, and the place of a currency symbol. |
| `placeholder` | `string` | — | Hint text shown when the field is empty. |
| `disabled` | `boolean` | `false` | Makes the field visible but inert. |
| `readOnly` | `boolean` | `false` | Shows the number but blocks changes. |
| `required` | `boolean` | `false` | The field must have a number before the form submits. |
| `name` | `string` | — | Identifies the field on form submission. |
| `className` | `string` | — | Class for the outer frame. |

All other standard input attributes (`id`, `autoComplete`, `aria-*`, ...) and `ref` are also accepted. `ref` points to the input element. The field takes no `render` and no `style`.

The value is a floating-point number, and the field does not round it. For money, round the value or keep whole cents.

## Examples

```tsx
<Field.Root>
  <Field.Label>Price</Field.Label>
  <NumberInput
    defaultValue={1250}
    min={0}
    format={{ style: 'currency', currency: 'USD' }}
    start={<Icon>payments</Icon>}
  />
</Field.Root>
```

```tsx
<Field.Root>
  <Field.Label>Seats</Field.Label>
  <NumberInput steppers defaultValue={2} min={1} max={20} />
</Field.Root>
```

## Contexts

Honors the theme's context overrides: set `data-context="on-primary"` (on a colored ground), `data-context="default"` (back to normal colors), or `data-section="hero"` on any ancestor and NumberInput's tokens re-resolve automatically.

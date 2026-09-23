# NumberField

## Usage

NumberField is a number input with minus/plus steppers, for a quantity the user nudges up and down. Use it with `min`/`max` clamps and optional `format` for currency, percent, or unit display. Do not use it when the exact number does not matter and any value in a range is acceptable — that is slider territory, and the library does not ship a slider yet.

## Parts

| Part | Renders | Description |
| --- | --- | --- |
| `NumberField.Root` | `<div>` | Owns the value, clamps (`min`, `max`), steps, and formatting. |
| `NumberField.Group` | `<div>` | The visible frame; carries `data-size`. Contains Input and the steppers. |
| `NumberField.Input` | `<input>` | The editable text value. |
| `NumberField.Decrement` | `<button>` | Steps the value down (built-in minus icon). |
| `NumberField.Increment` | `<button>` | Steps the value up (built-in plus icon). |
| `NumberField.ScrubArea` | `<span>` | Optional drag-to-scrub region, unstyled. |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data-size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Group size. `sm` — dense rows and compact layouts. `md` — default. `lg` — hero and marketing forms. |
| `value` | `number \| null` | — | Controlled value. |
| `defaultValue` | `number` | — | Uncontrolled initial value. |
| `min` / `max` | `number` | — | Clamp range. Values outside it are invalid and flagged. |
| `step` | `number \| 'any'` | `1` | Amount added by the steppers and arrow keys. `'any'` allows decimals. |
| `smallStep` / `largeStep` | `number` | `0.1` / `10` | Step for Page Down/Up and Shift-modified keys. |
| `snapOnStep` | `boolean` | `true` | Snags the value back onto a step multiple after typing. |
| `allowOutOfRange` | `boolean` | `false` | `false` — out-of-range values revert and the field is flagged. `true` — out-of-range values are kept while typing. |
| `allowWheelScrub` | `boolean` | `false` | Lets the mouse wheel change the value while the input is focused. |
| `format` | `Intl.NumberFormatOptions` | — | Display format: `style: 'currency'`, percent, units, fraction digits. |
| `locale` | `Intl.LocalesArgument` | browser locale | Locale used for parsing and formatting. |
| `onValueChange` | `(value: number \| null, eventDetails) => void` | — | Fires while the value changes (typing, steppers, keys). |
| `onValueCommitted` | `(value: number \| null, eventDetails) => void` | — | Fires when a value is committed (blur, Enter). |
| `disabled` | `boolean` | `false` | Visible but inert. |
| `readOnly` | `boolean` | `false` | Value cannot be changed but stays focusable. |
| `required` | `boolean` | `false` | Marks the field required for form submission. |
| `name` / `form` | `string` | — | Form field name and owning form id. |

All standard attributes (`id`, `aria-*`, ...) are also accepted.

## Examples

```tsx
<NumberField.Root defaultValue={2} min={0}>
  <NumberField.Group>
    <NumberField.Decrement />
    <NumberField.Input />
    <NumberField.Increment />
  </NumberField.Group>
</NumberField.Root>
```

```tsx
<NumberField.Root
  defaultValue={9.99}
  min={0}
  format={{ style: 'currency', currency: 'USD' }}
>
  <NumberField.Group data-size="sm">
    <NumberField.Decrement />
    <NumberField.Input />
    <NumberField.Increment />
  </NumberField.Group>
</NumberField.Root>
```

## Contexts

Honors the theme's context overrides: set `data-context="on-primary"` (on a colored ground), `data-context="default"` (back to normal colors), or `data-section="hero"` on any ancestor and NumberField's tokens re-resolve automatically.

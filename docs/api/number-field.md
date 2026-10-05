# NumberField

## Usage

NumberField is a number input with decrement and increment steppers. Use it for a quantity the user nudges up and down — seats, copies, minutes. Don't use it for a short known list of options (use Select or Radio) or for a range with no exact number in mind.

## Props

### NumberField.Root

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` / `defaultValue` | `number` | — | The controlled / initial value. |
| `min` / `max` | `number` | — | The smallest / largest allowed value. |
| `step` | `number \| 'any'` | `1` | Amount added or removed by the steppers and arrow keys. |
| `onValueChange` | `(value, eventDetails) => void` | — | Fires when the value changes. |

### NumberField.Group

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data-size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Control size. `sm` — dense rows. `md` — default. `lg` — large or hero forms. |
| `children` | `ReactNode` | — | Group content: decrement button, value input, increment button. |

`render` (`ReactElement \| (props, state) => ReactElement`) replaces the rendered element on any part. All standard attributes (`id`, `aria-*`, `name`, ...) are also accepted.

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
<NumberField.Group data-size="sm">
  <NumberField.Decrement />
  <NumberField.Input />
  <NumberField.Increment />
</NumberField.Group>
```

## Contexts

No own context handling. The group is a form control; contrast holds in the default context and inside `data-context="default"` containers.

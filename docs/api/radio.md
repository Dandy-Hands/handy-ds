# Radio

## Usage

Radio is one choice out of two to five options that should all stay visible. Use it when the user picks exactly one value and the options fit on screen. Don't use it beyond about five options — use Select — or when several values can be picked at once — use Checkbox.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | — | The value this option submits; identifies it inside the RadioGroup. |
| `checked` / `defaultChecked` | `boolean` | — | The controlled / initial selection (managed by the RadioGroup). |
| `onCheckedChange` | `(checked, eventDetails) => void` | — | Fires when the option is selected. |
| `name` | `string` | — | Identifies the field on form submission. |
| `disabled` | `boolean` | `false` | Ignores interaction and dims the option. |
| `render` | `ReactElement \| (props, state) => ReactElement` | — | Replaces the rendered element on any part. |
| `children` | `ReactNode` | — | Indicator content. |

All standard attributes (`id`, `aria-*`, `required`, ...) are also accepted.

## Examples

```tsx
<Fieldset.Root>
  <Fieldset.Legend>Payment</Fieldset.Legend>
  <Field.Label><Radio.Root value="card"><Radio.Indicator /></Radio.Root>Card</Field.Label>
  <Field.Label><Radio.Root value="bank"><Radio.Indicator /></Radio.Root>Bank transfer</Field.Label>
</Fieldset.Root>
```

```tsx
<RadioGroup defaultValue="card">
  <Field.Label><Radio.Root value="card"><Radio.Indicator /></Radio.Root>Card</Field.Label>
  <Field.Label><Radio.Root value="cash" disabled><Radio.Indicator /></Radio.Root>Cash</Field.Label>
</RadioGroup>
```

## Contexts

No own context handling. The circle reads Input/Field tokens; contrast holds in the default context and inside `data-context="default"` containers.

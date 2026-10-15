# Radio

## Usage

Radio is one choice out of two to five options that stay visible. Use it when the user picks exactly one value and the options fit on screen. Put every Radio inside a `Radio.Group`, and name the group with a `Fieldset.Legend`. Don't use it beyond about five options — use Select — or when several values can be picked at once — use Checkbox.

## Props

### Radio

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | — | Identifies the radio in its `Radio.Group`, and is the value submitted when it is selected. Required. |
| `size` | `'500' \| '600' \| '800'` | `'500'` | Size of the radio icon. `500`: standard. `600`: roomy forms. `800`: large, for touch layouts. |
| `disabled` | `boolean` | `false` | Makes the radio visible but inert. |
| `readOnly` | `boolean` | `false` | Shows the state but blocks changes. |
| `required` | `boolean` | `false` | The user must choose a value before the form submits. |
| `render` | `ReactElement \| (props, state) => ReactElement` | — | Replaces the rendered element. |

A `Radio` must sit inside a `Radio.Group`, which owns the selection. All other standard attributes (`id`, `aria-*`, ...) and `ref` are also accepted. The radio takes no `className`, `style`, or children.

### Radio.Group

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `'horizontal' \| 'vertical'` | `'vertical'` | Layout direction of the radios. `vertical`: a stack. `horizontal`: a row that wraps. |
| `value` / `defaultValue` | `string` | — | The controlled / initial `value` of the selected radio. |
| `onValueChange` | `(value: string, eventDetails) => void` | — | Called when the selection changes. |
| `name` | `string` | — | Identifies the field on form submission. |
| `disabled` | `boolean` | `false` | Makes every radio visible but inert. |
| `readOnly` | `boolean` | `false` | Shows the selection but blocks changes. |
| `required` | `boolean` | `false` | The user must choose a value before the form submits. |
| `render` | `ReactElement \| (props, state) => ReactElement` | — | Replaces the rendered element. |
| `children` | `ReactNode` | — | The radios, each with its label. |

The group takes no `className` or `style`.

## Examples

```tsx
<Fieldset.Root>
  <Fieldset.Legend>Payment</Fieldset.Legend>
  <Radio.Group defaultValue="card" name="payment">
    <Field.Label><Radio value="card" />Card</Field.Label>
    <Field.Label><Radio value="bank" />Bank transfer</Field.Label>
  </Radio.Group>
</Fieldset.Root>
```

```tsx
<Radio.Group orientation="horizontal" defaultValue="card">
  <Field.Label><Radio value="card" />Card</Field.Label>
  <Field.Label><Radio value="cash" disabled />Cash (unavailable)</Field.Label>
</Radio.Group>
```

## Contexts

Honors the theme's context overrides: set `data-context="on-primary"` (on a colored ground), `data-context="default"` (back to normal colors), or `data-section="hero"` on any ancestor and Radio's tokens re-resolve automatically.

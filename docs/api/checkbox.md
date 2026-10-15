# Checkbox

## Usage

Checkbox is a yes/no control, or one of several picked from a few options. Use it when the value is submitted with a form, or when several options can be picked at once. Don't use it for a setting that applies the moment it changes — use Switch. Label every checkbox with `Field.Label` or a wrapping `<label>`.

## Props

### Checkbox

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'500' \| '600' \| '800'` | `'500'` | Size of the checkbox icon. `500`: standard. `600`: roomy forms. `800`: large, for touch layouts. |
| `checked` / `defaultChecked` | `boolean` | — | The controlled / initial tick state. |
| `indeterminate` | `boolean` | `false` | Shows a dash: the box stands for a partly selected set. |
| `onCheckedChange` | `(checked: boolean, eventDetails) => void` | — | Called when the box is ticked or unticked. |
| `value` | `string` | — | The name of this box in a `Checkbox.Group`. Also the value submitted with the form when checked. |
| `name` | `string` | — | Identifies the field on form submission. |
| `disabled` | `boolean` | `false` | Makes the box visible but inert. |
| `readOnly` | `boolean` | `false` | Shows the state but blocks changes. |
| `required` | `boolean` | `false` | The box must be ticked before the form submits. |
| `render` | `ReactElement \| (props, state) => ReactElement` | — | Replaces the rendered element. |

All other standard attributes (`id`, `form`, `aria-*`, ...) and `ref` are also accepted. The box takes no `className` or `style`, and no children.

### Checkbox.Group

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `'horizontal' \| 'vertical'` | `'vertical'` | Layout direction of the checkboxes. |
| `value` / `defaultValue` | `string[]` | — | The controlled / initial `value`s of the ticked boxes. |
| `onValueChange` | `(value: string[], eventDetails) => void` | — | Called when a box in the group is ticked or unticked. |
| `disabled` | `boolean` | `false` | Makes every box visible but inert. |
| `render` | `ReactElement \| (props, state) => ReactElement` | — | Replaces the rendered element. |
| `children` | `ReactNode` | — | The checkboxes, each with its label. |

The group takes no `className` or `style`.

## Examples

```tsx
<Field.Root>
  <Field.Label>
    <Checkbox defaultChecked name="news" />
    Subscribe to the newsletter
  </Field.Label>
</Field.Root>
```

```tsx
<Checkbox.Group defaultValue={['email']} orientation="horizontal">
  <Field.Label><Checkbox value="email" />Email</Field.Label>
  <Field.Label><Checkbox value="sms" />SMS</Field.Label>
</Checkbox.Group>
```

## Contexts

Honors the theme's context overrides: set `data-context="on-primary"` (on a colored ground), `data-context="default"` (back to normal colors), or `data-section="hero"` on any ancestor and Checkbox's tokens re-resolve automatically.

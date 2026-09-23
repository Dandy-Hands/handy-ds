# Checkbox

## Usage

Checkbox is a yes/no control, or one of several picked from a few options. Use it when the value is submitted with a form, or when several options can be picked at once. Don't use it for a setting that applies the moment it changes — use Switch. Label every checkbox with `Field.Label` or a wrapping `<label>`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `checked` / `defaultChecked` | `boolean` | — | The controlled / initial tick state. |
| `indeterminate` | `boolean` | `false` | Shows a dash: the box stands for a partly selected set. |
| `onCheckedChange` | `(checked, eventDetails) => void` | — | Fires when the box is ticked or unticked. |
| `value` | `string` | — | The value submitted with the form when checked. |
| `name` | `string` | — | Identifies the field on form submission. |
| `disabled` | `boolean` | `false` | Ignores interaction and dims the box. |
| `render` | `ReactElement \| (props, state) => ReactElement` | — | Replaces the rendered element on any part. |
| `children` | `ReactNode` | — | Indicator content; the built-in check and dash glyphs can be overridden. |

All standard attributes (`id`, `aria-*`, `required`, ...) are also accepted.

## Examples

```tsx
<Field.Root>
  <Field.Label>
    <Checkbox.Root defaultChecked><Checkbox.Indicator /></Checkbox.Root>
    Subscribe
  </Field.Label>
</Field.Root>
```

```tsx
<CheckboxGroup defaultValue={['email']}>
  <Field.Label><Checkbox.Root value="email"><Checkbox.Indicator /></Checkbox.Root>Email</Field.Label>
  <Field.Label><Checkbox.Root value="sms"><Checkbox.Indicator /></Checkbox.Root>SMS</Field.Label>
</CheckboxGroup>
```

## Contexts

No own context handling. The box reads Input/Field tokens; contrast holds in the default context and inside `data-context="default"` containers.

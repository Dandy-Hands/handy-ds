# Switch

## Usage

Switch is an on/off control whose change applies the moment it flips. Use it for a preference or a visibility flag. Label it with a `Field.Label` or a wrapping `<label>`. Don't use it when the value is submitted with a form — use Checkbox. Don't use it to pick one option from several — use Radio.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'500' \| '600' \| '800'` | `'500'` | Size of the switch icon. `500`: standard. `600`: roomy forms. `800`: large, for touch layouts. |
| `checked` / `defaultChecked` | `boolean` | `false` | The controlled / initial on state. |
| `onCheckedChange` | `(checked: boolean, eventDetails) => void` | — | Called when the switch flips. |
| `disabled` | `boolean` | `false` | Makes the switch visible but inert. |
| `readOnly` | `boolean` | `false` | Shows the state but blocks changes. |
| `required` | `boolean` | `false` | The switch must be on before the form submits. |
| `name` | `string` | — | Identifies the field on form submission. |
| `value` | `string` | — | The value submitted when the switch is on. |
| `render` | `ReactElement \| (props, state) => ReactElement` | — | Replaces the rendered element. |

All other standard attributes (`id`, `form`, `aria-*`, ...) and `ref` are also accepted. The switch takes no `className`, `style`, or children.

## Examples

```tsx
<Field.Label><Switch defaultChecked />Email notifications</Field.Label>
```

```tsx
<Field.Label><Switch size="800" disabled />Sync (unavailable)</Field.Label>
```

## Contexts

Honors the theme's context overrides: set `data-context="on-primary"` (on a colored ground), `data-context="default"` (back to normal colors), or `data-section="hero"` on any ancestor and Switch's tokens re-resolve automatically.

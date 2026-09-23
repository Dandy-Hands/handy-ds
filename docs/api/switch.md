# Switch

## Usage

Switch is an on/off control whose change takes effect the moment it flips. Use it for immediate settings — a toggle in a preferences panel, a visibility flag. Don't use it when the value is submitted with a form — use Checkbox. Label it with `Field.Label` or a wrapping `<label>`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `checked` / `defaultChecked` | `boolean` | — | The controlled / initial state. |
| `onCheckedChange` | `(checked, eventDetails) => void` | — | Fires when the switch is flipped. |
| `value` | `string` | — | The value submitted with the form when the switch is on. |
| `name` | `string` | — | Identifies the field on form submission. |
| `disabled` | `boolean` | `false` | Ignores interaction and dims the track. |
| `render` | `ReactElement \| (props, state) => ReactElement` | — | Replaces the rendered element on any part. |
| `children` | `ReactNode` | — | Switch content; `Switch.Thumb` renders the sliding knob. |

All standard attributes (`id`, `aria-*`, ...) are also accepted.

## Examples

```tsx
<label>
  <Switch.Root defaultChecked><Switch.Thumb /></Switch.Root>
  Email notifications
</label>
```

```tsx
<Field.Root>
  <Field.Label>
    <Switch.Root /><Switch.Thumb />
    Public profile
  </Field.Label>
</Field.Root>
```

## Contexts

Honors the theme's context overrides: set `data-context="on-primary"` (on a colored ground), `data-context="default"` (back to normal colors), or `data-section="hero"` on any ancestor and Switch's Action tokens re-resolve automatically.

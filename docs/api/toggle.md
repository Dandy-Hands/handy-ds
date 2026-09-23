# Toggle

## Usage

Toggle is a button that stays pressed. ToggleGroup is a row of them. Use it for formatting controls (bold, italic) or picking one or several from a few options that are all visible. Don't use it for a setting that applies immediately to a preference — use Switch — or for more than about five options — use Select.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data-priority` | `'primary' \| 'secondary' \| 'tertiary'` | `'secondary'` | Visual weight of the toggle's button look. |
| `pressed` / `defaultPressed` (Toggle) | `boolean` | — | The controlled / initial pressed state. |
| `onPressedChange` (Toggle) | `(pressed, eventDetails) => void` | — | Fires when the toggle is pressed or released. |
| `value` (Toggle) | `any` | — | Identifies the toggle inside a ToggleGroup. |
| `multiple` (ToggleGroup) | `boolean` | `false` | Lets several toggles be pressed at once. |
| `value` / `defaultValue` (ToggleGroup) | `any[]` | — | The controlled / initial pressed values. |
| `orientation` (ToggleGroup) | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction of the row. |
| `disabled` | `boolean` | `false` | Ignores interaction. |
| `render` | `ReactElement \| (props, state) => ReactElement` | — | Replaces the rendered element. |
| `children` | `ReactNode` | — | Label content. |

All standard button attributes (`aria-*`, ...) are also accepted.

## Examples

```tsx
<ToggleGroup defaultValue={['b']}>
  <Toggle value="b">Bold</Toggle>
  <Toggle value="i">Italic</Toggle>
</ToggleGroup>
```

```tsx
<ToggleGroup multiple defaultValue={['a', 'c']}>
  <Toggle value="a" data-priority="tertiary">Small</Toggle>
  <Toggle value="c" data-priority="tertiary">Compact</Toggle>
</ToggleGroup>
```

## Contexts

Honors the theme's context overrides: set `data-context="on-primary"` (on a colored ground), `data-context="default"` (back to normal colors), or `data-section="hero"` on any ancestor and Toggle's Action tokens re-resolve automatically.

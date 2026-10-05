# Toggle

## Usage

Toggle is a button that stays pressed. ToggleGroup is a row of them. Use it for formatting controls (bold, italic) or picking one or several from a few options that are all visible. Don't use it for a setting that applies immediately to a preference — use Switch — or for more than about five options — use Select.

## Props

### Toggle

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data-priority` | `'primary' \| 'secondary' \| 'tertiary'` | `'secondary'` | Visual weight of the toggle's button look. |
| `pressed` / `defaultPressed` | `boolean` | — | The controlled / initial pressed state. |
| `onPressedChange` | `(pressed, eventDetails) => void` | — | Fires when the toggle is pressed or released. |
| `value` | `any` | — | Identifies the toggle inside a ToggleGroup. |
| `disabled` | `boolean` | `false` | Ignores interaction. Also on ToggleGroup. |
| `children` | `ReactNode` | — | Label content. |

### ToggleGroup

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `multiple` | `boolean` | `false` | Lets several toggles be pressed at once. |
| `value` / `defaultValue` | `any[]` | — | The controlled / initial pressed values. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction of the row. |

`render` (`ReactElement \| (props, state) => ReactElement`) replaces the rendered element on any part. All standard button attributes (`aria-*`, ...) are also accepted.

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

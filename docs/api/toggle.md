# Toggle

## Usage

Toggle is a button that stays pressed until pressed again, and ToggleGroup is a row of them with single- or multiple-selection. Use them for formatting controls (bold, italic), filters, and picking from a few options that are all visible at once. Do not use them for a setting that applies immediately — use Switch; for more than about five options — use Select.

## Parts

| Part | Renders | Description |
| --- | --- | --- |
| `Toggle` | `<button>` | One two-state button. Set `value` when it lives inside a `ToggleGroup`. |
| `ToggleGroup` | `<div>` | Row (or column with `orientation="vertical"`) of Toggles; manages the selected values. |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `pressed` | `boolean` | — | Controlled pressed state of a standalone `Toggle`. |
| `defaultPressed` | `boolean` | `false` | Uncontrolled initial pressed state. |
| `onPressedChange` | `(pressed: boolean, eventDetails) => void` | — | Fires when a `Toggle` is pressed or released. |
| `value` | `string` | — | Identifies a `Toggle` inside a `ToggleGroup`; appears in the group's value array. |
| `groupValue` | `string[]` | — | `ToggleGroup` only. Set as `value` (controlled) or `defaultValue`. |
| `onValueChange` | `(groupValue: string[], eventDetails) => void` | — | `ToggleGroup` only. Fires when the set of pressed values changes. |
| `multiple` | `boolean` | `false` | `ToggleGroup` only. `false` — at most one Toggle pressed (radio behavior). `true` — any number pressed (checkbox behavior). |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout and arrow-key direction of a `ToggleGroup`. `horizontal` — a row, left/right arrows. `vertical` — a column, up/down arrows. |
| `loopFocus` | `boolean` | `true` | `ToggleGroup` only. Arrow keys wrap from the last Toggle to the first. |
| `disabled` | `boolean` | `false` | Makes the Toggle (or every Toggle in a group) visible but inert. |
| `render` | `ReactElement \| (props, state) => ReactElement` | — | Replaces the rendered element or composes with another component. |
| `children` | `ReactNode` | — | Label content. |

All standard attributes (`id`, `aria-*`, `data-*`, ...) are also accepted. Set `data-priority` to `"primary"` or `"tertiary"` to change a Toggle's visual weight (default is the secondary look).

## Examples

```tsx
<ToggleGroup defaultValue={['b']}>
  <Toggle value="b">Bold</Toggle>
  <Toggle value="i">Italic</Toggle>
</ToggleGroup>
```

```tsx
<Toggle defaultPressed>Panel</Toggle>

<ToggleGroup multiple defaultValue={['pdf', 'csv']}>
  <Toggle value="pdf">PDF</Toggle>
  <Toggle value="csv">CSV</Toggle>
</ToggleGroup>
```

## Contexts

Honors the theme's context overrides: set `data-context="on-primary"` (on a colored ground), `data-context="default"` (back to normal colors), or `data-section="hero"` on any ancestor and Toggle's tokens re-resolve automatically.

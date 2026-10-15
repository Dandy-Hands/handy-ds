# ToggleGroup

## Usage

ToggleGroup is a group of buttons in one container. Each button stays pressed or not. Use it for formatting controls (bold, italic) or to pick one or several from a few options that are all visible. Don't use it for a setting that applies at once — use Switch — or for more than about five options — use Select.

## Props

### ToggleGroup

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'primary' \| 'secondary'` | `'secondary'` | Look of a pressed button. An idle button uses the next weaker look. `primary`: pressed is primary, idle is secondary. `secondary`: pressed is secondary, idle is tertiary. |
| `size` | `'800' \| '1000' \| '1200'` | `'1000'` | Height of the whole group, the same as a Button of that size. The Toggles fill the inside of the group. `800`: dense toolbars and compact layouts. `1000`: standard. `1200`: large, for hero and marketing areas. The label size and the container padding follow. |
| `multiple` | `boolean` | `false` | Lets several buttons be pressed at once. When `false`, pressing a button releases the others. |
| `value` / `defaultValue` | `string[]` | — | The controlled / initial values of the pressed buttons. |
| `onValueChange` | `(value: string[], eventDetails) => void` | — | Called when a button is pressed or released. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction of the buttons. |
| `disabled` | `boolean` | `false` | Makes every button visible but inert. |
| `render` | `ReactElement \| (props, state) => ReactElement` | — | Replaces the rendered element. |
| `children` | `ReactNode` | — | The Toggle parts. |

### Toggle

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | — | Identifies the button in the group. Required. |
| `disabled` | `boolean` | `false` | Makes this button visible but inert. |
| `render` | `ReactElement \| (props, state) => ReactElement` | — | Replaces the rendered element. |
| `children` | `ReactNode` | — | The content: text, an `Icon`, or both. Give an icon-only button an `aria-label`. |

A Toggle must sit inside a `ToggleGroup`. It takes its `variant` and `size` from the `ToggleGroup`. All other standard button attributes (`aria-*`, `id`, ...) and `ref` are also accepted. Neither part takes `className` or `style`.

## Examples

```tsx
<ToggleGroup defaultValue={['b']}>
  <Toggle value="b">Bold</Toggle>
  <Toggle value="i">Italic</Toggle>
</ToggleGroup>
```

```tsx
<ToggleGroup multiple size="800" variant="secondary" defaultValue={['grid']}>
  <Toggle value="grid" aria-label="Grid view"><Icon>grid_view</Icon></Toggle>
  <Toggle value="list" aria-label="List view"><Icon>list</Icon></Toggle>
</ToggleGroup>
```

## Contexts

Honors the theme's context overrides: set `data-context="on-primary"` (on a colored ground), `data-context="default"` (back to normal colors), or `data-section="hero"` on any ancestor and ToggleGroup's tokens re-resolve automatically.

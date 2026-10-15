# Toggle

## Usage

Toggle is a group of buttons in one container. Each button stays pressed or not. Use it for formatting controls (bold, italic) or to pick one or several from a few options that are all visible. Don't use it for a setting that applies at once — use Switch — or for more than about five options — use Select.

## Props

### Toggle

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'primary' \| 'secondary' \| 'tertiary' \| 'danger'` | `'secondary'` | Role and weight of the buttons. `primary`: the main choice. `secondary`: the standard look. `tertiary`: low-weight buttons. `danger`: destructive choices. |
| `size` | `'800' \| '1000' \| '1200'` | `'1000'` | Height of the buttons. `800`: dense toolbars and compact layouts. `1000`: standard. `1200`: large, for hero and marketing areas. The label size and the container padding follow. |
| `multiple` | `boolean` | `false` | Lets several buttons be pressed at once. When `false`, pressing a button releases the others. |
| `value` / `defaultValue` | `string[]` | — | The controlled / initial values of the pressed buttons. |
| `onValueChange` | `(value: string[], eventDetails) => void` | — | Called when a button is pressed or released. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction of the buttons. |
| `disabled` | `boolean` | `false` | Makes every button visible but inert. |
| `render` | `ReactElement \| (props, state) => ReactElement` | — | Replaces the rendered element. |
| `children` | `ReactNode` | — | The `Toggle.Button` parts. |

### Toggle.Button

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | — | Identifies the button in the group. Required. |
| `disabled` | `boolean` | `false` | Makes this button visible but inert. |
| `render` | `ReactElement \| (props, state) => ReactElement` | — | Replaces the rendered element. |
| `children` | `ReactNode` | — | The content: text, an `Icon`, or both. Give an icon-only button an `aria-label`. |

A `Toggle.Button` must sit inside a `Toggle`. It takes its `variant` and `size` from the `Toggle`. All other standard button attributes (`aria-*`, `id`, ...) and `ref` are also accepted. Neither part takes `className` or `style`.

## Examples

```tsx
<Toggle defaultValue={['b']}>
  <Toggle.Button value="b">Bold</Toggle.Button>
  <Toggle.Button value="i">Italic</Toggle.Button>
</Toggle>
```

```tsx
<Toggle multiple size="800" variant="tertiary" defaultValue={['grid']}>
  <Toggle.Button value="grid" aria-label="Grid view"><Icon>grid_view</Icon></Toggle.Button>
  <Toggle.Button value="list" aria-label="List view"><Icon>list</Icon></Toggle.Button>
</Toggle>
```

## Contexts

Honors the theme's context overrides: set `data-context="on-primary"` (on a colored ground), `data-context="default"` (back to normal colors), or `data-section="hero"` on any ancestor and Toggle's tokens re-resolve automatically.

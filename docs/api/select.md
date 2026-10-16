# Select

## Usage

Select picks one value from a fixed list. Use it when the list is known, longer than about five options, and does not need filtering. Don't use it when the user must type to narrow the list — use Combobox — or when the list is short — use Radio.

## Props

Select is a compound component: `Select.Root` takes the configuration props, and `Select.Trigger`, `Select.Value`, `Select.Icon`, `Select.Portal`, `Select.Positioner`, `Select.Popup`, `Select.List`, `Select.Item`, `Select.ItemText`, `Select.ItemIndicator`, `Select.Group`, `Select.GroupLabel`, `Select.Separator`, and `Select.Backdrop` compose the widget.

### Select.Root

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `Array<string \| { label, value }>` | — | The option list the popup renders. |
| `value` | `any` | — | Controlled selected value. |
| `defaultValue` | `any` | — | Uncontrolled initial selected value. |
| `onValueChange` | `(value, event) => void` | — | Fires when the user picks an option. |
| `multiple` | `boolean` | `false` | Allows several selected values; use Combobox for multi-select with chips. |
| `name` | `string` | — | Form field name for native submission. |
| `disabled` | `boolean` | `false` | Makes the whole widget inert. |
| `required` | `boolean` | `false` | Marks the field required for forms. |

### Select.Trigger

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data-size` | `'800' \| '1000' \| '1200'` | `'1000'` | Trigger control size. `800` — dense layouts. `1000` — default. `1200` — large form contexts. |

`children` holds content on `Trigger` (pair `Value` + `Icon`), `Item` (label, or `ItemText`), and `Group` (grouped items). `render` (`ReactElement \| (props, state) => ReactElement`) replaces the rendered element of any part. All standard attributes (`id`, `aria-*`, `className`, ...) are accepted on every part.

## Examples

```tsx
<Select.Root items={fruits} defaultValue="Banana">
  <Select.Label>Fruit</Select.Label>
  <Select.Trigger>
    <Select.Value />
    <Select.Icon />
  </Select.Trigger>
  <Select.Portal>
    <Select.Positioner>
      <Select.Popup>
        <Select.List>
          {fruits.map((f) => (
            <Select.Item key={f} value={f}>
              <Select.ItemText>{f}</Select.ItemText>
              <Select.ItemIndicator />
            </Select.Item>
          ))}
        </Select.List>
      </Select.Popup>
    </Select.Positioner>
  </Select.Portal>
</Select.Root>
```

```tsx
<Select.Root
  items={sizes}
  value={size}
  onValueChange={(v) => setSize(v)}
  disabled={!editable}
>
  <Select.Trigger data-size="800">
    <Select.Value />
    <Select.Icon />
  </Select.Trigger>
  {/* Popup parts as in the first example */}
</Select.Root>
```

## Contexts

Honors the theme's context overrides: set `data-context="on-primary"` (on a colored ground), `data-context="default"` (back to normal colors), or `data-section="hero"` on any ancestor and Select's trigger, popup, and option tokens re-resolve automatically.

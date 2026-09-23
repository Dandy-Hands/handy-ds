# Select

## Usage

Select picks one value from a fixed list. Use it when the list is known, longer than about five options, and does not need filtering. Don't use it when the user must type to narrow the list — use Combobox — or when the list is short — use Radio.

## Props

Select is a compound component: `Select.Root` takes the configuration props, and `Select.Trigger`, `Select.Value`, `Select.Icon`, `Select.Portal`, `Select.Positioner`, `Select.Popup`, `Select.List`, `Select.Item`, `Select.ItemText`, `Select.ItemIndicator`, `Select.Group`, `Select.GroupLabel`, `Select.Separator`, and `Select.Backdrop` compose the widget. All standard attributes (`id`, `aria-*`, `className`, ...) are accepted on every part.

| Prop | Applies to | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `items` | `Root` | `Array<string \| { label, value }>` | — | The option list the popup renders. |
| `value` | `Root` | `any` | — | Controlled selected value. |
| `defaultValue` | `Root` | `any` | — | Uncontrolled initial selected value. |
| `onValueChange` | `Root` | `(value, event) => void` | — | Fires when the user picks an option. |
| `multiple` | `Root` | `boolean` | `false` | Allows several selected values; use Combobox for multi-select with chips. |
| `name` | `Root` | `string` | — | Form field name for native submission. |
| `disabled` | `Root` | `boolean` | `false` | Makes the whole widget inert. |
| `required` | `Root` | `boolean` | `false` | Marks the field required for forms. |
| `children` | `Trigger`, `Item`, `Group` | `ReactNode` | — | Trigger content (pair `Value` + `Icon`), item label (or `ItemText`), grouped items. |
| `render` | any part | `ReactElement \| (props, state) => ReactElement` | — | Replaces the rendered element of a part. |
| `data-size` | `Trigger` | `'sm' \| 'md' \| 'lg'` | `'md'` | Trigger control size. `sm` — dense layouts. `md` — default. `lg` — large form contexts. |

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
  <Select.Trigger data-size="sm">
    <Select.Value />
    <Select.Icon />
  </Select.Trigger>
  {/* Popup parts as in the first example */}
</Select.Root>
```

## Contexts

Honors the theme's context overrides: set `data-context="on-primary"` (on a colored ground), `data-context="default"` (back to normal colors), or `data-section="hero"` on any ancestor and Select's trigger, popup, and option tokens re-resolve automatically.

# Combobox

## Usage

Combobox is a long list the user filters by typing, with single or multi-select (chips). Use it when the list is long or several values are picked at once. Don't use it when the user may enter a value that is not in the list — use Autocomplete — or for a short fixed list — use Radio.

The same package also exports **Autocomplete**: free text with suggestions, for when any text is valid and the list only helps. Its parts and props are identical to Combobox minus the chips parts and `ItemIndicator`.

## Props

Combobox is a compound component: `Combobox.Root` takes the configuration props, and `Combobox.Label`, `Combobox.InputGroup`, `Combobox.Input`, `Combobox.Trigger`, `Combobox.Clear`, `Combobox.Chips`, `Combobox.Chip`, `Combobox.ChipRemove`, `Combobox.Portal`, `Combobox.Positioner`, `Combobox.Popup`, `Combobox.List`, `Combobox.Item`, `Combobox.ItemText`, `Combobox.ItemIndicator`, `Combobox.Group`, `Combobox.GroupLabel`, `Combobox.Separator`, `Combobox.Empty`, `Combobox.Status`, and `Combobox.Backdrop` compose the widget. All standard attributes (`id`, `aria-*`, `className`, ...) are accepted on every part.

| Prop | Applies to | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `items` | `Root` | `Array<string \| { label, value }>` | — | The option list the popup filters and renders. |
| `value` | `Root` | `any \| any[]` | — | Controlled selected value(s). |
| `defaultValue` | `Root` | `any \| any[]` | — | Uncontrolled initial selection. |
| `onValueChange` | `Root` | `(value, event) => void` | — | Fires when the selection changes. |
| `multiple` | `Root` | `boolean` | `false` | Allows several selections; selected values render as removable chips in the input. |
| `name` | `Root` | `string` | — | Form field name for native submission. |
| `disabled` | `Root` | `boolean` | `false` | Makes the whole widget inert. |
| `required` | `Root` | `boolean` | `false` | Marks the field required for forms. |
| `children` | `Item`, `Group` | `ReactNode` | — | Item label (or `ItemText`), grouped items. |
| `render` | any part | `ReactElement \| (props, state) => ReactElement` | — | Replaces the rendered element of a part. |
| `data-size` | `InputGroup` | `'sm' \| 'md' \| 'lg'` | `'md'` | Input group control size. `sm` — dense layouts. `md` — default. `lg` — large form contexts. |

## Examples

```tsx
<Combobox.Root items={countries} defaultValue="Japan">
  <Combobox.Label>Country</Combobox.Label>
  <Combobox.InputGroup>
    <Combobox.Input placeholder="Type to filter…" />
    <Combobox.Clear />
    <Combobox.Trigger />
  </Combobox.InputGroup>
  <Combobox.Portal>
    <Combobox.Positioner>
      <Combobox.Popup>
        <Combobox.List>
          {countries.map((c) => (
            <Combobox.Item key={c} value={c}>
              <Combobox.ItemText>{c}</Combobox.ItemText>
              <Combobox.ItemIndicator />
            </Combobox.Item>
          ))}
        </Combobox.List>
        <Combobox.Empty>No matches</Combobox.Empty>
      </Combobox.Popup>
    </Combobox.Positioner>
  </Combobox.Portal>
</Combobox.Root>
```

```tsx
<Combobox.Root items={tags} multiple value={tags} onValueChange={setTags}>
  <Combobox.InputGroup>
    <Combobox.Chips>
      {(chip) => (
        <Combobox.Chip key={chip.value}>
          {chip.label}
          <Combobox.ChipRemove />
        </Combobox.Chip>
      )}
    </Combobox.Chips>
    <Combobox.Input placeholder="Add tag…" />
  </Combobox.InputGroup>
  {/* Popup parts as in the first example */}
</Combobox.Root>
```

## Contexts

Honors the theme's context overrides: set `data-context="on-primary"` (on a colored ground), `data-context="default"` (back to normal colors), or `data-section="hero"` on any ancestor and Combobox's input, popup, option, and chip tokens re-resolve automatically.

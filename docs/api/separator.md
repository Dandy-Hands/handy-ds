# Separator

## Usage

Separator is a dividing line between groups that spacing alone does not separate. Pass `orientation="vertical"` for a vertical rule inside a row. Don't use it when spacing is enough — a line is noise.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `weight` | `'thin' \| 'medium' \| 'thick'` | `'thin'` | Line thickness. `thin` — default hairline. `medium` — heavier, e.g. under a table header. `thick` — strongest emphasis. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Rule direction; `vertical` stretches to the row height. |
| `render` | `ReactElement \| (props, state) => ReactElement` | — | Replaces the rendered element. |

All standard attributes (`id`, `aria-*`, `className`, ...) are also accepted.

## Examples

```tsx
<Card>
  <Text variant="heading" render={<h3 />}>Billing</Text>
  <Separator />
  <Text>Invoiced monthly.</Text>
</Card>
```

```tsx
<Separator weight="medium" />
```

## Contexts

The line color re-resolves automatically from an ancestor's `data-context="on-primary"`, `data-context="default"`, or `data-section` overrides.

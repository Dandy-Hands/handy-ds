# Separator

## Usage

Separator is a line that marks a boundary between two groups of content. Use it only where spacing alone does not show that one group stops and the next starts. Don't use it for decoration; screen readers announce every Separator.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Line direction. `horizontal`: a line across the width, between stacked groups. `vertical`: an upright line that fills the row height, between groups in a row. |
| `tone` | `'default' \| 'strong'` | `'default'` | Line color. `default`: the standard divider. `strong`: more contrast, for a boundary that must stand out. |

Separator accepts no other props. Set the space around it with the `gap` of its parent layout.

## Examples

```tsx
<Card>
  <Text variant="headline" render={<h3 />}>Billing</Text>
  <Separator />
  <Text>Invoiced monthly.</Text>
</Card>
```

```tsx
<div className="meta-row">
  <Text variant="caption">12 items</Text>
  <Separator orientation="vertical" tone="strong" />
  <Text variant="caption">Updated today</Text>
</div>
```

## Contexts

The line color follows an ancestor's `data-context` (`on-primary`, `on-secondary`, `default`) and `data-section` overrides.

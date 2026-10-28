# Tooltip

## Usage

Tooltip shows a short text label for a control when the pointer rests on it or the control gets keyboard focus. Use it to name an icon-only button or to add a short hint. Don't put links or buttons in it, and don't use it for content the user must read; use Popover, or put the content on the page.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactElement` | — | Required. The control the label describes. One element. Give an icon-only control its own `aria-label`. |
| `content` | `ReactNode` | — | Required. The label text. Keep it to one short phrase. |
| `side` | `'top' \| 'bottom' \| 'inline-start' \| 'inline-end'` | `'top'` | The side of the control the label opens on. `inline-start` and `inline-end` follow the text direction. It flips when it does not fit. |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | How the label lines up along the control. `start`: with the start edge. `center`: centered. `end`: with the end edge. |

The label is always dark, on light and dark pages. Tooltip accepts no other props.

## Examples

```tsx
<Tooltip content="Save draft">
  <Button variant="tertiary" aria-label="Save draft"><Icon>save</Icon></Button>
</Tooltip>
```

## Contexts

The label shows at the end of the page, outside the content around the control. It is always dark. A `data-context`, `data-mode`, or `data-section` on an ancestor does not change it.

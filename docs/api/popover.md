# Popover

## Usage

Popover shows a small panel next to a control when the user clicks it, such as a definition, help text, or a small filter form. The page behind stays usable. Don't use it for a list of commands; use Menu. Don't use it for a task the user must finish before going on; use Dialog. Don't use it for a label on hover; use Tooltip.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactElement` | — | Required. The control that opens the popover, such as a Button. One element. |
| `title` | `ReactNode` | — | Required. The heading of the panel. Screen readers read it as the panel name. |
| `content` | `ReactNode` | — | Required. The panel body. |
| `side` | `'top' \| 'bottom' \| 'inline-start' \| 'inline-end'` | `'bottom'` | The side of the control the panel opens on. `inline-start` and `inline-end` follow the text direction. The panel flips when it does not fit. |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | How the panel lines up along the control. `start`: with the start edge. `center`: centered. `end`: with the end edge. |
| `width` | `'auto' \| '6400' \| '8000' \| '9600' \| '12800'` | `'auto'` | Width of the panel. `auto`: the content sets it, up to `maxWidth`. `6400`: narrow. `8000`: medium. `9600`: wide. `12800`: extra wide. |
| `maxWidth` | `'6400' \| '8000' \| '9600' \| '12800'` | `'9600'` | Largest width of the panel. Same steps as `width`. |
| `open` | `boolean` | — | Optional. Use with `onOpenChange` only to close the panel from code, such as after Apply. |
| `onOpenChange` | `(open: boolean) => void` | — | Optional. Called when the panel opens or closes. |

The panel has an X button. A click outside or `Escape` also closes it. Popover accepts no other props.

## Examples

```tsx
<Popover title="Annual percentage rate" content="The yearly cost of the loan, with interest and fees.">
  <Button variant="tertiary">What is APR?</Button>
</Popover>
```

```tsx
const [open, setOpen] = useState(false);

<Popover
  open={open}
  onOpenChange={setOpen}
  title="Filter results"
  align="start"
  width="8000"
  content={
    <Stack gap="400">
      <Field.Label><Checkbox name="stock" />In stock</Field.Label>
      <Button onClick={() => { applyFilters(); setOpen(false); }}>Apply</Button>
    </Stack>
  }
>
  <Button variant="secondary">Filters</Button>
</Popover>
```

## Contexts

The panel shows at the end of the page, outside the content around the control. It uses the page colors and mode. A `data-context`, `data-mode`, or `data-section` on an ancestor does not change it.

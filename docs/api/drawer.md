# Drawer

## Usage

Drawer is a panel that slides in from an edge of the screen and blocks the page. Use it for longer content where the page context helps: item details, a filter panel, a cart, or the site menu on phones. Don't use it for a short task that needs full attention; use Dialog. Don't use it for content that stays beside the page all the time; use Aside.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | — | Required. Whether the drawer is open. Keep it in state. |
| `onOpenChange` | `(open: boolean) => void` | — | Required. Called when the user closes the drawer with the X button, `Escape`, a click outside, or a swipe. Pass the state setter. |
| `title` | `ReactNode` | — | Required. The heading at the top of the drawer. Screen readers read it as the drawer name. |
| `side` | `'inline-end' \| 'inline-start' \| 'bottom'` | `'inline-end'` | The edge the drawer slides in from. `inline-end`: the end side of the text (the right in English). `inline-start`: the start side (the left in English). `bottom`: the bottom, as a sheet with a grab bar. |
| `width` | `'8000' \| '9600' \| '12800'` | `'9600'` | Width of a side drawer. `8000`: narrow, such as a menu. `9600`: standard. `12800`: wide, such as item details. A bottom drawer ignores it. |
| `actions` | `ReactNode` | — | The buttons at the bottom, such as Clear and Apply. Put the main action last. The row stays visible while the body scrolls. |
| `disablePointerDismissal` | `boolean` | `false` | With `true`, a click outside does not close the drawer. |
| `children` | `ReactNode` | — | The body. It scrolls when it is taller than the drawer. |

A side drawer is as tall as the screen. A bottom drawer is as tall as its content, up to most of the screen. The drawer always has an X button. Drawer accepts no other props.

## Examples

```tsx
const [open, setOpen] = useState(false);

<Button variant="secondary" onClick={() => setOpen(true)}>Filters</Button>
<Drawer
  open={open}
  onOpenChange={setOpen}
  title="Filters"
  actions={
    <>
      <Button variant="secondary" onClick={clearFilters}>Clear</Button>
      <Button onClick={() => setOpen(false)}>Show results</Button>
    </>
  }
>
  <Stack gap="400">
    <Field.Label><Checkbox name="stock" />In stock</Field.Label>
    <Field.Label><Checkbox name="sale" />On sale</Field.Label>
  </Stack>
</Drawer>
```

```tsx
<Drawer open={shareOpen} onOpenChange={setShareOpen} title="Share" side="bottom">
  <Inline gap="200">
    <Button variant="secondary" onClick={copyLink}>Copy link</Button>
    <Button variant="secondary" onClick={sendEmail}>Email</Button>
  </Inline>
</Drawer>
```

## Contexts

The drawer shows on top of the page, outside the content around the button that opened it. It uses the page colors and mode. A `data-context`, `data-mode`, or `data-section` on an ancestor does not change it.

# Table

## Usage

Table shows rows and columns of data. Use it when the data has real columns and is compared across rows. Don't use it for a list or a layout grid — use the app's own CSS. Wrap the table in an `overflow-x: auto` container when it may overflow.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `striped` | `boolean` | `false` | Alternates even-row backgrounds with the Surface striped color. |
| `children` | `ReactNode` | — | Native table markup: `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`. |

All standard table attributes (`id`, `aria-*`, `className`, ...) are also accepted.

For a sortable column, put a `<button>` inside the `th` and set `aria-sort="ascending"` or `"descending"` on the `th`; an arrow glyph appears from the sort value. Flip the value on click.

## Examples

```tsx
<Table>
  <thead><tr><th>Name</th><th>Plan</th></tr></thead>
  <tbody>
    <tr><td>Jane</td><td>Pro</td></tr>
    <tr><td>Ada</td><td>Team</td></tr>
  </tbody>
</Table>
```

```tsx
<Table striped>
  <thead><tr><th aria-sort="ascending"><button type="button">Name</button></th><th>Status</th></tr></thead>
  <tbody>
    <tr><td>Ada</td><td>Active</td></tr>
    <tr><td>Grace</td><td>Away</td></tr>
  </tbody>
</Table>
```

## Contexts

No own context handling. Row grounds read Surface tokens; on colored sections wrap the table in a `data-context="default"` container.

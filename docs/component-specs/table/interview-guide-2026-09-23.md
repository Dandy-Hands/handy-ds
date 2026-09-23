# Interview Guide: Table component (retroactive)

- Status: complete
- Started: 2026-09-23
- Component: Table (`src/components/Table.tsx` + `Table.css`)
- Note: Retroactive guide. Owner directed the interview be skipped for this run; every answer below is derived from the existing component code and `.claude/decisions.md` (cite which).
- Base UI version documented from: `@base-ui/react` 1.8.0

## 1. Existing surface (confirmations)

- [x] Q1: Keep the existing surface as-is — a plain styled `<table>` with one extension prop (`striped`) and native table markup written by the caller?
  > Yes — `Table` renders `<table data-striped={...} {...props} className="hds-table">` (`Table.tsx` lines 14–16); no parts are wrapped. docs/components.md: "Renders a plain `<table>`. Write `<thead>`, `<tbody>`, `<th>` and `<td>` yourself."
- [x] Q2: No Base UI primitive — Table is a plain function component with `ComponentProps<'table'>`?
  > Yes — the props type extends `ComponentProps<'table'>` (line 5). No `@base-ui/react/table` exists; token-system-spec section 9 defines the Data Table as a composite against native markup.

## 2. Extension props

- [x] Q3: `striped` is a boolean (default off) that sets `data-striped` and alternates row backgrounds?
  > Yes — `striped?: boolean` with the doc comment "Alternate row backgrounds (Surface `striped` state)" (lines 6–9); `Table.css` styles `tbody tr:nth-child(even)` under `[data-striped]`. token-system-spec section 9: striped row background = `surface/color/0/striped/bg`.

## 3. Token mapping

- [x] Q4: Rows read Surface 0 (default/striped) and row hover borrows Action tertiary hover?
  > Yes — `Table.css`: `tbody tr` = `surface/color/0/default-bg`, `[data-striped]` even rows = `surface/color/0/striped-bg`, `tbody tr:hover` = `action/color/tertiary/hover-bg`. token-system-spec section 9 Data Table table lists exactly these.
- [x] Q5: Borders are Divider tokens — thin for cells, medium under the header row?
  > Yes — `.hds-table th, td` border-bottom `divider/measure/thin-thickness` + `divider/color/border`; `thead th` switches to `divider/measure/medium-thickness`.
- [x] Q6: Header text uses Type label, body cells Type body, and cell padding borrows Input/Field measure (gap 13)?
  > Yes — `.hds-table th` reads `type/color/label-fg` + label other tokens; `td` reads `type/color/body-fg`; padding = `input/measure/md/padding-*`. decisions.md Wave 5 gap 13: "cell padding = `input/measure/md/padding-*`."
- [x] Q7: A sortable column is a caller-written `<th aria-sort>` containing a `<button>`; the button gets the Action tertiary look and arrow glyphs from `aria-sort`?
  > Yes — `.hds-table th button` styles read `action/color/tertiary/*`; `[aria-sort='ascending']`/`'descending']` add ↑/↓ via `::after`. docs/components.md: "A sortable column is a `<th aria-sort>` containing a `<button>`."

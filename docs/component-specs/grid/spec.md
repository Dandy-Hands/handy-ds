# Internal Spec: Grid

Status:
- spec: reviewed
- code: pending
- figma: n/a (non-visual)
- docs: pending

- Date: 2026-10-20
- Interview: brainstorm, see `.claude/decisions.md` ("Layout and page-building components"). No formal interview.
- Set: native layout component (the grid vocabulary, with safe defaults). Parts: `Grid`, `Grid.Item`.

## Description

Grid exposes the CSS grid container properties as typed props. With no `cols`, it places children in as many columns as fit (like `Tiles`). With `cols`, it makes that many equal columns. `Grid.Item` places one child. Grid has no visual output. It has no Base UI primitive.

## Usage

- Do use Grid for a dashboard, a page layout with an `Aside`, or any layout with a chosen column count or item span.
- Don't use it when all items are equal and any column count works. Use `Tiles`.

## Base UI API

Same as Stack for both parts: `render` exposed; native `div` props exposed; `style` removed from the type.

## Extension API

`Grid`:

| Prop | Type | Default | Decision |
| --- | --- | --- | --- |
| `cols` | number (1 to 12), or a responsive object | absent | Number of equal columns. Absent: auto-fit columns of at least `minColWidth`. **A number, not a measure step.** |
| `minColWidth` | `measure/width` step | `"8000"` | The smallest width that one column may have. Used only when `cols` is absent: the browser then makes as many columns as fit, and each column is at least this wide. A larger step gives wider columns and fewer of them. Same meaning as `Tiles` `minTileWidth`. |
| `gap` | `"none" \| space step`, or a responsive object | `"400"` | Measure. One value for rows and columns. |
| `align` | `"start" \| "center" \| "end" \| "stretch"` | `"stretch"` | `align-items`. |
| `justify` | `"start" \| "center" \| "end" \| "stretch"` | `"stretch"` | `justify-items`. |

`Grid.Item` (decided 2026-10-20: one prop for each CSS grid item rule; every prop is responsive; no `area`, maybe later):

| Prop | Type | Default | Decision |
| --- | --- | --- | --- |
| `colSpan` | number (1 to 12), or a responsive object | `1` | Columns the item covers (`grid-column: span n`). A number larger than `cols` is reduced to `cols`. |
| `rowSpan` | number (1 to 12), or a responsive object | `1` | Rows the item covers (`grid-row: span n`). |
| `colStart` | number (1 to 12), or a responsive object | auto | The column line where the item starts (`grid-column-start`). |
| `rowStart` | number (1 to 12), or a responsive object | auto | The row line where the item starts (`grid-row-start`). |
| `align` | `"start" \| "center" \| "end" \| "stretch"`, or a responsive object | absent | `align-self`. Absent: the `align` of the `Grid`. |
| `justify` | `"start" \| "center" \| "end" \| "stretch"`, or a responsive object | absent | `justify-self`. Absent: the `justify` of the `Grid`. |

## Token mapping

| Prop | Tokens |
| --- | --- |
| `gap` | `hds/sem/measure/space/{step}` |
| `minColWidth` | `hds/sem/measure/width/{step}` (**new family**) |

## Responsive values

Every `Grid` and `Grid.Item` layout prop (`cols` and all `Grid.Item` props) uses the responsive object of `docs/api-conventions.md` section 5.3 (`base`, `sm`, `md`, `lg`, `xl`). Section 5.3 says responsive values apply to measure props, and these props are numbers, strings, or keywords. The rule needs an extension: layout props accept responsive values, not only measure props. Section 4 ("Axis props do not") needs the same change.

## Open

- **Number type.** `docs/api-conventions.md` section 4 says "No raw numbers" and "Measure values are strings". `cols` and `colSpan` are counts. Add them to the allowed counts in the rewritten rule (TODO, Docs).
- **A span larger than `cols`.** The CSS clamp is `grid-column: span min(var(--_span), var(--_cols))`. Check that it works at every breakpoint. `Grid.Item` needs `cols` from the parent, so `Grid` writes `--_cols` for its children.
- **Named areas** (`Grid` `areas`, `Grid.Item` `area`) were left out on 2026-10-20. A typo in an area name gives a silent layout bug. Add them when a second use appears.

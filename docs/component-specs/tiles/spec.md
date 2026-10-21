# Internal Spec: Tiles

Status:
- spec: reviewed
- code: pending
- figma: n/a (non-visual)
- docs: pending

- Date: 2026-10-20
- Interview: brainstorm, see `.claude/decisions.md` ("Layout and page-building components"). No formal interview.
- Set: atomic layout component. **The name is not final.** Candidates: `Tiles` (Braid), `Cards`.

## Description

Tiles places equal-size children in as many columns as fit. Each child is at least `minTileWidth` wide. The browser decides the column count from the free space, so Tiles needs no breakpoint. It has no visual output. It has no Base UI primitive.

## Usage

- Do use Tiles for a list of cards, a gallery, or a set of tags where all items have the same weight.
- Don't use it when one item must be larger or placed in a chosen column. Use `Grid` and `Grid.Item`.
- Don't use it for a dashboard. Use `Grid`.

## Base UI API

Same as Stack: `render` exposed; native `div` props exposed; `style` removed from the type.

## Extension API

| Prop | Type | Default | Decision |
| --- | --- | --- | --- |
| `gap` | `"none" \| space step`, or a responsive object | `"400"` | Measure. Space between tiles. |
| `minTileWidth` | `measure/width` step | `"8000"` | Measure. The smallest width that one tile may have. A larger step gives wider tiles and fewer columns. Allowed steps: all `measure/width` steps. A tile that does not fit in one column fills the row. |

Tiles has no `align` prop (decided 2026-10-20: Tiles stays simple). Tiles in one row have the same height: the grid default `align-items: stretch` gives each tile the height of the tallest tile in its row. Rows can differ in height. A tile stretches only when it is a direct child. A child inside a wrapper does not fill its cell: the wrapper stretches, the child does not. A caller who wants tiles at their natural height uses `Grid` with `align="start"`.

There is no `Tiles.Item`. An item has no props: see `.claude/decisions.md` for the reason.

## Token mapping

| Prop | Tokens |
| --- | --- |
| `gap` | `hds/sem/measure/space/{step}` |
| `minTileWidth` | `hds/sem/measure/width/{step}` (**new family, see TODO "Add the large-width tokens"**) |

## CSS

`display: grid; gap: var(--_gap); grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--_min)), 1fr))`. The `min(100%, ...)` keeps a tile inside a container that is narrower than `min`. Class `hds-tiles`.

## Open

- Blocked on the `measure/width` tokens.
- Name.

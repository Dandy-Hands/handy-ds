# Internal Spec: Inline

Status:
- spec: reviewed
- code: pending
- figma: n/a (non-visual)
- docs: pending

- Date: 2026-10-20
- Interview: brainstorm, see `.claude/decisions.md` ("Layout and page-building components"). No formal interview.
- Set: atomic layout component.

## Description

Inline places its children in one row. When the row is full, the children wrap to the next line. It has no visual output. It has no Base UI primitive. It is a `useRender` component.

## Usage

- Do use Inline for a row of buttons, tags, links, or an icon with a label.
- Don't use it for a column (use `Stack`) or equal-size cards (use `Tiles`).
- Don't use it to put a fixed item beside an item that fills the rest. Use `Flex`. Long text in an Inline wraps below the first item.

## Base UI API

Same as Stack: `render` exposed; native `div` props exposed; `style` removed from the type.

## Extension API

| Prop | Type | Default | Decision |
| --- | --- | --- | --- |
| `gap` | `"none" \| space step`, or a responsive object | `"200"` | Measure. Space between children, in the row and between lines. |
| `align` | `"start" \| "center" \| "end" \| "baseline" \| "stretch"` | `"center"` | Cross-axis (vertical) position of the children in a line. |
| `justify` | `"start" \| "center" \| "end" \| "between"` | `"start"` | Main-axis (horizontal) distribution of the children in a line. |

## Token mapping

| Prop | Tokens |
| --- | --- |
| `gap` | `hds/sem/measure/space/{step}` |

## CSS

`display: flex; flex-wrap: wrap; gap: var(--_gap)`. Wrap is always on and has no prop. Class `hds-inline`. Axes are `data-gap`, `data-align`, `data-justify`.

## Open

- The default `align` (`"center"`) is a judgment call: an icon beside a label is the most common case.

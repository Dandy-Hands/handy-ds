# Internal Spec: Flex

Status:
- spec: reviewed
- code: pending
- figma: n/a (non-visual)
- docs: pending

- Date: 2026-10-20
- Interview: brainstorm, see `.claude/decisions.md` ("Layout and page-building components"). No formal interview.
- Set: native layout component (the flexbox vocabulary, with safe defaults).

## Description

Flex exposes the CSS flexbox container properties as typed props. Its defaults are safe: items wrap, and the gap is a token. It has no visual output. It has no Base UI primitive. Flex is the escape hatch for a row or column that `Stack` and `Inline` do not cover.

## Usage

- Do use Flex when you need a property that Stack and Inline do not have: a fixed item beside an item that fills the rest, `direction` that changes with the screen, or `justify="between"` in a column.
- Don't use Flex when `Stack` or `Inline` does the job. Use the smaller component first.

## Base UI API

Same as Stack: `render` exposed; native `div` props exposed; `style` removed from the type.

## Extension API

`Flex`:

| Prop | Type | Default | Decision |
| --- | --- | --- | --- |
| `direction` | `"row" \| "column"` (also `"row-reverse"`, `"column-reverse"`), or a responsive object | `"row"` | Main axis. Keyword values follow CSS `flex-direction`. |
| `gap` | `"none" \| space step`, or a responsive object | `"400"` | Measure. |
| `wrap` | `boolean` | `true` | Items move to the next line when the line is full. A true two-state flag. |
| `align` | `"start" \| "center" \| "end" \| "baseline" \| "stretch"` | `"stretch"` | `align-items`. |
| `justify` | `"start" \| "center" \| "end" \| "between" \| "around" \| "evenly"` | `"start"` | `justify-content`. |

`Flex.Item` (a part for one child; decided 2026-10-20):

| Prop | Type | Default | Decision |
| --- | --- | --- | --- |
| `grow` | `boolean` | `false` | The item takes the free space of the line (`flex-grow: 1`). |
| `shrink` | `boolean` | `true` | The item may become narrower than its content width when the line is full. `shrink={false}` keeps its width. |
| `basis` | `measure/width` step, `"auto" \| "fit" \| "full"`, or a responsive object | `"auto"` | The starting size of the item on the main axis. |
| `align` | `"start" \| "center" \| "end" \| "baseline" \| "stretch"` | absent | `align-self`. Absent: the `align` of the `Flex`. |

`Flex.Item` uses `useRender` like the other parts. A fixed item beside an item that fills the rest is `<Flex.Item basis="8000">` beside `<Flex.Item grow>`.

## Token mapping

| Prop | Tokens |
| --- | --- |
| `gap` | `hds/sem/measure/space/{step}` |

## Open

- `Flex.Item` `basis` takes `measure/width` steps (a new family, see TODO "Add the large-width tokens"). A small basis, such as an icon width, may need `measure/size` steps too. Decide at code time.
- `inline` (`inline-flex`) was dropped on 2026-10-20 as a speculative member.

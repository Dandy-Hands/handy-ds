# Internal Spec: Table

- Status: reviewed (retroactive; owner pre-approved, interview skipped)
- Date: 2026-09-23
- Interview: `interview-guide-2026-09-23.md` (retroactive)
- Base UI version documented from: `@base-ui/react` 1.8.0 (no table primitive — native `<table>` markup)
- Code: `src/components/Table.tsx` + `Table.css`

## Description

Table shows rows and columns of data that are compared across rows. It is a styled native `<table>`: the caller writes `thead`, `tbody`, `th`, and `td`, and the component supplies the theme — surface row grounds, divider borders, label/body type, and a sortable-header pattern built on `aria-sort` plus a button.

## Usage

- Do use Table when the data has real columns and is compared across rows.
- Don't use it for a list or a layout grid — use the app's own CSS.
- Do write native table markup inside; the component only styles it.
- Do wrap in an `overflow-x: auto` container when the table may overflow.

## Base UI API

No Base UI primitive. Table is a plain function component over `ComponentProps<'table'>`:

| Surface | Decision |
| --- | --- |
| Native `<table>` props (`id`, `aria-*`, `className`, `style`, ...) | Exposed — full passthrough. |
| Inner markup (`thead`, `tbody`, `tr`, `th`, `td`) | Caller-written; styled through `.hds-table` descendant rules. |
| Callback-form `className` / `style` | Available via passthrough, not documented. |

## Extension API

| Prop | Type | Default | Decision |
| --- | --- | --- | --- |
| `striped` | `boolean` | `false` | Existing axis. Sets `data-striped`; even rows take the Surface `striped` background. |

Sortable columns: put a `<button>` inside the `th` and set `aria-sort="ascending" | "descending" | "none"` on the `th`. The CSS adds the arrow glyphs from `aria-sort`; the caller flips the value on click.

## Token mapping

| Part | Tokens |
| --- | --- |
| Row ground | `hds/sem/surface/color/0/default/bg`; striped even rows `hds/sem/surface/color/0/striped/bg` |
| Row hover | `hds/sem/action/color/tertiary/hover/bg` (borrowed) |
| Cell borders | `hds/sem/divider/color/border` + `hds/sem/divider/measure/thin-thickness`; header underline `.../medium-thickness` |
| Header text | `hds/sem/type/color/label/fg`, `hds/sem/type/other/label/{font-family,weight}` |
| Body text | `hds/sem/type/color/body/fg`; base size `hds/sem/type/measure/body/size` |
| Cell padding | `hds/sem/input/measure/md/{padding-x,padding-y}` (borrowed, gap 13) |
| Sort button | `hds/sem/action/color/tertiary/{default,hover,active}/bg` + `hds/sem/action/measure/md/{gap,padding-*}` |

Notes:

- No primitive or driver references; no new tokens. The sortable-button arrows are structural `::after` content.
- Sort-state coloring is caller-driven (`aria-sort`); the component adds no state machine.

# Internal Spec: Stack

Status:
- spec: reviewed
- code: pending
- figma: n/a (non-visual)
- docs: pending

- Date: 2026-10-20
- Interview: brainstorm, see `.claude/decisions.md` ("Layout and page-building components"). No formal interview.
- Set: atomic layout component (small API, adapts without extra props).

## Description

Stack places its children in one column with a token gap between them. It has no visual output: no color, no border, no padding. It has no Base UI primitive. It is a `useRender` component with the same `render` prop as Base UI parts.

## Usage

- Do use Stack for the main flow of a page, a form, or a card body: items one below the other.
- Don't use it for a row (use `Inline`) or for a grid (use `Tiles` or `Grid`).
- Don't use it for padding or a background. Use `Section` or `Card`.
- Do use `render` when the element matters: `render={<ul />}`, `render={<nav />}`.

## Base UI API

No Base UI primitive. Single-part `useRender` component (`useRender.ComponentProps<'div'>` + `mergeProps`):

| Surface | Decision |
| --- | --- |
| `render` | Exposed. |
| Native `div` props (`id`, `aria-*`, `className`, ...) | Exposed. `style` is removed from the type, per `docs/api-conventions.md` section 1. |

## Extension API

| Prop | Type | Default | Decision |
| --- | --- | --- | --- |
| `gap` | `"none" \| space step`, or a responsive object | `"400"` | Measure. Space between children. Allowed steps: all `measure/space` steps. |
| `align` | `"start" \| "center" \| "end" \| "stretch"` | `"stretch"` | Cross-axis (horizontal) position of the children. |

Responsive values follow `docs/api-conventions.md` section 5.3. `gap` is the only responsive member.

## Token mapping

| Prop | Tokens |
| --- | --- |
| `gap` | `hds/sem/measure/space/{step}` |

No color, radius, border, or elevation tokens.

## CSS

`display: flex; flex-direction: column; gap: var(--_gap)`. `align` sets `align-items`. Axes are `data-gap` and `data-align`. Class `hds-stack`.

## Open

- The `render` rule (TODO, Docs) decides whether Stack keeps `render`. This spec assumes yes.

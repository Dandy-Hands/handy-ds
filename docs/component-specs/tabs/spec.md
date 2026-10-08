# Internal Spec: Tabs

- Status: docs-built
- Date: 2026-09-23
- Interview: `interview-guide-2026-09-23.md` (retroactive)
- Base UI version documented from: `@base-ui/react` 1.8.0 (`@base-ui/react/tabs`)
- Code: `src/components/Tabs.tsx` + `Tabs.css` (+ shared `action.css`)

## Description

Tabs switch between views in the same place. The tab triggers are Action tertiary controls; a sliding indicator marks the active tab; panels are transparent containers that inherit type and ground. Use Tabs when several panels share one region and only one shows at a time; use Accordion when sections stack and expand independently.

## Usage

- Do use Tabs for peer views of one region — overview/details/reviews, settings sections.
- Don't use it when the panels are separate pages — navigate instead.
- Don't use it when several panels may be open at once — use `Accordion`.
- Panels carry no tokens: any text inside needs `Text` roles or its own components.

## Base UI API

Wrapped component: `Tabs` from `@base-ui/react/tabs`. Surface decisions:

| Base UI surface | Decision |
| --- | --- |
| `Root` props (`value`, `defaultValue`, `onValueChange`, `orientation`, `activationMode`, `loopFocus`, ...) | Exposed — full passthrough on the namespace. |
| `Root`, `List`, `Tab`, `Indicator`, `Panel` | Styled with `part()`: `hds-tabs`, `hds-tabs__list`, `hds-action hds-tabs__tab` (`data-priority: 'tertiary'`), `hds-tabs__indicator`, `hds-tabs__panel`. |
| `Tab` props (`value`, `disabled`, `nativeButton`, `render`) | Exposed — passthrough; `render` composes links as tabs. |
| `data-selected` (Tab), `data-orientation` (Root/List) | Consumed by CSS. |
| Callback-form `className` / `style` | Available via passthrough, not documented. |

## Extension API

| Prop | Type | Default | Decision |
| --- | --- | --- | --- |
| — | — | — | No extension props. Priority is fixed to tertiary via the part default; override with `data-priority` if a surface demands it. |

## Token mapping

> **Provisional (2026-10-07).** The token rework renamed every token. The names below are the provisional mapping from the previous spec (token spec section 9, item 5). This component's re-interview confirms them.

| Part | Tokens |
| --- | --- |
| Tab look and states | `hds/sem/color/action/tertiary/{default,hover,active,selected,disabled}/{bg,border,fg}` (via `action.css`) |
| Tab measure | `hds/sem/measure/space/*`, `hds/sem/radius/control`, `hds/sem/border/control` — border-width removed structurally; top-corner radius only |
| List edge | `hds/sem/color/graphic/divider/default` + `hds/sem/border/divider` |
| Indicator fill | `hds/sem/color/action/primary/selected/bg` (gap 5) |
| Indicator thickness | `hds/sem/border/divider` |
| Panel | none — no tokens (gap 5 decision) |
| Focus ring | `hds/sem/color/focus/ring`, `hds/sem/border/focus` (inset by the stroke width on tabs) |

Notes:

- No primitive or driver references; no new tokens.
- Indicator motion (`left/width/top/height` transitions) and position variables (`--active-tab-*`, supplied by Base UI) are structural.

# Internal Spec: Accordion

- Status: docs-built
- Date: 2026-09-23
- Interview: `interview-guide-2026-09-23.md` (retroactive)
- Base UI version documented from: `@base-ui/react` 1.8.0 (`@base-ui/react/accordion`)
- Code: `src/components/Accordion.tsx` + `Accordion.css` (+ shared `action.css`)

## Description

Accordion shows and hides sections in place: a column of full-width tertiary triggers, each with a collapsible panel on a Surface-0 ground. Use it for an FAQ or long content the user scans before opening; use Tabs when exactly one section shows at a time in a fixed region.

## Usage

- Do use Accordion for FAQs, settings groups, and long scanned content.
- Don't use it when exactly one view shows in a fixed region — use `Tabs`.
- Do write each item as `Item > Header > Trigger` + `Panel` (the Base UI anatomy).
- Panels carry their own ground; content inside them needs `Text` roles or components as usual.

## Base UI API

Wrapped component: `Accordion` from `@base-ui/react/accordion`. Surface decisions:

| Base UI surface | Decision |
| --- | --- |
| `Root` props (`value`, `defaultValue`, `onValueChange`, `multiple`, `openMultiple`, `disabled`, `hiddenUntilFound`, `loopFocus`, `orientation`, ...) | Exposed — full passthrough on the namespace. |
| `Root`, `Item`, `Header`, `Trigger`, `Panel` | Styled with `part()`: `hds-accordion`, `hds-accordion__item`, `hds-accordion__header`, `hds-action hds-accordion__trigger` (`data-priority: 'tertiary'`), `hds-accordion__panel`. |
| `Trigger` props (`value`, `disabled`, `nativeButton`, `render`) | Exposed — passthrough. |
| `data-panel-open` (Trigger), `data-open` (Panel) | Consumed by CSS (chevron rotation, open state). |
| Callback-form `className` / `style` | Available via passthrough, not documented. |

## Extension API

| Prop | Type | Default | Decision |
| --- | --- | --- | --- |
| — | — | — | No extension props. Priority is fixed to tertiary via the part default. |

## Token mapping

> **Provisional (2026-10-07).** The token rework renamed every token. The names below are the provisional mapping from the previous spec (token spec section 9, item 5). This component's re-interview confirms them.

| Part | Tokens |
| --- | --- |
| Trigger look and states | `hds/sem/color/action/tertiary/{default,hover,active,disabled,selected}/{bg,border,fg}` (via `action.css`) |
| Trigger measure | `hds/sem/measure/space/*`, `hds/sem/radius/control`, `hds/sem/border/control` — radius flattened to 0 structurally |
| Item edge | `hds/sem/color/graphic/divider/default` + `hds/sem/border/divider` |
| Panel ground | `hds/sem/color/surface/base/*` + `hds/sem/measure/space/600`, `hds/sem/radius/container`, `hds/sem/border/container` |
| Focus ring | `hds/sem/color/focus/ring`, `hds/sem/border/focus` (inset on the trigger) |

Notes:

- No primitive or driver references; no new tokens.
- The chevron is structural CSS (`::after`, 0.45em, `currentColor`); its rotation is a structural transition.

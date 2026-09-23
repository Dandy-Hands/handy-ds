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

| Part | Tokens |
| --- | --- |
| Trigger look and states | `hds/sem/action/color/tertiary/{default,hover,active,focus,disabled,selected}/{bg,border,fg}` (via `action.css`) |
| Trigger measure | `hds/sem/action/measure/md/{padding-x,padding-y,gap}` — radius flattened to 0 structurally |
| Item edge | `hds/sem/divider/color/border` + `hds/sem/divider/measure/thin-thickness` |
| Panel ground | `hds/sem/surface/color/0/default/bg` + `hds/sem/surface/measure/padding` |
| Focus ring | `hds/sem/focus/color/stroke`, `hds/sem/focus/measure/stroke-width` (inset on the trigger) |

Notes:

- No primitive or driver references; no new tokens.
- The chevron is structural CSS (`::after`, 0.45em, `currentColor`); its rotation is a structural transition.

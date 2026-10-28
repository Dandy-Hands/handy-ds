Status:
- spec: reviewed
- code: built
- figma: built
- docs: built

# Internal Spec: Tooltip

- Date: 2026-10-26, revised 2026-10-28 (one component)
- Interview: `interview-guide-2026-10-26.md` (see "Revision 2026-10-28")
- Base UI version documented from: `@base-ui/react` 1.8.0 (`@base-ui/react/tooltip`)

## Description

Tooltip shows a short text label for a control when the pointer rests on it or the control gets keyboard focus. It is one component, `<Tooltip>`, that wraps its control: the child is the control and `content` is the label. The label is always dark: it sets `data-mode="dark"` in both page modes.

## Usage

- Do use Tooltip to name an icon-only control or to add a short hint.
- Do give an icon-only control its own `aria-label`. Touch users do not see the tooltip.
- Don't put links or buttons in a tooltip. Use Popover.
- Don't use Tooltip for information the user must read. Put it on the page.

## Base UI API

Wrapped: `Root`, `Trigger` (renders the child through `render`), `Portal`, `Positioner`, `Popup`, inside `<Tooltip>`. None is exported.

| Base UI member | Decision |
| --- | --- |
| `Provider` | Omitted. Delays are fixed at the Base UI defaults (600 ms open, 0 ms close). Limit: without a provider, a second tooltip does not open at once after the first. Add an internal provider in the code phase only if this is easy and needs no API. |
| `Root` `open`, `defaultOpen`, `onOpenChange`, `onOpenChangeComplete`, `disabled`, `actionsRef`, `handle`, trigger IDs, `trackCursorAxis` | Omitted. To have no tooltip, do not wrap the control. |
| `Root` `disableHoverablePopup` | Omitted. The label stays hoverable (WCAG 1.4.13). |
| `Trigger` | Renders the child. `delay`, `closeDelay`, `closeOnClick` (true), `disabled`, `handle`, `payload` omitted. |
| `Positioner` `side`, `align` | Exposed on `<Tooltip>`. Same unions as Popover. |
| Other `Positioner` members, `Arrow`, `Viewport` | Omitted. Side gap fixed `measure/space/200`. |
| `render`, `className`, `style` | Omitted. |

## Extension API

| Prop | Type | Default | Decision |
| --- | --- | --- | --- |
| `children` | `ReactElement` | required | The control the label describes. One element. |
| `content` | `ReactNode` | required | The label text. One short phrase. Overlay exception, `docs/api-conventions.md` section 1. |
| `side` | `'top' \| 'bottom' \| 'inline-start' \| 'inline-end'` | `'top'` | |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | |

Rules:

- The label sets `data-mode="dark"` in both page modes (decided 2026-10-28; replaces the `inverse` mode scope, which would give bright labels on a dark page). No theme change: the dark scope already exists.
- Max width fixed `measure/width/6400`. No width prop.
- Colors: dark mode always, whatever the page mode or a section around the control.

## Token mapping

Claude calls (token interview scope). All tokens resolve under `data-mode="dark"`.

| Part | Tokens |
| --- | --- |
| Label ground | `hds/sem/color/surface/floating/bg`, `hds/sem/color/surface/floating/border`, `hds/sem/border/container`, `hds/sem/elevation/floating`, `hds/sem/radius/control` |
| Padding | block `hds/sem/measure/space/100`, inline `hds/sem/measure/space/200` |
| Max width | `hds/sem/measure/width/6400` |
| Side gap | `hds/sem/measure/space/200` |
| Text | `hds/sem/color/content/default/fg`, `hds/sem/typography/body/*`, `hds/sem/typography/body/size/sm` |

Notes: no primitive or driver references. Contrast pair already exists (`content/default/fg` on `surface/floating/bg`, dark mode). On a dark page the dark floating surface is slightly darker than the page; the border and shadow separate them. Check the look in the code phase.

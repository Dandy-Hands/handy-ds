Status:
- spec: reviewed
- code: pending
- figma: built
- docs: pending

# Internal Spec: Preview Card

- Date: 2026-10-27, revised 2026-10-28 (one component)
- Interview: `interview-guide-2026-10-27.md` (see "Revision 2026-10-28")
- Base UI version documented from: `@base-ui/react` 1.8.0 (`@base-ui/react/preview-card`)

## Description

Preview Card shows a preview of a link's destination when the pointer rests on the link or the link gets keyboard focus. It is one component, `<PreviewCard>`, that wraps its link: the child is the link and `content` is the preview. The link gets the link look. The preview is a floating panel, as Popover.

## Usage

- Do use Preview Card for a summary of a linked page, profile, or item.
- Do make the link useful on its own. Touch users do not see the preview.
- Don't put content in the preview that the user needs.
- Don't wrap a control that is not a link. Use Tooltip or Popover.

## Base UI API

Wrapped: `Root`, `Trigger` (renders the child link through `render`), `Portal`, `Positioner`, `Popup`, inside `<PreviewCard>`. None is exported.

| Base UI member | Decision |
| --- | --- |
| `Root` `open`, `defaultOpen`, `onOpenChange`, `onOpenChangeComplete`, `actionsRef`, `handle`, trigger IDs; `createHandle` | Omitted. The preview manages itself. |
| `Trigger` | Renders the child (`<a>` or a router link) with the link class. `delay` (600), `closeDelay` (300) omitted, fixed. |
| `Positioner` `side`, `align` | Exposed. Same unions as Popover. |
| Other `Positioner` members, `Arrow`, `Backdrop`, `Viewport` | Omitted. Side gap fixed `measure/space/200`. |
| `render`, `className`, `style` | Omitted. |

## Extension API

| Prop | Type | Default | Decision |
| --- | --- | --- | --- |
| `children` | `ReactElement` | required | The link: an `<a href>` or a router link. One element. |
| `content` | `ReactNode` | required | The preview. Overlay exception, `docs/api-conventions.md` section 1. |
| `side` | `'top' \| 'bottom' \| 'inline-start' \| 'inline-end'` | `'bottom'` | |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | |
| `width` | `'auto' \| '6400' \| '8000' \| '9600' \| '12800'` | `'auto'` | As Popover. |
| `maxWidth` | `'6400' \| '8000' \| '9600' \| '12800'` | `'9600'` | As Popover. |

Rules: share the panel and width CSS with Popover. No title row and no X button (it closes when the pointer leaves). Colors: the page colors and mode.

## Token mapping

Claude calls (token interview scope).

| Part | Tokens |
| --- | --- |
| Link | `hds/sem/color/content/link/fg`, hover `hds/sem/color/content/link/hover/fg`, underline (structural), font inherited |
| Panel ground | `hds/sem/color/surface/floating/bg`, `hds/sem/color/surface/floating/border`, `hds/sem/elevation/floating`, `hds/sem/radius/container`, `hds/sem/border/container` |
| Panel padding | `hds/sem/measure/space/600` |
| Width, max width | `hds/sem/measure/width/{6400,8000,9600,12800}` |
| Side gap | `hds/sem/measure/space/200` |
| Text | `hds/sem/color/content/default/fg` |
| Focus ring | `hds/sem/color/focus/ring`, `hds/sem/border/focus` |

Notes: no primitive or driver references.

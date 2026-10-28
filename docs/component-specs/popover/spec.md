Status:
- spec: reviewed
- code: pending
- figma: built
- docs: pending

# Internal Spec: Popover

- Date: 2026-10-26, revised 2026-10-28 (one component)
- Interview: `interview-guide-2026-10-26.md` (see "Revision 2026-10-28")
- Base UI version documented from: `@base-ui/react` 1.8.0 (`@base-ui/react/popover`)

## Description

Popover is a small panel next to a control, opened by a click on that control. The page behind stays usable. It is one component, `<Popover>`, that wraps its control: the child is the control, `title` is the heading, and `content` is the panel content. A click outside, Escape, or the X button closes it. No state code is necessary.

## Usage

- Do use Popover for short, secondary content: a definition, help text, or a small form such as a filter.
- Do wrap exactly one control, such as a Button.
- Don't use Popover for a list of commands. Use Menu.
- Don't use Popover for a task the user must finish before going on. Use Dialog.
- Don't use Popover for a label that shows on hover. Use Tooltip.

## Base UI API

Wrapped: `Root`, `Trigger` (renders the child through `render`), `Portal`, `Positioner`, `Popup`, `Title`, `Close` (the X only), all inside `<Popover>`. None is exported.

| Base UI member | Decision |
| --- | --- |
| `Root` `open`, `onOpenChange` | Exposed, optional. Use them only to close the popover from code, such as after Apply in a form. Without them the popover manages itself. |
| `Root` `defaultOpen`, `modal`, `onOpenChangeComplete`, `actionsRef`, `handle`, `triggerId`, `defaultTriggerId`; `createHandle` | Omitted. `modal` fixed `false`. |
| `Trigger` | Renders the child (`render={children}`). No class, no look. `openOnHover`, `delay`, `closeDelay` omitted. |
| `Portal`, `Positioner` | Rendered inside. |
| `Positioner` `side`, `align` | Exposed on `<Popover>`. `side`: `top \| bottom \| inline-start \| inline-end` (no `left`, `right`). |
| `Positioner` offsets, collision members, `anchor`, `sticky`, `positionMethod`, `arrowPadding`, `disableAnchorTracking` | Omitted. Side gap fixed `measure/space/200`. |
| `Popup` `initialFocus`, `finalFocus` | Omitted. Base UI default focus. |
| `Title` | Rendered from `title`. Names the popover for screen readers. |
| `Description`, `Arrow`, `Backdrop`, `Viewport` | Omitted. |
| `Close` | The X button only. |
| `render`, `className`, `style` | Omitted on `<Popover>`. |

## Extension API

| Prop | Type | Default | Decision |
| --- | --- | --- | --- |
| `children` | `ReactElement` | required | The control that opens the popover. One element. |
| `title` | `ReactNode` | required | The heading row with the X. Accessible name. |
| `content` | `ReactNode` | required | The panel body. Recorded under the overlay exception in `docs/api-conventions.md` section 1. |
| `side` | `'top' \| 'bottom' \| 'inline-start' \| 'inline-end'` | `'bottom'` | Set as `data-side` by Base UI. Flips when it does not fit. |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | |
| `width` | `'auto' \| '6400' \| '8000' \| '9600' \| '12800'` | `'auto'` | `measure/width/{step}`, capped to the space on screen. Set as `data-width`. |
| `maxWidth` | `'6400' \| '8000' \| '9600' \| '12800'` | `'9600'` | `measure/width/{step}`. Set as `data-max-width`. `maxWidth` wins over a larger `width`. |

Layout rules:

- Header row: the title at the start, the X at the end (tertiary Button, size `800`, `XIcon`, `aria-label="Close"`). They cannot overlap. Body below.
- The side gap token is read at run time for Base UI `sideOffset` (code-phase detail).
- Colors: the page colors and mode (the panel renders at the end of the page).

## Token mapping

Claude calls (token interview scope).

| Part | Tokens |
| --- | --- |
| Panel ground | `hds/sem/color/surface/floating/bg`, `hds/sem/color/surface/floating/border`, `hds/sem/elevation/floating`, `hds/sem/radius/container`, `hds/sem/border/container` |
| Panel padding | `hds/sem/measure/space/600` |
| Width, max width | `hds/sem/measure/width/{6400,8000,9600,12800}` |
| Side gap | `hds/sem/measure/space/200` |
| Title | `hds/sem/color/content/strong/fg`, `hds/sem/typography/label/*`, `hds/sem/typography/label/size/md` |
| Header row gap, gap to body | `hds/sem/measure/space/400`, `hds/sem/measure/space/200` |
| Body text | `hds/sem/color/content/default/fg` |
| X button | `hds/sem/color/action/tertiary/*`, `hds/sem/measure/size/800`, `hds/sem/radius/control` |
| Focus ring | `hds/sem/color/focus/ring`, `hds/sem/border/focus` |

Notes: no primitive or driver references. Transition and `z-index` are structural literals in `surface.css`.

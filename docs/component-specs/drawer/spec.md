Status:
- spec: reviewed
- code: built
- figma: built
- docs: pending

# Internal Spec: Drawer

- Date: 2026-10-28
- Interview: `interview-guide-2026-10-28.md`
- Base UI version documented from: `@base-ui/react` 1.8.0 (`@base-ui/react/drawer`)

## Description

Drawer is a panel that slides in from an edge of the screen and blocks the page. It is one component, `<Drawer>`, with props and children and no parts. It has the same header row, scrolling body, and button row as Dialog. The user closes it with the X button, Escape, a click outside, or a swipe toward its edge.

## Usage

- Do use Drawer for longer content where the page context helps: item details, a filter panel, a cart, or the site menu on phones.
- Do use `side="bottom"` for a short panel on a phone, such as share options.
- Don't use Drawer for a short task that needs full attention. Use Dialog.
- Don't use Drawer for content that stays beside the page all the time. Use Aside.
- Don't use Drawer for a small panel next to a button that leaves the page usable. Use Popover.

## Base UI API

Wrapped: `Root`, `Portal`, `Backdrop`, `Viewport`, `Popup`, `Content`, `Title`, `Close` (for the X only), all rendered inside `<Drawer>`. None is exported. `Drawer` is a function component.

| Base UI member | Decision |
| --- | --- |
| `Root` `open`, `onOpenChange` | Exposed. The only way to open and close it. |
| `Root` `disablePointerDismissal` (false) | Exposed, Base UI name. |
| `Root` `defaultOpen`, `modal`, `onOpenChangeComplete`, `actionsRef`, `handle`, `triggerId`, `defaultTriggerId`; `createHandle`, `Handle`; `Trigger` | Omitted, as Dialog. `modal` is fixed `true`. |
| `Root` `swipeDirection` | Not exposed. Set from `side`: `bottom` gives `down`; `inline-end` gives `right` in a left-to-right page and `left` in a right-to-left page; `inline-start` the reverse. |
| `Root` `snapPoints`, `snapPoint`, `defaultSnapPoint`, `onSnapPointChange`, `snapToSequentialPoints` | Omitted. |
| `SwipeArea`, `Indent`, `IndentBackground`, `Provider` | Omitted. |
| `VirtualKeyboardProvider` | Rendered inside only if the code phase finds that a bottom drawer with a field needs it on phones. Not exposed. |
| `Popup` `initialFocus`, `finalFocus` | Omitted, as Dialog. |
| `Title` | Rendered from `title`. |
| `Description` | Omitted, as Dialog. |
| `Close` | Not exported. The X button only. |
| `render`, `className`, `style` | Omitted on `<Drawer>`. |
| State attributes (`data-open`, `data-starting-style`, `data-ending-style`, `data-swiping`, `data-swipe-direction`) | Consumed by CSS for the slide and the swipe. |

## Extension API

| Prop | Type | Default | Decision |
| --- | --- | --- | --- |
| `title` | `ReactNode` | required | As Dialog. |
| `side` | `'inline-end' \| 'inline-start' \| 'bottom'` | `'inline-end'` | The edge it slides in from. Set as `data-side`. Logical sides follow the text direction. |
| `width` | `'8000' \| '9600' \| '12800'` | `'9600'` | Width of a side drawer; reads `measure/width/{step}`, capped to the screen width. Ignored for `bottom`. Set as `data-width`. |
| `actions` | `ReactNode` | — | As Dialog: the button row, fixed at the bottom of the panel. |
| `children` | `ReactNode` | — | The body. It scrolls. |

Layout rules:

- Side drawer: full screen height, attached to its edge, square corners on the attached side.
- Bottom drawer: full screen width, height from the content up to `90dvh`, top corners rounded, grab bar at the top center (decorative, `aria-hidden`).
- Column: header row (title and X), body (scrolls), button row. The header row and button row stay visible.
- X button: tertiary Button, size `800`, `XIcon`, `aria-label="Close"`. Always shown.
- Slide transition from the edge; no transition under `prefers-reduced-motion`.
- Colors: the page colors and mode, as Dialog.

## Token mapping

Claude calls (token interview scope). Same ground as Dialog.

| Part | Tokens |
| --- | --- |
| Scrim | `hds/sem/color/overlay/scrim` |
| Panel ground | `hds/sem/color/surface/modal/bg`, `hds/sem/color/surface/modal/border`, `hds/sem/elevation/modal`, `hds/sem/border/container` |
| Panel corners (free side only) | `hds/sem/radius/container` |
| Panel padding | `hds/sem/measure/space/600` |
| Width | `hds/sem/measure/width/{8000,9600,12800}` |
| Title | `hds/sem/color/content/strong/fg`, `hds/sem/typography/headline/*`, `hds/sem/typography/headline/size/sm` |
| Header row gap | `hds/sem/measure/space/400` |
| Gap header to body, body to button row | `hds/sem/measure/space/600` |
| Button row gap | `hds/sem/measure/space/200` |
| Grab bar | `hds/sem/color/graphic/divider/strong`, `hds/sem/measure/size/200` (height), `hds/sem/radius/round` (width 40px structural) |
| X button | `hds/sem/color/action/tertiary/*`, `hds/sem/measure/size/800`, `hds/sem/radius/control` |
| Focus ring | `hds/sem/color/focus/ring`, `hds/sem/border/focus` |

Notes:

- Share the header row, body, button row, and title CSS with Dialog.
- No primitive or driver references. The slide timing and `90dvh` are structural literals.

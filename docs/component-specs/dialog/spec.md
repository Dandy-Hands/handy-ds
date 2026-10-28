Status:
- spec: reviewed
- code: pending
- figma: built
- docs: pending

# Internal Spec: Dialog

- Date: 2026-10-28 (re-interview; replaces the 2026-09-23 dry-run spec, which also covered Alert Dialog)
- Interview: `interview-guide-2026-10-28.md`
- Base UI version documented from: `@base-ui/react` 1.8.0 (`@base-ui/react/dialog`)

## Description

Dialog is a box over the page for a task the user finishes or dismisses before going back to the page. It is one component, `<Dialog>`, with props and children and no parts. Inside, it builds the Base UI parts: the scrim that blocks the page, the box, the header row with the title and an X button, the scrolling body, and the button row. Code opens and closes it through `open` and `onOpenChange`; the button that opens it is a normal Button.

## Usage

- Do use Dialog for a short task that blocks the page: edit a record, fill a small form, read a required notice.
- Do keep state in code: `const [open, setOpen] = useState(false)`, a Button with `onClick={() => setOpen(true)}`, and `<Dialog open={open} onOpenChange={setOpen}>`.
- Don't use Dialog to confirm a destructive or irreversible action. Use Alert Dialog.
- Don't use Dialog for longer content where the page context helps. Use Drawer.
- Don't use Dialog for a small panel that leaves the page usable. Use Popover.
- Don't put a long flow of several steps in a Dialog. Use a page.

## Base UI API

Wrapped: `Root`, `Portal`, `Backdrop`, `Viewport`, `Popup`, `Title`, `Close` (for the X only), all rendered inside `<Dialog>`. None is exported. `Dialog` is a function component, not a namespace.

| Base UI member | Decision |
| --- | --- |
| `Root` `open`, `onOpenChange` | Exposed on `<Dialog>`. The only way to open and close it (one method per task). |
| `Root` `defaultOpen` | Omitted. `open` in state does the same. |
| `Root` `modal` | Omitted. Fixed `true`: the page is always blocked. |
| `Root` `disablePointerDismissal` (false) | Exposed on `<Dialog>`, Base UI name. |
| `Root` `onOpenChangeComplete`, `actionsRef`, `handle`, `triggerId`, `defaultTriggerId`; `createHandle`, `Handle` | Omitted. |
| `Trigger` | Omitted. A normal Button with `onClick` opens the dialog. |
| `Portal`, `Backdrop`, `Viewport` | Rendered inside. The scrim is always rendered. |
| `Popup` `initialFocus`, `finalFocus` | Omitted. Base UI default focus: first focusable element on open, the element that had focus before on close. |
| `Title` | Rendered inside from the `title` prop. It names the dialog for screen readers. |
| `Description` | Omitted. Interview Q9: the screen-reader use is weak in a normal dialog. Alert Dialog keeps it. |
| `Close` | Not exported (interview Q11). Rendered inside for the X button only. |
| `render`, `className`, `style` | Omitted on `<Dialog>`. Same recorded break as the other components. |
| State attributes `data-open`, `data-starting-style`, `data-ending-style`, `data-nested`, `data-nested-dialog-open` | Consumed by CSS for the transition and for a dialog opened on top of another. |

## Extension API

| Prop | Type | Default | Decision |
| --- | --- | --- | --- |
| `title` | `ReactNode` | required | The heading in the header row and the accessible name. Recorded exception: `docs/api-conventions.md` section 1, "overlays are one component". |
| `width` | `'8000' \| '9600' \| '12800' \| 'full'` | `'9600'` | `8000`, `9600`, `12800` read `measure/width/{step}`. `full`: the screen minus the side gap, in both width and height. Set as `data-width`. Not responsive. |
| `actions` | `ReactNode` | — | The button row at the bottom, end-aligned, wraps on a narrow screen. Recorded exception (slot by position) in `docs/api-conventions.md` section 1. Absent: no row. |
| `children` | `ReactNode` | — | The body. It scrolls when the dialog is taller than the screen. |

Layout rules:

- The box is a column: header row, body, button row. The header row and the button row stay visible; only the body scrolls.
- Header row: the title takes the start side and wraps; the X button takes the end side. They cannot overlap.
- X button: tertiary Button, size `800`, `XIcon`, `aria-label="Close"`. Always shown. It calls `onOpenChange(false)`.
- Width: `min(measure/width/{step}, 100vw - 2 × side gap)`. Max height: `100dvh - 2 × side gap`. The box is centered on the screen. On a phone the box shrinks to the screen width; there is no automatic full screen.
- Escape and a click on the scrim (unless `disablePointerDismissal`) call `onOpenChange(false)`.
- A dialog opened from inside another dialog shows on top; Base UI handles the stack.
- Colors: the dialog renders at the end of the page, so it uses the page colors and mode. A brand color or mode set on an ancestor does not reach it (Claude call; portal context open item).

## Token mapping

Claude calls (token interview scope). The user reviews them here.

| Part | Tokens |
| --- | --- |
| Scrim | `hds/sem/color/overlay/scrim` (via `.hds-backdrop`) |
| Box ground | `hds/sem/color/surface/modal/bg`, `hds/sem/color/surface/modal/border`, `hds/sem/elevation/modal`, `hds/sem/radius/container`, `hds/sem/border/container` (via `surface.css`, `data-elevation="3"`) |
| Box padding | `hds/sem/measure/space/600` (header, body, and button row) |
| Side gap to the screen edge | `hds/sem/measure/space/400` |
| Width | `hds/sem/measure/width/{8000,9600,12800}` |
| Title | `hds/sem/color/content/strong/fg`, `hds/sem/typography/headline/{family,weight,leading,tracking}`, `hds/sem/typography/headline/size/sm` |
| Header row gap (title to X) | `hds/sem/measure/space/400` |
| Body text | `hds/sem/color/content/default/fg`, body typography (inherited) |
| Gap header to body, body to button row | `hds/sem/measure/space/600` |
| Button row gap | `hds/sem/measure/space/200` |
| X button | `hds/sem/color/action/tertiary/*` (via `action.css`), `hds/sem/measure/size/800`, `hds/sem/radius/control` |
| Focus ring | `hds/sem/color/focus/ring`, `hds/sem/border/focus` (from `base.css`) |

Notes:

- No primitive or driver references. The transition (150 ms, `scale(0.97)`) and `z-index` are structural literals.
- Change from the dry run: title size `headline/size/md` to `headline/size/sm`, because the box is 384px by default.
- Contrast: `content/strong/fg` and `content/default/fg` on `surface/modal/bg` are already checked pairs.

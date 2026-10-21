# Internal Spec: Aside

Status:
- spec: reviewed
- code: pending
- figma: pending
- docs: pending

- Date: 2026-10-20
- Interview: brainstorm, see `.claude/decisions.md` ("Layout and page-building components").
- Set: page-building component. Renders `<aside>`.

## Description

Aside is a column of supporting content beside the main content of a page: a side nav, an outline (table of contents), sources, or related links. It has a width, an optional background, and optional sticky behavior. It has no Base UI primitive. It is a `useRender` component.

## Usage

- Do use Aside for a side nav, an outline, a list of sources, or related links.
- Do put a `<nav>` element inside an Aside that holds navigation.
- Don't use it to place itself beside the main content. A `Grid` does that.
- Don't use it for a drawer that opens and closes. That is a later app shell component.

## Base UI API

No Base UI primitive. `useRender.ComponentProps<'aside'>` + `mergeProps`:

| Surface | Decision |
| --- | --- |
| `render` | Exposed. |
| Native `aside` props (`id`, `aria-*`, `className`, ...) | Exposed. `style` is removed from the type. `aria-label` names the landmark. A page with more than one aside needs a name for each. There is no `label` prop. |

## Extension API

| Prop | Type | Default | Decision |
| --- | --- | --- | --- |
| `width` | `measure/width` step, or `"full"`, or a responsive object | `"8000"` | Width of the column. |
| `sticky` | `boolean` | `false` | The column stays in view while the page scrolls. It scrolls inside itself when it is taller than the screen. |
| `surface` | `"sunken" \| "base" \| "raised" \| "primary" \| "secondary"` | absent | Background color. Absent: transparent. `raised` stays on Aside for now (decided 2026-10-20), unlike `Section`. `primary` and `secondary` set the brand context, as in `Section`. |
| `paddingBlock` | space step or `"none"`, or a responsive object | `"400"` | Space above and below the content. |
| `paddingInline` | space step or `"none"`, or a responsive object | `"400"` | Space at the left and right edges. |

## Token mapping

| Prop | Tokens |
| --- | --- |
| `width` | `hds/sem/measure/width/{step}` (**new family**) |
| `surface` | `hds/sem/color/surface/{sunken,base,raised}/bg` |
| `paddingBlock`, `paddingInline` | `hds/sem/measure/space/{step}` |
| Content text color | `hds/sem/color/content/default/fg` |

## CSS

`position: sticky; top: 0; max-height: 100svh; overflow-y: auto` when `sticky` is set. `flex: none; inline-size: var(--_width)` so the column does not shrink in a `Flex`. Class `hds-aside`. Axes are `data-width`, `data-surface`, `data-sticky`.

## Open

- **Sticky offset under a sticky `Header`.** A sticky Aside at `top: 0` slides under a sticky Header. Options: the Header writes its height to a custom property that the Aside reads; or the caller sets the offset. Decide at code time.
- **100vh layouts (undecided, 2026-10-20).** In an app layout where the page does not scroll, the main region and the Aside each scroll inside their own column, and `sticky` is not needed. Today the spec ties `overflow-y: auto` to `sticky`. `Grid` and `Flex` have no `height` prop, so they cannot fill the screen height. The user is not sure yet and expects page templates and component set templates to settle it. Do not change the spec until then.
- **Responsive collapse.** Not in Aside. An app shell component handles it later.

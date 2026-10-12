# Internal Spec: Icon

Status:
- spec: reviewed
- code: built
- figma: built
- docs: pending

- Date: 2026-10-11
- Interview: `interview-guide-2026-10-10.md`
- Base UI version documented from: `@base-ui/react` 1.8.0 (no icon primitive — plain span wrapper)
- Code: `src/components/Icon.tsx` + `Icon.css` (pre-rework: `variant` and CSS-length `size`; rebuild per this spec)

## Description

Icon shows one icon, either an SVG or a Material Symbols glyph name, with a Content or Feedback tone color and a size. An SVG must use `currentColor` for its stroke or fill. Icon supplies the color from a tone, or from the surrounding text when no tone is set. The box comes from the surrounding font size, or from a `size` step. It has no Base UI primitive — a plain span wrapper.

## Usage

- Do use Icon for every standalone icon.
- Do pass either an SVG element or a glyph name string as children.
- Don't use it for content images — use `<img>`.
- Do leave `tone` unset inside a Button or Alert so the icon matches the text.
- Do give `label` to an icon that carries meaning on its own.

## Base UI API

No Base UI primitive. Icon is a plain function component over `ComponentProps<'span'>`:

| Surface | Decision |
| --- | --- |
| Native `span` props (`id`, `className`, ...) | Exposed — full passthrough. `style` is removed from the type (API conventions section 1). |
| `aria-*` handling | Managed by the component from `label`: `role="img"` + `aria-label` when labeled, `aria-hidden` otherwise. |
| `render` | Not offered. Plain span. |

## Extension API

| Prop | Category | Type | Default | Decision |
| --- | --- | --- | --- | --- |
| `tone` | Axis | `'strong' \| 'default' \| 'muted' \| 'accent' \| 'danger' \| 'warning' \| 'success' \| 'info'` | unset (inherits surrounding text color) | Sets `data-tone`. Unset keeps `currentColor`. `link` is omitted by decision. |
| `size` | Measure | `'400' \| '500' \| '600' \| '800' \| '1000' \| '1200' \| '1600' \| '2400' \| '3200'` | unset (surrounding font size, `1em`) | Sets `data-size`. Single value only. Recorded exception: values are measure step numbers, not sm/md/lg. |
| `fill` | State | `boolean` | `false` | Glyph names only. Sets `data-fill`. Ignored for SVG children. |
| `label` | Content | `string` | none | Accessible name. Recorded exception to the "no content shortcut props" rule: it is not visible content, and one prop sets `role` and `aria-label` together. |

Children: an SVG element (any `ReactElement`) or a glyph name `string`. A string child renders as a Material Symbols ligature.

Fixed, not props: weight, grade and optical size of the glyph font. Optical size follows `size`.

## Token mapping

| Part | Tokens |
| --- | --- |
| `tone="strong"`, `"default"`, `"muted"`, `"accent"` | `hds/sem/color/content/{tone}/fg` |
| `tone="danger"`, `"warning"`, `"success"`, `"info"` | `hds/sem/color/feedback/{tone}/icon` |
| Unset tone | inherits `currentColor` (no token read) |
| `size="{step}"` | `hds/sem/measure/size/{step}` for the box width and height |
| Unset size | structural `1em` |
| Glyph font size | equals the box size (structural) |
| Baseline nudge | `-0.125em` structural |
| Glyph family | structural: Material Symbols Outlined |

Notes:

- No primitive or driver references.
- Context-passive: tone tokens re-resolve under `data-context` and `data-section`. Unset tone follows the surrounding text.
- Contrast: Content and Feedback tones meet the 3:1 non-text rule through the token system.

## Open items

- Icon style (Outlined, Rounded, Sharp) and font loading. This spec assumes Outlined and a font that the client loads. The owner decides before the code skill runs.
- The dev-time `variant` prop is removed with no backwards compatibility (project memory).

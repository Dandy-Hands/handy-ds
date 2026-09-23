# Internal Spec: Icon

- Status: reviewed (retroactive; owner pre-approved, interview skipped)
- Date: 2026-09-23
- Interview: `interview-guide-2026-09-23.md` (retroactive)
- Base UI version documented from: `@base-ui/react` 1.8.0 (no icon primitive — plain span wrapper)
- Code: `src/components/Icon.tsx` + `Icon.css`

## Description

Icon wraps an SVG so it takes an Icon role color and a size. The SVG must use `currentColor` for its stroke or fill; Icon supplies the color from the Icon category (or the surrounding text when no variant is set) and the box from the surrounding font size. It has no Base UI primitive — a plain span wrapper.

## Usage

- Do use Icon for every standalone icon; the SVG must draw with `currentColor`.
- Don't use it for content images — use `<img>`.
- Do omit `variant` inside a Button or Alert so the icon matches the text.
- Do give `label` to an icon that carries meaning on its own.

## Base UI API

No Base UI primitive. Icon is a plain function component over `ComponentProps<'span'>`:

| Surface | Decision |
| --- | --- |
| Native `span` props (`id`, `className`, `style`, ...) | Exposed — full passthrough. |
| `aria-*` handling | Managed by the component from `label`: `role="img"` + `aria-label` when labeled, `aria-hidden` otherwise. |
| Callback-form `className` / `style` | Available via passthrough, not documented. |

## Extension API

| Prop | Type | Default | Decision |
| --- | --- | --- | --- |
| `variant` | `'default' \| 'secondary' \| 'accent'` | unset (inherits surrounding text color) | Existing axis. Sets `data-variant`; unset keeps `currentColor`. |
| `size` | `string` (CSS length) | surrounding font size (`1em`) | Existing prop. Applied as the private `--_size` custom property; no measure token exists (spec section 7). |
| `label` | `string` | none | Accessibility name. Omit for decorative icons. |

## Token mapping

| Part | Tokens |
| --- | --- |
| `variant="default"` | `hds/sem/icon/color/default/fg` |
| `variant="secondary"` | `hds/sem/icon/color/secondary/fg` |
| `variant="accent"` | `hds/sem/icon/color/accent/fg` |
| Unset variant | inherits `currentColor` (no token read) |
| Size | structural `--_size` (default `1em`); baseline nudge `-0.125em` structural |

Notes:

- No primitive or driver references; the Icon category has no measure tokens by design.
- Context-passive: on-primary grounds override the icon fg tokens and unset variants follow the surrounding text.

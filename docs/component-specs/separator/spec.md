# Internal Spec: Separator

- Status: reviewed (retroactive; owner pre-approved, interview skipped)
- Date: 2026-09-23
- Interview: `interview-guide-2026-09-23.md` (retroactive)
- Base UI version documented from: `@base-ui/react` 1.8.0 (`@base-ui/react/separator`)
- Code: `src/components/Separator.tsx` + `Separator.css`

## Description

Separator is a dividing line between groups that spacing alone does not separate. It wraps Base UI's separator primitive and reads the Divider category: one color, three thicknesses. `orientation="vertical"` turns the rule upright for inline separators.

## Usage

- Do use Separator between groups of content, inside toolbars and menus.
- Don't use it when spacing is enough — a line is noise.
- Do keep weights consistent within one surface (mostly `thin`; `medium`/`thick` for emphasis).

## Base UI API

Wrapped component: `Separator` from `@base-ui/react/separator`. Surface decisions:

| Base UI surface | Decision |
| --- | --- |
| Props (`orientation`, `role` presentation defaults, native `div` props, ...) | Exposed — full passthrough. |
| `orientation` | Base UI's prop, consumed by the CSS (`data-orientation='vertical'`). |
| `render` | Exposed — passthrough. |
| Callback-form `className` / `style` | Available via passthrough, not documented. |

## Extension API

| Prop | Type | Default | Decision |
| --- | --- | --- | --- |
| `weight` | `'thin' \| 'medium' \| 'thick'` | `'thin'` | Existing axis. Sets `data-weight`; picks the Divider thickness step. |

## Token mapping

| Part | Tokens |
| --- | --- |
| Line color | `hds/sem/divider/color/border` |
| Thickness | `hds/sem/divider/measure/{thin,medium,thick}/thickness` |

Notes:

- No primitive or driver references; margins and `flex-shrink: 0` are structural.
- Context-passive: the divider color re-resolves from ancestor `data-context` / `data-section` overrides.

# Internal Spec: Meter

- Status: docs-built
- Date: 2026-09-23
- Interview: `interview-guide-2026-09-23.md` (retroactive)
- Base UI version documented from: `@base-ui/react` 1.8.0 (`@base-ui/react/meter`, `@base-ui/react/progress`)
- Code: `src/components/Meter.tsx` + `Meter.css`

## Description

Meter shows a value in a known range — storage used, a score — with a label, a track, a fill, and an optional formatted value. `Progress` is the task-completion sibling: same parts, primary-colored fill, and an indeterminate state when `value={null}`. Both compose from Base UI primitives; the family adds no behavior.

## Usage

- Do use Meter when the number means something on its own and has a known range.
- Don't use Meter for a running task — use `Progress`.
- Do pass `value={null}` to Progress when the duration is unknown.
- Don't add your own track styling — sentiment and fill colors are theme-owned.

## Base UI API

Wrapped components: `Meter` from `@base-ui/react/meter`, `Progress` from `@base-ui/react/progress`. Surface decisions:

| Base UI surface | Decision |
| --- | --- |
| `Meter.Root` props (`value`, `min`, `max`, `format`, `locale`, `aria-valuetext`, `getAriaValueText`, ...) | Exposed — full passthrough. |
| `Progress.Root` props (`value` (`number \| null`), `min`, `max`, ...) | Exposed — full passthrough; `null` drives `data-indeterminate`. |
| `Root`, `Label`, `Track`, `Indicator`, `Value` | Styled with `part()`: `hds-meter`, `hds-meter__label`, `hds-meter__track`, `hds-meter__indicator`, `hds-meter__value` (shared by both). |
| `render` on every part | Exposed — passthrough via `part()`. |
| `data-indeterminate` (Progress), `data-sentiment` (Meter.Root) | Consumed by CSS. |
| Callback-form `className` / `style` | Available via passthrough, not documented. |

## Extension API

| Prop | Where | Type | Default | Decision |
| --- | --- | --- | --- | --- |
| `sentiment` | `Meter.Root` | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` | Existing axis. Sets `data-sentiment`; picks the fill color. `Progress` has no sentiment. |

## Token mapping

> **Provisional (2026-10-07).** The token rework renamed every token. The names below are the provisional mapping from the previous spec (token spec section 9, item 5). This component's re-interview confirms them.

| Part | Tokens |
| --- | --- |
| Track | `hds/sem/color/surface/base/*` |
| Meter fill (per sentiment) | `hds/sem/color/feedback/{info,success,warning,danger}/icon` |
| Progress fill | `hds/sem/color/action/primary/default/bg` |
| Label | `hds/sem/color/content/default/fg`, `hds/sem/typography/label/*` |
| Value | `hds/sem/color/content/muted/fg`, `hds/sem/typography/caption/*` |
| Track height / radius | structural literals (`0.5rem`, `999px`) |

Notes:

- No primitive or driver references; no new tokens (token-system-spec section 9 Meter/Progress rows).
- Fill transition (`width 300ms`) and the indeterminate slide are structural, with a `prefers-reduced-motion` fallback.

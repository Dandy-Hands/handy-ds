# Internal Spec: Alert

- Status: reviewed (retroactive; owner pre-approved, interview skipped)
- Date: 2026-09-23
- Interview: `interview-guide-2026-09-23.md` (retroactive)
- Base UI version documented from: `@base-ui/react` 1.8.0 (no alert primitive — `useRender` + `mergeProps`)
- Code: `src/components/Alert.tsx` (+ shared `Feedback.css`)

## Description

Alert is a message that stays on the page: a bordered block colored by sentiment — info, success, warning, or danger — with an optional heading and icon. It has no Base UI primitive; it is a `useRender` component. Use Alert when the message is part of the page and must stay readable; use Toast for a short confirmation after an action.

## Usage

- Do use Alert for page-level messages: form summaries, account warnings, empty-state notices.
- Don't use it for a transient confirmation — use `Toast`.
- Do pass `role="alert"` (urgent) or `role="status"` (polite) when it appears in response to an action; static banners should not announce.
- Do keep the heading short; the body carries the detail.

## Base UI API

No Base UI primitive. Alert is a single-part `useRender` component (`useRender.ComponentProps<'div'>` + `mergeProps`):

| Surface | Decision |
| --- | --- |
| `render` | Exposed — swap the element without changing the look. |
| Native `div` props (`id`, `aria-*`, `className`, `style`, `role`, ...) | Exposed — full passthrough; `role` is how callers opt into live-region behavior. |
| Callback-form `className` / `style` | Available via passthrough, not documented. |

## Extension API

| Prop | Type | Default | Decision |
| --- | --- | --- | --- |
| `sentiment` | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` | Existing axis. Sets `data-sentiment`; picks the Feedback color set. |
| `heading` | `ReactNode` | — | Renders a styled `<p>` above the body. Not a heading level — the caller controls document structure around the alert. |
| `icon` | `ReactNode` | — | Renders inside a span colored with the sentiment's `icon-fg` token. |

## Token mapping

| Part | Tokens |
| --- | --- |
| Block (per sentiment) | `hds/sem/feedback/color/{info,success,warning,danger}/{bg,fg,border}` |
| Icon span (per sentiment) | `hds/sem/feedback/color/{info,success,warning,danger}/icon-fg` |
| Measure | `hds/sem/feedback/measure/{padding,radius,gap,border-width}` |
| Heading weight | `hds/sem/type/other/label/weight` |

Notes:

- No primitive or driver references; no new tokens.
- Structure (`flex` body layout, `1.25em` icon size) is structural.

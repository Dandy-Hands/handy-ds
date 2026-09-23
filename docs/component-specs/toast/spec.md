# Internal Spec: Toast

- Status: docs-built
- Date: 2026-09-23
- Interview: `interview-guide-2026-09-23.md` (retroactive)
- Base UI version documented from: `@base-ui/react` 1.8.0 (`@base-ui/react/toast`)
- Code: `src/components/Toast.tsx` (+ shared `Feedback.css`, `action.css`, `Button.css`)

## Description

Toast is a short-lived message after an action: a stacked notification in a fixed bottom-right viewport, colored by its `type` (the Feedback sentiment). `Toaster` renders every toast from the nearest `Toast.Provider`. Use Toast to confirm something that happened with nothing for the user to do; use Alert or Dialog when the user must read or act.

## Usage

- Do wrap the app in `Toast.Provider` once and render `<Toaster />` once.
- Do call `Toast.useToastManager().add({ title, description, type })` anywhere.
- Don't use it when the user must read or act on the message — use `Alert` or `Dialog`.
- Don't rebuild the viewport per surface — `Toaster` is the single renderer.

## Base UI API

Wrapped component: `Toast` from `@base-ui/react/toast`. Surface decisions:

| Base UI surface | Decision |
| --- | --- |
| `Provider` props (`limit` = 3, `timeout` = 5000, `toastManager`) | Exposed — full passthrough; no defaults overridden. |
| `Toast.useToastManager()` | Exposed — the manager hook (`add`, toasts, ...). |
| `Viewport`, `Root`, `Content`, `Title`, `Description`, `Action`, `Close` | Styled with `part()`: viewport, `hds-feedback hds-toast` root, content, heading, description, `hds-button hds-action` action, close with built-in X + `aria-label="Close"`. |
| `Portal` | Passthrough. |
| `Toaster` | handy-ds component: maps manager toasts to `Toast.Root` with `data-sentiment={toast.type ?? 'info'}`; no swipe/stack animation. |
| `render` on every part | Exposed — passthrough via `part()`. |
| `data-sentiment` (from `type`), `data-starting-style`, `data-ending-style`, `data-limited` | Consumed by CSS. |
| Callback-form `className` / `style` | Available via passthrough, not documented. |

## Extension API

| Prop | Type | Default | Decision |
| --- | --- | --- | --- |
| — | — | — | No extension props on `Toast` or `Toaster`. The `type` sent to `add()` carries the sentiment. |

## Token mapping

| Part | Tokens |
| --- | --- |
| Toast block (per sentiment) | `hds/sem/feedback/color/{info,success,warning,danger}/{bg,fg,border}` (via `Feedback.css`) |
| Depth | `hds/sem/surface/color/2/default/shadow` (cross-category borrow) |
| Measure | `hds/sem/feedback/measure/{padding,radius,gap,border-width}` |
| Action | `hds/sem/action/color/secondary/*` + `hds/sem/action/measure/md/*` (via `action.css`) |
| Viewport | structural: fixed corner, `min(22rem, calc(100vw - 2rem))` width, feedback gap |

Notes:

- No primitive or driver references; transitions (`opacity`/`transform`) and the corner placement are structural.
- **Spec change flagged:** the decisions log's Toast entry ("`<Toaster />` renders a simple stacked viewport, without Base UI's swipe/stack animation") matches the code — no conflict here. The trigger-styling flag does not apply to this family.

# Internal Spec: Toast

- Status: docs-built
- Date: 2026-09-23
- Interview: `interview-guide-2026-09-23.md`
- Base UI version documented from: `@base-ui/react` 1.8.0
- Code status: component exists (`src/components/Toast.tsx`; look in `src/components/Feedback.css`)

## Description

Toast is a short-lived message confirming something that happened, with nothing for the user to do. `Toast.Provider` + `<Toaster />` go once at the app root; anywhere in the app, `Toast.useToastManager().add({ title, description, type })` raises one. A toast's `type` is its sentiment: info, success, warning, or danger. Do not use it when the user must read or act on the message — use Alert (persistent) or Dialog (blocking).

## Usage

- Do use Toast for save confirmations, copy successes, background-task outcomes — anything self-dismissing.
- Don't use it when the user must read or act on the message — use `Alert` or `Dialog` (`.claude/decisions.md` pairs this rule with the Alert live-region decision).
- Don't add a `sentiment` prop — `type` already carries it.

## Base UI API

One wrapper file (`src/components/Toast.tsx`):

- `Toast` spreads the full `@base-ui/react/toast` namespace. Class-carrying parts: `Viewport` (`hds-toast-viewport`), `Root` (`hds-feedback hds-toast`), `Content` (`hds-toast__content`), `Title` (`hds-feedback__heading`), `Description` (`hds-toast__description`), `Action` (`hds-button hds-action`), `Close` (`hds-feedback__close` + built-in X icon, `aria-label="Close"`). `Portal`, `Positioner`, `Arrow`, and hooks pass through unstyled.
- `Provider` passes through: `timeout` (default 5000 ms), `limit`, `toastManager`.
- `Toast.useToastManager()` returns `{ toasts, add, close, update, promise, ... }`; `add` options: `title`, `description`, `type`, `timeout`, `priority` (`'low'` polite / `'high'` urgent).
- `Toaster()` — a function component rendering `Portal > Viewport > Root(…)> Content(Title, Description) + Close` for every toast from the nearest Provider, setting `data-sentiment={toast.type ?? 'info'}` per toast. No swipe or stack animation — a simple stacked viewport with a fade/rise transition (`.claude/decisions.md` Wave 5).

Nothing is renamed or omitted; authors composing a custom renderer get the raw parts unchanged.

## Extension API

| Prop | Part | Type | Default | Decision |
| --- | --- | --- | --- | --- |
| — | — | — | — | No handy-ds props. `type` on `add()` is the sentiment axis: `'info'` (default) \| `'success'` \| `'warning'` \| `'danger'`. |

Explicitly rejected:

- a separate `sentiment` prop — `type` is the single source of truth; `Toaster` derives `data-sentiment` from it;
- swipe/stack animation in `Toaster` — a simple stacked viewport was the Wave 5 decision; the raw parts remain available for a fancier custom renderer.

## Token mapping

| Part | Tokens |
| --- | --- |
| Toast frame colors (per `data-sentiment`) | `hds/sem/feedback/color/{info,success,warning,danger}/{bg,fg,border,icon-fg}` |
| Toast frame measures | `hds/sem/feedback/measure/{padding,radius,gap,border-width}` |
| Title type | `hds/sem/type/other/label/weight` (`.hds-feedback__heading`) |
| Toast elevation | `hds/sem/surface/color/2/default/shadow` (`.hds-toast`) |
| Close button radius | `hds/sem/action/measure/md/radius` (`.hds-feedback__close`) |
| Action button | `hds/sem/action/*` via the shared Action look (`.hds-button hds-action`) |
| Viewport | no tokens — fixed position, structural z-index and width only |
| Focus ring | `hds/sem/focus/color/stroke`, `hds/sem/focus/measure/stroke-width` |

Notes:

- Category is Feedback (token spec section 9: Toast → Feedback); the transition (opacity/translate) and viewport geometry are structural literals, allowed by the conventions.

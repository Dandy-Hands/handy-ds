# Interview Guide: Toast component (retroactive)

- Status: complete
- Started: 2026-09-23
- Component: Toast (`src/components/Toast.tsx`, family: Toast + Toaster)
- Note: Retroactive guide. Owner directed the interview be skipped for this run; every answer below is derived from the existing component code and `.claude/decisions.md` (cite which).
- Base UI version documented from: `@base-ui/react` 1.8.0

## 1. Process decision

- [x] Q1: Toast code already exists (`src/components/Toast.tsx`). How should we proceed?
  > Retroactive confirmation: the code is the reviewed answer. (BRIEF `retro-docs-run-2026-09-23/BRIEF.md`.)

## 2. Base UI surface

Toast wraps `@base-ui/react/toast` as a compound component plus a ready-made `Toaster` renderer.

- [x] Q2: Expose the full part set (Provider, Viewport, Root, Content, Title, Description, Action, Close, Portal, Positioner, Arrow, hooks) unchanged?
  > Yes — `export const Toast = { ...BaseToast, ... }` with `part()` classes on Viewport/Root/Content/Title/Description/Action/Close (`src/components/Toast.tsx` lines 10–19). Portal, Positioner, Arrow, and hooks pass through untouched (Wave 5 "Compound components mirror Base UI's namespace").

- [x] Q3: A toast's `type` — reuse it as the sentiment axis or add a separate prop?
  > Reuse it: `type` IS the sentiment (`'info' | 'success' | 'warning' | 'danger'`, `info` default). `.claude/decisions.md` Wave 5: "**Toast:** the toast `type` is the sentiment (`info` default)." Code: `Toaster` sets `data-sentiment={toast.type ?? 'info'}` on each `Toast.Root` (`src/components/Toast.tsx` line 27), and `Feedback.css` maps `data-sentiment` to the Feedback tokens (lines 5–7, 26–39).

- [x] Q4: Toast add options (`title`, `description`, `timeout`, `priority`) — expose as-is?
  > Expose as-is via `Toast.useToastManager().add(options)`; `timeout` default 5000 ms, `priority` `'low' | 'high'` controls announcement politeness (`@base-ui/react/toast/useToastManager.d.ts`). `docs/components.md` "Toast, Toaster": "No handy-ds props."

- [x] Q5: Provider-level `timeout` / `limit` / `toastManager` — expose as-is?
  > Expose as-is; `Provider` passes through the spread (`src/components/Toast.tsx` line 10). Defaults come from the primitive (timeout 5000).

- [x] Q6: Swipe-to-dismiss, positioner anchoring, stacked animations — keep or cut?
  > Cut the fancy bits for the shipped `<Toaster />`: a simple stacked viewport without Base UI's swipe/stack animation (`.claude/decisions.md` Wave 5: "`<Toaster />` renders a simple stacked viewport, without Base UI's swipe/stack animation"). `Feedback.css` `.hds-toast` has a plain fade/rise transition with `data-starting-style`/`data-ending-style` (lines 86–92); swipe stays reachable for anyone composing their own renderer from the raw parts.

## 3. Extension props

- [x] Q7: Add a `sentiment` prop anywhere?
  > No. `type` already carries it and `Toaster` derives `data-sentiment` from it (`src/components/Toast.tsx` line 27). A second prop would be a synonym with two sources of truth.

- [x] Q8: `Toaster` — a function component rendering Portal + Viewport + Roots, or leave assembly to authors?
  > Ship `Toaster` as the one-liner: `export function Toaster()` maps the provider's toasts into `Portal > Viewport > Root > Content(Title, Description) + Close` (`src/components/Toast.tsx` lines 23–35). `docs/components.md` "Toast, Toaster" documents it as the standard renderer. Custom renderers can still compose the raw parts.

- [x] Q9: Close button styling and icon — built in?
  > Built in: `Close: part(BaseToast.Close, 'hds-feedback__close', { children: <XIcon />, 'aria-label': 'Close' })` (`src/components/Toast.tsx` line 18). It shares the Feedback close-button look with Alert (`Feedback.css` `.hds-feedback__close`).

- [x] Q10: Any other handy-ds props?
  > None. `docs/components.md` "Toast, Toaster": "No handy-ds props. A toast's `type` is its sentiment."

## 4. Token mapping

- [x] Q11: Confirm the toast is Feedback category (per-type colors) with a Surface shadow, and the Close button's border-radius borrows the Action md radius?
  > Confirmed. `Feedback.css` maps `data-sentiment` to `hds/sem/feedback/color/{sentiment}/{bg,fg,border,icon-fg}` and `hds/sem/feedback/measure/*` (lines 5–44); `.hds-toast` shadow is `hds-sem-surface-color-2-default-shadow` (line 85); `.hds-feedback__close` radius is `hds-sem-action-measure-md-radius` (line 71). Token spec section 9 maps Toast to Feedback (`.claude/specs/token-system-spec.md` section 9).

- [x] Q12: The viewport — any tokens?
  > None: fixed position, z-index (structural literal), width `min(22rem, calc(100vw - 2rem))` — structure, not theme (`Feedback.css` lines 75–84, per the conventions' allowance for structural literals).

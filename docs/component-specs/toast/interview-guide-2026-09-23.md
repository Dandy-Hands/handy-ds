# Interview Guide: Toast component (retroactive)

- Status: complete
- Started: 2026-09-23
- Component: Toast (`src/components/Toast.tsx` + shared `Feedback.css`; family = Toast + Toaster)
- Note: Retroactive guide. Owner directed the interview be skipped for this run; every answer below is derived from the existing component code and `.claude/decisions.md` (cite which).
- Base UI version documented from: `@base-ui/react` 1.8.0

## 1. Existing surface (confirmations)

- [x] Q1: Keep the existing surface as-is — `Toast` namespace plus the `Toaster` component, with no extension props on either?
  > Yes — `Toast` mirrors Base UI's namespace with `part()` wrappers; `Toaster` is a plain function component (lines 24–37). docs/components.md: "No handy-ds props."
- [x] Q2: Compound parts mirror the Base UI namespace so the underlying docs apply part for part?
  > Yes — `...BaseToast` spread (line 11). decisions.md Wave 5: "Compound components mirror Base UI's namespace."

## 2. Styling decisions

- [x] Q3: A toast's `type` is its sentiment — `Toaster` maps `toast.type` to `data-sentiment` (defaulting to `info`) so the shared Feedback CSS colors it?
  > Yes — `<Toast.Root ... data-sentiment={toast.type ?? 'info'}>` (line 30). decisions.md Wave 5: "the toast `type` is the sentiment (`info` default)." Type values are the Feedback sentiment set (`info | success | warning | danger`) as shown in the demo and docs.
- [x] Q4: `<Toaster />` renders a simple stacked viewport — no Base UI swipe/stack animation — fixed bottom-right with the Feedback gap?
  > Yes — `Toaster` maps `toasts` to `Toast.Root`s in a `Toast.Viewport` (lines 24–37); `Feedback.css` positions `.hds-toast-viewport` fixed at the block-end/inline-end corner with the feedback gap. decisions.md Wave 5: "renders a simple stacked viewport, without Base UI's swipe/stack animation."
- [x] Q5: The toast carries a Surface elevation-2 shadow on top of its Feedback colors?
  > Yes — `.hds-toast` reads `surface/color/2/default/shadow` (Feedback.css). Recorded here as a deliberate cross-category borrow for depth.
- [x] Q6: `Close` ships an X glyph with `aria-label="Close"` as the overridable default?
  > Yes — `Close: part(..., 'hds-feedback__close', { children: <XIcon />, 'aria-label': 'Close' })` (line 22).

## 3. Behavior

- [x] Q7: Usage stays Base UI's manager model: `<Toast.Provider>` at the app root, `<Toaster />` once, then `Toast.useToastManager().add({ title, description, type })`; timeout (5000ms default) and limit (3) keep Base UI's defaults?
  > Yes — file doc comment (lines 15–17) and the demo's `ToastButton`; nothing overrides Provider defaults. decisions.md Wave 5 chose Toast as "a real component — Base UI Toast has a provider/manager API."
- [x] Q8: Toast reads Feedback tokens only (per-sentiment colors + measure), reusing `Feedback.css` with Alert?
  > Yes — `Toast.tsx` imports `Feedback.css` (plus `action.css`/`Button.css` for the `Action` part); the sentiment styling is the shared `.hds-feedback` block.

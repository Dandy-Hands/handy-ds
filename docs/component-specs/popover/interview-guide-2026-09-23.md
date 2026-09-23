# Interview Guide: Popover component (retroactive)

- Status: complete
- Started: 2026-09-23
- Component: Popover (`src/components/Popover.tsx` + `Popover.css`)
- Note: Retroactive guide. Owner directed the interview be skipped for this run; every answer below is derived from the existing component code and `.claude/decisions.md` (cite which).
- Base UI version documented from: `@base-ui/react` 1.8.0

## 1. Existing surface (confirmations)

- [x] Q1: Keep the existing surface as-is — the `Popover` namespace with no extension props?
  > Yes — every part is a `part()` wrapper only; no wrapper prop exists. docs/components.md: "No handy-ds props."
- [x] Q2: Compound parts mirror the Base UI namespace so the underlying docs apply part for part?
  > Yes — `...BasePopover` spread (`Popover.tsx` line 10). decisions.md Wave 5: "Compound components mirror Base UI's namespace."

## 2. Styling decisions

- [x] Q3: The popup is Surface elevation 2 with the standard popup transitions?
  > Yes — `Popup: part(..., 'hds-surface hds-popup hds-popover', { 'data-elevation': '2' })` (line 15). token-system-spec section 9 maps Popover to Surface; decisions.md Wave 5 NavigationMenu entry confirms elevation 2 is the popup norm.
- [x] Q4: The backdrop is the Overlay category, same as Dialog, but Popover stays non-modal by default?
  > Yes — `Backdrop: part(BasePopover.Backdrop, 'hds-backdrop')` (line 13); `modal` is Base UI's (default `false`). docs/components.md: "the page behind stays usable."
- [x] Q5: `Close` carries the Action look pinned to `tertiary`?
  > Yes — `Close: part(..., 'hds-button hds-action', { 'data-priority': 'tertiary' })` (line 17). Same trigger-styling caveat as Dialog: decisions.md's reversal entry does not match this code — code wins; flagged in the Dialog guide (Q6).
- [x] Q6: `Title` renders in label type and `Description` in body color, with the popup capped at `min(24rem, available-width)` (structural)?
  > Yes — `Popover.css` styles `.hds-popover__title` with `type/label/*` tokens, `.hds-popover__description` color `type/color/body-fg`, and sets the max-width literal.

## 3. Behavior

- [x] Q7: Positioning stays Base UI's — `Positioner` part plus `sideOffset` etc. at the call site; hover-open is available via `openOnHover`/`delay` passthrough but not documented?
  > Yes — `Positioner: part(BasePopover.Positioner, 'hds-positioner')` (line 14); the demo passes `sideOffset={8}`. The wrapper adds no positioning defaults.

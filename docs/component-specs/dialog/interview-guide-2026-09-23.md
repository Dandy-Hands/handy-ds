# Interview Guide: Dialog component (retroactive)

- Status: complete
- Started: 2026-09-23
- Component: Dialog (`src/components/Dialog.tsx` + `Dialog.css`; family = Dialog + AlertDialog)
- Note: Retroactive guide. Owner directed the interview be skipped for this run; every answer below is derived from the existing component code and `.claude/decisions.md` (cite which).
- Base UI version documented from: `@base-ui/react` 1.8.0

## 1. Existing surface (confirmations)

- [x] Q1: Keep the existing surface as-is — `Dialog` and `AlertDialog` as two namespaces in one family/file, with no extension props on either?
  > Yes — `Dialog.tsx` defines both; each part is a `part()` wrapper only. docs/components.md: "No handy-ds props." The brief's family rule is one family per source file.
- [x] Q2: Compound parts mirror the Base UI namespace so the underlying docs apply part for part?
  > Yes — `...BaseDialog` / `...BaseAlertDialog` spreads (`Dialog.tsx` lines 15, 26). decisions.md Wave 5: "Compound components mirror Base UI's namespace."
- [x] Q3: `AlertDialog` differs from `Dialog` only in dismissal behavior (no outside-click dismiss) and reuses the exact same classes and tokens?
  > Yes — both namespaces apply identical `part()` classes; only the underlying Base UI component differs. docs/components.md: "AlertDialog confirms a destructive action and cannot be dismissed by clicking outside."

## 2. Styling decisions

- [x] Q4: The popup is Surface elevation 3, centered and sized at `min(32rem, calc(100vw - 2rem))` (structural)?
  > Yes — `Popup: part(..., 'hds-surface hds-popup hds-dialog', { 'data-elevation': '3' })` (line 18); `Dialog.css` sets the centering and width literals. token-system-spec section 9 maps Dialog to Surface.
- [x] Q5: The backdrop reads the Overlay category (`hds/sem/overlay/color/bg`)?
  > Yes — `Backdrop: part(BaseDialog.Backdrop, 'hds-backdrop')`; `surface.css` `.hds-backdrop` reads `overlay/color/bg`. token-system-spec section 9: "Overlay: Dialog/Drawer/Popover backdrop."
- [x] Q6: Triggers and Close buttons carry the secondary Button look (`hds-button hds-action`), overridable with `data-priority`?
  > Yes — `Trigger` and `Close` parts carry `'hds-button hds-action'` (lines 16, 21) and the demo passes `data-priority="primary"`. **Flag:** decisions.md "Triggers carry no styling" records a reversal for `Dialog.Trigger`/`AlertDialog.Trigger`, but the code on `main` still styles them — code wins; the decisions entry and the code need reconciling.
- [x] Q7: `Title` renders in heading type and `Description` in body type, with a structural margin between description and the footer actions?
  > Yes — `Dialog.css` styles `.hds-dialog__title` with `type/heading/*` tokens and `.hds-dialog__description` with `type/color/body-fg` plus `action/measure/md/gap` / `surface/measure/padding` margins.

## 3. Behavior

- [x] Q8: Modal behavior stays Base UI's default (`modal: true` — focus trap, scroll lock, outside-pointer dismissal for Dialog; AlertDialog blocks outside dismissal), with `initialFocus`/`finalFocus` passthrough on `Popup`?
  > Yes — no prop is overridden by the wrapper; the underlying docs cover focus management. The wrapper only adds classes and defaults.

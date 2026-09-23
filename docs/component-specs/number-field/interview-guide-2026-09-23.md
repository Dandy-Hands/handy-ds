# Interview Guide: NumberField component (retroactive)

- Status: complete
- Started: 2026-09-23
- Component: NumberField (`src/components/NumberField.tsx`, family: NumberField)
- Note: Retroactive guide. Owner directed the interview be skipped for this run; every answer below is derived from the existing component code and `.claude/decisions.md` (cite which).
- Base UI version documented from: `@base-ui/react` 1.8.0

## 1. Process decision

- [x] Q1: NumberField code already exists (`src/components/NumberField.tsx`). How should we proceed?
  > Retroactive confirmation: the code is the reviewed answer. (BRIEF `retro-docs-run-2026-09-23/BRIEF.md`.)

## 2. Base UI surface

NumberField wraps `@base-ui/react/number-field` as a compound component. The wrapper spreads the whole primitive namespace, so every part ships.

- [x] Q2: Expose the full part set (Root, Group, Input, Decrement, Increment, ScrubArea, ScrubAreaCursor, hooks) unchanged?
  > Yes — `export const NumberField = { ...BaseNumberField, ... }` (`src/components/NumberField.tsx` lines 8–14). Only `Group`, `Input`, `Decrement`, `Increment` carry classes; every other part and hook passes through untouched, so new upstream parts appear automatically (`.claude/decisions.md` Wave 5 "Compound components mirror Base UI's namespace").

- [x] Q3: Root value props (`value`, `defaultValue`, `min`, `max`, `step`, `smallStep`, `largeStep`, `snapOnStep`, `allowOutOfRange`, `format`, `locale`, `onValueChange`, `onValueCommitted`) — expose as-is?
  > Expose as-is. Nothing is renamed, wrapped, or omitted; the wrapper only adds classes and default props to four parts (`src/components/NumberField.tsx`). `docs/components.md` "NumberField": "No handy-ds props."

- [x] Q4: `disabled`, `readOnly`, `required`, `name`, `form`, `inputRef` — expose as-is?
  > Expose as-is; they pass through the spread and the Input/Field CSS styles `[data-disabled]` (`src/components/control.css` disabled rules).

- [x] Q5: `ScrubArea` / `ScrubAreaCursor` (drag-to-scrub on the label) — ship styled or leave unstyled?
  > Unstyled — they come through the spread with no class, so they are structural only. Styling them was never specced; the steppers are the primary affordance (`src/components/NumberField.tsx` styles only Group/Input/Decrement/Increment).

## 3. Extension props

- [x] Q6: Which part carries the size axis?
  > `NumberField.Group`, via `data-size` (`'sm' | 'md' | 'lg'`, default `md`): `Group: part(BaseNumberField.Group, 'hds-control', { 'data-size': 'md' })` (`src/components/NumberField.tsx` line 10). `docs/components.md` "NumberField": "`NumberField.Group` takes `data-size`." `control.css` maps sm/md/lg to `hds/sem/input/measure/{size}/*`.

- [x] Q7: Add a `size` prop on `Root` instead?
  > No. The Group is the styled frame (`hds-control`), so the axis lives where the look lives, matching the Input/Field category pattern (`src/components/control.css` header: "NumberField group" shares the `.hds-control` look).

- [x] Q8: Default icons for the steppers — built in or author-supplied?
  > Built in: `Decrement` defaults `children` to `<MinusIcon />`, `Increment` to `<PlusIcon />` (`src/components/NumberField.tsx` lines 11–12; icons from `src/components/icons.tsx`). Authors can override `children` to swap the glyph.

- [x] Q9: Any other handy-ds props (currency-only mode, presets, alignment)?
  > None. `format` / `locale` from the primitive cover currency, percent, and unit display; `docs/components.md` states "No handy-ds props."

## 4. Token mapping

- [x] Q10: Confirm NumberField is Input/Field category end to end?
  > Confirmed. Imports `base.css` + `control.css` only (`src/components/NumberField.tsx` lines 5–6). `control.css` header lists "NumberField group" among `.hds-control` consumers; token spec section 9 maps Number Field to Input/Field (`.claude/specs/token-system-spec.md` section 9, Base UI Component Mapping table).

- [x] Q11: Which tokens do the inner input and stepper buttons read?
  > `.hds-control__input` is transparent, inherits color/font from the frame (`control.css` lines 99–109). `.hds-control__button` steppers are transparent with a tertiary-Action hover (`hds-sem-action-color-tertiary-hover-bg/fg`, `control.css` lines 111–126); the frame's ring on focus-within is `hds/sem/focus/*` (lines 72–76).

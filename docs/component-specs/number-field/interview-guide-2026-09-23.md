# Interview Guide: NumberField component (retroactive)

- Status: complete
- Started: 2026-09-23
- Component: NumberField (`src/components/NumberField.tsx`)
- Note: Retroactive guide. Owner directed the interview be skipped for this run; every answer below is derived from the existing component code and `.claude/decisions.md` (cite which).
- Base UI version documented from: `@base-ui/react` 1.8.0

## 1. Existing surface (confirmations)

- [x] Q1: Keep the existing surface as-is — the `NumberField` namespace with no extension props added or removed?
  > Yes — the file only spreads Base UI's namespace and wraps four parts; no wrapper prop exists.
- [x] Q2: Compound parts mirror the Base UI namespace so the underlying docs apply part for part?
  > Yes — `...BaseNumberField` spreads every part and hook unchanged (`NumberField.tsx` line 8). decisions.md Wave 5: "Compound components mirror Base UI's namespace."

## 2. Extension API

- [x] Q3: No extension props; the only axis is `data-size` on `NumberField.Group` (default `md`)?
  > Yes — `Group: part(BaseNumberField.Group, 'hds-control', { 'data-size': 'md' })` (line 11). docs/components.md: "`NumberField.Group` takes `data-size`."
- [x] Q4: `Decrement` and `Increment` get built-in minus/plus glyphs as overridable defaults, not an `icon` prop?
  > Yes — `part(..., { children: <MinusIcon /> })` / `<PlusIcon />` (lines 12–13); callers override `children` to replace them. Same pattern as Button's "icons injected as children" call (decisions.md Wave 4/5).

## 3. Category and styling

- [x] Q5: The whole group reads the Input/Field category via the shared `.hds-control` look, with the inner input and stepper buttons as `.hds-control__input` / `.hds-control__button`?
  > Yes — `Group` carries `hds-control`; `Input` carries `hds-control__input`; both buttons carry `hds-control__button` (lines 10–13). `control.css` implements the control look and the inner parts.
- [x] Q6: Stepper buttons borrow the Action tertiary hover colors (`hds/sem/action/color/tertiary/hover/*`)?
  > Yes — `control.css` `.hds-control__button:hover` reads those tokens; recorded here as a deliberate cross-category borrow.
- [x] Q7: Base UI parts that are not styled (`Root`, `ScrubArea`, `ScrubAreaCursor`, `Clear`) still pass through unchanged?
  > Yes — they are on the namespace via the spread, unstyled. The demo and docs use only Group, Input, Decrement, Increment.

## 4. Token mapping

- [x] Q8: The group maps `data-size` to `hds/sem/input/measure/{sm,md,lg}/*` and states to `hds/sem/input/color/*`, plus the focus ring drawn on the frame?
  > Yes — `control.css` maps the axis and implements focus with `:has(:focus-visible)` from `hds/sem/focus/*`. No primitive or driver references.

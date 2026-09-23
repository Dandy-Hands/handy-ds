# Interview Guide: Field component (retroactive)

- Status: complete
- Started: 2026-09-23
- Component: Field (`src/components/Field.tsx` + `Field.css`, `control.css`)
- Note: Retroactive guide. Owner directed the interview be skipped for this run; every answer below is derived from the existing component code and `.claude/decisions.md` (cite which).
- Base UI version documented from: `@base-ui/react` 1.8.0

## 1. Existing surface (confirmations)
Goal: confirm what the current file already decides, so the spec describes reality.

- [x] Q1: Keep the existing surface as-is — `Field`, `Fieldset`, `Form`, and bare `Input` in one family, with no props added or removed?
  > Yes — confirm as-is. `Field.tsx` defines `Input` plus the three compound namespaces; no extension prop exists on any of them.
- [x] Q2: Compound parts mirror the Base UI namespace (`Field.Root/Label/Control/Description/Error/Item`, `Fieldset.Root/Legend`) so the underlying docs apply part for part?
  > Yes — the file spreads each Base namespace and wraps only DOM-rendering parts with `part(...)` (`Field.tsx` lines 23–30, 32–35, 37). decisions.md Wave 5: "Compound components mirror Base UI's namespace."
- [x] Q3: All Base UI props pass through unchanged on every part, with no handy-ds prop added to `Field` itself?
  > Yes — `part()` only prepends a class and applies overridable defaults; everything else spreads through (`src/components/part.ts`). Only `Input` adds `size`.

## 2. Extension props
Goal: confirm the wrapper's own additions.

- [x] Q4: `Input` exposes a `size` axis (`'sm' | 'md' | 'lg'`, default `md`) set as `data-size`, and `Field.Control` carries the same axis via `data-size`?
  > Yes — `InputProps` declares `size?: Size` (`Field.tsx` line 16) and renders `data-size` (line 21); `Field.Control` defaults `data-size: 'md'` (line 27). docs/components.md: "`Field.Control` takes `data-size` for the same axis."
- [x] Q5: No other extension props on `Field`, `Fieldset`, or `Form`?
  > Yes — none exist in the code and none are listed in docs/components.md.

## 3. Token mapping
Goal: confirm the categories the family reads and flag borrowed tokens.

- [x] Q6: Controls read Input/Field tokens for color and measure, with the size axis switching `hds/sem/input/measure/{sm,md,lg}/*`?
  > Yes — `control.css` maps `data-size` to `--hds-sem-input-measure-{sm,md,lg}-*` and every state rule reads `hds/sem/input/color/*`.
- [x] Q7: Field text uses Type roles — label tokens on `Field.Label`, caption tokens on `Field.Description` — and `Field.Error` reads `hds/sem/feedback/color/danger/fg`?
  > Yes — `Field.css` styles `.hds-field__label` with `type/label/*`, `.hds-field__description` and `.hds-field__error` with `type/caption/*`, and `.hds-field__error` color from `feedback/color/danger/fg`.
- [x] Q8: Layout spacing borrows Input/Field measure tokens (field gap = `input/measure/sm/padding-y`, form gap = `input/measure/lg/padding-x`) because the spec has no layout-spacing tokens yet?
  > Yes — `Field.css` header comment states it; decisions.md Wave 5 "Gap: layout spacing (new gap 13)" records the call and marks it needs-review.
- [x] Q9: Error text contrast holds only in the default context; inside a colored section the form goes in a `data-context="default"` container?
  > Yes — decisions.md Wave 5: "Field.Error uses feedback/color/danger/fg on the page ground … The rules doc says to put forms in a data-context=\"default\" card inside colored sections." Marked needs-review (gap 14).

## 4. States
Goal: confirm the state surface the CSS covers.

- [x] Q10: Control states are exactly the Input/Field state list — default, hover, focus (`:focus-within` / `data-popup-open`), error (`data-invalid` / `aria-invalid`), disabled — plus the group focus ring on the frame?
  > Yes — `control.css` implements each state and `.hds-control:has(:focus-visible)` draws the ring on the group frame from `hds/sem/focus/*`.

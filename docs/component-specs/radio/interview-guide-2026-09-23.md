# Interview Guide: Radio component (retroactive)

- Status: complete
- Started: 2026-09-23
- Component: Radio (`src/components/Radio.tsx` + shared `Checkbox.css`)
- Note: Retroactive guide. Owner directed the interview be skipped for this run; every answer below is derived from the existing component code and `.claude/decisions.md` (cite which).
- Base UI version documented from: `@base-ui/react` 1.8.0

## 1. Existing surface (confirmations)

- [x] Q1: Keep the existing surface as-is — `Radio` namespace plus `RadioGroup`, with no extension props added or removed?
  > Yes — the file wraps `Root` and `Indicator` and parts `RadioGroup` once; no wrapper prop exists.
- [x] Q2: Compound parts mirror the Base UI namespace so the underlying docs apply part for part?
  > Yes — `...BaseRadio` spreads all parts and hooks (`Radio.tsx` line 10). decisions.md Wave 5: "Compound components mirror Base UI's namespace."

## 2. Extension API

- [x] Q3: No extension props — no `size` axis, matching Checkbox?
  > Yes — the circle sizes itself at `1.25em` of the surrounding text (shared `Checkbox.css`), a structural literal. docs/components.md lists no handy-ds props.
- [x] Q4: The selected mark is a CSS dot (`::before` circle at 0.45em) with no glyph icon?
  > Yes — `.hds-radio__indicator::before` in `Checkbox.css` draws it from `currentColor`; no icon is injected (unlike Checkbox).

## 3. Category and tokens

- [x] Q5: Radio shares `Checkbox.css` and the Input/Field `checked` state (gap 12), with a circular shape?
  > Yes — `Radio.tsx` imports `./Checkbox.css`; `.hds-radio` sets `border-radius: 50%`; checked reads `hds/sem/input/color/checked/*`. decisions.md gap-12 decision and Wave 5 "Checkbox/Radio: read only Input/Field tokens."
- [x] Q6: The 1px border floor and the disabled + checked inversion apply to Radio the same as Checkbox?
  > Yes — the shared `Checkbox.css` rules cover both selectors.
- [x] Q7: `RadioGroup` is a vertical `hds-choice-group` stack with the borrowed `input/measure/sm/padding-x` gap?
  > Yes — shared `.hds-choice-group` rule; gap 13 (layout spacing borrowed).

## 4. Structure

- [x] Q8: A Radio is always inside a `RadioGroup`, and groups get their name from `Fieldset.Root` + `Fieldset.Legend` (or an `aria-labelledby`)?
  > Yes — file header comment "Always inside a RadioGroup"; docs/components.md: "Wrap the group in `Fieldset.Root` with a `Fieldset.Legend`."

# Interview Guide: Checkbox component (retroactive)

- Status: complete
- Started: 2026-09-23
- Component: Checkbox (`src/components/Checkbox.tsx` + `Checkbox.css`)
- Note: Retroactive guide. Owner directed the interview be skipped for this run; every answer below is derived from the existing component code and `.claude/decisions.md` (cite which).
- Base UI version documented from: `@base-ui/react` 1.8.0

## 1. Existing surface (confirmations)

- [x] Q1: Keep the existing surface as-is — `Checkbox` namespace plus `CheckboxGroup`, with no extension props added or removed?
  > Yes — the file wraps `Root` and `Indicator` and parts `CheckboxGroup` once; no wrapper prop exists.
- [x] Q2: Compound parts mirror the Base UI namespace so the underlying docs apply part for part?
  > Yes — `...BaseCheckbox` spreads all parts and hooks (`Checkbox.tsx` line 11). decisions.md Wave 5: "Compound components mirror Base UI's namespace."

## 2. Extension API

- [x] Q3: No extension props — no `size` axis on the box?
  > Yes — the box sizes itself at `1.25em` of the surrounding text (`Checkbox.css`), a structural literal, so it scales with its label without an axis. docs/components.md lists no handy-ds props.
- [x] Q4: `Indicator` ships built-in check and dash glyphs as overridable defaults (dash shown when `indeterminate`)?
  > Yes — `part(..., { children: [<CheckIcon .../>, <MinusIcon .../>] })` (lines 12–15); `Checkbox.css` hides the check when `[data-indeterminate]` and the dash otherwise.

## 3. Category and tokens

- [x] Q5: `checked` is an Input/Field state on the color token (`hds/sem/input/color/checked/*`), so Checkbox stays inside Input/Field?
  > Yes — decisions.md "handy-ds gap-12 decision (2026-09-12)": `checked` added to `INPUT_STATE`; `Checkbox.css` reads `--hds-sem-input-color-checked-{bg,fg,border}`.
- [x] Q6: The border has a 1px floor (`max(1px, input/measure/md/border-width)`) so an unchecked box stays visible when the input border driver is `none`?
  > Yes — `Checkbox.css` comment "1px floor: a borderless unchecked box would be invisible"; decisions.md Wave 5: "The border has a 1px floor."
- [x] Q7: Disabled + checked inverts the disabled colors so the mark still reads?
  > Yes — `Checkbox.css` `[data-disabled][data-checked]` uses `disabled-fg` as background and `disabled-bg` as the mark color; decisions.md Wave 5: "Disabled + checked uses the disabled colors inverted."
- [x] Q8: The box radius is half the Input/Field radius (checkbox) and a circle (radio), sharing `Checkbox.css`?
  > Yes — `.hds-checkbox` uses `calc(var(--hds-sem-input-measure-md-radius) / 2)`; `.hds-radio` uses `border-radius: 50%`.
- [x] Q9: `CheckboxGroup` is a vertical stack with gap = `input/measure/sm/padding-x` (borrowed layout spacing, gap 13)?
  > Yes — `.hds-choice-group` in `Checkbox.css`; decisions.md Wave 5 "Gap: layout spacing (new gap 13)".

## 4. States

- [x] Q10: States covered are exactly hover, checked (`[data-checked]`, plus `[data-indeterminate]`), invalid (`[data-invalid]`), and disabled — composed per `Checkbox.css`?
  > Yes — each state rule reads the matching `hds/sem/input/color/*` state; no primitive or driver references.

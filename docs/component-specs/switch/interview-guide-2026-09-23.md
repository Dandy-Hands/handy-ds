# Interview Guide: Switch component (retroactive)

- Status: complete
- Started: 2026-09-23
- Component: Switch (`src/components/Switch.tsx` + `Switch.css`)
- Note: Retroactive guide. Owner directed the interview be skipped for this run; every answer below is derived from the existing component code and `.claude/decisions.md` (cite which).
- Base UI version documented from: `@base-ui/react` 1.8.0

## 1. Existing surface (confirmations)

- [x] Q1: Keep the existing surface as-is — `Switch` namespace (`Root`, `Thumb`) with no extension props added or removed?
  > Yes — the file wraps only `Root` and `Thumb` with classes; no wrapper prop exists. docs/components.md: "No handy-ds props."
- [x] Q2: Compound parts mirror the Base UI namespace so the underlying docs apply part for part?
  > Yes — `...BaseSwitch` spreads all parts and hooks (`Switch.tsx` line 8). decisions.md Wave 5: "Compound components mirror Base UI's namespace."

## 2. Category and tokens

- [x] Q3: The track reads Action tokens — secondary when off, primary `selected` when on — instead of Input/Field?
  > Yes — file header comment and `Switch.css`: off state reads `action/color/secondary/{default,hover,disabled}/*`, on state reads `action/color/primary/selected/*`. decisions.md Wave 5: "Switch: track is Action secondary when off and Action primary `selected` when on."
- [x] Q4: The thumb uses the matching state's `fg` token, and slides on a structural `translate: 1em`?
  > Yes — `Switch.css` `.hds-switch__thumb` reads `secondary-default-fg` off and `primary-selected-fg` on. decisions.md Wave 5: "The thumb uses the matching `fg`." The 1em travel is a structural literal tied to the `2.25em × 1.25em` pill.
- [x] Q5: The pill shape (`999px`) and track size are structural literals, not tokens?
  > Yes — `Switch.css` sets `border-radius: 999px` and `inline-size: 2.25em; block-size: 1.25em` — the same class of structural value as the checkbox's `1.25em`.

## 3. Behavior

- [x] Q6: Switch takes effect immediately (no form submit), and is labeled with `Field.Label` or a wrapping `<label>` like Checkbox?
  > Yes — docs/components.md: "Use when the change applies the moment it is flipped … Don't use when the value is submitted with a form." Base UI ships a hidden input for form use anyway; the docs steer to Checkbox for that case.
- [x] Q7: States covered are hover, checked, disabled (track and thumb) — no invalid state?
  > Yes — `Switch.css` implements exactly hover, `[data-checked]`, and `[data-disabled]`; no error styling exists.

# Interview Guide: Separator component (retroactive)

- Status: complete
- Started: 2026-09-23
- Component: Separator (`src/components/Separator.tsx` + `Separator.css`)
- Note: Retroactive guide. Owner directed the interview be skipped for this run; every answer below is derived from the existing component code and `.claude/decisions.md` (cite which).
- Base UI version documented from: `@base-ui/react` 1.8.0

## 1. Existing surface (confirmations)

- [x] Q1: Keep the existing surface as-is — a single-part `Separator` with one extension prop (`weight`) and Base UI's `orientation` passthrough?
  > Yes — `SeparatorProps` adds only `weight` (`Separator.tsx` lines 9–12); `orientation` comes from the Base UI props. docs/components.md lists `weight` and `orientation` only.
- [x] Q2: Separator wraps Base UI's separator primitive (`@base-ui/react/separator`)?
  > Yes — `BaseSeparator` from `@base-ui/react/separator` (line 1); Base UI ships the doc (`node_modules/@base-ui/react/docs/react/components/separator.md`). token-system-spec section 9 maps Separator to the Divider category.

## 2. Extension props

- [x] Q3: `weight` is `'thin' | 'medium' | 'thick'`, default `'thin'`, set as `data-weight`?
  > Yes — `weight = 'thin'` default (line 14) and `data-weight={weight}` (line 15). token-system-spec section 4: Divider axis is weight (thin/medium/thick).

## 3. Token mapping

- [x] Q4: The line reads `hds/sem/divider/color/border` for color and `hds/sem/divider/measure/{weight}/thickness` for thickness?
  > Yes — `Separator.css` maps `data-weight` to `--_thickness` from the three thickness tokens and colors with `divider/color/border`. token-system-spec section 7 Divider definition.
- [x] Q5: `orientation="vertical"` flips the rule structurally (stretch height, thickness as width) with no extra tokens?
  > Yes — `[data-orientation='vertical']` sets `align-self: stretch; block-size: auto; inline-size: var(--_thickness)`.

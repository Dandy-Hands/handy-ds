# Interview Guide: Meter component (retroactive)

- Status: complete
- Started: 2026-09-23
- Component: Meter (`src/components/Meter.tsx` + `Meter.css`; family = Meter + Progress)
- Note: Retroactive guide. Owner directed the interview be skipped for this run; every answer below is derived from the existing component code and `.claude/decisions.md` (cite which).
- Base UI version documented from: `@base-ui/react` 1.8.0

## 1. Existing surface (confirmations)

- [x] Q1: Keep the existing surface as-is — `Meter` (with the `sentiment` prop on `Root`) plus `Progress` in one family/file, with no other extension props?
  > Yes — `MeterRootProps` adds only `sentiment` (`Meter.tsx` lines 10–12); `Progress` adds none. docs/components.md lists `sentiment` for Meter and "no handy-ds props" for Progress.
- [x] Q2: Compound parts mirror the Base UI namespace so the underlying docs apply part for part?
  > Yes — `...BaseMeter` / `...BaseProgress` spreads (lines 18, 29). decisions.md Wave 5: "Compound components mirror Base UI's namespace."

## 2. Extension props

- [x] Q3: `sentiment` is `'info' | 'success' | 'warning' | 'danger'`, default `'info'`, set as `data-sentiment` on `Meter.Root` only — `Progress` has no sentiment?
  > Yes — `MeterRoot({ sentiment = 'info', ... })` renders `data-sentiment` (lines 13–17). `Progress.Root` is a plain `part()`. docs/components.md: "`sentiment` (on `Meter.Root`)".

## 3. Token mapping

- [x] Q4: The track reads `hds/sem/surface/color/0/striped/bg` and the fill reads `hds/sem/feedback/color/{sentiment}/icon-fg` for Meter?
  > Yes — `Meter.css`: `.hds-meter__track` background `surface/color/0/striped-bg`; per-sentiment `--_fill` from `feedback/color/{sentiment}/icon-fg`. token-system-spec section 9: "Meter: Track: `hds/sem/surface/color/0/striped/bg`. Fill: `hds/sem/feedback/color/{sentiment}/icon-fg`."
- [x] Q5: Progress's fill reads `hds/sem/action/color/primary/default/bg`, and indeterminate (`value={null}`) slides structurally with a `prefers-reduced-motion` fallback?
  > Yes — `.hds-progress { --_fill: action/color/primary/default-bg }`; `[data-indeterminate]` animates the indicator and the reduced-motion block freezes it at full width/50% opacity. token-system-spec section 9: "Progress: Fill: `hds/sem/action/color/primary/default/bg`."
- [x] Q6: `Label` uses Type label tokens and `Value` uses Type caption tokens with tabular numerals; track height (`0.5rem`) and pill radius are structural?
  > Yes — `Meter.css` styles `.hds-meter__label` with `type/label/*` and `.hds-meter__value` with `type/color/caption-fg` + `type/measure/caption-size` + `font-variant-numeric: tabular-nums`; the track's `block-size: 0.5rem` and `999px` radius are literals.

## 4. Behavior

- [x] Q7: Meter means a value in a known range (min/max/format passthrough from Base UI); Progress means a running task, with `value={null}` for unknown duration — no slider in the library?
  > Yes — docs/components.md: "Meter … Use when the number means something on its own … Don't use when it is a task running to completion. Use `Progress`." Progress's `value` accepts `null` (Base UI type; rendered `data-indeterminate` in the demo).

# Progress — Spec Interview Guide (2026-10-12)

First full Phase 1 run (`[new]` in `.claude/component-interview-todo.md`). Wraps
`Progress` from `@base-ui/react/progress`. The dry-run code lives in `Meter.tsx` and
`Meter.css` and has no spec of its own. Meter (`../meter/spec.md`, 2026-10-12) has the
same parts; this interview starts from its decisions.

Base UI version documented from: `@base-ui/react` 1.8.0.

Base UI facts:
- Parts: `Root` (div), `Label` (span), `Track` (div), `Indicator` (div), `Value` (span).
- `Root` props: `value` (required, `number | null`; `null` = indeterminate), `min` (0),
  `max` (100), `format`, `locale`, `aria-valuetext`,
  `getAriaValueText(formattedValue, value: number | null)`.
- `Value` children: `null` or `(formattedValue: string | null, value: number | null) => ReactNode`.
- State: `status` = `indeterminate | progressing | complete`, set on every part as
  `data-indeterminate`, `data-progressing`, `data-complete`.
- `role="progressbar"`.

Dry-run look: fill `color/action/primary/default/bg`, track 8px (`measure/size/200`),
indeterminate bar slides (40% wide, 1.2s); under reduced motion it is full width at 50%
opacity.

## 0. Same as Meter

- [x] Q0: Copy the Meter decisions (minimal surface, parts, `size` 200/300/400, track,
  label, value, gap tokens), and ask only where Progress differs?
  > "Copy Meter (Recommended)". No `className`, `render`, `style`, `ref`, or native props.

## 1. Base UI surface

- [x] Q1: `value` accepts `null` (indeterminate). Everything else as Meter.
  > Covered by Q0. `Value` and `getAriaValueText` take the `null`-aware Base UI signatures.

## 2. Fill color

- [x] Q2: What does the fill read? Progress shows a task, not a status.
  > "Action primary bg (Recommended)". `color/action/primary/default/bg`. No `tone` prop.

## 3. Status states

- [x] Q3: Does `complete` change the look?
  > "No change (Recommended)". The page shows what comes next.
- [x] Q3a: Indeterminate motion and its reduced-motion fallback.
  > "Keep motion, size 300 (Recommended)". 40% bar, 1.2s slide; reduced motion: full
  > width at 50% opacity.

## 4. Size default

- [x] Q4: Default `size`: `300` (as Meter) or `200` (dry run)?
  > "Keep motion, size 300 (Recommended)". Default `'300'`, as Meter.

## 5. Token mapping

- [x] Q5: Confirm the full mapping.
  > Confirmed by Q0 (Meter mapping) and Q2 (fill). Only the fill differs from Meter.

## Open items

- The code: Progress becomes its own minimal family with `size`. The default track
  changes from 8px to 12px. `hds-component-code` does this.
- Progress is not in `docs/api/index.md` yet. This interview adds it.

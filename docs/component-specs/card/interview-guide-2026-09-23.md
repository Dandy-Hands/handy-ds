# Interview Guide: Card component (retroactive)

- Status: complete
- Started: 2026-09-23
- Component: Card (`src/components/Card.tsx` + `Card.css`)
- Note: Retroactive guide. Owner directed the interview be skipped for this run; every answer below is derived from the existing component code and `.claude/decisions.md` (cite which).
- Base UI version documented from: `@base-ui/react` 1.8.0

## 1. Existing surface (confirmations)

- [x] Q1: Keep the existing surface as-is — a single-part `Card` with one extension prop (`elevation`) and nothing else?
  > Yes — `CardProps` declares only `elevation` (`Card.tsx` lines 9–11); the file ships no other prop.
- [x] Q2: No Base UI primitive — Card uses `useRender` + `mergeProps` so it takes the same `render` prop as Base UI parts?
  > Yes — the implementation calls `useRender({ defaultTagName: 'div', render, ... })` (lines 14–19). decisions.md Wave 5: "Card, Alert, Text use `useRender`, so they take the same `render` prop as Base UI parts." Base UI ships no card component (no `@base-ui/react/card` doc).

## 2. Extension props

- [x] Q3: `elevation` is `0 | 1 | 2 | 3` with default `1`, set as `data-elevation`?
  > Yes — `elevation = 1` default (line 13) and `'data-elevation': String(elevation)` (line 17). token-system-spec section 4: Surface axis is elevation (0–3).
- [x] Q4: A `Card` inside a colored section can restore normal colors with `data-context="default"` — no component-level reset is built in?
  > Yes — docs/components.md: "A `Card` is also how you restore normal colors inside a colored section: give it `data-context=\"default\"`." decisions.md on-primary entry marks the always-reset alternative as needs-review and the explicit attribute was chosen.

## 3. Token mapping

- [x] Q5: Card reads Surface tokens: `surface/color/{elevation}/default/{bg,border,shadow}` plus `surface/measure/{padding,radius,border-width}`, and body text color?
  > Yes — `Card.css` sets padding from `surface/measure/padding`; `surface.css` `.hds-surface` maps `data-elevation` to the color triples and reads `type/color/body-fg`.
- [x] Q6: Elevation 0 is a valid choice (flat card on the page ground), not just a popup-only value?
  > Yes — `surface.css` emits `[data-elevation='0']`; `Elevation = 0 | 1 | 2 | 3` includes it.

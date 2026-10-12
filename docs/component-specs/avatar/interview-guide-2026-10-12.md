# Avatar — Spec Interview Guide (2026-10-12)

Full Phase 1 run (`[new]` in `.claude/component-interview-todo.md`). Wraps `Avatar`
from `@base-ui/react/avatar`. No dry-run code exists (Avatar was skipped in Wave 5,
`.claude/decisions.md`).

Base UI version documented from: `@base-ui/react` 1.8.0.

Base UI facts:
- Parts: `Root` (span), `Image` (img), `Fallback` (span).
- `Root`: no own props. State `imageLoadingStatus` = `idle | loading | loaded | error`
  (not set as a data attribute).
- `Image`: native `img` props (`src`, `alt`, `srcSet`, `sizes`, `loading`, ...),
  `onLoadingStatusChange(status)`, `keepMounted` (default false; loads in place, for
  `loading="lazy"` and `next/image`). Renders only when the image loads.
- `Fallback`: `delay` (ms, default 0). Renders when there is no image or it fails.
- Every part: `render`, `className`, `style`, `ref`.

Token spec facts: `radius/round` lists avatars (7.5). No Avatar color tokens.

## 1. Base UI surface

- [x] Q1: Which Base UI members to expose?
  > "Minimal + img (Recommended)". Root: `children`, `size`. Image: `src`, `alt`, `srcSet`,
  > `sizes`, `loading`, `keepMounted`, `onLoadingStatusChange`, `render` (for `next/image`).
  > Fallback: `children`, `delay`. No `className`, `style`, `ref`, as Meter.

## 2. Extension props

- [x] Q2: `size` on Root: allowed steps and default?
  > "800–1600, default 1000". `'800' | '1000' | '1200' | '1600'` (32, 40, 48, 64px).
- [x] Q3: Shape: round only, or a shape axis?
  > "Round only (Recommended)". `radius/round`. No prop.

## 3. Token mapping

- [x] Q4: Fallback colors?
  > "Neutral sunken (Recommended)". bg `surface/sunken/bg`, fg `content/muted/fg`.
- [x] Q5: Fallback text style per size?
  > "Label role steps (Recommended)". 800: `label/size/sm`. 1000: `md`. 1200 and 1600: `lg`.
  > An icon in the Fallback follows the same font size.

## Open items

- Contrast of `content/muted/fg` on `surface/sunken/bg` is not in the checker. Estimate
  in light mode: about 5:1. `hds-component-code` confirms it in both modes.
- Avatar is not in `docs/api/index.md` yet. This interview adds it.

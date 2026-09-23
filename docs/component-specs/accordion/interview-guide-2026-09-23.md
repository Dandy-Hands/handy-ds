# Interview Guide: Accordion component (retroactive)

- Status: complete
- Started: 2026-09-23
- Component: Accordion (`src/components/Accordion.tsx` + `Accordion.css`)
- Note: Retroactive guide. Owner directed the interview be skipped for this run; every answer below is derived from the existing component code and `.claude/decisions.md` (cite which).
- Base UI version documented from: `@base-ui/react` 1.8.0

## 1. Existing surface (confirmations)

- [x] Q1: Keep the existing surface as-is — the `Accordion` namespace (`Root`, `Item`, `Header`, `Trigger`, `Panel`) with no extension props?
  > Yes — every part is a `part()` wrapper only; no wrapper prop exists. docs/components.md: "No handy-ds props."
- [x] Q2: Compound parts mirror the Base UI namespace so the underlying docs apply part for part?
  > Yes — `...BaseAccordion` spread (`Accordion.tsx` line 9). decisions.md Wave 5: "Compound components mirror Base UI's namespace."

## 2. Styling decisions

- [x] Q3: `Trigger` is Action `tertiary`, full-width, with the chevron drawn as a structural CSS chevron that rotates when the panel opens?
  > Yes — `Trigger: part(..., 'hds-action hds-accordion__trigger', { 'data-priority': 'tertiary' })` (line 13); `Accordion.css` draws `::after` from `currentColor` and rotates it under `[data-panel-open]`. docs/components.md: "`Accordion.Trigger` is Action `tertiary`."
- [x] Q4: `Panel` reads Surface elevation 0 — `surface/color/0/default/bg` for the ground and `surface/measure/padding` for space — with no border or shadow?
  > Yes — `Accordion.css` `.hds-accordion__panel` reads exactly those two tokens. The file header comment: "Panel: Surface elevation 0."
- [x] Q5: Item edges are Divider: `divider/color/border` + `divider/measure/thin-thickness` on each item's bottom edge?
  > Yes — `.hds-accordion__item` border-bottom (lines 10–12). File header: "Item edges: Divider." token-system-spec section 9: "Accordion panel" is Surface; the item separators use the Divider category.
- [x] Q6: The trigger's radius is flattened to 0 and the focus ring is inset by the stroke width, because the trigger fills the item edge-to-edge?
  > Yes — `Accordion.css` `.hds-accordion__trigger` sets `border-radius: 0` and `outline-offset: calc(-1 * var(--hds-sem-focus-measure-stroke-width))`.

## 3. Behavior

- [x] Q7: `Accordion` keeps Base UI's full surface (`value`, `defaultValue`, `onValueChange`, `multiple`, `openMultiple`, `disabled`, `hiddenUntilFound`, ...) with keyboard navigation?
  > Yes — everything passes through `part()` unchanged; the docs show the default single-open behavior.

# Interview Guide: Tabs component (retroactive)

- Status: complete
- Started: 2026-09-23
- Component: Tabs (`src/components/Tabs.tsx` + `Tabs.css`)
- Note: Retroactive guide. Owner directed the interview be skipped for this run; every answer below is derived from the existing component code and `.claude/decisions.md` (cite which).
- Base UI version documented from: `@base-ui/react` 1.8.0

## 1. Existing surface (confirmations)

- [x] Q1: Keep the existing surface as-is — the `Tabs` namespace (`Root`, `List`, `Tab`, `Indicator`, `Panel`) with no extension props?
  > Yes — the file spreads `BaseTabs` and wraps the five DOM parts; no wrapper prop exists. docs/components.md: "No handy-ds props."
- [x] Q2: Compound parts mirror the Base UI namespace so the underlying docs apply part for part?
  > Yes — `...BaseTabs` spread (`Tabs.tsx` line 10). decisions.md Wave 5: "Compound components mirror Base UI's namespace."

## 2. Category and tokens

- [x] Q3: `Tab` is Action `tertiary` with the `selected` state on the active tab (Base UI `data-selected`)?
  > Yes — `Tab: part(BaseTabs.Tab, 'hds-action hds-tabs__tab', { 'data-priority': 'tertiary' })` (line 14); `action.css` maps `[data-selected]`. decisions.md Wave 5, gap 5 part table: "Tab triggers: Action tertiary (`selected` state)."
- [x] Q4: The `Indicator` reads `hds/sem/action/color/primary/selected/bg` for the fill and Divider tokens for its thickness?
  > Yes — `Tabs.css` `.hds-tabs__indicator` uses `action/color/primary/selected-bg` and `divider/measure/medium-thickness`. decisions.md Wave 5, gap 5: "The tab indicator uses `action/color/primary/selected/bg`."
- [x] Q5: `Tabs.Panel` has no category — no tokens; it is transparent and inherits type and ground from its context?
  > Yes — `Tabs.css` styles `.hds-tabs__panel` with no token properties. decisions.md Wave 5 gap 5: "no category means no tokens."
- [x] Q6: The list edge (underline or vertical rail) reads Divider tokens — `divider/color/border` + `divider/measure/thin-thickness`?
  > Yes — `Tabs.css` `.hds-tabs__list` border-bottom (horizontal) and border-inline-end (vertical).
- [x] Q7: Tab measure pins to `hds/sem/action/measure/md/*` with the border removed and radius kept on top corners only — structural choices documented in `Tabs.css`?
  > Yes — `.hds-tabs__tab` sets `padding` from md tokens, `border-width: 0`, radius `md` on top corners. Only Button opens the size axis (decisions.md "Button size axis").

## 3. Behavior

- [x] Q8: `Tabs` keeps Base UI's full surface (`value`, `defaultValue`, `onValueChange`, `orientation`, `activationMode`, ...) and keyboard navigation?
  > Yes — everything passes through `part()`; orientation flips the CSS layout under `[data-orientation='vertical']`.

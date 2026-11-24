# Interview Guide: Card (re-interview)

- Status: complete
- Started: 2026-11-23
- Component: Card (`src/components/Card.tsx` + `Card.css`, shared `surface.css`)
- Previous guide: `interview-guide-2026-09-23.md` (retroactive, no interview)
- Base UI version documented from: `@base-ui/react` 1.8.0 (no card primitive; `useRender` + `mergeProps`)
- Inputs: `docs/api-conventions.md`, token spec sections 6.3, 7.3, 7.5, 7.6; proposal `docs/proposals/2026-11-06-marketing-site-parts.md` item 11; `.claude/TODO.md` line 105 (`render` rule); `.claude/decisions.md` (card in a colored section, needs review)

## Gaps found before the interview

- `elevation` takes `0 | 1 | 2 | 3`. `api-conventions.md` section 6 says `base | raised | floating | modal`, and section 4 bans raw numbers.
- Padding is fixed at `measure/space/600`. Section 3 says containers take `padding`-style measure props.
- Proposal item 11 asks for an outlined card and a hover state.
- `decisions.md`: a Card inside a colored section is a dark brand panel. The always-reset alternative is marked "needs review".

## 1. Base UI surface (no primitive)

- [x] Q1: `render` — keep. Accepted with the proposal ("Looks good to me").
- [x] Q2: Native `div` attributes pass through; `style` is removed from the type.

## 2. Extension props

- [x] Q3: `elevation` — `base | raised | floating | modal`, default `raised`. Accepted ("Looks good to me").
- [x] Q4: `padding` — responsive space steps `none`, `200`–`1200`, default `600`. Accepted ("Looks good to me").
- [x] Q5: Outlined card — no new prop; `elevation="base"`. Accepted ("Looks good to me").
- [x] Q6: Hover for a link card — yes, border changes to the new token `color/surface/hover/border`, no prop. User: "Looks good to me." (taken as the recommended "yes").
- [x] Q7: Card in a colored section — keep the darker brand panel; `data-context="default"` resets. User: "I'll take you recommendation for now."

## 3. Token mapping

- [x] Q8: Claude call (token interview scope). Recorded in `spec.md`, Token mapping.

# Interview Guide: Toggle component (retroactive)

- Status: complete
- Started: 2026-09-23
- Component: Toggle (`src/components/Toggle.tsx`, family: Toggle + ToggleGroup)
- Note: Retroactive guide. Owner directed the interview be skipped for this run; every answer below is derived from the existing component code and `.claude/decisions.md` (cite which).
- Base UI version documented from: `@base-ui/react` 1.8.0

## 1. Process decision

- [x] Q1: Toggle code already exists (`src/components/Toggle.tsx`). How should we proceed?
  > Retroactive confirmation: the code is the reviewed answer. This guide reconstructs the decisions the code embodies. (BRIEF `retro-docs-run-2026-09-23/BRIEF.md`; precedent: `docs/component-specs/button/interview-guide-2026-09-21.md` Q1.)

## 2. Base UI surface

Toggle wraps `@base-ui/react/toggle`; ToggleGroup wraps `@base-ui/react/toggle-group`. Native button props pass through `NativeButtonProps` on `Toggle`.

- [x] Q2: Pass through all native button props (`disabled`, `onClick`, `aria-*`, ...) unchanged on `Toggle`?
  > Yes, full passthrough — `part()` passes every prop and `ref` straight through (`src/components/part.ts`, `part()` contract), and `ToggleProps` extends `NativeButtonProps` (`@base-ui/react/toggle/Toggle.d.ts` line 24).

- [x] Q3: `pressed` / `defaultPressed` / `onPressedChange` — expose as-is?
  > Expose as-is. `part(BaseToggle, 'hds-button hds-action')` adds only a class (`src/components/Toggle.tsx` line 11); the pressed state renders as `[data-pressed]`, which `action.css` maps to the Action `selected` state colors (`src/components/action.css` header comment: "`selected [data-pressed] (Toggle)`").

- [x] Q4: `disabled` — expose as-is and style from the Action disabled tokens?
  > Expose as-is. `action.css` styles `[data-disabled]`/`:disabled` from the priority's disabled tokens (`src/components/action.css`, disabled state rules).

- [x] Q5: ToggleGroup `value` / `defaultValue` / `onValueChange` / `multiple` / `orientation` / `loopFocus` — expose as-is?
  > Expose as-is. `ToggleGroup = part(BaseToggleGroup, 'hds-toggle-group')` adds only a class; `Toggle.css` styles `hds-toggle-group` as an inline-flex row with `data-orientation='vertical'` support (`src/components/Toggle.css` lines 2–9). `docs/components.md` "Toggle, ToggleGroup" entry documents exactly these two components with no handy-ds props.

- [x] Q6: `render` on Toggle (compose with another element) — expose?
  > Keep — it comes through the wrapper for free (`part()` passes everything through; `Button` precedent, `.claude/decisions.md` Wave 4/Q13: Button keeps `render`).

## 3. Extension props

- [x] Q7: Add a `priority` prop like Button's?
  > No. Toggle is Action **secondary** by default; change it with `data-priority` on the element. `docs/components.md` "Toggle, ToggleGroup": "No handy-ds props. `Toggle` is Action `secondary`; set `data-priority` to change it." Code: `part(BaseToggle, 'hds-button hds-action')` sets no default priority, and `action.css` maps no `data-priority` to secondary (`src/components/action.css` line 9: "No data-priority = secondary").

- [x] Q8: Open the Action `size` axis (sm/md/lg) to Toggle?
  > No. Toggle pins to `md` (`action.css` hard-reads `--hds-sem-action-measure-md-*` for non-Button parts). `.claude/decisions.md` "Button size axis": "Only Button exposes it. Every other Action part (Tabs, Toggle, menu items, ...) pins to `md` in its CSS. Opening the axis up to them is a per-component decision, not automatic."

- [x] Q9: Any other extension props (`loading`, `icon`, `fullWidth` — Button's additions)?
  > None. A two-state button has no async phase, so `loading` is meaningless; icons are children. `docs/components.md` states "No handy-ds props" and the code adds none.

## 4. Token mapping

- [x] Q10: Confirm Toggle reads only `hds/sem/action/*` plus the focus ring, and ToggleGroup gap uses the Action measure?
  > Confirmed. `action.css` reads `hds/sem/action/color/{priority}/{state}/{property}` and `hds-sem-action-measure-md-*`; `Toggle.css` gap = `var(--hds-sem-action-measure-md-gap)` (`src/components/Toggle.css` line 4); the ring comes from `base.css` (`hds/sem/focus/*`). The `components.test.ts` invariant check enforces no `--hds-prim-` and only defined `--hds-sem-*` names (`.claude/decisions.md` Wave 4 "Invariant check = a test").

- [x] Q11: Is the pressed look the Action `selected` state (documented as such)?
  > Yes. `action.css` header: "`selected [data-pressed] (Toggle)`" — the pressed toggle uses `hds/sem/action/color/{priority}/selected/*`.

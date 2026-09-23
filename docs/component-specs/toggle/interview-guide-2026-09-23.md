# Interview Guide: Toggle component (retroactive)

- Status: complete
- Started: 2026-09-23
- Component: Toggle (`src/components/Toggle.tsx` + `Toggle.css`)
- Note: Retroactive guide. Owner directed the interview be skipped for this run; every answer below is derived from the existing component code and `.claude/decisions.md` (cite which).
- Base UI version documented from: `@base-ui/react` 1.8.0

## 1. Existing surface (confirmations)

- [x] Q1: Keep the existing surface as-is — `Toggle` as a single `part()` and `ToggleGroup` as the row container, with no extension props?
  > Yes — `Toggle = part(BaseToggle, 'hds-button hds-action')`, `ToggleGroup = part(BaseToggleGroup, 'hds-toggle-group')` (`Toggle.tsx` lines 9–11). docs/components.md: "No handy-ds props."
- [x] Q2: `Toggle` is Action `secondary` by default, changeable with `data-priority` (not a prop)?
  > Yes — the shared `action.css` defaults `.hds-action` to secondary colors; the class list makes Toggle a full button-look toggle. docs/components.md: "Toggle is Action `secondary`; set `data-priority` to change it."

## 2. Category and tokens

- [x] Q3: The pressed state uses the Action `selected` state via Base UI's `data-pressed`?
  > Yes — `action.css` maps `[data-pressed]` to `--_selected-*` tokens. decisions.md Wave 5: Action `selected` covers Toggle (`data-pressed`).
- [x] Q4: `ToggleGroup` spacing reads `hds/sem/action/measure/md/gap`, with Base UI's `orientation` handled structurally?
  > Yes — `Toggle.css` sets the gap from `action/measure/md/gap` and flips to a column under `[data-orientation='vertical']`.
- [x] Q5: Toggle reuses the Button look (`hds-button hds-action`) and Button.css's footprint, so it lines up next to Buttons in a row?
  > Yes — the `part()` classes and `Toggle.tsx` imports (`action.css`, `Button.css`). This mirrors the shared-category design in decisions.md Wave 4 ("Menu items, tabs, toggles and select options all reuse the Action look").

## 3. Behavior

- [x] Q6: `Toggle` keeps Base UI's full surface (`pressed`, `defaultPressed`, `onPressedChange`, `value`, `group` association) and `ToggleGroup` keeps single/multiple selection?
  > Yes — everything passes through `part()` unchanged; docs/components.md shows `ToggleGroup defaultValue={['b']}` with `Toggle value="b"`.

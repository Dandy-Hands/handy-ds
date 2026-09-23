# Interview Guide: Menu component (retroactive)

- Status: complete
- Started: 2026-09-23
- Component: Menu + ContextMenu + Menubar (`src/components/Menu.tsx` + `Menu.css`)
- Note: Retroactive guide. Owner directed the interview be skipped for this run; every answer below is derived from the existing component code and `.claude/decisions.md` (cite which).
- Base UI version documented from: `@base-ui/react` 1.8.0

## 1. Existing surface (confirmations)
Goal: confirm what the current component already decides, so the spec describes reality.

- [x] Q1: The family file exports three variants — `Menu` (trigger menu), `ContextMenu` (right-click), `Menubar` (app-style row) — one family per source file. Confirm?
  > Yes — `Menu.tsx:19` (Menu), `:39` (ContextMenu), `:56` (Menubar). docs/components.md groups them under one entry: "Menu, Menubar, ContextMenu".
- [x] Q2: Compound shape spreads every Base UI part unchanged and restyles only the DOM-rendering parts via `part()`. Confirm?
  > Yes — `{ ...BaseMenu, Trigger: part(...), Popup: part(...), ... }` (`Menu.tsx:19-37`); `.claude/decisions.md` Wave 5: "Compound components mirror Base UI's namespace … The Base UI docs apply part for part, nothing is missing."

## 2. Parts and their looks
Goal: record each part's category assignment.

- [x] Q3: `Menu.Trigger` is a Button (`hds-button hds-action`) with no `data-priority` default, and "no data-priority = secondary" — so triggers look like secondary Buttons. Confirm?
  > Yes — `Menu.tsx:20` sets no priority default; `action.css:9` states "No data-priority = secondary." The code comment (`Menu.tsx:14`) says "Trigger looks like a secondary Button; pass `data-priority` to change it", and docs/components.md §Menu agrees.
- [x] Q4: All item-like parts (`Item`, `LinkItem`, `SubmenuTrigger`, `CheckboxItem`, `RadioItem`) are Action `tertiary` via a shared defaults object. Confirm?
  > Yes — `const tertiary = { 'data-priority': 'tertiary' }` (`Menu.tsx:12`) applied at `Menu.tsx:23-28`; matches spec section 9 "Menu … Items: Action" with decisions.md Wave 5 mapping items to Action tertiary.
- [x] Q5: The popup is Surface elevation 2, shared list layout (`hds-surface hds-popup hds-list`); `GroupLabel` is Type caption; `Separator` is the Divider look; `Backdrop` is the Overlay scrim. Confirm?
  > Yes — `Menu.tsx:22` (`popup = { 'data-elevation': '2' }`), `:21` classes; `GroupLabel` → `hds-list__label` (`Menu.tsx:33`) styled from Type caption tokens (`surface.css:87-93`); `Separator` → `hds-separator` (`Menu.tsx:34`); `Backdrop` → `hds-backdrop` (`Menu.tsx:35`, `surface.css:100-108`).
- [x] Q6: `CheckboxItemIndicator` renders a check icon, `RadioItemIndicator` a dot — both pushed to the item's trailing edge. Confirm?
  > Yes — `Menu.tsx:26,29` (indicator defaults); `surface.css:80-83` (`hds-item__indicator`, `margin-inline-start: auto`); `Menu.css:11-18` (dot styles).
- [x] Q7: `ContextMenu.Trigger` is an area, not a button — it ships with no trigger part styling. Confirm?
  > Yes — `ContextMenu` (`Menu.tsx:39-55`) restyles Positioner/Popup/items only; the comment at `Menu.tsx:38` says "Menu opened by right-click / long-press on Trigger (an area, not a button)."
- [x] Q8: `Menubar` is a single `part()` wrapper with no handy-ds props; children are `Menu.Root`s whose triggers must set `data-priority="tertiary"`. Confirm?
  > Yes — `Menu.tsx:56` (`part(BaseMenubar, 'hds-menubar')`); `Menu.css:3-5` (flex row with `action/measure/md/gap`); comment at `Menu.tsx:15` instructs `data-priority="tertiary"` inside a Menubar.

## 3. Decisions recorded elsewhere
Goal: tie the code back to the decisions log.

- [x] Q9: The old "triggers look like secondary Buttons" decision was reversed for Dialog/Popover/Menu — how does that square with Menu.Trigger being a secondary Button?
  > The reversal (decisions.md Wave 5, "Triggers carry no styling") applies to parts that render no DOM look of their own; Menu.Trigger is explicitly styled as a Button by the code (`Menu.tsx:20`), and the spec section 9 table still maps menus to "Items: Action. Popup/panel: Surface." Code wins: the trigger is styled.

## 4. Token mapping
Goal: confirm the part → token table.

- [x] Q10: Mapping — popup Surface elevation-2 tokens; items Action tertiary state tokens; popup padding/gap `action/measure/md/gap`; item padding/radius `action/measure/md/*`; group label Type caption; backdrop `overlay/color/bg`; menubar gap `action/measure/md/gap`. Confirm?
  > Yes — `surface.css:56-60` (list padding from `action/measure/md/gap`), `:69-78` (item padding/radius/gap), `:87-93` (label caption tokens), `:100-108` (backdrop), `Menu.css:4` (menubar gap). Matches token-system-spec.md section 9.

## 5. Outward API doc
Goal: confirm what the client-facing page says.

- [x] Q11: The API doc documents the three exports, the trigger's secondary-Button look with the `data-priority` escape hatch, the item kinds (item, link, checkbox, radio, submenu), and the required `Portal > Positioner > Popup` assembly — with no implementation references. Correct?
  > Yes — follows `research/api-doc-conventions.md`; the assembly requirement is public usage (the docs/components.md §Menu snippet shows it), not an implementation detail.

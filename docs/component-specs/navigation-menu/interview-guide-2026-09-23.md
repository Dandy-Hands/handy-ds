# Interview Guide: NavigationMenu component (retroactive)

- Status: complete
- Started: 2026-09-23
- Component: NavigationMenu (`src/components/NavigationMenu.tsx` + `NavigationMenu.css`)
- Note: Retroactive guide. Owner directed the interview be skipped for this run; every answer below is derived from the existing component code and `.claude/decisions.md` (cite which).
- Base UI version documented from: `@base-ui/react` 1.8.0

## 1. Existing surface (confirmations)
Goal: confirm what the current component already decides, so the spec describes reality.

- [x] Q1: Compound shape spreads every Base UI part unchanged and restyles only the DOM-rendering parts via `part()`. Confirm?
  > Yes — `{ ...BaseNavigationMenu, Root: part(...), List: part(...), ... }` (`NavigationMenu.tsx:12-25`); `.claude/decisions.md` Wave 5: "Compound components mirror Base UI's namespace."

## 2. Parts and their looks
Goal: record each part's category assignment.

- [x] Q2: Triggers and links are Action `tertiary` — both get the shared `tertiary` defaults object, and links render as Buttons (`hds-button hds-action hds-nav__link`). Confirm?
  > Yes — `const tertiary = { 'data-priority': 'tertiary' }` (`NavigationMenu.tsx:9`) applied to Trigger (`:16`) and Link (`:20`). Matches decisions.md Wave 5: "Navigation Menu: trigger and link are Action tertiary, the current link is `selected` (Base UI `active`)."
- [x] Q3: The current page link is marked by Base UI's `active` prop, which maps to `data-selected` and the Action `selected` state. Confirm?
  > Yes — the Link part keeps Base UI's active handling (no override in `NavigationMenu.tsx:20`); `action.css:108-110` maps `[data-selected]`/`[data-active]` to the selected state tokens. decisions.md Wave 5: "the current link is `selected` (Base UI `active`)."
- [x] Q4: The popup is Surface elevation 2 with the shared viewport mechanism (`Popup > Viewport`), and content has no color tokens of its own. Confirm?
  > Yes — `NavigationMenu.tsx:23` (`data-elevation: '2'`), `:24` (Viewport part). decisions.md Wave 5: "the popup is Surface elevation 2, and content has no color tokens."
- [x] Q5: `Icon` is a built-in chevron that rotates 180° when the popup is open. Confirm?
  > Yes — `NavigationMenu.tsx:17` (`children: <ChevronDownIcon />`); `NavigationMenu.css:15-21` (`[data-popup-open]` → `rotate(180deg)`).
- [x] Q6: `Backdrop` is the shared Overlay scrim. Confirm?
  > Yes — `NavigationMenu.tsx:25` (`part(BaseNavigationMenu.Backdrop, 'hds-backdrop')`; `surface.css:100-108`).

## 3. Structure
Goal: record the required assembly and the sizing-variable mechanism.

- [x] Q7: The popup animates width/height between pages through Base UI's CSS sizing variables (`--positioner-width`, `--popup-width`, ...); the positioner and popup read them. Confirm?
  > Yes — `NavigationMenu.css:1` ("Structure follows Base UI's NavigationMenu sizing variables"), `:26-29` (positioner sizes), `:33-36` (popup sizes), `:37-38` (width/height transitions).
- [x] Q8: Required assembly is `Root > List (Triggers) > Portal > Positioner > Popup > Viewport`, with content pages rendered via `Content`. Confirm?
  > Yes — `demo/main.tsx:225-234` shows the exact assembly (`NavigationMenu.Portal > Positioner sideOffset={8} > Popup > Viewport`); all parts exist in the namespace (`NavigationMenu.tsx:12-25`).

## 4. Token mapping
Goal: confirm the part → token table.

- [x] Q9: Mapping — trigger/link Action tertiary tokens incl. `selected`; popup Surface elevation-2; list gap `action/measure/md/gap`; focus ring from the shared Focus tokens. Confirm against spec section 9?
  > Yes — `NavigationMenu.css:6-11` (list gap), `action.css:68-86` (tertiary states) and `:108-110` (selected); popup via `hds-surface hds-popup` classes. Matches decisions.md Wave 5 and token-system-spec.md section 9 ("Navigation Menu | Trigger, Link: Action tertiary … Popup: Surface elevation 2").

## 5. Outward API doc
Goal: confirm what the client-facing page says.

- [x] Q10: The API doc documents the no-props surface, the tertiary look, the `active` (current page) mechanism, and the required `Portal > Positioner > Popup > Viewport` assembly — no implementation references. Correct?
  > Yes — follows `research/api-doc-conventions.md`; the assembly is public usage shown in the working demo, not an implementation detail.

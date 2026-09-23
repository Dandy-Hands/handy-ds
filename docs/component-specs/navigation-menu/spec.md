# Internal Spec: NavigationMenu

- Status: docs-built
- Date: 2026-09-23
- Interview: `interview-guide-2026-09-23.md`
- Base UI version documented from: `@base-ui/react` 1.8.0
- Code status: component exists (`src/components/NavigationMenu.tsx` + `NavigationMenu.css`)

## Description

NavigationMenu is site navigation with dropdown panels: a horizontal list of triggers, each opening a popup of destination links that can share one animated viewport. Triggers and links are Action tertiary buttons; the current page's link renders in the selected state; popups are Surface elevation 2. Use it for the top-level navigation of a site; use Menu for commands.

## Usage

- Do use NavigationMenu for the top-level navigation of a site: triggers with dropdown panels of destination links.
- Do mark the current page with the link's `active` prop.
- Don't use it for commands — use Menu.
- Don't build app-style menu rows with it — use Menubar.

## Base UI API

Compound namespace that spreads every Base UI part unchanged and restyles only the DOM-rendering parts via `part()` (`NavigationMenu.tsx:12-25`): `Root`, `List`, `Trigger`, `Icon`, `Content`, `Link`, `Positioner`, `Popup`, `Viewport`, `Backdrop`. All other parts (Portal, ...) pass through, and Base UI's part docs apply one for one. handy-ds adds no props.

Required assembly: `Root > List (Triggers) > Portal > Positioner > Popup > Viewport`, with `Content` pages inside the viewport (see `demo/main.tsx:225-234`).

## Extension API

No handy-ds props. Documented behaviors beyond the raw parts:

| Part | Decision |
| --- | --- |
| `Trigger`, `Link` | Action tertiary via shared defaults (`NavigationMenu.tsx:9,16,20`); both render as Buttons. |
| `Link` (current page) | Base UI's `active` prop maps to `data-selected` and the Action `selected` state (decisions.md Wave 5). |
| `Icon` | Built-in chevron, rotates 180° when open (`NavigationMenu.tsx:17`, `NavigationMenu.css:15-21`). |
| `Popup` | Surface elevation 2, shared viewport mechanism (`NavigationMenu.tsx:23-24`). Content has no color tokens. |
| `Backdrop` | Overlay scrim (`NavigationMenu.tsx:25`). |

Explicitly rejected: a `variant` prop, a built-in logo/home slot, and any color token for `Content` (decisions.md Wave 5: "content has no color tokens").

## Token mapping

| Part | Tokens |
| --- | --- |
| Trigger / link colors | `hds/sem/action/color/tertiary/*` (default/hover/active/focus/disabled/selected) |
| List gap | `hds/sem/action/measure/md/gap` |
| Popup background / border / shadow | `hds/sem/surface/color/2/*` (elevation 2) |
| Focus ring | `hds/sem/focus/color/stroke`, `hds/sem/focus/measure/stroke-width` |
| Backdrop | `hds/sem/overlay/color/bg` |

Notes:

- Popup sizing and the width/height transition between pages follow the wrapped primitive's CSS sizing variables (`--positioner-width`, `--popup-width`, ...) — structural, not tokenized (`NavigationMenu.css:1,26-38`).
- Chevron rotation and popup open/close transitions are structural; they stop under `prefers-reduced-motion`.
- Content pages carry no color tokens — they inherit type and ground from their context.

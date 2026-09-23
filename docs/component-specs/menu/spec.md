# Internal Spec: Menu

- Status: docs-built
- Date: 2026-09-23
- Interview: `interview-guide-2026-09-23.md`
- Base UI version documented from: `@base-ui/react` 1.8.0
- Code status: components exist (`src/components/Menu.tsx` + `Menu.css`)

## Description

Menu shows a list of commands behind a trigger: actions, links, checkbox and radio choices, submenus, and separators. The family ships three shapes from one source file — `Menu` (trigger menu), `ContextMenu` (opens on right-click / long-press), and `Menubar` (an app-style row of menus). Items are Action tertiary buttons in a Surface popup; nothing is visible until asked for.

## Usage

- Do use Menu for commands that act, hidden until requested: row actions, editor commands, app menus.
- Do use ContextMenu for commands on the object the pointer is on, and Menubar for a persistent app-style menu row.
- Don't use Menu when the user is choosing a value for a form — use Select.
- Don't use Menu for site navigation — use NavigationMenu, whose links go to destinations.

## Base UI API

Compound namespaces that spread every Base UI part unchanged and restyle only the DOM-rendering parts via `part()` (`Menu.tsx:19-37,39-55`): `Trigger`, `Positioner`, `Popup`, `Item`, `LinkItem`, `SubmenuTrigger`, `CheckboxItem` (+`CheckboxItemIndicator`), `RadioItem` (+`RadioItemIndicator`), `GroupLabel`, `Separator`, `Backdrop`. All other parts (Portal, Group, ...) pass through unchanged, and Base UI's part docs apply one for one. `Menubar` is a single-part wrapper (`Menu.tsx:56`). handy-ds adds no props; the only handy-ds-ism is the `data-priority` attribute on styled parts.

## Extension API

No handy-ds props. Documented behaviors beyond the raw parts:

| Part | Decision |
| --- | --- |
| `Menu.Trigger` | Renders as a secondary Button (`hds-button hds-action`, no priority default — `action.css:9` "No data-priority = secondary"). Pass `data-priority="tertiary"` inside a Menubar (`Menu.tsx:14-15`). |
| Items (`Item`, `LinkItem`, `SubmenuTrigger`, `CheckboxItem`, `RadioItem`) | Action tertiary via shared defaults (`Menu.tsx:12,23-28`). |
| `CheckboxItemIndicator` / `RadioItemIndicator` | Built-in check / dot glyph, trailing edge (`Menu.tsx:26,29`). |
| `Popup` | Surface elevation 2, shared list layout (`Menu.tsx:21-22`). |
| `GroupLabel` | Type caption look (`Menu.tsx:33`). |
| `Separator` | Divider look (`Menu.tsx:34`). |
| `Backdrop` | Overlay scrim (`Menu.tsx:35`). |

Explicitly rejected: a `variant`/`priority` prop on the namespace (priority is set per part via `data-priority`, matching the compound-component rule), and a built-in trigger label or icon.

## Token mapping

| Part | Tokens |
| --- | --- |
| Popup background / border / shadow | `hds/sem/surface/color/2/*` (elevation 2) |
| Popup padding, item gap | `hds/sem/action/measure/md/gap` |
| Item colors | `hds/sem/action/color/tertiary/*` (default/hover/active/focus/disabled) |
| Item padding, radius | `hds/sem/action/measure/md/padding-y`, `.../padding-x`, `.../radius` |
| Trigger | `hds/sem/action/color/secondary/*` (or `tertiary/*` when `data-priority="tertiary"`) |
| Group label | `hds/sem/type/color/caption-fg`, `hds/sem/type/other/caption/*`, `hds/sem/type/measure/caption/size` |
| Backdrop | `hds/sem/overlay/color/bg` |
| Menubar gap | `hds/sem/action/measure/md/gap` |

Notes:

- Submenu arrow (`Menu.css:7-14`) and radio dot (`Menu.css:11-18`) are structural literals drawn with `currentColor`, so they follow the item's state color.
- Focus ring inset on items comes from the shared Focus tokens via `base.css` (`surface.css:79`).
- The popup's open/close transition (opacity + scale, `surface.css:44-50`) is structural; it stops under `prefers-reduced-motion`.

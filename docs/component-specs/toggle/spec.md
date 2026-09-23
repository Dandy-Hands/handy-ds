# Internal Spec: Toggle

- Status: docs-built
- Date: 2026-09-23
- Interview: `interview-guide-2026-09-23.md`
- Base UI version documented from: `@base-ui/react` 1.8.0
- Code status: component exists (`src/components/Toggle.tsx`, `src/components/Toggle.css`)

## Description

Toggle is a two-state button: it stays pressed until pressed again. ToggleGroup is a row of Toggles that manages single- or multiple-selection as a group. Both are Action-category parts — a pressed toggle uses the Action `selected` state, exactly like a checkbox-style pressed look on a button. Use Toggles for formatting controls and visible option pickers; use Switch for instant on/off settings and Select for long option lists.

## Usage

- Do use Toggle/ToggleGroup for formatting controls (bold, italic), filters, and picking one or several from a few options that are all visible.
- Don't use it when the change applies immediately to a preference — use `Switch`.
- Don't use it for more than about five options — use `Select`.
- Don't add a `priority` prop — the look is Action `secondary`; change it per instance with `data-priority`.

## Base UI API

Family of two wrappers, one file (`src/components/Toggle.tsx`):

- `Toggle = part(BaseToggle, 'hds-button hds-action')` — wraps `@base-ui/react/toggle`. Renders a `<button>`. All native button props, `render`, `ref`, and callback-form `className` pass through. Pressed state: `pressed`, `defaultPressed`, `onPressedChange(pressed, eventDetails)`; renders `data-pressed`.
- `ToggleGroup = part(BaseToggleGroup, 'hds-toggle-group')` — wraps `@base-ui/react/toggle-group`. Renders a `<div>` roving-tour container: `value`, `defaultValue`, `onValueChange(groupValue, eventDetails)`, `multiple`, `orientation`, `loopFocus`, `disabled`. Group children are `Toggle` parts carrying a `value`.

Nothing is renamed or omitted; the Base UI docs apply part for part.

## Extension API

| Prop | Type | Default | Decision |
| --- | --- | --- | --- |
| — | — | — | No handy-ds props. Both parts pass Base UI's surface through unchanged. |

Explicitly rejected:

- `priority` prop (Button has one): Toggle defaults to Action `secondary`; authors set `data-priority` per instance when a different weight is needed (`docs/components.md` Toggle entry; `action.css` "No data-priority = secondary").
- `size` axis: pinned to `md` like every non-Button Action part (`.claude/decisions.md` "Button size axis": "Only Button exposes it").
- `loading`: no async phase on a two-state button.

## Token mapping

| Part | Tokens |
| --- | --- |
| Toggle look (all states) | `hds/sem/action/color/{priority}/{default,hover,active,focus,disabled,selected}/{bg,fg,border}` — priority defaults to `secondary` (no `data-priority`), override per instance |
| Toggle measures | `hds/sem/action/measure/md/*` (padding, radius, border-width) — size pinned to `md` |
| Toggle label type | `hds/sem/type/measure/label/*`, `hds/sem/type/other/label/*` |
| ToggleGroup gap | `hds/sem/action/measure/md/gap` (`src/components/Toggle.css` line 4) |
| Focus ring | `hds/sem/focus/color/stroke`, `hds/sem/focus/measure/stroke-width` (from `base.css`) |

Notes:

- The pressed state is the Action `selected` state: `action.css` maps `[data-pressed]` to the selected colors (`action.css` header table).
- Group orientation is structural (flex-direction), not tokenized.

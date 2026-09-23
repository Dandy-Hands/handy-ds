# Internal Spec: Toggle

- Status: docs-built
- Date: 2026-09-23
- Interview: `interview-guide-2026-09-23.md` (retroactive)
- Base UI version documented from: `@base-ui/react` 1.8.0 (`@base-ui/react/toggle`, `@base-ui/react/toggle-group`)
- Code: `src/components/Toggle.tsx` + `Toggle.css` (+ shared `action.css`, `Button.css`)

## Description

Toggle is a button that stays pressed — bold/italic formatting, view switches, any few-option choice where every option stays visible. `ToggleGroup` is a row of them with shared spacing and single or multiple selection. Toggle wears the full Button look (Action `secondary` by default); the pressed state is the Action `selected` state.

## Usage

- Do use Toggle/ToggleGroup for formatting controls or picking one or several from a few visible options.
- Don't use it for a setting that applies immediately — use `Switch`.
- Don't use it for more than about five options — use `Select`.
- Change the look with `data-priority`, not `className`.

## Base UI API

Wrapped components: `Toggle` from `@base-ui/react/toggle`, `ToggleGroup` from `@base-ui/react/toggle-group`. Surface decisions:

| Base UI surface | Decision |
| --- | --- |
| `Toggle` props (`pressed`, `defaultPressed`, `onPressedChange`, `value`, `disabled`, `nativeButton`, ...) | Exposed — full passthrough via `part()`. |
| `ToggleGroup` props (`value`, `defaultValue`, `onValueChange`, `multiple`, `orientation`, ...) | Exposed — full passthrough via `part()`. |
| `Toggle` look | `hds-button hds-action` — the complete Button footprint; `data-priority` overrides the default secondary look. |
| `data-pressed` state attribute | Consumed by `action.css` as the Action `selected` state. |
| `render` on both | Exposed — passthrough via `part()`. |
| Callback-form `className` / `style` | Available via passthrough, not documented. |

## Extension API

| Prop | Type | Default | Decision |
| --- | --- | --- | --- |
| — | — | — | No extension props. Priority is `data-priority` (not a prop) because Toggle is a free-standing control the author may want to restyle per use. |

## Token mapping

| Part | Tokens |
| --- | --- |
| Toggle look and states | `hds/sem/action/color/secondary/{default,hover,active,focus,selected,disabled}/{bg,border,fg}` (via `action.css`; other priorities available through `data-priority`) |
| Toggle measure | `hds/sem/action/measure/md/{padding-x,padding-y,radius,gap,border-width}` — Toggle pins to `md` (only Button opens the size axis) |
| Label type | `hds/sem/type/measure/label/*`, `hds/sem/type/other/label/*` |
| Group gap | `hds/sem/action/measure/md/gap` |
| Focus ring | `hds/sem/focus/color/stroke`, `hds/sem/focus/measure/stroke-width` (from `base.css`) |

Notes:

- No primitive or driver references; no new tokens.
- The group's vertical orientation is structural (flex direction flip), no token.

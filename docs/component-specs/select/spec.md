# Internal Spec: Select

- Status: docs-built
- Date: 2026-09-23
- Interview: `interview-guide-2026-09-23.md` (retroactive — answers derived from code)
- Base UI version documented from: `@base-ui/react` 1.8.0
- Code status: component exists (`src/components/Select.tsx` + `Select.css`)

## Description

Select picks one value from a known list that is too long for radio buttons and does not need typed filtering. The trigger is a standard input-height control showing the current value; opening it presents an elevated popup list of options. Select owns no props of its own — it is Base UI's Select with every visual part pre-wired to the design system's category looks.

## Usage

- Do use Select when the option list is fixed, longer than about five, and does not need filtering.
- Don't use it when the user must type to narrow the list — use Combobox; don't use it for short lists — use Radio; don't use it when any text is valid — use Autocomplete.
- Don't add a separate label component — `Select.Label` carries the field-label look.

## Base UI API

Wraps `@base-ui/react/select` 1.8.0 as a compound component that spreads every Base UI part unchanged and restyles the DOM-rendering parts via `part()` (`part.ts`), so all Base UI props (`items`, `value`/`defaultValue`, `onValueChange`, `multiple`, `name`, `disabled`, `required`, `render`, ...) keep their documented semantics and types such as `Select.Root.Props` stay importable from `@base-ui/react/select`.

Styled parts:

| Part | Look |
| --- | --- |
| `Trigger` | Input/Field control (`hds-control hds-select__trigger`), `data-size="md"` default; own CSS adds `justify-content: space-between` + pointer cursor |
| `Icon` | Chevron-down glyph by default (`hds-select__icon`) |
| `Positioner` / `Popup` / `List` | Shared popup positioner; Popup is `hds-surface hds-popup hds-list` at `data-elevation="2"` |
| `Item` | Action list item (`hds-action hds-item`) pinned `data-priority="tertiary"` |
| `ItemIndicator` | Built-in check glyph (`hds-item__indicator`) |
| `Label` / `GroupLabel` | Field-label / list-label looks (`hds-field__label`, `hds-list__label`) |
| `Separator` | Shared divider look (`hds-separator`) |
| `Backdrop` | Shared overlay scrim (`hds-backdrop`) |

Passthrough-only parts (`Root`, `Value`, `ItemText`, `Group`, `Portal`, `ScrollUpArrow`, `ScrollDownArrow`) render no styled DOM; every prop passes through the spread, `ref` included.

## Extension API

None. Select adds no props. Visual overrides happen by passing props to parts — e.g. `data-size="lg"` on `Trigger` — because `part()` applies defaults the caller can override.

## Token mapping

Borrows per part, per token spec section 9 ("Select: Trigger: Input. Popup: Surface. Options: Action"):

| Part | Tokens |
| --- | --- |
| Trigger | `hds/sem/input/color/{default,hover,focus,error,disabled}/{bg,fg,border,placeholder-fg}`, `hds/sem/input/measure/{sm,md,lg}/{padding-x,padding-y,height,radius,border-width}` |
| Popup (Surface elevation 2) | `hds/sem/surface/color/2/{default,striped}/{bg,border,shadow}`, `hds/sem/surface/measure/*` |
| Items (Action tertiary) | `hds/sem/action/color/tertiary/{default,hover,active,focus,selected,disabled}/{bg,fg,border}` — `hover` covers `[data-highlighted]`, `selected` covers `[data-selected]`; item measure reads `hds/sem/action/measure/md/*` |
| Group label / list label | `hds/sem/type/color/label/fg`, `hds/sem/type/measure/label/*` |
| Separator | `hds/sem/divider/color/border`, `hds/sem/divider/measure/{weight}/thickness` |
| Backdrop | `hds/sem/overlay/color/bg` |
| Focus ring | `hds/sem/focus/color/stroke`, `hds/sem/focus/measure/stroke-width` (from `base.css`) |

Notes:

- Trigger states come from Base UI's own data attributes (`data-popup-open` styles like focus, `data-invalid`/`aria-invalid` like error, `data-disabled` like disabled) — no component-specific state classes.
- Items pin Action size `md` (only Button opens the Action size axis — `.claude/decisions.md` "Button size axis").
- Code and spec agree; no conflicts to flag.

# Internal Spec: Combobox

- Status: docs-built
- Date: 2026-09-23
- Interview: `interview-guide-2026-09-23.md` (retroactive — answers derived from code)
- Base UI version documented from: `@base-ui/react` 1.8.0
- Code status: component exists (`src/components/Combobox.tsx` + `Combobox.css`)

## Description

Combobox is a long list the user filters by typing. It renders an input group (text input, chevron trigger, clear button) that opens an elevated popup list of options; with `multiple`, selections appear as removable chips inside the input. The same source file exports `Autocomplete`, a free-text variant with identical parts and token sources, documented within this family.

## Usage

- Do use Combobox when the option list is long, or when several values are picked at once (chips).
- Don't use it when the user may enter a value that is not in the list — use Autocomplete (free text with suggestions); don't use it for short fixed lists — use Radio.
- Don't add a separate label component — `Combobox.Label` carries the field-label look.

## Base UI API

Wraps `@base-ui/react/combobox` 1.8.0 as a compound component that spreads every Base UI part unchanged and restyles the DOM-rendering parts via `part()`, so all Base UI props (`items`, `value`/`defaultValue`, `onValueChange`, `multiple`, `name`, `disabled`, `required`, filtering props, `render`, ...) keep their documented semantics. Types such as `Combobox.Root.Props` stay importable from `@base-ui/react/combobox`.

Styled parts:

| Part | Look |
| --- | --- |
| `InputGroup` | Input/Field control (`hds-control`), `data-size="md"` default |
| `Input` | Inner text input (`hds-control__input`) |
| `Trigger` | Inner chevron button (`hds-control__button`), built-in `ChevronDownIcon` |
| `Clear` | Inner clear button (`hds-control__button`), built-in `XIcon`, `aria-label="Clear"` |
| `Chips` / `Chip` / `ChipRemove` | Flex-wrap chip row; Chip is an Action item (`hds-action hds-combobox__chip`, no priority → secondary); ChipRemove is an inner X button |
| `Positioner` / `Popup` / `List` | Shared popup positioner; Popup is `hds-surface hds-popup hds-list` at `data-elevation="2"` |
| `Item` / `ItemIndicator` | Action tertiary list item with built-in `CheckIcon` indicator |
| `Label` / `GroupLabel` | Field-label / list-label looks |
| `Separator` | Shared divider look |
| `Empty` / `Status` | Shared status row (`hds-combobox__status`), Type caption styling when non-empty |
| `Backdrop` | Shared overlay scrim |

`Autocomplete` (same file) has the same parts except `Chips`, `Chip`, `ChipRemove`, and `ItemIndicator` — single value, free text allowed.

Passthrough-only parts (`Root`, `Portal`, `ItemText`, `Group`, scroll arrows) render no styled DOM; every prop passes through the spread, `ref` included.

## Extension API

None. Combobox adds no props. Visual overrides happen by passing props to parts — e.g. `data-size="lg"` on `InputGroup`.

## Token mapping

Borrows per part, per token spec section 9 ("Combobox: Input group: Input/Field. Options: Action tertiary (`hover` = highlighted, `selected` = chosen). Chips: Action secondary. Empty/status text: Type caption"):

| Part | Tokens |
| --- | --- |
| Input group | `hds/sem/input/color/{default,hover,focus,error,disabled}/{bg,fg,border,placeholder-fg}`, `hds/sem/input/measure/{sm,md,lg}/{padding-x,padding-y,height,radius,border-width}` — `data-popup-open` styles like focus |
| Popup (Surface elevation 2) | `hds/sem/surface/color/2/{default,striped}/{bg,border,shadow}`, `hds/sem/surface/measure/*` |
| Items (Action tertiary) | `hds/sem/action/color/tertiary/{default,hover,active,focus,selected,disabled}/{bg,fg,border}`; item measure reads `hds/sem/action/measure/md/*` |
| Chips (Action secondary) | `hds/sem/action/color/secondary/*` via the no-priority Action default; chip radius reads `hds/sem/action/measure/md/radius`, chip padding/gap read `hds/sem/input/measure/sm/padding-*` (cross-borrow, flagged in guide Q11) |
| Empty / Status text | `hds/sem/type/color/caption/fg`, `hds/sem/type/measure/caption/size`; padding borrows `hds/sem/action/measure/md/padding-*` |
| Label / Group label | `hds/sem/type/color/label/fg`, `hds/sem/type/measure/label/*` |
| Separator | `hds/sem/divider/color/border`, `hds/sem/divider/measure/{weight}/thickness` |
| Backdrop | `hds/sem/overlay/color/bg` |
| Focus ring | `hds/sem/focus/color/stroke`, `hds/sem/focus/measure/stroke-width` (from `base.css`) |

Notes:

- States come from Base UI data attributes (`data-highlighted` → hover, `data-selected` → selected, `data-popup-open` → focus, `aria-invalid` → error); no component-specific state classes.
- Code and spec agree; no conflicts to flag.

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
| `InputGroup` | Field control (`hds-control`), `data-size="md"` default |
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

> **Provisional (2026-10-07).** The token rework renamed every token. The names below are the provisional mapping from the previous spec (token spec section 9, item 5). This component's re-interview confirms them.

Borrows per part, per the previous token spec, section 9, now withdrawn ("Combobox: Input group: Field. Options: Action tertiary (`hover` = highlighted, `selected` = chosen). Chips: Action secondary. Empty/status text: Type caption"):

| Part | Tokens |
| --- | --- |
| Input group | `hds/sem/color/field/{default,hover,error,disabled}/{bg,fg,border,placeholder}`, `hds/sem/measure/space/*`, `hds/sem/measure/size/*`, `hds/sem/radius/control`, `hds/sem/border/control` — `data-popup-open` styles like focus |
| Popup (Surface elevation 2) | `hds/sem/color/surface/floating/*`, `hds/sem/elevation/floating`, `hds/sem/measure/space/600`, `hds/sem/radius/container`, `hds/sem/border/container` |
| Items (Action tertiary) | `hds/sem/color/action/tertiary/{default,hover,active,selected,disabled}/{bg,fg,border}`; item measure reads `hds/sem/measure/space/*`, `hds/sem/radius/control`, `hds/sem/border/control` |
| Chips (Action secondary) | `hds/sem/color/action/secondary/*` via the no-priority Action default; chip radius reads `hds/sem/measure/space/*`, `hds/sem/radius/control`, `hds/sem/border/control`, chip padding/gap read `hds/sem/measure/space/*`, `hds/sem/measure/size/*`, `hds/sem/radius/control`, `hds/sem/border/control` (cross-borrow, flagged in guide Q11) |
| Empty / Status text | `hds/sem/color/content/muted/fg`, `hds/sem/typography/caption/*`; padding borrows `hds/sem/measure/space/*`, `hds/sem/radius/control`, `hds/sem/border/control` |
| Label / Group label | `hds/sem/color/content/default/fg`, `hds/sem/typography/label/*` |
| Separator | `hds/sem/color/graphic/divider/default`, `hds/sem/border/divider` |
| Backdrop | `hds/sem/color/overlay/scrim` |
| Focus ring | `hds/sem/color/focus/ring`, `hds/sem/border/focus` (from `base.css`) |

Notes:

- States come from Base UI data attributes (`data-highlighted` → hover, `data-selected` → selected, `data-popup-open` → focus, `aria-invalid` → error); no component-specific state classes.
- Code and spec agree; no conflicts to flag.

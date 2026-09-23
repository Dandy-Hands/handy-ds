# Interview Guide: Combobox component (retroactive)

- Status: complete
- Started: 2026-09-23
- Component: Combobox (`src/components/Combobox.tsx` + `Combobox.css`; the same file exports `Autocomplete`)
- Note: Retroactive guide. Owner directed the interview be skipped for this run; every answer below is derived from the existing component code and `.claude/decisions.md` (cite which).
- Base UI version documented from: `@base-ui/react` 1.8.0

## 1. Existing surface (confirmations)
Goal: confirm what the current component already decides, so the spec describes reality.

- [x] Q1: Combobox ships as a compound component spreading every Base UI Combobox part unchanged, restyling only DOM-rendering parts via `part()` (`Combobox.tsx:9-35`). Keep this shape with no handy-ds props of its own?
  > Yes — code confirms; `docs/components.md` §Combobox says "No handy-ds props".
- [x] Q2: The input group is an Input/Field control (`hds-control`, `data-size="md"` default) with inner `Input` / `Trigger` (chevron) / `Clear` (X) buttons (`Combobox.tsx:14-19`). Confirm Input/Field as the documented trigger look with `md` default size?
  > Yes — code confirms; matches token spec section 9 ("Combobox: Input group: Input/Field").
- [x] Q3: Options are Action tertiary (`Item` gets `hds-action hds-item` + `data-priority="tertiary"`), with the built-in `CheckIcon` as `ItemIndicator` (`Combobox.tsx:11,26-27`). Wave 5 records "options are Action tertiary with `selected` for chosen and `hover` for highlighted". Confirm?
  > Yes — code matches `.claude/decisions.md` Wave 5 part table verbatim.
- [x] Q4: Multi-select chips: `Chips` is a flex-wrap row, `Chip` is `hds-action hds-combobox__chip` with no `data-priority` (defaults to secondary per `action.css:10`), and `ChipRemove` defaults to the X icon (`Combobox.tsx:20-22`, `Combobox.css:3-15`). Wave 5 records "chips are Action secondary". Confirm?
  > Yes — code matches the Wave 5 decision; the chip look (caption type size, action radius) lives in `Combobox.css`.

## 2. Status and Empty parts
Goal: confirm the non-option popup content.

- [x] Q5: `Empty` and `Status` share `hds-combobox__status`, which styles only when non-empty with caption type tokens (`Combobox.tsx:30-31`, `Combobox.css:17-22`). Wave 5 records "empty/status text is Type caption". Confirm both stay undocumented as separate visual axes?
  > Yes — they are passthrough parts with one shared caption look.

## 3. Autocomplete in the same family
Goal: confirm how the sibling export is documented.

- [x] Q6: `Autocomplete` is exported from the same file with identical part classes and token sources (`Combobox.tsx:37-53`), differing only in Base UI behavior (free text allowed). Document it inside the Combobox family docs rather than as its own spec dir?
  > Yes — one family per source file; the comment on `Combobox.tsx:37` ("Same parts and token sources as Combobox") is the justification. `docs/components.md` lists it separately for choice guidance, which the API doc mirrors in a note.
- [x] Q7: Autocomplete has no Chips/Chip/ChipRemove parts (no multi-select) and no `ItemIndicator`. Confirm the family docs say that?
  > Yes — the spread at `Combobox.tsx:38-53` confirms the part list.

## 4. Base UI surface
Goal: for each Base UI prop/behavior, decide expose / rename / wrap / omit.

- [x] Q8: `Root` stays fully passthrough — `items`, `value`/`defaultValue`, `onValueChange`, `multiple`, `name`, `disabled`, `required`, filtering props all keep Base UI semantics?
  > Yes — no wrapper props exist; `Root` is spread untouched (`Combobox.tsx:10`).
- [x] Q9: Structural, unstyled parts (`Value`-equivalent input plumbing, `Portal`, `ItemText`, `Group`, `ScrollArrows`) ship without classes. Keep them exposed but undocumented as visual parts?
  > Yes — they render no styled DOM.

## 5. Extension props and token mapping
Goal: confirm nothing was added and the tokens match spec section 9.

- [x] Q10: Confirm zero extension props — overrides happen by passing props to parts (e.g. `data-size="lg"` on `InputGroup`)?
  > Yes — the file adds no props; `part()` defaults are caller-overridable (`part.ts`).
- [x] Q11: Confirm the token mapping: input group = `hds/sem/input/*`, popup = Surface elevation 2, options = Action tertiary, chips = Action secondary (via the no-priority Action default), empty/status text = Type caption, separator = Divider, backdrop = Overlay, focus ring from `base.css`?
  > Yes — `Combobox.tsx:8` comment, `token-system-spec.md` section 9 Combobox row, and `Combobox.css` token reads all agree. Chips' gap/padding read `hds/sem/input/measure/sm/*` and `hds/sem/action/measure/md/radius` (`Combobox.css:7-14`) — noted as a spec-section-9 cross-borrow, no conflict.
- [x] Q12: Any uncovered states to flag? The input group styles `data-popup-open` like focus (`control.css:67`), items map `[data-highlighted]` → hover and `[data-selected]` → selected (`action.css:95,110`).
  > None uncovered — all states land on existing tokens.

## Answers

(recorded per question above)

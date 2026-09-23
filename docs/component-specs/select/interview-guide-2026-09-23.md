# Interview Guide: Select component (retroactive)

- Status: complete
- Started: 2026-09-23
- Component: Select (`src/components/Select.tsx`)
- Note: Retroactive guide. Owner directed the interview be skipped for this run; every answer below is derived from the existing component code and `.claude/decisions.md` (cite which).
- Base UI version documented from: `@base-ui/react` 1.8.0

## 1. Existing surface (confirmations)
Goal: confirm what the current component already decides, so the spec describes reality.

- [x] Q1: Select ships as a compound component that spreads every Base UI Select part unchanged and restyles only the DOM-rendering parts via `part()` (`Select.tsx:14-24`). Keep this shape with no handy-ds props of its own?
  > Yes — code confirms: `{ ...BaseSelect, Trigger: part(...), ... }`; `docs/components.md` §Select says "No handy-ds props".
- [x] Q2: `Select.Trigger` reads Input/Field tokens with `data-size` defaulting to `md`, and its own CSS only adds `justify-content: space-between` + pointer cursor (`Select.tsx:16`, `Select.css:3-6`). Keep `md` as the documented default and keep the size axis internal (no public prop)?
  > Yes — code is the reviewed answer; the axis is set via the part default, not a public prop.
- [x] Q3: The popup chain is `Positioner → Popup → List`, with Popup carrying `hds-surface hds-popup hds-list` and `data-elevation="2"` (`Select.tsx:18-20`). Confirm Surface elevation 2 as the documented popup look?
  > Yes — matches token spec section 9 ("Select: Trigger: Input. Popup: Surface") and Wave 5 part tables in `.claude/decisions.md` (accordion/list popups pin elevation 2).
- [x] Q4: `Select.Item` is `hds-action hds-item` pinned to `data-priority="tertiary"`, and `ItemIndicator` defaults to the built-in `CheckIcon` (`Select.tsx:11,22-23`). Confirm items as Action tertiary with a check indicator?
  > Yes — code confirms; consistent with `docs/components.md` §Select ("the items are Action").

## 2. Base UI surface
Goal: for each Base UI Select prop/behavior, decide expose / rename / wrap / omit. All parts not listed pass through the spread unchanged.

- [x] Q5: `Root` stays fully passthrough — `items`, `value`/`defaultValue`, `onValueChange`, `multiple`, `name`, `disabled`, `required` etc. all keep Base UI semantics with no handy-ds renaming?
  > Yes — no wrapper props exist; `Root` is spread untouched (`Select.tsx:15`).
- [x] Q6: Unstyled/structural parts (`Value`, `ItemText`, `Group`, `Portal`, `ScrollUpArrow`, `ScrollDownArrow`) ship with no classes of their own — content and behavior only. Keep them exposed but undocumented as visual parts?
  > Yes — they render no DOM the category CSS styles; the API doc lists only the parts authors touch to compose the widget.
- [x] Q7: `Backdrop` and `Separator` carry the shared `hds-backdrop` / `hds-separator` classes (`Select.tsx:24-25`). Document them as optional parts rather than listing them in the main props table?
  > Yes — they are passthrough parts with shared category looks, not props.

## 3. Extension props
Goal: confirm the wrapper adds nothing beyond defaults.

- [x] Q8: Confirm zero extension props — every visual decision (trigger size, popup elevation, item priority) is a `part()` default the author can override, not a new prop?
  > Yes — the file adds no props; overrides happen by passing props to parts (e.g. `data-size="lg"` on `Trigger`), per `part()` in `part.ts`.

## 4. Token mapping
Goal: confirm Select consumes only the category tokens assigned by spec section 9.

- [x] Q9: Confirm the token mapping: Trigger = Input/Field (`hds/sem/input/*`), Popup = Surface elevation 2 (`hds/sem/surface/*`), Items = Action tertiary (`hds/sem/action/color/tertiary/*`), group labels and separators via the shared list/divider looks, focus ring from `base.css` (`hds/sem/focus/*`)?
  > Yes — `Select.tsx:13` comment and `token-system-spec.md` section 9 agree; `.claude/decisions.md` Wave 5 confirms the part tables.
- [x] Q10: Any uncovered states to flag? The trigger styles `data-popup-open` like focus (`control.css:67`), items style `[data-highlighted]` as hover and `[data-selected]` as selected (`action.css:95,110`).
  > None uncovered — all Base UI item/trigger states map onto existing Action/Input state tokens; nothing new is needed.

## Answers

(recorded per question above)

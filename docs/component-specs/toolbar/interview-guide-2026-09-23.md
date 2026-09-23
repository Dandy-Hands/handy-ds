# Interview Guide: Toolbar component (retroactive)

- Status: complete
- Started: 2026-09-23
- Component: Toolbar (`src/components/Toolbar.tsx`)
- Note: Retroactive guide. Owner directed the interview be skipped for this run; every answer below is derived from the existing component code and `.claude/decisions.md` (cite which).
- Base UI version documented from: `@base-ui/react` 1.8.0

## 1. Existing surface (confirmations)
Goal: confirm what the current component already decides, so the spec describes reality.

- [x] Q1: Compound shape spreads every Base UI Toolbar part unchanged and restyles only the DOM-rendering parts via `part()`. Confirm?
  > Yes — `{ ...BaseToolbar, Root: part(...), Group: part(...), Button: part(...), Link: part(...), Input: part(...), Separator: part(...) }` (`Toolbar.tsx:9-16`); `.claude/decisions.md` Wave 5: "Compound components mirror Base UI's namespace."

## 2. Parts and their looks
Goal: record each part's category assignment.

- [x] Q2: Root and Group use the shared toggle-group layout (`hds-toggle-group`), not a toolbar-specific class. Confirm?
  > Yes — `Toolbar.tsx:10-11`; the layout (flex row, gap) is shared with `Toggle.tsx:13-14`. `docs/components.md` §Toolbar: "A bar of controls for a region, with arrow-key navigation."
- [x] Q3: `Toolbar.Button` and `Toolbar.Link` are Action `tertiary` buttons. Confirm?
  > Yes — `const tertiary = { 'data-priority': 'tertiary' }` (`Toolbar.tsx:7`) applied at `:12-13`. `docs/components.md` §Toolbar: "`Toolbar.Button` and `Toolbar.Link` are Action `tertiary`."
- [x] Q4: `Toolbar.Input` is the Input/Field control at size `sm`. Confirm?
  > Yes — `Toolbar.tsx:14` (`part(BaseToolbar.Input, 'hds-control', { 'data-size': 'sm' })`); comment at `Toolbar.tsx:7` ("Input: Input/Field (sm)"). Matches decisions.md Wave 5 and spec section 9's composite rule (toolbar borrows per part).
- [x] Q5: `Toolbar.Separator` is the Divider look. Confirm?
  > Yes — `Toolbar.tsx:15` (`part(BaseToolbar.Separator, 'hds-separator')`).
- [x] Q6: No handy-ds props anywhere in the namespace. Confirm?
  > Yes — every part is a `part()` with className/defaults only (`Toolbar.tsx:9-16`); no prop-extending wrapper exists.

## 3. Token mapping
Goal: confirm the part → token table.

- [x] Q7: Mapping — buttons/links `action/color/tertiary/*`; input `input/*` at `data-size="sm"` (`input/measure/sm/*`); separator `divider/color/border` + `divider/measure/{weight}/thickness`; root gap from the toggle-group layout's `action/measure/*` gap. Confirm?
  > Yes — `action.css:68-86` (tertiary), `control.css` (input control, size axis via `data-size`), `Separator.css` (divider), and the shared `hds-toggle-group` layout in `Toggle.css` (gap). Matches token-system-spec.md section 9's composite mapping rule.
- [x] Q8: Does the toolbar impose a size on its buttons, or do they keep the Action default (`md`)? Confirm.
  > Buttons keep the Action default; only `Toolbar.Input` is pinned to `sm` (`Toolbar.tsx:14`). No `data-size` default exists on Button/Link (`Toolbar.tsx:12-13`).

## 4. Outward API doc
Goal: confirm what the client-facing page says.

- [x] Q9: The API doc documents the no-props surface, the per-part looks (tertiary buttons, `sm` input, divider separator), and the arrow-key navigation behavior — no implementation references. Correct?
  > Yes — follows `research/api-doc-conventions.md`; arrow-key navigation is user-facing behavior from the wrapped primitive, safe to state.

# Checkbox — Spec Interview Guide (2026-10-13)

Full Phase 1 re-run (`[re]` in `.claude/component-interview-todo.md`). Replaces the dry run
`interview-guide-2026-09-23.md`. Wraps `Checkbox` and `CheckboxGroup` from `@base-ui/react`.
Code exists (`src/components/Checkbox.tsx`, `Checkbox.css`); the spec leads and the code changes to match.

Base UI version documented from: `@base-ui/react` 1.8.0.

Base UI facts:
- `Checkbox.Root` renders a `<span>` and a hidden `<input>`. Props: `checked`, `defaultChecked`,
  `onCheckedChange`, `indeterminate`, `disabled`, `readOnly`, `required`, `name`, `value`,
  `uncheckedValue`, `form`, `id`, `inputRef`, `parent`, `nativeButton`, `render`, `className`, `style`.
  State attributes: `data-checked`, `data-unchecked`, `data-indeterminate`, `data-disabled`,
  `data-readonly`, `data-required`, `data-invalid`, `data-valid`, `data-dirty`, `data-touched`,
  `data-filled`, `data-focused`.
- `Checkbox.Indicator` renders a `<span>`. Props: `keepMounted`, `render`, `className`, `style`.
  It mounts only while checked or indeterminate.
- `CheckboxGroup` renders a `<div>`. Props: `value`, `defaultValue`, `onValueChange`, `allValues`
  (for a parent checkbox), `disabled`, `render`, `className`, `style`.

Dry-run state: `Checkbox` is a namespace (`Checkbox.Root`, `Checkbox.Indicator`). `CheckboxGroup` is
a separate export. No extension props. The box is `1.25em`. Radius is `radius/control ÷ 2`.
Group gap is `measure/space/200`. Tokens are the provisional mapping.

Token spec facts: Field category has the `checked` state. Radius role `indicator` is "checkboxes,
small chips".

## 1. Shape of the API

- [x] Q1: One `Checkbox` component, or `Checkbox.Root` + `Checkbox.Indicator` parts?
  > "One component (Recommended)". `Checkbox` renders the box and the mark.
  User added: "Can the checkbox just use a material symbol?" Answer "yes": the mark is an `Icon`
  (`check`, `remove`).
- [x] Q2: Name and shape of the group: `CheckboxGroup` or `Checkbox.Group`?
  > "Checkbox.Group (Recommended)".

## 2. Base UI surface

- [x] Q3: State and form members.
  > Omit `uncheckedValue` and `inputRef`. Expose the rest unchanged.
- [x] Q4: `parent` and `allValues` (select-all checkbox).
  > "Omit (Recommended)".
- [x] Q5: `keepMounted`, `nativeButton`, `className`, `style`, `render`.
  > Omit `keepMounted` and `nativeButton`. "Omit both (Recommended)" for `className` and `style`.
  `render` stays exposed (Claude call, same as Button).
- [x] Q6: Group members.
  > Claude call: expose `value`, `defaultValue`, `onValueChange`, `disabled`, `render`. Omit `allValues`.

## 3. Extension props

- [x] Q7: `size` axis, or the box scales with its label?
  > "size prop". Steps: "500, 600, 800". Default `500` (Claude call: the smallest step, which matches today's box size).
- [x] Q8: Group layout props (orientation, gap)?
  > "orientation". Gap is a Claude call.

## 3b. Change after code review (2026-10-13)

- [x] Q9: The mark inside an HTML box looks wrong. Use one icon per state?
  > "the checkbox isn't fully using material symbols. I's putting it in a html box. I want to use
  > an icon for each of the states: "Check Box", "Check Box Outline Blank", and "Indeterminate
  > Check Box"."
  Decision: no HTML box. `Checkbox` renders `check_box_outline_blank`, `check_box`, and
  `indeterminate_check_box`. Claude calls: `fill` on the ticked and indeterminate icons, colors by
  state, `size` steps unchanged (the drawn square is about three quarters of the step).

## 4. Token mapping

Claude calls (token interview scope): icon color per `field/*` state, `radius/indicator` for the focus
ring shape, group gap step. See `spec.md`.

## Open items

- Radio and Switch share `Checkbox.css` and the `checked` Field state. Their re-interviews confirm.

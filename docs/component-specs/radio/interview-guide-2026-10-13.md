# Radio — Spec Interview Guide (2026-10-13)

Full Phase 1 re-run (`[re]` in `.claude/component-interview-todo.md`). Replaces the dry run
`interview-guide-2026-09-23.md`. Wraps `Radio` and `RadioGroup` from `@base-ui/react`.
Code exists (`src/components/Radio.tsx`, shared `Checkbox.css`); the spec leads and the code changes to match.
The Checkbox interview (`docs/component-specs/checkbox/interview-guide-2026-10-13.md`) is the model.

Base UI version documented from: `@base-ui/react` 1.8.0.

Base UI facts:
- `Radio.Root` renders a `<span>` and a hidden `<input>`. Props: `value` (required), `disabled`,
  `required`, `readOnly`, `inputRef`, `nativeButton`, `render`, `className`, `style`. It has no
  `checked`, `defaultChecked`, or `onCheckedChange`: the group owns the selection. The dry-run API doc
  listed those three props. That was wrong.
- `Radio.Indicator` renders a `<span>`. Props: `keepMounted`, `render`, `className`, `style`.
  It mounts only while selected.
- `RadioGroup` renders a `<div>`. Props: `value`, `defaultValue`, `onValueChange`, `disabled`,
  `readOnly`, `required`, `name`, `form`, `inputRef`, `render`, `className`, `style`.
- State attributes on the root: `data-checked`, `data-unchecked`, `data-disabled`, `data-readonly`,
  `data-required`, `data-invalid`, `data-valid`, `data-dirty`, `data-touched`, `data-filled`,
  `data-focused`.

Dry-run state: `Radio` is a namespace (`Radio.Root`, `Radio.Indicator`). `RadioGroup` is a separate
export. The circle is a `1.25em` box with a CSS dot. No extension props. The CSS and the group
class are shared with Checkbox (`Checkbox.css`, `.hds-choice-group`).

Checkbox decisions to reuse (2026-10-13): one component, `Group` as a member, one Material Symbols
icon per state, `size` of `500 | 600 | 800`, group `orientation`, `className` and `style` omitted.

## 1. Shape of the API

- [x] Q1: One `Radio` component, or `Radio.Root` + `Radio.Indicator` parts?
  > "One component (Recommended)".
- [x] Q2: Name of the group: `RadioGroup` or `Radio.Group`?
  > "Radio.Group (Recommended)".

## 2. Look

- [x] Q3: Draw the radio as one icon per state (`radio_button_unchecked`, `radio_button_checked`),
  or keep the circle box with a CSS dot?
  > "One icon per state (Recommended)". No `fill`: the checked glyph already has its dot.
- [x] Q4: `size` prop, and which steps?
  > "500, 600, 800 (Recommended)". Default `500`.

## 3. Base UI surface

- [x] Q5: Radio members (`value`, `disabled`, `required`, `readOnly`, `inputRef`, `nativeButton`,
  `render`, `className`, `style`, `keepMounted`).
  > "Same as Checkbox (Recommended)": omit `inputRef`, `nativeButton`, `keepMounted`, `className`, `style`.
- [x] Q6: Group members (`value`, `defaultValue`, `onValueChange`, `disabled`, `readOnly`, `required`,
  `name`, `form`, `inputRef`, `render`).
  > "All behavior members (Recommended)": expose all but `inputRef`, `className`, `style`.

## 4. Extension props

- [x] Q7: Group `orientation` (same as Checkbox.Group)?
  > "Yes, like Checkbox.Group (Recommended)". Default `vertical`.

## 5. Token mapping

Claude calls (token interview scope): icon color per `field/*` state, `radius/round` for the focus
ring shape, group gap step.

## Open items

- The group class `.hds-choice-group` and the Radio rules sit in `Checkbox.css`. The code phase moves
  them into `Radio.css`.
- Fieldset: the group needs a name (`Fieldset.Legend`). Check whether Radio.Group should wrap a
  `Fieldset` itself. (Claude call: no, Fieldset stays separate.)

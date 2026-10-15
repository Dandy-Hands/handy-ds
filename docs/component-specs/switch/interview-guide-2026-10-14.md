# Switch — Spec Interview Guide (2026-10-14)

Full Phase 1 re-run (`[re]` in `.claude/component-interview-todo.md`). Replaces the retroactive guide
`interview-guide-2026-09-23.md`. Wraps `Switch` from `@base-ui/react`.
Code exists (`src/components/Switch.tsx`, `Switch.css`); the spec leads and the code changes to match.
The Checkbox and Radio interviews (2026-10-13) are the model. Switch has no group.

Base UI version documented from: `@base-ui/react` 1.8.0.

Base UI facts:
- `Switch.Root` renders a `<span>` and a hidden `<input>`. Props: `checked`, `defaultChecked`,
  `onCheckedChange`, `disabled`, `readOnly`, `required`, `name`, `value`, `uncheckedValue`, `form`, `id`,
  `inputRef`, `nativeButton`, `render`, `className`, `style`.
- `Switch.Thumb` renders a `<span>`. Props: `render`, `className`, `style`.
- State attributes on the root: `data-checked`, `data-unchecked`, `data-disabled`, `data-readonly`,
  `data-required`, `data-invalid`, `data-valid`, `data-dirty`, `data-touched`, `data-filled`, `data-focused`.

Dry-run state: `Switch` is a namespace (`Root`, `Thumb`). No extension props. The track is `2.25em × 1.25em`,
drawn in CSS with Action tokens.

Checkbox and Radio decisions to reuse: one component, one Material Symbols icon per state, `size` of
`500 | 600 | 800`, `className` and `style` omitted.

## 1. Shape of the API

- [x] Q1: One `Switch` component, or `Switch.Root` + `Switch.Thumb` parts?
  > "One component (Recommended)".

## 2. Look

- [x] Q2: One icon per state (`toggle_off`, `toggle_on`), or keep the CSS track and thumb?
  > "One icon per state (Recommended)". The thumb slide animation is dropped.
- [x] Q3: `size` prop, and which steps?
  > "500, 600, 800 (Recommended)". Default `500`.

## 3. Base UI surface

- [x] Q4: Root members.
  > "Same as Checkbox (Recommended)": omit `uncheckedValue`, `inputRef`, `nativeButton`, `className`, `style`.
  Expose the rest. `Thumb` is not used.

## 4. Token mapping

Claude calls (token interview scope): icon color per `field/*` state, `radius/round` for the focus ring
shape. The Action tokens are dropped: Switch now reads the same Field tokens as Checkbox and Radio.

## Open items

- `toggle_on` is drawn filled. Confirm in the code phase that `fill` gives the right glyph for `toggle_on`
  and not for `toggle_off`.

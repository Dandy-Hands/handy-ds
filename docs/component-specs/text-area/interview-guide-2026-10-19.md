# TextArea — Spec Interview Guide (2026-10-19)

New component (`[lib]` in `.claude/component-interview-todo.md`, listed there as `textarea`). Planned in `docs/component-specs/input/interview-guide-2026-10-15.md`: "Textarea gets its own interview after TextInput."
Read `docs/component-specs/input/interview-guide-2026-10-15.md` and `docs/component-specs/email-input/interview-guide-2026-10-19.md` first. They set the pattern for an input.

Base UI version documented from: `@base-ui/react` 1.8.0.

Facts:
- Base UI has no Textarea component. `Input` and `Field.Control` render an `<input>`. Both take `render`, so `render={<textarea />}` swaps the element.
- The internal `Input` base (`src/components/Input.tsx`) requires `type` and centers its children (`align-items: center` in `control.css`). A `<textarea>` takes no `type`, and its text starts at the top.
- A `<textarea>` has native `rows`, `cols`, `wrap`, `maxLength`, `minLength`, `placeholder`, `spellCheck`, and `resize` (CSS).
- Browsers resize a textarea with a drag handle (CSS `resize`). `field-sizing: content` grows it with the text, but support is not complete.
- The frame draws the look: `.hds-control` with states `:hover`, `:focus-within`, `:has([data-invalid])`, `:has(:disabled)`.

Decisions made before this interview (2026-10-15 and 2026-10-19, in conversation):
- Split inputs by the value type they hold. A multi-line string is its own component.
- Defaults live in the component. A native attribute from the caller overrides a default.
- Extras such as a character count live outside the component. The caller reads the value with `onValueChange` and shows the result in `Field.Description`.

## 1. Shape of the API

- [x] Q1: Name and slots. Answer (2026-10-19): `TextArea`, matching `TextInput`. No `start` or `end` slots in v1 (an icon in a multi-line field has no clear place). A caller can ask for them later.
- [x] Q2: Base. Answer (2026-10-19): the internal `Input` base with `render={<textarea />}`. The base changed in one way: `type` is optional (a textarea has no type). The top alignment lives in `TextArea.css`, not in the base. Rejected: a separate copy of the frame (it drifts from the other inputs).

## 2. Size and resize

- [x] Q3: `size` and height. Answer (2026-10-19): `size` keeps the three steps (`'800' | '1000' | '1200'`). It sets padding, type size, and the height of one row. The caller sets the starting height with the native `rows` attribute, default `3`. No `width` prop and no `cols`: the field fills its container. The user asked for a fit-to-content option; see Q4.
- [x] Q4: Resize and auto grow. Answer (2026-10-19): the user drags the bottom edge to resize the height (`resize: vertical`). Auto grow is in v1 (the user overrode the first recommendation, "no auto grow in v1"). Prop `autoGrow` (boolean, default `false`): the height starts at `rows` and follows the text, and the drag handle is off. Prop `maxRows` (a count, no default): with `autoGrow`, the most rows before the field scrolls. A count is allowed, as `Text` `maxLines` is. The height comes from `scrollHeight`, not `field-sizing: content`, because support for `field-sizing` is not complete.

## 3. Defaults and members

- [x] Q5: Defaults and members. Answer (2026-10-19): the only default is `rows=3`. `spellCheck` stays at the browser default (on), because the text is prose. `maxLength`, `minLength`, `placeholder`, `wrap`, and the other native attributes pass through. Omitted: `type`, `start`, `end`, `render` (the component owns the element), `cols`, `style`. `className` goes to the frame. `ref` points to the `<textarea>`. A character count is not part of the component: the caller reads the value with `onValueChange`.

## 4. Token mapping

Claude calls (token interview scope): colors, radius, border, and focus ring in `spec.md`. Reuses the `TextInput` mapping.

## Open items

- Field error text color (token spec section 9, item 4).

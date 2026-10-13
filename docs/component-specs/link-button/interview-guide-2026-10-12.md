# LinkButton — Spec Interview Guide (2026-10-12)

Full Phase 1 re-run (`[lib]` in `.claude/component-interview-todo.md`). No Base UI primitive.
Code exists (`src/components/LinkButton.tsx`, built on `useRender` + `mergeProps`); the spec
leads and the code changes to match.

Facts:
- Renders an `<a>` with the Button look (`hds-button hds-action`). Base UI Button renders a
  `<button>`, and a link rendered as a button has the wrong role. This is why LinkButton exists.
- Dry run had `priority`, `size` as `sm | md | lg`, `href`, `render`, `children`.

Dry-run gaps against the API conventions:
- `priority` is a role axis; the user wants none.
- `size` should be `measure/size` steps (section 5.2).

## 1. Component scope

- [x] Q1: What is the point of Link, LinkButton, and Button?
  > "What is the point of having a link button, link, and button?" After the explanation:
  > "Option 1". Keep two components. Button is the `<button>`. LinkButton is the only link
  > component. No inline text Link component; a plain `<a>` styled by the theme covers it.

## 2. Surface

- [x] Q2: `variant`?
  > "No `variant` prop." and "It's just a link needs no role." LinkButton has one fixed look:
  > Action `primary`.
- [x] Q3: `disabled`?
  > "Omit disabled (Recommended)".
- [x] Q4: `className` and `style`?
  > "Omit both, like Button (Recommended)".
- [x] Q5: `size` and `width`?
  > Option 1 was "Fixed primary look, size + width (Recommended)". Same values as Button.
- [x] Q6: `href`, `target`, `rel`, `render`, `ref`, `children`?
  > Pass through as native `<a>` props, as in the dry run. Claude call.

## 3. Token mapping

Claude calls (token interview scope): the Button mapping with `variant` fixed to `primary`.

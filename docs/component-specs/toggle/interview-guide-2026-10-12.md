# Toggle — Spec Interview Guide (2026-10-12)

Full Phase 1 re-run (`[re]` in `.claude/component-interview-todo.md`). Replaces the dry run
`interview-guide-2026-09-23.md`. Wraps `ToggleGroup` and `Toggle` from `@base-ui/react`.
Code exists (`src/components/Toggle.tsx`); the spec leads and the code changes to match.

Base UI version documented from: `@base-ui/react` 1.8.0.

Base UI facts:
- `ToggleGroup` renders a `<div>`. Props: `value`, `defaultValue`, `onValueChange`, `disabled`,
  `orientation`, `loopFocus` (default true), `multiple`, `render`, `className`, `style`.
- `Toggle` renders a `<button>`. Props: `pressed`, `defaultPressed`, `onPressedChange`, `value`,
  `disabled`, `nativeButton`, `render`, `className`, `style`. State attribute `data-pressed`.
- `value` is a string.

Dry-run state: `Toggle` and `ToggleGroup` are two separate exports. Both pass through every Base UI
prop. Look is `data-priority`, no extension props. The group is a bare flex row.

User request: "support text, and when there's no text, it'll kind of look like a regular toggle" and
"toggle groups [get] a container around them, with a little padding".

## 1. What Toggle is

- [x] Q1: What does a toggle with no text look like?
  > "I swear, base UI is throwing me for loops. I did not know there was a switch. In my mind, a
  > toggle is a button group. Forget those earlier things I said, except I do want it to still be
  > in a container."
  Text support is dropped: a toggle button already takes text, an `Icon`, or both. The Switch look
  is not wanted.
- [x] Q2: Can a toggle stand alone?
  > "I'm thinking they shouldn't be able to be unpaired from each other. The toggle, or whatever,
  > is a subcomponent of the `ToggleGroup`, or the parent is called `Toggle` and the child is
  > `Toggle.Button`."
  Decision: parent `Toggle`, child `Toggle.Button`. No standalone toggle button. `ToggleGroup` is
  removed.

## 2. Base UI surface

- [x] Q3: Which Base UI members to expose?
  > "Same as Button (Recommended)".
  Expose state props, `value`, `disabled`, `render`, `ref`, rest props. Omit `className`, `style`,
  `nativeButton`.
  Claude calls (inside a group the group owns the state): `Toggle.Button` omits `pressed`,
  `defaultPressed`, `onPressedChange`. `loopFocus` is omitted (no second use).

## 3. Extension props

- [x] Q4: `variant` and `size`?
  > "variant + size (Recommended)".
- [x] Q5: Where do they go?
  > "On ToggleGroup, inherited (Recommended)". With Q2, there is no standalone button, so the
  > buttons never take their own `variant` or `size`.
- [x] Q6: How does the container look?
  > "Filled track (Recommended)": a rounded Surface box around the buttons, small padding between
  > box and buttons.

## 4. Token mapping

Claude calls (token interview scope): track color `surface/sunken`, container radius and border
roles, padding step, button radius `control`, pressed look from the Action `selected` state.

## Open items

- `Toolbar.tsx` imports `Toggle.css` for the shared group row. Code must move that rule out. Flag
  to the user in the Toolbar re-interview.
- Old name `ToggleGroup` appears in `docs/rules.md`, `docs/api/index.md`, `docs-site`, and
  `Showcase.tsx`. Code and docs phases update them.

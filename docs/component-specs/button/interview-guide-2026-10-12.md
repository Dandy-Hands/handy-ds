# Button — Spec Interview Guide (2026-10-12)

Full Phase 1 re-run (`[re]` in `.claude/component-interview-todo.md`). Replaces the dry run
`interview-guide-2026-09-21.md`. Wraps `Button` from `@base-ui/react/button`. Code exists
(`src/components/Button.tsx`); the spec leads and the code changes to match.

Base UI version documented from: `@base-ui/react` 1.8.0.

Base UI facts:
- One part: `Button`, renders a `<button>`.
- Own prop: `focusableWhenDisabled` (default false). Keeps a disabled button focusable.
- Also: `disabled`, `nativeButton` (default true; false when `render` gives a non-button), `render`,
  `className`, `style`, `ref`, native button props.
- State `disabled`, data attribute `data-disabled`.

Token spec facts: Action category, axis `primary | secondary | tertiary | danger`, states
`default | hover | active | disabled | selected` (7.1). Radius role `control`, border role
`control` (7.5). Typography role `label` (7.7).

Dry-run gaps against the API conventions:
- `priority` should be `variant` (conventions section 3, 6).
- `size` is `sm | md | lg`; it should be `measure/size` steps (section 5.2).
- `fullWidth` is an axis value as a boolean (section 1); `width="full"` replaces it.

## 1. Base UI surface

- [x] Q1: Which Base UI members to expose?
  > First "Minimal". On the trigger conflict: "What do `render ref` and `rest` do?" After the
  > explanation: "Minimal + render, ref, rest props". `className` and `style` omitted.
- [x] Q2: `focusableWhenDisabled`?
  > "Omit (Recommended)".

## 2. Extension props

- [x] Q3: `priority` to `variant`?
  > "Rename to variant (Recommended)".
- [x] Q4: `size` steps and default?
  > "800, 1000, 1200; default 1000 (Recommended)".
- [x] Q5: `loading`?
  > "Keep as is (Recommended)".
- [x] Q6: `fullWidth` to `width`?
  > "width: 'auto' | 'full' (Recommended)".
- [x] Q7: Icon-only button?
  > "The button is a container. Icon buttons are buttons with no text and just an icon in it."
  > No prop. Shape: "No, same padding as text".

## 3. Token mapping

Claude calls (token interview scope): padding, gap, and label size per `size` step; radius
`control`; border `control`; Action tokens per `variant`.

## Open items

- Dialog, Menu, Popover specs still describe trigger styling that conflicts with
  `.claude/decisions.md` "Triggers carry no styling". Outside this task; flag to the user.

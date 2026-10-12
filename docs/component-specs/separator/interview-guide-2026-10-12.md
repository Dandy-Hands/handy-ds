# Separator — Spec Re-Interview Guide (2026-10-12)

Full Phase 1 re-run after the token rework. Dry-run spec: `spec.md` (2026-09-23).
Wraps `Separator` from `@base-ui/react/separator`. The class `hds-separator` is also
used by the Separator parts of Menu, ContextMenu, Select, Combobox, Autocomplete, and
Toolbar, so this mapping applies to them too.

Base UI version documented from: `@base-ui/react` 1.8.0.

Token facts (token spec 7.2, 7.3, 7.5):
- Color: `hds/sem/color/graphic/divider/{default|strong}` (`neutral/200`, `neutral/400`).
- Width: one role, `hds/sem/border/divider` (driver `border.divider`, default `025` = 1px).
- The dry-run CSS reads `measure/space/050` and `measure/space/100` for `weight`
  `medium` and `thick`. Space tokens are not line widths, so this mapping is wrong.

## 1. Base UI surface

- [x] Q1: `orientation` (`horizontal` | `vertical`, default `horizontal`), `render`,
  `className`, native `div` props. Pass through unchanged. Remove `style` from the type
  (API conventions section 1).
  > "Remove style also remove render and class name and native props. The separator
  > should be minimal. What is the full scope?"
  > Claude listed the full scope: `orientation`, `render`, `className` (string or state
  > function), `style`, native `div` props (`id`, `aria-*`, `data-*`, `role`, `hidden`,
  > `tabIndex`, events, `children`), `ref`. Flagged that removing `className` and
  > `render` breaks the escape hatch in API conventions section 1.
  > Q1a (which members stay): "Why can't a line be hidden by default from screen
  > readers? When would they ever need to read a line?"
  > Claude explained: `role="separator"` announces a group boundary, like `<hr>`; the
  > usage rule allows Separator only at real boundaries; decoration belongs in a CSS
  > border. Neither choice needs a prop.
  > Q1b (screen reader behavior): "Always semantic (Recommended)". Base UI's
  > `role="separator"` and `aria-orientation` stay; no aria prop.
  > Q1c (members): "orientation + tone only (Recommended)". No `ref`, `id`, `data-*`,
  > `className`, `render`, `style`, or other native props. Recorded break of the
  > `render`/`className` escape hatch (API conventions section 1): the user wants
  > Separator minimal; spacing comes from the parent layout.

## 2. Thickness and color

- [x] Q2: What does the emphasis axis select?
  > "tone: default | strong (Recommended)". Drop `weight`. `tone` reads
  > `color/graphic/divider/{tone}`. One width from `border/divider`. No token change.

## 3. Extension props

- [x] Q3: Other props. Proposed: none. Spacing around the line comes from the parent
  layout `gap`, not from a Separator prop.
  > "tone only (Recommended)".

## 4. Token mapping

- [x] Q4: Color `hds/sem/color/graphic/divider/{tone}`; width `hds/sem/border/divider`
  for both orientations. The Separator parts of Menu, Select, Combobox, and Toolbar use
  the same CSS at tone `default`.
  > "Confirm (Recommended)". Add the Graphic divider tone values to API conventions
  > section 6; remove the `weight` axis row (Separator was its only user).

## Open items

- The code still has `weight`, `Weight`, and the space-token widths. `hds-component-code`
  replaces them.

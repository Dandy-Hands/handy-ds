# Component conventions

How every handy-ds component is built. Button (`src/components/Button.tsx`) is the reference implementation. Follow this verbatim when adding a component.

## The one rule

Components read **semantic tokens only**: `var(--hds-sem-*)`. Never `--hds-prim-*`, never a driver value, and never a hard-coded color. `npm test` fails if a component file references a primitive or a `--hds-sem-*` name the theme doesn't define. That check is what guarantees a driver change or a mapping change re-themes every component with zero component edits.

Literal values are allowed only for structure (the `1.25em` checkbox box, `999px` pill radius, `z-index`, transition timings). Anything a client might want to theme goes through a token.

## Files

```
src/components/
  Button.tsx        component (one family per file: Checkbox.tsx, Menu.tsx = Menu + ContextMenu + Menubar)
  Button.css        that component's own layout rules
  action.css        category look shared by every Action part
  control.css       category look shared by every Input/Field text control
  surface.css       Surface look + popups, positioners, list items, backdrop (Overlay)
  Feedback.css      Feedback look shared by Alert and Toast
  Separator.css     Divider look
  base.css          body type, context grounds, focus ring
  part.ts           part() / cx() helpers
  icons.tsx         built-in glyphs (check, chevron, x...)
src/index.ts        public exports, grouped by category
```

Each `.tsx` imports the CSS it needs in this order: `base.css`, then category CSS, then shared component CSS (`Button.css`, `Separator.css`), then its own. First import wins bundle order, so shared rules always precede the rules that build on them.

## CSS

- Every rule sits in `@layer hds.components` (base rules in `@layer hds.base`, the generated theme in `@layer hds.theme`). Client CSS is unlayered, so it always wins without specificity fights. Files that can load first repeat the order statement `@layer hds.theme, hds.base, hds.components;`.
- Class names: `hds-{component}` for the root, `hds-{component}__{part}` for parts, plus category classes (`hds-action`, `hds-control`, `hds-surface`, `hds-feedback`, `hds-item`).
- Axes are data attributes named after the spec axis: `data-priority` (Action), `data-size` (Input/Field), `data-elevation` (Surface), `data-sentiment` (Feedback), `data-weight` (Divider), `data-variant` (Type/Icon role).
- States come from Base UI's own data attributes (`data-disabled`, `data-pressed`, `data-active`, `data-selected`, `data-highlighted`, `data-checked`, `data-invalid`, `data-popup-open`...). Don't add your own state classes.
- Category CSS maps an axis to private `--_*` custom properties once, then the state rules read those. Example: `action.css` sets `--_hover-bg` per priority, and `.hds-action:hover` reads `var(--_hover-bg)`.
- The focus ring comes from `base.css` (`:focus-visible`). Parts inside lists or bars inset it with `outline-offset: calc(-1 * var(--hds-sem-focus-measure-stroke-width))`.

## TypeScript

- Wrap Base UI; never re-implement behavior Base UI provides.
- **Compound components** mirror Base UI's namespace so the Base UI docs apply part for part:

  ```ts
  export const Select = {
    ...BaseSelect,                                          // every part and hook, unchanged
    Trigger: part(BaseSelect.Trigger, 'hds-control hds-select__trigger', { 'data-size': 'md' }),
    Item: part(BaseSelect.Item, 'hds-action hds-item', { 'data-priority': 'tertiary' }),
  };
  ```

  `part(Component, className, defaults)` prepends the class (keeping Base UI's function-form `className`), applies default props that callers can override, and passes everything else through, `ref` included. Only style parts that render DOM. Everything else comes through the spread. Types such as `Select.Root.Props` stay importable from `@base-ui/react/select`.
- **Single-part components** with an axis get a small function with a typed prop named after the axis (`priority`, `size`, `elevation`, `sentiment`, `weight`, `variant`), set as a data attribute: see `Button`, `Input`, `Separator`, `Meter.Root`.
- **Components with no Base UI primitive** (Card, Alert, Text, LinkButton) use `useRender` + `mergeProps`, so they take the same `render` prop as Base UI parts.
- Props extend the wrapped component's props (`ComponentProps<typeof BaseButton>`, `useRender.ComponentProps<'div'>`). React 19: `ref` is a normal prop, no `forwardRef`.
- Imports use `.ts`/`.tsx` extensions. Only erasable TS syntax (no enums, no namespaces).
- Export from `src/index.ts` under its category heading.

## Tokens a component may use

Use the category the spec assigns (token spec section 9 tables, decisions in `.claude/decisions.md`). Composites borrow per part: Select trigger is Input/Field, popup is Surface, options are Action. Don't invent a token. If a value can't be expressed with existing tokens, raise it as a spec change: new names must pass `checkTokenName()` and go into the Theme Map.

## Adding a component

Three skills. `component-spec` (`.claude/skills/component-spec/SKILL.md`) drafts the spec in `.claude/specs/components/` and reviews it with the user. Then `component-build` (`.claude/skills/component-build/SKILL.md`) writes the code and holds the build checklist, and `component-figma` (`.claude/skills/component-figma/SKILL.md`) builds the Figma component. The last two are independent: run either order. Both refuse a spec that is not `Status: reviewed`.

# Component conventions

How every handy-ds component is built. Button (`src/components/Button.tsx`) is the reference implementation. Follow this verbatim when adding a component.

## The one rule

Components read **semantic tokens only**: `var(--hds-sem-*)`. Never `--hds-prim-*`, never a driver value, and never a hard-coded color. `npm test` fails if a component file references a primitive or a `--hds-sem-*` name the theme doesn't define. That check is what guarantees a driver change re-themes every component with zero component edits.

Literal values are allowed only for structure (the `1.25em` checkbox box, `z-index`, transition timings). Anything a client might want to theme goes through a token.

## Files

```
src/components/
  Button.tsx        component (one family per file: Checkbox.tsx, Menu.tsx = Menu + ContextMenu + Menubar)
  Button.css        that component's own layout rules
  action.css        color category look shared by every Action part
  control.css       color category look shared by every Field text control
  surface.css       Surface look + popups, positioners, list items, backdrop (Overlay)
  Feedback.css      Feedback look shared by Alert and Toast
  Separator.css     divider look (Graphic category)
  base.css          body type, mode and context grounds, focus ring
  part.ts           part() / cx() helpers
  icons.tsx         built-in glyphs (check, chevron, x...)
src/index.ts        public exports, grouped by category
```

Each `.tsx` imports the CSS it needs in this order: `base.css`, then category CSS, then shared component CSS (`Button.css`, `Separator.css`), then its own. First import wins bundle order, so shared rules always precede the rules that build on them.

## CSS

- Every rule sits in `@layer hds.components` (base rules in `@layer hds.base`, the generated theme in `@layer hds.theme`). Client CSS is unlayered, so it always wins without specificity fights. Files that can load first repeat the order statement `@layer hds.theme, hds.base, hds.components;`.
- Class names: `hds-{component}` for the root, `hds-{component}__{part}` for parts, plus category classes (`hds-action`, `hds-control`, `hds-surface`, `hds-feedback`, `hds-item`).
- Axes are data attributes named after the component's axis prop (`data-{prop}`). Prop names and values: [`api-conventions.md`](api-conventions.md).
- States come from Base UI's own data attributes (`data-disabled`, `data-pressed`, `data-active`, `data-selected`, `data-highlighted`, `data-checked`, `data-invalid`, `data-popup-open`...). Don't add your own state classes.
- Category CSS maps an axis to private `--_*` custom properties once, then the state rules read those. Example: `action.css` sets `--_hover-bg` per priority, and `.hds-action:hover` reads `var(--_hover-bg)`.
- The focus ring comes from `base.css` (`:focus-visible`). Parts inside lists or bars inset it with `outline-offset: calc(-1 * var(--hds-sem-border-focus))`.

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
- **Single-part components** with an axis get a small function with a typed axis prop, set as a data attribute: see `Button`, `Input`, `Separator`, `Meter.Root`.
- **Components with no Base UI primitive** (Card, Alert, Text, LinkButton) use `useRender` + `mergeProps`, so they take the same `render` prop as Base UI parts.
- Props extend the wrapped component's props (`ComponentProps<typeof BaseButton>`, `useRender.ComponentProps<'div'>`). React 19: `ref` is a normal prop, no `forwardRef`.
- Imports use `.ts`/`.tsx` extensions. Only erasable TS syntax (no enums, no namespaces).
- Export from `src/index.ts` under its category heading.

## Props

Prop rules — what is and is not a member, member categories, names, value types, and value names — live in [`api-conventions.md`](api-conventions.md).

## Tokens a component may use

Each component's spec interview records which tokens its parts read (token spec section 8). Composites borrow per part: Select trigger is Field, popup is Surface, options are Action. Radius and border come from shape roles (`radius/control`, `border/container`, ...), not from the color category. Don't invent a token. If a value can't be expressed with existing tokens, raise it as a spec change: new names go into `names.ts` (and `picks.ts` for color) and must pass `checkTokenName()`.

Components migrated before their re-interview read the new tokens through a provisional mapping (token spec section 9, item 5).

## Adding a component

Four skills in `.claude/skills/`, run in order. The spec has a status block with one line per phase (`spec`, `code`, `figma`, `docs`). Each skill sets only its own line and refuses to start until the lines it needs are set.

1. `hds-component-spec-interview` interviews the user, then writes the internal spec `docs/component-specs/<component>/spec.md` and the agent-facing API doc `docs/api/<component>.md`. Writes the status block with `spec: reviewed` and the rest `pending`.
2. `hds-component-code` builds the component from the reviewed spec and, only when the component adds behavior Base UI does not provide, writes a Playwright test (`e2e/<component>.spec.ts`). Needs `spec: reviewed`. Sets `code: built`.
3. `hds-component-figma` builds the Figma component from the reviewed spec. Independent of step 2: run either order. Needs `spec: reviewed`. Sets `figma: built`.
4. `hds-component-docs` writes `docs/components/<component>.mdx` with live examples, after the code is built. It then runs `npm run test:e2e` so the new page and the component test pass in a real browser. Needs `spec: reviewed` and `code: built`. Sets `docs: built`.

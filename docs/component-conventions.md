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

## Props

- **One prop name = one axis everywhere in the library.** `size` always means the size axis, `priority` always Action priority, `variant` always the component's category role. Never reuse an axis name for a different axis, and never give one axis two names. Where the rule bites, fix the prop, not the rule (e.g. Icon's `size` must become a real size axis or be renamed — decided at Icon's spec interview).
- An axis prop is named after its spec axis (`priority`, `size`, `elevation`, `sentiment`, `weight`, `variant`) and set as the matching data attribute.
- **Where possible, a prop's values appear verbatim in the axis slot of the token names the component reads** (`action/measure/md/padding-x` ⇔ `size="md"` on Button). Per-category value sets are fine where the token taxonomy has them (each category has its own role axis). A prop that breaks the slot rule needs a recorded reason in its spec.
- **Value sets are defined once per axis** and shared across components (table below). A component may only diverge when its semantics genuinely differ; record the divergence and the reason in the component spec.
- **Named values.** All axis steps are named (`sm/md/lg`, `primary/secondary/tertiary`, `thin/medium/thick`). Numeric values are not used; if a future axis genuinely mirrors a primitive scale numbering, record the reason in its spec.
- Axis props are **typed unions, never `string`**, exported alongside the component (`export type Size = 'sm' | 'md' | 'lg'`).
- The axis default is documented in the spec and applied as a `part()`/`defaults` data attribute (e.g. `data-size="md"`), so callers always see the current value in the DOM.
- Base UI props are passed through unchanged — no renaming, no re-typing. Only extension props follow these rules.

Canonical axis value sets:

| Axis | Values | Definition |
|---|---|---|
| `priority` | `primary`, `secondary`, `tertiary` | How strongly an interactive element commands attention (its main action vs a supporting one). Action-category axis; use on any part that renders the Action look. |
| `size` | `sm`, `md` (default), `lg` | Physical footprint that scales with context — control height and padding for interactive controls, glyph size for icons, type size for Text. Use wherever a component offers size steps. |
| `elevation` | `0`, `1`, `2`, `3` | Distance above the page plane (shadow depth). Surface-category axis; use on any part that renders the Surface look — cards, popups, positioners, backdrops. |
| `sentiment` | `danger`, `warning`, `success`, `info` | Semantic valence of a message or measurement. Feedback-category axis; use on any part that renders the Feedback look. |
| `weight` | `thin`, `medium`, `thick` | Stroke thickness of a divider line. Divider-category axis; use on any part that renders the Divider look. (Border thickness — not type weight.) |
| `variant` | per-category role sets: Icon `default`, `secondary`, `accent`; Text `display`, `heading`, `body`, `label`, `caption` | Which role within the component's category value scale (color emphasis for Icon; full typographic role for Text). Use when a part renders in a specific category role. |

A component uses an axis when its definition matches, decided by the token category the component's spec assigns — not by copying another component's choice.

New axes (e.g. `status` on Progress) get added to this table when their component's spec is written.

## Tokens a component may use

Use the category the spec assigns (token spec section 9 tables, decisions in `.claude/decisions.md`). Composites borrow per part: Select trigger is Input/Field, popup is Surface, options are Action. Don't invent a token. If a value can't be expressed with existing tokens, raise it as a spec change: new names must pass `checkTokenName()` and go into the Theme Map.

## Adding a component

Three skills. `component-spec` (`.claude/skills/component-spec/SKILL.md`) drafts the spec in `.claude/specs/components/` and reviews it with the user. Then `component-build` (`.claude/skills/component-build/SKILL.md`) writes the code and holds the build checklist, and `component-figma` (`.claude/skills/component-figma/SKILL.md`) builds the Figma component. The last two are independent: run either order. Both refuse a spec that is not `Status: reviewed`.

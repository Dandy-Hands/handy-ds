# Interview Guide: Icon component (full re-run)

- Status: in progress
- Started: 2026-09-24
- Component: Icon (`src/components/Icon.tsx` + `Icon.css`)
- Type: `[lib]` — library-only, no Base UI primitive
- Note: Fresh interview per `.claude/component-interview-todo.md`. The 2026-09-23 guide was retroactive (derived from code); this run interviews the owner in earnest and re-decides everything.
- Base UI version documented from: `@base-ui/react` 1.8.0

## 1. Rendering surface (no Base UI primitive)

- [x] Q1: No Base UI icon primitive exists. Icon stays a plain `<span>` wrapper (not `useRender`), so it takes no `render` prop — or should it join Card/Alert/Text on `useRender`?
  > Keep plain span
- [x] Q2: Native `span` props pass through (`ComponentProps<'span'>`), and the component manages `role`/`aria-*` itself from `label`?
  > Confirmed

## 2. Extension props

- [ ] Q3: `variant` — `'default' | 'secondary' | 'accent'`; omitting it inherits surrounding text color (`currentColor`)?
- [ ] Q4: `size` — any CSS length, applied as private `--_size`, defaulting to surrounding font size (`1em`)?
- [ ] Q5: `label` — accessible name; present → `role="img"` + `aria-label`, absent → `aria-hidden`?

## 3. Token mapping & usage rules

- [ ] Q6: Variants map to `hds/sem/icon/color/{default,secondary,accent}/fg`; Icon category has no measure token (size comes from the `size` prop)?
- [ ] Q7: Usage rule — omit `variant` inside Button/Alert so the icon matches the text; SVG must draw with `currentColor`; `<img>` for content images?

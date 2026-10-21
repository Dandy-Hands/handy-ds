---
name: "hds-component-docs"
description: "Write the owner-facing MDX component doc with live examples for every visual axis and prop."
version: 3
created: "2026-09-22"
updated: "2026-09-24"
---
## When to Use
Use when the user asks to write the human-facing component documentation, or after `hds-component-code` has built the component and the live examples are ready.

## Procedure
1. Read the reviewed internal spec at `docs/component-specs/<component>/spec.md`, the API doc at `docs/api/<component>.md`, and the API doc conventions at `.pi/specs/component-build-process-2026-09-21/research/api-doc-conventions.md`.
2. Confirm the internal spec status block has `spec: reviewed` and `code: built`; stop if not. Confirm `src/components/<Component>.tsx` exists and `npm run build` passes.
3. Create or update `docs/components/<component>.mdx` from the template `docs/templates/component.mdx`, keeping its section order: frontmatter (`title`, `order`), title, description, live hero example, Usage, Base UI API table, Extension API (props) table, one section per visual prop with live examples, Anatomy (parts → tokens), Owner notes.
4. Place one live hero example directly under the description, before Usage — a representative snippet of the component in context.
5. Fill in the Usage section (when to use / when not to use) in plain language.
6. Fill in the Base UI API table from the spec's Base UI API section (what is exposed, kept, or left undocumented), then the Extension API table from the API doc. Non-visual props (event handlers, ids, refs) appear in the Extension API table only — never get their own section.
7. For every visual axis or prop in the spec (variant, tone, size, disabled, etc.), add a section that: names the axis, explains what it controls, and shows a live example for each allowed value.
8. Add an Anatomy section mapping parts to semantic tokens, and an Owner notes section for Base UI mapping, extension decisions, known constraints, and accessibility.
9. Run `cd docs-site && npm run build` and fix any MDX or import errors.
10. Run `npm run test:e2e` and fix failures. The page test (`e2e/pages.spec.ts`) fails on any page error or console error. The component test is `e2e/<component>.spec.ts`.
11. If the component is new, ensure `docs/api/index.md` links to `docs/api/<component>.md`.
12. Set `docs: built` in the internal spec status block and stop. Do not change the other lines.

## Pitfalls
- Every compound-family example must include the family's Root part. Base UI part components consume a root context and throw at render time if it is missing (e.g. `ContextMenu.Trigger` outside `ContextMenu.Root`, `Select.Trigger` outside `Select.Root`, `Field.Item`/`Field.Label` outside `Field.Root`). Even when Root appears boilerplate — e.g. a context menu's trigger is not a button — it is required: it owns open state and provides the context. Render the full tree Root → Trigger → Portal → Positioner → Popup in every live example.
- Any demo component referenced in JSX must be defined (via `export function X()` in the MDX) or imported in the same file. An undefined reference throws `missingMdxReference` at render time, not build time.
- MDX compiles as plain JavaScript, not TypeScript. No `as const`, no type annotations, no generics in MDX demo code.
- Never leave a live demo's JSX in a separate orphan .tsx file — if the demo needs code, inline it in the MDX or import a sibling that actually exports it.
- Verification before DONE: run `npm test` at the repo root. The `src/docs-render.test.ts` suite server-renders every `docs/components/*.mdx` page and fails on any render error, including all the cases above. A passing docs-site `npm run build` does NOT prove the pages render — MDX compile success and runtime render are different.
## Verification
1. `docs/components/<component>.mdx` exists and contains frontmatter with `title` and `order`.
2. The MDX file follows `docs/templates/component.mdx`: hero example under the description, Usage section, Base UI API table, Extension API table, and a live-example section for every visual axis/prop from the spec.
3. Every live example imports the component from `handy-ds` and renders without crashing.
4. `cd docs-site && npm run build` exits 0.
5. `npm run test:e2e` exits 0.
6. The internal spec status block has `docs: built` before this skill stops.
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

`handy-ds` — a shared, multi-tenant component library. One component library, re-themed per client via a small set of driver inputs. Used internally to build client web apps and headless-WordPress front ends fast; clients never touch it directly.

The original build plan (waves 1–6) is done: token pipeline, all components, docs, and platform examples. Judgment calls and open questions are in `.claude/decisions.md`; review those before changing a decision.

## Working rules

When you spot a problem outside the task at hand, tell the user and ask whether to fix it — don't fix it unasked.

`.claude/TODO.md` is the running work list. When the user asks for new work, add it there. Before you start a task, check the list: if the task is already checked off, tell the user before you redo it. Check an item off when its work is done.

## Specs

`.claude/specs/` holds the source material Claude uses to produce everything else in this repo. Not shipped code — read before building.

- `.claude/specs/design-system-vision-spec.md` — product-level vision: scope (headless WordPress + PWA), tech stack (React + Base UI + plain CSS custom properties, no Tailwind), the three-layer theming model (drivers → primitives → semantic tokens), drivers-only theme control (palette color picks per use, no mapping level), the driver interface, the component process, and success criteria for v1.
- `.claude/specs/driver-interface-spec.md` — draft design of the driver interface (theme-building tool): a palette part and an application part per token type, step order, open questions.
- `.claude/specs/token-system-spec.md` — the token system design in detail (rewritten 2026-10-07): the four-layer pipeline (Drivers → Primitives → Semantic Tokens → Components), the full driver list with defaults, the OKLCH hue-wheel palette and role map, pick drivers and pick rules (states, dark overrides, WCAG AA), modes and brand contexts (`on-primary`, `on-secondary`), the `hds` naming grammar, and the full semantic token set. Component mapping is left to each component's spec interview.
- `.claude/specs/token-rework-interview.md` — the decision record for the token spec: each decision, who made it, and the rejected options.

Read the specs in full before creating any token, category, resolver, or component-file convention. Where implementation and spec disagree, the spec wins unless the user says otherwise. Section 9 of `token-system-spec.md` ("Not Done Yet") lists open gaps — expect to make judgment calls there and flag them.

**Provisional component mapping.** Component CSS reads the new token names through a provisional mapping from the previous spec (token spec section 9, item 5). Each component's re-interview confirms its mapping.

## Tooling

- TypeScript, ESM (`"type": "module"`). Node runs `.ts` directly (type stripping), so imports use `.ts` extensions and only erasable TS syntax (`erasableSyntaxOnly`).
- `npm test` — `tsc` typecheck, then `node --test 'src/**/*.test.ts'`. No test framework; add one only when a real need appears. Component render tests run through Vite's `ssrLoadModule` (node can't import `.tsx`/`.css`).
- `npm run build` — runs `npm test`, then Vite library mode (`dist/index.js`, `tokens.js`, `styles.css`, `theme.css`), then `.d.ts` via `tsconfig.build.json`. The build fails if a component references a primitive.
- `npm run dev` — docs site at `docs-site/` (component docs plus live theming flyout). No `@vitejs/plugin-react` at the root; the docs site uses its own Vite config.
- No lint config.
- `bin/hds-theme.js` — client CLI: `hds-theme theme.config.js > theme.css`. The config's default export is a driver config. Contrast failures → stderr, exit 1.
- `examples/wordpress`, `examples/pwa` — standalone Vite apps installing the package via `file:../..`; run `npm run build` at the root first.
- `src/tokens/` — drivers → primitives (hue wheel, light and dark palettes) → color picks (`picks.ts`) → CSS (`buildTheme()`, with modes, contexts, sections), contrast checker, and `checkTokenName()` (validate slash form, never emitted CSS names).

## Docs

- `docs/component-conventions.md` — how every component is built; follow it for new components.
- `docs/rules.md` — agent-facing rules for building client apps (component choice, drivers, mapping, contexts).

## Core architectural rule

Token pipeline: **Drivers → Primitives → Semantic Tokens → Components**.

- Drivers are the only client inputs: palette drivers (brand colors, density, type scale, radius, etc.) and pick drivers (which primitive each semantic token uses). No mapping level. Full list: token spec section 3.
- Primitives are generated from drivers, never hand-set. Namespace: `hds/prim/{type}/{scale}/[{step}]` (e.g. `hds/prim/color/primary/600`). Semantic tokens point at role aliases (`primary`, `danger`, `neutral`, ...), never at hue slots, except data visualization.
- Semantic tokens point at primitives and are named by purpose, not value. Namespace: `hds/sem/{type}/[category]/[axis]/[state]/{property}` (e.g. `hds/sem/color/action/primary/hover/bg`). Types: `color`, `measure`, `radius`, `border`, `elevation`, `typography`. Only `color` has a category.
- Components read **semantic tokens only**, via CSS custom properties. A component must never reference a driver or primitive value directly — this is the invariant that makes a full theme swap require zero component changes.

Color categories are fixed: Action, Field, Surface, Content, Graphic, Feedback, Focus, Overlay (token-system-spec.md section 7.1). Composite components (Select, Menu, Tabs, Data Table, etc.) are not their own category — they compose tokens from these categories. Each component's spec interview records its token mapping (spec section 8).

## Base UI

Installed package is `@base-ui/react` (current name — not the older `@base-ui-components/react`), version 1.8.0. It ships per-component subpaths under `node_modules/@base-ui/react/` (e.g. `button`, `field`, `dialog`, `combobox`). Confirm exact subpath import syntax against current docs before use — don't assume from memory or older examples referencing the renamed package.

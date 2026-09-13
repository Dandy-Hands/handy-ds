# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

`handy-ds` — a shared, multi-tenant component library. One component library, re-themed per client via a small set of driver inputs. Used internally to build client web apps and headless-WordPress front ends fast; clients never touch it directly.

Waves 1–6 of `.claude/phased-plan.md` are built: token pipeline, all components, docs, and platform examples. Judgment calls and open questions are in `.claude/decisions.md`; review those before changing a decision.

## Working rules

When you spot a problem outside the task at hand, tell the user and ask whether to fix it — don't fix it unasked.

## Specs

`.claude/specs/` holds the source material Claude uses to produce everything else in this repo. Not shipped code — read before building.

- `.claude/specs/design-system-vision-spec.md` — product-level vision: scope (headless WordPress + PWA), tech stack (React + Base UI + plain CSS custom properties, no Tailwind), the three-layer theming model (drivers → primitives → semantic tokens), the two levels of theme control (driver-level vs. mapping-level), and success criteria for v1.
- `.claude/specs/token-system-spec.md` — the token system design in detail: the same four-layer pipeline (Drivers → Primitives → Semantic Tokens → Components), the `hds` namespace and naming grammar for primitive and semantic token names, the context-override mechanism (`data-context="on-primary"`), the category/type/axis/state model, a full demo token tree, and Base UI → category mapping tables for composite components.

Read both specs in full before creating any token, category, resolver, or component-file convention. Where implementation and spec disagree, the spec wins unless the user says otherwise. Section 10 of `token-system-spec.md` ("Not Done Yet") lists open gaps — expect to make judgment calls there and flag them.

## Tooling

- TypeScript, ESM (`"type": "module"`). Node runs `.ts` directly (type stripping), so imports use `.ts` extensions and only erasable TS syntax (`erasableSyntaxOnly`).
- `npm test` — `tsc` typecheck, then `node --test 'src/**/*.test.ts'`. No test framework; add one only when a real need appears. Component render tests run through Vite's `ssrLoadModule` (node can't import `.tsx`/`.css`).
- `npm run build` — runs `npm test`, then Vite library mode (`dist/index.js`, `tokens.js`, `styles.css`, `theme.css`), then `.d.ts` via `tsconfig.build.json`. The build fails if a component references a primitive.
- `npm run dev` — Vite demo page at `demo/`. No `@vitejs/plugin-react`; Vite compiles JSX from `tsconfig.json` (`"jsx": "react-jsx"`).
- No lint config.
- `bin/hds-theme.js` — client CLI: `hds-theme theme.config.js > theme.css` (contrast failures → stderr, exit 1).
- `examples/wordpress`, `examples/pwa` — standalone Vite apps installing the package via `file:../..`; run `npm run build` at the root first.
- `src/tokens/` — drivers → primitives → Theme Map → CSS (`buildTheme()`), contrast checker, and `checkTokenName()` (validate slash form, never emitted CSS names).

## Docs

- `docs/component-conventions.md` — how every component is built; follow it for new components.
- `docs/rules.md` — agent-facing rules for building client apps (component choice, drivers, mapping, contexts).

## Core architectural rule

Token pipeline: **Drivers → Primitives → Semantic Tokens → Components**.

- Drivers are hand-set inputs (brand color, density, type scale, border radius, etc.) — see spec section 6 for the starting driver list.
- Primitives are generated from drivers, never hand-set. Namespace: `hds/prim/{type}/{property}` (e.g. `hds/prim/color/primary/600`).
- Semantic tokens point at primitives and are named by purpose, not value. Namespace: `hds/sem/{category}/{type}/[axis]/[state]/{property}` (e.g. `hds/sem/action/color/primary/hover/bg`).
- Components read **semantic tokens only**, via CSS custom properties. A component must never reference a driver or primitive value directly — this is the invariant that makes a full theme swap require zero component changes.

Categories are fixed: Action, Input/Field, Surface, Type, Icon, Divider, Feedback, Overlay, Focus (token-system-spec.md section 4). Composite components (Select, Menu, Tabs, Data Table, etc.) are not their own category — they compose tokens from these categories per the mapping tables in spec section 9.

## Base UI

Installed package is `@base-ui/react` (current name — not the older `@base-ui-components/react`), version 1.8.0. It ships per-component subpaths under `node_modules/@base-ui/react/` (e.g. `button`, `field`, `dialog`, `combobox`). Confirm exact subpath import syntax against current docs before use — don't assume from memory or older examples referencing the renamed package.

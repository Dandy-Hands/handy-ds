# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this repo is

`handy-ds` — a shared, multi-tenant component library. One component library, re-themed per client via a small set of driver inputs. Used internally to build client web apps and headless-WordPress front ends fast; clients never touch it directly.

Nothing is built yet. This is a fresh start — no components, no token implementation, no build tooling. Only `@base-ui/react` is installed as a dependency.

## Specs

`.claude/specs/` holds the source material Claude uses to produce everything else in this repo. Not shipped code — read before building.

- `.claude/specs/token-system-spec.md` — the token system design: four-layer pipeline (Drivers → Primitives → Semantic Tokens → Components), naming scheme, context/override mechanism. Authoritative for any token or naming decision.
- `.claude/specs/design-system-vision-spec.md` — currently empty (0 bytes).

Read `token-system-spec.md` in full before creating any token, category, or resolver logic. Where implementation and spec disagree, the spec wins unless the user says otherwise.

## No build tooling yet

No `package.json` beyond the bare dependency, no `tsconfig.json`, no bundler, no test runner, no lint config, and this is not a git repository. Do not claim to have run, built, or tested anything until that tooling exists. If a task needs execution, scaffold the tooling first and say so.

## Base UI

Installed package is `@base-ui/react` (current name — not the older `@base-ui-components/react`). Confirm subpath imports (e.g. `@base-ui/react/button`, `@base-ui/react/field`) against current docs before use; don't assume from memory or older examples.

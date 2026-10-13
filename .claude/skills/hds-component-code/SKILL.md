---
name: "hds-component-code"
description: "Build the code for a handy-ds component from its reviewed internal spec."
version: 1
created: "2026-09-22"
updated: "2026-09-22"
---
## When to Use
Use when the user asks to build the code for a handy-ds component, or when the internal spec is reviewed and code is the next step.

## Procedure
1. Read the reviewed internal spec at `docs/component-specs/<component>/spec.md`, `docs/component-conventions.md`, and `docs/api-conventions.md` (prop names, types, and values).
2. Record the Base UI version from `package.json` (`@base-ui/react`) in the component's source header comment.
3. Create `src/components/<Component>.tsx` (plus `<Component>.css` if it needs its own layout rules), one family per file, using Base UI primitives and only `--hds-sem-*` semantic tokens. Export it from `src/index.ts` under its category heading.
4. Run `npm test` and fix failures.
5. Run `npm run build` and fix failures.
6. If the component adds behavior that Base UI does not provide (for example a fallback delay or a line clamp), write `e2e/<component>.spec.ts`: a Playwright test that checks that behavior on its docs page. Skip this step for a plain wrapper. Base UI already tests its own behavior. If the docs page does not exist yet, tell the user the test waits for the docs step.
7. If you wrote an `e2e` test, run `npm run test:e2e` and fix failures in the component.
8. Set `code: built` in the internal spec status block and stop. Do not change the other lines.

## Pitfalls
- Do not start unless the status block has `spec: reviewed`.
- Do not reference `hds/prim/...` tokens or driver values directly.
- Do not invent props or tokens not in the spec.
- Do not write the API doc or human MDX doc — those are separate skills.

## Verification
1. `src/components/<Component>.tsx` exists and is exported from `src/index.ts`.
2. `npm test` exits 0.
3. `npm run build` exits 0.
4. If the component adds its own behavior, `e2e/<component>.spec.ts` exists and `npm run test:e2e -- <component>` exits 0.
5. `grep -E "hds-prim-|hds/prim/|hds/driver" src/components/<Component>.*` returns nothing.
6. The internal spec status block has `code: built` before this skill stops.
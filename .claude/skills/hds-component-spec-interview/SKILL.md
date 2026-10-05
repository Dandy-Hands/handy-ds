---
name: "hds-component-spec-interview"
description: "Run Phase 1 for a handy-ds component: interview the user about a Base UI component, then write the internal spec and outward API doc."
version: 4
created: "2026-09-22"
updated: "2026-09-22"
---
## When to Use
Use when the user wants to spec a new handy-ds component that starts from a Base UI primitive, asks what a component's API should be, or names a Base UI component to start on. Stop when the internal spec is reviewed and the API doc is written — do not write code.

## Procedure
1. Read the process spec at `.pi/specs/component-build-process-2026-09-21/spec.md`, the API doc conventions at `.pi/specs/component-build-process-2026-09-21/research/api-doc-conventions.md`, `docs/component-conventions.md`, and `.claude/specs/token-system-spec.md`.
2. Create the component folders: `docs/component-specs/<component>/` and prepare `docs/api/<component>.md`.
3. Write an interview guide in `docs/component-specs/<component>/interview-guide-<YYYY-MM-DD>.md` with slots for Base UI props, extension props, and token mapping.
4. For each Base UI prop/behavior, ask the user whether to expose, rename, wrap, or omit it. Record the decision verbatim.
5. Propose a list of extension/additional props. Let the user add, remove, or modify them.
6. Define each exposed and extension prop: type, default, description, and the semantic tokens it maps to.
7. Write the internal spec to `docs/component-specs/<component>/spec.md` with sections: Description, Usage, Base UI API, Extension API, Token mapping.
8. Write the API doc to `docs/api/<component>.md` using the conventions in `research/api-doc-conventions.md`: Usage statement, Props table with per-value definitions, 1–2 Examples, optional Contexts. Do not mention Base UI or list omitted props.
9. Update `docs/api/index.md` (or create it) with the component name, one-line purpose, usage statement, and link to `docs/api/<component>.md`.
10. Add the status block at the top of the internal spec, then stop:
   ```
   Status:
   - spec: reviewed
   - code: pending
   - figma: pending
   - docs: pending
   ```
   Each later skill sets only its own line. Hand off to `hds-component-code`, `hds-component-figma` (can run in parallel with code), and `hds-component-docs` (runs after code is built).
## Pitfalls
- Do not write component code or Figma files — this skill ends at reviewed spec.
- Do not expose Base UI internals in the API doc; the building agent does not know Base UI is underneath.
- Do not list omitted Base UI props in the API doc.
- Never map props to `hds/prim/...` or driver values — only `hds/sem/...` tokens.
- Do not skip the per-prop user confirmation for exposed Base UI behavior.

## Verification
1. `docs/component-specs/<component>/spec.md` exists and contains `## Description`, `## Usage`, `## Base UI API`, `## Extension API`, and `## Token mapping`.
2. `docs/api/<component>.md` exists and contains `## Usage`, `## Props`, and `## Examples`.
3. `docs/api/<component>.md` does not contain `Base UI`, `base-ui`, `@base-ui/react`, raw `hds/prim/` values, or lists of omitted props.
4. The Props table in `docs/api/<component>.md` includes per-value definitions for every union/enum prop.
5. `docs/api/index.md` exists and links to `docs/api/<component>.md` with a usage statement.
6. The internal spec status block has `spec: reviewed` and the other three lines `pending` before this skill stops.
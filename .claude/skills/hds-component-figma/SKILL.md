---
name: "hds-component-figma"
description: "Build or update the Figma component for a handy-ds component from its reviewed internal spec."
version: 1
created: "2026-09-22"
updated: "2026-09-22"
---
## When to Use
Use when the user asks to build or update the Figma component, or when the internal spec is reviewed and Figma is the next step. Can run in parallel with `hds-component-code`.

## Procedure
1. Read the reviewed internal spec at `docs/component-specs/<component>/spec.md`.
2. Open the project's Figma library and create or update the `<component>` page/section.
3. Build every visual state named in the spec (variants, tones, sizes, disabled, etc.) using the semantic tokens from the token mapping.
4. Name layers and states clearly so they map 1:1 to the spec.
5. Set `figma: built` in the internal spec status block and stop. Do not change the other lines.

## Pitfalls
- Do not start unless the status block has `spec: reviewed`.
- Do not silently skip Figma — even a placeholder section must exist and match the spec.
- Do not invent visual states or tokens not in the spec.

## Verification
1. The Figma file/section for `<component>` exists.
2. Every visual state in the spec has a matching named Figma state.
3. Only `hds/sem/...` token values (or their design-system equivalents) are used in Figma.
4. The internal spec status block has `figma: built` before this skill stops.
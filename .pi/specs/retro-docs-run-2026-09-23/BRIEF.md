# BRIEF: Retroactive component docs run (2026-09-23)

You are one of several parallel agents. Each owns one component group. Owner is **absent** — this run was ordered by the owner in advance. Do not call `ask_question`. Do not stop for review. Push when done.

## Your job (per component family in your group)

For each component family (e.g. `Dialog` = Dialog + AlertDialog, one family per source file):

1. **Retroactive interview guide** — `docs/component-specs/<family>/interview-guide-2026-09-23.md`
   - Header:
     ```
     # Interview Guide: <Family> component (retroactive)
     - Status: complete
     - Started: 2026-09-23
     - Component: <Family> (`src/components/<File>.tsx`)
     - Note: Retroactive guide. Owner directed the interview be skipped for this run; every answer below is derived from the existing component code and `.claude/decisions.md` (cite which).
     - Base UI version documented from: `@base-ui/react` 1.8.0
     ```
   - Sections like the Button guide (`docs/component-specs/button/interview-guide-2026-09-21.md`): existing-surface confirmations, extension props, token mapping. Each question gets a checked box and a `> answer` line citing the code line or decisions.md entry that justifies it. 6–12 questions per family.

2. **Internal spec** — `docs/component-specs/<family>/spec.md`
   - Follow `hds-component-spec-interview` skill steps 7–8 exactly: sections `## Description`, `## Usage`, `## Base UI API`, `## Extension API`, `## Token mapping`.
   - The component code is the reviewed answer. Where code and spec disagree, code wins and you flag it in your final report.
   - Set `- Status: docs-built` only after step 4 below passes. Until then use `- Status: reviewed (retroactive; owner pre-approved, interview skipped)`.

3. **API doc** — `docs/api/<family-kebab>.md`
   - Follow the conventions at `.pi/specs/component-build-process-2026-09-21/research/api-doc-conventions.md`: `## Usage` (2–3 sentences, when/when-not), `## Props` table (Prop/Type/Default/Description, per-value definitions for every union), `## Examples` (1–2 realistic snippets), optional `## Contexts`.
   - NEVER mention Base UI, `@base-ui/react`, `hds/prim/` values, or omitted props. Only `hds/sem/...` tokens if tokens appear at all.
   - Do NOT edit `docs/api/index.md` — the coordinator registers pages centrally. Include your proposed index table row in your final report.

4. **Owner MDX doc** — `docs/components/<family-kebab>.mdx`
   - Follow the `hds-component-docs` skill exactly: template `docs/templates/component.mdx`, section order, Props table, one live-example section per visual axis with one example per allowed value, Anatomy (parts → semantic tokens), Owner notes.
   - Live examples import from `'handy-ds'` exactly as `docs/components/button.mdx` does — copy its import/theme-injection pattern verbatim.
   - Verify: `cd docs-site && npm run build` exits 0 (node_modules is symlinked; do not reinstall). If the build fails on YOUR files, fix them. If it fails on another group's files, note it and move on.

## Reads (before writing anything)

- `CLAUDE.md`, `docs/component-conventions.md`, `docs/components.md` (your families' entries — they state each prop's intent)
- `.claude/specs/token-system-spec.md` sections 4, 7, 9 (categories, token trees, part tables)
- `.claude/decisions.md` (Wave 5 section especially — many per-component decisions are recorded there)
- The three finished precedents end-to-end: `docs/component-specs/text/`, `docs/api/text.md`, `docs/components/text.mdx`
- Your components' source: `src/components/<File>.tsx` + `.css`
- The two skills: `hds-component-spec-interview`, `hds-component-docs` (passed via `--skill`)

## Rules

- Components read only `hds/sem/...` tokens — never write `hds/prim/` anywhere in docs.
- One family per API doc page and per spec dir. Kebab-case filenames (`number-field.md`).
- Do not touch: `docs/api/index.md`, `docs/components.md`, `src/**`, other groups' files, `package.json`.
- Commit message: `docs(<family>): retroactive spec, API doc, and owner MDX` — one commit per family, or one commit for the group if families are small.
- Do not push to `main`. Push your branch: `git push -u origin docs/<group-slug>`.

## Final report (last message, exactly this shape)

```
DONE <group-slug>
branch: docs/<group-slug> (pushed)
families: <comma list>
index rows:
| <Family> | <one-line purpose> | <use-when> | [<file>.md](<file>.md) |
decisions needing review: <list or "none">
build: <docs-site build result>
```

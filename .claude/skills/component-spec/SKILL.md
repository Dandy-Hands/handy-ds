---
name: component-spec
description: Draft and review a handy-ds component spec in .claude/specs/components/. Stops for the user's answers, then marks the spec reviewed. Use when the user asks to spec a component, asks what a component's API should be, or names a Base UI component to start on. Does not write code — the component-build skill does that.
---

# Component spec

A component goes spec → review → code and Figma. This skill covers spec and review only. When the spec reaches `Status: reviewed`, stop. `component-build` writes the code and `component-figma` builds the Figma component; they are independent and run in either order.

The rules live in two docs. This skill tells you when to apply them:

- `docs/component-conventions.md`. It says how components are built (CSS, axes, states, TypeScript, allowed tokens). Citations look like (conventions, Heading).
- `docs/rules.md`. It tells client app builders what each component does. Citations look like (rules, Heading).

## Stage 1: Draft

1. **Find the source.** Does `node_modules/@base-ui/react/docs/react/components/{kebab-name}.md` exist? ({kebab-name} = the component's kebab-case name. It matches the doc filename.)
   - **Yes:** Read the doc. It should match the installed version. Do not use memory or web results.
   - **No:** The component has no Base UI part. Design the specs yourself:
     - Use the template tables for sections 2 and 3. Put your design in them.
     - Put `Proposed` in the title of each section 3 subsection. Example: `### Alert — Proposed`. This mark means the content has no source. The user must confirm it in stage 2.
     - Add each design decision to section 7 as a question. The user confirms each one in stage 2.
2. Read `.claude/specs/token-system-spec.md` sections 4, 7, and 9. They give the category, axis, and part mapping. Use only the tokens that the category assigns (conventions, Tokens a Component May Use).
3. Read the earlier answers. They live in two places: the component row in `docs/rules.md` section 4, and the entry in `.claude/decisions.md`. The decisions entry might not exist.
4. **If the component already exists in `src/components/`,** read it. Write its current props into section 3 as `Base UI` or `HDS` rows, and add a section 7 question for each difference between the code and the sources above.
5. Write `.claude/specs/components/{kebab-name}.md` from the template below.
   - Sections 1–4 contain facts from the sources above. Do not invent content. Write section 1's "when to use" from the rules.md row. If no row exists, use the Base UI doc. If the component has no Base UI part, add a section 7 question for it.
   - In section 4, map each spec state to a Base UI data attribute or a CSS pseudo-class (conventions, CSS). Do not use a custom state class. If the token spec and Base UI disagree, write the conflict in section 4. Examples: an axis has no Base UI prop, or Base UI cannot reach a spec state. Also add a question to section 7.
   - In section 3, write only the Base UI props. Leave the HDS props for stage 2. Put each candidate HDS prop in section 7 as a question.
   - Leave section 5 empty. The `component-figma` skill fills it.
   - In section 7, write each earlier answer from step 3 under its question. Mark it `Prior answer (source):`.
6. Stop. Tell the user that the spec is ready for review. List the section 7 questions.

Example: `.claude/specs/components/button.md` (Base UI branch only).

## Stage 2: Review

For each section 7 question, the user decides. Record the decision:

- If the user accepts an addition, write it as a props row in its part's section 3 table. Set `Source` to `HDS`. Give the reason and the emitted attribute in the Notes column.
- If the user rejects an addition, write it in that part's **Not added** table with the reason.
- Tell the user to reject an addition that re-implements behavior Base UI already provides. Wrap the part. Do not rebuild its behavior.
- Compound parts (Select, Menu, Dialog): rules.md tells client builders that compound parts keep Base UI's props. An addition either drops, or the user approves a change to that rule. Mark the conflict in section 7 until the decision.
- A new token or axis changes the token spec. Mark it in section 7. Do not edit `token-system-spec.md` without approval.

When you finish the review, delete the answered questions from section 7. Set `Status: reviewed`.

Stop. Tell the user the spec is reviewed, and name the two skills that build from it: `component-build` (code) and `component-figma` (Figma).

## Template

```markdown
# {Component} — Component Spec

Status: draft | reviewed | built
Figma: not built | built
Base UI: `@base-ui/react/{kebab-name}` 1.8.0 (or: none, `useRender`)
Source: `node_modules/@base-ui/react/docs/react/components/{kebab-name}.md` (or: none, proposed below)

## 1. Purpose

Write one line from the Base UI subtitle. Write one line about when to use the component. Write one line about when to not use it.

## 2. Anatomy

| Part | Renders | Required | Notes |
|---|---|---|---|

(JSX anatomy snippet, from the Base UI doc or proposed)

## 3. API

Write one subsection for each part. Copy the Base UI props from the Base UI doc. Add the HDS props in the same table. Do not write `className`, `style`, or `render` rows. Every part has these props.

The `Source` column says where a prop comes from: `Base UI` or `HDS`. For an HDS prop, the Notes must give the reason for it and the attribute it emits. An axis prop `{axis}` emits `data-{axis}`. Example: `priority` emits `data-priority`.

### {Part}

**Props**

| Prop | Type | Values | Default | Source | Notes |
|---|---|---|---|---|---|

**Data attributes**

| Attribute | Values | Meaning |
|---|---|---|

**CSS variables** (only if Base UI sets any)

| Variable | Meaning |
|---|---|

**Not added** (only if the review rejected a prop)

| Prop | Why not |
|---|---|

## 4. Token mapping

| Part | Category | Axis | Tokens read |
|---|---|---|---|

**States**

| Spec state | Source |
|---|---|

## 5. Figma mapping

| Figma property | Kind | Values | Code prop |
|---|---|---|---|

## 6. Accessibility

Write Base UI usage notes and accessibility notes. Write only notes that affect the wrapper.

## 7. Open questions

-
```

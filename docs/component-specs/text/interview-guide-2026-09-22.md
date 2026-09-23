# Interview Guide: Text component internal spec

- Status: complete
- Started: 2026-09-22
- Component: `Text` (`src/components/Text.tsx` + `Text.css`)
- Base: existing component, no Base UI primitive — `useRender` + `mergeProps`
- Base UI version documented from: `@base-ui/react` 1.8.0
- Source of truth: existing code, `token-system-spec.md` section 7 (Type), brainstorm 2026-09-22 (role × size axis)

## 1. Existing surface (confirmations)
Goal: confirm what the current component already decides, so the spec describes reality.

- [x] Q5: Keep the existing prop surface as-is (variant with 5 roles, default tag map, render override, all standard props flowing through) with nothing added or removed besides the new size axis?
  > Yes — confirm as-is
- [x] Q6: In the outward API doc, list `variant`, `size`, `render`, `children`, and the standard-attributes note — and say nothing about internals. Correct?
  > Yes — confirm as-is

## 2. Size axis
Goal: decide the shape, applicability, and token names of the new size axis.

- [x] Q1: Size axis shape — named steps (s/m/l, M3-style) vs scale steps (size={1..7} mapped to the scale primitives)?
  > A: Numeric steps per role. Resolved by Q7 + owner clarification: Display has a 1, 2, or 3; headline also has a 1, 2, 3 — not the same absolute size across roles, the numbers just pair well together.
- [x] Q2: Step count and direction — how many numeric steps per role, does 1 mean largest or smallest, and what is the default when `size` is unset?
  > 3 steps, 1 = smallest
- [x] Q3: Keep weights fixed per role, or also expose a `weight` prop?
  > Picture this. We have a hero with a short bit of display text, like a tag line, on website. Say we want to bold or emphasize a few words in it. Or animate part of it. How do you suppose we do that?
  > Resolution via Q8: no `weight` prop — weights stay fixed per role; inline emphasis is plain `<strong>`/`<em>`/`<span>` with browser-default styling; animation is a plain span with client CSS.
- [x] Q4: Token mapping — token shape for per-role numeric steps (depends on Q2). Current role-level tokens stay as the unset default.
  > By but that is messy. what does /1/ mean, shouldn't it just be --hds-sem-type-measure-heading-1-font-size?
- [x] Q7: Size semantics — is `size` an absolute step on the shared scale, or a role-relative shift? (opened by Q1's cross-role pairing requirement)
  > A: Role-relative band. Clarification: Display has a 1, 2, or 3; headline also has a 1, 2, 3 — not the same size, they just may pair well together.
- [x] Q8: Inline emphasis mechanism — plain `<strong>`/`<em>`/`<span>` in children with browser-default emphasis, or tokenized emphasis (new per-role token styling `strong`/`em` inside `.hds-text`)? (opened by Q3 hero-tagline scenario)
  > Plain HTML, browser default
- [x] Q9: Property name — keep `size` in Type measure tokens (grammar-wide) or rename to `font-size`? (opened by Q4)
  > Keep `size` (my lean)

## Answers

(recorded per question)

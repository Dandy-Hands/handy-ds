# Text — Spec Re-Interview Guide (2026-10-12)

Full Phase 1 re-run after the token rework and the `heading` → `headline` role rename.
Dry-run spec: `spec.md` (2026-09-22). No Base UI primitive — `useRender` + `mergeProps`
over `useRender.ComponentProps<'p'>`. This interview confirms the provisional token
mapping and settles the open `size` naming conflict in `docs/api-conventions.md` section 6.

Base UI version documented from: `@base-ui/react` 1.8.0.

## 1. Rendering surface

- [x] Q1: Keep `useRender` with the `render` prop, the default element per role
  (display `h1`, headline `h2`, body `p`, label `span`, caption `small`), and full
  passthrough of native props. Remove `style` from the type (API conventions section 1).
  > "Keep as is (Recommended)".

## 2. Role axis

- [x] Q2: Keep `variant` with the five roles `display`, `headline`, `body`, `label`,
  `caption`. Default `body`.
  > "Keep five roles (Recommended)".

## 3. Size

- [x] Q3: Size prop name and values. The token slot is `typography/{role}/{sm|md|lg}`,
  so the slot rule gives `sm`, `md`, `lg`. The current prop is `size={1|2|3}`.
  `size` means a `measure/size` step elsewhere, so `size="sm"` on Text breaks
  "one name, one meaning".
  > "The size value name matches a semantic token which is used for the line. In other
  > words, the size value is the line height, which is driven by the semantic size token."
  > Q3a (Claude restated the model: `size` takes a measure step that sets the line height;
  > flagged that measure steps are px and density-scaled while font sizes are rem, so
  > large browser text overlaps lines): "Line height in em (Recommended)".
  > Result: `size="sm" | "md" | "lg"` reads `typography/{role}/{size}/*`. Line height
  > stays the leading token × font size. Recorded exception: on Text, `size` picks a
  > typography step, not a measure step.

## 4. Color

- [x] Q4: Add a `tone` prop for text color (API conventions section 6 lists Text
  under the Content `tone` axis). Unset = the role's default color.
  > "tone: Content + Feedback". Values: `strong`, `default`, `muted`, `accent`
  > (`color/content/{tone}/fg`) and `danger`, `warning`, `success`, `info`
  > (`color/feedback/{tone}/fg`). `link` left out. Caveat given: feedback fg is
  > contrast-checked on feedback bg only.
  > Q4a: "Add a TODO item (Recommended)". The spec notes the gap until the check exists.

## 5. Extension props

- [x] Q5: Other props. Proposed: none. Rejected in the dry run: `weight`, tokenized
  emphasis. Not proposed (no second use yet): `align`, `truncate`, line clamp.
  > "If we don't have one already add a max lines prompt, which turns on truncation.
  > When trunk added a tool tip appears."
  > Read as: a `maxLines` prop that clamps the text with an ellipsis; when the text is
  > cut, a tooltip shows the full text.
  > Q5a (value type; Claude cited the no-raw-numbers rule): "When writing the API
  > conventions, I was not asked about the raw number rules. And I think that's a stupid
  > rule. There's plenty of cases when we would want to use wrong numbers. But there are
  > cases when they're forbidden. We need to be more judicious and specific about that
  > rule." Result: `maxLines` takes a number. The rule in `docs/api-conventions.md`
  > section 4 gets rewritten with the user (TODO item).
  > Q5b (tooltip; no Tooltip component yet, and plain text is not focusable): "Wait for
  > Tooltip spec (Recommended)". Result: cut text gets a native `title` with the full
  > text; swap to Tooltip after the Tooltip interview.
  > Q5c (allowed counts): "Any whole number ≥ 1 (Recommended)".
  > No other props: `align`, `truncate` (covered by `maxLines={1}`) and `weight` not added.

## 6. Token mapping

- [x] Q6: Family and weight per size step. The token spec emits `family` and `weight`
  for `sm` and `lg` too. The dry-run CSS reads them from `md` only.
  > Two answers were misclicks ("md only", then "Remove sm/lg family and weight").
  > User's actual answer: "the only typography size tokens there should be is related to
  > font size. Everything else weight family line height letter spacing just goes to
  > role."
  > Result (token structure change): per role, one `family`, `weight`, `leading` and
  > `tracking`; per role and size step, only `size`. Leading is unitless and tracking is
  > in `em`, so both follow each step's font size. 5 roles × 4 + 5 roles × 3 = 35
  > typography tokens (was 75). Needs token spec 7.7, `src/tokens/`, the driver
  > interface, and the Figma variables and text styles to change.
  > Q6a (name form): "role/{prop} + role/size/{step}". Names:
  > `hds/sem/typography/{role}/{family|weight|leading|tracking}` and
  > `hds/sem/typography/{role}/size/{sm|md|lg}`. The step is the last segment, so this
  > breaks "property last" in the naming grammar; the token spec records the exception.
  > Q6b (order): "Yes, before Text code (Recommended)". The token change runs after
  > this spec and before `hds-component-code`.

## Open items

- Tooltip on cut text: native `title` until the Tooltip interview.
- Feedback fg has no contrast check on page surfaces (TODO item).
- The no-raw-numbers rule in `docs/api-conventions.md` section 4 needs a rewrite with the user (TODO item).
- Typography token change (35 tokens) runs before the Text code.

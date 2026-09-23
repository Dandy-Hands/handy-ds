# Internal Spec: Text

- Status: docs-built
- Date: 2026-09-22
- Interview: `interview-guide-2026-09-22.md`
- Base UI version documented from: `@base-ui/react` 1.8.0
- Code status: component exists (`src/components/Text.tsx`); `size` axis pending build

## Description

Text applies one Type role — display, heading, body, label, or caption — to a run of text, and renders it as the right element by default. Roles decide intent (color, family, weight, rhythm); an optional per-role `size` step picks within the role's band. Use Text for every free-standing text run in a client app; do not use it inside interactive controls, which already carry their own type tokens, and do not use it as a heading-level picker — level and look are independent axes.

## Usage

- Do use Text for hero copy, headings, body copy, labels, and captions across web and app surfaces.
- Do pick the role by purpose and the heading level by document structure (`render={<h2 />}` etc.).
- Don't reach for a `weight` prop — inline emphasis is plain `<strong>` / `<em>` in children, and animation is a plain `<span>` with client CSS.
- Don't reach for raw font sizes — the role × size grid is the whole legal space.

## Base UI API

Text has no Base UI primitive. It is a single-part `useRender` component (`useRender.ComponentProps<'p'>` + `mergeProps`), so it takes the same `render` prop as Base UI parts and passes all standard attributes through.

Default element per variant: display → `h1`, heading → `h2`, body → `p`, label → `span`, caption → `small`. Override the element with `render` without changing the look.

## Extension API

| Prop | Type | Default | Decision |
| --- | --- | --- | --- |
| `variant` | `'display' \| 'heading' \| 'body' \| 'label' \| 'caption'` | `'body'` | Existing axis, unchanged. Sets `data-variant`. |
| `size` | `1 \| 2 \| 3` | unset | New. Sets `data-size`. Three steps per role; `1` is the role's smallest, `3` its largest. Unset and `size={2}` render the role's default tokens. Step numbers are per-role bands of different absolute sizes that pair across roles by theme design (Display 1 pairs with Body 1). |

Explicitly rejected: a `weight` prop (Q3/Q8 — weights stay fixed per role; inline emphasis is plain HTML with browser-default styling); tokenized emphasis; role-relative naming s/m/l (Q1/Q2 — numeric steps chosen).

## Token mapping

Per role (`role` ∈ display/heading/body/label/caption):

| Prop | Tokens |
| --- | --- |
| `variant` (color) | `hds/sem/type/color/{role}/fg` |
| `variant` (rhythm) | `hds/sem/type/measure/{role}/size`, `.../line-height`, `.../letter-spacing` |
| `variant` (face) | `hds/sem/type/other/{role}/font-family`, `.../weight` |
| `size` (new) | `hds/sem/type/measure/{role}/{step}/size`, `.../line-height`, `.../letter-spacing` for step ∈ {1, 2, 3} — all three emitted; step 2 duplicates the role-level values |

Notes:

- The emitted CSS flattens grammar slashes to dashes: `hds/sem/type/measure/heading/1/size` → `--hds-sem-type-measure-heading-1-size`. Property stays `size` (Q9) — no `font-size` rename.
- Weights are role-level only; no step-weight tokens.
- Text is context-passive: type `fg` tokens re-resolve automatically via ancestor `data-context`; the component adds no context handling.
- **Spec change flagged**: the `{step}` segment is new grammar. `checkTokenName()` and the Theme Map need a step-segment extension (`token-system-spec.md` open-gap item).

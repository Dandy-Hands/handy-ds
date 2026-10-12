# Internal Spec: Text

- Status: docs-built
- Date: 2026-09-22
- Interview: `interview-guide-2026-09-22.md`
- Base UI version documented from: `@base-ui/react` 1.8.0
- Code status: component exists (`src/components/Text.tsx`); `size` axis pending build

## Description

Text applies one Type role — display, headline, body, label, or caption — to a run of text, and renders it as the right element by default. Roles decide intent (color, family, weight, rhythm); an optional per-role `size` step picks within the role's band. Use Text for every free-standing text run in a client app; do not use it inside interactive controls, which already carry their own type tokens, and do not use it as a heading-level picker — level and look are independent axes.

## Usage

- Do use Text for hero copy, headings, body copy, labels, and captions across web and app surfaces.
- Do pick the role by purpose and the heading level by document structure (`render={<h2 />}` etc.).
- Don't reach for a `weight` prop — inline emphasis is plain `<strong>` / `<em>` in children, and animation is a plain `<span>` with client CSS.
- Don't reach for raw font sizes — the role × size grid is the whole legal space.

## Base UI API

Text has no Base UI primitive. It is a single-part `useRender` component (`useRender.ComponentProps<'p'>` + `mergeProps`), so it takes the same `render` prop as Base UI parts and passes all standard attributes through.

Default element per variant: display → `h1`, headline → `h2`, body → `p`, label → `span`, caption → `small`. Override the element with `render` without changing the look.

## Extension API

| Prop | Type | Default | Decision |
| --- | --- | --- | --- |
| `variant` | `'display' \| 'headline' \| 'body' \| 'label' \| 'caption'` | `'body'` | Existing axis, unchanged. Sets `data-variant`. |
| `size` | `1 \| 2 \| 3` | unset | New. Sets `data-size`. Three steps per role; `1` is the role's smallest, `3` its largest. Unset and `size={2}` render the role's default tokens. Step numbers are per-role bands of different absolute sizes that pair across roles by theme design (Display 1 pairs with Body 1). |

Explicitly rejected: a `weight` prop (Q3/Q8 — weights stay fixed per role; inline emphasis is plain HTML with browser-default styling); tokenized emphasis; role-relative naming s/m/l (Q1/Q2 — numeric steps chosen).

## Token mapping

> **Provisional (2026-10-07).** The token rework renamed every token. The names below are the provisional mapping from the previous spec (token spec section 9, item 5). This component's re-interview confirms them.

Per role (`role` ∈ display/headline/body/label/caption):

| Prop | Tokens |
| --- | --- |
| `variant` (color) | `hds/sem/color/content/{strong\|default\|muted}/fg`: display and headline read `strong`, body and label read `default`, caption reads `muted` |
| `variant` (face and rhythm) | `hds/sem/typography/{role}/md/{family,size,weight,leading,tracking}` |
| `size` | `1` reads `hds/sem/typography/{role}/sm/{size,leading,tracking}`, `3` reads `.../lg/...`; unset and `2` read `.../md/...` |

Notes:

- Text color is no longer a typography token. It comes from the Content color roles (token spec section 7.7).
- The token spec names the steps `sm`, `md`, `lg`; the `size` prop still uses `1`, `2`, `3`. This breaks the slot rule in `docs/component-conventions.md`. The re-interview decides whether the prop moves to `sm | md | lg`.
- Family and weight come from the `md` style for every size step. The token spec also emits `sm` and `lg` family and weight tokens.
- Text is context-passive: Content `fg` tokens re-resolve automatically via ancestor `data-context` or `data-mode`; the component adds no context handling.
- The step-segment grammar change flagged here before is resolved: the token spec has `typography/{role}/{sm|md|lg}/{property}`.

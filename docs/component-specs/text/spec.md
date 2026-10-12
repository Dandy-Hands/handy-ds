# Internal Spec: Text

Status:
- spec: reviewed
- code: pending
- figma: pending
- docs: pending

- Date: 2026-10-12
- Interview: `interview-guide-2026-10-12.md` (dry run: `interview-guide-2026-09-22.md`)
- Base UI version documented from: `@base-ui/react` 1.8.0 (no text primitive — `useRender` + `mergeProps`)
- Code: `src/components/Text.tsx` + `Text.css` (pre-interview: `size={1|2|3}`, no `tone`, no `maxLines`; rebuild per this spec)
- Depends on: the typography token change (35 tokens, see Token mapping). It runs before the code skill.

## Description

Text applies one typography role — display, headline, body, label, or caption — to a run of text, and renders the right element by default. The role sets the family, weight, line height, letter spacing, and default color; `size` picks one of three font sizes inside the role. `tone` changes the color, and `maxLines` cuts long text with an ellipsis.

## Usage

- Do use Text for every free-standing text run: hero copy, headings, body copy, labels, captions.
- Do pick the role by purpose and the heading level by document structure (`render={<h3 />}`).
- Don't use it inside interactive controls; they style their own text.
- Don't add a weight or a raw font size — use `<strong>` and `<em>` in children for emphasis.

## Base UI API

No Base UI primitive. Text is a single-part `useRender` component over `useRender.ComponentProps<'p'>`:

| Surface | Decision |
| --- | --- |
| `render` | Exposed. Replaces the element without changing the look. |
| Default element | By role: display `h1`, headline `h2`, body `p`, label `span`, caption `small`. |
| Native props (`id`, `className`, `aria-*`, `title`, ...) | Exposed — full passthrough. `style` is removed from the type (API conventions section 1). |

## Extension API

| Prop | Category | Type | Default | Decision |
| --- | --- | --- | --- | --- |
| `variant` | Axis | `'display' \| 'headline' \| 'body' \| 'label' \| 'caption'` | `'body'` | Sets `data-variant`. |
| `size` | Axis | `'sm' \| 'md' \| 'lg'` | `'md'` | Sets `data-size`. Font size step inside the role. Recorded exception: on Text, `size` picks a typography step, not a `measure/size` step, because the values must match the token slot. |
| `tone` | Axis | `'strong' \| 'default' \| 'muted' \| 'accent' \| 'danger' \| 'warning' \| 'success' \| 'info'` | unset (role color) | Sets `data-tone`. `link` is left out; it belongs to a link component. |
| `maxLines` | Behavior | `number` (whole, ≥ 1) | unset (no limit) | Clamps to that many lines with an ellipsis. Written as private custom property `--_max-lines` and `data-max-lines`. When the text is cut, sets `title` to the full text content, unless the caller passes `title`. Recorded exception to the no-raw-numbers rule (user decision; the rule is being rewritten). |

Role colors when `tone` is unset: display and headline `strong`, body and label `default`, caption `muted`.

Cut detection: compare `scrollHeight` to `clientHeight` after layout and on resize. Only when `maxLines` is set.

Rejected: `weight` (emphasis is `<strong>`/`<em>`), `align`, `truncate` (covered by `maxLines={1}`), `size` as a measure step that sets line height (px line height overlaps lines when the reader enlarges browser text).

## Token mapping

Token names below are after the typography token change.

| Part | Tokens |
| --- | --- |
| `variant` (face and rhythm) | `hds/sem/typography/{role}/family`, `/weight`, `/leading`, `/tracking` |
| `size` | `hds/sem/typography/{role}/size/{sm\|md\|lg}` for font size |
| Line height | `hds/sem/typography/{role}/leading` (unitless, so it follows each font size) |
| Letter spacing | `hds/sem/typography/{role}/tracking` (in `em`, so it follows each font size) |
| Unset `tone` | `hds/sem/color/content/{strong\|default\|muted}/fg` per role (see above) |
| `tone="strong"`, `"default"`, `"muted"`, `"accent"` | `hds/sem/color/content/{tone}/fg` |
| `tone="danger"`, `"warning"`, `"success"`, `"info"` | `hds/sem/color/feedback/{tone}/fg` |
| `maxLines` | structural: `display: -webkit-box`, `-webkit-line-clamp: var(--_max-lines)`, `overflow: hidden` |
| Margin | structural `0` |

Typography token change (token spec 7.7, runs before the code skill):

- Per role: `hds/sem/typography/{role}/{family|weight|leading|tracking}`.
- Per role and step: `hds/sem/typography/{role}/size/{sm|md|lg}`. The step is the last segment; this breaks "property last" in the naming grammar, and the token spec records the exception.
- 5 roles × 4 + 5 roles × 3 = 35 tokens (was 75).

Notes:

- No primitive or driver references.
- Context-passive: Content and Feedback `fg` tokens re-resolve under `data-context`, `data-section`, and modes.
- Contrast gap: Feedback `fg` is checked against Feedback `bg` only, not page surfaces (TODO item).

## Open items

- Swap the native `title` on cut text for Tooltip after the Tooltip interview.
- Feedback `fg` contrast check on page surfaces.
- `docs/api-conventions.md` section 4 (no raw numbers) is rewritten with the user.

Status:
- spec: reviewed
- code: built
- figma: built
- docs: built

# Internal Spec: LinkButton

- Date: 2026-10-12
- Interview: `interview-guide-2026-10-12.md`
- Base UI: none. Built on `useRender` and `mergeProps` from `@base-ui/react` 1.8.0.

## Description

LinkButton is a link that looks like a Button. It renders a native `<a>` with the Action `primary` look. It is a container: text, an icon, or both go in as children. LinkButton is the only link component in the library. Button covers in-place actions.

## Usage

- Do use LinkButton when the control moves to another page or view and must read as an action, such as "View all" or a call to action.
- Don't use LinkButton for an action in place (submit, save, open a dialog). Use Button.
- Don't use Button with `href` or `render={<a />}`. That gives an `<a>` the wrong role.
- Don't use LinkButton for a link inside a sentence. Write a plain `<a>`. The theme styles it with the Content `link` tokens.
- Do give an icon-only LinkButton an `aria-label`.

## Base UI API

No Base UI primitive. `useRender` supplies the `render` prop.

| Member | Decision |
| --- | --- |
| `render` | Exposed. A router link can replace the `<a>`: `<LinkButton render={<RouterLink to="/x" />}>`. |
| `ref` | Exposed. React 19 prop. |
| Native `<a>` props (`href`, `target`, `rel`, `download`, `onClick`, `id`, `aria-*`, `data-*`, ...) | Exposed as rest props. |
| `children` | Exposed. Text, an `Icon`, or both. |
| `className` | Omitted. Recorded break of API conventions section 1, same as Button. |
| `style` | Omitted. Removed by API conventions section 1. |
| `disabled` | Omitted. An `<a>` has no disabled state. A link that cannot be followed is not shown, or the page uses Button. |

The prop type is `Omit<useRender.ComponentProps<'a'>, 'className' | 'style'>` plus the extension props.

## Extension API

Set as data attributes on the root.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `ButtonSize = '800' \| '1000' \| '1200'` | `'1000'` | Control height, a `measure/size` step (32, 40, 48px at density 1). Also sets padding, gap, and label size. Set as `data-size`. Not responsive. Replaces `sm`/`md`/`lg`. Same type and values as Button. |
| `width` | `ButtonWidth = 'auto' \| 'full'` | `'auto'` | `auto`: fits the content. `full`: fills the parent (`100%`). Set as `data-width`. Not responsive. |

No `variant`, no `loading`, no icon props. LinkButton always has the look of Button `variant="primary"`. The code sets `data-variant="primary"` as a constant.

## Token mapping

The same as Button (`../button/spec.md`) with `variant` fixed to `primary`.

| Part | Property | Token |
| --- | --- | --- |
| Root | `background`, `color`, `border-color` | `hds/sem/color/action/primary/{default\|hover\|active}/{bg\|fg\|border}` |
| Root | `border-width` | `hds/sem/border/control` |
| Root | `border-radius` | `hds/sem/radius/control` |
| Root | `block-size` | `hds/sem/measure/size/{size}` |
| Root | `padding-inline` | `hds/sem/measure/space/{step}`: `800` = `300`, `1000` = `400`, `1200` = `600` |
| Root | `gap` | `hds/sem/measure/space/{step}`: `800` = `100`, `1000` and `1200` = `200` |
| Root | font | `hds/sem/typography/label/{family\|weight\|leading\|tracking}` |
| Root | font size | `hds/sem/typography/label/size/{step}`: `800` = `sm`, `1000` = `md`, `1200` = `lg` |
| Focus ring | outline | `hds/sem/color/focus/ring`, `hds/sem/border/focus` (from `base.css`) |

Notes:

- State mapping: `hover` = `:hover`, `active` = `:active`. `disabled` and `selected` are not used.
- Layout (structural): the same as Button, plus `text-decoration: none`. `width="full"` sets `inline-size: 100%`.
- A LinkButton sits flush next to a Button of the same `size`.
- Contrast: the Action pairs are checked by `src/tokens/contrast.ts`. No token gaps.
- Context-passive: all colors re-resolve from ancestor `data-context` and `data-section` overrides.

## Code consequences (for `hds-component-code`)

- Remove `priority`. Set `data-variant="primary"`. `action.css` reads `data-priority` today (see the Button spec, "Code consequences"). Follow the decision made there.
- `size` takes `ButtonSize` from `Button.tsx`, not `Size` from `Field.tsx`. Add `width` with `ButtonWidth`.
- Omit `className` and `style` from the prop type. Set `className` last so it wins.
- Add `text-decoration: none` for the anchor.

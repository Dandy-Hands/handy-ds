# Text

## Usage

Text applies a typography role — display, heading, body, label, or caption — to a run of text and renders the right element by default. Use it for any free-standing text run; don't use it inside interactive controls, which already style their own text, and don't treat it as a heading-level picker — pick the role by purpose and the heading level by document structure.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'display' \| 'heading' \| 'body' \| 'label' \| 'caption'` | `'body'` | Typography role. `display` — hero and marketing statements. `heading` — section and card titles. `body` — default reading text. `label` — short UI text such as field labels and meta. `caption` — small supporting text below body weight. |
| `size` | `1 \| 2 \| 3` | — | Size step within the role's band. `1` — the role's smallest. `2` — the role's default. `3` — the role's largest. Unset renders the role default. Steps pair across roles: Display 1 with Body 1 is a designed pairing. |
| `render` | `ReactElement \| (props, state) => ReactElement` | — | Replaces the rendered element, e.g. `render={<h3 />}`, without changing the look. |
| `children` | `ReactNode` | — | Text content. Inline emphasis uses `<strong>` and `<em>`; animated spans take client CSS. |

All standard attributes (`id`, `aria-*`, `className`, ...) are also accepted.

## Examples

```tsx
<Text variant="heading" render={<h2 />}>Plan overview</Text>
<Text>The goal of typography is to make reading effortless.</Text>
```

```tsx
<Text variant="display" size={1}>
  Ship <strong>faster</strong> with zero rewrites
</Text>
<Text variant="caption">Last updated 2026-09-22</Text>
```

## Contexts

Text carries no own context handling: type color tokens re-resolve automatically from an ancestor's `data-context="on-primary"` or `data-section` overrides.

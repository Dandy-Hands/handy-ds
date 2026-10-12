# Text

## Usage

Text applies a typography role — display, headline, body, label, or caption — to a run of text and renders the right element by default. Use it for any free-standing text run; don't use it inside interactive controls, which style their own text. Pick the role by purpose and the heading level by document structure (`render={<h3 />}`).

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'display' \| 'headline' \| 'body' \| 'label' \| 'caption'` | `'body'` | Typography role. `display` — hero and marketing statements. `headline` — section and card titles. `body` — default reading text. `label` — short UI text such as field labels and meta. `caption` — small supporting text. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Font size inside the role. `sm` — the role's smallest. `md` — the role's default. `lg` — the role's largest. |
| `tone` | `'strong' \| 'default' \| 'muted' \| 'accent' \| 'danger' \| 'warning' \| 'success' \| 'info'` | — | Text color. Unset uses the role's color. `strong` — highest emphasis. `default` — normal reading text. `muted` — secondary text. `accent` — brand emphasis. `danger`, `warning`, `success`, `info` — status text. |
| `maxLines` | `number` | — | Cuts the text after this many lines with an ellipsis. When text is cut, hovering shows the full text. |
| `render` | `ReactElement \| (props, state) => ReactElement` | — | Replaces the rendered element, e.g. `render={<h3 />}`, without changing the look. |
| `children` | `ReactNode` | — | Text content. Use `<strong>` and `<em>` for inline emphasis. |

All standard attributes (`id`, `aria-*`, `className`, ...) are also accepted, except `style`.

## Examples

```tsx
<Text variant="headline" render={<h2 />}>Plan overview</Text>
<Text maxLines={3}>{post.excerpt}</Text>
```

```tsx
<Text variant="display" size="lg">
  Ship <strong>faster</strong> with zero rewrites
</Text>
<Text variant="caption" tone="danger">Payment failed</Text>
```

## Contexts

Text has no context handling of its own: its colors re-resolve automatically under an ancestor's `data-context="on-primary"` or `data-section`.

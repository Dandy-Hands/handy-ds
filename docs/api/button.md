# Button

## Usage

Button triggers an action the user takes in place, such as submitting a form, saving, or opening a dialog. Use it for actions, not navigation — use LinkButton when the control moves to another page. Use one primary button per view and mark supporting actions as secondary or tertiary.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `priority` | `'primary' \| 'secondary' \| 'tertiary'` | `'primary'` | Visual weight. `primary` — the view's main action. `secondary` — supporting actions next to the main one. `tertiary` — low-weight inline actions. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Control size. `sm` — dense toolbars and compact layouts. `md` — default. `lg` — hero and marketing contexts. |
| `loading` | `boolean` | `false` | Shows a spinner, sets `aria-busy="true"`, and blocks clicks while the action runs. |
| `fullWidth` | `boolean` | `false` | Stretches to the full width of its container. |
| `disabled` | `boolean` | — | Makes the button visible but inert. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Set `submit` to submit a form. |
| `onClick` | `(event: MouseEvent) => void` | — | Fires when the button is activated. |
| `render` | `ReactElement \| (props, state) => ReactElement` | — | Replaces the rendered element or composes with another component. |
| `children` | `ReactNode` | — | Label content. Icons go here — pair with the `Icon` component. |

All standard button attributes (`aria-*`, `form*`, ...) are also accepted.

## Examples

```tsx
<Button onClick={save}>Save changes</Button>
<Button priority="secondary" onClick={cancel}>Cancel</Button>
```

```tsx
<Button priority="secondary" size="sm" loading={isSaving} fullWidth>
  {isSaving ? 'Saving…' : 'Save draft'}
</Button>
```

## Contexts

Honors the theme's context overrides: set `data-context="on-primary"` (on a colored ground), `data-context="default"` (back to normal colors), or `data-section="hero"` on any ancestor and Button's tokens re-resolve automatically.

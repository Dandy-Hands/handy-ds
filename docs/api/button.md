# Button

## Usage

Button triggers an action the user takes in place, such as submitting a form, saving, or opening a dialog. Use it for actions, not navigation. Use LinkButton when the control moves to another page. Use one `primary` button per view, and mark supporting actions `secondary` or `tertiary`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'primary' \| 'secondary' \| 'tertiary' \| 'danger'` | `'primary'` | Role and weight. `primary`: the view's main action. `secondary`: supporting actions next to the main one. `tertiary`: low-weight inline actions. `danger`: destructive actions. |
| `size` | `'800' \| '1000' \| '1200'` | `'1000'` | Button height. `800`: dense toolbars and compact layouts. `1000`: the standard button. `1200`: large, for hero and marketing areas. The label size follows. |
| `width` | `'auto' \| 'full'` | `'auto'` | `auto`: fits the content. `full`: fills the width of its container. |
| `loading` | `boolean` | `false` | Shows a spinner, sets `aria-busy="true"`, and blocks clicks while the action runs. The width does not change. |
| `disabled` | `boolean` | — | Makes the button visible but inert. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Set `submit` to submit a form. |
| `onClick` | `(event: MouseEvent) => void` | — | Called when the button is activated. |
| `render` | `ReactElement \| (props, state) => ReactElement` | — | Replaces the rendered element, or lets a parent such as a dialog trigger use the button look: `<Dialog.Trigger render={<Button variant="tertiary" />}>`. |
| `children` | `ReactNode` | — | The content: text, an `Icon`, or both. Give an icon-only button an `aria-label`. |

All other standard button attributes (`aria-*`, `form*`, `name`, `id`, ...) and `ref` are also accepted. Button takes no `className` or `style`.

## Examples

```tsx
<Button onClick={save}>Save changes</Button>
<Button variant="secondary" onClick={cancel}>Cancel</Button>
```

```tsx
<Button variant="secondary" size="1200" width="full" loading={isSaving}>
  {isSaving ? 'Saving…' : 'Save draft'}
</Button>
```

```tsx
<Button variant="tertiary" aria-label="Close">
  <Icon>x</Icon>
</Button>
```

## Contexts

Honors the theme's context overrides: set `data-context="on-primary"` (on a colored ground), `data-context="default"` (back to normal colors), or `data-section="hero"` on any ancestor and Button's tokens re-resolve automatically.

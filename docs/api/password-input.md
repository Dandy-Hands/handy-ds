# PasswordInput

## Usage

PasswordInput is a single-line field for a password. It starts hidden and has a button that shows or hides the text. Wrap it in a `Field` when it has a visible label. For a bare PasswordInput, give it an `aria-label`. Pass `autoComplete="new-password"` on a sign-up or change-password form. Don't use it for a value that is not secret — use TextInput. To show strength or rules, read the value with `onValueChange` and show the result in your own markup.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'800' \| '1000' \| '1200'` | `'1000'` | Height of the field. `800`: compact, for dense layouts. `1000`: standard. `1200`: large, for touch layouts. |
| `start` | `ReactNode` | — | Content before the text, such as a lock icon. |
| `value` / `defaultValue` | `string` | `''` | The controlled / initial text. |
| `onValueChange` | `(value: string, eventDetails) => void` | — | Called when the text changes. |
| `autoComplete` | `string` | `'current-password'` | Tells the browser which password to offer. Use `'new-password'` for a new password. |
| `placeholder` | `string` | — | Hint text shown when the field is empty. |
| `disabled` | `boolean` | `false` | Makes the field and its button visible but inert. |
| `readOnly` | `boolean` | `false` | Shows the text but blocks changes. The show/hide button still works. |
| `required` | `boolean` | `false` | The field must have text before the form submits. |
| `name` | `string` | — | Identifies the field on form submission. |
| `className` | `string` | — | Class for the outer frame. |
| `render` | `ReactElement \| (props, state) => ReactElement` | — | Replaces the rendered input element. |

All other standard input attributes (`id`, `maxLength`, `aria-*`, ...) and `ref` are also accepted. `ref` points to the input element. The field takes no `type`, `end`, or `style`. The show/hide button takes no props.

## Examples

```tsx
<Field.Root>
  <Field.Label>Password</Field.Label>
  <PasswordInput required />
</Field.Root>
```

```tsx
<PasswordInput aria-label="New password" autoComplete="new-password" start={<Icon>lock</Icon>} />
```

## Contexts

Honors the theme's context overrides: set `data-context="on-primary"` (on a colored ground), `data-context="default"` (back to normal colors), or `data-section="hero"` on any ancestor and PasswordInput's tokens re-resolve automatically.

# EmailInput

## Usage

EmailInput is a single-line field for one email address. It shows a mail icon, asks the mobile keyboard for `@` and `.`, and lets the browser offer saved addresses. It requires a dot in the domain, so `name@gmail` fails. Wrap it in a `Field` when it has a visible label. For a bare EmailInput, give it an `aria-label`. Pass `pattern` to allow an address such as `user@intranet`. Don't use it for a list of addresses or for a value that is not an email — use TextInput. To show a typo hint, read the value with `onValueChange` and show the result in your own markup.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'800' \| '1000' \| '1200'` | `'1000'` | Height of the field. `800`: compact, for dense layouts. `1000`: standard. `1200`: large, for touch layouts. |
| `end` | `ReactNode` | — | Content after the text, such as a badge or a button. |
| `value` / `defaultValue` | `string` | `''` | The controlled / initial text. The browser trims spaces at both ends. |
| `onValueChange` | `(value: string, eventDetails) => void` | — | Called when the text changes. |
| `pattern` | `string` | `'[^@\s]+@[^@\s]+\.[^@\s]+'` | The check for a valid address. The default needs a dot in the domain. |
| `autoComplete` | `string` | `'email'` | Tells the browser which value to offer. |
| `inputMode` | `string` | `'email'` | Picks the mobile keyboard. |
| `placeholder` | `string` | — | Hint text shown when the field is empty. |
| `disabled` | `boolean` | `false` | Makes the field visible but inert. |
| `readOnly` | `boolean` | `false` | Shows the text but blocks changes. |
| `required` | `boolean` | `false` | The field must have text before the form submits. |
| `name` | `string` | — | Identifies the field on form submission. |
| `className` | `string` | — | Class for the outer frame. |
| `render` | `ReactElement \| (props, state) => ReactElement` | — | Replaces the rendered input element. |

All other standard input attributes (`id`, `maxLength`, `autoCapitalize`, `spellCheck`, `aria-*`, ...) and `ref` are also accepted. `ref` points to the input element. The field takes no `type`, `start`, `multiple`, or `style`.

## Examples

```tsx
<Field.Root>
  <Field.Label>Email</Field.Label>
  <EmailInput required />
  <Field.Error match="patternMismatch">Enter an address like name@example.com.</Field.Error>
</Field.Root>
```

```tsx
<EmailInput aria-label="Work email" pattern=".+@.+" />
```

## Contexts

Honors the theme's context overrides: set `data-context="on-primary"` (on a colored ground), `data-context="default"` (back to normal colors), or `data-section="hero"` on any ancestor and EmailInput's tokens re-resolve automatically.

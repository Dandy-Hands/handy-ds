# UrlInput

## Usage

UrlInput is a single-line field for one web address. It shows a link icon and asks the mobile keyboard for `/` and `.com`. When the user leaves the field, it adds `https://` if the text has no scheme. It accepts `http` and `https` only, so `javascript:` and `data:` fail. Wrap it in a `Field` when it has a visible label. For a bare UrlInput, give it an `aria-label`. Don't use it for a list of addresses or for a value that is not a web address — use TextInput.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'800' \| '1000' \| '1200'` | `'1000'` | Height of the field. `800`: compact, for dense layouts. `1000`: standard. `1200`: large, for touch layouts. |
| `end` | `ReactNode` | — | Content after the text, such as a badge or a button. |
| `value` / `defaultValue` | `string` | `''` | The controlled / initial text. The browser trims spaces at both ends. |
| `onValueChange` | `(value: string, eventDetails) => void` | — | Called when the text changes, also when a blur adds `https://`. |
| `pattern` | `string` | `'https?://\S+'` | The check for a valid address. The default accepts `http` and `https` only. Override it to allow another scheme. |
| `autoComplete` | `string` | `'url'` | Tells the browser which value to offer. |
| `inputMode` | `string` | `'url'` | Picks the mobile keyboard. |
| `placeholder` | `string` | — | Hint text shown when the field is empty, for example `example.com`. |
| `disabled` | `boolean` | `false` | Makes the field visible but inert. |
| `readOnly` | `boolean` | `false` | Shows the text but blocks changes. A blur does not add a scheme. |
| `required` | `boolean` | `false` | The field must have text before the form submits. |
| `name` | `string` | — | Identifies the field on form submission. |
| `onBlur` | `(event) => void` | — | Called on blur, before the component adds a scheme. |
| `className` | `string` | — | Class for the outer frame. |
| `render` | `ReactElement \| (props, state) => ReactElement` | — | Replaces the rendered input element. |

All other standard input attributes (`id`, `autoCapitalize`, `spellCheck`, `aria-*`, ...) and `ref` are also accepted. `ref` points to the input element. The field takes no `type`, `start`, `multiple`, or `style`.

## Examples

```tsx
<Field.Root>
  <Field.Label>Website</Field.Label>
  <UrlInput required placeholder="example.com" />
  <Field.Error match="patternMismatch">Enter a web address like example.com.</Field.Error>
</Field.Root>
```

```tsx
<UrlInput aria-label="Profile link" pattern="(https?|ftp)://\S+" />
```

## Contexts

Honors the theme's context overrides: set `data-context="on-primary"` (on a colored ground), `data-context="default"` (back to normal colors), or `data-section="hero"` on any ancestor and UrlInput's tokens re-resolve automatically.

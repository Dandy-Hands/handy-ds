# TextInput

## Usage

TextInput is a single-line field for free text, such as a name, a title, or a comment. Wrap it in a `Field` when it has a visible label. For a bare TextInput, give it an `aria-label`. Use `start` and `end` to put an icon, a unit, or a button inside the frame. Don't use it for an email, a phone number, a password, a URL, or a search — use the typed field. Don't use it for a number — use NumberInput.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'800' \| '1000' \| '1200'` | `'1000'` | Height of the field. `800`: compact, for dense layouts. `1000`: standard. `1200`: large, for touch layouts. |
| `start` | `ReactNode` | — | Content before the text, such as an icon. |
| `end` | `ReactNode` | — | Content after the text, such as a unit or a button. |
| `value` / `defaultValue` | `string` | `''` | The controlled / initial text. |
| `onValueChange` | `(value: string, eventDetails) => void` | — | Called when the text changes. |
| `placeholder` | `string` | — | Hint text shown when the field is empty. |
| `disabled` | `boolean` | `false` | Makes the field visible but inert. |
| `readOnly` | `boolean` | `false` | Shows the text but blocks changes. |
| `required` | `boolean` | `false` | The field must have text before the form submits. |
| `name` | `string` | — | Identifies the field on form submission. |
| `className` | `string` | — | Class for the outer frame. |
| `render` | `ReactElement \| (props, state) => ReactElement` | — | Replaces the rendered input element. |

All other standard input attributes (`id`, `maxLength`, `inputMode`, `autoComplete`, `aria-*`, ...) and `ref` are also accepted. `ref` points to the input element. The field takes no `type` and no `style`.

## Examples

```tsx
<Field.Root>
  <Field.Label>Project name</Field.Label>
  <TextInput placeholder="Untitled" />
</Field.Root>
```

```tsx
<TextInput aria-label="Weight" size="800" end="kg" />
```

```tsx
<TextInput aria-label="Price" start={<Icon>attach_money</Icon>} end="USD" />
```

## Contexts

Honors the theme's context overrides: set `data-context="on-primary"` (on a colored ground), `data-context="default"` (back to normal colors), or `data-section="hero"` on any ancestor and TextInput's tokens re-resolve automatically.

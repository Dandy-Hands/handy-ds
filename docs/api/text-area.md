# TextArea

## Usage

TextArea is a multi-line field for free text, such as a message, a note, or a description. The user drags the bottom edge to change the height. Set `autoGrow` to make the height follow the text, and `maxRows` to stop the growth and scroll. Wrap it in a `Field` when it has a visible label. For a bare TextArea, give it an `aria-label`. Don't use it for one line of text — use TextInput. To show a character count, read the value with `onValueChange` and show the result in `Field.Description`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'800' \| '1000' \| '1200'` | `'1000'` | Padding, type size, and the height of one row. `800`: compact, for dense layouts. `1000`: standard. `1200`: large, for touch layouts. |
| `rows` | `number` | `3` | Rows shown at the start. |
| `autoGrow` | `boolean` | `false` | The height follows the text, from `rows` up to `maxRows`. The drag handle is off. |
| `maxRows` | `number` | — | With `autoGrow`, the most rows before the field scrolls. No limit by default. |
| `value` / `defaultValue` | `string` | `''` | The controlled / initial text. |
| `onValueChange` | `(value: string, eventDetails) => void` | — | Called when the text changes. |
| `placeholder` | `string` | — | Hint text shown when the field is empty. |
| `maxLength` / `minLength` | `number` | — | The most / fewest characters the form accepts. |
| `wrap` | `'soft' \| 'hard' \| 'off'` | `'soft'` | How the text wraps, and how a form posts it. |
| `disabled` | `boolean` | `false` | Makes the field visible but inert. |
| `readOnly` | `boolean` | `false` | Shows the text but blocks changes. |
| `required` | `boolean` | `false` | The field must have text before the form submits. |
| `name` | `string` | — | Identifies the field on form submission. |
| `className` | `string` | — | Class for the outer frame. |

All other standard textarea attributes (`id`, `spellCheck`, `aria-*`, ...) and `ref` are also accepted. `ref` points to the textarea element. The field takes no `type`, `start`, `end`, `render`, `cols`, or `style`.

## Examples

```tsx
<Field.Root>
  <Field.Label>Message</Field.Label>
  <TextArea rows={4} />
</Field.Root>
```

```tsx
<TextArea aria-label="Notes" autoGrow maxRows={10} />
```

## Contexts

Honors the theme's context overrides: set `data-context="on-primary"` (on a colored ground), `data-context="default"` (back to normal colors), or `data-section="hero"` on any ancestor and TextArea's tokens re-resolve automatically.

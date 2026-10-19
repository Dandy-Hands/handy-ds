# SearchInput

## Usage

SearchInput is a single-line field for a search query. It has a search icon and a clear button that shows when the field has text. `Escape` clears the text. Put it in a `<form role="search">` so `Enter` submits. Give it an `aria-label` when it has no visible label. Don't use it for free text that is not a query — use TextInput. To show loading, put a spinner outside the field.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'800' \| '1000' \| '1200'` | `'1000'` | Height of the field. `800`: compact, for dense layouts and toolbars. `1000`: standard. `1200`: large, for touch layouts. |
| `value` / `defaultValue` | `string` | `''` | The controlled / initial text. |
| `onValueChange` | `(value: string, eventDetails) => void` | — | Called when the text changes, and when the clear button or `Escape` clears it. |
| `placeholder` | `string` | — | Hint text shown when the field is empty. |
| `disabled` | `boolean` | `false` | Makes the field visible but inert. The clear button is hidden. |
| `readOnly` | `boolean` | `false` | Shows the text but blocks changes. The clear button is hidden. |
| `name` | `string` | — | Identifies the field on form submission. |
| `className` | `string` | — | Class for the outer frame. |
| `render` | `ReactElement \| (props, state) => ReactElement` | — | Replaces the rendered input element. |

The browser hints are set for search: `inputMode`, `enterKeyHint`, `autoComplete`, `autoCapitalize`, and `spellCheck`. You can pass any of them to override the default. All other standard input attributes (`id`, `maxLength`, `aria-*`, `onKeyDown`, ...) and `ref` are also accepted. `ref` points to the input element. The field takes no `type`, `start`, `end`, or `style`. The clear button takes no props.

## Examples

```tsx
<form role="search" onSubmit={search}>
  <SearchInput aria-label="Search posts" placeholder="Search posts" />
</form>
```

```tsx
<SearchInput aria-label="Filter" size="800" value={query} onValueChange={setQuery} />
```

## Contexts

Honors the theme's context overrides: set `data-context="on-primary"` (on a colored ground), `data-context="default"` (back to normal colors), or `data-section="hero"` on any ancestor and SearchInput's tokens re-resolve automatically.

# Header

## Usage

Header is the band at the top of a page, rendered as a `<header>` element. Use it once per page for the site title, the logo, and the main navigation. Don't use it for the heading of a card or a section (use Section or Card).

## Props

Header takes every prop of [Section](section.md), plus one more. The default `paddingBlock` is `"400"`, not `"1600"`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `sticky` | `boolean` | `false` | The header stays at the top of the screen while the page scrolls. It has a shadow to separate it from the content beneath. |

## Examples

```tsx
<Header sticky paddingBlock="400">
  <Inline justify="between">
    <Text variant="headline">Acme</Text>
    <NavigationMenu.Root>…</NavigationMenu.Root>
  </Inline>
</Header>
```

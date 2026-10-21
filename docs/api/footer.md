# Footer

## Usage

Footer is the band at the bottom of a page, rendered as a `<footer>` element. Use it once per page for legal text, secondary links, and contact details. Don't use it for the end of a card or a section.

## Props

Footer takes every prop of [Section](section.md). The default `paddingBlock` is `"800"`, not `"1600"`.

## Examples

```tsx
<Footer surface="sunken" paddingBlock="800">
  <Inline justify="between">
    <Text variant="caption">© 2026 Acme</Text>
    <Inline gap="400"><a href="/privacy">Privacy</a><a href="/terms">Terms</a></Inline>
  </Inline>
</Footer>
```

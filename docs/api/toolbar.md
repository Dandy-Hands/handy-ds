# Toolbar

## Usage

Toolbar is a bar of controls for a region — buttons, links, a small input, and separators — with arrow-key navigation between them. Use it for an editor bar or a control strip over the content it acts on. Don't use it for site navigation — use NavigationMenu.

## Props

No handy-ds props. `Toolbar.Button` and `Toolbar.Link` are Action `tertiary`; `Toolbar.Input` is size `sm`; `Toolbar.Separator` is a Divider.

## Examples

```tsx
<Toolbar.Root>
  <Toolbar.Button>Cut</Toolbar.Button>
  <Toolbar.Button>Copy</Toolbar.Button>
  <Toolbar.Separator />
  <Toolbar.Input placeholder="Search" />
</Toolbar.Root>
```

```tsx
<Toolbar.Root aria-label="Text formatting">
  <Toolbar.Group>
    <Toolbar.Button>Bold</Toolbar.Button>
    <Toolbar.Button>Italic</Toolbar.Button>
  </Toolbar.Group>
  <Toolbar.Separator />
  <Toolbar.Link href="/help">Help</Toolbar.Link>
</Toolbar.Root>
```

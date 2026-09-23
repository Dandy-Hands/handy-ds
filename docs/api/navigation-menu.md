# NavigationMenu

## Usage

NavigationMenu is site navigation with dropdown panels: a horizontal list of triggers, each opening destination links that share one animated viewport. Use it for the top-level navigation of a site. Don't use it for commands — use Menu — and don't use it for app-style menu rows — use Menubar.

## Props

No handy-ds props. Triggers and links are Action `tertiary`; the current page's link takes the `active` prop and renders in the selected state.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `active` | `boolean` (on `NavigationMenu.Link`) | — | Marks the current page's link; renders in the selected state. |

## Examples

```tsx
<NavigationMenu.Root>
  <NavigationMenu.List>
    <NavigationMenu.Item>
      <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
      <NavigationMenu.Content>
        <NavigationMenu.Link href="/widgets" active>Widgets</NavigationMenu.Link>
        <NavigationMenu.Link href="/gadgets">Gadgets</NavigationMenu.Link>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
    <NavigationMenu.Item>
      <NavigationMenu.Link href="/pricing">Pricing</NavigationMenu.Link>
    </NavigationMenu.Item>
  </NavigationMenu.List>
  <NavigationMenu.Portal>
    <NavigationMenu.Positioner sideOffset={8}>
      <NavigationMenu.Popup>
        <NavigationMenu.Viewport />
      </NavigationMenu.Popup>
    </NavigationMenu.Positioner>
  </NavigationMenu.Portal>
</NavigationMenu.Root>
```

The popup must assemble as `Portal > Positioner > Popup > Viewport`; each trigger's content page is a `Content`.

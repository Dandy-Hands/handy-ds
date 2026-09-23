# Menu

## Usage

Menu shows a list of commands behind a trigger: actions, links, checkbox and radio choices, submenus. Use it for commands that act and do not need to be visible until asked for. Don't use it when the user is choosing a value for a form — use Select. Don't use it for site navigation — use NavigationMenu.

## Variants

- `Menu` — a list of commands behind a trigger button.
- `ContextMenu` — the same list, opened by right-click / long-press on an area.
- `Menubar` — an app-style row of menus across the top of a region.

## Props

No handy-ds props. `Menu.Trigger` looks like a secondary Button — pass `data-priority="tertiary"` inside a `Menubar`. Items, checkbox items, radio items, and submenu triggers are Action tertiary.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data-priority` | `'primary' \| 'secondary' \| 'tertiary'` (on `Menu.Trigger`) | `'secondary'` | Trigger's visual weight. `secondary` — the default. `tertiary` — inside a `Menubar` or low-weight toolbars. |

## Examples

```tsx
<Menu.Root>
  <Menu.Trigger>Actions</Menu.Trigger>
  <Menu.Portal>
    <Menu.Positioner>
      <Menu.Popup>
        <Menu.Item onClick={duplicate}>Duplicate</Menu.Item>
        <Menu.Separator />
        <Menu.Item onClick={remove}>Delete</Menu.Item>
      </Menu.Popup>
    </Menu.Positioner>
  </Menu.Portal>
</Menu.Root>
```

```tsx
<Menu.Root>
  <Menu.Trigger>View</Menu.Trigger>
  <Menu.Portal>
    <Menu.Positioner>
      <Menu.Popup>
        <Menu.CheckboxItem defaultChecked>
          Autosave
          <Menu.CheckboxItemIndicator />
        </Menu.CheckboxItem>
        <Menu.GroupLabel>Sort by</Menu.GroupLabel>
        <Menu.RadioItem value="name">Name<Menu.RadioItemIndicator /></Menu.RadioItem>
      </Menu.Popup>
    </Menu.Positioner>
  </Menu.Portal>
</Menu.Root>
```

The popup must assemble as `Menu.Portal > Menu.Positioner > Menu.Popup`.

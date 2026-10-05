# Popover

## Usage

Popover is extra information or small controls anchored to a trigger, with the page behind left usable. Don't use it for a list of commands — use Menu — or when the task blocks the page — use Dialog.

## Props

### Popover.Root

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` / `defaultOpen` | `boolean` | — | The controlled / initial open state. |
| `onOpenChange` | `(open, eventDetails) => void` | — | Fires when the popover opens or closes. |
| `modal` | `boolean \| 'trap-focus'` | `false` | Non-modal by default: the page behind stays usable. Set `true` to block outside interaction. |

### Popover.Trigger

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data-priority` | `'primary' \| 'secondary' \| 'tertiary'` | `'secondary'` | Visual weight of the trigger button. |

### Popover.Positioner

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `side` / `align` / `sideOffset` | — | — | Placement relative to the trigger and the gap from it. |

`children` holds part content (positioner, popup, title, description) on every part, and `render` (`ReactElement \| (props, state) => ReactElement`) replaces the rendered element on any part. All standard attributes (`id`, `aria-*`, ...) are also accepted.

## Examples

```tsx
<Popover.Root>
  <Popover.Trigger>Notifications</Popover.Trigger>
  <Popover.Portal>
    <Popover.Positioner sideOffset={8}>
      <Popover.Popup>
        <Popover.Title>Notifications</Popover.Title>
        <Popover.Description>You are all caught up.</Popover.Description>
      </Popover.Popup>
    </Popover.Positioner>
  </Popover.Portal>
</Popover.Root>
```

```tsx
<Popover.Root>
  <Popover.Trigger data-priority="tertiary">What's this?</Popover.Trigger>
  <Popover.Portal>
    <Popover.Positioner sideOffset={4}>
      <Popover.Popup>Billing happens on the 1st.</Popover.Popup>
    </Popover.Positioner>
  </Popover.Portal>
</Popover.Root>
```

## Contexts

The popup is a Surface: set `data-context="on-primary"` (on a colored ground), `data-context="default"` (back to normal colors), or `data-section="hero"` on any ancestor and its tokens re-resolve automatically.

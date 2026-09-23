# Popover

## Usage

Popover is extra information or small controls anchored to a trigger, with the page behind left usable. Don't use it for a list of commands — use Menu — or when the task blocks the page — use Dialog.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` / `defaultOpen` (Root) | `boolean` | — | The controlled / initial open state. |
| `onOpenChange` (Root) | `(open, eventDetails) => void` | — | Fires when the popover opens or closes. |
| `modal` (Root) | `boolean \| 'trap-focus'` | `false` | Non-modal by default: the page behind stays usable. Set `true` to block outside interaction. |
| `data-priority` (Trigger) | `'primary' \| 'secondary' \| 'tertiary'` | `'secondary'` | Visual weight of the trigger button. |
| `side` / `align` / `sideOffset` (Positioner) | — | — | Placement relative to the trigger and the gap from it. |
| `render` | `ReactElement \| (props, state) => ReactElement` | — | Replaces the rendered element on any part. |
| `children` | `ReactNode` | — | Part content: positioner, popup, title, description. |

All standard attributes (`id`, `aria-*`, ...) are also accepted.

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

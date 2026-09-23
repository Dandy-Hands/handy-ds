# Accordion

## Usage

Accordion shows and hides sections in place. Use it for an FAQ, or long content the user scans before opening. Don't use it when exactly one section shows at a time in a fixed region — use Tabs.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` / `defaultValue` (Root) | `any[]` | — | The controlled / initial open sections. |
| `onValueChange` (Root) | `(value, eventDetails) => void` | — | Fires when a section opens or closes. |
| `multiple` (Root) | `boolean` | `false` | Lets several sections stay open at once. |
| `disabled` (Root, Trigger) | `boolean` | `false` | Ignores interaction on the whole accordion or one trigger. |
| `value` (Trigger) | `any` | — | Identifies the section; matches the panel's `value`. |
| `render` | `ReactElement \| (props, state) => ReactElement` | — | Replaces the rendered element on any part. |
| `children` | `ReactNode` | — | Part content. |

All standard attributes (`id`, `aria-*`, ...) are also accepted.

## Examples

```tsx
<Accordion.Root>
  <Accordion.Item>
    <Accordion.Header><Accordion.Trigger>Shipping</Accordion.Trigger></Accordion.Header>
    <Accordion.Panel>Ships in 2–3 days.</Accordion.Panel>
  </Accordion.Item>
  <Accordion.Item>
    <Accordion.Header><Accordion.Trigger>Returns</Accordion.Trigger></Accordion.Header>
    <Accordion.Panel>Free within 30 days.</Accordion.Panel>
  </Accordion.Item>
</Accordion.Root>
```

```tsx
<Accordion.Root multiple defaultValue={['billing']}>
  <Accordion.Item>
    <Accordion.Header><Accordion.Trigger value="billing">Billing</Accordion.Trigger></Accordion.Header>
    <Accordion.Panel>Invoiced monthly.</Accordion.Panel>
  </Accordion.Item>
</Accordion.Root>
```

## Contexts

Triggers honor the theme's context overrides (`data-context`, `data-section`) through their Action tokens. Panels carry a Surface-0 ground; place a `data-context="default"` container on a panel inside a colored section.

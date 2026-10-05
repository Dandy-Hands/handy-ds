# Tabs

## Usage

Tabs switch between views in the same place. Use them when several panels share one region and only one shows at a time. Don't use them when the panels are separate pages, or when several may be open at once — use Accordion.

## Props

### Tabs.Root

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` / `defaultValue` | `any` | — | The controlled / initial active tab. |
| `onValueChange` | `(value, eventDetails) => void` | — | Fires when the active tab changes. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction of the list and panels. |
| `activationMode` | `'automatic' \| 'manual'` | `'automatic'` | `automatic` activates on arrow-key focus; `manual` needs Enter or Space. |

### Tabs.Tab

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `any` | — | Identifies the tab; matches the panel's `value`. |
| `disabled` | `boolean` | `false` | Ignores interaction on the tab. |

`children` holds part content on every part, and `render` (`ReactElement \| (props, state) => ReactElement`, e.g. `render={<a href />}` on a Tab) replaces the rendered element on any part. All standard attributes (`id`, `aria-*`, ...) are also accepted.

## Examples

```tsx
<Tabs.Root defaultValue="one">
  <Tabs.List>
    <Tabs.Tab value="one">Overview</Tabs.Tab>
    <Tabs.Tab value="two">Details</Tabs.Tab>
    <Tabs.Indicator />
  </Tabs.List>
  <Tabs.Panel value="one">…</Tabs.Panel>
  <Tabs.Panel value="two">…</Tabs.Panel>
</Tabs.Root>
```

```tsx
<Tabs.Root defaultValue="a" orientation="vertical">
  <Tabs.List><Tabs.Tab value="a">First</Tabs.Tab><Tabs.Indicator /></Tabs.List>
  <Tabs.Panel value="a">…</Tabs.Panel>
</Tabs.Root>
```

## Contexts

Tab triggers honor the theme's context overrides (`data-context`, `data-section`) through their Action tokens. Panels carry no tokens, so they always inherit their surroundings.

# Meter

## Usage

Meter shows a value in a known range: storage used, a score. Use it when the number means something on its own. Don't use it for a task running to completion — use Progress. Label the meter with `Meter.Label`; `Meter.Value` formats the number.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `sentiment` (Meter.Root) | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` | Fill color. `info` — neutral. `success` — good level. `warning` — nearing a limit. `danger` — over a limit. |
| `value` (Root) | `number` | — | The current value. `Progress.Root` also accepts `null` (indeterminate). |
| `min` / `max` (Root) | `number` | `0` / `100` | The range ends. |
| `format` (Root) | `Intl.NumberFormatOptions` | — | Formats the displayed value. |
| `render` | `ReactElement \| (props, state) => ReactElement` | — | Replaces the rendered element on any part. |
| `children` | `ReactNode` | — | Parts: `Label`, `Value`, `Track` with `Indicator` inside. |

All standard attributes (`id`, `aria-*`, ...) are also accepted.

## Examples

```tsx
<Meter.Root value={72}>
  <Meter.Label>Storage</Meter.Label>
  <Meter.Value />
  <Meter.Track><Meter.Indicator /></Meter.Track>
</Meter.Root>
```

```tsx
<Progress.Root value={null}>
  <Progress.Label>Working…</Progress.Label>
  <Progress.Track><Progress.Indicator /></Progress.Track>
</Progress.Root>
```

## Contexts

No own context handling. Track and fill colors are contrast-checked in the default context; on colored sections wrap the meter in a `data-context="default"` container.

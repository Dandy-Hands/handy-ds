# Meter

## Usage

Meter shows a static measurement inside a known range, such as storage used or a score. Use it when the number means something on its own. Don't use it for a running task; use Progress. Set `tone` yourself to show status; Meter does not compute it from the value.

## Props

### Meter.Root

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number` | — | Required. The current value. |
| `min` | `number` | `0` | The low end of the range. |
| `max` | `number` | `100` | The high end of the range. |
| `tone` | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` | Fill color. `info`: a neutral reading. `success`: a good level. `warning`: near a limit. `danger`: over a limit. |
| `size` | `'200' \| '300' \| '400'` | `'300'` | Track height. `200`: a thin bar. `300`: the standard bar. `400`: a thick bar. Text size does not change. |
| `format` | `Intl.NumberFormatOptions` | percent | Formats the number that `Meter.Value` shows and screen readers announce. |
| `locale` | `Intl.LocalesArgument` | the user's locale | The locale for `format`. |
| `aria-valuetext` | `string` | — | Text that screen readers announce in place of the number. |
| `getAriaValueText` | `(formattedValue: string, value: number) => string` | — | Returns the text that screen readers announce. Called when the value changes. |
| `children` | `ReactNode` | — | The parts: `Meter.Label`, `Meter.Value`, and `Meter.Track` with `Meter.Indicator` inside. |

### Parts

| Part | Prop | Type | Description |
| --- | --- | --- | --- |
| `Meter.Label` | `children` | `ReactNode` | The visible name of the meter. Always include it. |
| `Meter.Value` | `children` | `(formattedValue: string, value: number) => ReactNode` | Optional. Returns the text to show. Without it, Value shows the formatted number. |
| `Meter.Track` | `children` | `ReactNode` | Holds `Meter.Indicator`. |
| `Meter.Indicator` | — | — | The fill. Takes no props. |

Meter and its parts accept no other props. Set the space around a Meter with the `gap` of its parent layout.

## Examples

```tsx
<Meter.Root value={72}>
  <Meter.Label>Storage</Meter.Label>
  <Meter.Value />
  <Meter.Track><Meter.Indicator /></Meter.Track>
</Meter.Root>
```

```tsx
<Meter.Root value={94} max={100} tone="danger" size="200" format={{ style: 'decimal' }}>
  <Meter.Label>Seats used</Meter.Label>
  <Meter.Value>{(formatted) => `${formatted} of 100`}</Meter.Value>
  <Meter.Track><Meter.Indicator /></Meter.Track>
</Meter.Root>
```

## Contexts

All colors follow an ancestor's `data-context` (`on-primary`, `on-secondary`, `default`) and `data-section` overrides.

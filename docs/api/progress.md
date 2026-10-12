# Progress

## Usage

Progress shows how much of a running task is complete, such as an upload or an import. Use it while the task runs; pass `value={null}` when the duration is unknown. Don't use it for a measurement; use Meter. When the task finishes, show what comes next instead of a full bar.

## Props

### Progress.Root

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number \| null` | — | Required. The current value. `null`: the duration is unknown, and the fill slides. |
| `min` | `number` | `0` | The low end of the range. |
| `max` | `number` | `100` | The high end of the range. |
| `size` | `'200' \| '300' \| '400'` | `'300'` | Track height. `200`: a thin bar. `300`: the standard bar. `400`: a thick bar. Text size does not change. |
| `format` | `Intl.NumberFormatOptions` | percent | Formats the number that `Progress.Value` shows and screen readers announce. |
| `locale` | `Intl.LocalesArgument` | the user's locale | The locale for `format`. |
| `aria-valuetext` | `string` | — | Text that screen readers announce in place of the number. |
| `getAriaValueText` | `(formattedValue: string \| null, value: number \| null) => string` | — | Returns the text that screen readers announce. Called when the value changes. |
| `children` | `ReactNode` | — | The parts: `Progress.Label`, `Progress.Value`, and `Progress.Track` with `Progress.Indicator` inside. |

### Parts

| Part | Prop | Type | Description |
| --- | --- | --- | --- |
| `Progress.Label` | `children` | `ReactNode` | The visible name of the task. Always include it. |
| `Progress.Value` | `children` | `(formattedValue: string \| null, value: number \| null) => ReactNode` | Optional. Returns the text to show. Without it, Value shows the formatted number, and nothing while the duration is unknown. |
| `Progress.Track` | `children` | `ReactNode` | Holds `Progress.Indicator`. |
| `Progress.Indicator` | — | — | The fill. Takes no props. |

Progress and its parts accept no other props. Set the space around a Progress with the `gap` of its parent layout.

## Examples

```tsx
<Progress.Root value={40}>
  <Progress.Label>Uploading photos</Progress.Label>
  <Progress.Value />
  <Progress.Track><Progress.Indicator /></Progress.Track>
</Progress.Root>
```

```tsx
<Progress.Root value={null} size="200">
  <Progress.Label>Preparing export</Progress.Label>
  <Progress.Track><Progress.Indicator /></Progress.Track>
</Progress.Root>
```

## Contexts

All colors follow an ancestor's `data-context` (`on-primary`, `on-secondary`, `default`) and `data-section` overrides.

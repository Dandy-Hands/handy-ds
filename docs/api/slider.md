# Slider

## Usage

Slider picks a number, or a range of two or more numbers, by dragging a thumb along a track. Use it where an approximate value inside a known range is enough, such as volume or a price range. Don't use it when the user must type an exact number; use NumberField. Don't use it to show a value the user cannot change; use Meter or Progress.

## Props

### Slider.Root

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number \| readonly number[]` | — | The controlled value. A number gives one thumb. An array gives one thumb for each number. |
| `defaultValue` | `number \| readonly number[]` | — | The initial value when you do not control the value. |
| `onValueChange` | `(value, eventDetails) => void` | — | Called on every change while the user drags or presses a key. `value` has the same shape as `value`. |
| `onValueCommitted` | `(value, eventDetails) => void` | — | Called once when the user finishes a change, such as when the pointer is released. Use it to save the value. |
| `min` | `number` | `0` | The low end of the range. |
| `max` | `number` | `100` | The high end of the range. |
| `step` | `number` | `1` | The distance between values. Arrow keys move one step. |
| `largeStep` | `number` | `10` | The distance for Page Up, Page Down, and Shift with an arrow key. |
| `minStepsBetweenValues` | `number` | `0` | The smallest number of steps between two thumbs in a range slider. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | `horizontal`: the track runs left to right. `vertical`: the track runs bottom to top and fills the height of its parent. |
| `size` | `'200' \| '300' \| '400'` | `'300'` | Track height. `200`: a thin track. `300`: the standard track. `400`: a thick track. The thumb is larger than the track in every size. Text size does not change. |
| `disabled` | `boolean` | `false` | The user cannot change the value. |
| `name` | `string` | — | The field name when a form is submitted. |
| `form` | `string` | — | The `id` of the form that owns the slider, when the slider is outside the form. |
| `format` | `Intl.NumberFormatOptions` | plain number | Formats the numbers that `Slider.Value` shows and screen readers announce. |
| `locale` | `Intl.LocalesArgument` | the user's locale | The locale for `format`. |
| `thumbCollisionBehavior` | `'push' \| 'swap' \| 'none'` | `'push'` | What happens when a thumb meets another. `push`: it moves the other thumb. `swap`: they change places. `none`: it stops. |
| `children` | `ReactNode` | — | The parts: `Slider.Label`, `Slider.Value`, and `Slider.Control`. |

### Parts

| Part | Prop | Type | Description |
| --- | --- | --- | --- |
| `Slider.Label` | `children` | `ReactNode` | The visible name of the slider. Always include it. |
| `Slider.Value` | `children` | `(formattedValues: readonly string[], values: readonly number[]) => ReactNode` | Optional. Returns the text to show. Without it, Value shows the formatted number, or the formatted numbers joined by a dash for a range. |
| `Slider.Control` | `getAriaLabel` | `(index: number) => string` | Returns the screen reader name of the thumb at `index`. Set it for a range slider, for example `Minimum` and `Maximum`. |
| `Slider.Control` | `getAriaValueText` | `(formattedValue: string, value: number, index: number) => string` | Returns the text that screen readers announce for a thumb in place of the number. |

`Slider.Control` draws the track, the fill, and one thumb for each value. Do not add them yourself. Slider and its parts accept no other props. A vertical Slider takes the height of its parent, so set the parent height.

## Examples

```tsx
<Slider.Root defaultValue={40}>
  <Slider.Label>Volume</Slider.Label>
  <Slider.Value />
  <Slider.Control />
</Slider.Root>
```

```tsx
<Slider.Root
  defaultValue={[20, 80]}
  min={0}
  max={200}
  step={5}
  size="400"
  format={{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }}
  onValueCommitted={(range) => saveFilter(range)}
>
  <Slider.Label>Price</Slider.Label>
  <Slider.Value>{([low, high]) => `${low} to ${high}`}</Slider.Value>
  <Slider.Control getAriaLabel={(index) => (index === 0 ? 'Minimum price' : 'Maximum price')} />
</Slider.Root>
```

## Contexts

All colors follow an ancestor's `data-context` (`on-primary`, `on-secondary`, `default`) and `data-section` overrides.

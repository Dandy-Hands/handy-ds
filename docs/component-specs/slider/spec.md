Status:
- spec: reviewed
- code: built
- figma: built
- docs: built

# Internal Spec: Slider

- Date: 2026-10-15
- Interview: `interview-guide-2026-10-15.md`
- Base UI version documented from: `@base-ui/react` 1.8.0 (`@base-ui/react/slider`)

## Description

Slider picks a number, or a range of numbers, by dragging a thumb along a track. It wraps Base UI's slider in four parts: `Slider.Root`, `Slider.Label`, `Slider.Value`, and `Slider.Control`. `Slider.Control` draws the track, the fill, and one thumb for each value, so a caller cannot assemble them wrongly. A `number` value gives one thumb. A `number[]` value gives a range slider with one thumb for each number.

## Usage

- Do use Slider to pick a number inside a known range where an approximate value is enough, such as volume or a price range.
- Do label every Slider with `Slider.Label`, and give each thumb of a range slider its own name through `getAriaLabel`.
- Don't use Slider when the user must type an exact number. Use NumberInput.
- Don't use Slider to show a value the user cannot change. Use Meter or Progress.

## Base UI API

Wrapped components: `Slider.Root` as `Slider.Root`, and `Label`, `Value`, `Control`. `Track`, `Indicator`, and `Thumb` are rendered inside `Control` and are not exported.

| Base UI member | Decision |
| --- | --- |
| `Root` `value`, `defaultValue`, `onValueChange`, `onValueCommitted` | Exposed. The type is `number` or `readonly number[]`, as in Base UI. |
| `Root` `min` (0), `max` (100), `step` (1), `largeStep` (10), `minStepsBetweenValues` (0) | Exposed. |
| `Root` `orientation` (`horizontal`) | Exposed. Both values. |
| `Root` `disabled`, `name`, `form` | Exposed. |
| `Root` `format`, `locale` | Exposed. |
| `Root` `thumbCollisionBehavior` (`push`) | Exposed. |
| `Root` `thumbAlignment` | Omitted. Fixed to `edge`: the thumb stays inside the ends of the track. |
| `Root` `render`, `ref`, `children` | Exposed. `children` holds the parts. |
| `Root` `className`, `style` | Omitted. Same recorded break of API conventions section 1 as Button, Checkbox, and Switch. |
| `Label` `children` | Exposed. |
| `Value` `children` as `(formattedValues, values) => ReactNode` | Exposed. Content: for example "$20 to $80". |
| `Control` `getAriaLabel(index)`, `getAriaValueText(formattedValue, value, index)` | Exposed on `Control`. It passes them to each thumb. |
| `Control` `className`, `style`, `render` | Omitted. |
| `Track`, `Indicator` | Not exported. `Control` renders them. |
| `Thumb` `index` | Not exposed. `Control` sets it from the number of values. |
| `Thumb` `disabled`, `aria-valuetext`, `inputRef`, `tabIndex`, `onBlur`, `onFocus`, `onKeyDown` | Omitted. No second use. `Root` `disabled` covers every thumb. |
| `data-dragging`, `data-orientation`, `data-disabled`, `data-invalid`, `data-focused`, `data-index` | Kept. CSS reads them. |

The prop types are written out with `Omit<..., 'className' | 'style' | 'thumbAlignment'>`. `Control` takes `getAriaLabel` and `getAriaValueText` only.

## Extension API

| Part | Prop | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `Slider.Root` | `size` | `SliderSize = '200' \| '300' \| '400'` | `'300'` | Track height, a `measure/size` step (8, 12, 16px at density 1). The thumb is two steps larger (16, 20, 24px). Set as `data-size`. Does not change the text size. Not responsive. |

Same steps and default as Meter and Progress.

**Vertical length.** There is no length prop. A vertical Slider fills the height of its parent. The caller sizes the parent.

## Token mapping

All of this mapping is a Claude call (token interview scope): the user decided the structure only.

| Part | Property | Token |
| --- | --- | --- |
| Root | row gap / column gap | `hds/sem/measure/space/100` / `hds/sem/measure/space/200` |
| Track | `block-size` (horizontal), `inline-size` (vertical) | `hds/sem/measure/size/{size}` |
| Track | `background` | `hds/sem/color/surface/sunken/bg` |
| Track | `border-radius` | `hds/sem/radius/round` |
| Track, disabled | `background` | `hds/sem/color/field/disabled/bg` |
| Indicator (fill) | `background` | `hds/sem/color/field/checked/bg` |
| Indicator, invalid | `background` | `hds/sem/color/field/error/border` |
| Indicator, disabled | `background` | `hds/sem/color/field/disabled/fg` |
| Thumb | `inline-size`, `block-size` | `hds/sem/measure/size/{size + 2 steps}` (see table below) |
| Thumb | `background` | `hds/sem/color/field/default/bg` |
| Thumb | `border-color` | `hds/sem/color/field/default/border` |
| Thumb, hover | `border-color` | `hds/sem/color/field/hover/border` |
| Thumb, focus-visible, dragging | `border-color` | `hds/sem/color/field/focus/border` |
| Thumb, invalid | `border-color` | `hds/sem/color/field/error/border` |
| Thumb, disabled | `background`, `border-color` | `hds/sem/color/field/disabled/bg`, `hds/sem/color/field/disabled/fg` |
| Thumb | `border-width` | `hds/sem/border/control` |
| Thumb | `border-radius` | `hds/sem/radius/round` |
| Focus ring | outline on the thumb | `hds/sem/color/focus/ring`, `hds/sem/border/focus` (from `base.css`) |
| Label | color | `hds/sem/color/content/default/fg` |
| Label | font | `hds/sem/typography/label/{family\|weight\|leading\|tracking}`, `hds/sem/typography/label/size/md` |
| Value | color | `hds/sem/color/content/muted/fg` |
| Value | font | `hds/sem/typography/caption/{family\|weight\|leading\|tracking}`, `hds/sem/typography/caption/size/md` |

Thumb size by `size`:

| `size` | Track | Thumb |
| --- | --- | --- |
| `200` | `measure/size/200` (8px) | `measure/size/400` (16px) |
| `300` | `measure/size/300` (12px) | `measure/size/500` (20px) |
| `400` | `measure/size/400` (16px) | `measure/size/600` (24px) |

Notes:

- Layout is structural: a grid with Label in column 1, Value in column 2, and Control across both columns, as in Meter. In a vertical Slider the Control fills the parent height and Label and Value sit above it.
- The fill runs from the track start to the thumb. In a range slider it runs between the first and last thumb.
- The track is `surface/sunken/bg` as in Meter. It is low contrast on purpose. The thumb border (`field/default/border`, 3:1) and the fill (`field/checked/bg`, 3:1) mark the value and the position.
- Contrast: `field/default/border` and `field/checked/bg` against the surface need 3:1 (non-text). The checker owns the pairs. Disabled is exempt.
- Hover is a thumb state only. The track has no hover look.
- No fill motion. The thumb follows the pointer without a transition, so it never lags a drag.
- Context-passive: all colors re-resolve from ancestor `data-context` and `data-section` overrides.

## Code consequences (for `hds-component-code`)

- `Slider.tsx` exports `Slider = { Root, Label, Value, Control }`. `Root` is a function component that sets `data-size`, passes `thumbAlignment="edge"`, and puts the length of `value ?? defaultValue` in a small context. `Control` reads that length and renders `BaseSlider.Control` > `Track` > `Indicator`, then one `Thumb` with `index={i}` for each value. Export `SliderSize`.
- A `Slider.Root` inside `Field.Root` gets the Field state attributes from Base UI. Check the invalid look in the docs example.
- Add `Slider` to `src/index.ts` under the Field controls. Add it to `docs/components.md`, `docs/rules.md`, and `docs-site/src/Showcase.tsx`.
- Write `e2e/slider.spec.ts` only for behavior Base UI does not provide. None is expected.

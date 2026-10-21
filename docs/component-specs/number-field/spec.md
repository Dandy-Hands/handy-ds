Status:
- spec: reviewed
- code: built
- figma: built
- docs: built

# Internal Spec: NumberInput

- Date: 2026-10-21
- Interview: `interview-guide-2026-10-21.md`
- Base UI version documented from: `@base-ui/react` 1.8.0 (`@base-ui/react/number-field`)
- Folder name: `number-field/` (the component is renamed from `NumberField` to `NumberInput` in this interview).
- Supersedes the retroactive spec of 2026-09-23 (a namespace of `Root`, `Group`, `Input`, `Decrement`, `Increment`).

## Description

NumberInput is a single-line field for a number. It renders one frame, one `<input>`, optional `start` and `end` slots, and optional − and + steppers. The frame uses the same look as TextInput. The default is typed entry: a plain field with no buttons. The `steppers` flag adds the buttons for small counts. The arrow keys always step the value. The `format` option sets how the number looks (currency, percent, unit) and keeps the `value` a plain `number`.

## Usage

- Do use NumberInput for an exact number: a price, an amount, a quantity, a percentage.
- Do set `format` for currency, percent, or a unit. Set `steppers` for a small count such as seats or copies.
- Do wrap it in a `Field` when it has a visible label. Use a bare NumberInput only with an `aria-label`.
- Do set `min`, `max`, and `allowOutOfRange` together when a limit must warn and not clamp.
- Don't use it for a value that the user picks by feel in a known range. Use Slider.
- Don't use it for a short list of options. Use Select or Radio.
- Don't use it for a phone number, a postal code, or an ID. They are text. Use TextInput or PhoneInput.
- Don't use it for a date or a time.

## Base UI API

Wrapped component: `NumberField` from `@base-ui/react/number-field`. The component renders `Root`, `Group`, `Input`, and (with `steppers`) `Decrement` and `Increment`. The caller does not see the parts.

| Base UI member | Decision |
| --- | --- |
| `value`, `defaultValue`, `onValueChange`, `onValueCommitted` | Exposed. `value` is `number \| null`. `null` is an empty field. |
| `min`, `max`, `step`, `smallStep`, `largeStep`, `snapOnStep` | Exposed. |
| `allowOutOfRange` | Exposed (interview 2026-10-21). A typed number outside `min` and `max` stays and the field is invalid, so money does not change silently on blur. |
| `format`, `locale` | Exposed. |
| `name`, `form`, `id`, `required`, `disabled`, `readOnly` | Exposed, on `Root`. |
| `allowWheelScrub` | Omitted (interview 2026-10-21). A page scroll could change a value by mistake. |
| `ScrubArea`, `ScrubAreaCursor` | Omitted (interview 2026-10-21). Add at the second real use. |
| `inputRef` | Omitted. `ref` covers it. |
| Native `<input>` attributes (`placeholder`, `autoComplete`, `inputMode`, `aria-*`, ...) | Exposed on the `<input>`. |
| `ref` | Exposed on the `<input>`, so callers can call `focus()`. |
| `className` | Exposed on the frame (`Group`). The frame holds the look. |
| `render`, `style` | Omitted. The component owns the elements. The `render` rule is still open (`.claude/TODO.md`). |
| `aria-roledescription` | Not exposed. The Base UI default stays. |
| `data-disabled`, `data-readonly`, `data-required`, `data-valid`, `data-invalid`, `data-touched`, `data-dirty`, `data-filled`, `data-focused` | Kept on the parts. The frame reads them. |

Prop routing: the Root members above go to `Root`. All other props go to the `<input>`. The prop type is `Omit<NumberField.Root.Props, 'render' | 'style' | 'className' | 'allowWheelScrub' | 'inputRef' | 'children'>` plus the native input attributes, `ref`, and the frame `className`.

## Extension API

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `NumberInputSize = '800' \| '1000' \| '1200'` | `'1000'` | Control height, a `measure/size` step (32, 40, 48px at density 1). Also sets padding and stepper size. Set as `data-size`. Same axis as TextInput. Not responsive. |
| `steppers` | `boolean` | `false` | Shows the − button at the start edge and the + button at the end edge. A real two-state flag (API conventions section 3). Arrow keys step the value with or without it. |
| `start` | `ReactNode` | none | Content before the number, inside the frame. Slot prop. |
| `end` | `ReactNode` | none | Content after the number, inside the frame. Slot prop. |

`start` and `end` follow the slot-prop rule (API conventions section 1). Examples: an `Icon`, a unit that `Intl` does not know, a fixed symbol, a button. With `steppers` on, the order is: − button, `start`, number, `end`, + button.

No `width` prop. The field fills its `Field` container. The − and + buttons have fixed accessible names from the built-in strings (`Decrease`, `Increase`) in v1; localization is not in scope.

## Behavior

- Arrow Up and Arrow Down step the value by `step`. Alt uses `smallStep`. Shift uses `largeStep`. Base UI provides this.
- Without `allowOutOfRange`, a typed number outside `min` and `max` is clamped on blur. With it, the number stays and Base UI marks the field invalid.
- `format` changes the text only. The value stays a `number`. Percent style shows `0.5` as `50%`. Currency and unit styles follow `locale`.
- The value is a floating-point number. The component does not round. A caller who handles money rounds the value or keeps integer cents.
- A press on the frame or on non-interactive slot content focuses the `<input>`. A press on a button inside a slot works as normal.
- With `steppers`, a stepper at its limit is disabled. A disabled or read-only field disables both steppers.
- Inside a `Field.Root`, Base UI wires the label, description, and validity. `Field.Root` validates on submit by default. For the invalid state of `allowOutOfRange` on blur, set `validationMode="onBlur"`.

## Structure

```
<div class="hds-number-input">                          Root (display: block, inline-size 100%)
  <div class="hds-control hds-text-input" data-size>    Group = frame (className goes here)
    <button class="hds-control__button">                Decrement, only with steppers
    <span class="hds-text-input__start">                only when start is set
    <input class="hds-control__input">
    <span class="hds-text-input__end">                  only when end is set
    <button class="hds-control__button">                Increment, only with steppers
  </div>
</div>
```

## Token mapping

NumberInput reuses the TextInput mapping (`docs/component-specs/input/spec.md`): frame, input, slots, and states. All values below are Claude calls (token interview scope).

| Part | Property | Token |
| --- | --- | --- |
| Frame, input, slots | all properties | as TextInput |
| Stepper button | size | square, as tall as the inner height of the frame |
| Stepper button | glyph `color` | inherits the frame `color`, `hds/sem/color/field/default/fg` |
| Stepper button, hover | `background`, `color` | `hds/sem/color/action/tertiary/hover/{bg,fg}` (cross-category borrow, kept) |
| Stepper button, focus | ring | `hds/sem/color/focus/ring`, `hds/sem/border/focus` (`base.css`, inset) |
| Stepper button, disabled | `color` | `hds/sem/color/field/disabled/fg` |
| Stepper button | `border-radius` | `hds/sem/radius/control` |

Notes:

- No new tokens. No primitive or driver references.
- The stepper has no divider line and no own background at rest.
- Contrast: Field pairs are checked by `src/tokens/contrast.ts`. The glyph uses `field/default/fg` on `field/default/bg`, a checked pair.
- Context-passive: all colors re-resolve from ancestor `data-context` and `data-section` overrides.

## Code consequences (for `hds-component-code`)

- Create `NumberInput.tsx` (replaces `NumberField.tsx`). Export `NumberInput`, `NumberInputProps`, and `NumberInputSize` from `src/index.ts` under Form controls. Remove `NumberField`. No backwards compatibility is kept.
- Split props between `Root` and the `<input>` (Base UI extension table above). Share the slot CSS with `TextInput.css`. `Input.tsx` cannot be reused, because it wraps the Base UI `Input`.
- Rename every use: `docs/rules.md`, `docs/components.md`, `docs/api/index.md`, `docs/api/text-input.md`, `docs/api/slider.md`, `docs/component-specs/input/spec.md`, `docs/component-specs/slider/spec.md`, `docs-site/src/Showcase.tsx`, `docs/components/text-input.mdx`, `docs/components/slider.mdx`, `src/components/render.test.ts`, `.claude/skills/hds-component-docs/SKILL.md`, and the `control.css` header comment.
- Rewrite `docs/components/number-field.mdx` as `number-input.mdx` (with the page front matter `category: Form controls`). This also fixes the failing e2e page (`value` and `defaultValue` on one input).
- Add `e2e/number-input.spec.ts` only for behavior Base UI does not provide: the `steppers` flag, slots, and `allowOutOfRange` display. Base UI covers stepping and clamping.
- `MinusIcon` and `PlusIcon` stay in `icons.tsx`.

## Build notes

- Code, docs, and e2e built 2026-10-21. `e2e/number-input.spec.ts` covers steppers, the arrow keys, the stepper size, `format`, and `allowOutOfRange`.
- Figma built 2026-10-21: page `NumberInput`, 30 variants (`size`, `state`, `steppers`), properties `start`, `end`, `value`, `unit`. No hover or limit state for the stepper in Figma.

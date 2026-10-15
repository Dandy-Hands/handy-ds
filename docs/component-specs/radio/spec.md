Status:
- spec: reviewed
- code: built
- figma: built
- docs: built

# Internal Spec: Radio

- Date: 2026-10-13
- Interview: `interview-guide-2026-10-13.md` (dry run: `interview-guide-2026-09-23.md`)
- Base UI version documented from: `@base-ui/react` 1.8.0 (`@base-ui/react/radio`, `@base-ui/react/radio-group`)

## Description

Radio is one choice out of two to five options that stay visible. `Radio` renders one Material Symbols icon for each state: `radio_button_unchecked` (not selected) and `radio_button_checked` (selected). There is no separate circle element. `Radio.Group` holds the options and owns the selection. A `Radio` never stands alone. The label sits outside the radio, in a `Field.Label` or a wrapping `<label>`.

## Usage

- Do use Radio when the user picks exactly one value out of two to five options that all fit on screen.
- Do put every `Radio` inside a `Radio.Group`.
- Do give the group a name with `Fieldset.Root` and `Fieldset.Legend`, or with `aria-labelledby`.
- Do label every radio with `Field.Label` or a wrapping `<label>`.
- Don't use it for more than about five options. Use Select.
- Don't use it when several values can be picked. Use Checkbox.

## Base UI API

Wrapped components: `Radio.Root` and `Radio.Indicator` together as `Radio`, `RadioGroup` as `Radio.Group`.

| Base UI member | Decision |
| --- | --- |
| `Root` `value` | Exposed on `Radio`. Required. Identifies the radio in the group. |
| `Root` `disabled`, `required`, `readOnly` | Exposed on `Radio`. |
| `Root` `render`, `ref`, rest props | Exposed on `Radio`. |
| `Root` `inputRef` | Omitted. No second use. |
| `Root` `nativeButton` | Omitted. Same as Button. |
| `Root` `className`, `style` | Omitted. Same recorded break of API conventions section 1 as Button, Toggle, and Checkbox. |
| `Indicator` (all members) | Not used. The state icons replace it. |
| `RadioGroup` `value`, `defaultValue`, `onValueChange` | Exposed on `Radio.Group`. |
| `RadioGroup` `disabled`, `readOnly`, `required` | Exposed on `Radio.Group`. |
| `RadioGroup` `name`, `form` | Exposed on `Radio.Group`. |
| `RadioGroup` `render`, `ref`, rest props | Exposed on `Radio.Group`. |
| `RadioGroup` `inputRef` | Omitted. No second use. |
| `RadioGroup` `className`, `style` | Omitted. Same as Root. |
| `data-checked`, `data-unchecked`, `data-invalid`, `data-disabled`, `data-readonly` | Kept. CSS reads them. |

`Root` has no `checked`, `defaultChecked`, or `onCheckedChange` in this Base UI version. The group owns the selection. The earlier API doc listed those three props by mistake.

The prop types are written out with `Omit<..., 'className' | 'style' | 'children' | 'inputRef' | 'nativeButton'>` on `Radio`, and `Omit<..., 'className' | 'style' | 'inputRef'>` on `Radio.Group`.

## Extension API

| Part | Prop | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `Radio` | `size` | `RadioSize = '500' \| '600' \| '800'` | `'500'` | Size of the icon, a `measure/size` step (20, 24, 32px at density 1). Same steps as `CheckboxSize`. The circle drawn inside is smaller than the step. Set as `data-size`. |
| `Radio.Group` | `orientation` | `'horizontal' \| 'vertical'` | `'vertical'` | Layout direction of the radios. Layout only. Set as `data-orientation`. |

No text prop and no icon prop. The label is a `Field.Label` or a wrapping `<label>`. The icons are not replaceable.

## Token mapping

Each state icon is an `Icon` with `currentColor`, no `tone`, and no `fill`. The root sets the color for the state. The colors match Checkbox.

| Part | Property | Token |
| --- | --- | --- |
| Radio | `font-size`, `inline-size`, `block-size` | `hds/sem/measure/size/{size}` |
| Radio, not selected | icon `color` | `hds/sem/color/field/default/border` |
| Radio, not selected, hover | icon `color` | `hds/sem/color/field/hover/border` |
| Radio, selected | icon `color` | `hds/sem/color/field/checked/bg` |
| Radio, invalid | icon `color` | `hds/sem/color/field/error/border` |
| Radio, disabled | icon `color` | `hds/sem/color/field/disabled/fg` |
| Radio | `border-radius` (focus ring shape only) | `hds/sem/radius/round` |
| Radio.Group | `gap` | `hds/sem/measure/space/200` vertical, `hds/sem/measure/space/400` horizontal |
| Focus ring | outline | `hds/sem/color/focus/ring`, `hds/sem/border/focus` (from `base.css`) |

Notes:

- Claude calls (token interview scope): the colors above (same as Checkbox), `radius/round` for the focus ring shape, the group gaps, no own look for `readOnly`, no Field `focus` border.
- The icons are outlines. The page surface shows through them. `field/default/bg`, `field/checked/fg`, and `border/control` are not read.
- The icon glyph has empty margin. The circle drawn is about three quarters of the `size` step.
- Contrast: `field/default/border` and `field/checked/bg` against the surface need 3:1 (non-text). The checker owns the pairs.
- Context-passive: all colors re-resolve from ancestor `data-context` and `data-section` overrides.
- The icons need the Material Symbols font. The client loads it (`docs/rules.md`).

## Code consequences (for `hds-component-code`)

- `Radio.tsx` exports `Radio` as a function component with a `Group` member: `Object.assign(RadioItem, { Group })`. `RadioItem` renders `BaseRadio.Root` with two `Icon` children: `radio_button_unchecked` and `radio_button_checked`. CSS shows one, keyed on `data-checked`. Remove `RadioGroup` from `Radio.tsx` and `src/index.ts`. Export `RadioSize` and `RadioGroupOrientation`.
- `Radio.Group` is `BaseRadioGroup` with `data-orientation` and the class `hds-radio-group`.
- Create `Radio.css` with the rules for `.hds-radio` and `.hds-radio-group`. Move them out of `Checkbox.css`, and remove `.hds-choice-group` and the old `.hds-radio*` rules there. Radio then imports `Radio.css` and not `Checkbox.css`. Both components can share the color rules through one shared selector if the code phase finds that simpler.
- Update every use of `Radio.Root`, `Radio.Indicator`, and `RadioGroup`: `docs-site/src/Showcase.tsx`, `docs-site/src/theme-tool/Preview.tsx`, `docs/rules.md`, `docs/components.md`, `docs/components/radio.mdx`, `examples/`, and any render or e2e test. No backwards compatibility is kept.

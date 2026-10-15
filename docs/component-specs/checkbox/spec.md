Status:
- spec: reviewed
- code: built
- figma: built
- docs: built

# Internal Spec: Checkbox

- Date: 2026-10-13
- Interview: `interview-guide-2026-10-13.md` (dry run: `interview-guide-2026-09-23.md`)
- Base UI version documented from: `@base-ui/react` 1.8.0 (`@base-ui/react/checkbox`, `@base-ui/react/checkbox-group`)

## Description

Checkbox is a yes/no control, or one of several picked from a few options. `Checkbox` renders one Material Symbols icon for each state: `check_box_outline_blank` (unticked), `check_box` (ticked), and `indeterminate_check_box` (`indeterminate`). There is no separate box element. `Checkbox.Group` holds several checkboxes and shares their state. The label sits outside the box, in a `Field.Label` or a wrapping `<label>`.

## Usage

- Do use Checkbox when the value is submitted with a form, or when several options can be picked at once.
- Do label every checkbox with `Field.Label` or a wrapping `<label>`.
- Do use `indeterminate` for a parent box over a partly selected set.
- Don't use it for a setting that applies at once. Use Switch.
- Don't use it to pick exactly one option. Use Radio.

## Base UI API

Wrapped components: `Checkbox.Root` and `Checkbox.Indicator` together as `Checkbox`, `CheckboxGroup` as `Checkbox.Group`.

| Base UI member | Decision |
| --- | --- |
| `Root` `checked`, `defaultChecked`, `onCheckedChange` | Exposed on `Checkbox`. |
| `Root` `indeterminate` | Exposed on `Checkbox`. |
| `Root` `disabled`, `readOnly`, `required` | Exposed on `Checkbox`. |
| `Root` `name`, `value`, `form`, `id` | Exposed on `Checkbox`. |
| `Root` `render`, `ref`, rest props | Exposed on `Checkbox`. |
| `Root` `parent` | Omitted. No second use. A parent box uses `indeterminate` with controlled state. |
| `Root` `uncheckedValue` | Omitted. No second use. |
| `Root` `inputRef` | Omitted. No second use. |
| `Root` `nativeButton` | Omitted. Same as Button. |
| `Root` `className`, `style` | Omitted. Same recorded break of API conventions section 1 as Button and Toggle. |
| `Indicator` (all members) | Not used. The state icons replace it. |
| `CheckboxGroup` `value`, `defaultValue`, `onValueChange` | Exposed on `Checkbox.Group`. |
| `CheckboxGroup` `disabled` | Exposed on `Checkbox.Group`. |
| `CheckboxGroup` `render`, `ref`, rest props | Exposed on `Checkbox.Group`. |
| `CheckboxGroup` `allValues` | Omitted. It serves only the `parent` box. |
| `CheckboxGroup` `className`, `style` | Omitted. Same as Root. |
| `data-checked`, `data-indeterminate`, `data-invalid`, `data-disabled`, `data-readonly` | Kept. CSS reads them. |

The prop types are written out with `Omit<..., 'className' | 'style' | 'parent' | 'uncheckedValue' | 'inputRef' | 'nativeButton'>` on `Checkbox`, and `Omit<..., 'className' | 'style' | 'allValues'>` on `Checkbox.Group`.

## Extension API

| Part | Prop | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `Checkbox` | `size` | `CheckboxSize = '500' \| '600' \| '800'` | `'500'` | Size of the icon, a `measure/size` step (20, 24, 32px at density 1). The square drawn inside is smaller than the step. Set as `data-size`. |
| `Checkbox.Group` | `orientation` | `'horizontal' \| 'vertical'` | `'vertical'` | Layout direction of the checkboxes. Set as `data-orientation`. |

No text prop and no icon prop. The label is a `Field.Label` or a wrapping `<label>`. The icons are not replaceable.

## Token mapping

Each state icon is an `Icon` with `currentColor` and no `tone`. The root sets the color for the state. `check_box` and `indeterminate_check_box` use `fill`. `check_box_outline_blank` does not.

| Part | Property | Token |
| --- | --- | --- |
| Checkbox | `font-size`, `inline-size`, `block-size` | `hds/sem/measure/size/{size}` |
| Checkbox, unticked | icon `color` | `hds/sem/color/field/default/border` |
| Checkbox, unticked, hover | icon `color` | `hds/sem/color/field/hover/border` |
| Checkbox, ticked or indeterminate | icon `color` | `hds/sem/color/field/checked/bg` |
| Checkbox, invalid | icon `color` | `hds/sem/color/field/error/border` |
| Checkbox, disabled | icon `color` | `hds/sem/color/field/disabled/fg` |
| Checkbox | `border-radius` (focus ring shape only) | `hds/sem/radius/indicator` |
| Checkbox.Group | `gap` | `hds/sem/measure/space/200` vertical, `hds/sem/measure/space/400` horizontal |
| Focus ring | outline | `hds/sem/color/focus/ring`, `hds/sem/border/focus` (from `base.css`) |

Notes:

- Claude calls (token interview scope): the colors above, `fill` on the ticked and indeterminate icons, the group gaps, no own look for `readOnly`, no Field `focus` border (the focus ring shows focus).
- The unticked icon is an outline with no fill. The page surface shows through it. `field/default/bg` is not read. `field/checked/fg` is not read: the check is a cut-out in the filled square.
- Indeterminate uses the ticked color.
- The icon glyph has empty margin. The square drawn is about three quarters of the `size` step.
- Contrast: `field/default/border` against the surface needs 3:1 (non-text). `field/checked/bg` against the surface needs 3:1. The checker owns the pairs.
- Context-passive: all colors re-resolve from ancestor `data-context` and `data-section` overrides.
- The icons need the Material Symbols font. The client loads it.

## Code consequences (for `hds-component-code`)

- `Checkbox.tsx` exports `Checkbox` as a function component with a `Group` member: `Object.assign(CheckboxBox, { Group })`. `CheckboxBox` renders `BaseCheckbox.Root` with three `Icon` children: `check_box_outline_blank`, `check_box` (`fill`), and `indeterminate_check_box` (`fill`). CSS shows one, keyed on `data-unchecked`, `data-checked`, and `data-indeterminate` on the root. Remove `CheckboxGroup` from `Checkbox.tsx` and `src/index.ts`. Export `CheckboxSize`.
- `Checkbox.Group` is `part(BaseCheckboxGroup, 'hds-checkbox-group', { 'data-orientation': 'vertical' })` with an `orientation` prop that sets `data-orientation`.
- The `.hds-choice-group` rule stays in `Checkbox.css` because Radio uses it. Radio's code phase moves it (decided in the code phase, 2026-10-13).
- `Checkbox.css` is shared with Radio (`.hds-radio`). Radio's re-interview decides the split. Keep the Radio rules working until then.
- `CheckIcon` stays in `icons.tsx` (Combobox, Menu, and Select use it). `MinusIcon` stays for NumberField.
- Update every use of `Checkbox.Root`, `Checkbox.Indicator`, and `CheckboxGroup`: `docs-site/src/Showcase.tsx`, `docs/rules.md`, `docs/components/checkbox.mdx`, and any e2e or render test. No backwards compatibility is kept.

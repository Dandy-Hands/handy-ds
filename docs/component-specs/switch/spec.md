Status:
- spec: reviewed
- code: built
- figma: pending
- docs: pending

# Internal Spec: Switch

- Date: 2026-10-14
- Interview: `interview-guide-2026-10-14.md` (retroactive guide: `interview-guide-2026-09-23.md`)
- Base UI version documented from: `@base-ui/react` 1.8.0 (`@base-ui/react/switch`)

## Description

Switch is an on/off control whose change takes effect the moment it flips. `Switch` renders one Material Symbols icon for each state: `toggle_off` (off) and `toggle_on` (on, `fill`). There is no track or thumb element. The label sits outside the switch, in a `Field.Label` or a wrapping `<label>`.

## Usage

- Do use Switch for a setting that applies at once, such as a preference or a visibility flag.
- Do label every switch with `Field.Label` or a wrapping `<label>`.
- Don't use it when the value is submitted with a form. Use Checkbox.
- Don't use it to pick one option from several. Use Radio.

## Base UI API

Wrapped components: `Switch.Root` as `Switch`. `Switch.Thumb` is not used.

| Base UI member | Decision |
| --- | --- |
| `Root` `checked`, `defaultChecked`, `onCheckedChange` | Exposed on `Switch`. |
| `Root` `disabled`, `readOnly`, `required` | Exposed on `Switch`. |
| `Root` `name`, `value`, `form`, `id` | Exposed on `Switch`. |
| `Root` `render`, `ref`, rest props | Exposed on `Switch`. |
| `Root` `uncheckedValue` | Omitted. No second use. |
| `Root` `inputRef` | Omitted. No second use. |
| `Root` `nativeButton` | Omitted. Same as Button. |
| `Root` `className`, `style` | Omitted. Same recorded break of API conventions section 1 as Button, Toggle, and Checkbox. |
| `Thumb` (all members) | Not used. The state icons replace it. |
| `data-checked`, `data-unchecked`, `data-invalid`, `data-disabled`, `data-readonly` | Kept. CSS reads them. |

The prop types are written out with `Omit<..., 'className' | 'style' | 'children' | 'uncheckedValue' | 'inputRef' | 'nativeButton'>`.

## Extension API

| Part | Prop | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `Switch` | `size` | `SwitchSize = '500' \| '600' \| '800'` | `'500'` | Size of the icon, a `measure/size` step (20, 24, 32px at density 1). Set as `data-size`. |

No text prop and no icon prop. The label is a `Field.Label` or a wrapping `<label>`. The icons are not replaceable.

## Token mapping

Each state icon is an `Icon` with `currentColor` and no `tone`. The root sets the color for the state. `toggle_on` uses `fill`. `toggle_off` does not. The colors match Checkbox.

| Part | Property | Token |
| --- | --- | --- |
| Switch | `font-size`, `inline-size`, `block-size` | `hds/sem/measure/size/{size}` |
| Switch, off | icon `color` | `hds/sem/color/field/default/border` |
| Switch, off, hover | icon `color` | `hds/sem/color/field/hover/border` |
| Switch, on | icon `color` | `hds/sem/color/field/checked/bg` |
| Switch, invalid | icon `color` | `hds/sem/color/field/error/border` |
| Switch, disabled | icon `color` | `hds/sem/color/field/disabled/fg` |
| Switch | `border-radius` (focus ring shape only) | `hds/sem/radius/round` |
| Focus ring | outline | `hds/sem/color/focus/ring`, `hds/sem/border/focus` (from `base.css`) |

Notes:

- Claude calls (token interview scope): the colors above (same as Checkbox), `radius/round` for the focus ring shape, no own look for `readOnly`, no Field `focus` border.
- The change from Action tokens to Field tokens is deliberate: Switch now matches Checkbox and Radio. The earlier Action mapping is dropped.
- The icon glyph has empty margin. The switch drawn is smaller than the `size` step.
- Contrast: `field/default/border` and `field/checked/bg` against the surface need 3:1 (non-text). The checker owns the pairs.
- Context-passive: all colors re-resolve from ancestor `data-context` and `data-section` overrides.
- The icons need the Material Symbols font. The client loads it.

## Code consequences (for `hds-component-code`)

- `Switch.tsx` exports `Switch` as a function component, like `Radio`'s item: `BaseSwitch.Root` with two `Icon` children, `toggle_off` and `toggle_on` (`fill`). CSS shows one, keyed on `data-checked` on the root. Export `SwitchSize`.
- Remove `Switch.Root` and `Switch.Thumb`. Rewrite `Switch.css` to the Radio.css pattern.
- Update every use of `Switch.Root` and `Switch.Thumb`: `docs-site/src/Showcase.tsx`, `docs/components.md`, `docs/rules.md`, `docs/components/switch.mdx`, `examples/*`, and any e2e or render test. No backwards compatibility is kept.

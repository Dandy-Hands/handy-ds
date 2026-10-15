Status:
- spec: reviewed
- code: pending
- figma: pending
- docs: pending

# Internal Spec: Toggle

- Date: 2026-10-12
- Interview: `interview-guide-2026-10-12.md` (dry run: `interview-guide-2026-09-23.md`)
- Base UI version documented from: `@base-ui/react` 1.8.0 (`@base-ui/react/toggle-group`, `@base-ui/react/toggle`)

## Description

Toggle is a group of buttons in one container. Each button stays pressed or not. The container is a filled track with a small padding between the track and the buttons. `Toggle` is the group and the container. `Toggle.Button` is one button. A button never stands alone. A button holds text, an `Icon`, or both.

## Usage

- Do use Toggle for formatting controls (bold, italic) or to pick one or several from a few visible options.
- Do put every `Toggle.Button` inside a `Toggle`.
- Don't use it for a setting that applies at once. Use Switch.
- Don't use it for more than about five options. Use Select.
- Do give an icon-only `Toggle.Button` an `aria-label`.

## Base UI API

Wrapped components: `ToggleGroup` as `Toggle`, `Toggle` as `Toggle.Button`.

| Base UI member | Decision |
| --- | --- |
| `ToggleGroup` `value`, `defaultValue`, `onValueChange` | Exposed on `Toggle`. |
| `ToggleGroup` `multiple` | Exposed on `Toggle`. |
| `ToggleGroup` `orientation` | Exposed on `Toggle`. |
| `ToggleGroup` `disabled` | Exposed on `Toggle`. |
| `ToggleGroup` `render`, `ref`, rest props | Exposed on `Toggle`. |
| `ToggleGroup` `loopFocus` | Omitted. No second use. Focus loops (default true). |
| `Toggle` `value` | Exposed on `Toggle.Button`. Required. Identifies the button in the group. |
| `Toggle` `disabled` | Exposed on `Toggle.Button`. |
| `Toggle` `render`, `ref`, rest props | Exposed on `Toggle.Button`. |
| `Toggle` `pressed`, `defaultPressed`, `onPressedChange` | Omitted. The group owns the pressed state. |
| `Toggle` `nativeButton` | Omitted. Same as Button. |
| `className`, `style` on both | Omitted. Same recorded break of API conventions section 1 as Button. |
| `data-pressed`, `data-disabled` | Kept. CSS reads them. |

The prop types are written out with `Omit<..., 'className' | 'style'>`. `Toggle.Button` also omits the three pressed props. `value` is a string (Base UI types it so).

## Extension API

Set on `Toggle`. Every `Toggle.Button` inside inherits them through context. Set as `data-variant` and `data-size` on the group and on each button.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `ToggleVariant = 'primary' \| 'secondary' \| 'tertiary' \| 'danger'` | `'secondary'` | Role and weight of the buttons, Action axis. Same values as `ButtonVariant`. Replaces `data-priority`. |
| `size` | `ToggleSize = '800' \| '1000' \| '1200'` | `'1000'` | Button height, a `measure/size` step (32, 40, 48px at density 1). Also sets button padding, gap, label size, and the track padding. Same steps as `ButtonSize`. |

No `Toggle.Button` extension props. No text prop, no icon prop, no `width`.

## Token mapping

| Part | Property | Token |
| --- | --- | --- |
| Toggle (track) | `background` | `hds/sem/color/surface/sunken/bg` |
| Toggle (track) | `border-color` | `hds/sem/color/surface/sunken/border` |
| Toggle (track) | `border-width` | `hds/sem/border/container` |
| Toggle (track) | `border-radius` | `hds/sem/radius/container` |
| Toggle (track) | `padding` | `hds/sem/measure/space/100` for `800`, `hds/sem/measure/space/100` for `1000`, `hds/sem/measure/space/200` for `1200` |
| Toggle (track) | `gap` | `hds/sem/measure/space/100` |
| Toggle.Button | `background`, `color`, `border-color` | `hds/sem/color/action/{variant}/{default\|hover\|active\|disabled\|selected}/{bg\|fg\|border}` |
| Toggle.Button | `border-width` | `hds/sem/border/control` |
| Toggle.Button | `border-radius` | `hds/sem/radius/control` |
| Toggle.Button | `block-size` | `hds/sem/measure/size/{size}` |
| Toggle.Button | `padding-inline`, `gap`, font | Same as Button, per `size` step |
| Focus ring | outline | `hds/sem/color/focus/ring`, `hds/sem/border/focus` (from `base.css`) |

Notes:

- State mapping: `selected` = `[data-pressed]`, `hover` = `:hover`, `active` = `:active`, `disabled` = `[data-disabled]`. The Action look is shared with Button.
- **Contrast gap (found 2026-10-12, open).** The pressed button fill (Action `selected/bg`) is almost the same color as `surface/sunken/bg`. I tested the pair at 3:1: `secondary` and `tertiary` fail in both modes (ratio 1.0 to 1.4). The checker has no sunken pair today (interview J4). Options: pick a different track surface, change the `selected` picks, or mark the pressed button with its border. The user decides before the code phase.
- The track radius is `container`; the button radius is `control`. With the default drivers (`container` and `control` radius steps) the outer corner should be larger than the inner corner by the padding. If a theme sets `control` larger than `container`, the corners look wrong. Flagged, not solved.
- Layout (structural): the track is `inline-flex`, `box-sizing: border-box`, `align-items: stretch`. `orientation="vertical"` flips the direction (`flex-direction: column`).
- Context-passive: all colors re-resolve from ancestor `data-context` and `data-section` overrides.

## Code consequences (for `hds-component-code`)

- `Toggle.tsx` exports `Toggle` as a namespace: `Object.assign(part(BaseToggleGroup, 'hds-toggle'), { Button })`. Remove `ToggleGroup` from `Toggle.tsx` and `src/index.ts`. Export `ToggleVariant` and `ToggleSize`.
- `Toggle.Button` reads `variant` and `size` from a small React context that `Toggle` provides. Outside a `Toggle`, Base UI renders a plain Toggle. Throw a clear error in development.
- The `size` axis in `Button.css` is keyed on `.hds-button[data-size]`. `Toggle.Button` can reuse it. The shared look must read `data-variant` (`action.css` still reads `data-priority` as the old name).
- Done 2026-10-12: Toolbar now has its own `Toolbar.css` (`.hds-toolbar`, `.hds-toolbar__group`). Remove the `.hds-toggle-group` rule from `Toggle.css` when the code is rewritten.
- Update every use of `Toggle` and `ToggleGroup`: `docs-site/src/Showcase.tsx`, `docs/rules.md`, `docs/api/index.md`, `docs/components/toggle.mdx`, and any e2e or render test. No backwards compatibility is kept.

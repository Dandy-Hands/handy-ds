Status:
- spec: reviewed
- code: built
- figma: built
- docs: built

# Internal Spec: Toggle

- Date: 2026-10-12
- Interview: `interview-guide-2026-10-12.md` (dry run: `interview-guide-2026-09-23.md`)
- Base UI version documented from: `@base-ui/react` 1.8.0 (`@base-ui/react/toggle-group`, `@base-ui/react/toggle`)

## Description

ToggleGroup is a group of buttons in one container. Each button stays pressed or not. The container is a filled track with a small padding between the track and the buttons. `ToggleGroup` is the group and the container. Toggle is one button. A button never stands alone. A button holds text, an `Icon`, or both.

## Usage

- Do use ToggleGroup for formatting controls (bold, italic) or to pick one or several from a few visible options.
- Do put every Toggle inside a `ToggleGroup`.
- Don't use it for a setting that applies at once. Use Switch.
- Don't use it for more than about five options. Use Select.
- Do give an icon-only Toggle an `aria-label`.

## Base UI API

Wrapped components: `ToggleGroup` and `Toggle`. The names match Base UI (changed back on 2026-10-14; the first draft used `Toggle` and `Toggle.Button`).

| Base UI member | Decision |
| --- | --- |
| `ToggleGroup` `value`, `defaultValue`, `onValueChange` | Exposed on `ToggleGroup`. |
| `ToggleGroup` `multiple` | Exposed on `ToggleGroup`. |
| `ToggleGroup` `orientation` | Exposed on `ToggleGroup`. |
| `ToggleGroup` `disabled` | Exposed on `ToggleGroup`. |
| `ToggleGroup` `render`, `ref`, rest props | Exposed on `ToggleGroup`. |
| `ToggleGroup` `loopFocus` | Omitted. No second use. Focus loops (default true). |
| `Toggle` `value` | Exposed on `Toggle`. Required. Identifies the button in the group. |
| `Toggle` `disabled` | Exposed on `Toggle`. |
| `Toggle` `render`, `ref`, rest props | Exposed on `Toggle`. |
| `Toggle` `pressed`, `defaultPressed`, `onPressedChange` | Omitted. The group owns the pressed state. |
| `Toggle` `nativeButton` | Omitted. Same as Button. |
| `className`, `style` on both | Omitted. Same recorded break of API conventions section 1 as Button. |
| `data-pressed`, `data-disabled` | Kept. CSS reads them. |

The prop types are written out with `Omit<..., 'className' | 'style'>`. Toggle also omits the three pressed props. `value` is a string (Base UI types it so).

## Extension API

Set on `ToggleGroup`. Every Toggle inside inherits them through context. Set as `data-variant` and `data-size` on the group and on each button.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `ToggleVariant = 'primary' \| 'secondary'` | `'secondary'` | Look of a pressed button, Action axis. An idle button uses the next weaker Button variant: `primary` shows idle as `secondary`, `secondary` shows idle as `tertiary`. No `tertiary` or `danger` value, because a pressed state is a choice, not a destructive action. Replaces `data-priority`. |
| `size` | `ToggleSize = '800' \| '1000' \| '1200'` | `'1000'` | Height of the whole group, a `measure/size` step (32, 40, 48px at density 1). Same steps as `ButtonSize`. Also sets the track padding, the gap, the label size, and the horizontal padding of each Toggle. A Toggle fills the track height (26, 30, 38px at density 1). |

No Toggle extension props. No text prop, no icon prop, no `width`.

## Token mapping

| Part | Property | Token |
| --- | --- | --- |
| ToggleGroup (track) | `background` | `hds/sem/color/surface/sunken/bg` |
| ToggleGroup (track) | `border-color` | `hds/sem/color/surface/sunken/border` |
| ToggleGroup (track) | `border-width` | `hds/sem/border/container` |
| ToggleGroup (track) | `border-radius` | `hds/sem/radius/container` |
| ToggleGroup (track) | `block-size` | `hds/sem/measure/size/{size}`. Horizontal only; a vertical group grows with its toggles. |
| ToggleGroup (track) | `padding` | `hds/sem/measure/space/050` for `800`, `hds/sem/measure/space/100` for `1000` and `1200` |
| ToggleGroup (track) | `gap` | Same step as `padding` |
| Toggle | `background`, `color`, `border-color` | `hds/sem/color/action/{look}/{default\|hover\|active\|disabled}/{bg\|fg\|border}`. `look` is `variant` for a pressed button and the next weaker variant for an idle button. |
| Toggle | `border-width` | `hds/sem/border/control` |
| Toggle | `border-radius` | `hds/sem/radius/control` |
| Toggle | `block-size` | Horizontal: fills the track height. Vertical: `hds/sem/measure/size/{size}` minus the track border and twice the track padding. |
| Toggle | `padding-inline`, `gap`, font | Same as Button, per group `size` step |
| Focus ring | outline | `hds/sem/color/focus/ring`, `hds/sem/border/focus` (from `base.css`) |

Notes:

- State mapping: pressed = `[data-pressed]`, which switches `look` to `variant`. The `selected` tokens are not used. `hover` = `:hover`, `active` = `:active`, `disabled` = `[data-disabled]`. The Action look is shared with Button.
- **Contrast gap (closed 2026-10-14).** The pressed button fill was almost the same color as `surface/sunken/bg`. Decided by the user: the pressed button takes the stronger variant and the idle button takes the next weaker variant, so the `selected` tokens are not used. Check secondary default `bg` against `surface/sunken/bg` in the code phase and report a failure.
- The track radius is `container`; the button radius is `control`. With the default drivers (`container` and `control` radius steps) the outer corner should be larger than the inner corner by the padding. If a theme sets `control` larger than `container`, the corners look wrong. Flagged, not solved.
- Layout (structural): the track is `inline-flex`, `box-sizing: border-box`, `align-items: stretch`, with a fixed `block-size`. `orientation="vertical"` flips the direction (`flex-direction: column`) and sets `block-size: auto`.
- **Height rule (decided 2026-10-14).** The group is as tall as a Button of the same `size`. A Toggle fills the inside of the track. At `800` the track padding is `050` so the Toggle stays at 26px, above the 24px target size of WCAG 2.2 (2.5.8). Padding `100` at `800` would give 22px.
- Context-passive: all colors re-resolve from ancestor `data-context` and `data-section` overrides.

## Code consequences (for `hds-component-code`)

- `Toggle.tsx` exports `ToggleGroup`, `Toggle`, `ToggleGroupProps`, `ToggleProps`, `ToggleVariant`, and `ToggleSize`. Classes: `hds-toggle-group` (track), `hds-toggle` (button).
- `Toggle` reads `variant` and `size` from a React context that `ToggleGroup` provides. Outside a `ToggleGroup`, it throws an error. Base UI would render a plain toggle.
- `Toggle` reuses the `Button.css` size axis. It sets `data-variant` from `state.pressed` in a `render` function.
- Callers updated 2026-10-14: `docs-site/src/Showcase.tsx`, `examples/pwa/src/main.tsx`, `docs/rules.md`, `docs/api/index.md`, `docs/components/toggle.mdx`, and the render test. No backwards compatibility is kept.

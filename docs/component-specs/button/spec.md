Status:
- spec: reviewed
- code: built
- figma: built
- docs: built

# Internal Spec: Button

- Date: 2026-10-12
- Interview: `interview-guide-2026-10-12.md` (dry run: `interview-guide-2026-09-21.md`)
- Base UI version documented from: `@base-ui/react` 1.8.0 (`@base-ui/react/button`)

## Description

Button triggers an action the user takes in place. It renders a native `<button>` styled by the Action category. It is a container: text, an icon, or both go in as children. LinkButton is its own component and covers navigation.

## Usage

- Do use Button for actions: submit, save, confirm, open a dialog.
- Don't use Button to navigate. Use LinkButton.
- Do use one `primary` variant per view. It marks the main action.
- Do use `loading` while the action runs. Don't swap the label for a spinner by hand.
- Do give an icon-only Button an `aria-label`.
- Do opt triggers in to the Button look with `render`: `<Dialog.Trigger render={<Button variant="tertiary" />}>`. Triggers carry no look of their own (`.claude/decisions.md`, "Triggers carry no styling").

## Base UI API

Wrapped component: `Button` from `@base-ui/react/button`. Minimal surface with `render`, `ref`, and rest props.

| Base UI member | Decision |
| --- | --- |
| `disabled` | Exposed. Base UI sets `data-disabled`; the Action disabled colors read it. |
| `render` | Exposed. Triggers and other parts compose Button through it. |
| `ref` | Exposed. React 19 prop. Popups use it to position. |
| Native button props (`type`, `onClick`, `form*`, `name`, `value`, `id`, `aria-*`, `data-*`, ...) | Exposed as rest props. `type` defaults to `'button'`. |
| `children` | Exposed. Text, an `Icon`, or both. |
| `focusableWhenDisabled` | Omitted. No second use. A disabled Button leaves the tab order. |
| `nativeButton` | Omitted. Not documented. It matters only for `render` onto a non-button. |
| `className` | Omitted. Recorded break of API conventions section 1 (Composition `className` is pass-through): the user wants a minimal surface. |
| `style` | Omitted. Removed by API conventions section 1. |
| `data-disabled` state attribute | Kept. CSS reads it. |

The prop type is written out as `Omit<ComponentProps<'button'>, 'className' | 'style'>` plus the extension props. It does not extend the Base UI props.

## Extension API

Set as data attributes on the root.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `ButtonVariant = 'primary' \| 'secondary' \| 'tertiary' \| 'danger'` | `'primary'` | Role and weight, Action axis (API conventions section 6). `primary`: the main action. `secondary`: supporting action. `tertiary`: low-weight inline action. `danger`: destructive action. Set as `data-variant`. Renamed from `priority`. |
| `size` | `ButtonSize = '800' \| '1000' \| '1200'` | `'1000'` | Control height, a `measure/size` step (32, 40, 48px at density 1). Also sets padding, gap, and label size. Set as `data-size`. Not responsive. Replaces `sm`/`md`/`lg`. |
| `width` | `ButtonWidth = 'auto' \| 'full'` | `'auto'` | `auto`: fits the content. `full`: fills the parent (`100%`). Set as `data-width`. Not responsive. Replaces `fullWidth`. |
| `loading` | `boolean` | `false` | Shows a spinner before the children, sets `aria-busy="true"`, and disables the Button. Width does not change. |

No `focusableWhenDisabled`, no icon props, no `shape`. An icon-only Button is a Button with an `Icon` child and the standard padding.

## Token mapping

| Part | Property | Token |
| --- | --- | --- |
| Root | `background`, `color`, `border-color` | `hds/sem/color/action/{variant}/{default\|hover\|active\|disabled\|selected}/{bg\|fg\|border}` |
| Root | `border-width` | `hds/sem/border/control` |
| Root | `border-radius` | `hds/sem/radius/control` |
| Root | `block-size` | `hds/sem/measure/size/{size}` |
| Root | `padding-inline` | `hds/sem/measure/space/{step}`: `800` = `300`, `1000` = `400`, `1200` = `600` |
| Root | `gap` | `hds/sem/measure/space/{step}`: `800` = `100`, `1000` and `1200` = `200` |
| Root | font | `hds/sem/typography/label/{family\|weight\|leading\|tracking}` |
| Root | font size | `hds/sem/typography/label/size/{step}`: `800` = `sm`, `1000` = `md`, `1200` = `lg` |
| Focus ring | outline | `hds/sem/color/focus/ring`, `hds/sem/border/focus` (from `base.css`) |

Notes:

- State mapping: `hover` = `:hover`, `active` = `:active`, `disabled` = `[data-disabled]` and `:disabled`. `selected` is not used by Button. The Action look is shared with Toggle, Tab, and menu items.
- Layout (structural): `inline-flex`, centered, `white-space: nowrap`, `box-sizing: border-box`, no vertical padding (height comes from `block-size`). `width="full"` sets `inline-size: 100%`.
- Spinner (structural): `1em` square, `currentColor`, so it follows the foreground token of the current state. The border width and the spin timing are literals. `prefers-reduced-motion` stops the spin.
- An `Icon` child without `size` follows the font size, so it scales with `size`.
- Contrast: the Action pairs are checked by `src/tokens/contrast.ts` in both modes and both brand contexts. No token gaps. `measure/size` has the steps `800`, `1000`, and `1200`.
- Context-passive: all colors re-resolve from ancestor `data-context` and `data-section` overrides.

## Code consequences (for `hds-component-code`)

- `action.css` reads `data-priority` today and treats a missing value as `secondary`. The shared look must read `data-variant`. Toggle, Toolbar, Menu, Tabs, Select, Combobox, NavigationMenu, Dialog, Popover, and Toast set `data-priority` or rely on the default. Their re-interviews rename them. Until then, either keep `data-priority` working in `action.css` or change them in the same commit. Ask the user which.
- Button `size` no longer uses `Size` from `Field.tsx`. Export `ButtonSize` from `Button.tsx`.

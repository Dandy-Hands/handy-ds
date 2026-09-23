# Button — Internal Spec

- Status: docs-built
- Date: 2026-09-21
- Interview: `interview-guide-2026-09-21.md`
- Base UI version documented from: `@base-ui/react` 1.8.0 (`@base-ui/react/button`)
- Code: `src/components/Button.tsx` (reference implementation)

## Description

Button triggers an action. It renders a native `<button>` themed by the Action category. Use it for actions the user takes in place (submit, save, open a dialog); use LinkButton when the control navigates. Don't use Button for navigation, and don't use it as a trigger look — Base UI triggers (Dialog.Trigger, Menu.Trigger...) are semantically their own controls and carry no Button styling by default.

## Usage

- One primary button per view: it marks the main action.
- `priority` marks weight: primary for the main action, secondary for supporting actions, tertiary for low-weight inline actions.
- Disabled buttons are visible but inert (`disabled`); loading buttons show a spinner and block clicks.

## Base UI API

Wrapped component: `Button` from `@base-ui/react/button`. Surface decisions:

| Base UI surface | Decision |
| --- | --- |
| Native `<button>` props (`disabled`, `type`, `onClick`, `form*`, `aria-*`, ...) | Exposed — full passthrough via `ComponentProps<'button'>`. `aria-*` needs no special support. |
| `disabled` | Exposed as-is; Base UI sets `data-disabled`, styled by `action.css`. |
| `render` | Exposed — replace the element or compose with another component. |
| `nativeButton` | Available via passthrough, not documented (edge case: only matters with `render` on non-button elements). |
| Callback-form `className` / `style` | Available via passthrough, not documented. |
| Default `type="button"` | Kept — prevents accidental form submits; callers set `type="submit"` explicitly. |
| `data-disabled` state attribute | Consumed by CSS for the disabled state. |

## Extension API

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `priority` | `'primary' \| 'secondary' \| 'tertiary'` | `'primary'` | Visual weight; set as `data-priority`. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size axis, shared with Input/Field; set as `data-size`. Only Button exposes it among Action parts (decisions.md "Button size axis"). |
| `loading` | `boolean` | `false` | Shows a spinner and sets `aria-busy="true"`. Blocks clicks by disabling the button while loading. `disabled` styling applies during loading; spinner color reuses the fg token of the current state. |
| `fullWidth` | `boolean` | `false` | Stretches to the container width (structural, no token). |

Icons are injected as children (pair with the `Icon` component or inline SVG); there is no `icon` prop.

## Token mapping

Button consumes only these semantic tokens:

- `hds/sem/action/color/{priority}/{default,hover,active,focus,disabled,selected}/{bg,border,fg}` for all three priorities — look and states (`action.css`).
- `hds/sem/action/measure/{sm,md,lg}/{padding-x,padding-y,radius,gap}` and `hds/sem/action/measure/md/border-width` — size axis (`Button.css`, `action.css`).
- `hds/sem/type/measure/label/{size,line-height,letter-spacing}` and `hds/sem/type/other/label/{font-family,weight}` — label typography (`action.css`).
- Focus ring from `base.css`: `hds/sem/focus/color/stroke`, `hds/sem/focus/measure/stroke-width`.

No primitive or driver references. Spinner animation timing is structural (allowed literal) with a `prefers-reduced-motion` fallback. No token gaps found in review.

## LinkButton

LinkButton becomes its own component (`src/components/LinkButton.tsx`, separate export) — not part of the Button file. Same surface as Button minus `loading`/`fullWidth`: `priority`, `size`, and Base UI `useRender` props (including `render`). No Base UI primitive underneath (uses `useRender` + `mergeProps`); an `<a>` that looks like a Button. Exists because Base UI forbids rendering links as buttons (decisions.md Wave 4). Consumes the same Action tokens as Button.

### LinkButton Base UI API

| Base UI surface | Decision |
| --- | --- |
| `useRender` props (`render`, `className`, `style`, native `<a>` props) | Exposed — full passthrough. |
| Callback-form `className` / `style` | Available via passthrough, not documented. |

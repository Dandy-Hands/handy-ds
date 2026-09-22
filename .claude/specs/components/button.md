# Button — Component Spec

Status: built
Figma: not built
Base UI: `@base-ui/react/button` 1.8.0
Source: `node_modules/@base-ui/react/docs/react/components/button.md`
Implementation: `src/components/Button.tsx`, `src/components/Button.css`, `src/components/action.css`

## 1. Purpose

A button that can be rendered as another tag or stay focusable when disabled. Use it to trigger actions. Do not use it for links: Base UI enforces button semantics, so a link that looks like a button is an `<a>` styled with CSS.

## 2. Anatomy

| Part | Renders | Required | Notes |
|---|---|---|---|
| `Button` | `<button>` | yes | Single part. |

```jsx
import { Button } from '@base-ui/react/button';

<Button />
```

## 3. API

Two exports: `Button` (wraps Base UI `Button`) and `LinkButton` (an `<a>` that looks like one). Both carry `hds-button hds-action`.

Button is also how any other part gets a button's look: `<Dialog.Trigger render={<Button priority="tertiary" />}>`. Trigger parts carry no styling of their own.

### Button

**Props**

| Prop | Type | Values | Default | Source | Notes |
|---|---|---|---|---|---|
| `focusableWhenDisabled` | `boolean` | `true`, `false` | `false` | Base UI | Keeps focus on the button while disabled. Base UI's pattern for loading states. |
| `nativeButton` | `boolean` | `true`, `false` | `true` | Base UI | Set `false` when `render` swaps in a non-`<button>` tag (e.g. `<div>`). Not for `<a>`. |
| `priority` | `Priority` | `primary`, `secondary`, `tertiary` | `primary` | HDS | Emits `data-priority`. Action's axis in the token spec; Base UI has no prop for it. |
| `size` | `Size` | `sm`, `md`, `lg` | `md` | HDS | Emits `data-size`. Changes padding, gap and radius. Only Button uses the Action size axis; every other Action part reads `md`. |

Also takes all native `<button>` attributes. `type` is not defaulted to `submit`: set `type="submit"` explicitly for form submit.

**Data attributes**

| Attribute | Values | Meaning |
|---|---|---|
| `data-disabled` | present | Button is disabled. |
| `data-priority` | `primary`, `secondary`, `tertiary` | Action priority axis. HDS. |
| `data-size` | `sm`, `md`, `lg` | Action size axis. HDS. |

**CSS variables:** none.

**State type**

```ts
type ButtonState = { disabled: boolean };
```

**Not added**

| Prop | Why not |
|---|---|
| `loading` | Base UI's pattern covers it: `disabled` + `focusableWhenDisabled` + `aria-labelledby`. See section 6. |
| Icon slots | Children only. Put `Icon` in the children; `.hds-button` is a flex row with `gap`, and `Icon` inherits `currentColor` so it matches the label. |

### LinkButton

No Base UI part. Built with `useRender` + `mergeProps`.

**Props**

| Prop | Type | Values | Default | Source | Notes |
|---|---|---|---|---|---|
| `priority` | `Priority` | `primary`, `secondary`, `tertiary` | `primary` | HDS | Emits `data-priority`. Same axis as Button. |
| `size` | `Size` | `sm`, `md`, `lg` | `md` | HDS | Emits `data-size`. Same axis as Button. |
| `render` | `useRender.ComponentProps<'a'>['render']` | any element | `<a>` | HDS | Swap the tag for a router link. `Button` gets Base UI's own `render`. |

Also takes all native `<a>` attributes.

**Data attributes**

| Attribute | Values | Meaning |
|---|---|---|
| `data-priority` | `primary`, `secondary`, `tertiary` | Action priority axis. HDS. |
| `data-size` | `sm`, `md`, `lg` | Action size axis. HDS. |

## 4. Token mapping

| Part | Category | Axis | Tokens read |
|---|---|---|---|
| `Button` | Action | priority (primary / secondary / tertiary), size (sm / md / lg) | `hds/sem/action/color/{priority}/{state}/{bg,fg,border}`, `hds/sem/action/measure/{size}/{padding-x,padding-y,radius,gap,border-width}` |
| — | Focus | none | `hds/sem/focus/color/stroke`, `hds/sem/focus/measure/stroke-width` |
| — | Type | label (assumed) | `hds/sem/type/measure/label/*`, `hds/sem/type/other/label/*` |

**States**

| Spec state | Source |
|---|---|
| default | none of the below |
| hover | `:hover:not([data-disabled])` |
| active | `:active:not([data-disabled])` |
| focus | `:focus-visible` |
| disabled | `[data-disabled]` |
| selected | not reachable on Button. Base UI Button has no pressed/selected state; that is Toggle. |

Base UI has no prop for either axis. Both are HDS props in section 3.

## 5. Figma mapping

Not built yet. The mapping when it is:

| Figma property | Kind | Values | Code prop |
|---|---|---|---|
| Priority | variant | Primary, Secondary, Tertiary | `priority` |
| Size | variant | Sm, Md, Lg | `size` |
| State | variant | Default, Hover, Active, Focus, Disabled | CSS state, no prop |
| Label | text | — | `children` |

## 6. Accessibility

- Loading state: set `disabled` + `focusableWhenDisabled`, and point `aria-labelledby` at the changing label text so screen readers announce it.
- Icon-only buttons need `aria-label`.
- `render={<a />}` is wrong. Links keep link semantics.

## 7. Open questions

Resolved:

- **Expose `priority`?** Yes. `priority` prop emitting `data-priority` (`.claude/decisions.md`, Wave 4). Usage: `primary` = main action, at most one per view; `secondary` = other actions; `tertiary` = low-emphasis, toolbars, inline (`docs/rules.md` section 4).
- **Link styled as button?** Separate `LinkButton` rendering `<a>` via `useRender`, because Base UI forbids links as buttons (`.claude/decisions.md`, Wave 4).
- **Size axis?** Yes. `size` prop emitting `data-size`, backed by a new `{size}` slot on `action/measure` (`token-system-spec.md` sections 4 and 7). Mirrors `input/measure/{size}`; non-Button Action parts pin to `md`.
- **Loading prop?** No. Base UI's pattern (section 7).
- **Icon slots?** No. Children only.
- **Should Dialog/Popover/Menu triggers look like Buttons by default?** No. Being a trigger says what a control does, not what it looks like, and Base UI ships those parts unstyled. Triggers carry no button classes; the author opts in with `render={<Button />}` (`.claude/decisions.md`, "Triggers carry no styling").

Open:

- None.

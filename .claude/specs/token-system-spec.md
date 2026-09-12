# Client Design System — Token System Spec

## 1. Layers

```
Drivers → Primitives → Semantic Tokens → Components
```

- **Drivers.** Values from which primitives are derived at build time. Brand color, density, type scale, etc.
- **Primitives.** Raw scales and value sets built from drivers. Color ramps, spacing scale, type scale, elevation levels. Not read by components directly.
- **Semantic tokens.** Named values that point at primitives. Grouped by category, type, axis, and state. Read by components.
- **Components.** Read semantic tokens as CSS custom properties. Never read a driver or a primitive directly.

Changing a driver regenerates the primitive values under it. Semantic tokens and components stay unchanged.

### Theme Map
The rule set that maps semantic tokens to primitive tokens.

Per-category style drivers (e.g. action radius) don't create primitives. They select a step on a shared primitive scale (`action.radius: lg` → `hds/prim/radius/lg`), and the Theme Map reads that choice.

---

## 2. Namespace and Primitive Structure

Namespace: `hds`.

**Primitives:**
```
hds/prim/{type}/{property}
```
No category segment.

```
hds/prim/color/primary/600
hds/prim/color/neutral/50
hds/prim/space/4
hds/prim/radius/base
hds/prim/type/scale/3
hds/prim/shadow/level-2
```

**Semantic tokens:**
```
hds/sem/{category}/{type}/[axis]/[state]/{property}
```

```
hds/sem/action/color/primary/hover/bg
hds/sem/action/measure/padding-x
hds/sem/input/color/error/border
hds/sem/type/color/heading/fg
hds/sem/surface/color/0/striped/bg
```

- `category` and `type`: always present.
- `axis`, `state`: present only where the value varies by them.
- `property`: bg, fg, border, padding-x, radius, font-family, etc.
- Context is not part of the token name. See section 3.

---

## 3. Context

- Tokens set at `:root`.
- `data-context="on-primary"` on an element redefines a subset of token names within that element's subtree.
- Children inherit the redefined values via CSS inheritance.
- Contexts nest; each `data-context` boundary resets independently.
- Only tokens that change under a context are redefined in that context block.
- `data-context="default"` inside another context restores the `:root` values for its subtree.

Contexts at launch: `default`, `on-primary`.

---

## 4. Categories

| Category | Covers | Axis | States |
|---|---|---|---|
| Action | Buttons, clickable triggers, switches | priority (primary/secondary/tertiary) | default/hover/active/focus/disabled/selected |
| Input/Field | Text inputs, selects, textareas, checkboxes, radios | size (sm/md/lg) | default/hover/focus/error/disabled/checked |
| Surface | Cards, panels, containers | elevation (0–3) | default/striped |
| Type | All text styles | role (display/heading/body/label/caption) | none |
| Icon | Standalone and paired icons | role (default/secondary/accent) | none |
| Divider | Borders, separators | weight (thin/medium/thick) | none |
| Feedback | Alerts, banners, toasts | sentiment (danger/warning/success/info) | none |
| Overlay | Modal scrims | none | none |
| Focus | Focus ring | none | none |

Composite components are not categories. See section 9.

---

## 5. Token Type

| Type | Examples | Source |
|---|---|---|
| Color | bg, fg, border, shadow | Color ramps; `shadow` holds a full box-shadow from `hds/prim/shadow/*` |
| Measure | padding, gap, radius, height, thickness | Spacing scale × density |
| Other | font-family, font-weight | Font pairing list |

---

## 6. Category Scope by Token Type

| Type | Varies by category |
|---|---|
| Color | Yes |
| Measure | Yes |
| Other (typography) | No — sourced from Type/Icon categories only |

A category's `other` list is empty unless that category has a value not covered by Type or Icon.

Axis applies to a type only where it produces a distinct value for that type:
- Color: varies by priority, sentiment, elevation, role, state.
- Measure: varies by sizing axes only (e.g., Input's size).
- Drop unused axis/state segments.

---

## 7. Category Definitions

**Action**
- Color: `hds/sem/action/color/{priority}/{state}/{property}` — bg, fg, border
- Measure: `hds/sem/action/measure/{property}` — padding-x, padding-y, radius, gap
- Other: none

**Input/Field**
- Color: `hds/sem/input/color/{state}/{property}` — bg, fg, border, placeholder-fg. `checked` is a state on the same `color` token (Checkbox/Radio checked appearance); compose with `disabled` as the Theme Map requires.
- Measure: `hds/sem/input/measure/{size}/{property}` — padding-x, padding-y, height, radius

**Surface**
- Color: `hds/sem/surface/color/{elevation}/{state}/{property}` — bg, border, shadow
- Measure: `hds/sem/surface/measure/{property}` — padding, radius

**Type**
- Color: `hds/sem/type/color/{role}/{property}` — fg
- Measure: `hds/sem/type/measure/{role}/{property}` — size, line-height, letter-spacing
- Other: `hds/sem/type/other/{role}/{property}` — font-family, weight

**Icon**
- Color: `hds/sem/icon/color/{role}/{property}` — fg
- No measure token. Size inherits from adjacent text/action, overridable via component prop.

**Divider**
- Color: `hds/sem/divider/color/{property}` — border
- Measure: `hds/sem/divider/measure/{weight}/{property}` — thickness (thin/medium/thick)

**Feedback**
- Color: `hds/sem/feedback/color/{sentiment}/{property}` — bg, fg, border, icon-fg
- Measure: `hds/sem/feedback/measure/{property}` — padding, radius, gap

**Overlay**
- Color: `hds/sem/overlay/color/bg`

**Focus**
- Color: `hds/sem/focus/color/stroke`
- Measure: `hds/sem/focus/measure/stroke-width`

---

## 8. Demo Token Tree

```css
:root {
  /* ACTION */
  --hds-sem-action-color-primary-default-bg: oklch(52% 0.18 250);
  --hds-sem-action-color-primary-hover-bg: oklch(46% 0.18 250);
  --hds-sem-action-color-primary-active-bg: oklch(40% 0.18 250);
  --hds-sem-action-color-primary-default-fg: oklch(98% 0.01 250);
  --hds-sem-action-color-primary-default-border: transparent;
  --hds-sem-action-color-secondary-default-bg: oklch(94% 0.03 250);
  --hds-sem-action-color-secondary-hover-bg: oklch(90% 0.03 250);
  --hds-sem-action-color-secondary-default-fg: oklch(52% 0.18 250);
  --hds-sem-action-color-secondary-default-border: oklch(80% 0.05 250);
  --hds-sem-action-color-tertiary-default-bg: transparent;
  --hds-sem-action-color-tertiary-hover-bg: oklch(94% 0.03 250);
  --hds-sem-action-color-tertiary-default-fg: oklch(52% 0.18 250);
  --hds-sem-action-color-tertiary-hover-fg: oklch(40% 0.18 250);
  --hds-sem-action-measure-padding-x: 16px;
  --hds-sem-action-measure-padding-y: 10px;
  --hds-sem-action-measure-radius: 8px;
  --hds-sem-action-measure-gap: 8px;

  /* INPUT */
  --hds-sem-input-color-default-bg: oklch(98% 0.01 250);
  --hds-sem-input-color-default-border: oklch(80% 0.02 250);
  --hds-sem-input-color-default-fg: oklch(20% 0.02 250);
  --hds-sem-input-color-default-placeholder-fg: oklch(60% 0.02 250);
  --hds-sem-input-color-focus-border: oklch(52% 0.18 250);
  --hds-sem-input-color-error-border: oklch(55% 0.20 25);
  --hds-sem-input-color-checked-bg: oklch(52% 0.18 250);
  --hds-sem-input-color-checked-fg: oklch(98% 0.01 250);
  --hds-sem-input-color-checked-border: transparent;
  --hds-sem-input-measure-md-padding-x: 12px;
  --hds-sem-input-measure-md-padding-y: 8px;
  --hds-sem-input-measure-md-height: 40px;
  --hds-sem-input-measure-md-radius: 6px;
  --hds-sem-input-measure-sm-height: 32px;

  /* SURFACE */
  --hds-sem-surface-color-0-default-bg: oklch(98% 0.01 250);
  --hds-sem-surface-color-0-default-border: oklch(90% 0.02 250);
  --hds-sem-surface-color-0-default-shadow: 0 1px 2px oklch(0% 0 0 / 0.06);
  --hds-sem-surface-color-0-striped-bg: oklch(95% 0.01 250);
  --hds-sem-surface-color-1-default-bg: oklch(100% 0 0);
  --hds-sem-surface-measure-padding: 24px;
  --hds-sem-surface-measure-radius: 12px;

  /* TYPE */
  --hds-sem-type-color-heading-fg: oklch(20% 0.02 250);
  --hds-sem-type-color-body-fg: oklch(30% 0.02 250);
  --hds-sem-type-color-label-fg: oklch(40% 0.02 250);
  --hds-sem-type-measure-heading-size: 28px;
  --hds-sem-type-measure-heading-line-height: 1.2;
  --hds-sem-type-measure-body-size: 16px;
  --hds-sem-type-measure-body-line-height: 1.6;
  --hds-sem-type-other-heading-font-family: "Source Serif 4", serif;
  --hds-sem-type-other-heading-weight: 700;
  --hds-sem-type-other-body-font-family: "Inter", sans-serif;
  --hds-sem-type-other-body-weight: 400;

  /* ICON */
  --hds-sem-icon-color-default-fg: oklch(30% 0.02 250);
  --hds-sem-icon-color-secondary-fg: oklch(55% 0.02 250);
  --hds-sem-icon-color-accent-fg: oklch(52% 0.18 250);

  /* DIVIDER */
  --hds-sem-divider-color-border: oklch(90% 0.02 250);
  --hds-sem-divider-measure-thin-thickness: 1px;
  --hds-sem-divider-measure-medium-thickness: 2px;
  --hds-sem-divider-measure-thick-thickness: 4px;

  /* FEEDBACK */
  --hds-sem-feedback-color-danger-bg: oklch(95% 0.05 25);
  --hds-sem-feedback-color-danger-fg: oklch(40% 0.15 25);
  --hds-sem-feedback-color-danger-border: oklch(80% 0.10 25);
  --hds-sem-feedback-color-danger-icon-fg: oklch(50% 0.18 25);
  --hds-sem-feedback-measure-padding: 16px;
  --hds-sem-feedback-measure-radius: 8px;
  --hds-sem-feedback-measure-gap: 8px;

  /* OVERLAY */
  --hds-sem-overlay-color-bg: oklch(0% 0 0 / 0.5);

  /* FOCUS */
  --hds-sem-focus-color-stroke: oklch(52% 0.18 250);
  --hds-sem-focus-measure-stroke-width: 2px;
}

[data-context="on-primary"] {
  --hds-sem-type-color-heading-fg: oklch(98% 0.01 250);
  --hds-sem-type-color-body-fg: oklch(95% 0.01 250);
  --hds-sem-icon-color-default-fg: oklch(98% 0.01 250);
  --hds-sem-divider-color-border: oklch(98% 0.01 250 / 0.3);
  --hds-sem-action-color-primary-default-bg: oklch(98% 0.01 250);
  --hds-sem-action-color-primary-default-fg: oklch(52% 0.18 250);
  --hds-sem-focus-color-stroke: oklch(98% 0.01 250);
  --hds-sem-surface-color-0-default-bg: oklch(46% 0.18 250);
  --hds-sem-surface-color-0-default-border: oklch(98% 0.01 250 / 0.15);
}
```

---

## 9. Composite Components

**Data Table:**

| Table part | Token |
|---|---|
| Row background | `hds/sem/surface/color/0/default/bg` |
| Striped row background | `hds/sem/surface/color/0/striped/bg` |
| Row/column borders | `hds/sem/divider/color/border` + `hds/sem/divider/measure/{weight}/thickness` |
| Header/cell text | `hds/sem/type/color/label/fg`, `hds/sem/type/color/body/fg` |
| Sortable header, row hover | `hds/sem/action/color/tertiary/{state}/bg` |

**Base UI Component Mapping:**

| Category | Base UI components |
|---|---|
| Action | Button, Toggle, Toggle Group, Toolbar, Switch (`selected` when on), Tabs (tab triggers), Menu/Menubar/Context Menu items |
| Input/Field | Input, Checkbox, Checkbox Group, Radio, Select, Combobox, Autocomplete, Number Field, OTP Field, Slider, Field, Fieldset, Form |
| Surface | Dialog, Alert Dialog, Drawer, Popover, Preview Card, Accordion panel, Collapsible panel |
| Divider | Separator |
| Feedback | Toast |
| Overlay | Dialog/Drawer/Popover backdrop |

**Composite mapping tables required:**

| Component | Parts and token source |
|---|---|
| Select, Combobox, Autocomplete | Trigger: Input. Popup: Surface. Options: Action. |
| Menu, Context Menu, Navigation Menu, Menubar | Items: Action. Popup/panel: Surface. |
| Tabs | Tab triggers: Action (`selected` state). Tab panel: no category. |
| Meter | Track: `hds/sem/surface/color/0/striped/bg`. Fill: `hds/sem/feedback/color/{sentiment}/icon-fg`. |
| Progress | Track: `hds/sem/surface/color/0/striped/bg`. Fill: `hds/sem/action/color/primary/default/bg`. |

---

## 10. Not Done Yet

1. Rules for how each driver becomes a primitive value.
2. Full primitive token list (`hds/prim/*`) — only examples exist.
3. Spine constants: base spacing scale, base radius, shadow levels, breakpoints.
4. Full property list per category, checked against a real Button, Input, and Card build.
5. Mapping tables for Select, Combobox, Menu, Navigation Menu, Tabs.
6. ~~Token source for Meter and Progress.~~ Resolved in section 9.
7. Naming validation (manual or automated) against the format in section 2 and the rule in section 6.
8. Contrast requirements per token pair, and whether they hold across contexts.
9. Agent-facing doc: category selection, context mechanism, when to add vs. reuse a token.
10. Driver authoring method: config file vs. tool with sliders/pickers.
11. Token change/deprecation plan for tokens already in use on client sites.
12. ~~Checked state for Checkbox and Radio — Input/Field has no `checked` state.~~ Resolved: `checked` is an Input/Field state on the `color` token (`hds/sem/input/color/checked/{fg,bg,border}`).

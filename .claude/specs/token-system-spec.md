# Client Design System — Token System Spec

**Status:** Working draft
**Scope:** Token structure only. Not component API, build tooling, or a second theme map.

---

## 1. Layers

Four layers. Each layer only reads from the layer next to it.

```
Drivers → Primitives → Semantic Tokens → Components
```

- **Drivers.** Values a builder sets. Brand color, density, type scale, etc.
- **Primitives.** Raw scales built from drivers. Color ramps, spacing scale, type scale. Components do not read these directly.
- **Semantic tokens.** Named values that point at primitives. Grouped by category, type, axis, and state. Components read only these.
- **Components.** Read semantic tokens as CSS custom properties. A component never reads a driver or a primitive.

Changing a driver regenerates the primitives and semantic tokens under it. Components stay the same.

One theme map is active at launch. A theme map is the rule set that turns drivers into primitives and tokens. A second theme map may exist later. Keep driver code and resolution code in separate files now, so adding a second theme map later doesn't require rewriting the first.

---

## 1.1 Spine Constants

Fixed values. Do not vary by driver. Primitives are built from these plus driver multipliers (see 1.2).

**Spacing scale** (base unit 4px):
```
0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128
```

**Radius scale:**
```
none: 0, sm: 4px, md: 8px, lg: 12px, xl: 16px, full: 9999px
```
Not density-scaled — a driver later, if a real case needs it.

**Shadow levels** (0–3, matches Surface elevation axis). Color is the neutral ramp's darkest step at fixed alpha per level, not hardcoded black — same pattern already used for `sem-overlay-color-bg` and `sem-surface-color-0-default-shadow` in section 7.
```
0: none
1: 0 1px 2px {neutral-950}/0.06
2: 0 2px 8px {neutral-950}/0.10
3: 0 8px 24px {neutral-950}/0.14
```

**Breakpoints:**
```
sm: 640, md: 768, lg: 1024, xl: 1280, 2xl: 1536  (px)
```
Arbitrary starting point, not validated against real client layouts yet.

---

## 1.2 Driver → Primitive Resolution

Drivers for the one active theme map:

| Driver | Range | Feeds |
|---|---|---|
| `brand-hue` | 0–360 | Color ramps (hue) |
| `brand-chroma-base` | 0–0.4 (OKLCH C) | Color ramps (chroma) |
| `neutral-tint` | 0–1 | Neutral ramp chroma |
| `density` | compact / default / comfortable | Spacing primitive |
| `type-base-size` | px | Type scale |
| `type-scale-ratio` | e.g. 1.2 | Type scale |

**Color ramp.** 11 fixed lightness stops (Tailwind/Radix-style), independent of driver:
```
L%: 98, 95, 90, 80, 70, 60, 52, 46, 38, 28, 18
```
Per stop: `hue = brand-hue` (constant across the ramp — no hue-shift at extremes, known simplification, see below). `chroma = brand-chroma-base × chromaCurve[stop]`, curve peaks at the mid stops (52/46) and tapers toward both ends so near-white/near-black stops don't get muddy.

**Neutral ramp.** Same 11 lightness stops. `hue = brand-hue`, `chroma = brand-chroma-base × neutral-tint × chromaCurve[stop]`. `neutral-tint` near 0 gives true gray; near 1 gives a brand-tinted gray.

**Spacing primitive.** Spine spacing scale × density multiplier:
```
compact: 0.75, default: 1, comfortable: 1.25
```

**Type scale primitive.** `size(n) = type-base-size × type-scale-ratio^n`, n indexed per role (caption, body, label, heading, display...) low to high.

**Radius, shadow, breakpoints.** Pass through from spine unchanged — no driver touches them yet.

<!-- ponytail: hue held constant across the whole ramp and chromaCurve is a made-up shape, not calibrated against a real brand palette. Real ramps often shift hue slightly at the extremes to avoid muddy dark/light stops. Upgrade when a real brand color exposes visible muddiness — add a hueShift[stop] table then, not before. -->
<!-- ponytail: radius doesn't scale with density, so a compact button can look visually under-rounded next to its shrunk padding. Add a density → radius multiplier if a real compact layout looks off. -->

---

## 2. Context

Context changes a token's value based on what it sits on. Same idea as light/dark mode, applied to a smaller area.

- Tokens are set once at `:root`.
- An element with `data-context="on-primary"` resets some of those same token names to new values.
- Children inside that element pick up the new values through normal CSS inheritance. No props needed.
- Contexts can nest. A card inside an `on-primary` section can set its own `data-context` and reset again.
- Only override the tokens that actually need to change. Leave the rest alone.

Two contexts at launch: `default` and `on-primary`. Add more only when a real case needs one.

---

## 3. Categories

Nine categories. Each one defines its own bg, fg, border, and spacing. A "border" in Action and a "border" in Input are unrelated and can look completely different.

| Category | Covers | Axis | States |
|---|---|---|---|
| Action | Buttons, clickable triggers | priority (primary/secondary/tertiary) | default/hover/active/focus/disabled |
| Input/Field | Text inputs, selects, textareas | size (sm/md/lg) | default/hover/focus/error/disabled |
| Surface | Cards, panels, containers | elevation (0–3) | default/striped |
| Type | All text styles | role (display/heading/body/label/caption) | none |
| Icon | Standalone and paired icons | role (default/secondary/accent) | none |
| Divider | Borders, separators | weight (thin/medium/thick) | none |
| Feedback | Alerts, banners, toasts | sentiment (danger/warning/success/info) | none |
| Overlay | Modal scrims | none | none |
| Focus | Focus ring | none | none |

Tables and navigation are not categories. They are built by pulling tokens from several categories at once. See section 8.

---

## 4. Token Type

Every token is color, measure, or other. This is not a separate path segment. It's set by the property name.

| Type | Examples | Comes from |
|---|---|---|
| Color | bg, fg, border, shadow-color | Color ramps |
| Measure | padding, gap, radius, height, thickness | Spacing scale × density |
| Other | font-family, font-weight | Font pairing list |

Rule: only give a type an axis if the value actually changes across that axis. Color usually changes by priority, sentiment, elevation, role, and state. Measure only changes by a real sizing axis, like Input's size. Measure does not change by priority or sentiment. If a type doesn't vary, drop that segment from the token name.

---

## 5. Token Name Format

```
sem/{category}/{type}/[axis]/[state]/{property}
```

- `category` and `type` are always present.
- `axis` and `state` appear only when that type actually varies by them.
- `property` is the specific value: bg, fg, border, padding-x, radius, font-family, etc.
- Context is never in the name. It's handled by the CSS override described in section 2.

Examples:
```
sem/action/color/primary/hover/bg
sem/action/measure/padding-x
sem/input/color/error/border
sem/input/measure/md/height
sem/type/color/heading/fg
sem/type/other/heading/font-family
sem/surface/color/0/striped/bg
sem/divider/measure/thick/thickness
sem/overlay/color/bg
sem/focus/measure/stroke-width
```

---

## 6. Category Definitions

**Action**
- Color: `sem/action/color/{priority}/{state}/{property}` — bg, fg, border
- Measure: `sem/action/measure/{property}` — padding-x, padding-y, radius, gap. No priority or state axis.
- Other: none. Font comes from Type.

**Input/Field**
- Color: `sem/input/color/{state}/{property}` — bg, fg, border, placeholder-fg. No size axis.
- Measure: `sem/input/measure/{size}/{property}` — padding-x, padding-y, height, radius

**Surface**
- Color: `sem/surface/color/{elevation}/{state}/{property}` — bg, border, shadow
- Measure: `sem/surface/measure/{property}` — padding, radius. No elevation axis.

**Type**
- Color: `sem/type/color/{role}/{property}` — fg
- Measure: `sem/type/measure/{role}/{property}` — size, line-height, letter-spacing
- Other: `sem/type/other/{role}/{property}` — font-family, weight

**Icon**
- Color: `sem/icon/color/{role}/{property}` — fg
- No measure token. Size defaults to inherited from nearby text or action. The component accepts a size prop to override it. Sizing is handled in component code, not in tokens.

**Divider**
- Color: `sem/divider/color/{property}` — border. No axis.
- Measure: `sem/divider/measure/{weight}/{property}` — thickness (thin/medium/thick)

**Feedback**
- Color: `sem/feedback/color/{sentiment}/{property}` — bg, fg, border, icon-fg
- Measure: `sem/feedback/measure/{property}` — padding, radius, gap. No sentiment axis.

**Overlay**
- Color: `sem/overlay/color/bg`. No axis, no state.

**Focus**
- Color: `sem/focus/color/stroke`. No axis. Context can still override the value if needed later.
- Measure: `sem/focus/measure/stroke-width`

---

## 7. Demo Token Tree

```css
:root {
  /* ACTION */
  --sem-action-color-primary-default-bg: oklch(52% 0.18 250);
  --sem-action-color-primary-hover-bg: oklch(46% 0.18 250);
  --sem-action-color-primary-active-bg: oklch(40% 0.18 250);
  --sem-action-color-primary-default-fg: oklch(98% 0.01 250);
  --sem-action-color-primary-default-border: transparent;
  --sem-action-color-secondary-default-bg: oklch(94% 0.03 250);
  --sem-action-color-secondary-hover-bg: oklch(90% 0.03 250);
  --sem-action-color-secondary-default-fg: oklch(52% 0.18 250);
  --sem-action-color-secondary-default-border: oklch(80% 0.05 250);
  --sem-action-color-tertiary-default-fg: oklch(52% 0.18 250);
  --sem-action-color-tertiary-hover-fg: oklch(40% 0.18 250);
  --sem-action-measure-padding-x: 16px;
  --sem-action-measure-padding-y: 10px;
  --sem-action-measure-radius: 8px;
  --sem-action-measure-gap: 8px;

  /* INPUT */
  --sem-input-color-default-bg: oklch(98% 0.01 250);
  --sem-input-color-default-border: oklch(80% 0.02 250);
  --sem-input-color-default-fg: oklch(20% 0.02 250);
  --sem-input-color-default-placeholder-fg: oklch(60% 0.02 250);
  --sem-input-color-focus-border: oklch(52% 0.18 250);
  --sem-input-color-error-border: oklch(55% 0.20 25);
  --sem-input-measure-md-padding-x: 12px;
  --sem-input-measure-md-padding-y: 8px;
  --sem-input-measure-md-height: 40px;
  --sem-input-measure-md-radius: 6px;
  --sem-input-measure-sm-height: 32px;

  /* SURFACE */
  --sem-surface-color-0-default-bg: oklch(98% 0.01 250);
  --sem-surface-color-0-default-border: oklch(90% 0.02 250);
  --sem-surface-color-0-default-shadow: 0 1px 2px oklch(0% 0 0 / 0.06);
  --sem-surface-color-0-striped-bg: oklch(95% 0.01 250);
  --sem-surface-color-1-default-bg: oklch(100% 0 0);
  --sem-surface-measure-padding: 24px;
  --sem-surface-measure-radius: 12px;

  /* TYPE */
  --sem-type-color-heading-fg: oklch(20% 0.02 250);
  --sem-type-color-body-fg: oklch(30% 0.02 250);
  --sem-type-color-label-fg: oklch(40% 0.02 250);
  --sem-type-measure-heading-size: 28px;
  --sem-type-measure-heading-line-height: 1.2;
  --sem-type-measure-body-size: 16px;
  --sem-type-measure-body-line-height: 1.6;
  --sem-type-other-heading-font-family: "Source Serif 4", serif;
  --sem-type-other-heading-weight: 700;
  --sem-type-other-body-font-family: "Inter", sans-serif;
  --sem-type-other-body-weight: 400;

  /* ICON */
  --sem-icon-color-default-fg: oklch(30% 0.02 250);
  --sem-icon-color-secondary-fg: oklch(55% 0.02 250);
  --sem-icon-color-accent-fg: oklch(52% 0.18 250);

  /* DIVIDER */
  --sem-divider-color-border: oklch(90% 0.02 250);
  --sem-divider-measure-thin-thickness: 1px;
  --sem-divider-measure-medium-thickness: 2px;
  --sem-divider-measure-thick-thickness: 4px;

  /* FEEDBACK */
  --sem-feedback-color-danger-bg: oklch(95% 0.05 25);
  --sem-feedback-color-danger-fg: oklch(40% 0.15 25);
  --sem-feedback-color-danger-border: oklch(80% 0.10 25);
  --sem-feedback-color-danger-icon-fg: oklch(50% 0.18 25);
  --sem-feedback-measure-padding: 16px;
  --sem-feedback-measure-radius: 8px;
  --sem-feedback-measure-gap: 8px;

  /* OVERLAY */
  --sem-overlay-color-bg: oklch(0% 0 0 / 0.5);

  /* FOCUS */
  --sem-focus-color-stroke: oklch(52% 0.18 250);
  --sem-focus-measure-stroke-width: 2px;
}

[data-context="on-primary"] {
  --sem-type-color-heading-fg: oklch(98% 0.01 250);
  --sem-type-color-body-fg: oklch(95% 0.01 250);
  --sem-icon-color-default-fg: oklch(98% 0.01 250);
  --sem-divider-color-border: oklch(98% 0.01 250 / 0.3);
  --sem-action-color-primary-default-bg: oklch(98% 0.01 250);
  --sem-action-color-primary-default-fg: oklch(52% 0.18 250);
  --sem-focus-color-stroke: oklch(98% 0.01 250);
  --sem-surface-color-0-default-bg: oklch(46% 0.18 250);
  --sem-surface-color-0-default-border: oklch(98% 0.01 250 / 0.15);
}
```

---

## 8. Composite Components

Tables and navigation are not categories. They get a mapping table instead, listing which token each part uses.

**Data Table:**

| Table part | Token |
|---|---|
| Row background | `sem/surface/color/0/default/bg` |
| Striped row background | `sem/surface/color/0/striped/bg` |
| Row/column borders | `sem/divider/color/border` + `sem/divider/measure/{weight}/thickness` |
| Header/cell text | `sem/type/color/label/fg`, `sem/type/color/body/fg` |
| Sortable header, row hover | `sem/action/color/tertiary/{state}/bg` |

Navigation and other composite components need the same kind of table. Not written yet.

---

## 9. Not Done Yet

1. Full property list per category, checked against a real Button, Input, and Card build. Expect changes once components are actually coded.
2. Mapping tables for Navigation and any other composite component.
3. A check (manual or automated) that flags any token name that doesn't match the format in section 5.
4. Which token pairs must meet contrast requirements, and whether that holds across contexts.
5. A short doc for an AI coding agent: which category to use for a given element, how context works, when to add a new token vs. reuse one.
6. Decide how drivers get set: a config file, or a tool with sliders and pickers.
7. A plan for changing a token after client sites already use it.
8. Chroma curve and hue-shift in the color ramp (1.1/1.2) are unvalidated against a real brand color — revisit once one is picked.

Next step: build one component, Button, fully against this token tree. It has the most axes of any category, so it will surface problems in the taxonomy fastest.

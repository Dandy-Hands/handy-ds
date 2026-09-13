# Decisions log

Judgment calls made while building the phased plan (waves 2–6), with the reasoning. Each entry lists what to change if the call turns out wrong. Specs were updated where a decision changes the token contract. **Needs review** marks the calls most likely to need adjusting.

## Process

- **All work done inline, no subagents or worktrees.** The plan suggested fanning Wave 5 out to one agent per component group. Doing it in one pass kept every component on the same conventions and avoided merge work. The one-file-per-category Theme Map (plan Phase 2) existed only to prevent agent collisions, so the Theme Map is a single file, `src/tokens/themeMap.ts`, with one section per category.
- **Nothing is committed.** Everything is in the working tree for review.

## Wave 2: driver config and primitive names (Phase 1a)

- **The driver config is a TS/JS object.** `src/tokens/drivers.ts` holds the `Drivers` type and `defaultDrivers`. A client config is a partial override that gets deep-merged over the defaults (`withDefaults`). The config file is the authoring method (gap 10). There is no picker UI; the demo page's controls are a preview, not a tool.
- **Status colors are drivers.** The vision spec's driver list has no danger/warning/success/info, but Feedback needs ramps for them. They are drivers with defaults, so most clients never set them.
- **The neutral color is optional.** When omitted, it's tinted from the primary hue (chroma 0.012), so grays match the brand by default. Set `color.neutral` for warm or cool grays.
- **Density is a number** (multiplier on a 4px grid), not named presets. It's continuous and one line of math. Presets can be added as sugar later.
- **Radius is one base px value.** It gives steps `none, sm (×0.5), base, lg (×1.5), xl (×2), full`. The name `base` was kept to match the spec example `hds/prim/radius/base`.
- **Per-category style is `{ radius, border }`** for action/input/surface. Each selects a step on a shared scale (spec section 1). Border *style* (dashed etc.) was skipped: `border: 'none'` covers "no border", and nothing needs dashed yet.
- **New primitive type `border`** (`none/thin/medium/thick` = 0/1/2/4px). It's a spine constant, not driver-derived. Divider thickness, per-category border width and the focus stroke all read it. **Spec change:** added `border-width` to the Action, Input/Field, Surface and Feedback measure properties (the per-category border driver needed somewhere to land). Feedback follows the surface border step.
- **`color/white` and `color/black`** are fixed primitives: text on primary, card background, overlay scrim.
- **Type primitives:** `type/scale/1…8` with step 3 = `baseSize`, in rem (respects user font size). Named `leading`, `tracking` and `weight` scales, and `family/heading|body`. A `headingWeight` driver selects a weight step. The mono family was dropped (nothing uses it).
- **Shadows:** `shadow/level-0…3`, one layer each, tinted with neutral-950, alpha × `shadow.strength`. At strength 0 they become `none`.
- **Breakpoints** are a TS constant (`breakpoints` from `handy-ds/tokens`), not tokens. No component uses them yet.
- **The primitive name list is frozen by a test,** not a checked-in literal. `resolvePrimitives()` output is the list. A test asserts names don't change with driver values and all pass `checkTokenName()`. Spec section 2 now documents the full pattern list.

## Wave 3: resolver, Theme Map, contrast (Phases 1b, 2, contrast)

- **Ramp algorithm:** 11 steps (50–950). Each step has a fixed OKLCH lightness ladder `[.975 … .23]`; hue comes from the input; chroma follows a curve relative to the input. The input color (sRGB-clamped with culori) lands *exactly* on the step nearest its lightness. Fixed lightness gives every client's ramp the same contrast shape, so one Theme Map passes contrast for any brand. A test sweeps 10×10 primary/accent pairs (light yellow, near-black, gray included) and all pass.
  - **Needs review:** a light brand color (e.g. yellow `#facc15`) lands on step 200, so `primary/600` (button background) is a darker olive, not the brand color. That's correct for contrast, but a client may want their exact color on buttons. The fix is a mapping.
- **Full state matrices.** Action (3 priorities × 6 states × bg/fg/border) and Input/Field (6 states × 4 properties) emit every combination. Components never need `var(a, var(b))` fallbacks, and the contrast checker sees every pair.
- **Theme Map values are templates.** `{hds/prim/…}` is a primitive reference (DTCG-alias style) and is emitted as `var(--hds-prim-…)`. Anything else is literal CSS (`transparent`, `color-mix()` for alpha). One rule covers both.
- **Mapping-level overrides** go in the same config (`mapping: { default: {...}, 'on-primary': {...} }`). They're validated (unknown token or primitive throws) and contrast-checked. A plain CSS override also works, because the theme sits in `@layer hds.theme` and unlayered app CSS wins.
- **CSS layers** `hds.theme, hds.base, hds.components`: client CSS never fights specificity.
- **On-primary context.** Surface elevation 0 = primary-600 (the brand), elevations 1–3 = primary-700/800/900, borders are 20% white. Type is white/primary-50. Primary action is white with primary text. Secondary is outlined white. Tertiary is white text. Input borders are white. Focus ring is white.
  - Cards inside a hero are dark primary surfaces. For a white card in a hero, put `data-context="default"` on the card. **Needs review:** the alternative is to make Card always reset to default.
- **Default reset block** (`[data-context="default"]`) is generated from the on-primary keys, so it can't drift.
- **Section color rules driver.** `sections: { hero: 'on-primary' }` adds `[data-section="hero"]` to that context's selector. Page code writes `data-section="hero"`, and each client decides what the hero looks like. Section names are validated (`[a-z0-9-]`) because they're emitted into selectors.
- **Contrast rules (gap 8).** Text pairs need 4.5:1. Icons, focus ring, input default border and checkmark need 3:1 (WCAG 1.4.11). Disabled states are exempt. Checks run in both contexts against all 8 surface grounds (4 elevations × default/striped). A `transparent` background is checked against every ground.
  - Input borders are darker (neutral-500) than the spec demo's to meet 3:1. **Needs review** if the lighter look is wanted, but that fails 1.4.11.
  - Checked pairs must be single primitive references. The checker throws on `color-mix` in a checked pair rather than guessing.
- **The `hds-theme` CLI** writes CSS to stdout and contrast failures to stderr, then exits 1. The CSS is still written so a dev can see the result.

## Wave 4: Button slice (Phase 3)

- **Button** wraps Base UI `Button` and adds a `priority` prop (`data-priority`). **LinkButton** is added because Base UI forbids rendering links as buttons, and client sites need "button-looking links" constantly.
- **Shared category CSS** (`action.css`, `control.css`, `surface.css`, `Feedback.css`). Each maps an axis to private `--_*` properties once, then state rules read them. Menu items, tabs, toggles and select options all reuse the Action look.
- **Invariant check = a test** (`src/components/components.test.ts`), and `npm run build` runs `npm test` first, so the build fails on a violation. It checks: no `--hds-prim-` in any component file; every `--hds-sem-*` used exists in the theme; every rule sits in an hds layer. One mechanism covers CSS and TSX (inline styles), instead of a Vite-only CSS plugin.
- **Render tests** run through Vite's `ssrLoadModule` inside `node --test`. Node can't import `.tsx` or `.css`, and this adds no dependency.
- **Packaging.** `private: true` (the vision spec says private package; this blocks accidental publishing). ESM only. Exports: `.`, `./tokens`, `./styles.css`, `./theme.css` (default theme), and bin `hds-theme`. react/react-dom/Base UI are external; culori is bundled into `tokens.js`.
  - Types come from `tsc` declaration emit. A post-step (`scripts/strip-css-imports.js`) removes `import './x.css'` lines that tsc copies into `.d.ts` files.
  - `part()` is marked `@__NO_SIDE_EFFECTS__` so bundlers drop unused compound components.
- **Verified:** `npm pack`, install into a scratch project, `npx hds-theme config.js` generates a theme, SSR renders, strict `tsc` against the shipped types passes. Mapping override path: tested in `tokens.test.ts`, and live on the demo page ("Primary buttons use accent").

## Wave 5: components (Phase 4/5)

- **Compound components mirror Base UI's namespace:** `{ ...BaseSelect, Trigger: part(...) }`. The Base UI docs apply part for part, nothing is missing, and new Base UI parts show up automatically. Types like `Select.Root.Props` are imported from Base UI.
- **Triggers** (Dialog, Popover, Menu) look like secondary Buttons by default. `data-priority` changes them. **Menubar** triggers need `data-priority="tertiary"` by hand. **Needs review:** could be automatic with a Menubar-specific trigger part.
- **Gap 5, Tabs panel:** no category means no tokens. The panel is transparent and inherits type and ground; only the focus ring applies. The tab indicator uses `action/color/primary/selected/bg`.
- **Gap 5, part tables** (added to spec section 9):
  - Navigation Menu: trigger and link are Action tertiary, the current link is `selected` (Base UI `active`), the popup is Surface elevation 2, and content has no color tokens.
  - Combobox/Autocomplete: input group is Input/Field, options are Action tertiary with `selected` for chosen and `hover` for highlighted, chips are Action secondary, empty/status text is Type caption.
- **Switch:** track is Action secondary when off and Action primary `selected` when on. The thumb uses the matching `fg`.
- **Checkbox/Radio:** read only Input/Field tokens (gap 12). The border has a 1px floor so an unchecked box stays visible when the input border driver is `none`. Disabled + checked uses the disabled colors inverted.
- **Toast:** the toast `type` is the sentiment (`info` default). `<Toaster />` renders a simple stacked viewport, without Base UI's swipe/stack animation. **Alert:** no live-region role by default (static banners shouldn't announce); pass `role="alert"` or `role="status"` when it appears after an action.
- **Card, Alert, Text** use `useRender`, so they take the same `render` prop as Base UI parts. **Text** picks its tag by role (display h1, heading h2, body p, label span, caption small). **Icon** inherits `currentColor` unless given a role `variant`, so icons in buttons match the button.
- **Base styles** (`base.css`): body type, a global `:focus-visible` ring (the Focus category), and any `[data-context]` / `[data-section]` element gets the surface-0 background + body text color. Colored sections need no wrapper component.
- **Gap: layout spacing (new gap 13).** The spec has no tokens for form/field gaps or table cell padding. These borrow Input/Field measure tokens: field gap = `input/measure/sm/padding-y`, form gap = `input/measure/lg/padding-x`, cell padding = `input/measure/md/padding-*`. They all scale with density. **Needs review:** consider a spacing token set.
- **Field.Error** uses `feedback/color/danger/fg` on the page ground. That pair is not contrast-checked, and would fail on an on-primary ground. The rules doc says to put forms in a `data-context="default"` card inside colored sections. **Needs review (new gap 14).**
- **Skipped** (in Base UI's list but not in the plan's component groups): Slider, OTP Field, Drawer, Preview Card, Collapsible, Tooltip, Scroll Area, Avatar. Each is a `part()` wrapper plus category classes when needed. CheckboxGroup and AlertDialog were included because they're one line each.

## Phase 8: platform examples

- **WordPress uses the REST API, not WPGraphQL.** REST ships in WordPress core (no plugin to install on each client site), and it allows cross-origin GETs by default. WPGraphQL wins for complex nested queries; switch when a client needs that.
- **The WordPress example** reads `https://wordpress.org/news` by default (a real site); set `VITE_WP_URL` for a client. The data layer is `examples/wordpress/src/wp.ts`. Titles and excerpts render as plain text via `DOMParser`. Full post HTML is rendered as HTML, which assumes a trusted CMS (WordPress kses-filters untrusted authors). Use DOMPurify if authors aren't trusted.
- **The PWA example** is an offline task list (localStorage) with a hand-written service worker. No `vite-plugin-pwa`: a ~10-line Vite plugin injects the build's asset list so install precaches everything. Pages are network-first with a cached shell fallback. Icons are PNG (rendered from the SVG) for installability.
- **The examples use `file:../..`** plus `resolve.dedupe: ['react','react-dom']` in Vite (a linked package would otherwise load React twice). Each example has its own `theme.config.js` with different drivers: same components, visibly different clients.

## Not done

- **"Later: versioning and deprecation" (gap 11)** is not started, as planned. Packaging exists; version pinning and a deprecation policy wait for the first shipped client site.
- **The Chrome extension wasn't connected,** so visual checks used headless Chrome screenshots: the demo page, the WordPress example (live posts from wordpress.org) and the PWA at phone width. Interactive states (hover, open popups, keyboard, offline mode, install prompt) were not clicked through. Render tests plus Base UI's own behavior cover the logic.
- **Bundle size:** the examples are ~182 KB gzip, almost all React + the Base UI parts they use. Verified that unused handy-ds components are dropped from the bundle.

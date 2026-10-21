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
- ~~**Triggers** (Dialog, Popover, Menu) look like secondary Buttons by default.~~ **Reversed** (see "Triggers carry no styling" below).
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

## Button size axis

- **Action gained a size axis** (`sm`/`md`/`lg`), so `hds/sem/action/measure/{property}` became `hds/sem/action/measure/{size}/{property}`. `token-system-spec.md` sections 4 and 7 updated, plus `checkTokenName()` and the Theme Map. Steps: sm `space/3`+`space/1`, md `space/4`+`space/2`, lg `space/5`+`space/3` (padding-x, padding-y); radius and border-width are the same driver value at every size, like Input's.
- **Only Button exposes it.** Every other Action part (Tabs, Toggle, menu items, Accordion trigger, Dialog/Popover triggers) pins to `md` in its CSS. Opening the axis up to them is a per-component decision, not automatic.
- **Needs review:** sm and lg reuse the md radius and border-width, so a `radius/full` theme keeps a pill at every size. Fine for now; per-size radius is a Theme Map change if a client needs it.

## Triggers carry no styling

- **Reverses the Wave 5 trigger decision.** `Dialog.Trigger`, `AlertDialog.Trigger`, `Popover.Trigger` and `Menu.Trigger` no longer carry `hds-button hds-action`, so they are not secondary Buttons by default.
- **Why:** being a trigger says what a control does, not what it looks like. Base UI agrees — those parts give semantics only ("Renders a `<button>` element") and ship unstyled; their own docs put an explicit class string on every trigger. A dialog opens just as well from a card, an avatar or an icon, and the old default silently styled all of them.
- **What replaces it:** the author opts in — `<Dialog.Trigger render={<Button priority="tertiary" />}>`. Nothing is styled by accident, and the Menubar workaround (`data-priority="tertiary"` by hand) disappears with it.
- **Not affected:** `Accordion.Trigger`, `NavigationMenu.Trigger` and `Select.Trigger` keep their styling. Those are structural parts of their own component, not a free-standing control the author would choose the look of.

## Element categories (token rework)

- **Eight categories replace the nine of the token spec:** Action, Field, Surface, Content, Graphic, Feedback, Focus, Overlay. Decided 2026-10-04; table in `.claude/specs/token-system-spec.md` section 7.1.
- **Content = Type + Icon.** Text and icons share the foreground color roles, so a person picks them once. Typography (family, size, weight) is not part of Content; it has its own driver-interface step.
- **Graphic = Divider + data visualization.** Non-text, non-interactive marks. Gives the data-visualization palette a home.
- **Field** is Input/Field renamed; the slash does not fit a token path.
- **Focus and Overlay stay separate** as effects that apply across categories, even though each is only one or two tokens.
- **Spec done (2026-10-07):** `token-system-spec.md` section 7.1 uses the eight categories. `src/tokens/` implements them (2026-10-07).

## Drivers-only theming

- **Clients theme through drivers only. The mapping level is removed.** Vision spec sections 5 and 11 rewritten on 2026-10-04. The mapping-operations proposal (`.claude/specs/theming-rework-mapping-operations.md`, deleted 2026-10-04; see git history) is rejected.
- **Why:** one level of control is simpler to learn, to document, and to build a driver interface for. A mapping change made for one client helps no other client; a new driver helps all of them.
- **What replaces it:** more detailed drivers. Color drivers generate the palette, and pick drivers choose the exact palette color for each use (e.g. primary action background), instead of the Theme Map pre-selecting a hue and shade. This also answers the Wave 3 "light brand color" review note: the client picks their exact color for buttons with a driver, not a mapping.
- **Spec done (2026-10-07):** `token-system-spec.md` section 3 lists the drivers, including the pick drivers. `src/tokens/` implements them; `themeMap.ts` and the `mapping` config are removed (2026-10-07).

## Slot props allowed (API conventions)

- **The "no content shortcut props" rule is narrowed (2026-10-15).** It now bans two things: props that duplicate a Base UI part (`label`, `description`, `error`, `title`), and props named for the content type (`startIcon`, `endText`). `docs/api-conventions.md` section 1.
- **Why:** the old rule existed so a prop would not copy a Base UI part that wires accessibility. An icon or a unit beside an input has no such part, and `Input` has no `children` to hold it. The old rule forced a custom part API with no accessibility gain.
- **What replaces it:** slot props `start` and `end`, type `ReactNode`, allowed when no Base UI part exists, `children` are used for other content, and the component must control placement. Named by position, never by content type.
- **First use:** `Input` (`start`, `end`). Found during the Input spec interview.
- **Not affected:** `Icon`'s `label` prop stays a recorded exception. Existing components keep their parts. No component is changed by this decision.

## Layout and page-building components (brainstorm, 2026-10-20)

Not yet interviewed or specced. These are the decisions from the brainstorm. Rejected options are listed so they are not proposed again by accident.

### Layout components (non-visual; they place other components)

- **Two sets: atomic and native.** Atomic = small, role-named components with safe defaults: `Stack` (column, token `gap`), `Inline` (wrapping row), `Tiles` (equal-size items in auto-fit columns, props `gap` and `minTileWidth`; name not final). Native = components with the full CSS vocabulary and safe defaults: `Flex` (wrap on by default), `Grid` (auto-fit when `cols` is absent), `Grid.Item` (`span`, `area`). Both sets exist together. Rule for `docs/rules.md`: use an atomic component first, use a native component when no atomic component fits.
- **Why both:** an agent sets fewer props with an atomic component, so it makes fewer mistakes and the prop table costs less context. Native components remove the capability gap (dashboards need `cols` and `span`). With safe defaults, a native component is as responsive as an atomic one; the atomic name only states the intent.
- **Atomic components adapt without responsive props.** The browser picks the column count from the free space (`repeat(auto-fit, minmax(min, 1fr))`, `flex-wrap`). Native `Grid` `cols` and `Grid.Item` `colSpan` use the responsive object type that already exists in `docs/api-conventions.md` (`sm` 640, `md` 768, `lg` 1024, `xl` 1280).
- **No `Grid.Item` in the atomic set.** In an auto-fit grid a spanning item can overflow when the grid has fewer columns than the span. A container query cannot fix it: its condition cannot read a custom property, so the threshold would be a hidden fixed number that breaks when `min` changes. Spans belong to the native `Grid`, where the caller sets `cols`.
- **Not every prop has to map to a token.** Keyword props (`justify="center"`) are allowed on native components for typed, named values. Only space and size props take token steps.
- **`Flex.Item` and `Grid.Item` are parts (decided 2026-10-20).** `Flex.Item`: `grow`, `shrink`, `basis`, `align`. `Grid.Item`: one prop for each CSS grid item rule: `colSpan`, `rowSpan`, `colStart`, `rowStart`, `align`, `justify`; all responsive. **Named areas left out** (`Grid` `areas`, `Grid.Item` `area`): a typo in an area name is a silent layout bug; maybe later. **Why:** a fixed item beside a filling item needs per-item control, and a dashboard changes spans per screen. **Needs:** `docs/api-conventions.md` sections 4 and 5.3 extended so layout props (not only measure props) accept responsive values.
- **Dropped: the Flex `inline` prop** (`inline-flex`): speculative.
- **Dropped: `Split`** (an item of fixed width beside an item that fills the rest). `Inline` cannot do it for long text because the text wraps below, but native `Flex` can, and the case is rare. Add it back if agents write the same `Flex` setup often. **Dropped: `Center`** (one line of CSS).
- **Rejected: a standalone `Container`/`ContentBlock` in the layout set.** See `Section` below.
- **Open:** should a `Show`/`Hide` component exist for size-based visibility?

### Page-building components (visual; they build the macro parts of a page)

- **`Section`, `Header`, and `Footer` are separate components.** Each renders its native element (`<section>`, `<header>`, `<footer>`) with no `as` prop, and they share the same props and implementation. **Rejected:** one polymorphic `Section` with `as`.
- **`Section` is a full-width band with a centered inner column.** It has a background, padding, and a maximum width for its children. No standalone `Container`; add one only if content outside a band needs it. **Rejected:** `Container` as a layout component (the name is too generic next to Braid `Box` and Material `Card`; handy-ds already has `Card`).
- **`Section` takes no `label` prop for now.** A `<section>` is a landmark only with an accessible name. Revisit if this matters in use.
- **`contentWidth`** takes `"default"`, `"narrow"`, or `"full"`. `default` and `narrow` map to two new semantic tokens, `measure/width/content` and `measure/width/content-narrow` (the `measure/size` steps stop at `"3200"`, 128px at density 1, too small for a page width). **The two widths are drivers (decided 2026-10-20):** `layout.contentWidth` (default 1152px) and `layout.contentWidthNarrow` (default 768px), single numbers in px like `density` and the base `radius`. Density does not scale them. Pipeline: driver, new primitive type, semantic token. Semantic names state the purpose, not the value. **Rejected:** `"hug"` (the children set their own width); fixed scale steps for the page widths (a client must be able to set them). **Needs:** a new primitive type in `PRIM_TYPES` (`src/tokens/names.ts`), the drivers in `src/tokens/drivers.ts`, two controls in the theme builder (theme customization spec), token spec sections 3 and 7.5, API conventions section 5.2, and the Figma variables. Check that `checkTokenName()` accepts `content-narrow`.
- **Component widths are scale steps (decided 2026-10-20):** a new `measure/width/{step}` family, derived like the other scales (step ÷ 100 × 4px × density): `"6400"` (256px), `"8000"` (320px), `"9600"` (384px), `"12800"` (512px). `Tiles` `minTileWidth`, `Grid` `minColWidth`, and `Aside` `width` take these steps. Clients rarely tune them, and a scale keeps them consistent.
- **Padding:** `paddingBlock` and `paddingInline` (logical names, per the conventions) take all `measure/space` steps (`"050"` to `"2400"`). No new tokens. Defaults are Claude's call (spec).
- **Backgrounds:**
  - `surface` (decided 2026-10-20): `"sunken" | "base" | "primary" | "secondary"`, default `"base"`. `sunken` and `base` are neutral surface levels. No `raised` (decided 2026-10-20): raised is the level of a card, a popup, or a modal, not of a band. `primary` and `secondary` use the `base` level of their brand context. A brand value sets `data-context="on-primary"` or `"on-secondary"` on the element itself, so the children re-resolve to their on-primary values (their tokens are not remapped). **There is no `context` prop and no `mode` prop:** the color choice sets the context, and the page sets the mode. A client can also use `data-section="hero"` (the `sections` driver) as a pass-through attribute. **Name:** `surface`, not `color`, because `docs/api-conventions.md` section 1 bans a prop named `color`. It is a new axis: add a row to section 6 of the conventions (values `sunken`, `base`, `raised`, `primary`, `secondary`); it differs from `elevation`, which also reads shadow tokens.
  - `gradient`: no gradient token. The prop is `{ to, direction }`: `surface` is the start; `to` is a level in the same context, `"sunken" | "base"` (for `surface="primary"`, `to="sunken"` is a darker primary); the direction is `"to-bottom" | "to-top" | "to-start" | "to-end"`. The CSS interpolates in OKLCH (`linear-gradient(in oklch ...)`). A gradient cannot cross contexts, because the text color depends on the context; the contrast checker tests the text against both stops. **Rejected:** a fixed `color-mix()` share toward the scrim color; a gradient token. The user expects this to change in the long run.
  - `media`: one prop with a discriminator: `{ type: "image", src, fit, position }` or `{ type: "video", src, poster, fit, position }`. `fit` is `"cover" | "contain"`. Decorative: no alt text. Video: `poster` required, muted, loops, no controls, paused under `prefers-reduced-motion`, not loaded on a data-saver connection. **Rejected:** separate `image` and `video` props; inferring the type from the file extension.
  - `scrim`: `{ tone: "dark" | "light", strength: "subtle" | "medium" | "strong", direction? }`. `direction` uses the `gradient` values; absent means an even layer. New tokens `color/overlay/media/{tone}/{strength}` (six colors with built-in opacity; built 2026-10-20: `dark` is black, `light` is white, alpha `subtle` 0.2, `medium` 0.5, `strong` 0.6, fixed in `MEDIA_ALPHA`, Claude's call). **`tone` also sets the mode of the section (decided 2026-10-20):** a scrim sets the color behind the text but not the text color, and in a light page the text is dark, so a dark scrim made it unreadable. `dark` sets `data-mode="dark"` (light text), `light` sets `data-mode="light"` (dark text). Limit: a mode element resets a brand context above it. **Rejected:** a new `on-media` context (more tokens and a new driver concept); the caller sets the text color with `Text tone` (no tone gives light text in a light page). The contrast check tests `strong` at 4.5:1 and `medium` at 3:1 against the worst-case image; `subtle` is not checked. The modal `overlay/scrim` stays unchanged. **Why:** a single 0.5 black layer is too strong or too weak over an image. **Limit:** the image is client content, so the contrast checker can only test the text against the scrim over pure white and pure black (a worst case). **Rejected:** reusing `overlay/scrim` as a boolean; blur (left out for now).
  - `background` slot (a `ReactNode` for a custom canvas, WebGL, or Lottie layer; `aria-hidden`, `pointer-events: none`, scrim on top, mutually exclusive with `media`): **accepted 2026-10-20.** The caller owns the animation and the `prefers-reduced-motion` handling. **Conflict found 2026-10-20 (the earlier text of this entry was wrong):** `docs/api-conventions.md` section 1 allows only the slot props `start` and `end`, named by position, and section 1 bans `background` as a style prop. The `background` slot needs an amendment to that rule, or a different name. Open.
- **Height (2026-10-20):** `Section` takes `height` and `minHeight`. Values are `"auto"` (default), `"screen"` (`100svh`; `svh` stays correct when a mobile browser bar shows or hides), or a CSS length string such as `"60svh"` or `"480px"`. **Not token-based, by the user's decision:** a section height is a page-design value, and the `measure/size` steps are too small. This is an exception to the no-raw-numbers rule in `docs/api-conventions.md` section 4; the open TODO item to rewrite that rule must list it. **Risk:** a fixed `height` can clip content, so prefer `minHeight`. `align` (`"start" | "center" | "end"`) sets the vertical position of the content in a tall section. `Header` and `Footer` share these props (they share all band props with `Section`).
- **`Header`:** `sticky` prop (a page header stays at the top of the screen). A sticky header gets the `elevation/raised` shadow, because it floats above the scrolling content (decided 2026-10-20). `surface` colors and shadows are separate tokens: a band reads color only, so `raised` is not a `Section` value.
- **Header and Footer padding defaults (decided 2026-10-20):** `Header` `paddingBlock` is `"400"`, `Footer` is `"800"` (`Section` is `"1600"`). **`Aside` keeps `raised`** in its `surface` values for now, unlike `Section`.
- **`Aside`** renders `<aside>`: a styled column for side navs, outlines, sources, and related links. Props: `width` (`measure/width` step), `sticky`, `surface`, `paddingBlock`, `paddingInline`; it scrolls inside the column. No `label` prop: `aria-label` passes through (changed 2026-10-20). A side nav keeps a `<nav>` element inside the `<aside>`. It does not place itself (native `Grid` does) and does not collapse into a drawer. **Open:** a later app shell component (header, sidebar, main, collapse on a narrow space).
- **`Nav` has no component.** The Navigation Menu root can render `nav`.

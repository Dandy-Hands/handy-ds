# handy-ds rules

For people and coding agents building client apps with handy-ds. Follow these rules as written. If a rule doesn't fit, ask the team; don't invent a workaround.

## 1. Set up a client project

```sh
npm install handy-ds react react-dom       # private package: install from the tarball/registry the team uses
```

```js
// theme.config.js: this file is the client's whole theme (drivers only)
export default {
  color: { primary: '#0f766e', secondary: '#be185d' },
  typography: { family: { heading: '"Fraunces", Georgia, serif', body: 'Inter, system-ui, sans-serif' } },
  density: 1,
  radius: { control: '100' },
};
```

```sh
npx hds-theme theme.config.js > src/theme.css   # add as a "prebuild"/"predev" script
```

```tsx
// app entry
import 'handy-ds/styles.css';   // component styles
import './theme.css';           // this client's tokens (or 'handy-ds/theme.css' for the default theme)
import { Button } from 'handy-ds';
```

Point the project's agents at the library docs. Add this to the client project's `CLAUDE.md`:

```markdown
UI comes from handy-ds. Pick components with `node_modules/handy-ds/docs/components.md`.
Theming, contexts and app-CSS rules: `node_modules/handy-ds/docs/rules.md`. Never restyle a component with `className`.
```

`hds-theme` exits with code 1 and lists every failing pair when the config breaks a contrast rule. Fix it with a pick driver (section 3). Don't ignore the failure.

Load font files yourself (Google Fonts `<link>`, `@font-face`). The theme only sets the `font-family` stacks.

Load the Material Symbols Outlined font too (Google Fonts `<link>`, family `Material Symbols Outlined`, axes `opsz,wght,FILL,GRAD`). `Checkbox` draws its box with it, and `Icon` uses it for glyph names. Without the font, these show the glyph name as plain text.

## 2. Theme a client: palette drivers

Drivers are the only way to theme a client. There is no mapping level. Change only what the brand needs; everything left out uses the default (`defaultDrivers` in `handy-ds/tokens`)..

| Driver | What it does |
|---|---|
| `color.primary` | Brand color, as any CSS color. Anchors a wheel of 11 hue ramps (`hue-0`…`hue-10`) of 11 stops (50–950). The exact color lands on its nearest stop. |
| `color.secondary` | Optional second brand color. Leave it out and its hue is primary + 163.6°. |
| `color.floor` | Lowest chroma of the 9 generated ramps (0–1). Keeps a gray brand's system colors colorful. |
| `color.neutralTint`, `color.neutral` | Gray tint at the primary hue, or an exact neutral color. |
| `color.contrast`, `color.darkContrast`, `color.darkChroma` | Bend the lightness stops (−1 to +1) for light and dark mode; scale dark-mode chroma. |
| `roles.danger/warning/success/info` | Which ramp each system color uses (`'hue-3'`). Default: nearest hue to red, amber, green, blue. |
| `typography.family.heading/body/mono` | Font stacks. |
| `typography.baseSize`, `ratio` | Body size in px and type-scale ratio (1.2 tight, 1.25 default, 1.333 dramatic). |
| `density` | Multiplies all spacing. 0.85 compact, 1 default, 1.15 roomy. |
| `radius.control/container/indicator/round` | Radius step per shape role: `none`, `050`, `100`, `200`, `300`, `400`, `600`, `round`. Pill buttons: `radius: { control: 'round' }`. |
| `border.control/container/divider/focus` | Border step per role: `none`, `025`, `050`, `100`. |
| `shadow.strength` | 0 flat, 1 default, 2 heavy. |
| `motion.duration` | Multiplies every animation length. 0 no motion, 1 default, 2 twice as slow. Users who ask for reduced motion always get none. |
| `overlay.opacity` | Modal scrim opacity. |
| `mode` | Page default: `light`, `dark` or `system`. |
| `sections` | Mode or context for a named page section: `{ hero: 'on-primary', footer: 'dark' }`. See section 5. |

## 3. Theme a client: pick drivers

A pick sets which palette color one semantic color token reads. Every token has a default pick; set only the ones the client needs.

```js
export default {
  color: { primary: '#1d4ed8', secondary: '#f59e0b' },
  picks: {
    'action/primary/default/bg': 'secondary/600',
    'action/primary/default/border': 'secondary/600',
    'content/accent/fg': { light: 'primary/700', dark: 'primary/300' },
  },
  contexts: { 'on-primary': { 'surface/raised/bg': 'neutral/50' } },
  typography: { styles: { headline: { weight: 'semibold', size: { lg: 6 } } } },
};
```

- Keys are color token names without `hds/sem/color/` (`action/primary/default/bg`). `action/disabled/bg|fg` set the Action disabled pair.
- Values: `{role}/{stop}` (`primary`, `secondary`, `neutral`, `danger`, `warning`, `success`, `info`; stops 50–950), `white`, `black`, `transparent`. Data-visualization tokens (`graphic/categorical/*`, ...) can also pick a slot: `hue-4/500`.
- Pick the `default` state only. Hover (+1 stop), active (+2) and selected derive from it. A pick on a state token overrides the derivation. `states.step` changes the offsets.
- The object form `{ light, dark }` sets a dark-mode override. Without one, dark mode uses the same pick on the dark palette.
- `contexts.on-primary` / `on-secondary` override picks inside brand sections.
- Unknown keys and bad values throw at build time. Every pick is contrast-checked in both modes and every context.

Never edit component CSS or override `--hds-*` properties in app CSS to theme a client. If drivers can't produce a result, the team adds a driver.

## 4. Pick a component

| Need | Use |
|---|---|
| Do something (submit, open, save) | `Button` |
| Go somewhere that looks like a button | `LinkButton` (renders `<a>`) |
| On/off setting that applies immediately | `Switch` |
| Pick an approximate number or a range by dragging | `Slider` |
| Pressed/unpressed formatting button, or pick-one/pick-many from a few buttons | `ToggleGroup` with `Toggle` |
| Group of controls for a region (editor bar) | `Toolbar` |
| Switch between views in place | `Tabs` |
| Site navigation, with dropdowns | `NavigationMenu` |
| List of commands behind a button | `Menu`. App-style menu row: `Menubar`. Right-click: `ContextMenu` |
| Text input | `Field.Root` + `Field.Label` + `Field.Control` (+ `Field.Description`, `Field.Error`). Bare `TextInput` only where there's no label (search in a toolbar with `aria-label`) |
| Exact number (typed, optional +/- steppers) | `NumberInput` |
| Pick one of 2–5 visible options | `Radio.Group` + `Radio` |
| Pick one from a long fixed list | `Select` |
| Pick from a long list with typing/filtering, or multi-select chips | `Combobox` |
| Free text with suggestions | `Autocomplete` |
| Yes/no or many-of-few | `Checkbox` (`Checkbox.Group` for a set) |
| Group related fields | `Fieldset` inside a `Form` |
| Box of related content | `Card` |
| Must-see task that blocks the page | `Dialog`. Confirm a destructive action: `AlertDialog` |
| Extra info or small controls anchored to a trigger | `Popover` |
| Show/hide sections (FAQ) | `Accordion` |
| Message that stays on the page | `Alert` |
| Short-lived message after an action | `Toast` (`Toast.Provider` + `<Toaster />` once, then `useToastManager().add({ title, type })`) |
| A value in a range (storage used, score) | `Meter` |
| Task completion (upload) | `Progress` (`value={null}` = unknown) |
| Rows and columns of data | `Table` (sortable column = `<th aria-sort><button>`) |
| Any text with a type role | `Text` (pick the heading level with `render={<h3 />}`) |
| An icon | `Icon` wrapping an SVG that uses `currentColor`, or a Material Symbols glyph name |
| A dividing line | `Separator` |
| Items in one column | `Stack` |
| Items in a row that wraps (buttons, tags, links) | `Inline` |
| Equal-size cards or tiles in as many columns as fit | `Tiles` |
| A row or column with a fixed item beside a filling item, or a direction that changes with the screen | `Flex` (`Flex.Item`) |
| A dashboard or a page layout with a chosen column count or item span | `Grid` (`Grid.Item`) |
| A full-width part of a page (hero, feature row) with a background and a centered column | `Section` (`Header` and `Footer` for the top and bottom) |
| A side nav, outline, or related links beside the main content | `Aside` |
| Sections, cards, or list items that animate in as they scroll into view, or a lazy-loaded section that animates in when it loads | `Animate` (inside the layout component; `trigger="mount"` for content that loads later) |

**Motion rule:** animate only what enters the page, with `Animate`. Use one `effect` per page: `fade-up` for sections, `scale` with `stagger` for a set of cards or tiles, `fade` for text-only blocks. Do not animate the first view of a page (the hero): `trigger="view"` already shows it at once. Do not write your own keyframes or transitions; hover, press, and open effects come with each component.

**Layout rule:** use the smallest layout component that fits: `Stack`, `Inline`, or `Tiles` first. Use `Flex` or `Grid` only when none of them fits. Write your own CSS only for a layout that none of them covers, and use token variables in it.

Props, use-when and don't-use-when for every component: `docs/components.md` (`node_modules/handy-ds/docs/components.md` in a client app).

Compound components (`Select`, `Menu`, `Dialog`, ...) have the same parts and props as Base UI's. Use Base UI's docs for structure and behavior (`node_modules/@base-ui/react/docs/react/components/*.md`). handy-ds only adds styling. Examples of every component: the Overview page of the docs site (`npm run dev`).

## 5. Modes and contexts (colored sections)

- A dark band on a light page (or the reverse): `data-mode="dark"` / `data-mode="light"` on any element. A mode resets brand contexts inside it.
- A section on a brand-colored background: `<Section surface="primary">` (or `"secondary"`), which sets the context itself. Or `<section data-section="hero">` (the client's `sections` driver decides) or `data-context="on-primary"` / `"on-secondary"` on any element. A `Section` with a dark or light `scrim` sets the mode.
- Everything inside restyles itself: text, buttons, inputs, cards and focus rings. Don't pass color props. Cards in a brand section become darker brand panels.
- Inside a colored section, `data-context="default"` on an element restores root colors for its subtree (a light card in a hero). Put forms in such a card: field error text is only contrast-checked in the default context.
- Only `default`, `on-primary` and `on-secondary` exist. Don't invent new `data-context` values.

## 6. Writing app code against the library

- Place content with the layout components (section 4). Write the app's own CSS only for a layout they do not cover. Leave component internals alone.
- When app CSS needs a design value, read a semantic token: `color: var(--hds-sem-color-content-muted-fg)`, `gap: var(--hds-sem-measure-space-400)`. Never a primitive, never a hex code.
- Token names: `hds/sem/{type}/[category]/[axis]/[state]/{property}`. Types: `color`, `measure` (`space/{step}`, `size/{step}`), `radius/{role}`, `border/{role}`, `elevation/{raised|floating|modal}`, `typography/{role}/{sm|md|lg}/{property}`.
- For color, choose the **category first**: clickable is Action, data entry is Field, container is Surface (level `sunken`, `base`, `raised`, `floating`, `modal`), text and icons are Content, lines and charts are Graphic, status is Feedback. Then the axis and the state. Full list: `SEM_TOKENS` in `handy-ds/tokens`.
- Charts read `graphic/categorical/{1…8}`, `graphic/sequential/{1…9}` or `graphic/diverging/{1…9}`.
- Reuse before adding. A new token needs a real, repeated purpose and a spec change (`.claude/specs/token-system-spec.md`, then `names.ts` and `picks.ts`). One-off needs use an existing token or app-local CSS.
- Adding a component to the library: follow `docs/component-conventions.md`.
- Don't set `className` to restyle a component's colors. A theming need is a driver.

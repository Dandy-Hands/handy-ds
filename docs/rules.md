# handy-ds rules

For people and coding agents building client apps with handy-ds. Follow these rules as written. If a rule doesn't fit, ask the team; don't invent a workaround.

## 1. Set up a client project

```sh
npm install handy-ds react react-dom       # private package: install from the tarball/registry the team uses
```

```js
// theme.config.js: this file is the client's whole theme
export default {
  drivers: {
    color: { primary: '#0f766e', accent: '#be185d' },
    typography: { headingFamily: '"Fraunces", Georgia, serif', bodyFamily: 'Inter, system-ui, sans-serif' },
    density: 1,
    radius: 6,
  },
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

`hds-theme` exits with code 1 and lists every failing pair when the config breaks a contrast rule. Fix the drivers or the mapping. Don't ignore the failure.

Load font files yourself (Google Fonts `<link>`, `@font-face`). The theme only sets the `font-family` stacks.

## 2. Theme a client: drivers first

Change only what the brand needs. Everything left out uses the default (`defaultDrivers` in `handy-ds/tokens`).

| Driver | What it does |
|---|---|
| `color.primary` | Brand color, as any CSS color. Makes an 11-step ramp (50–950); the color itself lands on its nearest step. Buttons, links, focus ring, checked controls and on-primary sections use it. |
| `color.accent` | Second brand color. Accent icons use it. Point more tokens at it with a mapping (section 3). |
| `color.neutral` | Optional. Grays. Leave it out to tint grays from the primary hue. |
| `color.danger/warning/success/info` | Feedback colors (alerts, toasts, meters, errors). |
| `typography.headingFamily`, `bodyFamily` | Font stacks. |
| `typography.baseSize`, `scaleRatio` | Body size in px and type-scale ratio (1.2 is tight, 1.25 is default, 1.333 is dramatic). |
| `typography.headingWeight` | `regular`, `medium`, `semibold` or `bold`. |
| `density` | Multiplies all spacing. 0.85 is compact, 1 is default, 1.15 is roomy. |
| `radius` | Base corner radius in px. The other steps scale from it. |
| `style.action/input/surface` | Per category: `radius` (`none`, `sm`, `base`, `lg`, `xl`, `full`) and `border` (`none`, `thin`, `medium`, `thick`). Pill buttons: `style: { action: { radius: 'full' } }`. |
| `shadow.strength` | 0 is flat, 1 is default, 2 is heavy. |
| `sections` | Which context a named page section uses: `{ hero: 'on-primary', promo: 'default' }`. See section 5. |

Driver changes cover most client requests. Try them first.

## 3. Theme a client: mapping (only when drivers can't do it)

A mapping points one semantic token at a different primitive. Put it in the same config:

```js
export default {
  drivers: { color: { primary: '#1d4ed8', accent: '#f59e0b' } },
  mapping: {
    default: {
      'hds/sem/action/color/primary/default/bg': '{hds/prim/color/accent/600}',
      'hds/sem/action/color/primary/hover/bg': '{hds/prim/color/accent/700}',
    },
    'on-primary': {},
  },
};
```

- Keys are semantic token names in slash form. Values are `{hds/prim/...}` references or literal CSS.
- Primitive names: `color/{primary|accent|neutral|danger|warning|success|info}/{50…950}`, `color/white`, `color/black`, `space/{0,1,2,3,4,5,6,8,10,12,16,20,24}`, `radius/{none,sm,base,lg,xl,full}`, `border/{none,thin,medium,thick}`, `type/scale/{1…8}`, `type/leading/*`, `type/tracking/*`, `type/weight/*`, `type/family/{heading,body}`, `shadow/level-{0…3}`.
- Unknown names throw at build time, and mappings are contrast-checked.
- Change every state of a token you move (default, hover, active...). Otherwise hover will jump back to the old color.
- A one-off CSS override also works (`:root { --hds-sem-…: var(--hds-prim-…) }` in unlayered app CSS always wins), but it skips the contrast check. Prefer the config.

Never edit component CSS to theme a client.

## 4. Pick a component

| Need | Use |
|---|---|
| Do something (submit, open, save) | `Button` (`priority`: `primary` = the main action on the screen, at most one per view; `secondary` = other actions; `tertiary` = low-emphasis, toolbars, inline. `size`: `sm`/`md`/`lg`, default `md`) |
| Go somewhere that looks like a button | `LinkButton` (renders `<a>`) |
| On/off setting that applies immediately | `Switch` |
| Pressed/unpressed formatting button, or pick-one/pick-many from a few buttons | `Toggle`, `ToggleGroup` |
| Group of controls for a region (editor bar) | `Toolbar` |
| Switch between views in place | `Tabs` |
| Site navigation, with dropdowns | `NavigationMenu` |
| List of commands behind a button | `Menu`. App-style menu row: `Menubar`. Right-click: `ContextMenu` |
| Text input | `Field.Root` + `Field.Label` + `Field.Control` (+ `Field.Description`, `Field.Error`). Bare `Input` only where there's no label (search in a toolbar with `aria-label`) |
| Number with +/- steppers | `NumberField` |
| Pick one of 2–5 visible options | `RadioGroup` + `Radio` |
| Pick one from a long fixed list | `Select` |
| Pick from a long list with typing/filtering, or multi-select chips | `Combobox` |
| Free text with suggestions | `Autocomplete` |
| Yes/no or many-of-few | `Checkbox` (`CheckboxGroup` for a set) |
| Group related fields | `Fieldset` inside a `Form` |
| Box of related content | `Card` (`elevation` 0–3; 1 is default) |
| Must-see task that blocks the page | `Dialog`. Confirm a destructive action: `AlertDialog` |
| Extra info or small controls anchored to a trigger | `Popover` |
| Show/hide sections (FAQ) | `Accordion` |
| Message that stays on the page | `Alert` (`sentiment`: `info`, `success`, `warning`, `danger`) |
| Short-lived message after an action | `Toast` (`Toast.Provider` + `<Toaster />` once, then `useToastManager().add({ title, type })`) |
| A value in a range (storage used, score) | `Meter` |
| Task completion (upload) | `Progress` (`value={null}` = unknown) |
| Rows and columns of data | `Table` (`striped`; sortable column = `<th aria-sort><button>`) |
| Any text with a type role | `Text` (`variant`: `display`, `heading`, `body`, `label`, `caption`; pick the heading level with `render={<h3 />}`) |
| An icon | `Icon` wrapping an SVG that uses `currentColor`. Give it `label` if it carries meaning. No `variant` inside buttons (it inherits the button's color) |
| A dividing line | `Separator` (`weight`: `thin`, `medium`, `thick`; `orientation="vertical"`) |

Props, use-when and don't-use-when for every component: `docs/components.md` (`node_modules/handy-ds/docs/components.md` in a client app).

Compound components (`Select`, `Menu`, `Dialog`, ...) have the same parts and props as Base UI's. Use Base UI's docs for structure and behavior (`node_modules/@base-ui/react/docs/react/components/*.md`). handy-ds only adds styling. Examples of every component: `demo/main.tsx`.

## 5. Contexts (colored sections)

- A section on a brand-colored background: `<section data-section="hero">` (the client's `sections` driver decides the context) or `<section data-context="on-primary">` (always on-primary).
- Everything inside restyles itself: text, buttons, inputs, cards and focus rings. Don't pass color props.
- Inside a colored section, `data-context="default"` on an element restores normal colors for its subtree (a white card in a hero). Put forms in such a card: field error text is only contrast-checked in the default context.
- Only `default` and `on-primary` exist. Don't invent new `data-context` values.

## 6. Writing app code against the library

- Style app layout (grids, page spacing, widths) in the app's own CSS. Leave component internals alone.
- When app CSS needs a design value, read a semantic token: `color: var(--hds-sem-type-color-caption-fg)`. Never a primitive, never a hex code.
- Choose the token by **category first**: what is this thing? Clickable is Action. Data entry is Input/Field. Container is Surface. Text is Type. Status message is Feedback. Line is Divider. Then pick the axis (priority, size, elevation, role, sentiment) and the state.
- Reuse before adding. A new token needs a real, repeated purpose the existing ones can't express, and a spec change (`.claude/specs/token-system-spec.md`, then `checkTokenName()` and the Theme Map). One-off needs use an existing token or app-local CSS.
- Adding a component to the library: follow `docs/component-conventions.md`.
- Don't set `className` to restyle a component's colors. If it's a theming need, it's a driver or a mapping.

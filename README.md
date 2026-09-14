# handy-ds

A shared component library for building client web apps and headless-WordPress front ends. One set of components, re-themed per client from a small set of driver inputs. Internal use only; clients never touch it directly.

Built on React 19 and [Base UI](https://base-ui.com) (`@base-ui/react`), styled with plain CSS custom properties.

## How theming works

```
Drivers → Primitives → Semantic Tokens → Components
```

- **Drivers**: the hand-set inputs per client (brand colors, fonts, density, radius, and so on).
- **Primitives**: generated from drivers, never hand-set (`hds/prim/color/primary/600`).
- **Semantic tokens**: named by purpose, pointing at primitives (`hds/sem/action/color/primary/hover/bg`).
- **Components**: read semantic tokens only. Swapping a theme needs no component changes. The build fails if a component references a primitive.

## Use it in a client app

```sh
npm install handy-ds react react-dom
```

```js
// theme.config.js
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
npx hds-theme theme.config.js > src/theme.css
```

`hds-theme` writes the CSS either way, but exits 1 and lists each failing pair on stderr when the theme breaks a contrast rule.

```tsx
import 'handy-ds/styles.css'; // component styles
import './theme.css';          // client tokens (or 'handy-ds/theme.css' for the default theme)
import { Button } from 'handy-ds';
```

The full rules (drivers, mapping, contexts, which component to use) are in [`docs/rules.md`](docs/rules.md).

## Package exports

| Import | Contents |
|---|---|
| `handy-ds` | Components |
| `handy-ds/tokens` | `buildTheme`, `defaultDrivers`, `checkTokenName`, types |
| `handy-ds/styles.css` | Component styles |
| `handy-ds/theme.css` | Default theme tokens |

## Develop

```sh
npm install
npm run dev     # demo page at demo/
npm test        # typecheck + node --test
npm run build   # test, then build dist/
```

The examples install the package from `file:../..`, so run `npm run build` at the root first:

```sh
cd examples/wordpress   # or examples/pwa
npm install
npm run dev
```

## Layout

```
src/tokens/       drivers → primitives → theme map → CSS, contrast checker
src/components/   components and their CSS
bin/hds-theme.js  client theme CLI
demo/             dev demo page
examples/         WordPress and PWA example apps
docs/             rules.md (building client apps), component-conventions.md (building components)
.claude/specs/    design specs: read before changing tokens or conventions
```

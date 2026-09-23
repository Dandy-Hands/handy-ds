# Interview Guide: Icon component (retroactive)

- Status: complete
- Started: 2026-09-23
- Component: Icon (`src/components/Icon.tsx` + `Icon.css`)
- Note: Retroactive guide. Owner directed the interview be skipped for this run; every answer below is derived from the existing component code and `.claude/decisions.md` (cite which).
- Base UI version documented from: `@base-ui/react` 1.8.0

## 1. Existing surface (confirmations)

- [x] Q1: Keep the existing surface as-is — a single-part `Icon` span wrapper with three props (`variant`, `size`, `label`) and nothing else?
  > Yes — `IconProps` declares exactly `variant`, `size`, `label` (`Icon.tsx` lines 9–15). docs/components.md lists the same three.
- [x] Q2: No Base UI primitive — Icon is a plain span wrapper (`ComponentProps<'span'>`), not `useRender`?
  > Yes — the implementation renders a `<span>` and spreads props; no Base UI import exists in the file. decisions.md Wave 5 lists the `useRender` components as "Card, Alert, Text" — Icon is not among them. Base UI ships no icon component (no doc in `@base-ui/react/docs/react/components/`).

## 2. Extension props

- [x] Q3: `variant` is `'default' | 'secondary' | 'accent'`; omitting it inherits the surrounding text color?
  > Yes — `data-variant={variant}` only when provided (line 20) and `Icon.css` colors only under `[data-variant='...']`, so an unset variant keeps `currentColor`. decisions.md Wave 5: "Icon inherits `currentColor` unless given a role `variant`, so icons in buttons match the button."
- [x] Q4: `size` is any CSS length, applied as a private `--_size` custom property, defaulting to the surrounding font size?
  > Yes — `size ? { ...style, '--_size': size } : style` (line 21) and `Icon.css` uses `var(--_size, 1em)`. token-system-spec section 7 (Icon): "No measure token. Size inherits from adjacent text/action, overridable via component prop."
- [x] Q5: `label` turns the icon into an image (`role="img"` + `aria-label`); omitting it hides the icon from assistive tech (`aria-hidden`)?
  > Yes — `role={label ? 'img' : undefined}; aria-label={label}; aria-hidden={label ? undefined : true}` (lines 18–19). docs/components.md: "Give `label` to an icon that carries meaning on its own."

## 3. Token mapping and usage rules

- [x] Q6: The three variants map to the Icon category color tokens (`hds/sem/icon/color/{default,secondary,accent}/fg`)?
  > Yes — `Icon.css` reads exactly those three tokens. token-system-spec section 7 Icon definition.
- [x] Q7: Inside a Button or Alert, `variant` stays unset so the icon matches the surrounding text via `currentColor`?
  > Yes — docs/components.md: "Omit `variant` inside a Button or Alert so the icon matches the text around it." Both wrap children in spans that set `color`, which the SVG's `currentColor` stroke/fill follows.

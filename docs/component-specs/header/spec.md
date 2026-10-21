# Internal Spec: Header

Status:
- spec: reviewed
- code: built
- figma: built
- docs: built

- Date: 2026-10-20
- Shares its implementation with `Section`: see `docs/component-specs/section/spec.md` for the shared props, token mapping, contrast, and CSS.
- Code (planned): a thin wrapper in `src/components/Section.tsx`.

## Description

Header is the band at the top of a page. It renders a `<header>` element. It takes every `Section` prop, and one more: `sticky`.

## Usage

- Do use Header once per page for the site title, the logo, and the main navigation.
- Don't use it for the heading of a card or a section. Use `Card` or `Section`.
- Do put a `<nav>` element or `NavigationMenu` inside for the main navigation.

## Base UI API

No Base UI primitive. `useRender.ComponentProps<'header'>` + `mergeProps`. `render` and the native `header` props are exposed. `style` is removed from the type. Same as `Section`.

## Extension API

All `Section` props (`surface`, `gradient`, `media`, `scrim`, `background`, `paddingBlock`, `paddingInline`, `contentWidth`, `height`, `minHeight`, `align`), with `Section` defaults except `paddingBlock`, whose default is `"400"` (decided 2026-10-20), and:

| Prop | Type | Default | Decision |
| --- | --- | --- | --- |
| `sticky` | `boolean` | `false` | The header stays at the top of the screen while the page scrolls. A sticky header floats above the content beneath it, so it gets the `elevation/raised` shadow (decided 2026-10-20). The color stays the `surface` value. |

## Token mapping

Same as `Section`, plus `hds/sem/elevation/raised` for the shadow when `sticky` is set.

## Open

- The sticky offset for an `Aside` under a sticky `Header` (see `docs/component-specs/aside/spec.md`).

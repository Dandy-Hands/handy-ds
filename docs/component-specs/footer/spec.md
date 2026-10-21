# Internal Spec: Footer

Status:
- spec: reviewed
- code: pending
- figma: pending
- docs: pending

- Date: 2026-10-20
- Shares its implementation with `Section`: see `docs/component-specs/section/spec.md` for the shared props, token mapping, contrast, and CSS.
- Code (planned): a thin wrapper in `src/components/Section.tsx`.

## Description

Footer is the band at the bottom of a page. It renders a `<footer>` element. It takes every `Section` prop. It adds no prop of its own.

## Usage

- Do use Footer once per page for legal text, secondary links, and contact details.
- Don't use it for the end of a card or a section.

## Base UI API

No Base UI primitive. `useRender.ComponentProps<'footer'>` + `mergeProps`. `render` and the native `footer` props are exposed. `style` is removed from the type. Same as `Section`.

## Extension API

All `Section` props (`surface`, `gradient`, `media`, `scrim`, `background`, `paddingBlock`, `paddingInline`, `contentWidth`, `height`, `minHeight`, `align`), with `Section` defaults except `paddingBlock`, whose default is `"800"` (decided 2026-10-20). No other prop.

## Token mapping

Same as `Section`.


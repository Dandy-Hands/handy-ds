# Style Looks — Concept

Status: concept only (2026-10-15). Not decided. Not scheduled. Revisit after the current system is tested.

## Idea

Extend theming below the semantic token layer to individual components or component groups.
A theme picks a "look" for each group from a fixed list.

Examples:

- `selection.glyph = icon | css`. Checkbox, radio, and switch use Material icons or CSS-drawn glyphs.
- `button.primary = gradient | contained | outlined | text`.
- `button.secondary` and `button.tertiary` take the same list.

## Fit with the current system

- A style look is a driver. It is a pick from a fixed list, like a pick driver.
- The pipeline gains one layer: Drivers → Primitives → Semantic Tokens → Style Looks → Components.
- Components still read semantic tokens only. A look selects which CSS branch applies.
- Themes stay a small config.

## Two kinds of look

1. Value looks need tokens only. Example: a gradient needs the bg token to accept a gradient, not only a color. Border width and elevation work the same way.
2. Structure looks need different CSS or markup. Example: icon glyph versus CSS glyph.
3. For structure looks, the component ships every look in `styles.css`. The theme selects one with a data attribute, such as `data-hds-button-primary="gradient"`.

## Risks

- Each option multiplies CSS, docs, and tests. Keep each list short and fixed per group.
- The contrast checker handles flat colors only. A gradient needs a check at both end stops.
- Each look must work in light and dark modes, and in the `on-primary` and `on-secondary` contexts.
- The theme builder at `/theme` needs a new step with a live preview per option.

## Spec effects if adopted

- `design-system-vision-spec.md` and `token-system-spec.md` change. Both say "drivers only, no mapping level".
- The `link-button` "fixed primary look" decision changes.
- No backwards compatibility applies, so both can change freely.

## Suggested pilots

1. Selection controls: icon versus CSS glyph. This proves the structure path.
2. Button priority looks, including gradient. This proves the value path.

## Open questions

- Where does the look config live: the driver config, or a separate section?
- Which component groups get looks, and which stay fixed?
- Does the look list differ per client, or is it global?
- How does the docs site show every look?

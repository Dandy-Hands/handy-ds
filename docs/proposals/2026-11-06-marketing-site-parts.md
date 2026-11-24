# Proposal: marketing site parts from the OKC Renovations build

- Date: 2026-11-06
- Status: proposed. The user decides each item: component, template, driver, or no.
- Source: the OKC Renovations site (`dandy-hands/okc-renovations`). Code: `site/src/parts.tsx` and `site/src/app.css`. Screenshots: `audit/okc-renovations.com/pantry-v2/`.
- Inspiration: the Pantry WordPress theme (ThemeForest). We use its patterns only. Its CSS, images and design are under the ThemeForest license, so no Pantry code or art is in the site or in this proposal.

## Why

The client wanted a richer, editorial look. Handy DS had no part for 10 common marketing patterns, so we built them as site parts. Each part uses semantic tokens only. Each part is listed here so the next client site can reuse it, or so the library can take it in.

## Terms

- **Component**: goes into `src/components/`, with a spec interview, tokens, docs, Figma.
- **Template**: a documented recipe of existing components (a page section), with no new component code. A good place for these is `docs/templates/` or a future page template set.
- **Driver or prop**: a small change to an existing component or the theme drivers.

## Items

| # | Part | Pattern | Proposed form | Notes |
|---|---|---|---|---|
| 1 | Eyebrow | Small uppercase label with a short rule before it, above a heading | Text prop or new Text role | Today: app CSS sets `text-transform` and `letter-spacing: 0.12em`. Text has no uppercase setting, and tracking stops at 0.02em. Option: a Text `variant="eyebrow"` role with its own tokens, or a `transform` typography driver for the label role. |
| 2 | SectionHead | Eyebrow, h2, optional intro; centered or start-aligned | Template | Only Stack and Text. The center form caps the width (48rem). Needs Eyebrow first. |
| 3 | TextLink with arrow | Bold label link with an underline and an arrow that moves on hover | Component (`TextLink`) | The library has no text link component (known gap). Proposed props: `href`, `arrow` (boolean), `onMedia`. The site already has this part. |
| 4 | HomeHero (split hero to the edge) | Headline left in the content column; photo runs to the right screen edge; small inset project card; ring ornament | Section prop plus a template | Proposed Section prop: `bleed: "end"` for the last Grid column. The inset card is a template (Card with Photo, label and arrow). The ring is item 10. |
| 5 | PageHero | Dark photo band with a breadcrumb trail, h1, intro and one button | Template plus a Breadcrumb component | Section `media` and `scrim` already do the band. A `Breadcrumb` component is missing: a `nav` with links and separators, `aria-current` on the last link. Finding: the `scrim` with `direction` fades too fast for body text on a light photo. The site uses the even `strong` scrim. |
| 6 | Marquee | A brand band of words that moves slowly sideways | Component | CSS keyframes, a second copy with `aria-hidden`, pause on hover, no motion under reduced motion. Gap: it needs a pause control for WCAG 2.2.2 if it runs longer than 5 seconds. Same open item as the Section video. Proposed props: `items`, `speed` (as a multiple of the motion duration), `surface`. |
| 7 | Steps | Numbered steps with large outlined numbers on a top rule | Component or template | Outlined numbers use `-webkit-text-stroke` in the band's text token (`currentColor` cannot be used: the fill is transparent). Proposed props: `items` or `Steps.Item` parts, `numbers: "outline" \| "solid"`. Renders `ol`. |
| 8 | Facts | Short facts with an icon each, in outlined boxes | Template | Tiles, Icon and Text. Needs the outlined box look (item 11). |
| 9 | Gallery | Photos with captions. `scroll`: a row with scroll snap and previous and next buttons. `grid`: tiles | Use Carousel for `scroll`; template for `grid` | The Carousel spec (`effect="slide"`, `perView`) covers the scroll row. The site has its own row now because Carousel code is pending. Replace it when Carousel ships. Photo zoom on hover is CSS. |
| 10 | Ornament | Decorative line art (a thin ring) behind a photo corner | Driver or component, low priority | Known gap: no decorative ornaments. Option: a `Decor` component with a few shapes in `graphic` tokens, hidden from assistive tech. |
| 11 | Outlined card | Flat card with a border that turns accent on hover | Card prop | Known gap: Card has no outlined variant. The site uses `elevation={0}` with `shadow.strength: 0` for the whole site, plus app CSS for the hover border. Proposed: Card `variant="outline"` and an `interactive` hover state. |
| 12 | QuoteBlock | Large quote mark beside a heading, text and link | Template | Icon `format_quote` at size `3200`, in a Grid. |
| 13 | CtaBand with page copy | Closing band: heading, text, button, phone link | Template | Section `surface="primary"`. |

## Library defects found

- **Button and LinkButton labels do not wrap.** They are fixed height and `white-space: nowrap`. At 390px wide, "Request a Project Estimate" (size `1200`) ran past the screen edge. The site overrides `.hds-button` under 640px (`white-space: normal`, `block-size: auto`, `min-block-size: var(--_height)`). Proposal: let labels wrap and keep the height as a minimum.
- **No responsive `width` on LinkButton.** A `width={{ base: "full", md: "auto" }}` would fix the phone layout without the override above.

## Decision record

| # | Decision | Date | By |
|---|---|---|---|
| | | | |

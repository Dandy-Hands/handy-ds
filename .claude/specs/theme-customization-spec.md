# Driver Interface Spec

**Status: draft.** Built from the user's notes of 2026-10-04 (original text in the appendix). The token rework interview of 2026-10-07 answered open questions 1–7. The drivers and their defaults are in `token-system-spec.md` section 3. The decisions and their reasons are in `token-rework-interview.md`. Open question 8 is not decided.

The driver interface is the visual tool where a person builds a client theme by setting drivers. Its working name is "role based token selection" or "theme building". See the vision spec, section 7.

## 1. Model: two parts per token type

Each token type (color, measure, border, roundness, shadow, type, and others) has two parts in the interface.

1. **Palette part.** This part shapes the primitive (reference) palette for the token type. The shape of each palette is known in advance: the number of scales, the number of stops, and their names. Only the values change.
2. **Application part.** This part assigns palette values to specific uses, by element category. Most applications have a default value. A person can override a default value.

The palette part is better defined than the application part. Except for a few color applications, the application part is not designed yet.

## 2. Steps

The interface takes the person through the token types in this order. Each step uses only what earlier steps produce (interview decision E1).

### Step 1: Brand colors (color palette part)

The person sets the primary color, the optional secondary color, the neutral tint or an exact neutral color, the chroma floor, the contrast setting, and the dark-mode contrast and chroma. Color inputs accept any CSS color format. A live 11 × 11 grid shows the generated palette: 11 hue slots of 11 stops each. Token spec sections 3.1 and 4.1.

### Step 2: Role map

The person picks the slot for each system color: danger, warning, success, and info. Each has a default from hue proximity. Primary, secondary, and neutral are locked to their anchors. Token spec section 4.1.4.

### Step 3: Color application (color application part)

The person sets the pick for each color token, by category. A pick is a primitive name, such as `primary/600`. Each pick has a default. Other inputs in this step:

- Interaction state offsets and optional state overrides (token spec section 5.2).
- Dark-mode overrides per pick (section 5.3).
- The brand context overrides for `on-primary` and `on-secondary`, the default mode, and section rules (section 6).
- The data-visualization picks (section 7.4).

The picker shows the full palette. It blocks a pick that fails WCAG 2 AA against its pair: 4.5:1 for text and 3:1 for non-text (section 5.4).

### Step 4: Typography

Font families, base size, scale ratio, and picks for 5 roles × 3 sizes. Token spec sections 4.6 and 7.7.

### Step 5: Measure

The density driver scales one 4px grid. Token spec sections 4.2 and 7.5.

### Step 6: Radius

One radius step per shape role: control, container, indicator, round. Token spec sections 4.3 and 7.5.

### Step 7: Border

One border width per role: control, container, divider, focus. Token spec sections 4.4 and 7.5.

### Step 8: Elevation

The shadow strength driver. Token spec sections 4.5 and 7.6.

## 3. Element categories

Decided 2026-10-04. The color application part groups tokens into these eight categories. Token spec section 7.1 defines them.

| Category | Comes from | What it holds |
|---|---|---|
| Action | Action | Buttons, triggers, switches. |
| Field | Input/Field | Text inputs, selects, checkboxes, radios. |
| Surface | Surface | Page, cards, and popups, on 5 levels: sunken, base, raised, floating, modal. |
| Content | Type + Icon | Text and icons: the foreground on a surface. Color only; typography is step 4. |
| Graphic | Divider + data visualization | Divider lines and chart colors. |
| Feedback | Feedback | Alerts and toasts. Their colors come from the system colors. |
| Focus | Focus | The focus ring. A separate effect that applies across categories. |
| Overlay | Overlay | The modal scrim. A separate effect, like Focus. |

## 4. Open questions

Questions 1–7 have answers from the token rework interview (2026-10-07). The token spec section is given for each answer.

1. **Application part for non-color types.** Answered. Typography has picks per role and size. Radius and border have one step per shape role. Measure and shadow have one scale driver each. Section 3.3.
2. **Neutral colors.** Answered. By default, a tint of the primary hue. An optional neutral color replaces it. Section 4.1.5.
3. **Graph colors.** Answered. Categorical, sequential, and diverging palettes. Each color is a pick from the full palette, with a default. Section 7.4.
4. **Contrast slider.** Answered. In scope. One global setting for light mode and one for dark mode. Section 4.1.2.
5. **Accessibility rule.** Answered. WCAG 2 AA: 4.5:1 for text, 3:1 for non-text. A failing pick is blocked. Disabled states are exempt. Section 5.4.
6. **Modes.** Answered. Dark mode is a derived, inverted palette with the same picks, plus dark tuning drivers and optional dark overrides per pick. High contrast is not done yet (section 9). Sections 4.1.6 and 5.3.
7. **Step order.** Answered. See section 2.
8. **Location, preview, and output.** Not decided. Where does the interface run, what does the preview show, and what does the interface produce? The vision spec says the output is a driver config.

## Appendix: original notes (2026-10-04)

> Role based token selection. Theme Building.
> 1. Choose brand colors (drives the palettes)
>     * There is a color picker to pick or insert the primary color.
>     * The secondary color is, by default, derived from primary but may be picked.
>     * Neutral colors
>     * System colors are defaulted but also may be tuned.
>     * Graph colors are derived from brand primary.
>     * There might be a contrast slider which shifts the lightness of the oklch stops for the swatches.
>     * All of this creates a color palette visually.
>     * The shape of the palette is entirely known up front, it’s the values that change.
> 2. Color application
>     * Colors are applied to tokens categorized by element: action, field, surface, content, graphic, etc. Many of the applications would be defaulted but can be overridden.
>     * When applying colors, the picker contains the primary, secondary, and neutral colors. Chosen colors will disable the selection of inaccessible colors in other selections.
>     * Semantic color assignment is predetermined.
>     * Surfaces have a type of elevation or priority to set the elevations and the background color.
>     * Need to figure out modes. Dark mode would be derived but can be tuned.
> 3. Measures
> 4. Borders
> 5. Roundness
> 6. Shadow
>
> The gist is, there are 2 parts for each type of token (color, measure, shadow, types, etc.) A part that shapes the primitive/refernce palette, and a part that addresses specifc application. I'm fussy on the specific application part save for a few color applications. So a lot of this will need to be worked out.

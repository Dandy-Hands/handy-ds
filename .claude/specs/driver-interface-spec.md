# Driver Interface Spec

**Status: draft.** Built from the user's notes of 2026-10-04 (original text in the appendix). Many parts are not decided yet; see "Open questions".

The driver interface is the visual tool where a person builds a client theme by setting drivers. Its working name is "role based token selection" or "theme building". See the vision spec, section 7.

## 1. Model: two parts per token type

Each token type (color, measure, border, roundness, shadow, type, and others) has two parts in the interface.

1. **Palette part.** This part shapes the primitive (reference) palette for the token type. The shape of each palette is known in advance: the number of scales, the number of stops, and their names. Only the values change.
2. **Application part.** This part assigns palette values to specific uses, by element category. Most applications have a default value. A person can override a default value.

The palette part is better defined than the application part. Except for a few color applications, the application part is not designed yet.

## 2. Steps

The interface takes the person through the token types in this order.

### Step 1: Brand colors (color palette part)

The brand colors drive the palettes.

- **Primary color.** A color picker lets the person pick the primary color or type in a value.
- **Secondary color.** By default, the secondary color is derived from the primary color. The person can pick a different one.
- **Neutral colors.** The person can set the neutral colors. The notes do not say how.
- **System colors.** System colors, such as danger, warning, success, and info, have default values. The person can tune them.
- **Graph colors.** The data-visualization palette is derived from the primary color.
- **Contrast slider (possible).** The slider changes the lightness of the OKLCH stops for all swatches. OKLCH is a color space where lightness, chroma, and hue are separate values.

The result shows as a visual color palette.

### Step 2: Color application (color application part)

- Colors apply to tokens, which are grouped by element category: action, field, surface, content, graphic, and others. Most applications have a default value, and the person can override it.
- The color picker for an application shows the primary, secondary, and neutral palettes.
- A chosen color disables inaccessible colors in the other selections. For example, after the person picks an action background, the picker for the action text disables the colors that fail contrast against it.
- Semantic color assignment is predetermined. For example, the danger color always comes from the danger system palette. The person does not assign it.
- Surfaces have an elevation or priority axis. That axis sets both the elevation and the background color of each surface.
- **Modes.** Dark mode is derived from the light theme, and the person can tune it. The rest of the design for modes is not decided.

### Step 3: Typography

Typography has its own step. The palette part sets the type primitives, for example the font families and the type scale. The application part assigns them to text roles. The details are not designed yet.

### Step 4: Measures

Not designed yet.

### Step 5: Borders

Not designed yet.

### Step 6: Roundness

Not designed yet.

### Step 7: Shadow

Not designed yet.

## 3. Element categories

Decided 2026-10-04. The color application part groups tokens into these eight categories. They replace the nine categories of the token spec.

| Category | Comes from | What it holds |
|---|---|---|
| Action | Action | Buttons, triggers, switches. |
| Field | Input/Field | Text inputs, selects, checkboxes, radios. |
| Surface | Surface | Cards and popups, with an elevation axis that sets elevation and background color. |
| Content | Type + Icon | Text and icons: the foreground on a surface. Color only; typography is step 3. |
| Graphic | Divider + data visualization | Divider lines and chart colors. |
| Feedback | Feedback | Alerts and toasts. Their colors come from the system colors and are predetermined. |
| Focus | Focus | The focus ring. A separate effect that applies across categories. |
| Overlay | Overlay | The modal scrim. A separate effect, like Focus. |

## 4. Open questions

1. **Application part for non-color types.** What does the person assign for typography, measures, borders, roundness, and shadow, and at what level of detail?
2. **Neutral colors.** Are the neutral colors derived from the primary color, picked, or both? The current code tints them from the primary hue by default.
3. **Graph colors.** How many graph colors are there, and how does the system derive them from the primary color? Can the person override them?
4. **Contrast slider.** Is the slider in scope? Does it apply to all palettes or to each palette?
5. **Accessibility rule.** Which contrast level disables a color: WCAG AA (4.5:1 for text) or a different level? Does the rule apply to non-text pairs, such as borders?
6. **Modes.** How does the system derive dark mode, and which values can the person tune? Are there other modes, such as high contrast?
7. **Step order.** Typography is step 3, after color application. Is that the correct place?
8. **Location, preview, and output.** Where does the interface run, what does the preview show, and what does the interface produce? The vision spec says the output is a driver config.

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

Status:
- spec: reviewed
- code: built
- figma: pending
- docs: pending

# Internal Spec: Avatar

- Date: 2026-10-12
- Interview: `interview-guide-2026-10-12.md`
- Base UI version documented from: `@base-ui/react` 1.8.0 (`@base-ui/react/avatar`)

## Description

Avatar shows a person's photo in a round frame. When there is no photo, or the photo fails to load, it shows a fallback: initials or an icon. It wraps Base UI's avatar: a root, an image that renders only after it loads, and a fallback. It follows Meter's minimal surface (`../meter/spec.md`).

## Usage

- Do use Avatar to identify a person or an account next to a name, in lists, headers, and comments.
- Do always give a Fallback with initials or an icon.
- Don't use Avatar for content images or logos. Use `<img>`.
- Do give the Image an empty `alt` when the person's name shows next to it.

## Base UI API

Wrapped component: `Avatar` from `@base-ui/react/avatar`. Minimal surface, as for Meter.

| Base UI member | Decision |
| --- | --- |
| `Root`: `children` | Exposed. The parts. |
| `Image`: `src`, `alt`, `srcSet`, `sizes`, `loading` | Exposed. Native `img` attributes. |
| `Image`: `keepMounted` (default false) | Exposed. Loads the image in place, for `loading="lazy"`. |
| `Image`: `onLoadingStatusChange(status: 'idle' \| 'loading' \| 'loaded' \| 'error')` | Exposed. |
| `Image`: `render` | Exposed. For optimized image components such as `next/image`, with `keepMounted`. |
| `Fallback`: `children` | Exposed. Initials or an `Icon`. |
| `Fallback`: `delay` (ms, default 0) | Exposed. Stops a fallback flash while a fast image loads. |
| Image transition data attributes (`data-starting-style`, `data-ending-style`) | Kept. CSS does not read them. |
| `className`, `style`, `ref`, other native props on every part; `render` on Root and Fallback | Omitted, as for Meter (recorded break of API conventions section 1). |

Part prop types are written out, not extensions of the Base UI props.

## Extension API

On `Avatar.Root`. Set as a data attribute on the root.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `AvatarSize = '800' \| '1000' \| '1200' \| '1600'` | `'1000'` | Width and height, a `measure/size` step (32, 40, 48, 64px at density 1). Also sets the Fallback font size. Set as `data-size`. Not responsive. |

No shape prop: Avatar is always round (`radius/round`). A client changes the shape with the `radius.round` driver. No `tone`: the Fallback has one neutral look.

## Token mapping

| Part | Property | Token |
| --- | --- | --- |
| Root | `inline-size`, `block-size` | `hds/sem/measure/size/{size}` |
| Root | `border-radius` | `hds/sem/radius/round` |
| Root | `background` | `hds/sem/color/surface/sunken/bg` |
| Image | — | no tokens; fills the Root |
| Fallback | color | `hds/sem/color/content/muted/fg` |
| Fallback | font | `hds/sem/typography/label/{family\|weight\|leading\|tracking}` |
| Fallback | font size | `hds/sem/typography/label/size/{step}`: `800` = `sm`, `1000` = `md`, `1200` and `1600` = `lg` |

Notes:

- Layout (structural): Root is `inline-flex`, centered, `overflow: hidden`, `flex-shrink: 0`, `vertical-align: middle`. Image is `100%` wide and high, `object-fit: cover`. Fallback is `user-select: none`.
- The Root background shows behind a transparent image too.
- An `Icon` without `size` in the Fallback follows the Fallback font size.
- Contrast: `content/muted/fg` on `surface/sunken/bg` is a text pair (4.5:1). The contrast checker already covers it: every content role on every surface level, in both modes and both brand contexts.
- Context-passive: all colors re-resolve from ancestor `data-context` and `data-section` overrides.

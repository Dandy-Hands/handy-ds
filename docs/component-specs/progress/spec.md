Status:
- spec: reviewed
- code: built
- figma: built
- docs: built

# Internal Spec: Progress

- Date: 2026-10-12
- Interview: `interview-guide-2026-10-12.md`
- Base UI version documented from: `@base-ui/react` 1.8.0 (`@base-ui/react/progress`)

## Description

Progress shows how much of a running task is complete, such as an upload or an import. It wraps Base UI's progress: a label, a track, a fill, and an optional formatted value. With `value={null}` the duration is unknown and the fill slides (indeterminate). Screen readers announce it as `role="progressbar"`. It copies Meter's decisions (`../meter/spec.md`) except for the null value and the fill color.

## Usage

- Do use Progress while a task runs and will finish.
- Don't use Progress for a measurement. Use Meter.
- Do pass `value={null}` when the duration is unknown.
- Don't keep a full bar on screen as the result. Show what comes next (a message, a toast).

## Base UI API

Wrapped component: `Progress` from `@base-ui/react/progress`. Minimal surface, as for Meter.

| Base UI member | Decision |
| --- | --- |
| `Root`: `value` (required, `number \| null`), `min` (default 0), `max` (default 100) | Exposed. `null` = indeterminate. |
| `Root`: `format` (`Intl.NumberFormatOptions`), `locale` | Exposed. |
| `Root`: `aria-valuetext`, `getAriaValueText(formattedValue, value: number \| null)` | Exposed. |
| `Root`: `children` | Exposed. The parts. |
| `Label`, `Track`: `children` | Exposed. `Label` takes `ReactNode`. `Track` takes `Progress.Indicator`. |
| `Value`: `children` as `(formattedValue: string \| null, value: number \| null) => ReactNode` | Exposed. Shows nothing while indeterminate, unless the function returns text. |
| `Indicator` | Exposed, no props. |
| Status data attributes (`data-indeterminate`, `data-progressing`, `data-complete`) | Kept. CSS reads `data-indeterminate` only. `complete` does not change the look. |
| `render`, `className`, `ref`, `style`, native props on every part | Omitted, as for Meter (recorded break of API conventions section 1). |

Part prop types are written out, not extensions of the Base UI props.

## Extension API

On `Progress.Root`. Set as a data attribute on the root.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `ProgressSize = '200' \| '300' \| '400'` | `'300'` | Track height, a `measure/size` step (8, 12, 16px at density 1). Set as `data-size`. Does not change the text size. Not responsive. |

No `tone`: the fill always reads the primary action color. Removed from the dry run: the 8px default track (now 12px, as Meter) and the full Base UI passthrough.

## Token mapping

| Part | Property | Token |
| --- | --- | --- |
| Root | row gap / column gap | `hds/sem/measure/space/100` / `hds/sem/measure/space/200` |
| Track | `background` | `hds/sem/color/surface/sunken/bg` |
| Track | `block-size` | `hds/sem/measure/size/{size}` |
| Track | `border-radius` | `hds/sem/radius/round` |
| Indicator | `background` | `hds/sem/color/action/primary/default/bg` |
| Label | color | `hds/sem/color/content/default/fg` |
| Label | font | `hds/sem/typography/label/{family\|weight\|leading\|tracking}`, `hds/sem/typography/label/size/md` |
| Value | color | `hds/sem/color/content/muted/fg` |
| Value | font | `hds/sem/typography/caption/{family\|weight\|leading\|tracking}`, `hds/sem/typography/caption/size/md` |

Notes:

- Layout, clipping, tabular numbers, and the 300ms width transition: as Meter.
- Indeterminate (structural): the Indicator is 40% wide and slides across the track, 1.2s, `ease-in-out`, infinite. Under `prefers-reduced-motion: reduce`: no slide, full width, 50% opacity.
- Context-passive: all colors re-resolve from ancestor `data-context` and `data-section` overrides.

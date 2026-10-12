Status:
- spec: reviewed
- code: built
- figma: pending
- docs: pending

# Internal Spec: Meter

- Date: 2026-10-12
- Interview: `interview-guide-2026-10-12.md` (dry run: `interview-guide-2026-09-23.md`)
- Base UI version documented from: `@base-ui/react` 1.8.0 (`@base-ui/react/meter`)

## Description

Meter shows a static measurement inside a known range, such as storage used or a score. It wraps Base UI's meter: a label, a track, a fill, and an optional formatted value. Screen readers announce it as `role="meter"`. Progress (task completion) has its own spec.

## Usage

- Do use Meter when the number means something on its own and has a known range.
- Don't use Meter for a running task. Use Progress.
- Do set `tone` to show status (`warning` near a limit, `danger` over it). The caller picks the tone; Meter does not compute it from the value.

## Base UI API

Wrapped component: `Meter` from `@base-ui/react/meter`. Minimal surface, as for Separator.

| Base UI member | Decision |
| --- | --- |
| `Root`: `value` (required), `min` (default 0), `max` (default 100) | Exposed. |
| `Root`: `format` (`Intl.NumberFormatOptions`), `locale` | Exposed. |
| `Root`: `aria-valuetext`, `getAriaValueText` | Exposed. |
| `Root`: `children` | Exposed. The parts. |
| `Label`, `Track`, `Value`: `children` | Exposed. `Label` takes `ReactNode`. `Track` takes `Meter.Indicator`. |
| `Value`: `children` as `(formattedValue, value) => ReactNode` | Exposed. Content: for example "72 GB of 100 GB". |
| `Indicator` | Exposed, no props. |
| `render`, `className`, `ref` on every part | Omitted. Recorded break of the escape hatch in API conventions section 1: the user wants Meter minimal, as for Separator. |
| `style` on every part | Omitted. `Indicator` still writes its own inline width. |
| Native props (`id`, `aria-*` other than `aria-valuetext`, `data-*`, events, ...) | Omitted. |

Part prop types are written out (`{ children? }`, `{ value, min?, ... }`), not extensions of the Base UI props. Callers do not need `id`: `Label` is wired to `Root` by Base UI.

## Extension API

All on `Meter.Root`. Both are set as data attributes on the root.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `tone` | `MeterTone = 'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` | Fill color, Feedback axis (API conventions section 6). `info`: a neutral reading. `success`: a good level. `warning`: near a limit. `danger`: over a limit. Set as `data-tone`. |
| `size` | `MeterSize = '200' \| '300' \| '400'` | `'300'` | Track height, a `measure/size` step (8, 12, 16px at density 1). Set as `data-size`. Does not change the text size. Not responsive. |

Removed from the dry run: `sentiment` (renamed to `tone`) and the import of `Sentiment` from Alert.

**Token change needed before the code.** `measure/size` has no steps `200` and `300`. Add them to token spec 7.5, API conventions 5.2, `src/tokens/`, and the Figma variables (`.claude/TODO.md`).

## Token mapping

| Part | Property | Token |
| --- | --- | --- |
| Root | row gap / column gap | `hds/sem/measure/space/100` / `hds/sem/measure/space/200` |
| Track | `background` | `hds/sem/color/surface/sunken/bg` |
| Track | `block-size` | `hds/sem/measure/size/{size}` |
| Track | `border-radius` | `hds/sem/radius/round` |
| Indicator | `background` | `hds/sem/color/feedback/{tone}/icon` |
| Label | color | `hds/sem/color/content/default/fg` |
| Label | font | `hds/sem/typography/label/{family\|weight\|leading\|tracking}`, `hds/sem/typography/label/size/md` |
| Value | color | `hds/sem/color/content/muted/fg` |
| Value | font | `hds/sem/typography/caption/{family\|weight\|leading\|tracking}`, `hds/sem/typography/caption/size/md` |

Notes:

- Layout is structural: a grid with Label in column 1, Value in column 2, and Track across both columns.
- Track has `overflow: hidden`, so the Indicator takes the track radius.
- `font-variant-numeric: tabular-nums` on Value, structural.
- Fill motion: `transition: width 300ms`, structural. None under `prefers-reduced-motion: reduce`.
- Context-passive: all colors re-resolve from ancestor `data-context` and `data-section` overrides.

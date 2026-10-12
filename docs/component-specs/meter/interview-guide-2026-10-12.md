# Meter — Spec Re-Interview Guide (2026-10-12)

Full Phase 1 re-run after the token rework. Dry-run spec: `spec.md` (2026-09-23).
Wraps `Meter` from `@base-ui/react/meter`. The dry run also covered `Progress`, which
has its own `[new]` item in `.claude/component-interview-todo.md`.

Base UI version documented from: `@base-ui/react` 1.8.0.

Base UI facts:
- Parts: `Root` (div), `Label` (span), `Track` (div), `Indicator` (div), `Value` (span).
- `Root` props: `value` (required `number`), `min` (default 0), `max` (default 100),
  `format` (`Intl.NumberFormatOptions`), `locale`, `aria-valuetext`, `getAriaValueText`.
- `Value` children: `null` or `(formattedValue, value) => ReactNode`.
- Every part: `render`, `className` (string or state function), `style`, native props.
- State is empty: Base UI sets no data attributes on Meter parts.
- `Indicator` writes its width as an inline `style` (percent of the range).

Token facts (token spec 7.1–7.7):
- Feedback: `color/feedback/{danger|warning|success|info}/{bg|fg|border|icon}`. `icon` = stop 600.
- API conventions section 6: Feedback values belong to the `tone` axis. The dry run names
  the axis `sentiment`, which breaks "one meaning, one name".
- Surface `sunken` bg = `neutral/200`. Radius role `round` (9999px) now exists.
- Measure `size` steps start at `400` (16px). The dry-run track is `0.5rem`, a literal.
- Typography: `label/*` and `caption/*`, each `{family|weight|leading|tracking}` + `size/{sm|md|lg}`.
  The dry-run Value reads only `caption/size/md`.

## 0. Scope

- [x] Q0: Meter only, or Meter and Progress together?
  > First answer: "What is the diff between the two". Claude explained: role (`meter`
  > vs `progressbar`), `value={null}` (indeterminate) on Progress only, Progress status
  > state, and the dry-run fill colors (Feedback tone vs Action primary).
  > "Meter only (Recommended)". Progress gets its own interview.

## 1. Base UI surface

- [x] Q1: Pass through all `Root` props and the five parts. Keep `render`, `className`,
  native props, `ref`. Remove `style` from the wrapped part types (API conventions section 1).
  > "Minimal, like Separator". Root props and parts only. Remove `render`, `className`,
  > `ref`, native props, and `style`. Recorded break of the `render`/`className` escape
  > hatch (API conventions section 1), as for Separator.

## 2. Color axis

- [x] Q2: Rename `sentiment` to `tone` (`danger | warning | success | info`, default `info`)?
  Fill reads `color/feedback/{tone}/icon`.
  > "tone, default info (Recommended)". Set as `data-tone`.

## 3. Extension props

- [x] Q3: Other props. Proposed: none. No `size` (one track height), no threshold props
  (`low`/`high`/`optimum`); the caller picks `tone`.
  > "size". Track height as a measure step. Steps and token source: Q3a.
- [x] Q3a: Size steps. `measure/size` starts at `400` (16px), too thick for a track.
  > "Add size steps 100–300 (Recommended)". Token change: add `measure/size/{100|200|300}`
  > (4, 8, 12px). Meter `size`: `'100' | '200' | '300'`, default `'200'`.
- [x] Q3b: Does `size` change Label and Value text size?
  > "Track only (Recommended)". Label and Value use their role's `md` size.
- [x] Q3c (after the spec was written): change the steps?
  > "Let's move size up a step, 200, 300, 400". Meter `size`: `'200' | '300' | '400'`
  > (8, 12, 16px). Default moves up one step to `'300'`. Token change: add
  > `measure/size/{200|300}` only; `400` exists.

## 4. Token mapping

- [x] Q4: Track bg `color/surface/sunken/bg`; track radius `radius/round`, Indicator
  clipped; track height `measure/size/{size}`; fill `color/feedback/{tone}/icon`.
  > "Confirm (Recommended)".
- [x] Q4a: Label `color/content/default/fg` + `typography/label/*` at `md`. Value
  `color/content/muted/fg` + `typography/caption/*` at `md`, tabular numbers. Gaps
  `measure/space/100` (rows), `measure/space/200` (Label to Value).
  > "Confirm (Recommended)".
- [x] Q4b: Keep the `Value` children format function under the minimal surface?
  > "Keep (Recommended)". It is content, not styling.

## Open items

- Token change before the Meter code: add `measure/size/{200|300}` (token spec 7.5,
  API conventions 5.2, `src/tokens/`, Figma variables). Added to `.claude/TODO.md`.
- The code still has `sentiment`, imports `Sentiment` from Alert, passes `className`
  through, and reads only `caption/size/md` for Value. `hds-component-code` fixes these.
- `Progress` shares `Meter.tsx` and `Meter.css`. Its own interview decides its surface.

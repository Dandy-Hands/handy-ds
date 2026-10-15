# Slider — Spec Interview Guide (2026-10-15)

New component (`[new]` in `.claude/component-interview-todo.md`). Wraps `Slider` from `@base-ui/react/slider`.
No code, docs page, or Figma exists. Model: the Meter, Switch, and Checkbox interviews.

Base UI version documented from: `@base-ui/react` 1.8.0.

Base UI facts:
- Parts: `Root` (div), `Label` (div), `Value` (output), `Control` (div), `Track` (div), `Indicator` (div),
  `Thumb` (div with a nested `<input type="range">`).
- `Root` props: `value`, `defaultValue` (a `number`, or a `number[]` for a range slider), `onValueChange`,
  `onValueCommitted`, `min` (0), `max` (100), `step` (1), `largeStep` (10), `minStepsBetweenValues` (0),
  `orientation` (`horizontal`), `disabled`, `name`, `form`, `format`, `locale`, `thumbAlignment` (`center`),
  `thumbCollisionBehavior` (`push`), `render`, `className`, `style`.
- `Thumb` props: `index`, `disabled`, `getAriaLabel`, `getAriaValueText`, `aria-valuetext`, `inputRef`,
  `tabIndex`, `onBlur`, `onFocus`, `onKeyDown`, `render`, `className`, `style`.
- `Value` children: `null` or `(formattedValues, values) => ReactNode`.
- State attributes on every part: `data-dragging`, `data-orientation`, `data-disabled`, and the Field
  attributes `data-valid`, `data-invalid`, `data-touched`, `data-dirty`, `data-focused`.
  `Thumb` also has `data-index`.

Token facts (token spec 7.1–7.7):
- Field has `default`, `hover`, `focus`, `error`, `disabled`, and `checked` states. Checkbox, Radio, and
  Switch read them for the control mark.
- Surface `sunken` bg = `neutral/200`. Radius role `round` = 9999px.
- `measure/size` steps: `200` to `3200`. Meter uses `200 | 300 | 400` for its track.

## 1. Shape of the API

- [x] Q1: Mirror all Base UI parts, or render the control for the caller?
  > First answer: "We know that an agent will be the one building UI using this component. What do you
  > suggest?" Claude recommended `Control` renders the track. Accepted.
  > Parts: `Slider.Root`, `Slider.Label`, `Slider.Value`, `Slider.Control`. `Control` renders the track,
  > the fill, and one thumb for each value.
- [x] Q2: Range slider: expose it?
  > "Yes (Recommended)".
- [x] Q3: Vertical orientation: expose it?
  > "Both". Vertical length: "Fill the parent (Recommended)". No length prop.

## 2. Extension props

- [x] Q4: `size` prop and its steps.
  > First answer: "What" (the question was unclear). Second answer: "I meant to say what height does the
  > progress bar have?" Progress and Meter: `200 | 300 | 400`, default `300` (8, 12, 16px).
  > "Match Progress (Recommended)". `size` = track height. The thumb is two steps larger (16, 20, 24px).
- [x] Q5: Other extension props.
  > None proposed, none added.

## 3. Base UI surface

- [x] Q6: Root members.
  > "Confirm list (Recommended)". Expose `value`, `defaultValue`, `onValueChange`, `onValueCommitted`,
  > `min`, `max`, `step`, `largeStep`, `minStepsBetweenValues`, `orientation`, `disabled`, `name`, `form`,
  > `format`, `locale`, `thumbCollisionBehavior`, `render`, `ref`. Omit `className`, `style`. Fix
  > `thumbAlignment` to `edge`.
- [x] Q7: Thumb names.
  > "On Control (Recommended)". `Control` takes `getAriaLabel` and `getAriaValueText`. Other `Thumb`
  > members are omitted.
- [x] Q8: `Value` children format function.
  > "Keep (Recommended)".

## 4. Token mapping

Claude calls (token interview scope): the colors, radius, border, and focus ring in `spec.md`. The track
reads `surface/sunken/bg` as Meter does. The fill, thumb, and states read the Field tokens as Checkbox does.

## Open items

- The user reviews the token mapping in `spec.md` (the Claude calls).
- Contrast: the thumb border and the fill need 3:1 against the surface. The checker owns the pairs.

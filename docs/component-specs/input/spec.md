Status:
- spec: reviewed
- code: built
- figma: built
- docs: built

# Internal Spec: TextInput

- Date: 2026-10-15
- Interview: `interview-guide-2026-10-15.md`
- Base UI version documented from: `@base-ui/react` 1.8.0 (`@base-ui/react/input`)
- Folder name: `input/` (the component was renamed from `Input` to `TextInput` in the interview).

## Description

TextInput is a single-line field for free text. It always renders `type="text"`. It renders a frame, one `<input>`, and an optional `start` and `end` slot. The frame draws the look. The slots hold an icon, a unit, or a button. Typed fields (`EmailInput`, `PhoneInput`, `PasswordInput`, `SearchInput`, `UrlInput`) are separate components that wrap TextInput. Each one gets its own interview.

## Usage

- Do use TextInput for free text that has no special format, such as a name, a title, or a comment.
- Do wrap it in a `Field` when the field has a visible label. Use a bare TextInput only with an `aria-label`.
- Do use `start` and `end` for an icon, a unit, or a button inside the frame.
- Don't use it for an email, a phone number, a password, a URL, or a search. Use the typed component.
- Don't use it for a number. Use NumberField.
- Don't use it for a date or a time.

## Base UI API

Wrapped component: `Input` as `TextInput`. The frame and the slots are handy-ds markup around it.

| Base UI member | Decision |
| --- | --- |
| `value`, `defaultValue`, `onValueChange` | Exposed on the `<input>`. |
| Native `<input>` attributes (`name`, `placeholder`, `disabled`, `required`, `readOnly`, `inputMode`, `autoComplete`, `maxLength`, `id`, `aria-*`, ...) | Exposed on the `<input>`. |
| `type` | Omitted. TextInput is always `type="text"`. Typed fields are separate components. |
| `size` (HTML attribute) | Omitted. The `size` axis owns the name. |
| `ref` | Exposed on the `<input>`, so callers can call `focus()`. |
| `render` | Exposed on the `<input>`. |
| `className` | Exposed on the frame. The frame holds the look. |
| `style` | Omitted (wrapped part). |
| `data-disabled`, `data-valid`, `data-invalid`, `data-touched`, `data-dirty`, `data-filled`, `data-focused` | Kept on the `<input>`. The frame reads them with `:has()` and `:focus-within`. |

The prop types are written out with `Omit<ComponentProps<typeof BaseInput>, 'type' | 'size' | 'style' | 'className'>`, plus the frame `className`.

## Extension API

| Part | Prop | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `TextInput` | `size` | `TextInputSize = '800' \| '1000' \| '1200'` | `'1000'` | Control height, a `measure/size` step (32, 40, 48px at density 1). Also sets padding. Set as `data-size`. Not responsive. Replaces `sm`, `md`, and `lg`. |
| `TextInput` | `start` | `ReactNode` | none | Content before the text, inside the frame. Slot prop. |
| `TextInput` | `end` | `ReactNode` | none | Content after the text, inside the frame. Slot prop. |

`start` and `end` follow the slot-prop rule in `docs/api-conventions.md` section 1 (decision log: "Slot props allowed"). This is the first use of that rule.

No `width` prop. The field fills its `Field` container.

## Structure

```
<div class="hds-control hds-text-input" data-size>   frame (className goes here)
  <span class="hds-text-input__start">{start}</span>   only when start is set
  <input class="hds-control__input" type="text" />
  <span class="hds-text-input__end">{end}</span>       only when end is set
</div>
```

A press on the frame, or on a non-interactive slot, moves focus to the `<input>`. A press on a button inside a slot works as normal. The slot marks its content with `aria-hidden` only when the caller passes an `Icon` without a `label`; the caller owns the accessible name of anything else.

## Token mapping

The frame reuses the shared look in `src/components/control.css`.

| Part | Property | Token |
| --- | --- | --- |
| Frame | `min-block-size` | `hds/sem/measure/size/{size}` |
| Frame | `padding-inline` | `hds/sem/measure/space/{step}`: `800` = `200`, `1000` = `300`, `1200` = `400` |
| Frame | `padding-block` (also `gap`) | `hds/sem/measure/space/{step}`: `800` = `100`, `1000` = `200`, `1200` = `300` |
| Frame | `border` width | `hds/sem/border/control` |
| Frame | `border-radius` | `hds/sem/radius/control` |
| Frame, default | `background`, `color`, `border-color` | `hds/sem/color/field/default/{bg,fg,border}` |
| Frame, hover | `background`, `color`, `border-color` | `hds/sem/color/field/hover/{bg,fg,border}` |
| Frame, focus | `border-color` and outline | `hds/sem/color/field/focus/border`, `hds/sem/color/focus/ring`, `hds/sem/border/focus` |
| Frame, invalid | `background`, `color`, `border-color` | `hds/sem/color/field/error/{bg,fg,border}` |
| Frame, disabled | `background`, `color`, `border-color` | `hds/sem/color/field/disabled/{bg,fg,border}` |
| `<input>` | placeholder `color` | `hds/sem/color/field/default/placeholder` |
| `<input>` | font | `hds/sem/typography/body/*` |
| `start`, `end` | `color` | `hds/sem/color/content/muted/fg`; disabled: `hds/sem/color/field/disabled/fg` |

Notes:

- Claude calls (token interview scope): all the colors, radius, border, and focus ring above. They match the shared look that `Field.Control` has today.
- `size` replaces `sm | md | lg` in `control.css`. The mapping from step to padding keeps the values of the old `sm`, `md`, and `lg`.
- The frame reads state with `:hover`, `:focus-within`, `:has([data-invalid])`, and `:has(:disabled)`.
- Contrast: the Field pairs are checked by `src/tokens/contrast.ts`. `content/muted/fg` on `field/default/bg` is not in the checker today. Add the pair when the code is built.
- Context-passive: all colors re-resolve from ancestor `data-context` and `data-section` overrides.
- Open gap: the Field error text color (token spec section 9, item 4) is not decided here. It affects `Field.Error`, not TextInput.

## Code consequences (for `hds-component-code`)

- Create `TextInput.tsx`. Export `TextInput` and `TextInputSize`. Remove `Input` and `InputProps` from `Field.tsx`. No backwards compatibility is kept.
- Change `control.css` from `data-size='sm' | 'md' | 'lg'` to `'800' | '1000' | '1200'`. This changes `Field.Control`, `NumberField.Group`, the Select trigger, and Combobox. Update their `data-size` values in the same change.
- Update every use of `Input`: `docs/api/field.md`, `docs/components/field.mdx`, `docs-site/src/Showcase.tsx`, `docs/components.md`, `docs/rules.md`, `examples/*`, and any e2e or render test.
- Add `docs/components/text-input.mdx` and an e2e page check.

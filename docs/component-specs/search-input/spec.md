Status:
- spec: reviewed
- code: built
- figma: built
- docs: built

# Internal Spec: SearchInput

- Date: 2026-10-19
- Interview: `interview-guide-2026-10-19.md`
- Base UI version documented from: `@base-ui/react` 1.8.0 (`@base-ui/react/input`)

## Description

SearchInput is a single-line field for a search query. It renders the shared `Input` base (frame, input, slots) with `type="search"`, a search icon in the `start` slot, and a clear button in the `end` slot. The clear button shows only when the field has text. `Escape` clears the text. Submit and loading are not part of the component.

## Usage

- Do use SearchInput when the user types a query to find or filter items.
- Do put it in a `<form role="search">` so `Enter` submits. With no form, read `Enter` with `onKeyDown`.
- Do give it an `aria-label` when there is no visible label.
- Don't use it for free text that is not a query. Use TextInput.
- Don't show a loading state inside it. Show a spinner outside the field.

## Base UI API

Built on the internal `Input` base (`src/components/Input.tsx`), which wraps `Input` from `@base-ui/react/input`. The base is not exported from `index.ts`.

| Member | Decision |
| --- | --- |
| `value`, `defaultValue`, `onValueChange` | Exposed on the `<input>`. `onValueChange` also runs when the clear button or `Escape` clears the text. |
| `onKeyDown` | Exposed. It runs before the `Escape` rule. A caller can stop the clear with `preventDefault()`. |
| Native `<input>` attributes (`name`, `placeholder`, `disabled`, `required`, `readOnly`, `maxLength`, `id`, `aria-*`, ...) | Exposed on the `<input>`. |
| `inputMode`, `enterKeyHint`, `autoComplete`, `autoCapitalize`, `spellCheck` | Exposed as native attributes with defaults: `search`, `search`, `off`, `off`, `false`. |
| `ref` | Exposed on the `<input>`. |
| `render` | Exposed on the `<input>`. |
| `className` | Exposed on the frame. |
| `type`, `start`, `end` | Omitted. `type` is `search`. The icon owns `start`. The clear button owns `end`. |
| `size` (HTML attribute), `style` | Omitted. |

## Extension API

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `SearchInputSize = '800' \| '1000' \| '1200'` | `'1000'` | Control height, a `measure/size` step (32, 40, 48px at density 1). Same axis as TextInput. |

No new props. The clear button takes no props from the caller.

## Behavior

- **Clear button.** It shows only when the field has text and is not `disabled` or `readOnly`. When empty, the `end` slot is empty and the field does not shift. A press sets the value to empty, calls `onValueChange('')`, and moves focus to the input. It works for a controlled and an uncontrolled value.
- **How the clear works.** The component sets the input value through the native setter and dispatches an `input` event. The same change handlers run as for typing, so a controlled field and an uncontrolled field behave the same.
- **`Escape`.** With text, it clears the field, calls `onValueChange('')`, keeps focus in the input, and stops the event. The first press clears. The second press can close a parent dialog. When empty, `Escape` passes up unchanged.
- **Label and icons.** The button label is the fixed English string `Clear search`. The icons are `search` (start) and `close` (clear). They need the Material Symbols font.
- **Browser clear button.** The CSS hides `::-webkit-search-cancel-button` and `::-webkit-search-decoration`, so only one clear button shows.
- **Focus.** A pointer press on the clear button does not move focus away from the input before the click. The button is in the tab order.

## Token mapping

SearchInput reuses the TextInput mapping (`docs/component-specs/input/spec.md`) and adds the clear button, as PasswordInput adds its toggle.

| Part | Property | Token |
| --- | --- | --- |
| Frame, input | as TextInput | see the TextInput spec |
| Search icon (`start`) | `color` | `hds/sem/color/content/muted/fg`; disabled: `hds/sem/color/field/disabled/fg` |
| Clear button | `color` | inherits the `end` slot color: `hds/sem/color/content/muted/fg` |
| Clear button, hover | `background`, `color` | `hds/sem/color/action/tertiary/hover/{bg,fg}` (from `.hds-control__button` in `control.css`) |
| Clear button | `border-radius` | `hds/sem/radius/control` (private `--_radius`) |
| Clear button | box size | `1.5em` of the field font size |
| Focus ring | outline | `hds/sem/color/focus/ring`, `hds/sem/border/focus` on the frame |

Notes:

- Claude calls (token interview scope): the colors and shapes above, the same as PasswordInput.
- Contrast: the muted icon color on `field/default/bg` is not in the checker yet (same gap as TextInput and PasswordInput).
- Context-passive: all colors re-resolve from ancestor `data-context` and `data-section` overrides.

## Code consequences (for `hds-component-code`)

Built on 2026-10-19:

- `src/components/SearchInput.tsx` and `SearchInput.css`. Exported from `src/index.ts` with `SearchInputProps` and `SearchInputSize`.
- Add `docs/components/search-input.mdx` and `e2e/search-input.spec.ts` (the clear button and `Escape` are behavior Base UI does not provide).

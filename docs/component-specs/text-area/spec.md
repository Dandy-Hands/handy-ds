Status:
- spec: reviewed
- code: built
- figma: built
- docs: built

# Internal Spec: TextArea

- Date: 2026-10-19
- Interview: `interview-guide-2026-10-19.md`
- Base UI version documented from: `@base-ui/react` 1.8.0 (`@base-ui/react/input`, which renders `Field.Control`)

## Description

TextArea is a multi-line field for free text. It renders the shared `Input` base (frame and input) with `render={<textarea />}`, so it looks and behaves like the other inputs. The text starts at the top of the frame. The user drags the bottom edge to resize the height, or `autoGrow` fits the height to the text. A character count is not part of the component.

## Usage

- Do use TextArea when the user writes more than one line, such as a message, a note, or a description.
- Do wrap it in a `Field` when it has a visible label. Use a bare TextArea only with an `aria-label`.
- Do set `autoGrow` with `maxRows` for a field that should grow with the text and then scroll.
- Don't use it for one line of text. Use TextInput.
- Don't show a character count with a prop. Read the value with `onValueChange` and show the result in `Field.Description`.

## Base UI API

Built on the internal `Input` base (`src/components/Input.tsx`), which wraps `Input` from `@base-ui/react/input`. The base renders a `<textarea>` through its `render` prop.

| Member | Decision |
| --- | --- |
| `value`, `defaultValue`, `onValueChange` | Exposed on the `<textarea>`. |
| Native `<textarea>` attributes (`name`, `placeholder`, `disabled`, `required`, `readOnly`, `maxLength`, `minLength`, `id`, `aria-*`, ...) | Exposed on the `<textarea>`. |
| `rows`, `wrap` | Exposed. `rows` has the default `3`. |
| `ref` | Exposed on the `<textarea>`. |
| `className` | Exposed on the frame. |
| `render` | Omitted. The component owns the element. |
| `type`, `start`, `end` | Omitted. A textarea has no type. Slots are out of v1. |
| `cols`, `size` (HTML attribute), `style` | Omitted. The field fills its container. |

## Extension API

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `TextAreaSize = '800' \| '1000' \| '1200'` | `'1000'` | A `measure/size` step (32, 40, 48px at density 1). Sets padding, type size, and the height of one row. Same axis as TextInput. |
| `autoGrow` | `boolean` | `false` | The height starts at `rows` and follows the text. The drag handle is off. |
| `maxRows` | `number` | none | With `autoGrow`, the most rows before the field scrolls. A count, as `Text` `maxLines` is. |

A boolean is allowed because `autoGrow` is a real two-state flag (API conventions section 3). `rows` is a native attribute and passes through.

## Behavior

- Without `autoGrow`, the height is `rows` lines. The user drags the bottom edge to change it (`resize: vertical`). A disabled field does not resize.
- With `autoGrow`, the component sets the height to `scrollHeight` after every render and every input, and when the width changes (the text rewraps). The height never falls below `rows`.
- With `maxRows`, the height stops at `maxRows` lines (`line-height` times `maxRows`). The field then scrolls inside. Without `maxRows`, there is no limit.
- `field-sizing: content` is not used, because support is not complete in every browser.
- A press on the frame focuses the textarea (the `Input` base does this).
- Inside a `Field.Root`, Base UI validates on blur and shows `Field.Error` for `valueMissing`, `tooShort`, and the other native checks.

## Token mapping

TextArea reuses the TextInput mapping (`docs/component-specs/input/spec.md`).

| Part | Property | Token |
| --- | --- | --- |
| Frame | `min-block-size` | `hds/sem/measure/size/{size}` (one row) |
| Frame, input | all other properties | as TextInput |
| `<textarea>` | `line-height` | inherits the frame, `hds/sem/typography/label/leading` |

No new tokens. `TextArea.css` only aligns the content to the top and sets `resize`.

## Code consequences (for `hds-component-code`)

Built on 2026-10-19:

- `src/components/Input.tsx`: `type` is optional.
- `src/components/TextArea.tsx` and `TextArea.css`. Exported from `src/index.ts` with `TextAreaProps` and `TextAreaSize`.
- Add `docs/components/text-area.mdx` and `e2e/text-area.spec.ts` (auto grow is behavior Base UI does not provide).

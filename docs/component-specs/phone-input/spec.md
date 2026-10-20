Status:
- spec: reviewed
- code: built
- figma: built
- docs: built

# Internal Spec: PhoneInput

- Date: 2026-10-19
- Interview: `interview-guide-2026-10-19.md`
- Base UI version documented from: `@base-ui/react` 1.8.0 (`@base-ui/react/input`)

## Description

PhoneInput is a single-line field for one phone number. It renders the shared `Input` base (frame, input, slots) with `type="tel"` and a phone icon in the `start` slot. It masks the text the user sees, for example `(202) 555-0123`. The value the caller reads is digits only, for example `2025550123`. The `country` prop sets the mask. v1 ships `US`.

## Usage

- Do use PhoneInput when the user enters one phone number.
- Do wrap it in a `Field` when it has a visible label. Use a bare PhoneInput only with an `aria-label`.
- Do build an international form (`+1202...`) in your own code from the country code and the digits.
- Do show a failed check with `<Field.Error match="patternMismatch">` inside a `Field`.
- Don't use it for a phone number from a country the component does not ship. Use TextInput until the country is added.
- Don't use it for a value that is not a phone number. Use TextInput.

## Base UI API

Built on the internal `Input` base (`src/components/Input.tsx`), which wraps `Input` from `@base-ui/react/input`.

| Member | Decision |
| --- | --- |
| `value`, `defaultValue` | Exposed. They hold digits. The component masks them for display. |
| `onValueChange` | Exposed. The first argument is the digits, not the shown text. It runs only when the digits change. |
| Native `<input>` attributes (`disabled`, `required`, `readOnly`, `id`, `aria-*`, ...) | Exposed on the `<input>`. |
| `inputMode`, `autoComplete`, `spellCheck`, `pattern`, `placeholder` | Exposed as native attributes with defaults: `tel`, `tel-national`, `false`, the country pattern, the country format (`(555) 555-5555` for `US`). |
| `name` | Exposed on a hidden input that holds the digits. The visible input has no `name`, because a native form posts the shown text. |
| `ref`, `render` | Exposed on the visible `<input>`. |
| `className` | Exposed on the frame. |
| `type` | Omitted. Always `type="tel"`. |
| `start` | Omitted. The phone icon owns the `start` slot. |
| `multiple`, `size` (HTML attribute), `style` | Omitted. |

## Extension API

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `country` | `PhoneInputCountry = 'US'` | `'US'` | Sets the mask, the digit count, the default `pattern`, and the default `placeholder`. One small hand-written mask per country, no library. |
| `size` | `PhoneInputSize = '800' \| '1000' \| '1200'` | `'1000'` | Control height, a `measure/size` step (32, 40, 48px at density 1). Same axis as TextInput. |
| `end` | `ReactNode` | none | Content after the text, inside the frame. Slot prop. |

A country picker and more countries wait for a client need (API conventions section 1).

## Behavior

- The mask strips every non-digit and stops at the digit count of the country (10 for `US`). A paste of 11 digits that starts with `1` drops the `1`.
- The mask adds no trailing punctuation. Digits `202` show `(202`. The `) ` appears with the next digit. Backspace never stops on a symbol.
- After formatting, the caret returns to the same digit. An edit in the middle does not move the caret to the end.
- Validation is a `pattern` on the shown text. An incomplete number reports `validity.patternMismatch`. An empty field is valid; `required` reports `valueMissing`. A caller overrides `pattern`.
- Inside a `Field.Root`, Base UI validates on blur. Outside a `Field`, the browser validates on form submit.
- With `name`, a hidden input posts the digits. A disabled field posts nothing. A form error that a server keys by `name` does not reach the visible input in v1.
- The placeholder defaults to the format of the country, so it shows the mask. It uses fake digits (`555`). The label still names the field. A caller overrides it with `placeholder`.
- The phone icon is decorative. It needs the Material Symbols font.

## Token mapping

PhoneInput reuses the TextInput mapping (`docs/component-specs/input/spec.md`). The phone icon uses the `start` slot color `hds/sem/color/content/muted/fg`; disabled: `hds/sem/color/field/disabled/fg`. No new tokens and no new CSS.

## Code consequences (for `hds-component-code`)

Built on 2026-10-19:

- `src/components/PhoneInput.tsx`. No CSS file. Exported from `src/index.ts` with `PhoneInputProps`, `PhoneInputSize`, and `PhoneInputCountry`.
- Add `docs/components/phone-input.mdx` and `e2e/phone-input.spec.ts` (the mask is behavior Base UI does not provide).

Status:
- spec: reviewed
- code: built
- figma: built
- docs: built

# Internal Spec: EmailInput

- Date: 2026-10-19
- Interview: `interview-guide-2026-10-19.md`
- Base UI version documented from: `@base-ui/react` 1.8.0 (`@base-ui/react/input`)

## Description

EmailInput is a single-line field for one email address. It renders the shared `Input` base (frame, input, slots) with `type="email"` and a mail icon in the `start` slot. It sets mobile and autofill defaults. It checks that the domain has a dot. A typo hint is not part of the component: the caller reads the value with `onValueChange`.

## Usage

- Do use EmailInput when the user enters one email address.
- Do wrap it in a `Field` when it has a visible label. Use a bare EmailInput only with an `aria-label`.
- Do show a failed check with `<Field.Error match>` inside a `Field`.
- Do pass `pattern` to allow an address without a dot, such as `user@intranet`.
- Don't use it for a list of addresses.
- Don't use it for a value that is not an email. Use TextInput.

## Base UI API

Built on the internal `Input` base (`src/components/Input.tsx`), which wraps `Input` from `@base-ui/react/input`.

| Member | Decision |
| --- | --- |
| `value`, `defaultValue`, `onValueChange` | Exposed on the `<input>`. The browser trims leading and trailing spaces from the value. |
| Native `<input>` attributes (`name`, `placeholder`, `disabled`, `required`, `readOnly`, `maxLength`, `id`, `aria-*`, ...) | Exposed on the `<input>`. |
| `inputMode`, `autoComplete`, `autoCapitalize`, `spellCheck`, `pattern` | Exposed as native attributes with defaults: `email`, `email`, `off`, `false`, `[^@\s]+@[^@\s]+\.[^@\s]+`. |
| `ref`, `render` | Exposed on the `<input>`. |
| `className` | Exposed on the frame. |
| `type` | Omitted. Always `type="email"`. |
| `start` | Omitted. The mail icon owns the `start` slot. |
| `multiple` | Omitted. One address only. |
| `size` (HTML attribute), `style` | Omitted. |

## Extension API

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `EmailInputSize = '800' \| '1000' \| '1200'` | `'1000'` | Control height, a `measure/size` step (32, 40, 48px at density 1). Same axis as TextInput. |
| `end` | `ReactNode` | none | Content after the text, inside the frame. Slot prop. |

No new props.

## Behavior

- Validation is native. `type="email"` reports `validity.typeMismatch`. The default `pattern` reports `validity.patternMismatch` when the domain has no dot, so `a@b` fails.
- Inside a `Field.Root`, Base UI validates on blur. The docs show `<Field.Error match>`. Outside a `Field`, the browser validates on form submit.
- A caller overrides `pattern` for an intranet address.
- The mail icon is decorative (`Icon` without a `label` is `aria-hidden`). The icon needs the Material Symbols font.
- A typo hint (for example `gmial.com`) is out of v1. The caller reads the value and shows the hint in `Field.Description`.

## Token mapping

EmailInput reuses the TextInput mapping (`docs/component-specs/input/spec.md`). The mail icon uses the `start` slot color `hds/sem/color/content/muted/fg`; disabled: `hds/sem/color/field/disabled/fg`. No new tokens and no new CSS.

## Code consequences (for `hds-component-code`)

Built on 2026-10-19:

- `src/components/EmailInput.tsx`. No CSS file. Exported from `src/index.ts` with `EmailInputProps` and `EmailInputSize`.
- Add `docs/components/email-input.mdx`. No e2e file: the component adds no behavior beyond native attributes. `e2e/pages.spec.ts` covers the page.

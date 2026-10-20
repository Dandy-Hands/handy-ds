Status:
- spec: reviewed
- code: built
- figma: built
- docs: built

# Internal Spec: UrlInput

- Date: 2026-10-19
- Interview: `interview-guide-2026-10-19.md` (no interview; Claude's calls)
- Base UI version documented from: `@base-ui/react` 1.8.0 (`@base-ui/react/input`)

## Description

UrlInput is a single-line field for one web address. It renders the shared `Input` base (frame, input, slots) with `type="url"` and a link icon in the `start` slot. On blur, it adds `https://` when the text has no scheme. It accepts `http` and `https` only.

## Usage

- Do use UrlInput when the user enters one web address.
- Do wrap it in a `Field` when it has a visible label. Use a bare UrlInput only with an `aria-label`.
- Do show a failed check with `<Field.Error match="patternMismatch">` inside a `Field`.
- Do pass `pattern` to allow another scheme, such as `ftp`.
- Don't use it for a list of addresses.
- Don't use it for a value that is not a web address. Use TextInput.

## Base UI API

Built on the internal `Input` base (`src/components/Input.tsx`), which wraps `Input` from `@base-ui/react/input`.

| Member | Decision |
| --- | --- |
| `value`, `defaultValue`, `onValueChange` | Exposed on the `<input>`. The browser trims spaces at both ends. After a blur that adds a scheme, `onValueChange` receives the new value. |
| Native `<input>` attributes (`name`, `placeholder`, `disabled`, `required`, `readOnly`, `maxLength`, `id`, `aria-*`, ...) | Exposed on the `<input>`. |
| `inputMode`, `autoComplete`, `autoCapitalize`, `spellCheck`, `pattern` | Exposed as native attributes with defaults: `url`, `url`, `off`, `false`, `https?://\S+`. |
| `onBlur` | Exposed. It runs before the component adds a scheme. |
| `ref`, `render` | Exposed on the `<input>`. |
| `className` | Exposed on the frame. |
| `type` | Omitted. Always `type="url"`. |
| `start` | Omitted. The link icon owns the `start` slot. |
| `multiple`, `size` (HTML attribute), `style` | Omitted. |

## Extension API

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `UrlInputSize = '800' \| '1000' \| '1200'` | `'1000'` | Control height, a `measure/size` step (32, 40, 48px at density 1). Same axis as TextInput. |
| `end` | `ReactNode` | none | Content after the text, inside the frame. Slot prop. |

No new props.

## Behavior

- On blur, if the text is not empty, has no scheme (`^[a-z][a-z\d+.-]*:`), and the field is not read-only, the component sets the value to `https://` plus the text. It uses a native `input` event, so `onValueChange` runs for a controlled and an uncontrolled field.
- The default `pattern` accepts `http` and `https` only, so `javascript:` and `data:` fail with `validity.patternMismatch`. Native `type="url"` reports `validity.typeMismatch` for text that is not a URL.
- There is no dot rule: `https://intranet` is valid.
- `localhost:3000` looks like it has a scheme, so the component leaves it as typed.
- Inside a `Field.Root`, Base UI validates on blur. Outside a `Field`, the browser validates on form submit.
- The link icon is decorative. It needs the Material Symbols font.

## Token mapping

UrlInput reuses the TextInput mapping (`docs/component-specs/input/spec.md`). The link icon uses the `start` slot color `hds/sem/color/content/muted/fg`; disabled: `hds/sem/color/field/disabled/fg`. No new tokens and no new CSS.

## Code consequences (for `hds-component-code`)

Built on 2026-10-19:

- `src/components/UrlInput.tsx`. No CSS file. Exported from `src/index.ts` with `UrlInputProps` and `UrlInputSize`.
- `docs/components/url-input.mdx` and `e2e/url-input.spec.ts` (the scheme on blur is behavior Base UI does not provide).
- `docs/api/url-input.md` and the `docs/api/index.md` row, built after the review. Figma page `UrlInput` (set `142:3`, 30 variants).

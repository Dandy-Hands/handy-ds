Status:
- spec: reviewed
- code: built
- figma: built
- docs: built

# Internal Spec: Separator

- Date: 2026-10-12
- Interview: `interview-guide-2026-10-12.md`
- Base UI version documented from: `@base-ui/react` 1.8.0 (`@base-ui/react/separator`)

## Description

Separator is a line that marks a boundary between two groups of content. It wraps Base UI's separator and reads the Graphic category: one width, two tones. Screen readers announce it as a separator, like an HTML `<hr>`.

## Usage

- Do use Separator where spacing alone does not show that one group stops and the next starts.
- Don't use it for decoration. Use spacing, or a border on the container.
- Do use `tone="strong"` only where a boundary needs more contrast than the default line.

## Base UI API

Wrapped component: `Separator` from `@base-ui/react/separator`.

| Base UI member | Decision |
| --- | --- |
| `orientation` | Exposed. `'horizontal' \| 'vertical'`, default `'horizontal'`. Base UI sets `aria-orientation` and `data-orientation`. |
| `role="separator"` (set by Base UI) | Kept, always. No prop changes it. |
| `render` | Omitted. |
| `className` | Omitted. Recorded break of the escape hatch in API conventions section 1: Separator stays minimal, and spacing comes from the parent layout. |
| `style` | Omitted. |
| `ref` | Omitted. |
| Native `div` props (`id`, `aria-*`, `data-*`, `hidden`, events, `children`, ...) | Omitted. |

Props type: `{ orientation?, tone? }` only, not an extension of the Base UI props.

## Extension API

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `tone` | `SeparatorTone = 'default' \| 'strong'` | `'default'` | Line color. `default`: the standard divider. `strong`: more contrast, for a boundary that must stand out. Set as `data-tone`. |

Removed from the dry run: `weight` (`thin` / `medium` / `thick`) and the `Weight` type. Its `medium` and `thick` steps read space tokens as line widths.

## Token mapping

| Part | Property | Token |
| --- | --- | --- |
| Line | color (`background`) | `hds/sem/color/graphic/divider/{tone}` |
| Line | width: `block-size` when horizontal, `inline-size` when vertical | `hds/sem/border/divider` |

Notes:

- Structural values only otherwise: `margin: 0`, `border: 0`, `flex-shrink: 0`, `align-self: stretch` when vertical.
- The Separator parts of Menu, ContextMenu, Select, Combobox, Autocomplete, and Toolbar share the `hds-separator` CSS. They render at tone `default`.
- Context-passive: the divider color re-resolves from ancestor `data-context` and `data-section` overrides.

# Internal Spec: Toolbar

- Status: docs-built
- Date: 2026-09-23
- Interview: `interview-guide-2026-09-23.md`
- Base UI version documented from: `@base-ui/react` 1.8.0
- Code status: component exists (`src/components/Toolbar.tsx`)

## Description

Toolbar is a bar of controls for a region — buttons, links, a small input, and separators — with arrow-key navigation between them. Each part borrows its own category's look: buttons and links are Action tertiary, the input is Input/Field at size `sm`, the separator is a Divider. Use it for an editor bar or a control strip over the content it acts on; use NavigationMenu when the bar is site navigation.

## Usage

- Do use Toolbar for a control strip that acts on a region: an editor bar, a table's bulk-action strip.
- Do group related controls with `Toolbar.Group`.
- Don't use it for site navigation — use NavigationMenu.
- Don't style the bar itself — it has no color tokens; the parts carry their categories' looks.

## Base UI API

Compound namespace that spreads every Base UI Toolbar part unchanged and restyles only the DOM-rendering parts via `part()` (`Toolbar.tsx:9-16`): `Root`, `Group`, `Button`, `Link`, `Input`, `Separator`. All other parts (ToolbarInput via `useToolbarInput`-style hooks, etc.) pass through, and Base UI's part docs apply one for one. handy-ds adds no props.

## Extension API

No handy-ds props. Documented per-part looks:

| Part | Decision |
| --- | --- |
| `Root`, `Group` | Shared toggle-group layout (flex row with gap) — `Toolbar.tsx:10-11`. |
| `Button`, `Link` | Action tertiary (`Toolbar.tsx:7,12-13`); size stays the Action default. |
| `Input` | Input/Field control pinned to `data-size="sm"` (`Toolbar.tsx:14`). |
| `Separator` | Divider look (`Toolbar.tsx:15`). |

Explicitly rejected: a `size` prop for the bar (the input's `sm` is the only pinned size), a `variant` prop, and a toolbar-specific color set — the bar composes existing category tokens per part (spec section 9).

## Token mapping

| Part | Tokens |
| --- | --- |
| Button / Link colors | `hds/sem/action/color/tertiary/*` (default/hover/active/focus/disabled) |
| Button / Link measure | `hds/sem/action/measure/md/*` (Action default) |
| Input | `hds/sem/input/color/*`, `hds/sem/input/measure/sm/*` |
| Separator | `hds/sem/divider/color/border`, `hds/sem/divider/measure/{weight}/thickness` |
| Bar gap / layout | shared toggle-group layout gap from `hds/sem/action/measure/*` |

Notes:

- The toolbar itself has no color tokens — only its parts do.
- Focus ring comes from the shared Focus tokens via `base.css`; arrow-key navigation moves focus between parts.

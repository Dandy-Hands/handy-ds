# Theming Rework — Mapping Operations Proposal

**Status: draft / proposal. Not accepted; nothing implemented.** Grew out of the theming-rework discussion (2026). Companion research notes in `.pi/research/` (`current-token-structures.md`, `token-trees.md`).

## Problem

Theming today has one degree of freedom. Clients set drivers (brand colors, density, radius); a hardcoded function (`src/tokens/themeMap.ts`) turns them into the full token map by a fixed recipe. Consequences:

1. **Color assignment is one-dimensional.** The map picks fixed stops by hue family (`action/primary/bg → primary/600`). A client cannot shift the stop (600 → 500) or flip a foreground to black/white without editing library code.
2. **The other extreme is too much work.** Hand-authoring the map directly means thousands of state × property entries per theme. Nobody will do that, and hand-written state tables will drift (missing `focus` states, stale refs).

## Proposal

Insert an authored layer between drivers and the map: **mapping operations**. A small, closed vocabulary of parameterized transforms over the base catalog. The author writes dozens of operations; a tool expands them into the thousands of consistent ref→sym mappings.

### Why operations

The current hardcoded tables do not encode arbitrary values — they encode **relationships**:

- State ladders: `hover` bg is one stop darker than `default` bg.
- Pairing rules: `fg` is white against a 600 bg, primary-colored against a 50 bg.
- Ground transforms: `on-primary` inverts the polarity of whole families.

Hand-authoring thousands of tokens means re-authoring these relationships thousands of times. Operations make the relationship the authoring unit; expansion and consistency become the tool's job.

### Operation vocabulary (starting set)

| Operation | Effect | Example |
|---|---|---|
| **Retarget** | Point a slot family at a different ramp | Action primary → `accent` ramp instead of `primary` |
| **Stop shift** | Move a ladder up/down the ramp | Primary action base stop 600 → 500 |
| **Polarity flip** | Invert fg/bg relationship of a family | Filled primary button ↔ white-on-primary |
| **Ladder tuning** | Adjust state deltas (span, step size) | Flatter hover, stronger active |
| **Context op** | Ground-relative transform | What `on-primary` hardcodes today, made data |

The vocabulary is closed on purpose. If an operation is missing, the correct fix is a new operation type — not raw hand-authoring at scale.

### Escape hatch

Some relationships are genuinely irregular (e.g. `INPUT_ON_PRIMARY.disabled` uses `primary/500/400/300` — no generic polarity flip produces it). The format must allow a per-token raw override inside a delta, for the cases operations cannot express. Rare, not forbidden.

### Tool role: constraint propagation

The theming tool (docs flyout first, standalone later) applies operations interactively:

- Pick a bg for a family → tool computes which fg/border options survive `contrast.ts` and disables the rest.
- Shift stops → tool re-derives every paired value and flags broken pairs.
- Contrast validation moves from a build-time gate to a live authoring guide (matches the original color-application design: "disable the selection of inaccessible colors").

Tool output is plain map data — valid without the tool. The tool generates deltas; it is not a runtime dependency.

### Layer stack after the change

```
Drivers      → build ref palettes (unchanged)
Operations   → authored remapping of ref→sym (new, small, hand- or tool-written)
Expansion    → tool/compose step: operations + catalog → full map
Map          → same composed artifact as today; components unchanged
```

### What becomes of the Theme Map

- The **catalog** (sem names + slot structure) stays the frozen contract. Output names never change.
- The **map** stays one derived artifact per theme, but its inputs become: base catalog + driver config + authored operations/deltas.
- `d.style` (per-category radius/border picks) dissolves into operations; drivers narrow to palette generation only.
- `buildTheme(baseMap, deltas)` composes, validates, emits.

### Validation contract (replaces what TypeScript guaranteed)

When the map is authored data, three guarantees must be enforced explicitly:

1. **Completeness** — every catalog token is emitted (catalog manifest as source of truth).
2. **Ref existence** — every `{hds/prim/…}` reference resolves.
3. **Name validity** — `checkTokenName()` + manifest cross-check.

Plus contrast checking at author time (tool/CLI), not only build time.

### Prerequisites

- **Versioning/deprecation plan** (token spec §10 item 1) becomes mandatory before any client ships an authored map: a client delta referencing a removed sem token is a silent runtime blank.
- **Catalog manifest** must exist before the format, so the format can reference it.

## Open questions

1. Exact delta file format (structured per-family tables with a default state, expanded at compose time — recommended over flat lists).
2. Which operations are v1; whether context ops generalize beyond `on-primary`.
3. Whether sem grammar renames (e.g. `measure` → `space`/`radius`, from the length-scale discussion) happen before or after this layer ships. Cheapest before any deprecation plan is needed.

# Icon — Spec Re-Interview Guide (2026-10-10)

Full Phase 1 re-run after the token rework. Dry-run spec: `spec.md` (2026-09-23,
retroactive from the Sep 23/24 guides). No Base UI primitive — plain `span`
wrapper. This interview confirms the provisional token mapping and the two open
judgment calls flagged in `docs/component-conventions.md`.

Base UI version documented from: `@base-ui/react` 1.8.0.

## 1. Rendering surface

- [x] Q1: No Base UI icon primitive. Icon stays a plain `<span>` wrapper over `ComponentProps<'span'>` (not `useRender`), taking native props unchanged; the component manages `role`/`aria-*` itself from `label`.
  > Confirmed. User note: phrase questions in plain English.

## 2. Color axis

- [x] Q2/Q10: Color prop name, values, and token reads.
  > First answer: four colors — default `inherit`, primary, secondary, accent. Q10 ended with `/quit`.
  > 2026-10-11, after Claude noted that `docs/api-conventions.md` names a Content color axis `tone` with values that match token names: "Tone with all the content color tokens and all the Feedback color tokens. `Inherit` is the default."
  > Then: omit the `link` Content token (recommended option accepted).
  > Result: prop `tone`. Unset = inherit. Values: `strong`, `default`, `muted`, `accent` (read `color/content/{tone}/fg`) and `danger`, `warning`, `success`, `info` (read `color/feedback/{tone}/icon`).
  > The earlier names `primary` and `secondary` are dropped.

## 3. Size

- [x] Q4: `size` becomes the real size axis. Unset = `inherit` (follows the surrounding font size, structural `1em`). Set values are pre-mapped to `hds/sem/measure/size/*` tokens; no raw CSS length.
  > `inherit` by default; the set values are the measure step numbers.
  > NOTE (recorded reason, per conventions): Icon's `size` values are the measure/size step numbers (400, 500, 600, ...), not sm/md/lg. Allowed exception — the axis genuinely mirrors the primitive scale numbering, and the values satisfy the verbatim slot rule (a step name appears verbatim in its token). Exposed values: the `hds/sem/measure/size/*` set (400…3200).
- [x] Q11: Value names for `size`.
  > Numeric step names: `size="400"` reads `hds/sem/measure/size/400`, and so on. No sm/md/lg on Icon. (size/400 = 16px at density 1.)

## 4. Label and accessibility

- [x] Q5: `label?: string`; present → `role="img"` + `aria-label`, absent → `aria-hidden`.
  > Keep `label` (recommended option accepted). Recorded reason for the exception to the "no content shortcut props" rule: `label` is an accessible name, not visible content, and one prop sets `role="img"` and `aria-label` together so they cannot be half-set.

## 5. Extension props and glyph source

- [x] Q6: Add or drop extension props.
  > User: "Since we're using material symbols, a `fill` prop might be a good idea. Any other thoughts?" Claude proposed no other props. Weight, grade and optical size stay fixed (option "fill only" accepted).
- [x] Q12: Glyph source.
  > User: "Might be using the material symbols font package." Chosen: both. Children can be an SVG element or a glyph name string (Material Symbols ligature, e.g. `search`). `fill` applies to glyph names only.
- [x] Q13: Font axes as props.
  > `fill` only. Weight, grade and optical size are fixed in component CSS. Optical size follows `size`.

## 6. Contexts and usage rules

- [x] Q7: Unset tone follows surrounding text (`currentColor`); set tones re-resolve in brand contexts and modes. Keep the context note in the API doc?
  > Confirmed with Q8 ("Confirm all four").
- [x] Q8: Usage rules — leave `tone` unset inside Button/Alert; SVG must draw with `currentColor`; `<img>` for content images; set tone re-resolves in contexts.
  > User: "Might be using the material symbols font package. That would just answer." Treated as: usage rules stand, and the font option adds a glyph-name path (Q12).

## Open items

- Which Material Symbols style (Outlined, Rounded, Sharp) Icon sets, and who loads the font (the library or the client). The spec assumes Outlined and a client-loaded font. Flag to the user.

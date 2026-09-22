# Interview Guide: Button component

- Status: complete
- Started: 2026-09-21
- Component: Button (Base UI `@base-ui/react/button`, version 1.8.0)
- Note: Button code already exists in `src/components/Button.tsx` (repo reference implementation), plus `LinkButton` in the same file. This interview produces the internal spec (`docs/component-specs/button/spec.md`) and API doc (`docs/api/button.md`).

## 1. Process decision
Goal: agree how to handle the existing code.

- [x] Q1: Button code already exists as the reference implementation. How should we proceed?
  > Spec interview + code updates

## 2. Base UI surface
Goal: for each Base UI Button prop/behavior, decide expose / rename / wrap / omit. Native `<button>` props (`disabled`, `type`, `onClick`, `form*`, `aria-*`...) pass through `ComponentProps<'button'>`.

- [x] Q2: Pass through all native button props (`disabled`, `type`, `onClick`, etc.) unchanged?
  > Yes, full passthrough
- [x] Q3: `disabled` — Base UI sets `data-disabled` and our CSS styles it. Expose as-is?
  > Expose as-is
- [x] Q4: `render` — replace the element or compose with another component. Expose?
  > LinkButton should be it's own component apart from button. What does that mean for this?
- [x] Q5: `nativeButton` — whether a replaced element keeps native-button semantics. Expose or omit?
  > Omit (my recommendation)
- [x] Q6: Callback-form `className` / `style` (functions of component state). Expose or omit?
  > Omit (my recommendation)
- [x] Q7: Base UI renders `<button type="button">` by default. Keep that default?
  > Keep (my recommendation)

## 3. Extension props
Goal: confirm the wrapper's own props beyond Base UI.

- [x] Q8: `priority` — `'primary' | 'secondary' | 'tertiary'`, set as `data-priority`, maps to `hds/sem/action/*`. Keep as-is?
  > Keep as-is
- [x] Q9: `size` — `'sm' | 'md' | 'lg'`, set as `data-size`. Keep as-is?
  > Keep as-is
- [x] Q11: Any other extension props to add (e.g. `loading`, `icon`, `fullWidth`)? Default: none.
  > Add some

## 4. Token mapping
Goal: confirm Button consumes only `hds/sem/action/*` plus the focus-ring tokens from `base.css`, and flag any state the current CSS doesn't cover.

- [x] Q12: Confirm the token mapping; any uncovered states to flag?
  > Confirmed (my recommendation)

## 6. New extension props (opened by Q11)

- [x] Q14: Which extension props should Button add? (candidates: `loading`, `icon`, `fullWidth`, or others)
  > "`loading` and `fullWidth`. Icons will just be injected as children. What about aria-props? Are those built in?" — aria-* confirmed built in via passthrough (Q2). No `icon` prop.
- [x] Q15: When `loading` is true, Button sets `aria-busy="true"` and disables clicks. Keep both?
  > Both (my recommendation)

## 5. LinkButton separation
Goal: define what "LinkButton as its own component" means for Button's surface and packaging.

- [x] Q10: LinkButton — same file/export as part of the Button family, or split out?
  > "LinkButton should be it's own component apart from button."
- [x] Q13: With LinkButton as the link case, should Button itself still expose `render` (compose with other elements), or omit it? (opened by Q4/Q10)
  > Keep (my recommendation)

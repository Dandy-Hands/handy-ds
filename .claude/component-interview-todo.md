# Component Spec Interview — Full Re-Run

Full Phase 1 interview (`hds-component-spec-interview`) for every component, in
earnest. The earlier pass was a dry run to validate the process; every spec gets
a fresh interview, guide, internal spec, and API doc. Ordered most atomic →
least: build foundations before composites.

Per component:
1. Write interview guide → `docs/component-specs/<component>/interview-guide-<date>.md`
2. Interview user per Base UI prop + extension props + token mapping
3. Write internal spec → `docs/component-specs/<component>/spec.md` (Status: reviewed)
4. Write API doc → `docs/api/<component>.md`
5. Update `docs/api/index.md`

Tags: `[re]` dry-run spec exists, re-interview · `[new]` Base UI component not
yet in the library · `[lib]` library-only, no Base UI primitive · `[plan]`
planned, no Base UI primitive.

## Tier 1 — Display primitives (no interaction)

- [ ] icon `[lib]`
- [ ] text `[lib]`
- [ ] separator `[re]`
- [ ] meter `[re]`
- [ ] progress `[new]`
- [ ] avatar `[new]`

## Tier 2 — Single interactive controls

- [ ] button `[re]`
- [ ] link-button `[lib]`
- [ ] toggle `[re]`
- [ ] checkbox `[re]`
- [ ] radio `[re]`
- [ ] switch `[re]`
- [ ] slider `[new]`
- [ ] input `[new]`
- [ ] number-field `[re]`
- [ ] otp-field `[new]`

## Tier 3 — Form containers

- [ ] field `[re]`
- [ ] fieldset `[new]`
- [ ] form `[new]`

## Tier 4 — Overlays & floating

- [ ] popover `[re]`
- [ ] tooltip `[new]`
- [ ] preview-card `[new]`
- [ ] dialog `[re]`
- [ ] alert-dialog `[new]`
- [ ] drawer `[new]`
- [ ] toast `[re]`

## Tier 5 — Collections & navigation

- [ ] collapsible `[new]`
- [ ] accordion `[re]`
- [ ] card `[lib]`
- [ ] tabs `[re]`
- [ ] scroll-area `[new]`
- [ ] table `[lib]`
- [ ] navigation-menu `[re]`
- [ ] toolbar `[re]`
- [ ] menu `[re]`
- [ ] context-menu `[new]`
- [ ] menubar `[new]`

## Tier 6 — Advanced composites

- [ ] select `[re]`
- [ ] combobox `[re]`
- [ ] autocomplete `[new]`
- [ ] toggle-group `[new]`
- [ ] checkbox-group `[new]`
- [ ] radio-group `[new]`
- [ ] carousel `[plan]`

## Not in scope

Not components — excluded from the interview process: csp-provider,
direction-provider, floating-ui-react, merge-props, use-render,
unstable-use-media-query, utils, internals.

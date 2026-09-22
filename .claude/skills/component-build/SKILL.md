---
name: component-build
description: Write the React code for a handy-ds component from its reviewed spec in .claude/specs/components/ — component, CSS, tests, demo entry, export and docs row. Use when the user asks to build, implement, or code a component that already has a spec. Needs a spec at `Status: reviewed` — the component-spec skill writes one. Does not touch Figma; the component-figma skill does that.
---

# Component build

The spec is the source of truth. This skill turns a reviewed spec into React code.

This skill and `component-figma` are independent. The code does not read spec section 5, so run them in either order.

**Precondition.** Read `.claude/specs/components/{kebab-name}.md` and check its `Status` line.

- No file, or `Status: draft`: stop. Tell the user the spec is not reviewed, and name the `component-spec` skill.
- `Status: reviewed`: continue.
- `Status: built`: the component exists. Ask the user what to change before you edit anything.

Get props, values, and defaults from spec section 3 only. Do not invent a prop. If the spec is missing something you need, stop and ask.

The rules live in two docs:

- `docs/component-conventions.md`. It says how components are built (CSS, axes, states, TypeScript, allowed tokens). Citations look like (conventions, Heading).
- `docs/rules.md`. It tells client app builders what each component does. Citations look like (rules, Heading).
- `docs/components.md`. The per-component reference that ships to client apps. Step 9 writes this component's entry.

## Steps

1. Build the wrapper (conventions, TypeScript). The form depends on the `Base UI` line in the spec:
   - **Compound Base UI part:** Spread Base UI's namespace. Wrap only the parts that render DOM with `part()`.
   - **Single Base UI part:** Write a small function. Set the axis data attribute in it.
   - **No Base UI part:** Use `useRender` + `mergeProps`. The props extend `useRender.ComponentProps<'{tag}'>`. Destructure `render` out of the props and give it to `useRender`. Put the class, the data attributes, and the children in the first `mergeProps` argument. Put the caller's `props` second. Example: `src/components/Alert.tsx`.
2. Style with the category classes first (`hds-action`, `hds-control`, ...). Add a component CSS file only for layout. Every rule goes in an `hds` layer.
3. Run `npm test`. These three checks in `src/components/components.test.ts` must pass:
   - no component file references a primitive
   - every semantic token a component reads exists in the theme
   - every component CSS rule lives in an hds layer
4. Add a case to `src/components/render.test.ts`.
5. Add the component to `demo/main.tsx`, with one example per axis value.
6. Run `npm run dev`. Change a driver and change a mapping from the demo controls. Pass = the component's color, spacing and radius follow both changes, and nothing else on the page breaks. Tell the user if you cannot see the page.
7. Export the component from `src/index.ts` under its category heading.
8. Create or update the component row in `docs/rules.md` section 4. Use spec section 1. If a compound part has a new prop, update its "same parts and props as Base UI's" note.
9. Write the component's entry in `docs/components.md`, under its category heading. This file is what an agent in a client app reads, so it ships in the package. Copy the shape of the `Button` entry:
   - `### {Export name}`. One heading per export. `npm test` fails when an export in `src/index.ts` has no heading.
   - One line saying what it does.
   - One **Use when** line and one **Don't use when** line. The don't-use line names the component to use instead. Take both from spec section 1.
   - A props table of the `HDS` rows in spec section 3 only. Do not copy Base UI props: they are already in `dist/types` and in the Base UI docs, and a third copy goes stale.
   - A short `tsx` snippet that runs.

When all nine pass, set `Status: built` in the spec.

---
name: component-figma
description: Build the Figma component for a handy-ds component from its reviewed spec, and fill the spec's Figma mapping table. Use when the user asks to put a component in Figma, build the Figma library entry, or map a component's props to Figma properties. Needs a spec at `Status: reviewed` — the component-spec skill writes one. Does not write React code; the component-build skill does that.
---

# Component Figma

The spec is the source of truth. This skill turns a reviewed spec into a Figma component and fills spec section 5.

This skill and `component-build` are independent. The code does not read section 5, so run them in either order.

**Precondition.** Read `.claude/specs/components/{kebab-name}.md` and check its `Status` line.

- No file, or `Status: draft`: stop. Tell the user the spec is not reviewed, and name the `component-spec` skill.
- `Status: reviewed` or `Status: built`: continue.

Load the `figma-use` and `figma-generate-library` skills before you call any Figma tool.

## Steps

1. Write spec section 5 from spec section 3:
   - one property for each axis (kind: `variant`)
   - one for each boolean prop (kind: `boolean`)
   - one for each text slot (kind: `text`)
   - one for each icon slot (kind: `instance swap`)

   The Figma property names match the code prop names. Do not add a Figma property that has no prop in section 3.
2. Ask the user for the Figma file if you do not have it. Do not create a new file without approval.
3. Build the component in Figma. Bind every color, space, radius and type value to the variable for the semantic token in spec section 4. Do not enter a raw value.
4. Build one variant for each combination the axes in section 5 allow.
5. Set the spec's `Figma:` line to `built`. Leave the `Status:` line alone — it tracks the code.
6. Tell the user what you built, and list any section 4 token with no Figma variable.

If you have no Figma access, do step 1 only. Tell the user that section 5 is written and the Figma file is not built.

# Design System Vision Spec

This system is a shared component library. It is used to build client web applications. It lets a small team, or an AI coding agent working on the team's behalf, build a new client application or a front-end for a headless WordPress site quickly and consistently. The system is for internal use to build client work. Clients do not use it directly.

## 1. Scope

The system targets two platforms:

- Headless WordPress sites.
- Progressive web apps.

The same component library and theming system apply to both.

## 2. Design Principles

Each client application looks different from the others. The visual result varies by client. This variety is intentional.

The components and patterns underneath stay the same across all client applications. The same button component, the same form patterns, and the same data conventions are used every time.

This consistency makes each new client build faster than the last. It also makes future updates and maintenance easier, because every application shares the same underlying code.

## 3. Tech Stack

- React for component code.
- Base UI as the primitive layer. Base UI provides unstyled, accessible component behavior: keyboard handling, focus management, ARIA roles, and similar logic.
- Plain CSS using CSS custom properties for styling. No Tailwind and no other utility CSS framework.
- The component library is built and versioned as a private package. Client projects install it as a dependency.

## 4. Theming Model

The theming system has three layers.

**Drivers.** A driver is a direct, simple input. Examples: a brand color, an accent color, a density setting, a border radius setting. A person sets driver values by hand for each client.

**Primitives.** Primitives are generated from driver values. A color driver generates a full range of color shades. A type scale driver generates a full set of font sizes. Primitives are not set by hand. They are calculated from drivers.

**Semantic tokens.** Semantic tokens are named values that describe a purpose, not a raw value. Examples: the background color of a primary button, the text color of an error message. Semantic tokens point to specific primitive values.

Components read only semantic tokens. A component never reads a driver value or a primitive value directly. This keeps components stable. It also means a full theme change requires no change to component code.

## 5. Two Levels of Theme Control

The system supports two levels of adjustment.

**Driver-level adjustment.** This is the fast, easy level. A person changes a driver value, such as a color or a radius setting, and the primitives and semantic tokens update to match. This level covers most client theming needs.

**Mapping-level adjustment.** This is a deeper, harder level. Instead of changing a driver value, a person changes which primitive value a semantic token points to. For example, a semantic token for a button background might normally point to a mid-range shade of the primary color. At the mapping level, a person can point it to a different shade, or to a different color scale entirely.

Mapping-level adjustment takes more time and more care than driver-level adjustment. It also produces a wider range of possible results. The two levels work together: drivers set the raw material, and mapping decides how that material is used.

## 6. Driver List

The starting set of drivers:

- Primary brand color.
- Accent color.
- Typography set and type scale.
- Density (how compact or roomy the layout is).
- Style settings per element category (actions, inputs, surfaces), including border style and border radius.
- Shadow settings.
- Color rules for specific sections, such as hero sections.

This list is not final. It will be expanded as the team identifies more tunable properties.

## 7. Component Layer

The library wraps Base UI primitives into a set of ready-to-use components: buttons, inputs, modals, navigation elements, and cards, at minimum.

Each component follows the same file structure and the same prop naming conventions. Each component consumes semantic tokens only, through CSS custom properties.

## 8. Platform Integration

**Headless WordPress.** The system connects to WordPress through its data API. The exact method, REST or WPGraphQL, is decided during implementation. A data-fetching layer sits between WordPress and the components.

**Progressive web app.** The system includes a standard PWA shell: a service worker, a web app manifest, and basic offline support.

## 9. Agent Usage

A coding agent uses this system to build client applications. The agent follows a written rules document that explains:

- Which component to use for a given interface need.
- How to apply driver values for a specific client.
- What conventions to follow when writing new code against the library.

The rules document is written and maintained by the team. The agent does not decide these rules on its own.

## 10. Success Criteria

The first version of this system is complete when:

- A person can set driver values for a new client and produce a themed application without editing component code.
- The same component set renders correctly across at least one WordPress site and one PWA.
- A coding agent can build a full page from the component library by following the written rules document, without direct supervision on component choice.
- Changing a client's theme requires only a change to driver values, not a change to any component.
- A person can adjust primitive-to-semantic mappings for a client that needs a result outside what driver values alone can produce.

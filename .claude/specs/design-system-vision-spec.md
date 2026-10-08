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
- Base UI as the behavior layer. Base UI provides unstyled, accessible component behavior: keyboard handling, focus management, ARIA roles, and similar logic.
- Plain CSS using CSS custom properties for styling. No Tailwind and no other utility CSS framework.
- A charting library for data visualization. The library is not chosen yet. It must take its colors from the theme's data-visualization palette.
- The component library is built and versioned as a private package. Client projects install it as a dependency.

## 4. Theming Model

The theming system has three layers.

**Drivers.** A driver is a direct input that a person sets for each client. Examples: a brand color, a density setting, a border radius setting, the palette color used for primary actions.

**Primitives.** Primitives are generated from driver values. A color driver generates a full palette of color shades. A type scale driver generates a full set of font sizes. Primitives are not set by hand. They are calculated from drivers.

**Semantic tokens.** Semantic tokens are named values that describe a purpose, not a raw value. Examples: the background color of a primary button, the text color of an error message. Semantic tokens point to specific primitive values. The set of semantic tokens is kept as small as the components allow.

Components read only semantic tokens. A component never reads a driver value or a primitive value directly. This keeps components stable. It also means a full theme change requires no change to component code.

The theme includes a data-visualization palette: a set of colors for charts and graphs. It follows the same three layers as every other color.

## 5. Theme Control

Drivers are the only way to theme a client. There is no second, deeper level of control. A client theme is a set of driver values, and nothing else.

Drivers are detailed enough to cover the needs that a deeper level would otherwise cover. The most important case is color. A color driver generates a palette. Other drivers then pick the exact palette color for each use, such as the background of a primary action. The library does not pre-select a hue or a shade for a use. Each pick has a default, so a person sets only the picks that matter for the client.

How the drivers become semantic tokens is library code. A client does not change it. If a client needs a result that drivers cannot produce, the team adds or extends a driver. The new driver then serves every client.

## 6. Driver List

The drivers, grouped by token type. Each driver has a default, so a person sets only the drivers that matter for the client.

- **Color palette.** Primary color and an optional secondary color (any CSS color format). The two colors anchor a wheel of 11 harmonious hue ramps of 11 stops each. Other palette drivers: the chroma floor of the generated ramps, the neutral tint or an exact neutral color, a contrast setting that shifts the lightness stops, and dark-mode contrast and chroma.
- **Color roles.** The ramp used for each system color: danger, warning, success, and info. Each has a default from hue proximity.
- **Color picks.** The exact palette color for each use, such as the background of primary actions. Interaction states derive from the picks, with optional overrides. Each pick can also have a dark-mode override.
- **Modes and contexts.** The default mode (light, dark, or system), the override picks for the on-primary and on-secondary contexts, and the color rules for specific sections, such as hero sections.
- **Data visualization.** Picks for the categorical, sequential, and diverging chart palettes. The chart colors come from the same color palette.
- **Typography.** Heading, body, and mono font families, a base size and a scale ratio, and picks for each text style.
- **Density.** How compact or roomy the layout is.
- **Shape.** Border radius and border width per shape role (for example controls, containers, dividers), not per element category.
- **Shadow.** Shadow strength.

The full list with defaults is in `.claude/specs/token-system-spec.md`, section 3.

## 7. Driver Interface (Theme Customization Tool)

The system includes a driver interface, also called the theme customization tool: a visual tool where a person sets each driver for a client. Each token type has two parts in the interface. The palette part shapes the primitive palette. The application part assigns palette values to specific uses. Each driver type has a control that fits it. For example, a color pick uses a swatch selector that shows the generated palette. The tool shows a live preview of the components with the current driver values. Its output is a driver config that a client project uses directly. The detailed design is in `.claude/specs/theme-customization-spec.md`.

## 8. Component Layer

The library provides a set of ready-to-use components. These include, at minimum: buttons, inputs, modals, navigation elements, cards, carousels, page sections, layout components, and charts.

Where Base UI has a matching component, the library wraps it and does not re-implement its behavior. Where Base UI has no match, such as for cards and layout components, the library builds the component on the same conventions.

Each component follows the same file structure and the same prop naming conventions. Each component consumes semantic tokens only, through CSS custom properties.

Each component goes through the same process before it is built. A spec interview defines its API: which props it exposes, what they are called, and which semantic tokens they map to. The team approves the API before code is written. The component then gets its code, its Figma component, and its documentation, each from the approved spec.

## 9. Platform Integration

**Headless WordPress.** The system connects to WordPress through its data API. The exact method, REST or WPGraphQL, is decided during implementation. A data-fetching layer sits between WordPress and the components.

**Progressive web app.** The system includes a standard PWA shell: a service worker, a web app manifest, and basic offline support.

## 10. Agent Usage

A coding agent uses this system to build client applications. The agent follows a written rules document that explains:

- Which component to use for a given interface need.
- How to apply driver values for a specific client.
- What conventions to follow when writing new code against the library.

The rules document is written and maintained by the team. The agent does not decide these rules on its own.

## 11. Success Criteria

The first version of this system is complete when:

- A person can set driver values for a new client and produce a themed application without editing component code.
- A person can set every driver through the driver interface, without editing a config file by hand.
- A person can pick the exact palette color for each color use, such as primary action backgrounds.
- The same component set renders correctly across at least one WordPress site and one PWA.
- A coding agent can build a full page from the component library by following the written rules document, without direct supervision on component choice.
- Changing a client's theme requires only a change to driver values, not a change to any component and not a change to library code.

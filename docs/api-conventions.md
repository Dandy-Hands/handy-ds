# Component API conventions

Rules for the public API of every handy-ds component: which members exist, what kind each is, how they are named, what types their values have, and how values are named. Read this before a component's spec interview. A component spec may break a rule only with a recorded reason.

A **member** is a prop on a component or one of its parts. **Base UI members** pass through unchanged — no renaming, no re-typing. These rules govern the members handy-ds adds.

## 1. What is and is not a member

Add a member only when at least one of these holds:

- It selects a value on a semantic token axis (`variant`, `tone`, `elevation`, ...) or a measure (`size`, `gap`, ...).
- It controls behavior Base UI does not provide.

Do not add:

- **Style props**: `style`, `color`, `background` (as a color or CSS string), pixel or CSS-string lengths, shadows. The only lengths allowed are the `height` and `minHeight` of band components (section 4). Components read semantic tokens only; a client changes looks through drivers. Wrapped parts remove `style` from their types (`Omit<..., 'style'>`). Components may still write inline custom properties internally (for example, responsive values), but never expose `style`. Limit: Base UI parts that pass through unwrapped still accept `style`; the ban is enforced on wrapped parts only.
- **Driver or primitive access**: no prop may name a driver or a `hds/prim/*` value.
- **Renamed Base UI props**: never wrap a Base UI prop under a second name.
- **Axis values as booleans**: no `primary`, `isDanger`, `large`, `fullWidth`. Use the axis or measure prop (`variant="primary"`, `width="full"`). Fewer props are better.
- **Shortcut props for a Base UI part**: no `label`, `description`, `error`, `title`. A Base UI part already holds this content and wires it for accessibility (`<Field.Label>`, `<Field.Description>`), so a prop would be a second way to do the same thing. Content goes in the part.
- **Content-type props**: no `startIcon`, `endText`, `leadingImage`. A prop name never states what kind of content it holds. Use a slot prop (next rule).
- **One-off client needs**: use `render`, `className`, or composition instead. A member needs at least two real uses across client work.
- **Speculative members**: no prop "for later". Add it when the second use appears.

A **slot prop** is allowed when all of these hold:

- It places decorative or supporting content beside the main content, such as an icon, a unit, or a button inside a field frame.
- No Base UI part exists for this content, and the component's `children` already hold something else.
- The component needs to control the placement, spacing, or alignment of the content.

A slot prop is named for its position with logical names, `start` and `end`, never `left` and `right`. It takes `ReactNode`. A component has at most `start` and `end`. Content that needs accessibility wiring is not a slot: use the Base UI part.

**Exception (2026-10-20):** the band components `Section`, `Header`, and `Footer` also have `background`. It is a slot for a custom layer behind the content, such as a canvas, WebGL, or Lottie scene. The name states a position (behind), it takes `ReactNode`, and it is not the style prop `background` that holds a color. The component renders the layer with `aria-hidden` and `pointer-events: none`.

## 2. Member categories

| Category | What it does | Examples |
|---|---|---|
| Axis | Selects a role on a token category axis | `variant`, `tone`, `elevation` |
| Measure | Selects a `measure/size` or `measure/space` step, or a keyword | `size`, `gap`, `padding`, `paddingInline`, `width` |
| State | Holds component state, Base UI pattern | `open` / `defaultOpen` / `onOpenChange`, `disabled` |
| Content | Places content | `children`, and the slot props `start` and `end`; other named content is a part, not a prop |
| Event | Reports something that happened | `onValueChange`, `onOpenChange` |
| Composition | Changes the rendered element or merges styling | `render`, `className`, `ref` — pass-through only |

A member belongs to exactly one category. If a member seems to fit two, split it.

## 3. Member names

- **One name means one thing everywhere in the library.** `size` always means a `measure/size` step on the component's main dimension; `variant` always means the component's role or priority; `tone` always means semantic color. Never reuse a name for a different meaning, and never give one meaning two names. Where the rule bites, fix the prop, not the rule.
- **Axis** props take the axis noun from section 6. New axes are added to that table when their component's spec is written. Two axes are library-wide:
  - `variant` changes the role or priority of the component: `primary`/`secondary`/`tertiary` buttons, or typography roles on Text.
  - `tone` changes color in a semantic way: `danger`, `success`, and so on. It never changes role or priority.
  - Exception: Action has no tone, so a destructive Button is `variant="danger"`, matching the Action token slot `color/action/danger/...`.
- **Measure** props depend on the kind of component:
  - **Layout components and containers** (Stack, Grid, Container, Card, ...) take props close to individual CSS properties, in camelCase: `gap`, `padding`, `paddingInline`, `paddingBlock`, `width`, `height`. Use logical names (`inline`/`block`), not `x`/`y` or `left`/`right`.
  - **Controls and graphics** (Button, TextInput, Icon, ...) take one `size` prop for their main dimension (control height, icon glyph box). Their padding, gaps, and type size follow from the `size` step in component CSS, not from separate props.
- **Boolean** props are a bare adjective or participle, no `is`/`has` prefix, as in HTML and Base UI: `disabled`, `required`, `inline`. A boolean must be a real two-state flag; anything with three or more states is an axis.
- **State** props follow Base UI: `x` (controlled), `defaultX` (uncontrolled), `onXChange`.
- **Event** props are `on` + subject + verb: `onValueChange`, `onOpenChange`. Not `onChange` for a non-input value.
- **Parts** are nouns naming the content they hold, following Base UI: `Field.Label`, `Field.Description`, `Card.Header`.
- camelCase, full words, no abbreviations (`description`, not `desc`).

## 4. Value types

- **Enumerated values are typed string unions**, never `string`. Export the union with the component (`export type ButtonSize = '800' | '1000' | '1200'`).
- **Measure values are strings**, never numbers: `"400"`, not `400`. The string matches the token name and the data attribute, and keeps the leading zero in `"050"`.
- **No raw numbers and no CSS lengths** in a handy-ds member, with these exceptions:
  - **Counts** are numbers: `cols`, `colSpan`, `rowSpan`, `colStart`, `rowStart` (Grid and Grid.Item), and Text `maxLines`. A count is a number of things, not a size.
  - **Band height** is a CSS length string: `height` and `minHeight` on `Section`, `Header`, and `Footer` take `"auto"`, `"screen"`, or a string such as `"60svh"` or `"480px"`. A page-design height has no token scale, and the `measure/size` steps are too small.
  - Every other size, space, or width is a measure step (section 5.2).
- **Content** is `ReactNode`. **Events** are functions. **Booleans** are only for true two-state flags.
- **Measure props and layout props accept responsive values** (section 5.3). A layout prop sets how a Flex or Grid places its items: `Flex` `direction`, `Grid` `cols`, and every `Grid.Item` and `Flex.Item` prop. Axis props do not; they take one value.
- Every handy-ds member with values has a documented default, applied as a data attribute (`data-size="1000"`) or private custom property, so the current value shows in the DOM.

## 5. Value names

### 5.1 Axis values

Axis values appear verbatim in the axis slot of the token names the component reads: `variant="primary"` on Button reads `color/action/primary/...`; `size="sm"` on Text reads `typography/body/size/sm`. Value sets are defined once per axis (section 6) and shared across components.

### 5.2 Measure values

Measure values are the token step names, verbatim:

- `size` takes `measure/size` steps: `"200"`, `"300"`, `"400"`, `"500"`, `"600"`, `"800"`, `"1000"`, `"1200"`, `"1600"`, `"2400"`, `"3200"`.
- Space props (`gap`, `padding`, `paddingInline`, ...) take `measure/space` steps: `"050"`, `"100"`, `"200"`, `"300"`, `"400"`, `"600"`, `"800"`, `"1000"`, `"1200"`, `"1600"`, `"2400"`.
- Width props (`Tiles` `minTileWidth`, `Grid` `minColWidth`, `Aside` `width`) take `measure/width` steps: `"6400"`, `"8000"`, `"9600"`, `"12800"` (256 to 512px at density 1). The page widths `content` and `content-narrow` are not prop values: `Section` `contentWidth` takes the keywords `"default"`, `"narrow"`, and `"full"`.
- **Each component allows a subset.** Its spec lists the allowed steps and the union type rejects the rest (for example, Button `size`: `"800" | "1000" | "1200"`). For a control, `size` sets the height from `measure/size/{step}`; the component spec defines padding and type size for each allowed step.

Measure props may also take these keywords where the spec allows them:

| Keyword | CSS result | Typical use |
|---|---|---|
| `"none"` | `0` | Remove a gap or padding |
| `"auto"` | `auto` | Let layout decide a width or size |
| `"full"` | `100%` | Fill the parent |
| `"fit"` | `fit-content` | Shrink to content |
| `"fill"` | `flex: 1` in flex, `stretch` in grid | Grow into the free space of the parent's layout. Unlike `full`, it does not overflow next to siblings. |

### 5.3 Responsive values

A measure prop or a layout prop takes one value or an object keyed by breakpoint:

```tsx
<Stack gap="400" />
<Stack gap={{ base: '200', md: '400', xl: '600' }} />
<Grid cols={{ base: 1, md: 2, lg: 4 }} />
```

- Keys: `base`, `sm`, `md`, `lg`, `xl`. `base` is required in the object form.
- Mobile-first: each key applies from its breakpoint's min-width up (`sm` 640, `md` 768, `lg` 1024, `xl` 1280 px; `breakpoints` in `src/tokens/primitives.ts`).
- The component writes each value to a private custom property (`--_gap-md`), and its CSS picks them up in `@media (min-width: ...)` rules. Breakpoints are build-time values, not tokens, because custom properties do not work in `@media`.

## 6. Axis value sets

| Axis | Values | Definition |
|---|---|---|
| `variant` | per component. Button and other Action parts: `primary`, `secondary`, `tertiary`, `danger`. Text: `display`, `headline`, `body`, `label`, `caption` | The component's role or priority. Values match the token slot (`color/action/primary/...`, `typography/display/...`). |
| `tone` | per category. Feedback: `danger`, `warning`, `success`, `info`. Content (Icon, Text color): `default`, `muted`, `accent`. Graphic divider (Separator): `default`, `strong` | Semantic color. Values match the token slot (`color/feedback/danger/...`, `color/content/muted/...`). |
| `elevation` | `base`, `raised`, `floating`, `modal` (`sunken` where a spec needs it) | Surface level: distance above the page plane. Reads Surface color and `elevation/*` shadow. |
| `surface` | `sunken`, `base`, `primary`, `secondary` on Section, Header, and Footer. `Aside` also takes `raised`. | Background color of a band or column. `sunken` — below the page. `base` — the page. `raised` — above the page. `primary` and `secondary` — the brand color; they also set `data-context="on-primary"` or `"on-secondary"` on the element, so the content re-resolves to its on-brand tokens. Reads Surface color only, with no shadow; this differs from `elevation`. Added in the Section spec (2026-10-20). |
| `size` on Text | `sm`, `md`, `lg` | Font size step inside a typography role. Text reads `typography/{role}/size/{size}`, so the slot rule gives `sm`/`md`/`lg`, not measure steps. Recorded exception to "one name, one meaning" (section 3), decided in Text's spec interview (2026-10-12). |

A component uses an axis when its definition matches, decided by the token category the component's spec assigns — not by copying another component's choice.

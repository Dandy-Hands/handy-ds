# handy-ds components

Reference for coding agents building client apps. One entry per export in `handy-ds`.

Read `docs/rules.md` first: it covers setup, theming, contexts and the rules for app code. This file answers "which component, and what do I pass it".

**Three rules that apply to every entry below.**

1. The props listed here are the ones handy-ds adds. Every other prop belongs to the Base UI part underneath. Its types are in `handy-ds/dist/types`, and its behavior is documented in `node_modules/@base-ui/react/docs/react/components/{name}.md`.
2. Never set `className` to change a component's colors, spacing or radius. Those come from the theme. A visual change is a driver change: a palette driver or a pick driver (`docs/rules.md` sections 2 and 3).
3. Every component accepts `render` to swap its tag: `<Text render={<h3 />}>`.

Working examples of all of these on one page: the Overview page of the docs site (`npm run dev`).

---

## Action

### Button

Triggers an action. Renders `<button>`.

- **Use when:** the click does something on this page — submit, open, save, delete.
- **Don't use when:** the click navigates to a URL. Use `LinkButton`.

| Prop | Values | Default |
|---|---|---|
| `priority` | `primary` (the main action, at most one per view), `secondary`, `tertiary` (toolbars, inline), `danger` (destructive) | `primary` |
| `size` | `sm`, `md`, `lg` | `md` |

```tsx
import { Button } from 'handy-ds';

<Button onClick={save}>Save</Button>
<Button priority="secondary" size="sm">Cancel</Button>
```

Button is also how any other trigger gets a button's look: `<Dialog.Trigger render={<Button priority="tertiary" />}>`.

### LinkButton

A link that looks like a button. Renders `<a>`.

- **Use when:** the control navigates, but the design calls for a button.
- **Don't use when:** the control acts on this page. Use `Button`.

| Prop | Values | Default |
|---|---|---|
| `priority` | `primary`, `secondary`, `tertiary`, `danger` | `primary` |
| `size` | `sm`, `md`, `lg` | `md` |

```tsx
<LinkButton href="/pricing">See pricing</LinkButton>
<LinkButton render={<RouterLink to="/pricing" />}>See pricing</LinkButton>
```

### ToggleGroup, Toggle

`ToggleGroup` is a group of buttons in one filled container. `Toggle` is one button that stays pressed or not. Every `Toggle` sits inside a `ToggleGroup`.

- **Use when:** formatting controls (bold, italic), or picking one or several from a few options that are all visible.
- **Don't use when:** the setting applies immediately to a preference — use `Switch`. More than about five options — use `Select`.

`ToggleGroup` takes `variant` (`'primary' | 'secondary'`, default `'secondary'`) and `size` (`'800' | '1000' | '1200'`). A pressed `Toggle` shows `variant`. An idle `Toggle` shows the next weaker look.

The `ToggleGroup` is as tall as a `Button` of the same `size`. The `Toggle` buttons fill the inside of the group.

```tsx
<ToggleGroup defaultValue={['b']}>
  <Toggle value="b">Bold</Toggle>
  <Toggle value="i">Italic</Toggle>
</ToggleGroup>
```

### Toolbar

A bar of controls for a region, with arrow-key navigation.

- **Use when:** an editor bar or a control strip over a region of the page.
- **Don't use when:** it is the site's navigation — use `NavigationMenu`.

No handy-ds props. `Toolbar.Button` and `Toolbar.Link` are Action `tertiary`; `Toolbar.Input` is size `sm`.

```tsx
<Toolbar.Root>
  <Toolbar.Button>Cut</Toolbar.Button>
  <Toolbar.Separator />
  <Toolbar.Input placeholder="Search" />
</Toolbar.Root>
```

### Switch

An on/off setting that takes effect immediately.

- **Use when:** the change applies the moment it is flipped.
- **Don't use when:** the value is submitted with a form. Use `Checkbox`.

One handy-ds prop: `size` (`500` | `600` | `800`).

```tsx
<Switch defaultChecked />
```

### Slider

Picks a number, or a range of numbers, by dragging a thumb along a track.

- **Use when:** an approximate value inside a known range is enough, such as volume or a price range.
- **Don't use when:** the user must type an exact number — use `NumberField`. The value is read-only — use `Meter` or `Progress`.

One handy-ds prop: `size` (`200` | `300` | `400`, the track height). Parts: `Slider.Root`, `Slider.Label`, `Slider.Value`, `Slider.Control`. A `number[]` value gives a range slider. A vertical slider fills the height of its parent.

```tsx
<Slider.Root defaultValue={40}>
  <Slider.Label>Volume</Slider.Label>
  <Slider.Value />
  <Slider.Control />
</Slider.Root>
```

### Tabs

Switches between views in the same place.

- **Use when:** several panels share one region and only one shows at a time.
- **Don't use when:** the panels are separate pages, or all of them may be open at once — use `Accordion`.

No handy-ds props. `Tabs.Tab` is Action `tertiary`.

```tsx
<Tabs.Root defaultValue="a">
  <Tabs.List><Tabs.Tab value="a">First</Tabs.Tab><Tabs.Tab value="b">Second</Tabs.Tab><Tabs.Indicator /></Tabs.List>
  <Tabs.Panel value="a">…</Tabs.Panel>
</Tabs.Root>
```

### Menu, Menubar, ContextMenu

A list of commands behind a trigger. `Menubar` is an app-style menu row. `ContextMenu` opens on right-click.

- **Use when:** commands that act, and do not need to be visible until asked for.
- **Don't use when:** the user is choosing a value for a form. Use `Select`.

No handy-ds props. `Menu.Trigger` looks like a `secondary` Button — pass `data-priority="tertiary"` inside a `Menubar`.

```tsx
<Menu.Root>
  <Menu.Trigger>Actions</Menu.Trigger>
  <Menu.Portal><Menu.Positioner><Menu.Popup>
    <Menu.Item onClick={duplicate}>Duplicate</Menu.Item>
    <Menu.Separator />
    <Menu.Item onClick={remove}>Delete</Menu.Item>
  </Menu.Popup></Menu.Positioner></Menu.Portal>
</Menu.Root>
```

### NavigationMenu

Site navigation, with dropdown panels.

- **Use when:** the top-level navigation of a site.
- **Don't use when:** the items are commands rather than destinations. Use `Menu`.

No handy-ds props. Triggers and links are Action `tertiary`.

---

## Input/Field

### Field, Fieldset, Form

`Field` is one labelled form value: label, control, description, error. `Fieldset` groups related fields inside a `Form`.

- **Use when:** any text entry. Use the full `Field` set so the label, description and error are wired to the control.
- **Don't use when:** there is no visible label — only then use a bare `TextInput`, with an `aria-label`.

| Component | Prop | Values | Default |
|---|---|---|---|
| `Field.Control` | `data-size` | `800`, `1000`, `1200` | `1000` |

`TextInput` is a standalone text field with a `size` prop (`800`, `1000`, `1200`) and `start` and `end` slots.

```tsx
<Form onSubmit={submit}>
  <Field.Root>
    <Field.Label>Name</Field.Label>
    <Field.Control placeholder="Jane Doe" required />
    <Field.Description>As it appears on your ID.</Field.Description>
    <Field.Error match="valueMissing">Enter your name.</Field.Error>
  </Field.Root>
</Form>
```

Field error text is contrast-checked in the default context only. Inside a colored section, put the form in a `data-context="default"` container (`docs/rules.md` section 5).

### TextInput

A single-line field for free text, with `start` and `end` slots.

- **Use when:** a name, a title, or a comment. Wrap it in `Field` when it has a visible label.
- **Don't use when:** the value is an email, a phone number, a password, a URL, or a search (use the typed field), a number (use `NumberField`), or a date.

| Prop | Values | Default |
|---|---|---|
| `size` | `800`, `1000`, `1200` | `1000` |
| `start`, `end` | any node | none |

```tsx
<TextInput aria-label="Weight" size="800" end="kg" />
```

### PasswordInput

A password field with a show/hide button.

- **Use when:** the user enters or confirms a password.
- **Don't use when:** the value is not a secret (use `TextInput`).

| Prop | Values | Default |
|---|---|---|
| `size` | `800`, `1000`, `1200` | `1000` |
| `start` | any node | none |
| `autoComplete` | native; `new-password` for a new password | `current-password` |

```tsx
<PasswordInput aria-label="Password" start={<Icon>lock</Icon>} />
```

### SearchInput

A search field with a search icon and a clear button.

- **Use when:** the user types a query to find or filter items.
- **Don't use when:** the value is free text that is not a query (use `TextInput`).

| Prop | Values | Default |
|---|---|---|
| `size` | `800`, `1000`, `1200` | `1000` |

Put it in a `<form role="search">` so `Enter` submits. `Escape` clears the text.

```tsx
<SearchInput aria-label="Search posts" onValueChange={setQuery} />
```

### EmailInput

An email field with a mail icon, an email keyboard, and a check for a dot in the domain.

- **Use when:** the user enters one email address.
- **Don't use when:** the value is not an email (use `TextInput`) or is a list of addresses.

| Prop | Values | Default |
|---|---|---|
| `size` | `800`, `1000`, `1200` | `1000` |
| `end` | any node | none |
| `pattern` | native; override for `user@intranet` | needs a dot in the domain |

Show a failed check with `<Field.Error match="patternMismatch">`.

```tsx
<EmailInput aria-label="Email" required />
```

### PhoneInput

A phone field with a phone icon, a phone keypad, and a mask. The value is digits only.

- **Use when:** the user enters a phone number.
- **Don't use when:** the value is not a phone number (use `TextInput`).

| Prop | Values | Default |
|---|---|---|
| `size` | `800`, `1000`, `1200` | `1000` |
| `country` | `US` | `US` |
| `end` | any node | none |
| `pattern` | native; override the check for a complete number | the country's pattern |

`onValueChange` receives digits, such as `2025550123`. Show a failed check with `<Field.Error match="patternMismatch">`.

```tsx
<PhoneInput aria-label="Phone" onValueChange={setPhone} />
```

### UrlInput

A URL field with a link icon and a URL keyboard. On blur it adds `https://` when the text has no scheme.

- **Use when:** the user enters one web address.
- **Don't use when:** the value is not a web address (use `TextInput`).

| Prop | Values | Default |
|---|---|---|
| `size` | `800`, `1000`, `1200` | `1000` |
| `end` | any node | none |
| `pattern` | native; override to allow other schemes | `http` and `https` only |

Show a failed check with `<Field.Error match="patternMismatch">`.

```tsx
<UrlInput aria-label="Website" />
```

### NumberField

A number input with steppers.

- **Use when:** a quantity the user nudges up and down.
- **Don't use when:** the value is a range with no exact number in mind — use a slider, which this library does not ship yet.

No handy-ds props. `NumberField.Group` takes `data-size`.

```tsx
<NumberField.Root defaultValue={2} min={0}>
  <NumberField.Group><NumberField.Decrement /><NumberField.Input /><NumberField.Increment /></NumberField.Group>
</NumberField.Root>
```

### Checkbox, Checkbox.Group

Yes/no, or several from a few options.

- **Use when:** the value is submitted with a form, or several options can be picked at once.
- **Don't use when:** the change applies immediately. Use `Switch`.

`size`: `"500"` (default), `"600"`, `"800"`. `Checkbox.Group` takes `orientation`. Label it with `Field.Label` or a `<label>`.

```tsx
<Field.Root>
  <Field.Label><Checkbox defaultChecked />Subscribe</Field.Label>
</Field.Root>
```

### Radio, Radio.Group

One of a few options, all visible.

- **Use when:** two to five options and the user should see them all.
- **Don't use when:** more than about five options. Use `Select`.

`Radio` takes `size`: `"500"` (default), `"600"`, `"800"`. `Radio.Group` takes `orientation`. Wrap the group in `Fieldset.Root` with a `Fieldset.Legend`.

### Select

One value from a long fixed list.

- **Use when:** the list is known, longer than about five, and does not need filtering.
- **Don't use when:** the user needs to type to narrow the list — use `Combobox` — or the list is short — use `Radio`.

No handy-ds props. The trigger is Input/Field (`data-size`), the popup is Surface, the items are Action.

```tsx
<Select.Root items={items} defaultValue="Banana">
  <Select.Trigger><Select.Value /><Select.Icon /></Select.Trigger>
  <Select.Portal><Select.Positioner><Select.Popup><Select.List>
    {items.map((i) => <Select.Item key={i} value={i}><Select.ItemText>{i}</Select.ItemText><Select.ItemIndicator /></Select.Item>)}
  </Select.List></Select.Popup></Select.Positioner></Select.Portal>
</Select.Root>
```

### Combobox

A long list the user filters by typing. Also multi-select with chips.

- **Use when:** the list is long, or several values are picked at once.
- **Don't use when:** the user may enter a value that is not in the list. Use `Autocomplete`.

No handy-ds props.

### Autocomplete

Free text with suggestions.

- **Use when:** any text is valid and the suggestions only help.
- **Don't use when:** the value must come from the list. Use `Combobox`.

No handy-ds props.

---

## Surface and Overlay

### Card

A box of related content.

- **Use when:** grouping content that belongs together on a page.
- **Don't use when:** it only needs spacing. Use the app's own layout CSS.

| Prop | Values | Default |
|---|---|---|
| `elevation` | `0`, `1`, `2`, `3` | `1` |

```tsx
<Card elevation={2}><Text variant="headline">Plan</Text><Text>…</Text></Card>
```

A `Card` is also how you restore normal colors inside a colored section: give it `data-context="default"`.

### Dialog, AlertDialog

A task that blocks the page. `AlertDialog` confirms a destructive action and cannot be dismissed by clicking outside.

- **Use when:** the user must finish or dismiss before carrying on.
- **Don't use when:** the content is extra detail next to a trigger. Use `Popover`.

No handy-ds props. The popup is Surface elevation 3; triggers and close buttons look like `secondary` Buttons.

```tsx
<Dialog.Root>
  <Dialog.Trigger>Edit</Dialog.Trigger>
  <Dialog.Portal><Dialog.Backdrop /><Dialog.Popup>
    <Dialog.Title>Edit profile</Dialog.Title>
    <Dialog.Close>Done</Dialog.Close>
  </Dialog.Popup></Dialog.Portal>
</Dialog.Root>
```

### Popover

Extra information or small controls anchored to a trigger.

- **Use when:** the content is secondary and the page behind stays usable.
- **Don't use when:** it is a list of commands — use `Menu` — or the task blocks the page — use `Dialog`.

No handy-ds props. Popup is Surface elevation 2.

### Accordion

Sections that show and hide.

- **Use when:** an FAQ, or long content the user scans before opening.
- **Don't use when:** exactly one section shows at a time in a fixed region. Use `Tabs`.

No handy-ds props. `Accordion.Trigger` is Action `tertiary`.

---

## Feedback

### Alert

A message that stays on the page.

- **Use when:** the message is part of the page and must stay readable.
- **Don't use when:** it is a short confirmation after an action. Use `Toast`.

| Prop | Values | Default |
|---|---|---|
| `sentiment` | `info`, `success`, `warning`, `danger` | `info` |
| `heading` | any node | — |
| `icon` | any node | — |

```tsx
<Alert sentiment="warning" heading="Card expiring">Update it before 1 March.</Alert>
```

Alert has no live-region role by default. Pass `role="alert"` (urgent) or `role="status"` (polite) when it appears in response to an action.

### Toast, Toaster

A short-lived message after an action.

- **Use when:** confirming something that happened, with nothing for the user to do.
- **Don't use when:** the user must read or act on it. Use `Alert` or `Dialog`.

No handy-ds props. A toast's `type` is its sentiment.

```tsx
// once, at the app root
<Toast.Provider><App /><Toaster /></Toast.Provider>

// anywhere
const toast = Toast.useToastManager();
toast.add({ title: 'Saved', type: 'success' });
```

### Meter

A static measurement in a known range: storage used, a score.

- **Use when:** the number means something on its own.
- **Don't use when:** it is a task running to completion. Use `Progress`.

| Prop | Values | Default |
|---|---|---|
| `tone` (on `Meter.Root`) | `info`, `success`, `warning`, `danger` | `info` |
| `size` (on `Meter.Root`) | `200`, `300`, `400` (track height) | `300` |

```tsx
<Meter.Root value={81} tone="warning">
  <Meter.Label>API quota</Meter.Label><Meter.Value /><Meter.Track><Meter.Indicator /></Meter.Track>
</Meter.Root>
```

### Progress

Task completion: an upload, an import.

- **Use when:** something is running and will finish.
- **Don't use when:** the value is a measurement. Use `Meter`.

| Prop | Values | Default |
|---|---|---|
| `size` (on `Progress.Root`) | `200`, `300`, `400` (track height) | `300` |

Pass `value={null}` when the duration is unknown.

```tsx
<Progress.Root value={40}>
  <Progress.Label>Uploading photos</Progress.Label><Progress.Value /><Progress.Track><Progress.Indicator /></Progress.Track>
</Progress.Root>
```

---

## Type, Icon, Divider

### Text

Any text with a type role.

- **Use when:** any text that is not already inside a component that styles it.
- **Don't use when:** the text is a component's own label or description — those parts style themselves.

| Prop | Values | Default |
|---|---|---|
| `variant` | `display`, `headline`, `body`, `label`, `caption` | `body` |
| `size` | `sm`, `md`, `lg` | `md` |
| `tone` | `strong`, `default`, `muted`, `accent`, `danger`, `warning`, `success`, `info` | role color |
| `maxLines` | whole number ≥ 1 | no limit |

Each variant has a default tag (`display` → `h1`, `headline` → `h2`, `body` → `p`, `label` → `span`, `caption` → `small`). Pick the correct heading level with `render`, which changes the tag and not the look.

```tsx
<Text variant="headline" render={<h3 />}>Billing</Text>
```

### Icon

Shows an SVG or a Material Symbols glyph name (client loads the font) with a tone color and size.

- **Use when:** any icon. The SVG must use `currentColor` for its stroke or fill.
- **Don't use when:** the image is content, not an icon. Use `<img>`.

| Prop | Values | Default |
|---|---|---|
| `tone` | `strong`, `default`, `muted`, `accent`, `danger`, `warning`, `success`, `info` | inherits the surrounding text color |
| `size` | `400` to `3200` (measure steps) | the surrounding font size |
| `fill` | boolean, glyph names only | `false` |
| `label` | string | none — the icon is hidden from assistive tech |

Give `label` to an icon that carries meaning on its own. Omit `tone` inside a Button or Alert so the icon matches the text around it.

```tsx
<Icon label="Search"><SearchSvg /></Icon>
```

### Avatar

A person's photo in a round frame, with initials or an icon when there is no photo.

- **Use when:** identifying a person or account next to a name, in lists, headers, comments.
- **Don't use when:** the image is content or a logo. Use `<img>`.

| Prop | Values | Default |
|---|---|---|
| `size` (on `Avatar.Root`) | `800`, `1000`, `1200`, `1600` (width and height) | `1000` |

Always include `Avatar.Fallback`. Use `alt=""` when the name shows next to the avatar.

```tsx
<Avatar.Root>
  <Avatar.Image src={user.photoUrl} alt="" /><Avatar.Fallback delay={300}>RL</Avatar.Fallback>
</Avatar.Root>
```

### Separator

A dividing line.

- **Use when:** separating groups that spacing alone does not separate.
- **Don't use when:** spacing is enough. A line is noise.

| Prop | Values | Default |
|---|---|---|
| `weight` | `thin`, `medium`, `thick` | `thin` |

Pass `orientation="vertical"` for a vertical rule.

---

## Composite

### Table

Rows and columns of data.

- **Use when:** the data has real columns and is compared across rows.
- **Don't use when:** it is a list, or a layout grid. Use the app's own CSS.

| Prop | Values | Default |
|---|---|---|
| `striped` | `boolean` | `false` |

Renders a plain `<table>`. Write `<thead>`, `<tbody>`, `<th>` and `<td>` yourself. A sortable column is a `<th aria-sort>` containing a `<button>`.

```tsx
<Table striped>
  <thead><tr><th>Name</th><th>Plan</th></tr></thead>
  <tbody><tr><td>Jane</td><td>Pro</td></tr></tbody>
</Table>
```

## Layout

### Stack

Places children in one column with a space between them. No color, border, or padding.

- **Use when:** the main flow of a page, a form, or a card body.
- **Don't use when:** you need a row (use Inline) or a grid (use Tiles or Grid), or padding or a background (use Section or Card).

| Prop | Values | Default |
|---|---|---|
| `gap` | `"none"`, space steps `"050"` to `"2400"`, or `{ base, sm, md, lg, xl }` of these | `"400"` |
| `align` | `"start"`, `"center"`, `"end"`, `"stretch"` | `"stretch"` |

```tsx
<Stack gap={{ base: "200", md: "400" }} render={<ul />}><li>One</li><li>Two</li></Stack>
```

### Inline

Places children in one row. When the row is full, the children wrap to the next line. No color, border, or padding.

- **Use when:** a row of buttons, tags, links, or an icon with a label.
- **Don't use when:** you need a column (use Stack) or equal-size cards (use Tiles), or a fixed item beside an item that fills the rest (use Flex).

| Prop | Values | Default |
|---|---|---|
| `gap` | `"none"`, space steps `"050"` to `"2400"`, or `{ base, sm, md, lg, xl }` of these | `"200"` |
| `align` | `"start"`, `"center"`, `"end"`, `"baseline"`, `"stretch"` | `"center"` |
| `justify` | `"start"`, `"center"`, `"end"`, `"between"` | `"start"` |

```tsx
<Inline gap="200" justify="between"><Text>Team</Text><Button variant="primary">Invite</Button></Inline>
```

### Flex

Places children in a row or a column with the full set of flexbox controls. Items wrap by default. `Flex.Item` sets grow, shrink, basis, and align for one child.

- **Use when:** a fixed item beside an item that fills the rest, or a direction that changes with the screen width.
- **Don't use when:** Stack or Inline does the job.

| Prop | Values | Default |
|---|---|---|
| `direction` | `"row"`, `"column"`, `"row-reverse"`, `"column-reverse"`, or `{ base, sm, md, lg, xl }` of these | `"row"` |
| `gap` | `"none"`, space steps `"050"` to `"2400"`, or `{ base, sm, md, lg, xl }` of these | `"400"` |
| `wrap` | `true`, `false` | `true` |
| `align` | `"start"`, `"center"`, `"end"`, `"baseline"`, `"stretch"` | `"stretch"` |
| `justify` | `"start"`, `"center"`, `"end"`, `"between"`, `"around"`, `"evenly"` | `"start"` |

`Flex.Item`:

| Prop | Values | Default |
|---|---|---|
| `grow` | `true`, `false` | `false` |
| `shrink` | `true`, `false` | `true` |
| `basis` | width steps `"6400"` to `"12800"`, `"auto"`, `"fit"`, `"full"`, or `{ base, sm, md, lg, xl }` of these | `"auto"` |
| `align` | `"start"`, `"center"`, `"end"`, `"baseline"`, `"stretch"` | absent |

```tsx
<Flex wrap={false}><Flex.Item basis="8000"><img src="/team.jpg" alt="Team" /></Flex.Item><Flex.Item grow><Text>Fills the rest.</Text></Flex.Item></Flex>
```

### Tiles

Places equal-size children in as many columns as fit. Each child is at least `minTileWidth` wide. Tiles in one row have the same height.

- **Use when:** a list of cards, a gallery, or items of the same weight.
- **Don't use when:** one item must be larger or placed in a chosen column, or for a dashboard (use Grid).

| Prop | Values | Default |
|---|---|---|
| `gap` | `"none"`, space steps `"050"` to `"2400"`, or `{ base, sm, md, lg, xl }` of these | `"400"` |
| `minTileWidth` | `"6400"`, `"8000"`, `"9600"`, `"12800"` | `"8000"` |

```tsx
<Tiles minTileWidth="9600"><Card>One</Card><Card>Two</Card></Tiles>
```

### Grid

Places children in columns. Without `cols`, it makes as many columns as fit. With `cols`, it makes that many equal columns. Parts: `Grid`, `Grid.Item`.

- **Use when:** a dashboard, a page layout with an Aside, or a chosen column count or item span.
- **Don't use when:** all items are equal and any column count works (use Tiles).

| Prop | Values | Default |
|---|---|---|
| `Grid` `cols` | `1` to `12`, or a responsive object | absent (auto-fit) |
| `Grid` `minColWidth` | `"6400"`, `"8000"`, `"9600"`, `"12800"` (only when `cols` is absent) | `"8000"` |
| `Grid` `gap` | `"none"`, space steps, or a responsive object | `"400"` |
| `Grid` `align`, `justify` | `"start"`, `"center"`, `"end"`, `"stretch"` | `"stretch"` |
| `Grid.Item` `colSpan`, `rowSpan` | `1` to `12`, or a responsive object. `colSpan` above `cols` is reduced to `cols` | `1` |
| `Grid.Item` `colStart`, `rowStart` | `1` to `12`, or a responsive object | auto |
| `Grid.Item` `align`, `justify` | `"start"`, `"center"`, `"end"`, `"stretch"`, or a responsive object | the Grid value |

```tsx
<Grid cols={{ base: 1, lg: 4 }}><Grid.Item colSpan={{ base: 1, lg: 3 }}><Card>Main</Card></Grid.Item><Grid.Item><Card>Side</Card></Grid.Item></Grid>
```

## Page building

### Section

A full-width band of a page with a surface, gradient, image, video, or custom background and a centered content column. Renders a `section`.

- **Use when:** each macro part of a page: a hero, a feature row, a call to action.
- **Don't use when:** you group content in a box (use Card), or you would nest it in another Section.

| Prop | Values | Default |
|---|---|---|
| `surface` | `"sunken"`, `"base"`, `"primary"`, `"secondary"` (the last two set the brand context) | `"base"` |
| `gradient` | `{ to: "sunken" \| "base", direction: "to-bottom" \| "to-top" \| "to-start" \| "to-end" }` | none |
| `media` | `{ type: "image", src, fit?, position? }` or `{ type: "video", src, poster, fit?, position? }` | none |
| `scrim` | `{ tone: "dark" \| "light", strength: "subtle" \| "medium" \| "strong", direction? }`; `tone` sets the mode | none |
| `background` | `ReactNode` custom layer | none |
| `paddingBlock` | `"none"`, space steps, or `{ base, sm, md, lg, xl }` of these | `"1600"` |
| `paddingInline` | same | `"400"` |
| `contentWidth` | `"default"`, `"narrow"`, `"full"` | `"default"` |
| `height`, `minHeight` | `"auto"`, `"screen"`, or a CSS length string | `"auto"` |
| `align` | `"start"`, `"center"`, `"end"` | `"start"` |

```tsx
<Section surface="primary" minHeight="screen" align="center"><Stack><Text variant="display" render={<h1 />}>Build faster</Text></Stack></Section>
```

### Header

The band at the top of a page. Renders a `header`. Takes every Section prop; the default `paddingBlock` is `"400"`.

- **Use when:** once per page for the site title, logo, and main navigation.
- **Don't use when:** you need the heading of a card or a section.

| Prop | Values | Default |
|---|---|---|
| `sticky` | `true`, `false`; a sticky header stays at the top with a shadow | `false` |

```tsx
<Header sticky><Text variant="headline">Acme</Text></Header>
```

### Footer

The band at the bottom of a page. Renders a `footer`. Takes every Section prop; the default `paddingBlock` is `"800"`. It adds no prop.

- **Use when:** once per page for legal text, secondary links, and contact details.
- **Don't use when:** you need the end of a card or a section.

```tsx
<Footer surface="sunken"><Text variant="caption">© 2026 Acme</Text></Footer>
```

### Aside

A column of supporting content beside the main content: a side nav, an outline, sources, or related links.

- **Use when:** a side nav, an outline, a list of sources, or related links.
- **Don't use when:** you need to place it beside the main content (use Grid), or a drawer that opens and closes.

| Prop | Values | Default |
|---|---|---|
| `width` | `"6400"`, `"8000"`, `"9600"`, `"12800"`, `"full"`, or `{ base, sm, md, lg, xl }` of these | `"8000"` |
| `sticky` | `true`, `false` | `false` |
| `surface` | `"sunken"`, `"base"`, `"raised"`, `"primary"`, `"secondary"` | absent (transparent) |
| `paddingBlock`, `paddingInline` | `"none"`, space steps, or `{ base, sm, md, lg, xl }` of these | `"400"` |

```tsx
<Aside sticky aria-label="On this page"><nav aria-label="Table of contents">...</nav></Aside>
```

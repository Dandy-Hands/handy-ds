# handy-ds components

Reference for coding agents building client apps. One entry per export in `handy-ds`.

Read `docs/rules.md` first: it covers setup, theming, contexts and the rules for app code. This file answers "which component, and what do I pass it".

**Three rules that apply to every entry below.**

1. The props listed here are the ones handy-ds adds. Every other prop belongs to the Base UI part underneath. Its types are in `handy-ds/dist/types`, and its behavior is documented in `node_modules/@base-ui/react/docs/react/components/{name}.md`.
2. Never set `className` to change a component's colors, spacing or radius. Those come from the theme. A visual change is a driver change or a mapping change (`docs/rules.md` sections 2 and 3).
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
| `priority` | `primary` (the main action, at most one per view), `secondary`, `tertiary` (toolbars, inline) | `primary` |
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
| `priority` | `primary`, `secondary`, `tertiary` | `primary` |
| `size` | `sm`, `md`, `lg` | `md` |

```tsx
<LinkButton href="/pricing">See pricing</LinkButton>
<LinkButton render={<RouterLink to="/pricing" />}>See pricing</LinkButton>
```

### Toggle, ToggleGroup

A button that stays pressed. `ToggleGroup` is a row of them.

- **Use when:** formatting controls (bold, italic), or picking one or several from a few options that are all visible.
- **Don't use when:** the setting applies immediately to a preference — use `Switch`. More than about five options — use `Select`.

No handy-ds props. `Toggle` is Action `secondary`; set `data-priority` to change it.

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

No handy-ds props.

```tsx
<Switch.Root defaultChecked><Switch.Thumb /></Switch.Root>
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

### Field, Input, Fieldset, Form

`Field` is one labelled form value: label, control, description, error. `Input` is a bare text input. `Fieldset` groups related fields inside a `Form`.

- **Use when:** any text entry. Use the full `Field` set so the label, description and error are wired to the control.
- **Don't use when:** there is no visible label — only then use bare `Input`, with an `aria-label`.

| Component | Prop | Values | Default |
|---|---|---|---|
| `Input` | `size` | `sm`, `md`, `lg` | `md` |

`Field.Control` takes `data-size` for the same axis.

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

### Checkbox, CheckboxGroup

Yes/no, or several from a few options.

- **Use when:** the value is submitted with a form, or several options can be picked at once.
- **Don't use when:** the change applies immediately. Use `Switch`.

No handy-ds props. Label it with `Field.Label` or a `<label>`.

```tsx
<Field.Root>
  <Field.Label><Checkbox.Root defaultChecked><Checkbox.Indicator /></Checkbox.Root>Subscribe</Field.Label>
</Field.Root>
```

### Radio, RadioGroup

One of a few options, all visible.

- **Use when:** two to five options and the user should see them all.
- **Don't use when:** more than about five options. Use `Select`.

No handy-ds props. Wrap the group in `Fieldset.Root` with a `Fieldset.Legend`.

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
<Card elevation={2}><Text variant="heading">Plan</Text><Text>…</Text></Card>
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

A value in a known range: storage used, a score.

- **Use when:** the number means something on its own.
- **Don't use when:** it is a task running to completion. Use `Progress`.

| Prop | Values | Default |
|---|---|---|
| `sentiment` (on `Meter.Root`) | `info`, `success`, `warning`, `danger` | `info` |

```tsx
<Meter.Root value={72} sentiment="warning">
  <Meter.Label>Storage</Meter.Label><Meter.Track><Meter.Indicator /></Meter.Track><Meter.Value />
</Meter.Root>
```

### Progress

Task completion: an upload, an import.

- **Use when:** something is running and will finish.
- **Don't use when:** the value is a measurement. Use `Meter`.

No handy-ds props. Pass `value={null}` when the duration is unknown.

---

## Type, Icon, Divider

### Text

Any text with a type role.

- **Use when:** any text that is not already inside a component that styles it.
- **Don't use when:** the text is a component's own label or description — those parts style themselves.

| Prop | Values | Default |
|---|---|---|
| `variant` | `display`, `heading`, `body`, `label`, `caption` | `body` |

Each variant has a default tag (`display` → `h1`, `heading` → `h2`, `body` → `p`, `label` → `span`, `caption` → `small`). Pick the correct heading level with `render`, which changes the tag and not the look.

```tsx
<Text variant="heading" render={<h3 />}>Billing</Text>
```

### Icon

Wraps an SVG so it takes an Icon color and size.

- **Use when:** any icon. The SVG must use `currentColor` for its stroke or fill.
- **Don't use when:** the image is content, not an icon. Use `<img>`.

| Prop | Values | Default |
|---|---|---|
| `variant` | `default`, `secondary`, `accent` | inherits the surrounding text color |
| `size` | any CSS length | the surrounding font size |
| `label` | string | none — the icon is hidden from assistive tech |

Give `label` to an icon that carries meaning on its own. Omit `variant` inside a Button or Alert so the icon matches the text around it.

```tsx
<Icon label="Search"><SearchSvg /></Icon>
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

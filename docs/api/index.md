# Component API

Every public component: name, purpose, when to use it, and its API page.

| Component | Purpose | Use when | Docs |
| --- | --- | --- | --- |
| Button | Triggers an action in place | The control submits, saves, opens, or confirms — anything not navigation | [button.md](button.md) |
| LinkButton | A link that looks like a primary Button | The control navigates to another page or view | [link-button.md](link-button.md) |
| Text | Applies a typography role to a run of text | Any free-standing text run — hero copy, headings, body, labels, captions | [text.md](text.md) |
| ToggleGroup | A group of buttons (`Toggle`) in one container, each pressed or not | Formatting controls or a few visible mode choices | [toggle.md](toggle.md) |
| Toolbar | A row of related controls with roving focus | Grouped buttons, toggles, or menu buttons that act on one thing | [toolbar.md](toolbar.md) |
| Switch | An instant on/off control | A setting that takes effect immediately, not a form value | [switch.md](switch.md) |
| Tabs | Switches between views in one place | One panel visible at a time in the same region | [tabs.md](tabs.md) |
| Menu | A list of commands in a popup | Actions or navigation inside a button, input, or context press | [menu.md](menu.md) |
| NavigationMenu | A site or section navigation bar | Primary navigation across pages or views | [navigation-menu.md](navigation-menu.md) |
| Field | A labeled form value: label, control, description, error | Any labeled text input; use plain Input only when the label is invisible | [field.md](field.md) |
| TextInput | A single-line field for free text | A name, a title, or a comment; typed fields (email, phone, password) are separate components | [text-input.md](text-input.md) |
| PasswordInput | A single-line field for a password, with a show/hide button | The user enters or confirms a password | [password-input.md](password-input.md) |
| SearchInput | A single-line field for a search query, with a clear button | The user types a query to find or filter items | [search-input.md](search-input.md) |
| EmailInput | A single-line field for one email address, with a mail icon | The user enters an email address | [email-input.md](email-input.md) |
| PhoneInput | A single-line field for a phone number, with a mask | The user enters a phone number | [phone-input.md](phone-input.md) |
| UrlInput | A single-line field for a web address, with a link icon | The user enters one web address | [url-input.md](url-input.md) |
| TextArea | A multi-line text field, with drag resize or auto grow | A message, a note, or a description that can run to several lines | [text-area.md](text-area.md) |
| NumberInput | A single-line field for an exact number, with optional − and + steppers | A price, an amount, or a quantity; use Slider for an approximate value | [number-field.md](number-field.md) |
| Checkbox | A yes/no or multi-select choice (`Checkbox.Group` holds several) | Submitted with a form, or selecting many of a few options | [checkbox.md](checkbox.md) |
| Radio | Pick one of 2–5 visible options (`Radio.Group` holds them) | The user must see all options and choose exactly one | [radio.md](radio.md) |
| Slider | Picks a number or a range by dragging a thumb along a track | An approximate value inside a known range; use NumberInput for an exact number | [slider.md](slider.md) |
| Select | A compact single-choice dropdown | One choice from many options in little space | [select.md](select.md) |
| Combobox | An input that filters options or accepts free text | Long option lists, or a value the user may type | [combobox.md](combobox.md) |
| Card | A surface box for related content | Grouping content at a chosen elevation; not for spacing alone | [card.md](card.md) |
| Dialog | A task that blocks the page in a modal | The user must finish or dismiss; AlertDialog confirms destructive actions | [dialog.md](dialog.md) |
| Popover | A non-blocking panel anchored to a trigger | Secondary content that keeps the page usable | [popover.md](popover.md) |
| Accordion | Show/hide sections with a trigger each | FAQs or scannable long content; one panel at a time | [accordion.md](accordion.md) |
| Alert | A static, sentiment-colored page message | The message must stay readable on the page; Toast is transient | [alert.md](alert.md) |
| Toast | A short-lived confirmation in a stacked viewport | Confirming something that needs no user action | [toast.md](toast.md) |
| Meter | A static measurement inside a known range | Use when the number means something on its own; use Progress for a running task | [meter.md](meter.md) |
| Progress | How much of a running task is complete | Use while a task runs; `value={null}` when the duration is unknown; use Meter for a measurement | [progress.md](progress.md) |
| Icon | Shows an SVG or glyph name in a text or status color and size | Any standalone icon; not for content images | [icon.md](icon.md) |
| Avatar | A person's photo in a round frame, with initials or an icon as fallback | Identifying a person or account next to a name; not for content images or logos | [avatar.md](avatar.md) |
| Separator | A line that marks a boundary between content groups | Use where spacing alone does not show the boundary; not for decoration | [separator.md](separator.md) |
| Table | A styled data table with themed rows and sort buttons | Real columns compared across rows; not for lists | [table.md](table.md) |
| Stack | Places children in one column with a token gap | The main flow of a page, form, or card body; not for rows or grids | [stack.md](stack.md) |
| Inline | Places children in a row that wraps | Buttons, tags, links, or an icon with a label; not for equal-size cards | [inline.md](inline.md) |
| Tiles | Places equal-size children in as many columns as fit | Card lists and galleries of equal weight; not when one item is larger | [tiles.md](tiles.md) |
| Flex | Places children in a row or column with full flexbox controls | A fixed item beside a filling item, or a direction that changes with the screen; not when Stack or Inline fits | [flex.md](flex.md) |
| Grid | Places children in columns, with `Grid.Item` for spans and starts | A dashboard or a page layout with a chosen column count; not for equal items (use Tiles) | [grid.md](grid.md) |
| Section | A full-width band of a page with a background and a centered column | Each macro part of a page: hero, feature row, call to action; not a box (use Card) | [section.md](section.md) |
| Header | The band at the top of a page (`<header>`) | Once per page for the title, logo, and main navigation | [header.md](header.md) |
| Footer | The band at the bottom of a page (`<footer>`) | Once per page for legal text and secondary links | [footer.md](footer.md) |
| Aside | A column of supporting content beside the main content (`<aside>`) | A side nav, an outline, sources, or related links; not a drawer | [aside.md](aside.md) |

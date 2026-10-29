# Component API

Every public component: name, purpose, when to use it, and its API page.

**JSON page**: "Yes" when the component works with plain prop values (text, numbers, true or false, lists, objects) and no event handlers or state. A page made from data, for example a JSON page tree that an agent edits, can use it. "No" needs code.

| Component | Purpose | Use when | JSON page | Docs |
| --- | --- | --- | --- | --- |
| Button | Triggers an action in place | The control submits, saves, opens, or confirms — anything not navigation | No | [button.md](button.md) |
| LinkButton | A link that looks like a primary Button | The control navigates to another page or view | Yes | [link-button.md](link-button.md) |
| Text | Applies a typography role to a run of text | Any free-standing text run — hero copy, headings, body, labels, captions | Yes | [text.md](text.md) |
| ToggleGroup | A group of buttons (`Toggle`) in one container, each pressed or not | Formatting controls or a few visible mode choices | No | [toggle.md](toggle.md) |
| Toolbar | A row of related controls with roving focus | Grouped buttons, toggles, or menu buttons that act on one thing | No | [toolbar.md](toolbar.md) |
| Switch | An instant on/off control | A setting that takes effect immediately, not a form value | No | [switch.md](switch.md) |
| Tabs | Switches between views in one place | One panel visible at a time in the same region | Yes | [tabs.md](tabs.md) |
| Menu | A list of commands in a popup | Actions or navigation inside a button, input, or context press | No | [menu.md](menu.md) |
| NavigationMenu | A site or section navigation bar | Primary navigation across pages or views | Yes | [navigation-menu.md](navigation-menu.md) |
| Field | A labeled form value: label, control, description, error | Any labeled text input; use plain Input only when the label is invisible | No | [field.md](field.md) |
| TextInput | A single-line field for free text | A name, a title, or a comment; typed fields (email, phone, password) are separate components | No | [text-input.md](text-input.md) |
| PasswordInput | A single-line field for a password, with a show/hide button | The user enters or confirms a password | No | [password-input.md](password-input.md) |
| SearchInput | A single-line field for a search query, with a clear button | The user types a query to find or filter items | No | [search-input.md](search-input.md) |
| EmailInput | A single-line field for one email address, with a mail icon | The user enters an email address | No | [email-input.md](email-input.md) |
| PhoneInput | A single-line field for a phone number, with a mask | The user enters a phone number | No | [phone-input.md](phone-input.md) |
| UrlInput | A single-line field for a web address, with a link icon | The user enters one web address | No | [url-input.md](url-input.md) |
| TextArea | A multi-line text field, with drag resize or auto grow | A message, a note, or a description that can run to several lines | No | [text-area.md](text-area.md) |
| NumberInput | A single-line field for an exact number, with optional − and + steppers | A price, an amount, or a quantity; use Slider for an approximate value | No | [number-field.md](number-field.md) |
| OtpInput | A row of single-character boxes for a one-time code | The user enters a short SMS, email, or authenticator code, or a PIN; use TextInput for longer values | No | [otp-field.md](otp-field.md) |
| Checkbox | A yes/no or multi-select choice (`Checkbox.Group` holds several) | Submitted with a form, or selecting many of a few options | No | [checkbox.md](checkbox.md) |
| Radio | Pick one of 2–5 visible options (`Radio.Group` holds them) | The user must see all options and choose exactly one | No | [radio.md](radio.md) |
| Slider | Picks a number or a range by dragging a thumb along a track | An approximate value inside a known range; use NumberInput for an exact number | No | [slider.md](slider.md) |
| Select | A compact single-choice dropdown | One choice from many options in little space | No | [select.md](select.md) |
| Combobox | An input that filters options or accepts free text | Long option lists, or a value the user may type | No | [combobox.md](combobox.md) |
| Card | A surface box for related content | Grouping content at a chosen elevation; not for spacing alone | Yes | [card.md](card.md) |
| Dialog | A box over the page for a short task that blocks the page | The user must finish or dismiss a task; AlertDialog confirms destructive actions; Drawer for longer content from an edge; Popover keeps the page usable | Yes | [dialog.md](dialog.md) |
| AlertDialog | Asks the user to confirm one action and waits for an answer | A destructive or irreversible action; Dialog for a task with fields | No | [alert-dialog.md](alert-dialog.md) |
| Drawer | A panel that slides in from a screen edge and blocks the page | Item details, filters, a cart, or the phone site menu; Dialog for a short task; Aside for content that stays | Yes | [drawer.md](drawer.md) |
| Popover | A non-blocking panel of short content anchored to a trigger | Secondary content or a small form that keeps the page usable; not commands (Menu), blocking tasks (Dialog), or hover content (Tooltip) | Yes | [popover.md](popover.md) |
| Tooltip | A short text label that shows on hover or focus of a control | Naming an icon-only control or a short hint; not interactive or required content (Popover) | Yes | [tooltip.md](tooltip.md) |
| PreviewCard | A preview of a link's destination that shows on hover or focus of the link | A summary of a linked page, profile, or item; not needed content or non-link controls (Tooltip, Popover) | Yes | [preview-card.md](preview-card.md) |
| Accordion | Show/hide sections with a trigger each | FAQs or scannable long content; one panel at a time | Yes | [accordion.md](accordion.md) |
| Alert | A static, sentiment-colored page message | The message must stay readable on the page; Toast is transient | Yes | [alert.md](alert.md) |
| Toast | A short message in the screen corner that closes by itself (`ToastProvider`, `useToast`) | Confirming a finished action, with an optional Undo; Alert for a message that stays | No | [toast.md](toast.md) |
| Meter | A static measurement inside a known range | Use when the number means something on its own; use Progress for a running task | Yes | [meter.md](meter.md) |
| Progress | How much of a running task is complete | Use while a task runs; `value={null}` when the duration is unknown; use Meter for a measurement | No | [progress.md](progress.md) |
| Icon | Shows an SVG or glyph name in a text or status color and size | Any standalone icon; not for content images | Yes | [icon.md](icon.md) |
| Avatar | A person's photo in a round frame, with initials or an icon as fallback | Identifying a person or account next to a name; not for content images or logos | Yes | [avatar.md](avatar.md) |
| Separator | A line that marks a boundary between content groups | Use where spacing alone does not show the boundary; not for decoration | Yes | [separator.md](separator.md) |
| Table | A styled data table with themed rows and sort buttons | Real columns compared across rows; not for lists | Yes | [table.md](table.md) |
| Stack | Places children in one column with a token gap | The main flow of a page, form, or card body; not for rows or grids | Yes | [stack.md](stack.md) |
| Inline | Places children in a row that wraps | Buttons, tags, links, or an icon with a label; not for equal-size cards | Yes | [inline.md](inline.md) |
| Tiles | Places equal-size children in as many columns as fit | Card lists and galleries of equal weight; not when one item is larger | Yes | [tiles.md](tiles.md) |
| Flex | Places children in a row or column with full flexbox controls | A fixed item beside a filling item, or a direction that changes with the screen; not when Stack or Inline fits | Yes | [flex.md](flex.md) |
| Grid | Places children in columns, with `Grid.Item` for spans and starts | A dashboard or a page layout with a chosen column count; not for equal items (use Tiles) | Yes | [grid.md](grid.md) |
| Animate | Plays a one-time entrance animation on each child | Sections, cards, or list items that enter the page; not for hover, press, or open and close effects | Yes | [animate.md](animate.md) |
| Section | A full-width band of a page with a background and a centered column | Each macro part of a page: hero, feature row, call to action; not a box (use Card) | Yes | [section.md](section.md) |
| Header | The band at the top of a page (`<header>`) | Once per page for the title, logo, and main navigation | Yes | [header.md](header.md) |
| Footer | The band at the bottom of a page (`<footer>`) | Once per page for legal text and secondary links | Yes | [footer.md](footer.md) |
| Aside | A column of supporting content beside the main content (`<aside>`) | A side nav, an outline, sources, or related links; not a drawer | Yes | [aside.md](aside.md) |

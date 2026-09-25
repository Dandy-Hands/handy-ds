// Showcase: every component on one page, ported from the old demo/main.tsx.
// Themed by the live theme CSS injected in Layout.tsx, so the flyout re-themes it.
import {
  Accordion, Alert, Autocomplete, Button, Card, Checkbox, Combobox, Dialog, Field, Fieldset, Form, Icon, Input,
  LinkButton, Menu, Menubar, Meter, NavigationMenu, NumberField, Popover, Progress, Radio, RadioGroup, Select,
  Separator, Switch, Table, Tabs, Text, Toast, Toaster, Toggle, ToggleGroup, Toolbar,
} from 'handy-ds';

const Star = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M12 2l3 7 7 .6-5.3 4.7 1.6 7L12 17.8 5.7 21.3l1.6-7L2 9.6 9 9z" />
  </svg>
);

const fruits = ['Apple', 'Banana', 'Cherry', 'Grape', 'Mango', 'Orange', 'Pear'];

function ToastButton() {
  const manager = Toast.useToastManager();
  return (
    <ToggleGroup>
      {(['info', 'success', 'warning', 'danger'] as const).map((type) => (
        <Button key={type} priority="secondary" onClick={() => manager.add({ type, title: `${type} toast`, description: 'Something happened.' })}>{type}</Button>
      ))}
    </ToggleGroup>
  );
}

function ShowcaseBody() {
  return (
    <>
      <section data-section="hero" className="hero">
        <Text variant="display">Client site hero</Text>
        <Text>This section uses <code>data-section="hero"</code>. The section color rules driver maps it to the on-primary context.</Text>
        <div className="row">
          <Button>Primary</Button>
          <Button priority="secondary">Secondary</Button>
          <Button priority="tertiary">Tertiary</Button>
          <Icon variant="accent" size="1.5em" label="Accent icon"><Star /></Icon>
        </div>
        <div className="row">
          <Input placeholder="Email in a hero" />
          <Switch.Root defaultChecked><Switch.Thumb /></Switch.Root>
          <Checkbox.Root defaultChecked><Checkbox.Indicator /></Checkbox.Root>
        </div>
        <Card elevation={1} data-context="default" className="nested">
          <Text variant="label">Nested data-context="default" resets to :root tokens</Text>
          <div className="row"><Button>Primary</Button><Button priority="tertiary">Tertiary</Button></div>
        </Card>
      </section>

      <main className="grid">
        <Card>
          <Text variant="heading" render={<h2 />}>Actions</Text>
          <div className="row">
            <Button>Primary</Button>
            <Button priority="secondary">Secondary</Button>
            <Button priority="tertiary">Tertiary</Button>
            <Button disabled>Disabled</Button>
            <LinkButton href="#" priority="secondary">Link button</LinkButton>
          </div>
          <div className="row">
            <ToggleGroup defaultValue={['b']}>
              <Toggle value="b">Bold</Toggle><Toggle value="i">Italic</Toggle><Toggle value="u">Underline</Toggle>
            </ToggleGroup>
            <Switch.Root><Switch.Thumb /></Switch.Root>
          </div>
          <Toolbar.Root>
            <Toolbar.Button>Cut</Toolbar.Button>
            <Toolbar.Button>Copy</Toolbar.Button>
            <Toolbar.Separator />
            <Toolbar.Input placeholder="Search" />
          </Toolbar.Root>
        </Card>

        <Card>
          <Text variant="heading" render={<h2 />}>Form</Text>
          <Form onSubmit={(e) => e.preventDefault()}>
            <Field.Root>
              <Field.Label>Name</Field.Label>
              <Field.Control placeholder="Jane Doe" required />
              <Field.Description>As it appears on your ID.</Field.Description>
            </Field.Root>
            <Field.Root invalid>
              <Field.Label>Email</Field.Label>
              <Field.Control defaultValue="not-an-email" />
              <Field.Error match>Enter a valid email.</Field.Error>
            </Field.Root>
            <Field.Root>
              <Field.Label>Quantity</Field.Label>
              <NumberField.Root defaultValue={2} min={0}>
                <NumberField.Group><NumberField.Decrement /><NumberField.Input /><NumberField.Increment /></NumberField.Group>
              </NumberField.Root>
            </Field.Root>
            <Field.Root>
              <Fieldset.Root render={<RadioGroup defaultValue="card" />}>
                <Fieldset.Legend>Payment</Fieldset.Legend>
                <Field.Item><Field.Label><Radio.Root value="card"><Radio.Indicator /></Radio.Root>Card</Field.Label></Field.Item>
                <Field.Item><Field.Label><Radio.Root value="bank"><Radio.Indicator /></Radio.Root>Bank transfer</Field.Label></Field.Item>
                <Field.Item><Field.Label><Radio.Root value="cash" disabled><Radio.Indicator /></Radio.Root>Cash (unavailable)</Field.Label></Field.Item>
              </Fieldset.Root>
            </Field.Root>
            <Field.Root><Field.Label><Checkbox.Root defaultChecked><Checkbox.Indicator /></Checkbox.Root>Subscribe</Field.Label></Field.Root>
            <Field.Root><Field.Label><Checkbox.Root indeterminate><Checkbox.Indicator /></Checkbox.Root>Some selected</Field.Label></Field.Root>
            <Field.Root disabled><Field.Label><Checkbox.Root defaultChecked><Checkbox.Indicator /></Checkbox.Root>Disabled checked</Field.Label></Field.Root>
            <div className="row"><Input size="sm" placeholder="sm" /><Input placeholder="md" /><Input size="lg" placeholder="lg" /></div>
            <Input disabled placeholder="Disabled" />
            <Button type="submit">Submit</Button>
          </Form>
        </Card>

        <Card>
          <Text variant="heading" render={<h2 />}>Pickers</Text>
          <Select.Root items={fruits.map((f) => ({ label: f, value: f }))} defaultValue="Banana">
            <Select.Label>Select</Select.Label>
            <Select.Trigger><Select.Value /><Select.Icon /></Select.Trigger>
            <Select.Portal>
              <Select.Positioner>
                <Select.Popup>
                  <Select.List>
                    {fruits.map((f) => (
                      <Select.Item key={f} value={f}><Select.ItemText>{f}</Select.ItemText><Select.ItemIndicator /></Select.Item>
                    ))}
                  </Select.List>
                </Select.Popup>
              </Select.Positioner>
            </Select.Portal>
          </Select.Root>
          <Separator />
          <Field.Root>
          <Field.Label>Combobox</Field.Label>
          <Combobox.Root items={fruits}>
            <Combobox.InputGroup><Combobox.Input placeholder="Pick a fruit" /><Combobox.Clear /><Combobox.Trigger /></Combobox.InputGroup>
            <Combobox.Portal>
              <Combobox.Positioner sideOffset={4}>
                <Combobox.Popup>
                  <Combobox.Empty>No fruit found.</Combobox.Empty>
                  <Combobox.List>
                    {(item: string) => <Combobox.Item key={item} value={item}>{item}<Combobox.ItemIndicator /></Combobox.Item>}
                  </Combobox.List>
                </Combobox.Popup>
              </Combobox.Positioner>
            </Combobox.Portal>
          </Combobox.Root>
          </Field.Root>
          <Separator />
          <Autocomplete.Root items={fruits}>
            <Autocomplete.InputGroup><Autocomplete.Input placeholder="Autocomplete" /></Autocomplete.InputGroup>
            <Autocomplete.Portal>
              <Autocomplete.Positioner sideOffset={4}>
                <Autocomplete.Popup>
                  <Autocomplete.List>
                    {(item: string) => <Autocomplete.Item key={item} value={item}>{item}</Autocomplete.Item>}
                  </Autocomplete.List>
                </Autocomplete.Popup>
              </Autocomplete.Positioner>
            </Autocomplete.Portal>
          </Autocomplete.Root>
        </Card>

        <Card>
          <Text variant="heading" render={<h2 />}>Navigation</Text>
          <NavigationMenu.Root>
            <NavigationMenu.List>
              <NavigationMenu.Item><NavigationMenu.Link href="#" active>Home</NavigationMenu.Link></NavigationMenu.Item>
              <NavigationMenu.Item>
                <NavigationMenu.Trigger>Products<NavigationMenu.Icon /></NavigationMenu.Trigger>
                <NavigationMenu.Content>
                  <NavigationMenu.Link href="#">Widgets</NavigationMenu.Link>
                  <NavigationMenu.Link href="#">Gadgets</NavigationMenu.Link>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
            </NavigationMenu.List>
            <NavigationMenu.Portal>
              <NavigationMenu.Positioner sideOffset={8}>
                <NavigationMenu.Popup><NavigationMenu.Viewport /></NavigationMenu.Popup>
              </NavigationMenu.Positioner>
            </NavigationMenu.Portal>
          </NavigationMenu.Root>
          <Menubar>
            <Menu.Root>
              <Menu.Trigger data-priority="tertiary">File</Menu.Trigger>
              <Menu.Portal>
                <Menu.Positioner sideOffset={4}>
                  <Menu.Popup>
                    <Menu.Item>New</Menu.Item>
                    <Menu.Item>Open…</Menu.Item>
                    <Menu.Separator />
                    <Menu.CheckboxItem defaultChecked>Autosave<Menu.CheckboxItemIndicator /></Menu.CheckboxItem>
                    <Menu.Item disabled>Delete</Menu.Item>
                  </Menu.Popup>
                </Menu.Positioner>
              </Menu.Portal>
            </Menu.Root>
            <Menu.Root>
              <Menu.Trigger data-priority="tertiary">View</Menu.Trigger>
              <Menu.Portal>
                <Menu.Positioner sideOffset={4}>
                  <Menu.Popup>
                    <Menu.RadioGroup defaultValue="list">
                      <Menu.GroupLabel>Layout</Menu.GroupLabel>
                      <Menu.RadioItem value="list">List<Menu.RadioItemIndicator /></Menu.RadioItem>
                      <Menu.RadioItem value="grid">Grid<Menu.RadioItemIndicator /></Menu.RadioItem>
                    </Menu.RadioGroup>
                  </Menu.Popup>
                </Menu.Positioner>
              </Menu.Portal>
            </Menu.Root>
          </Menubar>
          <Tabs.Root defaultValue="one">
            <Tabs.List>
              <Tabs.Tab value="one">Overview</Tabs.Tab>
              <Tabs.Tab value="two">Details</Tabs.Tab>
              <Tabs.Tab value="three">Reviews</Tabs.Tab>
              <Tabs.Indicator />
            </Tabs.List>
            <Tabs.Panel value="one"><Text>Overview panel. Tab panels carry no tokens.</Text></Tabs.Panel>
            <Tabs.Panel value="two"><Text>Details panel.</Text></Tabs.Panel>
            <Tabs.Panel value="three"><Text>Reviews panel.</Text></Tabs.Panel>
          </Tabs.Root>
        </Card>

        <Card>
          <Text variant="heading" render={<h2 />}>Overlays</Text>
          <div className="row">
            <Dialog.Root>
              <Dialog.Trigger data-priority="primary">Open dialog</Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Backdrop />
                <Dialog.Popup>
                  <Dialog.Title>Delete project?</Dialog.Title>
                  <Dialog.Description>This removes it for everyone.</Dialog.Description>
                  <div className="row"><Dialog.Close>Cancel</Dialog.Close><Dialog.Close data-priority="primary">Delete</Dialog.Close></div>
                </Dialog.Popup>
              </Dialog.Portal>
            </Dialog.Root>
            <Popover.Root>
              <Popover.Trigger>Popover</Popover.Trigger>
              <Popover.Portal>
                <Popover.Positioner sideOffset={8}>
                  <Popover.Popup>
                    <Popover.Title>Notifications</Popover.Title>
                    <Popover.Description>You are all caught up.</Popover.Description>
                  </Popover.Popup>
                </Popover.Positioner>
              </Popover.Portal>
            </Popover.Root>
          </div>
          <Accordion.Root>
            {['Shipping', 'Returns'].map((q) => (
              <Accordion.Item key={q}>
                <Accordion.Header><Accordion.Trigger>{q}</Accordion.Trigger></Accordion.Header>
                <Accordion.Panel>{q} details go here.</Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </Card>

        <Card>
          <Text variant="heading" render={<h2 />}>Feedback</Text>
          {(['info', 'success', 'warning', 'danger'] as const).map((s) => (
            <Alert key={s} sentiment={s} heading={`${s[0].toUpperCase()}${s.slice(1)}`} icon={<Icon><Star /></Icon>}>A {s} message.</Alert>
          ))}
          <ToastButton />
          <Meter.Root value={72} sentiment="success"><Meter.Label>Storage</Meter.Label><Meter.Value /><Meter.Track><Meter.Indicator /></Meter.Track></Meter.Root>
          <Progress.Root value={40}><Progress.Label>Upload</Progress.Label><Progress.Value /><Progress.Track><Progress.Indicator /></Progress.Track></Progress.Root>
          <Progress.Root value={null}><Progress.Label>Working…</Progress.Label><Progress.Track><Progress.Indicator /></Progress.Track></Progress.Root>
        </Card>

        <Card className="wide">
          <Text variant="heading" render={<h2 />}>Data Table</Text>
          <Table striped>
            <thead>
              <tr><th aria-sort="ascending"><button type="button">Name</button></th><th>Role</th><th>Status</th></tr>
            </thead>
            <tbody>
              {[['Ada', 'Engineer', 'Active'], ['Grace', 'Admiral', 'Away'], ['Linus', 'Maintainer', 'Active'], ['Margaret', 'Director', 'Active']].map((r) => (
                <tr key={r[0]}>{r.map((c) => <td key={c}>{c}</td>)}</tr>
              ))}
            </tbody>
          </Table>
        </Card>

        <Card className="wide">
          <Text variant="heading" render={<h2 />}>Type and Icon</Text>
          <Text variant="display">Display</Text>
          <Text variant="heading" render={<h3 />}>Heading</Text>
          <Text>Body text. The quick brown fox jumps over the lazy dog.</Text>
          <Text variant="label">Label</Text> <Text variant="caption">Caption</Text>
          <Separator weight="medium" />
          <div className="row">
            <Icon variant="default" size="1.5em" label="Default"><Star /></Icon>
            <Icon variant="secondary" size="1.5em" label="Secondary"><Star /></Icon>
            <Icon variant="accent" size="1.5em" label="Accent"><Star /></Icon>
          </div>
        </Card>
      </main>
    </>
  );
}

export function Showcase() {
  return (
    <Toast.Provider>
      <div className="showcase">
        <ShowcaseBody />
        <Toaster />
      </div>
    </Toast.Provider>
  );
}

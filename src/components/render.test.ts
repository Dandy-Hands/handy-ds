// Server-renders components through Vite (it compiles .tsx and stubs CSS imports, which
// node can't) and checks the hds classes and Base UI state attributes land in the markup.
import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToString } from 'react-dom/server';
import { createServer } from 'vite';

const server = await createServer({
  configFile: false,
  logLevel: 'silent',
  appType: 'custom',
  server: { middlewareMode: true, hmr: false, ws: false },
  optimizeDeps: { noDiscovery: true },
});
after(() => server.close());
const hds = await server.ssrLoadModule('/src/index.ts');
const html = (el: ReturnType<typeof h>) => renderToString(el);

test('Button: Base UI button with action classes and priority', () => {
  const out = html(h(hds.Button, { priority: 'secondary' }, 'Save'));
  assert.match(out, /<button[^>]*class="hds-button hds-action"[^>]*>Save<\/button>/);
  assert.match(out, /data-priority="secondary"/);
  assert.match(html(h(hds.Button, { disabled: true }, 'x')), /disabled/);
  assert.match(html(h(hds.Button, { className: 'extra' }, 'x')), /class="hds-button hds-action extra"/);
});

test('every component renders with its hds classes', () => {
  const H = hds;
  const cases: [string, ReturnType<typeof h>, RegExp[]][] = [
    ['Input', h(H.Input, { size: 'sm', placeholder: 'x' }), [/<input[^>]*class="hds-control"/, /data-size="sm"/]],
    ['Field', h(H.Field.Root, null, h(H.Field.Label, null, 'Name'), h(H.Field.Control), h(H.Field.Description, null, 'd')),
      [/hds-field"/, /hds-field__label/, /<input[^>]*hds-control/, /hds-field__description/]],
    ['Fieldset+Form', h(H.Form, null, h(H.Fieldset.Root, null, h(H.Fieldset.Legend, null, 'L'))), [/<form[^>]*hds-form/, /hds-fieldset__legend/]],
    ['Checkbox', h(H.Checkbox.Root, { defaultChecked: true }, h(H.Checkbox.Indicator)), [/hds-checkbox"/, /data-checked/, /<svg/]],
    ['Radio', h(H.RadioGroup, { defaultValue: 'a' }, h(H.Radio.Root, { value: 'a' }, h(H.Radio.Indicator))), [/hds-choice-group/, /hds-radio"/, /data-checked/]],
    ['NumberField', h(H.NumberField.Root, { defaultValue: 1 }, h(H.NumberField.Group, null, h(H.NumberField.Decrement), h(H.NumberField.Input), h(H.NumberField.Increment))),
      [/hds-control"/, /hds-control__input/, /hds-control__button/]],
    ['Select', h(H.Select.Root, null, h(H.Select.Trigger, null, h(H.Select.Value, { placeholder: 'Pick' }), h(H.Select.Icon))), [/hds-control hds-select__trigger/, /hds-select__icon/]],
    ['Combobox', h(H.Combobox.Root, { items: ['a'] }, h(H.Combobox.InputGroup, null, h(H.Combobox.Input), h(H.Combobox.Trigger))), [/hds-control"/, /hds-control__input/]],
    ['Autocomplete', h(H.Autocomplete.Root, { items: ['a'] }, h(H.Autocomplete.InputGroup, null, h(H.Autocomplete.Input))), [/hds-control"/]],
    ['Switch', h(H.Switch.Root, { defaultChecked: true }, h(H.Switch.Thumb)), [/hds-switch"/, /hds-switch__thumb/, /data-checked/]],
    ['Tabs', h(H.Tabs.Root, { defaultValue: 'a' }, h(H.Tabs.List, null, h(H.Tabs.Tab, { value: 'a' }, 'A'), h(H.Tabs.Tab, { value: 'b' }, 'B')), h(H.Tabs.Panel, { value: 'a' }, 'P')),
      [/hds-tabs"/, /hds-action hds-tabs__tab/, /data-priority="tertiary"/, /data-active/, /hds-tabs__panel/]],
    ['Toggle', h(H.ToggleGroup, null, h(H.Toggle, { defaultPressed: true, value: 'x' }, 'B')), [/hds-toggle-group/, /hds-button hds-action/]],
    ['Toolbar', h(H.Toolbar.Root, null, h(H.Toolbar.Button, null, 'x'), h(H.Toolbar.Separator)), [/hds-button hds-action/, /hds-separator/]],
    ['Menu', h(H.Menubar, null, h(H.Menu.Root, null, h(H.Menu.Trigger, { 'data-priority': 'tertiary' }, 'File'))), [/hds-menubar/, /hds-button hds-action/, /data-priority="tertiary"/]],
    ['ContextMenu', h(H.ContextMenu.Root, null, h(H.ContextMenu.Trigger, null, 'area')), [/area/]],
    ['NavigationMenu', h(H.NavigationMenu.Root, null, h(H.NavigationMenu.List, null, h(H.NavigationMenu.Item, null, h(H.NavigationMenu.Link, { href: '/', active: true }, 'Home')))),
      [/hds-nav"/, /hds-nav__list/, /hds-nav__link/, /data-active/]],
    ['Card', h(H.Card, { elevation: 2 }, 'c'), [/<div[^>]*hds-surface hds-card/, /data-elevation="2"/]],
    ['Card render', h(H.Card, { render: h('article') }, 'c'), [/<article[^>]*hds-card/]],
    ['Dialog', h(H.Dialog.Root, null, h(H.Dialog.Trigger, null, 'Open')), [/<button[^>]*hds-button hds-action/]],
    ['Popover', h(H.Popover.Root, null, h(H.Popover.Trigger, null, 'Open')), [/hds-button hds-action/]],
    ['Accordion', h(H.Accordion.Root, null, h(H.Accordion.Item, null, h(H.Accordion.Header, null, h(H.Accordion.Trigger, null, 'Q')), h(H.Accordion.Panel, null, 'A'))),
      [/hds-accordion"/, /hds-accordion__item/, /hds-action hds-accordion__trigger/]],
    ['Alert', h(H.Alert, { sentiment: 'danger', heading: 'Oops' }, 'Body'), [/hds-feedback hds-alert/, /data-sentiment="danger"/, /hds-feedback__heading[^>]*>Oops/]],
    ['Toaster', h(H.Toast.Provider, null, h(H.Toaster)), [/^/]],
    ['Meter', h(H.Meter.Root, { value: 50, sentiment: 'success' }, h(H.Meter.Track, null, h(H.Meter.Indicator))), [/hds-meter"/, /data-sentiment="success"/, /hds-meter__indicator/]],
    ['Progress', h(H.Progress.Root, { value: null }, h(H.Progress.Track, null, h(H.Progress.Indicator))), [/hds-meter hds-progress/, /data-indeterminate/]],
    ['Text', h(H.Text, { variant: 'heading', render: h('h3') }, 'T'), [/<h3[^>]*hds-text/, /data-variant="heading"/]],
    ['Text default tag', h(H.Text, { variant: 'caption' }, 'T'), [/<small[^>]*hds-text/]],
    ['Icon', h(H.Icon, { variant: 'accent', label: 'Star' }, h('svg')), [/hds-icon/, /role="img"/, /aria-label="Star"/, /data-variant="accent"/]],
    ['Separator', h(H.Separator, { weight: 'thick' }), [/hds-separator/, /data-weight="thick"/]],
    ['Table', h(H.Table, { striped: true }, h('tbody', null, h('tr', null, h('td', null, '1')))), [/<table[^>]*hds-table/, /data-striped/]],
  ];
  for (const [name, el, patterns] of cases) {
    const out = html(el);
    for (const p of patterns) assert.match(out, p, `${name}: ${out}`);
  }
});

test('LinkButton: an <a> with button styling', () => {
  assert.match(html(h(hds.LinkButton, { href: '/x' }, 'Go')), /<a[^>]*class="hds-button hds-action"[^>]*href="\/x"|<a[^>]*href="\/x"[^>]*class="hds-button hds-action"/);
});

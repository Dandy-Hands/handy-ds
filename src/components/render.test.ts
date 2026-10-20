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

test('Button: Base UI button with action classes and variant', () => {
  const out = html(h(hds.Button, { variant: 'secondary' }, 'Save'));
  assert.match(out, /<button[^>]*class="hds-button hds-action"[^>]*>Save<\/button>/);
  assert.match(out, /data-variant="secondary"/);
  assert.match(html(h(hds.Button, { disabled: true }, 'x')), /disabled/);
  assert.match(html(h(hds.Button, { width: 'full', size: '1200' }, 'x')), /data-width="full"[^>]*/);
});

test('every component renders with its hds classes', () => {
  const H = hds;
  const cases: [string, ReturnType<typeof h>, RegExp[]][] = [
    ['TextInput', h(H.TextInput, { size: '800', placeholder: 'x', start: 's', end: 'e' }),
      [/<div[^>]*class="hds-control hds-text-input"[^>]*data-size="800"/, /hds-text-input__start/, /<input[^>]*type="text"[^>]*class="hds-control__input"/, /hds-text-input__end/]],
    ['PasswordInput', h(H.PasswordInput, { size: '800', start: 's' }),
      [/hds-control hds-text-input"[^>]*data-size="800"/, /<input[^>]*type="password"/, /autoComplete="current-password"|autocomplete="current-password"/, /aria-pressed="false"/, /aria-label="Show password"/, />visibility</]],
    ['SearchInput', h(H.SearchInput, { size: '800', defaultValue: 'q' }),
      [/hds-control hds-text-input hds-search-input"[^>]*data-size="800"/, /<input[^>]*type="search"/, /inputMode="search"|inputmode="search"/, />search</, /aria-label="Clear search"/, />close</]],
    ['EmailInput', h(H.EmailInput, { size: '800' }),
      [/hds-control hds-text-input"[^>]*data-size="800"/, /<input[^>]*type="email"/, /inputMode="email"|inputmode="email"/, /autoComplete="email"|autocomplete="email"/, /pattern="/, />mail</]],
    ['Field', h(H.Field.Root, null, h(H.Field.Label, null, 'Name'), h(H.Field.Control), h(H.Field.Description, null, 'd')),
      [/hds-field"/, /hds-field__label/, /<input[^>]*hds-control/, /hds-field__description/]],
    ['Fieldset+Form', h(H.Form, null, h(H.Fieldset.Root, null, h(H.Fieldset.Legend, null, 'L'))), [/<form[^>]*hds-form/, /hds-fieldset__legend/]],
    ['Checkbox', h(H.Checkbox.Group, { defaultValue: ['a'] }, h(H.Checkbox, { value: 'a', size: '600' })),
      [/hds-checkbox-group/, /data-orientation="vertical"/, /hds-checkbox"/, /data-size="600"/, /data-checked/, />check_box</, />indeterminate_check_box</, />check_box_outline_blank</]],
    ['Radio', h(H.Radio.Group, { defaultValue: 'a', orientation: 'horizontal' }, h(H.Radio, { value: 'a', size: '600' })),
      [/hds-radio-group/, /data-orientation="horizontal"/, /hds-radio"/, /data-size="600"/, /data-checked/, />radio_button_checked</, />radio_button_unchecked</]],
    ['NumberField', h(H.NumberField.Root, { defaultValue: 1 }, h(H.NumberField.Group, null, h(H.NumberField.Decrement), h(H.NumberField.Input), h(H.NumberField.Increment))),
      [/hds-control"/, /hds-control__input/, /hds-control__button/]],
    ['Select', h(H.Select.Root, null, h(H.Select.Trigger, null, h(H.Select.Value, { placeholder: 'Pick' }), h(H.Select.Icon))), [/hds-control hds-select__trigger/, /hds-select__icon/]],
    ['Combobox', h(H.Combobox.Root, { items: ['a'] }, h(H.Combobox.InputGroup, null, h(H.Combobox.Input), h(H.Combobox.Trigger))), [/hds-control"/, /hds-control__input/]],
    ['Autocomplete', h(H.Autocomplete.Root, { items: ['a'] }, h(H.Autocomplete.InputGroup, null, h(H.Autocomplete.Input))), [/hds-control"/]],
    ['Switch', h(H.Switch, { defaultChecked: true, size: '600' }), [/hds-switch"/, /data-size="600"/, /data-checked/, /hds-switch__on/]],
    ['Tabs', h(H.Tabs.Root, { defaultValue: 'a' }, h(H.Tabs.List, null, h(H.Tabs.Tab, { value: 'a' }, 'A'), h(H.Tabs.Tab, { value: 'b' }, 'B')), h(H.Tabs.Panel, { value: 'a' }, 'P')),
      [/hds-tabs"/, /hds-action hds-tabs__tab/, /data-priority="tertiary"/, /data-active/, /hds-tabs__panel/]],
    ['Toggle', h(H.ToggleGroup, { defaultValue: ['x'] }, h(H.Toggle, { value: 'x' }, 'B')), [/hds-toggle-group"/, /hds-button hds-action hds-toggle"/]],
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
    ['Slider', h(H.Slider.Root, { defaultValue: [20, 80], size: '400' }, h(H.Slider.Control)), [/hds-slider"/, /data-size="400"/, /hds-slider__thumb/, /data-index="1"/]],
    ['Meter',h(H.Meter.Root, { value: 50, tone: 'success', size: '400' }, h(H.Meter.Track, null, h(H.Meter.Indicator))), [/hds-meter"/, /data-tone="success"/, /data-size="400"/, /hds-meter__indicator/]],
    ['Avatar', h(H.Avatar.Root, { size: '1600' }, h(H.Avatar.Fallback, null, 'RL')), [/hds-avatar"/, /data-size="1600"/, /hds-avatar__fallback/, />RL</]],
    ['Progress', h(H.Progress.Root, { value: null }, h(H.Progress.Track, null, h(H.Progress.Indicator))), [/hds-meter hds-progress/, /data-indeterminate/, /data-size="300"/, /role="progressbar"/]],
    ['Text', h(H.Text, { variant: 'headline', render: h('h3') }, 'T'), [/<h3[^>]*hds-text/, /data-variant="headline"/]],
    ['Text axes', h(H.Text, { size: 'lg', tone: 'danger', maxLines: 2 }, 'T'), [/<p[^>]*data-size="lg"/, /data-tone="danger"/, /data-max-lines="2"/, /--_max-lines:\s*2/]],
    ['Text default tag', h(H.Text, { variant: 'caption' }, 'T'), [/<small[^>]*hds-text/]],
    ['Icon', h(H.Icon, { tone: 'accent', label: 'Star' }, h('svg')), [/hds-icon/, /role="img"/, /aria-label="Star"/, /data-tone="accent"/]],
    ['Separator', h(H.Separator, { tone: 'strong', orientation: 'vertical' }), [/hds-separator/, /role="separator"/, /data-tone="strong"/, /aria-orientation="vertical"/]],
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

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTheme } from '../../../src/tokens/theme.ts';
import { bestFg, configText, leaves, pairFailure, reduce, setIn, withPickPart, type History } from './model.ts';

test('setIn keeps the state a diff from the defaults', () => {
  let s = setIn({}, ['color', 'floor'], 0.7);
  assert.deepEqual(s, { color: { floor: 0.7 } });
  s = setIn(s, ['color', 'floor'], 0.5); // the default value removes the key
  assert.deepEqual(s, {});
  s = setIn({}, ['picks', 'action/primary/default/bg'], 'secondary/600');
  assert.deepEqual(leaves(s), [['picks', 'action/primary/default/bg']]);
});

test('withPickPart collapses a pick with no dark part', () => {
  assert.deepEqual(withPickPart('primary/600', 'dark', 'primary/300'), { light: 'primary/600', dark: 'primary/300' });
  assert.equal(withPickPart({ light: 'primary/600', dark: 'primary/300' }, 'dark', undefined), 'primary/600');
});

test('history: a slider drag is one undo step; undo and redo round-trip', () => {
  let h: History = { past: [], present: {}, future: [] };
  h = reduce(h, { type: 'set', path: ['density'], value: 1.1, at: 0 });
  h = reduce(h, { type: 'set', path: ['density'], value: 1.2, at: 100 });
  assert.equal(h.past.length, 1);
  h = reduce(h, { type: 'undo' });
  assert.deepEqual(h.present, {});
  h = reduce(h, { type: 'redo' });
  assert.deepEqual(h.present, { density: 1.2 });
});

test('configText is an ES module whose default export round-trips', async () => {
  const text = configText({ density: 1.2 }, 'Acme', '1.0.0');
  const mod = await import(`data:text/javascript,${encodeURIComponent(text)}`);
  assert.deepEqual(mod.default, { meta: { client: 'Acme', version: '1.0.0' }, density: 1.2 });
});

test('pairFailure blocks a text color that fails on its background', () => {
  const theme = buildTheme();
  // neutral/50 text passes on the primary/600 default button; primary/600 text on it fails.
  assert.equal(pairFailure(theme, 'action/primary/default/fg', 'neutral/50', ['light'], 'default'), null);
  assert.notEqual(pairFailure(theme, 'action/primary/default/fg', 'primary/600', ['light'], 'default'), null);
});

test('action bg: limited by 3:1 against the surfaces, not by its fg', () => {
  const theme = buildTheme();
  // neutral/900 bg fails 4.5:1 with the neutral/50 fg, but it stands out from the surfaces.
  assert.equal(pairFailure(theme, 'action/primary/default/bg', 'neutral/900', ['light'], 'default'), null);
  // neutral/100 bg disappears into the light surfaces.
  assert.notEqual(pairFailure(theme, 'action/primary/default/bg', 'neutral/100', ['light'], 'default'), null);
  // A transparent bg is exempt.
  assert.equal(pairFailure(theme, 'action/primary/default/bg', 'transparent', ['light', 'dark'], 'default'), null);
});

test('bestFg picks a fg that passes 4.5:1 on a light bg', () => {
  const theme = buildTheme({ picks: { 'action/primary/default/bg': 'primary/200' } });
  const fg = bestFg(theme, 'default', 'action/primary/default/bg');
  const after = buildTheme({ picks: { 'action/primary/default/bg': 'primary/200', 'action/primary/default/fg': fg } });
  assert.equal(after.contrast.filter((f) => f.fg.endsWith('action/primary/default/fg')).length, 0);
});

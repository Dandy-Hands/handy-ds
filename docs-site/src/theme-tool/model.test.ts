import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTheme } from '../../../src/tokens/theme.ts';
import { configText, leaves, pairFailure, reduce, setIn, withPickPart, type History } from './model.ts';

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

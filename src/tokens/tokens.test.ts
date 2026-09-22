import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTheme } from './theme.ts';
import { checkTokenName } from './names.ts';
import { ramp } from './primitives.ts';
import { formatHex } from 'culori';

const base = buildTheme();

const other = buildTheme({
  drivers: {
    color: { primary: '#0f766e', accent: '#be185d', neutral: '#78716c' },
    typography: { baseSize: 18, scaleRatio: 1.2 },
    density: 0.85,
    radius: 2,
    style: { action: { radius: 'full' } },
    shadow: { strength: 0 },
  },
});

test('primitive names are frozen: independent of driver values, all valid', () => {
  assert.deepEqual(Object.keys(other.primitives), Object.keys(base.primitives));
  for (const name of Object.keys(base.primitives)) assert.equal(checkTokenName(name), null, name);
});

test('every Theme Map name passes the validator, in every context', () => {
  for (const name of [...Object.keys(base.map.default), ...Object.keys(base.map['on-primary'])]) {
    assert.equal(checkTokenName(name), null, name);
  }
});

test('Theme Map covers every token in spec section 7 grammar', () => {
  // Counts per category follow from the validator's slot lists (full matrices).
  const count = (prefix: string) => Object.keys(base.map.default).filter((n) => n.startsWith(`hds/sem/${prefix}/`)).length;
  assert.equal(count('action'), 3 * 6 * 3 + 3 * 5);
  assert.equal(count('input'), 6 * 4 + 3 * 5);
  assert.equal(count('surface'), 4 * 2 * 3 + 3);
  assert.equal(count('type'), 5 * (1 + 3 + 2));
  assert.equal(count('icon'), 3);
  assert.equal(count('divider'), 1 + 3);
  assert.equal(count('feedback'), 4 * 4 + 4);
  assert.equal(count('overlay'), 1);
  assert.equal(count('focus'), 2);
});

test('driver change regenerates primitives; semantic mapping is unchanged', () => {
  assert.notEqual(other.primitives['hds/prim/color/primary/600'], base.primitives['hds/prim/color/primary/600']);
  assert.equal(other.primitives['hds/prim/space/4'], '13.6px');
  assert.equal(other.primitives['hds/prim/radius/base'], '2px');
  assert.equal(other.primitives['hds/prim/shadow/level-2'], 'none');
  assert.equal(other.map.default['hds/sem/action/color/primary/default/bg'], base.map.default['hds/sem/action/color/primary/default/bg']);
  // Per-category style driver selects a step on the shared scale (spec section 1).
  assert.equal(other.map.default['hds/sem/action/measure/md/radius'], '{hds/prim/radius/full}');
});

test('ramp: brand color lands exactly on its nearest step; lightness is monotonic', () => {
  const r = ramp('#0069ca');
  assert.equal(formatHex(r[6]), '#0069ca');
  const ls = r.map((v) => Number(/oklch\(([\d.]+)%/.exec(v)![1]));
  assert.deepEqual([...ls].sort((a, b) => b - a), ls);
  assert.throws(() => ramp('not-a-color'));
});

test('css: semantic tokens are var() refs to primitives, contexts and reset emitted', () => {
  const { css } = base;
  assert.match(css, /--hds-sem-action-color-primary-default-bg: var\(--hds-prim-color-primary-600\);/);
  assert.match(css, /\[data-context="on-primary"\],\n {2}\[data-section="hero"\] \{/);
  assert.match(css, /\[data-context="default"\] \{\n {4}--hds-sem-action-color-primary-default-bg: var\(--hds-prim-color-primary-600\);/);
  assert.doesNotMatch(css, /\{hds\//);
});

test('mapping-level override changes one token and nothing else', () => {
  const name = 'hds/sem/action/color/primary/default/bg';
  const t = buildTheme({ mapping: { default: { [name]: '{hds/prim/color/primary/800}' } } });
  assert.match(t.css, /--hds-sem-action-color-primary-default-bg: var\(--hds-prim-color-primary-800\);/);
  const changed = Object.keys(t.map.default).filter((k) => t.map.default[k] !== base.map.default[k]);
  assert.deepEqual(changed, [name]);
  assert.throws(() => buildTheme({ mapping: { default: { 'hds/sem/action/color/bogus': 'red' } } }), /unknown semantic/);
  assert.throws(() => buildTheme({ mapping: { default: { [name]: '{hds/prim/color/nope/1}' } } }), /unknown primitive/);
});

test('bad section names are rejected (they are emitted into selectors)', () => {
  assert.throws(() => buildTheme({ drivers: { sections: { 'x"]{}': 'on-primary' } } }), /bad section/);
});

test('contrast: default drivers pass every pair in every context', () => {
  assert.deepEqual(base.contrast, []);
});

test('contrast: holds for brand colors around the hue wheel, light and dark', () => {
  const brands = ['#0f766e', '#be185d', '#e11d48', '#7c3aed', '#15803d', '#c2410c', '#facc15', '#111827', '#0ea5e9', '#a3a3a3'];
  for (const primary of brands) {
    for (const accent of brands) {
      const t = buildTheme({ drivers: { color: { primary, accent } } });
      assert.deepEqual(t.contrast, [], `primary ${primary}, accent ${accent}`);
    }
  }
});

test('contrast: a bad mapping is caught', () => {
  const t = buildTheme({ mapping: { default: { 'hds/sem/type/color/body/fg': '{hds/prim/color/neutral/200}' } } });
  assert.ok(t.contrast.some((f) => f.fg === 'hds/sem/type/color/body/fg' && f.context === 'default'));
});

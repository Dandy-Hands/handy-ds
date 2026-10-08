import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatHex } from 'culori';
import { buildTheme } from './theme.ts';
import { checkTokenName, SEM_TOKENS } from './names.ts';
import { ladder, wheel } from './primitives.ts';
import { offset } from './picks.ts';
import { withDefaults } from './drivers.ts';

const base = buildTheme();

const other = buildTheme({
  color: { primary: '#0f766e', secondary: '#be185d', neutral: '#78716c', contrast: 0.5 },
  typography: { baseSize: 18, ratio: 1.2 },
  density: 0.85,
  radius: { control: 'round' },
  shadow: { strength: 0 },
});

const allPrims = (t: typeof base) => [...Object.keys(t.primitives.shared), ...Object.keys(t.primitives.light)];

test('primitive names are frozen: independent of driver values, all valid', () => {
  assert.deepEqual(allPrims(other), allPrims(base));
  assert.deepEqual(Object.keys(base.primitives.dark), Object.keys(base.primitives.light));
  for (const name of allPrims(base)) assert.equal(checkTokenName(name), null, name);
});

test('every semantic token is emitted once, and the set matches spec 7.8 (252)', () => {
  assert.equal(SEM_TOKENS.length, 252);
  assert.equal(new Set(SEM_TOKENS).size, 252);
  for (const name of SEM_TOKENS) assert.match(base.css, new RegExp(`${name.replaceAll('/', '-')}:`), name);
  const colorCount = SEM_TOKENS.filter((n) => n.startsWith('hds/sem/color/')).length;
  assert.equal(colorCount, 146);
});

test('hue wheel: 11 slots, anchors exact, default secondary = primary + 163.6°', () => {
  const w = wheel(withDefaults());
  assert.equal(w.hues.length, 11);
  assert.equal(w.secondarySlot, 5);
  const gap = (w.hues[5] - w.hues[0] + 360) % 360;
  assert.ok(Math.abs(gap - 163.64) < 0.01, String(gap));
  // The exact brand color lands on its nearest stop, in both modes.
  assert.equal(formatHex(base.primitives.light['hds/prim/color/hue-0/600']), '#0069ca');
  assert.ok(Object.values(base.primitives.dark).some((v) => v.startsWith('oklch') && formatHex(v) === '#0069ca'));
});

test('hue wheel: proportional gaps around a set secondary', () => {
  const w = wheel(withDefaults({ color: { primary: 'oklch(60% 0.15 0)', secondary: 'oklch(60% 0.15 90)' } }));
  assert.equal(w.secondarySlot, 3); // round(11 × 90 / 360) = 3 gaps on the short arc
  assert.ok(Math.abs(w.hues[3] - 90) < 0.01);
});

test('role map: system roles never share a slot; explicit roles are honored', () => {
  const w = wheel(withDefaults());
  const sys = [w.roleSlot.danger, w.roleSlot.warning, w.roleSlot.success, w.roleSlot.info];
  assert.equal(new Set(sys).size, 4);
  const set = wheel(withDefaults({ roles: { danger: 'hue-7' } }));
  assert.equal(set.roleSlot.danger, 7);
  assert.throws(() => wheel(withDefaults({ roles: { danger: 'hue-2', info: 'hue-2' } })), /already used/);
  assert.throws(() => wheel(withDefaults({ roles: { danger: 'hue-11' } })), /expected hue-0/);
  assert.equal(base.primitives.light['hds/prim/color/danger/600'], `{hds/prim/color/hue-${w.roleSlot.danger}/600}`);
});

test('lightness ladder: monotonic; dark is inverted; contrast bends it', () => {
  const l = ladder(0, false);
  assert.deepEqual([...l].sort((a, b) => b - a), l);
  assert.deepEqual(ladder(0, true), [...l].reverse());
  assert.ok(ladder(1, false)[0] > l[0] && ladder(1, false)[10] < l[10]);
});

test('state offsets follow the spec 5.2 edge rules', () => {
  assert.equal(offset('primary/600', 1), 'primary/700');
  assert.equal(offset('primary/900', 2), 'primary/700'); // past 950: other direction
  assert.equal(offset('white', 1), 'neutral/50');
  assert.equal(offset('black', 2), 'neutral/900');
  assert.equal(offset('transparent', 1, 'primary/700'), 'primary/50');
  assert.equal(offset('transparent', 2, 'neutral/50', 'primary'), 'primary/800');
});

test('derived states, picks, dark overrides', () => {
  const c = base.colors.light.default;
  assert.equal(c['action/primary/hover/bg'], 'primary/700');
  assert.equal(c['action/primary/selected/bg'], 'primary/800');
  assert.equal(c['action/secondary/hover/bg'], 'primary/50');
  assert.equal(c['action/danger/disabled/fg'], 'neutral/400');
  assert.equal(c['field/hover/border'], 'neutral/600');
  assert.equal(c['field/checked/border'], 'primary/600');

  const t = buildTheme({
    picks: {
      'action/primary/default/bg': 'secondary/600',
      'action/primary/hover/bg': 'secondary/900',
      'content/accent/fg': { light: 'primary/700', dark: 'primary/300' },
    },
  });
  assert.equal(t.colors.light.default['action/primary/active/bg'], 'secondary/800'); // derives from the new base
  assert.equal(t.colors.light.default['action/primary/hover/bg'], 'secondary/900'); // explicit state override
  assert.equal(t.colors.dark.default['content/accent/fg'], 'primary/300');
  assert.match(t.css, /\[data-mode="dark"\] \{[^}]*--hds-sem-color-content-accent-fg: var\(--hds-prim-color-primary-300\);/);

  assert.throws(() => buildTheme({ picks: { 'action/primary/bogus': 'primary/600' } }), /unknown color pick/);
  assert.throws(() => buildTheme({ picks: { 'content/default/fg': 'primary/650' } }), /bad pick/);
  assert.throws(() => buildTheme({ picks: { 'content/default/fg': 'hue-2/600' } }), /bad pick/); // slots: data viz only
  buildTheme({ picks: { 'graphic/categorical/1': 'hue-2/600' } });
});

test('driver change regenerates primitives; picks are unchanged', () => {
  assert.notEqual(other.primitives.light['hds/prim/color/hue-0/600'], base.primitives.light['hds/prim/color/hue-0/600']);
  assert.equal(other.primitives.shared['hds/prim/dimension/400'], '13.6px');
  assert.equal(other.other['hds/sem/radius/control'], '{hds/prim/radius/round}');
  assert.equal(other.other['hds/sem/elevation/raised'], 'none');
  assert.equal(other.other['hds/sem/typography/body/md/size'], '{hds/prim/typography/scale/3}');
  assert.equal(other.other['hds/sem/typography/body/lg/size'], '{hds/prim/typography/scale/4}');
  assert.equal(other.colors.light.default['action/primary/default/bg'], base.colors.light.default['action/primary/default/bg']);
});

test('css: var() refs, modes, contexts, sections and reset emitted', () => {
  const { css } = base;
  assert.match(css, /--hds-sem-color-action-primary-default-bg: var\(--hds-prim-color-primary-600\);/);
  assert.match(css, /--hds-prim-color-danger-600: var\(--hds-prim-color-hue-\d+-600\);/);
  assert.match(css, /\[data-mode="dark"\] \{/);
  assert.match(css, /\[data-context="on-primary"\],\n {2}\[data-section="hero"\] \{/);
  assert.match(css, /\[data-context="on-secondary"\] \{/);
  assert.match(css, /\[data-context="default"\] \{\n[^}]*--hds-sem-color-surface-base-bg: var\(--hds-prim-color-neutral-100\);/);
  assert.doesNotMatch(css, /\{hds\//);

  const sys = buildTheme({ mode: 'system', sections: { footer: 'dark' } }).css;
  assert.match(sys, /@media \(prefers-color-scheme: dark\) \{\n {4}:root \{/);
  assert.match(sys, /\[data-mode="dark"\],\n {2}\[data-section="footer"\] \{/);
  assert.match(buildTheme({ mode: 'dark' }).css, /:root,\n {2}\[data-mode="dark"\] \{/);
});

test('bad sections and text styles are rejected', () => {
  assert.throws(() => buildTheme({ sections: { 'x"]{}': 'on-primary' } }), /bad section/);
  assert.throws(() => buildTheme({ sections: { hero: 'sepia' as never } }), /unknown target/);
  assert.throws(() => buildTheme({ typography: { styles: { caption: { md: { size: 1 } } } } }), /scale step/);
});

test('contrast: default drivers pass every pair, both modes, every context', () => {
  assert.deepEqual(base.contrast, []);
});

test('contrast: holds for brand colors around the hue wheel', () => {
  const brands = ['#0f766e', '#be185d', '#e11d48', '#7c3aed', '#15803d', '#c2410c', '#facc15', '#111827', '#0ea5e9', '#a3a3a3'];
  for (const primary of brands) {
    for (const secondary of [undefined, ...brands]) {
      const t = buildTheme({ color: { primary, secondary } });
      assert.deepEqual(t.contrast, [], `primary ${primary}, secondary ${secondary}`);
    }
  }
});

test('contrast: a bad pick is caught', () => {
  const t = buildTheme({ picks: { 'content/default/fg': 'neutral/300' } });
  assert.ok(t.contrast.some((f) => f.fg === 'hds/sem/color/content/default/fg' && f.mode === 'light'));
});

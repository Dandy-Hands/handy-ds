import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { responsive, responsiveCss, spaceValue } from './responsive.ts';

test('responsive: one value fills every key', () => {
  const v = responsive('gap', '400', spaceValue);
  assert.equal(v['--_gap-base'], 'var(--hds-sem-measure-space-400)');
  assert.equal(v['--_gap-xl'], v['--_gap-base']);
});

test('responsive: object form is mobile-first and none is 0', () => {
  const v = responsive('gap', { base: 'none', md: '200' }, spaceValue);
  assert.equal(v['--_gap-sm'], '0');
  assert.equal(v['--_gap-md'], 'var(--hds-sem-measure-space-200)');
  assert.equal(v['--_gap-lg'], v['--_gap-md']);
  assert.deepEqual(responsive('cols', { base: 1, lg: 4 }), {
    '--_cols-base': '1', '--_cols-sm': '1', '--_cols-md': '1', '--_cols-lg': '4', '--_cols-xl': '4',
  });
});

test('Stack.css repeats the breakpoint numbers', () => {
  const css = readFileSync(new URL('./Stack.css', import.meta.url), 'utf8').replace(/\/\*.*?\*\//g, '');
  const squash = (s: string) => s.replace(/\s+/g, '');
  for (const rule of responsiveCss('.hds-stack', 'gap', 'gap').split('\n').slice(1)) {
    const [, bp, decl] = /min-width: (\d+)px\) \{ \S+ \{ (.*) \} \}/.exec(rule)!;
    assert.ok(squash(css).includes(squash(`@media(min-width:${bp}px){.hds-stack{${decl}}}`)), rule);
  }
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { checkTokenName } from './names.ts';

// Every semantic token in the spec's demo tree (section 8), in slash form.
const DEMO_SEM = [
  'action/color/primary/default/bg',
  'action/color/primary/hover/bg',
  'action/color/primary/active/bg',
  'action/color/primary/default/fg',
  'action/color/primary/default/border',
  'action/color/secondary/default/bg',
  'action/color/secondary/hover/bg',
  'action/color/secondary/default/fg',
  'action/color/secondary/default/border',
  'action/color/tertiary/default/bg',
  'action/color/tertiary/hover/bg',
  'action/color/tertiary/default/fg',
  'action/color/tertiary/hover/fg',
  'action/measure/padding-x',
  'action/measure/padding-y',
  'action/measure/radius',
  'action/measure/gap',
  'input/color/default/bg',
  'input/color/default/border',
  'input/color/default/fg',
  'input/color/default/placeholder-fg',
  'input/color/focus/border',
  'input/color/error/border',
  'input/color/checked/bg', // Checkbox/Radio checked (spec gap 12 decision)
  'input/color/checked/fg',
  'input/color/checked/border',
  'input/measure/md/padding-x',
  'input/measure/md/padding-y',
  'input/measure/md/height',
  'input/measure/md/radius',
  'input/measure/sm/height',
  'surface/color/0/default/bg',
  'surface/color/0/default/border',
  'surface/color/0/default/shadow',
  'surface/color/0/striped/bg',
  'surface/color/1/default/bg',
  'surface/measure/padding',
  'surface/measure/radius',
  'type/color/heading/fg',
  'type/color/body/fg',
  'type/color/label/fg',
  'type/measure/heading/size',
  'type/measure/heading/line-height',
  'type/measure/body/size',
  'type/measure/body/line-height',
  'type/other/heading/font-family',
  'type/other/heading/weight',
  'type/other/body/font-family',
  'type/other/body/weight',
  'icon/color/default/fg',
  'icon/color/secondary/fg',
  'icon/color/accent/fg',
  'divider/color/border',
  'divider/measure/thin/thickness',
  'divider/measure/medium/thickness',
  'divider/measure/thick/thickness',
  'feedback/color/danger/bg',
  'feedback/color/danger/fg',
  'feedback/color/danger/border',
  'feedback/color/danger/icon-fg',
  'feedback/measure/padding',
  'feedback/measure/radius',
  'feedback/measure/gap',
  'overlay/color/bg',
  'focus/color/stroke',
  'focus/measure/stroke-width',
].map((n) => `hds/sem/${n}`);

test('demo list matches the spec demo tree exactly', () => {
  const spec = readFileSync(new URL('../../.claude/specs/token-system-spec.md', import.meta.url), 'utf8');
  const inSpec = new Set(spec.match(/--hds-sem-[a-z0-9-]+/g));
  const inList = new Set(DEMO_SEM.map((n) => `--${n.replaceAll('/', '-')}`));
  assert.deepEqual([...inList].sort(), [...inSpec].sort());
});

test('every spec example name is valid', () => {
  const examples = [
    ...DEMO_SEM,
    'hds/sem/action/color/tertiary/hover/bg', // Data Table, section 9
    'hds/sem/action/color/primary/selected/bg', // Switch, Tabs, Toggle
    'hds/prim/color/primary/600',
    'hds/prim/color/neutral/50',
    'hds/prim/space/4',
    'hds/prim/radius/base',
    'hds/prim/type/scale/3',
    'hds/prim/shadow/level-2',
  ];
  for (const name of examples) assert.equal(checkTokenName(name), null, name);
});

test('invalid names are rejected', () => {
  const bad = [
    'ds/sem/action/color/primary/default/bg', // namespace
    'hds/raw/color/primary/600', // layer
    'hds/sem/button/color/primary/default/bg', // unknown category
    'hds/sem/action/other/font-family', // section 6: other only under type
    'hds/sem/icon/measure/size', // icon has no measure
    'hds/sem/action/color/primary/bg', // missing state
    'hds/sem/action/color/primary/default/hover/bg', // extra segment
    'hds/sem/action/color/quaternary/default/bg', // unknown priority
    'hds/sem/action/measure/md/padding-x', // measure has no size axis on action
    'hds/sem/input/measure/xl/height', // unknown size
    'hds/sem/constructor/color/bg', // prototype key
    'hds/prim/colour/primary/600', // unknown primitive type
    'hds/prim/space', // missing property
    'hds/prim/color/Primary/600', // uppercase
  ];
  for (const name of bad) assert.notEqual(checkTokenName(name), null, name);
});

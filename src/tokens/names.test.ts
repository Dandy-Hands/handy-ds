import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkTokenName } from './names.ts';

test('every spec example name is valid', () => {
  const examples = [
    'hds/sem/color/action/primary/hover/bg',
    'hds/sem/color/action/danger/disabled/border',
    'hds/sem/color/field/checked/placeholder',
    'hds/sem/color/surface/floating/bg',
    'hds/sem/color/content/link/hover/fg',
    'hds/sem/color/graphic/divider/strong',
    'hds/sem/color/graphic/categorical/8',
    'hds/sem/color/graphic/diverging/9',
    'hds/sem/color/feedback/warning/icon',
    'hds/sem/color/focus/ring',
    'hds/sem/color/overlay/scrim',
    'hds/sem/measure/space/400',
    'hds/sem/measure/size/3200',
    'hds/sem/radius/round',
    'hds/sem/border/focus',
    'hds/sem/elevation/modal',
    'hds/sem/typography/heading/lg/tracking',
    'hds/prim/color/hue-3/600',
    'hds/prim/color/danger/600',
    'hds/prim/color/neutral/50',
    'hds/prim/dimension/025',
    'hds/prim/radius/round',
    'hds/prim/shadow/raised/umbra/blur',
    'hds/prim/typography/scale/3',
  ];
  for (const name of examples) assert.equal(checkTokenName(name), null, name);
});

test('invalid names are rejected', () => {
  const bad = [
    'ds/sem/color/focus/ring', // namespace
    'hds/raw/color/primary/600', // layer
    'hds/sem/action/color/primary/default/bg', // old grammar: category before type
    'hds/sem/color/button/primary/default/bg', // unknown category
    'hds/sem/color/action/primary/bg', // missing state
    'hds/sem/color/action/primary/focus/bg', // action has no focus state
    'hds/sem/color/action/primary/default/hover/bg', // extra segment
    'hds/sem/color/action/quaternary/default/bg', // unknown priority
    'hds/sem/color/content/muted/hover/fg', // hover is link only
    'hds/sem/color/surface/overlay/bg', // old level name
    'hds/sem/color/graphic/categorical/9', // 8 series
    'hds/sem/measure/space/500', // not in the space subset
    'hds/sem/radius/action', // radius is per shape role, not category
    'hds/sem/elevation/base', // no shadow below raised
    'hds/sem/typography/body/xl/size', // unknown size
    'hds/sem/typography/body/md', // incomplete
    'hds/sem/constructor', // prototype key
    'hds/prim/colour/primary/600', // unknown primitive type
    'hds/prim/space/4', // old primitive type
    'hds/prim/dimension', // missing property
    'hds/prim/color/Primary/600', // uppercase
  ];
  for (const name of bad) assert.notEqual(checkTokenName(name), null, name);
});

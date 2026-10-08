// Contrast rule (token-system-spec.md section 5.4): WCAG 2, checked in light and dark mode
// and in each brand context, derived states included. Text pairs need 4.5:1; field borders,
// check marks, feedback icons and the focus ring need 3:1. Disabled states are exempt.
import { wcagContrast } from 'culori';
import type { Context } from './drivers.ts';
import type { Primitives } from './primitives.ts';
import type { ColorMap, ColorMode } from './theme.ts';
import { CONTENT_ROLE, LEVEL, PRIORITY, SENTIMENT } from './names.ts';

export interface ContrastFailure {
  mode: ColorMode;
  context: 'default' | Context;
  fg: string;
  bg: string;
  ratio: number;
  min: number;
}

const REF = /^\{(hds\/prim\/[^}]+)\}$/;
const SURFACES = LEVEL.map((lv) => `surface/${lv}/bg`);

/** Every checked pair: [fg token, bg token, minimum ratio]. Tokens are without `hds/sem/color/`. */
export const PAIRS: [fg: string, bg: string, min: number][] = [
  ...SURFACES.flatMap((ground): [string, string, number][] => [
    ...CONTENT_ROLE.map((role): [string, string, number] => [`content/${role}/fg`, ground, 4.5]),
    ['content/link/hover/fg', ground, 4.5],
    ['focus/ring', ground, 3],
  ]),
  ...PRIORITY.flatMap((pr) =>
    ['default', 'hover', 'active', 'selected'].map((st): [string, string, number] => [`action/${pr}/${st}/fg`, `action/${pr}/${st}/bg`, 4.5]),
  ),
  ...['default', 'hover', 'focus', 'error'].map((st): [string, string, number] => [`field/${st}/fg`, `field/${st}/bg`, 4.5]),
  ['field/default/placeholder', 'field/default/bg', 4.5],
  ['field/default/border', 'field/default/bg', 3],
  ['field/error/border', 'field/error/bg', 3],
  ['field/checked/fg', 'field/checked/bg', 3],
  ...SENTIMENT.flatMap((s): [string, string, number][] => [
    [`feedback/${s}/fg`, `feedback/${s}/bg`, 4.5],
    [`feedback/${s}/icon`, `feedback/${s}/bg`, 3],
  ]),
];

export function checkContrast(prims: Primitives, colors: ColorMap): ContrastFailure[] {
  const failures: ContrastFailure[] = [];
  for (const mode of ['light', 'dark'] as const) {
    const values = prims[mode];
    const prim = (name: string): string => {
      const v = values[name];
      const ref = REF.exec(v);
      return ref ? prim(ref[1]) : v;
    };
    for (const [context, picks] of Object.entries(colors[mode]) as ['default' | Context, Record<string, string>][]) {
      // Returns null for `transparent`: the pair is then checked against every surface level.
      const color = (token: string) => (picks[token] === 'transparent' ? null : prim(`hds/prim/color/${picks[token]}`));
      const check = (fg: string, bg: string, min: number) => {
        for (const b of color(bg) === null ? SURFACES : [bg]) {
          const ratio = wcagContrast(color(fg)!, color(b)!);
          if (ratio < min) {
            failures.push({ mode, context, fg: `hds/sem/color/${fg}`, bg: `hds/sem/color/${b}`, ratio: Number(ratio.toFixed(2)), min });
          }
        }
      };

      for (const [fg, bg, min] of PAIRS) check(fg, bg, min);
    }
  }
  return failures;
}

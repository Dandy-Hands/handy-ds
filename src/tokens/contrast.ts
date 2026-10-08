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

      for (const ground of SURFACES) {
        for (const role of CONTENT_ROLE) check(`content/${role}/fg`, ground, 4.5);
        check('content/link/hover/fg', ground, 4.5);
        check('focus/ring', ground, 3);
      }
      for (const pr of PRIORITY) {
        for (const st of ['default', 'hover', 'active', 'selected']) check(`action/${pr}/${st}/fg`, `action/${pr}/${st}/bg`, 4.5);
      }
      for (const st of ['default', 'hover', 'focus', 'error']) check(`field/${st}/fg`, `field/${st}/bg`, 4.5);
      check('field/default/placeholder', 'field/default/bg', 4.5);
      check('field/default/border', 'field/default/bg', 3);
      check('field/error/border', 'field/error/bg', 3);
      check('field/checked/fg', 'field/checked/bg', 3);
      for (const s of SENTIMENT) {
        check(`feedback/${s}/fg`, `feedback/${s}/bg`, 4.5);
        check(`feedback/${s}/icon`, `feedback/${s}/bg`, 3);
      }
    }
  }
  return failures;
}

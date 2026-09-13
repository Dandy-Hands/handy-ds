// Contrast requirements per token pair (token spec gap 8), checked in every context.
// Text pairs need 4.5:1 (WCAG 1.4.3); icons, focus rings, input borders and checkmarks
// need 3:1 (WCAG 1.4.11). Disabled states are exempt, as in WCAG.
import { wcagContrast } from 'culori';
import type { Context } from './drivers.ts';
import { ELEVATION, ICON_ROLE, PRIORITY, SENTIMENT, SURFACE_STATE, TYPE_ROLE } from './names.ts';
import type { ThemeMap } from './themeMap.ts';

export interface ContrastFailure {
  context: Context;
  fg: string;
  bg: string;
  ratio: number;
  min: number;
}

export const CONTEXTS: Context[] = ['default', 'on-primary'];
const REF = /^\{(hds\/prim\/[^}]+)\}$/;
const GROUNDS = ELEVATION.flatMap((e) => SURFACE_STATE.map((s) => `surface/color/${e}/${s}/bg`));

export function checkContrast(prims: Record<string, string>, map: ThemeMap): ContrastFailure[] {
  const failures: ContrastFailure[] = [];

  for (const context of CONTEXTS) {
    const tokens = { ...map.default, ...map[context] };
    // Returns null for `transparent`: the pair is then checked against every surface ground.
    const color = (name: string): string | null => {
      const value = tokens[`hds/sem/${name}`];
      if (value === undefined) throw new Error(`contrast: no token hds/sem/${name}`);
      if (value === 'transparent') return null;
      const ref = REF.exec(value);
      if (!ref) throw new Error(`contrast: ${context} hds/sem/${name} must be a single primitive ref, got ${value}`);
      return prims[ref[1]];
    };
    const check = (fg: string, bg: string, min: number) => {
      for (const b of color(bg) === null ? GROUNDS : [bg]) {
        const ratio = wcagContrast(color(fg)!, color(b)!);
        if (ratio < min) failures.push({ context, fg: `hds/sem/${fg}`, bg: `hds/sem/${b}`, ratio: Number(ratio.toFixed(2)), min });
      }
    };

    for (const ground of GROUNDS) {
      for (const role of TYPE_ROLE) check(`type/color/${role}/fg`, ground, 4.5);
      for (const role of ICON_ROLE) check(`icon/color/${role}/fg`, ground, 3);
      check('focus/color/stroke', ground, 3);
      check('input/color/default/border', ground, 3);
    }
    for (const pr of PRIORITY) {
      for (const st of ['default', 'hover', 'active', 'focus', 'selected']) {
        check(`action/color/${pr}/${st}/fg`, `action/color/${pr}/${st}/bg`, 4.5);
      }
    }
    for (const st of ['default', 'hover', 'focus', 'error']) check(`input/color/${st}/fg`, `input/color/${st}/bg`, 4.5);
    check('input/color/default/placeholder-fg', 'input/color/default/bg', 4.5);
    check('input/color/checked/fg', 'input/color/checked/bg', 3);
    for (const s of SENTIMENT) {
      check(`feedback/color/${s}/fg`, `feedback/color/${s}/bg`, 4.5);
      check(`feedback/color/${s}/icon-fg`, `feedback/color/${s}/bg`, 3);
    }
  }
  return failures;
}

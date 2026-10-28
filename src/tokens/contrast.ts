// Contrast rule (token-system-spec.md section 5.4): WCAG 2, checked in light and dark mode
// and in each brand context, derived states included. Text pairs need 4.5:1; field borders,
// check marks, feedback icons and the focus ring need 3:1. Disabled states are exempt.
import { wcagContrast } from 'culori';
import type { Context } from './drivers.ts';
import type { Primitives } from './primitives.ts';
import { MEDIA_ALPHA, type ColorMap, type ColorMode } from './theme.ts';
import { CONTENT_ROLE, LEVEL, MEDIA_STRENGTH, PRIORITY, SENTIMENT } from './names.ts';

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

/**
 * Every checked pair: [fg token, bg token, minimum ratio]. Tokens are without `hds/sem/color/`.
 * A transparent first token is exempt; a transparent second token is checked against every surface.
 */
export const PAIRS: [fg: string, bg: string, min: number][] = [
  ...SURFACES.flatMap((ground): [string, string, number][] => [
    ...CONTENT_ROLE.map((role): [string, string, number] => [`content/${role}/fg`, ground, 4.5]),
    ['content/link/hover/fg', ground, 4.5],
    ['focus/ring', ground, 3],
  ]),
  ...PRIORITY.flatMap((pr) =>
    ['default', 'hover', 'active', 'selected'].map((st): [string, string, number] => [`action/${pr}/${st}/fg`, `action/${pr}/${st}/bg`, 4.5]),
  ),
  // A filled action must stand out from the page (WCAG 1.4.11). A transparent bg is exempt.
  // Default state only: the derived states of a filled bg move away from the surfaces.
  // Not sunken: buttons sit on base and the raised levels, not in wells (interview J4).
  ...PRIORITY.flatMap((pr) =>
    SURFACES.filter((g) => g !== 'surface/sunken/bg').map((g): [string, string, number] => [`action/${pr}/default/bg`, g, 3]),
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

/** Minimum text contrast per media scrim strength. 0 = not checked (decorative). */
const MEDIA_MIN: Record<(typeof MEDIA_STRENGTH)[number], number> = { subtle: 0, medium: 3, strong: 4.5 };

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
        if (color(fg) === null) return;
        for (const b of color(bg) === null ? SURFACES : [bg]) {
          const ratio = wcagContrast(color(fg)!, color(b)!);
          if (ratio < min) {
            failures.push({ mode, context, fg: `hds/sem/color/${fg}`, bg: `hds/sem/color/${b}`, ratio: Number(ratio.toFixed(2)), min });
          }
        }
      };

      for (const [fg, bg, min] of PAIRS) check(fg, bg, min);
      // Toast: the tone icon on the floating surface. A toast renders in a portal at the end of
      // the page, so it never sits in a brand context: default context only.
      if (context === 'default') for (const s of SENTIMENT) check(`feedback/${s}/icon`, 'surface/floating/bg', 3);
    }

    // Media scrim (Section `scrim`). The image is client content, so test the worst case: a dark
    // scrim over a white image, a light scrim over a black one. A dark tone puts the section in
    // dark mode and a light tone in light mode, so each tone checks the text of its own mode.
    const tone = mode === 'dark' ? 'dark' : 'light';
    const text = prim(`hds/prim/color/${colors[mode].default['content/default/fg']}`);
    for (const s of MEDIA_STRENGTH) {
      const min = MEDIA_MIN[s];
      if (min === 0) continue;
      const a = MEDIA_ALPHA[s];
      const gray = Math.round((tone === 'dark' ? 1 - a : a) * 255) / 255; // scrim over white (dark) or black (light)
      const ratio = wcagContrast(text, { mode: 'rgb', r: gray, g: gray, b: gray });
      if (ratio < min) {
        failures.push({ mode, context: 'default', fg: 'hds/sem/color/content/default/fg', bg: `hds/sem/color/overlay/media/${tone}/${s}`, ratio: Number(ratio.toFixed(2)), min });
      }
    }
  }
  return failures;
}

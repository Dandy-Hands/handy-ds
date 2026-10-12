// Theme tool state (theme-customization-spec.md sections 5 and 6). The state is a sparse
// driver config: only values that differ from the defaults. No JSX here, so node can test it.
import { wcagContrast } from 'culori';
import { defaultDrivers, type DriverInput, type Pick } from '../../../src/tokens/drivers.ts';
import { PAIRS } from '../../../src/tokens/contrast.ts';
import { LEVEL, STOPS } from '../../../src/tokens/names.ts';
import type { buildTheme } from '../../../src/tokens/theme.ts';

export type Theme = ReturnType<typeof buildTheme>;
export type Path = string[];
type Obj = Record<string, unknown>;

const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

export function getIn(obj: unknown, path: Path): unknown {
  return path.reduce<unknown>((o, k) => (isObj(o) ? o[k] : undefined), obj);
}

/**
 * Sets a value at a path. `undefined`, or a value equal to the library default, removes
 * the key, and empty parents are pruned, so the state stays a diff from the defaults.
 */
export function setIn(obj: DriverInput, path: Path, value: unknown): DriverInput {
  const drop = value === undefined || same(value, getIn(defaultDrivers, path));
  const rec = (o: unknown, i: number): Obj | undefined => {
    const out: Obj = isObj(o) ? { ...o } : {};
    const k = path[i];
    if (i === path.length - 1) {
      if (drop) delete out[k];
      else out[k] = value;
    } else {
      const child = rec(out[k], i + 1);
      if (child) out[k] = child;
      else delete out[k];
    }
    return Object.keys(out).length ? out : undefined;
  };
  return (rec(obj, 0) ?? {}) as DriverInput;
}

/** Leaf paths of a sparse config, for the changes panel. A pick (string or `{ light, dark }`) is one leaf. */
export function leaves(obj: DriverInput): Path[] {
  const out: Path[] = [];
  const walk = (o: unknown, path: Path) => {
    const pickLevel = path[0] === 'picks' ? 2 : path[0] === 'contexts' ? 3 : Infinity;
    if (!isObj(o) || path.length >= pickLevel) return void out.push(path);
    for (const [k, v] of Object.entries(o)) walk(v, [...path, k]);
  };
  walk(obj, []);
  return out.filter((p) => p.length);
}

/** Writes the light or dark part of a pick. A pick with no dark part collapses to a string. */
export function withPickPart(current: Pick | undefined, part: 'light' | 'dark', value: string | undefined): Pick | undefined {
  const cur = typeof current === 'string' ? { light: current } : { ...current };
  cur[part] = value;
  if (cur.dark === undefined) return cur.light;
  return cur;
}

// --- Undo history (spec 6, interview H4) ---

export interface History {
  past: DriverInput[];
  present: DriverInput;
  future: DriverInput[];
  /** Last edited path and time: rapid edits to one path (a slider drag) are one undo step. */
  last?: { key: string; at: number };
}

export type Action =
  | { type: 'set'; path: Path; value: unknown; at: number }
  | { type: 'replace'; state: DriverInput }
  | { type: 'undo' }
  | { type: 'redo' };

const COALESCE_MS = 800;

export function reduce(h: History, a: Action): History {
  switch (a.type) {
    case 'set': {
      const present = setIn(h.present, a.path, a.value);
      if (same(present, h.present)) return h;
      const key = a.path.join('\u0000');
      const merge = h.last?.key === key && a.at - h.last.at < COALESCE_MS;
      return { past: merge ? h.past : [...h.past, h.present], present, future: [], last: { key, at: a.at } };
    }
    case 'replace':
      return { past: [...h.past, h.present], present: a.state, future: [] };
    case 'undo':
      if (!h.past.length) return h;
      return { past: h.past.slice(0, -1), present: h.past[h.past.length - 1], future: [h.present, ...h.future] };
    case 'redo':
      if (!h.future.length) return h;
      return { past: [...h.past, h.present], present: h.future[0], future: h.future.slice(1) };
  }
}

// --- Output (spec 5) ---

export function configText(state: DriverInput, client: string, version: string): string {
  const config = { meta: { ...(client ? { client } : {}), version }, ...state };
  return `// handy-ds theme config. Built with the theme customization tool.\n// Run: hds-theme theme.config.js > theme.css\nexport default ${JSON.stringify(config, null, 2)};\n`;
}

// --- Swatch contrast (spec 3, step 3: blocking accessibility) ---

const REF = /^\{(hds\/prim\/[^}]+)\}$/;
const SURFACES = LEVEL.map((lv) => `surface/${lv}/bg`);

/** CSS color of a pick in one mode, or null for `transparent`. */
export function pickColor(theme: Theme, mode: 'light' | 'dark', pick: string): string | null {
  if (pick === 'transparent') return null;
  const values = theme.primitives[mode];
  let v = values[`hds/prim/color/${pick}`];
  for (let ref = REF.exec(v ?? ''); ref; ref = REF.exec(v)) v = values[ref[1]];
  return v ?? null;
}

/** An action bg leads its fg: the bg selector is not limited by the fg (the fg follows, see bestFg). */
const followsBg = (fg: string, token: string) => token.startsWith('action/') && token.endsWith('/bg') && fg === token.replace(/bg$/, 'fg');

/**
 * Checks a candidate pick for `token` against every paired token (contrast PAIRS), in the
 * given modes and context. Returns the worst failing ratio, or null when every pair passes.
 */
export function pairFailure(
  theme: Theme,
  token: string,
  candidate: string,
  modes: ('light' | 'dark')[],
  context: 'default' | 'on-primary' | 'on-secondary',
): number | null {
  let worst: number | null = null;
  for (const [fg, bg, min] of PAIRS) {
    if ((fg !== token && bg !== token) || followsBg(fg, token)) continue;
    for (const mode of modes) {
      const picks = theme.colors[mode][context];
      const c = pickColor(theme, mode, candidate);
      const a = fg === token ? c : pickColor(theme, mode, picks[fg]);
      const b = bg === token ? c : pickColor(theme, mode, picks[bg]);
      // As in the checker: a transparent first side is exempt; a transparent second side
      // shows the surfaces behind it (spec 5.4).
      if (a === null) continue;
      const grounds = b === null ? SURFACES.map((s) => pickColor(theme, mode, picks[s])) : [null];
      for (const g of grounds) {
        const x = a;
        const y = b ?? g;
        if (!x || !y) continue;
        const ratio = wcagContrast(x, y);
        if (ratio < min && (worst === null || ratio < worst)) worst = Number(ratio.toFixed(2));
      }
    }
  }
  return worst;
}

/**
 * The neutral stop with the most contrast on an action bg, in light and dark mode. Used when
 * a new bg makes a default (unset) fg fail 4.5:1 (interview J4).
 */
export function bestFg(theme: Theme, context: 'default' | 'on-primary' | 'on-secondary', bgToken: string): string {
  let best = 'neutral/50';
  let bestRatio = -1;
  for (const stop of STOPS) {
    const ratio = Math.min(...(['light', 'dark'] as const).map((m) => {
      const fg = pickColor(theme, m, `neutral/${stop}`);
      const bg = pickColor(theme, m, theme.colors[m][context][bgToken]);
      return fg && bg ? wcagContrast(fg, bg) : 0;
    }));
    if (ratio > bestRatio) [best, bestRatio] = [`neutral/${stop}`, ratio];
  }
  return best;
}

// Drivers -> primitives (token-system-spec.md section 4). Primitive names never depend on
// driver values, only their values do, so the name list is fixed.
import { clampChroma, converter, displayable, parse, type Oklch } from 'culori';
import type { Drivers } from './drivers.ts';
import { ROLES, SLOT_COUNT, STOPS, SYSTEM_ROLES } from './names.ts';

const N = SLOT_COUNT;
// OKLCH lightness per stop (spec 4.1.2). Fixed, so a stop has the same contrast in every hue.
const LADDER = [0.975, 0.94, 0.88, 0.8, 0.71, 0.62, 0.53, 0.45, 0.38, 0.3, 0.23];
const ROLE_TARGET = { danger: 25, success: 145, warning: 70, info: 240 }; // assignment order (4.1.4)

const DIMENSION = ['025', '050', '100', '200', '300', '400', '500', '600', '800', '1000', '1200', '1600', '2400', '3200', '6400', '8000', '9600', '12800'];
const RADIUS = { none: 0, '050': 2, '100': 4, '200': 8, '300': 12, '400': 16, '600': 24, round: 9999 };
const BORDER = { none: 0, '025': 1, '050': 2, '100': 4 };
// [x, y, blur, spread] px per level and layer (spec 4.5).
const SHADOW = {
  raised: { umbra: [0, 1, 2, 0], penumbra: [0, 2, 4, 0], ambient: [0, 0, 1, 0] },
  floating: { umbra: [0, 4, 8, -2], penumbra: [0, 8, 16, 0], ambient: [0, 0, 2, 0] },
  modal: { umbra: [0, 12, 24, -4], penumbra: [0, 24, 48, 0], ambient: [0, 0, 4, 0] },
};
export const SHADOW_ALPHA = { umbra: 0.14, penumbra: 0.1, ambient: 0.08 };
const TYPE_STEPS = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // step 3 = body size
const WEIGHT = { regular: '400', medium: '500', semibold: '600', bold: '700' };
const LEADING = { tight: '1.1', snug: '1.25', normal: '1.5', relaxed: '1.65' };
const TRACKING = { tight: '-0.02em', normal: '0em', wide: '0.02em' };
// Motion (spec 4.7): duration step = ms at motion.duration 1.
export const DURATION = ['100', '150', '200', '300', '500', '800'];
const EASING = { standard: 'cubic-bezier(0.2, 0, 0, 1)', decelerate: 'cubic-bezier(0.32, 0.72, 0, 1)' };

/** Build-time only: breakpoints can't be custom properties (they don't work in @media). */
export const breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280 } as const;

const toOklch = converter('oklch');
const mod = (h: number) => ((h % 360) + 360) % 360;
/** Circular hue distance in degrees. */
export const hueDistance = (a: number, b: number) => Math.min(mod(a - b), mod(b - a));
const round = (n: number, digits: number) => Number(n.toFixed(digits));
export const fmt = (c: Oklch) =>
  `oklch(${round(c.l * 100, 2)}% ${round(c.c, 4)} ${round(c.h ?? 0, 2)}${c.alpha === undefined || c.alpha === 1 ? '' : ` / ${c.alpha}`})`;

/** Strongest chroma that fits sRGB at this lightness and hue. */
function maxChroma(l: number, h: number): number {
  let lo = 0;
  let hi = 0.4;
  for (let i = 0; i < 18; i++) {
    const m = (lo + hi) / 2;
    if (displayable({ mode: 'oklch', l, c: m, h })) lo = m;
    else hi = m;
  }
  return lo;
}

interface Anchor { l: number; c: number; h: number; rc: number; exact: Oklch }

function readColor(value: string, driver: string): Anchor {
  const parsed = parse(value);
  if (!parsed) throw new Error(`${driver}: can't parse color "${value}"`);
  const exact = clampChroma(toOklch(parsed), 'oklch');
  const c = exact.c ?? 0;
  const h = c > 0.002 && exact.h !== undefined ? mod(exact.h) : 0;
  return { l: exact.l, c, h, rc: Math.min(1, c / (maxChroma(exact.l, h) || 1)), exact: { ...exact, h } };
}

/** The lightness ladder for a mode (spec 4.1.2, 4.1.6). Index = stop index. */
export function ladder(k: number, dark: boolean): number[] {
  const bent = LADDER.map((l) => Math.min(0.99, Math.max(0.12, 0.6 + (l - 0.6) * (1 + 0.3 * k))));
  return dark ? bent.reverse() : bent;
}

const nearestStop = (lad: number[], l: number) =>
  lad.reduce((best, x, i) => (Math.abs(x - l) < Math.abs(lad[best] - l) ? i : best), 0);

/** Hue wheel geometry (spec 4.1.1, 4.1.3, 4.1.4). Mode-independent. */
export interface Wheel {
  hues: number[];
  rc: number[];
  secondarySlot: number;
  /** Slot index per role: primary, secondary, danger, warning, success, info. */
  roleSlot: Record<(typeof ROLES)[number], number>;
  primary: Anchor;
  secondary: Anchor | null;
  neutral: Anchor | null;
}

export function wheel(d: Drivers): Wheel {
  const primary = readColor(d.color.primary, 'color.primary');
  const secondary = d.color.secondary ? readColor(d.color.secondary, 'color.secondary') : null;
  const sHue = secondary ? secondary.h : mod(primary.h + (Math.floor(N / 2) * 360) / N);
  const rcS = secondary ? secondary.rc : primary.rc;

  const arc = mod(sHue - primary.h) || 360;
  const g1 = Math.min(N - 1, Math.max(1, Math.round((N * arc) / 360)));
  const g2 = N - g1;
  const hues: number[] = [];
  const rc: number[] = [];
  const floor = d.color.floor;
  for (let i = 0; i < g1; i++) {
    const t = i / g1;
    hues.push(mod(primary.h + arc * t));
    rc.push(i === 0 ? primary.rc : Math.max(floor, primary.rc + (rcS - primary.rc) * t));
  }
  for (let j = 0; j < g2; j++) {
    const t = 1 - j / g2;
    hues.push(mod(sHue + ((360 - arc) * j) / g2));
    rc.push(j === 0 ? rcS : Math.max(floor, primary.rc + (rcS - primary.rc) * t));
  }

  const taken = new Set<number>();
  const roleSlot = { primary: 0, secondary: g1 } as Wheel['roleSlot'];
  for (const role of SYSTEM_ROLES) {
    const set = d.roles[role];
    if (set === undefined) continue;
    const m = /^hue-(\d+)$/.exec(set);
    const i = m ? Number(m[1]) : NaN;
    if (!(i >= 0 && i < N)) throw new Error(`roles.${role}: expected hue-0 to hue-${N - 1}, got "${set}"`);
    if (taken.has(i)) throw new Error(`roles.${role}: ${set} is already used by another system role`);
    taken.add(i);
    roleSlot[role] = i;
  }
  for (const [role, target] of Object.entries(ROLE_TARGET) as [keyof typeof ROLE_TARGET, number][]) {
    if (d.roles[role] !== undefined) continue;
    const order = hues.map((_, i) => i).sort((a, b) => hueDistance(hues[a], target) - hueDistance(hues[b], target));
    const i = order.find((x) => !taken.has(x))!;
    taken.add(i);
    roleSlot[role] = i;
  }

  const neutral = d.color.neutral ? readColor(d.color.neutral, 'color.neutral') : null;
  return { hues, rc, secondarySlot: g1, roleSlot, primary, secondary, neutral };
}

/** Slot order for categorical data visualization (spec 7.4.2): farthest hue first. */
export function categoricalOrder(w: Wheel, count: number): number[] {
  const order = [0];
  while (order.length < Math.min(count, N)) {
    let best = -1;
    let bestDist = -1;
    for (let i = 0; i < N; i++) {
      if (order.includes(i)) continue;
      const dist = Math.min(...order.map((j) => hueDistance(w.hues[i], w.hues[j])));
      if (dist > bestDist) [best, bestDist] = [i, dist];
    }
    order.push(best);
  }
  return order;
}

/** One mode's color cells: slots[slot][stop] and neutral[stop]. */
function colors(d: Drivers, w: Wheel, dark: boolean) {
  const lad = ladder(dark ? d.color.darkContrast : d.color.contrast, dark);
  const chromaScale = dark ? d.color.darkChroma : 1;
  const scale = (h: number, rc: number, exact: Anchor | null): Oklch[] => {
    const cells = lad.map((l): Oklch => ({ mode: 'oklch', l, c: rc * chromaScale * maxChroma(l, h), h }));
    if (exact) cells[nearestStop(lad, exact.l)] = exact.exact;
    return cells;
  };
  const slots = w.hues.map((h, i) =>
    scale(h, w.rc[i], i === 0 ? w.primary : i === w.secondarySlot ? w.secondary : null),
  );
  const nh = w.neutral ? w.neutral.h : w.primary.h;
  const neutral = scale(nh, w.neutral ? w.neutral.rc : d.color.neutralTint, w.neutral);
  return { slots, neutral };
}

export interface Primitives {
  /** Values that are the same in both modes. */
  shared: Record<string, string>;
  /** Color primitives, per mode. Same names in both. */
  light: Record<string, string>;
  dark: Record<string, string>;
  wheel: Wheel;
}

/** Resolves every primitive: slash name -> CSS value. Role aliases are `{hds/prim/...}` templates. */
export function resolvePrimitives(d: Drivers): Primitives {
  const w = wheel(d);
  const colorSet = (dark: boolean) => {
    const out: Record<string, string> = {};
    const { slots, neutral } = colors(d, w, dark);
    slots.forEach((cells, i) => cells.forEach((c, k) => (out[`hds/prim/color/hue-${i}/${STOPS[k]}`] = fmt(c))));
    neutral.forEach((c, k) => (out[`hds/prim/color/neutral/${STOPS[k]}`] = fmt(c)));
    out['hds/prim/color/white'] = 'oklch(100% 0 0)';
    out['hds/prim/color/black'] = 'oklch(0% 0 0)';
    for (const role of ROLES) {
      for (const stop of STOPS) out[`hds/prim/color/${role}/${stop}`] = `{hds/prim/color/hue-${w.roleSlot[role]}/${stop}}`;
    }
    return out;
  };

  const shared: Record<string, string> = {};
  const set = (name: string, value: string) => (shared[`hds/prim/${name}`] = value);
  for (const step of DIMENSION) set(`dimension/${step}`, `${round((Number(step) / 100) * 4 * d.density, 2)}px`);
  set('width/content', `${d.layout.contentWidth}px`);
  set('width/content-narrow', `${d.layout.contentWidthNarrow}px`);
  for (const [k, v] of Object.entries(RADIUS)) set(`radius/${k}`, `${v}px`);
  for (const [k, v] of Object.entries(BORDER)) set(`border/${k}`, `${v}px`);
  for (const [level, layers] of Object.entries(SHADOW)) {
    for (const [layer, geo] of Object.entries(layers)) {
      ['x', 'y', 'blur', 'spread'].forEach((p, i) => set(`shadow/${level}/${layer}/${p}`, `${geo[i]}px`));
    }
  }
  for (const [k, v] of Object.entries(d.typography.family)) set(`typography/family/${k}`, v);
  const { baseSize, ratio } = d.typography;
  for (const n of TYPE_STEPS) set(`typography/scale/${n}`, `${round((baseSize * ratio ** (n - 3)) / 16, 3)}rem`);
  for (const [k, v] of Object.entries(WEIGHT)) set(`typography/weight/${k}`, v);
  for (const [k, v] of Object.entries(LEADING)) set(`typography/leading/${k}`, v);
  for (const [k, v] of Object.entries(TRACKING)) set(`typography/tracking/${k}`, v);
  for (const step of DURATION) set(`motion/duration/${step}`, `${round(Number(step) * d.motion.duration, 0)}ms`);
  for (const [k, v] of Object.entries(EASING)) set(`motion/easing/${k}`, v);

  return { shared, light: colorSet(false), dark: colorSet(true), wheel: w };
}

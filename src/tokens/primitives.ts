// Drivers -> primitives (token spec gaps 1-3). Primitive names never depend on driver
// values, only their values do, so the name list is fixed (listed in token spec section 2).
import { clampChroma, converter, parse, type Oklch } from 'culori';
import type { Drivers } from './drivers.ts';

export const RAMPS = ['primary', 'accent', 'neutral', 'danger', 'warning', 'success', 'info'] as const;
export const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

// OKLCH lightness per step is fixed so every client's ramp has the same contrast shape:
// a Theme Map rule that passes contrast for one brand color mostly passes for all.
const LIGHTNESS = [0.975, 0.94, 0.88, 0.8, 0.71, 0.62, 0.53, 0.45, 0.38, 0.3, 0.23];
// Chroma relative to the brand color's step: muted at the ends, full in the middle.
const CHROMA = [0.12, 0.25, 0.45, 0.65, 0.85, 0.95, 1, 0.95, 0.85, 0.72, 0.6];

const SPACE = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24]; // multiples of the 4px grid
const TYPE_STEPS = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // step 3 = body size; 9 = largest display step
const LEADING = { tight: '1.1', snug: '1.25', normal: '1.5', relaxed: '1.65' };
const TRACKING = { tight: '-0.02em', normal: '0em', wide: '0.02em' };
const WEIGHT = { regular: '400', medium: '500', semibold: '600', bold: '700' };
const BORDER = { none: '0px', thin: '1px', medium: '2px', thick: '4px' };
const SHADOW = [
  // [y offset px, blur px, alpha]
  [0, 0, 0],
  [1, 3, 0.12],
  [4, 12, 0.14],
  [12, 32, 0.18],
];

/** Build-time only: breakpoints can't be custom properties (they don't work in @media). */
export const breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280 } as const;

const toOklch = converter('oklch');

/** 11-step ramp. The input color (clamped to sRGB) lands exactly on the step nearest its lightness. */
export function ramp(color: string): string[] {
  const parsed = parse(color);
  if (!parsed) throw new Error(`can't parse color "${color}"`);
  const brand = clampChroma(toOklch(parsed), 'oklch');
  const nearest = LIGHTNESS.reduce((best, l, i) =>
    Math.abs(l - brand.l) < Math.abs(LIGHTNESS[best] - brand.l) ? i : best, 0);
  const chroma = brand.c / CHROMA[nearest];
  const hue = brand.h ?? 0;
  return LIGHTNESS.map((l, i) =>
    i === nearest
      ? fmt(brand)
      : fmt(clampChroma({ mode: 'oklch', l, c: chroma * CHROMA[i], h: hue }, 'oklch')),
  );
}

const round = (n: number, digits: number) => Number(n.toFixed(digits));
const fmt = (c: Oklch) =>
  `oklch(${round(c.l * 100, 2)}% ${round(c.c, 4)} ${round(c.h ?? 0, 2)}${c.alpha === undefined || c.alpha === 1 ? '' : ` / ${c.alpha}`})`;

/** Resolves every primitive: slash name -> CSS value. */
export function resolvePrimitives(d: Drivers): Record<string, string> {
  const out: Record<string, string> = {};
  const set = (name: string, value: string) => (out[`hds/prim/${name}`] = value);

  const primaryHue = toOklch(parse(d.color.primary)!).h ?? 0;
  const colors = { ...d.color, neutral: d.color.neutral ?? `oklch(55% 0.012 ${primaryHue})` };
  for (const name of RAMPS) ramp(colors[name]).forEach((v, i) => set(`color/${name}/${STEPS[i]}`, v));
  set('color/white', 'oklch(100% 0 0)');
  set('color/black', 'oklch(0% 0 0)');

  for (const n of SPACE) set(`space/${n}`, `${round(n * 4 * d.density, 1)}px`);

  const r = d.radius;
  const radii = { none: 0, sm: r / 2, base: r, lg: r * 1.5, xl: r * 2, full: 9999 };
  for (const [k, v] of Object.entries(radii)) set(`radius/${k}`, `${round(v, 1)}px`);

  for (const [k, v] of Object.entries(BORDER)) set(`border/${k}`, v);

  const { baseSize, scaleRatio } = d.typography;
  for (const n of TYPE_STEPS) set(`type/scale/${n}`, `${round((baseSize * scaleRatio ** (n - 3)) / 16, 3)}rem`);
  for (const [k, v] of Object.entries(LEADING)) set(`type/leading/${k}`, v);
  for (const [k, v] of Object.entries(TRACKING)) set(`type/tracking/${k}`, v);
  set('type/family/heading', d.typography.headingFamily);
  set('type/family/body', d.typography.bodyFamily);
  for (const [k, v] of Object.entries(WEIGHT)) set(`type/weight/${k}`, v);

  const ink = toOklch(parse(out['hds/prim/color/neutral/950'])!);
  SHADOW.forEach(([y, blur, alpha], n) => {
    const a = round(alpha * d.shadow.strength, 3);
    set(`shadow/level-${n}`, a <= 0 ? 'none' : `0 ${y}px ${blur}px ${fmt({ ...ink, alpha: a })}`);
  });

  return out;
}

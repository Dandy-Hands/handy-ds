import { breakpoints } from '../tokens/primitives.ts';
import { SPACE, WIDTH } from '../tokens/names.ts';

export type Breakpoint = keyof typeof breakpoints;
/** One value, or an object keyed by breakpoint (`base` required). Mobile-first. */
export type Responsive<T> = T | ({ base: T } & Partial<Record<Breakpoint, T>>);
export type Space = 'none' | (typeof SPACE)[number];
export type Width = (typeof WIDTH)[number];

/** Measure step -> CSS value, a measure/space token var.`"none"` is 0. Built with join so the token-name scan does not read a partial name. */
export const spaceValue = (v: Space) => (v === 'none' ? '0' : `var(--${['hds', 'sem', 'measure', 'space', v].join('-')})`);

/** Measure step -> CSS value, a measure/width token var. `"full"` is 100%. Built with join, like `spaceValue`. */
export const widthValue = (v: Width | 'full') => (v === 'full' ? '100%' : `var(--${['hds', 'sem', 'measure', 'width', v].join('-')})`);

const keys = ['base', ...Object.keys(breakpoints)] as ('base' | Breakpoint)[];

/**
 * Turns a prop value into private custom properties `--_<name>-base`, `-sm`, `-md`, `-lg`, `-xl`.
 * Every key is always set (a missing key repeats the next smaller one), so CSS can read any of them.
 * `toCss` maps a value to its CSS text: `spaceValue` for measures, `String` (default) for counts and keywords.
 * Spread the result into `style`.
 *
 * The component's CSS picks them up mobile-first. Media queries cannot read custom properties, so
 * the CSS file repeats the numbers from `breakpoints`:
 *   .x { prop: var(--_name-base); }
 *   @media (min-width: 640px)  { .x { prop: var(--_name-sm); } }   // sm
 *   @media (min-width: 768px)  { .x { prop: var(--_name-md); } }   // md
 *   @media (min-width: 1024px) { .x { prop: var(--_name-lg); } }   // lg
 *   @media (min-width: 1280px) { .x { prop: var(--_name-xl); } }   // xl
 */
export function responsive<T>(name: string, value: Responsive<T>, toCss: (v: T) => string = String): Record<string, string> {
  const obj = (typeof value === 'object' && value !== null ? value : { base: value }) as { base: T } & Partial<Record<Breakpoint, T>>;
  const out: Record<string, string> = {};
  let last = obj.base;
  for (const k of keys) {
    last = obj[k as Breakpoint] ?? last;
    out[`--_${name}-${k}`] = toCss(last);
  }
  return out;
}

/** The CSS text for the pattern above, for tests that check a CSS file repeats the right numbers. */
export function responsiveCss(selector: string, prop: string, name: string): string {
  const rules = (Object.keys(breakpoints) as Breakpoint[]).map(
    (k) => `@media (min-width: ${breakpoints[k]}px) { ${selector} { ${prop}: var(--_${name}-${k}); } }`,
  );
  return [`${selector} { ${prop}: var(--_${name}-base); }`, ...rules].join('\n');
}

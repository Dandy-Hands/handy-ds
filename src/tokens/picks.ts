// Color picks -> color tokens (token-system-spec.md sections 5, 6.3 and 7.3).
// A pick is a primitive name such as `primary/600`. Root picks have library defaults;
// interaction states derive from them (5.2) unless a pick overrides the derived token.
import type { Context, Drivers } from './drivers.ts';
import { categoricalOrder, hueDistance, type Wheel } from './primitives.ts';
import {
  ACTION_PROP, CATEGORICAL, COLOR_TOKENS, CONTENT_ROLE, FEEDBACK_PROP, LEVEL, PRIORITY, ROLES, SENTIMENT, SLOT_COUNT, STOPS,
} from './names.ts';

export type ColorPicks = Record<string, string>;

/** Pick keys that are not token names: the Action disabled pair. Field's pair is its own disabled bg and fg. */
const PAIR_KEYS = ['action/disabled/bg', 'action/disabled/fg'];
export const PICK_KEYS = new Set([...COLOR_TOKENS.filter((n) => n !== 'overlay/scrim'), ...PAIR_KEYS]);

const STOP = `(${STOPS.join('|')})`;
const SCALE_PICK = new RegExp(`^((${[...ROLES, 'neutral'].join('|')})/${STOP}|white|black|transparent)$`);
const SLOT_PICK = new RegExp(`^hue-(\\d+)/${STOP}$`);

/** Throws when a pick key or value is not allowed (spec 5.1). */
export function checkPick(key: string, value: string, where: string): void {
  if (!PICK_KEYS.has(key)) throw new Error(`${where}: unknown color pick "${key}"`);
  if (SCALE_PICK.test(value)) return;
  const slot = SLOT_PICK.exec(value);
  if (slot && key.startsWith('graphic/') && Number(slot[1]) < SLOT_COUNT) return;
  throw new Error(`${where}.${key}: bad pick "${value}"`);
}

/** Library default root picks (spec 7.3, 7.4.2). All tunable. */
export function defaultPicks(w: Wheel): ColorPicks {
  const p: ColorPicks = {};
  const action: Record<string, [string, string, string]> = {
    primary: ['primary/600', 'neutral/50', 'primary/600'],
    secondary: ['transparent', 'primary/700', 'primary/600'],
    tertiary: ['transparent', 'primary/700', 'transparent'],
    danger: ['danger/600', 'neutral/50', 'danger/600'],
  };
  for (const pr of PRIORITY) ACTION_PROP.forEach((prop, i) => (p[`action/${pr}/default/${prop}`] = action[pr][i]));
  Object.assign(p, {
    'action/disabled/bg': 'neutral/100',
    'action/disabled/fg': 'neutral/400',
    'field/default/bg': 'neutral/50',
    'field/default/fg': 'neutral/900',
    'field/default/border': 'neutral/500',
    'field/default/placeholder': 'neutral/600',
    'field/focus/border': 'primary/600',
    'field/error/border': 'danger/600',
    'field/checked/bg': 'primary/600',
    'field/checked/fg': 'neutral/50',
    'field/disabled/bg': 'neutral/100',
    'field/disabled/fg': 'neutral/400',
    'graphic/divider/default': 'neutral/200',
    'graphic/divider/strong': 'neutral/400',
    'focus/ring': 'primary/600',
  });
  const surface = { sunken: 'neutral/200', base: 'neutral/100', raised: 'neutral/50', floating: 'neutral/50', modal: 'neutral/50' };
  for (const lv of LEVEL) Object.assign(p, { [`surface/${lv}/bg`]: surface[lv], [`surface/${lv}/border`]: 'neutral/200' });
  const content = { strong: 'neutral/950', default: 'neutral/900', muted: 'neutral/700', accent: 'primary/700', link: 'primary/700' };
  for (const r of CONTENT_ROLE) p[`content/${r}/fg`] = content[r];
  const feedback = { bg: 50, border: 200, fg: 900, icon: 600 };
  for (const s of SENTIMENT) for (const prop of FEEDBACK_PROP) p[`feedback/${s}/${prop}`] = `${s}/${feedback[prop]}`;

  categoricalOrder(w, CATEGORICAL).forEach((slot, i) => (p[`graphic/categorical/${i + 1}`] = `hue-${slot}/500`));
  [100, 200, 300, 400, 500, 600, 700, 800, 900].forEach((st, i) => (p[`graphic/sequential/${i + 1}`] = `primary/${st}`));
  const far = w.hues.reduce((best, h, i) => (hueDistance(h, w.hues[0]) > hueDistance(w.hues[best], w.hues[0]) ? i : best), 1);
  const diverging = [
    ...[900, 700, 500, 300].map((st) => `hue-0/${st}`),
    'neutral/100',
    ...[300, 500, 700, 900].map((st) => `hue-${far}/${st}`),
  ];
  diverging.forEach((v, i) => (p[`graphic/diverging/${i + 1}`] = v));
  return p;
}

/** Brand context default picks (spec 6.3). `R` is the context role. */
export function contextPicks(context: Context): ColorPicks {
  const R = context === 'on-primary' ? 'primary' : 'secondary';
  const p: ColorPicks = {
    'surface/base/bg': `${R}/600`,
    'surface/sunken/bg': `${R}/800`,
    'surface/raised/bg': `${R}/700`,
    'surface/floating/bg': `${R}/700`,
    'surface/modal/bg': `${R}/700`,
    'content/muted/fg': `${R}/50`,
    'content/link/hover/fg': `${R}/50`,
    'graphic/divider/default': `${R}/400`,
    'graphic/divider/strong': `${R}/300`,
    'focus/ring': 'neutral/50',
  };
  for (const lv of LEVEL) p[`surface/${lv}/border`] = `${R}/500`;
  for (const r of ['strong', 'default', 'accent', 'link']) p[`content/${r}/fg`] = 'neutral/50';
  const action: Record<string, [string, string, string]> = {
    primary: ['neutral/50', `${R}/700`, 'neutral/50'],
    secondary: ['transparent', 'neutral/50', 'neutral/50'],
    tertiary: ['transparent', 'neutral/50', 'transparent'],
  };
  for (const [pr, vals] of Object.entries(action)) ACTION_PROP.forEach((prop, i) => (p[`action/${pr}/default/${prop}`] = vals[i]));
  return p;
}

/**
 * Moves a pick n stops along its scale (spec 5.2 edge rules). `fg` is the paired foreground,
 * used when the base is transparent; `contextRole` replaces it inside a brand context.
 */
export function offset(pick: string, n: number, fg?: string, contextRole?: string): string {
  const at = (i: number) => STOPS[Math.min(10, Math.max(0, i))];
  if (pick === 'transparent') {
    if (contextRole) return `${contextRole}/${at(STOPS.indexOf(600) + n)}`;
    const role = !fg || ['white', 'black', 'transparent'].includes(fg) ? 'neutral' : fg.split('/')[0];
    return `${role}/${at(n - 1)}`;
  }
  if (pick === 'white') return `neutral/${at(n - 1)}`;
  if (pick === 'black') return `neutral/${at(10 - (n - 1))}`;
  const [scale, stop] = pick.split('/');
  const i = STOPS.indexOf(Number(stop) as (typeof STOPS)[number]);
  return `${scale}/${at(i + n > 10 ? i - n : i + n)}`;
}

/**
 * Resolves every color token (except `overlay/scrim`) from root picks. `base` holds the
 * defaults plus every explicit pick; a token in `base` is used as is, otherwise it derives.
 */
export function resolveColors(base: ColorPicks, d: Drivers, contextRole?: string): ColorPicks {
  const { hover, active } = d.states.step;
  const memo: ColorPicks = {};
  const get = (name: string): string => {
    if (name in memo) return memo[name];
    const value = base[name] ?? derive(name);
    if (value === undefined) throw new Error(`color: no pick for "${name}"`);
    return (memo[name] = value);
  };
  const derive = (name: string): string | undefined => {
    const seg = name.split('/');
    if (seg[0] === 'action') {
      const [, pr, state, prop] = seg;
      const d0 = (p: string) => get(`action/${pr}/default/${p}`);
      if (state === 'selected') return get(`action/${pr}/active/${prop}`);
      if (state === 'disabled') return get(`action/disabled/${prop === 'fg' ? 'fg' : 'bg'}`);
      const n = state === 'hover' ? hover : active;
      if (prop === 'fg') return d0('fg');
      if (prop === 'border' && d0('border') === 'transparent') return 'transparent';
      return offset(d0(prop), n, d0('fg'), contextRole);
    }
    if (seg[0] === 'field') {
      const [, state, prop] = seg;
      const d0 = (p: string) => get(`field/default/${p}`);
      if (state === 'hover' && prop === 'border') return offset(d0('border'), hover, d0('fg'));
      if (state === 'disabled') return get(`field/disabled/${prop === 'placeholder' ? 'fg' : 'bg'}`);
      if (state === 'checked' && prop === 'border') return get('field/checked/bg');
      return d0(prop);
    }
    if (name === 'content/link/hover/fg') return offset(get('content/link/fg'), hover);
    return undefined;
  };
  const out: ColorPicks = {};
  for (const name of PICK_KEYS) if (!PAIR_KEYS.includes(name)) out[name] = get(name);
  return out;
}

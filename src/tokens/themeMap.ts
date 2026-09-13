// Theme Map (token spec section 1): the default primitive -> semantic assignment for every
// token in section 7, plus the on-primary context overrides (section 3).
//
// Values are templates: `{hds/prim/...}` references a primitive and is emitted as
// var(--hds-prim-...). Anything else is literal CSS (`transparent`, color-mix(...)).
import type { Drivers } from './drivers.ts';
import {
  ACTION_STATE, ELEVATION, ICON_ROLE, INPUT_STATE, PRIORITY, SENTIMENT, SIZE, SURFACE_STATE, TYPE_ROLE, WEIGHT,
} from './names.ts';

export type TokenMap = Record<string, string>;
/** `on-primary` holds only the tokens whose value differs from `default`. */
export interface ThemeMap {
  default: TokenMap;
  'on-primary': TokenMap;
}

type Props = Record<string, string>;
type StateTable = { default: Props } & Partial<Record<string, Props>>;

const p = (name: string) => `{hds/prim/${name}}`;
const c = (name: string) => p(`color/${name}`);
const mix = (name: string, pct: number) => `color-mix(in oklch, ${c(name)} ${pct}%, transparent)`;

/** Writes `{prefix}/{state}/{prop}` for every state; unset props fall back to `default`. */
function expand(out: TokenMap, prefix: string, states: readonly string[], table: StateTable) {
  for (const state of states) {
    for (const [prop, value] of Object.entries({ ...table.default, ...table[state] })) {
      out[`hds/sem/${prefix}/${state}/${prop}`] = value;
    }
  }
}

function put(out: TokenMap, prefix: string, props: Props) {
  for (const [prop, value] of Object.entries(props)) out[`hds/sem/${prefix}/${prop}`] = value;
}

// ---------- default context ----------

const ACTION: Record<string, StateTable> = {
  primary: {
    default: { bg: c('primary/600'), fg: c('white'), border: 'transparent' },
    hover: { bg: c('primary/700') },
    active: { bg: c('primary/800') },
    selected: { bg: c('primary/800') },
    disabled: { bg: c('neutral/200'), fg: c('neutral/500') },
  },
  secondary: {
    default: { bg: c('primary/50'), fg: c('primary/700'), border: c('primary/200') },
    hover: { bg: c('primary/100') },
    active: { bg: c('primary/200'), fg: c('primary/800') },
    selected: { bg: c('primary/200'), fg: c('primary/800'), border: c('primary/400') },
    disabled: { bg: c('neutral/100'), fg: c('neutral/400'), border: c('neutral/200') },
  },
  tertiary: {
    default: { bg: 'transparent', fg: c('primary/700'), border: 'transparent' },
    hover: { bg: c('primary/50'), fg: c('primary/800') },
    active: { bg: c('primary/100'), fg: c('primary/900') },
    selected: { bg: c('primary/100'), fg: c('primary/800') },
    disabled: { fg: c('neutral/400') },
  },
};

const INPUT: StateTable = {
  default: { bg: c('white'), fg: c('neutral/900'), border: c('neutral/500'), 'placeholder-fg': c('neutral/600') },
  hover: { border: c('neutral/700') },
  focus: { border: c('primary/600') },
  error: { border: c('danger/600') },
  disabled: { bg: c('neutral/100'), fg: c('neutral/500'), border: c('neutral/200'), 'placeholder-fg': c('neutral/400') },
  checked: { bg: c('primary/600'), fg: c('white'), border: c('primary/600') },
};

const TYPE_COLOR = { display: 'neutral/950', heading: 'neutral/950', body: 'neutral/800', label: 'neutral/900', caption: 'neutral/700' };
const ICON_COLOR = { default: 'neutral/800', secondary: 'neutral/600', accent: 'accent/600' };

// ---------- on-primary context ----------

const ACTION_ON_PRIMARY: Record<string, StateTable> = {
  primary: {
    default: { bg: c('white'), fg: c('primary/700'), border: 'transparent' },
    hover: { bg: c('primary/50') },
    active: { bg: c('primary/100'), fg: c('primary/800') },
    selected: { bg: c('primary/100'), fg: c('primary/800') },
    disabled: { bg: mix('white', 30), fg: mix('white', 60) },
  },
  secondary: {
    default: { bg: 'transparent', fg: c('white'), border: c('white') },
    hover: { bg: c('primary/700') },
    active: { bg: c('primary/800') },
    selected: { bg: c('primary/800') },
    disabled: { fg: mix('white', 50), border: mix('white', 30) },
  },
  tertiary: {
    default: { bg: 'transparent', fg: c('white'), border: 'transparent' },
    hover: { bg: c('primary/700') },
    active: { bg: c('primary/800') },
    selected: { bg: c('primary/800') },
    disabled: { fg: mix('white', 50) },
  },
};

const INPUT_ON_PRIMARY: StateTable = {
  default: { ...INPUT.default, border: c('white') },
  hover: { border: c('primary/100') },
  focus: INPUT.focus,
  error: INPUT.error,
  disabled: { bg: c('primary/500'), fg: c('primary/200'), border: c('primary/400'), 'placeholder-fg': c('primary/300') },
  checked: { bg: c('white'), fg: c('primary/700'), border: c('white') },
};

const TYPE_COLOR_ON_PRIMARY = { display: 'white', heading: 'white', body: 'primary/50', label: 'primary/50', caption: 'primary/50' };
const ICON_COLOR_ON_PRIMARY = { default: 'white', secondary: 'primary/100', accent: 'accent/200' };

export function themeMap(d: Drivers): ThemeMap {
  const m: TokenMap = {};
  const { action, input, surface } = d.style;

  // ACTION
  for (const pr of PRIORITY) expand(m, `action/color/${pr}`, ACTION_STATE, ACTION[pr]);
  put(m, 'action/measure', {
    'padding-x': p('space/4'),
    'padding-y': p('space/2'),
    radius: p(`radius/${action.radius}`),
    gap: p('space/2'),
    'border-width': p(`border/${action.border}`),
  });

  // INPUT/FIELD
  expand(m, 'input/color', INPUT_STATE, INPUT);
  const inputSizes = { sm: [2, 1, 8], md: [3, 2, 10], lg: [4, 3, 12] }; // padding-x, padding-y, height (space steps)
  for (const size of SIZE) {
    const [px, py, h] = inputSizes[size as keyof typeof inputSizes];
    put(m, `input/measure/${size}`, {
      'padding-x': p(`space/${px}`),
      'padding-y': p(`space/${py}`),
      height: p(`space/${h}`),
      radius: p(`radius/${input.radius}`),
      'border-width': p(`border/${input.border}`),
    });
  }

  // SURFACE
  for (const e of ELEVATION) {
    expand(m, `surface/color/${e}`, SURFACE_STATE, {
      default: { bg: c(e === '0' ? 'neutral/50' : 'white'), border: c('neutral/200'), shadow: p(`shadow/level-${e}`) },
      striped: { bg: c(e === '0' ? 'neutral/100' : 'neutral/50') },
    });
  }
  put(m, 'surface/measure', {
    padding: p('space/6'),
    radius: p(`radius/${surface.radius}`),
    'border-width': p(`border/${surface.border}`),
  });

  // TYPE
  const heading = p(`type/weight/${d.typography.headingWeight}`);
  const typeRoles: Record<string, [number, string, string, string, string]> = {
    // scale step, leading, tracking, family, weight
    display: [8, 'tight', 'tight', 'heading', heading],
    heading: [6, 'snug', 'tight', 'heading', heading],
    body: [3, 'relaxed', 'normal', 'body', p('type/weight/regular')],
    label: [3, 'normal', 'normal', 'body', p('type/weight/medium')],
    caption: [2, 'normal', 'wide', 'body', p('type/weight/regular')],
  };
  for (const role of TYPE_ROLE) {
    const [scale, leading, tracking, family, weight] = typeRoles[role];
    put(m, `type/color/${role}`, { fg: c(TYPE_COLOR[role as keyof typeof TYPE_COLOR]) });
    put(m, `type/measure/${role}`, {
      size: p(`type/scale/${scale}`),
      'line-height': p(`type/leading/${leading}`),
      'letter-spacing': p(`type/tracking/${tracking}`),
    });
    put(m, `type/other/${role}`, { 'font-family': p(`type/family/${family}`), weight });
  }

  // ICON
  for (const role of ICON_ROLE) put(m, `icon/color/${role}`, { fg: c(ICON_COLOR[role as keyof typeof ICON_COLOR]) });

  // DIVIDER
  put(m, 'divider/color', { border: c('neutral/200') });
  for (const w of WEIGHT) put(m, `divider/measure/${w}`, { thickness: p(`border/${w}`) });

  // FEEDBACK
  for (const s of SENTIMENT) {
    put(m, `feedback/color/${s}`, { bg: c(`${s}/50`), fg: c(`${s}/800`), border: c(`${s}/200`), 'icon-fg': c(`${s}/600`) });
  }
  put(m, 'feedback/measure', {
    padding: p('space/4'),
    radius: p(`radius/${surface.radius}`),
    gap: p('space/3'),
    'border-width': p(`border/${surface.border}`),
  });

  // OVERLAY
  put(m, 'overlay/color', { bg: mix('black', 50) });

  // FOCUS
  put(m, 'focus/color', { stroke: c('primary/600') });
  put(m, 'focus/measure', { 'stroke-width': p('border/medium') });

  // ON-PRIMARY: build the full override set, then keep only what differs from default.
  const o: TokenMap = {};
  for (const pr of PRIORITY) expand(o, `action/color/${pr}`, ACTION_STATE, ACTION_ON_PRIMARY[pr]);
  expand(o, 'input/color', INPUT_STATE, INPUT_ON_PRIMARY);
  const grounds = ['primary/600', 'primary/700', 'primary/800', 'primary/900', 'primary/950'];
  ELEVATION.forEach((e, i) => {
    expand(o, `surface/color/${e}`, SURFACE_STATE, {
      default: { bg: c(grounds[i]), border: mix('white', 20) },
      striped: { bg: c(grounds[i + 1]) },
    });
  });
  for (const role of TYPE_ROLE) put(o, `type/color/${role}`, { fg: c(TYPE_COLOR_ON_PRIMARY[role as keyof typeof TYPE_COLOR_ON_PRIMARY]) });
  for (const role of ICON_ROLE) put(o, `icon/color/${role}`, { fg: c(ICON_COLOR_ON_PRIMARY[role as keyof typeof ICON_COLOR_ON_PRIMARY]) });
  put(o, 'divider/color', { border: mix('white', 30) });
  put(o, 'focus/color', { stroke: c('white') });

  const onPrimary = Object.fromEntries(Object.entries(o).filter(([k, v]) => m[k] !== v));
  return { default: m, 'on-primary': onPrimary };
}

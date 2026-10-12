// Driver config (token-system-spec.md section 3). This file IS the driver authoring method:
// a client theme is a partial override of `defaultDrivers`, passed to buildTheme() or the
// `hds-theme` CLI. Drivers are the only client input; there is no mapping level.
import type { BORDER_ROLE, SHAPE_ROLE, SYSTEM_ROLES, TEXT_ROLE, TEXT_SIZE } from './names.ts';

export type Mode = 'light' | 'dark' | 'system';
export type Context = 'on-primary' | 'on-secondary';
export type RadiusStep = 'none' | '050' | '100' | '200' | '300' | '400' | '600' | 'round';
export type BorderStep = 'none' | '025' | '050' | '100';
export type WeightStep = 'regular' | 'medium' | 'semibold' | 'bold';
export type LeadingStep = 'tight' | 'snug' | 'normal' | 'relaxed';
export type TrackingStep = 'tight' | 'normal' | 'wide';
export type FamilyStep = 'heading' | 'body' | 'mono';

/**
 * A color pick (spec 5.1): `{role}/{stop}` (`primary/600`, `neutral/50`), `white`, `black`,
 * `transparent`, or `hue-{n}/{stop}` (data visualization only). The object form adds a
 * dark-mode override (spec 5.3).
 */
export type Pick = string | { light?: string; dark?: string };

/** One role's text style (spec 7.7). `size` holds type scale steps, 1-9; only size varies by step. */
export interface TextStyle {
  family: FamilyStep;
  weight: WeightStep;
  leading: LeadingStep;
  tracking: TrackingStep;
  size: Record<(typeof TEXT_SIZE)[number], number>;
}
type TextPicks = Partial<Record<(typeof TEXT_ROLE)[number], Partial<Omit<TextStyle, 'size'>> & { size?: Partial<TextStyle['size']> }>>;

export interface Drivers {
  color: {
    /** Any CSS color culori can parse. Anchor 1 of the hue wheel. */
    primary: string;
    /** Optional anchor 2. Default hue: primary + 163.6°. */
    secondary?: string;
    /** Lowest relative chroma of the 9 generated slots, 0-1. */
    floor: number;
    /** Relative chroma of the neutral scale, at the primary hue, 0-0.3. */
    neutralTint: number;
    /** Replaces the neutral hue and tint. Lands exactly on its stop. */
    neutral?: string;
    /** Bends the light lightness ladder, -1 to +1. */
    contrast: number;
    /** Bends the dark lightness ladder, -1 to +1. */
    darkContrast: number;
    /** Scales relative chroma in the dark palette, 0.4-1. */
    darkChroma: number;
  };
  /** Slot per system role, `hue-0` to `hue-10`. Unset = proximity pick (spec 4.1.4). */
  roles: Partial<Record<(typeof SYSTEM_ROLES)[number], string>>;
  /**
   * Color picks, keyed by color token without `hds/sem/color/` (e.g. `action/primary/default/bg`).
   * Extra keys `action/disabled/{bg|fg}` set the Action disabled pair for every priority. A pick on a derived state token overrides the derivation.
   */
  picks: Record<string, Pick>;
  /** Interaction state offsets, in stops (spec 5.2). */
  states: { step: { hover: number; active: number } };
  /** Brand context override picks, same keys as `picks` (spec 6.3). */
  contexts: Record<Context, Record<string, Pick>>;
  overlay: { opacity: number };
  /** Page default mode (spec 6.1). */
  mode: Mode;
  /** `data-section="hero"` renders in the named mode or brand context. */
  sections: Record<string, 'light' | 'dark' | Context>;
  typography: {
    /** Full CSS font-family stacks. Loading the font files is the client app's job. */
    family: Record<FamilyStep, string>;
    /** Body text size in px (type scale step 3). */
    baseSize: number;
    /** Each type scale step multiplies the previous one by this. */
    ratio: number;
    /** Text style overrides, e.g. `{ headline: { weight: 'semibold', size: { lg: 6 } } }`. */
    styles: TextPicks;
  };
  /** Multiplies the 4px grid. 1 = default, ~0.85 compact, ~1.15 roomy. */
  density: number;
  radius: Record<(typeof SHAPE_ROLE)[number], RadiusStep>;
  border: Record<(typeof BORDER_ROLE)[number], BorderStep>;
  /** 0 = flat (no shadows), 1 = default, >1 = heavier. */
  shadow: { strength: number };
}

export const defaultDrivers: Drivers = {
  color: {
    primary: '#0069ca',
    floor: 0.5,
    neutralTint: 0.06,
    contrast: 0,
    darkContrast: 0,
    darkChroma: 0.85,
  },
  roles: {},
  picks: {},
  states: { step: { hover: 1, active: 2 } },
  contexts: { 'on-primary': {}, 'on-secondary': {} },
  overlay: { opacity: 0.5 },
  mode: 'light',
  sections: { hero: 'on-primary' },
  typography: {
    family: {
      heading: '"Source Serif 4", Georgia, serif',
      body: 'Inter, system-ui, sans-serif',
      mono: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
    },
    baseSize: 16,
    ratio: 1.25,
    styles: {},
  },
  density: 1,
  radius: { control: '200', container: '300', indicator: '100', round: 'round' },
  border: { control: '025', container: '025', divider: '025', focus: '050' },
  shadow: { strength: 1 },
};

type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };
/** Config metadata (spec 3.4). Not a driver: buildTheme() ignores it. */
export interface ThemeMeta {
  client?: string;
  /** The handy-ds version the theme was built with. */
  version?: string;
}
export type DriverInput = DeepPartial<Drivers> & { meta?: ThemeMeta };

/** Deep-merges a partial driver config over the defaults. */
export function withDefaults(input: DriverInput = {}): Drivers {
  return merge(defaultDrivers, input) as Drivers;
}

function merge(base: unknown, over: unknown): unknown {
  if (!isObject(base) || !isObject(over)) return over === undefined ? base : over;
  const out: Record<string, unknown> = { ...base };
  for (const [k, v] of Object.entries(over)) out[k] = merge(base[k], v);
  return out;
}

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

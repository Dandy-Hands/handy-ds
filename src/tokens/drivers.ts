// Driver config (vision spec section 6, token spec section 1). This file IS the driver
// authoring method (token spec gap 10): a client theme is a partial override of
// `defaultDrivers`, passed to buildTheme() or the `hds-theme` CLI.

export type RadiusStep = 'none' | 'sm' | 'base' | 'lg' | 'xl' | 'full';
export type BorderStep = 'none' | 'thin' | 'medium' | 'thick';
export type WeightStep = 'regular' | 'medium' | 'semibold' | 'bold';
export type Context = 'default' | 'on-primary';

/** Per-category style driver: picks a step on a shared primitive scale (token spec section 1). */
export interface CategoryStyle {
  radius: RadiusStep;
  border: BorderStep;
}

export interface Drivers {
  /** Any CSS color culori can parse (hex, rgb(), oklch()...). Each becomes an 11-step ramp. */
  color: {
    primary: string;
    accent: string;
    /** Omit to tint the neutral ramp from the primary hue. */
    neutral?: string;
    danger: string;
    warning: string;
    success: string;
    info: string;
  };
  typography: {
    /** Full CSS font-family stacks. Loading the font files is the client app's job. */
    headingFamily: string;
    bodyFamily: string;
    /** Body text size in px (type scale step 3). */
    baseSize: number;
    /** Each type scale step multiplies the previous one by this. */
    scaleRatio: number;
    headingWeight: WeightStep;
  };
  /** Multiplies the 4px spacing grid. 1 = default, ~0.85 compact, ~1.15 roomy. */
  density: number;
  /** The `base` radius step, in px. Other radius steps scale from it. */
  radius: number;
  style: {
    action: CategoryStyle;
    input: CategoryStyle;
    surface: CategoryStyle;
  };
  /** 0 = flat (no shadows), 1 = default, >1 = heavier. */
  shadow: { strength: number };
  /** Section color rules: `data-section="hero"` renders in the named context. */
  sections: Record<string, Context>;
}

export const defaultDrivers: Drivers = {
  color: {
    primary: '#0069ca',
    accent: '#d55c13',
    danger: '#cc272e',
    warning: '#dc8900',
    success: '#1b9247',
    info: '#0081b1',
  },
  typography: {
    headingFamily: '"Source Serif 4", Georgia, serif',
    bodyFamily: 'Inter, system-ui, sans-serif',
    baseSize: 16,
    scaleRatio: 1.25,
    headingWeight: 'bold',
  },
  density: 1,
  radius: 8,
  style: {
    action: { radius: 'base', border: 'thin' },
    input: { radius: 'base', border: 'thin' },
    surface: { radius: 'lg', border: 'thin' },
  },
  shadow: { strength: 1 },
  sections: { hero: 'on-primary' },
};

type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };
export type DriverInput = DeepPartial<Drivers>;

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

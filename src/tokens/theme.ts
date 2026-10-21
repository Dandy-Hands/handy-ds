// Driver config -> theme CSS. One call runs the whole pipeline: drivers -> primitives ->
// picks -> semantic tokens -> CSS, and reports contrast failures for that config.
import { type Context, type DriverInput, type Drivers, type Pick, type TextStyle, withDefaults } from './drivers.ts';
import { resolvePrimitives, SHADOW_ALPHA, type Primitives } from './primitives.ts';
import { checkPick, contextPicks, defaultPicks, resolveColors, type ColorPicks } from './picks.ts';
import { checkContrast, type ContrastFailure } from './contrast.ts';
import { BORDER_ROLE, ELEVATION, MEDIA_STRENGTH, MEDIA_TONE, SHAPE_ROLE, SIZE, SPACE, TEXT_PROP, TEXT_ROLE, TEXT_SIZE, WIDTH, WIDTH_PAGE } from './names.ts';

export type ColorMode = 'light' | 'dark';
export const CONTEXTS: Context[] = ['on-primary', 'on-secondary'];
/** Resolved color picks per mode and context (`default` = root). */
export type ColorMap = Record<ColorMode, Record<'default' | Context, ColorPicks>>;

/** Alpha of each media scrim strength. Strong passes 4.5:1 for text, medium 3:1 (large text), subtle is decorative. Checked in contrast.ts. */
export const MEDIA_ALPHA: Record<(typeof MEDIA_STRENGTH)[number], number> = { subtle: 0.2, medium: 0.5, strong: 0.6 };
const SECTION_NAME = /^[a-z0-9-]+$/;
const REFS = /\{(hds\/prim\/[^}]+)\}/g;

/** `hds/sem/color/action/primary/hover/bg` -> `--hds-sem-color-action-primary-hover-bg` */
export const cssVar = (slash: string) => `--${slash.replaceAll('/', '-')}`;
const cssValue = (template: string) => template.replace(REFS, (_, name) => `var(${cssVar(name)})`);
const colorRef = (pick: string) => (pick === 'transparent' ? 'transparent' : `{hds/prim/color/${pick}}`);

// Default text styles (spec 7.7): role properties and the md scale step. sm and lg default to one step down and up.
const TEXT: Record<string, Omit<TextStyle, 'size'> & { md: number }> = {
  display: { family: 'heading', md: 7, weight: 'bold', leading: 'tight', tracking: 'tight' },
  headline: { family: 'heading', md: 5, weight: 'bold', leading: 'snug', tracking: 'normal' },
  body: { family: 'body', md: 3, weight: 'regular', leading: 'normal', tracking: 'normal' },
  label: { family: 'body', md: 3, weight: 'medium', leading: 'snug', tracking: 'normal' },
  caption: { family: 'body', md: 2, weight: 'regular', leading: 'normal', tracking: 'normal' },
};

/** Semantic tokens other than color: the same in every mode and context. */
function otherTokens(d: Drivers): Record<string, string> {
  const out: Record<string, string> = {};
  const put = (name: string, value: string) => (out[`hds/sem/${name}`] = value);
  for (const s of SPACE) put(`measure/space/${s}`, `{hds/prim/dimension/${s}}`);
  for (const s of SIZE) put(`measure/size/${s}`, `{hds/prim/dimension/${s}}`);
  for (const s of WIDTH) put(`measure/width/${s}`, `{hds/prim/dimension/${s}}`);
  for (const w of WIDTH_PAGE) put(`measure/width/${w}`, `{hds/prim/width/${w}}`);
  for (const r of SHAPE_ROLE) put(`radius/${r}`, `{hds/prim/radius/${d.radius[r]}}`);
  for (const r of BORDER_ROLE) put(`border/${r}`, `{hds/prim/border/${d.border[r]}}`);
  for (const level of ELEVATION) {
    const layers = Object.entries(SHADOW_ALPHA).map(([layer, alpha]) => {
      const a = Number((alpha * d.shadow.strength).toFixed(3));
      const geo = ['x', 'y', 'blur', 'spread'].map((p) => `{hds/prim/shadow/${level}/${layer}/${p}}`).join(' ');
      return `${geo} oklch(0% 0 0 / ${a})`;
    });
    put(`elevation/${level}`, d.shadow.strength <= 0 ? 'none' : layers.join(', '));
  }
  for (const role of TEXT_ROLE) {
    const { size: sizes = {}, ...picks } = d.typography.styles[role] ?? {};
    const { md: base, ...s } = { ...TEXT[role], ...picks };
    const md = sizes.md ?? base;
    const steps = { sm: md - 1, md, lg: md + 1, ...sizes };
    for (const prop of TEXT_PROP) put(`typography/${role}/${prop}`, `{hds/prim/typography/${prop}/${s[prop]}}`);
    for (const size of TEXT_SIZE) {
      const step = steps[size];
      if (!(Number.isInteger(step) && step >= 1 && step <= 9)) {
        throw new Error(`typography.styles.${role}.size.${size}: expected a scale step 1-9, got ${step}`);
      }
      put(`typography/${role}/size/${size}`, `{hds/prim/typography/scale/${step}}`);
    }
  }
  return out;
}

const lightOf = (p: Pick) => (typeof p === 'string' ? p : p.light);
const darkOf = (p: Pick) => (typeof p === 'string' ? undefined : p.dark);

/** Picks for one mode: light values, then dark overrides on top in dark mode. */
function modePicks(picks: Record<string, Pick>, mode: ColorMode, where: string): ColorPicks {
  const out: ColorPicks = {};
  for (const [key, pick] of Object.entries(picks)) {
    const value = (mode === 'dark' ? darkOf(pick) : undefined) ?? lightOf(pick);
    if (value === undefined) continue;
    checkPick(key, value, where);
    out[key] = value;
  }
  return out;
}

function colorMap(d: Drivers, prims: Primitives): ColorMap {
  const defaults = defaultPicks(prims.wheel);
  const map = {} as ColorMap;
  for (const mode of ['light', 'dark'] as const) {
    const root = { ...defaults, ...modePicks(d.picks, mode, 'picks') };
    map[mode] = { default: resolveColors(root, d) } as ColorMap[ColorMode];
    for (const ctx of CONTEXTS) {
      const base = { ...root, ...contextPicks(ctx), ...modePicks(d.contexts[ctx] ?? {}, mode, `contexts.${ctx}`) };
      map[mode][ctx] = resolveColors(base, d, ctx === 'on-primary' ? 'primary' : 'secondary');
    }
  }
  return map;
}

export function buildTheme({ meta: _meta, ...input }: DriverInput = {}) {
  const drivers = withDefaults(input);
  for (const [name, target] of Object.entries(drivers.sections)) {
    if (!SECTION_NAME.test(name)) throw new Error(`sections: bad section name "${name}"`);
    if (!['light', 'dark', ...CONTEXTS].includes(target)) throw new Error(`sections.${name}: unknown target "${target}"`);
  }
  const { contentWidth, contentWidthNarrow } = drivers.layout;
  if (!(contentWidthNarrow > 0 && contentWidth >= contentWidthNarrow)) {
    throw new Error(`layout: expected 0 < contentWidthNarrow <= contentWidth, got ${contentWidthNarrow} and ${contentWidth}`);
  }
  const primitives = resolvePrimitives(drivers);
  const colors = colorMap(drivers, primitives);
  const other = otherTokens(drivers);
  return {
    drivers,
    primitives,
    colors,
    other,
    css: toCss(drivers, primitives, colors, other),
    contrast: checkContrast(primitives, colors) satisfies ContrastFailure[],
  };
}

function toCss(d: Drivers, prims: Primitives, colors: ColorMap, other: Record<string, string>): string {
  const scrim = `color-mix(in oklch, {hds/prim/color/black} ${Math.round(d.overlay.opacity * 100)}%, transparent)`;
  const sem = (picks: ColorPicks, keys = Object.keys(picks)): [string, string][] =>
    keys.map((k) => [`hds/sem/color/${k}`, colorRef(picks[k])]);
  // Custom properties resolve var() where they are declared, so a mode block re-declares
  // every color primitive and every color token, not only the primitives.
  const modeDecls = (mode: ColorMode): [string, string][] => [
    ...Object.entries(prims[mode]),
    ...sem(colors[mode].default),
    ['hds/sem/color/overlay/scrim', scrim],
    ...MEDIA_TONE.flatMap((tone): [string, string][] =>
      MEDIA_STRENGTH.map((s) => [
        `hds/sem/color/overlay/media/${tone}/${s}`,
        `color-mix(in oklch, {hds/prim/color/${tone === 'dark' ? 'black' : 'white'}} ${Math.round(MEDIA_ALPHA[s] * 100)}%, transparent)`,
      ]),
    ),
  ];
  const decls = (entries: [string, string][]) => entries.map(([k, v]) => `    ${cssVar(k)}: ${cssValue(v)};`).join('\n');
  const block = (sel: string[], entries: [string, string][]) =>
    sel.length && entries.length ? `  ${sel.join(',\n  ')} {\n${decls(entries)}\n  }` : '';
  const sections = (target: string) =>
    Object.entries(d.sections).filter(([, t]) => t === target).map(([name]) => `[data-section="${name}"]`);

  const lightScopes = ['[data-mode="light"]', ...sections('light')];
  const darkScopes = [...(d.mode === 'dark' ? [':root'] : []), '[data-mode="dark"]', ...sections('dark')];
  // Dark-only rules for a scope inside dark mode. In `system` mode they also apply under :root
  // in the media query. ponytail: a light subtree inside dark still matches these descendant rules.
  const inDark = (inner: string[], entries: [string, string][]) => {
    const under = (scopes: string[]) => scopes.flatMap((s) => inner.flatMap((i) => [`${s} ${i}`, `${s}${i}`]));
    return [
      block(under(darkScopes), entries),
      d.mode === 'system' && entries.length
        ? `  @media (prefers-color-scheme: dark) {\n${block(under([':root']), entries).replace(/^/gm, '  ')}\n  }`
        : '',
    ];
  };

  const out: string[] = [
    block([':root'], [...Object.entries(prims.shared), ...Object.entries(other), ...modeDecls('light')]),
    d.mode === 'system' ? `  @media (prefers-color-scheme: dark) {\n${block([':root'], modeDecls('dark')).replace(/^/gm, '  ')}\n  }` : '',
    block(lightScopes, modeDecls('light')),
    block(darkScopes, modeDecls('dark')),
  ];

  const changed = new Set<string>();
  for (const ctx of CONTEXTS) {
    const keys = Object.keys(colors.light.default).filter(
      (k) => colors.light[ctx][k] !== colors.light.default[k] || colors.dark[ctx][k] !== colors.dark.default[k],
    );
    keys.forEach((k) => changed.add(k));
    const scope = [`[data-context="${ctx}"]`, ...sections(ctx)];
    out.push(block(scope, sem(colors.light[ctx], keys)));
    out.push(...inDark(scope, sem(colors.dark[ctx], keys.filter((k) => colors.dark[ctx][k] !== colors.light[ctx][k]))));
  }
  // Nested `default` restores the root value of everything a context can change.
  const reset = ['[data-context="default"]'];
  out.push(block(reset, sem(colors.light.default, [...changed])));
  out.push(...inDark(reset, sem(colors.dark.default, [...changed].filter((k) => colors.dark.default[k] !== colors.light.default[k]))));

  return [
    '/* Generated by handy-ds from a driver config. Do not edit: change the config instead. */',
    '@layer hds.theme, hds.base, hds.components;',
    '@layer hds.theme {',
    ...out.filter(Boolean),
    '}',
    '',
  ].join('\n');
}

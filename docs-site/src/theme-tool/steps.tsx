// The 8 steps of the theme tool (theme-customization-spec.md section 3).
// Samples inside `.hds-live` render with the theme under edit; the rest of the chrome keeps
// the default theme (interview F2).
import { useEffect, useState } from 'react';
import { Button, Input } from 'handy-ds';
import { defaultDrivers, withDefaults, type DriverInput, type Drivers, type Pick, type RadiusStep, type BorderStep } from '../../../src/tokens/drivers.ts';
import { contextPicks, defaultPicks } from '../../../src/tokens/picks.ts';
import { ladder, wheel } from '../../../src/tokens/primitives.ts';
import { BORDER_ROLE, COLOR_TOKENS, ELEVATION, SHAPE_ROLE, SPACE, SYSTEM_ROLES, TEXT_PROP, TEXT_ROLE, TEXT_SIZE } from '../../../src/tokens/names.ts';
import { buildTheme, cssVar } from '../../../src/tokens/theme.ts';
import { ColorField, Reset, Slider, Steps, SwatchGrid, SLOTS, STOP_LIST } from './controls.tsx';
import { bestFg, getIn, pairFailure, pickColor, setIn, withPickPart, type Path, type Theme } from './model.ts';

export type Ctx = 'default' | 'on-primary' | 'on-secondary';
export interface StepProps {
  state: DriverInput;
  d: Drivers;
  theme: Theme;
  set: (path: Path, value: unknown) => void;
  mode: 'light' | 'dark';
  setMode: (m: 'light' | 'dark') => void;
  /** Token to scroll to and open in step 3 (from the contrast report). */
  focus?: { ctx: Ctx; token: string };
}

const v = (name: string) => `var(${cssVar(name)})`;
const Live = ({ mode, children, className = '' }: { mode: 'light' | 'dark'; children: React.ReactNode; className?: string }) => (
  <div className={`hds-live tt-live ${className}`} data-mode={mode}>{children}</div>
);

function ModeSwitch({ mode, setMode }: Pick2<StepProps, 'mode' | 'setMode'>) {
  return (
    <div className="tt-steps tt-modeswitch" role="group" aria-label="Palette mode">
      {(['light', 'dark'] as const).map((m) => (
        <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)}>{m}</button>
      ))}
    </div>
  );
}
type Pick2<T, K extends keyof T> = { [P in K]: T[P] };

// ---------- Step 1: Brand colors ----------

export function BrandColors({ d, theme, set, mode, setMode }: StepProps) {
  const w = theme.primitives.wheel;
  const def = defaultDrivers.color;
  return (
    <>
      <ColorField label="Primary" value={d.color.primary} def={def.primary} onChange={(x) => set(['color', 'primary'], x)} />

      <div className="tt-control">
        <label className="tt-check">
          <input type="checkbox" checked={d.color.secondary === undefined}
            onChange={(e) => set(['color', 'secondary'], e.target.checked ? undefined : pickColor(theme, 'light', 'secondary/600'))} />
          Use the default secondary: primary + 163.6° (lands at {w.hues[w.secondarySlot].toFixed(0)}°)
          <span className="tt-chip" style={{ background: pickColor(theme, 'light', 'secondary/600') ?? undefined }} />
        </label>
      </div>
      {d.color.secondary !== undefined && (
        <ColorField label="Secondary" value={d.color.secondary} onChange={(x) => set(['color', 'secondary'], x)} />
      )}

      <div className="tt-control">
        <label className="tt-check">
          <input type="checkbox" checked={d.color.neutral !== undefined}
            onChange={(e) => set(['color', 'neutral'], e.target.checked ? pickColor(theme, 'light', 'neutral/500') : undefined)} />
          Set a neutral color (replaces the tint)
        </label>
      </div>
      {d.color.neutral !== undefined
        ? <ColorField label="Neutral" value={d.color.neutral} onChange={(x) => set(['color', 'neutral'], x)} />
        : <Slider label="Neutral tint" value={d.color.neutralTint} def={def.neutralTint} min={0} max={0.3} step={0.01}
            onChange={(x) => set(['color', 'neutralTint'], x)} hint="Relative chroma of the neutral scale, at the primary hue." />}

      <Slider label="Chroma floor" value={d.color.floor} def={def.floor} min={0} max={1} step={0.05}
        onChange={(x) => set(['color', 'floor'], x)} hint="Lowest relative chroma of the 9 generated slots." />
      <Slider label="Contrast" value={d.color.contrast} def={def.contrast} min={-1} max={1} step={0.1}
        onChange={(x) => set(['color', 'contrast'], x)} hint="Bends the lightness stops of every light ramp." />
      <Slider label="Dark contrast" value={d.color.darkContrast} def={def.darkContrast} min={-1} max={1} step={0.1}
        onChange={(x) => set(['color', 'darkContrast'], x)} hint="Dark palette only. Switch the grid to dark to see it." />
      <Slider label="Dark chroma" value={d.color.darkChroma} def={def.darkChroma} min={0.4} max={1} step={0.05}
        onChange={(x) => set(['color', 'darkChroma'], x)} hint="Dark palette only." />

      <ModeSwitch mode={mode} setMode={setMode} />
      <PaletteGrid d={d} theme={theme} mode={mode} />
      <HueWheel theme={theme} />
    </>
  );
}

const nearest = (lad: number[], l: number) => lad.reduce((b, x, i) => (Math.abs(x - l) < Math.abs(lad[b] - l) ? i : b), 0);

export function PaletteGrid({ d, theme, mode }: { d: Drivers; theme: Theme; mode: 'light' | 'dark' }) {
  const w = theme.primitives.wheel;
  const dark = mode === 'dark';
  const lad = ladder(dark ? d.color.darkContrast : d.color.contrast, dark);
  const prims = theme.primitives[mode];
  const roles = (i: number) => (Object.entries(w.roleSlot) as [string, number][]).filter(([, s]) => s === i).map(([r]) => r);
  const anchors: Record<string, number> = { 'hue-0': nearest(lad, w.primary.l) };
  if (w.secondary) anchors[`hue-${w.secondarySlot}`] = nearest(lad, w.secondary.l);
  if (w.neutral) anchors.neutral = nearest(lad, w.neutral.l);
  const row = (scale: string, label: React.ReactNode, badges: string[]) => (
    <tr key={scale}>
      <th scope="row">
        <span className="tt-grid__name">{scale}</span> {label}
        {badges.map((b) => <span key={b} className="tt-badge">{b}</span>)}
      </th>
      {STOP_LIST.map((st, k) => {
        const val = prims[`hds/prim/color/${scale}/${st}`];
        return (
          <td key={st} title={`${scale}/${st}: ${val}`} style={{ background: val }} className={anchors[scale] === k ? 'tt-anchor' : ''}>
            {anchors[scale] === k && <span className="tt-sr">anchor</span>}
          </td>
        );
      })}
    </tr>
  );
  return (
    <div className="tt-grid-wrap">
      <table className="tt-grid" aria-label={`${mode} palette`}>
        <thead>
          <tr>
            <th scope="col">slot</th>
            {STOP_LIST.map((st, k) => <th key={st} scope="col">{st}<br /><small>{lad[k].toFixed(2)}</small></th>)}
          </tr>
        </thead>
        <tbody>
          {w.hues.map((h, i) => row(`hue-${i}`, <small>{h.toFixed(0)}° · {w.rc[i].toFixed(2)}</small>, roles(i)))}
          {row('neutral', <small>{w.neutral ? 'neutral color' : `tint ${d.color.neutralTint}`}</small>, ['neutral'])}
        </tbody>
      </table>
      <div className="tt-grid__fixed">
        <span style={{ background: prims['hds/prim/color/white'] }} title="white" />white
        <span style={{ background: prims['hds/prim/color/black'] }} title="black" />black
      </div>
    </div>
  );
}

/** View-only hue wheel (interview I2): slots, anchors, and the two arcs between the anchors. */
export function HueWheel({ theme }: { theme: Theme }) {
  const w = theme.primitives.wheel;
  const [c, r] = [110, 84];
  const at = (deg: number, rad = r) => [c + rad * Math.sin((deg * Math.PI) / 180), c - rad * Math.cos((deg * Math.PI) / 180)];
  const sHue = w.hues[w.secondarySlot];
  const arc = ((sHue - w.hues[0]) % 360 + 360) % 360;
  const [x1, y1] = at(w.hues[0], r + 14);
  const [x2, y2] = at(sHue, r + 14);
  const R = r + 14;
  return (
    <figure className="tt-wheel">
      <svg viewBox="0 0 220 220" width="220" height="220" role="img" aria-label="Hue wheel">
        <circle cx={c} cy={c} r={r} fill="none" stroke="currentColor" strokeOpacity={0.15} />
        <path d={`M ${x1} ${y1} A ${R} ${R} 0 ${arc > 180 ? 1 : 0} 1 ${x2} ${y2}`} fill="none" stroke="currentColor" strokeWidth={2} />
        <path d={`M ${x2} ${y2} A ${R} ${R} 0 ${arc > 180 ? 0 : 1} 1 ${x1} ${y1}`} fill="none" stroke="currentColor" strokeWidth={2} strokeDasharray="3 4" />
        {w.hues.map((h, i) => {
          const [x, y] = at(h);
          const anchor = i === 0 || i === w.secondarySlot;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={anchor ? 11 : 8} fill={pickColor(theme, 'light', `hue-${i}/500`)!}
                stroke={anchor ? 'currentColor' : 'none'} strokeWidth={2}><title>{`hue-${i}: ${h.toFixed(0)}°`}</title></circle>
              <text x={at(h, r - 22)[0]} y={at(h, r - 22)[1]} fontSize="9" textAnchor="middle" dominantBaseline="middle">{i}</text>
            </g>
          );
        })}
        <text x={c} y={c - 6} fontSize="11" textAnchor="middle">{w.secondarySlot} + {11 - w.secondarySlot} gaps</text>
        <text x={c} y={c + 10} fontSize="10" textAnchor="middle" opacity={0.7}>arc {arc.toFixed(0)}°</text>
      </svg>
      <figcaption>Solid arc: primary to secondary, clockwise. The slots split each arc in proportion to its length.</figcaption>
    </figure>
  );
}

// ---------- Step 2: Role map ----------

export function RoleMap({ state, theme, set }: StepProps) {
  const w = theme.primitives.wheel;
  const autoSlot = (role: string) => {
    try {
      return getAuto(state, role);
    } catch {
      return null;
    }
  };
  const swatch = (i: number) => pickColor(theme, 'light', `hue-${i}/500`) ?? undefined;
  return (
    <>
      <table className="tt-roles">
        <tbody>
          <tr><th scope="row">primary</th><td><span className="tt-chip" style={{ background: swatch(0) }} /> hue-0 (locked)</td></tr>
          <tr><th scope="row">secondary</th><td><span className="tt-chip" style={{ background: swatch(w.secondarySlot) }} /> hue-{w.secondarySlot} (locked)</td></tr>
          <tr><th scope="row">neutral</th><td><span className="tt-chip" style={{ background: pickColor(theme, 'light', 'neutral/500') ?? undefined }} /> neutral scale (locked)</td></tr>
          {SYSTEM_ROLES.map((role) => {
            const explicit = state.roles?.[role];
            const used = new Set(SYSTEM_ROLES.filter((r) => r !== role).map((r) => w.roleSlot[r]));
            const auto = autoSlot(role);
            return (
              <tr key={role}>
                <th scope="row">{role}</th>
                <td>
                  <div className="tt-steps" role="group" aria-label={`${role} slot`}>
                    <button type="button" aria-pressed={explicit === undefined} onClick={() => set(['roles', role], undefined)}>
                      auto{auto !== null ? ` (hue-${auto})` : ''}
                    </button>
                    {SLOTS.map((slot, i) => (
                      <button key={slot} type="button" className="tt-slot" aria-pressed={explicit === slot}
                        disabled={used.has(i)} title={used.has(i) ? `${slot} is used by another system role` : slot}
                        onClick={() => set(['roles', role], slot)}>
                        <span className="tt-chip" style={{ background: swatch(i) }} />{i}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="tt-hint">No two system roles share a slot. A system role can share a slot with primary or secondary.</p>
    </>
  );
}

const getAuto = (state: DriverInput, role: string) =>
  wheel(withDefaults(setIn(state, ['roles', role], undefined))).roleSlot[role as (typeof SYSTEM_ROLES)[number]];

// ---------- Step 3: Color application ----------

const CATEGORIES = ['action', 'field', 'surface', 'content', 'graphic', 'feedback', 'focus', 'overlay'] as const;
/** Picks shown before "show all" (interview H2, tunable). */
const KEY_PICKS = new Set([
  'action/primary/default/bg', 'action/primary/default/fg', 'action/secondary/default/fg', 'action/secondary/default/border',
  'field/default/bg', 'field/default/border', 'field/focus/border', 'field/checked/bg',
  'surface/sunken/bg', 'surface/base/bg', 'surface/raised/bg',
  'content/strong/fg', 'content/default/fg', 'content/muted/fg', 'content/link/fg',
  'graphic/divider/default', 'focus/ring',
]);
const DATAVIZ = /^graphic\/(categorical|sequential|diverging)\//;
/** The default-state token a derived token belongs to. */
const baseOf = (key: string) => {
  if (key === 'content/link/hover/fg') return 'content/link/fg';
  const s = key.split('/');
  if (s[0] === 'action') return s[2] === 'disabled' ? `action/disabled/${s[3] === 'fg' ? 'fg' : 'bg'}` : `action/${s[1]}/default/${s[3]}`;
  if (s[0] === 'field') return s[1] === 'disabled' ? `field/disabled/${s[2] === 'placeholder' ? 'fg' : 'bg'}` : `field/default/${s[2]}`;
  return key;
};
/** Resolved value of a pick key in one mode and context. The Action disabled pair has no token of its own. */
const resolved = (theme: Theme, mode: 'light' | 'dark', ctx: Ctx, key: string) =>
  theme.colors[mode][ctx][key.startsWith('action/disabled/') ? key.replace('action/', 'action/primary/') : key];

/**
 * Fg picks the tool set on its own in this session. They keep following their bg until the
 * person picks the fg (interview J4). ponytail: session memory only; a reload treats them as set.
 */
const autoFg = new Set<string>();

export function ColorApplication(p: StepProps) {
  const { state, d, theme, set, mode, setMode, focus } = p;
  const [ctx, setCtx] = useState<Ctx>(focus?.ctx ?? 'default');
  const [open, setOpen] = useState<string | null>(focus?.token ?? null);
  const [note, setNote] = useState('');
  const [all, setAll] = useState<Record<string, boolean>>(focus ? { [focus.token.split('/')[0]]: true } : {});
  useEffect(() => {
    if (focus) document.getElementById(`pick-${focus.ctx}-${focus.token}`)?.scrollIntoView({ block: 'center' });
  }, [focus]);
  const defaults = defaultPicks(theme.primitives.wheel);
  const ctxDefaults = ctx === 'default' ? {} : contextPicks(ctx);
  const rowKeys = ctx === 'default'
    ? Object.keys(defaults)
    : [...new Set([...Object.keys(ctxDefaults), ...Object.keys(state.contexts?.[ctx] ?? {})])];
  const derived = COLOR_TOKENS.filter((k) => !(k in defaults) && k !== 'overlay/scrim');
  const pathOf = (key: string): Path => (ctx === 'default' ? ['picks', key] : ['contexts', ctx, key]);
  const fails = theme.contrast.filter((f) => f.context === ctx);
  const failsOf = (key: string) => fails.filter((f) => f.fg.endsWith(`/color/${key}`) || f.bg.endsWith(`/color/${key}`));

  // An action bg leads its fg. When a new bg makes an unset (or auto-set) fg fail 4.5:1, the
  // tool picks the neutral fg with the most contrast, in the same undo step (interview J4).
  const setPick = (key: string, path: Path, explicit: Pick | undefined, part: 'light' | 'dark', val: string | undefined) => {
    autoFg.delete(path.join('/'));
    const next = setIn(state, path, withPickPart(explicit, part, val));
    const fgKey = key.replace(/bg$/, 'fg');
    const fgPath = pathOf(fgKey);
    if (/^action\/[a-z]+\/default\/bg$/.test(key) && val !== 'transparent' && (getIn(state, fgPath) === undefined || autoFg.has(fgPath.join('/')))) {
      try {
        const t = buildTheme(next);
        if (t.contrast.some((f) => f.context === ctx && f.fg.endsWith(`/color/${fgKey}`) && f.bg.endsWith(`/color/${key}`))) {
          const fg = bestFg(t, ctx, key);
          const parent = fgPath.slice(0, -1);
          autoFg.add(fgPath.join('/'));
          set(parent, getIn(setIn(next, fgPath, fg), parent));
          setNote(`${fgKey} changed to ${fg} to keep 4.5:1 on the new background.`);
          return;
        }
      } catch { /* a bad value: set it as is and let the theme error show */ }
    }
    setNote('');
    set(path, withPickPart(explicit, part, val));
  };

  const row = (key: string) => {
    const path = pathOf(key);
    const explicit = getIn(state, path) as Pick | undefined;
    const libDefault = ctx === 'default' ? defaults[key] : ctxDefaults[key] ?? 'root pick';
    const kids = derived.filter((k) => baseOf(k) === key);
    const f = failsOf(key);
    return (
      <PickRow key={key} id={`pick-${ctx}-${key}`} label={key} value={resolved(theme, mode, ctx, key)} explicit={explicit}
        libDefault={libDefault} theme={theme} mode={mode} ctx={ctx} failures={f} open={open} setOpen={setOpen}
        set={(part, val) => setPick(key, path, explicit, part, val)} reset={() => { autoFg.delete(path.join('/')); set(path, undefined); }}
        chips={kids.length > 0 && (
          <span className="tt-derived" aria-label="Derived states">
            {kids.map((k) => {
              const kExplicit = getIn(state, pathOf(k)) as Pick | undefined;
              const bad = failsOf(k).length > 0;
              return (
                <button key={k} type="button" className={`tt-derived__chip${bad ? ' tt-bad' : ''}${kExplicit ? ' tt-set' : ''}`}
                  title={`${k}: ${resolved(theme, mode, ctx, k)}${kExplicit ? ' (override)' : ' (derived)'}${bad ? ' — fails contrast' : ''}`}
                  onClick={() => setOpen(open === k ? null : k)} aria-expanded={open === k}>
                  <span className="tt-chip" style={{ background: pickColor(theme, mode, resolved(theme, mode, ctx, k)) ?? undefined }} />
                  {k.split('/').slice(-2, -1)[0]}
                </button>
              );
            })}
          </span>
        )}
        below={kids.filter((k) => open === k).map((k) => {
          const kp = pathOf(k);
          const kExplicit = getIn(state, kp) as Pick | undefined;
          return (
            <PickRow key={k} id={`pick-${ctx}-${k}`} label={`${k} (derived state override)`} value={resolved(theme, mode, ctx, k)}
              explicit={kExplicit} libDefault="derived" theme={theme} mode={mode} ctx={ctx} failures={failsOf(k)}
              open={k} setOpen={() => setOpen(key)} token={k}
              set={(part, val) => setPick(k, kp, kExplicit, part, val)} reset={() => set(kp, undefined)} />
          );
        })}
      />
    );
  };

  return (
    <>
      <div className="tt-steps" role="group" aria-label="Context">
        {(['default', 'on-primary', 'on-secondary'] as const).map((c) => (
          <button key={c} type="button" aria-pressed={ctx === c} onClick={() => { setCtx(c); setOpen(null); }}>
            {c === 'default' ? 'root' : c}
          </button>
        ))}
      </div>
      <ModeSwitch mode={mode} setMode={setMode} />
      {ctx !== 'default' && <p className="tt-hint">A brand context changes only these tokens (token spec 6.3). Every other token keeps its root pick.</p>}

      {CATEGORIES.map((cat) => {
        const keys = rowKeys.filter((k) => k.startsWith(`${cat}/`) && !(cat === 'feedback' && ctx === 'default'));
        const shown = ctx !== 'default' || all[cat] ? keys : keys.filter((k) => KEY_PICKS.has(k));
        const hidden = keys.length - shown.length;
        const count = theme.contrast.filter((f) => f.context === ctx && (f.fg.includes(`/color/${cat}/`) || f.bg.includes(`/color/${cat}/`))).length;
        if (!keys.length && !(cat === 'feedback' && ctx === 'default') && !(cat === 'overlay' && ctx === 'default')) return null;
        return (
          <section key={cat} className="tt-cat">
            <h3>{cat}{count > 0 && <span className="tt-badge tt-bad">{count} failing</span>}</h3>
            {cat === 'action' && note && <p className="tt-hint" role="status">{note}</p>}
            {cat === 'feedback' && ctx === 'default' && <FeedbackStops {...p} />}
            {cat === 'overlay' && ctx === 'default' && (
              <>
                <Slider label="Scrim opacity" value={d.overlay.opacity} def={defaultDrivers.overlay.opacity} min={0} max={1} step={0.05}
                  onChange={(x) => set(['overlay', 'opacity'], x)} />
                <Live mode={mode}><div className="tt-scrim"><div style={{ background: v('hds/sem/color/overlay/scrim') }} /></div></Live>
              </>
            )}
            {shown.filter((k) => !DATAVIZ.test(k)).map(row)}
            {cat === 'graphic' && (all.graphic || ctx !== 'default') && keys.some((k) => DATAVIZ.test(k)) && (
              <>
                <h4>Data visualization</h4>
                <DataViz mode={mode} />
                {keys.filter((k) => DATAVIZ.test(k)).map(row)}
              </>
            )}
            {hidden > 0 && (
              <button type="button" className="tt-link" onClick={() => setAll({ ...all, [cat]: !all[cat] })}>
                {all[cat] ? 'Show key picks only' : `Show all (${hidden} more)`}
              </button>
            )}
          </section>
        );
      })}

      {ctx === 'default' && (
        <section className="tt-cat">
          <h3>States, mode, sections</h3>
          <Slider label="Hover offset (stops)" value={d.states.step.hover} def={defaultDrivers.states.step.hover} min={1} max={4} step={1}
            onChange={(x) => set(['states', 'step', 'hover'], x)} />
          <Slider label="Active offset (stops)" value={d.states.step.active} def={defaultDrivers.states.step.active} min={1} max={5} step={1}
            onChange={(x) => set(['states', 'step', 'active'], x)} />
          <Steps label="Page mode" options={['light', 'dark', 'system'] as const} value={d.mode} def={defaultDrivers.mode}
            onChange={(x) => set(['mode'], x)} />
          <Sections {...p} />
        </section>
      )}
    </>
  );
}

function PickRow({ id, label, value, explicit, libDefault, theme, mode, ctx, failures, open, setOpen, set, reset, chips, below, token }: {
  id: string; label: string; value: string; explicit: Pick | undefined; libDefault: string; theme: Theme;
  mode: 'light' | 'dark'; ctx: Ctx; failures: Theme['contrast']; open: string | null; setOpen: (k: string | null) => void;
  set: (part: 'light' | 'dark', v: string | undefined) => void; reset: () => void; chips?: React.ReactNode; below?: React.ReactNode; token?: string;
}) {
  const key = token ?? label;
  const isOpen = open === key;
  const dark = typeof explicit === 'object' ? explicit.dark : undefined;
  const darkFails = failures.some((f) => f.mode === 'dark');
  const [showDark, setShowDark] = useState(false);
  const transparent = /\/(bg|border)$/.test(key) && !key.startsWith('content/');
  const slots = DATAVIZ.test(key);
  const grid = (part: 'light' | 'dark') => (
    <SwatchGrid
      theme={theme} mode={part} label={`${key} ${part} pick`} transparent={transparent} slots={slots}
      value={part === 'dark' ? dark ?? theme.colors.dark[ctx][key] ?? value : theme.colors.light[ctx][key] ?? value}
      // Editing the light pick checks dark mode too, unless a dark override exists (spec 5.4).
      fails={(cand) => pairFailure(theme, key, cand, part === 'dark' || dark ? [part] : ['light', 'dark'], ctx)}
      onPick={(x) => set(part, x)}
    />
  );
  return (
    <div className={`tt-pick${failures.length ? ' tt-pick--bad' : ''}`} id={id}>
      <div className="tt-pick__head">
        <button type="button" className="tt-pick__toggle" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : key)}>
          <span className="tt-chip" style={{ background: pickColor(theme, mode, value) ?? undefined }} data-transparent={value === 'transparent' || undefined} />
          <span className="tt-pick__label">{label.replace(/^[a-z]+\//, '')}</span>
          <span className="tt-value">{value}</span>
        </button>
        <span className="tt-default">default {libDefault}</span>
        {dark && <span className="tt-badge">dark override</span>}
        <Reset show={explicit !== undefined} onClick={reset} label={key} />
        {chips}
      </div>
      {failures.length > 0 && (
        <p className="tt-error">
          {failures.slice(0, 3).map((f) => `${f.mode}: ${short(f.fg)} on ${short(f.bg)} ${f.ratio}:1 (needs ${f.min}:1)`).join(' · ')}
          {failures.length > 3 && ` · +${failures.length - 3} more`}. Fix: pick a passing value or set an override.
        </p>
      )}
      {isOpen && (
        <div className="tt-pick__editor">
          {grid('light')}
          {(showDark || dark || darkFails) ? (
            <>
              <h5>Dark override {dark && <button type="button" className="tt-link" onClick={() => set('dark', undefined)}>remove</button>}</h5>
              {grid('dark')}
            </>
          ) : (
            <button type="button" className="tt-link" onClick={() => setShowDark(true)}>Add a dark override</button>
          )}
        </div>
      )}
      {below}
    </div>
  );
}
const short = (t: string) => t.replace('hds/sem/color/', '');

function FeedbackStops({ state, theme, set, mode }: StepProps) {
  const sentiments = SYSTEM_ROLES;
  const props = ['bg', 'border', 'fg', 'icon'] as const;
  const defaults = defaultPicks(theme.primitives.wheel);
  return (
    <>
      <p className="tt-hint">Each sentiment keeps its role hue (step 2). These stops apply to all four sentiments.</p>
      {props.map((prop) => {
        const current = theme.colors.light.default[`feedback/danger/${prop}`].split('/')[1];
        const def = defaults[`feedback/danger/${prop}`].split('/')[1];
        const apply = (stop: string | undefined) => {
          const picks = { ...(state.picks ?? {}) } as Record<string, Pick>;
          for (const s of sentiments) {
            if (stop === undefined || stop === def) delete picks[`feedback/${s}/${prop}`];
            else picks[`feedback/${s}/${prop}`] = `${s}/${stop}`;
          }
          set(['picks'], Object.keys(picks).length ? picks : undefined);
        };
        return (
          <div key={prop} className="tt-control" role="group" aria-label={`Feedback ${prop} stop`}>
            <div className="tt-control__head">
              <span>{prop}</span><span className="tt-default">default {def}</span>
              <Reset show={current !== def} onClick={() => apply(undefined)} label={`feedback ${prop}`} />
            </div>
            <div className="tt-steps tt-steps--swatch">
              {STOP_LIST.map((st) => {
                const worst = sentiments.map((s) => pairFailure(theme, `feedback/${s}/${prop}`, `${s}/${st}`, ['light', 'dark'], 'default'))
                  .reduce<number | null>((a, b) => (b === null ? a : a === null ? b : Math.min(a, b)), null);
                return (
                  <button key={st} type="button" aria-pressed={current === st} disabled={worst !== null && current !== st}
                    title={worst !== null ? `${st}: fails contrast (${worst}:1)` : st} onClick={() => apply(st)}>
                    {sentiments.map((s) => <span key={s} className="tt-chip tt-chip--sm" style={{ background: pickColor(theme, mode, `${s}/${st}`) ?? undefined }} />)}
                    <small>{st}</small>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}

function DataViz({ mode }: { mode: 'light' | 'dark' }) {
  const strip = (kind: string, n: number) => (
    <div className="tt-strip" aria-label={`${kind} palette`}>
      {Array.from({ length: n }, (_, i) => <span key={i} style={{ background: v(`hds/sem/color/graphic/${kind}/${i + 1}`) }} title={`${kind}/${i + 1}`} />)}
    </div>
  );
  const bars = [62, 45, 80, 33, 58, 71, 40, 52];
  return (
    <Live mode={mode} className="tt-dataviz">
      {strip('categorical', 8)}
      {strip('sequential', 9)}
      {strip('diverging', 9)}
      <svg viewBox="0 0 160 60" className="tt-chart" role="img" aria-label="Sample bar chart">
        {bars.map((b, i) => <rect key={i} x={4 + i * 19.5} y={58 - b * 0.7} width={15} height={b * 0.7} fill={v(`hds/sem/color/graphic/categorical/${i + 1}`)} />)}
      </svg>
    </Live>
  );
}

function Sections({ d, set }: StepProps) {
  const [name, setName] = useState('');
  const valid = /^[a-z0-9-]+$/.test(name) && !(name in d.sections);
  const targets = ['light', 'dark', 'on-primary', 'on-secondary'] as const;
  return (
    <div className="tt-control">
      <div className="tt-control__head"><span>Sections</span></div>
      <p className="tt-hint">Page code writes <code>data-section="name"</code>. The section renders in the mapped mode or brand context.</p>
      {Object.entries(d.sections).map(([n, t]) => (
        <div key={n} className="tt-section">
          <code>{n}</code>
          <select value={t} aria-label={`Section ${n} target`} onChange={(e) => set(['sections', n], e.target.value)}>
            {targets.map((x) => <option key={x}>{x}</option>)}
          </select>
          {n in defaultDrivers.sections
            ? <Reset show={t !== defaultDrivers.sections[n]} onClick={() => set(['sections', n], undefined)} label={`section ${n}`} />
            : <button type="button" className="tt-link" onClick={() => set(['sections', n], undefined)}>remove</button>}
        </div>
      ))}
      <form className="tt-section" onSubmit={(e) => { e.preventDefault(); if (valid) { set(['sections', name], 'dark'); setName(''); } }}>
        <input className="tt-input" placeholder="footer" value={name} onChange={(e) => setName(e.target.value.trim())} aria-label="New section name" />
        <button type="submit" disabled={!valid}>Add section</button>
      </form>
    </div>
  );
}

// ---------- Step 4: Typography ----------

const RATIOS: [number, string][] = [[1.067, 'minor second'], [1.125, 'major second'], [1.2, 'minor third'], [1.25, 'major third'],
  [1.333, 'perfect fourth'], [1.414, 'augmented fourth'], [1.5, 'perfect fifth'], [1.618, 'golden']];
const PROP_OPTIONS: Record<string, readonly (string | number)[]> = {
  family: ['heading', 'body', 'mono'],
  size: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  weight: ['regular', 'medium', 'semibold', 'bold'],
  leading: ['tight', 'snug', 'normal', 'relaxed'],
  tracking: ['tight', 'normal', 'wide'],
};

export function Typography({ state, d, theme, set, mode }: StepProps) {
  const [allSizes, setAllSizes] = useState(false);
  const def = defaultDrivers.typography;
  const fam = (k: 'heading' | 'body' | 'mono') => (
    <TextField key={k} label={`${k} font stack`} value={d.typography.family[k]} def={def.family[k]}
      onChange={(x) => set(['typography', 'family', k], x)} />
  );
  // Resolved step of one text style property, read back from the semantic token template.
  const step = (role: string, size: string, prop: string) => {
    const seg = theme.other[`hds/sem/typography/${role}/${size}/${prop}`].replace(/[{}]/g, '').split('/').pop()!;
    return prop === 'size' ? Number(seg) : seg;
  };
  const sizes = allSizes ? TEXT_SIZE : (['md'] as const);
  return (
    <>
      <p className="tt-hint">Type a Google Fonts family first in a stack, for example <code>"Inter", system-ui, sans-serif</code>. The preview loads it. The client app loads its own fonts.</p>
      {fam('heading')}{fam('body')}{fam('mono')}
      <Slider label="Base size (px)" value={d.typography.baseSize} def={def.baseSize} min={12} max={22} step={1}
        onChange={(x) => set(['typography', 'baseSize'], x)} />
      <Steps label="Scale ratio" options={RATIOS.map(([r]) => r)} value={d.typography.ratio} def={def.ratio}
        onChange={(x) => set(['typography', 'ratio'], x)} render={(r) => <>{r}<small> {RATIOS.find(([x]) => x === r)![1]}</small></>} />
      <Live mode={mode} className="tt-scale">
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i}><small>{i + 1}</small><span style={{ fontSize: v(`hds/prim/typography/scale/${i + 1}`), fontFamily: v('hds/prim/typography/family/body') }}>Aa</span></div>
        ))}
      </Live>

      <h3>Text styles</h3>
      <label className="tt-check"><input type="checkbox" checked={allSizes} onChange={(e) => setAllSizes(e.target.checked)} /> Show sm and lg sizes</label>
      <div className="tt-styles">
        {TEXT_ROLE.map((role) => sizes.map((size) => {
          const t = `hds/sem/typography/${role}/${size}`;
          return (
            <div key={`${role}-${size}`} className="tt-style">
              <Live mode={mode}>
                <span style={{ fontFamily: v(`${t}/family`), fontSize: v(`${t}/size`), fontWeight: v(`${t}/weight`) as never, lineHeight: v(`${t}/leading`), letterSpacing: v(`${t}/tracking`) }}>
                  {role} {size}: The quick brown fox
                </span>
              </Live>
              <div className="tt-style__picks">
                {TEXT_PROP.map((prop) => {
                  const path = ['typography', 'styles', role, size, prop];
                  const explicit = getIn(state, path);
                  return (
                    <label key={prop}>
                      {prop}
                      <select value={String(step(role, size, prop))} onChange={(e) => set(path, prop === 'size' ? Number(e.target.value) : e.target.value)}>
                        {PROP_OPTIONS[prop].map((o) => <option key={o} value={String(o)}>{o}</option>)}
                      </select>
                      <Reset show={explicit !== undefined} onClick={() => set(path, undefined)} label={`${role} ${size} ${prop}`} />
                    </label>
                  );
                })}
              </div>
            </div>
          );
        }))}
      </div>
    </>
  );
}

function TextField({ label, value, def, onChange }: { label: string; value: string; def: string; onChange: (v: string | undefined) => void }) {
  const [text, setText] = useState(value);
  return (
    <div className="tt-control">
      <div className="tt-control__head">
        <label>{label}</label>
        <Reset show={value !== def} onClick={() => { setText(def); onChange(undefined); }} label={label} />
      </div>
      <input className="tt-input" value={text} spellCheck={false} aria-label={label}
        onChange={(e) => setText(e.target.value)} onBlur={() => onChange(text.trim() || undefined)}
        onKeyDown={(e) => e.key === 'Enter' && onChange(text.trim() || undefined)} />
    </div>
  );
}

// ---------- Steps 5-8: Measure, Radius, Border, Elevation ----------

export function Measure({ d, set, mode }: StepProps) {
  return (
    <>
      <Slider label="Density" value={d.density} def={defaultDrivers.density} min={0.75} max={1.35} step={0.05}
        onChange={(x) => set(['density'], x)} hint="Scales the 4px grid. About 0.85 is compact, 1.15 is roomy." />
      <Live mode={mode} className="tt-measure">
        {SPACE.map((s) => (
          <div key={s}><small>space/{s}</small><span style={{ width: v(`hds/sem/measure/space/${s}`) }} /></div>
        ))}
        <div className="tt-row">
          <Button size="sm">Small</Button><Button>Medium</Button><Button size="lg">Large</Button>
          <Input placeholder="Field" />
        </div>
      </Live>
    </>
  );
}

const RADIUS_STEPS: RadiusStep[] = ['none', '050', '100', '200', '300', '400', '600', 'round'];
const BORDER_STEPS: BorderStep[] = ['none', '025', '050', '100'];

export function Radius({ d, set, mode }: StepProps) {
  return (
    <>
      {SHAPE_ROLE.map((r) => (
        <Steps key={r} label={r} options={RADIUS_STEPS} value={d.radius[r]} def={defaultDrivers.radius[r]}
          onChange={(x) => set(['radius', r], x)}
          render={(o) => <><span className="tt-shape" style={{ borderRadius: v(`hds/prim/radius/${o}`) }} />{o}</>} />
      ))}
      <Live mode={mode} className="tt-row">
        {SHAPE_ROLE.map((r) => <div key={r} className="tt-sample" style={{ borderRadius: v(`hds/sem/radius/${r}`) }}>{r}</div>)}
      </Live>
    </>
  );
}

export function Border({ d, set, mode }: StepProps) {
  return (
    <>
      {BORDER_ROLE.map((r) => (
        <Steps key={r} label={r} options={BORDER_STEPS} value={d.border[r]} def={defaultDrivers.border[r]} onChange={(x) => set(['border', r], x)} />
      ))}
      <Live mode={mode} className="tt-row">
        {BORDER_ROLE.map((r) => (
          <div key={r} className="tt-sample" style={{ borderWidth: v(`hds/sem/border/${r}`), borderStyle: 'solid' }}>{r}</div>
        ))}
      </Live>
    </>
  );
}

export function Elevation({ d, set, mode }: StepProps) {
  return (
    <>
      <Slider label="Shadow strength" value={d.shadow.strength} def={defaultDrivers.shadow.strength} min={0} max={2} step={0.25}
        onChange={(x) => set(['shadow', 'strength'], x)} hint="0 is flat: no shadows." />
      <Live mode={mode} className="tt-row tt-elevation">
        {ELEVATION.map((lv) => (
          <div key={lv} className="tt-sample" style={{ boxShadow: v(`hds/sem/elevation/${lv}`), background: v(`hds/sem/color/surface/${lv}/bg`) }}>{lv}</div>
        ))}
      </Live>
    </>
  );
}

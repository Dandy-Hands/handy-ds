// Tool controls, one per driver type (theme-customization-spec.md section 6): color field,
// slider, step selector, swatch selector. Every control shows its default and can reset.
import { useEffect, useId, useState } from 'react';
import { converter, displayable, parse } from 'culori';
import { pickColor, type Theme } from './model.ts';

const toOklch = converter('oklch');
const fmtOklch = (l: number, c: number, h: number) => `oklch(${(l * 100).toFixed(1)}% ${c.toFixed(3)} ${h.toFixed(1)})`;

export function Reset({ show, onClick, label }: { show: boolean; onClick: () => void; label: string }) {
  if (!show) return null;
  return (
    <button type="button" className="tt-reset" onClick={onClick} aria-label={`Reset ${label}`} title="Reset to default">
      ↺
    </button>
  );
}

export function Slider({ label, value, def, min, max, step, onChange, hint }: {
  label: string; value: number; def: number; min: number; max: number; step: number;
  onChange: (v: number | undefined) => void; hint?: string;
}) {
  const id = useId();
  return (
    <div className="tt-control">
      <div className="tt-control__head">
        <label htmlFor={id}>{label}</label>
        <span className="tt-value">{value}</span>
        <span className="tt-default">default {def}</span>
        <Reset show={value !== def} onClick={() => onChange(undefined)} label={label} />
      </div>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
      {hint && <p className="tt-hint">{hint}</p>}
    </div>
  );
}

export function Steps<T extends string | number>({ label, options, value, def, onChange, render }: {
  label: string; options: readonly T[]; value: T; def: T; onChange: (v: T | undefined) => void;
  render?: (v: T) => React.ReactNode;
}) {
  return (
    <div className="tt-control" role="group" aria-label={label}>
      <div className="tt-control__head">
        <span>{label}</span>
        <span className="tt-default">default {String(def)}</span>
        <Reset show={value !== def} onClick={() => onChange(undefined)} label={label} />
      </div>
      <div className="tt-steps">
        {options.map((o) => (
          <button key={String(o)} type="button" aria-pressed={o === value} onClick={() => onChange(o)}>
            {render ? render(o) : String(o)}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Color driver input (spec 3, step 1): a text field for any CSS color plus an OKLCH picker.
 * An unparsable value shows an error and is not committed. A color outside sRGB shows a
 * gamut warning; the palette maps it into sRGB.
 */
export function ColorField({ label, value, onChange, def }: {
  label: string; value: string; onChange: (v: string) => void; def?: string;
}) {
  const id = useId();
  const [text, setText] = useState(value);
  useEffect(() => setText(value), [value]);
  const parsed = parse(text);
  const ok = parsed ? toOklch(parsed) : undefined;
  const [l, c, h] = [ok?.l ?? 0.5, ok?.c ?? 0, ok?.h ?? 0];
  const slide = (nl: number, nc: number, nh: number) => {
    const v = fmtOklch(nl, nc, nh);
    setText(v);
    onChange(v);
  };
  const grad = (f: (t: number) => string) => `linear-gradient(to right, ${[0, 0.17, 0.33, 0.5, 0.67, 0.83, 1].map(f).join(', ')})`;
  return (
    <div className="tt-control tt-color">
      <div className="tt-control__head">
        <label htmlFor={id}>{label}</label>
        {def !== undefined && <span className="tt-default">default {def}</span>}
        <Reset show={def !== undefined && value !== def} onClick={() => onChange(def!)} label={label} />
      </div>
      <div className="tt-color__row">
        <span className="tt-chip" style={{ background: parsed ? text : 'transparent' }} />
        <input
          id={id} className="tt-input" value={text} spellCheck={false} aria-invalid={!parsed}
          onChange={(e) => {
            setText(e.target.value);
            if (parse(e.target.value)) onChange(e.target.value);
          }}
        />
      </div>
      {!parsed && <p className="tt-error" role="alert">Not a CSS color. The palette keeps the last valid value.</p>}
      {parsed && !displayable(parsed) && <p className="tt-warn">Outside sRGB. The palette maps this color into sRGB.</p>}
      {parsed && (
        <div className="tt-oklch">
          <label>L<input type="range" min={0} max={1} step={0.005} value={l} onChange={(e) => slide(Number(e.target.value), c, h)}
            style={{ background: grad((t) => fmtOklch(t, c, h)) }} /></label>
          <label>C<input type="range" min={0} max={0.37} step={0.002} value={c} onChange={(e) => slide(l, Number(e.target.value), h)}
            style={{ background: grad((t) => fmtOklch(l, t * 0.37, h)) }} /></label>
          <label>H<input type="range" min={0} max={360} step={0.5} value={h} onChange={(e) => slide(l, c, Number(e.target.value))}
            style={{ background: grad((t) => fmtOklch(l, Math.max(c, 0.08), t * 360)) }} /></label>
        </div>
      )}
    </div>
  );
}

export const STOP_LIST = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
export const SCALES = ['primary', 'secondary', 'neutral', 'danger', 'warning', 'success', 'info'];
export const SLOTS = Array.from({ length: 11 }, (_, i) => `hue-${i}`);

/**
 * Swatch selector (spec 3, step 3). `fails` returns the failing contrast ratio of a candidate
 * against its paired colors, or null; a failing swatch is disabled.
 */
export function SwatchGrid({ theme, mode, value, onPick, fails, transparent, slots, label }: {
  theme: Theme; mode: 'light' | 'dark'; value: string; onPick: (v: string) => void;
  fails: (candidate: string) => number | null; transparent: boolean; slots: boolean; label: string;
}) {
  const swatch = (pick: string, text?: string) => {
    const ratio = pick === value ? null : fails(pick);
    const bg = pickColor(theme, mode, pick);
    return (
      <button
        key={pick} type="button" className="tt-swatch" aria-pressed={pick === value} disabled={ratio !== null}
        title={ratio !== null ? `${pick}: fails contrast (${ratio}:1)` : pick} aria-label={pick}
        style={{ background: bg ?? undefined }} onClick={() => onPick(pick)}
      >
        {text}
      </button>
    );
  };
  return (
    <div className="tt-swatches" role="group" aria-label={label}>
      {[...SCALES, ...(slots ? SLOTS : [])].map((scale) => (
        <div key={scale} className="tt-swatches__row">
          <span className="tt-swatches__name">{scale}</span>
          {STOP_LIST.map((st) => swatch(`${scale}/${st}`))}
        </div>
      ))}
      <div className="tt-swatches__row">
        <span className="tt-swatches__name">fixed</span>
        {swatch('white')}
        {swatch('black')}
        {transparent && swatch('transparent', '∅')}
      </div>
    </div>
  );
}

// Theme customization tool (.claude/specs/theme-customization-spec.md). One person, local:
// state lives in a localStorage draft and in the exported theme.config.js (interview F3, G1-G3).
import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { buildTheme } from '../../../src/tokens/theme.ts';
import type { DriverInput } from '../../../src/tokens/drivers.ts';
import pkg from '../../../package.json';
import { configText, leaves, reduce, getIn, type History, type Path, type Theme } from './model.ts';
import { BrandColors, Border, ColorApplication, Elevation, Measure, Radius, RoleMap, Typography, type StepProps } from './steps.tsx';
import { Preview, PreviewTabs, usePreviewTab } from './Preview.tsx';
import './theme-tool.css';

const STEPS = [
  { id: 'brand', title: 'Brand colors', C: BrandColors, intro: 'Set the brand colors. They drive every palette ramp.' },
  { id: 'roles', title: 'Role map', C: RoleMap, intro: 'Pick the palette slot for each system role.' },
  { id: 'color', title: 'Color application', C: ColorApplication, intro: 'Pick the palette color for each use. States derive from the default pick.' },
  { id: 'type', title: 'Typography', C: Typography, intro: 'Set the font stacks, the type scale, and the text styles.' },
  { id: 'measure', title: 'Measure', C: Measure, intro: 'Scale the spacing grid.' },
  { id: 'radius', title: 'Radius', C: Radius, intro: 'Pick the corner radius for each shape role.' },
  { id: 'border', title: 'Border', C: Border, intro: 'Pick the border width for each role.' },
  { id: 'elevation', title: 'Elevation', C: Elevation, intro: 'Set the shadow strength.' },
] as const;
type View = (typeof STEPS)[number]['id'] | 'changes' | 'contrast' | 'load' | 'export';

/** The step that owns a driver path, for links from the changes panel. */
const STEP_OF: Record<string, View> = {
  color: 'brand', roles: 'roles', picks: 'color', contexts: 'color', states: 'color', overlay: 'color', mode: 'color',
  sections: 'color', typography: 'type', density: 'measure', radius: 'radius', border: 'border', shadow: 'elevation',
};

const DRAFT_KEY = 'hds-theme-tool-draft';
const VERSION: string = pkg.version;

function readDraft(): { state: DriverInput; client: string } {
  try {
    const raw = JSON.parse(localStorage.getItem(DRAFT_KEY) ?? 'null');
    if (raw && typeof raw === 'object') return { state: raw.state ?? {}, client: raw.client ?? '' };
  } catch { /* no draft */ }
  return { state: {}, client: '' };
}

// Google Fonts loader (interview I3): tries the first family of each stack once.
const SYSTEM_FONT = /^(ui-|-apple|system-ui|serif|sans-serif|monospace|cursive|fantasy|georgia|arial|helvetica|times|menlo|consolas|monaco|courier|sf |segoe|verdana|tahoma)/i;
const loaded = new Set<string>();
function loadFont(stack: string) {
  const first = stack.split(',')[0].trim().replace(/^["']|["']$/g, '');
  if (!first || SYSTEM_FONT.test(first) || loaded.has(first)) return;
  loaded.add(first);
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(first).replace(/%20/g, '+')}:wght@400;500;600;700&display=swap`;
  // A family without these weights returns 400; fall back to its default weight.
  link.onerror = () => { link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(first).replace(/%20/g, '+')}&display=swap`; link.onerror = null; };
  document.head.appendChild(link);
}

const CHROME_CSS = buildTheme().css.replaceAll(':root', '.hds-chrome');

export function ThemeTool() {
  const draft = useMemo(readDraft, []);
  const [h, dispatch] = useReducer(reduce, { past: [], present: draft.state, future: [] } satisfies History);
  const [client, setClient] = useState(draft.client);
  const [view, setView] = useState<View>('brand');
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [tab, setTab] = usePreviewTab();
  const [focus, setFocus] = useState<StepProps['focus']>();
  const [notice, setNotice] = useState('');

  // A bad driver value keeps the last valid theme on screen and shows the error.
  const result = useMemo(() => {
    try {
      return { theme: buildTheme(h.present) };
    } catch (e) {
      return { error: (e as Error).message };
    }
  }, [h.present]);
  const good = useRef<Theme>(null);
  if (result.theme) good.current = result.theme;
  const theme = (good.current ?? buildTheme())!;
  const failures = theme.contrast;

  useEffect(() => {
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ state: h.present, client })); } catch { /* storage blocked */ }
  }, [h.present, client]);

  // The preview mode sits on <html>, so popups portaled to <body> follow it. The chrome
  // re-declares the default light tokens on itself, so it does not change.
  useEffect(() => {
    document.documentElement.dataset.mode = mode;
    return () => { delete document.documentElement.dataset.mode; };
  }, [mode]);

  useEffect(() => Object.values(theme.drivers.typography.family).forEach(loadFont), [theme.drivers.typography.family]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || (e.target as HTMLElement).closest('input, textarea, select')) return;
      const k = e.key.toLowerCase();
      if (k === 'z' || k === 'y') {
        e.preventDefault();
        dispatch({ type: k === 'y' || e.shiftKey ? 'redo' : 'undo' });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const set = (path: Path, value: unknown) => dispatch({ type: 'set', path, value, at: Date.now() });
  const changes = leaves(h.present);
  const step = STEPS.find((s) => s.id === view);
  const props: StepProps = { state: h.present, d: theme.drivers, theme, set, mode, setMode, focus };
  const go = (v: View) => { setFocus(undefined); setView(v); };

  return (
    <div className="tt-app">
      <style>{CHROME_CSS}</style>
      <style>{theme.css}</style>
      <style>{theme.css.replaceAll(':root', '.hds-live')}</style>

      <header className="hds-chrome tt-header">
        <Link to="/" className="tt-home">handy-ds</Link>
        <h1>Theme builder{client && <span> · {client}</span>}</h1>
        <div className="tt-header__actions">
          <button type="button" onClick={() => dispatch({ type: 'undo' })} disabled={!h.past.length} title="Undo (⌘Z)">Undo</button>
          <button type="button" onClick={() => dispatch({ type: 'redo' })} disabled={!h.future.length} title="Redo (⇧⌘Z)">Redo</button>
          <button type="button" onClick={() => go('load')}>Open</button>
          <button type="button" className="tt-primary" onClick={() => go('export')}>Export</button>
        </div>
      </header>

      <nav className="hds-chrome tt-nav" aria-label="Steps">
        <ol>
          {STEPS.map((s, i) => (
            <li key={s.id}>
              <button type="button" aria-current={view === s.id ? 'step' : undefined} onClick={() => go(s.id)}>
                <span className="tt-nav__n">{i + 1}</span>{s.title}
                {s.id === 'color' && failures.length > 0 && <span className="tt-badge tt-bad" title="Contrast failures">{failures.length}</span>}
              </button>
            </li>
          ))}
        </ol>
        <ul>
          <li><button type="button" aria-current={view === 'changes' ? 'page' : undefined} onClick={() => go('changes')}>Changes <span className="tt-badge">{changes.length}</span></button></li>
          <li><button type="button" aria-current={view === 'contrast' ? 'page' : undefined} onClick={() => go('contrast')}>
            Contrast report <span className={`tt-badge${failures.length ? ' tt-bad' : ''}`}>{failures.length}</span></button></li>
        </ul>
      </nav>

      <section className="hds-chrome tt-panel" aria-label="Controls">
        {notice && <p className="tt-warn" role="status">{notice} <button type="button" className="tt-link" onClick={() => setNotice('')}>Dismiss</button></p>}
        {result.error && <p className="tt-error" role="alert">Theme error: {result.error}. The preview shows the last valid theme.</p>}
        {step && (
          <>
            <h2>{step.title}</h2>
            <p className="tt-hint">{step.intro}</p>
            <step.C key={view + JSON.stringify(focus ?? '')} {...props} />
          </>
        )}
        {view === 'changes' && (
          <Changes state={h.present} changes={changes} set={set} go={go} reset={() => dispatch({ type: 'replace', state: {} })} />
        )}
        {view === 'contrast' && (
          <ContrastReport failures={failures} open={(ctx, token) => { setFocus({ ctx, token }); setView('color'); }} />
        )}
        {view === 'export' && <Export state={h.present} client={client} setClient={setClient} failures={failures.length} go={go} />}
        {view === 'load' && (
          <Load onLoad={(state, c, warning) => { dispatch({ type: 'replace', state }); setClient(c); setNotice(warning); setView('brand'); }} />
        )}
      </section>

      <section className="tt-preview" aria-label="Preview">
        <div className="hds-chrome tt-preview__bar">
          <PreviewTabs tab={tab} setTab={setTab} />
          <div className="tt-steps" role="group" aria-label="Preview mode">
            {(['light', 'dark'] as const).map((m) => (
              <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)}>{m}</button>
            ))}
          </div>
        </div>
        <Preview tab={tab} />
      </section>
    </div>
  );
}

function Changes({ state, changes, set, go, reset }: {
  state: DriverInput; changes: Path[]; set: (p: Path, v: unknown) => void; go: (v: View) => void; reset: () => void;
}) {
  return (
    <>
      <h2>Changes from the defaults</h2>
      <p className="tt-hint">This list is the content of the exported config.</p>
      {changes.length === 0 && <p>No changes. The theme uses the library defaults.</p>}
      <ul className="tt-changes">
        {changes.map((p) => (
          <li key={p.join('/')}>
            <button type="button" className="tt-link" onClick={() => go(STEP_OF[p[0]] ?? 'brand')}>{p.join(' › ')}</button>
            <code>{JSON.stringify(getIn(state, p))}</code>
            <button type="button" className="tt-reset" aria-label={`Reset ${p.join(' ')}`} title="Reset to default" onClick={() => set(p, undefined)}>↺</button>
          </li>
        ))}
      </ul>
      {changes.length > 0 && <button type="button" onClick={reset}>Reset everything (undo restores it)</button>}
    </>
  );
}

function ContrastReport({ failures, open }: {
  failures: Theme['contrast']; open: (ctx: 'default' | 'on-primary' | 'on-secondary', token: string) => void;
}) {
  const short = (t: string) => t.replace('hds/sem/color/', '');
  return (
    <>
      <h2>Contrast report</h2>
      <p className="tt-hint">WCAG 2 AA: text pairs need 4.5:1, non-text pairs need 3:1. Light, dark, and each brand context are checked.</p>
      {failures.length === 0 ? <p>Every pair passes.</p> : (
        <table className="tt-report">
          <thead><tr><th>Mode</th><th>Context</th><th>Foreground</th><th>Background</th><th>Ratio</th></tr></thead>
          <tbody>
            {failures.map((f, i) => (
              <tr key={i}>
                <td>{f.mode}</td><td>{f.context === 'default' ? 'root' : f.context}</td>
                <td><button type="button" className="tt-link" onClick={() => open(f.context, short(f.fg))}>{short(f.fg)}</button></td>
                <td><button type="button" className="tt-link" onClick={() => open(f.context, short(f.bg))}>{short(f.bg)}</button></td>
                <td>{f.ratio} / {f.min}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

function Export({ state, client, setClient, failures, go }: {
  state: DriverInput; client: string; setClient: (c: string) => void; failures: number; go: (v: View) => void;
}) {
  const [status, setStatus] = useState('');
  const text = configText(state, client.trim(), VERSION);
  const download = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type: 'text/javascript' }));
    a.download = 'theme.config.js';
    a.click();
    URL.revokeObjectURL(a.href);
    setStatus('Downloaded theme.config.js.');
  };
  const copy = () => navigator.clipboard.writeText(text).then(() => setStatus('Copied to the clipboard.'), () => setStatus('The browser blocked the clipboard. Select the text below and copy it.'));
  return (
    <>
      <h2>Export</h2>
      <div className="tt-control">
        <label htmlFor="tt-client">Client name</label>
        <input id="tt-client" className="tt-input" value={client} onChange={(e) => setClient(e.target.value)} placeholder="Acme" />
      </div>
      {failures > 0 && (
        <p className="tt-warn" role="status">
          This theme has {failures} contrast failure(s). The export works, but <code>hds-theme</code> exits with code 1 on it.{' '}
          <button type="button" className="tt-link" onClick={() => go('contrast')}>See the report</button>
        </p>
      )}
      <div className="tt-row">
        <button type="button" className="tt-primary" onClick={download}>Download theme.config.js</button>
        <button type="button" onClick={copy}>Copy</button>
      </div>
      {status && <p className="tt-hint" role="status">{status}</p>}
      <pre className="tt-code">{text}</pre>
    </>
  );
}

function Load({ onLoad }: { onLoad: (state: DriverInput, client: string, warning: string) => void }) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const load = async (source: string) => {
    setError('');
    let url = '';
    try {
      // The config is an ES module, as for the CLI. It runs as JavaScript in this page.
      url = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
      const mod = await import(/* @vite-ignore */ url);
      const config = mod.default;
      if (!config || typeof config !== 'object') throw new Error('The file has no default export object.');
      const { meta, ...drivers } = config as DriverInput;
      buildTheme(drivers);
      onLoad(drivers, meta?.client ?? '', meta?.version && meta.version !== VERSION
        ? `This config was built with handy-ds ${meta.version}. This tool is ${VERSION}. Library defaults can differ.`
        : '');
    } catch (e) {
      setError(`Could not load the config: ${(e as Error).message}`);
    } finally {
      if (url) URL.revokeObjectURL(url);
    }
  };
  return (
    <>
      <h2>Open a config</h2>
      <p className="tt-hint">Open a <code>theme.config.js</code> file or paste its text. The file runs as JavaScript, the same as with the CLI. Open only configs from your own projects. Opening replaces the current theme; undo restores it.</p>
      <div className="tt-control">
        <label htmlFor="tt-file">File</label>
        <input id="tt-file" type="file" accept=".js,.mjs,text/javascript" onChange={async (e) => {
          const f = e.target.files?.[0];
          if (f) load(await f.text());
        }} />
      </div>
      <div className="tt-control">
        <label htmlFor="tt-paste">Or paste the config</label>
        <textarea id="tt-paste" className="tt-input tt-code" rows={10} value={text} onChange={(e) => setText(e.target.value)}
          placeholder={'export default {\n  color: { primary: "#0069ca" },\n};'} />
        <button type="button" disabled={!text.trim()} onClick={() => load(text)}>Open pasted config</button>
      </div>
      {error && <p className="tt-error" role="alert">{error}</p>}
    </>
  );
}

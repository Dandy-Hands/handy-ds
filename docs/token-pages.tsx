// Token documentation pages (Drivers / Ref / Sem / Sem delta). Live: Layout
// publishes the theme object computed from the theming flyout; the pages read it.
// Rendered from docs/components/tokens/*.mdx.
//
// Deliberately hook-free: the MDX render test renders these pages outside a
// router/app, and the docs-site has its own React copy (dedupe pins SSR react
// to it), so useState here would mix React instances. The filter below is a
// plain DOM filter instead of React state.
import type { ReactNode } from 'react';
import { buildTheme } from '../src/tokens/index.ts';

export type Theme = ReturnType<typeof buildTheme>;

// Layout publishes the live theme here; pages fall back to the default theme
// so they render anywhere (tests, standalone).
let publishedTheme: Theme | null = null;
export function setDocTheme(t: Theme) { publishedTheme = t; }

const varName = (slash: string) => `--${slash.replaceAll('/', '-')}`;
const REFS = /\{hds\/prim\/([^}]+)\}/g;

/** `{hds/prim/x}` -> primitive value, or the template untouched if unknown. */
const resolve = (tpl: string, prim: Record<string, string>) =>
  tpl.replace(REFS, (_, name) => prim[name] ?? `{${name}}`);
const refsOf = (tpl: string) => [...tpl.matchAll(REFS)].map((m) => m[1]);
const isColor = (v: string) => /^(oklch|#|rgb|hsl|color\()/.test(v.trim());

/** The live theme when viewed in the docs site; the default theme anywhere else. */
function useTheme(): Theme {
  return publishedTheme ?? buildTheme();
}

function Swatch({ value }: { value: string }) {
  return isColor(value) ? <span className="tp-swatch" style={{ background: value }} /> : null;
}

/** Uncontrolled filter: hides table rows by data-name. No React state. */
function Filter() {
  const onInput = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const root = input.closest('.tp-page');
    if (!root) return;
    const q = input.value.trim().toLowerCase();
    root.querySelectorAll<HTMLElement>('.tp-group').forEach((group) => {
      let any = false;
      group.querySelectorAll<HTMLElement>('tr[data-name]').forEach((tr) => {
        const hit = !q || (tr.dataset.name ?? '').toLowerCase().includes(q);
        tr.hidden = !hit;
        if (hit) any = true;
      });
      group.hidden = !any;
    });
  };
  return <input className="tp-filter" placeholder="Filter by name…" onInput={onInput} />;
}

type Row = [name: string | undefined, cells: ReactNode[]];

function TokenTable({ head, rows }: { head: string[]; rows: Row[] }) {
  return (
    <table className="tp-table">
      <thead>
        <tr>{head.map((h) => <th key={h}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map(([name, cells], i) => (
          <tr key={i} data-name={name}>{cells.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
        ))}
      </tbody>
    </table>
  );
}

const Code = ({ children }: { children: string }) => <code className="tp-code">{children}</code>;
const Name = ({ children }: { children: string }) => <code className="tp-name">{children}</code>;
const Group = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="tp-group"><h3>{title}</h3>{children}</section>
);

// ---------- Drivers page ----------

export function DriversPage() {
  const { drivers, primitives } = useTheme();
  const d = drivers;
  const prim = (name: string, step: string) => (
    <>
      <Code>{`hds/prim/${name}/${step}`}</Code>
      {' = '}
      <Swatch value={primitives[`hds/prim/${name}/${step}`]} />
      <Code>{primitives[`hds/prim/${name}/${step}`]}</Code>
    </>
  );
  const rows: Row[] = [
    ...(['primary', 'accent', 'neutral', 'danger', 'warning', 'success', 'info'] as const).map((k) => [
      `color.${k}`,
      [<Name>{`color.${k}`}</Name>,
      <Swatch value={String(d.color[k] ?? '#000')} />,
      <Code>{String(d.color[k] ?? '(derived from primary hue)')}</Code>,
      k === 'neutral' && !d.color.neutral ? <em>tinted from primary</em> : prim('color', `${k}/600`)],
    ] as Row),
    [`density`, [<Name>density</Name>, '', <Code>{String(d.density)}</Code>, <em>space steps = n × 4px × density</em>]],
    [`radius`, [<Name>radius</Name>, '', <Code>{`${d.radius}px`}</Code>, prim('radius', 'base')]],
    ...(['action', 'input', 'surface'] as const).map((c) => [
      `style.${c}.radius`,
      [<Name>{`style.${c}.radius`}</Name>, '', <Code>{d.style[c].radius}</Code>, prim('radius', d.style[c].radius)],
    ] as Row),
    ...(['action', 'input', 'surface'] as const).map((c) => [
      `style.${c}.border`,
      [<Name>{`style.${c}.border`}</Name>, '', <Code>{d.style[c].border}</Code>, prim('border', d.style[c].border)],
    ] as Row),
    ...Object.entries(d.typography).map(([k, v]) => [
      `typography.${k}`,
      [<Name>{`typography.${k}`}</Name>, '', <Code>{String(v)}</Code>,
        <Code>{k === 'headingFamily' || k === 'bodyFamily' ? 'hds/prim/type/family/*' : 'hds/prim/type/*'}</Code>],
    ] as Row),
    [`shadow.strength`, [<Name>shadow.strength</Name>, '', <Code>{String(d.shadow.strength)}</Code>, <em>scales all shadow levels</em>]],
    ...Object.entries(d.sections).map(([section, ctx]) => [
      `sections.${section}`,
      [<Name>{`sections.${section}`}</Name>, '', <Code>{ctx}</Code>, <em>{`[data-section="${section}"]`}</em>],
    ] as Row),
  ];
  return (
    <div className="tp-page">
      <Filter />
      <TokenTable head={['Driver', '', 'Value', 'Feeds']} rows={rows} />
    </div>
  );
}

// ---------- Ref page ----------

const TYPE_ORDER = ['color', 'space', 'radius', 'border', 'type', 'shadow'];
const RAMP_ORDER = ['primary', 'accent', 'neutral', 'danger', 'warning', 'success', 'info', 'white', 'black'];

export function RefPage() {
  const { primitives } = useTheme();
  const g = new Map<string, string[]>();
  for (const name of Object.keys(primitives)) {
    const [, , type, ...rest] = name.split('/');
    const key = type === 'color' ? `color / ${rest[0]}` : type;
    if (!g.has(key)) g.set(key, []);
    g.get(key)!.push(rest.join('/'));
  }
  const sortKey = (k: string) => {
    const [type, ramp] = k.split(' / ');
    return TYPE_ORDER.indexOf(type) + (type === 'color' ? RAMP_ORDER.indexOf(ramp) / 100 : 0);
  };
  const groups = [...g.entries()]
    .sort((a, b) => sortKey(a[0]) - sortKey(b[0]))
    .map(([key, names]) => [key, names.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))] as const);

  return (
    <div className="tp-page">
      <Filter />
      {groups.map(([key, names]) => {
        const rows: Row[] = names.map((n) => {
          const slash = `hds/prim/${key.includes(' / ') ? `${key.split(' / ')[0]}/${n}` : `${key}/${n}`}`;
          const value = primitives[slash];
          return [slash, [
            <Name>{slash}</Name>,
            <Code>{varName(slash)}</Code>,
            <span><Swatch value={value} /> <Code>{value}</Code></span>,
          ]];
        });
        return <Group key={key} title={key}><TokenTable head={['Token', 'CSS variable', 'Value']} rows={rows} /></Group>;
      })}
    </div>
  );
}

// ---------- Sem pages (default + on-primary delta) ----------

const CATEGORY_ORDER = ['action', 'input', 'surface', 'type', 'icon', 'divider', 'feedback', 'overlay', 'focus'];

export function SemPage({ delta = false }: { delta?: boolean }) {
  const { map, primitives } = useTheme();
  const entries = Object.entries(delta ? map['on-primary'] : map.default);
  const g = new Map<string, [string, string][]>();
  for (const [name, tpl] of entries) {
    const category = name.split('/')[2];
    if (!g.has(category)) g.set(category, []);
    g.get(category)!.push([name, tpl]);
  }
  const groups = [...g.entries()]
    .sort((a, b) => CATEGORY_ORDER.indexOf(a[0]) - CATEGORY_ORDER.indexOf(b[0]))
    .map(([k, v]) => [k, v.sort((a, b) => a[0].localeCompare(b[0]))] as const);

  const cell = (tpl: string) => {
    const value = resolve(tpl, primitives);
    return (
      <span>
        <Swatch value={value} /> <Code>{value}</Code>
      </span>
    );
  };

  return (
    <div className="tp-page">
      {delta && (
        <p className="tp-note">
          Only tokens whose value differs from the <code>default</code> context. Applied under{' '}
          <code>[data-context="on-primary"]</code> (and any section mapped to it).
        </p>
      )}
      <Filter />
      {groups.map(([category, groupEntries]) => {
        const rows: Row[] = delta
          ? groupEntries.map(([name, tpl]) => [name, [
              <Name>{name}</Name>,
              <Code>{varName(name)}</Code>,
              cell(map.default[name]),
              cell(tpl),
            ]])
          : groupEntries.map(([name, tpl]) => {
              const reads = refsOf(tpl);
              return [name, [
                <Name>{name}</Name>,
                <Code>{varName(name)}</Code>,
                reads.length ? <Name>{reads.join(', ')}</Name> : <em>literal</em>,
                cell(tpl),
              ]];
            });
        return (
          <Group key={category} title={category}>
            {delta
              ? <TokenTable head={['Token', 'CSS variable', 'Default', 'On primary']} rows={rows} />
              : <TokenTable head={['Token', 'CSS variable', 'Reads', 'Value']} rows={rows} />}
          </Group>
        );
      })}
    </div>
  );
}

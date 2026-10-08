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
const REFS = /\{(hds\/prim\/[^}]+)\}/g;
const isColor = (v: string) => /^(oklch|#|rgb|hsl|color\()/.test(v.trim());

/** `{hds/prim/x}` -> primitive value (following role aliases), or the template untouched if unknown. */
function resolve(tpl: string, prim: Record<string, string>): string {
  return tpl.replace(REFS, (_, name) => (name in prim ? resolve(prim[name], prim) : `{${name}}`));
}
const refsOf = (tpl: string) => [...tpl.matchAll(REFS)].map((m) => m[1]);
const pickRef = (pick: string) => (pick === 'transparent' ? 'transparent' : `{hds/prim/color/${pick}}`);

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
const Value = ({ value }: { value: string }) => <span><Swatch value={value} /> <Code>{value}</Code></span>;

/** Groups rows by a key, in first-seen order. */
function groupBy<T>(items: T[], key: (item: T) => string): [string, T[]][] {
  const g = new Map<string, T[]>();
  for (const item of items) {
    const k = key(item);
    if (!g.has(k)) g.set(k, []);
    g.get(k)!.push(item);
  }
  return [...g.entries()];
}

// ---------- Drivers page ----------

/** Flattens the driver object to dotted names: `color.primary`, `radius.control`, ... */
function flatten(obj: object, prefix = ''): [string, string][] {
  return Object.entries(obj).flatMap(([k, v]): [string, string][] =>
    v !== null && typeof v === 'object' ? flatten(v, `${prefix}${k}.`) : [[`${prefix}${k}`, String(v)]],
  );
}

export function DriversPage() {
  const { drivers } = useTheme();
  const groups = groupBy(flatten(drivers), ([name]) => name.split('.')[0]);
  return (
    <div className="tp-page">
      <Filter />
      {groups.map(([group, entries]) => (
        <Group key={group} title={group}>
          <TokenTable
            head={['Driver', 'Value']}
            rows={entries.map(([name, value]) => [name, [<Name>{name}</Name>, <Value value={value} />]])}
          />
        </Group>
      ))}
      {!drivers.color.secondary && <p className="tp-note"><code>color.secondary</code> is not set: its hue is primary + 163.6°.</p>}
    </div>
  );
}

// ---------- Ref page ----------

export function RefPage() {
  const { primitives } = useTheme();
  const light = { ...primitives.shared, ...primitives.light };
  const dark = { ...primitives.shared, ...primitives.dark };
  const names = [...Object.keys(primitives.light), ...Object.keys(primitives.shared)];
  const groups = groupBy(names, (n) => {
    const [, , type, scale] = n.split('/');
    return type === 'color' ? `color / ${scale.startsWith('hue-') ? 'slots' : scale}` : type;
  });
  return (
    <div className="tp-page">
      <p className="tp-note">Role scales (primary, danger, …) are aliases of hue slots. Slot of each role: {
        Object.entries(primitives.wheel.roleSlot).map(([role, slot]) => `${role} = hue-${slot}`).join(', ')
      }.</p>
      <Filter />
      {groups.map(([key, keyNames]) => {
        const color = key.startsWith('color');
        const rows: Row[] = keyNames.map((n) => [n, [
          <Name>{n}</Name>,
          <Code>{varName(n)}</Code>,
          <Value value={resolve(light[n], light)} />,
          ...(color ? [<Value value={resolve(dark[n], dark)} />] : []),
        ]]);
        return (
          <Group key={key} title={key}>
            <TokenTable head={color ? ['Token', 'CSS variable', 'Light', 'Dark'] : ['Token', 'CSS variable', 'Value']} rows={rows} />
          </Group>
        );
      })}
    </div>
  );
}

// ---------- Sem pages (root + brand context deltas) ----------

export function SemPage({ context }: { context?: 'on-primary' | 'on-secondary' }) {
  const { colors, other, primitives, drivers } = useTheme();
  const light = { ...primitives.shared, ...primitives.light };
  const dark = { ...primitives.shared, ...primitives.dark };
  const root = colors.light.default;

  if (context) {
    const ctx = colors.light[context];
    const changed = Object.keys(ctx).filter((k) => ctx[k] !== root[k]);
    const groups = groupBy(changed, (k) => k.split('/')[0]);
    return (
      <div className="tp-page">
        <p className="tp-note">
          Only tokens whose pick differs from the root. Applied under <code>{`[data-context="${context}"]`}</code> (and any
          section mapped to it).
        </p>
        <Filter />
        {groups.map(([category, keys]) => (
          <Group key={category} title={category}>
            <TokenTable
              head={['Token', 'Root pick', `${context} pick`, 'Value']}
              rows={keys.map((k) => [k, [
                <Name>{`hds/sem/color/${k}`}</Name>,
                <Code>{root[k]}</Code>,
                <Code>{ctx[k]}</Code>,
                <Value value={resolve(pickRef(ctx[k]), light)} />,
              ]])}
            />
          </Group>
        ))}
      </div>
    );
  }

  const colorGroups = groupBy(Object.keys(root), (k) => `color / ${k.split('/')[0]}`);
  const otherGroups = groupBy(Object.keys(other), (n) => n.split('/')[2]);
  return (
    <div className="tp-page">
      <Filter />
      {colorGroups.map(([group, keys]) => (
        <Group key={group} title={group}>
          <TokenTable
            head={['Token', 'Pick', 'Light', 'Dark']}
            rows={keys.map((k) => [k, [
              <Name>{`hds/sem/color/${k}`}</Name>,
              <Code>{colors.dark.default[k] === root[k] ? root[k] : `${root[k]} · dark ${colors.dark.default[k]}`}</Code>,
              <Value value={resolve(pickRef(root[k]), light)} />,
              <Value value={resolve(pickRef(colors.dark.default[k]), dark)} />,
            ]])}
          />
        </Group>
      ))}
      <p className="tp-note">
        <code>hds/sem/color/overlay/scrim</code> is not a pick: it is <code>black</code> at the{' '}
        <code>overlay.opacity</code> driver ({drivers.overlay.opacity}).
      </p>
      {otherGroups.map(([group, names]) => (
        <Group key={group} title={group}>
          <TokenTable
            head={['Token', 'Reads', 'Value']}
            rows={names.map((n) => [n, [
              <Name>{n}</Name>,
              refsOf(other[n]).length ? <Name>{[...new Set(refsOf(other[n]))].slice(0, 3).join(', ')}</Name> : <em>literal</em>,
              <Code>{resolve(other[n], light)}</Code>,
            ]])}
          />
        </Group>
      ))}
    </div>
  );
}

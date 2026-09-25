// Live theme controls, moved from demo/main.tsx. Edits a ThemeConfig; Layout re-runs
// buildTheme() and injects the CSS site-wide, so changes apply to every docs page.
import { buildTheme, type ThemeConfig } from '../../src/tokens/index.ts';
import { Card, Text } from 'handy-ds';

export function ThemeControls({ config, setConfig, failures }: {
  config: Required<Pick<ThemeConfig, 'drivers'>> & ThemeConfig;
  setConfig: (c: typeof config) => void;
  failures: ReturnType<typeof buildTheme>['contrast'];
}) {
  const d = config.drivers;
  const set = (patch: object) => setConfig({ ...config, drivers: { ...d, ...patch } });
  const accentButtons = Boolean(config.mapping);
  return (
    <Card elevation={1} className="controls">
      <Text variant="label">Drivers</Text>
      <label>Primary <input type="color" value={d.color?.primary} onChange={(e) => set({ color: { ...d.color, primary: e.target.value } })} /></label>
      <label>Accent <input type="color" value={d.color?.accent} onChange={(e) => set({ color: { ...d.color, accent: e.target.value } })} /></label>
      <label>Density {d.density}<input type="range" min={0.75} max={1.35} step={0.05} value={d.density} onChange={(e) => set({ density: Number(e.target.value) })} /></label>
      <label>Radius {d.radius}px<input type="range" min={0} max={20} value={d.radius} onChange={(e) => set({ radius: Number(e.target.value) })} /></label>
      <label>Shadow {d.shadow?.strength}<input type="range" min={0} max={2} step={0.25} value={d.shadow?.strength} onChange={(e) => set({ shadow: { strength: Number(e.target.value) } })} /></label>
      <label>
        Action radius
        <select value={d.style?.action?.radius} onChange={(e) => set({ style: { ...d.style, action: { ...d.style?.action, radius: e.target.value } } })}>
          {['none', 'sm', 'base', 'lg', 'xl', 'full'].map((r) => <option key={r}>{r}</option>)}
        </select>
      </label>
      <label>
        Headings
        <select value={d.typography?.headingFamily} onChange={(e) => set({ typography: { ...d.typography, headingFamily: e.target.value } })}>
          <option value={'"Source Serif 4", Georgia, serif'}>Serif</option>
          <option value="Inter, system-ui, sans-serif">Sans</option>
        </select>
      </label>
      <Text variant="label">Mapping</Text>
      <label>
        <input type="checkbox" checked={accentButtons} onChange={(e) => setConfig({
          ...config,
          mapping: e.target.checked ? {
            default: {
              'hds/sem/action/color/primary/default/bg': '{hds/prim/color/accent/700}',
              'hds/sem/action/color/primary/hover/bg': '{hds/prim/color/accent/800}',
              'hds/sem/action/color/primary/active/bg': '{hds/prim/color/accent/900}',
            },
          } : undefined,
        })} />
        Primary buttons use accent
      </label>
      <Text variant="caption">{failures.length === 0 ? 'Contrast: all pairs pass' : `Contrast: ${failures.length} failing pair(s)`}</Text>
      {failures.slice(0, 5).map((f) => <Text key={f.context + f.fg + f.bg} variant="caption">{f.context}: {f.fg.slice(8)} on {f.bg.slice(8)} = {f.ratio}</Text>)}
    </Card>
  );
}

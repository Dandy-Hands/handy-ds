// Live theme controls. Edits a driver config; Layout re-runs buildTheme() and injects the
// CSS site-wide, so changes apply to every docs page.
import { buildTheme, type DriverInput } from '../../src/tokens/index.ts';
import { Card, Text } from 'handy-ds';

const RADIUS = ['none', '050', '100', '200', '300', '400', '600', 'round'];

export function ThemeControls({ drivers: d, setDrivers, failures }: {
  drivers: DriverInput;
  setDrivers: (d: DriverInput) => void;
  failures: ReturnType<typeof buildTheme>['contrast'];
}) {
  const set = (patch: DriverInput) => setDrivers({ ...d, ...patch });
  const color = (patch: DriverInput['color']) => set({ color: { ...d.color, ...patch } });
  const secondaryButtons = d.picks?.['action/primary/default/bg'] !== undefined;
  return (
    <Card elevation={1} className="controls">
      <Text variant="label">Palette</Text>
      <label>Primary <input type="color" value={d.color?.primary} onChange={(e) => color({ primary: e.target.value })} /></label>
      <label>
        <input type="checkbox" checked={d.color?.secondary !== undefined} onChange={(e) => color({ secondary: e.target.checked ? '#d55c13' : undefined })} />
        Secondary
        {d.color?.secondary !== undefined && <input type="color" value={d.color.secondary} onChange={(e) => color({ secondary: e.target.value })} />}
      </label>
      <label>Chroma floor {d.color?.floor}<input type="range" min={0} max={1} step={0.05} value={d.color?.floor} onChange={(e) => color({ floor: Number(e.target.value) })} /></label>
      <label>Contrast {d.color?.contrast}<input type="range" min={-1} max={1} step={0.1} value={d.color?.contrast} onChange={(e) => color({ contrast: Number(e.target.value) })} /></label>
      <label>
        Mode
        <select value={d.mode} onChange={(e) => set({ mode: e.target.value as 'light' | 'dark' | 'system' })}>
          {['light', 'dark', 'system'].map((m) => <option key={m}>{m}</option>)}
        </select>
      </label>
      <Text variant="label">Other</Text>
      <label>Density {d.density}<input type="range" min={0.75} max={1.35} step={0.05} value={d.density} onChange={(e) => set({ density: Number(e.target.value) })} /></label>
      <label>Shadow {d.shadow?.strength}<input type="range" min={0} max={2} step={0.25} value={d.shadow?.strength} onChange={(e) => set({ shadow: { strength: Number(e.target.value) } })} /></label>
      <label>
        Control radius
        <select value={d.radius?.control} onChange={(e) => set({ radius: { ...d.radius, control: e.target.value as never } })}>
          {RADIUS.map((r) => <option key={r}>{r}</option>)}
        </select>
      </label>
      <label>
        Headings
        <select value={d.typography?.family?.heading} onChange={(e) => set({ typography: { ...d.typography, family: { ...d.typography?.family, heading: e.target.value } } })}>
          <option value={'"Source Serif 4", Georgia, serif'}>Serif</option>
          <option value="Inter, system-ui, sans-serif">Sans</option>
        </select>
      </label>
      <Text variant="label">Picks</Text>
      <label>
        <input type="checkbox" checked={secondaryButtons} onChange={(e) => set({
          picks: e.target.checked ? { 'action/primary/default/bg': 'secondary/600', 'action/primary/default/border': 'secondary/600' } : {},
        })} />
        Primary buttons use secondary/600
      </label>
      <Text variant="caption">{failures.length === 0 ? 'Contrast: all pairs pass' : `Contrast: ${failures.length} failing pair(s)`}</Text>
      {failures.slice(0, 5).map((f) => (
        <Text key={f.mode + f.context + f.fg + f.bg} variant="caption">
          {f.mode}/{f.context}: {f.fg.slice(14)} on {f.bg.slice(14)} = {f.ratio}
        </Text>
      ))}
    </Card>
  );
}

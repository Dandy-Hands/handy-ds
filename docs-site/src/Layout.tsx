import { useMemo, useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { buildTheme, type ThemeConfig } from '../../src/tokens/index.ts';
import { Popover, Button } from 'handy-ds';
import { ThemeControls } from './ThemePanel.tsx';

interface Page {
  path: string;
  title: string;
}

// Theme state lives here (never unmounts across routes) so the injected <style>
// persists site-wide, whether or not the panel is open.
export function Layout({ pages }: { pages: Page[] }) {
  const location = useLocation();
  const current = location.pathname.replace(/^\//, '');
  const [config, setConfig] = useState({
    drivers: {
      color: { primary: '#0069ca', accent: '#d55c13' },
      density: 1,
      radius: 8,
      shadow: { strength: 1 },
      style: { action: { radius: 'base' as const } },
      typography: { headingFamily: '"Source Serif 4", Georgia, serif' },
    },
  } as Required<Pick<ThemeConfig, 'drivers'>> & ThemeConfig);
  const theme = useMemo(() => buildTheme(config), [config]);

  return (
    <div className="docs-layout">
      <style>{theme.css}</style>
      <aside className="docs-sidebar">
        <h1>
          <Link to="/">handy-ds</Link>
        </h1>
        <nav>
          <ul>
            {pages.map((page) => (
              <li key={page.path}>
                <Link
                  to={`/${page.path}`}
                  className={current === page.path ? 'active' : ''}
                >
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Popover.Root>
          <Popover.Trigger>Theme ⚙</Popover.Trigger>
          <Popover.Portal>
            <Popover.Positioner side="right" align="start" sideOffset={8}>
              <Popover.Popup className="theme-flyout">
                <Popover.Title>Live theming</Popover.Title>
                <ThemeControls config={config} setConfig={setConfig} failures={theme.contrast} />
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      </aside>
      <main className="docs-content">
        <Outlet />
      </main>
    </div>
  );
}

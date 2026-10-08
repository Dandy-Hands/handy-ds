import { useMemo, useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { buildTheme, defaultDrivers, type DriverInput } from '../../src/tokens/index.ts';
import { Popover, Button } from 'handy-ds';
import { ThemeControls } from './ThemePanel.tsx';
import { setDocTheme } from '../../docs/token-pages.tsx';

interface Page {
  path: string;
  title: string;
}

// Theme state lives here (never unmounts across routes) so the injected <style>
// persists site-wide, whether or not the panel is open.
export function Layout({ pages }: { pages: Page[] }) {
  const location = useLocation();
  const current = location.pathname.replace(/^\//, '');
  const [drivers, setDrivers] = useState<DriverInput>(defaultDrivers);
  const theme = useMemo(() => buildTheme(drivers), [drivers]);
  setDocTheme(theme);

  // Sidebar sections: tokens get their own area, everything else is components.
  const sections = [
    { title: 'Tokens', pages: pages.filter((p) => p.path.startsWith('tokens/')) },
    { title: 'Components', pages: pages.filter((p) => !p.path.startsWith('tokens/')) },
  ].filter((s) => s.pages.length > 0);

  return (
    <div className="docs-layout">
      <style>{theme.css}</style>
      <aside className="docs-sidebar">
        <h1>
          <Link to="/">handy-ds</Link>
        </h1>
        <Popover.Root>
          <Popover.Trigger className="theme-trigger">Theme ⚙</Popover.Trigger>
          <Popover.Portal>
            <Popover.Positioner side="right" align="start" sideOffset={8}>
              <Popover.Popup className="theme-flyout">
                <Popover.Title>Live theming</Popover.Title>
                <ThemeControls drivers={drivers} setDrivers={setDrivers} failures={theme.contrast} />
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
        <nav>
          {sections.map((section) => (
            <div key={section.title}>
              <h2>{section.title}</h2>
              <ul>
                {section.pages.map((page) => (
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
            </div>
          ))}
        </nav>
      </aside>
      <main className="docs-content">
        <Outlet />
      </main>
    </div>
  );
}

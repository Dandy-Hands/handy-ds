import { Link, useLocation, Outlet } from 'react-router-dom';
import { buildTheme } from '../../src/tokens/index.ts';
import { setDocTheme } from '../../docs/token-pages.tsx';

// The docs show the default theme. The theme builder (/theme) edits themes.
const theme = buildTheme();

interface Page {
  path: string;
  title: string;
  category?: string;
}

export function Layout({ pages }: { pages: Page[] }) {
  const location = useLocation();
  const current = location.pathname.replace(/^\//, '');
  setDocTheme(theme);

  // Sidebar sections: tokens, then one section per component category (first-seen order).
  const categories = [...new Set(pages.map((p) => p.category).filter((c): c is string => !!c))];
  const sections = [
    { title: 'Tokens', pages: pages.filter((p) => p.path.startsWith('tokens/')) },
    { title: 'Components', pages: pages.filter((p) => !p.path.startsWith('tokens/') && !p.category) },
    ...categories.map((c) => ({ title: c, pages: pages.filter((p) => p.category === c) })),
  ].filter((s) => s.pages.length > 0);

  return (
    <div className="docs-layout">
      <aside className="docs-sidebar">
        <h1>
          <Link to="/">handy-ds</Link>
        </h1>
        <Link to="/theme" className="theme-trigger">Theme builder</Link>
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

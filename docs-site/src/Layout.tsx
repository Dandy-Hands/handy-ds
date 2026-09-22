import { Link, useLocation, Outlet } from 'react-router-dom';

interface Page {
  path: string;
  title: string;
}

export function Layout({ pages }: { pages: Page[] }) {
  const location = useLocation();
  const current = location.pathname.replace(/^\//, '');

  return (
    <div className="docs-layout">
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
      </aside>
      <main className="docs-content">
        <Outlet />
      </main>
    </div>
  );
}

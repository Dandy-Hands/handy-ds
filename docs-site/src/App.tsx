import { BrowserRouter, Routes, Route, useParams, Navigate } from 'react-router-dom';
import { Layout } from './Layout.tsx';

interface Page {
  path: string;
  title: string;
  order: number;
  Component: React.ComponentType;
}

interface MdxModule {
  default: React.ComponentType;
  frontmatter?: Record<string, unknown>;
}

const modules = import.meta.glob('../../docs/components/**/*.mdx', { eager: true }) as Record<string, MdxModule>;

function fileToRoute(file: string): string {
  const relative = file.replace('../../docs/components/', '').replace(/\.mdx$/, '');
  if (relative === 'index') return '';
  return relative;
}

function fileToTitle(file: string): string {
  const route = fileToRoute(file);
  if (!route) return 'Overview';
  return route
    .split('/')
    .pop()!
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const pages: Page[] = Object.entries(modules)
  .map(([file, mod]) => {
    const route = fileToRoute(file);
    const fm = mod.frontmatter ?? {};
    return {
      path: route,
      title: (fm.title as string) ?? fileToTitle(file),
      order: (fm.order as number) ?? 999,
      Component: mod.default,
    };
  })
  .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));

function Page() {
  const { '*': slug } = useParams();
  const page = pages.find((p) => p.path === (slug ?? ''));
  if (!page) return <Navigate to="/" replace />;
  return <page.Component />;
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout pages={pages} />}>
          <Route path="*" element={<Page />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

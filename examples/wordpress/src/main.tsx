import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Alert, Button, Card, Dialog, Input, NavigationMenu, Progress, Text } from 'handy-ds';
import 'handy-ds/styles.css';
import './theme.css';
import './app.css';
import { getPost, getPosts, SITE, text, type Post } from './wp.ts';

const formatDate = (iso: string) => new Date(iso).toLocaleDateString(undefined, { dateStyle: 'medium' });

function Loading({ label }: { label: string }) {
  return (
    <Progress.Root value={null} aria-label={label} className="loading">
      <Progress.Track><Progress.Indicator /></Progress.Track>
    </Progress.Root>
  );
}

function PostDialog({ slug, onClose }: { slug: string | null; onClose: () => void }) {
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let live = true;
    setPost(null);
    setError(null);
    getPost(slug).then((p) => live && setPost(p), (e: Error) => live && setError(e.message));
    return () => { live = false; };
  }, [slug]);

  return (
    <Dialog.Root open={slug !== null} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Popup className="post">
          {error && <Alert sentiment="danger" heading="Couldn't load this post">{error}</Alert>}
          {!post && !error && <Loading label="Loading post" />}
          {post && (
            <>
              <Text variant="caption">{formatDate(post.date)}</Text>
              <Dialog.Title>{text(post.title)}</Dialog.Title>
              {/* Post HTML from the client's own CMS (WordPress filters it with kses for
                  authors without unfiltered_html). Sanitize with DOMPurify if authors aren't trusted. */}
              <div className="post__content" dangerouslySetInnerHTML={{ __html: post.content }} />
            </>
          )}
          <div className="post__actions">
            {post && <a className="hds-button hds-action" data-priority="tertiary" href={post.link}>View on WordPress</a>}
            <Dialog.Close>Close</Dialog.Close>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<Awaited<ReturnType<typeof getPosts>> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    setResult(null);
    setError(null);
    getPosts({ page, search: query }).then((r) => live && setResult(r), (e: Error) => live && setError(e.message));
    return () => { live = false; };
  }, [page, query]);

  return (
    <>
      <header className="bar">
        <Text variant="label">handy-ds × WordPress</Text>
        <NavigationMenu.Root>
          <NavigationMenu.List>
            <NavigationMenu.Item><NavigationMenu.Link href="#" active>Posts</NavigationMenu.Link></NavigationMenu.Item>
            <NavigationMenu.Item><NavigationMenu.Link href={SITE}>Visit site</NavigationMenu.Link></NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu.Root>
      </header>

      <section data-section="hero" className="hero">
        <Text variant="display">News</Text>
        <Text>Posts from {new URL(SITE).host}, fetched live from the WordPress REST API.</Text>
        <form className="search" role="search" onSubmit={(e) => { e.preventDefault(); setPage(1); setQuery(search.trim()); }}>
          <Input aria-label="Search posts" placeholder="Search posts" value={search} onChange={(e) => setSearch(e.target.value)} />
          <Button type="submit">Search</Button>
        </form>
      </section>

      <main className="posts">
        {error && <Alert sentiment="danger" role="alert" heading="Couldn't load posts">{error}</Alert>}
        {!result && !error && <Loading label="Loading posts" />}
        {result?.posts.length === 0 && <Alert heading="No posts found">Try a different search.</Alert>}
        <div className="grid">
          {result?.posts.map((post) => (
            <Card key={post.id} render={<article />} className="card">
              <Text variant="caption">{formatDate(post.date)}</Text>
              <Text variant="heading" render={<h2 />} className="card__title">{text(post.title)}</Text>
              <Text>{text(post.excerpt)}</Text>
              <Button priority="secondary" onClick={() => setOpen(post.slug)}>Read</Button>
            </Card>
          ))}
        </div>
        {result && result.totalPages > 1 && (
          <nav className="pager" aria-label="Pagination">
            <Button priority="tertiary" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
            <Text variant="caption">Page {page} of {result.totalPages}</Text>
            <Button priority="tertiary" disabled={page >= result.totalPages} onClick={() => setPage(page + 1)}>Next</Button>
          </nav>
        )}
      </main>

      <PostDialog slug={open} onClose={() => setOpen(null)} />
    </>
  );
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);

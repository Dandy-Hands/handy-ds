// Data layer between WordPress and the components. Uses the REST API: it ships with WordPress
// core (no plugin to install on the client's site) and allows cross-origin GETs by default.
// Point it at the client's site with VITE_WP_URL=https://client.example (see .env.example).

export const SITE = (import.meta.env.VITE_WP_URL ?? 'https://wordpress.org/news').replace(/\/$/, '');

export interface Post {
  id: number;
  slug: string;
  date: string;
  link: string;
  /** WordPress "rendered" HTML. Use text() for titles/excerpts. */
  title: string;
  excerpt: string;
  content: string;
}

interface WpPost {
  id: number;
  slug: string;
  date: string;
  link: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content?: { rendered: string };
}

async function wp<T>(path: string, params: Record<string, string | number>) {
  const url = new URL(`${SITE}/wp-json/wp/v2/${path}`);
  for (const [k, v] of Object.entries(params)) if (v !== '') url.searchParams.set(k, String(v));
  const res = await fetch(url);
  if (!res.ok) throw new Error(`WordPress returned ${res.status} for ${url.pathname}`);
  return { data: (await res.json()) as T, totalPages: Number(res.headers.get('X-WP-TotalPages') ?? 1) };
}

const toPost = (p: WpPost): Post => ({
  id: p.id,
  slug: p.slug,
  date: p.date,
  link: p.link,
  title: p.title.rendered,
  excerpt: p.excerpt.rendered,
  content: p.content?.rendered ?? '',
});

export async function getPosts({ page = 1, perPage = 9, search = '' } = {}) {
  const { data, totalPages } = await wp<WpPost[]>('posts', {
    page,
    per_page: perPage,
    search,
    _fields: 'id,slug,date,link,title,excerpt',
  });
  return { posts: data.map(toPost), totalPages };
}

export async function getPost(slug: string) {
  const { data } = await wp<WpPost[]>('posts', { slug, _fields: 'id,slug,date,link,title,excerpt,content' });
  if (!data[0]) throw new Error(`No post "${slug}"`);
  return toPost(data[0]);
}

/** Rendered HTML -> plain text (decodes entities; DOMParser documents never run scripts). */
export const text = (html: string) => new DOMParser().parseFromString(html, 'text/html').body.textContent?.trim() ?? '';

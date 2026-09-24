// Server-renders every owner MDX page through the docs-site Vite config
// (mdx + react plugins, handy-ds aliased to source) and fails on any render
// error: missing part Root wrapper, undefined demo component, missing import.
import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToString } from 'react-dom/server';
import { createServer } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../docs-site');

const server = await createServer({
  configFile: path.join(root, 'vite.config.ts'),
  logLevel: 'silent',
  server: { middlewareMode: true, hmr: false, ws: false },
  optimizeDeps: { noDiscovery: true },
});
after(() => server.close());

const { readdirSync, statSync } = await import('node:fs');
const { join } = path;

// every .mdx under docs/components, recursively
const pages: string[] = [];
(function walk(dir: string, rel = '') {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const relPath = rel ? `${rel}/${name}` : name;
    if (statSync(full).isDirectory()) walk(full, relPath);
    else if (name.endsWith('.mdx')) pages.push(full);
  }
})(join(root, '../docs/components'));

test(`all ${pages.length} owner MDX pages render without error`, async (t) => {
  const failures: string[] = [];
  for (const page of pages) {
    await t.test(page, async () => {
      try {
        const mod = await server.ssrLoadModule(page) as { default: React.ComponentType };
        renderToString(h(mod.default, {}));
      } catch (err) {
        failures.push(`${page}: ${err instanceof Error ? err.message : err}`);
        throw err;
      }
    });
  }
});

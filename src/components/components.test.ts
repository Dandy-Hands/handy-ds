// The component invariant (CLAUDE.md, token spec section 1): components read semantic tokens
// only. If every var() a component uses is an existing --hds-sem-* name, then a driver change
// or a mapping change re-themes it with zero component edits.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { buildTheme } from '../tokens/theme.ts';

const dir = new URL('./', import.meta.url);
const files = readdirSync(dir).filter((f) => /\.(css|tsx?)$/.test(f) && !f.endsWith('.test.ts'));
const declared = new Set(buildTheme().css.match(/--hds-sem-[a-z0-9-]+(?=:)/g));

test('no component file references a primitive', () => {
  for (const f of files) assert.doesNotMatch(readFileSync(new URL(f, dir), 'utf8'), /--hds-prim-/, f);
});

test('every semantic token a component reads exists in the theme', () => {
  for (const f of files) {
    for (const name of readFileSync(new URL(f, dir), 'utf8').match(/--hds-sem-[a-z0-9-]+/g) ?? []) {
      assert.ok(declared.has(name), `${f}: ${name} is not a semantic token`);
    }
  }
});

test('every component CSS rule lives in an hds layer', () => {
  for (const f of files.filter((f) => f.endsWith('.css'))) {
    assert.match(readFileSync(new URL(f, dir), 'utf8'), /@layer hds\.(components|base) \{/, f);
  }
});

// docs/components.md is what a consuming agent reads. A component that ships without an entry
// there is invisible to every agent building a client app, so shipping one is a test failure.
test('every exported component has an entry in docs/components.md', () => {
  const index = readFileSync(new URL('../index.ts', dir), 'utf8');
  const exported = (index.match(/export \{([^}]*)\}/g) ?? [])
    .flatMap((line) => line.replace(/export \{|\}/g, '').split(','))
    .map((name) => name.trim())
    .filter((name) => name && !name.startsWith('type '));
  const headings = new Set(
    (readFileSync(new URL('../../docs/components.md', dir), 'utf8').match(/^### .+$/gm) ?? [])
      .flatMap((h) => h.slice(4).split(',').map((name) => name.trim())),
  );
  for (const name of exported) assert.ok(headings.has(name), `docs/components.md has no "### ${name}" entry`);
});

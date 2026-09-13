#!/usr/bin/env node
// Usage: hds-theme [theme.config.js] > src/theme.css
// The config's default export is a ThemeConfig ({ drivers, mapping }). No config = default theme.
// Contrast failures print to stderr and exit 1, but the CSS is still written.
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { buildTheme } from '../dist/tokens.js';

const [file] = process.argv.slice(2);
const config = file ? (await import(pathToFileURL(resolve(file)).href)).default : {};
const { css, contrast } = buildTheme(config);

for (const f of contrast) {
  console.error(`contrast (${f.context}): ${f.fg} on ${f.bg} is ${f.ratio}:1, needs ${f.min}:1`);
}
process.stdout.write(css);
if (contrast.length) process.exitCode = 1;

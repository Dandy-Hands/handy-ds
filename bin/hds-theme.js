#!/usr/bin/env node
// Usage: hds-theme [theme.config.js] > src/theme.css
// The config's default export is a driver config (a partial of defaultDrivers). No config = default theme.
// Contrast failures print to stderr and exit 1, but the CSS is still written.
// A meta.version that differs from the installed version prints a warning only.
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { buildTheme } from '../dist/tokens.js';
import pkg from '../package.json' with { type: 'json' };

const [file] = process.argv.slice(2);
const config = file ? (await import(pathToFileURL(resolve(file)).href)).default : {};
const { css, contrast } = buildTheme(config);

const built = config.meta?.version;
if (built && built !== pkg.version) {
  console.error(`theme built with handy-ds ${built}, installed ${pkg.version}: library defaults may differ`);
}

for (const f of contrast) {
  console.error(`contrast (${f.mode}, ${f.context}): ${f.fg} on ${f.bg} is ${f.ratio}:1, needs ${f.min}:1`);
}
process.stdout.write(css);
if (contrast.length) process.exitCode = 1;

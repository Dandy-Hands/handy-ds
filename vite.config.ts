import { defineConfig, type Plugin } from 'vite';
import { buildTheme } from './src/tokens/theme.ts';

// Peer/runtime deps stay external; culori is bundled into tokens.js (build-time tool only).
const external = (id: string) => /^(react|react-dom|@base-ui\/react)(\/|$)/.test(id) || id.startsWith('node:');

// Ships the default theme next to styles.css: a starting point, and what the examples use
// before a client generates its own with `hds-theme`.
const defaultTheme: Plugin = {
  name: 'hds-default-theme',
  generateBundle() {
    this.emitFile({ type: 'asset', fileName: 'theme.css', source: buildTheme().css });
  },
};

export default defineConfig({
  plugins: [defaultTheme],
  build: {
    lib: {
      entry: { index: 'src/index.ts', tokens: 'src/tokens/index.ts' },
      formats: ['es'],
      cssFileName: 'styles',
    },
    rolldownOptions: { external },
    sourcemap: true,
  },
});

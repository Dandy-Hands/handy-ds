import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import path from 'node:path';

const __dirname = import.meta.dirname;

export default defineConfig({
  root: __dirname,
  plugins: [
    react(),
    mdx({ remarkPlugins: [remarkMdxFrontmatter] }),
  ],
  resolve: {
    alias: {
      'handy-ds': path.resolve(__dirname, '../src/index.ts'),
    },
  },
  server: {
    fs: {
      allow: ['..'],
    },
  },
  build: {
    outDir: 'dist',
  },
});

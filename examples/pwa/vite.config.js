import { readFileSync } from 'node:fs';

// Writes dist/sw.js from ./sw.js with the build's asset list, so the service worker can
// precache the whole app on install (hashed file names are only known after bundling).
const serviceWorker = {
  name: 'service-worker',
  apply: 'build',
  generateBundle(_, bundle) {
    const assets = ['/', ...Object.keys(bundle).map((f) => `/${f}`), '/manifest.webmanifest', '/icon.svg', '/icon-192.png', '/icon-512.png'];
    const source = readFileSync(new URL('./sw.js', import.meta.url), 'utf8').replace('self.__ASSETS__', JSON.stringify(assets));
    this.emitFile({ type: 'asset', fileName: 'sw.js', source });
  },
};

// dedupe: handy-ds is linked from this repo (file:../..); see examples/wordpress/vite.config.js.
export default { plugins: [serviceWorker], resolve: { dedupe: ['react', 'react-dom'] } };

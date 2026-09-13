// tsc copies `import './x.css'` into the .d.ts files; the CSS isn't there (Vite bundles it into
// styles.css), so strict consumers (skipLibCheck: false) would fail to resolve it. Drop them.
import { globSync, readFileSync, writeFileSync } from 'node:fs';

for (const file of globSync('dist/types/**/*.d.ts')) {
  writeFileSync(file, readFileSync(file, 'utf8').replace(/^import '[^']+\.css';\n/gm, ''));
}

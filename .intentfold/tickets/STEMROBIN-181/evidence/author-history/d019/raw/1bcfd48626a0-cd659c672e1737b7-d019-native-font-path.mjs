import path from 'node:path';
import { realpathSync } from 'node:fs';
import { absolute } from './retain-d016-evidence.mjs';

export function nativeFontDependency(file) {
  const directory = realpathSync(absolute('.claude/skills/ld-s10y-lesson/node_modules/katex/dist/fonts'));
  const resolved = path.resolve(file);
  return path.dirname(resolved) === directory &&
    ['KaTeX_Main-Regular.woff2', 'KaTeX_Main-Bold.woff2'].includes(path.basename(resolved));
}

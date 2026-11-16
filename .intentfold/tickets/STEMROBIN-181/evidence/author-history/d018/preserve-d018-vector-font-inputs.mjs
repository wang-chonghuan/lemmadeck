import fs from 'node:fs/promises';
import path from 'node:path';
import { bind, ticket } from './retain-d016-evidence.mjs';

const folder = `${ticket}/tmp/d018-vector-font-before`;
await fs.mkdir(folder, { recursive: true });
const aliases = [];
for (const name of ['htmlfrag.js', 'render_lesson.js', 'publish.mjs']) {
  const originalPath = `.claude/skills/ld-s10y-lesson/tools/${name}`;
  const target = `${folder}/${name}`;
  await fs.copyFile(originalPath, target, fs.constants.COPYFILE_EXCL);
  aliases.push({ ...await bind(target), originalPath, role: 'Exact native-tool bytes before confirmed F1 font embedding repair' });
}
const html = '.tmp/ld-s10y-lesson/render/9p/modern-us-neutral/phy9-c2-s2-n64';
for (const name of ['text', 'exercises']) {
  const originalPath = `${html}/${name}.html`;
  const target = `${folder}/${name}.html`;
  await fs.copyFile(originalPath, target, fs.constants.COPYFILE_EXCL);
  aliases.push({ ...await bind(target), originalPath, role: 'Exact initial native n64 HTML; failed actual-page glyph evidence retained' });
}
await fs.writeFile(path.join(folder, 'aliases.json'), `${JSON.stringify({
  role: 'Immutable pre-repair inputs; no source/SCI/figure/pixel approval replaced',
  files: aliases,
}, null, 2)}\n`, { flag: 'wx' });
console.log(folder);

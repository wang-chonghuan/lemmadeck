import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { bind, read, verify, ticket } from './retain-d016-evidence.mjs';

const work = `${ticket}/tmp`;
const before = `${work}/d018-vector-font-first-policy`;
await fs.mkdir(before, { recursive: true });
const aliases = [];
const first = await read(`${work}/d018-vector-font-tool-correction.json`);
for (const name of ['htmlfrag.js', 'vector_font.test.cjs']) {
  const originalPath = `.claude/skills/ld-s10y-lesson/tools/${name}`;
  const current = await fs.readFile(originalPath, 'utf8');
  assert.equal(current.split('KaTeX_Main,Arial,Helvetica,sans-serif').length, 2);
  const earlier = current.replace('KaTeX_Main,Arial,Helvetica,sans-serif', 'Arial,KaTeX_Main,Helvetica,sans-serif');
  const target = `${before}/${name}`;
  await fs.writeFile(target, earlier, { flag: 'wx' });
  const expected = first.implementation.find(item => item.path === originalPath);
  await verify(target, expected.sha256);
  aliases.push({ ...await bind(target), originalPath,
    role: 'Exact first font-order candidate recovered after one literal order change, not a new approval' });
}
const htmlRoot = '.tmp/ld-s10y-lesson/render/9p/modern-us-neutral/phy9-c2-s2-n64';
for (const name of ['text', 'exercises']) {
  const originalPath = `${htmlRoot}/${name}.html`;
  const target = `${before}/${name}.html`;
  await fs.copyFile(originalPath, target, fs.constants.COPYFILE_EXCL);
  aliases.push({ ...await bind(target), originalPath, role: 'Exact first font candidate HTML, including unresolved first mobile vector' });
}
await fs.writeFile(`${before}/aliases.json`, `${JSON.stringify({ files: aliases }, null, 2)}\n`, { flag: 'wx' });
const protectedProducts = (await read(`${work}/d018-n64-native-finalization.json`)).outputs;
for (const item of protectedProducts) await verify(item.path, item.sha256);
const command = [
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'render',
  '--book', '9p', '--edition', 'modern-us-neutral', '--lesson', 'phy9-c2-s2-n64',
];
const output = execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', command, { encoding: 'utf8' });
process.stdout.write(output);
const original = await read(`${work}/offline-d018/checkpoint-phy9-c2-s2-n64.json`);
const reused = original.results.filter(item => item.surface === 'exercises');
for (const item of reused) await verify(item.sourceHtml.path, item.sourceHtml.sha256);
const folder = `${work}/offline-d018-font-final`;
await fs.mkdir(folder, { recursive: true });
const checkerSource = await fs.readFile(`${work}/offline-d018-check.mjs`, 'utf8');
assert.equal(checkerSource.split('tmp/offline-d018').length, 2);
const checker = `${work}/offline-d018-font-final-check.mjs`;
await fs.writeFile(checker, checkerSource.replace('tmp/offline-d018', 'tmp/offline-d018-font-final'), { flag: 'wx' });
await fs.writeFile(`${folder}/checkpoint-phy9-c2-s2-n64.json`, `${JSON.stringify({
  status: 'incomplete', results: reused,
  basis: 'Only changed SVG typography on desktop/mobile text; two unchanged exercise rows reused. Original failures and first font-order candidate retained.',
}, null, 2)}\n`, { flag: 'wx' });
for (const item of protectedProducts) await verify(item.path, item.sha256);
await fs.writeFile(`${work}/d018-vector-font-final-tool-binding.json`, `${JSON.stringify({
  role: 'Confirmed F1 embedding tool correction, final existing font selected as primary so SVG clusters do not depend on lazy fallback',
  before: await bind(`${before}/aliases.json`), originalFailure: await bind(`${work}/d018-n64-screenshot-review.json`),
  priorImplementation: await bind(`${work}/d018-vector-font-tool-correction.json`),
  current: await Promise.all(['htmlfrag.js', 'render_lesson.js', 'publish.mjs', 'vector_font.test.cjs']
    .map(name => bind(`.claude/skills/ld-s10y-lesson/tools/${name}`))),
  command, output, unchangedProducts: protectedProducts,
  sourceScienceOrFigureGateRepeated: false, additionalFigureRepairs: 0,
}, null, 2)}\n`, { flag: 'wx' });
console.log(checker);

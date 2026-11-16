import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { bind, read, verify, exists, ticket, book } from './retain-d016-evidence.mjs';

const work = `${ticket}/tmp`;
const folder = `${work}/offline-d018-font-correction`;
await fs.mkdir(folder, { recursive: true });
const initial = `${work}/offline-d018/checkpoint-phy9-c2-s2-n64.json`;
const original = await read(initial);
const failure = `${work}/d018-n64-screenshot-review.json`;
assert.equal((await read(failure)).status, 'fail');
const finalization = await read(`${work}/d018-n64-native-finalization.json`);
for (const item of finalization.outputs) await verify(item.path, item.sha256);
const protectedFigures = [];
for (const id of ['fig-108', 'fig-109']) {
  for (const name of await fs.readdir(`${book}/editions/modern-us-neutral/figures`)) {
    if (name.startsWith(`${id}.`)) protectedFigures.push(await bind(`${book}/editions/modern-us-neutral/figures/${name}`));
  }
}
const command = [
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'render',
  '--book', '9p', '--edition', 'modern-us-neutral', '--lesson', 'phy9-c2-s2-n64',
];
const output = execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', command, { encoding: 'utf8' });
process.stdout.write(output);
const reused = original.results.filter(item => item.surface === 'exercises');
assert.equal(reused.length, 2);
for (const item of reused) {
  await verify(item.sourceHtml.path, item.sourceHtml.sha256);
  await verify(item.screenshot, item.screenshotSha256);
}
for (const item of protectedFigures) await verify(item.path, item.sha256);
for (const item of finalization.outputs) await verify(item.path, item.sha256);
const originalChecker = `${work}/offline-d018-check.mjs`;
const checker = `${work}/offline-d018-font-correction-check.mjs`;
assert.ok(!await exists(checker));
const source = await fs.readFile(originalChecker, 'utf8');
assert.equal(source.split('tmp/offline-d018').length, 2);
await fs.writeFile(checker, source.replace('tmp/offline-d018', 'tmp/offline-d018-font-correction'), { flag: 'wx' });
await fs.writeFile(`${folder}/checkpoint-phy9-c2-s2-n64.json`, `${JSON.stringify({
  status: 'incomplete', results: reused,
  initialCheckpoint: await bind(initial), initialPixelFailure: await bind(failure),
  scope: 'Only text desktop/mobile affected by confirmed vector glyph embedding defect. Two byte-identical empty exercise surfaces retained.',
}, null, 2)}\n`, { flag: 'wx' });
await fs.writeFile(`${work}/d018-vector-font-tool-correction.json`, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D018', finding: 'n64-F1',
  status: 'implemented-awaiting-affected-display-check',
  originalInputs: await bind(`${work}/d018-vector-font-before/aliases.json`),
  initialCheckpoint: await bind(initial), initialPixelFailure: await bind(failure),
  diagnosis: await bind(`${work}/d018-n64-vector-font-diagnosis/diagnosis.json`),
  implementation: await Promise.all(['htmlfrag.js', 'render_lesson.js', 'publish.mjs', 'vector_font.test.cjs']
    .map(name => bind(`.claude/skills/ld-s10y-lesson/tools/${name}`))),
  focusedTests: { command: 'node --test .claude/skills/ld-s10y-lesson/tools/vector_font.test.cjs', passed: 3, failed: 0 },
  originalSvgSpecsNativeMetadataAndLessonBytesUnchanged: protectedFigures,
  targetedRender: { command, output }, effectiveChecker: await bind(checker),
  repeatedSCIOrSourceOrIndependentFigureGate: false, additionalFigureAuthorRepairs: 0,
  productionWrites: 0, fullProjectChecks: 0,
}, null, 2)}\n`, { flag: 'wx' });
console.log(checker);

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { ticket, book, indexPath, collections, read, bind, verify, hash, exists, immutableWrite } from './retain-d016-evidence.mjs';
import { inputsPath, retentionManifest } from './retain-d020-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const output = `${ticket}/tmp/d020-staging-boundary.json`;
assert.ok(!await exists(output));
const git = args => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
assert.equal(git(['branch', '--show-current']).trim(), 'codex/STEMROBIN-181-textbooks');
assert.equal(git(['rev-list', '--left-right', '--count', 'HEAD...origin/codex/STEMROBIN-181-textbooks']).trim(), '0\t0');
const input = await read(inputsPath);
const retained = await read(retentionManifest);
const reboundPath = `${ticket}/evidence/reports/d020-durable-path-binding.json`;
const finalizationPath = `${ticket}/evidence/reports/d020-finalization-binding.json`;
const finalization = await read(finalizationPath);
assert.equal(input.final, true);
assert.equal(finalization.status, 'pass');
assert.deepEqual(input.cards.map(card => card.id).sort(), [72, 79, 81].map(n => `phy9-c2-s2-n${n}`));
assert.deepEqual(retained.scope.slice().sort(), input.cards.map(card => card.id).sort());
const index = await read(indexPath);
const evidenceRows = collections.flatMap(key => index[key]);
const allowed = new Set([
  indexPath, `${ticket}/production-meter.json`, `${book}/book.json`,
  `${book}/editions/modern-us-neutral/book.json`, retentionManifest, reboundPath, finalizationPath,
  '.agents/skills/ld-s10y-choice/SKILL.md', '.agents/skills/ld-s10y-image/SKILL.md',
  '.claude/skills/ld-s10y-lesson/SKILL.md', '.claude/skills/ld-s10y-lesson/tools/assemble.py',
]);
for (const row of evidenceRows.filter(row => row.batch === 'D-020')) {
  assert.ok(row.path.startsWith(`${ticket}/evidence/`));
  await verify(row.path, row.sha256);
  allowed.add(row.path);
}
const sourcePages = new Set(input.sourceTraces.flatMap(trace => trace.pages));
for (const page of sourcePages) {
  const folder = `${book}/pages/${String(page).padStart(4, '0')}`;
  for (const name of ['page.md', 'page.json', 'audit.json']) allowed.add(`${folder}/${name}`);
  for (const figure of (await read(`${folder}/page.json`)).meta.figures) {
    for (const extension of ['png', 'svg']) allowed.add(`${book}/figures/${figure.id}.${extension}`);
  }
}
for (const card of (await read(`${book}/book.json`)).lessons) {
  const lesson = await read(`${book}/lessons/${card.id}/lesson.json`);
  const affected = card.id === 'phy9-c2-s2-n75' || lesson.prose.some(block =>
    block.source_refs.some(ref => sourcePages.has(Number(/^p(\d+)#/.exec(ref)[1]))));
  if (!affected) continue;
  for (const name of ['lesson.json', 'lesson.md', 'exercises.json']) {
    allowed.add(`${book}/lessons/${card.id}/${name}`);
  }
}
const modern = `${book}/editions/modern-us-neutral`;
const figureIds = new Set();
for (const card of input.cards) {
  for (const name of ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']) {
    allowed.add(`${modern}/lessons/${card.id}/${name}`);
  }
  for (const figure of (await read(`${modern}/lessons/${card.id}/figures.json`)).figures) figureIds.add(figure.id);
}
for (const id of figureIds) for (const suffix of [
  'svg', 'spec.json', 'render.json', 'independent-review.json', 'review.json',
]) allowed.add(`${modern}/figures/${id}.${suffix}`);
const priorStaged = git(['diff', '--cached', '--name-only', '-z']).split('\0').filter(Boolean);
for (const file of priorStaged) {
  assert.ok(file.startsWith(`${ticket}/evidence/author-history/d019/raw/`),
    `Preserve unrelated staged work: ${file}`);
  const row = evidenceRows.find(row => row.path === file);
  assert.ok(row, `Missing prior exact alias: ${file}`);
  assert.equal(hash(git(['show', `:${file}`])), row.sha256);
}
const changed = new Set([
  ...git(['diff', '--name-only', '-z', 'HEAD']).split('\0'),
  ...git(['ls-files', '--others', '--exclude-standard', '-z']).split('\0'),
].filter(Boolean));
const files = [...allowed].filter(file => changed.has(file)).sort();
assert.ok(files.length);
assert.ok(!files.some(file => /(^|\/)\.env(?:$|\.)/.test(file) || file.includes('/tmp/') || file.startsWith('.tmp/')));
const bindings = await Promise.all(files.map(bind));
git(['add', '--', ...files]);
const staged = git(['diff', '--cached', '--name-only', '-z']).split('\0').filter(Boolean);
assert.deepEqual(staged.slice().sort(), [...new Set([...files, ...priorStaged])].sort());
await immutableWrite(output, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D020', branch: git(['branch', '--show-current']).trim(),
  parent: git(['rev-parse', 'HEAD']).trim(), priorStaged, files: bindings,
  cards: input.cards.map(card => card.id), sourcePages: [...sourcePages].sort((a, b) => a - b),
  finalization: await bind(finalizationPath), status: 'exact-owned-files-staged',
  commitOrPushPerformed: false, gatesRepeated: false,
}, null, 2)}\n`);
console.log(JSON.stringify({ newlyStaged: files.length, preservedPriorAliases: priorStaged.length }));

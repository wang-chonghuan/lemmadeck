import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import {
  ticket, book, indexPath, collections, read, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const receipt = `${ticket}/tmp/d022-staging-boundary.json`;
assert.ok(!await exists(receipt));
const git = args => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
assert.equal(git(['branch', '--show-current']).trim(), 'codex/STEMROBIN-181-textbooks');
assert.equal(git(['diff', '--cached', '--name-only']).trim(), '', 'Preserve unexpected staged work.');
const finalizationPath = `${ticket}/evidence/reports/d022-finalization-binding.json`;
const finalization = await read(finalizationPath);
assert.equal(finalization.status, 'pass');
const allowed = new Set([
  indexPath, `${ticket}/production-meter.json`, `${book}/book.json`,
  `${book}/editions/modern-us-neutral/book.json`,
  `${ticket}/evidence/reports/d021-index-commit-repair.json`,
]);
const index = await read(indexPath);
for (const row of collections.flatMap(name => index[name]).filter(row => row.batch === 'D-022')) {
  await verify(row.path, row.sha256);
  allowed.add(row.path);
}
const sourcePages = new Set(finalization.sourcePages);
for (const page of sourcePages) {
  const folder = `${book}/pages/${String(page).padStart(4, '0')}`;
  for (const name of ['page.md', 'page.json', 'audit.json']) allowed.add(`${folder}/${name}`);
  for (const figure of (await read(`${folder}/page.json`)).meta.figures) {
    for (const extension of ['png', 'svg']) allowed.add(`${book}/figures/${figure.id}.${extension}`);
  }
}
for (const entry of (await read(`${book}/book.json`)).lessons) {
  const lesson = await read(`${book}/lessons/${entry.id}/lesson.json`);
  if (!lesson.prose.some(block => (block.source_refs ?? []).some(ref =>
    sourcePages.has(Number(/^p(\d+)#/.exec(ref)?.[1]))))) continue;
  for (const name of ['lesson.json', 'lesson.md', 'exercises.json']) {
    allowed.add(`${book}/lessons/${entry.id}/${name}`);
  }
}
const modern = `${book}/editions/modern-us-neutral`;
for (const record of finalization.cards) {
  for (const name of ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']) {
    allowed.add(`${modern}/lessons/${record.card}/${name}`);
  }
}
for (const id of finalization.figures) for (const suffix of [
  'svg', 'spec.json', 'render.json', 'independent-review.json', 'review.json',
]) allowed.add(`${modern}/figures/${id}.${suffix}`);
const changed = new Set([
  ...git(['diff', '--name-only', '-z', 'HEAD']).split('\0'),
  ...git(['ls-files', '--others', '--exclude-standard', '-z']).split('\0'),
].filter(Boolean));
const files = [...allowed].filter(file => changed.has(file)).sort();
assert.ok(files.length);
assert.ok(files.includes(`${book}/book.json`) && files.includes(`${modern}/book.json`));
assert.ok(!files.some(file => /(^|\/)\.env(?:$|\.)/.test(file) || file.includes('/tmp/') ||
  file.startsWith('.tmp/') || file.startsWith('app/') || file.includes('/10p/')));
const bindings = await Promise.all(files.map(bind));
git(['add', '--', ...files]);
assert.deepEqual(git(['diff', '--cached', '--name-only', '-z']).split('\0').filter(Boolean).sort(), files);
await immutableWrite(receipt, `${JSON.stringify({
  batch: 'D022', status: 'exact-owned-files-staged',
  parent: git(['rev-parse', 'HEAD']).trim(), cards: finalization.cards.map(row => row.card),
  files: bindings, sourcePages: [...sourcePages], bothIndicesExplicit: true,
  excludedDirty: '10pn5/index,9pt4/fig101-102,D018n65 candidate history,.env',
}, null, 2)}\n`);
console.log(JSON.stringify({ staged: files.length, bothIndicesExplicit: true }));

import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/evidence/reports/d1816-d306-delivery`;
const git = (args, input) => execFileSync('git', args,
  { encoding: 'utf8', input, maxBuffer: 32 * 1024 * 1024 }).trim();
const read = file => JSON.parse(fs.readFileSync(file));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length, sha256: hash(bytes) };
};
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(row =>
  row.isSymbolicLink() ? [] : row.isDirectory()
    ? walk(`${dir}/${row.name}`) : [`${dir}/${row.name}`]);
const stageBlob = (file, text) => {
  const oid = git(['hash-object', '-w', '--stdin'], text);
  git(['update-index', '--cacheinfo', `100644,${oid},${file}`]);
  return { path: file, oid, sha256: hash(text) };
};
const parent = git(['rev-parse', 'HEAD']);
assert.equal(git(['rev-parse', 'origin/codex/STEMROBIN-181-textbooks']), parent);
assert.equal(git(['diff', '--cached', '--name-only']), '');
const ready = read(`${O}/batch-ready.json`);
assert.equal(ready.status, 'complete-retained-unbatched');
for (const row of [...ready.productBindings, ...ready.sourceProductBindings])
  assert.equal(bind(row.path).sha256, row.sha256, row.path);
const lessonTools = '.claude/skills/ld-s10y-lesson';
const sourceBook = 'ssot-resources/soviet10year-textbooks/artifacts/10p/book.json';
const workingBookBytes = fs.readFileSync(sourceBook);
const workingBook = JSON.parse(workingBookBytes);
const headBook = JSON.parse(git(['show', `HEAD:${sourceBook}`]));
const newIds = new Set(ready.cards.slice(0, 2));
const scopedBook = structuredClone(headBook);
scopedBook.pages = headBook.pages + ready.counts.newSourcePages;
const oldRows = new Map(headBook.lessons.map(row => [row.id, row]));
scopedBook.lessons = workingBook.lessons.filter(row => oldRows.has(row.id) || newIds.has(row.id))
  .map(row => oldRows.get(row.id) ?? row);
assert.equal(scopedBook.pages, 210);
assert.equal(workingBook.pages, 212);
assert.equal(scopedBook.lessons.length, headBook.lessons.length + 2);
assert.deepEqual(scopedBook.lessons.find(row => row.id.endsWith('-n23')),
  headBook.lessons.find(row => row.id.endsWith('-n23')));
const layoutFile = `${lessonTools}/tools/layout.py`;
const workingLayout = fs.readFileSync(layoutFile, 'utf8');
let scopedLayout = git(['show', `HEAD:${layoutFile}`]) + '\n';
const helperStart = workingLayout.indexOf('def _separate_caption_rows(');
const helperEnd = workingLayout.indexOf('def _fraction_denominator(', helperStart);
assert(helperStart >= 0 && helperEnd > helperStart);
const helper = workingLayout.slice(helperStart, helperEnd);
assert(!scopedLayout.includes('def _separate_caption_rows('));
scopedLayout = scopedLayout.replace('def _fraction_denominator(',
  `${helper}def _fraction_denominator(`);
const guard = [
  '                a - prev_b <= merge_gap and not separate_tall_rows',
  '                and not _small_prose_continuation(',
  '                    ink, prev_a, prev_b, a, b, glyph_h',
  '                )',
].join('\n');
assert.equal(scopedLayout.split(guard).length, 2);
const withGuard = `${guard}\n                and not _separate_caption_rows(\n`
  + '                    ink, prev_a, prev_b, a, b, glyph_h\n                )';
assert(workingLayout.includes(withGuard));
scopedLayout = scopedLayout.replace(guard, withGuard);
const scope = [...new Set([
  ...ready.productBindings.map(row => row.path),
  ...ready.sourceProductBindings.map(row => row.path), ...walk(O),
  `${T}/evidence/reports/d1816-d259-delivery/actual-push.json`,
  `${T}/production-meter.json`, `${T}/evidence/index.json`,
  `${lessonTools}/tools/edition.py`, `${lessonTools}/tools/htmlfrag.js`,
  ...['test_adjacent_caption_rows.py', 'test_caption_owner_across_prose.mjs',
    'test_english_table_label.py', 'test_explicit_prose_paragraphs.py']
    .map(file => `${lessonTools}/tests/${file}`),
])];
for (const file of scope) {
  assert(!/(^|\/)\.env(?:\/|$)/.test(file), file);
  assert(!/\/pages\/(?:0063|0064|0067|0187|0307)\//.test(file), file);
  assert(!file.includes('/lessons/phy10-c1-s3-n23/'), file);
  assert(!file.startsWith('.tmp/'), file);
  const bytes = fs.readFileSync(file);
  if (!bytes.includes(0)) {
    const text = bytes.toString('utf8');
    assert(!/postgres(?:ql)?:\/\/[^/\s]+:[^@\s]+@|\bsk-[A-Za-z0-9_-]{24,}|\bgh[pousr]_[A-Za-z0-9]{30,}|-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----/.test(text),
      `Potential credential in ${file}`);
  }
}
git(['add', '--', ...scope]);
const scoped = [
  stageBlob(sourceBook, JSON.stringify(scopedBook, null, 2) + '\n'),
  stageBlob(layoutFile, scopedLayout),
];
assert.equal(hash(fs.readFileSync(sourceBook)), hash(workingBookBytes));
assert.equal(fs.readFileSync(layoutFile, 'utf8'), workingLayout);
const staged = git(['diff', '--cached', '--name-only']).split('\n').filter(Boolean);
const allowed = new Set([...scope, sourceBook, layoutFile]);
assert(staged.every(file => allowed.has(file)));
git(['diff', '--cached', '--check']);
const scopeFile = `${T}/tmp/d1816-recovery/d306-staged-scope.json`;
fs.writeFileSync(scopeFile, JSON.stringify({
  batch: 'D306', parent, cards: ready.cards, staged, scoped,
  completeDeliveredBefore: 139, completeUnbatched: ready.cards,
  sourceBookStagedPages: 210, sourceBookWorkingPages: 212,
  excludedN23AndUnrelatedSourceEdits: true,
  excludedRadicalAndSeparatorLayoutEdits: true,
  credentialsScan: 'pass', originalFailuresPreserved: true,
  wholeProjectChecks: false, formalHandoff: false, databaseWrites: false,
  commit: false, push: false,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ stagedScope: bind(scopeFile),
  stagedFiles: staged.length, scoped, parent, completeDeliveredBefore: 139 }));

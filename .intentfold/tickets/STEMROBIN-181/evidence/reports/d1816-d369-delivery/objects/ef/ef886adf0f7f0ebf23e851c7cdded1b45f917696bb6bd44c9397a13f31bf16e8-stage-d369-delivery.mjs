import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/evidence/reports/d1816-d369-delivery`;
const git = (args, input) => execFileSync('git', args,
  { cwd: repo, encoding: 'utf8', input, maxBuffer: 32 * 1024 * 1024 }).trim();
const read = file => JSON.parse(fs.readFileSync(file));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length, sha256: hash(bytes) };
};
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(row =>
  row.isSymbolicLink() ? [] : row.isDirectory() ? walk(`${dir}/${row.name}`) : [`${dir}/${row.name}`]);
const parent = git(['rev-parse', 'HEAD']);
assert.equal(parent, '2d4441287b3a16d6704678add4a84bd18ccbee53');
assert.equal(git(['rev-parse', 'origin/codex/STEMROBIN-181-textbooks']), parent);
assert.equal(git(['diff', '--cached', '--name-only']), '');
const ready = read(`${O}/batch-ready.json`);
assert.equal(ready.status, 'complete-retained-unbatched');
assert.deepEqual(ready.cards, ['phy10-c3-s4-n149', 'phy10-c4-s1']);
for (const row of [...ready.productBindings, ...ready.sourceProductBindings])
  assert.equal(bind(row.path).sha256, row.sha256, row.path);
const bookFile = 'ssot-resources/soviet10year-textbooks/artifacts/10p/book.json';
const workingBytes = fs.readFileSync(bookFile);
const working = JSON.parse(workingBytes);
const head = JSON.parse(git(['show', `HEAD:${bookFile}`]));
const newIds = new Set(ready.cards);
const oldRows = new Map(head.lessons.map(row => [row.id, row]));
const scoped = structuredClone(head);
scoped.pages = head.pages + ready.counts.newIndexedSourcePages;
scoped.lessons = working.lessons.filter(row => oldRows.has(row.id) || newIds.has(row.id))
  .map(row => oldRows.get(row.id) ?? row);
assert.equal(scoped.pages, 220);
assert.equal(working.pages, 222);
assert.equal(scoped.lessons.length, head.lessons.length + 2);
assert.deepEqual(scoped.lessons.find(row => row.id.endsWith('-n23')),
  head.lessons.find(row => row.id.endsWith('-n23')));
const lessonTools = '.claude/skills/ld-s10y-lesson';
const scope = [...new Set([
  ...ready.productBindings.map(row => row.path),
  ...ready.sourceProductBindings.map(row => row.path), ...walk(O),
  `${T}/evidence/reports/d1816-d306-delivery/actual-push.json`,
  `${T}/production-meter.json`, `${T}/evidence/index.json`,
  `${lessonTools}/tools/edition.py`,
  `${lessonTools}/tools/render_lesson.js`,
  `${lessonTools}/references/edition-text-contract.md`,
  `${lessonTools}/tests/test_english_lesson_headings.py`,
  `${lessonTools}/tests/test_render_lesson.py`,
  '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
  '.agents/skills/ld-s10y-image/tests/test_render_spec.py',
])];
for (const file of scope) {
  assert(!/(^|\/)\.env(?:\/|$)/.test(file), file);
  assert(!/\/pages\/(?:0063|0064|0067|0187|0307)\//.test(file), file);
  assert(!file.includes('/lessons/phy10-c1-s3-n23/'), file);
  assert(!file.startsWith('.tmp/'), file);
  const bytes = fs.readFileSync(file);
  if (!bytes.includes(0)) assert(!/postgres(?:ql)?:\/\/[^/\s]+:[^@\s]+@|\bsk-[A-Za-z0-9_-]{24,}|\bgh[pousr]_[A-Za-z0-9]{30,}|-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----/.test(bytes.toString('utf8')),
    `Potential credential in ${file}`);
}
git(['add', '--', ...scope]);
const text = JSON.stringify(scoped, null, 2) + '\n';
const oid = git(['hash-object', '-w', '--stdin'], text);
git(['update-index', '--cacheinfo', `100644,${oid},${bookFile}`]);
assert.equal(hash(fs.readFileSync(bookFile)), hash(workingBytes));
const staged = git(['diff', '--cached', '--name-only']).split('\n').filter(Boolean);
const allowed = new Set([...scope, bookFile]);
assert(staged.every(file => allowed.has(file)));
git(['diff', '--cached', '--check']);
const resultFile = `${T}/tmp/d1816-recovery/d369-staged-scope.json`;
fs.writeFileSync(resultFile, JSON.stringify({
  batch: 'D369', parent, cards: ready.cards, staged,
  scoped: { path: bookFile, oid, sha256: hash(text) },
  sourceBookStagedPages: scoped.pages, sourceBookWorkingPages: working.pages,
  newIndexedPages: 10, newSourceCounterApprovals: 5,
  excludedN23AndUnrelatedSourceAndToolEdits: true, credentialsScan: 'pass',
  originalFailuresPreserved: true, wholeProjectChecks: false, formalHandoff: false,
  databaseWrites: false, commit: false, push: false,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ stagedScope: bind(resultFile), stagedFiles: staged.length, parent }));

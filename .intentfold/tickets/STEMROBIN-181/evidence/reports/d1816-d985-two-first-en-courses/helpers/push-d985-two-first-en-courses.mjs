import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const base = '61f1ceb3dba62711aff2cf86a44405e8fffe6ec9';
const branch = 'codex/STEMROBIN-181-textbooks';
const out = `${ticket}/evidence/reports/d1816-d985-two-first-en-courses`;
const scratch = `${ticket}/tmp/d1816-d985-delivery`;
fs.mkdirSync(out, { recursive: false });
fs.mkdirSync(scratch, { recursive: false });
const cards = ['phy9-c2-s2-n74', 'phy9-c2-s2-n79'];
const readyFiles = [
  `${ticket}/evidence/reports/d1816-d978-n74-first-complete-en/batch-ready.json`,
  `${ticket}/evidence/reports/d1816-d984-n79-first-complete-en/batch-ready.json`,
];
for (const file of readyFiles) {
  const ready = read(file);
  assert.equal(ready.newCompleteCourses, 0);
  assert.equal(ready.newSourcePages, 0);
  for (const product of ready.products.filter(product => product.path.includes('/lessons/')))
    assert.equal(bind(product.path).sha256, product.sha256);
}
const book = `${repo}/ssot-resources/soviet10year-textbooks/artifacts/9p`;
const indexFile = `${book}/editions/modern-us-neutral-en/book.json`;
const before = read(`${ticket}/evidence/reports/d1816-d978-n74-first-complete-en/before.english-book.json`);
const after = read(indexFile);
assert.deepEqual(after.lessons.filter(row => !cards.includes(row.id)), before.lessons);
assert.deepEqual({ ...after, lessons: [] }, { ...before, lessons: [] });
assert(cards.every(card => after.lessons.filter(row => row.id === card).length === 1));
const previous = `${ticket}/evidence/reports/d1816-d968-n71-substantive-local-stages/actual-push.json`;
assert.equal(read(previous).head, base);
const reviewerClose = `${ticket}/tmp/d1816-d984-reviewer-closed.json`;
assert.equal(read(reviewerClose).closed, true);
assert.equal(read(reviewerClose).actualImages, 13);
copy(reviewerClose, `${out}/reviewer-closed.original.json`);
copy(`${ticket}/tmp/d1816-d983-n97-history-gap/inventory-gap.json`,
  `${out}/n97-historical-binding-gap.original.json`);
const helperFiles = [
  'n42-native.mjs', 'record-d969-d968-actual-push.mjs',
  'prepare-d965-n74-missing-en.mjs', 'author-d966-n74-missing-en.mjs',
  'normalize-d966-n74-missing-en.py', 'correct-d970-n74-two-text-findings.py',
  'finalize-d971-n74-first-en.mjs', 'reconcile-d973-n74-source-section.py',
  'recover-d974-n74-first-en-native.mjs', 'display-d972-n74-first-en-full-course.mjs',
  'retain-d978-n74-first-complete-en.mjs', 'prepare-d975-n79-first-missing-en.mjs',
  'author-d976-n79-first-missing-en.py', 'finalize-d979-n79-first-en.mjs',
  'retain-d984-n79-first-complete-en.mjs', 'update-edition-index.py',
  'prepare-d981-n97-first-missing-en.mjs', 'record-d983-n97-history-gap.mjs',
  'push-d985-two-first-en-courses.mjs',
];
for (const name of helperFiles)
  copy(`${ticket}/tmp/d1816-recovery/${name}`, `${out}/helpers/${name}`);
save(`${out}/batch-ready.json`, {
  task: 'D985', base, branch, cards, ready: readyFiles.map(bind),
  previousPushReceipt: bind(previous), nativeIndex: bind(indexFile),
  originalObjects: 34, originalTasks: 0, originalFigures: 0,
  actualIndependentImages: 13, batches: [7, 6], parentNewImages: 0,
  newCompleteCourses: 0, newSourcePages: 0, totals: { completeCourses: 153, sourcePages: 581 },
  reviewerClosed: bind(`${out}/reviewer-closed.original.json`),
  firstFailuresAndReviewerMetadataCorrectionPreserved: true,
  suppliedViewLimitsPreserved: true, allOriginalZhSourceAndOtherEnglishRowsUnchanged: true,
  noSkillOrUnrelatedDirtyBytes: true, force: false,
  databaseWrites: 0, paidCalls: 0, formalHandoff: false, scopeCompleted: false,
  continuousProduction: true,
});
const meterFile = `${ticket}/production-meter.json`;
copy(meterFile, `${scratch}/production-meter.before.json`);
copy(`${ticket}/review.md`, `${scratch}/review.before.md`);
const meter = read(meterFile);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 153);
assert.equal(meter.sourcePagesFinalized, 581);
meter.currentResume1816.D985 = {
  status: 'TWO_FIRST_COMPLETE_EN_EDITIONS_READY_FOR_ORDINARY_PUSH',
  ready: bind(`${out}/batch-ready.json`), newCompleteCourses: 0, newSourcePages: 0,
};
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
fs.appendFileSync(`${ticket}/review.md`,
  '\nD985: Ordinary explicit-manifest substantive delivery of first complete N74/N79 English editions,34 original objects/0tasks/0figures, native source identity/math/layout/index bindings and13bounded supplied pixel observations. Original revisions/native metadata failure/reviewer correction/launcher failure and N97 missing-history inventory retained; previous D968actualpushreceipt joins this substantive batch only. Both courses already counted; totals153/581 unchanged. One independent reviewer closed13/24, parent0opens, no fullresolution allglyph claim. After ordinary delivery continue missing authorized stages; no force/skill/unrelateddirtybytes/DB/paid/broadtest/merge/deploy/formalhandoff.\n');
const files = new Set();
function collect(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    assert(!entry.isSymbolicLink());
    if (entry.isDirectory()) collect(file);
    else {
      assert(entry.isFile());
      files.add(path.relative(repo, file));
    }
  }
}
for (const directory of [
  `${ticket}/evidence/reports/d1816-d978-n74-first-complete-en`,
  `${ticket}/evidence/reports/d1816-d984-n79-first-complete-en`, out,
  ...cards.map(card => `${book}/editions/modern-us-neutral-en/lessons/${card}`),
]) collect(directory);
for (const file of [previous, indexFile, meterFile, `${ticket}/review.md`])
  files.add(path.relative(repo, file));
const list = [...files].sort();
assert(list.every(file => !/(^|\/)\.env($|\/)|\/skills\/|\/tmp\//.test(file)));
save(`${scratch}/manifest.json`, list);
const gitRead = args => {
  const result = spawnSync('git', args, { cwd: repo, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
};
assert.equal(gitRead(['rev-parse', 'HEAD']), base);
assert.equal(gitRead(['diff', '--cached', '--name-only']), '');
run('d985-sync-existing-delivery-branch', ['git', 'fetch', 'origin', branch]);
assert.equal(gitRead(['rev-parse', 'FETCH_HEAD']), base);
const pathspec = `${scratch}/delivery.pathspec`;
fs.writeFileSync(pathspec, list.join('\0') + '\0', { flag: 'wx' });
run('d985-stage-exact-manifest', ['git', 'add', '--pathspec-from-file', pathspec, '--pathspec-file-nul']);
const staged = gitRead(['diff', '--cached', '--name-only']).split('\n').filter(Boolean);
assert(staged.length && staged.every(file => list.includes(file)));
assert(staged.every(file => !/(^|\/)\.env($|\/)|\/skills\/|\/tmp\//.test(file)));
run('d985-ordinary-substantive-commit', [
  'git', 'commit', '-m', 'STEMROBIN-181: complete first N74 and N79 English editions offline',
]);
const head = gitRead(['rev-parse', 'HEAD']);
save(`${scratch}/committed.json`, { task: 'D985', base, head, branch, files: staged.length });
run('d985-explicit-ordinary-push', ['git', 'push', 'origin', `HEAD:${branch}`]);
save(`${scratch}/push-exited.json`, {
  task: 'D985', head, branch, files: staged.length, force: false, exitCode: 0,
  independentRemoteVerificationPending: true,
});
console.log(JSON.stringify({ head, files: staged.length, independentRemoteVerificationPending: true }));

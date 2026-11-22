import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const task = 'D1214', tag = task.toLowerCase(), branch = 'codex/STEMROBIN-181-textbooks';
const previous = `${ticket}/evidence/reports/d1816-d1190-two-first-en-courses/actual-push.json`;
const base = read(previous).head;
const edition = `${repo}/ssot-resources/soviet10year-textbooks/artifacts/10p/editions/modern-us-neutral-en`;
const batchPaths = [
  'd1816-d1201-introduction-first-complete-en',
  'd1816-d1213-n1-first-complete-en',
  'd1816-d1212-n4-first-complete-en',
].map(name => `${ticket}/evidence/reports/${name}/batch-ready.json`);
const ready = batchPaths.map(read), cards = ready.flatMap(item => item.cards);
const gitRead = args => {
  const result = spawnSync('git', args, { cwd: repo, encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
};
assert.equal(gitRead(['rev-parse', 'HEAD']), base);
assert.equal(gitRead(['diff', '--cached', '--name-only']), '');
for (const item of ready) {
  assert.equal(item.newCompleteCourses, 0);
  assert.equal(item.newSourcePages, 0);
  assert.equal(read(item.pixelReview.path).status, 'PASS');
  for (const file of [item.pixelReview, item.imageLedger,
    ...item.products.filter(product => !product.path.endsWith('/book.json'))])
    assert.equal(bind(file.path).sha256, file.sha256);
}
const indexFile = `${edition}/book.json`;
const before = JSON.parse(gitRead(['show', `${base}:${path.relative(repo, indexFile)}`])), after = read(indexFile);
assert.deepEqual(after.lessons.filter(row => !cards.includes(row.id)), before.lessons);
assert.deepEqual({ ...after, lessons: [] }, { ...before, lessons: [] });
assert(cards.every(card => after.lessons.filter(row => row.id === card).length === 1));
const out = `${ticket}/evidence/reports/d1816-d1214-three-early-10p-en`;
const scratch = `${ticket}/tmp/d1816-d1214-delivery`;
fs.mkdirSync(out, { recursive: false });
fs.mkdirSync(scratch, { recursive: false });
copy(`${ticket}/tmp/d1816-recovery/d1213-display-helper-recovery.json`,
  `${out}/n1-retention-helper-recovery.original.json`);
const previousCall = read(read(previous).nativeReceipt.path);
copy(read(previous).nativeReceipt.path, `${out}/previous-push/receipt.original.json`);
for (const [key, file] of Object.entries(previousCall.streams))
  copy(file.path, `${out}/previous-push/${key}.original.txt`);
for (const name of [
  'n42-native.mjs', 'intro-first-en.mjs', 'display-d1200-introduction-first-en.mjs',
  'retain-d1201-introduction-first-en.mjs', 'prepare-author-d1202-early-oscillators-en.mjs',
  'finalize-d997-n72-first-en.mjs', 'display-d998-n72-first-en-full-course.mjs',
  'display-d1205-n4-first-failed-original.mjs',
  'bind-d1015-n73-original-svg-display-widths.mjs', 'retain-d1000-n72-first-complete-en.mjs',
  'validate-d1000-n72-retained-tuples.py', 'update-edition-index.py',
  'record-ordinary-en-extension-push.mjs', 'push-d1214-three-early-10p-en.mjs',
]) copy(`${ticket}/tmp/d1816-recovery/${name}`, `${out}/helpers/${name}`);
const imageLedgers = ready.map(item => bind(item.imageLedger.path));
save(`${out}/batch-ready.json`, {
  task, base, branch, cards, ready: batchPaths.map(bind), previousPushReceipt: bind(previous),
  nativeIndex: bind(indexFile), originalObjects: 26, englishParagraphs: 35,
  originalTasks: 0, originalFigures: 3, imageLedgers,
  newCompleteCourses: 0, newSourcePages: 0, totals: { completeCourses: 153, sourcePages: 581 },
  firstEnglishScientificFidelityAndReadabilityReviews: true,
  historicalScienceApprovalInvented: false,
  introductionGradeDigitNativeFailureAndWordRecoveryPreserved: true,
  n4FirstSharedFigureLabelExpectationFailureAndAffectedDisplayRecoveryPreserved: true,
  unchangedSourceChineseAndSvgGeometryReused: true,
  existingFigureRendererCalls: 0, browserMode: 'isolated-headless',
  headedAcceptanceClaimed: false, fullResolutionAllGlyphCertification: false,
  completeEnglishAccessibilityApproval: false,
  force: false, databaseWrites: 0, paidCalls: 0, inputTokens: null, outputTokens: null, costUsd: null,
  formalHandoff: false, scopeCompleted: false, continuousProduction: true,
});
const meterFile = `${ticket}/production-meter.json`, reviewFile = `${ticket}/review.md`;
copy(meterFile, `${scratch}/production-meter.before.json`);
copy(reviewFile, `${scratch}/review.before.md`);
const meter = read(meterFile);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 153);
assert.equal(meter.sourcePagesFinalized, 581);
for (const [i, item] of ready.entries()) meter.currentResume1816[item.task] = {
  status: 'FIRST_COMPLETE_EN_EDITION_CANONICAL_RETAINED_READY',
  ready: bind(batchPaths[i]), newCompleteCourses: 0, newSourcePages: 0,
};
meter.currentResume1816.D1214 = {
  status: 'THREE_EARLY_10P_EN_EDITIONS_READY_FOR_ORDINARY_PUSH',
  ready: bind(`${out}/batch-ready.json`), newCompleteCourses: 0, newSourcePages: 0,
};
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
fs.appendFileSync(reviewFile,
  '\nD1196-D1214: 10p introduction/N1/N4 first complete English editions retained: 26 original objects, 35 final English paragraphs, zero tasks, three unchanged approved SVGs. Exact D002/D003 source/Chinese/native/figure evidence reused; no historical introduction/N1/N4 science approval invented. First English scientific fidelity/readability reviews genuinely assess model-limited mechanical/electromagnetic analogy, free/driven oscillations and damping, signed restoring-force equations and zero acceleration vs velocity. Introduction first grade-digit native failure and English-word recovery retained. N4 source raw figure list is empty but its approved shared fig03 attachment is explicitly preserved; only its own shared-context row translated, other lesson contexts unchanged. First native finalize/render and isolated headless desktop1440x960/mobile390x844 DOM plus independent saved-pixel reviews passed. Existing source/SVG geometry never rerendered; actual media-width bindings retained. Canonical/index exact native bindings passed; all raw/Chinese/otherEnglish rows/header unchanged. Totals153/581 unchanged. No receipt-onlycommit/unrelateddirty/skill/broadtests/DB/paid/force/merge/deploy/formalhandoff/scopecompletion; all genuine source/figure/paid HOLDs and headed/allglyph/accessibility limitations remain.\n');
const files = new Set();
function collect(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    assert(!entry.isSymbolicLink());
    if (entry.isDirectory()) collect(file);
    else { assert(entry.isFile()); files.add(path.relative(repo, file)); }
  }
}
for (const directory of [...batchPaths.map(file => path.dirname(file)), out,
  ...cards.map(card => `${edition}/lessons/${card}`)]) collect(directory);
for (const item of ready) for (const product of item.products) files.add(path.relative(repo, product.path));
for (const file of [previous, indexFile, meterFile, reviewFile]) files.add(path.relative(repo, file));
const list = [...files].sort();
assert(list.every(file => !/(^|\/)\.env($|\/)|\/skills\/|\/tmp\//.test(file)));
save(`${scratch}/manifest.json`, list);
run(`${tag}-sync-existing-delivery-branch`, ['git', 'fetch', 'origin', branch]);
assert.equal(gitRead(['rev-parse', 'FETCH_HEAD']), base);
const pathspec = `${scratch}/delivery.pathspec`;
fs.writeFileSync(pathspec, list.join('\0') + '\0', { flag: 'wx' });
run(`${tag}-stage-exact-manifest`, ['git', 'add', '--pathspec-from-file', pathspec, '--pathspec-file-nul']);
const staged = gitRead(['diff', '--cached', '--name-only']).split('\n').filter(Boolean);
assert(staged.length && staged.every(file => list.includes(file)));
run(`${tag}-ordinary-substantive-commit`, [
  'git', 'commit', '-m', 'STEMROBIN-181: complete introduction, N1 and N4 English editions offline',
]);
const head = gitRead(['rev-parse', 'HEAD']);
save(`${scratch}/committed.json`, { task, base, head, branch, files: staged.length });
run(`${tag}-explicit-ordinary-push`, ['git', 'push', 'origin', `HEAD:refs/heads/${branch}`]);
save(`${scratch}/push-exited.json`, {
  task, head, branch, files: staged.length, force: false, exitCode: 0, independentRemoteVerificationPending: true,
});
console.log(JSON.stringify({ head, files: staged.length, independentRemoteVerificationPending: true }));

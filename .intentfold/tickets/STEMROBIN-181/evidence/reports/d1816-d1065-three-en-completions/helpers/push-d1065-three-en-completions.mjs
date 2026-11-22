import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const base = '3aeeeccb47f7be655c784c1972eb4f6142d2366c';
const branch = 'codex/STEMROBIN-181-textbooks';
const out = `${ticket}/evidence/reports/d1816-d1065-three-en-completions`;
const scratch = `${ticket}/tmp/d1816-d1065-delivery`;
const cards = ['phy9-c2-s6-n130', 'phy9-c2-s2-n61', 'phy9-conclusion'];
const readyFiles = [
  `${ticket}/evidence/reports/d1816-d1053-n130-current-complete-en/batch-ready.json`,
  `${ticket}/evidence/reports/d1816-d1058-n61-first-complete-en/batch-ready.json`,
  `${ticket}/evidence/reports/d1816-d1062-conclusion-current-complete-en/batch-ready.json`,
];
const gitRead = args => {
  const result = spawnSync('git', args, { cwd: repo, encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
};
assert.equal(gitRead(['rev-parse', 'HEAD']), base);
for (const file of readyFiles) {
  const ready = read(file);
  assert.equal(ready.newCompleteCourses, 0);
  assert.equal(ready.newSourcePages, 0);
  for (const product of ready.products.filter(product => !product.path.endsWith('/book.json')))
    assert.equal(bind(product.path).sha256, product.sha256);
}
const book = `${repo}/ssot-resources/soviet10year-textbooks/artifacts/9p`;
const indexFile = `${book}/editions/modern-us-neutral-en/book.json`;
const before = JSON.parse(gitRead(['show', `${base}:${path.relative(repo, indexFile)}`]));
const after = read(indexFile);
assert.deepEqual(after.lessons.filter(row => !cards.includes(row.id)), before.lessons);
assert.deepEqual({ ...after, lessons: [] }, { ...before, lessons: [] });
assert(cards.every(card => after.lessons.filter(row => row.id === card).length === 1));
const previous = `${ticket}/evidence/reports/d1816-d1046-three-first-en-courses/actual-push.json`;
assert.equal(read(previous).head, base);
const reviewerClose = `${ticket}/tmp/d1816-d1062-reviewer-closed.json`;
assert.equal(read(reviewerClose).closed, true);
const actualImages = read(reviewerClose).actualImages;
assert.equal(actualImages, 12);
fs.mkdirSync(out, { recursive: false });
fs.mkdirSync(scratch, { recursive: false });
copy(reviewerClose, `${out}/reviewer-closed.original.json`);
const previousNative = read(previous).nativeReceipt, previousCall = read(previousNative.path);
copy(previousNative.path, `${out}/previous-push/receipt.original.json`);
for (const [key, file] of Object.entries(previousCall.streams)) {
  assert.equal(bind(file.path).sha256, file.sha256);
  copy(file.path, `${out}/previous-push/${key}.original.txt`);
}
for (const name of [
  'n42-native.mjs', 'prepare-d1048-n130-approved-en-metadata.mjs',
  'prepare-d1059-conclusion-approved-en-metadata.mjs', 'correct-d1063-n130-source-chapter-identity.mjs',
  'finalize-d1050-n130-approved-en-metadata.mjs', 'prepare-d1013-n64-first-missing-en.mjs',
  'author-d1055-n61-first-missing-en.mjs', 'finalize-d997-n72-first-en.mjs',
  'display-d998-n72-first-en-full-course.mjs', 'retain-d1000-n72-first-complete-en.mjs',
  'update-edition-index.py', 'record-ordinary-en-extension-push.mjs',
  'push-d1065-three-en-completions.mjs',
]) copy(`${ticket}/tmp/d1816-recovery/${name}`, `${out}/helpers/${name}`);
save(`${out}/batch-ready.json`, {
  task: 'D1065', base, branch, cards, ready: readyFiles.map(bind),
  previousPushReceipt: bind(previous), nativeIndex: bind(indexFile),
  originalObjects: 15, englishParagraphs: 33, originalTasks: 0, originalFigures: 0,
  actualIndependentImages: actualImages, batches: read(reviewerClose).batches, parentNewImages: 0,
  newCompleteCourses: 0, newSourcePages: 0, totals: { completeCourses: 153, sourcePages: 581 },
  reviewerClosed: bind(`${out}/reviewer-closed.original.json`),
  sourceAndAllChineseProductsAndOtherEnglishRowsUnchanged: true,
  n130AndConclusionApprovedEnglishBodyAndSectionBreaksReusedExactly: true,
  n130AndConclusionOnlyAffectedMetadataNativeAndFirstCurrentTitleDisplay: true,
  n61FirstEnglishScienceZhEnNativeAndDisplay: true,
  firstFailuresAndAffectedOnlyCorrectionsPreserved: true,
  browserMode: 'isolated-headless', headedAcceptanceClaimed: false,
  suppliedViewLimitsPreserved: true, fullResolutionAllGlyphCertification: false,
  completeEnglishAccessibilityApproval: false,
  noSkillOrUnrelatedDirtyBytes: true, force: false, databaseWrites: 0, paidCalls: 0,
  formalHandoff: false, scopeCompleted: false, continuousProduction: true,
});
const meterFile = `${ticket}/production-meter.json`;
copy(meterFile, `${scratch}/production-meter.before.json`);
copy(`${ticket}/review.md`, `${scratch}/review.before.md`);
const meter = read(meterFile);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 153);
assert.equal(meter.sourcePagesFinalized, 581);
Object.assign(meter.currentResume1816, {
  D1048: { status: 'N130_APPROVED_EN_BODY_REUSED_METADATA_PREPARE_PASS_DUPLICATE_ALIAS_FAILURE_PRESERVED' },
  D1051: { status: 'N130_CONCLUSION_AFFECTED_METADATA_N61_FIRST_EN_REVIEWS_AND_BOUNDED_PIXELS_PASS',
    actualImages, closed: bind(`${out}/reviewer-closed.original.json`) },
  D1050: { status: 'N130_FIRST_AFFECTED_NATIVE_CHAPTER_IDENTITY_FAILURE_PRESERVED_RENDER_NOT_INVOKED' },
  D1063: { status: 'N130_ONLY_CHAPTER_RESTORED_TO_SOURCE_NULL_AFFECTED_METADATA_PASS' },
  D1064: { status: 'N130_AFFECTED_NATIVE_CHAPTER_IDENTITY_AND_FIRST_CURRENT_TITLE_RENDER_PASS',
    fullBodyAdaptFinalizeReplayed: false },
  D1052: { status: 'N130_FIRST_CURRENT_EN_TITLE_HEADLESS_DESKTOP_MOBILE_DOM_AND_FOUR_PIXELS_PASS' },
  D1053: { status: 'N130_CURRENT_COMPLETE_EN_CANONICAL_RETAINED_READY', ready: bind(readyFiles[0]), newCompleteCourses: 0 },
  D1054: { status: 'N61_FIRST_MISSING_EN_PREPARE_PASS_EXACT_D017_APPROVALS_REUSED' },
  D1055: { status: 'N61_FIRST_EN_AUTHOR_NATIVE_AND_INDEPENDENT_SCI_ZHEN_PASS' },
  D1056: { status: 'N61_FIRST_EN_NATIVE_FINALIZE_RENDER_PASS' },
  D1057: { status: 'N61_FIRST_EN_HEADLESS_DESKTOP_MOBILE_DOM_AND_FOUR_PIXELS_PASS' },
  D1058: { status: 'N61_FIRST_COMPLETE_EN_CANONICAL_RETAINED_READY', ready: bind(readyFiles[1]), newCompleteCourses: 0 },
  D1059: { status: 'CONCLUSION_APPROVED_EN_BODY_REUSED_METADATA_PREPARE_PASS' },
  D1060: { status: 'CONCLUSION_AFFECTED_METADATA_NATIVE_AND_FIRST_CURRENT_TITLE_RENDER_PASS',
    fullBodyAdaptFinalizeReplayed: false },
  D1061: { status: 'CONCLUSION_FIRST_CURRENT_EN_TITLE_HEADLESS_DESKTOP_MOBILE_DOM_AND_FOUR_PIXELS_PASS' },
  D1062: { status: 'CONCLUSION_CURRENT_COMPLETE_EN_CANONICAL_RETAINED_READY', ready: bind(readyFiles[2]), newCompleteCourses: 0 },
  D1065: { status: 'THREE_COMPLETE_VISIBLE_EN_EDITIONS_READY_FOR_ORDINARY_PUSH',
    ready: bind(`${out}/batch-ready.json`), newCompleteCourses: 0, newSourcePages: 0 },
  currentContinuation: 'N130/N61/conclusion complete visible English editions retained;15 original objects,33 English paragraphs,0tasks/figures. N130/conclusion exact approved English bodies/native/SCI/ZHEN reused, only current metadata/first new-title renders and display checked. N130 chapter-only source-null identity correction and original failures preserved. N61 first English SCI/ZHEN/native/display PASS. One reviewer closed12/24 images in4+4+4; headless/preview limits and all HOLDs preserved. Totals153/581 unchanged; missing authorized stages continue after ordinary delivery.',
});
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
fs.appendFileSync(`${ticket}/review.md`,
  `\nD1048-D1064: N130/N61/conclusion current complete visible English editions retained:15originalobjects,33Englishparagraphs,0tasks/figures. Exact approved D035/D038 N130/conclusion English bodies/sectionbreaks/native/SCI/ZHEN reused, no body/source/Chinese/display-review replay. Only affected current English titles/edition/locale metadata checked; first current-title render/headlessdesktop1440x960/mobile390x844 DOM and suppliedpixels PASS. N130 duplicate-alias preflight FAIL preserved, identicalpath deduplicated before any native call. First D1050 native rejected changing chapter=null; renderer not invoked, then only /chapter restored to source-null and independently approved, affectednative and first renderer PASS. Nullsource chapter/section retained, no invented visiblepart/chapter12 claim. N61 FIRST English author/SCI/ZHEN/fullnativefinalize/render/display PASS;6objects/10paragraphs, no inventedtasks or figures. Reviewer closed${actualImages}/24,batches${read(reviewerClose).batches.join('+')},parent0reopens/crops. Canonical/source bindings and native index rows PASS, other EN rows/header and all raw/Chinese products unchanged. Historical D035/D017/D028 counting reused, totals153/581 unchanged. Headless/longpreview/fineglyph limits and all source/figure/paidHOLDs retained.\n`
  + '\nD1065: Ordinary exact-manifest substantive delivery of N130/N61/conclusion English completions with original drafts/failures/metadata reviews/native/DOM/pixel evidence and previous D1046 actualpushreceipt. No receipt-only commit, skill/unrelateddirtybytes, force/DB/paid/broadtests/merge/deploy/formalhandoff/scopecompletion. Authorized production continues after push.\n');
const files = new Set();
function collect(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    assert(!entry.isSymbolicLink());
    if (entry.isDirectory()) collect(file);
    else { assert(entry.isFile()); files.add(path.relative(repo, file)); }
  }
}
for (const directory of [
  ...readyFiles.map(file => path.dirname(file)), out,
  ...cards.map(card => `${book}/editions/modern-us-neutral-en/lessons/${card}`),
]) collect(directory);
for (const readyFile of readyFiles)
  for (const product of read(readyFile).products) files.add(path.relative(repo, product.path));
for (const file of [previous, indexFile, meterFile, `${ticket}/review.md`])
  files.add(path.relative(repo, file));
const list = [...files].sort();
assert(list.every(file => !/(^|\/)\.env($|\/)|\/skills\/|\/tmp\//.test(file)));
save(`${scratch}/manifest.json`, list);
assert.equal(gitRead(['rev-parse', 'HEAD']), base);
assert.equal(gitRead(['diff', '--cached', '--name-only']), '');
run('d1065-sync-existing-delivery-branch', ['git', 'fetch', 'origin', branch]);
assert.equal(gitRead(['rev-parse', 'FETCH_HEAD']), base);
const pathspec = `${scratch}/delivery.pathspec`;
fs.writeFileSync(pathspec, list.join('\0') + '\0', { flag: 'wx' });
run('d1065-stage-exact-manifest', ['git', 'add', '--pathspec-from-file', pathspec, '--pathspec-file-nul']);
const staged = gitRead(['diff', '--cached', '--name-only']).split('\n').filter(Boolean);
assert(staged.length && staged.every(file => list.includes(file)));
assert(staged.every(file => !/(^|\/)\.env($|\/)|\/skills\/|\/tmp\//.test(file)));
run('d1065-ordinary-substantive-commit', [
  'git', 'commit', '-m', 'STEMROBIN-181: complete N130 N61 and concluding English editions offline',
]);
const head = gitRead(['rev-parse', 'HEAD']);
save(`${scratch}/committed.json`, { task: 'D1065', base, head, branch, files: staged.length });
run('d1065-explicit-ordinary-push', ['git', 'push', 'origin', `HEAD:${branch}`]);
save(`${scratch}/push-exited.json`, {
  task: 'D1065', head, branch, files: staged.length, force: false, exitCode: 0,
  independentRemoteVerificationPending: true,
});
console.log(JSON.stringify({ head, files: staged.length, independentRemoteVerificationPending: true }));

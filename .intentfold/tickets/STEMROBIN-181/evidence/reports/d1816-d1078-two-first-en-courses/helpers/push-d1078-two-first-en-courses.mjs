import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const branch = 'codex/STEMROBIN-181-textbooks';
const previous = `${ticket}/evidence/reports/d1816-d1065-three-en-completions/actual-push.json`;
const base = read(previous).head;
const out = `${ticket}/evidence/reports/d1816-d1078-two-first-en-courses`;
const scratch = `${ticket}/tmp/d1816-d1078-delivery`;
const cards = ['phy9-c1-s1-n6', 'phy9-c1-s2-n13'];
const readyFiles = [
  `${ticket}/evidence/reports/d1816-d1076-n6-first-complete-en/batch-ready.json`,
  `${ticket}/evidence/reports/d1816-d1077-n13-first-complete-en/batch-ready.json`,
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
const reviewerClose = `${ticket}/tmp/d1816-d1077-reviewer-closed.json`;
const closure = read(reviewerClose);
assert.equal(closure.closed, true);
assert.equal(closure.actualImages, 8);
assert.deepEqual(closure.batches, [4, 4]);
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
  'n42-native.mjs', 'prepare-d1067-early-9p-first-en.mjs', 'author-d1068-early-9p-first-en.mjs',
  'correct-d1080-n6-two-flow-findings.mjs',
  'finalize-d997-n72-first-en.mjs', 'display-d998-n72-first-en-full-course.mjs',
  'retain-d1000-n72-first-complete-en.mjs', 'update-edition-index.py',
  'record-ordinary-en-extension-push.mjs', 'push-d1078-two-first-en-courses.mjs',
]) copy(`${ticket}/tmp/d1816-recovery/${name}`, `${out}/helpers/${name}`);
save(`${out}/batch-ready.json`, {
  task: 'D1078', base, branch, cards, ready: readyFiles.map(bind),
  previousPushReceipt: bind(previous), nativeIndex: bind(indexFile),
  originalObjects: 24, originalTasks: 0, originalFigures: 0,
  actualIndependentImages: closure.actualImages, batches: closure.batches, parentNewImages: 0,
  newCompleteCourses: 0, newSourcePages: 0, totals: { completeCourses: 153, sourcePages: 581 },
  reviewerClosed: bind(`${out}/reviewer-closed.original.json`),
  historicalD002ChineseScienceNativeAndDeliveryReused: true,
  n6HistoricalScienceFinalPlusDurableBindingReused: true,
  sourceAndAllChineseProductsAndOtherEnglishRowsUnchanged: true,
  firstEnglishScienceZhEnNativeAndDisplay: true,
  n6RegisteredCarbonMassAndParticleCountCorrectionsPreservedAndLocalized: true,
  n6OriginalTwoFlowFindingsPreservedAndAffectedOnlyPunctuationCapitalizationReviewed: true,
  browserMode: 'isolated-headless', headedAcceptanceClaimed: false,
  suppliedViewLimitsPreserved: true, fullResolutionAllGlyphCertification: false,
  completeEnglishAccessibilityApproval: false,
  noSkillOrUnrelatedDirtyBytes: true, force: false, databaseWrites: 0, paidCalls: 0,
  formalHandoff: false, scopeCompleted: false, continuousProduction: true,
});
const meterFile = `${ticket}/production-meter.json`, reviewFile = `${ticket}/review.md`;
copy(meterFile, `${scratch}/production-meter.before.json`);
copy(reviewFile, `${scratch}/review.before.md`);
const meter = read(meterFile);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 153);
assert.equal(meter.sourcePagesFinalized, 581);
Object.assign(meter.currentResume1816, {
  D1067: { status: 'N6_FIRST_MISSING_EN_PREPARE_PASS_EXACT_D002_PRODUCTS_SCI_FINAL_AND_DURABLE_BINDING_REUSED' },
  D1068: { status: 'N6_FIRST_EN_AUTHOR_NATIVE_AND_INDEPENDENT_SCI_ZHEN_PASS_REGISTERED_ERRATA_PRESERVED' },
  D1069: { status: 'N6_N13_FIRST_EN_INDEPENDENT_SCI_ZHEN_READABILITY_AND_BOUNDED_PIXELS_PASS',
    actualImages: closure.actualImages, closed: bind(`${out}/reviewer-closed.original.json`) },
  D1070: { status: 'N6_FIRST_EN_NATIVE_FINALIZE_RENDER_PASS' },
  D1071: { status: 'N6_FIRST_EN_HEADLESS_DESKTOP_MOBILE_DOM_AND_FOUR_PIXELS_PASS' },
  D1072: { status: 'N13_FIRST_MISSING_EN_PREPARE_PASS_EXACT_D002_PRODUCTS_AND_SCI_REUSED' },
  D1073: { status: 'N13_FIRST_EN_AUTHOR_NATIVE_AND_INDEPENDENT_SCI_ZHEN_PASS' },
  D1074: { status: 'N13_FIRST_EN_NATIVE_FINALIZE_RENDER_PASS' },
  D1075: { status: 'N13_FIRST_EN_HEADLESS_DESKTOP_MOBILE_DOM_AND_FOUR_PIXELS_PASS' },
  D1076: { status: 'N6_FIRST_COMPLETE_EN_CANONICAL_RETAINED_READY', ready: bind(readyFiles[0]), newCompleteCourses: 0 },
  D1077: { status: 'N13_FIRST_COMPLETE_EN_CANONICAL_RETAINED_READY', ready: bind(readyFiles[1]), newCompleteCourses: 0 },
  D1078: { status: 'TWO_FIRST_COMPLETE_VISIBLE_EN_EDITIONS_READY_FOR_ORDINARY_PUSH',
    ready: bind(`${out}/batch-ready.json`), newCompleteCourses: 0, newSourcePages: 0 },
  D1080: { status: 'N6_TWO_INDEPENDENT_PARAGRAPH_FLOW_FINDINGS_AFFECTED_ONLY_NATIVE_AND_REVIEW_PASS',
    originalFindingsPreserved: true, affectedIndices: [7, 13] },
  currentContinuation: 'N6/N13 first complete English editions retained;24 original objects,0tasks/figures. Exact D002 source/Chinese/native/SCI approvals reused. N6 final SCI plus durable binding verified, carbon-mass/particle-count corrections retained with English corrected prose. FIRST EN SCI/ZHEN/native/display PASS. Reviewer closed8/24,batches4+4,parent0. Totals153/581 unchanged; all genuine HOLDs and authorized production continue.',
});
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
fs.appendFileSync(reviewFile,
  '\nD1067-D1077,D1080: N6/N13 FIRST complete visible English editions retained:24originalobjects,0tasks/figures. Exact D002 delivered source/fourChineseproducts and historical SCI reused, not replayed. N6 SCI-final plus original durable-binding report verified; registered carbon-mass and particle-count unit corrections remain source-bound with only corrected prose localized in EN. N6 original two paragraph-flow findings preserved; only punctuation/capitalization at prose7/13 repaired and affected-only native/independent review passed. N13 ideal/real-gas, collision-flux, equilibrium-speed and deviation limits retained. FIRST EN author/SCI/ZHEN/readability/fullnativefinalize/render/headlessdesktop1440x960/mobile390x844 DOM and suppliedpixels PASS. Sole reviewer closed8/24,batches4+4,parent0reopens/crops. Canonicalbindings/nativeindex insertions PASS, all source/Chinese and otherENrows/header unchanged. AlreadycountedD002,totals153/581 unchanged. Headless/longpreview/fineglyph limits and all earlier source/figure/paidHOLDs retained.\n'
  + '\nD1078: Ordinary exact-manifest substantive delivery of N6/N13 first English editions and original drafts/reviews/native/DOM/pixels with previous D1065 actualpushreceipt. No receipt-onlycommit, skill/unrelateddirtybytes, force/DB/paid/broadtests/merge/deploy/formalhandoff/scopecompletion. Authorized production continues after push.\n');
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
for (const file of [previous, indexFile, meterFile, reviewFile]) files.add(path.relative(repo, file));
const list = [...files].sort();
assert(list.every(file => !/(^|\/)\.env($|\/)|\/skills\/|\/tmp\//.test(file)));
save(`${scratch}/manifest.json`, list);
assert.equal(gitRead(['rev-parse', 'HEAD']), base);
assert.equal(gitRead(['diff', '--cached', '--name-only']), '');
run('d1078-sync-existing-delivery-branch', ['git', 'fetch', 'origin', branch]);
assert.equal(gitRead(['rev-parse', 'FETCH_HEAD']), base);
const pathspec = `${scratch}/delivery.pathspec`;
fs.writeFileSync(pathspec, list.join('\0') + '\0', { flag: 'wx' });
run('d1078-stage-exact-manifest', ['git', 'add', '--pathspec-from-file', pathspec, '--pathspec-file-nul']);
const staged = gitRead(['diff', '--cached', '--name-only']).split('\n').filter(Boolean);
assert(staged.length && staged.every(file => list.includes(file)));
assert(staged.every(file => !/(^|\/)\.env($|\/)|\/skills\/|\/tmp\//.test(file)));
run('d1078-ordinary-substantive-commit', [
  'git', 'commit', '-m', 'STEMROBIN-181: complete first N6 and N13 English editions offline',
]);
const head = gitRead(['rev-parse', 'HEAD']);
save(`${scratch}/committed.json`, { task: 'D1078', base, head, branch, files: staged.length });
run('d1078-explicit-ordinary-push', ['git', 'push', 'origin', `HEAD:${branch}`]);
save(`${scratch}/push-exited.json`, {
  task: 'D1078', head, branch, files: staged.length, force: false, exitCode: 0,
  independentRemoteVerificationPending: true,
});
console.log(JSON.stringify({ head, files: staged.length, independentRemoteVerificationPending: true }));

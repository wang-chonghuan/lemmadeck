import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const base = '81311c8f61dfbb50733cd7685cf6f10c9e6efbda';
const branch = 'codex/STEMROBIN-181-textbooks';
const out = `${ticket}/evidence/reports/d1816-d1046-three-first-en-courses`;
const scratch = `${ticket}/tmp/d1816-d1046-delivery`;
const cards = ['phy9-c2-s2-n81', 'phy9-c2-s3-n89', 'phy9-c2-s4-n105'];
const readyFiles = [
  `${ticket}/evidence/reports/d1816-d1032-n81-first-complete-en/batch-ready.json`,
  `${ticket}/evidence/reports/d1816-d1039-n89-first-complete-en/batch-ready.json`,
  `${ticket}/evidence/reports/d1816-d1045-n105-first-complete-en/batch-ready.json`,
];
for (const file of readyFiles) {
  const ready = read(file);
  assert.equal(ready.newCompleteCourses, 0);
  assert.equal(ready.newSourcePages, 0);
  for (const product of ready.products.filter(product => !product.path.endsWith('/book.json')))
    assert.equal(bind(product.path).sha256, product.sha256);
}
const book = `${repo}/ssot-resources/soviet10year-textbooks/artifacts/9p`;
const indexFile = `${book}/editions/modern-us-neutral-en/book.json`;
const before = read(`${ticket}/evidence/reports/d1816-d1032-n81-first-complete-en/before.english-book.json`);
const after = read(indexFile);
assert.deepEqual(after.lessons.filter(row => !cards.includes(row.id)), before.lessons);
assert.deepEqual({ ...after, lessons: [] }, { ...before, lessons: [] });
assert(cards.every(card => after.lessons.filter(row => row.id === card).length === 1));
const previous = `${ticket}/evidence/reports/d1816-d1022-two-first-en-courses/actual-push.json`;
assert.equal(read(previous).head, base);
const reviewerClose = `${ticket}/tmp/d1816-d1045-reviewer-closed.json`;
assert.equal(read(reviewerClose).closed, true);
const actualImages = read(reviewerClose).actualImages;
assert.equal(actualImages, 14);
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
  'n42-native.mjs', 'prepare-d1013-n64-first-missing-en.mjs',
  'author-d1035-n89-first-missing-en.mjs', 'correct-d1040-n89-two-readability-findings.mjs',
  'author-d1042-n105-first-missing-en.mjs', 'finalize-d997-n72-first-en.mjs',
  'display-d998-n72-first-en-full-course.mjs', 'bind-d1015-n73-original-svg-display-widths.mjs',
  'retain-d1000-n72-first-complete-en.mjs', 'validate-d1000-n72-retained-tuples.py',
  'update-edition-index.py', 'record-ordinary-en-extension-push.mjs',
  'push-d1046-three-first-en-courses.mjs',
]) copy(`${ticket}/tmp/d1816-recovery/${name}`, `${out}/helpers/${name}`);
save(`${out}/batch-ready.json`, {
  task: 'D1046', base, branch, cards, ready: readyFiles.map(bind),
  previousPushReceipt: bind(previous), nativeIndex: bind(indexFile),
  originalObjects: 30, englishParagraphs: 59, originalTasks: 0, originalFigures: 1,
  actualIndependentImages: actualImages, batches: read(reviewerClose).batches, parentNewImages: 0,
  newCompleteCourses: 0, newSourcePages: 0, totals: { completeCourses: 153, sourcePages: 581 },
  reviewerClosed: bind(`${out}/reviewer-closed.original.json`),
  sourceAndAllChineseProductsAndOtherEnglishRowsUnchanged: true,
  completeEnglishAccessibilityApproval: false, n81ProtectedChineseAriaLabelsDisclosed: true,
  browserMode: 'isolated-headless', headedAcceptanceClaimed: false,
  firstFailuresAndLocalCorrectionsPreserved: true,
  suppliedViewLimitsPreserved: true, fullResolutionAllGlyphCertification: false,
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
  D1025: { status: 'N81_FIRST_MISSING_EN_PREPARE_PASS' },
  D1026: { status: 'N81_FIRST_AUTHOR_MATH_ORDER_FAILURE_PRESERVED' },
  D1027: { status: 'N81_AFFECTED_MATH_ORDER_CORRECTION_NATIVE_PASS' },
  D1028: { status: 'N81_N89_N105_EN_REVIEWS_AND_BOUNDED_PIXELS_PASS_REVIEWER_CLOSED',
    actualImages, batches: read(reviewerClose).batches, closed: bind(`${out}/reviewer-closed.original.json`) },
  D1029: { status: 'N81_FIRST_EN_NATIVE_FINALIZE_RENDER_PASS' },
  D1030: { status: 'N81_FIRST_DISPLAY_UNLABELED_FIGURE_ASSUMPTION_FAILURE_PRESERVED' },
  D1031: { status: 'N81_ORIGINAL_SVG_ACTUAL_WIDTH_BINDINGS_PASS', rendererCalls: 0 },
  D1033: { status: 'N81_UNLABELED_FIGURE_DISPLAY_TECHNICAL_RECOVERY_PASS' },
  D1032: { status: 'N81_FIRST_VISIBLE_EN_CANONICAL_RETAINED_READY', ready: bind(readyFiles[0]), newCompleteCourses: 0 },
  D1034: { status: 'N89_FIRST_MISSING_EN_PREPARE_PASS' },
  D1035: { status: 'N89_FIRST_AUTHOR_NATIVE_PASS_FIRST_READABILITY_REVISE_PRESERVED' },
  D1040: { status: 'N89_TWO_READABILITY_FINDINGS_ONLY_AFFECTED_NATIVE_AND_INDEPENDENT_PASS' },
  D1037: { status: 'N89_FIRST_EN_NATIVE_FINALIZE_RENDER_PASS' },
  D1038: { status: 'N89_FIRST_EN_HEADLESS_DESKTOP_MOBILE_DOM_AND_FOUR_BOUNDED_PIXELS_PASS' },
  D1039: { status: 'N89_FIRST_VISIBLE_EN_CANONICAL_RETAINED_READY', ready: bind(readyFiles[1]), newCompleteCourses: 0 },
  D1041: { status: 'N105_FIRST_MISSING_EN_PREPARE_PASS' },
  D1042: { status: 'N105_FIRST_AUTHOR_NATIVE_AND_FIRST_EN_SCI_ZHEN_PASS' },
  D1043: { status: 'N105_FIRST_EN_NATIVE_FINALIZE_RENDER_PASS' },
  D1044: { status: 'N105_FIRST_DISPLAY_WRONG_SECTION_CRUMB_ASSUMPTION_FAILURE_PRESERVED' },
  D1049: { status: 'N105_SECTION_NULL_EN_PART_CRUMB_HEADLESS_DOM_AND_FOUR_BOUNDED_PIXELS_PASS',
    noChapter10VisibleHeadingClaimed: true, sourceIdentityAndNativeHtmlUnchanged: true },
  D1045: { status: 'N105_FIRST_VISIBLE_EN_CANONICAL_RETAINED_READY', ready: bind(readyFiles[2]), newCompleteCourses: 0 },
  D1046: { status: 'THREE_FIRST_COMPLETE_VISIBLE_EN_EDITIONS_READY_FOR_ORDINARY_PUSH',
    ready: bind(`${out}/batch-ready.json`), newCompleteCourses: 0, newSourcePages: 0 },
  currentContinuation: 'N81/N89/N105 first visible English editions retained;30 original objects,59 English paragraphs,1 unchanged SVG,0tasks. First English reviews, native finalize/render, isolated headless desktop/mobile DOM and14 bounded pixel observations PASS. N89 two readability revisions and N81 math-order/unlabeled-display/N105 sectionless-crumb failures preserved. N105 source section=null; actual English part crumb retained, no visible Chapter10 assertion. Totals153/581 unchanged; D020/D022/D025 already counted. Missing authorized stages continue after ordinary delivery; all historical HOLDs retained.',
});
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
fs.appendFileSync(`${ticket}/review.md`,
  `\nD1025-D1045: First visible N81/N89/N105 English editions retained:30originalobjects,59Englishparagraphs,0tasks,1unchangedSVG. Exact D020/D022/D025 source/Chinese/native/SCI/figure approvals reused without replay. N81 initial math-order failure preserved and corrected only; first display failed on assuming labels must be nonzero, then actual render label count0 honored without invented labels. Actual358/640 width metadata bound to unchangedSVG. N89 first EN-SCI PASS, two readability findings corrected only with period/Here and native-stable inline strong opener; original REVISE and affected native/independent PASS preserved. N105 FIRST complete English SCI/ZHEN/readability PASS. FIRST native finalize/render, isolated HEADLESS desktop1440x960/mobile390x844 DOM and bounded saved pixels PASS. Reviewer closed${actualImages}/24,batches${read(reviewerClose).batches.join('+')},parent0. No headed/allglyph/completeEnglishaccessibility claim; N81 Chinese machineARIA disclosed. Canonicalbindings/index insertion PASS, other EN rows/header/source/Chinese unchanged. Totals153/581 unchanged, no duplicate completion count. All earlier source/figure/paidHOLDs preserved.\n`
  + '\nD1046: Ordinary exact-manifest substantive delivery of N81/N89/N105 first English editions with original drafts/failures/current products/native/DOM/pixel evidence and prior D1022 actualpushreceipt. No receipt-only commit, skill/unrelateddirtybytes, force/DB/paid/broadtests/merge/deploy/formalhandoff/scopecompletion. Authorized production continues after push.\n');
fs.appendFileSync(`${ticket}/review.md`,
  '\nD1044/D1049: N105 initial display failed before saving any views on an invented Chapter10 crumb expectation. Original report/helper preserved; source section is null and actual native HTML shows Part Two. Foundations of Electrodynamics. Only scratch expectation corrected; first affected headless desktop/mobile display PASS, no source/title/identity/text/native render or approval replay. No visible Chapter10 claim.\n');
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
const gitRead = args => {
  const result = spawnSync('git', args, { cwd: repo, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
};
assert.equal(gitRead(['rev-parse', 'HEAD']), base);
assert.equal(gitRead(['diff', '--cached', '--name-only']), '');
run('d1046-sync-existing-delivery-branch', ['git', 'fetch', 'origin', branch]);
assert.equal(gitRead(['rev-parse', 'FETCH_HEAD']), base);
const pathspec = `${scratch}/delivery.pathspec`;
fs.writeFileSync(pathspec, list.join('\0') + '\0', { flag: 'wx' });
run('d1046-stage-exact-manifest', ['git', 'add', '--pathspec-from-file', pathspec, '--pathspec-file-nul']);
const staged = gitRead(['diff', '--cached', '--name-only']).split('\n').filter(Boolean);
assert(staged.length && staged.every(file => list.includes(file)));
assert(staged.every(file => !/(^|\/)\.env($|\/)|\/skills\/|\/tmp\//.test(file)));
run('d1046-ordinary-substantive-commit', [
  'git', 'commit', '-m', 'STEMROBIN-181: complete first N81 N89 N105 visible English editions offline',
]);
const head = gitRead(['rev-parse', 'HEAD']);
save(`${scratch}/committed.json`, { task: 'D1046', base, head, branch, files: staged.length });
run('d1046-explicit-ordinary-push', ['git', 'push', 'origin', `HEAD:${branch}`]);
save(`${scratch}/push-exited.json`, {
  task: 'D1046', head, branch, files: staged.length, force: false, exitCode: 0,
  independentRemoteVerificationPending: true,
});
console.log(JSON.stringify({ head, files: staged.length, independentRemoteVerificationPending: true }));

import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const base = '2879525fe95fcbbc61a223f9f3cc4ed95a243614';
const branch = 'codex/STEMROBIN-181-textbooks';
const out = `${ticket}/evidence/reports/d1816-d1022-two-first-en-courses`;
const scratch = `${ticket}/tmp/d1816-d1022-delivery`;
const cards = ['phy9-c2-s2-n73', 'phy9-c2-s2-n64'];
const readyFiles = [
  `${ticket}/evidence/reports/d1816-d1016-n73-first-complete-en/batch-ready.json`,
  `${ticket}/evidence/reports/d1816-d1021-n64-first-complete-en/batch-ready.json`,
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
const before = read(`${ticket}/evidence/reports/d1816-d1016-n73-first-complete-en/before.english-book.json`);
const after = read(indexFile);
assert.deepEqual(after.lessons.filter(row => !cards.includes(row.id)), before.lessons);
assert.deepEqual({ ...after, lessons: [] }, { ...before, lessons: [] });
assert(cards.every(card => after.lessons.filter(row => row.id === card).length === 1));
const previous = `${ticket}/evidence/reports/d1816-d1001-two-first-en-courses/actual-push.json`;
assert.equal(read(previous).head, base);
const reviewerClose = `${ticket}/tmp/d1816-d1021-reviewer-closed.json`;
assert.equal(read(reviewerClose).closed, true);
const actualImages = read(reviewerClose).actualImages;
assert(actualImages >= 17 && actualImages <= 24);
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
  'n42-native.mjs', 'prepare-d1002-n73-first-missing-en.mjs', 'author-d1004-n73-first-missing-en.py',
  'correct-d1005-n73-two-text-signatures.py', 'correct-d1012-n73-two-review-findings.mjs',
  'prepare-d1013-n64-first-missing-en.mjs', 'author-d1014-n64-first-missing-en.mjs',
  'correct-d1019-n64-unchanged-block-metadata.mjs', 'finalize-d997-n72-first-en.mjs',
  'display-d998-n72-first-en-full-course.mjs', 'bind-d1015-n73-original-svg-display-widths.mjs',
  'check-d1024-n73-mobile-equation-scroll-end.mjs',
  'retain-d1000-n72-first-complete-en.mjs', 'validate-d1000-n72-retained-tuples.py',
  'update-edition-index.py', 'record-ordinary-en-extension-push.mjs',
  'push-d1022-two-first-en-courses.mjs',
]) copy(`${ticket}/tmp/d1816-recovery/${name}`, `${out}/helpers/${name}`);
save(`${out}/batch-ready.json`, {
  task: 'D1022', base, branch, cards, ready: readyFiles.map(bind),
  previousPushReceipt: bind(previous), nativeIndex: bind(indexFile),
  originalObjects: 64, originalTasks: 0, originalFigures: 4,
  actualIndependentImages: actualImages, batches: read(reviewerClose).batches, parentNewImages: 0,
  newCompleteCourses: 0, newSourcePages: 0, totals: { completeCourses: 153, sourcePages: 581 },
  reviewerClosed: bind(`${out}/reviewer-closed.original.json`),
  sourceAndAllChineseProductsAndOtherEnglishRowsUnchanged: true,
  completeEnglishAccessibilityApproval: false, n73ProtectedChineseAriaLabelsDisclosed: true,
  browserMode: 'isolated-headless', headedAcceptanceClaimed: false,
  firstFailuresAndLocalCorrectionsPreserved: true, originalSvgWidthEvidence: readyFiles.map(file => ({
    cards: read(file).cards, proof: bind(file.replace('batch-ready.json', 'canonical-binding-proof.json')),
  })),
  noRendererRecreationOrAlternativeEquivalenceClaim: true,
  suppliedViewLimitsPreserved: true, fullResolutionAllGlyphCertification: false,
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
Object.assign(meter.currentResume1816, {
  D1002: { status: 'N73_FIRST_MISSING_EN_PREPARE_PASS', newCompleteCourses: 0 },
  D1004: { status: 'N73_FIRST_AUTHOR_MATH_ORDER_FAILURE_PRESERVED' },
  D1005: { status: 'N73_TWO_MATH_SIGNATURE_TEXTS_AFFECTED_AND_UNVISITED_NATIVE_PASS' },
  D1006: { status: 'N73_N64_FIRST_EN_SCI_ZHEN_AND_BOUNDED_PIXELS_PASS_REVIEWER_CLOSED',
    actualImages, batches: read(reviewerClose).batches, closed: bind(`${out}/reviewer-closed.original.json`) },
  D1012: { status: 'N73_TWO_EN_WORDING_FINDINGS_AFFECTED_NATIVE_AND_INDEPENDENT_PASS' },
  D1007: { status: 'N73_FIRST_EN_NATIVE_FINALIZE_RENDER_PASS' },
  D1008: { status: 'N73_FIRST_EN_ISOLATED_HEADLESS_DOM_AND_EIGHT_BOUNDED_PIXELS_PASS',
    headedAcceptanceClaimed: false },
  D1015: { status: 'N73_ORIGINAL_SVG_ACTUAL_WIDTH_BINDINGS_PASS', rendererCalls: 0 },
  D1024: { status: 'N73_MOBILE_EQUATION_8_21_TERMINAL_SCROLL_REACHABILITY_AND_AFFECTED_PIXEL_PASS',
    contentAndNativeHtmlUnchanged: true, firstMobileHoldPreserved: true },
  D1016: { status: 'N73_FIRST_VISIBLE_EN_CANONICAL_RETAINED_READY', ready: bind(readyFiles[0]), newCompleteCourses: 0 },
  D1013: { status: 'N64_FIRST_MISSING_EN_PREPARE_PASS', newCompleteCourses: 0 },
  D1014: { status: 'N64_OPTIONAL_TOC_HELPER_AND_UNCHANGED_MARKER_NATIVE_FAILURES_PRESERVED' },
  D1019: { status: 'N64_SEVEN_CHANGE_MARKERS_ONLY_AFFECTED_NATIVE_PASS' },
  D1017: { status: 'N64_FIRST_EN_NATIVE_FINALIZE_RENDER_PASS' },
  D1018: { status: 'N64_FIRST_EN_ISOLATED_HEADLESS_DOM_AND_EIGHT_BOUNDED_PIXELS_PASS',
    headedAcceptanceClaimed: false },
  D1020: { status: 'N64_ORIGINAL_SVG_ACTUAL_WIDTH_BINDINGS_PASS', rendererCalls: 0 },
  D1021: { status: 'N64_FIRST_VISIBLE_EN_CANONICAL_RETAINED_READY', ready: bind(readyFiles[1]), newCompleteCourses: 0 },
  D1022: { status: 'TWO_FIRST_COMPLETE_VISIBLE_EN_EDITIONS_READY_FOR_ORDINARY_PUSH',
    ready: bind(`${out}/batch-ready.json`), newCompleteCourses: 0, newSourcePages: 0 },
  currentContinuation: 'N73 and N64 first visible English editions retained;64 original objects,80 English paragraphs,4 unchanged SVG figures,0tasks. New English SCI/ZHEN, native finalize/render, isolated headless desktop/mobile DOM and bounded pixels PASS; headed and complete-English accessibility not claimed. Totals153/581 unchanged; already D019/D018 counted. All historical holds preserved; missing English production continues after ordinary delivery.',
});
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
fs.appendFileSync(`${ticket}/review.md`,
  `\nD1002-D1024: First visible N73/N64 English editions retained:64originalobjects,80Englishparagraphs,0tasks,4unchangedSVGfigures. Exact D019/D018 source/Chinese/SCI/figure approvals reused without replay. N73 original math-order and added-token author failures retained, then EN fixed-charge-amount/local-field-action wording corrected only and independently passed. N64 optional-TOC helper failure and seven unnecessary change-marker failures retained; only seven changes arrays corrected, text/flow unchanged. FIRST native finalize/render and isolated HEADLESS desktop1440x960/mobile390x844 DOM and bounded saved-pixel checks PASS; no headed acceptance. Original N73 mobile8-21 terminal-visibility HOLD preserved; D1024 exercised only its native horizontal scroll to visible terminal energy difference, with one affected screenshot and no content/whole-course rerender. N73 Chinese machineARIA remains disclosed, completeEnglishaccessibility not approved. Original SVGs retained with actual browser sizing metadata, no rerender/geometry/source/past-pixel replay. N64 four worked examples stay prose; no invented tasks. Canonicaltuples/index insertion PASS; other EN rows/header/source/Chinese unchanged. Reviewer closed${actualImages}images,batches${read(reviewerClose).batches.join('+')},parent0. Totals153/581 unchanged; all earlier source/figure/paidHOLDs and previewlimits preserved.\n`
  + '\nD1022: Ordinary exact-manifest delivery of N73/N64 first English editions, products/drafts/failure histories and DOM/pixel/native evidence. D1001 actual receipt joins this substantive batch, no receipt-only commit. No skill/unrelateddirtyfiles/force/DB/paid/broadtests/merge/deploy/formalhandoff/scopecompletion. Continue authorized missing sourced stages after push.\n');
fs.appendFileSync(`${ticket}/review.md`,
  '\nD1021 technical recovery: First canonical tuple helper failed on retired00b1 absolute source paths after files were retained; original failure preserved. Current canonical fig108/109 PNGs match exact historical/spec/review hashes. Only the scratch source-path check changed; resumed existing retention after the failed binding, without recopying outputs or replaying source/figure/native/render/pixels. Affected tuple binding and missing index insertion PASS. Canonical spec/SVG/source/Chinese bytes unchanged; N81 remains next-batch-only.\n');
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
run('d1022-sync-existing-delivery-branch', ['git', 'fetch', 'origin', branch]);
assert.equal(gitRead(['rev-parse', 'FETCH_HEAD']), base);
const pathspec = `${scratch}/delivery.pathspec`;
fs.writeFileSync(pathspec, list.join('\0') + '\0', { flag: 'wx' });
run('d1022-stage-exact-manifest', ['git', 'add', '--pathspec-from-file', pathspec, '--pathspec-file-nul']);
const staged = gitRead(['diff', '--cached', '--name-only']).split('\n').filter(Boolean);
assert(staged.length && staged.every(file => list.includes(file)));
assert(staged.every(file => !/(^|\/)\.env($|\/)|\/skills\/|\/tmp\//.test(file)));
run('d1022-ordinary-substantive-commit', [
  'git', 'commit', '-m', 'STEMROBIN-181: complete first N73 and N64 visible English editions offline',
]);
const head = gitRead(['rev-parse', 'HEAD']);
save(`${scratch}/committed.json`, { task: 'D1022', base, head, branch, files: staged.length });
run('d1022-explicit-ordinary-push', ['git', 'push', 'origin', `HEAD:${branch}`]);
save(`${scratch}/push-exited.json`, {
  task: 'D1022', head, branch, files: staged.length, force: false, exitCode: 0,
  independentRemoteVerificationPending: true,
});
console.log(JSON.stringify({ head, files: staged.length, independentRemoteVerificationPending: true }));

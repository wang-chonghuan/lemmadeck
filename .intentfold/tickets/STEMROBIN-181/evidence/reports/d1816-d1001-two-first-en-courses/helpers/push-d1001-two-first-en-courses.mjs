import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const base = '2569c2c890a2c73bb730789f04ed1888baac3c23';
const branch = 'codex/STEMROBIN-181-textbooks';
const out = `${ticket}/evidence/reports/d1816-d1001-two-first-en-courses`;
const scratch = `${ticket}/tmp/d1816-d1001-delivery`;
fs.mkdirSync(out, { recursive: false });
fs.mkdirSync(scratch, { recursive: false });
const cards = ['phy9-c2-s2-n63', 'phy9-c2-s2-n72'];
const readyFiles = [
  `${ticket}/evidence/reports/d1816-d996-n63-first-complete-en/batch-ready.json`,
  `${ticket}/evidence/reports/d1816-d1000-n72-first-complete-en/batch-ready.json`,
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
const before = read(`${ticket}/evidence/reports/d1816-d996-n63-first-complete-en/before.english-book.json`);
const after = read(indexFile);
assert.deepEqual(after.lessons.filter(row => !cards.includes(row.id)), before.lessons);
assert.deepEqual({ ...after, lessons: [] }, { ...before, lessons: [] });
assert(cards.every(card => after.lessons.filter(row => row.id === card).length === 1));
const previous = `${ticket}/evidence/reports/d1816-d985-two-first-en-courses/actual-push.json`;
assert.equal(read(previous).head, base);
const reviewerClose = `${ticket}/tmp/d1816-d1000-reviewer-closed.json`;
assert.equal(read(reviewerClose).closed, true);
assert.equal(read(reviewerClose).actualImages, 19);
copy(reviewerClose, `${out}/reviewer-closed.original.json`);
const previousNative = read(previous).nativeReceipt;
const previousCall = read(previousNative.path);
copy(previousNative.path, `${out}/previous-push/receipt.original.json`);
for (const [key, file] of Object.entries(previousCall.streams)) {
  assert.equal(bind(file.path).sha256, file.sha256);
  copy(file.path, `${out}/previous-push/${key}.original.txt`);
}
for (const name of [
  'n42-native.mjs', 'prepare-d987-n63-first-missing-en.mjs',
  'author-d988-n63-first-missing-en.py', 'correct-d989-n63-historical-name.py',
  'finalize-d991-n63-first-en.mjs', 'display-d972-n74-first-en-full-course.mjs',
  'retain-d996-n63-first-complete-en.mjs', 'prepare-d993-n72-first-missing-en.mjs',
  'author-d994-n72-first-missing-en.py', 'correct-d995-n72-label-identity.py',
  'finalize-d997-n72-first-en.mjs', 'display-d998-n72-first-en-full-course.mjs',
  'reconcile-d999-n72-actual-display-widths.mjs',
  'recover-d1003-n72-original-svg-width-bindings.mjs',
  'retain-d1000-n72-first-complete-en.mjs', 'validate-d1000-n72-retained-tuples.py',
  'update-edition-index.py', 'record-ordinary-en-extension-push.mjs',
  'push-d1001-two-first-en-courses.mjs',
]) copy(`${ticket}/tmp/d1816-recovery/${name}`, `${out}/helpers/${name}`);
save(`${out}/batch-ready.json`, {
  task: 'D1001', base, branch, cards, ready: readyFiles.map(bind),
  previousPushReceipt: bind(previous), nativeIndex: bind(indexFile),
  originalObjects: 39, originalTasks: 0, originalFigures: 4,
  actualIndependentImages: 19, batches: [7, 6, 6], parentNewImages: 0,
  newCompleteCourses: 0, newSourcePages: 0, totals: { completeCourses: 153, sourcePages: 581 },
  reviewerClosed: bind(`${out}/reviewer-closed.original.json`),
  sourceAndAllChineseProductsAndOtherEnglishRowsUnchanged: true,
  n72CompleteEnglishAccessibilityApproval: false,
  n72ProtectedChineseAriaLabelsDisclosed: true,
  firstFailuresAndUnusedDifferentFontRerenderPreserved: true,
  actualOriginalSvgCourseWidthEvidence: [343, 480],
  noCurrentRendererRecreationOrAlternativeEquivalenceClaim: true,
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
  D987: { status: 'N63_FIRST_MISSING_EN_PREPARATION_PASS', newCompleteCourses: 0 },
  D988: { status: 'N63_FIRST_EN_AUTHOR_FAILED_STALE_HISTORICAL_NAME_PRESERVED' },
  D989: { status: 'N63_AFFECTED_HISTORICAL_NAME_NATIVE_PASS' },
  D990: { status: 'N63_N72_FIRST_EN_SCI_ZHEN_AND_BOUNDED_PIXELS_PASS_REVIEWER_CLOSED',
    images: 19, batches: [7, 6, 6], reviewerClosed: bind(`${out}/reviewer-closed.original.json`) },
  D991: { status: 'N63_FIRST_EN_NATIVE_FINALIZE_RENDER_PASS' },
  D992: { status: 'N63_FIRST_COMPLETE_EN_DESKTOP_MOBILE_DOM_AND_SEVEN_SUPPLIED_PIXELS_PASS' },
  D993: { status: 'N72_FIRST_MISSING_EN_PREPARATION_PASS' },
  D994: { status: 'N72_FIRST_EN_AUTHOR_FAILED_EIGHT_MACHINE_LABEL_ALIASES_PRESERVED' },
  D995: { status: 'N72_AFFECTED_ONLY_SOURCE_MACHINE_LABEL_IDENTITIES_PASS',
    completeEnglishAccessibilityApproval: false },
  D996: { status: 'N63_FIRST_EN_CANONICAL_RETAINED_READY', ready: bind(readyFiles[0]), newCompleteCourses: 0 },
  D997: { status: 'N72_FIRST_EN_NATIVE_FINALIZE_RENDER_PASS' },
  D998: { status: 'N72_FIRST_EN_DOM_AND_TWELVE_ACTUAL_WIDTH_SUPPLIED_PIXELS_PASS' },
  D999: { status: 'N72_FIRST_WIDTH_RERENDER_DIFFERED_UNUSED_NOT_PROMOTED', semanticHold: false },
  D1003: { status: 'N72_ORIGINAL_SVG_ACTUAL_WIDTH_BROWSER_BINDINGS_PASS', rendererCalls: 0 },
  D1000: { status: 'N72_FIRST_VISIBLE_EN_CANONICAL_RETAINED_READY',
    ready: bind(readyFiles[1]), newCompleteCourses: 0, completeEnglishAccessibilityApproval: false },
  D1001: { status: 'TWO_FIRST_COMPLETE_VISIBLE_EN_EDITIONS_READY_FOR_ORDINARY_PUSH',
    ready: bind(`${out}/batch-ready.json`), newCompleteCourses: 0, newSourcePages: 0 },
});
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
fs.appendFileSync(`${ticket}/review.md`,
  '\nD987-D1003/D996/D1000: First complete visible N63/N72 English editions retained:39originalobjects,0tasks,4unchangedSVGfigures. Exact D018/D020 source/Chinese/SCI/figure approvals reused; FIRST EN-SCI/ZHEN and native finalize/render PASS, headeddesktop1440x960/mobile390x844 wholeDOM and19suppliedpixelviews PASS. N63 registered permittivity C^2/(N*m^2) remains inherited localized correction. N72 eight machineChinese labels restored only; Englishcaptions/body/crumb verified, completeEnglishaccessibility explicitly NOTapproved. D999 differingfont rerender unused and wrapperFAIL preserved; D1003 binds actual343/480 sizing to unchangedSVG D998 browsermeasurements, no currentrenderer recreation/equivalence claim orcourse recapture. Nativecanonicaltuples/index insertions PASS, otherrows/header/source/Chinese unchanged. Sole reviewerreceivedonce closed19images,batches7+6+6,parent0opens. Totals153/581 unchanged, coursesalreadycounted; all earlier source/figure/paidHOLDs and previewlimits preserved.\n'
  + '\nD1001: Ordinary explicit-manifest delivery of first N63/N72 English editions with native products/currentfiguremetadata, complete reviewed drafts, savedDOM/pixels/ledgers, original historical-name/label failures and unused differingfont candidate. Prior D985actualpushreceipt joins substantivebatch only. No skill/unrelateddirtyfiles/force/DB/paid/broadtests/merge/deploy/formalhandoff/scopecompletion. N73 first missing English preparation and author recovery already continue locally.\n');
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
  `${ticket}/evidence/reports/d1816-d996-n63-first-complete-en`,
  `${ticket}/evidence/reports/d1816-d1000-n72-first-complete-en`, out,
  ...cards.map(card => `${book}/editions/modern-us-neutral-en/lessons/${card}`),
]) collect(directory);
for (const id of ['fig-134', 'fig-135', 'fig-136', 'fig-137'])
  for (const extension of ['spec.json', 'svg', 'render.json', 'review.json'])
    files.add(path.relative(repo, `${book}/editions/modern-us-neutral-en/figures/${id}.${extension}`));
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
run('d1001-sync-existing-delivery-branch', ['git', 'fetch', 'origin', branch]);
assert.equal(gitRead(['rev-parse', 'FETCH_HEAD']), base);
const pathspec = `${scratch}/delivery.pathspec`;
fs.writeFileSync(pathspec, list.join('\0') + '\0', { flag: 'wx' });
run('d1001-stage-exact-manifest', ['git', 'add', '--pathspec-from-file', pathspec, '--pathspec-file-nul']);
const staged = gitRead(['diff', '--cached', '--name-only']).split('\n').filter(Boolean);
assert(staged.length && staged.every(file => list.includes(file)));
assert(staged.every(file => !/(^|\/)\.env($|\/)|\/skills\/|\/tmp\//.test(file)));
run('d1001-ordinary-substantive-commit', [
  'git', 'commit', '-m', 'STEMROBIN-181: complete first N63 and N72 visible English editions offline',
]);
const head = gitRead(['rev-parse', 'HEAD']);
save(`${scratch}/committed.json`, { task: 'D1001', base, head, branch, files: staged.length });
run('d1001-explicit-ordinary-push', ['git', 'push', 'origin', `HEAD:${branch}`]);
save(`${scratch}/push-exited.json`, {
  task: 'D1001', head, branch, files: staged.length, force: false, exitCode: 0,
  independentRemoteVerificationPending: true,
});
console.log(JSON.stringify({ head, files: staged.length, independentRemoteVerificationPending: true }));

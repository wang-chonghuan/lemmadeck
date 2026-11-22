import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const task = 'D1464', branch = 'codex/STEMROBIN-181-textbooks';
const previous = `${ticket}/evidence/reports/d1816-d1421-four-9p-en/actual-push.json`;
const base = read(previous).head;
const edition = `${repo}/ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral-en`;
const batchPaths = [
  'd1816-d1442-n40-first-complete-en', 'd1816-d1449-n42-first-complete-en',
  'd1816-d1456-n43-first-complete-en', 'd1816-d1463-n46-first-complete-en',
].map(name => `${ticket}/evidence/reports/${name}/batch-ready.json`);
const ready = batchPaths.map(read), cards = ready.flatMap(item => item.cards);
assert.deepEqual(cards, ['phy9-c1-s4-n40', 'phy9-c1-s4-n42', 'phy9-c1-s5-n43', 'phy9-c1-s5-n46']);
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
const before = JSON.parse(gitRead(['show', `${base}:${path.relative(repo, indexFile)}`]));
const after = read(indexFile);
assert.deepEqual(after.lessons.filter(row => !cards.includes(row.id)), before.lessons);
assert.deepEqual({ ...after, lessons: [] }, { ...before, lessons: [] });
assert(cards.every(card => after.lessons.filter(row => row.id === card).length === 1));
const closurePath = `${ticket}/tmp/d1816-d1464-reviewers-closed.json`;
const closure = read(closurePath);
assert(closure.closed && closure.reviewers.length === 6 && closure.parentNewImages === 0);
assert(closure.reviewers.every(row => row.closed && row.actualImages <= 24
  && row.batches.every(count => count <= 8)
  && row.actualImages === row.batches.reduce((sum, count) => sum + count, 0)));
assert.equal(closure.actualIndependentImages, 32);
const out = `${ticket}/evidence/reports/d1816-d1464-four-9p-en`;
const scratch = `${ticket}/tmp/d1816-d1464-delivery`;
fs.mkdirSync(out, { recursive: false });
fs.mkdirSync(scratch, { recursive: false });
copy(`${ticket}/tmp/d1816-d1435-next-surface-humidity-en-inventory/result.json`, `${out}/received-inventory.original.json`);
copy(`${ticket}/tmp/d1816-d1484-surface-humidity-progress/result.json`, `${out}/affected-progress.original.json`);
copy(`${ticket}/tmp/d1816-d1493-surface-humidity-local-progress/result.json`, `${out}/sentence-progress.original.json`);
copy(closurePath, `${out}/reviewers-closed.original.json`);
const previousCall = read(read(previous).nativeReceipt.path);
copy(read(previous).nativeReceipt.path, `${out}/previous-push/receipt.original.json`);
for (const [key, file] of Object.entries(previousCall.streams))
  copy(file.path, `${out}/previous-push/${key}.original.txt`);
for (const name of [
  'n42-native.mjs', 'prepare-d1067-early-9p-first-en.mjs', 'author-d1068-early-9p-first-en.mjs',
  'texts-d1437-humidity-equilibrium-en.mjs', 'texts-d1451-surface-tension-en.mjs',
  'inventory-d1435-surface-humidity-en.mjs',
  'finalize-d997-n72-first-en.mjs', 'display-d998-n72-first-en-full-course.mjs',
  'bind-d1015-n73-original-svg-display-widths.mjs', 'retain-d1000-n72-first-complete-en.mjs',
  'validate-d1000-n72-retained-tuples.py', 'update-edition-index.py',
  'repair-d1485-surface-humidity-readability.mjs', 'texts-d1485-n40-readability.mjs',
  'texts-d1486-n42-readability.mjs', 'texts-d1487-n43-readability.mjs', 'texts-d1488-n46-readability.mjs',
  'record-d1484-surface-humidity-progress.mjs', 'compose-d1490-n42-pixels.mjs',
  'record-d1493-surface-humidity-local-progress.mjs',
  'capture-d1494-n42-mobile-ending.mjs',
  'record-d1496-composition-ledger-wrapper-failure.mjs',
  'record-d1464-surface-humidity-reviewers-closed.mjs',
  'record-ordinary-en-extension-push.mjs', 'push-d1464-four-surface-humidity-en.mjs',
]) copy(`${ticket}/tmp/d1816-recovery/${name}`, `${out}/helpers/${name}`);
const originalObjects = ready.reduce((sum, row) => sum + row.originalObjects, 0);
assert.equal(originalObjects, 76);
save(`${out}/batch-ready.json`, {
  task, base, branch, cards, ready: batchPaths.map(bind), previousPushReceipt: bind(previous),
  nativeIndex: bind(indexFile), originalObjects, originalTasks: 0,
  englishParagraphs: ready.reduce((sum, row) => sum + row.views[0].paragraphs, 0),
  originalSourceFigures: 7, modernAttachedFigureUses: 7, uniqueModernFigures: 7,
  imageLedgers: ready.map(row => bind(row.imageLedger.path)),
  newCompleteCourses: 0, newSourcePages: 0, totals: { completeCourses: 153, sourcePages: 581 },
  reviewersClosed: bind(`${out}/reviewers-closed.original.json`),
  actualIndependentImages: closure.actualIndependentImages, parentNewImages: 0,
  fourFirstReadabilityRevisionsPreserved: true, fourAffectedTextNativeAndIndependentPasses: true,
  n42SentenceSplitAndN43SubjectAffectedRevisionsAndSentenceOnlyRecoveryPreserved: true,
  n42NotationArgumentAndExactFragmentFirstFailuresPreserved: true,
  n42RegisteredPressureCorrectionAndBothProseWorkedExamplesPreserved: true,
  n42AddedApproximateCalculationExplanationsBoundToHistoricalScienceReview: true,
  n42EightPlusTwoDisjointPixelReportsComposedWithoutParentImages: true,
  n42FirstMobileWholeCaptureReviseAndFreshTwoImageEndingResolutionPreserved: true,
  n42CompositionAccountingWrapperFirstFailurePreserved: true,
  originalMobileWholeCaptureNotPromotedAsCorrect: true,
  n40SourceChineseCriticalSubscriptRetainedNotFullEnglishFormulaLocalization: true,
  n46SurfaceNotationAndSingleInterfaceAreaConventionPreserved: true,
  firstEnglishScientificFidelityAndReadabilityReviews: true,
  historicalScienceApprovalInvented: false, historicalChineseScienceBindingGapsPreserved: true,
  existingFigureRendererCalls: 0, unchangedSourceChineseAndAllFigurePixelsReused: true,
  browserMode: 'isolated-headless', headedAcceptanceClaimed: false,
  fullResolutionAllGlyphCertification: false, completeEnglishAccessibilityApproval: false,
  force: false, databaseWrites: 0, paidCalls: 0,
  formalHandoff: false, scopeCompleted: false, continuousProduction: true,
});
const meterFile = `${ticket}/production-meter.json`, reviewFile = `${ticket}/review.md`;
copy(meterFile, `${scratch}/production-meter.before.json`);
copy(reviewFile, `${scratch}/review.before.md`);
const meter = read(meterFile);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 153);
assert.equal(meter.sourcePagesFinalized, 581);
for (const [i, item] of ready.entries()) meter.currentResume1816[item.task] = {
  status: 'FIRST_COMPLETE_EN_EDITION_CANONICAL_RETAINED_READY', ready: bind(batchPaths[i]),
  newCompleteCourses: 0, newSourcePages: 0,
};
meter.currentResume1816[task] = {
  status: 'FIRST_COMPLETE_EN_EDITIONS_READY_FOR_ORDINARY_PUSH',
  ready: bind(`${out}/batch-ready.json`), newCompleteCourses: 0, newSourcePages: 0,
};
meter.currentResume1816.currentContinuation =
  'N40/N42/N43/N46 first English editions retained offline,76originalobjects/0tasks/7unchangedfigures. FourFIRSTreadabilityREVISE andN42/N43sentenceREVISE preserved,affected-onlyPASS. N42firstmobilewholecaptureREVISE preserved withfresh2imageendingevidence;originalwholecapturenotpromotedascorrect. Native/render,desktop/mobileDOM,actualwidths,32boundedpixels andcanonical/indexPASS. Ordinarypushpending;continuousmissing-Englishproductionactive. Counts153/581unchanged;HOLDs/Chinesecriticalsubscript/ARIA/headless/fineglyphlimitsretained.';
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
fs.appendFileSync(reviewFile,
  `\nD1435-D1495: N40/N42/N43/N46 FIRST English editions retained offline:76originalobjects,${ready.reduce((sum, row) => sum + row.views[0].paragraphs, 0)}finalparagraphs,0tasks,7unchangedSVGs. Four genuine firstreadabilityREVISE plusN42/N43sentenceREVISE andaffected-only native/independentPASS retained. N42 omittednotationargument/exactfragmentfirstfailures preserved;registered4.4x10^5pressure andbothworkedexamplesremainprose,addedexplanationsboundtohistoricalsciencereview. N40sourceChinesecriticalsubscript andN46surface/S2-S1=lhretained. N42first8pixelREVISEEN-P1 mobilewholeendingcapture retained;unchangedHTML freshendingviewport andoriginalendingcrop independentlyreviewed in2imagefreshcontext,originalwholecapturenotpromotedascorrect. Native/render,isolatedheadlessdesktop1440x960/mobile390x844DOM,actualwidths,bounded6/8/2/2/6/8pixels andcanonical/indexPASS. Sixreviewersclosed,32opens,onecrop,parent0. N46mobilelongequationinteractionuntested;fineglyph/ARIA/headlesslimitsretained. Previousactualpushreceiptincludedonlywithsubstantivebatch. Counts153/581unchanged;historicalbindinggaps,HOLDs,sourceARIA,formula-language,headless/fineglyphlimitspreserved. No unrelateddirty/skills/DB/paid/broadtests/force/merge/deploy/formalhandoff/scopecompletion;continuousproductionactive.\n`);
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
run('d1464-sync-existing-delivery-branch', ['git', 'fetch', 'origin', branch]);
assert.equal(gitRead(['rev-parse', 'FETCH_HEAD']), base);
const pathspec = `${scratch}/delivery.pathspec`;
fs.writeFileSync(pathspec, list.join('\0') + '\0', { flag: 'wx' });
run('d1464-stage-exact-manifest', ['git', 'add', '--pathspec-from-file', pathspec, '--pathspec-file-nul']);
const staged = gitRead(['diff', '--cached', '--name-only']).split('\n').filter(Boolean);
assert(staged.length && staged.every(file => list.includes(file)));
run('d1464-ordinary-substantive-commit', ['git', 'commit', '-m',
  'STEMROBIN-181: complete N40, N42, N43 and N46 English editions offline']);
const head = gitRead(['rev-parse', 'HEAD']);
save(`${scratch}/committed.json`, { task, base, head, branch, files: staged.length });
run('d1464-explicit-ordinary-push', ['git', 'push', 'origin', `HEAD:refs/heads/${branch}`]);
save(`${scratch}/push-exited.json`, {
  task, head, branch, files: staged.length, force: false, exitCode: 0, independentRemoteVerificationPending: true,
});

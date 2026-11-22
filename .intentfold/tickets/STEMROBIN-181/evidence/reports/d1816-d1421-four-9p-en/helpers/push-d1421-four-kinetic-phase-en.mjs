import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const task = 'D1421', branch = 'codex/STEMROBIN-181-textbooks';
const previous = `${ticket}/evidence/reports/d1816-d1381-four-9p-en/actual-push.json`;
const base = read(previous).head;
const edition = `${repo}/ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral-en`;
const batchPaths = [
  'd1816-d1399-n34-first-complete-en', 'd1816-d1406-n35-first-complete-en',
  'd1816-d1413-n38-first-complete-en', 'd1816-d1420-n39-first-complete-en',
].map(name => `${ticket}/evidence/reports/${name}/batch-ready.json`);
const ready = batchPaths.map(read), cards = ready.flatMap(item => item.cards);
assert.deepEqual(cards, ['phy9-c1-s3-n34', 'phy9-c1-s3-n35', 'phy9-c1-s4-n38', 'phy9-c1-s4-n39']);
const gitRead = args => {
  const result = spawnSync('git', args, { cwd: repo, encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
};
assert.equal(gitRead(['rev-parse', 'HEAD']), base);
assert.equal(gitRead(['diff', '--cached', '--name-only']), '');
for (const [index, item] of ready.entries()) {
  assert.equal(item.newCompleteCourses, 0);
  assert.equal(item.newSourcePages, 0);
  assert.equal(read(item.pixelReview.path).status, 'PASS');
  for (const file of [item.pixelReview, item.imageLedger,
    ...item.products.filter(product => !product.path.endsWith('/book.json'))]) {
    const actual = bind(file.path);
    if (actual.sha256 === file.sha256) continue;
    assert(index === 2 && /\/figures\/fig-55\.(spec|render|review)\.json$/.test(file.path));
    const key = /fig-55\.(spec|render|review)\.json$/.exec(file.path)[1];
    const later = ready[3].products.find(product => product.path === file.path);
    assert(later);
    assert.equal(actual.sha256, later.sha256);
    const proof = read(`${path.dirname(batchPaths[3])}/canonical-binding-proof.json`);
    const reconciliation = proof.sharedReconciliations.find(row => row.id === 'fig-55');
    assert.equal(reconciliation.changedLessonContextOnly, 'phy9-c1-s4-n39');
    assert.equal(reconciliation.inheritedContextUnchanged, true);
    assert.equal(reconciliation.priorTuple[key].sha256, file.sha256);
  }
}
const indexFile = `${edition}/book.json`;
const before = JSON.parse(gitRead(['show', `${base}:${path.relative(repo, indexFile)}`]));
const after = read(indexFile);
assert.deepEqual(after.lessons.filter(row => !cards.includes(row.id)), before.lessons);
assert.deepEqual({ ...after, lessons: [] }, { ...before, lessons: [] });
assert(cards.every(card => after.lessons.filter(row => row.id === card).length === 1));
const closurePath = `${ticket}/tmp/d1816-d1421-reviewers-closed.json`;
const closure = read(closurePath);
assert(closure.closed && closure.reviewers.length >= 4 && closure.parentNewImages === 0);
assert(closure.reviewers.every(row => row.closed && row.actualImages <= 24
  && row.batches.every(count => count <= 8)
  && row.actualImages === row.batches.reduce((sum, count) => sum + count, 0)));
const out = `${ticket}/evidence/reports/d1816-d1421-four-9p-en`;
const scratch = `${ticket}/tmp/d1816-d1421-delivery`;
fs.mkdirSync(out, { recursive: false });
fs.mkdirSync(scratch, { recursive: false });
copy(`${ticket}/tmp/d1816-d1392-next-kinetic-phase-en-inventory/result.json`, `${out}/received-inventory.original.json`);
copy(`${ticket}/tmp/d1816-d1427-repair-lookup-first-failure.json`, `${out}/n35-author-lookup-failure.original.json`);
copy(`${ticket}/tmp/d1816-d1426-save-first-failure.json`, `${out}/progress-save-failure.original.json`);
copy(closurePath, `${out}/reviewers-closed.original.json`);
for (const directory of [
  'd1816-d1479-n39-retention-review-path-recovery',
  'd1816-d1480-n39-partial-retention-recovery',
  'd1816-d1481-closure-ledger-shape-recovery',
]) {
  for (const name of fs.readdirSync(`${ticket}/tmp/${directory}`))
    copy(`${ticket}/tmp/${directory}/${name}`, `${out}/technical-recovery/${directory}/${name}`);
}
const previousCall = read(read(previous).nativeReceipt.path);
copy(read(previous).nativeReceipt.path, `${out}/previous-push/receipt.original.json`);
for (const [key, file] of Object.entries(previousCall.streams))
  copy(file.path, `${out}/previous-push/${key}.original.txt`);
for (const name of [
  'n42-native.mjs', 'prepare-d1067-early-9p-first-en.mjs', 'author-d1068-early-9p-first-en.mjs',
  'texts-d1394-kinetic-phase-en.mjs', 'inventory-d1392-kinetic-phase-en.mjs',
  'texts-d1354-heat-and-many-particles-en.mjs', 'texts-d1309-next-four-thermal-en.mjs',
  'texts-d1275-n1-n2-n3.mjs', 'texts-d1247-n7-n49.mjs', 'texts-d1136-n56-n57.mjs',
  'texts-d1158-10p-n10.mjs', 'texts-d1179-n9-n15.mjs',
  'finalize-d997-n72-first-en.mjs', 'display-d998-n72-first-en-full-course.mjs',
  'bind-d1015-n73-original-svg-display-widths.mjs', 'retain-d1000-n72-first-complete-en.mjs',
  'validate-d1000-n72-retained-tuples.py', 'update-edition-index.py',
  'repair-d1385-heat-particle-findings.mjs', 'repair-d1427-first-lookup-failed-original.mjs',
  'record-d1426-kinetic-phase-stage-progress.mjs', 'record-d1426-first-save-failed-original.mjs',
  'record-d1431-kinetic-phase-current-progress.mjs', 'compose-d1432-n35-pixels.mjs',
  'repair-d1466-n39-unit-joiners.mjs', 'display-d1469-n39-affected-units.mjs',
  'compose-d1471-n39-unit-pixels.mjs', 'recover-d1472-n39-isolated-work.mjs',
  'repair-d1474-n39-unit-value-lines.mjs',
  'record-d1478-current-kinetic-phase-progress.mjs',
  'record-d1479-n39-retention-review-path-failure.mjs',
  'recover-d1480-n39-partial-retention.mjs',
  'record-d1481-closure-ledger-shape-failure.mjs',
  'record-d1421-kinetic-phase-reviewers-closed.mjs',
  'record-ordinary-en-extension-push.mjs', 'push-d1421-four-kinetic-phase-en.mjs',
]) copy(`${ticket}/tmp/d1816-recovery/${name}`, `${out}/helpers/${name}`);
save(`${out}/batch-ready.json`, {
  task, base, branch, cards, ready: batchPaths.map(bind), previousPushReceipt: bind(previous),
  nativeIndex: bind(indexFile), originalObjects: ready.reduce((sum, row) => sum + row.originalObjects, 0),
  englishParagraphs: ready.reduce((sum, row) => sum + row.views[0].paragraphs, 0),
  originalTasks: 0, originalSourceFigures: 7, modernAttachedFigureUses: 8,
  uniqueModernFigures: 7, imageLedgers: ready.map(row => bind(row.imageLedger.path)),
  newCompleteCourses: 0, newSourcePages: 0, totals: { completeCourses: 153, sourcePages: 581 },
  reviewersClosed: bind(`${out}/reviewers-closed.original.json`),
  actualIndependentImages: closure.actualIndependentImages, parentNewImages: 0,
  firstEnglishScientificFidelityAndReadabilityReviews: true,
  historicalScienceApprovalInvented: false, historicalChineseScienceBindingGapsPreserved: true,
  n34GeneratedPortraitRemainsDecorative160Px: true,
  n34ThreeLocalFindingsResolvedAffectedOnly: true,
  n35OriginalSciencePassAndFourReadabilityFindingsPreserved: true,
  n38ThreeRegisteredV2VaporV1LiquidErrataPreserved: true,
  n39OriginalScienceFailureAndCurrentCriticalStateConditionsPreserved: true,
  n39SourceMathSubscriptAndFigureOrderFirstDisplayFailuresPreserved: true,
  n39SourceChineseCriticalSubscriptsRetainedNotCompleteEnglishFormulaLocalization: true,
  n39FirstPixelUnitWrappingRevisePreservedAffectedTwoUnitClipsOnlyAfterRepair: true,
  n39FailedWordJoinersPreservedAndFinalOnlyTwoValueLineIntroductionsChanged: true,
  n35DisjointEightPlusTwoPixelReportsComposedWithoutParentImageReview: true,
  sharedFigure55PreservesBothReviewedEnglishContexts: true,
  sharedFigure55CurrentCanonicalProof: bind(`${path.dirname(batchPaths[3])}/canonical-binding-proof.json`),
  originalN38N39AuthorFailuresAndAffectedRecoveryPreserved: true,
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
  'N34/N35/N38/N39 first English editions retained offline,69originalobjects,zero tasks,7unique unchanged figures(6SVG/1decorative160pxPNG;shared55usedtwice). Independent English science/readability,native finalize/render,desktop/mobile DOM,actual-width bindings,bounded pixels and canonical/index evidence passed. First failures,source/Chinese history and glyph/binding limitations retained. Ordinary push pending;continuous missing-English production remains active. Totals153/581unchanged.';
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
fs.appendFileSync(reviewFile,
  `\nD1392-D1434: N34/N35/N38/N39 FIRST complete English editions retained offline:69originalobjects,${ready.reduce((sum, row) => sum + row.views[0].paragraphs, 0)}finalparagraphs,0tasks,7unique unchanged figures(6SVG/1decorative160pxPNG;shared55usedtwice). Source/fourChinese/sourcepage historical commit-byte bindings reused without review replay. N34 three local findings and N35 four readability areas resolved by affected-only review;N38 first formula-token-order and N39 cover2-digit failures preserved with local recovery. N35 caption DOM failure and N39 source-subscript/asset-order display failures retained with original executed helpers; recovered checks change noHTML/prose/native/SVG. N35 bounded8+2 disjoint pixel reports composed without new review. N38 three registered V2-vapor/V1-liquid errata and N39 critical-state conditions remain sourcebound;shared55 preserves both English contexts. N39 original Chinese critical subscripts remain visible mathematical notation, not fullEnglishformula/accessibility localization. FIRST independent English science/fidelity/readability,native finalize/render,isolatedheadless desktop1440x960/mobile390x844DOM,actualwidth metadata,bounded savedpixels and canonical/index PASS. All assigned reviewersclosed,parent0newimages. Prior actualpushreceipt included only in substantivebatch,no receipt-onlycommit. Counts153/581unchanged;historicalsciencegaps,HOLDs,headless/tallpreview/fineglyph/sourceARIA/formula-language limitations retained. No unrelateddirty/skills/DB/paid/broadtests/force/merge/deploy/formalhandoff/scopecompletion;continuousproductionactive.\n`);
fs.appendFileSync(reviewFile,
  '\nD1466-D1481: N39 original8-image unit-wrapping REVISE retained. Six WordJoiners passed text/native but genuinely failed affected geometry; not promoted. Final repair removes alljoiners and changes onlytwo pressure-value introductioncolons/newlines. Independent affectedtextPASS/nativePASS/desktop-mobile same-linegeometryPASS plus fresh2-clip pixelPASS resolves EN39-P1 only; original wholepage/figure evidence remains unchanged. Composed8+2 evidence uses separate contexts, no reopens/crops/parentimages. N39retention scratch-relative/retained-relative reviewpath failures and closure-ledger batch-object shape failure preserved with exacthelpers, partialfiles reused by exacthash without rerender; recoveryhelper fig55-order assumption failed beforewrites and was corrected from actualfig56-first nativeorder, shared55untouched. Canonicaltuples/nativeindexPASS and allsix reviewersclosed:34independentopens in6/8/2/8/8/2 contexts,parent0. Original sourceChinesecriticalsubscripts/ARIA/fineglyph/headless limits remain; no broadtests/DB/paid/skills/force/merge/deploy/formalhandoff/scopecompletion. Fourcourse ordinary substantivepush follows; continuousproduction remainsactive.\n');
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
run('d1421-sync-existing-delivery-branch', ['git', 'fetch', 'origin', branch]);
assert.equal(gitRead(['rev-parse', 'FETCH_HEAD']), base);
const pathspec = `${scratch}/delivery.pathspec`;
fs.writeFileSync(pathspec, list.join('\0') + '\0', { flag: 'wx' });
run('d1421-stage-exact-manifest', ['git', 'add', '--pathspec-from-file', pathspec, '--pathspec-file-nul']);
const staged = gitRead(['diff', '--cached', '--name-only']).split('\n').filter(Boolean);
assert(staged.length && staged.every(file => list.includes(file)));
run('d1421-ordinary-substantive-commit', ['git', 'commit', '-m',
  'STEMROBIN-181: complete N34, N35, N38 and N39 English editions offline']);
const head = gitRead(['rev-parse', 'HEAD']);
save(`${scratch}/committed.json`, { task, base, head, branch, files: staged.length });
run('d1421-explicit-ordinary-push', ['git', 'push', 'origin', `HEAD:refs/heads/${branch}`]);
save(`${scratch}/push-exited.json`, {
  task, head, branch, files: staged.length, force: false, exitCode: 0, independentRemoteVerificationPending: true,
});
console.log(JSON.stringify({ head, files: staged.length, independentRemoteVerificationPending: true }));

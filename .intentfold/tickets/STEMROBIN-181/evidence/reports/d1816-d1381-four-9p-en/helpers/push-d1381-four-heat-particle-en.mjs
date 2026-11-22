import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const task = 'D1381', branch = 'codex/STEMROBIN-181-textbooks';
const previous = `${ticket}/evidence/reports/d1816-d1336-four-9p-en/actual-push.json`;
const base = read(previous).head;
const edition = `${repo}/ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral-en`;
const batchPaths = [
  'd1816-d1359-n22-first-complete-en', 'd1816-d1366-n25-first-complete-en',
  'd1816-d1373-n26-first-complete-en', 'd1816-d1380-n29-first-complete-en',
].map(name => `${ticket}/evidence/reports/${name}/batch-ready.json`);
const ready = batchPaths.map(read), cards = ready.flatMap(item => item.cards);
assert.deepEqual(cards, ['phy9-c1-s2-n22', 'phy9-c1-s2-n25', 'phy9-c1-s2-n26', 'phy9-c1-s3-n29']);
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
const closurePath = `${ticket}/tmp/d1816-d1381-reviewers-closed.json`;
const closure = read(closurePath);
assert(closure.closed && closure.reviewers.length === 4 && closure.parentNewImages === 0);
assert(closure.reviewers.every(row => row.closed && row.actualImages <= 24
  && row.batches.every(count => count <= 8)
  && row.actualImages === row.batches.reduce((sum, count) => sum + count, 0)));
const out = `${ticket}/evidence/reports/d1816-d1381-four-9p-en`;
const scratch = `${ticket}/tmp/d1816-d1381-delivery`;
fs.mkdirSync(out, { recursive: false });
fs.mkdirSync(scratch, { recursive: false });
copy(`${ticket}/tmp/d1816-d1342-next-four-en-inventory/result.json`, `${out}/received-inventory.original.json`);
copy(`${ticket}/tmp/d1816-d1352-next-four-syntax-proposal/result.json`, `${out}/syntax-proposal.original.json`);
copy(`${ticket}/tmp/d1816-d1353-preparation-failure/result.json`, `${out}/historical-relocation-failure.original.json`);
copy(`${ticket}/tmp/d1816-d1368-name-map-failure/result.json`, `${out}/historical-name-map-failure.original.json`);
copy(`${ticket}/tmp/d1816-d1384-pointer-failure.json`, `${out}/n25-author-pointer-failure.original.json`);
copy(`${ticket}/tmp/d1816-d1388-generated-dispatch-failure.json`, `${out}/n26-generated-dispatch-failure.original.json`);
copy(`${ticket}/tmp/d1816-d1391-n26-retention-history-reference-recovery/first-failure.json`,
  `${out}/n26-retention-history-reference-failure.original.json`);
copy(`${ticket}/tmp/d1816-d1391-n26-retention-history-reference-recovery/retain.failed-original.mjs`,
  `${out}/helpers/retain.history-reference-failed-original.mjs`);
copy(closurePath, `${out}/reviewers-closed.original.json`);
const previousCall = read(read(previous).nativeReceipt.path);
copy(read(previous).nativeReceipt.path, `${out}/previous-push/receipt.original.json`);
for (const [key, file] of Object.entries(previousCall.streams))
  copy(file.path, `${out}/previous-push/${key}.original.txt`);
for (const name of [
  'n42-native.mjs', 'prepare-d1067-early-9p-first-en.mjs', 'author-d1068-early-9p-first-en.mjs',
  'texts-d1354-heat-and-many-particles-en.mjs', 'texts-d1309-next-four-thermal-en.mjs',
  'texts-d1275-n1-n2-n3.mjs', 'texts-d1247-n7-n49.mjs', 'texts-d1136-n56-n57.mjs',
  'texts-d1158-10p-n10.mjs', 'texts-d1179-n9-n15.mjs',
  'finalize-d997-n72-first-en.mjs', 'display-d998-n72-first-en-full-course.mjs',
  'bind-d1015-n73-original-svg-display-widths.mjs', 'retain-d1000-n72-first-complete-en.mjs',
  'validate-d1000-n72-retained-tuples.py', 'update-edition-index.py',
  'record-d1381-four-reviewers-closed.mjs',
  'record-ordinary-en-extension-push.mjs', 'push-d1381-four-heat-particle-en.mjs',
]) copy(`${ticket}/tmp/d1816-recovery/${name}`, `${out}/helpers/${name}`);
save(`${out}/batch-ready.json`, {
  task, base, branch, cards, ready: batchPaths.map(bind), previousPushReceipt: bind(previous),
  nativeIndex: bind(indexFile), originalObjects: ready.reduce((sum, row) => sum + row.originalObjects, 0),
  englishParagraphs: ready.reduce((sum, row) => sum + row.views[0].paragraphs, 0),
  originalTasks: 0, originalFigures: 8, imageLedgers: ready.map(row => bind(row.imageLedger.path)),
  newCompleteCourses: 0, newSourcePages: 0, totals: { completeCourses: 153, sourcePages: 581 },
  reviewersClosed: bind(`${out}/reviewers-closed.original.json`),
  actualIndependentImages: closure.actualIndependentImages, parentNewImages: 0,
  firstEnglishScientificFidelityAndReadabilityReviews: true,
  historicalScienceApprovalInvented: false, historicalChineseScienceBindingGapsPreserved: true,
  historicalIndependentReviewNonPathFieldsAndHashesUnchanged: true,
  n22HistoricalSourceRelocationAndEnglishMax640Explicit: true,
  n26MixedModesAndFullGroupedContextWhitespaceReconciliationExplicit: true,
  n29Chapter3SectionNullAndUnresolvedSourceGlyphPreserved: true,
  n22ThreeReadabilityFindingsResolvedAffectedOnly: true,
  n25ParagraphOpeningResolvedAffectedOnly: true,
  n26AdiabaticWorkWordingResolvedAffectedOnly: true,
  n29IntroductoryTerminologyResolvedAffectedOnly: true,
  n26OriginalAssetPathAndAriaExpectationFailuresPreserved: true,
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
  'N22/N25/N26/N29 first English editions retained offline, 69 original objects, zero tasks, 8 unchanged figures (7SVG/1PNG). Independent English science/readability, native finalize/render, desktop/mobile DOM, actual-width bindings, bounded pixels and canonical/index evidence passed. Source/Chinese history and glyph/binding limitations retained. Ordinary push pending; continuous missing-English production remains active. Totals153/581 unchanged.';
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
fs.appendFileSync(reviewFile,
  '\nD1352-D1391: N22/N25/N26/N29 FIRST complete English editions retained offline:69originalobjects,102finalparagraphs,0tasks,8unchangedfigures(7SVG/1PNG). Historical independent-review path-only relocation retained with all non-path fields/hashes unchanged; original D1353 failure preserved. Historical science binding gaps remain, no Chinese approval invented. N22 math-token-order failure and affected three readability findings, N25 paragraph-opening finding/pointer failure, N26 Diesel map failure/adiabatic-work wording/retired asset-path native failure/helper dispatch failure/source-ARIA expectation failure/retention historical-reference failure, N29 terminology finding are preserved with only affected recoveries. Exact source/Chinese/pixels reused; current English contexts and actual640/358mediawidths bound without rerender. FIRST English science/fidelity/readability, native finalize/render, isolatedheadless desktop1440x960/mobile390x844DOM, four bounded8-image saved-pixel reviews and canonical/index PASS. Allfourreviewersclosed,parent0newimages. Headed/allglyph/completeEnglishaccessibility not approved; tallpreview/fineglyph/sourceglyph/paidHOLD limits retained. Prior actualpushreceipt included only in substantivebatch; no receipt-onlycommit/unrelateddirty/skills/DB/paid/broadtests/force/merge/deploy/formalhandoff/scopecompletion. Totals153/581unchanged; continuousproduction remainsactive.\n');
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
run('d1381-sync-existing-delivery-branch', ['git', 'fetch', 'origin', branch]);
assert.equal(gitRead(['rev-parse', 'FETCH_HEAD']), base);
const pathspec = `${scratch}/delivery.pathspec`;
fs.writeFileSync(pathspec, list.join('\0') + '\0', { flag: 'wx' });
run('d1381-stage-exact-manifest', ['git', 'add', '--pathspec-from-file', pathspec, '--pathspec-file-nul']);
const staged = gitRead(['diff', '--cached', '--name-only']).split('\n').filter(Boolean);
assert(staged.length && staged.every(file => list.includes(file)));
run('d1381-ordinary-substantive-commit', ['git', 'commit', '-m',
  'STEMROBIN-181: complete N22, N25, N26 and N29 English editions offline']);
const head = gitRead(['rev-parse', 'HEAD']);
save(`${scratch}/committed.json`, { task, base, head, branch, files: staged.length });
run('d1381-explicit-ordinary-push', ['git', 'push', 'origin', `HEAD:refs/heads/${branch}`]);
save(`${scratch}/push-exited.json`, {
  task, head, branch, files: staged.length, force: false, exitCode: 0, independentRemoteVerificationPending: true,
});
console.log(JSON.stringify({ head, files: staged.length, independentRemoteVerificationPending: true }));

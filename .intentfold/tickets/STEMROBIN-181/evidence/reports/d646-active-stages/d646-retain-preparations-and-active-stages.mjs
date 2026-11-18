import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  ticket, evidence, indexPath, absolute, bytes, read, bind, verify,
  immutableWrite, walk, lookup,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const base = `${ticket}/tmp`, meterPath = `${ticket}/production-meter.json`;
const beforeIndex = await bytes(indexPath), beforeMeter = await bytes(meterPath);
const index = JSON.parse(beforeIndex), meter = JSON.parse(beforeMeter);
const retained = [], reused = [];
async function retain(file, suffix) {
  const original = await bind(file), prior = lookup(index, file, original.sha256);
  if (prior) {
    await verify(prior, original.sha256);
    reused.push({ path: prior, sha256: original.sha256, originalPath: file });
    return;
  }
  const destination = `${evidence}/reports/d646-active-stages/${suffix}`;
  await immutableWrite(destination, await bytes(file));
  const row = { ...await bind(destination), originalPath: file, batch: 'D033' };
  index.reports.push(row);
  retained.push(row);
}
for (const name of ['d638-n78-first-closed-source-text-author',
  'd639-n78-first-source-preparation', 'd644-source210-first-preparation']) {
  for (const file of await walk(`${base}/${name}`)) await retain(file, `${name}/${path.relative(`${base}/${name}`, file)}`);
}
for (const name of [
  'd638-consume-source209-and-returned-gates.mjs', 'd639-prepare-n78-first-scoped-source.mjs',
  'd640-finish-n78-preparation-without-native-replay.mjs', 'd643-promote-n76-reviewed-offline-card.mjs',
  'd644-prepare-source210-first-continuation.mjs', 'd646-retain-preparations-and-active-stages.mjs',
]) await retain(`${base}/${name}`, name);
const find = file => {
  const row = [...retained, ...reused].find(entry => absolute(entry.originalPath) === absolute(file));
  assert.ok(row, file);
  return row;
};
const stages = meter.activeHumanDirection.nextSourceCheckpoints;
Object.assign(stages.n78, {
  firstScopedPreparation: find(`${base}/d638-n78-first-closed-source-text-author/preparation-manifest.json`),
  firstPreparationFreeze: find(`${base}/d638-n78-first-closed-source-text-author/requirements-freeze.json`),
  firstTextAuthor: find(`${base}/d638-n78-first-closed-source-text-author/report.json`),
  firstTextAuthorFreeze: find(`${base}/d638-n78-first-closed-source-text-author/author-freeze.json`),
  firstAuthorBatch: 'd638', firstIndependentTextReviewBatch: 'd641',
  SCI: 'FIRST-INDEPENDENT-REVIEW-IN-PROGRESS', ZHEN: 'FIRST-INDEPENDENT-REVIEW-IN-PROGRESS',
  FIG: 'PENDING-FIRST-MODERN', DISPLAY: 'NOT-RUN',
  parallelPreparationDeviation: {
    status: 'RETAINED-DUPLICATE-PREPARATION-NOT-SELECTED',
    originalWorkDiscovered: 'Existing Halley d638 author returned after the parent had prepared d639 and dispatched d641.',
    duplicatePreparation: find(`${base}/d639-n78-first-source-preparation/manifest.json`),
    duplicateNativeRuns: ['assemble', 'adapt-prepare'],
    duplicateHelperFailurePreserved: true, newAuthorInterrupted: true,
    currentAuthorSelected: 'Original d638 frozen candidate; d641 redirected to first independent text review.',
    noBytesDiscarded: true,
  },
});
Object.assign(stages.n77, { firstWholeCardDisplayBatch: 'd642', DISPLAY: 'FIRST-DOM-CAPTURE-IN-PROGRESS' });
stages.source210 = {
  status: 'FIRST-PREPARED-AUTHOR-d645-IN-PROGRESS-NOT-APPROVED',
  firstPreparation: find(`${base}/d644-source210-first-preparation/manifest.json`),
  SOURCE: 'PENDING', RAW: 'PENDING', SVG: 'PENDING', sourcePagesAdded: 0, completeCard: false,
};
for (const [id, batch, scope, maximumImages] of [
  ['01a1eec1-62dd-7ca0-8112-bb6c6b3be1b2', 'd641', 'N78-first-independent-text-review-after-author-redirection', 0],
  ['01a1eec2-71eb-7422-a3c5-c5feacb6cba9', 'd642', 'N77-first-whole-card-DOM-capture', 0],
  ['01a1eec4-bbde-7360-97cc-c0f52e2625ca', 'd645', 'SOURCE210-first-author', 8],
]) {
  assert.ok(!meter.activeHumanDirection.ephemeralImageBatches.some(row => row.id === id));
  meter.activeHumanDirection.ephemeralImageBatches.push({
    id, batch, scope, maximumImages, actualImages: null, initialImages: 0, contextLimit: 24,
    status: 'ASSIGNED-REPORT-PENDING-NOT-APPROVED', freshWithoutImageHistory: true,
    lifetime: 'SINGLE-BOUNDED-BATCH-CLOSE-AFTER-RETURN', permanentWorker: false,
    parentReceivesImages: false, imagesReturnedToParent: 0, resetsAnyOldBudget: false,
  });
}
meter.activeHumanDirection.ephemeralImageBatches.push({
  id: '01a1eebd-61e4-7d61-b47c-331e8e3633a1', batch: 'd638-author',
  scope: 'N78-first-closed-source-bilingual-text-author', maximumImages: 0,
  actualImages: 0, initialImages: 0, contextLimit: 24, status: 'COMPLETED-CLOSED',
  lifetime: 'SINGLE-BOUNDED-BATCH-CLOSE-AFTER-RETURN', permanentWorker: false,
  parentReceivesImages: false, imagesReturnedToParent: 0, resetsAnyOldBudget: false,
});
const receiptPath = `${evidence}/reports/d646-active-stages-retained.json`;
await immutableWrite(receiptPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033', retained, reused,
  n76: stages.n76.readiness, completeUnbatchedCards: meter.currentCheckpoint.completeUnbatchedCards,
  n77: { CHOICE: stages.n77.CHOICE, native: stages.n77.native, DISPLAY: stages.n77.DISPLAY },
  n78: stages.n78, source210: stages.source210,
  sourcePagesFinalized: 441, completeDeliveredCards: 98,
  parentImageCount: 24, newParentImages: 0, oldBudgetReset: false,
  existingFAILHOLDPreserved: true, paidGeneration: 0, nativeReplays: 0,
  newPermanentWorkersWorktreesBranches: 0, DBMergeDeploy: false,
}));
const receipt = await bind(receiptPath);
index.reports.push({ ...receipt, batch: 'D033' });
Object.assign(meter.currentCheckpoint.nextBatch, { latestProgress: receipt });
assert.deepEqual(await bytes(indexPath), beforeIndex);
assert.deepEqual(await bytes(meterPath), beforeMeter);
index.updatedAt = meter.updatedAt = new Date().toISOString();
await fs.writeFile(absolute(indexPath), serialize(index));
await fs.writeFile(absolute(meterPath), serialize(meter));
console.log(JSON.stringify({ receipt, completeUnbatchedCards: meter.currentCheckpoint.completeUnbatchedCards }));

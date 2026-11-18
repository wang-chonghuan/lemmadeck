import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  ticket, evidence, indexPath, absolute, bytes, read, bind, verify,
  exists, immutableWrite, walk, lookup,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const base = `${ticket}/tmp`;
const reviewFolder = `${base}/d575-source204-first-independent-review`;
const author = `${base}/d570-source204-first-author`;
for (const [file, sha] of [
  [`${reviewFolder}/report.json`, '000a788b79fec1d627e7ddc9336bc3d04b32b944caf8cb310ac35cc11440bf33'],
  [`${reviewFolder}/review-freeze.json`, '695f6b9d550995efa6c0fccb73e8d2cc1076449b8e4e9d1abf41379be7fd7538'],
  [`${author}/author-freeze.json`, '24fb81eb5853d70724fa71a6fc84bd4c0e069b7af0e29e231e9958f1fe1555f8'],
  [`${base}/d582-n76-first-bilingual-text-author/report.json`, '111fad1a0d63af92771c095ad81176a7248d6a892abd5e66747962ed5c48afc7'],
  [`${base}/d582-n76-first-bilingual-text-author/author-freeze.json`, 'e4d736e1f90e5c97351f908da89067d3f39ed534f6a98c82cc35ce7ea58ee98c'],
  [`${base}/d578-n75-fig166167-first-modern-author/report.json`, '439dddcdd69a3b3454f962a100b09c397c14069071a5fe80be8023840fcbacdf'],
  [`${base}/d578-n75-fig166167-first-modern-author/author-freeze.json`, '145350c59c20b5420e634424656b1f73e77057421de226839806e2a8ed591adb'],
  [`${base}/d579-source205-first-author/report.json`, '45deae31d2b6907fa8af00bdd9d374fe7986b876834c3e7860699606acc342f2'],
  [`${base}/d579-source205-first-author/author-freeze.json`, '11cbf4f9393eba7562d39f2f0ff736c7045407bbba1ddbf580fb8747ba38c824'],
]) await verify(file, sha);
const review = await read(`${reviewFolder}/report.json`);
for (const gate of ['SOURCE204', 'N76_RIGHT_BOUNDARY']) {
  assert.equal(review.gates[gate].status, 'PASS');
  assert.deepEqual(review.gates[gate].blocking_list, []);
}
for (const row of (await read(`${reviewFolder}/review-freeze.json`)).entries) {
  await verify(row.path, row.sha256);
}
const canonical = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const outputs = [];
for (const row of review.reviewed_native_artifacts) {
  await verify(row.path, row.sha256);
  const destination = `${canonical}/pages/0204/${path.basename(row.path)}`;
  await immutableWrite(destination, await bytes(row.path));
  outputs.push({ ...await bind(destination), originalPath: row.path });
}
const meterPath = `${ticket}/production-meter.json`;
const beforeIndex = await bytes(indexPath), beforeMeter = await bytes(meterPath);
const index = JSON.parse(beforeIndex), meter = JSON.parse(beforeMeter);
assert.equal(meter.currentCheckpoint.sourcePagesFinalized, 435);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 98);
const oldCounts = structuredClone(meter.activeHumanDirection.currentImageCounts);
const retained = [], reused = [];
async function retain(file, suffix) {
  const original = await bind(file), prior = lookup(index, file, original.sha256);
  if (prior) {
    await verify(prior, original.sha256);
    reused.push({ path: prior, sha256: original.sha256, originalPath: file });
    return;
  }
  const destination = `${evidence}/reports/d588-source204-and-first-n76/${suffix}`;
  await immutableWrite(destination, await bytes(file));
  const row = { ...await bind(destination), originalPath: file, batch: 'D033' };
  index.reports.push(row);
  retained.push(row);
}
for (const folder of [
  reviewFolder, `${base}/d578-n75-fig166167-first-modern-author`,
  `${base}/d579-source205-first-author`, `${base}/d581-n76-first-source-preparation`,
  `${base}/d582-n76-first-bilingual-text-author`, `${base}/d587-source206-first-preparation`,
]) {
  for (const file of await walk(folder)) {
    await retain(file, `${path.basename(folder)}/${path.relative(folder, file)}`);
  }
}
for (const name of [
  'd581-prepare-n76-first-scoped-source.mjs', 'd582-author-n76-first-bilingual-text.mjs',
  'd583-retain-n76-first-preparation-failure.mjs', 'd583-n76-first-preparation-failure.json',
  'd583-n76-first-preparation-failed-helper.mjs', 'd587-prepare-first-source206.mjs',
  'd588-consume-source204-and-first-n76.mjs',
]) await retain(`${base}/${name}`, name);
const find = file => {
  const row = [...retained, ...reused].find(entry => absolute(entry.originalPath) === absolute(file));
  assert.ok(row, file);
  return row;
};
const stages = meter.activeHumanDirection.nextSourceCheckpoints;
Object.assign(stages.source204, {
  status: 'FIRST-INDEPENDENT-SOURCE204-AND-LOCAL-N76-RIGHT-BOUNDARY-PASS-CONSUMED',
  SOURCE: 'PASS', RAW: 'NOT-APPLICABLE', SVG: 'NOT-APPLICABLE',
  firstIndependentReview: find(`${reviewFolder}/report.json`),
  firstIndependentFreeze: find(`${reviewFolder}/review-freeze.json`),
  sourcePagesAdded: 1, n77Complete: false,
  source204205Join: 'PENDING-FIRST-REVIEW-NO-FAITHFUL-FLAG-EDIT',
});
Object.assign(stages.n76, {
  rightBoundary: 'PASS-FIRST-INDEPENDENT-ACTUAL-p0204#1',
  firstRightBoundaryReview: find(`${reviewFolder}/report.json`),
  retainedReviewerDependency: 'd575 SOURCE203 pending preserved verbatim; separately resolved by existing d580 consumed SOURCE203 PASS, no re-review.',
  firstPreparation: find(`${base}/d581-n76-first-source-preparation/manifest.json`),
  firstPreparationFailure: find(`${base}/d583-n76-first-preparation-failure.json`),
  firstTextAuthor: find(`${base}/d582-n76-first-bilingual-text-author/report.json`),
  firstTextAuthorFreeze: find(`${base}/d582-n76-first-bilingual-text-author/author-freeze.json`),
  SCI: 'FIRST-INDEPENDENT-REVIEW-RUNNING-d585',
  ZHEN: 'FIRST-INDEPENDENT-REVIEW-RUNNING-d585',
  FIG: 'PENDING-FIRST-MODERN-AUTHOR', DISPLAY: 'PENDING', completeCard: false,
});
Object.assign(stages.n75, {
  firstFigure166167Author: find(`${base}/d578-n75-fig166167-first-modern-author/report.json`),
  firstFigure166167Freeze: find(`${base}/d578-n75-fig166167-first-modern-author/author-freeze.json`),
  figure166167Status: 'HOLD-BEFORE-GENERATION-UNRESOLVED-INTERIOR-MARKS',
  FIG: 'FIRST-FIG164165-AND-FIG168169-AUTHORS-RUNNING-FIG166167-HOLD',
  completeCard: false,
});
Object.assign(stages.source205, {
  status: 'FIRST-AUTHOR-NATIVE-READY-FIRST-INDEPENDENT-REVIEW-RUNNING',
  firstAuthor: find(`${base}/d579-source205-first-author/report.json`),
  firstAuthorFreeze: find(`${base}/d579-source205-first-author/author-freeze.json`),
  firstIndependentReviewBatch: 'd586', sourcePagesAdded: 0, n77Complete: false,
});
stages.source206 = {
  status: 'FIRST-PREPARED-NOT-READ-NOT-APPROVED',
  firstPreparation: find(`${base}/d587-source206-first-preparation/manifest.json`),
  sourcePagesAdded: 0, completeCard: false,
};
for (const [batch, count] of [['d575', 4], ['d578', 2], ['d579', 4]]) {
  const row = meter.activeHumanDirection.ephemeralImageBatches.find(entry => entry.batch === batch);
  assert.ok(row);
  Object.assign(row, { actualImages: count, status: 'COMPLETED-CLOSED', imagesReturnedToParent: 0 });
}
for (const row of [
  { id: '01a1ee83-13c0-7260-a26c-1f08610d5453', batch: 'd584', scope: 'N75-first-modern-FIG168169' },
  { id: '01a1ee84-69ee-7e83-8f73-c5c19fbd0387', batch: 'd585', scope: 'N76-first-independent-text-SCI-ZHEN' },
  { id: '01a1ee84-6a38-7391-8cfe-6e76701780a2', batch: 'd586', scope: 'SOURCE205-first-independent' },
]) {
  assert.equal(meter.activeHumanDirection.ephemeralImageBatches.some(old => old.id === row.id), false);
  meter.activeHumanDirection.ephemeralImageBatches.push({
    ...row, maximumImages: row.batch === 'd585' ? 0 : 8, contextLimit: 24,
    initialImages: 0, actualImages: null, status: 'ASSIGNED-REPORT-PENDING-NOT-APPROVED',
    freshWithoutImageHistory: true, lifetime: 'SINGLE-BOUNDED-BATCH-CLOSE-AFTER-RETURN',
    permanentWorker: false, parentReceivesImages: false, resetsAnyOldBudget: false,
  });
}
meter.sourcePagesFinalized = meter.currentCheckpoint.sourcePagesFinalized = 436;
meter.currentCheckpoint.sourcePagesBasis += '; d588 first SOURCE204 PASS consumed; n76 first scoped native+ZHEN author completed; first SCI/ZHEN review pending. Source204205 join remains held.';
const receiptPath = `${evidence}/reports/d588-source204-consumed-and-first-n76.json`;
assert.equal(await exists(receiptPath), false);
await immutableWrite(receiptPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033',
  previousCheckpoint: meter.currentCheckpoint.nextBatch.latestProgress,
  source204: stages.source204, source205: stages.source205, source206: stages.source206,
  n75: stages.n75, n76: stages.n76, retained, reused, outputs,
  sourcePagesAdded: 1, sourcePagesFinalized: 436, completeDeliveredCards: 98, completeCardsAdded: 0,
  newParentImages: 0, oldImageCounts: oldCounts, oldBudgetReset: false,
  historicalFAILHOLDPreserved: true, passedNativeReplays: 0, newPaidGeneration: 0,
  newPermanentWorkersWorktreesBranches: 0, DBMergeDeploy: false,
  humanResumeRemainsEffective: true, compactionIsNotAPause: true,
}));
const receipt = await bind(receiptPath);
index.reports.push({ ...receipt, batch: 'D033' });
Object.assign(meter.currentCheckpoint.nextBatch, {
  latestProgress: receipt, latestSourceConsumption: receipt,
  sourceTotals: { ...meter.currentCheckpoint.nextBatch.sourceTotals, pages: 436 },
});
assert.deepEqual(meter.activeHumanDirection.currentImageCounts, oldCounts);
index.updatedAt = meter.updatedAt = new Date().toISOString();
assert.deepEqual(await bytes(indexPath), beforeIndex);
assert.deepEqual(await bytes(meterPath), beforeMeter);
await fs.writeFile(absolute(indexPath), serialize(index));
await fs.writeFile(absolute(meterPath), serialize(meter));
console.log(JSON.stringify({ receipt, sourcePagesFinalized: 436, completeDeliveredCards: 98,
  outputs: outputs.length, retained: retained.length }));

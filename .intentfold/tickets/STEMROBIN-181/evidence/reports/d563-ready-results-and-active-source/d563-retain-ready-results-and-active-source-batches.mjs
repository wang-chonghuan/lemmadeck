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
const folders = [
  'd546-n72-fig153154-first-modern-author',
  'd549-n73-fig156157-first-independent-review',
  'd554-source202-first-author',
  'd559-source202-svg-and-source203-preparation',
  'd562-n75-source201-requirement-extension',
];
for (const [folder, file, sha] of [
  [folders[0], 'report.json', '2443bd6c87983970a19baa6e4f0334918128801525404a2d5eb71c405f41c238'],
  [folders[0], 'author-freeze.json', '1cb7824bf550b4d01c0a13ecd29464d8689a3808e5e001b4a404b57ac0fcdf68'],
  [folders[1], 'report.json', '2718c944434b2b79bb76e4c087284d14d28ca265b665b2d99946dfc8c5a812e8'],
  [folders[1], 'review-freeze.json', '07c1510260e71fbafee487750972671d38f8c6425ffdaf8cf2bd12d3f95672cb'],
  [folders[2], 'report.json', '5d2087ee0b0d8b888790e8013e519f00c9b5a4a7275809814e7e3d7dae95497d'],
  [folders[2], 'author-freeze.json', '860d28205d66e817855609e91f667583450f42a2723a1d22f89045d97f0826e3'],
  [folders[3], 'manifest.json', 'a22b58cc4a8db65be5b7c1d7683e5341e17a3ed0cd27849c5bbd14638733cb5e'],
  [folders[4], 'report.json', '2cdf1228599fa99fb7f12c771b45fcc273778b74601aa6f8d58a80c91e1a36a5'],
]) await verify(`${base}/${folder}/${file}`, sha);
const r549 = await read(`${base}/${folders[1]}/report.json`);
assert.equal(r549.FIG, 'PASS');
assert.equal(r549.sourceAuthenticity, 'HOLD');
assert.equal(r549.promotable, false);
const meterPath = `${ticket}/production-meter.json`;
const beforeIndex = await bytes(indexPath), beforeMeter = await bytes(meterPath);
const index = JSON.parse(beforeIndex), meter = JSON.parse(beforeMeter);
assert.equal(meter.currentCheckpoint.sourcePagesFinalized, 433);
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
  const destination = `${evidence}/reports/d563-ready-results-and-active-source/${suffix}`;
  await immutableWrite(destination, await bytes(file));
  const row = { ...await bind(destination), originalPath: file, batch: 'D033' };
  index.reports.push(row);
  retained.push(row);
}
for (const folder of folders) {
  for (const file of await walk(`${base}/${folder}`)) {
    await retain(file, `${folder}/${path.relative(`${base}/${folder}`, file)}`);
  }
}
for (const file of [
  'd559-prepare-source202-svg-and-source203.mjs',
  'd562-append-n75-source201-requirements.mjs',
  'd563-retain-ready-results-and-active-source-batches.mjs',
]) await retain(`${base}/${file}`, file);
const find = file => {
  const row = [...retained, ...reused].find(entry => absolute(entry.originalPath) === absolute(file));
  assert.ok(row, file);
  return row;
};
const stages = meter.activeHumanDirection.nextSourceCheckpoints;
Object.assign(stages.n72, {
  firstModernFigureAuthor: find(`${base}/${folders[0]}/report.json`),
  firstModernFigureAuthorFreeze: find(`${base}/${folders[0]}/author-freeze.json`),
  FIG153154: 'FIRST-AUTHOR-NATIVE-PASS-INDEPENDENT-REVIEW-PENDING',
  FIG: 'PARTIAL-FIRST-AUTHOR-NATIVE-ONLY-OTHER-GATES-PENDING',
  completeCard: false,
});
Object.assign(stages.n73, {
  first156157IndependentReview: find(`${base}/${folders[1]}/report.json`),
  FIG156157: 'PASS-SCOPED-RECOVERABLE-STRUCTURE-ONLY',
  source156157Detail: 'HOLD-PRESERVED-NOT-PROMOTABLE',
  FIG159: 'TERMINAL-FAIL-NO-FURTHER-REPAIR',
  standard156157RecordersInvoked: 0, completeCard: false,
});
Object.assign(stages.source202, {
  status: 'FIRST-AUTHOR-NATIVE-READY-FIRST-INDEPENDENT-REVIEW-RUNNING',
  firstAuthor: find(`${base}/${folders[2]}/report.json`),
  firstAuthorFreeze: find(`${base}/${folders[2]}/author-freeze.json`),
  firstSVGPreviews: find(`${base}/${folders[3]}/source202-previews.json`),
  firstIndependentReviewBatch: 'd560', SOURCE: 'PENDING', sourcePagesAdded: 0,
  n75RightBoundary: 'AUTHOR-ONLY-PENDING-FIRST-INDEPENDENT',
});
stages.source203 = {
  ...(stages.source203 ?? {}), status: 'FIRST-PREPARED-FIRST-AUTHOR-RUNNING',
  firstPreparation: find(`${base}/${folders[3]}/manifest.json`),
  firstAuthorBatch: 'd561', sourcePagesAdded: 0, completeCard: false,
};
Object.assign(stages.n75, {
  source201Requirements: find(`${base}/${folders[4]}/report.json`),
  requirementsThrough201AppendedOnly: true, completeCard: false,
});
for (const [batch, count] of [['d546', 5], ['d549', 6], ['d554', 6]]) {
  const row = meter.activeHumanDirection.ephemeralImageBatches.find(entry => entry.batch === batch);
  assert.ok(row);
  Object.assign(row, { actualImages: count, status: 'COMPLETED-CLOSED', imagesReturnedToParent: 0 });
}
for (const row of [
  { id: '01a1ee68-4192-7db2-8ce8-fce0b7eac3bc', batch: 'd560', scope: 'SOURCE202-first-independent-text-RAW-SVG-and-n75-boundary' },
  { id: '01a1ee68-989c-71a2-a25f-e8e89fd5bb36', batch: 'd561', scope: 'SOURCE203-first-author-actual-continuation' },
]) {
  assert.equal(meter.activeHumanDirection.ephemeralImageBatches.some(old => old.id === row.id), false);
  meter.activeHumanDirection.ephemeralImageBatches.push({
    ...row, maximumImages: 8, contextLimit: 24, initialImages: 0, actualImages: null,
    status: 'ASSIGNED-REPORT-PENDING-NOT-APPROVED', freshWithoutImageHistory: true,
    lifetime: 'SINGLE-BOUNDED-BATCH-CLOSE-AFTER-RETURN', permanentWorker: false,
    parentReceivesImages: false, resetsAnyOldBudget: false,
  });
}
const receiptPath = `${evidence}/reports/d563-ready-results-and-active-source-batches.json`;
assert.equal(await exists(receiptPath), false);
await immutableWrite(receiptPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033',
  previousCheckpoint: meter.currentCheckpoint.nextBatch.latestProgress,
  n72: stages.n72, n73: stages.n73, source202: stages.source202,
  source203: stages.source203, n75: stages.n75, retained, reused,
  sourcePagesFinalized: 433, completeDeliveredCards: 98, sourcePagesAdded: 0, completeCardsAdded: 0,
  newParentImages: 0, oldImageCounts: oldCounts, oldBudgetReset: false,
  historicalFAILHOLDPreserved: true, nativeReplays: 0, newPermanentWorkersWorktreesBranches: 0,
  DBMergeDeploy: false, humanResumeRemainsEffective: true, compactionIsNotAPause: true,
}));
const receipt = await bind(receiptPath);
index.reports.push({ ...receipt, batch: 'D033' });
meter.currentCheckpoint.nextBatch.latestProgress = receipt;
assert.deepEqual(meter.activeHumanDirection.currentImageCounts, oldCounts);
index.updatedAt = meter.updatedAt = new Date().toISOString();
assert.deepEqual(await bytes(indexPath), beforeIndex);
assert.deepEqual(await bytes(meterPath), beforeMeter);
await fs.writeFile(absolute(indexPath), serialize(index));
await fs.writeFile(absolute(meterPath), serialize(meter));
console.log(JSON.stringify({ receipt, retained: retained.length, reused: reused.length,
  sourcePagesFinalized: 433, completeDeliveredCards: 98, newParentImages: 0 }));

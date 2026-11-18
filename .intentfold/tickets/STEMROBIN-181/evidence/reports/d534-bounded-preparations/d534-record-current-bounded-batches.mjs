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
const folders = ['d527-source200-first-preparation', 'd529-source199-first-svg-previews',
  'd532-n74-first-figure-contexts'];
for (const [folder, sha] of [
  [folders[0], 'c7d3365cdb7dfd97e545f9ebf586c1f37cfe5b6cca0b3f27588b36a839182f7a'],
  [folders[1], 'fd26181d5163064ad63539d38f1b6800278e80cfae263559ab053a9eb3adf04f'],
  [folders[2], 'ec4b38d5ff47075d586c5b0f4c55e0798798a1935f678bdccf85d55215aaf50b'],
]) await verify(`${base}/${folder}/manifest.json`, sha);
const meterPath = `${ticket}/production-meter.json`;
const beforeIndex = await bytes(indexPath), beforeMeter = await bytes(meterPath);
const index = JSON.parse(beforeIndex), meter = JSON.parse(beforeMeter);
assert.equal(meter.currentCheckpoint.sourcePagesFinalized, 430);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 98);
assert.equal(meter.activeHumanDirection.latestScopeClarification.imageLimits.resetOldContexts, false);
const oldImageCounts = structuredClone(meter.activeHumanDirection.currentImageCounts);
const retained = [], reused = [];
async function retain(file, suffix) {
  const original = await bind(file), prior = lookup(index, file, original.sha256);
  if (prior) {
    await verify(prior, original.sha256);
    reused.push({ path: prior, sha256: original.sha256, originalPath: file });
    return;
  }
  const destination = `${evidence}/reports/d534-bounded-preparations/${suffix}`;
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
for (const name of ['d527-prepare-source200.mjs', 'd529-prepare-source199-first-svg-previews.mjs',
  'd532-prepare-n74-first-figure-contexts.mjs', 'd534-record-current-bounded-batches.mjs']) {
  await retain(`${base}/${name}`, name);
}
const find = file => {
  const entry = [...retained, ...reused].find(row => absolute(row.originalPath) === absolute(file));
  assert.ok(entry, file);
  return entry;
};
const batches = [
  { id: '01a1ee46-a2bf-7f13-812f-4d614c940a21', batch: 'd528',
    scope: 'SOURCE199-first-independent-text-and-RAW', maximumImages: 8 },
  { id: '01a1ee48-5763-7b21-8f8e-86b5cda320ad', batch: 'd530',
    scope: 'SOURCE199-four-first-independent-RAW-SVG-pairs', maximumImages: 8 },
  { id: '01a1ee48-5889-7d22-a5d0-adcb006e1e44', batch: 'd531',
    scope: 'SOURCE200-first-visual-transcription', maximumImages: 8 },
  { id: '01a1ee4a-27ac-78e1-a7f6-a6bd5cd29654', batch: 'd533',
    scope: 'N74-four-first-modern-figures', maximumImages: 8 },
].map(row => ({
  ...row, contextLimit: 24, initialImages: 0, actualImages: null,
  status: 'ASSIGNED-REPORT-PENDING-NOT-APPROVED', freshWithoutImageHistory: true,
  lifetime: 'SINGLE-BOUNDED-BATCH-CLOSE-AFTER-RETURN', permanentWorker: false,
  parentReceivesImages: false, resetsAnyOldBudget: false,
}));
meter.activeHumanDirection.ephemeralImageBatches ??= [];
for (const row of batches) {
  assert.equal(meter.activeHumanDirection.ephemeralImageBatches.some(old => old.id === row.id), false);
  meter.activeHumanDirection.ephemeralImageBatches.push(row);
}
const stages = meter.activeHumanDirection.nextSourceCheckpoints;
Object.assign(stages.source199, {
  firstTextRAWReviewBatch: 'd528-source199-first-independent-text-raw-review',
  firstSVGReviewBatch: 'd530-source199-first-independent-svg-review',
  firstSVGPreviews: find(`${base}/${folders[1]}/manifest.json`),
  independentReview: 'FIRST-REVIEWS-RUNNING-NO-PASS-CLAIM',
});
stages.source200.firstPreparation = find(`${base}/${folders[0]}/manifest.json`);
Object.assign(stages.n74, {
  firstFigureContexts: find(`${base}/${folders[2]}/manifest.json`),
  firstModernFigureAuthorBatch: 'd533-n74-first-modern-figure-author',
  FIG: 'FIRST-AUTHOR-ASSIGNED-NOT-APPROVED', DISPLAY: 'pending',
});
const receiptPath = `${evidence}/reports/d534-current-four-bounded-batches.json`;
assert.equal(await exists(receiptPath), false);
await immutableWrite(receiptPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033',
  previousCheckpoint: meter.currentCheckpoint.nextBatch.latestProgress,
  batches, retained, reused, oldImageCounts,
  SOURCE199: stages.source199.SOURCE, SOURCE200: 'FIRST-AUTHOR-PENDING',
  N74FIG: stages.n74.FIG, sourcePagesFinalized: 430, completeDeliveredCards: 98,
  sourcePagesAdded: 0, completeCardsAdded: 0, newParentImages: 0,
  oldBudgetReset: false, sourceAndModernGatesNotConflated: true,
  historicalFAILHOLDPreserved: true, newPermanentWorkersWorktreesBranches: 0,
  DBMergeDeploy: false, humanResumeRemainsEffective: true,
}));
const receipt = await bind(receiptPath);
index.reports.push({ ...receipt, batch: 'D033' });
meter.currentCheckpoint.nextBatch.latestProgress = receipt;
index.updatedAt = meter.updatedAt = new Date().toISOString();
assert.deepEqual(meter.activeHumanDirection.currentImageCounts, oldImageCounts);
assert.deepEqual(await bytes(indexPath), beforeIndex);
assert.deepEqual(await bytes(meterPath), beforeMeter);
await fs.writeFile(absolute(indexPath), serialize(index));
await fs.writeFile(absolute(meterPath), serialize(meter));
console.log(JSON.stringify({ receipt, retained: retained.length, reused: reused.length,
  batches: batches.map(row => row.batch), sourcePagesFinalized: 430, completeDeliveredCards: 98 }));

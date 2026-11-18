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
  'd531-source200-first-author', 'd535-n73-first-figure-contexts',
  'd539-source200-first-svg-previews', 'd541-source201-first-preparation',
];
await verify(`${base}/${folders[0]}/author-freeze.json`,
  'a5b126d89213cbaf08b8d1488c543371764925dca27545e9a60fb3406a38e053');
await verify(`${base}/${folders[0]}/report.json`,
  'df4743f4959a1b72dc3077515954e5dba65aa53ecd3767e2fd41663cbd357ef5');
const freeze = await read(`${base}/${folders[0]}/author-freeze.json`);
for (const row of freeze.files) {
  await verify(row.path, row.sha256);
  assert.equal((await fs.stat(absolute(row.path))).mode & 0o777, 0o444);
}
for (const [folder, sha] of [
  [folders[1], '98025ba46ba8227721246f58ca9882f834e79f896046e34907dc171f7bc28bb9'],
  [folders[2], 'dcc769743a26769471b28c90af16a73b998697c99fdc7938dd4f6b4d21ae2bd1'],
  [folders[3], 'dff3f608367dfd419a8856a3750bcba33c14ffa0f4f7c18daa2558c1636848c9'],
]) await verify(`${base}/${folder}/manifest.json`, sha);
const author = await read(`${base}/${folders[0]}/report.json`);
assert.equal(author.image_totals.new, 6);
assert.equal(author.fullcard, false);
assert.equal(author.n75_complete, false);
const meterPath = `${ticket}/production-meter.json`;
const beforeIndex = await bytes(indexPath), beforeMeter = await bytes(meterPath);
const index = JSON.parse(beforeIndex), meter = JSON.parse(beforeMeter);
assert.equal(meter.currentCheckpoint.sourcePagesFinalized, 431);
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
  const destination = `${evidence}/reports/d543-ready-author-and-preparations/${suffix}`;
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
for (const name of ['d535-prepare-n73-first-figure-contexts.mjs',
  'd539-prepare-source200-first-svg-previews.mjs', 'd541-prepare-source201.mjs',
  'd543-retain-ready-author-and-preparations.mjs']) {
  if (await exists(`${base}/${name}`)) await retain(`${base}/${name}`, name);
}
const find = file => {
  const row = [...retained, ...reused].find(entry => absolute(entry.originalPath) === absolute(file));
  assert.ok(row, file);
  return row;
};
const stages = meter.activeHumanDirection.nextSourceCheckpoints;
Object.assign(stages.source200, {
  status: 'FIRST-AUTHOR-FROZEN-FIRST-INDEPENDENT-REVIEW-RUNNING',
  firstAuthor: find(`${base}/${folders[0]}/report.json`),
  firstAuthorFreeze: find(`${base}/${folders[0]}/author-freeze.json`),
  firstSVGPreviews: find(`${base}/${folders[2]}/manifest.json`),
  firstReviewBatch: 'd540-source200-first-independent-review',
  actualAuthorImages: 6, sourcePagesAdded: 0, n75Complete: false,
  fig174Owner: 'HOLD-PENDING-ACTUAL-NEXT-PAGE-REFERENCE',
});
stages.source201 = {
  ...(stages.source201 ?? {}), status: 'FIRST-PREPARED-FIRST-AUTHOR-RUNNING',
  firstPreparation: find(`${base}/${folders[3]}/manifest.json`),
  firstAuthorBatch: 'd542-source201-first-author',
  sourcePagesAdded: 0, completeCard: false, n75Complete: false,
};
Object.assign(stages.n73, {
  firstFigureContexts: find(`${base}/${folders[1]}/manifest.json`),
  firstModernFigureAuthorBatch: 'd537-n73-first-modern-figure-author',
  FIG: 'FIRST-AUTHOR-RUNNING-NOT-INDEPENDENTLY-APPROVED', DISPLAY: 'pending',
});
const closedAuthor = meter.activeHumanDirection.ephemeralImageBatches.find(row => row.batch === 'd531');
assert.ok(closedAuthor);
Object.assign(closedAuthor, {
  actualImages: 6, status: 'COMPLETED-CLOSED', imagesReturnedToParent: 0, budgetReset: false,
});
for (const row of [
  { id: '01a1ee4d-898c-75f0-bf1e-fabc313854b7', batch: 'd537', scope: 'N73-four-first-modern-figures' },
  { id: '01a1ee52-c808-7303-9e32-7f3b97549271', batch: 'd540', scope: 'SOURCE200-first-independent-text-RAW-SVG' },
  { id: '01a1ee52-6a9e-7221-b8ae-b8b2085c62c0', batch: 'd542', scope: 'SOURCE201-first-visual-transcription-and-boundary' },
]) {
  assert.equal(meter.activeHumanDirection.ephemeralImageBatches.some(old => old.id === row.id), false);
  meter.activeHumanDirection.ephemeralImageBatches.push({
    ...row, maximumImages: 8, contextLimit: 24, initialImages: 0, actualImages: null,
    status: 'ASSIGNED-REPORT-PENDING-NOT-APPROVED', freshWithoutImageHistory: true,
    lifetime: 'SINGLE-BOUNDED-BATCH-CLOSE-AFTER-RETURN', permanentWorker: false,
    parentReceivesImages: false, resetsAnyOldBudget: false,
  });
}
const receiptPath = `${evidence}/reports/d543-ready-author-and-preparations.json`;
assert.equal(await exists(receiptPath), false);
await immutableWrite(receiptPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033',
  previousCheckpoint: meter.currentCheckpoint.nextBatch.latestProgress,
  source200Author: stages.source200, source201Preparation: stages.source201,
  n73FigureContexts: stages.n73.firstFigureContexts,
  n75RequirementsBatch: 'd538-n75-preauthor-confirmed-source-requirements',
  retained, reused, oldImageCounts: oldCounts, newParentImages: 0,
  sourcePagesFinalized: 431, completeDeliveredCards: 98,
  sourcePagesAdded: 0, completeCardsAdded: 0, historicalFAILHOLDPreserved: true,
  nativeOrImageReplays: 0, newPermanentWorkersWorktreesBranches: 0, DBMergeDeploy: false,
  humanResumeRemainsEffective: true, compactionIsNotAPause: true,
}));
const receipt = await bind(receiptPath);
index.reports.push({ ...receipt, batch: 'D033' });
meter.currentCheckpoint.nextBatch.latestProgress = receipt;
meter.currentCheckpoint.nextBatch.latestSource200Author = stages.source200.firstAuthor;
meter.currentCheckpoint.nextBatch.latestSource201Preparation = stages.source201.firstPreparation;
assert.deepEqual(meter.activeHumanDirection.currentImageCounts, oldCounts);
index.updatedAt = meter.updatedAt = new Date().toISOString();
assert.deepEqual(await bytes(indexPath), beforeIndex);
assert.deepEqual(await bytes(meterPath), beforeMeter);
await fs.writeFile(absolute(indexPath), serialize(index));
await fs.writeFile(absolute(meterPath), serialize(meter));
console.log(JSON.stringify({ receipt, retained: retained.length, reused: reused.length,
  sourcePagesFinalized: 431, completeDeliveredCards: 98, newParentImages: 0 }));

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
const folders = ['d537-n73-first-modern-figure-author', 'd538-n75-preauthor-confirmed-source-requirements',
  'd542-source201-first-author', 'd544-n74-fig161162-first-independent-review',
  'd548-n75-source200-requirement-extension', 'd551-source201-svg-and-source202-preparation',
  'd552-n75-native-ref-adapter'];
for (const [folder, name, sha] of [
  [folders[0], 'author-freeze.json', 'deb0f8af88181e13438eb3b4ed243f2cf88e2ff60e945c4a46b28b98b1ffed7e'],
  [folders[1], 'freeze.json', '78e6aaa992061f6c5306d70690c1f94d37c529240beaae110eee86a74a9f71b5'],
  [folders[2], 'author-freeze.json', '708b4beaff5a9406c07b471b6067a365a251e34e22f4bc275933e5b056680dde'],
  [folders[3], 'review-freeze.json', 'b6199832fa05bfe5b8aca0a9e0b556a1ca7e86f419ea5450ea8d333523baf9ef'],
]) {
  const file = `${base}/${folder}/${name}`;
  await verify(file, sha);
  const freeze = await read(file);
  for (const row of freeze.files) {
    const target = path.isAbsolute(row.path) || row.path.startsWith('.intentfold/')
      ? row.path : path.join(base, folder, row.path);
    await verify(target, row.sha256);
    assert.equal((await fs.stat(absolute(target))).mode & 0o777, 0o444);
  }
}
const meterPath = `${ticket}/production-meter.json`;
const beforeIndex = await bytes(indexPath), beforeMeter = await bytes(meterPath);
const index = JSON.parse(beforeIndex), meter = JSON.parse(beforeMeter);
assert.equal(meter.currentCheckpoint.sourcePagesFinalized, 432);
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
  const destination = `${evidence}/reports/d555-ready-authors-and-next-source/${suffix}`;
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
for (const name of ['d548-append-n75-source200-requirements.mjs',
  'd551-prepare-source201-svg-and-source202.mjs', 'd552-map-n75-requirements-to-native-refs.mjs',
  'd555-retain-ready-authors-and-next-source.mjs']) await retain(`${base}/${name}`, name);
const find = file => {
  const row = [...retained, ...reused].find(entry => absolute(entry.originalPath) === absolute(file));
  assert.ok(row, file);
  return row;
};
const stages = meter.activeHumanDirection.nextSourceCheckpoints;
Object.assign(stages.n73, {
  firstModernFigureAuthor: find(`${base}/${folders[0]}/report.json`),
  firstModernFigureAuthorFreeze: find(`${base}/${folders[0]}/author-freeze.json`),
  FIG: 'FOUR-NATIVE-CANDIDATES-FIRST-INDEPENDENT-REVIEWS-RUNNING', DISPLAY: 'pending',
  firstIndependentReviewBatches: ['d549', 'd550'], completeCard: false,
});
Object.assign(stages.source201, {
  status: 'FIRST-AUTHOR-FROZEN-FIRST-INDEPENDENT-REVIEW-RUNNING',
  firstAuthor: find(`${base}/${folders[2]}/report.json`),
  firstAuthorFreeze: find(`${base}/${folders[2]}/author-freeze.json`),
  firstSVGPreviews: find(`${base}/${folders[5]}/source201-previews.json`),
  firstIndependentReviewBatch: 'd553', sourcePagesAdded: 0,
  fig174Owner: 'AUTHOR-OBSERVED-PENDING-INDEPENDENT', n75Complete: false,
});
stages.source202 = {
  ...(stages.source202 ?? {}), status: 'FIRST-PREPARED-FIRST-AUTHOR-RUNNING',
  firstPreparation: find(`${base}/${folders[5]}/manifest.json`),
  firstAuthorBatch: 'd554', sourcePagesAdded: 0, completeCard: false,
};
Object.assign(stages.n75 ??= {}, {
  firstRequirementsBaseline: find(`${base}/${folders[1]}/report.json`),
  firstSource200RequirementExtension: find(`${base}/${folders[4]}/report.json`),
  nativeRefAdapter: find(`${base}/${folders[6]}/report.json`),
  nativeRequirements: find(`${base}/${folders[6]}/source-requirements.native-refs.json`),
  nativeSource200Extension: find(`${base}/${folders[6]}/source200-extension.native-refs.json`),
  legacyRefConventionNotDirectlyNativeCompatible: true, completeCard: false,
});
Object.assign(stages.n74, {
  firstFIG161162Review: find(`${base}/${folders[3]}/report.json`),
  firstMobilePreviewGate: 'FAIL-DIRECT-RESVG-CSS-VARIABLE-ENVIRONMENT',
  sourceAndNativeFigureStructure: 'PASS-FIRST-INDEPENDENT-OBSERVATION',
  affectedMobileBrowserReviewBatch: 'd556',
  FIG: 'FIRST-MOBILE-PREVIEW-FAIL-RETAINED-BROWSER-EVIDENCE-PENDING',
});
for (const [batch, count] of [['d537', 8], ['d542', 6]]) {
  const row = meter.activeHumanDirection.ephemeralImageBatches.find(entry => entry.batch === batch);
  assert.ok(row);
  Object.assign(row, { actualImages: count, status: 'COMPLETED-CLOSED', imagesReturnedToParent: 0 });
}
const continued = meter.activeHumanDirection.ephemeralImageBatches.find(row => row.batch === 'd544');
assert.ok(continued);
Object.assign(continued, {
  actualImages: 6, status: 'AFFECTED-PREVIEW-ENVIRONMENT-CORRECTION-RUNNING',
  additionalImagesMaximum: 2, totalBatchMaximum: 8, originalFAILRetained: true,
  affectedReceiptBatch: 'd556', sourceAndFullCandidateReopensAllowed: false,
});
for (const row of [
  { id: '01a1ee5b-70cb-7a51-a31e-45364f84e053', batch: 'd549', scope: 'N73-first-independent-FIG156157' },
  { id: '01a1ee5b-711f-73e3-95ef-bbe4cff3a11e', batch: 'd550', scope: 'N73-first-independent-FIG158159' },
  { id: '01a1ee5c-c975-7253-b14d-78882a59935f', batch: 'd553', scope: 'SOURCE201-first-independent-and-fig174-owner' },
  { id: '01a1ee5d-269d-7780-aa01-6b595a364cf6', batch: 'd554', scope: 'SOURCE202-first-author-actual-boundary' },
]) {
  assert.equal(meter.activeHumanDirection.ephemeralImageBatches.some(old => old.id === row.id), false);
  meter.activeHumanDirection.ephemeralImageBatches.push({
    ...row, maximumImages: 8, contextLimit: 24, initialImages: 0, actualImages: null,
    status: 'ASSIGNED-REPORT-PENDING-NOT-APPROVED', freshWithoutImageHistory: true,
    lifetime: 'SINGLE-BOUNDED-BATCH-CLOSE-AFTER-RETURN', permanentWorker: false,
    parentReceivesImages: false, resetsAnyOldBudget: false,
  });
}
const receiptPath = `${evidence}/reports/d555-ready-authors-and-next-source.json`;
assert.equal(await exists(receiptPath), false);
await immutableWrite(receiptPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033',
  previousCheckpoint: meter.currentCheckpoint.nextBatch.latestProgress,
  n73: stages.n73, source201: stages.source201, source202: stages.source202,
  n75: stages.n75, n74: stages.n74, retained, reused,
  sourcePagesFinalized: 432, completeDeliveredCards: 98, sourcePagesAdded: 0, completeCardsAdded: 0,
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
  sourcePagesFinalized: 432, completeDeliveredCards: 98, newParentImages: 0 }));

import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  ticket, evidence, indexPath, absolute, bytes, read, bind, verify,
  immutableWrite, walk, lookup,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const base = `${ticket}/tmp`;
const author = `${base}/d612-source208-first-author`;
const reviewFolder = `${base}/d624-source208-first-independent-review`;
await verify(`${reviewFolder}/report.json`, '4cabe077de8772cfe4768c46d16c66b3495f0ea042fd9e839a497f39f91e941c');
await verify(`${reviewFolder}/first-review-freeze.json`, '10e9eee56a2996fd46bfb92c56c3acd9c1c5c043eefff24723806990c88fc183');
const review = await read(`${reviewFolder}/report.json`);
for (const gate of ['SOURCE208', 'RAW182', 'SVG182', 'SCOPED207208_JOIN']) {
  assert.equal(review.gates[gate].status, 'PASS');
}
const authorFreeze = await read(`${author}/frozen-files.json`);
const canonical = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const outputs = [];
for (const [source, destination] of [
  ...['page.md', 'page.json', 'audit.json'].map(name =>
    [`${author}/source/10p/pages/0208/${name}`, `${canonical}/pages/0208/${name}`]),
  ...['png', 'svg'].map(extension =>
    [`${author}/work/10p/pages/0208/figures/fig-182.${extension}`, `${canonical}/figures/fig-182.${extension}`]),
]) {
  const record = authorFreeze.files.find(row => absolute(row.path) === absolute(source));
  assert.ok(record, source);
  await verify(source, record.sha256);
  await immutableWrite(destination, await bytes(source));
  outputs.push({ ...await bind(destination), originalPath: source });
}
const meterPath = `${ticket}/production-meter.json`;
const beforeIndex = await bytes(indexPath), beforeMeter = await bytes(meterPath);
const index = JSON.parse(beforeIndex), meter = JSON.parse(beforeMeter);
assert.equal(meter.currentCheckpoint.sourcePagesFinalized, 439);
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
  const destination = `${evidence}/reports/d633-source208-and-frozen-stages/${suffix}`;
  await immutableWrite(destination, await bytes(file));
  const row = { ...await bind(destination), originalPath: file, batch: 'D033' };
  index.reports.push(row);
  retained.push(row);
}
for (const name of [
  'd611-n76-fig177178-first-independent-review', 'd612-source208-first-author',
  'd613-n77-first-independent-written-answer-review', 'd614-n76-fig179180-first-independent-review',
  'd616-n77-r07-first-affected-text-review', 'd618-n77-first-choice-source',
  'd619-n78-preauthor-source206207-requirements', 'd620-n77-first-choice-author',
  'd621-source209-first-preparation', 'd622-n77-q1q7-first-written-answer-repair',
  'd623-n77-q1q7-first-affected-written-review', 'd624-source208-first-independent-review',
  'd625-source209-first-author', 'd626-n76-first-bilingual-native',
  'd627-n76-first-native-contract-repair',
]) {
  const folder = `${base}/${name}`;
  for (const file of await walk(folder)) await retain(file, `${name}/${path.relative(folder, file)}`);
}
for (const name of [
  'd626-finalize-n76-first-bilingual-native.mjs',
  'd627-n76-first-native-contract-repair.mjs',
  'd629-finalize-n76-native-contract-repaired.mjs',
  'd633-consume-source208-and-frozen-stages.mjs',
]) await retain(`${base}/${name}`, name);
const find = file => {
  const row = [...retained, ...reused].find(entry => absolute(entry.originalPath) === absolute(file));
  assert.ok(row, file);
  return row;
};
const stages = meter.activeHumanDirection.nextSourceCheckpoints;
stages.source208 = {
  ...stages.source208,
  status: 'FIRST-INDEPENDENT-SOURCE208-RAW182-SVG182-PASS-CONSUMED',
  SOURCE: 'PASS', RAW: 'PASS', SVG: 'PASS', SCOPED207208_JOIN: 'PASS',
  firstAuthor: find(`${author}/report.json`),
  firstAuthorFreeze: find(`${author}/frozen-files.json`),
  firstIndependentReview: find(`${reviewFolder}/report.json`),
  firstIndependentFreeze: find(`${reviewFolder}/first-review-freeze.json`),
  sourcePagesAdded: 1, outgoing: 'HOLD-ACTUAL-p0208#6-UNFINISHED',
  referenced183: 'SOURCE209-FIRST-INDEPENDENT-PENDING',
  completeCard: false, retainedDeviation: review.processDeviation,
};
Object.assign(stages.n76, {
  FIG: 'PASS-FIRST-INDEPENDENT-FOUR-REUSED',
  figureDisplay: 'PASS-FIRST-INDEPENDENT-DECLARED-WIDTHS',
  DISPLAY: 'PENDING-FIRST-WHOLE-CARD',
  firstFigure177178Review: find(`${base}/d611-n76-fig177178-first-independent-review/report.json`),
  firstFigure179180Review: find(`${base}/d614-n76-fig179180-first-independent-review/report.json`),
  firstNativeFailure: find(`${base}/d626-n76-first-bilingual-native/first-native-failure.json`),
  firstNativeFailureFreeze: find(`${base}/d626-n76-first-bilingual-native/failure-freeze.json`),
  nativeContractRepair: find(`${base}/d627-n76-first-native-contract-repair/report.json`),
  native: 'FIRST-ZH-FAIL-PRESERVED-CONTRACT-REPAIR-AFFECTED-REVIEW-PENDING',
  completeCard: false,
});
Object.assign(stages.n77, {
  SCI: 'PASS-FIRST-INDEPENDENT-REUSED', ZHEN: 'PASS-EFFECTIVE-COMPOSED',
  firstR07AffectedReview: find(`${base}/d616-n77-r07-first-affected-text-review/report.json`),
  firstWrittenReview: find(`${base}/d613-n77-first-independent-written-answer-review/report.json`),
  firstWrittenAnswerRepair: find(`${base}/d622-n77-q1q7-first-written-answer-repair/report.json`),
  firstWrittenAnswerAffectedReview: find(`${base}/d623-n77-q1q7-first-affected-written-review/report.json`),
  ANSWER: 'PASS-EFFECTIVE-COMPOSED-Q1Q7-ONLY-REPAIRED',
  firstChoiceAuthor: find(`${base}/d620-n77-first-choice-author/author-report.md`),
  firstChoiceAuthorFreeze: find(`${base}/d620-n77-first-choice-author/freeze.json`),
  CHOICE: 'FIRST-INDEPENDENT-d632-RUNNING',
  FIG: 'SHARED179-PASS-REUSED', native: 'PENDING-FIRST',
  DISPLAY: 'PENDING-FIRST-WHOLE-CARD', completeCard: false,
});
stages.source209 = {
  ...stages.source209, status: 'FIRST-AUTHOR-FROZEN-INDEPENDENT-d631-RUNNING',
  firstAuthor: find(`${base}/d625-source209-first-author/report.json`),
  firstAuthorFreeze: find(`${base}/d625-source209-first-author/hash-manifest.json`),
  SOURCE: 'PENDING', RAW: 'PENDING', SVG: 'PENDING',
  n78RightBoundary: 'AUTHOR-LOCATED-p0209#3-TO-p0209#4-INDEPENDENT-PENDING',
  completeCard: false,
};
for (const [batch, count] of [['d611', 8], ['d612', 4], ['d613', 0], ['d614', 6], ['d616', 0]]) {
  const row = meter.activeHumanDirection.ephemeralImageBatches.find(entry => entry.batch === batch);
  assert.ok(row, batch);
  Object.assign(row, { actualImages: count, status: 'COMPLETED-CLOSED', imagesReturnedToParent: 0 });
}
for (const row of [
  { id: '01a1eea8-0df3-7d82-af34-d3f263e5a204', batch: 'd620', scope: 'N77-first-choice-author', maximumImages: 0, actualImages: 0, status: 'COMPLETED-CLOSED' },
  { id: '01a1eeab-946f-7e80-bead-834b69a1425f', batch: 'd623', scope: 'N77-Q1Q7-first-affected-written-review', maximumImages: 0, actualImages: 0, status: 'COMPLETED-CLOSED' },
  { id: '01a1eeac-6588-7b22-a2d1-a1d394435bad', batch: 'd624', scope: 'SOURCE208-first-independent', maximumImages: 8, actualImages: 7, status: 'COMPLETED-CLOSED' },
  { id: '01a1eeac-ab40-75c0-acc6-43b0b618d927', batch: 'd625', scope: 'SOURCE209-first-author', maximumImages: 8, actualImages: 6, status: 'COMPLETED-CLOSED' },
  { id: '01a1eeb2-8671-7cf0-aaa9-6450c7f449eb', batch: 'd628', scope: 'N76-first-native-contract-affected-text-review', maximumImages: 0, actualImages: null, status: 'ASSIGNED-REPORT-PENDING-NOT-APPROVED' },
  { id: '01a1eeb4-6eb2-7c20-a008-91487e47a56c', batch: 'd631', scope: 'SOURCE209-first-independent', maximumImages: 8, actualImages: null, status: 'ASSIGNED-REPORT-PENDING-NOT-APPROVED' },
  { id: '01a1eeb4-d33e-7e93-a844-a878dbfb38df', batch: 'd632', scope: 'N77-first-independent-choice-review', maximumImages: 0, actualImages: null, status: 'ASSIGNED-REPORT-PENDING-NOT-APPROVED' },
]) {
  assert.ok(!meter.activeHumanDirection.ephemeralImageBatches.some(old => old.id === row.id));
  meter.activeHumanDirection.ephemeralImageBatches.push({
    ...row, contextLimit: 24, initialImages: 0, freshWithoutImageHistory: true,
    lifetime: 'SINGLE-BOUNDED-BATCH-CLOSE-AFTER-RETURN', permanentWorker: false,
    parentReceivesImages: false, imagesReturnedToParent: 0, resetsAnyOldBudget: false,
  });
}
meter.sourcePagesFinalized = meter.currentCheckpoint.sourcePagesFinalized = 440;
meter.currentCheckpoint.sourcePagesBasis += '; d633 first SOURCE20813/13, RAW182/SVG182/scoped207208 join PASS consumed; outgoing208 and fullN78 HOLD history retained.';
const receiptPath = `${evidence}/reports/d633-source208-consumed-and-frozen-stages.json`;
await immutableWrite(receiptPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033',
  previousCheckpoint: meter.currentCheckpoint.nextBatch.latestProgress,
  source208: stages.source208, source209: stages.source209, n76: stages.n76, n77: stages.n77,
  retained, reused, outputs, sourcePagesAdded: 1, sourcePagesFinalized: 440,
  completeDeliveredCards: 98, completeCardsAdded: 0,
  oldImageCounts: oldCounts, newParentImages: 0, oldBudgetReset: false,
  historicalFAILHOLDPreserved: true, passedNativeReplays: 0, newPaidGeneration: 0,
  newPermanentWorkersWorktreesBranches: 0, DBMergeDeploy: false,
  humanResumeRemainsEffective: true, compactionIsNotAPause: true,
}));
const receipt = await bind(receiptPath);
index.reports.push({ ...receipt, batch: 'D033' });
Object.assign(meter.currentCheckpoint.nextBatch, {
  latestProgress: receipt, latestSourceConsumption: receipt,
  sourceTotals: { ...meter.currentCheckpoint.nextBatch.sourceTotals, pages: 440 },
});
assert.deepEqual(meter.activeHumanDirection.currentImageCounts, oldCounts);
index.updatedAt = meter.updatedAt = new Date().toISOString();
assert.deepEqual(await bytes(indexPath), beforeIndex);
assert.deepEqual(await bytes(meterPath), beforeMeter);
await fs.writeFile(absolute(indexPath), serialize(index));
await fs.writeFile(absolute(meterPath), serialize(meter));
console.log(JSON.stringify({ receipt, sourcePagesFinalized: 440, completeDeliveredCards: 98, outputs }));

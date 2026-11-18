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
const reviewFolder = `${base}/d606-source207-first-independent-review`;
const author = `${base}/d599-source207-first-author`;
for (const [file, sha256] of [
  [`${reviewFolder}/report.json`, 'ffb4dc35e735f8e828b11c48496508a7844de0eda23652632b8cae9def2c001e'],
  [`${reviewFolder}/review-freeze.json`, '5400548277b3801254a9dfcd8053dd507ad3babbae1ad4802d52da3b7f3cf510'],
  [`${base}/d603-n76-fig177178-first-modern-author/report.json`, '9ba171c632c55b5b48f57e4d116940b8ad84779b31541000fe13f24eb93f55d1'],
  [`${base}/d604-n76-fig179180-first-modern-author/report.json`, '3abfa9dae23efe6eaa0f98c2fad701e3a92ea02d25510b4a9c85d10e79ca2c31'],
  [`${base}/d608-n77-first-independent-text-review/report.json`, 'e819a49e2431c08d4065baa7cd7d03d8612f283ee353489d72058ac1423c809a'],
  [`${base}/d610-n77-first-written-answer-author/report.json`, '424cf68d2815c155485bab241e61b6765c2278b1322bf02aa06e798884416cb4'],
  [`${base}/d615-n77-r07-first-text-repair/report.json`, '4e30570a036639c6bedf53db39557a0d5203623fdad3b3604879fb8e7fbf7f06'],
]) await verify(file, sha256);
const review = await read(`${reviewFolder}/report.json`);
for (const gate of ['SOURCE207', 'RAW181', 'SVG181', 'INCOMING206_LOCAL_BOUNDARY']) {
  assert.equal(review.gates[gate].status, 'PASS');
}
assert.equal(review.gates.OUTGOING207.status, 'HOLD');
const canonical = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const authorFreeze = await read(`${author}/author-freeze.json`);
const outputs = [];
for (const name of ['page.md', 'page.json', 'audit.json']) {
  const source = `${author}/source/10p/pages/0207/${name}`;
  const row = authorFreeze.files.find(entry => absolute(entry.path) === absolute(source));
  assert.ok(row, source);
  await verify(source, row.sha256);
  const destination = `${canonical}/pages/0207/${name}`;
  await immutableWrite(destination, await bytes(source));
  outputs.push({ ...await bind(destination), originalPath: source });
}
for (const extension of ['png', 'svg']) {
  const source = `${author}/work/10p/pages/0207/figures/fig-181.${extension}`;
  const row = authorFreeze.files.find(entry => absolute(entry.path) === absolute(source));
  assert.ok(row, source);
  await verify(source, row.sha256);
  const destination = `${canonical}/figures/fig-181.${extension}`;
  await immutableWrite(destination, await bytes(source));
  outputs.push({ ...await bind(destination), originalPath: source });
}
const meterPath = `${ticket}/production-meter.json`;
const beforeIndex = await bytes(indexPath), beforeMeter = await bytes(meterPath);
const index = JSON.parse(beforeIndex), meter = JSON.parse(beforeMeter);
assert.equal(meter.currentCheckpoint.sourcePagesFinalized, 438);
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
  const destination = `${evidence}/reports/d617-source207-and-ready-candidates/${suffix}`;
  await immutableWrite(destination, await bytes(file));
  const row = { ...await bind(destination), originalPath: file, batch: 'D033' };
  index.reports.push(row);
  retained.push(row);
}
for (const name of [
  'd606-source207-first-independent-review',
  'd603-n76-fig177178-first-modern-author', 'd604-n76-fig179180-first-modern-author',
  'd608-n77-first-independent-text-review', 'd610-n77-first-written-answer-author',
  'd615-n77-r07-first-text-repair',
]) {
  const folder = `${base}/${name}`;
  for (const file of await walk(folder)) await retain(file, `${name}/${path.relative(folder, file)}`);
}
for (const name of ['d610-author-n77-first-written-answers.mjs',
  'd615-repair-n77-r07-formula-reference.mjs', 'd617-consume-source207-and-ready-candidates.mjs']) {
  await retain(`${base}/${name}`, name);
}
const find = file => {
  const row = [...retained, ...reused].find(entry => absolute(entry.originalPath) === absolute(file));
  assert.ok(row, file);
  return row;
};
const stages = meter.activeHumanDirection.nextSourceCheckpoints;
Object.assign(stages.source207, {
  status: 'FIRST-INDEPENDENT-SOURCE207-RAW181-SVG181-PASS-CONSUMED',
  SOURCE: 'PASS', RAW: 'PASS', SVG: 'PASS',
  firstIndependentReview: find(`${reviewFolder}/report.json`),
  firstIndependentFreeze: find(`${reviewFolder}/review-freeze.json`),
  sourcePagesAdded: 1, incoming206BodyRef: 'p0206#14',
  outgoing: 'HOLD-ACTUAL-p0207#7-UNFINISHED', n78Complete: false,
});
Object.assign(stages.n76, {
  figure177178FirstAuthor: find(`${base}/d603-n76-fig177178-first-modern-author/report.json`),
  figure177178FirstAuthorFreeze: find(`${base}/d603-n76-fig177178-first-modern-author/author-freeze.json`),
  figure179180FirstAuthor: find(`${base}/d604-n76-fig179180-first-modern-author/report.json`),
  figure179180FirstAuthorFreeze: find(`${base}/d604-n76-fig179180-first-modern-author/author-freeze.json`),
  figure179180RepairsUsed: 1,
  FIG: 'FIRST-INDEPENDENT-d611-d614-RUNNING', DISPLAY: 'FIRST-INDEPENDENT-d611-d614-RUNNING',
  completeCard: false,
});
Object.assign(stages.n77, {
  firstTextReview: find(`${base}/d608-n77-first-independent-text-review/report.json`),
  firstTextReviewFreeze: find(`${base}/d608-n77-first-independent-text-review/review-freeze.json`),
  firstSCI: 'PASS-TEXT-ONLY', firstZHEN: 'FAIL-EXACT-NUMERIC-REFERENCE-PRESERVATION',
  firstAffectedTextRepair: find(`${base}/d615-n77-r07-first-text-repair/report.json`),
  firstAffectedTextRepairFreeze: find(`${base}/d615-n77-r07-first-text-repair/author-freeze.json`),
  SCI: 'PASS-FIRST-INDEPENDENT-REUSED', ZHEN: 'R07-FIRST-AFFECTED-d616-RUNNING',
  textRepairsUsed: 1,
  firstWrittenAnswerAuthor: find(`${base}/d610-n77-first-written-answer-author/report.json`),
  firstWrittenAnswerAuthorFreeze: find(`${base}/d610-n77-first-written-answer-author/author-freeze.json`),
  ANSWER: 'FIRST-INDEPENDENT-d613-RUNNING', completeCard: false,
});
for (const [batch, count] of [['d603', 6], ['d604', 7], ['d606', 4], ['d608', 0]]) {
  const row = meter.activeHumanDirection.ephemeralImageBatches.find(entry => entry.batch === batch);
  assert.ok(row, batch);
  Object.assign(row, { actualImages: count, status: 'COMPLETED-CLOSED', imagesReturnedToParent: 0 });
}
for (const row of [
  { id: '01a1eea1-e1cb-79c2-a995-3402568a78dd', batch: 'd611', scope: 'N76-first-independent-FIG177178-DISPLAY', maximumImages: 8 },
  { id: '01a1eea3-cd9e-7503-a60e-e48bc108e821', batch: 'd612', scope: 'SOURCE208-first-author', maximumImages: 8 },
  { id: '01a1eea4-893f-7c11-b3ef-31f40348e11f', batch: 'd613', scope: 'N77-first-independent-eight-written-answers', maximumImages: 0 },
  { id: '01a1eea4-d551-7d73-8a01-3e24ec36e8d0', batch: 'd614', scope: 'N76-first-independent-FIG179180-DISPLAY', maximumImages: 8 },
  { id: '01a1eea5-e5c6-7cb1-83ea-c9543e94f57f', batch: 'd616', scope: 'N77-first-R07-affected-ZHEN', maximumImages: 0 },
]) {
  const existing = meter.activeHumanDirection.ephemeralImageBatches.find(old => old.id === row.id);
  if (!existing) meter.activeHumanDirection.ephemeralImageBatches.push({
    ...row, contextLimit: 24, initialImages: 0, actualImages: null,
    status: 'ASSIGNED-REPORT-PENDING-NOT-APPROVED', freshWithoutImageHistory: true,
    lifetime: 'SINGLE-BOUNDED-BATCH-CLOSE-AFTER-RETURN', permanentWorker: false,
    parentReceivesImages: false, resetsAnyOldBudget: false,
  });
}
meter.sourcePagesFinalized = meter.currentCheckpoint.sourcePagesFinalized = 439;
meter.currentCheckpoint.sourcePagesBasis += '; d617 first SOURCE20726/26, RAW181 and SVG181 PASS consumed; outgoing207HOLD unchanged, accepted206bodyref14 corrected in downstream references without old-file edits.';
const receiptPath = `${evidence}/reports/d617-source207-consumed-and-ready-candidates.json`;
await immutableWrite(receiptPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033',
  previousCheckpoint: meter.currentCheckpoint.nextBatch.latestProgress,
  source207: stages.source207, n76: stages.n76, n77: stages.n77,
  retained, reused, outputs, sourcePagesAdded: 1, sourcePagesFinalized: 439,
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
  sourceTotals: { ...meter.currentCheckpoint.nextBatch.sourceTotals, pages: 439 },
});
assert.deepEqual(meter.activeHumanDirection.currentImageCounts, oldCounts);
index.updatedAt = meter.updatedAt = new Date().toISOString();
assert.deepEqual(await bytes(indexPath), beforeIndex);
assert.deepEqual(await bytes(meterPath), beforeMeter);
await fs.writeFile(absolute(indexPath), serialize(index));
await fs.writeFile(absolute(meterPath), serialize(meter));
console.log(JSON.stringify({ receipt, sourcePagesFinalized: 439, completeDeliveredCards: 98, outputs }));

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
  'd450-source193-raw156157-first-independent-review',
  'd456-n71-q3-first-choice-seeds',
  'd458-n71-q3-first-choice-author',
  'd461-n72-first-independent-text-review',
  'd462-source196-first-independent-text-review',
  'd463-source158159-first-independent-figure-review',
  'd464-source160-first-independent-figure-review',
  'd467-source197-first-author',
  'd468-source161162-first-independent-figure-review',
  'd469-source163-first-independent-figure-review',
  'd472-n71-q12-first-choice-seeds',
  'd475-n73-first-source-preparation',
  'd477-source196-first-punctuation-repair',
  'd479-n72-first-table-identity-repair',
  'd482-source197-first-native-svg-previews',
];
const r450 = await read(`${base}/${folders[0]}/report.json`);
assert.equal(r450.image_budget.context_actual, 14);
assert.equal(r450.figures.find(row => row.id === 'fig-157').RAW.status, 'PASS');
assert.equal(r450.figures.find(row => row.id === 'fig-156').RAW.status, 'HOLD');
const r461 = await read(`${base}/${folders[3]}/report.json`);
assert.equal(r461.SCI, 'PASS');
assert.equal(r461.ZHEN, 'FAIL');
const r462 = await read(`${base}/${folders[4]}/report.json`);
assert.equal(r462.checks.SOURCE196_TEXT, 'FAIL');
assert.equal(r462.independent_basis.permission_seal_qualification.status, 'PROCEDURAL-HOLD');
const r463 = await read(`${base}/${folders[5]}/report.json`);
assert.equal(r463.image_budget.context_actual, 23);
assert.equal(r463.RAW158.status, 'HOLD');
assert.equal(r463.RAW159.status, 'HOLD');
const r464 = await read(`${base}/${folders[6]}/report.json`);
assert.equal(r464.RAW160.status, 'HOLD');
const r467 = await read(`${base}/${folders[7]}/report.json`);
assert.equal(r467.actual_opens.cumulative, 18);
assert.equal(r467.native.finalize.lines_md, 20);
assert.equal(r467.boundaries.boundary_status, 'SOURCE-AUTHOR-EVIDENCE-ONLY-INDEPENDENT-PENDING');
const r468 = await read(`${base}/${folders[8]}/report.json`);
assert.equal(r468.imageLedger.actualCumulative, 17);
assert.ok(r468.figures.every(row => row.RAW === 'HOLD' && row.SVG === 'HOLD'));
const r469 = await read(`${base}/${folders[9]}/report.json`);
assert.equal(r469.RAW163.verdict, 'PASS');
assert.equal(r469.SVG163.verdict, 'PASS');
const meterPath = `${ticket}/production-meter.json`;
const beforeIndex = await bytes(indexPath), beforeMeter = await bytes(meterPath);
const index = JSON.parse(beforeIndex), meter = JSON.parse(beforeMeter);
assert.equal(meter.currentCheckpoint.sourcePagesFinalized, 428);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 98);
const receiptPath = `${evidence}/reports/d485-first-figure-holds-text-repairs-and-source197-progress.json`;
assert.equal(await exists(receiptPath), false);
const retained = [], reused = [];
async function retain(file, suffix) {
  const original = await bind(file), prior = lookup(index, file, original.sha256);
  if (prior) {
    await verify(prior, original.sha256);
    reused.push({ path: prior, sha256: original.sha256, originalPath: file });
  } else {
    const destination = `${evidence}/reports/d485-bounded-progress/${suffix}`;
    await immutableWrite(destination, await bytes(file));
    const row = { ...await bind(destination), originalPath: file, batch: 'D033' };
    index.reports.push(row);
    retained.push(row);
  }
}
for (const name of folders) {
  for (const file of await walk(`${base}/${name}`)) {
    await retain(file, `${name}/${path.relative(`${base}/${name}`, file)}`);
  }
}
for (const name of [
  'd472-prepare-n71-q12-choice-seeds.mjs', 'd475-prepare-n73-source.mjs',
  'd477-source196-first-punctuation-repair.mjs', 'd479-n72-first-table-identity-repair.mjs',
  'd482-prepare-first-source197-svg-previews.mjs', 'd485-retain-source-figure-holds-and-text-repairs.mjs',
]) await retain(`${base}/${name}`, name);
const find = file => {
  const row = [...retained, ...reused].find(item => absolute(item.originalPath) === absolute(file));
  assert.ok(row, file);
  return row;
};
const stages = meter.activeHumanDirection.nextSourceCheckpoints;
Object.assign(stages.n71, {
  firstQ3ChoiceAuthor: find(`${base}/${folders[2]}/report.json`),
  Q3Choices: 'FIRST-STRUCTURE-PASS-INDEPENDENT-SEMANTIC-REVIEW-PENDING',
  firstQ12ChoicePreparation: find(`${base}/${folders[10]}/manifest.json`),
  Q12Choices: 'FIRST-SEEDS-PREPARED-FIRST-AUTHOR-QUEUED',
  completeChoiceCoverage: false, completeCard: false,
});
Object.assign(stages.n72, {
  status: 'FIRST-SCI-PASS-FIRST-ZHEN-FAIL-T001-SOLE-REPAIR-FROZEN-AFFECTED-REVIEW-PENDING',
  firstIndependentTextReview: find(`${base}/${folders[3]}/report.json`),
  firstTableIdentityRepair: find(`${base}/${folders[13]}/report.json`),
  SCI: 'PASS', ZHEN: 'FAIL-T001-HISTORY-RETAINED-AFFECTED-REVIEW-PENDING',
  affectedReview: 'd480-pending', completeCard: false,
});
Object.assign(stages.source193195, {
  firstRAW156157Review: find(`${base}/${folders[0]}/report.json`),
  firstRAW158159Review: find(`${base}/${folders[5]}/report.json`),
  firstRAW160Review: find(`${base}/${folders[6]}/report.json`),
  SOURCE_TEXT: 'PASS-existing-d448-d460-composition',
  RAW156: 'HOLD', SVG156: 'HOLD', RAW157: 'PASS', SVG157: 'PASS',
  RAW158: 'HOLD', SVG158: 'HOLD', RAW159: 'HOLD', SVG159: 'HOLD',
  RAW160: 'HOLD', SVG160: 'HOLD',
  SOURCE193: 'HOLD-156', SOURCE194: 'HOLD-158', SOURCE195: 'HOLD-159160',
  sourcePagesAdded: 0, completeCard: false,
});
Object.assign(stages.source196, {
  status: 'FIRST-TEXT-FAIL-SOLE-PUNCTUATION-REPAIR-FROZEN-PROCEDURAL-AND-FIGURE-HOLDS',
  firstTextReview: find(`${base}/${folders[4]}/report.json`),
  firstPunctuationRepair: find(`${base}/${folders[12]}/report.json`),
  firstRAW161162Review: find(`${base}/${folders[8]}/report.json`),
  firstRAW163Review: find(`${base}/${folders[9]}/report.json`),
  SOURCE_TEXT: 'FAIL-HISTORY-SOLE-REPAIR-PENDING-d478',
  proceduralHOLD: r462.independent_basis.permission_seal_qualification,
  RAW161: 'HOLD', SVG161: 'HOLD', RAW162: 'HOLD', SVG162: 'HOLD',
  RAW163: 'PASS', SVG163: 'PASS', sourcePagesAdded: 0, completeCard: false,
});
Object.assign(stages.source197, {
  status: 'FIRST-AUTHOR-FROZEN-20-ROWS-INDEPENDENT-TEXT-AND-FIGURE-REVIEWS-QUEUED',
  firstAuthor: find(`${base}/${folders[7]}/report.json`),
  firstAuthorFreeze: find(`${base}/${folders[7]}/author-freeze.json`),
  firstSourceSVGPreviews: find(`${base}/${folders[14]}/manifest.json`),
  nativeRows: [20, 20], authorBoundaries: r467.boundaries,
  SOURCE_TEXT: 'pending-d481', RAW: 'pending-d483-d484', SVG: 'pending-d483-d484',
  sourcePagesAdded: 0, completeCard: false,
});
stages.n73 = {
  status: 'FIRST-SCOPED-ASSEMBLY-PREPARED-FIRST-BILINGUAL-TEXT-AUTHOR-QUEUED',
  preparation: find(`${base}/${folders[11]}/manifest.json`),
  sourceQuestions: 0, proseBlocks: 17, scopedBodySOURCE: 'PASS-existing-text-composition',
  figures: ['fig-156', 'fig-157', 'fig-158', 'fig-159'],
  RAW156: 'HOLD', SVG156: 'HOLD', RAW157: 'PASS', SVG157: 'PASS',
  RAW158: 'HOLD', SVG158: 'HOLD', RAW159: 'HOLD', SVG159: 'HOLD',
  SCI: 'pending', ZHEN: 'pending', FIG: 'pending', DISPLAY: 'pending', completeCard: false,
};
for (const [id, count, report] of [
  ['01a1ed3f-7d6b-7f71-9b93-b1fa1b890279', 17, stages.source196.firstRAW161162Review],
  ['01a1ed52-30f6-77a1-a8f2-5286bda2967e', 17, stages.source196.firstRAW163Review],
  ['01a1ed57-e5cd-7ea3-8723-aad8c5ce8794', 23, stages.source193195.firstRAW158159Review],
  ['01a1ed5a-36d2-7a30-8e9d-475424d23b73', 18, stages.source197.firstAuthor],
]) {
  const batch = meter.activeHumanDirection.temporaryImageBatches.find(row => row.id === id);
  assert.ok(batch, id);
  Object.assign(batch, {
    cumulativeImageCount: count, lastReportedImageCount: count, report,
    cumulativeCountIsLastReported: true, noImageBudgetReset: true, compactionReset: false,
    status: 'LAST-FROZEN-RECEIPT-RETAINED-ONLY-BOUNDED-QUEUED-GAPS-CONTINUE',
  });
}
await immutableWrite(receiptPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033', status: 'DEVELOPING-BOUNDED-ACTUAL-PROGRESS',
  previousCheckpoint: meter.currentCheckpoint.nextBatch.latestProgress,
  humanResumeRemainsEffective: true, compactionIsNotAPause: true,
  n71: stages.n71, n72: stages.n72, n73: stages.n73,
  source193195: stages.source193195, source196: stages.source196, source197: stages.source197,
  retained, reused, sourcePagesAdded: 0, sourcePagesFinalized: 428,
  completeCardsAdded: 0, completeDeliveredCards: 98, completeCard: false,
  newParentImages: 0, parentImageCount: 24, noImageBudgetReset: true,
  historicalFAILHOLDPreserved: true, newPaidGeneration: 0,
  newPermanentWorkersWorktreesBranches: 0, DBMergeDeployCommitPush: false,
}));
const receipt = await bind(receiptPath);
index.reports.push({ ...receipt, batch: 'D033' });
Object.assign(meter.currentCheckpoint.nextBatch, {
  latestProgress: receipt, latestN72TextReview: stages.n72.firstIndependentTextReview,
  latestN72TableIdentityRepair: stages.n72.firstTableIdentityRepair,
  latestSource196TextReview: stages.source196.firstTextReview,
  latestSource196PunctuationRepair: stages.source196.firstPunctuationRepair,
  latestSource197Author: stages.source197.firstAuthor, latestN73Preparation: stages.n73.preparation,
});
index.updatedAt = meter.updatedAt = new Date().toISOString();
assert.deepEqual(await bytes(indexPath), beforeIndex);
assert.deepEqual(await bytes(meterPath), beforeMeter);
await fs.writeFile(absolute(indexPath), serialize(index));
await fs.writeFile(absolute(meterPath), serialize(meter));
console.log(JSON.stringify({ receipt, sourcePagesFinalized: 428, completeDeliveredCards: 98,
  retained: retained.length, reused: reused.length }));

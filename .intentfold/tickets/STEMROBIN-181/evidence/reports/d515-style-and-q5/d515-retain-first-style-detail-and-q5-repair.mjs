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
  'd500-t13-first-independent-written-answer-review',
  'd507-source198-style-first-detail-review',
  'd511-source167-first-original-detail-and-gate-review',
  'd512-source198-first-style-repair',
  'd514-t13-q5-first-written-answer-repair',
];
const answers = await read(`${base}/${folders[0]}/report.json`);
assert.equal(answers.SCI, 'FAIL');
assert.equal(answers.confirmedCandidateDefects.length, 1);
assert.equal(answers.confirmedCandidateDefects[0].id, 'S005');
const style = await read(`${base}/${folders[1]}/report.json`);
assert.equal(style.finding.verdict, 'FAIL');
const figure = await read(`${base}/${folders[2]}/report.json`);
assert.equal(figure.cumulative_images, 24);
assert.ok(figure.verdicts.RAW167_visible_source_extraction_gate.startsWith('PASS'));
assert.ok(figure.verdicts.SVG167_visible_source_extraction_gate.startsWith('PASS'));
const styleRepair = await read(`${base}/${folders[3]}/report.json`);
assert.equal(styleRepair.nativeInvocations, 1);
assert.equal(styleRepair.onlyChangedJSONLeaf, '/blocks/7/lines/1');
await verify(`${base}/${folders[4]}/report.json`,
  'd97b28986024325cd4f4060283f2e2a9bbc13070d3776ebc37573ddbc43acefc');

const meterPath = `${ticket}/production-meter.json`;
const beforeIndex = await bytes(indexPath), beforeMeter = await bytes(meterPath);
const index = JSON.parse(beforeIndex), meter = JSON.parse(beforeMeter);
assert.equal(meter.currentCheckpoint.sourcePagesFinalized, 429);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 98);
const receiptPath = `${evidence}/reports/d515-source198-first-style-and-t13-q5-repair-progress.json`;
assert.equal(await exists(receiptPath), false);
const retained = [], reused = [];
async function retain(file, suffix) {
  const original = await bind(file), prior = lookup(index, file, original.sha256);
  if (prior) {
    await verify(prior, original.sha256);
    reused.push({ path: prior, sha256: original.sha256, originalPath: file });
  } else {
    const destination = `${evidence}/reports/d515-style-and-q5/${suffix}`;
    await immutableWrite(destination, await bytes(file));
    const row = { ...await bind(destination), originalPath: file, batch: 'D033' };
    index.reports.push(row);
    retained.push(row);
  }
}
for (const name of folders) {
  const folder = `${base}/${name}`;
  for (const file of await walk(folder)) {
    await retain(file, `${name}/${path.relative(folder, file)}`);
  }
}
for (const name of [
  'd512-source198-first-style-repair.mjs', 'd515-retain-first-style-detail-and-q5-repair.mjs',
]) await retain(`${base}/${name}`, name);
const find = file => {
  const row = [...retained, ...reused].find(item => absolute(item.originalPath) === absolute(file));
  assert.ok(row, file);
  return row;
};
const stages = meter.activeHumanDirection.nextSourceCheckpoints;
Object.assign(stages.source198, {
  status: 'FIRST-STYLE-FAIL-SOLE-STYLE-REPAIR-FROZEN-26ROWS-NATIVE-PASS-AFFECTED-PENDING',
  firstStyleDetailReview: find(`${base}/${folders[1]}/report.json`),
  firstStyleRepair: find(`${base}/${folders[3]}/report.json`),
  firstStyleRepairFreeze: find(`${base}/${folders[3]}/author-freeze.json`),
  firstRAW167DetailReview: find(`${base}/${folders[2]}/report.json`),
  style: 'FIRST-FAIL-PRESERVED-REPAIR-NATIVE-PASS-FIRST-AFFECTED-d513-PENDING',
  RAW: 'PASS-NECESSARY-VISIBLE-EXTRACTION-GATE-ONLY-FINE-SEMANTICS-HOLD',
  SVG: 'PASS-NECESSARY-VISIBLE-EXTRACTION-GATE-ONLY-FINE-SEMANTICS-HOLD',
  figure167ResidualGates: figure.verdicts,
  SOURCE: 'PENDING-FIRST-STYLE-AFFECTED-AND-WHOLEPAGE-COMPOSITION',
  wholepageCompositionBatch: 'd518-source198-first-wholepage-composition',
  sourcePagesAdded: 0, completeCard: false, n75Complete: false,
});
Object.assign(stages.t13, {
  firstWrittenAnswerReview: find(`${base}/${folders[0]}/report.json`),
  firstQ5WrittenAnswerRepair: find(`${base}/${folders[4]}/report.json`),
  firstQ5WrittenAnswerRepairFreeze: find(`${base}/${folders[4]}/author-freeze.json`),
  answerSCI: 'FIRST-S005-FAIL-ONLY-SOLE-REPAIR-FROZEN-AFFECTED-d516-PENDING',
  answerZHEN: 'PASS-SCOPED-FIRST-BILINGUAL-MEANING',
  Q2ConditionalNumericBranch: 'SCIENTIFICALLY-VALID-WITH-EXPLICIT-MODEL-SOURCE-MEASUREMENT-HOLD-NO-EDIT',
  originalS005FAILPreserved: true, sourceHOLDsPreserved: true, completeCard: false,
  writtenAnswerAffectedReviewBatch: 'd516-t13-q5-first-affected-written-answer-review',
});
const observer = meter.activeHumanDirection.temporaryImageBatches.find(row =>
  row.id === '01a1ed5a-36d2-7a30-8e9d-475424d23b73');
assert.ok(observer);
Object.assign(observer, {
  cumulativeImageCount: 24, lastReportedImageCount: 24,
  report: stages.source198.firstRAW167DetailReview,
  status: 'IMAGE-BUDGET24-EXHAUSTED-ZERO-IMAGE-AFFECTED-REVIEWS-AND-COMPOSITION-ONLY',
  noImageBudgetReset: true, compactionReset: false,
});
meter.activeHumanDirection.currentImageCounts.Aquinas = 24;
meter.currentCheckpoint.nextBatch.imageCapacity =
  'Parent24, Laplace24, Poincare24, Aquinas24: no more images. Fermat23 is the last reported unchanged count; no new images assigned. No budget reset or new worker.';
await immutableWrite(receiptPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033', status: 'DEVELOPING-FIRST-AFFECTED-REVIEWS',
  previousCheckpoint: meter.currentCheckpoint.nextBatch.latestProgress,
  source198: stages.source198, t13: stages.t13, retained, reused,
  sourcePagesAdded: 0, sourcePagesFinalized: 429, completeCardsAdded: 0,
  completeDeliveredCards: 98, completeCard: false,
  humanResumeRemainsEffective: true, compactionIsNotAPause: true,
  currentImageCounts: meter.activeHumanDirection.currentImageCounts,
  newParentImages: 0, noImageBudgetReset: true, historicalFAILHOLDPreserved: true,
  newPaidGeneration: 0, newPermanentWorkersWorktreesBranches: 0,
  DBMergeDeployCommitPush: false,
}));
const receipt = await bind(receiptPath);
index.reports.push({ ...receipt, batch: 'D033' });
Object.assign(meter.currentCheckpoint.nextBatch, {
  latestProgress: receipt, latestSource198StyleRepair: stages.source198.firstStyleRepair,
  latestT13WrittenAnswerReview: stages.t13.firstWrittenAnswerReview,
  latestT13Q5WrittenAnswerRepair: stages.t13.firstQ5WrittenAnswerRepair,
});
index.updatedAt = meter.updatedAt = new Date().toISOString();
assert.deepEqual(await bytes(indexPath), beforeIndex);
assert.deepEqual(await bytes(meterPath), beforeMeter);
await fs.writeFile(absolute(indexPath), serialize(index));
await fs.writeFile(absolute(meterPath), serialize(meter));
console.log(JSON.stringify({ receipt, sourcePagesFinalized: 429, completeDeliveredCards: 98,
  retained: retained.length, reused: reused.length }));

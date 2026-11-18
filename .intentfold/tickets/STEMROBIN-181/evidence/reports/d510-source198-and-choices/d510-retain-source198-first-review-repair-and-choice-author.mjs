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
  'd497-source198-first-independent-text-review',
  'd502-t13-q367-first-bilingual-choice-author',
  'd505-source167-first-independent-figure-review',
  'd508-source198-first-punctuation-repair',
  'd509-source198-first-affected-punctuation-review',
];
const sourceReview = await read(`${base}/${folders[0]}/report.json`);
assert.equal(sourceReview.findings.filter(row => row.verdict === 'FAIL').length, 2);
assert.equal(sourceReview.findings.filter(row => row.verdict === 'HOLD').length, 1);
const choice = await read(`${base}/${folders[1]}/report.json`);
assert.deepEqual(choice.selected_source_numbers, ['3', '6', '7']);
const figure = await read(`${base}/${folders[2]}/report.json`);
assert.equal(figure.verdicts.RAW167_complete_source_fidelity, 'HOLD');
assert.equal(figure.verdicts.SVG167_complete_source_fidelity, 'HOLD');
assert.equal(figure.cumulative_images, 22);
const repair = await read(`${base}/${folders[3]}/report.json`);
assert.deepEqual(repair.rows, [26, 26]);
assert.equal(repair.nativeInvocations, 1);
const affected = await read(`${base}/${folders[4]}/report.json`);
assert.equal(affected.verdicts.affected_punctuation, 'PASS');
assert.equal(affected.exact_two_leaf_and_two_line_diff, true);

const meterPath = `${ticket}/production-meter.json`;
const beforeIndex = await bytes(indexPath), beforeMeter = await bytes(meterPath);
const index = JSON.parse(beforeIndex), meter = JSON.parse(beforeMeter);
assert.equal(meter.currentCheckpoint.sourcePagesFinalized, 429);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 98);
const receiptPath = `${evidence}/reports/d510-source198-first-reviews-repair-and-choice-author.json`;
assert.equal(await exists(receiptPath), false);
const retained = [], reused = [];
async function retain(file, suffix) {
  const original = await bind(file), prior = lookup(index, file, original.sha256);
  if (prior) {
    await verify(prior, original.sha256);
    reused.push({ path: prior, sha256: original.sha256, originalPath: file });
  } else {
    const destination = `${evidence}/reports/d510-source198-and-choices/${suffix}`;
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
const pendingFolder = 'd503-t13-q367-first-independent-choice-review';
for (const name of [
  'source-expected-baseline.json', 'baseline-freeze.json',
  'report.json', 'findings.json', 'actual-opens.json', 'review-freeze.json',
]) {
  const file = `${base}/${pendingFolder}/${name}`;
  assert.equal((await fs.stat(absolute(file))).mode & 0o777, 0o444);
  await retain(file, `${pendingFolder}/${name}`);
}
for (const name of [
  'd508-source198-first-punctuation-repair.mjs',
  'd510-retain-source198-first-review-repair-and-choice-author.mjs',
]) await retain(`${base}/${name}`, name);
const find = file => {
  const row = [...retained, ...reused].find(item => absolute(item.originalPath) === absolute(file));
  assert.ok(row, file);
  return row;
};
const stages = meter.activeHumanDirection.nextSourceCheckpoints;
Object.assign(stages.source198, {
  status: 'TWO-FIRST-TEXT-FAILS-SOLE-REPAIR-AFFECTED-PASS-STYLE-AND-RAW-SVG-HOLDS',
  firstTextReview: find(`${base}/${folders[0]}/report.json`),
  firstRAW167Review: find(`${base}/${folders[2]}/report.json`),
  firstPunctuationRepair: find(`${base}/${folders[3]}/report.json`),
  firstPunctuationAffectedReview: find(`${base}/${folders[4]}/report.json`),
  affectedPunctuation: 'PASS', style: 'HOLD-PENDING-FIRST-DETAIL-d507',
  RAW: 'LIMITED-VISIBLE-STRUCTURE-PASS-COMPLETE-FIDELITY-HOLD',
  SVG: 'LIMITED-VISIBLE-STRUCTURE-PASS-COMPLETE-FIDELITY-HOLD',
  firstFigureDetailBatch: 'd511-source167-first-original-detail-and-gate-review',
  sourcePagesAdded: 0, completeCard: false, firstFAILHistoryPreserved: true,
});
Object.assign(stages.t13, {
  firstSelectedChoiceAuthor: find(`${base}/${folders[1]}/report.json`),
  firstSelectedChoiceAuthorFreeze: find(`${base}/${folders[1]}/author-freeze.json`),
  firstChoiceReviewBaseline: find(`${base}/${pendingFolder}/baseline-freeze.json`),
  firstChoiceReviewPendingHistory: find(`${base}/${pendingFolder}/report.json`),
  choices: 'FIRST-Q3Q6Q7-STRUCTURE-PASS-FIRST-SEMANTIC-REVIEW-IN-PROGRESS',
  firstSemanticChoiceReviewFolder: `${base}/${pendingFolder}/first-semantic-review`,
  choiceSCI: 'pending', choiceZHEN: 'pending', completeChoiceCoverage: false,
});
const observer = meter.activeHumanDirection.temporaryImageBatches.find(row =>
  row.id === '01a1ed5a-36d2-7a30-8e9d-475424d23b73');
assert.ok(observer);
Object.assign(observer, {
  cumulativeImageCount: 22, lastReportedImageCount: 22,
  report: stages.source198.firstPunctuationAffectedReview,
  status: 'LAST-FROZEN-COUNT22-TWO-FIRST-DETAILS-ASSIGNED-HARD24-NO-FURTHER-ALLOCATION',
  cumulativeCountIsLastReported: true, noImageBudgetReset: true, compactionReset: false,
});
meter.activeHumanDirection.currentImageCounts.Aquinas = 22;
await immutableWrite(receiptPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033', status: 'DEVELOPING-BOUNDED-REVIEWS',
  previousCheckpoint: meter.currentCheckpoint.nextBatch.latestProgress,
  source198: stages.source198, t13: stages.t13, retained, reused,
  sourcePagesAdded: 0, sourcePagesFinalized: 429, completeCardsAdded: 0,
  completeDeliveredCards: 98, completeCard: false,
  humanResumeRemainsEffective: true, compactionIsNotAPause: true,
  newParentImages: 0, parentImageCount: 24, noImageBudgetReset: true,
  originalFAILHOLDPreserved: true, newPaidGeneration: 0,
  newPermanentWorkersWorktreesBranches: 0, DBMergeDeployCommitPush: false,
}));
const receipt = await bind(receiptPath);
index.reports.push({ ...receipt, batch: 'D033' });
Object.assign(meter.currentCheckpoint.nextBatch, {
  latestProgress: receipt, latestSource198AffectedReview: stages.source198.firstPunctuationAffectedReview,
  latestT13ChoiceAuthor: stages.t13.firstSelectedChoiceAuthor,
});
index.updatedAt = meter.updatedAt = new Date().toISOString();
assert.deepEqual(await bytes(indexPath), beforeIndex);
assert.deepEqual(await bytes(meterPath), beforeMeter);
await fs.writeFile(absolute(indexPath), serialize(index));
await fs.writeFile(absolute(meterPath), serialize(meter));
console.log(JSON.stringify({ receipt, sourcePagesFinalized: 429, completeDeliveredCards: 98,
  retained: retained.length, reused: reused.length }));

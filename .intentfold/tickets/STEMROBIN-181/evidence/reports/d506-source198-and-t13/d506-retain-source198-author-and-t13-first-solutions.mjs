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
  'd493-t13-first-independent-source-solutions',
  'd495-t13-first-bilingual-written-answer-author',
  'd496-source198-first-author',
  'd504-source198-first-native-svg-preview',
];
for (const [id, hash] of [
  ['d493', '47fb0dc9a6f2d35f2827c7bb33972f800929f93d9257d90048796103843809fd'],
  ['d495', '06f898f16475309ac5368942a51593f40d847fb72c8b4a1164641bf7019864d1'],
  ['d496', '08940bb5560173d18bac2fc76171cf07873a5931174b4497bccf0b16e09b9c79'],
]) await verify(`${base}/${folders.find(name => name.startsWith(id))}/report.json`, hash);
const solutions = await read(`${base}/${folders[0]}/report.json`);
assert.deepEqual(solutions.questionOutcomes.map(row => row.number), ['1', '2', '3', '4', '5', '6', '7']);
assert.equal(solutions.modernSCIOrZHENApprovalOfAnyAuthor, false);
const answers = await read(`${base}/${folders[1]}/report.json`);
assert.equal(answers.source_question_count, 7);
assert.equal(answers.automatic_grading_keys, 0);
assert.equal(answers.new_images, 0);
assert.equal(answers.cumulative_images, 18);
assert.equal(answers.native_answer_finalize_or_render, 0);
const author = await read(`${base}/${folders[2]}/report.json`);
assert.equal(author.first_native[0].rows_md, 26);
assert.equal(author.first_native[0].rows_printed, 26);
assert.equal(author.first_native[0].attempts, 1);
assert.equal(author.first_native[1].attempts, 1);
assert.equal(author.image_totals.cumulative, 24);
assert.equal(author.verdicts.SOURCE198_local_wholepage_fidelity, 'HOLD');

const meterPath = `${ticket}/production-meter.json`;
const beforeIndex = await bytes(indexPath), beforeMeter = await bytes(meterPath);
const index = JSON.parse(beforeIndex), meter = JSON.parse(beforeMeter);
assert.equal(meter.currentCheckpoint.sourcePagesFinalized, 429);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 98);
const receiptPath = `${evidence}/reports/d506-source198-author-and-t13-first-solutions.json`;
assert.equal(await exists(receiptPath), false);
const retained = [], reused = [];
async function retain(file, suffix) {
  const original = await bind(file), prior = lookup(index, file, original.sha256);
  if (prior) {
    await verify(prior, original.sha256);
    reused.push({ path: prior, sha256: original.sha256, originalPath: file });
  } else {
    const destination = `${evidence}/reports/d506-source198-and-t13/${suffix}`;
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
  'd504-prepare-source198-first-svg-preview.mjs',
  'd506-retain-source198-author-and-t13-first-solutions.mjs',
]) await retain(`${base}/${name}`, name);
const find = file => {
  const row = [...retained, ...reused].find(item => absolute(item.originalPath) === absolute(file));
  assert.ok(row, file);
  return row;
};
const stages = meter.activeHumanDirection.nextSourceCheckpoints;
Object.assign(stages.source198, {
  status: 'FIRST-AUTHOR-NATIVE-26-ROWS-PASS-TEXT-STYLE-AND-RAW-SVG-FIRST-REVIEW-PENDING',
  firstAuthor: find(`${base}/${folders[2]}/report.json`),
  firstAuthorFreeze: find(`${base}/${folders[2]}/author-freeze.json`),
  firstNativeSVGPreview: find(`${base}/${folders[3]}/manifest.json`),
  authorNativeRows: [26, 26], SOURCE: 'HOLD-PENDING-INDEPENDENT-TEXT-STYLE-AND-RAW-SVG',
  authorHOLDs: author.holds, authorBoundaries: author.boundaries_and_history,
  sourcePagesAdded: 0, completeCard: false, n75Complete: false,
});
Object.assign(stages.t13, {
  firstIndependentSourceSolutions: find(`${base}/${folders[0]}/independent-solutions.json`),
  firstIndependentSourceSolutionsReport: find(`${base}/${folders[0]}/report.json`),
  firstIndependentSourceSolutionsFreeze: find(`${base}/${folders[0]}/freeze.json`),
  firstWrittenAnswerAuthor: find(`${base}/${folders[1]}/report.json`),
  firstWrittenAnswerAuthorFreeze: find(`${base}/${folders[1]}/author-freeze.json`),
  independentQuestionOutcomes: solutions.questionOutcomes,
  writtenAnswerCandidates: 7, localizedWrittenAnswerCandidates: 14,
  writtenAnswers: 'FIRST-SEVEN-BILINGUAL-CANDIDATES-FROZEN-FIRST-INDEPENDENT-REVIEW-d500',
  automaticGradingKeys: 0, choiceQuestionsApprovedByThisBatch: 0,
  authorFirstStructuralFailure: answers.first_structural_failure,
  answerSCI: 'pending-d500', answerZHEN: 'pending-d500', completeCard: false,
});
const observer = meter.activeHumanDirection.temporaryImageBatches.find(row =>
  row.id === '01a1ed52-30f6-77a1-a8f2-5286bda2967e');
assert.ok(observer);
Object.assign(observer, {
  cumulativeImageCount: 24, lastReportedImageCount: 24,
  report: stages.source198.firstAuthor,
  status: 'SOURCE198-FIRST-AUTHOR-FROZEN-IMAGE-BUDGET-EXHAUSTED-ZERO-IMAGE-WORK-ONLY',
  noImageBudgetReset: true, compactionReset: false,
});
meter.activeHumanDirection.currentImageCounts.Poincare = 24;
await immutableWrite(receiptPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033', status: 'DEVELOPING-FIRST-SOURCE-AND-TASK-REVIEWS',
  previousCheckpoint: meter.currentCheckpoint.nextBatch.latestProgress,
  source198: stages.source198, t13: stages.t13, retained, reused,
  sourcePagesAdded: 0, sourcePagesFinalized: 429, completeCardsAdded: 0,
  completeDeliveredCards: 98, completeCard: false,
  humanResumeRemainsEffective: true, compactionIsNotAPause: true,
  newParentImages: 0, parentImageCount: 24, historicalFAILHOLDPreserved: true,
  noImageBudgetReset: true, newPaidGeneration: 0,
  newPermanentWorkersWorktreesBranches: 0, DBMergeDeployCommitPush: false,
}));
const receipt = await bind(receiptPath);
index.reports.push({ ...receipt, batch: 'D033' });
Object.assign(meter.currentCheckpoint.nextBatch, {
  latestProgress: receipt, latestSource198Author: stages.source198.firstAuthor,
  latestT13IndependentSolutions: stages.t13.firstIndependentSourceSolutions,
  latestT13WrittenAnswerAuthor: stages.t13.firstWrittenAnswerAuthor,
});
index.updatedAt = meter.updatedAt = new Date().toISOString();
assert.deepEqual(await bytes(indexPath), beforeIndex);
assert.deepEqual(await bytes(meterPath), beforeMeter);
await fs.writeFile(absolute(indexPath), serialize(index));
await fs.writeFile(absolute(meterPath), serialize(meter));
console.log(JSON.stringify({ receipt, sourcePagesFinalized: 429, completeDeliveredCards: 98,
  retained: retained.length, reused: reused.length }));

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
  'd441-n71-fig147148-first-author',
  'd447-n72-first-bilingual-text-author',
  'd448-source193195-first-independent-text-review',
  'd453-source196-first-author',
  'd455-n71-answer-q1-first-affected-review',
  'd459-source193194-first-literal-repair',
  'd460-source193194-first-affected-text-review',
  'd465-source197-first-preparation',
  'd466-source196-first-native-svg-previews',
];
const nativeFigures = await read(`${base}/${folders[0]}/report.json`);
assert.equal(nativeFigures.status, 'AUTHOR_HOLD_TERMINAL_NATIVE_FAIL');
assert.equal(nativeFigures.ledger.cumulative, 11);
assert.ok(nativeFigures.figures.every(row => row.NATIVE === 'FAIL_TERMINAL'));
const answers = await read(`${base}/${folders[4]}/report.json`);
assert.equal(answers.SCI, 'PASS');
assert.equal(answers.ZHEN, 'PASS');
assert.equal(answers.current_question_composition.length, 3);
const repairedText = await read(`${base}/${folders[6]}/report.json`);
assert.equal(repairedText.combined_current_TEXT, 'PASS');
assert.equal(repairedText.SOURCE193_TEXT, 'PASS');
assert.equal(repairedText.SOURCE194_TEXT, 'PASS');
const author196 = await read(`${base}/${folders[3]}/report.json`);
assert.equal(author196.actual_images.end, 16);
assert.equal(author196.boundary.n74_complete, false);
await verify(`${base}/${folders[5]}/report.json`,
  'c4c5f8ec2ca7a9782209639e01f2ef218220241efd38ebc4c13f4db0bce24a59');
const meterPath = `${ticket}/production-meter.json`;
const beforeIndex = await bytes(indexPath), beforeMeter = await bytes(meterPath);
const index = JSON.parse(beforeIndex), meter = JSON.parse(beforeMeter);
assert.equal(meter.currentCheckpoint.sourcePagesFinalized, 428);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 98);
const receiptPath = `${evidence}/reports/d470-n71-answer-pass-source193194-repair-and-next-source-progress.json`;
assert.equal(await exists(receiptPath), false);
const retained = [], reused = [];
async function retain(file, suffix) {
  const original = await bind(file);
  const prior = lookup(index, file, original.sha256);
  if (prior) {
    await verify(prior, original.sha256);
    reused.push({ path: prior, sha256: original.sha256, originalPath: file });
  } else {
    const destination = `${evidence}/reports/d470-bounded-progress/${suffix}`;
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
  'd459-source193194-first-literal-repair.mjs',
  'd465-prepare-source197.mjs',
  'd466-prepare-first-source196-svg-previews.mjs',
  'd470-retain-first-pass-and-next-source-progress.mjs',
]) await retain(`${base}/${name}`, name);
const find = file => {
  const row = [...retained, ...reused].find(item => absolute(item.originalPath) === absolute(file));
  assert.ok(row, file);
  return row;
};
const stages = meter.activeHumanDirection.nextSourceCheckpoints;
Object.assign(stages.n71, {
  status: 'TEXT-AND-THREE-ANSWER-SCI-ZHEN-PASS-TWO-FIGURES-TERMINAL-NATIVE-FAIL',
  firstFigureAuthor: find(`${base}/${folders[0]}/report.json`),
  firstFigureAuthorFreeze: find(`${base}/${folders[0]}/author-freeze.json`),
  firstAnswerAffectedReview: find(`${base}/${folders[4]}/report.json`),
  firstAnswerAffectedReviewFreeze: find(`${base}/${folders[4]}/review-freeze.json`),
  answers: 'THREE-CURRENT-ANSWERS-SCI-ZHEN-PASS-AFFECTED-Q1-PLUS-UNMODIFIED-Q2Q3',
  answerSCI: 'PASS', answerZHEN: 'PASS',
  FIG: 'HOLD-TERMINAL-NATIVE-FAIL-147148',
  DISPLAY: 'HOLD-NOT-LAUNCHED-TERMINAL-NATIVE-FAIL',
  figures: nativeFigures.figures.map(row => ({
    id: row.id, AUTHOR: row.AUTHOR, NATIVE: row.NATIVE, nativeExitCode: row.nativeExitCode,
    nativeDefects: row.nativeDefects, sourceProfile: row.sourceProfile,
  })),
  choices: 'Q3-FIRST-AUTHOR-RUNNING-Q1Q2-COVERAGE-MISSING',
  completeCard: false,
});
Object.assign(stages.n72, {
  status: 'FIRST-BILINGUAL-TEXT-FROZEN-FIRST-INDEPENDENT-SCI-ZHEN-REVIEW-RUNNING',
  firstTextAuthor: find(`${base}/${folders[1]}/report.json`),
  firstTextAuthorFreeze: find(`${base}/${folders[1]}/author-freeze.json`),
  firstIndependentTextReview: 'd461-pending-no-passed-stage-replay',
  completeCard: false,
});
Object.assign(stages.source193195, {
  firstTextReview: find(`${base}/${folders[2]}/report.json`),
  firstLiteralRepair: find(`${base}/${folders[5]}/report.json`),
  firstAffectedTextReview: find(`${base}/${folders[6]}/report.json`),
  SOURCE_TEXT: 'PASS-COMPOSED-193194-SOLE-AFFECTED-REPAIR-195-UNCHANGED-FIRST-PASS',
  SOURCE: 'PENDING-INTERNAL-RAW-SVG-GATES',
  sourcePagesAdded: 0, completeCard: false,
});
Object.assign(stages.source196, {
  status: 'FIRST-AUTHOR-FROZEN-22-ROWS-FIRST-INDEPENDENT-REVIEWS-PENDING',
  firstAuthor: find(`${base}/${folders[3]}/report.json`),
  firstAuthorFreeze: find(`${base}/${folders[3]}/author-freeze.json`),
  firstSourceSVGPreviews: find(`${base}/${folders[8]}/manifest.json`),
  nativeRows: [22, 22], boundary: author196.boundary,
  SOURCE: 'pending-d462-first-independent-text',
  RAW: 'pending-d468-d469-first-independent-figures',
  SVG: 'pending-d468-d469-first-independent-figures',
  sourcePagesAdded: 0, completeCard: false,
});
stages.source197 = {
  preparation: find(`${base}/${folders[7]}/manifest.json`),
  status: 'FIRST-PREPARED-NECESSARY-N74-EXERCISE8-RIGHT-BOUNDARY-AUTHOR-QUEUED',
  SOURCE: 'pending', RAW: 'pending', SVG: 'pending',
  sourcePagesAdded: 0, completeCard: false,
};
const batches = meter.activeHumanDirection.temporaryImageBatches;
for (const [id, count, report, status] of [
  ['01a1ed3f-7d6b-7f71-9b93-b1fa1b890279', 11, stages.n71.firstFigureAuthor, 'd441-terminal-fail-frozen-d461-first-review-running-d468-queued'],
  ['01a1ed52-30f6-77a1-a8f2-5286bda2967e', 12, stages.source193195.firstAffectedTextReview, 'd455-d460-pass-frozen-d462-first-review-running-d469-queued'],
  ['01a1ed5a-36d2-7a30-8e9d-475424d23b73', 16, stages.source196.firstAuthor, 'd453-author-frozen-d458-finishing-d467-next-author-queued-d463-self-review-cancelled'],
]) {
  const batch = batches.find(row => row.id === id);
  assert.ok(batch, id);
  Object.assign(batch, {
    status, report, cumulativeImageCount: count, lastReportedImageCount: count,
    cumulativeCountIsLastReported: true, noImageBudgetReset: true, compactionReset: false,
  });
}
await immutableWrite(receiptPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033', status: 'DEVELOPING-BOUNDED-ACTUAL-PROGRESS',
  previousCheckpoint: meter.currentCheckpoint.nextBatch.latestProgress,
  humanResumeRemainsEffective: true, compactionIsNotAPause: true,
  n71: stages.n71, n72: stages.n72,
  source193195: stages.source193195, source196: stages.source196, source197: stages.source197,
  independentReviewerCorrection: {
    cancelled: 'Aquinas-d463-source158159-self-review-assignment-withdrawn-no-verdict-consumed',
    assigned: 'Fermat-d463-after-d450-d464-with-actual-ledger-limit',
    noSelfReviewPassClaimed: true,
  },
  retained, reused, sourcePagesAdded: 0, sourcePagesFinalized: 428,
  completeCardsAdded: 0, completeDeliveredCards: 98, completeCard: false,
  newParentImages: 0, parentImageCount: 24, noImageBudgetReset: true,
  historicalFAILHOLDPreserved: true, newPaidGeneration: 0,
  newPermanentWorkersWorktreesBranches: 0, DBMergeDeployCommitPush: false,
}));
const receipt = await bind(receiptPath);
index.reports.push({ ...receipt, batch: 'D033' });
Object.assign(meter.currentCheckpoint.nextBatch, {
  latestProgress: receipt,
  latestSource193194TextAffectedReview: stages.source193195.firstAffectedTextReview,
  latestN71AnswerAffectedReview: stages.n71.firstAnswerAffectedReview,
  latestN71FigureAuthor: stages.n71.firstFigureAuthor,
  latestN72TextAuthor: stages.n72.firstTextAuthor,
  latestSource196Author: stages.source196.firstAuthor,
  latestSource197Preparation: stages.source197.preparation,
});
index.updatedAt = meter.updatedAt = new Date().toISOString();
assert.deepEqual(await bytes(indexPath), beforeIndex);
assert.deepEqual(await bytes(meterPath), beforeMeter);
await fs.writeFile(absolute(indexPath), serialize(index));
await fs.writeFile(absolute(meterPath), serialize(meter));
console.log(JSON.stringify({ receipt, sourcePagesFinalized: 428, completeDeliveredCards: 98,
  retained: retained.length, reused: reused.length }));

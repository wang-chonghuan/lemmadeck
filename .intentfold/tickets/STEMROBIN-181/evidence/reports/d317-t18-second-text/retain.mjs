import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  ticket, evidence, indexPath, absolute, relative, bytes, read, bind, verify,
  exists, immutableWrite, walk, lookup,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const base = `${ticket}/tmp`;
const authorFolder = `${base}/d308-t18-second-text-choice-author`;
const reviewFolder = `${base}/d309-t18-second-text-choice-review`;
const answerFolder = `${base}/d310-t18-second-written-answer-author`;
const answerReviewFolder = `${base}/d316-t18-second-written-answer-review`;
const baselineFolders = [
  `${base}/d312-t18-last-four-text-review`,
  `${base}/d319-t18-arc-flame-text-review`,
];
const inputBindings = [
  [`${authorFolder}/author-freeze.json`, '7df3fb2d54569841056e542292ab81bc023a6b35c38ca1417e497b1d61f8082f'],
  [`${authorFolder}/report.json`, '3007ad3fde9c6c9ff638665dca84be9306ab26050f67138eb7ab8743e71b710e'],
  [`${reviewFolder}/report.json`, '0694b47651dfdbabdc708c4b25194b898d2658639be995fafc0bfe8732807f42'],
  [`${answerFolder}/author-freeze.json`, '5e1a7e4895af4bc62c7dcd233b5d9edc542a41c15b70be71450f90205c3b4cb0'],
  [`${answerFolder}/written-answers.candidate.json`, '65f14bf82773b8df3c93d22886d99099ed7ee2d3ef3ec9a7c1b264889a241fd4'],
  [`${answerReviewFolder}/report.json`, '8dd5fd08542bc6e0a88ea9b3b5bd49fdc990cf7f8d59f269dc330a5444498fbd'],
  [`${baselineFolders[0]}/phase1-source-baseline.json`, 'dc775b1bfe802e6d8e7be582ffed2c642be0e9de3bfee553bf81a1cada7d50e3'],
  [`${baselineFolders[1]}/phase1-source-baseline.json`, '53188fe1a2ce3e54dcb9ae2e1686114ecafe1825a8f368e7191da59b7e88f521'],
];
for (const [file, sha] of inputBindings) {
  await verify(file, sha);
  assert.equal((await fs.stat(absolute(file))).mode & 0o777, 0o444);
}
const author = await read(`${authorFolder}/report.json`);
const review = await read(`${reviewFolder}/report.json`);
const answerReview = await read(`${answerReviewFolder}/report.json`);
assert.equal(author.status, 'AUTHOR_STRUCTURE_PASS_SEMANTIC_REVIEW_PENDING');
assert.equal(review.outcome, 'pass');
assert.equal(answerReview.outcome, 'pass');
assert.deepEqual(review.nativeValidation.map(row => row.exitCode), [0, 0]);
assert.ok(review.nativeValidation.every(row => row.attempts === 1));
assert.equal(answerReview.reviewedBilingualDisplayAnswers, 8);
assert.equal(answerReview.fullGate2PASS, false);
assert.equal(review.imagesOpened, 0);
const perLanguage = [];
for (const language of ['zh', 'en']) {
  const contractPath = `${reviewFolder}/${language}/review.json`;
  const contract = await read(contractPath);
  assert.equal(contract.outcome, 'pass');
  assert.equal(contract.reviewer.kind, 'independent_agent');
  assert.deepEqual(contract.source_reviews.map(row => row.source_number), ['4', '5', '6', '7']);
  assert.equal(contract.question_reviews.length, 4);
  const options = contract.question_reviews.reduce(
    (sum, row) => sum + row.mathematics.option_checks.length, 0);
  assert.equal(options, 17);
  perLanguage.push({ language, questions: 4, options, review: await bind(contractPath) });
}
const meterPath = `${ticket}/production-meter.json`;
const beforeIndex = await bytes(indexPath), beforeMeter = await bytes(meterPath);
const index = JSON.parse(beforeIndex), meter = JSON.parse(beforeMeter);
assert.equal(meter.status, 'developing');
assert.equal(meter.currentCheckpoint.sourcePagesFinalized, 419);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 98);
const t18 = meter.activeHumanDirection.nextSourceCheckpoints.t18;
assert.equal(t18.completeCard, false);
await verify(t18.latestProgress.path, t18.latestProgress.sha256);
const firstProgress = t18.latestProgress;
const receiptPath = `${evidence}/reports/d317-t18-second-text-progress.json`;
assert.equal(await exists(receiptPath), false);
await immutableWrite(`${base}/d317-progress/index.before.json`, beforeIndex);
await immutableWrite(`${base}/d317-progress/meter.before.json`, beforeMeter);
const retained = [], reused = [];
async function retain(file, destination) {
  const binding = await bind(file), prior = lookup(index, file, binding.sha256);
  if (prior) {
    await verify(prior, binding.sha256);
    const row = { originalPath: relative(file), path: prior, sha256: binding.sha256 };
    reused.push(row);
    return row;
  }
  await immutableWrite(destination, await bytes(file));
  const row = { ...await bind(destination), originalPath: relative(file), batch: 'D033' };
  index.reports.push(row);
  retained.push(row);
  return row;
}
for (const folder of [authorFolder, reviewFolder, answerFolder, answerReviewFolder, ...baselineFolders]) {
  for (const file of await walk(folder)) {
    assert.ok(!/\.(?:png|jpe?g|webp|svg)$/i.test(file), 'Text-only retention');
    await retain(file, `${evidence}/reports/d317-t18-second-text/${path.basename(folder)}/${path.relative(folder, file)}`);
  }
}
await retain(`${base}/d317-retain-t18-second-text-progress.mjs`,
  `${evidence}/reports/d317-t18-second-text/retain.mjs`);
const resolved = file => {
  const row = [...retained, ...reused].find(item => absolute(item.originalPath) === absolute(file));
  assert.ok(row, file);
  return row;
};
const body = {
  ticket: 'STEMROBIN-181', batch: 'D033', card: 'phy9-c2-s4-t18',
  status: 'DEVELOPING-EIGHT-SOURCE-TASKS-BILINGUAL-CHOICES-AND-WRITTEN-ANSWERS-PASS-SCOPED',
  firstProgress,
  sourceTasksThisBatch: ['4', '5', '6', '7'],
  cumulativeApprovedSourceTasks: ['2', '3', '4', '5', '6', '7', '11', '12'],
  choiceAuthorFreeze: resolved(`${authorFolder}/author-freeze.json`),
  choiceAuthorReport: resolved(`${authorFolder}/report.json`),
  choiceReview: resolved(`${reviewFolder}/report.json`),
  preKeySourceBaseline: resolved(`${reviewFolder}/phase1-source-baseline.json`),
  visibleOnlyReview: resolved(`${reviewFolder}/phase2-visible-review.json`),
  internalKeyComparison: resolved(`${reviewFolder}/phase3-internal-comparison.json`),
  perLanguage: perLanguage.map(row => ({ ...row, review: resolved(row.review.path) })),
  nativeValidation: review.nativeValidation.map(row => ({
    ...row, receipt: resolved(row.receipt.path),
  })),
  writtenAnswerFreeze: resolved(`${answerFolder}/author-freeze.json`),
  writtenAnswerCandidate: resolved(`${answerFolder}/written-answers.candidate.json`),
  writtenAnswerReview: resolved(`${answerReviewFolder}/report.json`),
  choiceOutcome: 'pass', answerOutcome: 'pass',
  thisBatch: { sourceTasks: 4, bilingualChoices: 8, bilingualOptions: 34, bilingualWrittenAnswers: 8 },
  cumulative: { sourceTasks: 8, choicesPerLanguage: 8, optionsPerLanguage: 34, bilingualWrittenAnswers: 16 },
  pendingLastFourBaseline: resolved(`${baselineFolders[0]}/phase1-source-baseline.json`),
  pendingArcFlameBaseline: resolved(`${baselineFolders[1]}/phase1-source-baseline.json`),
  pendingTasks: ['8', '10', '13', '14', '15', '16'],
  pendingTasksDisposition: 'First authoring by existing Galileo, Locke and Raman; neither approved nor blanket-HOLD.',
  retainedHolds: [
    'Exercise1 fig189 exhausted-repair and exercise9 discharge classification remain unchanged.',
    'Task2 arbitrary-time individual-path comparison and task3 material-specific mechanism shares remain underdetermined.',
    'Task5 unconditional real-cell concentration-independent deposition remains HOLD; approved choices/answers explicitly use the ordinary ideal model.',
    'Arc exact transient and flame quantitative/universal flow predictions require conditions not supplied; qualified source explanations may still be reviewed.',
  ],
  scope: 'First second-group source/visible/internal choice review plus first new written-answer SCI/ZHEN review. Existing text/source and first-group semantic passes were not rerun. Pre-author baselines for six remaining eligible text tasks are retained as pending, not passed.',
  actualVisualDISPLAY: false, fullGate2PASS: false, wholeCardApproved: false,
  completeDeliveredCards: 98, confirmedSourcePages: 419, completeCardsAdded: 0,
  completeCardClaim: false, oldFAILHOLDAndUncommittedBytesPreserved: true,
  newImages: 0, currentImageCounts: { parent: 24, Raman: 24, Galileo: 24, Locke: 24 },
  compactionReset: false, newWorkersWorktreesBranches: 0,
  DBMergeDeployCommitPushOrFormalHandoff: false,
  fullProjectTestsOrBuild: false, screenshotCaptures: 0, nativeRenders: 0,
  modelTokenUsage: null, costUsd: null, retained, reused,
};
await immutableWrite(receiptPath, `${JSON.stringify(body, null, 2)}\n`);
const receipt = await bind(receiptPath);
index.reports.push({ ...receipt, batch: 'D033' });
Object.assign(t18, {
  selectedSourceTasks: body.cumulativeApprovedSourceTasks,
  choiceOutcome: 'pass', answerOutcome: 'pass',
  choicesPerLanguage: 8, optionsPerLanguage: 34, bilingualWrittenAnswers: 16,
  secondChoiceReview: body.choiceReview, secondWrittenAnswerReview: body.writtenAnswerReview,
  secondWrittenAnswerCandidate: body.writtenAnswerCandidate,
  lastFourPreAuthorBaseline: body.pendingLastFourBaseline,
  arcFlamePreAuthorBaseline: body.pendingArcFlameBaseline,
  pendingTextSourceTasks: body.pendingTasks,
  nextTextBatch: { sourceTasks: body.pendingTasks, status: 'AUTHORING-NOT-APPROVED' },
  latestProgress: receipt, completeCard: false, fullGate2PASS: false, actualVisualDISPLAY: false,
});
Object.assign(meter.currentCheckpoint.nextBatch, {
  latestT18TextProgress: receipt, latestProgress: receipt,
  nextT18TextSourceTasks: body.pendingTasks,
});
meter.currentCheckpoint.newSourceReviews +=
  ' d308/d309/d310/d316/d317 t18 next4 bilingual choices and written answers independently passed once. Both native --review invocations exit0. Cumulative8 source tasks,16 written displays and34 options/language retained. Six remaining text tasks continue with pre-author baselines; no images or complete cards added.';
meter.countsStale = true;
meter.countsStaleReason += ' t18 eight-task scoped progress recorded separately; no global recomputation.';
index.updatedAt = meter.updatedAt = new Date().toISOString();
for (const [file, sha] of inputBindings) await verify(file, sha);
assert.deepEqual(await bytes(indexPath), beforeIndex);
assert.deepEqual(await bytes(meterPath), beforeMeter);
await fs.writeFile(absolute(indexPath), `${JSON.stringify(index, null, 2)}\n`);
await fs.writeFile(absolute(meterPath), `${JSON.stringify(meter, null, 2)}\n`);
console.log(JSON.stringify({
  receipt, retainedFiles: retained.length, reusedFiles: reused.length,
  sourceTasksApproved: 8, choicesPerLanguage: 8, optionsPerLanguage: 34,
  bilingualWrittenAnswers: 16, pendingTasks: body.pendingTasks,
  confirmedSourcePages: 419, completeDeliveredCards: 98, newImages: 0,
}));

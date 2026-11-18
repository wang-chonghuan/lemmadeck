import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  ticket, evidence, indexPath, absolute, relative, bytes, read, bind, verify,
  exists, immutableWrite, walk, lookup,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const base = `${ticket}/tmp`;
const authorFolder = `${base}/d313-t18-last-four-text-choice-author`;
const answerFolder = `${base}/d314-t18-last-four-written-answer-author`;
const reviewFolder = `${base}/d312-t18-last-four-text-review`;
const crossFolder = `${base}/d322-t18-choice-cross-group-review`;
const required = [
  [`${authorFolder}/author-freeze.json`, 'db3b436bdbf0e52ca26204921f688ab30b2a591a48747c71d58a48031d609f54'],
  [`${authorFolder}/report.json`, 'cbd9da1d03e606e0a77104204156794ad41f263d611bc2d07e86b895cfa92405'],
  [`${answerFolder}/author-freeze.json`, 'b33e637d296b84ba391c2f5ab76995bf0703f22933f29eed184c236e3d8c23ba'],
  [`${answerFolder}/written-answers.candidate.json`, '6ef45359adfd675955acec957faab79af54f5595b3e2cf8cbc1d4a71e431d280'],
  [`${reviewFolder}/written-answer-review.json`, '9e6105fd1e038dbada2e6b9457a74d92cfbcbc3a18996aaaceaf495956fc8d37'],
  [`${reviewFolder}/report.json`, '444660c8da629af52e40901bd279329e3f488f7f2e39dac798a9353629e1c4a4'],
  [`${crossFolder}/report.json`, '017aa538f083c0fc5a4ede5cdfaf662a42a92c6361f341d56c9e7eed5f9b9cd2'],
];
for (const [file, sha] of required) {
  await verify(file, sha);
  assert.equal((await fs.stat(absolute(file))).mode & 0o777, 0o444);
}
const review = await read(`${reviewFolder}/report.json`);
const answerReview = await read(`${reviewFolder}/written-answer-review.json`);
const cross = await read(`${crossFolder}/report.json`);
const selected = ['2', '3', '4', '5', '6', '7', '11', '12', '13', '14', '15', '16'];
assert.equal(review.outcome, 'pass');
assert.equal(answerReview.outcome, 'pass');
assert.deepEqual(review.nativeValidation.map(row => row.exitCode), [0, 0]);
assert.ok(review.nativeValidation.every(row => row.attempts === 1 && row.reviewSupplied));
assert.equal(answerReview.reviewedBilingualDisplayAnswers, 8);
assert.equal(cross.outcome, 'PASS');
assert.deepEqual(cross.scope.selectedSourceTasks, selected);
assert.equal(cross.whole16TaskPASS, false);
await verify(cross.inputBindings.path, cross.inputBindings.sha256);
for (const binding of (await read(cross.inputBindings.path)).inputs) {
  await verify(binding.path, binding.sha256);
}
const perLanguage = [];
for (const language of ['zh', 'en']) {
  const file = `${reviewFolder}/${language}/review.json`;
  const contract = await read(file);
  assert.equal(contract.outcome, 'pass');
  assert.equal(contract.reviewer.kind, 'independent_agent');
  assert.deepEqual(contract.source_reviews.map(row => row.source_number), ['13', '14', '15', '16']);
  assert.equal(contract.question_reviews.length, 4);
  assert.equal(contract.question_reviews.reduce((sum, row) => sum + row.mathematics.option_checks.length, 0), 16);
  perLanguage.push({ language, questions: 4, options: 16, review: await bind(file) });
}
const meterPath = `${ticket}/production-meter.json`;
const beforeIndex = await bytes(indexPath), beforeMeter = await bytes(meterPath);
const index = JSON.parse(beforeIndex), meter = JSON.parse(beforeMeter);
assert.equal(meter.status, 'developing');
assert.equal(meter.currentCheckpoint.sourcePagesFinalized, 419);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 98);
const t18 = meter.activeHumanDirection.nextSourceCheckpoints.t18;
assert.equal(t18.completeCard, false);
assert.equal(t18.choicesPerLanguage, 8);
assert.equal(t18.optionsPerLanguage, 34);
await verify(t18.latestProgress.path, t18.latestProgress.sha256);
const previousProgress = t18.latestProgress;
const receiptPath = `${evidence}/reports/d323-t18-last-four-text-progress.json`;
assert.equal(await exists(receiptPath), false);
await immutableWrite(`${base}/d323-progress/index.before.json`, beforeIndex);
await immutableWrite(`${base}/d323-progress/meter.before.json`, beforeMeter);
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
for (const folder of [authorFolder, answerFolder, reviewFolder, crossFolder]) {
  for (const file of await walk(folder)) {
    assert.ok(!/\.(?:png|jpe?g|webp|svg)$/i.test(file), 'Text-only retention');
    await retain(file, `${evidence}/reports/d323-t18-last-four-text/${path.basename(folder)}/${path.relative(folder, file)}`);
  }
}
for (const helper of ['finish-new-text-choice-review.mjs', 'd323-retain-t18-last-four-text-progress.mjs']) {
  await retain(`${base}/${helper}`, `${evidence}/reports/d323-t18-last-four-text/${helper}`);
}
const resolved = file => {
  const row = [...retained, ...reused].find(item => absolute(item.originalPath) === absolute(file));
  assert.ok(row, file);
  return row;
};
const body = {
  ticket: 'STEMROBIN-181', batch: 'D033', card: 'phy9-c2-s4-t18',
  status: 'DEVELOPING-TWELVE-SOURCE-TASKS-BILINGUAL-CHOICES-ANSWERS-AND-CROSS-GROUP-PASS-SCOPED',
  previousProgress,
  sourceTasksThisBatch: ['13', '14', '15', '16'],
  cumulativeApprovedSourceTasks: selected,
  choiceAuthorFreeze: resolved(`${authorFolder}/author-freeze.json`),
  choiceReview: resolved(`${reviewFolder}/report.json`),
  preKeySourceBaseline: resolved(`${reviewFolder}/phase1-source-baseline.json`),
  visibleOnlyReview: resolved(`${reviewFolder}/phase2-visible-review.json`),
  internalKeyComparison: resolved(`${reviewFolder}/phase3-internal-comparison.json`),
  perLanguage: perLanguage.map(row => ({ ...row, review: resolved(row.review.path) })),
  nativeValidation: review.nativeValidation.map(row => ({ ...row, receipt: resolved(row.receipt.path) })),
  writtenAnswerFreeze: resolved(`${answerFolder}/author-freeze.json`),
  writtenAnswerCandidate: resolved(`${answerFolder}/written-answers.candidate.json`),
  writtenAnswerReview: resolved(`${reviewFolder}/written-answer-review.json`),
  firstCrossGroupReview: resolved(`${crossFolder}/report.json`),
  crossGroupScope: 'Frozen twelve-choice base only; 48 cross-group pairs/language. Individual and within-group checks were not repeated.',
  choiceOutcome: 'pass', answerOutcome: 'pass',
  thisBatch: { sourceTasks: 4, bilingualChoices: 8, bilingualOptions: 32, bilingualWrittenAnswers: 8 },
  cumulative: { sourceTasks: 12, choicesPerLanguage: 12, optionsPerLanguage: 50, bilingualWrittenAnswers: 24 },
  pendingTasks: ['8', '10'],
  pendingTasksDisposition: 'First visible-only parent review frozen; author internal comparison, native review, written answers and affected package relationships remain separate pending steps.',
  retainedHolds: [
    'Exercise1 fig189 exhausted-repair and exercise9 discharge classification remain unchanged.',
    'Task5 unconditional real-cell deposition remains HOLD; approved outputs use explicit ordinary ideal/equal-efficiency scope.',
    'Exact unspecified arc transients and universal quantitative flame/one-way-flow predictions remain underdetermined.',
  ],
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
  selectedSourceTasks: selected, choiceOutcome: 'pass', answerOutcome: 'pass',
  choicesPerLanguage: 12, optionsPerLanguage: 50, bilingualWrittenAnswers: 24,
  lastFourChoiceReview: body.choiceReview, lastFourWrittenAnswerReview: body.writtenAnswerReview,
  lastFourWrittenAnswerCandidate: body.writtenAnswerCandidate,
  firstCrossGroupReview: body.firstCrossGroupReview,
  pendingTextSourceTasks: body.pendingTasks,
  nextTextBatch: { sourceTasks: body.pendingTasks, status: 'VISIBLE-PASS-INTERNAL-AND-ANSWER-PENDING' },
  latestProgress: receipt, completeCard: false, fullGate2PASS: false, actualVisualDISPLAY: false,
});
Object.assign(meter.currentCheckpoint.nextBatch, {
  latestT18TextProgress: receipt, latestProgress: receipt, nextT18TextSourceTasks: body.pendingTasks,
});
meter.currentCheckpoint.newSourceReviews +=
  ' d312/d313/d314/d322/d323 t18 last4 bilingual choices and written answers passed once; native --review exit0 per language. Twelve-task cross-group base PASS consumed without repeating individual checks. Cumulative12 tasks,24 written answers and50 options/language retained; tasks8/10 continue. Zero images/cards added.';
meter.countsStale = true;
meter.countsStaleReason += ' t18 twelve-task scoped progress recorded separately; no global recomputation.';
index.updatedAt = meter.updatedAt = new Date().toISOString();
for (const [file, sha] of required) await verify(file, sha);
assert.deepEqual(await bytes(indexPath), beforeIndex);
assert.deepEqual(await bytes(meterPath), beforeMeter);
await fs.writeFile(absolute(indexPath), `${JSON.stringify(index, null, 2)}\n`);
await fs.writeFile(absolute(meterPath), `${JSON.stringify(meter, null, 2)}\n`);
console.log(JSON.stringify({
  receipt, retainedFiles: retained.length, reusedFiles: reused.length,
  sourceTasksApproved: 12, choicesPerLanguage: 12, optionsPerLanguage: 50,
  bilingualWrittenAnswers: 24, pendingTasks: body.pendingTasks,
  confirmedSourcePages: 419, completeDeliveredCards: 98, newImages: 0,
}));

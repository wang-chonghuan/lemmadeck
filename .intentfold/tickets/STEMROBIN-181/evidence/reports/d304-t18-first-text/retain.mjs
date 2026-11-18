import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  ticket, evidence, indexPath, absolute, relative, bytes, read, bind, verify,
  exists, immutableWrite, walk, lookup,
} from './retain-d016-evidence.mjs';

const [execute, choiceReportSha, answerReportSha] = process.argv.slice(2);
assert.equal(execute, '--execute');
for (const sha of [choiceReportSha, answerReportSha]) {
  assert.match(sha ?? '', /^[a-f0-9]{64}$/);
}
const base = `${ticket}/tmp`;
const authorFolder = `${base}/d302-t18-text-choice-author`;
const reviewFolder = `${base}/d303-t18-text-choice-review`;
const answerFolder = `${base}/d305-t18-written-answer-author`;
const firstAnswerReviewFolder = `${base}/d306-t18-written-answer-review`;
const repairFolder = `${base}/d307-t18-answer-ex12-wording-repair`;
const answerReviewFolder = `${base}/d311-t18-answer-wording-affected-review`;
const reportPath = `${reviewFolder}/report.json`;
const answerReportPath = `${answerReviewFolder}/report.json`;
const inputBindings = [
  [`${authorFolder}/author-freeze.json`, '6d2b892aa7e513c2cc551bccc5faf49b02093be0b3f6885f99f15f572d05d98a'],
  [`${authorFolder}/report.json`, '9b11a0a654fec73813231a395019f65cddfd7742520540473e294aec995e8a62'],
  [`${reviewFolder}/phase1-source-review.json`, 'ab6a8e0fecf8b518bb415d13e545b2c4ff15f607ef20c47a2d6ac3b4b48d3467'],
  [reportPath, choiceReportSha],
  [`${answerFolder}/author-freeze.json`, '30872532ee5513f24605e1415b575865c4ed590a6e47c527494d5baf5233fd74'],
  [`${answerFolder}/written-answers.candidate.json`, 'dadb5418f459d6fd054888a8e216dda243f55eda540d27d99f7bca5de257cf63'],
  [`${firstAnswerReviewFolder}/first-review.json`, 'ba94e5db324769821e0bc40fef76a450e6686cce2030a3e10b188ef31c4bf390'],
  [answerReportPath, answerReportSha],
];
for (const [file, sha] of inputBindings) {
  await verify(file, sha);
  assert.equal((await fs.stat(absolute(file))).mode & 0o777, 0o444);
}
const choiceAuthor = await read(`${authorFolder}/report.json`);
const choiceReview = await read(reportPath);
const answerReview = await read(answerReportPath);
assert.equal(choiceAuthor.structuralPass, true);
assert.equal(choiceAuthor.newImages, 0);
assert.equal(answerReview.outcome, 'pass');
assert.equal(answerReview.affectedExercise, '12');
assert.equal(answerReview.affectedLanguage, 'zh');
assert.equal(answerReview.otherAnswersUnchanged, true);
assert.equal(answerReview.fullGate2PASS, false);
assert.equal(answerReview.imagesOpened, 0);
const choiceLanguages = [];
for (const language of ['zh', 'en']) {
  const reviewPath = `${reviewFolder}/${language}/review.json`;
  const contract = await read(reviewPath);
  assert.equal(contract.schema, 's10y-choice-review-v1');
  assert.equal(contract.reviewer.kind, 'independent_agent');
  assert.deepEqual(contract.source_reviews.map(row => row.source_number), ['2', '3', '11', '12']);
  assert.equal(contract.question_reviews.length, 4);
  const options = contract.question_reviews.reduce(
    (sum, row) => sum + row.mathematics.option_checks.length, 0);
  assert.equal(options, 17);
  choiceLanguages.push({
    language, originalTasks: 4, reviewedChoices: 4, reviewedOptions: options,
    outcome: contract.outcome, review: await bind(reviewPath),
    independentReviewer: contract.reviewer,
  });
}
const choicePass = choiceLanguages.every(row => row.outcome === 'pass');
if (choicePass) {
  assert.equal(choiceReview.outcome, 'pass');
  assert.deepEqual(choiceReview.nativeValidation.map(row => row.exitCode), [0, 0]);
  assert.ok(choiceReview.nativeValidation.every(row => row.attempts === 1 && row.reviewSupplied));
}
const meterPath = `${ticket}/production-meter.json`;
const beforeIndex = await bytes(indexPath), beforeMeter = await bytes(meterPath);
const index = JSON.parse(beforeIndex), meter = JSON.parse(beforeMeter);
assert.equal(meter.status, 'developing');
assert.equal(meter.currentCheckpoint.sourcePagesFinalized, 419);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 98);
const receiptPath = `${evidence}/reports/d304-t18-first-text-progress.json`;
assert.equal(await exists(receiptPath), false);
await immutableWrite(`${base}/d304-progress/index.before.json`, beforeIndex);
await immutableWrite(`${base}/d304-progress/meter.before.json`, beforeMeter);
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
for (const folder of [
  authorFolder, reviewFolder, answerFolder, firstAnswerReviewFolder,
  repairFolder, answerReviewFolder,
]) {
  for (const file of await walk(folder)) {
    assert.ok(!/\.(?:png|jpe?g|webp|svg)$/i.test(file), 'Text-only retention');
    await retain(file, `${evidence}/reports/d304-t18-first-text/${path.basename(folder)}/${path.relative(folder, file)}`);
  }
}
await retain(`${base}/d304-retain-t18-first-text-progress.mjs`,
  `${evidence}/reports/d304-t18-first-text/retain.mjs`);
const resolved = file => {
  const row = [...retained, ...reused].find(item => absolute(item.originalPath) === absolute(file));
  assert.ok(row, file);
  return row;
};
const body = {
  ticket: 'STEMROBIN-181', batch: 'D033', card: 'phy9-c2-s4-t18',
  status: choicePass
    ? 'DEVELOPING-FIRST-FOUR-BILINGUAL-CHOICES-AND-ANSWERS-PASS-CARD-HOLDS-PRESERVED'
    : 'DEVELOPING-FIRST-FOUR-BILINGUAL-ANSWER-PASS-CHOICE-FINDINGS-PRESERVED',
  choiceAuthorFreeze: resolved(`${authorFolder}/author-freeze.json`),
  choiceAuthorReport: resolved(`${authorFolder}/report.json`),
  choiceReview: resolved(reportPath),
  preKeyChoiceSourceReview: resolved(`${reviewFolder}/phase1-source-review.json`),
  visibleOnlyChoiceReview: resolved(`${reviewFolder}/phase2-visible-review.json`),
  perLanguage: choiceLanguages.map(row => ({ ...row, review: resolved(row.review.path) })),
  choiceOutcome: choiceReview.outcome,
  choiceNativeValidation: choiceReview.nativeValidation,
  choiceCoverage: choiceReview.coverage,
  firstAnswerFreeze: resolved(`${answerFolder}/author-freeze.json`),
  firstAnswerCandidate: resolved(`${answerFolder}/written-answers.candidate.json`),
  preKeyAnswerBaseline: resolved(`${firstAnswerReviewFolder}/phase1-source-baseline.json`),
  firstAnswerReview: resolved(`${firstAnswerReviewFolder}/first-review.json`),
  affectedAnswerReview: resolved(answerReportPath),
  repairedAnswerCandidate: resolved(answerReview.candidate.path),
  answerOutcome: 'pass', answerSourceTasks: 4, bilingualWrittenAnswers: 8,
  answerRepair: {
    finding: 'T18-ANSWER-ZHEN-F01', exercise: '12', language: 'zh',
    firstOutcome: 'revise', affectedOutcome: 'pass',
    otherAnswersReReviewed: false, firstFailurePreserved: true,
  },
  reviewedSourceTasks: 4, reviewedBilingualChoices: 8, reviewedBilingualOptions: 34,
  scope: 'First new choice source/visible/internal review and first new bilingual written-answer review, followed only by one Chinese phrase repair and affected review. Prior modern-text SCI and prior passing choices/answers are reused, not repeated.',
  newImages: 0, currentImageCounts: { parent: 24, Raman: 24, Galileo: 24, Locke: 24 },
  compactionReset: false, newWorkersWorktreesBranches: 0,
  nextTextBatch: {
    sourceTasks: ['4', '5', '6', '7'],
    status: 'CHOICE-AUTHORING-ANSWER-SCI-ZHEN-PASS-NOT-COMPLETE',
  },
  remaining: [
    'Exercise1 fig189 exhausted-repair HOLD and exercise9 discharge-type HOLD remain.',
    'Twelve tasks outside this first batch remain separately tracked; not all are HOLD.',
    'Task2 arbitrary-time individual-path comparison and task3 material-specific mechanism shares are not numerically determined by the source.',
    'Choice recognition does not prove independent construction or written reasoning.',
    'Actual visual DISPLAY, complete answer coverage, full native finalization and delivery remain missing.',
    'N68 unit-paragraph HOLD and missing modern fig135/136 and full DISPLAY remain.',
    'N69 SOURCE181/RAW137/RAW138 independent pixel review and SOURCE182 remain missing.',
  ],
  completeDeliveredCards: 98, confirmedSourcePages: 419, completeCardsAdded: 0,
  completeCardClaim: false, fullGate2PASS: false,
  oldFAILHOLDAndUncommittedBytesPreserved: true,
  nativeRenders: 0, screenshotCaptures: 0, fullProjectTestsOrBuild: false,
  DBMergeDeployCommitPushOrFormalHandoff: false,
  modelTokenUsage: null, costUsd: null, retained, reused,
};
await immutableWrite(receiptPath, `${JSON.stringify(body, null, 2)}\n`);
const receipt = await bind(receiptPath);
index.reports.push({ ...receipt, batch: 'D033' });
meter.activeHumanDirection.nextSourceCheckpoints.t18 = {
  card: body.card, selectedSourceTasks: ['2', '3', '11', '12'],
  choiceOutcome: body.choiceOutcome, choicesPerLanguage: 4, optionsPerLanguage: 17,
  choiceReview: body.choiceReview, answerOutcome: body.answerOutcome,
  bilingualWrittenAnswers: 8, answerReview: body.affectedAnswerReview,
  answerCandidate: body.repairedAnswerCandidate,
  firstAnswerFailure: body.firstAnswerReview,
  inheritedHolds: ['exercise1-fig189', 'exercise9-discharge-type'],
  nextTextBatch: body.nextTextBatch, latestProgress: receipt,
  wholeCardApproved: false, completeCard: false, fullGate2PASS: false,
  actualVisualDISPLAY: false,
};
Object.assign(meter.currentCheckpoint.nextBatch, {
  latestT18TextProgress: receipt, latestProgress: receipt,
  nextT18TextSourceTasks: ['4', '5', '6', '7'],
});
meter.currentCheckpoint.newSourceReviews +=
  ` d302/d303/d304 t18 first4 bilingual text-only choices reviewed once (${body.choiceOutcome}) with17 options/language. d305/d306 first8 written displays SCI reviewed; ex12 Chinese wording sole repair independently passed without re-reviewing other7 displays. No complete cards or image opens added.`;
meter.countsStale = true;
meter.countsStaleReason += ' t18 scoped choices and written-answer progress recorded separately, no global count recomputation.';
index.updatedAt = meter.updatedAt = new Date().toISOString();
for (const [file, sha] of inputBindings) await verify(file, sha);
assert.deepEqual(await bytes(indexPath), beforeIndex);
assert.deepEqual(await bytes(meterPath), beforeMeter);
await fs.writeFile(absolute(indexPath), `${JSON.stringify(index, null, 2)}\n`);
await fs.writeFile(absolute(meterPath), `${JSON.stringify(meter, null, 2)}\n`);
console.log(JSON.stringify({
  receipt, retainedFiles: retained.length, reusedFiles: reused.length,
  choiceOutcome: body.choiceOutcome, answerOutcome: 'pass',
  choicesPerLanguage: 4, optionsPerLanguage: 17, bilingualWrittenAnswers: 8,
  confirmedSourcePages: 419, completeDeliveredCards: 98, newImages: 0,
}));

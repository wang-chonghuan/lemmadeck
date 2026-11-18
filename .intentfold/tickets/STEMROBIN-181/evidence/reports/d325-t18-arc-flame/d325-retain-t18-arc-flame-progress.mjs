import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  ticket, evidence, indexPath, absolute, relative, bytes, read, bind, verify,
  exists, immutableWrite, walk, lookup,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const base = `${ticket}/tmp`;
const authorFolder = `${base}/d320-t18-arc-flame-text-author`;
const reviewFolder = `${base}/d319-t18-arc-flame-text-review`;
const crossFolder = `${base}/d324-t18-choice-cross-group-append-review`;
const required = [
  [`${authorFolder}/author-freeze.json`, '8d8f0293d772702e60bca1242039d4d050bbda3524f6b826295269a6d79984a6'],
  [`${authorFolder}/report.json`, '0d11e0b9beca1d93bb1fb145b6173f83012c6727ef53bc8bcc9475bf7edbe9b5'],
  [`${reviewFolder}/report.json`, 'c42f650fef20a09c85c8c3d2b7e012bd4d3dfa747d2ff6f983cfbef15839679b'],
  [`${reviewFolder}/written-answer-review.json`, '49af8d3c0c5e88f0529d4afe6a15cacd55360740fcfffd7476241eddf95828a7'],
  [`${crossFolder}/report.json`, '7c805da7763edf82772b92fccf472eb66b29b6c3ca284683459571405b746a76'],
];
for (const [file, sha] of required) {
  await verify(file, sha);
  assert.equal((await fs.stat(absolute(file))).mode & 0o777, 0o444);
}
const review = await read(`${reviewFolder}/report.json`);
const answerReview = await read(`${reviewFolder}/written-answer-review.json`);
const cross = await read(`${crossFolder}/report.json`);
assert.equal(review.outcome, 'pass');
assert.equal(answerReview.outcome, 'pass');
assert.deepEqual(review.sourceTasks, ['8', '10']);
assert.deepEqual(review.nativeValidation.map(row => row.exitCode), [0, 0]);
assert.ok(review.nativeValidation.every(row => row.attempts === 1 && row.reviewSupplied));
assert.equal(answerReview.reviewedBilingualDisplayAnswers, 4);
assert.equal(cross.outcome, 'PASS');
assert.deepEqual(cross.scope.newTasks, ['8', '10']);
assert.equal(cross.scope.newPairsPerLanguage, 25);
assert.equal(cross.baseReuse.oldCrossGroupPairsReReviewed, 0);
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
  assert.deepEqual(contract.source_reviews.map(row => row.source_number), ['8', '10']);
  assert.equal(contract.question_reviews.length, 2);
  assert.equal(contract.question_reviews.reduce((sum, row) => sum + row.mathematics.option_checks.length, 0), 9);
  perLanguage.push({ language, questions: 2, options: 9, review: await bind(file) });
}
const meterPath = `${ticket}/production-meter.json`;
const beforeIndex = await bytes(indexPath), beforeMeter = await bytes(meterPath);
const index = JSON.parse(beforeIndex), meter = JSON.parse(beforeMeter);
assert.equal(meter.status, 'developing');
assert.equal(meter.currentCheckpoint.sourcePagesFinalized, 419);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 98);
const t18 = meter.activeHumanDirection.nextSourceCheckpoints.t18;
assert.equal(t18.completeCard, false);
assert.equal(t18.choicesPerLanguage, 12);
assert.equal(t18.optionsPerLanguage, 50);
await verify(t18.latestProgress.path, t18.latestProgress.sha256);
const previousProgress = t18.latestProgress;
const selected = [...t18.selectedSourceTasks, ...review.sourceTasks].sort((a, b) => Number(a) - Number(b));
assert.equal(new Set(selected).size, 14);
const receiptPath = `${evidence}/reports/d325-t18-arc-flame-progress.json`;
assert.equal(await exists(receiptPath), false);
await immutableWrite(`${base}/d325-progress/index.before.json`, beforeIndex);
await immutableWrite(`${base}/d325-progress/meter.before.json`, beforeMeter);
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
for (const folder of [authorFolder, reviewFolder, crossFolder]) {
  for (const file of await walk(folder)) {
    assert.ok(!/\.(?:png|jpe?g|webp|svg)$/i.test(file), 'Text-only retention');
    await retain(file, `${evidence}/reports/d325-t18-arc-flame/${path.basename(folder)}/${path.relative(folder, file)}`);
  }
}
for (const helper of ['finish-new-text-choice-review.mjs', 'freeze-new-visible-choice-review.mjs',
  'd325-retain-t18-arc-flame-progress.mjs']) {
  await retain(`${base}/${helper}`, `${evidence}/reports/d325-t18-arc-flame/${helper}`);
}
const resolved = file => {
  const row = [...retained, ...reused].find(item => absolute(item.originalPath) === absolute(file));
  assert.ok(row, file);
  return row;
};
const body = {
  ticket: 'STEMROBIN-181', batch: 'D033', card: 'phy9-c2-s4-t18',
  status: 'DEVELOPING-FOURTEEN-TEXT-SOURCE-TASKS-BILINGUAL-CHOICES-ANSWERS-AND-RELATIONSHIPS-PASS-SCOPED',
  previousProgress, sourceTasksThisBatch: ['8', '10'], cumulativeApprovedSourceTasks: selected,
  choiceAuthorFreeze: resolved(`${authorFolder}/author-freeze.json`),
  choiceReview: resolved(`${reviewFolder}/report.json`),
  preKeySourceBaseline: resolved(`${reviewFolder}/phase1-source-baseline.json`),
  visibleOnlyReview: resolved(`${reviewFolder}/phase2-visible-review.json`),
  internalKeyComparison: resolved(`${reviewFolder}/phase3-internal-comparison.json`),
  perLanguage: perLanguage.map(row => ({ ...row, review: resolved(row.review.path) })),
  nativeValidation: review.nativeValidation.map(row => ({ ...row, receipt: resolved(row.receipt.path) })),
  writtenAnswerReview: resolved(`${reviewFolder}/written-answer-review.json`),
  writtenAnswerCandidates: answerReview.candidates.map(row => ({ language: row.language, ...resolved(row.path) })),
  firstCrossGroupReview: t18.firstCrossGroupReview,
  affectedCrossGroupReview: resolved(`${crossFolder}/report.json`),
  relationshipScope: 'Frozen twelve-base PASS reused; only25 newly introduced pairs/language reviewed. Individual and old package checks were not repeated.',
  choiceOutcome: 'pass', answerOutcome: 'pass',
  thisBatch: { sourceTasks: 2, bilingualChoices: 4, bilingualOptions: 18, bilingualWrittenAnswers: 4 },
  cumulative: { sourceTasks: 14, choicesPerLanguage: 14, optionsPerLanguage: 59, bilingualWrittenAnswers: 28 },
  pendingTextSourceTasks: [],
  missingFullLessonTasks: ['1', '9'],
  retainedHolds: [
    'Exercise1 fig189 exhausted-repair and exercise9 discharge classification remain unchanged;14/16 is not complete lesson coverage.',
    'Task5 unconditional real-cell deposition remains HOLD; reviewed outputs use explicit ideal/equal-efficiency scope.',
    'D320-S08-H01 unspecified arc cooling final/transient outcomes remain HOLD.',
    'D320-S10-H01 universal flow direction and quantitative carrier/force attribution remain HOLD.',
  ],
  nextNecessaryStages: [
    'Reuse these approved outputs when performing actual visual DISPLAY and complete native assembly; neither has run here.',
    'Retain source1/9 original HOLD dispositions; do not mark full16-task coverage or complete t18 delivery.',
    'SOURCE181/RAW137/138 independent pixel review and unread SOURCE182 still require genuine image capacity; no reset or new worker workaround.',
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
  choicesPerLanguage: 14, optionsPerLanguage: 59, bilingualWrittenAnswers: 28,
  arcFlameChoiceReview: body.choiceReview, arcFlameWrittenAnswerReview: body.writtenAnswerReview,
  arcFlameWrittenAnswerCandidates: body.writtenAnswerCandidates,
  affectedCrossGroupReview: body.affectedCrossGroupReview, pendingTextSourceTasks: [],
  nextTextBatch: { sourceTasks: [], status: 'FOURTEEN-TEXT-TASKS-PASS-SCOPED-NOT-FULL-LESSON' },
  missingFullLessonTasks: body.missingFullLessonTasks, nextNecessaryStages: body.nextNecessaryStages,
  latestProgress: receipt, wholeCardApproved: false, completeCard: false,
  fullGate2PASS: false, actualVisualDISPLAY: false,
});
Object.assign(meter.currentCheckpoint.nextBatch, {
  latestT18TextProgress: receipt, latestProgress: receipt, nextT18TextSourceTasks: [],
});
meter.currentCheckpoint.newSourceReviews +=
  ' d319/d320/d324/d325 t18 tasks8/10 bilingual choices/answers and25 appended relationships per language passed once; native --review exit0 each. Cumulative14 tasks,28 readonly written answers and59 options/language retained. Source1/9 and scope HOLDs remain; actual visual DISPLAY/full coverage still missing. Zero new images/cards.';
meter.countsStale = true;
meter.countsStaleReason += ' t18 fourteen-task scoped progress recorded separately; no global recomputation.';
index.updatedAt = meter.updatedAt = new Date().toISOString();
for (const [file, sha] of required) await verify(file, sha);
assert.deepEqual(await bytes(indexPath), beforeIndex);
assert.deepEqual(await bytes(meterPath), beforeMeter);
await fs.writeFile(absolute(indexPath), `${JSON.stringify(index, null, 2)}\n`);
await fs.writeFile(absolute(meterPath), `${JSON.stringify(meter, null, 2)}\n`);
console.log(JSON.stringify({
  receipt, retainedFiles: retained.length, reusedFiles: reused.length,
  sourceTasksApproved: 14, choicesPerLanguage: 14, optionsPerLanguage: 59,
  bilingualWrittenAnswers: 28, missingFullLessonTasks: body.missingFullLessonTasks,
  confirmedSourcePages: 419, completeDeliveredCards: 98, newImages: 0,
}));

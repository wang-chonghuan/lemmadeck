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
  'd491-n74-t13-first-independent-text-review',
  'd499-t13-first-text-choice-seeds',
];
const reviewPath = `${base}/${folders[0]}/report.json`;
await verify(reviewPath, '959199fcf36328a9a8b8b59ba1b47087021f8639ad89859ad339a8babe54f61c');
const review = await read(reviewPath);
assert.equal(review.cards[0].SCI, 'PASS');
assert.equal(review.cards[0].ZHEN, 'PASS');
assert.equal(review.cards[1].SCI, 'HOLD');
assert.equal(review.cards[1].ZHEN, 'PASS');
assert.equal(review.confirmed_candidate_FAIL_count, 0);
assert.equal(review.necessary_author_literal_repair_count, 0);
assert.equal(review.image_ledger.cumulative, 23);
const seedPath = `${base}/${folders[1]}/manifest.json`;
await verify(seedPath, '624520a98af35752c3deb7dce2c826c0cc800c00b13dbe739ca4caf118efe500');

const meterPath = `${ticket}/production-meter.json`;
const beforeIndex = await bytes(indexPath), beforeMeter = await bytes(meterPath);
const index = JSON.parse(beforeIndex), meter = JSON.parse(beforeMeter);
assert.equal(meter.currentCheckpoint.sourcePagesFinalized, 429);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 98);
const receiptPath = `${evidence}/reports/d501-n74-t13-first-review-and-text-choice-preparation.json`;
assert.equal(await exists(receiptPath), false);
const retained = [], reused = [];
async function retain(file, suffix) {
  const original = await bind(file), prior = lookup(index, file, original.sha256);
  if (prior) {
    await verify(prior, original.sha256);
    reused.push({ path: prior, sha256: original.sha256, originalPath: file });
  } else {
    const destination = `${evidence}/reports/d501-n74-t13-first-review/${suffix}`;
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
  'd499-prepare-t13-first-text-choice-seeds.mjs',
  'd501-retain-n74-t13-first-review-and-choice-preparation.mjs',
]) await retain(`${base}/${name}`, name);
const find = file => {
  const row = [...retained, ...reused].find(item => absolute(item.originalPath) === absolute(file));
  assert.ok(row, file);
  return row;
};
const stages = meter.activeHumanDirection.nextSourceCheckpoints;
for (const card of review.cards) {
  const name = card.card.endsWith('n74') ? 'n74' : 't13';
  Object.assign(stages[name], {
    status: name === 'n74'
      ? 'FIRST-BODY-TEXT-SCI-ZHEN-PASS-FIG-DISPLAY-PENDING'
      : 'SEVEN-PROMPTS-ZHEN-PASS-SCI-Q2-Q4-Q5-HOLD-NO-CANDIDATE-FAIL',
    firstTextReview: find(reviewPath), SCI: card.SCI, ZHEN: card.ZHEN,
    scientificScope: card.SCI_scope, necessaryAuthorLiteralRepairs: 0,
    completeCard: false, historicalFAILHOLDPreserved: true,
  });
}
Object.assign(stages.t13, {
  firstTextChoiceSeeds: find(seedPath),
  selectedChoiceSourceNumbers: ['3', '6', '7'],
  choices: 'FIRST-SELECTED-TEXT-ONLY-CHOICE-AUTHOR-ASSIGNED-d502',
  completeChoiceCoverage: false,
  writtenAnswers: 'FIRST-INDEPENDENT-SOURCE-SOLUTIONS-d493-AND-FIRST-BILINGUAL-CANDIDATES-d495-IN-PROGRESS',
  independentSolutionsBatch: 'd493-t13-first-independent-source-solutions',
  writtenAnswerAuthorBatch: 'd495-t13-first-bilingual-written-answer-author',
  choiceAuthorBatch: 'd502-t13-q367-first-bilingual-choice-author',
  Q1MaterialTableNumbers: 'HOLD-NOT-CONSUMED',
  Q2MeasurementAndQ4Q5Dependencies: 'HOLD-PRESERVED',
});
await immutableWrite(receiptPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033', status: 'DEVELOPING-SCOPED-TEXT-AND-TASKS',
  previousCheckpoint: meter.currentCheckpoint.nextBatch.latestProgress,
  n74: stages.n74, t13: stages.t13, source198: stages.source198,
  retained, reused, sourcePagesAdded: 0, sourcePagesFinalized: 429,
  completeCardsAdded: 0, completeDeliveredCards: 98, completeCard: false,
  candidateRepairs: 0, newParentImages: 0, parentImageCount: 24,
  humanResumeRemainsEffective: true, compactionIsNotAPause: true,
  historicalFAILHOLDPreserved: true, noImageBudgetReset: true,
  newPaidGeneration: 0, newPermanentWorkersWorktreesBranches: 0,
  DBMergeDeployCommitPush: false,
}));
const receipt = await bind(receiptPath);
index.reports.push({ ...receipt, batch: 'D033' });
Object.assign(meter.currentCheckpoint.nextBatch, {
  latestProgress: receipt, latestN74T13TextReview: stages.n74.firstTextReview,
  latestT13TextChoicePreparation: stages.t13.firstTextChoiceSeeds,
});
index.updatedAt = meter.updatedAt = new Date().toISOString();
assert.deepEqual(await bytes(indexPath), beforeIndex);
assert.deepEqual(await bytes(meterPath), beforeMeter);
await fs.writeFile(absolute(indexPath), serialize(index));
await fs.writeFile(absolute(meterPath), serialize(meter));
console.log(JSON.stringify({ receipt, sourcePagesFinalized: 429, completeDeliveredCards: 98,
  retained: retained.length, reused: reused.length }));

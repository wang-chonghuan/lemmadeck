import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  ticket, evidence, indexPath, absolute, bytes, read, bind, verify,
  exists, immutableWrite, walk, lookup,
} from './retain-d016-evidence.mjs';

const args = process.argv.slice(2);
assert.equal(args.length, 3);
assert.deepEqual(args.slice(0, 2), ['--execute', '--native-freeze-sha']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const base = `${ticket}/tmp`;
const folders = [
  'd520-t13-q7-first-choice-stem-repair',
  'd521-t13-q7-first-affected-choice-review',
  'd522-t13-first-native-review-validation',
  'd523-source199-first-preparation',
];
await verify(`${base}/${folders[0]}/author-freeze.json`,
  '0d7a28c51e1d4e4fb5432e86ce06991ccf2de3e794e105329b74f2cafd35b837');
await verify(`${base}/${folders[2]}/native-freeze.json`, args[2]);
await verify(`${base}/${folders[3]}/manifest.json`,
  '0d76728f26849b2659460217f31a0e5f9671cd9fa5f44c5bd15e9313c1e9867e');
const native = await read(`${base}/${folders[2]}/report.json`);
const nativeFreeze = await read(`${base}/${folders[2]}/native-freeze.json`);
for (const row of nativeFreeze.files) await verify(row.path, row.sha256);
const nativeInputs = await read(native.inputsBefore.path);
await verify(nativeInputs.reviewFreeze.path, nativeInputs.reviewFreeze.sha256);
const reviewFreeze = await read(nativeInputs.reviewFreeze.path);
for (const row of reviewFreeze.files) await verify(row.path, row.sha256);
assert.deepEqual(native.validateWithReviewCalls, { zh: 1, en: 1 });
assert.equal(native.newStandaloneStructureCalls, 0);
assert.equal(native.completeChoiceCoverage, false);
assert.equal(native.fullcard, false);
assert.equal(native.completeDeliveredCards, 98);
const preparation = await read(`${base}/${folders[3]}/manifest.json`);
assert.equal(preparation.prepareInvocations, 1);
assert.equal(preparation.sourcePagesAdded, 0);
assert.equal(preparation.n75Complete, false);
for (const row of preparation.inputs) await verify(row.path, row.sha256);
const meterPath = `${ticket}/production-meter.json`;
const beforeIndex = await bytes(indexPath), beforeMeter = await bytes(meterPath);
const index = JSON.parse(beforeIndex), meter = JSON.parse(beforeMeter);
assert.equal(meter.currentCheckpoint.sourcePagesFinalized, 430);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 98);
const receiptPath = `${evidence}/reports/d525-t13-selected-choice-and-source199-preparation.json`;
assert.equal(await exists(receiptPath), false);
const retained = [], reused = [];
async function retain(file, suffix) {
  const original = await bind(file), prior = lookup(index, file, original.sha256);
  if (prior) {
    await verify(prior, original.sha256);
    reused.push({ path: prior, sha256: original.sha256, originalPath: file });
    return;
  }
  const destination = `${evidence}/reports/d525-t13-and-next-source/${suffix}`;
  await immutableWrite(destination, await bytes(file));
  const row = { ...await bind(destination), originalPath: file, batch: 'D033' };
  index.reports.push(row);
  retained.push(row);
}
for (const name of folders) {
  const folder = `${base}/${name}`;
  for (const file of await walk(folder)) {
    await retain(file, `${name}/${path.relative(folder, file)}`);
  }
}
for (const name of [
  'd522-t13-first-native-review-validation.mjs',
  'd523-prepare-source199.mjs',
  'd525-retain-t13-choice-and-source199-preparation.mjs',
]) await retain(`${base}/${name}`, name);
const find = file => {
  const row = [...retained, ...reused].find(item => absolute(item.originalPath) === absolute(file));
  assert.ok(row, file);
  return row;
};
const passed = native.outcomes.every(row => row.exitCode === 0);
const stages = meter.activeHumanDirection.nextSourceCheckpoints;
Object.assign(stages.t13, {
  firstQ7StemRepair: find(`${base}/${folders[0]}/report.json`),
  firstQ7StemRepairFreeze: find(`${base}/${folders[0]}/author-freeze.json`),
  firstQ7AffectedChoiceReview: find(`${base}/${folders[1]}/report.json`),
  firstQ7AffectedChoiceReviewFreeze: find(`${base}/${folders[1]}/review-freeze.json`),
  firstSelectedChoiceNativeReview: find(`${base}/${folders[2]}/report.json`),
  firstSelectedChoiceNativeFreeze: find(`${base}/${folders[2]}/native-freeze.json`),
  choiceSCI: passed ? 'Q3-Q6-INHERITED-Q7-AFFECTED-PASS-SCOPED' : 'NATIVE-FAIL-HOLD-RETAINED',
  choiceZHEN: passed ? 'SELECTED-Q3-Q6-Q7-COMPOSED-PASS-SCOPED' : 'NATIVE-FAIL-HOLD-RETAINED',
  choiceNative: passed ? 'FIRST-VALIDATE-WITH-REVIEW-PASS-BOTH-LOCALES' : 'FIRST-NATIVE-FAIL-NO-REPLAY',
  selectedChoiceSourceNumbers: ['3', '6', '7'],
  unselectedChoiceSourceNumbers: ['1', '2', '4', '5'],
  nativeReviewCallsPerLocale: { zh: 1, en: 1 }, newStandaloneStructureCalls: 0,
  originalFirstQ7FAILPreserved: true, sourceAnswerHOLDsPreserved: true,
  completeChoiceCoverage: false, completeCard: false,
  choiceDISPLAY: 'NOT-RUN-NOT-PASSED',
});
stages.source199 = {
  status: 'FIRST-PREPARED-AUTHOR-ASSIGNED-NOT-INDEPENDENTLY-OBSERVED',
  firstPreparation: find(`${base}/${folders[3]}/manifest.json`),
  firstPreparationReceipt: find(`${base}/${folders[3]}/prepare-199.receipt.json`),
  firstAuthorBatch: 'd524-source199-first-author', authorCompletion: 'pending',
  SOURCE: 'HOLD-NOT-INDEPENDENTLY-OBSERVED', RAW: 'NOT-REVIEWED',
  sourcePagesAdded: 0, completeCard: false, n75Complete: false,
  originalAuthorImageCountAtAssignment: 23, originalAuthorRemainingCapacityAtAssignment: 1,
  independentReviewersRemainingImageCapacity: 0, noImageBudgetReset: true,
};
await immutableWrite(receiptPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033', status: 'DEVELOPING-SELECTED-CHOICES-AND-NEXT-SOURCE',
  previousCheckpoint: meter.currentCheckpoint.nextBatch.latestProgress,
  t13: stages.t13, source199: stages.source199, native: native.outcomes, retained, reused,
  sourcePagesAdded: 0, sourcePagesFinalized: 430, completeCardsAdded: 0,
  completeDeliveredCards: 98, completeCard: false,
  humanResumeRemainsEffective: true, compactionIsNotAPause: true,
  newParentImages: 0, parentImageCount: 24,
  helperImageCountsAtPreparation: meter.activeHumanDirection.currentImageCounts,
  noImageBudgetReset: true, historicalFAILHOLDPreserved: true, newPaidGeneration: 0,
  newPermanentWorkersWorktreesBranches: 0, DBMergeDeployCommitPush: false,
}));
const receipt = await bind(receiptPath);
index.reports.push({ ...receipt, batch: 'D033' });
Object.assign(meter.currentCheckpoint.nextBatch, {
  latestProgress: receipt,
  latestT13Q7StemRepair: stages.t13.firstQ7StemRepair,
  latestT13Q7AffectedChoiceReview: stages.t13.firstQ7AffectedChoiceReview,
  latestT13SelectedChoiceNative: stages.t13.firstSelectedChoiceNativeReview,
  latestSource199Preparation: stages.source199.firstPreparation,
});
index.updatedAt = meter.updatedAt = new Date().toISOString();
assert.deepEqual(await bytes(indexPath), beforeIndex);
assert.deepEqual(await bytes(meterPath), beforeMeter);
await fs.writeFile(absolute(indexPath), serialize(index));
await fs.writeFile(absolute(meterPath), serialize(meter));
console.log(JSON.stringify({ receipt, sourcePagesFinalized: 430, completeDeliveredCards: 98,
  nativePassed: passed, retained: retained.length, reused: reused.length }));

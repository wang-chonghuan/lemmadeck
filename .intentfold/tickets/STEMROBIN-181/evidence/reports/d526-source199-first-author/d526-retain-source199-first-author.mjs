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
const folder = `${base}/d524-source199-first-author`;
await verify(`${folder}/report.json`,
  'ff3c7082812d2b7b6a5289f521c497f71464319cf88f000d35a006485c62d37d');
await verify(`${folder}/author-freeze.json`,
  '2f6f0fee6eb81023493581fb988da83153827997afcc8c06158782dc0b4ad318');
await verify(`${folder}/actual-opens.json`,
  '14d16d868915286b66a23574cf84dfb65181f5d6096b871990c26ba28dfdef79');
const author = await read(`${folder}/report.json`);
const freeze = await read(`${folder}/author-freeze.json`);
for (const row of freeze.files) {
  await verify(row.path, row.sha256);
  assert.equal((await fs.stat(absolute(row.path))).mode & 0o777, 0o444, row.path);
}
assert.equal(author.physical_page, 199);
assert.equal(author.status, 'READY_FIRST_AUTHOR_NATIVE_ONLY_HOLD');
assert.equal(author.native_summary.finalize.attempts, 1);
assert.equal(author.native_summary.finalize.exit_code, 0);
assert.equal(author.native_summary.finalize.lines_md, 18);
assert.equal(author.native_summary.finalize.lines_printed, 18);
assert.equal(author.native_summary.vectorize.attempts, 1);
assert.equal(author.native_summary.vectorize.exit_code, 0);
assert.equal(author.native_summary.vectorize.native_passes, 4);
assert.equal(author.native_summary.reruns_or_repairs, 0);
assert.equal(author.SOURCE199, 'AUTHOR/native-only-HOLD');
assert.equal(author.SOURCE_fidelity_independent_PASS, false);
assert.equal(author.fullcard, false);
assert.equal(author.n75_complete, false);
assert.equal(author.canonical_consumption, false);
assert.deepEqual(author.image_totals,
  { old: 23, new: 1, cumulative: 24, limit: 24, budget_reset: false });
const opens = await read(`${folder}/actual-opens.json`);
assert.deepEqual(opens.totals, author.image_totals);
assert.equal(opens.opens.length, 1);
assert.equal(opens.opens[0].actual_returned_image, true);
for (const row of author.originals_unchanged) await verify(row.path, row.sha256);
const meterPath = `${ticket}/production-meter.json`;
const beforeIndex = await bytes(indexPath), beforeMeter = await bytes(meterPath);
const index = JSON.parse(beforeIndex), meter = JSON.parse(beforeMeter);
assert.equal(meter.currentCheckpoint.sourcePagesFinalized, 430);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 98);
assert.equal(meter.activeHumanDirection.currentImageCounts.Fermat, 23);
assert.equal(meter.activeHumanDirection.nextSourceCheckpoints.source199.authorCompletion, 'pending');
const receiptPath = `${evidence}/reports/d526-source199-first-author-native-only-hold.json`;
assert.equal(await exists(receiptPath), false);
const retained = [], reused = [];
async function retain(file, suffix) {
  const original = await bind(file), prior = lookup(index, file, original.sha256);
  if (prior) {
    await verify(prior, original.sha256);
    reused.push({ path: prior, sha256: original.sha256, originalPath: file });
    return;
  }
  const destination = `${evidence}/reports/d526-source199-first-author/${suffix}`;
  await immutableWrite(destination, await bytes(file));
  const row = { ...await bind(destination), originalPath: file, batch: 'D033',
    approvalScope: 'AUTHOR-NATIVE-ONLY-HOLD-NOT-INDEPENDENT-SOURCE-OR-MODERN-FIGURE' };
  index.reports.push(row);
  retained.push(row);
}
for (const file of await walk(folder)) {
  await retain(file, path.relative(folder, file));
}
await retain(`${base}/d526-retain-source199-first-author.mjs`,
  'd526-retain-source199-first-author.mjs');
const find = file => {
  const row = [...retained, ...reused].find(item => absolute(item.originalPath) === absolute(file));
  assert.ok(row, file);
  return row;
};
const stages = meter.activeHumanDirection.nextSourceCheckpoints;
Object.assign(stages.source199, {
  status: 'FIRST-AUTHOR-NATIVE-18-ROWS-FOUR-ORIGINAL-TRACES-FROZEN-SOURCE-HOLD',
  firstAuthor: find(`${folder}/report.json`),
  firstAuthorFreeze: find(`${folder}/author-freeze.json`),
  firstAuthorActualOpens: find(`${folder}/actual-opens.json`),
  firstAuthorObservation: find(`${folder}/source-observation-freeze.json`),
  authorCompletion: 'FROZEN-AUTHOR-EVIDENCE-ONLY',
  authorNative: author.native_summary,
  SOURCE: 'AUTHOR/native-only-HOLD', RAW: 'HOLD-PENDING-INDEPENDENT-PIXEL-REVIEW',
  SVG: 'HOLD-PENDING-INDEPENDENT-RENDERED-PIXEL-REVIEW',
  authorObservedBoundariesOnly: author.object_boundaries,
  figuresAuthorNativeOnly: author.figures,
  independentGates: author.independent_gates,
  sourcePagesAdded: 0, completeCard: false, n75Complete: false,
  actualAuthorImageCount: 24, originalAuthorRemainingImageCapacity: 0,
  independentReviewersRemainingImageCapacity: 0, noImageBudgetReset: true,
});
const observer = meter.activeHumanDirection.temporaryImageBatches.find(row =>
  row.id === '01a1ed57-e5cd-7ea3-8723-aad8c5ce8794');
assert.ok(observer);
Object.assign(observer, {
  cumulativeImageCount: 24, lastReportedImageCount: 24,
  report: stages.source199.firstAuthor,
  status: 'SOURCE199-FIRST-AUTHOR-FROZEN-IMAGE-BUDGET-EXHAUSTED-ZERO-IMAGE-WORK-ONLY',
  noImageBudgetReset: true, compactionReset: false,
});
meter.activeHumanDirection.currentImageCounts.Fermat = 24;
await immutableWrite(receiptPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033', status: 'DEVELOPING-FIRST-AUTHOR-EVIDENCE-RETAINED',
  previousCheckpoint: meter.currentCheckpoint.nextBatch.latestProgress,
  source199: stages.source199, t13: stages.t13, retained, reused,
  sourcePagesAdded: 0, sourcePagesFinalized: 430, completeCardsAdded: 0,
  completeDeliveredCards: 98, completeCard: false,
  humanResumeRemainsEffective: true, compactionIsNotAPause: true,
  newParentImages: 0, parentImageCount: 24,
  authorImagesAdded: 1, authorImageCount: 24,
  helperImageCounts: meter.activeHumanDirection.currentImageCounts,
  furtherImageOpeningBlockedByExistingBudgets: true,
  lawfulContinuationBoundary: 'Existing text-only eligible gaps only. No source200 preparation, image reopening, budget reset, new worker, or promotion of SOURCE199/n75 is authorized by this receipt.',
  noImageBudgetReset: true, historicalFAILHOLDPreserved: true, newPaidGeneration: 0,
  newPermanentWorkersWorktreesBranches: 0, DBMergeDeployCommitPush: false,
}));
const receipt = await bind(receiptPath);
index.reports.push({ ...receipt, batch: 'D033' });
Object.assign(meter.currentCheckpoint.nextBatch, {
  latestProgress: receipt, latestSource199Author: stages.source199.firstAuthor,
  latestSource199AuthorFreeze: stages.source199.firstAuthorFreeze,
  latestSource199AuthorNative: stages.source199.firstAuthor,
  source199IndependentRelease: 'HOLD-NO-REVIEWER-IMAGE-CAPACITY',
});
index.updatedAt = meter.updatedAt = new Date().toISOString();
assert.deepEqual(await bytes(indexPath), beforeIndex);
assert.deepEqual(await bytes(meterPath), beforeMeter);
await fs.writeFile(absolute(indexPath), serialize(index));
await fs.writeFile(absolute(meterPath), serialize(meter));
console.log(JSON.stringify({ receipt, sourcePagesFinalized: 430, completeDeliveredCards: 98,
  SOURCE199: stages.source199.SOURCE, FermatImageCount: 24,
  retained: retained.length, reused: reused.length }));

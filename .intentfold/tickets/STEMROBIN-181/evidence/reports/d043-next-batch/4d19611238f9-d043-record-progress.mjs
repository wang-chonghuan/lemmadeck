import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  ticket, evidence, indexPath, absolute, relative, read, bytes, bind, verify,
  immutableWrite, walk, hash,
} from './retain-d016-evidence.mjs';

const [execute, figureReviewHash] = process.argv.slice(2);
assert.equal(execute, '--execute');
const figureReviewPath = `${ticket}/tmp/d043-10p-fig6667-independent-review.json`;
await verify(figureReviewPath, figureReviewHash);
const inputs = {
  n36Author: [`${ticket}/tmp/d042-10p-n36-author/complete/author-freeze.json`, '9aa558e9044043d45890bf9bfb7a9f7c5df81176490669f8eb3d154c2eb0e0bf'],
  n36Science: [`${ticket}/tmp/d043-10p-n36-science-review.json`, 'fa5462d33f6ce60087f1931b4187729a8201cf8a747d7c852f2febf0bc2b14b8'],
  n36FlowRepair: [`${ticket}/tmp/d043-10p-n36-flow-repair/repair-freeze.json`, '8806d1763a05258cbe818edfcde489408292c36ba46fb80b2e1dcf4b0a024f28'],
  n36GroupingDiagnosis: [`${ticket}/tmp/d043-10p-n36-flow-repair/grouping-diagnosis.json`, '384d2b1e30ca051fd968564eddda661768d2474e64474aff338dc8e2b2a79270'],
  n37Science: [`${ticket}/tmp/d042-10p-n37-science-affected-review.json`, 'efa24ec31ecda7949e6624040126e0972ad21473e137581c5c3c8f1acd3f202a'],
  n37Repair: [`${ticket}/tmp/d042-10p-n37-text-repair/repair-freeze.json`, '040c999659a9c732a0039eae5c24b3c7fb8e72e56657321d9faa2e1d57800b79'],
  figureAuthor: [`${ticket}/tmp/d043-10p-fig6667-author/author-freeze.json`, '01fc6b90c14515f484dea95c210aaecc51ee747f547a2fd08ae9182a5c2d6c81'],
  figureReview: [figureReviewPath, figureReviewHash],
};
for (const [file, sha] of Object.values(inputs)) await verify(file, sha);
const n36Science = await read(inputs.n36Science[0]);
const n36Repair = await read(inputs.n36FlowRepair[0]);
assert.equal(n36Science.SCI, true);
assert.equal(n36Science.ZHEN, false);
assert.equal(n36Repair.status, 'HOLD-native-normalization-overwrites-reviewed-grouping');
const n37Science = await read(inputs.n37Science[0]);
assert.equal(n37Science.effectiveSCI, 'PASS');
assert.equal(n37Science.effectiveZHEN, 'PASS');
const figureAuthor = await read(inputs.figureAuthor[0]);
assert.deepEqual(figureAuthor.figures.map(row => row.id), ['fig-66', 'fig-67']);
assert.ok(figureAuthor.figures.every(row => row.targetedRepairs === 1));
const figureReview = await read(figureReviewPath);
assert.deepEqual(figureReview.figures.map(row => row.id), ['fig-66', 'fig-67']);
assert.equal(figureReview.figures[0].status, 'PASS');
assert.equal(figureReview.figures[1].status, 'HOLD');
const indexBefore = await bytes(indexPath);
const meterPath = `${ticket}/production-meter.json`;
const meterBefore = await bytes(meterPath);
const index = JSON.parse(indexBefore);
const retained = [];
async function retain(file) {
  file = relative(file);
  assert.ok(!file.split('/').includes('.env'));
  const old = retained.find(row => row.originalPath === file);
  if (old) return { path: old.path, sha256: old.sha256 };
  const target = `${evidence}/reports/d043-next-batch/${hash(Buffer.from(file)).slice(0, 12)}-${path.basename(file)}`;
  await immutableWrite(target, await bytes(file));
  const row = { ...await bind(target), originalPath: file, role: 'Unfinished next-batch stage; not complete-card evidence' };
  index.reports.push(row);
  retained.push(row);
  return { path: row.path, sha256: row.sha256 };
}
const reports = {};
for (const [name, [file]] of Object.entries(inputs)) reports[name] = await retain(file);
for (const folder of [
  `${ticket}/tmp/d042-10p-n36-author`,
  `${ticket}/tmp/d043-10p-n36-science-review-evidence`,
  `${ticket}/tmp/d043-10p-n36-flow-repair`,
  `${ticket}/tmp/d042-10p-n37-text-repair`,
  `${ticket}/tmp/d043-10p-fig6667-author`,
  `${ticket}/tmp/d043-10p-fig6667-independent-review-evidence`,
]) {
  for (const file of await walk(folder)) {
    if (!file.endsWith('page.grid.png')) await retain(file);
  }
}
for (const file of [
  `${ticket}/tmp/d043-finalize-n36.mjs`, `${ticket}/tmp/d043-repair-n36-flow.mjs`,
  `${ticket}/tmp/d043-diagnose-n36-grouping.mjs`, process.argv[1],
]) await retain(file);
const receipt = `${evidence}/reports/d043-next-batch-progress.json`;
await immutableWrite(receipt, `${JSON.stringify({
  ticket: 'STEMROBIN-181', status: 'unfinished-stage-checkpoint',
  reports, retained,
  n36: { SCI: 'PASS', ZHEN: 'HOLD-native-paragraph-grouping', sourceExercises: 4,
    nativeFinalized: false, answers: 'pending', choices: 'pending', display: 'pending',
    originalAuthorFreezeAndFailurePreserved: true, fullCardApproval: false },
  n37: { SCI: 'PASS-affected-only', ZHEN: 'PASS-affected-only',
    figures6667: reports.figureReview, figureReviewStatus: figureReview.status,
    independentlyPassedFigures: ['fig-66'], heldFigures: ['fig-67'],
    missingFigures: ['fig-64', 'fig-65', 'fig-68'], fullCardApproval: false },
  canonicalPromotion: false, newCompleteCards: 0, sourcePagesAdded: 0,
  nativeNormalizationBypassed: false, sharedToolChanges: false,
  fullProjectTestsOrBuildRun: false, databaseWrites: 0, commits: 0, pushes: 0,
  newParentImageOpens: 0,
}, null, 2)}\n`);
index.reports.push(await bind(receipt));
index.updatedAt = new Date().toISOString();
const meter = JSON.parse(meterBefore);
const cp = meter.currentCheckpoint;
assert.equal(cp.completeDeliveredCards, 86);
assert.equal(cp.modernReadyArtifacts, 89);
assert.equal(cp.sourcePagesFinalized, 383);
assert.equal(cp.sourceWrittenExercises, 219);
assert.deepEqual([...cp.completeUnbatchedCards].sort(),
  ['phy10-c1-s4-n31', 'phy9-c2-s7-n134', 'phy9-conclusion'].sort());
cp.newSourceReviews = 'n31/n134/conclusion complete local; n133/n35 HOLD. SOURCE112-115 consumed. n36 SCI PASS but native paragraph normalization HOLD; n37 affected SCI/ZHEN PASS, remaining figures incomplete.';
cp.nextBatch.nextStageCheckpoint = await bind(receipt);
cp.nextBatch.n36TextStage = {
  card: 'phy10-c1-s4-n36', status: 'HOLD-native-normalization-overwrites-reviewed-grouping',
  sourceExercises: 4, SCI: 'PASS', ZHEN: 'HOLD-layout',
  author: reports.n36Author, science: reports.n36Science, repair: reports.n36FlowRepair,
  groupingDiagnosis: reports.n36GroupingDiagnosis,
  fullCardApproval: false,
};
cp.nextBatch.n37TextStage = {
  card: 'phy10-c1-s5-n37', SCI: 'PASS', ZHEN: 'PASS', science: reports.n37Science,
  repair: reports.n37Repair, figureAuthor: reports.figureAuthor, figureReview: reports.figureReview,
  figureReviewStatus: figureReview.status, missingFigures: ['fig-64', 'fig-65', 'fig-68'],
  independentlyPassedFigures: ['fig-66'], heldFigures: ['fig-67'],
  fullCardApproval: false,
};
meter.updatedAt = new Date().toISOString();
assert.deepEqual(await bytes(indexPath), indexBefore);
assert.deepEqual(await bytes(meterPath), meterBefore);
await fs.writeFile(absolute(indexPath), `${JSON.stringify(index, null, 2)}\n`);
await fs.writeFile(absolute(meterPath), `${JSON.stringify(meter, null, 2)}\n`);
console.log(JSON.stringify({ receipt: await bind(receipt), completeUnbatchedCards: cp.completeUnbatchedCards }));

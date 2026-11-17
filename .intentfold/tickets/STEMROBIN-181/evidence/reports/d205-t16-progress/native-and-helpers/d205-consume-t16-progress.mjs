import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  ticket, evidence, indexPath, absolute, bytes, read, bind, verify, exists, walk,
  immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const receiptPath = `${evidence}/reports/d205-t16-native-q3-and-source-author-progress.json`;
assert.equal(await exists(receiptPath), false);
const q3Path = `${ticket}/tmp/d196-t16-q3-independent-review/report.json`;
await verify(q3Path, 'f7fadd77291485dd3e73da57d11ca5a1ade2a2d048addb39d57f7db610b05053');
const answerReview = await read(`${ticket}/tmp/d196-t16-q3-independent-review/answer-review.json`);
assert.equal(answerReview.outcome, 'pass');
assert.equal(answerReview.SCI.verdict, 'pass');
assert.equal(answerReview.ZHEN.verdict, 'pass');
for (const language of ['zh', 'en']) {
  assert.equal((await read(`${ticket}/tmp/d196-t16-q3-independent-review/${language}.review.json`)).outcome, 'pass');
}
const affectedPath = `${ticket}/tmp/d198-t16-fig127-affected-review/fig-127.affected-review.json`;
assert.equal((await read(affectedPath)).status, 'pass');
const nativePath = `${ticket}/tmp/d204-t16-native-order-repair/result.json`;
await verify(nativePath, 'f7747e7aacfd865c8db9b2f656f918153309379f7391eb23e403021d5662660e');
const sourceAuthor = `${ticket}/tmp/d195-source170-171-first-author`;
await verify(`${sourceAuthor}/author-freeze.json`, '2b9fdf2f00e449e3600bf3881daf1d65e9cff6d4b10cd8523e9d5dda064a64b1');
const meterPath = `${ticket}/production-meter.json`;
const beforeIndex = await bytes(indexPath), beforeMeter = await bytes(meterPath);
const index = JSON.parse(beforeIndex), meter = JSON.parse(beforeMeter);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 97);
assert.equal(meter.currentCheckpoint.sourcePagesFinalized, 410);
const retained = [];
const retention = `${evidence}/reports/d205-t16-progress`;
async function retain(source, target) {
  await immutableWrite(target, await bytes(source));
  const row = { ...await bind(target), originalPath: source, batch: 'D032' };
  const collection = source.endsWith('.png') ? 'figurePixels' : 'reports';
  assert.ok(!index[collection].some(item => item.path === target));
  index[collection].push(row);
  retained.push(row);
  return row;
}
for (const [directory, target] of [
  ['d189-t16-fig127-sole-repair', 'figure127-sole-repair'],
  ['d198-t16-fig127-affected-review', 'figure127-affected-review'],
  ['d191-t16-q3-answer-author', 'q3-answer-author'],
  ['d192-t16-q3-choice-author', 'q3-choice-author'],
  ['d196-t16-q3-independent-review', 'q3-independent-review'],
  ['d195-source170-171-first-author', 'source170-171-first-author'],
]) {
  const directoryPath = `${ticket}/tmp/${directory}`;
  for (const file of await walk(directoryPath)) {
    await retain(file, `${retention}/${target}/${path.relative(directoryPath, file)}`);
  }
}
for (const name of ['d199-prepare-t16-q4-inputs.mjs',
  'd202-finalize-t16-native.mjs', 'd204-repair-t16-native-order.mjs',
  'd205-consume-t16-progress.mjs',
  'd202-t16-native/started.json', 'd202-t16-native/zh-adapt-finalize.json',
  'd204-t16-native-order-repair/started.json', 'd204-t16-native-order-repair/result.json',
  'd204-t16-native-order-repair/zh-adapt-finalize.json',
  'd204-t16-native-order-repair/en-adapt-finalize.json',
  'd204-t16-native-order-repair/zh-render.json',
  'd204-t16-native-order-repair/en-render.json',
]) await retain(`${ticket}/tmp/${name}`, `${retention}/native-and-helpers/${name}`);
const lookup = original => retained.find(row => row.originalPath === original);
const progress = {
  modernFigures: '120-firstPASS-inherited;127-composedPASS-after-sole-repair-firstFAIL-preserved',
  fig127AffectedReview: lookup(affectedPath),
  native: 'PASS-bilingual-finalize-render-figure-order-only-repair',
  nativeResult: lookup(nativePath),
  firstNativeFAIL: lookup(`${ticket}/tmp/d202-t16-native/zh-adapt-finalize.json`),
  q3: {
    SCI: 'PASS', ZHEN: 'PASS', choice: 'PASS-bilingual-1-question-4-options',
    review: lookup(q3Path), answerReview: lookup(`${ticket}/tmp/d196-t16-q3-independent-review/answer-review.json`),
    answer: lookup(`${ticket}/tmp/d191-t16-q3-answer-author/draft.json`),
    choices: Object.fromEntries(['zh', 'en'].map(language => [language,
      lookup(`${ticket}/tmp/d192-t16-q3-choice-author/${language}.draft.json`)])),
    nativeReady: false, imagesOpened: 2,
  },
  inheritedPassedQuestions: ['1', '2', '5'],
  remaining: 'q4-standard-and-choices-author-running; complete ready keys/choices projection and first DISPLAY still required',
  completeCard: false, DISPLAY: 'not-executed',
};
const sourceAuthorProgress = {
  SOURCE: '170/171-not-independently-approved',
  native: '170-FAIL-HOLD8/9-preserved;171-authorPASS21/21',
  authorFreeze: lookup(`${sourceAuthor}/author-freeze.json`),
  report: lookup(`${sourceAuthor}/report.json`),
  pagesAdded: 0, rightOpen: 'p0171#8 -> 172', imageCount: 5,
};
await immutableWrite(receiptPath, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D032', t16: progress, source170To171: sourceAuthorProgress,
  retained, delivered: 97, sourcePagesFinalized: 410, sourceExerciseObjects: 224,
  completeUnbatched: [], parentImagesOpened: 0, parentCumulative: 24,
  allOldFailHoldRetained: true, fullProjectChecksDBMergeDeploy: false,
}, null, 2)}\n`);
const receipt = await bind(receiptPath);
index.reports.push({ ...receipt, batch: 'D032' });
Object.assign(meter.activeHumanDirection.nextSourceCheckpoints.t16, progress);
meter.activeHumanDirection.nextSourceCheckpoints.source170To171 = sourceAuthorProgress;
Object.assign(meter.currentCheckpoint.nextBatch, {
  latestBoundedProgress: receipt, latestNativeProgress: receipt,
  latestAnswerProgress: receipt, latestChoiceProgress: receipt,
});
const agents = meter.activeHumanDirection.temporaryImageBatches;
const updateAgent = record => {
  const old = agents.find(row => row.id === record.id);
  if (old) Object.assign(old, record); else agents.push(record);
};
updateAgent({ id: '01a1eb82-45d6-7012-9203-15796c243a1a',
  role: 't16-fig127-affectedPASS-then-source170-171-independent-running',
  cumulativeImageCount: 6, lastReportedImageCount: 6, cumulativeCountIsLastReported: true,
  report: progress.fig127AffectedReview, status: 'source170-171-review-running',
  noImageBudgetReset: true });
for (const [id, role, cumulativeImageCount, status] of [
  ['01a1eb79-8b3d-7bd3-8523-ace5e1e6ca7a', 't16-fig127-sole-repair-complete', 7, 'closed'],
  ['01a1eb92-ae97-78c3-8655-cdcd5fac6ed4', 't16-q3-combined-independentPASS', 2, 'closed'],
  ['01a1eb8c-72b1-7743-8dae-a796537ef654', 't16-q3-answer-complete-q4-author-running', 2, 'q4-author-running'],
  ['01a1eb8c-72ec-7003-bdd7-3f77f2946105', 't16-q3-choice-complete-q4-author-running', 2, 'q4-author-running'],
  ['01a1eb8f-3c91-7772-a474-b65c894c8b75', 'source170-171-first-author-complete', 5, 'closed'],
]) updateAgent({ id, role, cumulativeImageCount, lastReportedImageCount: cumulativeImageCount,
  cumulativeCountIsLastReported: true, status, noImageBudgetReset: true });
index.updatedAt = meter.updatedAt = new Date().toISOString();
assert.deepEqual(await bytes(indexPath), beforeIndex);
assert.deepEqual(await bytes(meterPath), beforeMeter);
await fs.writeFile(absolute(indexPath), `${JSON.stringify(index, null, 2)}\n`);
await fs.writeFile(absolute(meterPath), `${JSON.stringify(meter, null, 2)}\n`);
console.log(JSON.stringify({ receipt, retainedFiles: retained.length,
  delivered: 97, sourcePages: 410, completeCard: false }));

import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  ticket, evidence, indexPath, absolute, bytes, read, bind, verify, immutableWrite, walk,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const folder = `${ticket}/tmp/d343-t18-first-display-visual-b02`;
await verify(`${folder}/report.json`, 'c3cfc406e358162e66f205e184b59b91115aa200a271bb940b08372980aa812d');
await verify(`${folder}/actual-opens.json`, 'c2f18822ab31074e7afb0ef38b2251ef11d9a4752812f39a82037ebc0e426e05');
await verify(`${folder}/output-frozen-manifest.json`, '23e648f5db80ceae0da3a6932fa2eebdd36ea380984a9b17a71809233b79fe31');
const review = await read(`${folder}/report.json`);
assert.equal(review.actualOpenCount, 8);
assert.equal(review.visibleDisplayFailureCount, 0);
assert.equal(review.composedQuestionScope.desktopEnglish.completeQuestions.length, 10);
assert.equal(review.composedQuestionScope.desktopEnglish.partialQuestion.status, 'PASS');
const meterPath = `${ticket}/production-meter.json`;
const beforeIndex = await bytes(indexPath), beforeMeter = await bytes(meterPath);
const index = JSON.parse(beforeIndex), meter = JSON.parse(beforeMeter);
const t18 = meter.activeHumanDirection.nextSourceCheckpoints.t18;
assert.equal(t18.firstDisplayVisual.imagesConsumed, 8);
assert.equal(meter.currentCheckpoint.sourcePagesFinalized, 419);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 98);
const retained = [];
for (const file of await walk(folder)) {
  const destination = `${evidence}/reports/d347-t18-first-display-b02/${path.relative(folder, file)}`;
  await immutableWrite(destination, await bytes(file));
  const row = { ...await bind(destination), originalPath: file, batch: 'D033' };
  index.reports.push(row);
  retained.push(row);
}
const helper = `${ticket}/tmp/d347-consume-t18-second-visual-batch.mjs`;
const helperDestination = `${evidence}/reports/d347-t18-first-display-b02/d347-consume-t18-second-visual-batch.mjs`;
await immutableWrite(helperDestination, await bytes(helper));
index.reports.push({ ...await bind(helperDestination), originalPath: helper, batch: 'D033' });
const report = retained.find(row => row.originalPath === `${folder}/report.json`);
const firstReview = t18.firstVisualBatchReview;
t18.desktopChoiceDisplay = {
  status: 'PASS-fourteen-task-reviewed-subset-only', languages: ['zh', 'en'],
  choicesPerLanguage: 14, optionsPerLanguage: 59, observedTiles: 13,
  composition: [firstReview, report], repeatedImageOpens: 0,
  originalCheckerFailuresPreserved: true, fullOriginalSixteenTaskLesson: false,
};
t18.mobileChoiceDisplay = {
  status: 'PASS-observed-Q1-Q3-Q4-stem-A-C-only-remainder-HOLD',
  language: 'zh', observedTiles: 3, report,
};
Object.assign(t18.firstDisplayVisual, {
  status: 'DESKTOP-CHOICES-SCOPED-PASS-MOBILE-ANSWERS-INCOMPLETE',
  imagesConsumed: 16, remainingUnobserved: 77, batch02Report: report,
});
t18.nextFirstVisualBatch = {
  agent: '01a1ecea-4976-7410-be57-557a8dba0d60',
  status: 'ASSIGNED-FIRST-MOBILE-ZH-REMAINDER-BATCH03', pendingPlan: t18.firstDisplayDOM.report,
};
const completed = meter.activeHumanDirection.temporaryImageBatches
  .find(row => row.id === '01a1ece4-fe8a-78b3-b523-883746a3f2ef');
Object.assign(completed, { status: 'completed-and-closed', cumulativeImageCount: 8, report });
meter.activeHumanDirection.temporaryImageBatches.push({
  id: t18.nextFirstVisualBatch.agent, role: 't18-first-display-batch03-mobile-ZH-remainder',
  status: 'assigned-in-progress', cumulativeImageCount: null, forkContext: false,
  parentImageOpens: 0, maximumBatchImages: 8, contextMaximumImages: 24, noImageBudgetReset: true,
});
meter.currentCheckpoint.nextBatch.latestT18VisualBatch02 = report;
meter.currentCheckpoint.newSourceReviews +=
  ' d343/d347 first8 further pixelsPASS consumed: ENdesktopQ4C-E andQ5-14 compose with d336 to full14-task desktopZH/EN choice subsetPASS. First3 ZHmobiletilesPASS onlyQ1-3 andQ4stemABC.16/93 tiles consumed; no mobile/fullDISPLAY or completecard claim. Next8 missingZHmobiletiles first review assigned.';
index.updatedAt = meter.updatedAt = new Date().toISOString();
assert.deepEqual(await bytes(indexPath), beforeIndex);
assert.deepEqual(await bytes(meterPath), beforeMeter);
await fs.writeFile(absolute(indexPath), `${JSON.stringify(index, null, 2)}\n`);
await fs.writeFile(absolute(meterPath), `${JSON.stringify(meter, null, 2)}\n`);
console.log(JSON.stringify({ report, desktopChoices: t18.desktopChoiceDisplay.status,
  observedTiles: 16, remainingUnobserved: 77, completeDeliveredCards: 98, confirmedSourcePages: 419 }));

import assert from 'node:assert/strict';
import { ticket, bind, read, save } from './n42-native.mjs';

const reviewers = [
  ['n22', '01a204c9-507c-7b52-ab51-b4fe4425aa3d', 'D1355', 'D1359',
    'actualImageOpens', 'totalImagesInContext', 'opens'],
  ['n25', '01a204c9-0cb5-76c2-87a1-7ef504b0353f', 'D1362', 'D1366',
    'cumulative', 'cumulative', 'images'],
  ['n26', '01a204c9-50c4-7992-85fb-fcf1880c96cb', 'D1369', 'D1373',
    'actualImageOpens', 'totalContextImageOpens', 'orderedOpens'],
  ['n29', '01a204c9-0cf6-76a3-83de-f473232f67ab', 'D1376', 'D1380',
    'actualOpensTotal', 'cumulativeAfter', 'images'],
].map(([number, agent, reviewTask, retainedTask, actualKey, totalKey, opensKey]) => {
  const ready = bind(`${ticket}/evidence/reports/d1816-${retainedTask.toLowerCase()}-${number}-first-complete-en/batch-ready.json`);
  const retained = read(ready.path), ledger = bind(retained.imageLedger.path);
  assert.equal(ledger.sha256, retained.imageLedger.sha256);
  assert.equal(read(retained.pixelReview.path).status, 'PASS');
  const data = read(ledger.path);
  const actual = data[actualKey];
  assert.equal(actual, 8);
  assert.equal(data[totalKey], 8);
  assert.equal(data[opensKey].length, 8);
  return { number, agent, reviewTask, retainedTask, ready, ledger,
    actualImages: actual, batches: [actual], closed: true,
    closureEvidence: 'Parent received the completed pixel result once and invoked multi_agent_v1.close_agent, which returned completed previous_status.',
    imageContextClearedClaimed: false };
});

const result = {
  task: 'D1381', closed: true, reviewers,
  actualIndependentImages: reviewers.reduce((sum, row) => sum + row.actualImages, 0),
  parentNewImages: 0, parentHistoricalImageUsageNotReset: true,
  sourceOrOriginalFigurePixelsReopened: false, extraImagesOrCrops: 0,
  separateFreshReviewerContexts: true, maximumPerBatch: 8, maximumPerReviewerContext: 24,
  counts: { completeCourses: 153, sourcePages: 581 },
  newCompleteCourses: 0, newSourcePages: 0, headedAcceptanceClaimed: false,
  fullResolutionAllGlyphCertification: false, completeEnglishAccessibilityApproval: false,
  noReceiptOnlyCommit: true, formalHandoff: false, scopeCompleted: false,
};
assert.equal(result.actualIndependentImages, 32);
const file = `${ticket}/tmp/d1816-d1381-reviewers-closed.json`;
save(file, result);
console.log(JSON.stringify({ closure: bind(file), actualIndependentImages: result.actualIndependentImages }));

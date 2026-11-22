import assert from 'node:assert/strict';
import { ticket, bind, read, save } from './n42-native.mjs';

const reviewers = [
  ['n10', '01a204af-55ec-74e2-a6bd-1ec5fd186256', 'D1310', 'D1314', 8,
    '79dc1f2e54e9513223f4bd2310bc39212da1dce2b479193c8cf3b632d46dbdbf'],
  ['n15', '01a204af-5637-7c31-b8e3-7d985a55c73f', 'D1317', 'D1321', 6,
    'ac9b2f1eaaa95b240fedbf6a9fd377aea75d2c97cd58a5f13d3ddb8dbde3d0f8'],
  ['n18', '01a204af-567b-7643-99fc-4b01650f747b', 'D1324', 'D1328', 6,
    '445df7654c055ad998fb35cd80e17d02cc04fd72371b341b8186d737373e0c87'],
  ['n20', '01a204af-56d1-7c31-9ee1-5858e12d9f00', 'D1331', 'D1335', 8,
    'f9dc5ee162be229fcfe07433f341bf07929a564d5885fd924ee7589298b3aca9'],
].map(([number, agent, reviewTask, retainedTask, expected, ledgerHash]) => {
  const ledger = bind(`${ticket}/tmp/d1816-${reviewTask.toLowerCase()}-${number}-independent-review/${number}-image-ledger.json`);
  assert.equal(ledger.sha256, ledgerHash);
  const data = read(ledger.path), actual = number === 'n18'
    ? data.batch.actualImageOpenCalls : data.batch.actualImageOpens;
  assert.equal(actual, expected);
  assert.equal(data.images.length, expected);
  assert.equal(data.batch.reopens, 0);
  const ready = bind(`${ticket}/evidence/reports/d1816-${retainedTask.toLowerCase()}-${number}-first-complete-en/batch-ready.json`);
  assert.equal(read(read(ready.path).pixelReview.path).status, 'PASS');
  return { number, agent, reviewTask, retainedTask, ready, ledger,
    actualImages: actual, batches: [actual], closed: true,
    closureEvidence: 'Parent actually invoked multi_agent_v1.close_agent after this course retention/native canonical/index PASS and received completed previous_status.',
    imageContextClearedClaimed: false };
});
const result = {
  task: 'D1351', closed: true, reviewers,
  actualIndependentImages: reviewers.reduce((sum, row) => sum + row.actualImages, 0),
  parentNewImages: 0, parentPriorImageAllowanceExhaustedAt: 24,
  sourceOrOriginalFigurePixelsReopened: false, extraImagesOrCrops: 0,
  separateFreshReviewerContexts: true, maximumPerBatch: 8, maximumPerReviewerContext: 24,
  counts: { completeCourses: 153, sourcePages: 581 },
  newCompleteCourses: 0, newSourcePages: 0, headedAcceptanceClaimed: false,
  fullResolutionAllGlyphCertification: false, completeEnglishAccessibilityApproval: false,
  noReceiptOnlyCommit: true, formalHandoff: false, scopeCompleted: false,
};
assert.equal(result.actualIndependentImages, 28);
const file = `${ticket}/tmp/d1816-d1351-four-reviewers-closed.json`;
save(file, result);
console.log(JSON.stringify({ closure: bind(file), actualIndependentImages: result.actualIndependentImages }));

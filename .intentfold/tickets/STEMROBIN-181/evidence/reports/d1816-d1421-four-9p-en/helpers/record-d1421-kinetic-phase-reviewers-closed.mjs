import assert from 'node:assert/strict';
import { ticket, bind, read, save } from './n42-native.mjs';

const contexts = [
  { number: 'n34', name: 'Descartes', agent: null, retainedTask: 'D1399', count: 6,
    ledger: 'd1816-d1399-n34-first-complete-en/image-ledger.original.json',
    closureEvidence: 'Predecessor continuation records completed reviewer closed after exactly six opens; no new closure or image review performed.' },
  { number: 'n35', name: 'Franklin', agent: '01a204e6-2268-72d2-9a8b-752028a593cf',
    retainedTask: 'D1406', count: 8, ledger: 'd1816-d1406-n35-first-complete-en/review/image-ledger-part1.json' },
  { number: 'n35', name: 'Newton', agent: '01a204f8-3a84-7e10-ba59-590bdc70cc26',
    retainedTask: 'D1406', count: 2, ledger: 'd1816-d1406-n35-first-complete-en/review/image-ledger-part2.json' },
  { number: 'n38', name: 'Chandrasekhar', agent: '01a204ea-9c3a-7581-a15d-0fb540e5e91a',
    retainedTask: 'D1413', count: 8, ledger: 'd1816-d1413-n38-first-complete-en/image-ledger.original.json' },
  { number: 'n39', name: 'Heisenberg', agent: '01a204ea-d4c1-7de2-ad5f-5ecc2b1b3a27',
    retainedTask: 'D1420', count: 8, ledger: 'd1816-d1420-n39-first-complete-en/review/image-ledger.json',
    firstPixelStatus: 'REVISE' },
  { number: 'n39', name: 'Carver', agent: '01a20501-f43e-7e61-8c90-c8269c73f054',
    retainedTask: 'D1420', count: 2, ledger: 'd1816-d1420-n39-first-complete-en/review/saved-pixels/image-ledger.json' },
];
const reviewers = contexts.map(context => {
  const ready = bind(`${ticket}/evidence/reports/d1816-${context.retainedTask.toLowerCase()}-${context.number}-first-complete-en/batch-ready.json`);
  const data = read(ready.path);
  assert.equal(read(data.pixelReview.path).status, 'PASS');
  const ledger = bind(`${ticket}/evidence/reports/${context.ledger}`), usage = read(ledger.path);
  const batches = usage.batches.map(batch => typeof batch === 'number' ? batch : batch.actualImageOpens);
  assert.equal(usage.actualImageOpens, context.count);
  assert.equal(usage.totalContextImageOpens, context.count);
  assert.deepEqual(batches, [context.count]);
  assert.equal(usage.images.length, context.count);
  assert.equal(usage.reopens, 0);
  assert.equal(usage.crops, 0);
  assert.equal(usage.parentImages, 0);
  return { number: context.number, name: context.name, agent: context.agent,
    retainedTask: context.retainedTask, ready, ledger, actualImages: context.count,
    ...(context.firstPixelStatus ? { firstPixelStatus: context.firstPixelStatus, originalFindingPreserved: true } : {}),
    batches, closed: true,
    closureEvidence: context.closureEvidence
      || 'Parent received the completed result and invoked multi_agent_v1.close_agent; completed previous_status was returned.',
    imageContextClearedClaimed: false };
});
const result = {
  task: 'D1421', closed: true, reviewers,
  actualIndependentImages: reviewers.reduce((sum, row) => sum + row.actualImages, 0),
  parentNewImages: 0, parentHistoricalImageUsageNotReset: true,
  sourceOrOriginalFigurePixelsReopened: false, extraImagesOrCrops: 0,
  separateFreshReviewerContexts: true, maximumPerBatch: 8, maximumPerReviewerContext: 24,
  counts: { completeCourses: 153, sourcePages: 581 },
  newCompleteCourses: 0, newSourcePages: 0, headedAcceptanceClaimed: false,
  fullResolutionAllGlyphCertification: false, completeEnglishAccessibilityApproval: false,
  noReceiptOnlyCommit: true, formalHandoff: false, scopeCompleted: false,
};
assert.equal(result.actualIndependentImages, 34);
const file = `${ticket}/tmp/d1816-d1421-reviewers-closed.json`;
save(file, result);
console.log(JSON.stringify({ closure: bind(file), actualIndependentImages: result.actualIndependentImages }));

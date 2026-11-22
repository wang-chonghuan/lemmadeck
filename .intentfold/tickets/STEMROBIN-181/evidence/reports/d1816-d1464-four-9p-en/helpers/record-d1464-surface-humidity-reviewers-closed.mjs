import assert from 'node:assert/strict';
import { ticket, bind, read, save } from './n42-native.mjs';

const [tailAgent, endingAgent] = process.argv.slice(2);
assert(tailAgent && endingAgent);
const contexts = [
  ['n40', 'Poincare', '01a20513-1d2d-7531-83e2-4039339af688', 'D1442', 6,
    'd1816-d1442-n40-first-complete-en/image-ledger.original.json'],
  ['n42', 'Bernoulli', '01a20514-0b1b-7f43-8774-98ea123ec705', 'D1449', 8,
    'd1816-d1449-n42-first-complete-en/review/image-ledger-part1.json'],
  ['n42', 'Tail reviewer', tailAgent, 'D1449', 2,
    'd1816-d1449-n42-first-complete-en/review/image-ledger-part2.json'],
  ['n42', 'Ending reviewer', endingAgent, 'D1449', 2,
    'd1816-d1449-n42-first-complete-en/review/saved-pixels/image-ledger.json'],
  ['n43', 'Schrodinger', '01a20513-1d72-76a0-98d3-43f534811537', 'D1456', 6,
    'd1816-d1456-n43-first-complete-en/image-ledger.original.json'],
  ['n46', 'Ramanujan', '01a20513-1def-76b0-a0b7-4bf23c7dd9b2', 'D1463', 8,
    'd1816-d1463-n46-first-complete-en/image-ledger.original.json'],
];
const reviewers = contexts.map(([number, name, agent, retainedTask, count, file]) => {
  const ready = bind(`${ticket}/evidence/reports/d1816-${retainedTask.toLowerCase()}-${number}-first-complete-en/batch-ready.json`);
  assert.equal(read(read(ready.path).pixelReview.path).status, 'PASS');
  const ledger = bind(`${ticket}/evidence/reports/${file}`), usage = read(ledger.path);
  const accounting = agent === endingAgent ? usage.imageAccounting : usage;
  assert(accounting);
  if (agent === endingAgent) {
    for (const key of ['actualImageOpens', 'totalContextImageOpens', 'batches', 'reopens', 'crops', 'parentImages']) {
      if (usage[key] !== undefined) assert.deepEqual(usage[key], accounting[key]);
      if (usage.usage?.[key] !== undefined) assert.deepEqual(usage.usage[key], accounting[key]);
    }
  }
  const batches = accounting.batches.map(batch => typeof batch === 'number' ? batch : batch.actualImageOpens);
  assert.equal(accounting.actualImageOpens, count);
  assert.equal(accounting.totalContextImageOpens, count);
  assert.deepEqual(batches, [count]);
  assert.equal(usage.images.length, count);
  assert.equal(accounting.reopens, 0);
  assert.equal(accounting.crops, agent === endingAgent ? 1 : 0);
  assert.equal(accounting.parentImages, 0);
  return { number, name, agent, retainedTask, ready, ledger, actualImages: count, batches,
    crops: accounting.crops, ...(agent === '01a20514-0b1b-7f43-8774-98ea123ec705'
      ? { firstPixelStatus: 'REVISE', originalFindingPreserved: true } : {}),
    closed: true,
    closureEvidence: 'Parent received completed review and invoked multi_agent_v1.close_agent; completed previous_status was returned.',
    imageContextClearedClaimed: false };
});
const result = {
  task: 'D1464', closed: true, reviewers,
  actualIndependentImages: reviewers.reduce((sum, row) => sum + row.actualImages, 0),
  parentNewImages: 0, parentHistoricalImageUsageNotReset: true,
  sourceOrOriginalFigurePixelsReopened: false, affectedEndingAdditionalImages: 2, derivedCropsOpened: 1,
  separateFreshReviewerContexts: true, maximumPerBatch: 8, maximumPerReviewerContext: 24,
  counts: { completeCourses: 153, sourcePages: 581 }, newCompleteCourses: 0, newSourcePages: 0,
  headedAcceptanceClaimed: false, fullResolutionAllGlyphCertification: false,
  completeEnglishAccessibilityApproval: false, noReceiptOnlyCommit: true,
  formalHandoff: false, scopeCompleted: false, continuousProduction: true,
};
assert.equal(result.actualIndependentImages, 32);
const file = `${ticket}/tmp/d1816-d1464-reviewers-closed.json`;
save(file, result);
console.log(JSON.stringify({ closure: bind(file), actualIndependentImages: result.actualIndependentImages }));

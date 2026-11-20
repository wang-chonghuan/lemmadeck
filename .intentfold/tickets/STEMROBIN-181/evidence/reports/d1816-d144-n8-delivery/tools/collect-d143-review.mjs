import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const V = `${T}/tmp/d1816-d143-n8-figure-review`;
const A = `${T}/tmp/d1816-d141-n8-figure-author`;
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const report = bind(`${V}/report.json`);
const freeze = bind(`${V}/review-freeze.json`);
const nativeReview = bind(`${V}/fig-05.review.json`);
assert.equal(report.sha256, '31740afe15377bb294c861a6751666daa23310c22a9929fef0f3903cb93b3b6d');
assert.equal(freeze.sha256, '7aaebfb463cdf6fdc65f4eb8b6f8b1b518f272d4c26f0635d9c80a721e5a7153');
assert.equal(nativeReview.sha256, '61fe449a3ad5eecefb3dedbd2de1083fea07ad789b11885017791dd076381694');
const review = read(report.path);
assert.equal(review.semanticVerdict, 'pass');
assert.equal(review.offlineVisualVerdict, 'pass');
assert.equal(review.independent, true);
assert.equal(review.reviewerIsAuthor, false);
assert.equal(review.actualImageOpens, 4);
assert.equal(review.nativeReviewAt1Created, true);
assert.deepEqual(review.findings, []);
const file = `${V}/parent-collected.json`;
assert(!fs.existsSync(file));
fs.writeFileSync(file, JSON.stringify({
  batch: 'D143', status: 'CURRENT_FIG05_INDEPENDENT_PASS_COLLECTED_CLOSED_NATIVE_PENDING',
  reviewer: '01a1f8bc-b66e-7bb2-9a7a-d65499743994', reviewerClosed: true,
  report, freeze, nativeReview, selected: read(`${A}/parent-collected.json`).selected,
  nativeReviewNotes: review.nativeReviewNotes,
  semanticVerdict: 'pass', offlineVisualVerdict: 'pass',
  independentApproval: true, independentApprovalScope: 'Current figure/source/text compatibility and offline visual only',
  verifiedBindings: 48, bindingFailures: [], actualImageOpens: 4, parentImageOpens: 0,
  remainingHolds: review.remainingHolds, sourceReviewsReplayed: false,
  contentRepairs: 0, nativeStagesReplayed: 0, nativeReviewAt1Created: true,
  canonicalPromotions: 0, wholeCourseApproved: false, completeCoursesAdded: 0,
  productAcceptance: false, paidCalls: 0,
}, null, 2) + '\n', { flag: 'wx' });
const meterFile = `${T}/production-meter.json`;
const meter = read(meterFile);
Object.assign(meter.currentResume1816.D143, {
  status: 'CURRENT_FIG05_INDEPENDENT_PASS_COLLECTED_CLOSED_NATIVE_PENDING',
  reviewerClosed: true, report, freeze, nativeReview, collected: bind(file),
  actualReviewerImages: 4, independentApproval: true, wholeCourseApproved: false,
});
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ collected: bind(file), figurePass: true,
  imagesOpened: 0, completeCoursesAdded: 0 }));

import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/tmp/d1816-d140-n8-text-review`;
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const freeze = bind(`${O}/review-freeze.json`);
const report = bind(`${O}/report.json`);
assert.equal(freeze.sha256, '832d38eb6b217c5141348ef4b84a88d7c5f0fa97bd30ef811c5bcc1810a3e413');
assert.equal(report.sha256, '5c65fa38ceefaba08d7cc80b37114f87aea1e447295fea6a7ec3eebb50b32ed1');
const snapshot = read(freeze.path);
const review = read(report.path);
for (const key of ['status', 'scienceVerdict', 'zhVerdict', 'enVerdict']) {
  assert.equal(snapshot[key], 'pass', key);
  assert.equal(review[key], 'pass', key);
}
assert.equal(review.reviewerIsAuthor, false);
assert.equal(review.originalTasks, 0);
assert.equal(review.counters.imageOpens, 0);
assert.deepEqual(review.findings, []);
assert.deepEqual(review.figuresPending, ['fig-05']);
assert.equal(snapshot.courseApproved, false);
const collected = `${O}/parent-collected.json`;
assert(!fs.existsSync(collected));
fs.writeFileSync(collected, JSON.stringify({
  batch: 'D140', status: 'INDEPENDENT_SCI_ZHEN_PASS_COLLECTED_CLOSED_FIG05_PENDING',
  reviewer: '01a1f8ab-5ea8-74c2-9dcb-e1340deb2e27', reviewerClosed: true,
  freeze, report, inputFreeze: snapshot.inputFreeze,
  byteBindingVerification: { verifiedBindings: 14, failures: [], performedBeforeLaneClosure: true },
  scienceVerdict: 'pass', zhVerdict: 'pass', enVerdict: 'pass',
  independentApproval: true, independentApprovalScope: 'SCI/ZH/EN text only',
  sourceBlocksPerLocale: 13, originalTasks: 0, answers: 0, choices: 0,
  figuresPending: ['fig-05'], actualImageOpens: 0, parentImageOpens: 0,
  passedStagesReplayed: 0, sourceReviewsReplayed: false,
  completeCoursesAdded: 0, canonicalPromotion: false, wholeCourseApproved: false,
  productAcceptance: false, paidCalls: 0,
}, null, 2) + '\n', { flag: 'wx' });
const meterFile = `${T}/production-meter.json`;
const meter = read(meterFile);
Object.assign(meter.currentResume1816.D140, {
  status: 'INDEPENDENT_SCI_ZHEN_PASS_COLLECTED_CLOSED_FIG05_PENDING',
  reviewerClosed: true, textReviewFreeze: freeze, textReview: report,
  textReviewCollected: bind(collected), scienceVerdict: 'pass', zhVerdict: 'pass', enVerdict: 'pass',
  independentTextApproval: true, wholeCourseApproval: false, figuresPending: ['fig-05'],
});
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ collected: bind(collected), scienceVerdict: 'pass',
  zhVerdict: 'pass', enVerdict: 'pass', completeCoursesAdded: 0, imageOpens: 0 }));

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/tmp/d1816-d145-n9-text-review`;
const P = `${T}/tmp/d1816-d147-n9-affected-text`;
const work = '.tmp/STEMROBIN-181/d1816-d147/work';
const id = 'phy9-c1-s1-n9';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
};
const report = bind(`${O}/report.json`);
const freeze = bind(`${O}/review-freeze.json`);
assert.equal(report.sha256, '3b0bab3705685c7d4351794886cb4323976c3b447ed8e14b016d59094c363bf8');
assert.equal(freeze.sha256, '5a7ab173b2ab737de8a6f59bf0318c0dd853e0a63c93c32f55f4f8cc0c3116d9');
const review = read(report.path);
assert.equal(review.status, 'revise');
assert.equal(review.scienceVerdict, 'revise');
assert.equal(review.zhVerdict, 'pass');
assert.equal(review.enVerdict, 'pass');
assert.equal(review.independent, true);
assert.equal(review.reviewerIsAuthor, false);
const required = review.findings.filter(row => row.severity === 'revision-required');
const limits = review.findings.filter(row => row.severity.startsWith('nonblocking-attributed-'));
assert.deepEqual(required.map(row => row.id), ['D145-SCI-01']);
assert.equal(limits.length, 3);
assert(!fs.existsSync(work));
assert(!fs.existsSync(P));
const collected = `${O}/parent-collected.json`;
save(collected, {
  batch: 'D145', status: 'SCI_REVISE_ZH_EN_PASS_COLLECTED_CLOSED',
  reviewer: '01a1f8c6-8646-7e30-a5cc-9331273bc0a3', reviewerClosed: true,
  report, freeze, inputFreeze: read(freeze.path).inputFreeze,
  byteBindingVerification: { verifiedBindings: 29, failures: [],
    performedBeforeLaneClosure: true, historicalRowsComparedAsCurrent: false },
  scienceVerdict: 'revise', zhVerdict: 'pass', enVerdict: 'pass',
  requiredFindings: required, nonblockingAttributedSourceLimits: limits,
  sourceBlocksPerLocale: 35, originalTasks: 0, actualImageOpens: 0,
  independentApprovalScope: 'Unaffected text observations only; SCI-01 remains required',
  figuresPending: review.figuresPending, figureApproval: false,
  portraitGenerationAuthorized: false, completeCoursesAdded: 0,
  sourceReviewsReplayed: false, authorCheckerReplayed: false, parentImageOpens: 0,
  paidCalls: 0, productAcceptance: false, formalHandoff: false,
});
const copies = [];
for (const edition of ['modern-us-neutral', 'modern-us-neutral-en']) {
  for (const name of ['lesson.template.json', 'exercises.template.json', 'figures.template.json']) {
    const from = `${T}/tmp/d1816-d142-n9-text-author/frozen/${edition}/${name}`;
    const to = `${work}/adapt/9p/${edition}/lessons/${id}/${name}`;
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
    fs.chmodSync(to, 0o644);
    assert.equal(bind(from).sha256, bind(to).sha256);
    copies.push({ before: bind(from), operativeBeforeRepair: bind(to) });
  }
}
save(`${P}/prepared.json`, {
  batch: 'D147', status: 'SEPARATE_WRITABLE_COPIES_PREPARED_REPAIR_NOT_YET_PERFORMED',
  lesson: id, work, copies, requiredFinding: required[0],
  originalReview: bind(collected), frozenD142Untouched: true,
  repairScope: 'Only /prose/23/text sentence opening in ZH and EN',
  unaffectedBlocksToReuse: 34, figuresPending: review.figuresPending,
  imagesAuthorized: 0, originalTasks: 0, paidCalls: 0, canonicalPromotions: 0,
});
const meterFile = `${T}/production-meter.json`;
const meter = read(meterFile);
Object.assign(meter.currentResume1816.D145, {
  status: 'SCI_REVISE_ZH_EN_PASS_COLLECTED_CLOSED', reviewerClosed: true,
  report, freeze, collected: bind(collected), requiredFindings: ['D145-SCI-01'],
  nonblockingAttributedSourceLimits: limits.map(row => row.id),
  independentApproval: false, wholeCourseApproved: false,
});
Object.assign(meter.currentResume1816.D146, {
  status: 'FIRST_N8_OFFLINE_DISPLAY_PIXEL_REVIEW_ACTIVE',
  reviewer: '01a1f8cf-d2da-7a32-8194-e68d649b5621', reviewerClosed: false,
});
meter.currentResume1816.D147 = {
  status: 'SEPARATE_N9_AFFECTED_REPAIR_COPIES_PREPARED',
  prepared: bind(`${P}/prepared.json`), work, imagesAuthorized: 0,
  completeCoursesAdded: 0, independentApproval: false,
};
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ collected: bind(collected), copies: copies.length,
  requiredFindings: 1, nonblockingLimits: 3, imagesOpened: 0 }));

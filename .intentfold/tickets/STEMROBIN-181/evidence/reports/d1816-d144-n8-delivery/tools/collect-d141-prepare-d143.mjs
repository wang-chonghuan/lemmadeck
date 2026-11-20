import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const A = `${T}/tmp/d1816-d141-n8-figure-author`;
const O = `${T}/tmp/d1816-d143-n8-figure-review-input`;
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.resolve(file), bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const save = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const freeze = bind(`${A}/author-freeze.json`);
assert.equal(freeze.sha256, '98ac02f6309517ec370e21d99f69b505f0eb8edbbfe04cefb07192b21e9f75c7');
const frozen = read(freeze.path);
assert.equal(frozen.independentApproval, false);
assert.equal(frozen.imagesOpened, 4);
assert.equal(frozen.contentRepairCount, 1);
assert.equal(frozen.technicalRecoveryCount, 1);
assert.equal(read(frozen.selectedFiles.render.path).status, 'pass');
const selected = {
  source: frozen.sourceImage, candidate: frozen.selectedCandidate,
  spec: frozen.selectedFiles.spec, svg: frozen.selectedFiles.svg,
  render: frozen.selectedFiles.render, preview: frozen.selectedFiles.preview,
  mobileScrollStart: frozen.selectedFiles.mobileScrollStart,
  mobileScrollEnd: frozen.selectedFiles.mobileScrollEnd,
  sourceRelationsAssertions: frozen.selectedFiles.sourceRelationsAssertions,
  construction: frozen.selectedFiles.construction,
};
const collectedFile = `${A}/parent-collected.json`;
assert(!fs.existsSync(collectedFile));
save(collectedFile, {
  batch: 'D141', status: 'FIRST_FIG05_AUTHOR_COLLECTED_CLOSED_INDEPENDENT_REVIEW_PENDING',
  author: '01a1f8b1-02d6-7773-8813-1d183d407d8a', authorClosed: true,
  freeze, report: frozen.authorReport, selected,
  byteBindingVerification: { verifiedBindings: 44, failures: [], performedBeforeLaneClosure: true },
  authorImages: 4, parentImages: 0, contentRepairs: 1, technicalRecoveries: 1,
  firstFailuresPreserved: true, remainingHolds: frozen.remainingHolds,
  passedStagesReplayed: 0, independentApproval: false, canonicalPromotions: 0,
  completeCoursesAdded: 0, sourcePagesAdded: 0, paidCalls: 0, productAcceptance: false,
});
assert(fs.existsSync(`${O}/source-only.json`));
assert(fs.existsSync(`${O}/visible-text.json`));
save(`${O}/candidate-only.json`, {
  role: 'CURRENT_CANDIDATE_AFTER_INDEPENDENT_SOURCE_INVENTORY',
  figure: 'fig-05', selected, contentRepairsAlreadyUsed: 1,
  authorFreezeOpaqueProvenance: freeze,
  geometricProofScope: 'Independently check current SVG/spec and all substantive text/source claims; author supplementary assertions are not independent approval.',
  firstFailuresPreserved: true, repairAuthorizedInThisReview: false,
  nativeStagesReplayed: false, productAcceptance: false, promotionAuthorized: false,
});
save(`${O}/input-freeze.json`, {
  batch: 'D143', ticket: 'STEMROBIN-181', book: '9p', lesson: 'phy9-c1-s1-n8',
  sourceOnly: bind(`${O}/source-only.json`), languages: bind(`${O}/visible-text.json`),
  candidates: bind(`${O}/candidate-only.json`),
  originalTasks: 0, sourceReviewsReplayed: false, textScienceReviewReplayed: false,
  imageOpensAuthorized: 8, parentImageOpens: 0, completeCoursesAdded: 0,
  independentFigureApproval: false, canonicalPromotion: false,
});
const meterFile = `${T}/production-meter.json`;
const meter = read(meterFile);
Object.assign(meter.currentResume1816.D141, {
  status: 'FIRST_FIG05_AUTHOR_COLLECTED_CLOSED_INDEPENDENT_REVIEW_PENDING',
  authorClosed: true, authorFreeze: freeze, authorCollected: bind(collectedFile),
  actualAuthorImages: 4, contentRepairs: 1, technicalRecoveries: 1,
});
meter.currentResume1816.D143 = {
  status: 'FIRST_FIG05_INDEPENDENT_REVIEW_INPUT_READY',
  inputFreeze: bind(`${O}/input-freeze.json`), imagesAuthorized: 8,
  completeCoursesAdded: 0, canonicalPromotions: 0, wholeCourseApproved: false,
};
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ collected: bind(collectedFile),
  reviewInput: bind(`${O}/input-freeze.json`), imagesOpened: 0, completeCoursesAdded: 0 }));

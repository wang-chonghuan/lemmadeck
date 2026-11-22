import fs from 'node:fs';
import assert from 'node:assert/strict';
import { ticket, read, bind, copy } from './n42-native.mjs';

const authoredPath = `${ticket}/tmp/d1816-d1152-n5-first-missing-en/authored.json`;
const authored = read(authoredPath);
assert.equal(authored.status, 'FIRST_MISSING_EN_AUTHOR_NATIVE_PASS');
assert.equal(bind(authored.englishDraft.path).sha256, authored.englishDraft.sha256);
assert.equal(read(authored.nativeReceipt.path).exitCode, 0);
const meterFile = `${ticket}/production-meter.json`, reviewFile = `${ticket}/review.md`;
const backup = `${ticket}/tmp/d1816-d1152-progress`;
copy(meterFile, `${backup}/production-meter.before.json`);
copy(reviewFile, `${backup}/review.before.md`);
const meter = read(meterFile);
meter.currentResume1816.D1131 = {
  status: 'FIRST_THREE_EN_INDEPENDENT_TEXT_REVIEW_ACTIVE_PIXELS_NOT_AUTHORIZED_YET',
  reviewer: '01a203e3-8ce5-7b70-882a-b16decb110bf',
  cards: ['phy9-c1-s6-n54', 'phy9-c1-s7-n56', 'phy9-c1-s7-n57'],
  actualImagesAtDispatch: 0, permanentImageCeiling: 24, parentNewImages: 0,
};
meter.currentResume1816.D1150 = {
  status: 'FIRST_10P_N5_MISSING_EN_PREPARE_PASS',
  prepared: authored.prepared, originalChineseSCIAndD025NativeBindingsReused: true,
};
meter.currentResume1816.D1151 = {
  status: 'FIRST_AUTHOR_NATIVE_MATH_TOKEN_OCCURRENCE_FAILURE_PRESERVED',
  receipt: authored.firstNativeReceipt, failedInput: authored.originalFailedInput,
  actualFailureProseIndex: 0, diagnosedMathTokenOrderProseIndex: 4, repairedBy: 'D1152',
};
meter.currentResume1816.D1152 = {
  status: authored.status, card: authored.card, authored: bind(authoredPath),
  originalObjects: 10, originalTasks: 0, originalFigures: 0, flowParagraphs: 24,
  independentEnglishReview: 'pending', newCompleteCourses: 0, newSourcePages: 0,
};
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 153);
assert.equal(meter.sourcePagesFinalized, 581);
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
fs.appendFileSync(reviewFile,
  '\nD1150-D1152: phy10-c1-s2-n5 FIRST English preparation/author/native PASS,10objects/24savedparagraphs/0tasks/figures. Exact D025 source/Chinese/current-native/science bindings reused. Textual fig6 references do not create an attached figure or revive an old missing-image blocker. Source section retained; English title/chapter comes from official10pTOC. First native failure at prose0 omitted a repeated angle token; diagnostic also found prose4 reversed OA/s token order. Original input/receipt preserved; only those fragments corrected before failed-author-stage retry. Independent EN review/fullnative/render/display/canonical/index still pending. D1131 remains sole N54/N56/N57 reviewer with pixels unapproved; no passed source/Chinese/figure review replay or new counts. Totals153/581 unchanged, no receipt-onlycommit/DB/paid/broadtests/skillchanges/merge/deploy/formalhandoff/scopecompletion.\n');
console.log(JSON.stringify({ card: authored.card, draft: authored.englishDraft, independentEnglishReviewPending: true }));

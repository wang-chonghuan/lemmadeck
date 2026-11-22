import fs from 'node:fs';
import assert from 'node:assert/strict';
import { ticket, read, bind, copy } from './n42-native.mjs';

const stages = [
  ['D1130', 'd1816-d1130-n54-first-missing-en'],
  ['D1136', 'd1816-d1136-n56-first-missing-en'],
  ['D1139', 'd1816-d1139-n57-first-missing-en'],
];
const meterFile = `${ticket}/production-meter.json`;
const reviewFile = `${ticket}/review.md`;
const backup = `${ticket}/tmp/d1816-expansion-first-author-progress`;
copy(meterFile, `${backup}/production-meter.before.json`);
copy(reviewFile, `${backup}/review.before.md`);
const meter = read(meterFile);
for (const [task, directory] of stages) {
  const file = `${ticket}/tmp/${directory}/authored.json`, authored = read(file);
  assert.equal(authored.status, 'FIRST_MISSING_EN_AUTHOR_NATIVE_PASS');
  assert.equal(bind(authored.englishDraft.path).sha256, authored.englishDraft.sha256);
  assert.equal(read(authored.nativeReceipt.path).exitCode, 0);
  meter.currentResume1816[task] = {
    status: authored.status, card: authored.card, authored: bind(file),
    originalObjects: authored.originalObjects, originalTasks: 0,
    originalFigures: authored.originalFigures, flowParagraphs: authored.flowParagraphs,
    firstIndependentEnglishReview: 'pending', newCompleteCourses: 0, newSourcePages: 0,
  };
  if (authored.firstNativeReceipt)
    meter.currentResume1816.D1138 = {
      status: 'FIRST_AUTHOR_NATIVE_MATH_ORDER_FAILURE_PRESERVED',
      receipt: authored.firstNativeReceipt, failedInput: authored.originalFailedInput,
      repairedBy: 'D1139', affectedProseIndex: 23, contentHold: false,
    };
}
for (const [task, directory] of [
  ['D1135', 'd1816-d1135-n56-first-missing-en'],
  ['D1137', 'd1816-d1137-n57-first-missing-en'],
]) {
  const file = `${ticket}/tmp/${directory}/prepared.json`;
  meter.currentResume1816[task] = {
    status: 'FIRST_EN_PREPARE_PASS_AFTER_PRE_NATIVE_MANIFEST_MODE_LOOKUP_RECOVERY',
    prepared: bind(file), originalFailure: bind(`${ticket}/tmp/${directory}/first-preflight-failure.json`),
    approvedDeterministicFiguresReusedWithoutPixelOrNativeReplay: true, parentNewImages: 0,
  };
}
meter.currentResume1816.D1110 = {
  status: 'FIRST_FOUR_EN_INDEPENDENT_TEXT_REVIEW_ACTIVE_PIXELS_NOT_AUTHORIZED_YET',
  reviewer: '01a203cd-bb11-7823-b021-2240e7b3eca0',
  taskScope: ['phy9-c1-s3-n33', 'phy9-c1-s3-n36', 'phy9-c1-s4-n37', 'phy9-c1-s5-n45'],
  actualImagesAtDispatch: 0, permanentImageCeiling: 24, parentNewImages: 0,
};
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 153);
assert.equal(meter.sourcePagesFinalized, 581);
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
fs.appendFileSync(reviewFile,
  '\nD1129-D1139: N54/N56/N57 FIRST EN author/native PASS,74originalobjects,0tasks,2unchanged approved SVG figures,133saved flow paragraphs. Exact D016 source/Chinese/native/science/figure bindings reused, no source or figure pixel review replay. N56 registered initial-reference-length correction retained unchanged; N54 three and N57 two worked examples remain prose with original conditions, rounded data and safety qualifications. N56/N57 first preflight manifest-mode-field failures occurred before native calls and are preserved; scratch check now consumes the approved spec mode. N57 first force/extension math-order failure preserved, only that sentence reordered and failed author stage recovered under D1139. Independent EN review/finalize/display/canonical/index still pending, no new approval/counts. D1110 current-four independent text reviewer active at0images, future pixels not yet authorized. Totals153/581; no pure-counter commit, unrelateddirty/skill/broadtest/DB/paid/merge/deploy/formalhandoff/scopecompletion.\n');
console.log(JSON.stringify({ cards: stages.map(([, directory]) => read(`${ticket}/tmp/${directory}/authored.json`).card),
  firstEnglishReviewPending: true, completeDeliveredCards: 153, sourcePagesFinalized: 581 }));

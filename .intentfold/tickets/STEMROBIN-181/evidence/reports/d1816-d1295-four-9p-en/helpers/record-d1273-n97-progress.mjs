import fs from 'node:fs';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save } from './n42-native.mjs';

const readyPath = `${ticket}/evidence/reports/d1816-d1269-n97-first-complete-en/batch-ready.json`;
const pushPath = `${ticket}/evidence/reports/d1816-d1259-four-9p-en/actual-push.json`;
const ready = read(readyPath), push = read(pushPath);
assert.deepEqual(ready.cards, ['phy9-c2-s4-n97']);
assert.equal(ready.newCompleteCourses, 0);
assert.equal(ready.newSourcePages, 0);
assert.equal(push.head, '02c5facea7b54d854f657f6bfcdbf53e38eca7cc');
assert.equal(push.independentRemoteVerification.matchesCommittedHead, true);
const meterPath = `${ticket}/production-meter.json`, meter = read(meterPath);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 153);
assert.equal(meter.sourcePagesFinalized, 581);
assert.equal(meter.currentResume1816.head, push.head);
const result = {
  task: 'D1273', repo, ready: bind(readyPath), priorActualPush: bind(pushPath),
  status: 'N97_FIRST_COMPLETE_EN_RETAINED_NEXT_BATCH_PRODUCTION_CONTINUES',
  cards: ready.cards, originalObjects: 7, englishParagraphs: 11,
  originalTasks: 0, originalFigures: 0,
  reviewer: { agent: '01a2047c-d04e-79d2-beed-f3181144f9ba', closed: true, actualImages: 4 },
  parentNewImages: 0, newCompleteCourses: 0, newSourcePages: 0,
  totals: { completeCourses: 153, sourcePages: 581 },
  nativeSourceIdentityMathLayoutAndCanonicalIndex: 'PASS',
  firstEnglishReview: 'PASS_COMPOSED_WITH_TWO_AFFECTED_TEXT_REPAIRS',
  historicalD981D983BindingGapPreservedNotPromotedToApproval: true,
  originalReviewAndHelperShapeFailurePreserved: true,
  sourceChineseAndUnaffectedReviewsReplayed: false,
  headedAcceptanceClaimed: false, fullResolutionAllGlyphCertification: false,
  completeEnglishAccessibilityApproval: false,
  databaseWrites: 0, paidCalls: 0, formalHandoff: false, scopeCompleted: false,
  noReceiptOnlyCommit: true, continuousProduction: true,
};
save(`${ticket}/tmp/d1816-d1273-n97-progress/result.json`, result);
meter.currentResume1816.D1269 = {
  status: 'FIRST_COMPLETE_EN_EDITION_CANONICAL_RETAINED_READY',
  ready: bind(readyPath), newCompleteCourses: 0, newSourcePages: 0,
};
meter.currentResume1816.D1273 = {
  status: result.status, result: bind(`${ticket}/tmp/d1816-d1273-n97-progress/result.json`),
  ready: bind(readyPath), reviewerClosed: true, actualImages: 4, parentNewImages: 0,
};
meter.currentResume1816.currentContinuation =
  'D1259 ordinary four-course N4/N16/N7/N49 EN delivery pushed and independently remote-verified at '
  + push.head + '. N97 FIRST missing EN now canonical retained: seven original objects, eleven '
  + 'English paragraphs, no tasks/figures. Original English REVISE and helper-shape failure '
  + 'preserved; only two text fields repaired, affected review/native PASS, unaffected approvals '
  + 'reused. FIRST finalize/render, headless desktop/mobile DOM and four bounded saved pixels '
  + 'PASS; reviewer closed at four images, parent zero new images. D981/D983 historical gap '
  + 'remains, no invented Chinese approval. N97 plus actual D1259 receipt remain local for '
  + 'next substantive batch; D1272 next-three missing-EN inventory active. Totals153/581 '
  + 'unchanged, all genuine HOLDs and headless/allglyph/accessibility limits remain. No '
  + 'receipt-onlycommit/DB/paid/force/skill/broadtests/merge/deploy/formalhandoff/scopecompletion.';
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterPath, JSON.stringify(meter, null, 2) + '\n');
fs.appendFileSync(`${ticket}/review.md`,
  '\nD1263-D1273: N97 FIRST missing English edition retained with seven source objects, eleven '
  + 'paragraphs and no tasks/figures. Only two original independent-review findings repaired: '
  + 'direct high-voltage electrical-breakdown caveat and theoretical-then-experimental study '
  + 'sequence. Original REVISE/freeze and pre-native helper status-shape failure preserved; '
  + 'affected native/independent PASS composed with unchanged approvals. FIRST native '
  + 'finalize/render, isolated-headless desktop/mobile DOM, four saved pixels and canonical '
  + 'bindings/index PASS. D981/D983 historical approval gap unchanged, no Chinese approval '
  + 'invented. Reviewer closed at four images, parent zero new images. N97/D1259actualreceipt '
  + 'stay local until next substantive batch; no receipt-onlycommit. Counts153/581 unchanged; '
  + 'genuine HOLDs and headless/tallpreview/fineglyph/accessibility limits remain. Continue '
  + 'missing English work, no source/Chinese replay/DB/paid/force/broadtests/merge/deploy/handoff.\n');
console.log(JSON.stringify({ task: result.task, ready: bind(readyPath), counts: result.totals }));

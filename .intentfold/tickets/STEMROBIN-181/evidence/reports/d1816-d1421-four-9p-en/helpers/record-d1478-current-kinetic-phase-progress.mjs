import fs from 'node:fs';
import assert from 'node:assert/strict';
import { ticket, read, bind } from './n42-native.mjs';

const file = `${ticket}/production-meter.json`, meter = read(file);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 153);
assert.equal(meter.sourcePagesFinalized, 581);
for (const [stage, number] of [['D1399', 'n34'], ['D1406', 'n35'], ['D1413', 'n38']]) {
  const ready = bind(`${ticket}/evidence/reports/d1816-${stage.toLowerCase()}-${number}-first-complete-en/batch-ready.json`);
  meter.currentResume1816[stage] = {
    status: 'FIRST_COMPLETE_EN_EDITION_CANONICAL_RETAINED_READY', ready,
    newCompleteCourses: 0, newSourcePages: 0,
  };
}
const reports = [
  ['D1466', 'd1816-d1466-n39-unit-joiners/authored.json', 'UNIT_JOINER_AUTHOR_NATIVE_PASS_RENDERED_WRAP_STILL_FAILS'],
  ['D1472', 'd1816-d1472-n39-unit-native-recovery/result.json', 'UNIT_JOINER_NATIVE_PASS_FAILED_DISPLAY_NOT_PROMOTED'],
  ['D1473', 'd1816-d1473-n39-unit-selector-display-recovery/affected-report.json', 'UNIT_JOINER_ACTUAL_WRAP_FAILURE_PRESERVED'],
  ['D1474', 'd1816-d1474-n39-unit-value-lines/authored.json', 'TWO_VALUE_LINE_INTRODUCTIONS_AUTHOR_NATIVE_PASS'],
  ['D1476', 'd1816-d1476-n39-value-line-native/result.json', 'AFFECTED_VALUE_LINE_NATIVE_FINALIZE_RENDER_PASS'],
  ['D1477', 'd1816-d1477-n39-value-line-affected-display/affected-report.json', 'TWO_AFFECTED_UNIT_DOM_GEOMETRY_PASS_PIXELS_PENDING'],
  ['D1470', 'd1816-d1470-n39-unchanged-figure-width-rebinding/result.json', 'UNCHANGED_FIGURE_PIXELS_AND_ACTUAL_WIDTH_EVIDENCE_REBOUND_NO_RENDERER'],
];
for (const [stage, relative, status] of reports)
  meter.currentResume1816[stage] = { status, evidence: bind(`${ticket}/tmp/${relative}`) };
meter.currentResume1816.D1416 = {
  status: 'FIRST_EIGHT_IMAGE_PIXEL_REVISE_UNIT_WRAP_PRESERVED_AFFECTED_TWO_PENDING',
  pixel: bind(`${ticket}/tmp/d1816-d1416-n39-first-en-review/pixel-review.json`),
  ledger: bind(`${ticket}/tmp/d1816-d1416-n39-first-en-review/image-ledger.json`),
  firstActualImages: 8, originalReviewerClosed: true,
};
meter.currentResume1816.D1478 = {
  status: 'THREE_RETAINED_N39_AFFECTED_UNIT_PIXELS_PENDING_NO_PUSH',
  affectedReview: bind(`${ticket}/tmp/d1816-d1467-n39-unit-review/value-line-text-review.json`),
  firstWordJoinerReview: bind(`${ticket}/tmp/d1816-d1467-n39-unit-review/unit-text-review.json`),
  nativeTemplateFailure: bind(`${ticket}/tmp/d1816-d1468-n39-unit-native/first-failure.json`),
  firstSelectorFailure: bind(`${ticket}/tmp/d1816-d1469-n39-affected-unit-display/affected-report.json`),
  parentNewImages: 0, newCompleteCourses: 0, newSourcePages: 0, databaseWrites: 0, paidCalls: 0,
  formalHandoff: false, scopeCompleted: false, continuousProduction: true,
};
meter.currentResume1816.currentContinuation =
  'N34/N35/N38 canonical English READY. N39 original eight-image REVISE retained for detached pressure exponent; first six-word-joiner attempt failed actual geometry, not promoted. Two colon/value-line changes independently text-reviewed and native-rendered PASS; affected desktop/mobile unit geometry PASS, fresh two-clip pixels pending. Original source/Chinese/SVG/figure widths reused; shared55 preserves N38. No push yet; next N40/N42/N43/N46 scratch texts only, native not started. Counts153/581unchanged, parent0images, continuous production active.';
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(file, JSON.stringify(meter, null, 2) + '\n');
fs.appendFileSync(`${ticket}/review.md`,
  '\nD1432-D1478: N34/N35/N38 canonical EN READY. N35 disjoint8+2pixels composedPASS. N39 D1418 sourcecritical-subscript and D1433 manifest-order display assumptions failed beforeimages; D1434 preserved actualflow55-before56/sourceChineseformula notation. FIRST8pixels REVISE found desktopN/m exponentdetachment. D1466sixWordJoiners text/nativePASS but D1473actualgeometryFAIL; failedattempt retained, notapproved. D1468isolatedworktemplate pre-nativeENOENT and D1469wrong-wrapper-selector failures retained; oldHTMLunchanged, affected recoveriesonly. D1474onlytwo value-introductioncolon/newline changes independently textPASS; D1476nativePASS, D1477desktop/mobile same-linegeometryPASS, fresh2clips pixels pending. Original figures and widths/source/Chinese/sciencePASS reused, no rerender/sourcepixelopens. Three retained; fourbatchpushblockedonlypendingunitpixels. NextN40/N42/N43/N46 scratchtexts prepared but no newnativecalls. Counts153/581unchanged,parent0images/DB/paid/broadtests/force/merge/deploy/handoff/scopecompletion;continuousproductionactive.\n');
console.log(JSON.stringify({ retained: 3, n39AffectedPixelsPending: true, parentNewImages: 0 }));

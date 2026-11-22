import assert from 'node:assert/strict';
import fs from 'node:fs';
import { ticket, bind, read } from './n42-native.mjs';

const file = `${ticket}/production-meter.json`, meter = read(file);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 153);
assert.equal(meter.sourcePagesFinalized, 581);
const rows = [
  ['n34', 'D1425', 'D1395', 'D1396', 'D1397', 'D1398'],
  ['n35', 'D1427', 'D1402', 'D1403', 'D1430', 'D1405'],
  ['n38', 'D1428', 'D1409', 'D1410', 'D1411', 'D1412'],
  ['n39', 'D1429', 'D1416', null, null, null],
].map(([number, author, review, native, display, width]) => {
  const authored = bind(`${ticket}/tmp/d1816-${author.toLowerCase()}-${number}-affected-text/authored.json`);
  const reviewed = bind(`${ticket}/tmp/d1816-${review.toLowerCase()}-${number}-first-en-review/affected-review.json`);
  assert.equal(read(authored.path).status, 'AFFECTED_ONLY_HEAT_PARTICLE_FINDINGS_AUTHOR_PASS');
  assert.equal(read(reviewed.path).status, 'PASS');
  const row = { number, author, review, authored, reviewed, paragraphs: read(authored.path).flowParagraphs };
  meter.currentResume1816[author] = { status: 'AFFECTED_ONLY_EN_AUTHOR_NATIVE_PASS', evidence: authored };
  meter.currentResume1816[review] = { status: 'AFFECTED_ONLY_EN_REVIEW_PASS_ORIGINAL_REVISE_PRESERVED', evidence: reviewed };
  if (native) {
    const result = bind(`${ticket}/tmp/d1816-${native.toLowerCase()}-${number}-first-en-native/result.json`);
    assert.equal(read(result.path).status, 'FIRST_MISSING_EN_NATIVE_FINALIZE_RENDER_PASS');
    row.native = result;
    meter.currentResume1816[native] = { status: 'FIRST_EN_NATIVE_FINALIZE_RENDER_PASS', evidence: result };
  }
  if (display) {
    const directory = display === 'D1430' ? 'd1816-d1430-n35-caption-dom-display-recovery'
      : `d1816-${display.toLowerCase()}-${number}-first-en-full-course-display`;
    const result = bind(`${ticket}/tmp/${directory}/report.json`);
    assert.equal(read(result.path).status, 'TWO_COMPLETE_EN_COURSE_DOM_VIEWS_PASS_BOUNDED_PIXELS_PENDING');
    row.display = result;
    meter.currentResume1816[display] = { status: 'FIRST_EN_DESKTOP_MOBILE_DOM_PASS_PIXELS_PENDING', evidence: result };
  }
  if (width) {
    const result = bind(`${ticket}/tmp/d1816-${width.toLowerCase()}-${number}-original-figure-width-bindings/result.json`);
    assert.equal(read(result.path).actualCourseWidthContractsPassed, true);
    row.width = result;
    meter.currentResume1816[width] = { status: 'ACTUAL_MEDIA_WIDTHS_BOUND_UNCHANGED_OUTPUTS_PASS', evidence: result };
  }
  return row;
});
const captionFailure = bind(`${ticket}/tmp/d1816-d1404-n35-first-en-full-course-display/report.json`);
assert.equal(read(captionFailure.path).status, 'FAIL');
meter.currentResume1816.D1404 = {
  status: 'FIRST_CAPTION_DOM_PROJECTION_FAILURE_PRESERVED_RECOVERED_ONLY_BY_D1430',
  evidence: captionFailure, nativeOrContentRerun: false,
};
meter.currentResume1816.D1431 = {
  status: 'ALL_FOUR_AFFECTED_EN_REVIEWS_PASS_THREE_NATIVE_DISPLAY_WIDTH_PASS_PIXELS_PENDING',
  rows, sharedFigure55N39NativeAwaitsN38CanonicalRetention: true,
  parentNewImages: 0, databaseWrites: 0, paidCalls: 0, newCompleteCourses: 0, newSourcePages: 0,
  broadTests: 0, formalHandoff: false, scopeCompleted: false, continuousProduction: true,
};
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(file, JSON.stringify(meter, null, 2) + '\n');
fs.appendFileSync(`${ticket}/review.md`,
  '\nD1427-D1431: All four affected independent English reviews PASS with originalsREVISEpreserved,final23/45/30/34paragraphs. N35 only seven affected prose blocks glossed;N38 only saturation-space/mass and primed-endpoint comparison;N39 only opening/endpoint/compression prose plus restored source concept break. N34/N35/N38 first nativefinalize/render and isolatedheadless desktop/mobileDOM+actualwidthbindingsPASS;N39 native waits N38 shared55 canonical retention. N35 firstD1404 caption check counted hiddenKaTeXMathML/annotation text and rawnewline;originalfailure/helper retained, D1430 uses same annotation projection as paragraph check, noHTML/prose/figure/native-rerender. Firstpixelsauthorized N34six,N35firsteightof10,N38eight;currentactualusagepending,no parentimages or copiedapproval. Counts153/581unchanged,genuineHOLDs/headless/fineglyph/accessibilitylimits preserved,continuousproductionactive.\n');
console.log(JSON.stringify({ rows: rows.map(row => ({ number: row.number, paragraphs: row.paragraphs })), n39NativePending: true }));

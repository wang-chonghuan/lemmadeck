import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, run } from './n42-native.mjs';

const nativePath = `${ticket}/tmp/d1816-d997-n72-first-en-native/result.json`;
const displayPath = `${ticket}/tmp/d1816-d998-n72-first-en-full-course-display/report.json`;
const native = read(nativePath), display = read(displayPath);
assert.equal(native.status, 'FIRST_MISSING_EN_NATIVE_FINALIZE_RENDER_PASS');
assert.equal(display.status, 'TWO_COMPLETE_EN_COURSE_DOM_VIEWS_PASS_BOUNDED_PIXELS_PENDING');
const actualWidths = [...new Set(display.views.flatMap(view =>
  view.geometry.figures.map(figure => figure.width)))].sort((a, b) => a - b);
assert.deepEqual(actualWidths, [343, 480]);
const receipts = [], assets = [];
for (const original of native.rows[0].assets) {
  const directory = `${repo}/.tmp/STEMROBIN-181/d1816-d999/figures`;
  const spec = read(original.spec.path), beforeWidths = spec.display.widths;
  spec.display.widths = [...new Set([...beforeWidths, ...actualWidths])].sort((a, b) => a - b);
  const specFile = `${directory}/${original.id}.spec.json`;
  const svgFile = `${directory}/${original.id}.svg`;
  const renderFile = `${directory}/${original.id}.render.json`;
  save(specFile, spec);
  receipts.push(run(`d999-${original.id}-first-actual-343-480-native-width-check`, [
    'node', `${repo}/.agents/skills/ld-s10y-image/scripts/render_spec.mjs`,
    '--spec', specFile, '--svg', svgFile, '--report', renderFile,
  ]));
  assert.equal(bind(svgFile).sha256, original.svg.sha256);
  const render = read(renderFile);
  assert.equal(render.status, 'pass');
  for (const width of actualWidths)
    assert.equal(render.displayChecks.find(check => check.width === width).status, 'pass');
  const review = read(original.review.path);
  review.spec = { path: specFile, sha256: bind(specFile).sha256 };
  review.render = { path: renderFile, sha256: bind(renderFile).sha256 };
  review.outputs.svg = { path: svgFile, sha256: bind(svgFile).sha256 };
  review.localeContextReconciliation.actualEnglishCourseWidthCheckPending = false;
  review.actualWidthReconciliation = {
    task: 'D999', beforeWidths, addedFirstNativeWidths: actualWidths,
    originalNative: bind(nativePath), actualDisplay: bind(displayPath),
    unchangedApprovedSvgSha256: original.svg.sha256,
    sourceGeometryLabelsAndEnglishProseUnchanged: true,
    originalCourseHtmlAndTwelveCapturesReusedWithoutReplay: true,
    currentSuppliedSavedPixelReviewPending: true,
  };
  const reviewFile = `${directory}/${original.id}.review.json`;
  save(reviewFile, review);
  assets.push({ ...original, spec: bind(specFile), svg: bind(svgFile),
    render: bind(renderFile), review: bind(reviewFile), widthContractBefore: original.spec });
}
const resultFile = `${ticket}/tmp/d1816-d999-n72-actual-display-widths/result.json`;
save(resultFile, {
  ...native, task: 'D999', rows: [{ ...native.rows[0], assets }],
  originalFullNative: bind(nativePath), display: bind(displayPath),
  widthReconciliationReceipts: receipts, actualCourseWidths: actualWidths,
  actual343And480NativeContractsPassed: true, allApprovedSvgBytesUnchanged: true,
  originalCourseHtmlAndTwelveCapturesReusedWithoutReplay: true,
  currentPixelReviewPending: true, completeEnglishAccessibilityApproval: false,
  parentImages: 0,
});
console.log(JSON.stringify({ result: bind(resultFile), actualWidths }));

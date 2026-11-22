import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, copy } from './n42-native.mjs';

const nativePath = `${ticket}/tmp/d1816-d997-n72-first-en-native/result.json`;
const displayPath = `${ticket}/tmp/d1816-d998-n72-first-en-full-course-display/report.json`;
const native = read(nativePath), display = read(displayPath);
assert.equal(native.status, 'FIRST_MISSING_EN_NATIVE_FINALIZE_RENDER_PASS');
assert.equal(display.status, 'TWO_COMPLETE_EN_COURSE_DOM_VIEWS_PASS_BOUNDED_PIXELS_PENDING');
assert.equal(display.browserClosed, true);
const actualWidths = [...new Set(display.views.flatMap(view =>
  view.geometry.figures.map(figure => figure.width)))].sort((a, b) => a - b);
assert.deepEqual(actualWidths, [343, 480]);
const failureFile = `${ticket}/tmp/d1816-d1003-n72-original-svg-width-bindings/first-failure.json`;
const alternative = `${repo}/.tmp/STEMROBIN-181/d1816-d999/figures/fig-134.svg`;
assert.notEqual(bind(alternative).sha256, native.rows[0].assets[0].svg.sha256);
save(failureFile, {
  task: 'D999', status: 'FIRST_WIDTH_RERENDER_DIFFERED_FROM_APPROVED_SVG_NOT_PROMOTED',
  wrapperExitCode: 1, actualExecChunk: '12357e',
  producerReceipt: bind(`${ticket}/tmp/d1816-recovery/native/d999-fig-134-first-actual-343-480-native-width-check/receipt.json`),
  unusedSpec: bind(`${repo}/.tmp/STEMROBIN-181/d1816-d999/figures/fig-134.spec.json`),
  unusedRender: bind(`${repo}/.tmp/STEMROBIN-181/d1816-d999/figures/fig-134.render.json`),
  unusedSvg: bind(alternative), expectedApprovedSvg: native.rows[0].assets[0].svg,
  structuredXmlComparison: {
    actualExecChunk: '5dc78e', oldElements: 567, newElements: 567,
    observedDifference: 'Label font-family changed from KaTeX_Main,Arial,Helvetica,sans-serif to Arial, Helvetica, sans-serif.',
    allDifferencesEnumerated: false, equivalenceOrPixelApprovalClaimed: false,
  },
  originalSvgAndCourseHtmlAndCapturesUnchanged: true,
  remainingFigureRerendersNotInvoked: true,
});
const assets = [];
for (const original of native.rows[0].assets) {
  const directory = `${repo}/.tmp/STEMROBIN-181/d1816-d1003/figures`;
  const spec = read(original.spec.path), beforeWidths = spec.display.widths;
  spec.display.widths = [...new Set([...beforeWidths, ...actualWidths])].sort((a, b) => a - b);
  const specFile = `${directory}/${original.id}.spec.json`;
  const svgFile = `${directory}/${original.id}.svg`;
  const renderFile = `${directory}/${original.id}.render.json`;
  save(specFile, spec);
  copy(original.svg.path, svgFile);
  const render = read(original.render.path);
  assert.equal(render.status, 'pass');
  assert.equal(render.output.svg.sha256, bind(svgFile).sha256);
  render.spec = { path: specFile, sha256: bind(specFile).sha256 };
  render.output.svg = { path: svgFile, sha256: bind(svgFile).sha256 };
  for (const view of display.views) {
    const figure = view.geometry.figures.find(figure => figure.id === original.id);
    assert(figure);
    assert.equal(figure.labels.length, render.labels);
    assert(figure.labels.every(label => label.pixels >= 16));
    assert(!render.displayChecks.some(check => check.width === figure.width));
    render.displayChecks.push({
      width: figure.width, minTextPx: 16,
      measuredMinPx: Math.min(...figure.labels.map(label => label.pixels)),
      failures: [], status: 'pass',
      method: 'First authoritative headed course DOM measurement on the exact retained SVG, with loaded embedded glyph fonts.',
      evidence: bind(displayPath), view: view.id,
    });
  }
  render.displayChecks.sort((a, b) => a.width - b.width);
  render.unchangedOutputWidthReconciliation = {
    task: 'D1003', originalRender: original.render,
    rendererOutputRecreatedOrEdited: false, originalSvgHash: original.svg.sha256,
    firstAuthoritativeCourseDomWidthEvidence: bind(displayPath),
    addedWidths: actualWidths, firstFailedRerender: bind(failureFile),
  };
  save(renderFile, render);
  const review = read(original.review.path);
  review.spec = { path: specFile, sha256: bind(specFile).sha256 };
  review.render = { path: renderFile, sha256: bind(renderFile).sha256 };
  review.outputs.svg = { path: svgFile, sha256: bind(svgFile).sha256 };
  review.localeContextReconciliation.actualEnglishCourseWidthCheckPending = false;
  review.actualWidthReconciliation = {
    task: 'D1003', beforeWidths, addedFirstAuthoritativeBrowserWidths: actualWidths,
    originalNative: bind(nativePath), actualDisplay: bind(displayPath),
    firstFailedRerender: bind(failureFile), unchangedApprovedSvgSha256: original.svg.sha256,
    sourceGeometryLabelsAndEnglishProseUnchanged: true,
    originalCourseHtmlAndTwelveCapturesReusedWithoutReplay: true,
    currentSuppliedSavedPixelReviewPending: true, currentRendererCreatedOriginalSvgClaimed: false,
  };
  const reviewFile = `${directory}/${original.id}.review.json`;
  save(reviewFile, review);
  assets.push({ ...original, spec: bind(specFile), svg: bind(svgFile),
    render: bind(renderFile), review: bind(reviewFile), widthContractBefore: original.spec });
}
const resultFile = `${ticket}/tmp/d1816-d1003-n72-original-svg-width-bindings/result.json`;
save(resultFile, {
  ...native, task: 'D1003', rows: [{ ...native.rows[0], assets }],
  originalFullNative: bind(nativePath), display: bind(displayPath),
  actualCourseWidths: actualWidths, actual343And480BrowserWidthContractsPassed: true,
  allApprovedSvgBytesUnchanged: true, firstFailure: bind(failureFile),
  originalCourseHtmlAndTwelveCapturesReusedWithoutReplay: true,
  currentPixelReviewPending: true, completeEnglishAccessibilityApproval: false, parentImages: 0,
});
console.log(JSON.stringify({ result: bind(resultFile), actualWidths, rendererCalls: 0 }));

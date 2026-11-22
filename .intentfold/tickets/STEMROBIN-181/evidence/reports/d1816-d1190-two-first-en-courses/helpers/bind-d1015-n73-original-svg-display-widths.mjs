import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, copy } from './n42-native.mjs';

const configurations = {
  'phy9-c2-s2-n73': { task: 'D1015', native: 'd1816-d1007-n73-first-en-native',
    display: 'd1816-d1008-n73-first-en-full-course-display',
    out: 'd1816-d1015-n73-original-svg-width-bindings', expectedWidths: [358, 480] },
  'phy9-c2-s2-n64': { task: 'D1020', native: 'd1816-d1017-n64-first-en-native',
    display: 'd1816-d1018-n64-first-en-full-course-display',
    out: 'd1816-d1020-n64-original-svg-width-bindings' },
  'phy9-c2-s2-n81': { task: 'D1031', native: 'd1816-d1029-n81-first-en-native',
    display: 'd1816-d1033-n81-unlabeled-figure-display-recovery',
    out: 'd1816-d1031-n81-original-svg-width-bindings' },
  'phy9-c1-s7-n56': { task: 'D1142', native: 'd1816-d1140-n56-first-en-native',
    display: 'd1816-d1154-n56-source-aria-display-recovery',
    out: 'd1816-d1142-n56-original-svg-width-bindings' },
  'phy9-c1-s7-n57': { task: 'D1146', native: 'd1816-d1144-n57-first-en-native',
    display: 'd1816-d1155-n57-source-aria-display-recovery',
    out: 'd1816-d1146-n57-original-svg-width-bindings' },
  'phy10-c1-s2-n9': { task: 'D1191', native: 'd1816-d1183-n9-first-en-native',
    display: 'd1816-d1185-n9-first-en-full-course-display',
    out: 'd1816-d1191-n9-original-svg-width-bindings' },
  'phy10-c1-s2-n15': { task: 'D1192', native: 'd1816-d1184-n15-first-en-native',
    display: 'd1816-d1186-n15-first-en-full-course-display',
    out: 'd1816-d1192-n15-original-svg-width-bindings' },
};
const card = process.argv[2] || 'phy9-c2-s2-n73', config = configurations[card];
assert(config);
const nativePath = `${ticket}/tmp/${config.native}/result.json`;
const displayPath = `${ticket}/tmp/${config.display}/report.json`;
const native = read(nativePath), display = read(displayPath);
assert.equal(native.status, 'FIRST_MISSING_EN_NATIVE_FINALIZE_RENDER_PASS');
assert.equal(display.status, 'TWO_COMPLETE_EN_COURSE_DOM_VIEWS_PASS_BOUNDED_PIXELS_PENDING');
assert.equal(display.browserClosed, true);
assert.equal(display.browserMode, 'isolated-headless');
const widths = [...new Set(display.views.flatMap(view => view.geometry.figures.map(figure => figure.width)))].sort((a, b) => a - b);
if (config.expectedWidths) assert.deepEqual(widths, config.expectedWidths);
assert(widths.length > 0 && widths.every(width => width > 0));
const assets = [];
for (const original of native.rows[0].assets) {
  const directory = `${repo}/.tmp/STEMROBIN-181/d1816-${config.task.toLowerCase()}/figures`;
  const spec = read(original.spec.path), beforeWidths = spec.display.widths;
  spec.display.widths = [...new Set([...beforeWidths, ...widths])].sort((a, b) => a - b);
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
    if (!render.displayChecks.some(check => check.width === figure.width))
      render.displayChecks.push({
        width: figure.width, minTextPx: 16,
        measuredMinPx: figure.labels.length ? Math.min(...figure.labels.map(label => label.pixels)) : null,
        labelCount: figure.labels.length,
        failures: [], status: 'pass',
        method: 'First isolated headless course DOM measurement on the exact retained SVG with loaded embedded fonts.',
        evidence: bind(displayPath), view: view.id,
      });
  }
  render.displayChecks.sort((a, b) => a.width - b.width);
  render.unchangedOutputWidthReconciliation = {
    task: config.task, originalRender: original.render, rendererOutputRecreatedOrEdited: false,
    originalSvgHash: original.svg.sha256, firstAuthoritativeCourseDomWidthEvidence: bind(displayPath),
    addedWidths: widths, headedAcceptanceClaimed: false,
  };
  save(renderFile, render);
  const review = read(original.review.path);
  review.spec = { path: specFile, sha256: bind(specFile).sha256 };
  review.render = { path: renderFile, sha256: bind(renderFile).sha256 };
  review.outputs.svg = { path: svgFile, sha256: bind(svgFile).sha256 };
  review.localeContextReconciliation.actualEnglishCourseWidthCheckPending = false;
  review.actualWidthReconciliation = {
    task: config.task, beforeWidths, addedFirstAuthoritativeBrowserWidths: widths,
    originalNative: bind(nativePath), actualDisplay: bind(displayPath),
    unchangedApprovedSvgSha256: original.svg.sha256, sourceGeometryLabelsAndEnglishProseUnchanged: true,
    originalCourseHtmlAndEightCapturesReusedWithoutReplay: native.rows[0].assets.length === 2,
    originalCourseHtmlAndSavedCapturesReusedWithoutReplay: true,
    currentSuppliedSavedPixelReviewPending: true, currentRendererCreatedOriginalSvgClaimed: false,
    headedAcceptanceClaimed: false,
  };
  const reviewFile = `${directory}/${original.id}.review.json`;
  save(reviewFile, review);
  assets.push({ ...original, spec: bind(specFile), svg: bind(svgFile),
    render: bind(renderFile), review: bind(reviewFile), widthContractBefore: original.spec });
}
const resultPath = `${ticket}/tmp/${config.out}/result.json`;
save(resultPath, {
  ...native, task: config.task, rows: [{ ...native.rows[0], assets }],
  originalFullNative: bind(nativePath), display: bind(displayPath), actualCourseWidths: widths,
  actualCourseWidthContractsPassed: true, allApprovedSvgBytesUnchanged: true,
  originalCourseHtmlAndEightCapturesReusedWithoutReplay: native.rows[0].assets.length === 2,
  originalCourseHtmlAndSavedCapturesReusedWithoutReplay: true,
  currentPixelReviewPending: true, completeEnglishAccessibilityApproval: false,
  headedAcceptanceClaimed: false, parentImages: 0, rendererCalls: 0,
});
console.log(JSON.stringify({ result: bind(resultPath), widths, rendererCalls: 0 }));

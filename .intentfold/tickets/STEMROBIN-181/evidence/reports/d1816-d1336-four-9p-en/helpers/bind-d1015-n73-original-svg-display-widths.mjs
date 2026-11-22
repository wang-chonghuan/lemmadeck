import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, copy } from './n42-native.mjs';

const configurations = {
  'phy9-c1-s2-n10': { task: 'D1313', native: 'd1816-d1311-n10-first-en-native',
    display: 'd1816-d1312-n10-first-en-full-course-display',
    out: 'd1816-d1313-n10-original-figure-width-bindings', nextFourAdapter: true },
  'phy9-c1-s2-n15': { task: 'D1320', native: 'd1816-d1318-n15-first-en-native',
    display: 'd1816-d1319-n15-first-en-full-course-display',
    out: 'd1816-d1320-n15-original-figure-width-bindings', nextFourAdapter: true },
  'phy9-c1-s2-n18': { task: 'D1327', native: 'd1816-d1325-n18-first-en-native',
    display: 'd1816-d1350-n18-platform-font-display-recovery',
    out: 'd1816-d1327-n18-original-figure-width-bindings', nextFourAdapter: true },
  'phy9-c1-s2-n20': { task: 'D1334', native: 'd1816-d1332-n20-first-en-native',
    display: 'd1816-d1333-n20-first-en-full-course-display',
    out: 'd1816-d1334-n20-original-figure-width-bindings', nextFourAdapter: true },
  'phy9-c1-s1-n1': { task: 'D1279', native: 'd1816-d1306-n1-source-label-native-recovery',
    display: 'd1816-d1278-n1-first-en-full-course-display',
    out: 'd1816-d1279-n1-original-png-width-bindings', generatedPng: true },
  'phy9-c1-s1-n2': { task: 'D1286', native: 'd1816-d1284-n2-first-en-native',
    display: 'd1816-d1285-n2-first-en-full-course-display',
    out: 'd1816-d1286-n2-original-png-width-bindings', generatedPng: true, expectedWidths: [160] },
  'phy9-c1-s1-n3': { task: 'D1293', native: 'd1816-d1303-n3-caption-label-native-recovery',
    display: 'd1816-d1292-n3-first-en-full-course-display',
    out: 'd1816-d1293-n3-original-png-width-bindings', generatedPng: true },
  'phy9-c1-s1-n7': { task: 'D1255', native: 'd1816-d1251-n7-first-en-native',
    display: 'd1816-d1253-n7-first-en-full-course-display',
    out: 'd1816-d1255-n7-original-svg-width-bindings' },
  'phy9-c1-s6-n49': { task: 'D1256', native: 'd1816-d1252-n49-first-en-native',
    display: 'd1816-d1254-n49-first-en-full-course-display',
    out: 'd1816-d1256-n49-original-svg-width-bindings' },
  'phy10-c1-s2-n2': { task: 'D1222', native: 'd1816-d1220-n2-first-en-native',
    display: 'd1816-d1226-n2-source-aria-display-recovery',
    out: 'd1816-d1222-n2-original-svg-width-bindings' },
  'phy10-c1-s2-n4': { task: 'D1206', native: 'd1816-d1204-n4-first-en-native',
    display: 'd1816-d1216-n4-shared-aria-display-recovery',
    out: 'd1816-d1206-n4-original-svg-width-bindings' },
  'phy10-c1-s2-n1': { task: 'D1211', native: 'd1816-d1209-n1-first-en-native',
    display: 'd1816-d1210-n1-first-en-full-course-display',
    out: 'd1816-d1211-n1-original-svg-width-bindings' },
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
const widths = [...new Set(display.views.flatMap(view => view.geometry.figures
  .map(figure => figure[config.nextFourAdapter ? 'actualMediaWidth' : 'width'])))].sort((a, b) => a - b);
if (config.expectedWidths) assert.deepEqual(widths, config.expectedWidths);
assert(widths.length > 0 && widths.every(width => width > 0));
const assets = [];
for (const original of native.rows[0].assets) {
  const assetWidths = [...new Set(display.views.map(view =>
    view.geometry.figures.find(figure => figure.id === original.id)[config.nextFourAdapter ? 'actualMediaWidth' : 'width']))]
    .sort((a, b) => a - b);
  const directory = `${repo}/.tmp/STEMROBIN-181/d1816-${config.task.toLowerCase()}/figures`;
  const spec = read(original.spec.path), beforeWidths = spec.display.widths;
  const generated = spec.mode === 'generated';
  assert(['generated', 'deterministic'].includes(spec.mode));
  if (!config.nextFourAdapter) assert.equal(generated, !!config.generatedPng);
  if (config.nextFourAdapter) {
    assert.equal(original.mode, spec.mode);
    assert.equal(display.views.length, 2);
    assert.equal(display.requests.length, 0);
    assert.equal(display.headedAcceptanceClaimed, false);
    assert(assetWidths.every(width => Number.isFinite(width) && width > 0 && width <= spec.display.maxWidthPx));
    for (const key of generated ? ['spec', 'png', 'generation', 'review'] : ['spec', 'svg', 'render', 'review'])
      assert.equal(bind(original[key].path).sha256, original[key].sha256);
  }
  spec.display.widths = [...new Set([...beforeWidths, ...assetWidths])].sort((a, b) => a - b);
  const specFile = `${directory}/${original.id}.spec.json`;
  const svgFile = `${directory}/${original.id}.svg`;
  const renderFile = `${directory}/${original.id}.render.json`;
  save(specFile, spec);
  if (generated) {
    assert.equal(original.mode, 'generated');
    assert.equal(spec.mode, 'generated');
    for (const key of ['spec', 'png', 'generation', 'review'])
      assert.equal(bind(original[key].path).sha256, original[key].sha256);
    assert(assetWidths.every(width => width > 0 && width <= spec.display.maxWidthPx));
    if (spec.display.purpose === 'decorative') {
      assert.equal(spec.display.maxWidthPx, 160);
      assert.deepEqual(assetWidths, [160]);
    }
    const pngFile = `${directory}/${original.id}.png`;
    const generationFile = `${directory}/${original.id}.png.json`;
    const reviewFile = `${directory}/${original.id}.review.json`;
    copy(original.png.path, pngFile);
    copy(original.generation.path, generationFile);
    const generation = read(generationFile), review = read(original.review.path);
    assert.equal(generation.output.sha256, original.png.sha256);
    assert.equal(review.status, 'pass');
    assert.equal(review.spec.sha256, original.spec.sha256);
    assert.equal(review.generation.sha256, original.generation.sha256);
    assert.equal(review.outputs.png.sha256, original.png.sha256);
    const checks = display.views.map(view => {
      const figure = view.geometry.figures.find(figure => figure.id === original.id);
      assert.equal(figure.mode, 'generated');
      if (config.nextFourAdapter) assert.equal(figure.image.sha256, original.png.sha256);
      assert(figure.image.complete && figure.image.naturalWidth === generation.output.width
        && figure.image.naturalHeight === generation.output.height);
      assert(Math.abs(figure.image.width - figure.width) < 0.01);
      assert(Math.abs(figure.image.height - figure.image.width * figure.image.naturalHeight
        / figure.image.naturalWidth) < 0.1);
      return { view: view.id, width: figure.image.width, height: figure.image.height,
        naturalWidth: figure.image.naturalWidth, naturalHeight: figure.image.naturalHeight,
        evidence: bind(displayPath), embeddedRasterGlyphCertificationClaimed: false,
        ...(config.nextFourAdapter ? { exactDisplayedPngSha256: figure.image.sha256 } : {}) };
    });
    review.spec = { path: specFile, sha256: bind(specFile).sha256 };
    review.generation = { path: generationFile, sha256: bind(generationFile).sha256 };
    review.outputs.png = { path: pngFile, sha256: bind(pngFile).sha256 };
    review.localeContextReconciliation.actualEnglishCourseWidthCheckPending = false;
    review.actualWidthReconciliation = {
      task: config.task, beforeWidths, addedFirstAuthoritativeBrowserWidths: assetWidths,
      originalNative: bind(nativePath), actualDisplay: bind(displayPath), checks,
      unchangedApprovedPngSha256: original.png.sha256,
      unchangedOriginalGenerationSha256: original.generation.sha256,
      generationMetadataRequestOutputAndReferencesUnchanged: true,
      sourceGeometryAndEnglishProseUnchanged: true, currentSuppliedSavedPixelReviewPending: true,
      originalCourseHtmlAndSavedCapturesReusedWithoutReplay: true,
      rendererCalls: 0, headedAcceptanceClaimed: false,
    };
    save(reviewFile, review);
    assets.push({ ...original, spec: bind(specFile), png: bind(pngFile),
      generation: bind(generationFile), review: bind(reviewFile), widthContractBefore: original.spec });
    continue;
  }
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
    if (config.nextFourAdapter) {
      assert(figure.labels.every(label => label.fontCheck
        && label.renderedFonts.length > 0
        && label.renderedFonts.every(font => font.glyphCount > 0 && font.familyName)));
      assert(Math.abs(figure.actualMediaWidth - figure.width) < 0.01);
    }
    if (!render.displayChecks.some(check => check.width === figure.width))
      render.displayChecks.push({
        width: figure.width, minTextPx: 16,
        measuredMinPx: figure.labels.length ? Math.min(...figure.labels.map(label => label.pixels)) : null,
        labelCount: figure.labels.length,
        failures: [], status: 'pass',
        method: 'First isolated headless course DOM measurement on the exact retained SVG with actual browser font evidence.',
        evidence: bind(displayPath), view: view.id,
        ...(config.nextFourAdapter ? {
          actualMediaWidth: figure.actualMediaWidth,
          actualFontEvidence: figure.labels.map(label => ({
            id: label.id, family: label.fontFamily, fontSizePx: label.fontSizePx,
            displayedPixels: label.pixels, fontCheck: label.fontCheck,
            renderedFonts: label.renderedFonts,
          })),
          loadedFontFaces: view.geometry.loadedFontFaces,
        } : {}),
      });
  }
  render.displayChecks.sort((a, b) => a.width - b.width);
  render.unchangedOutputWidthReconciliation = {
    task: config.task, originalRender: original.render, rendererOutputRecreatedOrEdited: false,
    originalSvgHash: original.svg.sha256, firstAuthoritativeCourseDomWidthEvidence: bind(displayPath),
    addedWidths: assetWidths, headedAcceptanceClaimed: false,
    ...(config.nextFourAdapter ? {
      actualFontMeasurements: display.views.map(view => ({
        view: view.id, loadedFontFaces: view.geometry.loadedFontFaces,
        figure: view.geometry.figures.find(figure => figure.id === original.id),
      })),
    } : {}),
  };
  save(renderFile, render);
  const review = read(original.review.path);
  review.spec = { path: specFile, sha256: bind(specFile).sha256 };
  review.render = { path: renderFile, sha256: bind(renderFile).sha256 };
  review.outputs.svg = { path: svgFile, sha256: bind(svgFile).sha256 };
  review.localeContextReconciliation.actualEnglishCourseWidthCheckPending = false;
  review.actualWidthReconciliation = {
    task: config.task, beforeWidths, addedFirstAuthoritativeBrowserWidths: assetWidths,
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
  actualCourseWidthContractsPassed: true, allApprovedSvgBytesUnchanged: !config.generatedPng,
  ...(config.generatedPng ? {
    allApprovedPngBytesAndGenerationEvidenceUnchanged: true, embeddedRasterGlyphCertificationClaimed: false,
  } : {}),
  ...(config.nextFourAdapter ? {
    perAssetModes: Object.fromEntries(assets.map(asset => [asset.id, read(asset.spec.path).mode])),
    allApprovedSvgBytesUnchanged: true,
    allApprovedPngBytesAndGenerationEvidenceUnchanged: assets.some(asset => asset.mode === 'generated'),
    actualDisplayWidthsPending: false, embeddedRasterGlyphCertificationClaimed: false,
    independentEnglishContextAndPixelReviewPending: true,
  } : {}),
  originalCourseHtmlAndEightCapturesReusedWithoutReplay: native.rows[0].assets.length === 2,
  originalCourseHtmlAndSavedCapturesReusedWithoutReplay: true,
  currentPixelReviewPending: true, completeEnglishAccessibilityApproval: false,
  headedAcceptanceClaimed: false, parentImages: 0, rendererCalls: 0,
});
console.log(JSON.stringify({ result: bind(resultPath), widths, rendererCalls: 0 }));

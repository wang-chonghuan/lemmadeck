import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const [pixelPath, pixelHash, ledgerPath, ledgerHash, requestedCard = 'phy9-c2-s2-n72', resumeMode] = process.argv.slice(2);
assert(resumeMode === undefined || resumeMode === '--resume-canonical-source-binding');
const resumeCanonical = resumeMode === '--resume-canonical-source-binding';
assert.equal(bind(pixelPath).sha256, pixelHash);
assert.equal(bind(ledgerPath).sha256, ledgerHash);
assert.equal(read(pixelPath).status, 'PASS');
const configurations = {
  'phy9-c2-s2-n72': { task: 'D1000', native: 'd1816-d1003-n72-original-svg-width-bindings',
    firstNative: 'd1816-d997-n72-first-en-native', display: 'd1816-d998-n72-first-en-full-course-display',
    prepared: 'd1816-d993-n72-first-missing-en', out: 'd1816-d1000-n72-first-complete-en',
    reviewer: 'd1816-d990-n63-first-en-independent-review', enReview: 'n72-first-en-review.json',
    authorStage: 'd995', widthStage: 'd1003', historicalBatch: 'D020', objects: 13, figures: 4,
    authorStages: [
      ['d993', 'd1816-d993-n72-first-missing-en'], ['d994', 'd1816-d994-n72-first-missing-en'],
      ['d995', 'd1816-d995-n72-label-identity'], ['d997', 'd1816-d997-n72-first-en-native'],
      ['d1003', 'd1816-d1003-n72-original-svg-width-bindings'],
    ], nativePattern: /^d(?:993|994|995|997|998|999|1000)-/ },
  'phy9-c2-s2-n73': { task: 'D1016', native: 'd1816-d1015-n73-original-svg-width-bindings',
    firstNative: 'd1816-d1007-n73-first-en-native', display: 'd1816-d1008-n73-first-en-full-course-display',
    prepared: 'd1816-d1002-n73-first-missing-en', out: 'd1816-d1016-n73-first-complete-en',
    reviewer: 'd1816-d1006-n73-first-en-independent-review', enReview: 'affected-text-review.json',
    excludedReviewPrefix: 'n64-',
    authorStage: 'd1012', widthStage: 'd1015', historicalBatch: 'D019', objects: 22, figures: 2,
    affectedDisplay: 'd1816-d1024-n73-mobile-equation-scroll-end',
    authorStages: [
      ['d1002', 'd1816-d1002-n73-first-missing-en'], ['d1004', 'd1816-d1004-n73-first-missing-en'],
      ['d1005', 'd1816-d1005-n73-two-text-signatures'], ['d1012', 'd1816-d1012-n73-two-review-findings'],
      ['d1007', 'd1816-d1007-n73-first-en-native'], ['d1015', 'd1816-d1015-n73-original-svg-width-bindings'],
      ['d1024', 'd1816-d1024-n73-mobile-equation-scroll-end'],
    ], nativePattern: /^d(?:1002|1004|1005|1007|1008|1012|1015|1016)-/ },
  'phy9-c2-s2-n64': { task: 'D1021', native: 'd1816-d1020-n64-original-svg-width-bindings',
    firstNative: 'd1816-d1017-n64-first-en-native', display: 'd1816-d1018-n64-first-en-full-course-display',
    prepared: 'd1816-d1013-n64-first-missing-en', out: 'd1816-d1021-n64-first-complete-en',
    reviewer: 'd1816-d1006-n73-first-en-independent-review', enReview: 'n64-first-en-review.json',
    reviewPrefix: 'n64-', authorStage: 'd1019', widthStage: 'd1020',
    historicalBatch: 'D018', objects: 42, figures: 2,
    authorStages: [
      ['d1013', 'd1816-d1013-n64-first-missing-en'], ['d1014', 'd1816-d1014-n64-first-missing-en'],
      ['d1019', 'd1816-d1019-n64-unchanged-block-metadata'], ['d1017', 'd1816-d1017-n64-first-en-native'],
      ['d1020', 'd1816-d1020-n64-original-svg-width-bindings'],
    ], nativePattern: /^d(?:1013|1014|1017|1018|1019|1020|1021)-/ },
  'phy9-c2-s2-n81': { task: 'D1032', native: 'd1816-d1031-n81-original-svg-width-bindings',
    firstNative: 'd1816-d1029-n81-first-en-native', display: 'd1816-d1033-n81-unlabeled-figure-display-recovery',
    prepared: 'd1816-d1025-n81-first-missing-en', out: 'd1816-d1032-n81-first-complete-en',
    reviewer: 'd1816-d1028-n81-first-en-independent-review', enReview: 'report.json',
    authorStage: 'd1027', widthStage: 'd1031', historicalBatch: 'D020', objects: 17, figures: 1,
    authorStages: [
      ['d1025', 'd1816-d1025-n81-first-missing-en'], ['d1026', 'd1816-d1026-n81-first-missing-en'],
      ['d1027', 'd1816-d1027-n81-first-missing-en'], ['d1029', 'd1816-d1029-n81-first-en-native'],
      ['d1030', 'd1816-d1030-n81-first-en-full-course-display'],
      ['d1033', 'd1816-d1033-n81-unlabeled-figure-display-recovery'],
      ['d1031', 'd1816-d1031-n81-original-svg-width-bindings'],
    ], nativePattern: /^d(?:1025|1026|1027|1029|1030|1031|1032)-/ },
  'phy9-c2-s3-n89': { task: 'D1039', native: 'd1816-d1037-n89-first-en-native',
    firstNative: 'd1816-d1037-n89-first-en-native', display: 'd1816-d1038-n89-first-en-full-course-display',
    prepared: 'd1816-d1034-n89-first-missing-en', out: 'd1816-d1039-n89-first-complete-en',
    reviewer: 'd1816-d1028-n81-first-en-independent-review', enReview: 'n89-affected-text-review.json',
    reviewPrefix: 'n89-', authorStage: 'd1040', historicalBatch: 'D022', objects: 4, figures: 0,
    authorStages: [
      ['d1034', 'd1816-d1034-n89-first-missing-en'], ['d1035', 'd1816-d1035-n89-first-missing-en'],
      ['d1040', 'd1816-d1040-n89-two-readability-findings'],
      ['d1037', 'd1816-d1037-n89-first-en-native'],
    ], nativePattern: /^d(?:1034|1035|1037|1038|1039|1040)-/ },
  'phy9-c2-s4-n105': { task: 'D1045', native: 'd1816-d1043-n105-first-en-native',
    firstNative: 'd1816-d1043-n105-first-en-native', display: 'd1816-d1049-n105-sectionless-crumb-display-recovery',
    prepared: 'd1816-d1041-n105-first-missing-en', out: 'd1816-d1045-n105-first-complete-en',
    reviewer: 'd1816-d1028-n81-first-en-independent-review', enReview: 'n105-first-en-review.json',
    reviewPrefix: 'n105-', authorStage: 'd1042', historicalBatch: 'D025', objects: 9, figures: 0,
    authorStages: [
      ['d1041', 'd1816-d1041-n105-first-missing-en'], ['d1042', 'd1816-d1042-n105-first-missing-en'],
      ['d1043', 'd1816-d1043-n105-first-en-native'],
      ['d1044', 'd1816-d1044-n105-first-en-full-course-display'],
      ['d1049', 'd1816-d1049-n105-sectionless-crumb-display-recovery'],
    ], nativePattern: /^d(?:1041|1042|1043|1044|1045)-/ },
  'phy9-c2-s6-n130': { task: 'D1053', native: 'd1816-d1050-n130-approved-en-metadata-native',
    nativeStatus: 'APPROVED_EN_BODY_METADATA_RECONCILED_NATIVE_RENDER_PASS',
    firstNative: 'd1816-d1050-n130-approved-en-metadata-native',
    display: 'd1816-d1052-n130-current-en-metadata-full-course-display',
    prepared: 'd1816-d1048-n130-approved-en-metadata', out: 'd1816-d1053-n130-current-complete-en',
    reviewer: 'd1816-d1051-n130-independent-metadata-review', enReview: 'n130-metadata-review.json',
    reviewPrefix: 'n130-', authorStage: 'd1048', historicalBatch: 'D035', objects: 7, figures: 0,
    authorStages: [
      ['d1048', 'd1816-d1048-n130-approved-en-metadata'],
      ['d1050', 'd1816-d1050-n130-approved-en-metadata-native'],
    ], nativePattern: /^d(?:1048|1050|1052|1053)-/ },
};
const config = configurations[requestedCard];
assert(config);
const card = requestedCard, edition = 'modern-us-neutral-en';
const tag = `${config.task.toLowerCase()}-${card.split('-').at(-1)}`;
const target = `${repo}/ssot-resources/soviet10year-textbooks/artifacts/9p`;
const nativePath = `${ticket}/tmp/${config.native}/result.json`;
const firstNativePath = `${ticket}/tmp/${config.firstNative}/result.json`;
const displayPath = `${ticket}/tmp/${config.display}/report.json`;
const preparedPath = `${ticket}/tmp/${config.prepared}/prepared.json`;
const native = read(nativePath), display = read(displayPath), prepared = read(preparedPath);
assert.equal(native.status, config.nativeStatus || 'FIRST_MISSING_EN_NATIVE_FINALIZE_RENDER_PASS');
if (config.figures)
  assert.equal(native.actualCourseWidthContractsPassed ?? native.actual343And480BrowserWidthContractsPassed, true);
else assert.equal(native.rows[0].assets.length, 0);
assert.equal(display.status, 'TWO_COMPLETE_EN_COURSE_DOM_VIEWS_PASS_BOUNDED_PIXELS_PENDING');
assert.equal(display.browserClosed, true);
const protectedFiles = [prepared.source, ...prepared.sourcePages, ...prepared.productsReusedExactly,
  ...prepared.existingFigureTupleInventory.flatMap(figure => Object.values(figure.files))];
for (const file of protectedFiles) assert.equal(bind(file.path).sha256, file.sha256);
const out = `${ticket}/evidence/reports/${config.out}`;
const products = [], canonicalAssets = [], views = [], additionalSavedDisplay = [];
if (!resumeCanonical) {
copy(pixelPath, `${out}/full-course-pixel-review.original.json`);
copy(ledgerPath, `${out}/image-ledger.original.json`);
copy(nativePath, `${out}/native-result.original.json`);
copy(firstNativePath, `${out}/first-native-result.original.json`);
copy(displayPath, `${out}/full-course-dom.original.json`);
copy(`${ticket}/tmp/d1816-recovery/display-d998-n72-first-en-full-course.mjs`,
  `${out}/display/check.retained-current.mjs`);
const reviewer = `${ticket}/tmp/${config.reviewer}`;
const reviewNames = card.endsWith('n72')
  ? ['n72-review.freeze.json', 'n72-first-en-review.json', 'n72-pixel.freeze.json']
  : fs.readdirSync(reviewer).filter(name => name.endsWith('.json')
    && (!config.reviewPrefix || name.startsWith(config.reviewPrefix))
    && (!config.excludedReviewPrefix || !name.startsWith(config.excludedReviewPrefix))
    && `${reviewer}/${name}` !== path.resolve(pixelPath) && `${reviewer}/${name}` !== path.resolve(ledgerPath));
for (const name of reviewNames)
  copy(`${reviewer}/${name}`, `${out}/review/${name}`);
const aliases = [];
for (const [stage, directory] of config.authorStages) {
  for (const name of fs.readdirSync(`${ticket}/tmp/${directory}`).filter(name =>
    name.endsWith('.json') || name.endsWith('.helper.original.mjs'))) {
    const original = `${ticket}/tmp/${directory}/${name}`, retained = `${out}/author/${stage}/${name}`;
    copy(original, retained);
    aliases.push({ original: bind(original), retained: bind(retained) });
  }
}
for (const asset of read(firstNativePath).rows[0].assets)
  for (const key of ['spec', 'render', 'review'])
    copy(asset[key].path, `${out}/first-english-tuples/${asset.id}/${path.basename(asset[key].path)}`);
if (card.endsWith('n72'))
  for (const extension of ['spec.json', 'svg', 'render.json'])
    copy(`${repo}/.tmp/STEMROBIN-181/d1816-d999/figures/fig-134.${extension}`,
      `${out}/unused-first-width-rerender/fig-134.${extension}`);
save(`${out}/author-aliases.json`, aliases);
for (const view of display.views) {
  const retained = {};
  for (const key of ['html', 'screenshot', 'definitionScreenshot']) {
    const source = view[key];
    assert.equal(bind(source.path).sha256, source.sha256);
    const destination = `${out}/display/${path.basename(source.path)}`;
    copy(source.path, destination);
    retained[key] = bind(destination);
  }
  retained.figureScreenshots = view.figureScreenshots.map(figure => {
    assert.equal(bind(figure.image.path).sha256, figure.image.sha256);
    const destination = `${out}/display/${path.basename(figure.image.path)}`;
    copy(figure.image.path, destination);
    return { ...figure, retained: bind(destination) };
  });
  views.push({ ...view, retained });
}
save(`${out}/display-aliases.json`, views);
if (config.affectedDisplay) {
  const originalReport = `${ticket}/tmp/${config.affectedDisplay}/report.json`;
  const affected = read(originalReport);
  assert.equal(affected.status, 'AFFECTED_MOBILE_EQUATION_TERMINAL_SCROLL_DOM_PASS_PIXELS_PENDING');
  assert.equal(affected.originalContentAndHtmlAndFiguresUnchanged, true);
  assert.equal(bind(affected.screenshot.path).sha256, affected.screenshot.sha256);
  const destination = `${out}/display/${path.basename(affected.screenshot.path)}`;
  copy(affected.screenshot.path, destination);
  additionalSavedDisplay.push({
    originalReport: bind(originalReport), retainedReport: bind(`${out}/author/d1024/report.json`),
    originalImage: affected.screenshot, retainedImage: bind(destination),
    onlyAffectedFormulaScrollReachabilityChecked: true,
  });
  save(`${out}/affected-display-aliases.json`, additionalSavedDisplay);
}
for (const asset of native.rows[0].assets) {
  const directory = `${target}/editions/${edition}/figures`;
  const specFile = `${directory}/${asset.id}.spec.json`;
  const svgFile = `${directory}/${asset.id}.svg`;
  const renderFile = `${directory}/${asset.id}.render.json`;
  const reviewFile = `${directory}/${asset.id}.review.json`;
  copy(asset.spec.path, specFile);
  copy(asset.svg.path, svgFile);
  const render = read(asset.render.path);
  render.spec = { path: path.relative(repo, specFile), sha256: bind(specFile).sha256 };
  render.output.svg = { path: path.relative(repo, svgFile), sha256: bind(svgFile).sha256 };
  render.contextLocalization.englishApplicabilityReview = bind(`${out}/review/${config.enReview}`);
  for (const check of render.displayChecks)
    if (check.evidence) check.evidence = bind(`${out}/full-course-dom.original.json`);
  render.unchangedOutputWidthReconciliation.originalRender =
    bind(`${out}/first-english-tuples/${asset.id}/${asset.id}.render.json`);
  render.unchangedOutputWidthReconciliation.firstAuthoritativeCourseDomWidthEvidence =
    bind(`${out}/full-course-dom.original.json`);
  if (render.unchangedOutputWidthReconciliation.firstFailedRerender)
    render.unchangedOutputWidthReconciliation.firstFailedRerender =
      bind(`${out}/author/${config.widthStage}/first-failure.json`);
  assert(!JSON.stringify(render).includes('.tmp/'));
  assert(!JSON.stringify(render).includes('/STEMROBIN-181/tmp/'));
  save(renderFile, render);
  const review = read(asset.review.path);
  review.spec = { path: path.relative(repo, specFile), sha256: bind(specFile).sha256 };
  review.render = { path: path.relative(repo, renderFile), sha256: bind(renderFile).sha256 };
  review.outputs.svg = { path: path.relative(repo, svgFile), sha256: bind(svgFile).sha256 };
  review.localeContextReconciliation.englishApplicabilityReview =
    bind(`${out}/review/${config.enReview}`);
  review.localeContextReconciliation.currentEnglish =
    bind(`${out}/author/${config.authorStage}/en.lesson.draft.json`);
  review.actualWidthReconciliation.originalNative = bind(`${out}/first-native-result.original.json`);
  review.actualWidthReconciliation.actualDisplay = bind(`${out}/full-course-dom.original.json`);
  if (review.actualWidthReconciliation.firstFailedRerender)
    review.actualWidthReconciliation.firstFailedRerender = bind(`${out}/author/${config.widthStage}/first-failure.json`);
  review.actualWidthReconciliation.currentSuppliedSavedPixelReviewPending = false;
  review.currentSavedPixelEvidence = bind(`${out}/full-course-pixel-review.original.json`);
  review.currentSavedPixelLedger = bind(`${out}/image-ledger.original.json`);
  review.completeEnglishAccessibilityApproval = false;
  assert(!JSON.stringify(review).includes('.tmp/'));
  assert(!JSON.stringify(review).includes('/STEMROBIN-181/tmp/'));
  save(reviewFile, review);
  const canonical = { id: asset.id, spec: bind(specFile), svg: bind(svgFile),
    render: bind(renderFile), review: bind(reviewFile) };
  canonicalAssets.push(canonical);
  products.push(...Object.values(canonical).filter(value => typeof value === 'object'));
}
const row = native.rows[0], directory = `${target}/editions/${edition}/lessons/${card}`;
assert(!fs.existsSync(directory));
for (const key of ['lesson', 'exercises', 'figures', 'audit']) {
  assert.equal(bind(row[key].path).sha256, row[key].sha256);
  assert(!fs.readFileSync(row[key].path, 'utf8').includes('.tmp/'));
  const destination = `${directory}/${path.basename(row[key].path)}`;
  copy(row[key].path, destination);
  products.push(bind(destination));
}
} else {
  assert.equal(card, 'phy9-c2-s2-n64');
  assert.equal(bind(`${out}/full-course-pixel-review.original.json`).sha256, pixelHash);
  assert.equal(bind(`${out}/image-ledger.original.json`).sha256, ledgerHash);
  assert.equal(bind(`${out}/native-result.original.json`).sha256, bind(nativePath).sha256);
  assert.equal(bind(`${out}/full-course-dom.original.json`).sha256, bind(displayPath).sha256);
  views.push(...read(`${out}/display-aliases.json`));
  for (const asset of native.rows[0].assets) {
    const directory = `${target}/editions/${edition}/figures`;
    const canonical = { id: asset.id };
    for (const [key, extension] of [['spec', 'spec.json'], ['svg', 'svg'],
      ['render', 'render.json'], ['review', 'review.json']])
      canonical[key] = bind(`${directory}/${asset.id}.${extension}`);
    assert.equal(canonical.spec.sha256, asset.spec.sha256);
    assert.equal(canonical.svg.sha256, asset.svg.sha256);
    canonicalAssets.push(canonical);
    products.push(...Object.values(canonical).filter(value => typeof value === 'object'));
  }
  for (const key of ['lesson', 'exercises', 'figures', 'audit']) {
    const original = native.rows[0][key];
    const canonical = bind(`${target}/editions/${edition}/lessons/${card}/${path.basename(original.path)}`);
    assert.equal(canonical.sha256, original.sha256);
    products.push(canonical);
  }
}
const tupleReceipt = run(`${tag}-first-en-canonical-tuple-bindings${resumeCanonical ? '-source-path-recovery' : ''}`,
  config.figures ? [
    `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B',
    `${ticket}/tmp/d1816-recovery/validate-d1000-n72-retained-tuples.py`,
    card, config.task,
  ] : [
    `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B',
    `${ticket}/tmp/d1816-d823-approved-en-integration/check.py`,
    target, card, read(native.rows[0].lesson.path).title, `${out}/affected-bindings.json`,
  ]);
const indexFile = `${target}/editions/${edition}/book.json`, before = read(indexFile);
assert(!before.lessons.some(lesson => lesson.id === card));
copy(indexFile, `${out}/before.english-book.json`);
const indexReceipt = run(`${tag}-first-en-canonical-index`, [
  `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B',
  `${ticket}/tmp/d1816-recovery/update-edition-index.py`,
  '--book', target, '--carrier', `${native.root}/9p`, '--edition', edition, '--lesson', card,
]);
const after = read(indexFile);
assert.deepEqual(after.lessons.filter(lesson => lesson.id !== card), before.lessons);
assert.deepEqual({ ...after, lessons: [] }, { ...before, lessons: [] });
assert.equal(after.lessons.filter(lesson => lesson.id === card).length, 1);
products.push(bind(indexFile));
for (const file of protectedFiles) assert.equal(bind(file.path).sha256, file.sha256);
const nativeAliases = [], nativeRoot = `${ticket}/tmp/d1816-recovery/native`;
for (const name of fs.readdirSync(nativeRoot).filter(name => config.nativePattern.test(name))) {
  const file = `${nativeRoot}/${name}/receipt.json`, receipt = read(file);
  const retained = `${out}/native/${name}/receipt.original.json`;
  copy(file, retained);
  const streams = {};
  for (const [key, source] of Object.entries(receipt.streams)) {
    assert.equal(bind(source.path).sha256, source.sha256);
    const destination = `${out}/native/${name}/${key}.original.txt`;
    copy(source.path, destination);
    streams[key] = { original: source, retained: bind(destination) };
  }
  nativeAliases.push({ original: bind(file), retained: bind(retained), streams });
}
save(`${out}/native-aliases.json`, nativeAliases);
save(`${out}/canonical-binding-proof.json`, {
  status: 'PASS', products, canonicalAssets, tupleReceipt, indexReceipt,
  sourceAllChineseNativeAndFigureProductsUnchanged: true,
  englishCanonicalLessonProductsExactNativeBytes: true, otherEnglishRowsAndHeaderUnchanged: true,
  originalObjects: config.objects, originalTasks: 0, originalFigures: config.figures,
  actualCourseWidths: native.actualCourseWidths, allApprovedSvgBytesUnchanged: true,
  completeEnglishAccessibilityApproval: false,
  headedAcceptanceClaimed: display.headed,
  newCompleteCourses: 0, newSourcePages: 0, parentImageOpens: 0,
});
save(`${out}/batch-ready.json`, {
  task: config.task, status: `FIRST_COMPLETE_VISIBLE_EN_EDITION_OF_ALREADY_COUNTED_${card.split('-').at(-1).toUpperCase()}_READY`,
  cards: [card], alreadyCountedInHistoricalBatch: config.historicalBatch, newCompleteCourses: 0, newSourcePages: 0,
  originalObjects: config.objects, originalTasks: 0, originalFigures: config.figures, products, views,
  additionalSavedDisplay,
  pixelReview: bind(`${out}/full-course-pixel-review.original.json`),
  imageLedger: bind(`${out}/image-ledger.original.json`), tupleReceipt, indexReceipt,
  nativeResult: bind(`${out}/native-result.original.json`),
  retainedDisplayHelper: bind(`${out}/display/check.retained-current.mjs`),
  retainedHelperExactExecutedVersionClaimed: display.executedHelper
    ? display.executedHelper.sha256 === bind(`${out}/display/check.retained-current.mjs`).sha256 : false,
  suppliedPixelPreviewLimitsPreserved: true, fullResolutionAllGlyphPixelCertificationClaimed: false,
  completeEnglishAccessibilityApproval: false,
  headedAcceptanceClaimed: display.headed,
  browserMode: display.browserMode ?? 'isolated-headed',
  protectedChineseMachineAriaLabelsRetainedAndDisclosed: display.views.some(view => view.machineChineseAriaLabelsRetainedAndDisclosed),
  noSourceZhFigureReviewReplay: true, parentNewImages: 0, databaseWrites: 0, paidCalls: 0,
  formalHandoff: false, scopeComplete: false,
});
console.log(JSON.stringify({ ready: bind(`${out}/batch-ready.json`), products: products.length }));

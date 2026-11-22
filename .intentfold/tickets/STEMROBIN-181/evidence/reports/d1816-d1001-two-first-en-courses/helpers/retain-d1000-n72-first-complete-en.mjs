import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const [pixelPath, pixelHash, ledgerPath, ledgerHash] = process.argv.slice(2);
assert.equal(bind(pixelPath).sha256, pixelHash);
assert.equal(bind(ledgerPath).sha256, ledgerHash);
assert.equal(read(pixelPath).status, 'PASS');
const card = 'phy9-c2-s2-n72', edition = 'modern-us-neutral-en';
const target = `${repo}/ssot-resources/soviet10year-textbooks/artifacts/9p`;
const nativePath = `${ticket}/tmp/d1816-d1003-n72-original-svg-width-bindings/result.json`;
const firstNativePath = `${ticket}/tmp/d1816-d997-n72-first-en-native/result.json`;
const displayPath = `${ticket}/tmp/d1816-d998-n72-first-en-full-course-display/report.json`;
const preparedPath = `${ticket}/tmp/d1816-d993-n72-first-missing-en/prepared.json`;
const native = read(nativePath), display = read(displayPath), prepared = read(preparedPath);
assert.equal(native.status, 'FIRST_MISSING_EN_NATIVE_FINALIZE_RENDER_PASS');
assert.equal(native.actual343And480BrowserWidthContractsPassed, true);
assert.equal(display.status, 'TWO_COMPLETE_EN_COURSE_DOM_VIEWS_PASS_BOUNDED_PIXELS_PENDING');
assert.equal(display.browserClosed, true);
const protectedFiles = [prepared.source, ...prepared.sourcePages, ...prepared.productsReusedExactly,
  ...prepared.existingFigureTupleInventory.flatMap(figure => Object.values(figure.files))];
for (const file of protectedFiles) assert.equal(bind(file.path).sha256, file.sha256);
const out = `${ticket}/evidence/reports/d1816-d1000-n72-first-complete-en`;
copy(pixelPath, `${out}/full-course-pixel-review.original.json`);
copy(ledgerPath, `${out}/image-ledger.original.json`);
copy(nativePath, `${out}/native-result.original.json`);
copy(firstNativePath, `${out}/first-native-result.original.json`);
copy(displayPath, `${out}/full-course-dom.original.json`);
copy(`${ticket}/tmp/d1816-recovery/display-d998-n72-first-en-full-course.mjs`,
  `${out}/display/check.first-executed.mjs`);
const reviewer = `${ticket}/tmp/d1816-d990-n63-first-en-independent-review`;
for (const name of ['n72-review.freeze.json', 'n72-first-en-review.json', 'n72-pixel.freeze.json'])
  copy(`${reviewer}/${name}`, `${out}/review/${name}`);
const aliases = [];
for (const [stage, directory] of [
  ['d993', 'd1816-d993-n72-first-missing-en'],
  ['d994', 'd1816-d994-n72-first-missing-en'],
  ['d995', 'd1816-d995-n72-label-identity'],
  ['d997', 'd1816-d997-n72-first-en-native'],
  ['d1003', 'd1816-d1003-n72-original-svg-width-bindings'],
]) {
  for (const name of fs.readdirSync(`${ticket}/tmp/${directory}`).filter(name => name.endsWith('.json'))) {
    const original = `${ticket}/tmp/${directory}/${name}`, retained = `${out}/author/${stage}/${name}`;
    copy(original, retained);
    aliases.push({ original: bind(original), retained: bind(retained) });
  }
}
for (const asset of read(firstNativePath).rows[0].assets)
  for (const key of ['spec', 'render', 'review'])
    copy(asset[key].path, `${out}/first-english-tuples/${asset.id}/${path.basename(asset[key].path)}`);
for (const extension of ['spec.json', 'svg', 'render.json'])
  copy(`${repo}/.tmp/STEMROBIN-181/d1816-d999/figures/fig-134.${extension}`,
    `${out}/unused-first-width-rerender/fig-134.${extension}`);
save(`${out}/author-aliases.json`, aliases);
const views = [];
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
const products = [], canonicalAssets = [];
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
  render.contextLocalization.englishApplicabilityReview = bind(`${out}/review/n72-first-en-review.json`);
  for (const check of render.displayChecks)
    if (check.evidence) check.evidence = bind(`${out}/full-course-dom.original.json`);
  render.unchangedOutputWidthReconciliation.originalRender =
    bind(`${out}/first-english-tuples/${asset.id}/${asset.id}.render.json`);
  render.unchangedOutputWidthReconciliation.firstAuthoritativeCourseDomWidthEvidence =
    bind(`${out}/full-course-dom.original.json`);
  render.unchangedOutputWidthReconciliation.firstFailedRerender =
    bind(`${out}/author/d1003/first-failure.json`);
  assert(!JSON.stringify(render).includes('.tmp/'));
  assert(!JSON.stringify(render).includes('/STEMROBIN-181/tmp/'));
  save(renderFile, render);
  const review = read(asset.review.path);
  review.spec = { path: path.relative(repo, specFile), sha256: bind(specFile).sha256 };
  review.render = { path: path.relative(repo, renderFile), sha256: bind(renderFile).sha256 };
  review.outputs.svg = { path: path.relative(repo, svgFile), sha256: bind(svgFile).sha256 };
  review.localeContextReconciliation.englishApplicabilityReview =
    bind(`${out}/review/n72-first-en-review.json`);
  review.localeContextReconciliation.currentEnglish =
    bind(`${out}/author/d995/en.lesson.draft.json`);
  review.actualWidthReconciliation.originalNative = bind(`${out}/first-native-result.original.json`);
  review.actualWidthReconciliation.actualDisplay = bind(`${out}/full-course-dom.original.json`);
  review.actualWidthReconciliation.firstFailedRerender = bind(`${out}/author/d1003/first-failure.json`);
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
const tupleReceipt = run('d1000-n72-first-en-canonical-tuple-bindings', [
  `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B',
  `${ticket}/tmp/d1816-recovery/validate-d1000-n72-retained-tuples.py`,
]);
const indexFile = `${target}/editions/${edition}/book.json`, before = read(indexFile);
assert(!before.lessons.some(lesson => lesson.id === card));
copy(indexFile, `${out}/before.english-book.json`);
const indexReceipt = run('d1000-n72-first-en-canonical-index', [
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
for (const name of fs.readdirSync(nativeRoot).filter(name => /^d(?:993|994|995|997|998|999|1000)-/.test(name))) {
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
  originalObjects: 13, originalTasks: 0, originalFigures: 4,
  actualCourseWidths: [343, 480], allApprovedSvgBytesUnchanged: true,
  completeEnglishAccessibilityApproval: false,
  newCompleteCourses: 0, newSourcePages: 0, parentImageOpens: 0,
});
save(`${out}/batch-ready.json`, {
  task: 'D1000', status: 'FIRST_COMPLETE_VISIBLE_EN_EDITION_OF_ALREADY_COUNTED_N72_READY',
  cards: [card], alreadyCountedInD020: true, newCompleteCourses: 0, newSourcePages: 0,
  originalObjects: 13, originalTasks: 0, originalFigures: 4, products, views,
  pixelReview: bind(`${out}/full-course-pixel-review.original.json`),
  imageLedger: bind(`${out}/image-ledger.original.json`), tupleReceipt, indexReceipt,
  nativeResult: bind(`${out}/native-result.original.json`),
  suppliedPixelPreviewLimitsPreserved: true, fullResolutionAllGlyphPixelCertificationClaimed: false,
  completeEnglishAccessibilityApproval: false,
  protectedChineseMachineAriaLabelsRetainedAndDisclosed: true,
  noSourceZhFigureReviewReplay: true, parentNewImages: 0, databaseWrites: 0, paidCalls: 0,
  formalHandoff: false, scopeComplete: false,
});
console.log(JSON.stringify({ ready: bind(`${out}/batch-ready.json`), products: products.length }));

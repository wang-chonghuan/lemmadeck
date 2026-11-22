import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const [pixelPath, pixelHash, ledgerPath, ledgerHash] = process.argv.slice(2);
assert.equal(bind(pixelPath).sha256, pixelHash);
assert.equal(bind(ledgerPath).sha256, ledgerHash);
assert.equal(read(pixelPath).status, 'PASS');
const card = 'phy9-c2-s2-n63';
const target = `${repo}/ssot-resources/soviet10year-textbooks/artifacts/9p`;
const nativePath = `${ticket}/tmp/d1816-d991-n63-first-en-native/result.json`;
const displayPath = `${ticket}/tmp/d1816-d992-n63-first-en-full-course-display/report.json`;
const preparedPath = `${ticket}/tmp/d1816-d987-n63-first-missing-en/prepared.json`;
const native = read(nativePath), display = read(displayPath), prepared = read(preparedPath);
assert.equal(native.status, 'FIRST_MISSING_EN_NATIVE_FINALIZE_RENDER_PASS');
assert.equal(display.status, 'TWO_COMPLETE_EN_COURSE_DOM_VIEWS_PASS_BOUNDED_PIXELS_PENDING');
assert.equal(display.views.length, 2);
assert.equal(display.browserClosed, true);
const protectedFiles = [prepared.source, prepared.registeredSourcePage, ...prepared.productsReusedExactly];
for (const file of protectedFiles) assert.equal(bind(file.path).sha256, file.sha256);
const out = `${ticket}/evidence/reports/d1816-d996-n63-first-complete-en`;
copy(pixelPath, `${out}/full-course-pixel-review.original.json`);
copy(ledgerPath, `${out}/image-ledger.original.json`);
copy(nativePath, `${out}/native-result.original.json`);
copy(displayPath, `${out}/full-course-dom.original.json`);
copy(`${ticket}/tmp/d1816-recovery/display-d972-n74-first-en-full-course.mjs`,
  `${out}/display/check.first-executed.mjs`);
const reviewer = `${ticket}/tmp/d1816-d990-n63-first-en-independent-review`;
for (const name of ['report.json', 'candidate-bindings.json', 'review.freeze.json',
  'ledger.json', 'pixel.freeze.json'])
  copy(`${reviewer}/${name}`, `${out}/review/${name}`);
const aliases = [];
for (const [stage, directory] of [
  ['d987', 'd1816-d987-n63-first-missing-en'],
  ['d988', 'd1816-d988-n63-first-missing-en'],
  ['d989', 'd1816-d989-n63-historical-name'],
  ['d991', 'd1816-d991-n63-first-en-native'],
]) {
  for (const name of fs.readdirSync(`${ticket}/tmp/${directory}`).filter(name => name.endsWith('.json'))) {
    const original = `${ticket}/tmp/${directory}/${name}`, retained = `${out}/author/${stage}/${name}`;
    copy(original, retained);
    aliases.push({ original: bind(original), retained: bind(retained) });
  }
}
save(`${out}/author-aliases.json`, aliases);
const views = [];
for (const view of display.views) {
  const retained = {};
  for (const key of ['html', 'screenshot', 'definitionScreenshot', 'formulaScreenshot', 'formulaRightScreenshot']) {
    const source = view[key];
    if (!source) continue;
    assert.equal(bind(source.path).sha256, source.sha256);
    const destination = `${out}/display/${path.basename(source.path)}`;
    copy(source.path, destination);
    retained[key] = bind(destination);
  }
  views.push({ ...view, retained });
}
save(`${out}/display-aliases.json`, views);
const nativeAliases = [];
const nativeRoot = `${ticket}/tmp/d1816-recovery/native`;
for (const name of fs.readdirSync(nativeRoot).filter(name => /^d(?:987|988|989|991|992)-/.test(name))) {
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
const row = native.rows[0], directory = `${target}/editions/${row.edition}/lessons/${card}`;
assert(!fs.existsSync(directory));
const products = [];
for (const key of ['lesson', 'exercises', 'figures', 'audit']) {
  const source = row[key];
  assert.equal(bind(source.path).sha256, source.sha256);
  assert(!fs.readFileSync(source.path, 'utf8').includes('.tmp/'));
  const destination = `${directory}/${path.basename(source.path)}`;
  copy(source.path, destination);
  products.push(bind(destination));
}
const indexFile = `${target}/editions/${row.edition}/book.json`, before = read(indexFile);
assert(!before.lessons.some(lesson => lesson.id === card));
copy(indexFile, `${out}/before.english-book.json`);
const indexReceipt = run('d996-n63-first-en-canonical-index', [
  `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B',
  `${ticket}/tmp/d1816-recovery/update-edition-index.py`,
  '--book', target, '--carrier', `${native.root}/9p`, '--edition', row.edition, '--lesson', card,
]);
const after = read(indexFile);
assert.deepEqual(after.lessons.filter(lesson => lesson.id !== card), before.lessons);
assert.deepEqual({ ...after, lessons: [] }, { ...before, lessons: [] });
assert.equal(after.lessons.filter(lesson => lesson.id === card).length, 1);
products.push(bind(indexFile));
for (const file of protectedFiles) assert.equal(bind(file.path).sha256, file.sha256);
save(`${out}/canonical-binding-proof.json`, {
  status: 'PASS', products, sourceRegistryPrintedOriginalAndChineseProductsUnchanged: true,
  englishCanonicalExactNativeBytes: true, otherEnglishRowsAndHeaderUnchanged: true,
  originalObjects: 26, originalTasks: 0, originalFigures: 0,
  inheritedPermittivityDimension: 'C^2/(N*m^2)', newMathematicalCorrection: false,
  newCompleteCourses: 0, newSourcePages: 0, parentImageOpens: 0,
});
save(`${out}/batch-ready.json`, {
  task: 'D996', status: 'FIRST_COMPLETE_EN_EDITION_OF_ALREADY_COUNTED_N63_READY',
  cards: [card], alreadyCountedInD018: true, newCompleteCourses: 0, newSourcePages: 0,
  originalObjects: 26, originalTasks: 0, originalFigures: 0, products, views, indexReceipt,
  pixelReview: bind(`${out}/full-course-pixel-review.original.json`),
  imageLedger: bind(`${out}/image-ledger.original.json`),
  nativeResult: bind(`${out}/native-result.original.json`),
  suppliedPixelPreviewLimitsPreserved: true, fullResolutionAllGlyphPixelCertificationClaimed: false,
  noSourceZhReviewReplay: true, parentNewImages: 0,
  databaseWrites: 0, paidCalls: 0, formalHandoff: false, scopeComplete: false,
});
console.log(JSON.stringify({ ready: bind(`${out}/batch-ready.json`), products: products.length }));

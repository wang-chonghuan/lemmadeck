import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const [pixelPath, pixelHash, ledgerPath, ledgerHash] = process.argv.slice(2);
assert.equal(bind(pixelPath).sha256, pixelHash);
assert.equal(bind(ledgerPath).sha256, ledgerHash);
assert.equal(read(pixelPath).status, 'PASS');
const card = 'phy9-c2-s2-n79';
const target = `${repo}/ssot-resources/soviet10year-textbooks/artifacts/9p`;
const nativePath = `${ticket}/tmp/d1816-d979-n79-first-en-native/result.json`;
const displayPath = `${ticket}/tmp/d1816-d980-n79-first-en-full-course-display/report.json`;
const preparedPath = `${ticket}/tmp/d1816-d975-n79-first-missing-en/prepared.json`;
const native = read(nativePath), display = read(displayPath), prepared = read(preparedPath);
assert.equal(native.status, 'FIRST_MISSING_EN_NATIVE_FINALIZE_RENDER_PASS');
assert.equal(display.status, 'TWO_COMPLETE_EN_COURSE_DOM_VIEWS_PASS_BOUNDED_PIXELS_PENDING');
assert.equal(display.views.length, 2);
assert.equal(display.browserClosed, true);
for (const file of [prepared.source, ...prepared.productsReusedExactly])
  assert.equal(bind(file.path).sha256, file.sha256);
const out = `${ticket}/evidence/reports/d1816-d984-n79-first-complete-en`;
copy(pixelPath, `${out}/full-course-pixel-review.original.json`);
copy(ledgerPath, `${out}/image-ledger.original.json`);
copy(nativePath, `${out}/native-result.original.json`);
copy(displayPath, `${out}/full-course-dom.original.json`);
copy(`${ticket}/tmp/d1816-recovery/display-d972-n74-first-en-full-course.mjs`,
  `${out}/display/check.first-executed.mjs`);
const reviewer = `${ticket}/tmp/d1816-d967-n74-first-en-independent-review`;
for (const name of ['n79-review.freeze.json', 'n79-first-en-review.json'])
  copy(`${reviewer}/${name}`, `${out}/review/${name}`);
const aliases = [];
for (const [stage, directory] of [
  ['d975', 'd1816-d975-n79-first-missing-en'],
  ['d976', 'd1816-d976-n79-first-missing-en'],
  ['d979', 'd1816-d979-n79-first-en-native'],
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
  for (const key of ['html', 'screenshot', 'definitionScreenshot', 'formulaScreenshot']) {
    const source = view[key], destination = `${out}/display/${path.basename(source.path)}`;
    assert.equal(bind(source.path).sha256, source.sha256);
    copy(source.path, destination);
    retained[key] = bind(destination);
  }
  views.push({ ...view, retained });
}
save(`${out}/display-aliases.json`, views);
const nativeAliases = [];
const nativeRoot = `${ticket}/tmp/d1816-recovery/native`;
for (const name of fs.readdirSync(nativeRoot).filter(name => /^d(?:975|976|979|980)-/.test(name))) {
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
const indexReceipt = run('d984-n79-first-en-canonical-index', [
  `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B',
  `${ticket}/tmp/d1816-recovery/update-edition-index.py`,
  '--book', target, '--carrier', `${native.root}/9p`, '--edition', row.edition, '--lesson', card,
]);
const after = read(indexFile);
assert.deepEqual(after.lessons.filter(lesson => lesson.id !== card), before.lessons);
assert.deepEqual({ ...after, lessons: [] }, { ...before, lessons: [] });
assert.equal(after.lessons.filter(lesson => lesson.id === card).length, 1);
products.push(bind(indexFile));
for (const file of [prepared.source, ...prepared.productsReusedExactly])
  assert.equal(bind(file.path).sha256, file.sha256);
save(`${out}/canonical-binding-proof.json`, {
  status: 'PASS', products, sourceAndFourChineseProductsUnchanged: true,
  englishCanonicalExactNativeBytes: true, otherEnglishRowsAndHeaderUnchanged: true,
  originalObjects: 9, originalTasks: 0, originalFigures: 0,
  newCompleteCourses: 0, newSourcePages: 0, parentImageOpens: 0,
});
const ready = `${out}/batch-ready.json`;
save(ready, {
  task: 'D984', status: 'FIRST_COMPLETE_EN_EDITION_OF_ALREADY_COUNTED_N79_READY',
  cards: [card], alreadyCountedInD020: true, newCompleteCourses: 0, newSourcePages: 0,
  originalObjects: 9, originalTasks: 0, originalFigures: 0, products, views, indexReceipt,
  pixelReview: bind(`${out}/full-course-pixel-review.original.json`),
  imageLedger: bind(`${out}/image-ledger.original.json`),
  nativeResult: bind(`${out}/native-result.original.json`),
  suppliedPixelPreviewLimitsPreserved: true, fullResolutionAllGlyphPixelCertificationClaimed: false,
  noSourceZhReviewReplay: true, parentNewImages: 0,
  databaseWrites: 0, paidCalls: 0, formalHandoff: false, scopeComplete: false,
});
const beforeRoot = `${ticket}/tmp/d1816-d984-before-retention`;
copy(`${ticket}/production-meter.json`, `${beforeRoot}/production-meter.before.json`);
copy(`${ticket}/review.md`, `${beforeRoot}/review.before.md`);
const meter = read(`${ticket}/production-meter.json`);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 153);
assert.equal(meter.sourcePagesFinalized, 581);
Object.assign(meter.currentResume1816, {
  D975: { status: 'N79_FIRST_MISSING_EN_PREPARATION_PASS', newCompleteCourses: 0 },
  D976: { status: 'N79_FIRST_EN_AUTHOR_NATIVE_AND_INDEPENDENT_SCI_ZHEN_PASS', newCompleteCourses: 0 },
  D979: { status: 'N79_FIRST_EN_NATIVE_FINALIZE_RENDER_PASS', native: bind(`${out}/native-result.original.json`) },
  D980: { status: 'N79_FIRST_FULL_EN_DESKTOP_MOBILE_DOM_AND_BOUNDED_PIXELS_PASS', display: bind(`${out}/full-course-dom.original.json`) },
  D984: { status: 'FIRST_COMPLETE_N79_EN_CANONICAL_RETAINED_READY', ready: bind(ready), newCompleteCourses: 0, newSourcePages: 0 },
});
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(`${ticket}/production-meter.json`, JSON.stringify(meter, null, 2) + '\n');
fs.appendFileSync(`${ticket}/review.md`,
  '\nD975-D984: N79 first missing EN full9-object/12-paragraph course completed offline. Exact D020 Chinese/source/native/science bindings reused; FIRST EN-SCI/English/ZHEN PASS, native finalize/render PASS. Headed1440x960/390x844 full DOM and six supplied saved pixel views PASS, preview/fineglyph limits preserved. Four native EN products and one index row retained; source/fourChineseproducts/otherENrows/header unchanged. Already D020-counted, totals153/581 unchanged. Same independent context actual7+6=13images, no reopens/crops/resets; no source/science replay, DB/paid/skill/broadtest/force/merge/deploy/formalhandoff.\n');
console.log(JSON.stringify({ ready: bind(ready), products: products.length, newCompleteCourses: 0 }));

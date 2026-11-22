import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const [pixelPath, pixelHash, ledgerPath, ledgerHash] = process.argv.slice(2);
assert.equal(bind(pixelPath).sha256, pixelHash);
assert.equal(bind(ledgerPath).sha256, ledgerHash);
assert.equal(read(pixelPath).status, 'PASS');
const card = 'phy10-c1-s1';
const sourceDirectory = `${ticket}/tmp/d1816-d1196-introduction-first-en`;
const displayPath = `${ticket}/tmp/d1816-d1200-introduction-first-en-display/report.json`;
const prepared = read(`${sourceDirectory}/prepared.json`);
const nativePath = `${sourceDirectory}/native-result.json`, native = read(nativePath);
const display = read(displayPath);
assert.equal(native.status, 'FIRST_MISSING_EN_NATIVE_FINALIZE_RENDER_PASS');
assert.equal(display.status, 'FIRST_EN_DESKTOP_MOBILE_DOM_PASS_PIXELS_PENDING');
assert.equal(display.browserClosed, true);
assert.equal(display.views.length, 2);
const protectedFiles = [prepared.source, ...prepared.sourcePages, ...prepared.productsReusedExactly];
for (const file of protectedFiles) assert.equal(bind(file.path).sha256, file.sha256);
const out = `${ticket}/evidence/reports/d1816-d1201-introduction-first-complete-en`;
const aliases = [];
for (const name of fs.readdirSync(sourceDirectory)) {
  const from = `${sourceDirectory}/${name}`, to = `${out}/author/${name}`;
  copy(from, to);
  aliases.push({ original: bind(from), retained: bind(to) });
}
for (const name of ['review.freeze.json', 'first-en-review.json', 'intro-pixel.freeze.json'])
  copy(`${ticket}/tmp/d1816-d1198-introduction-independent-review/${name}`, `${out}/review/${name}`);
copy(pixelPath, `${out}/full-course-pixel-review.original.json`);
copy(ledgerPath, `${out}/image-ledger.original.json`);
copy(displayPath, `${out}/full-course-dom.original.json`);
copy(nativePath, `${out}/native-result.original.json`);
copy(display.executedHelper.path, `${out}/display/check.retained-current.mjs`);
assert.equal(bind(`${out}/display/check.retained-current.mjs`).sha256, display.executedHelper.sha256);
const views = [];
for (const view of display.views) {
  const retained = {};
  for (const key of ['html', 'screenshot', 'focusScreenshot']) {
    assert.equal(bind(view[key].path).sha256, view[key].sha256);
    const destination = `${out}/display/${path.basename(view[key].path)}`;
    copy(view[key].path, destination);
    retained[key] = bind(destination);
  }
  views.push({ ...view, retained });
}
save(`${out}/aliases.json`, { author: aliases, views });
const target = `${repo}/ssot-resources/soviet10year-textbooks/artifacts/10p`;
const row = native.rows[0], directory = `${target}/editions/modern-us-neutral-en/lessons/${card}`;
assert(!fs.existsSync(directory));
const products = [];
for (const key of ['lesson', 'exercises', 'figures', 'audit']) {
  const file = row[key], destination = `${directory}/${path.basename(file.path)}`;
  assert.equal(bind(file.path).sha256, file.sha256);
  assert(!fs.readFileSync(file.path, 'utf8').includes('.tmp/'));
  copy(file.path, destination);
  products.push(bind(destination));
}
const indexFile = `${target}/editions/modern-us-neutral-en/book.json`, before = read(indexFile);
assert(!before.lessons.some(lesson => lesson.id === card));
copy(indexFile, `${out}/before.english-book.json`);
const indexReceipt = run('d1201-introduction-first-en-canonical-index', [
  `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B',
  `${ticket}/tmp/d1816-recovery/update-edition-index.py`,
  '--book', target, '--carrier', `${native.root}/10p`, '--edition', row.edition, '--lesson', card,
]);
const after = read(indexFile);
assert.deepEqual(after.lessons.filter(lesson => lesson.id !== card), before.lessons);
assert.deepEqual({ ...after, lessons: [] }, { ...before, lessons: [] });
assert.equal(after.lessons.filter(lesson => lesson.id === card).length, 1);
products.push(bind(indexFile));
for (const file of protectedFiles) assert.equal(bind(file.path).sha256, file.sha256);
const receipts = [];
for (const name of fs.readdirSync(`${ticket}/tmp/d1816-recovery/native`).filter(name => /^d(?:1196|1197|1199|1201)-/.test(name))) {
  const original = `${ticket}/tmp/d1816-recovery/native/${name}/receipt.json`, receipt = read(original);
  copy(original, `${out}/native/${name}/receipt.original.json`);
  const streams = {};
  for (const [key, file] of Object.entries(receipt.streams)) {
    assert.equal(bind(file.path).sha256, file.sha256);
    const destination = `${out}/native/${name}/${key}.original.txt`;
    copy(file.path, destination);
    streams[key] = { original: file, retained: bind(destination) };
  }
  receipts.push({ original: bind(original), retained: bind(`${out}/native/${name}/receipt.original.json`), streams });
}
save(`${out}/native-aliases.json`, receipts);
save(`${out}/canonical-binding-proof.json`, {
  status: 'PASS', products, sourceAllChineseNativeProductsUnchanged: true,
  englishCanonicalExactNativeBytes: true, otherEnglishRowsAndHeaderUnchanged: true,
  originalObjects: 4, originalTasks: 0, originalFigures: 0, newCompleteCourses: 0, newSourcePages: 0,
});
save(`${out}/batch-ready.json`, {
  task: 'D1201', status: 'FIRST_COMPLETE_INTRODUCTION_EN_EDITION_READY',
  cards: [card], products, views, originalObjects: 4, originalTasks: 0, originalFigures: 0,
  flowParagraphs: 7, pixelReview: bind(`${out}/full-course-pixel-review.original.json`),
  imageLedger: bind(`${out}/image-ledger.original.json`), indexReceipt,
  alreadyCountedInHistoricalBatch: 'D-002', newCompleteCourses: 0, newSourcePages: 0,
  firstEnglishScientificReviewNotHistoricalApproval: true,
  originalNativeFailureAndGradeWordRecoveryPreserved: true,
  sourceAndChineseReviewReplayed: false, parentNewImages: 0, paidCalls: 0, databaseWrites: 0,
  browserMode: 'isolated-headless', headedAcceptanceClaimed: false,
  fullResolutionAllGlyphCertification: false, formalHandoff: false, scopeComplete: false,
});
console.log(JSON.stringify({ ready: bind(`${out}/batch-ready.json`), products: products.length }));

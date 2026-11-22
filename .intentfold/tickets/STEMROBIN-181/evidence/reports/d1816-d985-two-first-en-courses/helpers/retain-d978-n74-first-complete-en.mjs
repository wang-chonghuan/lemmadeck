import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const [pixelPath, pixelHash, acceptedPixelStatus, ledgerPath, ledgerHash] = process.argv.slice(2);
assert.equal(bind(pixelPath).sha256, pixelHash);
assert.equal(bind(ledgerPath).sha256, ledgerHash);
assert.equal(read(pixelPath).status, acceptedPixelStatus);
assert(/pass/i.test(acceptedPixelStatus) && !/fail|revise|hold/i.test(acceptedPixelStatus));
const card = 'phy9-c2-s2-n74';
const target = `${repo}/ssot-resources/soviet10year-textbooks/artifacts/9p`;
const nativePath = `${ticket}/tmp/d1816-d974-n74-first-en-native-recovery/result.json`;
const displayPath = `${ticket}/tmp/d1816-d972-n74-first-en-full-course-display/report.json`;
const preparedPath = `${ticket}/tmp/d1816-d965-n74-missing-en/prepared.json`;
const native = read(nativePath), display = read(displayPath), prepared = read(preparedPath);
assert.equal(native.status, 'FIRST_MISSING_EN_NATIVE_FINALIZE_RENDER_PASS');
assert.equal(display.status, 'TWO_COMPLETE_EN_COURSE_DOM_VIEWS_PASS_BOUNDED_PIXELS_PENDING');
assert.equal(display.views.length, 2);
assert.equal(display.browserClosed, true);
for (const file of [prepared.source, ...prepared.productsReusedExactly])
  assert.equal(bind(file.path).sha256, file.sha256);
const out = `${ticket}/evidence/reports/d1816-d978-n74-first-complete-en`;
copy(pixelPath, `${out}/full-course-pixel-review.original.json`);
copy(ledgerPath, `${out}/image-ledger.original.json`);
copy(nativePath, `${out}/native-result.original.json`);
copy(displayPath, `${out}/full-course-dom.original.json`);
copy(`${ticket}/tmp/d1816-d972-n74-first-en-full-course-display/check.first-executed.mjs`,
  `${out}/display/check.first-executed.mjs`);
const reviewer = `${ticket}/tmp/d1816-d967-n74-first-en-independent-review`;
for (const name of [
  'report.json', 'candidate-bindings.json', 'review.freeze.json', 'ledger.json',
  'affected-text-review.json', 'ledger.v2.json', 'section-identity-review.json', 'ledger.v3.json',
]) copy(`${reviewer}/${name}`, `${out}/review/${name}`);
const authorAliases = [];
for (const [stage, directory] of [
  ['d965', 'd1816-d965-n74-missing-en'],
  ['d966', 'd1816-d966-n74-missing-en'],
  ['d970', 'd1816-d970-n74-two-text-findings'],
  ['d971', 'd1816-d971-n74-first-en-native'],
  ['d973', 'd1816-d973-n74-source-section-reconciliation'],
  ['d974', 'd1816-d974-n74-first-en-native-recovery'],
]) {
  const source = `${ticket}/tmp/${directory}`;
  for (const name of fs.readdirSync(source).filter(name => name.endsWith('.json'))) {
    const file = `${source}/${name}`, destination = `${out}/author/${stage}/${name}`;
    copy(file, destination);
    authorAliases.push({ original: bind(file), retained: bind(destination) });
  }
}
copy(`${ticket}/tmp/d1816-d970-launch-syntax-failure.json`, `${out}/author/d970/launcher-failure.original.json`);
save(`${out}/author-aliases.json`, authorAliases);
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
for (const name of fs.readdirSync(nativeRoot).filter(name => /^d(?:965|966|970|971|972|973|974)-/.test(name))) {
  const file = `${nativeRoot}/${name}/receipt.json`;
  const receipt = read(file);
  const retained = `${out}/native/${name}/receipt.original.json`;
  copy(file, retained);
  const streams = {};
  for (const [key, source] of Object.entries(receipt.streams)) {
    const destination = `${out}/native/${name}/${key}.original.txt`;
    assert.equal(bind(source.path).sha256, source.sha256);
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
const indexFile = `${target}/editions/${row.edition}/book.json`;
const before = read(indexFile);
assert(!before.lessons.some(lesson => lesson.id === card));
copy(indexFile, `${out}/before.english-book.json`);
const indexReceipt = run('d978-n74-first-en-canonical-index', [
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
  status: 'PASS', products, sourceAndFourChineseNativeProductsUnchanged: true,
  englishCanonicalExactNativeBytes: true, otherEnglishRowsAndHeaderUnchanged: true,
  sourceSectionIdentityKeptAndActualEnglishCrumbVerified: true,
  originalObjects: 25, originalTasks: 0, originalFigures: 0,
  newCompleteCourses: 0, newSourcePages: 0, parentImageOpens: 0,
});
const ready = `${out}/batch-ready.json`;
save(ready, {
  task: 'D978', status: 'FIRST_COMPLETE_EN_EDITION_OF_ALREADY_COUNTED_N74_READY',
  cards: [card], alreadyCountedInD019: true,
  newCompleteCourses: 0, newSourcePages: 0, originalObjects: 25,
  originalTasks: 0, originalFigures: 0, products, views,
  pixelReview: bind(`${out}/full-course-pixel-review.original.json`),
  acceptedPixelStatus, imageLedger: bind(`${out}/image-ledger.original.json`),
  nativeResult: bind(`${out}/native-result.original.json`), indexReceipt,
  originalFailureAndReviewerMetadataCorrectionPreserved: true,
  suppliedPixelPreviewLimitsPreserved: true, fullResolutionAllGlyphPixelCertificationClaimed: false,
  noSourceZhReviewReplay: true, parentNewImages: 0,
  databaseWrites: 0, paidCalls: 0, formalHandoff: false, scopeComplete: false,
});
const meter = read(`${ticket}/production-meter.json`);
const checkpoint = `${ticket}/tmp/d1816-d978-before-retention`;
copy(`${ticket}/production-meter.json`, `${checkpoint}/production-meter.before.json`);
copy(`${ticket}/review.md`, `${checkpoint}/review.before.md`);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 153);
assert.equal(meter.sourcePagesFinalized, 581);
Object.assign(meter.currentResume1816, {
  D970: { status: 'TWO_N74_TEXT_FINDINGS_CORRECTED_AFFECTED_NATIVE_REVIEW_PASS', newCompleteCourses: 0 },
  D971: { status: 'FIRST_EN_FINALIZE_FAILED_SOURCE_SECTION_IDENTITY_ONLY_PRESERVED', semanticHold: false },
  D973: { status: 'SOURCE_SECTION_MACHINE_IDENTITY_AND_TOC_RENDER_CONTRACT_RECONCILED', newCompleteCourses: 0 },
  D974: { status: 'N74_AFFECTED_NATIVE_FINALIZE_AND_FIRST_RENDER_PASS', native: bind(`${out}/native-result.original.json`) },
  D972: { status: 'FIRST_FULL_EN_DESKTOP_MOBILE_DOM_AND_BOUNDED_PIXELS_PASS', display: bind(`${out}/full-course-dom.original.json`) },
  D978: { status: 'FIRST_COMPLETE_N74_EN_CANONICAL_RETAINED_READY', ready: bind(ready), newCompleteCourses: 0, newSourcePages: 0 },
});
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(`${ticket}/production-meter.json`, JSON.stringify(meter, null, 2) + '\n');
fs.appendFileSync(`${ticket}/review.md`,
  '\nD970-D978: N74 first missing EN full25-object/30-paragraph course completed offline. First EN-SCI/ZHEN PASS reused with affected TOC title/strong-opener correction; native section identity failure and reviewer correction preserved. Source /section intentionally retained; official TOC renderer actual English crumb verified. Affected native finalization and first renderer PASS; headed1440x960/390x844 full DOM plus bounded saved pixel review PASS, mobile long-formula right-scroll proven, preview limits retained. Four EN native products and one native index row installed; all original source/Chinese products and other EN rows/header unchanged. Already D019-counted, totals153/581 unchanged; no science/source replay, DB/paid/skill/broadtest/force/merge/deploy/formalhandoff. N79 first missing EN continues.\n');
console.log(JSON.stringify({ ready: bind(ready), products: products.length, newCompleteCourses: 0 }));

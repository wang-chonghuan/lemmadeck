import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, copy } from './n42-native.mjs';

const card = 'phy9-c2-s2-n71';
const evidence = `${ticket}/evidence/reports/d1816-d964-n71-first-display-and-bindings`;
const scratch = `${ticket}/tmp/d1816-d964-retention`;
fs.mkdirSync(evidence, { recursive: false });
fs.mkdirSync(scratch, { recursive: false });
const attempt = `${repo}/ssot-resources/soviet10year-textbooks/artifacts/9p/lessons/${card}/attempts/d961`;
const registry = read(`${attempt}/attempt.json`);
const reviewRoot = `${ticket}/evidence/reports/d1816-d961-n71-approved-local-stages/review`;
const pixelsFile = `${reviewRoot}/text-display-pixel-review.json`;
const ledgerFile = `${reviewRoot}/image-ledger.json`;
assert.equal(bind(pixelsFile).sha256, '41dc026213a0f0ac582eeaba1786efd8048c4d0790859b6dd142445c84fdb23b');
assert.equal(bind(ledgerFile).sha256, '30662eb63726ef2ce21d22dde8c65033010458ecc2c89b8cb8d5017fe5905781');
const pixels = read(pixelsFile), ledger = read(ledgerFile);
assert.equal(pixels.status, 'PASS');
assert.equal(ledger.actualImageCount, 24);
assert.equal(ledger.remainingImageCapacity, 0);
assert.equal(ledger.permanentlyImageExhausted, true);
assert.equal(pixels.wholeCourseApproved, false);
const reviewedHashes = new Set(pixels.views.map(view => view.savedPixels.sha256));
const displays = [];
const views = [];
for (const [locale, task, directory, expected] of [
  ['zh', 'D958', 'd1816-d958-n71-approved-zh-first-text-display', pixels.inputs.zhResultSha256],
  ['en', 'D962', 'd1816-d962-n71-approved-en-first-text-display', pixels.inputs.enResultSha256],
]) {
  const resultFile = `${ticket}/tmp/${directory}/result.json`;
  assert.equal(bind(resultFile).sha256, expected);
  const display = read(resultFile);
  assert.equal(display.failure, null);
  assert.equal(display.records.length, 4);
  assert.equal(display.browserClosed, true);
  assert.deepEqual(display.selectedIndices, [0, 1, 7, 18, 19, 20]);
  copy(resultFile, `${evidence}/${locale}.display.original.json`);
  displays.push({ locale, task, original: bind(resultFile),
    retained: bind(`${evidence}/${locale}.display.original.json`) });
  for (const record of display.records) {
    assert.equal(record.locale, locale);
    assert(reviewedHashes.has(record.screenshot.sha256));
    assert.equal(bind(record.html.path).sha256, record.html.sha256);
    assert.equal(bind(record.screenshot.path).sha256, record.screenshot.sha256);
    const name = `${locale}-${record.viewport.name}-${record.segment}`;
    copy(record.html.path, `${evidence}/display/${name}.html`);
    copy(record.screenshot.path, `${evidence}/display/${name}.png`);
    views.push({ name, selectedIndices: record.selectedIndices,
      html: bind(`${evidence}/display/${name}.html`), screenshot: bind(`${evidence}/display/${name}.png`) });
  }
}
assert.equal(views.length, 8);
const aliases = [];
const nativeRoot = `${ticket}/tmp/d1816-recovery/native`;
for (const name of [
  'd961-fig-131-first-approved-sidecar-record',
  'd961-fig-132-first-approved-sidecar-record',
  'd961-fig-133-first-approved-sidecar-record',
  'd961-n71-first-partial-figure-tuple-bindings',
  'd945-explicit-ordinary-push',
]) {
  const original = `${nativeRoot}/${name}/receipt.json`;
  const receipt = read(original);
  assert.equal(receipt.cwd, repo);
  assert.equal(receipt.exitCode, 0);
  const directory = `${evidence}/native/${name}`;
  copy(original, `${directory}/receipt.original.json`);
  const streams = {};
  for (const [key, binding] of Object.entries(receipt.streams)) {
    assert.equal(bind(binding.path).sha256, binding.sha256);
    copy(binding.path, `${directory}/${key}.original.txt`);
    streams[key] = { original: binding, retained: bind(`${directory}/${key}.original.txt`) };
  }
  aliases.push({ name, original: bind(original), retained: bind(`${directory}/receipt.original.json`), streams });
}
const bindingResult = JSON.parse(fs.readFileSync(`${nativeRoot}/d961-n71-first-partial-figure-tuple-bindings/stdout.txt`, 'utf8'));
assert.equal(bindingResult.status, 'PARTIAL_THREE_FIGURE_BINDINGS_PASS');
assert.equal(bindingResult.uniqueNativeTupleChecks, 3);
assert.deepEqual(bindingResult.errors, []);
const previousPush = `${ticket}/evidence/reports/d1816-d944-n70-complete-course/actual-push.json`;
assert.equal(read(previousPush).head, 'da92c181278b23daf5ca1e2c22bfd4ab77b01bcb');
const completeFile = `${attempt}/local-stages-complete.json`;
save(completeFile, {
  task: 'D964', card, status: 'BILINGUAL_TEXT_THREE_PARTIAL_FIGURES_AND_EIGHT_BOUNDED_TEXT_VIEWS_PASS',
  originalAttempt: bind(`${attempt}/attempt.json`),
  nativeBindings: aliases.find(alias => alias.name === 'd961-n71-first-partial-figure-tuple-bindings'),
  textDisplayReview: bind(pixelsFile), finalImageLedger: bind(ledgerFile), displays, views,
  pixelPassScope: pixels.passScope, pixelLimitations: pixels.limitations,
  reviewer: { agent: '01a202e3-caf2-7712-a045-666ab1c5ff20', closed: true, actualImages: 24 },
  figures: registry.figures.map(figure => ({ id: figure.id, spec: figure.spec, svg: figure.svg,
    render: figure.render, review: figure.review, svgBytesUnchanged: true })),
  unchangedHolds: registry.holds,
  wholeCourseFinalizationNotInvoked: true, canonicalAndIndexPromotion: false,
  parentNewImages: 0, paidCalls: 0, databaseWrites: 0,
  fullCourseApproved: false, newCompleteCourses: 0, newSourcePages: 0,
});
save(`${evidence}/retained.json`, {
  task: 'D964', card, completeLocalStages: bind(completeFile), displays, views, nativeAliases: aliases,
  originalReviewEvidence: bind(pixelsFile), imageLedger: bind(ledgerFile),
  firstFailuresAndUnusedAlternativeBytesPreserved: true,
  previousN70ActualPushReceipt: bind(previousPush),
  fullCourseApproved: false, newCompleteCourses: 0, newSourcePages: 0,
  totals: { completeCourses: 153, sourcePages: 581 },
  continuousProduction: true, formalHandoff: false, scopeCompleted: false,
});
const meterFile = `${ticket}/production-meter.json`;
copy(meterFile, `${scratch}/production-meter.before.json`);
copy(`${ticket}/review.md`, `${scratch}/review.before.md`);
const meter = read(meterFile);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 153);
assert.equal(meter.currentCheckpoint.sourcePagesFinalized, 581);
const current = meter.currentResume1816;
current.D949 = { status: 'RECEIVED_ONCE_CLOSED_AT_24_IMAGES', agent: '01a202e3-caf2-7712-a045-666ab1c5ff20',
  closed: true, actualImages: 24, report: bind(pixelsFile), ledger: bind(ledgerFile), parentNewImages: 0 };
current.D957 = { status: 'EXACT_HISTORICAL_ZH_AND_CANDIDATES_FAILURES_RETAINED',
  attempt: bind(`${repo}/ssot-resources/soviet10year-textbooks/artifacts/9p/lessons/${card}/attempts/d957/attempt.json`) };
current.D959 = { status: 'THREE_AFFECTED_EN_FINDINGS_NATIVE_AND_INDEPENDENT_PASS',
  review: bind(`${reviewRoot}/affected-en-text-review.json`), parentNewImages: 0 };
current.D960 = { status: 'FIG132_ASSERTION_PASS_FIG130_NATIVE_CONTRACT_HOLD',
  review: bind(`${reviewRoot}/affected-figure132-review.json`), heldFigure130Unchanged: true, svgBytesUnchanged: true };
current.D961 = { status: 'THREE_PARTIAL_FIGURE_TUPLE_BINDINGS_PASS', complete: bind(completeFile),
  fullCourseApproved: false };
current.D964 = { status: 'SUBSTANTIVE_N71_LOCAL_STAGES_RETAINED_READY_FOR_ORDINARY_PUSH',
  report: bind(`${evidence}/retained.json`), newCompleteCourses: 0, newSourcePages: 0 };
current.D965 = { status: 'FIRST_PREVIOUSLY_COUNTED_N74_MISSING_EN_PREPARATION_PASS',
  prepared: bind(`${ticket}/tmp/d1816-d965-n74-missing-en/prepared.json`), newCompleteCourses: 0, newSourcePages: 0 };
current.D966 = { status: 'FIRST_MISSING_N74_EN_NATIVE_TEXT_LAYOUT_PASS',
  author: bind(`${ticket}/tmp/d1816-d966-n74-missing-en/authored.json`), newCompleteCourses: 0, newSourcePages: 0 };
current.D967 = { status: 'FIRST_N74_EN_SCI_ZHEN_INDEPENDENT_REVIEW_ACTIVE',
  agent: '01a20306-e1bf-7361-b698-e0bdcd27e547', initialImages: 0, maximumBatch: 8, maximumContext: 24,
  oneReviewerGlobally: true, parentNewImages: 0 };
current.currentContinuation = 'N71 exact historical ZH and first EN SCI/ZHEN with three local corrections PASS; fig131/132/133 partial native tuples and eight bounded figure-free text views PASS retained, no whole-course promotion. Fig128 missing projection/tick, fig129 hybrid paid/source and fig130 unmarked-endpoint native contract HOLD remain. D949 closed at24 actual images. N74 first missing EN prepared/authored/native PASS, D967 sole independent reviewer active; N74 already counted D019. Totals153/581 unchanged. Ordinary substantive N71 delivery next, then continue N74; no checkpoint stop, DB/paid/skill/broadtest/merge/deploy/formalhandoff.';
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
fs.appendFileSync(`${ticket}/review.md`,
  '\nD950-D964: N71 exact D020-approved ZH/source reused without author/SCI/SOURCE replay. D956 lookup failure preserved and exact historical figure bytes recovered from both evidence roots. Missing EN SCI/ZHEN first REVISE at1/2/13 resolved by three replacements only; affected native and independent PASS, all other fields/math/24paragraphs unchanged. Fig131/133 first independent SOURCE/SCI/neutral/saved640331 PASS; fig132 containment-only native and affected independent PASS with unchanged SVG. Three formal partial tuples and first unique native bindings PASS; all six draft entries retained, held128/129/130 entries unchanged. Fig128 missing rear projection/tick HOLD, fig129 hybrid paid/source glyph/tick HOLD, fig130 invisible endpoint inventory/native contract HOLD preserved without marker workaround or skill edit. FIRST eight bilingual desktop/mobile six-slot text excerpts DOM and bounded pixels PASS; full21-object drafts and all first failures/unused alternatives retained. D949 closed actual24, batches6+8+2+8, parent0newimages. No whole-course finalize/index/count promotion, totals153/581. D965/D966 N74 first missing EN preparation/25-object author/native PASS, D967 sole independent EN reviewer active; N74 already D019-counted, no restoration assumed or Chinese/source replay. Continuous production remains active.\n');
console.log(JSON.stringify({ retained: bind(`${evidence}/retained.json`), views: views.length,
  localFigures: 3, totals: { completeCourses: 153, sourcePages: 581 }, fullCourseApproved: false }));

import assert from 'node:assert/strict';
import { ticket, bind, read, save } from './n42-native.mjs';

const hashes = process.argv.slice(2);
assert.equal(hashes.length, 6);
const directory = `${ticket}/tmp/d1816-d1445-n42-first-en-review`;
const names = [`${directory}/pixel-review-part1.json`, `${directory}/image-ledger-part1.json`,
  `${directory}/pixel-review-part2.json`, `${directory}/image-ledger-part2.json`,
  `${ticket}/tmp/d1816-d1495-n42-mobile-ending-review/pixel-review.json`,
  `${ticket}/tmp/d1816-d1495-n42-mobile-ending-review/image-ledger.json`];
const inputs = names.map((name, index) => {
  const file = bind(name);
  assert.equal(file.sha256, hashes[index]);
  return file;
});
const reports = [read(inputs[0].path), read(inputs[2].path)];
const ledgers = [read(inputs[1].path), read(inputs[3].path)];
const display = bind(`${ticket}/tmp/d1816-d1447-n42-first-en-full-course-display/report.json`);
const saved = read(display.path).views.flatMap(view =>
  [view.screenshot, view.definitionScreenshot, ...view.figureScreenshots.map(row => row.image)]);
assert.equal(saved.length, 10);
const images = [];
for (const [index, ledger] of ledgers.entries()) {
  const expected = index === 0 ? 8 : 2;
  assert.equal(reports[index].status, index === 0 ? 'REVISE' : 'PASS');
  if (index === 0)
    assert.deepEqual(reports[index].findings.map(finding => finding.id), ['EN-P1']);
  assert.equal(ledger.actualImageOpens, expected);
  assert.equal(ledger.totalContextImageOpens, expected);
  assert.deepEqual(ledger.batches.map(batch => typeof batch === 'number' ? batch : batch.actualImageOpens), [expected]);
  assert.equal(ledger.reopens, 0);
  assert.equal(ledger.crops, 0);
  assert.equal(ledger.parentImages, 0);
  assert.equal(ledger.images.length, expected);
  for (const image of ledger.images) {
    const original = saved[images.length];
    assert.equal(image.path, original.path);
    assert.equal(image.sha256, original.sha256);
    assert.equal(bind(image.path).sha256, image.sha256);
    assert.equal(image.openedOnce, true);
    images.push({ ...image, order: images.length + 1, reviewerContext: index + 1 });
  }
}
assert.equal(new Set(images.map(image => image.path)).size, 10);
const endingReview = read(inputs[4].path), endingLedger = read(inputs[5].path);
assert.equal(endingReview.status, 'PASS');
assert(JSON.stringify(endingReview).includes('EN-P1'));
assert.equal(endingLedger.actualImageOpens, 2);
assert.equal(endingLedger.totalContextImageOpens, 2);
assert.deepEqual(endingLedger.batches.map(batch => typeof batch === 'number' ? batch : batch.actualImageOpens), [2]);
assert.equal(endingLedger.reopens, 0);
assert.equal(endingLedger.crops, 1);
assert.equal(endingLedger.parentImages, 0);
assert.equal(endingLedger.images.length, 2);
const affected = bind(`${ticket}/tmp/d1816-d1494-n42-mobile-ending-capture/affected-report.json`);
const captures = read(affected.path);
assert.equal(captures.status, 'AFFECTED_MOBILE_ENDING_CAPTURE_DOM_PASS_PIXELS_PENDING');
const endingImages = [captures.originalCrop.image, captures.freshEndingViewport.image];
for (const [index, image] of endingLedger.images.entries()) {
  assert.equal(image.path, endingImages[index].path);
  assert.equal(image.sha256, endingImages[index].sha256);
  assert.equal(bind(image.path).sha256, image.sha256);
  assert.equal(image.openedOnce, true);
  images.push({ ...image, order: images.length + 1, reviewerContext: 3 });
}
save(`${directory}/composed-pixel-review.json`, {
  task: 'D1490', card: 'phy9-c1-s4-n42', status: 'PASS',
  method: 'Compose the preserved first-eight REVISE, disjoint two-figure PASS and fresh affected-ending PASS; no new parent visual review.',
  reviews: [inputs[0], inputs[2], inputs[4]], imageLedgers: [inputs[1], inputs[3], inputs[5]], display, affected,
  suppliedImages: 12, independentBatches: [8, 2, 2], parentImagesOpened: 0,
  originalSavedSurfacesCoveredExactlyOnce: true,
  firstPixelRevisePreserved: true, resolvedAffectedFinding: 'EN-P1',
  originalWholeCaptureNotPromotedAsCorrect: true, unchangedHtmlEndingViewportSupplementsOriginalCapture: true,
  sourceGeometryAndScienceReviewsReplayed: false,
  browserMode: 'isolated-headless', headedAcceptanceClaimed: false,
  fullResolutionAllGlyphPixelCertificationClaimed: false, completeEnglishAccessibilityApproval: false,
  limitations: 'Each component retains its actual supplied-preview, fine-glyph, accessibility and scope qualifications.',
});
save(`${directory}/composed-image-ledger.json`, {
  task: 'D1490', actualImageOpens: 12, batches: [8, 2, 2],
  separateFreshReviewerContexts: true, contextImageOpens: [8, 2, 2],
  reopens: 0, crops: 1, parentImages: 0, componentLedgers: [inputs[1], inputs[3], inputs[5]], images,
  noImagesLoadedDuringComposition: true,
  providerInputTokens: null, providerOutputTokens: null, costUsd: null,
});
console.log(JSON.stringify({
  pixel: bind(`${directory}/composed-pixel-review.json`),
  ledger: bind(`${directory}/composed-image-ledger.json`),
}));

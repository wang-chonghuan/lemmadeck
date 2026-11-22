import assert from 'node:assert/strict';
import { ticket, bind, read, save } from './n42-native.mjs';

const hashes = process.argv.slice(2);
assert.equal(hashes.length, 4);
const directory = `${ticket}/tmp/d1816-d1402-n35-first-en-review`;
const names = ['pixel-review-part1.json', 'image-ledger-part1.json',
  'pixel-review-part2.json', 'image-ledger-part2.json'];
const inputs = names.map((name, index) => {
  const file = bind(`${directory}/${name}`);
  assert.equal(file.sha256, hashes[index]);
  return file;
});
const reports = [read(inputs[0].path), read(inputs[2].path)];
const ledgers = [read(inputs[1].path), read(inputs[3].path)];
const display = bind(`${ticket}/tmp/d1816-d1430-n35-caption-dom-display-recovery/report.json`);
const saved = read(display.path).views.flatMap(view =>
  [view.screenshot, view.definitionScreenshot, ...view.figureScreenshots.map(row => row.image)]);
assert.equal(saved.length, 10);
const images = [];
for (const [index, ledger] of ledgers.entries()) {
  const expected = index === 0 ? 8 : 2;
  assert.equal(reports[index].status, 'PASS');
  assert.equal(ledger.actualImageOpens, expected);
  assert.equal(ledger.totalContextImageOpens, expected);
  assert.deepEqual(ledger.batches, [expected]);
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
save(`${directory}/composed-pixel-review.json`, {
  task: 'D1432', card: 'phy9-c1-s3-n35', status: 'PASS',
  method: 'Composition of two independent disjoint saved-pixel PASS reports, not a new visual review.',
  reviews: [inputs[0], inputs[2]], imageLedgers: [inputs[1], inputs[3]], display,
  suppliedImages: 10, independentBatches: [8, 2], parentImagesOpened: 0,
  allSavedSurfacesCoveredExactlyOnce: true,
  originalCaptionDomFailurePreserved: true, sourceGeometryAndScienceReviewsReplayed: false,
  browserMode: 'isolated-headless', headedAcceptanceClaimed: false,
  fullResolutionAllGlyphPixelCertificationClaimed: false, completeEnglishAccessibilityApproval: false,
  limitations: 'Each component retains its actual supplied-preview, fine-glyph, accessibility and scope qualifications.',
});
save(`${directory}/composed-image-ledger.json`, {
  task: 'D1432', actualImageOpens: 10, batches: [8, 2],
  separateFreshReviewerContexts: true, contextImageOpens: [8, 2],
  reopens: 0, crops: 0, parentImages: 0, componentLedgers: [inputs[1], inputs[3]], images,
  noImagesLoadedDuringComposition: true,
  providerInputTokens: null, providerOutputTokens: null, costUsd: null,
});
console.log(JSON.stringify({
  pixel: bind(`${directory}/composed-pixel-review.json`),
  ledger: bind(`${directory}/composed-image-ledger.json`),
}));

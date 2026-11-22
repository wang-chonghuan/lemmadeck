import assert from 'node:assert/strict';
import { ticket, bind, read, save } from './n42-native.mjs';

const [pixelHash, ledgerHash] = process.argv.slice(2);
const directory = `${ticket}/tmp/d1816-d1416-n39-first-en-review`;
const affectedDirectory = `${ticket}/tmp/d1816-d1467-n39-unit-review`;
const firstPixel = bind(`${directory}/pixel-review.json`), firstLedger = bind(`${directory}/image-ledger.json`);
assert.equal(firstPixel.sha256, '69847d65b788f101c321d8a8acf7d78f99dfefb37726bef0143c283c223e86e5');
assert.equal(firstLedger.sha256, 'a3c4df549a79dfbe8fa5c2f8c0d687794da766e5ba8ff705d9ceb55cce7bf4ea');
assert.equal(read(firstPixel.path).status, 'REVISE');
const pixel = bind(`${affectedDirectory}/pixel-review.json`), ledger = bind(`${affectedDirectory}/image-ledger.json`);
assert.equal(pixel.sha256, pixelHash);
assert.equal(ledger.sha256, ledgerHash);
assert.equal(read(pixel.path).status, 'PASS');
const data = read(ledger.path), original = read(firstLedger.path);
assert.equal(original.actualImageOpens, 8);
assert.equal(data.actualImageOpens, 2);
assert.equal(data.totalContextImageOpens, 2);
assert.deepEqual(data.batches, [2]);
assert.equal(data.reopens, 0);
assert.equal(data.crops, 0);
assert.equal(data.parentImages, 0);
const display = bind(`${ticket}/tmp/d1816-d1477-n39-value-line-affected-display/affected-report.json`);
const views = read(display.path).views;
assert.equal(data.images.length, 2);
for (const [i, image] of data.images.entries()) {
  assert.equal(image.path, views[i].screenshot.path);
  assert.equal(image.sha256, views[i].screenshot.sha256);
  assert.equal(bind(image.path).sha256, image.sha256);
  assert.equal(image.openedOnce, true);
}
save(`${directory}/composed-unit-pixel-review.json`, {
  task: 'D1471', card: 'phy9-c1-s4-n39', status: 'PASS',
  method: 'First eight-image review with its local unit-layout REVISE preserved, plus two affected unit clips after value-line layout repair.',
  firstPixel, firstLedger, affectedPixel: pixel, affectedLedger: ledger, affectedDisplay: display,
  firstFinding: 'EN39-P1', firstFindingResolvedByAffectedEvidenceOnly: true,
  unaffectedFigureAndCourseCompositionEvidenceReused: true,
  originalWholePageImagesNotClaimedToHaveChangedOrPassedTheUnitFinding: true,
  sourceMathAndNumbersUnchanged: true, onlyTwoValueIntroductionColonsAndLineBreaksChanged: true,
  failedSixWordJoinerAttemptPreserved: true, retainedWordJoiners: 0,
  actualIndependentImages: 10, independentBatches: [8, 2], parentImagesOpened: 0,
  sourceGeometryAndScienceReviewsReplayed: false, browserMode: 'isolated-headless',
  headedAcceptanceClaimed: false, fullResolutionAllGlyphPixelCertificationClaimed: false,
  completeEnglishAccessibilityApproval: false,
  limitations: 'First report remains REVISE for original unit wrapping; only that finding is superseded. All original scope, source-subscript, fine-glyph and accessibility limits remain.',
});
save(`${directory}/composed-unit-image-ledger.json`, {
  task: 'D1471', actualImageOpens: 10, batches: [8, 2],
  separateFreshReviewerContexts: true, contextImageOpens: [8, 2],
  reopens: 0, crops: 0, parentImages: 0, componentLedgers: [firstLedger, ledger],
  noImagesLoadedDuringComposition: true, originalPixelRevisePreserved: true,
  images: [...original.images, ...data.images.map((image, i) => ({ ...image, order: i + 9 }))],
  providerInputTokens: null, providerOutputTokens: null, costUsd: null,
});
console.log(JSON.stringify({
  pixel: bind(`${directory}/composed-unit-pixel-review.json`),
  ledger: bind(`${directory}/composed-unit-image-ledger.json`),
}));

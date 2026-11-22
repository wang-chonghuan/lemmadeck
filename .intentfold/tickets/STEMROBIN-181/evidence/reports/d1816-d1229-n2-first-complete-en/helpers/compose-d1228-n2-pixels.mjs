import assert from 'node:assert/strict';
import { ticket, bind, read, save, copy } from './n42-native.mjs';

const [mainHash, mainLedgerHash, figureHash, figureLedgerHash, captionHash, captionLedgerHash] = process.argv.slice(2);
const main = `${ticket}/tmp/d1816-d1219-n2-first-en-independent-review`;
const figure = `${ticket}/tmp/d1816-d1227-n2-fig05-pixel-review`;
const caption = `${ticket}/tmp/d1816-d1232-n2-fig05-caption-pixel-review`;
const inputs = [
  [`${main}/pixel-main-review.json`, mainHash],
  [`${main}/image-main-ledger.json`, mainLedgerHash],
  [`${figure}/pixel-review.json`, figureHash],
  [`${figure}/image-ledger.json`, figureLedgerHash],
  [`${caption}/pixel-review.json`, captionHash],
  [`${caption}/image-ledger.json`, captionLedgerHash],
];
for (const [file, hash] of inputs) assert.equal(bind(file).sha256, hash);
assert.equal(read(inputs[0][0]).status, 'PASS');
assert.equal(read(inputs[1][0]).counts.actualimages, 8);
assert.equal(read(inputs[2][0]).apparatusVerdict, 'PASS');
assert.equal(read(inputs[2][0]).actualImages, 2);
assert.equal(read(inputs[2][0]).finding.classification, 'EVIDENCE_INCOMPLETE_NOT_ESTABLISHED_CONTENT_DEFECT');
assert.equal(read(inputs[4][0]).status, 'PASS');
assert.equal(read(inputs[4][0]).actualImages, 2);
for (const name of ['pixel.freeze.json', 'pixel-review.json', 'image-ledger.json'])
  copy(`${figure}/${name}`, `${main}/fig05-${name}`);
for (const name of ['pixel.freeze.json', 'pixel-review.json', 'image-ledger.json'])
  copy(`${caption}/${name}`, `${main}/caption-${name}`);
save(`${main}/composed-pixel-review.json`, {
  task: 'D1228', card: 'phy10-c1-s2-n2', status: 'PASS',
  method: 'Composition of two independent, disjoint saved-pixel reviews; no new visual review.',
  reviews: [bind(inputs[0][0]), bind(`${main}/fig05-pixel-review.json`), bind(`${main}/caption-pixel-review.json`)],
  fig05Composition: 'Original apparatus PASS plus first missing-caption evidence PASS; original REVISE retained.',
  imageLedgers: [bind(inputs[1][0]), bind(`${main}/fig05-image-ledger.json`), bind(`${main}/caption-image-ledger.json`)],
  suppliedImages: 12, independentBatches: [8, 2, 2], parentImagesOpened: 0,
  sourceGeometryAndScienceReviewsReplayed: false,
  browserMode: 'isolated-headless', headedAcceptanceClaimed: false,
  fullResolutionAllGlyphPixelCertificationClaimed: false, completeEnglishAccessibilityApproval: false,
  limitations: 'Each original report retains its supplied-preview, fine-glyph and scope qualifications.',
});
save(`${main}/composed-image-ledger.json`, {
  task: 'D1228', actualImages: 12, batches: [8, 2, 2], parentImagesOpened: 0,
  componentLedgers: [bind(inputs[1][0]), bind(`${main}/fig05-image-ledger.json`), bind(`${main}/caption-image-ledger.json`)],
  noImagesReopenedOrCroppedOrLoadedDuringComposition: true,
  providerInputTokens: null, providerOutputTokens: null, costUsd: null,
});
console.log(JSON.stringify({
  pixel: bind(`${main}/composed-pixel-review.json`),
  ledger: bind(`${main}/composed-image-ledger.json`),
}));

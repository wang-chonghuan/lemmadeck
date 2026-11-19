const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13/display";
const hash = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const ref = file => ({ path: file, sha256: hash(file) });
const captureFile = `${base}/n44-complete-RECOVERY1/result.json`;
const capture = read(captureFile);
assert.equal(capture.status, "pass");
assert.equal(capture.checks.length, 6);
const originals = capture.checks.flatMap(check => [check.screenshot, ...check.rightEnds.map(item => item.screenshot)]);
assert.equal(originals.length, 22);
const checked = new Map();
const reviews = [];
for (const [index, expectedOutcome] of [[1, "pass"], [2, "blocked"], [3, "needs_review"]]) {
  const folder = `${base}/n44-pixel-review/batch-${String(index).padStart(2, "0")}`;
  const request = read(`${folder}/request.json`);
  const reviewFile = `${folder}/review.json`;
  const review = read(reviewFile);
  assert.equal(review.outcome, expectedOutcome);
  assert.equal(review.checked_images.length, request.images.length);
  for (const image of review.checked_images) {
    assert.equal(hash(image.path), image.sha256);
    assert(request.images.some(item => path.resolve(item.path) === path.resolve(image.path)
      && item.sha256 === image.sha256));
    assert(!checked.has(path.resolve(image.path)));
    checked.set(path.resolve(image.path), image.sha256);
  }
  reviews.push(ref(reviewFile));
}
for (const image of originals) assert.equal(checked.get(path.resolve(image.path)), image.sha256);
assert.equal(checked.size, 22);
const partialFile = `${base}/n44-pixel-review/batch-02-recovery/review.json`;
const partial = read(partialFile);
assert.equal(partial.outcome, "blocked");
assert.deepEqual(partial.checked_images.filter(image => image.outcome === "pass").map(image => image.section), [3, 4, 5, 6, 7]);
const finalFile = `${base}/n44-pixel-review/final-affected-recovery/review.json`;
const final = read(finalFile);
assert.equal(final.outcome, "PASS");
const newCaptures = [
  `${base}/n44-mobile-gaps-FIRST/result.json`,
  `${base}/n44-right-frames-RECOVERY1/result.json`,
];
const additional = [];
for (const [index, file] of newCaptures.entries()) {
  const result = read(file);
  assert.equal(result.status, "pass");
  assert.equal(result.images.length, 7);
  const review = index === 0 ? partial : final;
  assert.equal(review.checked_images.length, 7);
  for (const image of result.images) {
    assert.equal(hash(image.path), image.sha256);
    assert(review.checked_images.some(item => path.resolve(item.path) === path.resolve(image.path)
      && item.sha256 === image.sha256));
    additional.push(image);
  }
}
const output = `${base}/n44-pixel-review/result.json`;
assert(!fs.existsSync(output));
fs.writeFileSync(output, `${JSON.stringify({
  status: "pass", recordedAt: new Date().toISOString(),
  lesson: "alg7-c4-s3-n44", command: ref(captureFile), displayCombinations: 6,
  originalReviews: reviews, originalCaptureImages: 22,
  partialRecovery: ref(partialFile), finalAffectedRecovery: ref(finalFile),
  additionalCaptures: newCaptures.map(ref), additionalCaptureImages: additional.length,
  originalImagesExactlyCovered: true, allNamedFindingsResolvedByAffectedRecovery: true,
  parentImageOpens: 1, contentMathSourceReviewsRepeated: false,
  fullBrowserCheckRepeated: false, HTMLContentFiguresAndKeysChanged: false,
  firstFailuresAndPartialBlockersPreserved: true,
  longImageResamplingAndUnseenIntermediateScrollLimitsRetained: true,
  actualNativePixelConfidenceNotBlanketCertified: true,
  databasePublicationAppIntegrationApproved: false,
}, null, 2)}\n`, { flag: "wx" });
fs.chmodSync(output, 0o444);
console.log(JSON.stringify({ status: "pass", result: ref(output), images: 36 }));

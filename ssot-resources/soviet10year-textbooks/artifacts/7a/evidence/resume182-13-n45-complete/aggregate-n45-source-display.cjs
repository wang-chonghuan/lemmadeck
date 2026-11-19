const fs = require("node:fs");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const hash = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const ref = file => ({ path: file, sha256: hash(file) });
const captureFile = `${base}/display/n45-source-FIRST/result.json`;
const capture = read(captureFile);
assert.equal(capture.status, "pass");
assert.equal(capture.checks.length, 4);
const observed = new Map();
const reviews = [];
for (const viewport of ["desktop", "mobile"]) {
  const file = `${base}/display/n45-source-pixel-review/${viewport}/review.json`;
  const review = read(file);
  assert(["pass", "scoped_pass"].includes(review.outcome));
  assert.deepEqual(review.necessary_unresolved_regions, []);
  assert.equal(review.capture.sha256, hash(captureFile));
  for (const image of review.checked_images) {
    assert.equal(hash(image.path), image.sha256);
    assert(!observed.has(image.sha256));
    observed.set(image.sha256, image.path);
  }
  reviews.push(ref(file));
}
const captured = capture.checks.flatMap(check => [
  check.screenshot, ...check.rightEnds.map(end => end.screenshot),
]);
assert.equal(captured.length, 15);
assert.equal(observed.size, 15);
for (const image of captured) {
  assert.equal(hash(image.path), image.sha256);
  assert(observed.has(image.sha256));
}
const result = {
  lesson: "alg7-c4-s3-n45",
  status: "pass",
  scope: "Existing first desktop/mobile source text and written display only.",
  capture: ref(captureFile),
  reviews,
  checkedImages: 15,
  unresolvedNecessaryRegions: [],
  observationLimitsRetainedInReviews: true,
  sourceMathAnswerFigureApprovalsReused: true,
  newImagesOrBrowserCalls: 0,
  choicesAndCompletedCourseCredit: false,
};
const output = `${base}/display/n45-source-pixel-review/result.json`;
fs.writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`, { flag: "wx" });
fs.chmodSync(output, 0o444);
console.log(JSON.stringify(result));

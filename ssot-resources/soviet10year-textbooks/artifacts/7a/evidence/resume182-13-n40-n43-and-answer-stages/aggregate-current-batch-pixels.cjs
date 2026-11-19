const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");

assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13/display/current-batch-FIRST";
const sha = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const ref = file => ({ path: file, sha256: sha(file) });
const command = `${base}/result.json`;
const receipt = read(command);
assert.equal(receipt.status, "pass");
const reviews = [];
for (const id of ["alg7-c4-s2-n40", "alg7-c4-s3-n42", "alg7-c4-s3-n43"]) {
  const file = `${base}/pixel-review/${id}/result.json`;
  const review = read(file);
  assert.equal(review.lesson, id);
  assert.equal(review.screenshots.length, 6);
  for (const screenshot of review.screenshots) {
    assert.equal(sha(screenshot.path), screenshot.sha256);
    assert(receipt.checks.some(check => path.resolve(check.screenshot.path)
      === path.resolve(screenshot.path) && check.screenshot.sha256 === screenshot.sha256));
  }
  if (id === "alg7-c4-s3-n42") {
    assert.equal(review.status, "blocked");
    const recovery = `${base}/pixel-review/${id}/recovery-result.json`;
    assert.equal(read(recovery).status, "pass");
    const capture = `${base}/scroll-ends-RECOVERY2/result.json`;
    const captured = read(capture);
    assert.equal(captured.status, "pass");
    for (const check of captured.checks) assert.equal(sha(check.screenshot.path), check.screenshot.sha256);
    reviews.push({ lesson: id, status: "pass", first: ref(file),
      affectedRecovery: ref(recovery), affectedCapture: ref(capture),
      initialEvidenceCoverageBlockerPreserved: true,
      additionalImagesInspected: 3 });
  } else {
    assert.equal(review.status, "pass");
    reviews.push({ lesson: id, status: "pass", first: ref(file), additionalImagesInspected: 0 });
  }
}
const out = `${base}/pixel-review/result.json`;
fs.writeFileSync(out, `${JSON.stringify({
  status: "pass", recordedAt: new Date().toISOString(),
  command: ref(command), completedCourseDisplayCombinations: receipt.checks.length,
  reviews, parentImagesOpened: 0, originalObserverImages: 18, additionalObserverImages: 3,
  contentMathSourceReviewsRepeated: false, batchCommandRepeated: false,
  coverageRecoveryOnly: true, firstFailuresPreserved: true,
  longImageToolResamplingLimitationRetained: true,
  databasePublicationApplicationIntegrationApproved: false,
}, null, 2)}\n`, { flag: "wx" });
fs.chmodSync(out, 0o444);
console.log(JSON.stringify({ status: "pass", result: ref(out) }));

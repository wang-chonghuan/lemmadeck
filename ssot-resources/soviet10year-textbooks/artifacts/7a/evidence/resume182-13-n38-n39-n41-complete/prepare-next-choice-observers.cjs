const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13/display";
const resultFile = `${base}/next-batch-choices-FIRST/result.json`;
const result = JSON.parse(fs.readFileSync(resultFile, "utf8"));
const sha = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
assert.equal(result.status, "pass");
assert.equal(result.checks.length, 6);
const images = result.checks.flatMap(check => {
  assert.equal(check.surface, "choices");
  return [check.screenshot, ...check.rightEnds.map(item => item.screenshot)].map(image => {
    assert.equal(sha(image.path), image.sha256);
    return { ...image, path: path.resolve(image.path), lesson: check.lesson,
      viewport: check.viewport, surface: check.surface };
  });
});
assert.equal(images.length, new Set(images.map(image => image.path)).size);
const batches = [];
for (let index = 0; index < images.length; index += 8) {
  const name = `choices-batch-${String(batches.length + 1).padStart(2, "0")}`;
  const directory = `${base}/next-batch-pixel-review/${name}`;
  fs.mkdirSync(directory);
  const file = `${directory}/request.json`;
  const batch = images.slice(index, index + 8);
  fs.writeFileSync(file, `${JSON.stringify({
    observer: name, captureResult: { path: path.resolve(resultFile), sha256: sha(resultFile) },
    images: batch, maximumImageOpens: batch.length, reopens: 0, freshContext: true,
    scope: "Visual observations of these exact first-display captures only. Existing mathematical and source approval is reused, not repeated.",
    runtimeEvidence: "The parent executed the headed command; the observer inherits its metrics and does not rerun it.",
    requiredOutput: "review.json with outcome, checked_images containing each exact path/sha256, observations, issues, image ledger, and explicit long-image/native-pixel limitations; freeze 0444.",
  }, null, 2)}\n`, { flag: "wx" });
  fs.chmodSync(file, 0o444);
  batches.push({ name, request: path.resolve(file), images: batch.length });
}
const file = `${base}/next-batch-pixel-review/choice-batches.json`;
fs.writeFileSync(file, `${JSON.stringify({ captureResult: resultFile, images: images.length, batches }, null, 2)}\n`, { flag: "wx" });
fs.chmodSync(file, 0o444);
console.log(JSON.stringify({ images: images.length, batches }));

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13/display";
const resultFile = `${base}/n44-complete-RECOVERY1/result.json`;
const result = JSON.parse(fs.readFileSync(resultFile, "utf8"));
const hash = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
assert.equal(result.status, "pass");
assert.equal(result.checks.length, 6);
const images = result.checks.flatMap(check =>
  [check.screenshot, ...check.rightEnds.map(item => item.screenshot)].map(image => {
    assert.equal(hash(image.path), image.sha256);
    return { ...image, path: path.resolve(image.path),
      lesson: check.lesson, viewport: check.viewport, surface: check.surface };
  }));
assert.equal(images.length, new Set(images.map(image => image.path)).size);
const batches = [];
for (let index = 0; index < images.length; index += 8) {
  const name = `batch-${String(batches.length + 1).padStart(2, "0")}`;
  const directory = `${base}/n44-pixel-review/${name}`;
  fs.mkdirSync(directory, { recursive: true });
  const request = `${directory}/request.json`;
  const selected = images.slice(index, index + 8);
  fs.writeFileSync(request, `${JSON.stringify({
    observer: name, captureResult: { path: path.resolve(resultFile), sha256: hash(resultFile) },
    preservedFirstFailure: "n44-complete-FIRST: renderer navigation link, zero completed surfaces and zero screenshots.",
    images: selected, maximumImageOpens: selected.length, reopens: 0, freshContext: true,
    scope: "Visual observations of these exact first-display captures only; source and mathematics approval reused.",
    runtimeEvidence: "Parent executed the headed browser command once; inherit metrics without another browser run.",
    requiredOutput: "review.json with outcome, checked_images exact paths/hashes, observations, concrete issues, image ledger and long-image/resampling/native-glyph limitations; freeze 0444.",
  }, null, 2)}\n`, { flag: "wx" });
  fs.chmodSync(request, 0o444);
  batches.push({ name, request: path.resolve(request), images: selected.length });
}
const manifest = `${base}/n44-pixel-review/batches.json`;
fs.writeFileSync(manifest, `${JSON.stringify({
  captureResult: resultFile, images: images.length, batches,
}, null, 2)}\n`, { flag: "wx" });
fs.chmodSync(manifest, 0o444);
console.log(JSON.stringify({ images: images.length, batches }));

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13/display";
const output = `${base}/next-batch-pixel-review/result.json`;
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const sha = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const ref = file => ({ path: file, sha256: sha(file) });
assert(!fs.existsSync(output));
const commands = ["next-batch-n41-source-FIRST", "next-batch-choices-FIRST"]
  .map(name => `${base}/${name}/result.json`);
const expected = new Map();
let combinations = 0;
for (const file of commands) {
  const result = read(file);
  assert.equal(result.status, "pass");
  combinations += result.checks.length;
  for (const check of result.checks) {
    for (const image of [check.screenshot, ...(check.rightEnds || []).map(item => item.screenshot)]) {
      assert.equal(sha(image.path), image.sha256);
      const key = path.resolve(image.path);
      assert(!expected.has(key));
      expected.set(key, image.sha256);
    }
  }
}
const inspected = new Set();
const reviews = [];
for (const entry of fs.readdirSync(path.dirname(output), { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const file = `${path.dirname(output)}/${entry.name}/review.json`;
  if (!fs.existsSync(file)) continue;
  const review = read(file);
  let affectedRecovery = null;
  if (entry.name === "choices-batch-02") {
    assert.equal(review.outcome, "revise", file);
    const recoveryFile = `${path.dirname(file)}/recovery-review.json`;
    const captureFile = `${base}/n39-q24-affected-RECOVERY1/result.json`;
    const recovery = read(recoveryFile);
    const capture = read(captureFile);
    assert.equal(recovery.outcome.toLowerCase(), "pass");
    assert.equal(capture.status, "pass");
    assert.equal(fs.statSync(recoveryFile).mode & 0o777, 0o444);
    assert.equal(recovery.checked_images.length, 1);
    assert.deepEqual(recovery.checked_images, capture.checked_images);
    assert.equal(sha(capture.html.path), capture.html.sha256);
    assert(read(commands[1]).checks.some(check => check.lesson === "alg7-c4-s2-n39"
      && check.viewport.width === 1440 && check.html.sha256 === capture.html.sha256));
    for (const image of recovery.checked_images) assert.equal(sha(image.path), image.sha256);
    affectedRecovery = { review: ref(recoveryFile), capture: ref(captureFile),
      additionalImages: 1, contentChanged: false, originalRevisePreserved: true };
  } else if (entry.name === "choices-batch-07") {
    assert.equal(review.outcome.toLowerCase(), "fail", file);
    const recoveryFile = `${path.dirname(file)}/recovery-review.json`;
    const recovery = read(recoveryFile);
    assert.equal(recovery.outcome.toLowerCase(), "pass");
    assert.equal(fs.statSync(recoveryFile).mode & 0o777, 0o444);
    const endpoints = [
      { batch: "choices-batch-08", index: 5 },
      { batch: "choices-batch-09", index: 24 },
    ].map(({ batch, index }) => {
      const endpointReviewFile = `${path.dirname(output)}/${batch}/review.json`;
      const endpointReview = read(endpointReviewFile);
      const endpointRecoveryFile = `${path.dirname(endpointReviewFile)}/recovery-review.json`;
      assert.equal(read(endpointRecoveryFile).outcome.toLowerCase(), "pass");
      const check = read(commands[1]).checks.find(item => item.lesson === "alg7-c4-s2-n41"
        && item.viewport.width === 390);
      const endpoint = check.rightEnds.find(item => item.index === index);
      assert(endpoint.state.atCurrentMaximum);
      assert.equal(sha(endpoint.screenshot.path), endpoint.screenshot.sha256);
      assert(endpointReview.checked_images.some(image => path.resolve(image.path)
        === path.resolve(endpoint.screenshot.path) && image.sha256 === endpoint.screenshot.sha256));
      return { index, review: ref(endpointReviewFile), recovery: ref(endpointRecoveryFile),
        screenshot: endpoint.screenshot };
    });
    affectedRecovery = { review: ref(recoveryFile), endpoints,
      additionalImages: 0, existingFirstEndpointsReused: true,
      contentChanged: false, originalFailurePreserved: true };
  } else if (["choices-batch-08", "choices-batch-09"].includes(entry.name)) {
    assert.equal(review.outcome.toLowerCase(), "fail", file);
    const recoveryFile = `${path.dirname(file)}/recovery-review.json`;
    const recovery = read(recoveryFile);
    const captureFile = `${base}/n41-affected-FIRST/result.json`;
    const capture = read(captureFile);
    assert.equal(recovery.outcome.toLowerCase(), "pass");
    assert.equal(capture.status, "pass");
    assert.equal(fs.statSync(recoveryFile).mode & 0o777, 0o444);
    const indexes = entry.name === "choices-batch-08" ? [5] : [24, 25];
    const images = capture.checks.filter(check => indexes.includes(check.index))
      .map(check => check.screenshot);
    const newlyChecked = recovery.checked_images.filter(image => images.some(expectedImage =>
      path.resolve(expectedImage.path) === path.resolve(image.path)));
    assert.equal(newlyChecked.length, images.length);
    for (const image of recovery.checked_images) {
      assert([...images, ...review.checked_images].some(expectedImage =>
        path.resolve(expectedImage.path) === path.resolve(image.path)
        && expectedImage.sha256 === image.sha256));
      assert.equal(sha(image.path), image.sha256);
    }
    assert.equal(sha(capture.html.path), capture.html.sha256);
    assert(read(commands[1]).checks.some(check => check.lesson === "alg7-c4-s2-n41"
      && check.viewport.width === 390 && check.html.sha256 === capture.html.sha256));
    affectedRecovery = { review: ref(recoveryFile), capture: ref(captureFile),
      additionalImages: images.length, originalFailurePreserved: true, contentChanged: false };
  } else {
    assert.equal(review.outcome.toLowerCase(), "pass", file);
  }
  assert.equal(fs.statSync(file).mode & 0o777, 0o444);
  assert(review.checked_images.length > 0);
  for (const image of review.checked_images) {
    const key = path.resolve(image.path);
    assert.equal(expected.get(key), image.sha256, file);
    assert.equal(sha(key), image.sha256);
    assert(!inspected.has(key), `Duplicate image-review credit: ${key}`);
    inspected.add(key);
  }
  reviews.push({ observer: entry.name, review: ref(file), images: review.checked_images.length,
    ...(affectedRecovery ? { affectedRecovery } : {}) });
}
assert.deepEqual([...inspected].sort(), [...expected.keys()].sort());
fs.writeFileSync(output, `${JSON.stringify({
  status: "pass", recordedAt: new Date().toISOString(),
  commands: commands.map(ref), newlyCheckedDisplayCombinations: combinations,
  n38AndN39PreviouslyPassedTextWrittenDisplayReused: true,
  reviews, exactCaptureImageCoverage: inspected.size, parentImagesOpened: 1,
  additionalAffectedCaptureImages: 4, firstFailuresPreserved: true,
  contentMathematicsSourceReviewsRepeated: false, commandRepeated: false,
  longImageToolResamplingAndUnseenPixelLimitationsRetained: true,
  nativePixelCertification: false,
  provenanceClarification: {
    visualJudgments: "Independent agents identified by the cited frozen reviews.",
    runtimeMetrics: "Parent-agent executed headed commands, not direct human measurements.",
    inheritedSourceMathPass: "Earlier independent source/mathematical reviews, not a human answer-key certification.",
    observerUserSuppliedPhrases: "Relay provenance only; these phrases do not establish a direct human assertion.",
  },
  databasePublicationApplicationIntegrationApproved: false,
}, null, 2)}\n`, { flag: "wx" });
fs.chmodSync(output, 0o444);
console.log(JSON.stringify({ status: "pass", images: inspected.size, result: ref(output) }));

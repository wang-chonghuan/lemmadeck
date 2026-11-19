const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13/display/next-batch-pixel-review";
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const sha = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const ref = file => ({ path: path.resolve(file), sha256: sha(file) });
const first = `${base}/choices-batch-07/review.json`;
const diagnosis = `${base}/choices-batch-07/diagnosis.json`;
const output = `${base}/choices-batch-07/recovery-review.json`;
assert.equal(read(first).outcome.toLowerCase(), "fail");
assert(!fs.existsSync(output));
const reviews = ["08", "09"].map(number => {
  const file = `${base}/choices-batch-${number}/recovery-review.json`;
  assert.equal(read(file).outcome.toLowerCase(), "pass");
  assert.equal(fs.statSync(file).mode & 0o777, 0o444);
  return ref(file);
});
fs.writeFileSync(output, `${JSON.stringify({
  outcome: "pass", kind: "parent_aggregation_of_independent_affected_reviews",
  scope: "Bind independent q6 equation ending and q25/q26 complementary left/right capture recovery. No repeated visual or mathematical review.",
  originalReview: ref(first), originalDiagnosis: ref(diagnosis), independentRecoveries: reviews,
  checked_images: [], imageLedger: { additional: 0, reopens: 0 },
  originalFailurePreserved: true, contentChanged: false,
  limits: [
    "Original long-image resampling and unseen-region limits retained.",
    "Runtime geometry is inherited parent command evidence; visual observations belong to the cited independent reviewers.",
    "No claim of whole-product, native-glyph or intermediate-scroll certification.",
  ],
}, null, 2)}\n`, { flag: "wx" });
fs.chmodSync(output, 0o444);
console.log(JSON.stringify({ status: "pass", output: ref(output) }));

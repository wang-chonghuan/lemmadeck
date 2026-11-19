const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");

const root = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
const own = path.join(root, ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n44-original-root-capture");
assert.equal(process.cwd(), root);
assert.equal(__dirname, own);
const capture = JSON.parse(fs.readFileSync(path.join(own, "capture.json"), "utf8"));
const sha = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const inputs = [
  { path: capture.image.path, sha256: capture.image.sha256 },
  { path: capture.prepare_receipt.path, sha256: capture.prepare_receipt.sha256 },
  { path: capture.preserved_previous_review.report_path, sha256: capture.preserved_previous_review.report_sha256 },
  { path: capture.preserved_previous_review.freeze_path, sha256: capture.preserved_previous_review.freeze_sha256 },
];
for (const item of inputs) assert.equal(sha(item.path), item.sha256);
const receipt = JSON.parse(fs.readFileSync(capture.prepare_receipt.path, "utf8"));
assert.equal(receipt.exit, 0);
assert.equal(receipt.cwd, root);
assert.equal(receipt.command[receipt.command.indexOf("--first") + 1], "346");
assert.equal(receipt.command[receipt.command.indexOf("--last") + 1], "346");
assert.deepEqual(capture.entries.map(item => [item.requested_n, item.entry_literal]),
  [["17", "4.123"], ["21", "4.583"], ["27", "5.196"], ["73", "8.544"]]);
assert.equal(capture.image.opens, 1);
assert.equal(capture.image_ledger.context_source_image_count_after_capture, 9);
assert.equal(capture.comparison_boundary.author_table_comparison_performed, false);

fs.writeFileSync(path.join(own, "input-hashes.sha256"),
  inputs.map(item => `${item.sha256}  ${item.path}`).join("\n") + "\n", { flag: "wx" });
const files = fs.readdirSync(own).sort().map(name => {
  const file = path.join(own, name);
  return { path: file, sha256: sha(file), bytes: fs.statSync(file).size, mode: "0444" };
});
fs.writeFileSync(path.join(own, "hashes.sha256"),
  files.map(item => `${item.sha256}  ${item.path}`).join("\n") + "\n", { flag: "wx" });
const hashFile = path.join(own, "hashes.sha256");
files.push({ path: hashFile, sha256: sha(hashFile), bytes: fs.statSync(hashFile).size, mode: "0444" });
const freezePath = path.join(own, "freeze.json");
fs.writeFileSync(freezePath, JSON.stringify({
  schema: "stemrobin182/source-only-capture-freeze@1",
  sealedAt: new Date().toISOString(),
  physicalPage: 346,
  mode: "0444",
  files,
  selfHashExcluded: true,
  imageLoads: 1,
  contextImageCount: 9,
  sourceEdits: 0,
  rootAnswersDerived: false,
  authorTableComparisonPerformed: false,
  frozenBeforeAuthorTableComparison: true,
  priorReviewUnchanged: true,
}, null, 2) + "\n", { flag: "wx" });
for (const name of fs.readdirSync(own)) fs.chmodSync(path.join(own, name), 0o444);
for (const item of inputs) assert.equal(sha(item.path), item.sha256);
for (const item of files) {
  assert.equal(sha(item.path), item.sha256);
  assert.equal(fs.statSync(item.path).mode & 0o777, 0o444);
}
assert.equal(fs.statSync(freezePath).mode & 0o777, 0o444);
console.log(JSON.stringify({
  status: "FROZEN_SOURCE_ONLY_CAPTURE",
  reportSha256: sha(path.join(own, "report.md")),
  captureSha256: sha(path.join(own, "capture.json")),
  freezeSha256: sha(freezePath),
  mode: "0444",
  newImageLoads: 1,
  totalContextImages: 9,
  previousReviewUnchanged: true,
  authorTableComparisonPerformed: false,
}, null, 2));

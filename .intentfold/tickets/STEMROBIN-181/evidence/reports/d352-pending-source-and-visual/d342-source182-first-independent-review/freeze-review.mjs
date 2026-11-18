import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";

const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const root = `${repo}/.intentfold/tickets/STEMROBIN-181/tmp/d342-source182-first-independent-review`;
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const load = (name) => JSON.parse(fs.readFileSync(path.join(root, name), "utf8"));
const report = load("report.json");
const opens = load("actual-opens.json");
const pixels = load("pixel-checks.json");
const target = path.join(root, "review-freeze.json");
assert.equal(fs.existsSync(target), false);
assert.equal(report.review_completed, true);
assert.equal(report.true_independent_review, true);
assert.equal(report.SOURCE182, "FAIL");
assert.equal(report.RAW139, "PASS");
assert.equal(report.RAW140, "PASS");
assert.equal(report.counts.actual_image_opens, 8);
assert.equal(opens.opens.length, 8);
assert.equal(new Set(opens.opens.map((open) => open.path)).size, 8);
assert.equal(opens.initial_context_image_count, 0);
assert.equal(opens.compaction_resets, 0);
assert.equal(opens.parent_image_payloads_sent, 0);

let verifiedBindings = 0;
function checkBindings(value) {
  if (!value || typeof value !== "object") return;
  if (typeof value.path === "string" && typeof value.sha256 === "string") {
    assert.equal(path.isAbsolute(value.path), true);
    assert.match(value.sha256, /^[a-f0-9]{64}$/);
    assert.equal(hash(value.path), value.sha256, `Hash changed: ${value.path}`);
    verifiedBindings += 1;
  }
  for (const child of Object.values(value)) checkBindings(child);
}
checkBindings(report);
checkBindings(opens);
checkBindings(pixels);
assert.equal(pixels.text_blocks_unchanged_from_initial, true);
assert.equal(pixels.repaired139_equals_initial139_inset8, true);
assert.equal(pixels.raw140_png_unchanged, true);
assert.equal(pixels.raw140_svg_unchanged, true);
assert.equal(pixels.candidate_freeze_files_verified.length, 23);
for (const figure of pixels.figure_checks) {
  assert.equal(figure.pixel_identical_to_source_crop, true);
  assert.equal(figure.contour_contract_pass, true);
  assert.equal(figure.semantic_verdict_from_ratio, false);
}
for (const [index, open] of opens.opens.entries()) {
  assert.equal(open.ordinal, index + 1);
}
const author = JSON.parse(fs.readFileSync(report.candidate_binding.author_freeze.path, "utf8"));
for (const file of author.files) {
  assert.equal(hash(path.resolve(repo, file.path)), file.sha256);
}

const files = fs.readdirSync(root).sort().map((name) => {
  const file = path.join(root, name);
  assert.equal(fs.statSync(file).isFile(), true);
  return { path: file, sha256: hash(file), bytes: fs.statSync(file).size };
});
const freeze = {
  schema: "source182-first-independent-review-freeze@1",
  frozen: true,
  true_independent_review: true,
  review_completed: true,
  status: "FAIL",
  SOURCE182: "FAIL",
  RAW139: "PASS",
  RAW140: "PASS",
  output_root: root,
  report: { path: path.join(root, "report.json"), sha256: hash(path.join(root, "report.json")) },
  actual_opens: { path: path.join(root, "actual-opens.json"), sha256: hash(path.join(root, "actual-opens.json")) },
  files,
  self_hash_excluded_to_avoid_circularity: true,
  verified_input_and_evidence_bindings: verifiedBindings,
  original_fail_and_helper_preflight_error_retained: true,
  candidate_listed_files_unchanged: 23,
  actual_image_opens: 8,
  parent_image_payloads: 0,
  native_prepare_finalize_vectorize_by_reviewer: 0,
  resvg_existing_svg_renders: { RAW139: 1, RAW140: 1 },
  reviewer_repairs: 0,
  canonical_promotions: 0,
  file_mode: "0444",
};
fs.writeFileSync(target, `${JSON.stringify(freeze, null, 2)}\n`, { flag: "wx" });
for (const file of [...files.map((item) => item.path), target]) fs.chmodSync(file, 0o444);
for (const file of files) assert.equal(hash(file.path), file.sha256);
console.log(JSON.stringify({
  status: { SOURCE182: "FAIL", RAW139: "PASS", RAW140: "PASS" },
  report: freeze.report,
  review_freeze: { path: target, sha256: hash(target) },
  actual_opens: freeze.actual_opens,
  own_hashed_files: files.length,
  total_new_output_files: files.length + 1,
  candidate_listed_files_unchanged: 23,
  original_evidence_files_retained: pixels.preserved_original_evidence.length,
  actual_image_opens: 8,
  parent_image_payloads: 0,
  all_own_files_mode: "0444",
}, null, 2));

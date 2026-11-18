import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const author = path.resolve(root, "../d561-source203-first-author");
const prepared = path.resolve(root, "../d567-source203-svg-and-source204-preparation");
const digest = (file) => createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const binding = (file) => ({
  path: file,
  sha256: digest(file),
  bytes: fs.statSync(file).size,
  mode: "0" + (fs.statSync(file).mode & 0o777).toString(8),
});
const writeNew = (name, value) => fs.writeFileSync(
  path.join(root, name),
  JSON.stringify(value, null, 2) + "\n",
  { flag: "wx" },
);
const verification = JSON.parse(fs.readFileSync(path.join(root, "input-verification.json"), "utf8"));
for (const expected of verification.bound_files) {
  assert.equal(digest(expected.path), expected.sha256, "Author bytes changed");
  assert.equal(binding(expected.path).mode, expected.mode, "Author mode changed");
}
assert.equal(digest(verification.author_freeze.path), verification.author_freeze.sha256);
assert.equal(digest(verification.source203_preview_manifest.path), verification.source203_preview_manifest.sha256);
for (const group of verification.preview_bindings) {
  for (const expected of Object.values(group.files)) {
    assert.equal(digest(expected.path), expected.sha256, "Preview binding changed");
  }
}
assert.equal(digest(path.join(root, "sourceinventory.json")), "ecdedaf5e2d2041acf216ac52e26204111f14046bb34eeaa88b95f80b8541897");
assert.equal(binding(path.join(root, "sourceinventory.json")).mode, "0444");

const opens = [
  ["SOURCE203 full page first", path.join(author, "work/10p/pages/0203/page.png")],
  ["first RAW fig-179", path.join(author, "work/10p/pages/0203/figures/fig-179.png")],
  ["first RAW fig-180", path.join(author, "work/10p/pages/0203/figures/fig-180.png")],
  ["first original SVG fig-179 preview separately", path.join(prepared, "previews/fig-179.native.png")],
  ["first original SVG fig-180 preview separately", path.join(prepared, "previews/fig-180.native.png")],
  ["necessary source row-21 adjudication crop", path.join(root, "row21-adjudication.png")],
  ["necessary source fig-180 lower-left label adjudication crop", path.join(root, "fig180-lower-left-label.png")],
].map(([purpose, file], index) => ({
  order: index + 1,
  purpose,
  image: binding(file),
  tool: "functions.view_image",
  detail: "original",
  visual_payload_count: 1,
  cumulative_context_images: index + 1,
  actual_observed: true,
}));
writeNew("actual-opens.json", {
  schema: "d569/source203-independent-actual-opens@1",
  initial_context_images: 0,
  sequence: opens,
  count: 7,
  batch_count: 7,
  context_count: 7,
  reopens: 0,
  grid_opens: 0,
  images_to_parent: 0,
  resets: 0,
  numerical_PNG_reads_not_visual_context_loads: true,
});
const report = JSON.parse(fs.readFileSync(path.join(root, "report-notes.json"), "utf8"));
report.completed_at = new Date().toISOString();
report.actual_opens_order = opens.map(({ order, purpose, image }) => ({ order, purpose, path: image.path, sha256: image.sha256 }));
report.evidence = {};
for (const name of [
  "sourceinventory.json",
  "sourceinventory-seal.json",
  "input-verification.json",
  "text-comparisons.json",
  "pixel-binding.json",
  "trace-outliers.json",
  "actual-opens.json",
  "row21-adjudication.receipt.json",
  "fig180-lower-left-label.receipt.json",
]) {
  fs.chmodSync(path.join(root, name), 0o444);
  report.evidence[name] = binding(path.join(root, name));
}
report.compared_candidate_files = ["page.md", "page.json", "audit.json"].map(
  (name) => binding(path.join(author, "source/10p/pages/0203", name)),
);
report.all_owned_final_files_frozen_0444_at_delivery = true;
writeNew("report.json", report);

const files = fs.readdirSync(root, { withFileTypes: true });
assert.ok(files.every((entry) => entry.isFile()), "Unexpected nested entry");
for (const entry of files) fs.chmodSync(path.join(root, entry.name), 0o444);
const frozen = files.map((entry) => binding(path.join(root, entry.name))).sort(
  (left, right) => left.path.localeCompare(right.path),
);
assert.ok(frozen.every((file) => file.mode === "0444"));
writeNew("review-freeze.json", {
  schema: "stemrobin181/source203-independent-review-freeze@1",
  frozen_at: new Date().toISOString(),
  ownership_only: root,
  files: frozen,
  all_owned_final_files_0444: true,
  sourceinventory_sealed_before_candidate_exposure: true,
  sourceinventory_sha256_unchanged: "ecdedaf5e2d2041acf216ac52e26204111f14046bb34eeaa88b95f80b8541897",
  input_binding_drift_detected: false,
  freeze_self_hash_excluded: true,
  fullcard: false,
  image_payloads_to_parent: 0,
});
fs.chmodSync(path.join(root, "review-freeze.json"), 0o444);
for (const expected of frozen) {
  assert.deepEqual(binding(expected.path), expected);
}
console.log(JSON.stringify({
  report: binding(path.join(root, "report.json")),
  review_freeze: binding(path.join(root, "review-freeze.json")),
  sourceinventory_seal: binding(path.join(root, "sourceinventory-seal.json")),
  sourceinventory: binding(path.join(root, "sourceinventory.json")),
  frozen_file_count_including_freeze: frozen.length + 1,
  gates: Object.fromEntries(Object.entries(report.gates).map(([name, value]) => [name, value.status])),
  actual_opens: 7,
  fullcard: false,
}, null, 2));

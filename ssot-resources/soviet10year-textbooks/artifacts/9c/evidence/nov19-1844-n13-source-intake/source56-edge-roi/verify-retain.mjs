import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = "/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck";
const base = path.join(root, ".tmp/stemrobin-184-resume");
const out = path.join(base, "n13-source56-edge-roi");
assert.equal(process.cwd(), root);
const started = new Date().toISOString();
const digest = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const describe = (file) => {
  const bytes = fs.readFileSync(file);
  return {
    path: file,
    bytes: bytes.length,
    sha256: digest(bytes),
    mode: (fs.statSync(file).mode & 0o777).toString(8).padStart(4, "0"),
  };
};
const checked = (file, expected, protectedFile = false) => {
  const record = describe(file);
  assert.equal(record.sha256, expected, `Hash changed: ${file}`);
  if (protectedFile) assert.equal(record.mode, "0444", `Mode changed: ${file}`);
  return { ...record, expected_sha256: expected, unchanged: true };
};
const listFiles = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap(
  (entry) => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? listFiles(file) : [file];
  },
);

for (const name of ["integrity.json", "manifest.json"]) {
  assert.equal(fs.existsSync(path.join(out, name)), false, `No overwrite: ${name}`);
}

const bundles = [
  ["n13-source56-independent", "freeze.json", "58ded64b74acd9968b63ff9b6a8df352e1f366582b96c4071e70cc93069c6f91", 7],
  ["n13-source56-comparison", "manifest.json", "9e23dedecfc4c03e71c3cc998e53fc8ab58f08aad7df6e30b4fbdd84190ac1a0", 4],
  ["n13-source56-finalize-first", "manifest.json", "15eb7e5713e5d19561d42d487b967a09fbefc20b7c07078dfc3c045080ea9327", 16],
  ["n13-source56-count-diagnosis", "manifest.json", "89a3399d67430f7b3edbb415ba690b24d5ef7056d25c82ed90721a8090de8005", 8],
];
const prior = bundles.map(([name, manifestName, hash, count]) => {
  const dir = path.join(base, name);
  const manifestFile = path.join(dir, manifestName);
  const manifestRecord = checked(manifestFile, hash, true);
  const manifest = readJson(manifestFile);
  const files = manifest.files.map((item) => {
    const record = checked(path.join(dir, item.name), item.sha256, true);
    if (item.bytes !== undefined) assert.equal(record.bytes, item.bytes);
    return record;
  });
  files.push(manifestRecord);
  assert.equal(files.length, count);
  assert.deepEqual(listFiles(dir).sort(), files.map((item) => item.path).sort());
  return { directory: dir, files_checked: count, status: "UNCHANGED_HASHES_AND_0444", files };
});
assert.equal(prior.reduce((sum, bundle) => sum + bundle.files_checked, 0), 35);

const inputManifest = readJson(path.join(base, "n13-source56-count-diagnosis/inputs.json"));
const inputs = inputManifest.inputs.map((item) => checked(path.join(root, item.path), item.sha256));
const nativeManifest = readJson(path.join(base, "n13-source56-finalize-first/manifest.json"));
const firstResult = readJson(path.join(base, "n13-source56-finalize-first/result.json"));
const canonical = firstResult.preserved_native_outputs.map((item) => {
  const snapshot = nativeManifest.files.find((file) => file.name === item.snapshot);
  assert.equal(item.sha256, snapshot.sha256);
  return checked(item.original_path, snapshot.sha256);
});
assert.equal(canonical.length, 4);

const request = readJson(path.join(out, "roi-request.json"));
const crop = readJson(path.join(out, "crop.stdout"));
const cropReceipt = readJson(path.join(out, "crop-receipt.json"));
const result = readJson(path.join(out, "result.json"));
const ledger = readJson(path.join(out, "images-ledger.json"));
const proposal = result.minimal_proposal.box_xywh;
assert.deepEqual(request.authorized_rectangle_xywh, [0, 795, 100, 115]);
assert.deepEqual(crop.rectangle_xywh, request.authorized_rectangle_xywh);
assert.deepEqual(crop.threshold128_ink_bbox_source, proposal);
assert.deepEqual(proposal, [0, 817, 49, 77]);
assert.equal(cropReceipt.exit_code, 0);
assert.equal(crop.new_visual_opens_yet, 0);
assert.equal(ledger.images_loaded, 2);
assert.equal(ledger.new_crop_visual_opens, 1);
assert.equal(result.minimal_proposal.applied, false);
const cropRecords = [
  checked(path.join(out, "roi-request.json"), result.request.sha256, true),
  checked(path.join(out, "source56-edge.png"), result.crop.sha256),
  checked(path.join(out, "crop-receipt.json"), result.crop.native_receipt_sha256),
  checked(path.join(out, "crop.stdout"), cropReceipt.stdout.sha256),
  checked(path.join(out, "crop.stderr"), cropReceipt.stderr.sha256),
];
assert.equal(cropRecords[1].bytes, 702);
assert.ok(request.recorded_before_image_open_utc < cropReceipt.started_utc);
assert.ok(cropReceipt.ended_utc <= result.recorded_after_view_by_utc);

const intersects = ([x, y, w, h], [a, b, c, d]) =>
  x < a + c && a < x + w && y < b + d && b < y + h;
const contains = ([x, y, w, h], [a, b, c, d]) =>
  a >= x && b >= y && a + c <= x + w && b + d <= y + h;
const inventory = readJson(path.join(base, "n13-source56-independent/source-inventory.json"));
const s02 = inventory.non_body_ink.find((item) => item.id === "S02");
assert.deepEqual(s02.box, result.frozen_correspondence.box_xywh);
assert.ok(contains(s02.box, proposal));
assert.ok(contains(request.authorized_rectangle_xywh, proposal));
assert.ok(contains(proposal, result.diagnostic_link.dominant_component_xywh));
assert.ok(inventory.printed_lines.every((item) => !intersects(item.box, proposal)));
assert.equal(intersects(result.frozen_correspondence.native_figure_box_xywh, proposal), false);
for (const item of result.outside_roi_and_proposal) {
  assert.equal(intersects(item.box_xywh, proposal), false);
  assert.equal(intersects(item.box_xywh, request.authorized_rectangle_xywh), false);
  assert.equal(item.origin, "UNKNOWN");
  assert.equal(item.viewed, false);
  assert.equal(item.must_remain_unmasked, true);
}

const integrity = {
  schema: "stemrobin-184/source56-edge-roi-integrity@1",
  started_utc: started,
  completed_utc: new Date().toISOString(),
  status: "CONSISTENT_UNCHANGED_PRIOR_35_AND_CANONICAL_NATIVE_COUNTER_INPUTS",
  verification_type: "Read-only byte hashing, frozen JSON geometry checks; no image decode/view or counting API",
  prior_frozen_bundles: prior,
  retained_native_and_counter_inputs: inputs,
  canonical_native_first_outputs: canonical,
  preexisting_roi_generation_records: cropRecords,
  geometry_checks: {
    proposal_inside_S02_and_authorized_roi: true,
    proposal_contains_retained_dominant_component: true,
    frozen_printed_row_intersections: 0,
    native_figure_intersection: false,
    interior_unknown_pixels_outside_roi_and_proposal: 7,
    is_visual_or_scientific_approval: false,
  },
  prior_files_chmod_or_write_operations: 0,
  current_directory_protection: "Only current new-directory files protected0444 after manifest creation",
  verifier_attempts: {
    first: { exit_code: 1, retained: "verification-first-failure.json", script_snapshot: "verify-first.mjs", failure: "Verifier-only native crop path assumption; no integrity/manifest produced" },
    corrected: { status: "CONSISTENT", change: "Use retained first result original_path fields; no source/count/finalizer retry" },
  },
  actual_first_finalize_failure_preserved: { exit_code: 1, printed: 21, logical: 20 },
  finalizer_counter_API_or_downstream_runs: 0,
  cumulative_visual_images: "2/4",
};
fs.writeFileSync(path.join(out, "integrity.json"), JSON.stringify(integrity, null, 2) + "\n", { flag: "wx" });

const manifestFiles = listFiles(out).sort().map((file) => {
  const record = describe(file);
  return {
    name: path.relative(out, file),
    bytes: record.bytes,
    sha256: record.sha256,
    protection: "0444",
  };
});
const manifest = {
  schema: "stemrobin-184/source56-edge-roi-manifest@1",
  ticket: "STEMROBIN-184B",
  directory: out,
  recorded_utc: new Date().toISOString(),
  status: result.status,
  files: manifestFiles,
  listed_bytes_excluding_this_manifest: manifestFiles.reduce((sum, file) => sum + file.bytes, 0),
  self: { name: "manifest.json", protection: "0444", sha256: "Returned in text, not embedded circularly" },
  local_nontext_ownership: "SUPPORTED within sole authorized ROI",
  unapplied_minimal_proposal: result.minimal_proposal,
  prior_35_original_hashes_and_0444_verified: true,
  canonical_native_first_outputs_and_counter_inputs_unchanged: true,
  native_crop_receipt: "crop-receipt.json",
  cumulative_images: "2/4",
  unknowns_unchanged: result.unknowns_unchanged,
  verdict_scope: result.verdict_scope,
  stop_for_parent_intake: true,
};
fs.writeFileSync(path.join(out, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n", { flag: "wx" });

for (const file of listFiles(out)) fs.chmodSync(file, 0o444);
for (const file of manifestFiles) checked(path.join(out, file.name), file.sha256, true);
const retained = listFiles(out).sort().map(describe);
assert.equal(retained.length, manifestFiles.length + 1);
assert.ok(retained.every((item) => item.mode === "0444"));
for (const bundle of prior) {
  for (const item of bundle.files) checked(item.path, item.expected_sha256, true);
}
for (const item of [...inputs, ...canonical]) checked(item.path, item.expected_sha256);
console.log(JSON.stringify({
  status: integrity.status,
  directory: out,
  files: retained.length,
  total_bytes: retained.reduce((sum, item) => sum + item.bytes, 0),
  retained,
  prior_frozen_files_verified_unchanged_0444: 35,
  proposed_box_xywh: proposal,
  actual_exclusions_or_retries: 0,
  cumulative_images: "2/4",
  stop_for_parent_intake: true,
}, null, 2));

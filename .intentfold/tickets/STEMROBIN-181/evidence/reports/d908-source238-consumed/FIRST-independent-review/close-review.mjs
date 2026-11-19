import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const output = path.join(root, ".intentfold/tickets/STEMROBIN-181/tmp/d897-source238-first-independent-review");
const prefix = ".intentfold/tickets/STEMROBIN-181/tmp/";
const author = path.join(root, prefix, "d890-source238-first-author");
const prepared = path.join(root, prefix, "d889-source238-first-preparation/work/10p/pages/0238");
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const json = (name) => JSON.parse(readFileSync(path.join(output, name), "utf8"));
const closingPath = path.join(output, "closing-verification.json");
if (existsSync(closingPath)) throw new Error("Closing verification already exists; no repeated checks");

const inventory = json("frozen-source-inventory.json");
const freeze = json("freeze-receipt.json");
const exposure = json("candidate-read-once-bindings.json");
const review = json("review.json");
const checks = [];
const checkHash = (file, expected, purpose) => {
  const actual = sha256(readFileSync(file));
  checks.push({ path: file, expected_sha256: expected, actual_sha256: actual, purpose, pass: actual === expected });
  assert.equal(actual, expected, `${purpose}: ${file}`);
};

checkHash(inventory.source.path, inventory.source.sha256, "Original source still matches inspected pixels");
checkHash(path.join(output, "frozen-source-inventory.json"), freeze.inventory_sha256, "Independent inventory remains frozen");
checkHash(path.join(output, "first-observations.md"), freeze.first_observations_sha256, "FIRST observations and failure record unchanged");
for (const [name, hash] of Object.entries(freeze.crop_sha256)) {
  checkHash(path.join(output, name), hash, "Inspected original-pixel crop unchanged; bytes hashed, image not reopened");
}
for (const file of exposure.files) {
  assert.equal(file.semantic_read_count, 1);
  checkHash(file.path, file.sha256, "Candidate/receipt unchanged since single semantic exposure; hash-only read");
}
const preparedHashes = {
  "page.png": "6c2550f9481134f9af013cb55a8f6fc71fc60b8127e7689a97be0d31d5914cf4",
  "page.grid.png": "0b11e3ca03b5b9e5bda4b010c782ba027c068c14068e6ba7cb517ae4f7f436b8",
  "layout.json": "a16bd04ab522d5b397d7a2b43b23fd5e6a403c6468168ebbb86485a3238ac4c5",
  "page.template.md": "eeb281797b9c83123860a9e126338833122b6337c164166fd7465ea53e8cece6",
  "prepare.0001.stdout": "80579750161fd99b1aca933f9bfe966e031ec792eec0d2862a453ce064addcf0",
  "prepare.0001.stderr": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
};
for (const [name, hash] of Object.entries(preparedHashes)) {
  if (name !== "page.png") checkHash(path.join(prepared, name), hash, "d889 prepared input hash bound by reuse receipt; no semantic inspection");
  checkHash(path.join(author, "work/10p/pages/0238", name), hash, "d890 reused preparation copy matches declared d889 bytes; no image open");
}

const byPath = new Map(exposure.files.map((file) => [file.path, file.sha256]));
assert.equal(review.candidate_binding.page_md_sha256, byPath.get(path.join(author, "first/output/page.md")));
assert.equal(review.candidate_binding.page_json_sha256, byPath.get(path.join(author, "first/output/page.json")));
assert.equal(review.candidate_binding.audit_json_sha256, byPath.get(path.join(author, "first/output/audit.json")));
assert.equal(review.first_finalize_reuse.receipt_sha256, byPath.get(path.join(author, "first/native/finalize.0001.receipt.json")));
assert.equal(review.first_finalize_reuse.stdout_sha256, byPath.get(path.join(author, "first/native/finalize.0001.stdout")));
assert.equal(review.first_finalize_reuse.stderr_sha256, byPath.get(path.join(author, "first/native/finalize.0001.stderr")));
assert.equal(inventory.rows.length, 26);
assert.equal(review.rows.length, 26);
assert.deepEqual(review.rows.map((row) => row.row), Array.from({ length: 26 }, (_, index) => index + 1));
assert.ok(review.rows.every((row) => row.status === "PASS" && row.evidence.length > 60));
assert.equal(review.structure_review.line_distribution.reduce((sum, value) => sum + value, 0), 26);
assert.equal(review.boundary_review.incoming237_exact, inventory.boundary.incoming237_supplied_tail);
assert.equal(review.boundary_review.source239_read, false);
assert.equal(review.usage.review_context_image_loads, 4);
assert.ok(review.usage.review_batch_image_loads.every((count) => count <= 8));
assert.equal(review.usage.review_context_image_loads <= 24, true);
assert.equal(review.findings.length, 0);
assert.equal(review.status, "PASS");

const closing = {
  schema: "d897/source238-closing-hash-verification@1",
  status: "PASS",
  source_verdict: "PASS",
  verification: "One hash-only closing check. No candidate text/receipt parsed again, no image loaded, no pipeline stage rerun.",
  candidate_unchanged: true,
  inventory_unchanged: true,
  source_unchanged: true,
  prepared_input_reuse_hashes_match: true,
  incoming_tail_utf8_sha256: sha256(Buffer.from(inventory.boundary.incoming237_supplied_tail, "utf8")),
  incoming_tail_hash_encoding: "UTF-8, no added newline",
  supplied_tail_condition_join_utf8_sha256: sha256(Buffer.from(`${inventory.boundary.incoming237_supplied_tail}\n${review.boundary_review.joined_first_condition}`, "utf8")),
  join_hash_encoding: "UTF-8, one LF between supplied tail and first condition, no trailing LF",
  source239_read: false,
  review_images_loaded: 4,
  substantive_row_results: 26,
  hash_checks: checks,
};
writeFileSync(closingPath, JSON.stringify(closing, null, 2) + "\n", { flag: "wx" });

const hashes = readdirSync(output).filter((name) => name !== "SHA256SUMS").sort().map((name) => {
  const file = path.join(output, name);
  return `${sha256(readFileSync(file))}  ${file}`;
});
writeFileSync(path.join(output, "SHA256SUMS"), hashes.join("\n") + "\n", { flag: "wx" });
console.log(JSON.stringify({
  status: closing.status,
  source_verdict: review.status,
  rows: review.rows.length,
  hash_checks_passed: checks.length,
  candidate_unchanged: true,
  inventory_unchanged: true,
  review_json_path: path.join(output, "review.json"),
  review_json_sha256: sha256(readFileSync(path.join(output, "review.json"))),
  inventory_sha256: freeze.inventory_sha256,
  manifest_path: path.join(output, "SHA256SUMS"),
  manifest_sha256: sha256(readFileSync(path.join(output, "SHA256SUMS"))),
}, null, 2));

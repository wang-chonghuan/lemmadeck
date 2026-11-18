import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";

const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const tmp = `${repo}/.intentfold/tickets/STEMROBIN-181/tmp`;
const out = `${tmp}/d359-source183-first-independent-review`;
const candidate = `${tmp}/d355-source183-first-vectorize`;
const initial = `${tmp}/d346-source183-first-author`;
const counter = `${tmp}/d354-source183-counting-only-repair`;
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const load = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const bound = (file) => ({ path: file, sha256: hash(file), bytes: fs.statSync(file).size });
const report = load(`${out}/report.json`);
const opens = load(`${out}/actual-opens.json`);
assert.deepEqual([report.SOURCE183, report.RAW141, report.RAW142], ["FAIL", "PASS", "PASS"]);
assert.equal(opens.history_images_before_batch, 8);
assert.equal(opens.opens.length, 8);
assert.equal(opens.cumulative_context_images, 16);
for (const [i, open] of opens.opens.entries()) {
  assert.equal(open.batch_ordinal, i + 1);
  assert.equal(open.cumulative_ordinal, 9 + i);
  assert.equal(hash(open.path), open.sha256);
}
assert.equal(new Set(opens.opens.map((open) => open.path)).size, 8);
assert.equal(hash(opens.history_binding.path), opens.history_binding.sha256);
assert.equal(hash(`${candidate}/report.json`), "41aefc7e5d0ec0f98279bc66ec3b93cfe7b1986794e22668a017d5f8bd3f9221");
assert.equal(hash(`${candidate}/author-freeze.json`), "0915f7027fac4b57447c1af126b7562c2b346fe01c174da56fe2574917974a36");
const author = load(`${candidate}/author-freeze.json`);
const files = author.files.map((file) => {
  const absolute = path.resolve(repo, file.path);
  assert.equal(hash(absolute), file.sha256);
  return bound(absolute);
});
assert.equal(files.length, 22);
const page = "source/10p/pages/0183";
assert.deepEqual(load(`${initial}/${page}/page.json`), load(`${candidate}/${page}/page.json`));
assert.equal(hash(`${initial}/${page}/page.md`), hash(`${candidate}/${page}/page.md`));
const firstAudit = load(`${initial}/${page}/audit.json`);
const audit = load(`${candidate}/${page}/audit.json`);
assert.deepEqual([firstAudit.lines_printed, firstAudit.lines_md], [25, 26]);
assert.deepEqual([audit.lines_printed, audit.lines_md], [26, 26]);
for (const number of [141, 142]) {
  const suffix = `work/10p/pages/0183/figures/fig-${number}.png`;
  assert.equal(hash(`${initial}/${suffix}`), hash(`${candidate}/${suffix}`));
}
const retained = [
  [`${initial}/report.json`, "96bac49749c788a700a05642aad4f733f84513a235a140c45cbe52d560765f6f"],
  [`${initial}/finalize-183.receipt.json`, "1f608bf01aec530c02ece16f0c000b356492d9a9f593867ec48d0d944e27cecd"],
  [`${initial}/finalize-183.stdout.txt`, "7256194d004796e610887b0fd42310b037071edaafbc1a5b2e735cef54356bfd"],
  [`${initial}/${page}/audit.json`, "70a5df20f2f5f38f5297d9754395be63a2f0e48804ba06a529de6936d021af66"],
  [`${initial}/initial-inventory.json`, "6ecf4fb024fc54f6fe6c7ee3cf039884faca6c5d26950365c816f93b5d9cfed3"],
  [`${initial}/affected-row-band-diagnosis.json`, "956db1e24beb7f05bd29c32063079682d855061a66366390c0fb7a94e9f7f1b5"],
  [`${counter}/report.json`, "447014e5dfb25fa313a4e329285edbb4eef6dd17b0a80ad56f81816b26c8ad1f"],
  [`${counter}/native/finalize-183.receipt.json`, "080fa803389395dafc7ea2fb22128a999e918160c8cdc21cc5d9195b7ffbeb5b"],
].map(([file, expected]) => {
  assert.equal(hash(file), expected);
  return bound(file);
});
assert.equal(load(`${initial}/finalize-183.receipt.json`).exit_code, 1);
const correctedReceipt = load(`${counter}/native/finalize-183.receipt.json`);
assert.equal(correctedReceipt.exitCode, 0);
const exact = {
  schema: "source183-first-independent-exact-binding@1",
  candidate_report: bound(`${candidate}/report.json`),
  candidate_author_freeze: bound(`${candidate}/author-freeze.json`),
  candidate_files_verified: files,
  source_pixel_freeze: bound(`${out}/source-pixel-freeze.json`),
  actual_opens: bound(`${out}/actual-opens.json`),
  retained_first_FAIL_and_counter_evidence: retained,
  initial_native_status: { lines_printed: 25, lines_md: 26, exit_code: 1 },
  current_native_status: { lines_printed: 26, lines_md: 26, exit_code: 0, inspected_not_executed: true },
  author_md_json_metadata_raw_pngs_unchanged: true,
  source_counting_repair_count: 1,
  source_text_repair_count: 0,
  corrected_native_receipt: bound(`${counter}/native/finalize-183.receipt.json`),
  reviewer_native_test_vectorize_raster_executions: 0,
  new_images: 8,
  historical_images: 8,
  cumulative_images: 16,
  count_reset: false,
  parent_image_payloads: 0,
  candidate_and_all_retained_files_unmodified: true,
};
const exactPath = `${out}/exact-binding.json`;
assert.equal(fs.existsSync(exactPath), false);
fs.writeFileSync(exactPath, `${JSON.stringify(exact, null, 2)}\n`, { flag: "wx" });
const ownFiles = fs.readdirSync(out).sort().map((name) => bound(`${out}/${name}`));
const freezePath = `${out}/review-freeze.json`;
assert.equal(fs.existsSync(freezePath), false);
const freeze = {
  schema: "source183-first-independent-review-freeze@1",
  frozen: true,
  true_independent_review: true,
  review_completed: true,
  status: "FAIL",
  SOURCE183: "FAIL",
  RAW141: "PASS",
  RAW142: "PASS",
  report: bound(`${out}/report.json`),
  source_pixel_freeze: bound(`${out}/source-pixel-freeze.json`),
  actual_opens: bound(`${out}/actual-opens.json`),
  exact_binding: bound(exactPath),
  files: ownFiles,
  self_hash_excluded: true,
  original_FAIL_HOLD_evidence_retained: true,
  candidate_frozen_files_unchanged: 22,
  batch_new_images: 8,
  history_images: 8,
  cumulative_images: 16,
  image_count_reset: false,
  reviewer_native_checks_tests_vectorize_rasterizations: 0,
  reviewer_repairs: 0,
  canonical_promotions: 0,
  parent_image_payloads: 0,
  n70_closure: "HOLD",
  full_card_claim: false,
  file_mode: "0444",
};
fs.writeFileSync(freezePath, `${JSON.stringify(freeze, null, 2)}\n`, { flag: "wx" });
for (const file of [...ownFiles.map((entry) => entry.path), freezePath]) fs.chmodSync(file, 0o444);
for (const file of ownFiles) assert.equal(hash(file.path), file.sha256);
console.log(JSON.stringify({
  SOURCE183: "FAIL",
  RAW141: "PASS",
  RAW142: "PASS",
  new_images: 8,
  cumulative_images: 16,
  report: bound(`${out}/report.json`),
  source_pixel_freeze: bound(`${out}/source-pixel-freeze.json`),
  actual_opens: bound(`${out}/actual-opens.json`),
  exact_binding: bound(exactPath),
  review_freeze: bound(freezePath),
  mode: "0444",
}, null, 2));

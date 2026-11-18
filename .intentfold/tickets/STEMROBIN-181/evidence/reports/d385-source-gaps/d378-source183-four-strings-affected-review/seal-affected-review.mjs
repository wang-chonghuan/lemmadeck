import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";

const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const tmp = `${repo}/.intentfold/tickets/STEMROBIN-181/tmp`;
const out = `${tmp}/d378-source183-four-strings-affected-review`;
const candidate = `${tmp}/d375-source183-first-text-repair`;
const baseline = `${tmp}/d355-source183-first-vectorize`;
const originalReview = `${tmp}/d359-source183-first-independent-review`;
const lastReview = `${tmp}/d367-source184-first-independent-review`;
const pageSuffix = "source/10p/pages/0183";
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const load = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const bound = (file) => ({ path: file, sha256: hash(file), bytes: fs.statSync(file).size });
const verify = (entry) => {
  const file = path.resolve(repo, entry.path);
  assert.equal(hash(file), entry.sha256, file);
  if (entry.bytes !== undefined) assert.equal(fs.statSync(file).size, entry.bytes);
  return bound(file);
};
const create = (name, value) => {
  const file = `${out}/${name}`;
  assert.ok(file.startsWith(`${out}/`));
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
};
assert.equal(fs.existsSync(`${out}/report.json`), false);
assert.equal(fs.existsSync(`${out}/review-freeze.json`), false);
const authority = [
  verify({ path: `${originalReview}/report.json`, sha256: "786dadcbb51156020b9b3c56ea5e47e729ffbea27f7e3601dac09a46ad129ab9" }),
  verify({ path: `${originalReview}/source-pixel-freeze.json`, sha256: "be18aa80ab513e6349367fdfe8be818a1210797cb20d578e7f87d7e5531c2206" }),
  verify({ path: `${originalReview}/exact-binding.json`, sha256: "d41a4b3fc760938552cf014cae6c635a764a8c5307a9174981a4c9c5827210ae" }),
  verify({ path: `${originalReview}/review-freeze.json`, sha256: "32cf6f8a206a7718cc876ea61b07b732161b034d45088923804bcf5b7abdb1d6" })
];
const original = load(authority[0].path);
const pixels = load(authority[1].path);
const originalFreeze = load(authority[3].path);
const retainedOriginalFiles = originalFreeze.files.map(verify);
assert.deepEqual([original.SOURCE183, original.RAW141, original.RAW142], ["FAIL", "PASS", "PASS"]);
assert.deepEqual(original.source_checks.combined_word_format_fail_rows, [1, 2, 5, 26]);
assert.equal(original.source_checks.combined_word_format_pass_rows, 22);
const historyBinding = verify({ path: `${lastReview}/actual-opens.json`, sha256: "faea55828601136fccd33a06e80118b73adbc2d88d94cee4a3c2c32b5541c8fa" });
const latestFreeze = verify({ path: `${lastReview}/review-freeze.json`, sha256: "5f1d7c06df2bbf306f5adbf3c29ee0452cc48daf3eeebd638f3b8be61d389c2a" });
const historyLedger = load(historyBinding.path);
assert.equal(historyLedger.cumulative_context_images, 24);
const candidateFreezeBinding = bound(`${candidate}/author-freeze.json`);
const candidateFreeze = load(candidateFreezeBinding.path);
assert.equal(candidateFreeze.frozen, true);
const candidateFrozenFiles = candidateFreeze.files.map(verify);
assert.equal(candidateFrozenFiles.length, 34);
const authorReportBinding = bound(`${candidate}/report.json`);
assert.ok(candidateFrozenFiles.some((entry) => entry.path === authorReportBinding.path && entry.sha256 === authorReportBinding.sha256));
const authorReport = load(authorReportBinding.path);
verify(authorReport.exact_diff);
verify(authorReport.before_bindings);
verify(authorReport.after_bindings);
verify(authorReport.native.receipt);
verify(authorReport.candidate_page_md);
verify(authorReport.candidate_page_json);
verify(authorReport.candidate_audit);
const input = load(authorReport.before_bindings.path);
assert.equal(input.candidate_root, baseline);
const reviewedAuthorityBindings = input.review_authority.map(verify);
const protectedOriginals = input.protected_files.map(verify);
const afterBindings = load(authorReport.after_bindings.path).map(verify);
const copyBindings = input.copies.map((entry) => {
  const originalBinding = verify(entry.original);
  const current = bound(entry.copy.path);
  const changed = ["source/10p/pages/0183/page.md", "source/10p/pages/0183/page.json"].includes(entry.relative);
  if (!changed) assert.equal(current.sha256, entry.copy.sha256);
  assert.equal(entry.original.sha256, entry.copy.sha256);
  return { relative: entry.relative, original: originalBinding, original_input_copy_sha256: entry.copy.sha256, current_copy: current, affected_text_file: changed };
});
const before = load(`${baseline}/${pageSuffix}/page.json`);
const after = load(`${candidate}/${pageSuffix}/page.json`);
assert.deepEqual(load(`${candidate}/before/page.json`), before);
assert.equal(hash(`${candidate}/before/page.json`), hash(`${baseline}/${pageSuffix}/page.json`));
assert.equal(hash(`${candidate}/before/page.md`), hash(`${baseline}/${pageSuffix}/page.md`));
assert.equal(hash(`${candidate}/before/audit.json`), hash(`${baseline}/${pageSuffix}/audit.json`));
const affected = [
  { pointer: "/blocks/0/lines/0", block: 0, line: 0, source_row: 1, md_line: 67, expected: "镜中那样，它们不等于相应的*物体*. **像**的位置也不同于平面" },
  { pointer: "/blocks/0/lines/1", block: 0, line: 1, source_row: 2, md_line: 68, expected: "镜成**像**的位置. 在所有弯曲面" },
  { pointer: "/blocks/1/lines/1", block: 1, line: 1, source_row: 5, md_line: 73, expected: "能象镜一样反射光的*物体*表面" },
  { pointer: "/blocks/12/lines/0", block: 12, line: 0, source_row: 26, md_line: 120, expected: "• *173* •" }
];
const normalizedSourceStyledLine = (row) => {
  let value = pixels.rows[row - 1].text.replaceAll("。", ". ");
  if (row === 26) {
    assert.equal(value, "·173·");
    value = "• 173 •";
  }
  for (const interval of pixels.typography.bold.filter((entry) => entry.row === row)) {
    const literal = interval.interval === "像 in 成像" ? "像" : interval.interval;
    assert.ok(value.includes(literal));
    value = value.replace(literal, `**${literal}**`);
  }
  for (const interval of pixels.typography.italic.filter((entry) => entry.row === row)) {
    assert.ok(value.includes(interval.interval));
    value = value.replace(interval.interval, `*${interval.interval}*`);
  }
  return value.trimEnd();
};
const beforeMD = fs.readFileSync(`${baseline}/${pageSuffix}/page.md`, "utf8").split("\n");
const afterMD = fs.readFileSync(`${candidate}/${pageSuffix}/page.md`, "utf8").split("\n");
const affectedResults = affected.map((item) => {
  const sourceExpected = normalizedSourceStyledLine(item.source_row);
  assert.equal(sourceExpected, item.expected);
  assert.equal(after.blocks[item.block].lines[item.line], sourceExpected);
  assert.equal(afterMD[item.md_line - 1], sourceExpected);
  assert.equal(beforeMD[item.md_line - 1], before.blocks[item.block].lines[item.line]);
  return {
    json_pointer: item.pointer,
    source_row: item.source_row,
    md_line: item.md_line,
    original_frozen_source_text: pixels.rows[item.source_row - 1].text,
    frozen_expected_word_and_style_string: sourceExpected,
    old_candidate: before.blocks[item.block].lines[item.line],
    current_candidate: after.blocks[item.block].lines[item.line],
    word_and_exact_emphasis_status: "PASS",
    new_pixel_observation: false
  };
});
// Recompute only the change boundary; unchanged text inherits the first review.
const recursiveDiff = (left, right, pointer = "") => {
  if (Object.is(left, right)) return [];
  if (left === null || right === null || typeof left !== "object" || typeof right !== "object" || Array.isArray(left) !== Array.isArray(right)) {
    return [{ pointer, before: left, after: right }];
  }
  const keys = [...new Set([...Object.keys(left), ...Object.keys(right)])];
  return keys.flatMap((key) => recursiveDiff(left[key], right[key], `${pointer}/${key.replaceAll("~", "~0").replaceAll("/", "~1")}`));
};
const jsonDiff = recursiveDiff(before, after);
const mdDiff = Array.from({ length: Math.max(beforeMD.length, afterMD.length) }, (_, index) => ({ line: index + 1, before: beforeMD[index], after: afterMD[index] })).filter((entry) => entry.before !== entry.after);
assert.deepEqual(jsonDiff.map((entry) => entry.pointer), affected.map((entry) => entry.pointer));
assert.deepEqual(mdDiff.map((entry) => entry.line), affected.map((entry) => entry.md_line));
const suppliedDiff = load(authorReport.exact_diff.path);
assert.deepEqual(suppliedDiff.post_native.json_diff, jsonDiff);
assert.deepEqual(suppliedDiff.post_native.md_diff, mdDiff);
assert.deepEqual(suppliedDiff.pre_native, suppliedDiff.post_native);
assert.deepEqual(suppliedDiff.unexpected_file_changes, []);
assert.deepEqual(suppliedDiff.failures, []);
assert.deepEqual(before.meta, after.meta);
const unchangedJSON = structuredClone(after);
for (const item of affected) unchangedJSON.blocks[item.block].lines[item.line] = before.blocks[item.block].lines[item.line];
assert.deepEqual(unchangedJSON, before);
const beforeNote = before.blocks.filter((block) => block.label === "footnote");
const afterNote = after.blocks.filter((block) => block.label === "footnote");
assert.deepEqual(beforeNote, afterNote);
assert.equal(afterNote.length, 1);
assert.equal(afterNote[0].lines.length, 2);
assert.equal(afterNote[0].samerow, false);
assert.equal(afterNote[0].open, false);
const flags = after.blocks.map((block, index) => ({ block_index: index, kind: block.kind, label: block.label, samerow: block.samerow, cont: block.cont, open: block.open, box: block.box }));
assert.deepEqual(flags, before.blocks.map((block, index) => ({ block_index: index, kind: block.kind, label: block.label, samerow: block.samerow, cont: block.cont, open: block.open, box: block.box })));
const assetBindings = authorReport.raw_png_svg.map((asset) => {
  const old = verify(asset.before);
  const current = verify(asset.after);
  assert.equal(old.sha256, current.sha256);
  const firstReviewBinding = load(`${originalReview}/exact-binding.json`).candidate_files_verified.find((entry) => entry.path === old.path);
  assert.ok(firstReviewBinding);
  assert.equal(firstReviewBinding.sha256, current.sha256);
  return { relative: asset.relative, original_independently_reviewed: old, current, bytes_identical: true, status: "inheritedPASS", visual_reopened: false };
});
assert.equal(assetBindings.length, 4);
const unchangedFiles = suppliedDiff.file_bindings.filter((entry) => !["source/10p/pages/0183/page.md", "source/10p/pages/0183/page.json"].includes(entry.relative)).map((entry) => {
  const old = verify(entry.before);
  const current = verify(entry.after);
  assert.equal(old.sha256, current.sha256);
  return { relative: entry.relative, before: old, after: current, bytes_identical: true };
});
const audit = load(`${candidate}/${pageSuffix}/audit.json`);
assert.deepEqual(audit, load(`${baseline}/${pageSuffix}/audit.json`));
assert.deepEqual([audit.lines_printed, audit.lines_md, audit.errors], [26, 26, []]);
const receipt = load(authorReport.native.receipt.path);
assert.deepEqual([receipt.invocation_ordinal, receipt.native_finalize_runs, receipt.exit_code, receipt.vectorize_runs, receipt.raster_runs], [1, 1, 0, 0, 0]);
verify(receipt.stdout);
verify(receipt.stderr);
verify(receipt.exact_prior_audit);
assert.equal(receipt.existing_geometry_reused_from_copied_audit, true);
const stdout = fs.readFileSync(receipt.stdout.path, "utf8");
assert.ok(stdout.includes("26 行（印刷 26）"));
assert.deepEqual(receipt.tool_bindings_before, receipt.tool_bindings_after);
assert.equal(authorReport.author_text_repair_count, 1);
assert.equal(authorReport.counting_tool_repair_count, 1);
assert.equal(authorReport.figure_repair_count_this_batch, 0);
create("actual-opens.json", {
  schema: "source183-four-strings-affected-actual-opens@1",
  actual: true,
  review_type: "zero-image affected-only textual review, not a fresh image batch",
  history_binding: historyBinding,
  history_breakdown: { SOURCE182: 8, SOURCE183_first_review: 8, SOURCE184_first_review: 8 },
  history_images_before_review: 24,
  new_images: 0,
  opens: [],
  cumulative_context_images: 24,
  image_count_reset: false,
  summary_or_compaction_count_reset: false,
  remaining_image_capacity: 0,
  native_executions: 0,
  SVG_raster_or_vectorize_executions: 0,
  parent_image_payloads: 0,
  candidate_author_19_image_history_not_used_as_reviewer_count: true
});
create("exact-binding.json", {
  schema: "source183-four-strings-affected-exact-binding@1",
  candidate_report: authorReportBinding,
  candidate_author_freeze: candidateFreezeBinding,
  candidate_frozen_files_verified: candidateFrozenFiles,
  source_reading_authority: authority,
  copied_authority_inputs_verified: reviewedAuthorityBindings,
  supplied_exactdiff: verify(authorReport.exact_diff),
  supplied_input_bindings: verify(authorReport.before_bindings),
  supplied_after_bindings: verify(authorReport.after_bindings),
  baseline_copy_bindings: copyBindings,
  current_after_bindings_verified: afterBindings,
  independently_recomputed_JSON_diff: jsonDiff,
  independently_recomputed_MD_diff: mdDiff,
  affected_only_frozen_source_results: affectedResults,
  all_other_JSON_values_and_MD_lines_unchanged: true,
  metadata_figframes_samerow_cont_open_unchanged: true,
  unchanged_block_flags: flags,
  two_line_footnote_byte_text_and_metadata_unchanged: true,
  unchanged_candidate_files: unchangedFiles,
  RAW141_RAW142_PNG_SVG: assetBindings,
  existing_native_receipt: verify(authorReport.native.receipt),
  existing_native_stdout: verify(receipt.stdout),
  native_status: { lines_printed: 26, lines_md: 26, exit_code: 0, author_invocation_count: 1, reviewer_invocation_count: 0 },
  retained_original_review_files: retainedOriginalFiles,
  protected_original_bindings_verified: protectedOriginals,
  completed_d367_review_freeze_retained: latestFreeze,
  reviewer_image_history: historyBinding,
  actual_opens: bound(`${out}/actual-opens.json`),
  new_images: 0,
  cumulative_images: 24,
  SOURCE183: "PASS",
  RAW141: "inheritedPASS",
  RAW142: "inheritedPASS",
  original_d359_FAIL_overwritten: false
});
create("report.json", {
  schema: "source183-four-strings-affected-independent-review@1",
  ticket: "STEMROBIN-181",
  review_completed: true,
  review_type: "affected-only zero-image review by the same original independent reviewer",
  status: "PASS",
  affected_status: "PASS",
  SOURCE183: "PASS",
  RAW141: "inheritedPASS",
  RAW142: "inheritedPASS",
  candidate_root: candidate,
  candidate_report: authorReportBinding,
  candidate_author_freeze: candidateFreezeBinding,
  original_d359_FAIL_retained: authority[0],
  original_d359_frozen_pixel_readings: authority[1],
  authority_is_frozen_independent_readings_not_author_interpretation: true,
  affected_findings_resolved: ["SOURCE183-GLYPH-SUBSTITUTION", "SOURCE183-EMPHASIS-OMISSIONS"],
  affected_strings: affectedResults,
  exact_affected_string_count: 4,
  restored_source_intervals: [
    { row: 1, interval: "物体", style: "italic" },
    { row: 1, interval: "像", style: "bold" },
    { row: 2, interval: "像 in 成像", style: "bold" },
    { row: 5, interval: "物体", style: "italic" },
    { row: 26, interval: "173", style: "italic" }
  ],
  restored_source_glyph: { row: 5, source: "象", candidate: "象", candidate_uses_像_instead_of_frozen_象: false },
  unchanged_scope_verification: {
    exact_JSON_changed_pointers: jsonDiff.map((entry) => entry.pointer),
    exact_MD_changed_lines: mdDiff.map((entry) => entry.line),
    all_other_text_JSON_metadata_rows_blocks_frames_flags_unchanged: true,
    two_line_footnote_unchanged: true,
    caption_samerow_flags_unchanged: true,
    RAW141_RAW142_PNG_SVG_byte_identical: true,
    audit_bytes_unchanged: true,
    unchanged_scope_semantically_rereviewed: false
  },
  composition: {
    eligible: true,
    original_unaffected_rows_status: "inheritedPASS",
    original_unaffected_distinct_rows: 22,
    affected_distinct_rows: 4,
    current_source_distinct_rows: 26,
    composition_rule: "Original22 unchanged row PASS + four frozen-reading affectedPASS + byte-identical RAW141/142 inheritedPASS = SOURCE183 PASS for this exact candidate only.",
    full_SOURCE183_PASS: true,
    new_whole_page_review: false,
    original_FAIL_report_status_remains_FAIL: true
  },
  existing_native: {
    receipt: verify(authorReport.native.receipt),
    lines_printed: 26,
    lines_md: 26,
    exit_code: 0,
    author_first_affected_finalize_invocations: 1,
    reviewer_native_executions: 0,
    receipt_support_not_semantic_proof: true
  },
  separate_repair_accounting: {
    SOURCE183_first_local_text_repair_count: 1,
    SOURCE183_prior_counting_tool_repair_count: 1,
    counting_repair_not_a_text_repair: true,
    SOURCE183_figure_repairs_this_batch: 0,
    RAW139_prior_sole_crop_repair_count_unchanged: 1,
    reviewer_repairs: 0,
    further_repair_performed_or_requested: false
  },
  scope_and_history: {
    new_images: 0,
    cumulative_context_images: 24,
    image_count_reset: false,
    reopens: 0,
    native_prepare_finalize_vectorize_raster_test_executions: 0,
    old_files_candidate_canonical_index_meter_DB_git_changes: 0,
    new_agents_workers_chats_branches_worktrees: 0,
    parent_image_payloads: 0,
    fullcard_Gate2_or_n70_closure_claimed: false,
    n70_closure: "HOLD",
    next_action: "Stop and wait for separately supplied SOURCE184 zero-image affected-review input; do not start it."
  },
  exact_binding: bound(`${out}/exact-binding.json`),
  actual_opens: bound(`${out}/actual-opens.json`),
  file_mode: "0444"
});
const ownFiles = fs.readdirSync(out).sort().map((name) => bound(`${out}/${name}`));
create("review-freeze.json", {
  schema: "source183-four-strings-affected-review-freeze@1",
  frozen: true,
  true_independent_affected_review: true,
  review_completed: true,
  status: "PASS",
  SOURCE183: "PASS",
  RAW141: "inheritedPASS",
  RAW142: "inheritedPASS",
  report: bound(`${out}/report.json`),
  exact_binding: bound(`${out}/exact-binding.json`),
  actual_opens: bound(`${out}/actual-opens.json`),
  original_source_pixel_freeze: authority[1],
  original_d359_FAIL_retained_unmodified: authority[0],
  files: ownFiles,
  self_hash_excluded: true,
  candidate_files_verified: 34,
  affected_strings: 4,
  inherited_unaffected_rows: 22,
  new_images: 0,
  cumulative_context_images: 24,
  image_count_reset: false,
  native_vectorize_raster_or_test_executions: 0,
  reviewer_repairs: 0,
  canonical_promotions: 0,
  n70_closure: "HOLD",
  fullcard_claim: false,
  file_mode: "0444",
  stop_and_wait_for_SOURCE184_affected_review: true
});
for (const file of [...ownFiles.map((entry) => entry.path), `${out}/review-freeze.json`]) {
  assert.ok(file.startsWith(`${out}/`));
  fs.chmodSync(file, 0o444);
}
for (const binding of [...ownFiles, ...candidateFrozenFiles, ...protectedOriginals, ...retainedOriginalFiles, ...authority, latestFreeze, candidateFreezeBinding]) verify(binding);
for (const name of fs.readdirSync(out)) assert.equal(fs.statSync(`${out}/${name}`).mode & 0o777, 0o444);
console.log(JSON.stringify({
  SOURCE183: "PASS",
  affected: "PASS 4/4",
  inherited_unaffected_rows: 22,
  RAW141: "inheritedPASS",
  RAW142: "inheritedPASS",
  new_images: 0,
  cumulative_context_images: 24,
  native_executions: 0,
  report: bound(`${out}/report.json`),
  exact_binding: bound(`${out}/exact-binding.json`),
  actual_opens: bound(`${out}/actual-opens.json`),
  review_freeze: bound(`${out}/review-freeze.json`),
  mode: "0444",
  n70_closure: "HOLD"
}, null, 2));

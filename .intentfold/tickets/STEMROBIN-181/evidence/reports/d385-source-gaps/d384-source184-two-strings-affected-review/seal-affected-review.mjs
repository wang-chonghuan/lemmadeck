import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";

const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const tmp = `${repo}/.intentfold/tickets/STEMROBIN-181/tmp`;
const out = `${tmp}/d384-source184-two-strings-affected-review`;
const candidate = `${tmp}/d379-source184-first-text-repair`;
const baseline = `${tmp}/d356-source184-first-author`;
const originalReview = `${tmp}/d367-source184-first-independent-review`;
const lastReview = `${tmp}/d378-source183-four-strings-affected-review`;
const pageSuffix = "source/10p/pages/0184";
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
  verify({ path: `${originalReview}/report.json`, sha256: "dec6bffb38bea7a9a4acd140dafb49050da77f3bae7e4e186bfc053400da7928" }),
  verify({ path: `${originalReview}/source-pixel-freeze.json`, sha256: "73936a39886e3c2bb09b0890abafe9274d77e2480370e049b4867fe665d94c15" }),
  verify({ path: `${originalReview}/exact-binding.json`, sha256: "40c75a1fbd51b7dfdf166eefb62c6946cab8b57c2ef24fa3628eba06a090a5b2" }),
  verify({ path: `${originalReview}/review-freeze.json`, sha256: "5f1d7c06df2bbf306f5adbf3c29ee0452cc48daf3eeebd638f3b8be61d389c2a" })
];
const original = load(authority[0].path);
const pixels = load(authority[1].path);
const originalExact = load(authority[2].path);
const retainedOriginalFiles = load(authority[3].path).files.map(verify);
assert.deepEqual([original.SOURCE184, original.RAW143, original.RAW144], ["FAIL", "PASS", "PASS"]);
assert.equal(original.source_rows.all_scoped_facts_pass_rows, 19);
assert.deepEqual(original.source_rows.row_results.filter((entry) => entry.words === "FAIL" || entry.style === "FAIL").map((entry) => entry.row), [2, 21]);
const historyBinding = verify({ path: `${lastReview}/actual-opens.json`, sha256: "3671a882d18d2fbfbf565bba839e7fa4645ecd509efe08d6dd3786463cde16ea" });
const lastFreezeBinding = verify({ path: `${lastReview}/review-freeze.json`, sha256: "1d0fab32fbea87af3555321e2235a495fdf9fd5a9de09598bc74465c2780d896" });
assert.equal(load(historyBinding.path).cumulative_context_images, 24);
const candidateFreezeBinding = bound(`${candidate}/author-freeze.json`);
const candidateFreeze = load(candidateFreezeBinding.path);
assert.equal(candidateFreeze.frozen, true);
const candidateFrozenFiles = candidateFreeze.files.map(verify);
assert.equal(candidateFrozenFiles.length, 35);
const authorReportBinding = bound(`${candidate}/report.json`);
assert.ok(candidateFrozenFiles.some((entry) => entry.path === authorReportBinding.path && entry.sha256 === authorReportBinding.sha256));
const authorReport = load(authorReportBinding.path);
for (const entry of [authorReport.exact_diff, authorReport.before_bindings, authorReport.after_bindings, authorReport.native.receipt, authorReport.candidate_page_md, authorReport.candidate_page_json, authorReport.candidate_audit]) verify(entry);
const input = load(authorReport.before_bindings.path);
assert.equal(input.candidate_root, baseline);
const copiedAuthorityBindings = input.review_authority.map(verify);
const protectedOriginals = input.protected_files.map(verify);
const afterBindings = load(authorReport.after_bindings.path).map(verify);
const changedFiles = [`${pageSuffix}/page.md`, `${pageSuffix}/page.json`];
const copyBindings = input.copies.map((entry) => {
  const old = verify(entry.original);
  const current = bound(entry.copy.path);
  const changed = changedFiles.includes(entry.relative);
  assert.equal(entry.original.sha256, entry.copy.sha256);
  if (!changed) assert.equal(current.sha256, entry.copy.sha256);
  return { relative: entry.relative, original: old, original_input_copy_sha256: entry.copy.sha256, current_copy: current, affected_text_file: changed };
});
const before = load(`${baseline}/${pageSuffix}/page.json`);
const after = load(`${candidate}/${pageSuffix}/page.json`);
for (const name of ["page.json", "page.md", "audit.json"]) {
  assert.equal(hash(`${candidate}/before/${name}`), hash(`${baseline}/${pageSuffix}/${name}`));
}
const affected = [
  { pointer: "/blocks/2/lines/0", block: 2, line: 0, source_row: 2, md_line: 73, expected: "如果光线束平行于副光轴" },
  { pointer: "/blocks/10/lines/0", block: 10, line: 0, source_row: 21, md_line: 110, expected: "• *174* •" }
];
assert.equal(pixels.rows[1].text, affected[0].expected);
assert.equal(pixels.rows[20].text, "·174·");
assert.deepEqual(pixels.typography.italic, [{ row: 21, interval: "174" }]);
const beforeMDText = fs.readFileSync(`${baseline}/${pageSuffix}/page.md`, "utf8");
const afterMDText = fs.readFileSync(`${candidate}/${pageSuffix}/page.md`, "utf8");
const beforeMD = beforeMDText.split("\n");
const afterMD = afterMDText.split("\n");
const affectedResults = affected.map((item) => {
  const sourceExpected = item.source_row === 2 ? pixels.rows[1].text : "• *174* •";
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
// Compare the complete change boundary, without rereviewing unchanged semantics.
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
const restored = structuredClone(after);
for (const item of affected) restored.blocks[item.block].lines[item.line] = before.blocks[item.block].lines[item.line];
assert.deepEqual(restored, before);
let expectedJSONBytes = fs.readFileSync(`${baseline}/${pageSuffix}/page.json`, "utf8");
for (const item of affected) {
  const oldLiteral = JSON.stringify(before.blocks[item.block].lines[item.line]);
  const newLiteral = JSON.stringify(item.expected);
  assert.equal(expectedJSONBytes.split(oldLiteral).length - 1, 1);
  expectedJSONBytes = expectedJSONBytes.replace(oldLiteral, newLiteral);
}
assert.equal(expectedJSONBytes, fs.readFileSync(`${candidate}/${pageSuffix}/page.json`, "utf8"));
const expectedMDLines = beforeMD.slice();
for (const item of affected) expectedMDLines[item.md_line - 1] = item.expected;
assert.equal(expectedMDLines.join("\n"), afterMDText);
assert.deepEqual(before.meta, after.meta);
assert.deepEqual(before.blocks[9], after.blocks[9]);
assert.deepEqual([after.blocks[9].label, after.blocks[9].lines.length, after.blocks[9].samerow, after.blocks[9].open], ["footnote", 2, false, false]);
const flags = after.blocks.map((block, index) => ({ block_index: index, kind: block.kind, label: block.label, box: block.box, samerow: block.samerow, cont: block.cont, open: block.open }));
assert.deepEqual(flags, before.blocks.map((block, index) => ({ block_index: index, kind: block.kind, label: block.label, box: block.box, samerow: block.samerow, cont: block.cont, open: block.open })));
assert.deepEqual([after.blocks[1].samerow, after.blocks[4].samerow, after.blocks[2].open, after.blocks[5].cont, after.blocks[8].open], [false, true, true, true, true]);
assert.ok(after.blocks[8].lines[1].endsWith("反射线将是"));
const assetBindings = authorReport.raw_png_svg.map((asset) => {
  const old = verify(asset.before);
  const current = verify(asset.after);
  assert.equal(old.sha256, current.sha256);
  const reviewedBinding = originalExact.candidate_files_verified.find((entry) => entry.path === old.path);
  assert.ok(reviewedBinding);
  assert.equal(reviewedBinding.sha256, current.sha256);
  return { relative: asset.relative, original_independently_reviewed: old, current, bytes_identical: true, status: "inheritedPASS", visual_reopened: false };
});
assert.equal(assetBindings.length, 4);
const unchangedFiles = suppliedDiff.file_bindings.filter((entry) => !changedFiles.includes(entry.relative)).map((entry) => {
  const old = verify(entry.before);
  const current = verify(entry.after);
  assert.equal(old.sha256, current.sha256);
  return { relative: entry.relative, before: old, after: current, bytes_identical: true };
});
const audit = load(`${candidate}/${pageSuffix}/audit.json`);
assert.equal(hash(`${candidate}/${pageSuffix}/audit.json`), hash(`${baseline}/${pageSuffix}/audit.json`));
assert.deepEqual([audit.lines_printed, audit.lines_md, audit.errors], [21, 21, []]);
const receipt = load(authorReport.native.receipt.path);
assert.deepEqual([receipt.invocation_ordinal, receipt.native_finalize_runs, receipt.exit_code, receipt.vectorize_runs, receipt.raster_runs], [1, 1, 0, 0, 0]);
verify(receipt.stdout);
verify(receipt.stderr);
verify(receipt.exact_prior_audit);
assert.equal(receipt.existing_geometry_reused_from_copied_audit, true);
assert.ok(fs.readFileSync(receipt.stdout.path, "utf8").includes("21 行（印刷 21）"));
assert.deepEqual(receipt.tool_bindings_before, receipt.tool_bindings_after);
assert.equal(authorReport.author_text_repair_count, 1);
assert.equal(authorReport.figure_repair_count_this_batch, 0);
create("actual-opens.json", {
  schema: "source184-two-strings-affected-actual-opens@1",
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
  schema: "source184-two-strings-affected-exact-binding@1",
  candidate_report: authorReportBinding,
  candidate_author_freeze: candidateFreezeBinding,
  candidate_frozen_files_verified: candidateFrozenFiles,
  source_reading_authority: authority,
  copied_authority_inputs_verified: copiedAuthorityBindings,
  supplied_exactdiff: verify(authorReport.exact_diff),
  supplied_input_bindings: verify(authorReport.before_bindings),
  supplied_after_bindings: verify(authorReport.after_bindings),
  baseline_copy_bindings: copyBindings,
  current_after_bindings_verified: afterBindings,
  independently_recomputed_JSON_diff: jsonDiff,
  independently_recomputed_MD_diff: mdDiff,
  affected_only_frozen_source_results: affectedResults,
  all_other_JSON_values_MD_lines_and_serialized_bytes_unchanged: true,
  metadata_figframes_samerow_cont_open_unchanged: true,
  unchanged_block_flags: flags,
  two_line_footnote_text_and_metadata_unchanged: true,
  unchanged_candidate_files: unchangedFiles,
  RAW143_RAW144_PNG_SVG: assetBindings,
  existing_native_receipt: verify(authorReport.native.receipt),
  existing_native_stdout: verify(receipt.stdout),
  native_status: { lines_printed: 21, lines_md: 21, exit_code: 0, author_invocation_count: 1, reviewer_invocation_count: 0 },
  retained_original_review_files: retainedOriginalFiles,
  protected_original_bindings_verified: protectedOriginals,
  completed_d378_review_freeze_retained: lastFreezeBinding,
  reviewer_image_history: historyBinding,
  actual_opens: bound(`${out}/actual-opens.json`),
  new_images: 0,
  cumulative_images: 24,
  SOURCE184: "PASS",
  RAW143: "inheritedPASS",
  RAW144: "inheritedPASS",
  original_d367_FAIL_overwritten: false
});
create("report.json", {
  schema: "source184-two-strings-affected-independent-review@1",
  ticket: "STEMROBIN-181",
  review_completed: true,
  review_type: "affected-only zero-image review by the same original independent reviewer",
  status: "PASS",
  affected_status: "PASS",
  SOURCE184: "PASS",
  RAW143: "inheritedPASS",
  RAW144: "inheritedPASS",
  candidate_root: candidate,
  candidate_report: authorReportBinding,
  candidate_author_freeze: candidateFreezeBinding,
  original_d367_FAIL_retained: authority[0],
  original_d367_frozen_pixel_readings: authority[1],
  authority_is_frozen_independent_readings_not_author_interpretation: true,
  affected_findings_resolved: ["SOURCE184-OMITTED-GLYPH", "SOURCE184-OMITTED-ITALIC-FOOTER"],
  affected_strings: affectedResults,
  exact_affected_string_count: 2,
  restored_source_glyph: { row: 2, interval: "副光轴", restored_character: "光", status: "PASS" },
  restored_source_style: { row: 21, interval: "174", style: "italic", ornaments_unchanged: true, status: "PASS" },
  unchanged_scope_verification: {
    exact_JSON_changed_pointers: jsonDiff.map((entry) => entry.pointer),
    exact_MD_changed_lines: mdDiff.map((entry) => entry.line),
    all_other_text_JSON_metadata_rows_blocks_frames_flags_and_serialized_bytes_unchanged: true,
    two_line_footnote_unchanged: true,
    caption_samerow_flags_unchanged: true,
    RAW143_RAW144_PNG_SVG_byte_identical: true,
    audit_bytes_unchanged: true,
    unchanged_scope_semantically_rereviewed: false
  },
  composition: {
    eligible: true,
    original_unaffected_rows_status: "inheritedPASS",
    original_unaffected_distinct_rows: 19,
    affected_distinct_rows: 2,
    current_source_distinct_rows: 21,
    composition_rule: "Original19 unchanged row PASS + two frozen-reading affectedPASS + byte-identical RAW143/144 inheritedPASS = SOURCE184 PASS for this exact candidate only.",
    full_SOURCE184_PASS: true,
    new_whole_page_review: false,
    original_FAIL_report_status_remains_FAIL: true
  },
  existing_native: {
    receipt: verify(authorReport.native.receipt),
    lines_printed: 21,
    lines_md: 21,
    exit_code: 0,
    author_first_affected_finalize_invocations: 1,
    reviewer_native_executions: 0,
    receipt_support_not_semantic_proof: true
  },
  continuation: {
    inherited_unchanged: true,
    internal_first_paragraph_open_cont_pair_retained: true,
    last_body_open: true,
    last_visible_words: "反射线将是",
    footnote_complete_and_not_a_body_continuation: true,
    next_page185_read: false,
    open_not_a_page_FAIL: true,
    n70_closure: "HOLD",
    fullcard_or_Gate2_PASS_claimed: false
  },
  separate_repair_accounting: {
    SOURCE184_first_local_text_repair_count: 1,
    SOURCE184_figure_repairs_this_batch: 0,
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
    n70_closure: "HOLD",
    stop_after_freeze: true
  },
  exact_binding: bound(`${out}/exact-binding.json`),
  actual_opens: bound(`${out}/actual-opens.json`),
  file_mode: "0444"
});
const ownFiles = fs.readdirSync(out).sort().map((name) => bound(`${out}/${name}`));
create("review-freeze.json", {
  schema: "source184-two-strings-affected-review-freeze@1",
  frozen: true,
  true_independent_affected_review: true,
  review_completed: true,
  status: "PASS",
  SOURCE184: "PASS",
  RAW143: "inheritedPASS",
  RAW144: "inheritedPASS",
  report: bound(`${out}/report.json`),
  exact_binding: bound(`${out}/exact-binding.json`),
  actual_opens: bound(`${out}/actual-opens.json`),
  original_source_pixel_freeze: authority[1],
  original_d367_FAIL_retained_unmodified: authority[0],
  files: ownFiles,
  self_hash_excluded: true,
  candidate_files_verified: 35,
  affected_strings: 2,
  inherited_unaffected_rows: 19,
  new_images: 0,
  cumulative_context_images: 24,
  image_count_reset: false,
  native_vectorize_raster_or_test_executions: 0,
  reviewer_repairs: 0,
  canonical_promotions: 0,
  n70_closure: "HOLD",
  fullcard_claim: false,
  file_mode: "0444",
  stop_after_freeze: true
});
for (const file of [...ownFiles.map((entry) => entry.path), `${out}/review-freeze.json`]) {
  assert.ok(file.startsWith(`${out}/`));
  fs.chmodSync(file, 0o444);
}
for (const binding of [...ownFiles, ...candidateFrozenFiles, ...protectedOriginals, ...retainedOriginalFiles, ...authority, lastFreezeBinding, candidateFreezeBinding]) verify(binding);
for (const name of fs.readdirSync(out)) assert.equal(fs.statSync(`${out}/${name}`).mode & 0o777, 0o444);
console.log(JSON.stringify({
  SOURCE184: "PASS",
  affected: "PASS 2/2",
  inherited_unaffected_rows: 19,
  RAW143: "inheritedPASS",
  RAW144: "inheritedPASS",
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

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";

const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const tmp = `${repo}/.intentfold/tickets/STEMROBIN-181/tmp`;
const out = `${tmp}/d367-source184-first-independent-review`;
const candidate = `${tmp}/d356-source184-first-author`;
const history = `${tmp}/d359-source183-first-independent-review`;
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const load = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const bound = (file) => ({ path: file, sha256: hash(file), bytes: fs.statSync(file).size });
const verify = (binding) => {
  const absolute = path.resolve(repo, binding.path);
  assert.equal(hash(absolute), binding.sha256, absolute);
  return bound(absolute);
};
const create = (name, value) => fs.writeFileSync(`${out}/${name}`, `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
assert.equal(fs.existsSync(`${out}/exact-binding.json`), false);
assert.equal(fs.existsSync(`${out}/review-freeze.json`), false);
const report = load(`${out}/report.json`);
const opens = load(`${out}/actual-opens.json`);
const pixels = load(`${out}/source-pixel-freeze.json`);
assert.deepEqual([report.SOURCE184, report.RAW143, report.RAW144], ["FAIL", "PASS", "PASS"]);
assert.equal(hash(`${out}/source-pixel-freeze.json`), report.independence.source_pixel_freeze_sha256);
assert.equal(pixels.author_text_inventory_report_content_read_before_freeze, false);
assert.deepEqual([pixels.history_images_before_batch, pixels.new_images_at_freeze, pixels.cumulative_images_at_freeze], [16, 4, 20]);
assert.deepEqual([opens.history_images_before_batch, opens.opens.length, opens.cumulative_context_images], [16, 8, 24]);
assert.equal(new Set(opens.opens.map((open) => open.path)).size, 8);
for (const [i, open] of opens.opens.entries()) {
  assert.deepEqual([open.batch_ordinal, open.cumulative_ordinal], [i + 1, i + 17]);
  verify(open);
}
assert.deepEqual(opens.opens.slice(0, 4), pixels.source_images);
const previousOpens = load(opens.history_binding.path);
verify(opens.history_binding);
assert.deepEqual([previousOpens.history_images_before_batch, previousOpens.new_batch_opens, previousOpens.cumulative_context_images], [8, 8, 16]);
verify(previousOpens.history_binding);
const priorReview = verify({ path: `${history}/review-freeze.json`, sha256: "32cf6f8a206a7718cc876ea61b07b732161b034d45088923804bcf5b7abdb1d6" });
const priorFreeze = load(priorReview.path);
const retainedPriorReviewFiles = priorFreeze.files.map(verify);
const retainedOriginalFAIL = load(`${history}/exact-binding.json`).retained_first_FAIL_and_counter_evidence.map(verify);
const reportBinding = verify({ path: `${candidate}/report.json`, sha256: report.candidate.report_sha256 });
const authorBinding = verify({ path: `${candidate}/author-freeze.json`, sha256: report.candidate.author_freeze_sha256 });
const author = load(authorBinding.path);
const candidateFiles = author.files.map(verify);
assert.equal(candidateFiles.length, 30);
assert.equal(author.author_repairs, 0);
const pageRoot = `${candidate}/source/10p/pages/0184`;
const page = load(`${pageRoot}/page.json`);
const audit = load(`${pageRoot}/audit.json`);
const mdLines = fs.readFileSync(`${pageRoot}/page.md`, "utf8").split("\n");
verify({ path: `${pageRoot}/page.md`, sha256: "6e1beae316be27f739ab2c4b91850fd6cb6d569bacc62b4a9eef2b2a0e429588" });
verify({ path: `${pageRoot}/page.json`, sha256: "060ffd8f4262232081af62bb945f8b226e5784ce7e506347dae956fc7a717a85" });
verify({ path: `${pageRoot}/audit.json`, sha256: "9554bd4d5c7ac16b2c611b5bad279dce195e304ee5f01a1ca865011d0cfd7320" });
const profile = load(`${repo}/.claude/skills/ld-s10y-lesson/profiles/soviet-cn.json`);
assert.equal(profile.sentence_period, ".");
const proseCompare = (value) => value.replaceAll("*", "").replaceAll("。", ".").replaceAll("·", "•").replace(/\s+/gu, "");
const styledCompare = (value) => value.replaceAll("。", ".").replaceAll("·", "•").replace(/\s+/gu, "");
const rowBindings = report.source_rows.row_results.map((result) => {
  const match = /^\/blocks\/(\d+)\/lines\/(\d+)$/u.exec(result.json_pointer);
  assert.ok(match);
  const candidateText = page.blocks[Number(match[1])].lines[Number(match[2])];
  const sourceRow = pixels.rows[result.row - 1];
  assert.equal(sourceRow.row, result.row);
  assert.equal(mdLines[result.md_line - 1], candidateText);
  const wordPass = proseCompare(sourceRow.text) === proseCompare(candidateText);
  assert.equal(wordPass ? "PASS" : "FAIL", result.words);
  let expectedStyledText = sourceRow.text;
  for (const interval of pixels.typography.bold.filter((entry) => entry.row === result.row)) {
    expectedStyledText = expectedStyledText.replace(interval.interval, `**${interval.interval}**`);
  }
  for (const interval of pixels.typography.italic.filter((entry) => entry.row === result.row)) {
    expectedStyledText = expectedStyledText.replace(interval.interval, `*${interval.interval}*`);
  }
  const sourceMarkers = expectedStyledText.match(/\*+/gu) || [];
  const candidateMarkers = candidateText.match(/\*+/gu) || [];
  const stylePass = JSON.stringify(sourceMarkers) === JSON.stringify(candidateMarkers);
  assert.equal(stylePass ? "PASS" : "FAIL", result.style);
  if (wordPass && stylePass) assert.equal(styledCompare(expectedStyledText), styledCompare(candidateText));
  if (result.shared_caption_md_line) {
    assert.equal(page.blocks[4].samerow, true);
    assert.equal(page.blocks[4].lines[0], sourceRow.shared_caption);
    assert.equal(mdLines[result.shared_caption_md_line - 1], sourceRow.shared_caption);
  }
  return { ...result, source_pixel_freeze_text: sourceRow.text, source_expected_style_text: expectedStyledText, candidate_text: candidateText };
});
assert.equal(rowBindings.length, 21);
assert.deepEqual(rowBindings.filter((row) => row.words === "FAIL").map((row) => row.row), [2]);
assert.deepEqual(rowBindings.filter((row) => row.style === "FAIL").map((row) => row.row), [21]);
assert.deepEqual([audit.lines_printed, audit.lines_md, page.meta.printed_lines], [21, 21, 21]);
assert.deepEqual(audit.errors, []);
assert.deepEqual([page.blocks[2].open, page.blocks[2].cont, page.blocks[5].cont], [true, false, true]);
assert.deepEqual([page.blocks[8].open, page.blocks[8].cont, page.blocks[9].label, page.blocks[9].open], [true, false, "footnote", false]);
assert.ok(page.blocks[8].lines[1].endsWith("反射线将是"));
assert.equal(page.blocks[9].lines.length, 2);
assert.equal(page.blocks[1].samerow, false);
const nativeReceipts = ["finalize", "vectorize"].map((name) => {
  const file = `${candidate}/${name}-184.receipt.json`;
  const receipt = load(file);
  assert.deepEqual([receipt.invocation_count, receipt.exit_code], [1, 0]);
  const inputSnapshot = name === "finalize"
    ? verify({ path: `${candidate}/author-input-page.md`, sha256: receipt.input_page_md.sha256 })
    : verify(receipt.input_page_md);
  verify(receipt.output_page_md);
  verify(receipt.stdout);
  verify(receipt.stderr);
  return { ...bound(file), command: receipt.command, invocation_count: 1, exit_code: 0, input_MD_snapshot: inputSnapshot, inspected_not_executed: true };
});
const rasterReceiptPath = `${out}/first-svg-raster-receipts.json`;
const rasterReceipts = load(rasterReceiptPath);
assert.equal(rasterReceipts.executions.length, 2);
const rasterTool = verify({ path: `${repo}/.claude/skills/ld-s10y-lesson/tools/svg_raster.js`, sha256: rasterReceipts.raster_tool_sha256 });
const figureBindings = rasterReceipts.executions.map((receipt, index) => {
  assert.deepEqual([receipt.invocation_count, receipt.exit_code], [1, 0]);
  const input = verify({ path: receipt.argv[1], sha256: receipt.input_sha256 });
  const raster = verify({ path: receipt.argv[2], sha256: receipt.output_sha256 });
  const raw = bound(`${candidate}/work/10p/pages/0184/figures/${receipt.figure}.png`);
  const expected = index === 0 ? [484, 319] : [468, 550];
  for (const file of [raw.path, raster.path]) {
    const header = fs.readFileSync(file).subarray(0, 24);
    assert.equal(header.toString("hex", 0, 8), "89504e470d0a1a0a");
    assert.deepEqual([header.readUInt32BE(16), header.readUInt32BE(20)], expected);
  }
  assert.deepEqual([receipt.stdout.w, receipt.stdout.h], expected);
  return { asset: `RAW${index + 143}`, raw, SVG: input, first_independent_SVG_raster: raster, status: "PASS", semantic_inventory_source: bound(`${out}/source-pixel-freeze.json`) };
});
create("exact-binding.json", {
  schema: "source184-first-independent-exact-binding@1",
  SOURCE184: "FAIL",
  RAW143: "PASS",
  RAW144: "PASS",
  candidate_report: reportBinding,
  candidate_author_freeze: authorBinding,
  candidate_files_verified: candidateFiles,
  source_pixel_freeze: bound(`${out}/source-pixel-freeze.json`),
  source_words_styles_and_row_bindings: rowBindings,
  profile_sentence_period_contract: bound(`${repo}/.claude/skills/ld-s10y-lesson/profiles/soviet-cn.json`),
  first_raster_receipts: bound(rasterReceiptPath),
  raster_tool: rasterTool,
  figure_bindings: figureBindings,
  native_receipts_inspected_not_executed: nativeReceipts,
  actual_opens: bound(`${out}/actual-opens.json`),
  prior_completed_review_freeze: priorReview,
  prior_review_files_retained_unmodified: retainedPriorReviewFiles,
  original_SOURCE183_native_FAIL_and_counter_evidence_retained_unmodified: retainedOriginalFAIL,
  history_chain: [verify(opens.history_binding), verify(previousOpens.history_binding)],
  reviewer_native_test_vectorize_executions: 0,
  first_independent_SVG_raster_executions: 2,
  reviewer_repairs: 0,
  candidate_and_retained_files_unmodified: true,
  new_images: 8,
  historical_images: 16,
  cumulative_images: 24,
  count_reset: false,
  parent_image_payloads: 0,
  n70_closure: "HOLD",
  canonical_promotions: 0,
  stop_after_freeze: true
});
const ownFiles = fs.readdirSync(out).sort().map((name) => bound(`${out}/${name}`));
create("review-freeze.json", {
  schema: "source184-first-independent-review-freeze@1",
  frozen: true,
  true_independent_review: true,
  review_completed: true,
  status: "FAIL",
  SOURCE184: "FAIL",
  RAW143: "PASS",
  RAW144: "PASS",
  report: bound(`${out}/report.json`),
  source_pixel_freeze: bound(`${out}/source-pixel-freeze.json`),
  actual_opens: bound(`${out}/actual-opens.json`),
  exact_binding: bound(`${out}/exact-binding.json`),
  first_raster_receipts: bound(rasterReceiptPath),
  files: ownFiles,
  self_hash_excluded: true,
  original_FAIL_HOLD_evidence_retained: true,
  candidate_frozen_files_unchanged: 30,
  batch_new_images: 8,
  history_images: 16,
  cumulative_images: 24,
  image_count_reset: false,
  remaining_image_capacity: 0,
  reviewer_native_checks_tests_vectorize_executions: 0,
  first_independent_SVG_raster_executions: 2,
  reviewer_repairs: 0,
  canonical_promotions: 0,
  parent_image_payloads: 0,
  n70_closure: "HOLD",
  full_card_claim: false,
  file_mode: "0444",
  stop_after_freeze: true
});
for (const file of [...ownFiles.map((entry) => entry.path), `${out}/review-freeze.json`]) {
  assert.ok(file.startsWith(`${out}/`));
  fs.chmodSync(file, 0o444);
}
for (const binding of [...ownFiles, ...candidateFiles, ...retainedPriorReviewFiles, ...retainedOriginalFAIL, priorReview, reportBinding, authorBinding]) verify(binding);
for (const name of fs.readdirSync(out)) assert.equal(fs.statSync(`${out}/${name}`).mode & 0o777, 0o444);
console.log(JSON.stringify({
  SOURCE184: "FAIL",
  RAW143: "PASS",
  RAW144: "PASS",
  new_images: 8,
  cumulative_images: 24,
  source_pixel_freeze: bound(`${out}/source-pixel-freeze.json`),
  actual_opens: bound(`${out}/actual-opens.json`),
  report: bound(`${out}/report.json`),
  exact_binding: bound(`${out}/exact-binding.json`),
  review_freeze: bound(`${out}/review-freeze.json`),
  mode: "0444",
  n70_closure: "HOLD"
}, null, 2));

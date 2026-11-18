import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const own = path.dirname(fileURLToPath(import.meta.url));
const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const expected = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d356-source184-first-author");
if (own !== expected) throw new Error("Wrong batch root.");
const sha = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const binding = (file) => ({ path: file, sha256: sha(file), bytes: fs.statSync(file).size });
const write = (name, object) => {
  const file = path.join(own, name);
  fs.writeFileSync(file, JSON.stringify(object, null, 2) + "\n", { flag: "wx" });
  return binding(file);
};
const allFiles = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const file = path.join(dir, entry.name);
  if (entry.isSymbolicLink()) throw new Error("No symlinks allowed.");
  return entry.isDirectory() ? allFiles(file) : [file];
}).sort();
const inventoryFile = path.join(own, "source-inventory.json");
if (sha(inventoryFile) !== "02cb342d83ef7a553e6b84ad313c7beaed4c7e39010474e6606afb149dc8897e") {
  throw new Error("Frozen first source inventory changed.");
}
const preparationFile = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d349-source184185-preparation/manifest.json");
if (sha(preparationFile) !== "4e24e7a7e6a655a156db33c1a020ba1c86547a0a95251d38f85e21c9ec0c8047") {
  throw new Error("Preparation manifest changed.");
}
const preparation = JSON.parse(fs.readFileSync(preparationFile, "utf8"));
const inputs = preparation.inputs.filter((input) => input.page === 184).map((input) => ({
  original_path: path.resolve(repo, input.path),
  original_sha256: input.sha256,
  copies: ["source", "work"].map((folder) => {
    const file = path.join(own, folder, "10p/pages/0184", path.basename(input.path));
    if (sha(file) !== input.sha256) throw new Error("Prepared input copy drifted.");
    return binding(file);
  }),
}));
const auditFile = path.join(own, "source/10p/pages/0184/audit.json");
const audit = JSON.parse(fs.readFileSync(auditFile, "utf8"));
const finalizeReceiptFile = path.join(own, "finalize-184.receipt.json");
const vectorizeReceiptFile = path.join(own, "vectorize-184.receipt.json");
const finalizeReceipt = JSON.parse(fs.readFileSync(finalizeReceiptFile, "utf8"));
const vectorizeReceipt = JSON.parse(fs.readFileSync(vectorizeReceiptFile, "utf8"));
if (finalizeReceipt.exit_code !== 0 || finalizeReceipt.invocation_count !== 1 ||
    vectorizeReceipt.exit_code !== 0 || vectorizeReceipt.invocation_count !== 1 ||
    audit.errors.length !== 0 || audit.lines_printed !== 21 || audit.lines_md !== 21) {
  throw new Error("Unexpected native first-run result.");
}
const opens = [
  ["source-page", "work/10p/pages/0184/page.png", null],
  ["source-grid", "work/10p/pages/0184/page.grid.png", null],
  ["source-glyph-crop", "source-glyph-crops/glyph-bottom.png", [180, 1400, 1360, 2080]],
  ["native-raw-crop", "work/10p/pages/0184/figures/fig-143.png", null],
  ["native-raw-crop", "work/10p/pages/0184/figures/fig-144.png", null],
].map(([kind, relative, crop], index) => ({
  new_batch_ordinal: index + 1,
  permanent_context_ordinal: 8 + index,
  tool: "functions.view_image",
  detail: "original",
  kind,
  ...binding(path.join(own, relative)),
  source_crop_xyxy: crop,
  first_open: true,
  actual_image_tool_open: true,
}));
const actualOpens = write("actual-opens.json", {
  schema: "source-first-author/actual-opens@1",
  ticket: "STEMROBIN-181", page: 184, batch_root: own,
  prior_permanent_image_opens: 7,
  prior_count_basis: "Human-confirmed retained count from the SOURCE183 batch; never reset after close, resume or compaction.",
  prior_ledger_reference_from_text_only: {
    path: path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d346-source183-first-author/actual-opens.json"),
    previously_returned_sha256: "68ec07bbe5e61aa35765ce1cf3ef29c3395c6e71aadcb366f169b98d3f5450d4",
    read_or_reopened_this_batch: false,
  },
  new_image_opens: opens.length,
  cumulative_permanent_image_opens: 7 + opens.length,
  new_batch_limit: 8,
  resumed_cumulative_limit: 15,
  context_limit: 24,
  opens,
  reopen_count: 0,
  source183_image_opens: 0,
  source185_image_opens: 0,
  svg_image_opens: 0,
  unlogged_image_opens: 0,
  count_resets: 0,
  child_agents: 0,
  images_returned_to_parent: 0,
  count_basis: "Every model-facing image tool open, including the one targeted source crop and the two native crops. Native byte processing is not an image tool open.",
});
const cropObservations = write("first-native-crop-observations.json", {
  schema: "source-first-author/first-native-crop-observations@1",
  ticket: "STEMROBIN-181", book: "10p", page: 184,
  source_inventory_frozen_before_authoring: binding(inventoryFile),
  role: "AUTHOR-FIRST-CROP-OBSERVATION-ONLY",
  independent_raw_pass_claimed: false,
  figures: audit.figures.map((figure, index) => ({
    id: figure.id,
    label: figure.label,
    original_rough_box_xywh: figure.from,
    first_native_exact_box_xywh: figure.box,
    first_native_components: figure.components,
    padding_px: figure.crop_padding_px ?? 12,
    native_png: binding(path.join(own, `work/10p/pages/0184/figures/${figure.id}.png`)),
    native_svg: binding(path.join(own, `work/10p/pages/0184/figures/${figure.id}.svg`)),
    new_image_open_ordinal: 4 + index,
    permanent_image_open_ordinal: 11 + index,
    observation: index === 0
      ? "First raw crop retains the full mirror outline and hatch, six incident and six reflected rays, all arrowheads, O/F/P labels, the whole axis and original small 143 ink. The separate 图 143 caption is outside the crop."
      : "First raw crop retains the full mirror, four oblique incoming rays and reflected-ray paths, all O/F/P/C/K/D labels and point dots, complete dashed focal-plane line with vertical 焦平面, and original small 144 ink. The separate 图 144 caption and adjacent prose are outside the crop.",
    observation_status: "AUTHOR-OBSERVED-INDEPENDENT-RAW-REVIEW-PENDING",
    source_words_or_diagram_labels_added: false,
    native_svg_visually_opened: false,
  })),
});
const receiptSummary = (file, receipt) => ({
  receipt: binding(file),
  exact_invocation: receipt.exact_invocation,
  executable: receipt.executable,
  argv: receipt.argv,
  cwd: receipt.cwd,
  environment_overrides: receipt.environment_overrides,
  invocation_count: receipt.invocation_count,
  exit_code: receipt.exit_code,
  stdout: receipt.stdout,
  stderr: receipt.stderr,
  tools_before: receipt.tools_before,
  tools_after: receipt.tools_after,
  tool_hashes_stable_during_command: receipt.tool_hashes_stable_during_command,
});
const report = write("report.json", {
  schema: "source-first-author/report@1",
  ticket: "STEMROBIN-181",
  role: "RESUMED-SAME-ONE-SHOT-FIRST-AUTHOR",
  workspace: repo,
  original_branch: "codex/STEMROBIN-181-textbooks",
  batch_root: own,
  book: "10p", page: 184, printed_page: 174,
  status: "NATIVE-AUTHOR-PASS-INDEPENDENT-REVIEWS-PENDING",
  frozen_at: new Date().toISOString(),
  preparation: {
    manifest: binding(preparationFile),
    retained_manifest_copy: binding(path.join(own, "preparation-manifest.json")),
    only_page184_prepared_inputs_copied: inputs,
    new_prepare_runs: 0,
    page185_input_files_read: 0,
  },
  source_inventory: binding(inventoryFile),
  source_inventory_frozen_before_page_md: true,
  author_input_page_md: binding(path.join(own, "author-input-page.md")),
  native_page_md: binding(path.join(own, "source/10p/pages/0184/page.md")),
  native_page_json: binding(path.join(own, "source/10p/pages/0184/page.json")),
  native_audit: binding(auditFile),
  native_finalize: {
    status: "AUTHOR-NATIVE-PASS",
    ...receiptSummary(finalizeReceiptFile, finalizeReceipt),
    lines_printed: audit.lines_printed,
    lines_md: audit.lines_md,
    errors: audit.errors,
    normalizations: audit.normalizations,
    unknown_chars: audit.unknown_chars,
    katex_warnings: audit.katex_warnings,
  },
  native_vectorize: {
    status: "NATIVE-CONTOUR-PASS-NOT-INDEPENDENT-VISUAL-PASS",
    ...receiptSummary(vectorizeReceiptFile, vectorizeReceipt),
    page_scope: 184,
    figures: [
      { id: "fig-143", stdout_mismatch_percent: 0.000 },
      { id: "fig-144", stdout_mismatch_percent: 0.023 },
    ],
    svg_image_opens: 0,
    independent_visual_pass: false,
  },
  first_native_crop_observations: cropObservations,
  actual_opens: actualOpens,
  prior_permanent_image_opens: 7,
  new_image_opens: opens.length,
  cumulative_permanent_image_opens: 7 + opens.length,
  rows: {
    independently_observed_body: 17,
    caption_rows: 2,
    caption_samerow: { figure: "fig-144", body_row: 4 },
    independently_observed_footnote: 2,
    footer: 1,
    distinct_printed_text_rows: 21,
  },
  continuity: {
    supplied_source183_tail_is_hint_not_truth: true,
    previous_last_body_and_footnote_reported_complete_not_open: true,
    previous_independent_review_reported_pending: true,
    previous_images_or_outputs_reopened: false,
    first_body_paragraph_cont: false,
    internal_first_paragraph_split: "Rows 1-4 open; figure 144/caption; rows 5-7 cont.",
    last_body_paragraph_open: true,
    last_visible_words: "反射线将是",
    last_footnote_complete: true,
    source185_read: false,
  },
  findings: [
    "Native finalize first run reports 11 blocks and 21/21 lines with no errors or normalizations.",
    "Both native crops retain complete source objects, all observed original labels and small 143/144 numeric ink; captions remain separate.",
    "Native page-scoped vectorize ran once and reports two contour passes; neither SVG was reopened for self-review.",
    "The final convex-mirror paragraph is visibly unfinished and remains open; its following two-row footnote is complete and independent.",
    "Author native PASS is not SOURCE PASS or independent RAW PASS. Parent retains separate source, raw and SVG review responsibility.",
  ],
  unresolved_glyphs: [],
  independent_source_text_review: "PENDING",
  independent_raw_review: "PENDING",
  independent_svg_visual_review: "PENDING",
  source_pass_claimed: false,
  independent_raw_pass_claimed: false,
  complete_card_claimed: false,
  author_repairs: 0,
  native_finalize_reruns: 0,
  native_vectorize_reruns: 0,
  self_whole_text_reviews: 0,
  counting_override_used: false,
  pipeline_modified: false,
  canonical_promoted: false,
  old_files_modified: false,
  index_or_meter_modified: false,
  database_writes: false,
  full_tests_or_build: false,
  git_writes_commits_pushes_merges_or_deploys: false,
  modern_figures_or_specs_created: false,
  paid_generation: false,
  new_agent_chat_worktree_or_branch: false,
  existing_output_bindings: allFiles(own).map(binding),
  freeze_policy: "All own regular output files chmod 0444 after final report, actual-opens, author-freeze and seal; directories remain traversable. Stop this batch after freezing.",
});
const authorFreeze = write("author-freeze.json", {
  schema: "source-first-author/author-freeze@1",
  ticket: "STEMROBIN-181", page: 184, batch_root: own,
  role: "SAME-RESUMED-FIRST-AUTHOR-NO-NEW-AGENT",
  status: "NATIVE-AUTHOR-PASS-INDEPENDENT-REVIEWS-PENDING",
  report,
  actual_opens: actualOpens,
  source_inventory: binding(inventoryFile),
  first_native_crop_observations: cropObservations,
  prior_permanent_image_opens: 7,
  new_image_opens: opens.length,
  cumulative_permanent_image_opens: 7 + opens.length,
  native_finalize_runs: 1,
  native_vectorize_runs: 1,
  author_repairs: 0,
  source_pass_claimed: false,
  independent_raw_pass_claimed: false,
  independent_svg_visual_pass_claimed: false,
  canonical_promoted: false,
  final_body_open: true,
  files: allFiles(own).map(binding),
  required_next_action: "Parent performs separate source/raw/SVG review and resolves continuity with source185 separately. No canonical promotion or complete-card claim authorized in this batch.",
});
const seal = write("freeze-seal.json", {
  schema: "source-first-author/freeze-seal@1",
  ticket: "STEMROBIN-181", page: 184, batch_root: own,
  report, author_freeze: authorFreeze, actual_opens: actualOpens,
  source_inventory: binding(inventoryFile),
  first_native_crop_observations: cropObservations,
  prior_permanent_image_opens: 7,
  new_image_opens: opens.length,
  cumulative_permanent_image_opens: 7 + opens.length,
  expected_regular_file_mode: "0444",
});
const files = allFiles(own);
for (const file of files) fs.chmodSync(file, 0o444);
for (const file of files) {
  if ((fs.statSync(file).mode & 0o777) !== 0o444) throw new Error("Output not frozen.");
}
for (const item of [report, authorFreeze, actualOpens, cropObservations, seal]) {
  if (sha(item.path) !== item.sha256) throw new Error("Frozen SHA changed.");
}
console.log(JSON.stringify({
  status: "NATIVE-AUTHOR-PASS-INDEPENDENT-REVIEWS-PENDING",
  report, author_freeze: authorFreeze, actual_opens: actualOpens, freeze_seal: seal,
  native_page_md: binding(path.join(own, "source/10p/pages/0184/page.md")),
  prior_permanent_image_opens: 7,
  new_image_opens: opens.length,
  cumulative_permanent_image_opens: 7 + opens.length,
  frozen_regular_files: files.length,
  verified_mode: "0444",
}, null, 2));

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const own = path.dirname(fileURLToPath(import.meta.url));
const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
if (own !== path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d364-source185-first-author")) {
  throw new Error("Wrong batch root.");
}
const sha = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const binding = (file) => ({ path: file, sha256: sha(file), bytes: fs.statSync(file).size });
const write = (name, object) => {
  const file = path.join(own, name);
  fs.writeFileSync(file, JSON.stringify(object, null, 2) + "\n", { flag: "wx" });
  return binding(file);
};
const filesUnder = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const file = path.join(dir, entry.name);
  if (entry.isSymbolicLink()) throw new Error("No symlinks allowed.");
  return entry.isDirectory() ? filesUnder(file) : [file];
}).sort();
const inventoryFile = path.join(own, "source-inventory.json");
if (sha(inventoryFile) !== "652ddd495336905ea776eb5623aa9b8dbe76374f7d4fffc1bdccc00e74a71db6") {
  throw new Error("Frozen source inventory drifted.");
}
const preparationFile = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d349-source184185-preparation/manifest.json");
if (sha(preparationFile) !== "4e24e7a7e6a655a156db33c1a020ba1c86547a0a95251d38f85e21c9ec0c8047") {
  throw new Error("Preparation manifest changed.");
}
const preparation = JSON.parse(fs.readFileSync(preparationFile, "utf8"));
const inputs = preparation.inputs.filter((input) => input.page === 185).map((input) => ({
  original_path: path.resolve(repo, input.path),
  original_sha256: input.sha256,
  copies: ["source", "work"].map((folder) => {
    const file = path.join(own, folder, "10p/pages/0185", path.basename(input.path));
    if (sha(file) !== input.sha256) throw new Error("Prepared input copy changed.");
    return binding(file);
  }),
}));
const auditFile = path.join(own, "source/10p/pages/0185/audit.json");
const audit = JSON.parse(fs.readFileSync(auditFile, "utf8"));
const receiptNames = [
  "finalize-185.receipt.json",
  "vectorize-185.receipt.json",
  "first-svg-preview-185.receipt.json",
];
const receipts = receiptNames.map((name) => {
  const file = path.join(own, name);
  const receipt = JSON.parse(fs.readFileSync(file, "utf8"));
  if (receipt.exit_code !== 0 || receipt.batch_invocation_count !== 1 ||
      receipt.tasks.some((task) => task.invocation_count !== 1)) {
    throw new Error("Unexpected native first-run result.");
  }
  return {
    receipt: binding(file), command: receipt.command, exit_code: receipt.exit_code,
    batch_invocation_count: receipt.batch_invocation_count,
    tasks: receipt.tasks,
    tool_hashes_stable_during_command: receipt.tool_hashes_stable_during_command,
    tools_before: receipt.tools_before, tools_after: receipt.tools_after,
  };
});
if (audit.errors.length || audit.lines_printed !== 18 || audit.lines_md !== 18 ||
    audit.figures.length !== 3 || receipts[2].tasks.length !== 3) {
  throw new Error("Unexpected retained native audit or first preview.");
}
const opens = [
  ["source-page", "work/10p/pages/0185/page.png", null],
  ["source-grid", "work/10p/pages/0185/page.grid.png", null],
  ["source-glyph-crop", "source-glyph-crops/glyph-top.png", [170, 70, 1350, 350]],
  ["source-glyph-crop", "source-glyph-crops/glyph-lower-text.png", [165, 1215, 1335, 1870]],
  ["native-raw-crop", "work/10p/pages/0185/figures/fig-145.png", null],
  ["native-raw-crop", "work/10p/pages/0185/figures/fig-146.png", null],
  ["native-raw-crop", "work/10p/pages/0185/figures/fig-147.png", null],
].map(([kind, relative, crop], index) => ({
  new_batch_ordinal: index + 1,
  permanent_context_ordinal: 13 + index,
  tool: "functions.view_image", detail: "original", kind,
  ...binding(path.join(own, relative)),
  source_crop_xyxy: crop,
  first_open: true,
  actual_image_tool_open: true,
}));
const actualOpens = write("actual-opens.json", {
  schema: "source-first-author/actual-opens@1",
  ticket: "STEMROBIN-181", book: "10p", page: 185, batch_root: own,
  prior_permanent_image_opens: 12,
  prior_count_basis: "Human-confirmed retained SOURCE183 seven plus SOURCE184 five. Close, resume or compaction never reset this count.",
  prior_ledger_reference_from_text_only: {
    path: path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d356-source184-first-author/actual-opens.json"),
    previously_returned_sha256: "28ab9d969d3b88fc6faa2c275667296ba6674d8eaa89f194bdd24323adbea6f1",
    read_or_reopened_this_batch: false,
  },
  new_image_opens: opens.length,
  cumulative_permanent_image_opens: 12 + opens.length,
  new_batch_limit: 8,
  resumed_cumulative_limit: 20,
  context_limit: 24,
  opens,
  reopen_count: 0,
  source183_image_opens: 0,
  source184_image_opens: 0,
  next_page_image_opens: 0,
  svg_or_preview_image_opens: 0,
  unlogged_image_opens: 0,
  count_resets: 0,
  child_agents: 0,
  images_returned_to_parent: 0,
  count_basis: "Every model-facing image tool open, including the two first-read glyph crops and three first native crop views. Native file processing and unopened SVG-raster previews are not image tool opens.",
});
const observations = [
  "Complete upper fixture, circular disk, interior line/ray marks, triangular perimeter marks, central curved component and entire lower stem retained. No invented apparatus labels; 图 145 caption is excluded.",
  "Complete convex mirror/hatching, six incident and six reflected paths, all six dashed backward extensions converging at F, axial arrows and P/F/O labels retained. Solid/dashed relationships remain intact; 图 146 caption is excluded.",
  "Complete mirror/hatching, principal axis O/F/P/S_1, dashed focal plane and 焦平面 label, incident AC, parallel secondary line OD, reflected CD and dashed continuation to S_1 retained. All A/C/D/O/F/P/S_1 labels, dots and arrows remain; 图 147 caption is excluded.",
];
const cropObservations = write("first-native-crop-observations.json", {
  schema: "source-first-author/first-native-crop-observations@1",
  ticket: "STEMROBIN-181", book: "10p", page: 185,
  role: "AUTHOR-FIRST-CROP-OBSERVATION-ONLY",
  frozen_source_inventory: binding(inventoryFile),
  independent_raw_pass_claimed: false,
  figures: audit.figures.map((figure, index) => ({
    id: figure.id, label: figure.label,
    original_rough_box_xywh: figure.from,
    first_native_exact_box_xywh: figure.box,
    native_components: figure.components,
    padding_px: figure.crop_padding_px ?? 12,
    native_png: binding(path.join(own, `work/10p/pages/0185/figures/${figure.id}.png`)),
    native_svg: binding(path.join(own, `work/10p/pages/0185/figures/${figure.id}.svg`)),
    first_review_preview_png: binding(path.join(own, `first-svg-preview/${figure.id}.png`)),
    first_review_preview_task_receipt: receipts[2].tasks[index],
    preview_visually_opened: false,
    new_open_ordinal: 5 + index,
    permanent_open_ordinal: 17 + index,
    observation: observations[index],
    status: "AUTHOR-OBSERVED-INDEPENDENT-RAW-REVIEW-PENDING",
    source_labels_or_geometry_added: false,
  })),
});
const report = write("report.json", {
  schema: "source-first-author/report@1",
  ticket: "STEMROBIN-181",
  role: "SAME-RESUMED-ONE-SHOT-FIRST-AUTHOR",
  workspace: repo,
  original_branch: "codex/STEMROBIN-181-textbooks",
  batch_root: own,
  book: "10p", page: 185, printed_page: 175,
  status: "NATIVE-AUTHOR-PASS-INDEPENDENT-REVIEWS-PENDING",
  frozen_at: new Date().toISOString(),
  preparation: {
    manifest: binding(preparationFile),
    retained_manifest_copy: binding(path.join(own, "preparation-manifest.json")),
    only_page185_inputs_byte_verified_and_copied: inputs,
    prepare_runs: 0,
    source183_or184_inputs_reopened: false,
  },
  source_inventory: binding(inventoryFile),
  source_inventory_frozen_before_page_md: true,
  author_input_page_md: binding(path.join(own, "author-input-page.md")),
  native_page_md: binding(path.join(own, "source/10p/pages/0185/page.md")),
  native_page_json: binding(path.join(own, "source/10p/pages/0185/page.json")),
  native_audit: binding(auditFile),
  native_finalize: {
    status: "AUTHOR-NATIVE-PASS",
    receipt: receipts[0].receipt,
    exact_invocation: receipts[0].tasks[0].exact_invocation,
    invocation_count: 1,
    exit_code: 0,
    stdout: receipts[0].tasks[0].stdout,
    stderr: receipts[0].tasks[0].stderr,
    tool_hashes_are_bound_in_receipt: true,
    tool_hashes_stable_during_command: receipts[0].tool_hashes_stable_during_command,
    lines_printed: audit.lines_printed,
    lines_md: audit.lines_md,
    blocks_reported_by_native_stdout: 13,
    errors: audit.errors,
    normalizations: audit.normalizations,
    unknown_chars: audit.unknown_chars,
    katex_warnings: audit.katex_warnings,
  },
  native_vectorize: {
    status: "NATIVE-CONTOUR-PASS-NOT-INDEPENDENT-VISUAL-PASS",
    receipt: receipts[1].receipt,
    exact_invocation: receipts[1].tasks[0].exact_invocation,
    invocation_count: 1,
    exit_code: 0,
    page_scope: 185,
    stdout: receipts[1].tasks[0].stdout,
    stderr: receipts[1].tasks[0].stderr,
    tool_hashes_are_bound_in_receipt: true,
    tool_hashes_stable_during_command: receipts[1].tool_hashes_stable_during_command,
    figures: [
      { id: "fig-145", stdout_mismatch_percent: 0.277 },
      { id: "fig-146", stdout_mismatch_percent: 0.135 },
      { id: "fig-147", stdout_mismatch_percent: 0.213 },
    ],
    independent_visual_pass: false,
  },
  first_svg_review_preview: {
    status: "FIRST-REVIEW-PIXELS-PREPARED-NOT-VISUALLY-REVIEWED",
    receipt: receipts[2].receipt,
    native_helper: path.join(repo, ".claude/skills/ld-s10y-lesson/tools/svg_raster.js"),
    batch_invocation_count: 1,
    render_invocation_count_per_figure: 1,
    tasks: receipts[2].tasks,
    helper_hashes_bound_in_receipt: true,
    preview_image_opens: 0,
    another_vectorize_or_finalize: false,
  },
  first_native_crop_observations: cropObservations,
  actual_opens: actualOpens,
  prior_permanent_image_opens: 12,
  new_image_opens: opens.length,
  cumulative_permanent_image_opens: 12 + opens.length,
  rows: {
    independently_observed_body: 15,
    unit_heading: 1,
    caption_text_rows: 3,
    caption145146_shared_standalone_horizontal_rows: 1,
    caption147_shares_body_row: 14,
    footnote: 0,
    footer: 1,
    distinct_printed_text_rows: 18,
  },
  continuity: {
    supplied_source184_tail_is_hint_not_truth: true,
    supplied_tail: "反射线将是",
    previous_tail_reported_open: true,
    previous_footnote_reported_complete: true,
    previous_independent_review_pending: true,
    previous_images_or_outputs_reopened: false,
    first_body_paragraph_cont: true,
    first_body_paragraph_complete_on_this_page: true,
    unit71_starts_on_this_page: true,
    unit71_title: "球面镜成像",
    unit71_complete: false,
    unit71_publishable_claimed: false,
    last_paragraph_internal_split: "Three rows open; figure147/caption; final row cont.",
    last_visible_sentence_complete: true,
    last_body_open_after_final_sentence: false,
    last_visible_words: "相交于 D 点. 反射线 CD 也通过这个点.",
    next_page_read: false,
  },
  findings: [
    "First native finalize reports 13 blocks, 18/18 lines, three figures and zero text normalizations; no rerun or author repair.",
    "First native PNG crop observations retain the full original apparatus/diagrams, all observed labels and relationships, and exclude captions.",
    "Page185 vectorize ran once; all three native contour checks pass. This does not establish independent RAW or SVG visual fidelity.",
    "Three first-review raster PNGs were separately saved with native svg_raster.js, once per SVG, with exact command/stdout/stderr/hash receipts. These previews were not opened.",
    "Source185 starts unit71 but does not establish the complete unit; no publication, canonical promotion or completion claim.",
    "Permanent image count is old12 plus new7 equals19, below this resumed batch limit20 and context limit24.",
  ],
  unresolved_glyphs: [],
  source_pass_claimed: false,
  independent_source_text_review: "PENDING",
  independent_raw_pass_claimed: false,
  independent_raw_review: "PENDING",
  independent_svg_visual_pass_claimed: false,
  independent_svg_visual_review: "PENDING-FIRST-PREVIEW-PIXELS-AVAILABLE",
  author_repairs: 0,
  native_finalize_reruns: 0,
  native_vectorize_reruns: 0,
  repeat_whole_text_reviews: 0,
  counting_override_used: false,
  fake_samerow_used: false,
  pipeline_modified: false,
  canonical_promoted: false,
  old_files_modified: false,
  index_or_meter_modified: false,
  database_writes: false,
  full_tests_build_or_project_checks: false,
  git_writes_commits_pushes_merges_or_deploys: false,
  modern_figures_specs_choices_or_answers_created: false,
  paid_generation: false,
  new_worker_chat_worktree_or_branch: false,
  all_existing_output_bindings: filesUnder(own).map(binding),
  freeze_policy: "All own regular output files chmod0444 after report, actual-opens, author-freeze and final seal; directories remain traversable. Stop this batch immediately after freeze.",
});
const authorFreeze = write("author-freeze.json", {
  schema: "source-first-author/author-freeze@1",
  ticket: "STEMROBIN-181", book: "10p", page: 185, batch_root: own,
  role: "SAME-RESUMED-FIRST-AUTHOR-NO-NEW-AGENT",
  status: "NATIVE-AUTHOR-PASS-INDEPENDENT-REVIEWS-PENDING",
  report,
  actual_opens: actualOpens,
  source_inventory: binding(inventoryFile),
  first_native_crop_observations: cropObservations,
  native_receipts: receipts.map((receipt) => receipt.receipt),
  prior_permanent_image_opens: 12,
  new_image_opens: opens.length,
  cumulative_permanent_image_opens: 12 + opens.length,
  prepare_runs: 0,
  native_finalize_runs: 1,
  native_vectorize_runs: 1,
  first_svg_preview_batch_runs: 1,
  first_svg_render_runs_per_figure: 1,
  preview_image_opens: 0,
  author_repairs: 0,
  source_pass_claimed: false,
  independent_raw_pass_claimed: false,
  independent_svg_visual_pass_claimed: false,
  canonical_promoted: false,
  unit71_complete: false,
  files: filesUnder(own).map(binding),
  required_next_action: "Parent separately reviews source185, raw145-147 and the saved first SVG previews. Continue unit71 only in a separately authorized batch; this first-author result does not authorize publication or canonical promotion.",
});
const seal = write("freeze-seal.json", {
  schema: "source-first-author/freeze-seal@1",
  ticket: "STEMROBIN-181", page: 185, batch_root: own,
  report, author_freeze: authorFreeze, actual_opens: actualOpens,
  source_inventory: binding(inventoryFile),
  first_native_crop_observations: cropObservations,
  native_receipts: receipts.map((receipt) => receipt.receipt),
  prior_permanent_image_opens: 12,
  new_image_opens: opens.length,
  cumulative_permanent_image_opens: 12 + opens.length,
  expected_regular_file_mode: "0444",
});
const files = filesUnder(own);
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
  native_page_md: binding(path.join(own, "source/10p/pages/0185/page.md")),
  first_svg_preview_receipt: receipts[2].receipt,
  prior_permanent_image_opens: 12,
  new_image_opens: opens.length,
  cumulative_permanent_image_opens: 12 + opens.length,
  frozen_regular_files: files.length,
  verified_regular_file_mode: "0444",
}, null, 2));

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const own = path.dirname(fileURLToPath(import.meta.url));
const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
if (own !== path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d346-source183-first-author")) {
  throw new Error("Incorrect output root.");
}
const sha = (file) =>
  crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const binding = (file) => ({
  path: file,
  sha256: sha(file),
  bytes: fs.statSync(file).size,
});
const write = (name, object) => {
  const file = path.join(own, name);
  fs.writeFileSync(file, JSON.stringify(object, null, 2) + "\n", { flag: "wx" });
  return binding(file);
};
const filesUnder = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Symlinks not allowed: ${file}`);
    return entry.isDirectory() ? filesUnder(file) : [file];
  }).sort();
const preparationPath = path.join(
  repo,
  ".intentfold/tickets/STEMROBIN-181/tmp/d344-source183-preparation/manifest.json",
);
if (sha(preparationPath) !== "92286d271ec6f40facb450a1c2a04e2ba35147934fc227d0601071adf18daa90") {
  throw new Error("Preparation manifest changed.");
}
const preparation = JSON.parse(fs.readFileSync(preparationPath, "utf8"));
const preparedBindings = preparation.inputs.map((input) => {
  const original = path.resolve(repo, input.path);
  const copies = ["source", "work"].map((folder) => {
    const file = path.join(own, folder, "10p/pages/0183", path.basename(input.path));
    if (sha(file) !== input.sha256) throw new Error(`Copied input drifted: ${file}`);
    return binding(file);
  });
  return { original_path: original, original_sha256: input.sha256, copies };
});
const receiptFile = path.join(own, "finalize-183.receipt.json");
const receipt = JSON.parse(fs.readFileSync(receiptFile, "utf8"));
if (receipt.invocation_count !== 1 || receipt.exit_code !== 1) {
  throw new Error("Freeze expected the retained single native first failure.");
}
const auditFile = path.join(own, "source/10p/pages/0183/audit.json");
const audit = JSON.parse(fs.readFileSync(auditFile, "utf8"));
if (audit.lines_printed !== 25 || audit.lines_md !== 26 || audit.errors.length !== 1) {
  throw new Error("Unexpected retained audit.");
}
if (fs.existsSync(path.join(own, "vectorize-183.receipt.json"))) {
  throw new Error("Vectorize was not authorized after native failure.");
}
const opens = [
  ["source-page", "work/10p/pages/0183/page.png", null],
  ["source-grid", "work/10p/pages/0183/page.grid.png", null],
  ["source-glyph-crop", "source-glyph-crops/glyph-top.png", [180, 100, 1375, 740]],
  ["source-glyph-crop", "source-glyph-crops/glyph-bottom.png", [180, 1040, 1350, 1965]],
  ["source-glyph-crop", "source-glyph-crops/glyph-reflection-side.png", [270, 965, 1360, 1035]],
  ["native-raw-crop", "work/10p/pages/0183/figures/fig-141.png", null],
  ["native-raw-crop", "work/10p/pages/0183/figures/fig-142.png", null],
].map(([kind, relative, sourceCrop], index) => ({
  ordinal: index + 1,
  tool: "functions.view_image",
  detail: "original",
  kind,
  ...binding(path.join(own, relative)),
  source_crop_xyxy: sourceCrop,
  source_crop_basis: sourceCrop
    ? binding(path.join(own, "work/10p/pages/0183/page.png"))
    : null,
  actual_image_tool_open: true,
}));
const actualOpens = write("actual-opens.json", {
  schema: "source-first-author/actual-opens@1",
  ticket: "STEMROBIN-181",
  book: "10p",
  page: 183,
  batch_root: own,
  context_images_at_start: 0,
  actual_image_opens_this_batch: opens.length,
  actual_image_opens_this_context: opens.length,
  batch_max: 8,
  context_max: 24,
  count_basis: "Every actual model-facing image tool open, including all crops and reopens. Native file processing is not a model-facing image open.",
  parent_context_images_reported_by_user: 24,
  images_returned_to_parent: 0,
  opens,
  reopen_count: 0,
  svg_image_open_count: 0,
  other_page_image_open_count: 0,
  unlogged_image_opens: 0,
  compaction_resets: 0,
  child_agents: 0,
});
const diagnosisFile = path.join(own, "affected-row-band-diagnosis.json");
const figureObservations = [
  {
    id: "fig-141",
    original_inventory: binding(path.join(own, "initial-inventory.json")),
    native_raw_png: binding(path.join(own, "work/10p/pages/0183/figures/fig-141.png")),
    box: audit.figures[0].box,
    author_image_open_ordinal: 6,
    author_observation: "Complete mirror, both axes, interval brackets, O/F/P/K/R/R/2 labels and 焦平面 are retained; neighboring 图 141 caption is excluded.",
    independently_reviewed: false,
    svg_exists: false,
    status: "AUTHOR-RAW-OBSERVED-INDEPENDENT-REVIEW-PENDING",
  },
  {
    id: "fig-142",
    original_inventory: binding(path.join(own, "initial-inventory.json")),
    native_raw_png: binding(path.join(own, "work/10p/pages/0183/figures/fig-142.png")),
    box: audit.figures[1].box,
    crop_padding_px: audit.figures[1].crop_padding_px,
    author_image_open_ordinal: 7,
    author_observation: "Complete upper fixture, circular disk, interior marks, central curved component and lower supporting stem are retained; neighboring 图 142 caption is excluded. Unlabelled marks are retained as pixels, not invented labels.",
    independently_reviewed: false,
    svg_exists: false,
    status: "AUTHOR-RAW-OBSERVED-INDEPENDENT-REVIEW-PENDING",
  },
];
const report = write("report.json", {
  schema: "source-first-author/report@1",
  ticket: "STEMROBIN-181",
  role: "ONE-SHOT-FIRST-AUTHOR-ONLY",
  workspace: repo,
  original_branch: "codex/STEMROBIN-181-textbooks",
  batch_root: own,
  book: "10p",
  page: 183,
  printed_page: 173,
  status: "HOLD-NATIVE-FIRST-FAIL-ROW-COUNT",
  frozen_at: new Date().toISOString(),
  preparation: {
    reused_exactly_once_preparation: binding(preparationPath),
    retained_manifest_copy: binding(path.join(own, "preparation-manifest.json")),
    prepare_runs_this_batch: 0,
    byte_verified_inputs: preparedBindings,
  },
  initial_inventory: binding(path.join(own, "initial-inventory.json")),
  authored_input: binding(path.join(own, "author-input-page.md")),
  native_outputs: {
    page_md: binding(path.join(own, "source/10p/pages/0183/page.md")),
    page_json: binding(path.join(own, "source/10p/pages/0183/page.json")),
    audit: binding(auditFile),
  },
  native_finalize: {
    status: "FAIL",
    runs: 1,
    receipt: binding(receiptFile),
    exact_invocation: receipt.exact_invocation,
    executable: receipt.executable,
    argv: receipt.argv,
    cwd: receipt.cwd,
    environment_overrides: receipt.environment_overrides,
    exit_code: receipt.exit_code,
    stdout: receipt.stdout,
    stderr: receipt.stderr,
    tools: receipt.tools,
    errors: audit.errors,
    normalizations: audit.normalizations,
    unknown_chars: audit.unknown_chars,
    katex_warnings: audit.katex_warnings,
    native_outputs_preserved: true,
  },
  vectorize: {
    status: "NOT-RUN-NATIVE-FINALIZE-FAILED",
    runs: 0,
    svg_outputs: [],
    native_contour_pass: false,
    independent_visual_pass: false,
  },
  rows: {
    independently_observed_body: 23,
    caption_text_rows: 2,
    captions_share_body_rows: [7, 21],
    independently_observed_footnote: 2,
    footer: 1,
    distinct_visual_text_rows: 26,
    native_printed: audit.lines_printed,
    native_md: audit.lines_md,
    row_band_diagnosis: binding(diagnosisFile),
  },
  continuity: {
    previous_hint_ref: "p0182#9",
    previous_hint_native_status: "AUTHOR nativepass",
    previous_hint_independent_review: "pending",
    previous_hint_is_source_truth: false,
    previous_page_pixels_opened: false,
    first_block_cont: true,
    last_body_block_open: false,
    last_body_paragraph_complete_on_this_page: true,
    next_page_pixels_opened: false,
    off_page_reference: "图 143",
  },
  figures: figureObservations,
  findings: [
    {
      id: "native-footnote-row-merge",
      status: "HOLD",
      finding: "The sole native error is 25 counted rows versus 26 authored/visible text rows. Native bands merge both footnote rows into [1805,1880]; pre-merge fragments are [1805,1847] and [1851,1879].",
      evidence: binding(diagnosisFile),
      author_repair: "None: preserve the actual two-row footnote. A native counter repair or separate reviewer decision is outside this batch.",
    },
    {
      id: "literal-glyphs",
      status: "AUTHOR-OBSERVED-NOT-INDEPENDENT-PASS",
      finding: "The targeted source crops confirm 内表面, 仪器来观察, both small-print footnote rows, the ① marker and dotted footer 173. No physics terminology was substituted.",
      evidence: opens.filter((open) => open.kind === "source-glyph-crop"),
    },
    {
      id: "raw-figures",
      status: "AUTHOR-OBSERVED-INDEPENDENT-REVIEW-PENDING",
      finding: "Both native PNG crops were visually opened by the author. Full objects remain and captions are separate. No inferred diagram labels, modern artwork or FigureSpec was authored.",
    },
  ],
  actual_opens: actualOpens,
  actual_image_opens: opens.length,
  author_repairs: 0,
  repeat_whole_text_verifications: 0,
  unresolved_source_glyphs: [],
  independent_source_text_review: "PENDING",
  independent_raw_figure_review: "PENDING",
  independent_svg_visual_review: "NOT-APPLICABLE-SVG-NOT-GENERATED",
  source_pass_claimed: false,
  complete_card_claimed: false,
  canonical_promoted: false,
  canonical_writes: false,
  progress_counts_updated: false,
  corpus_counts_updated: false,
  modern_artwork_or_specs_created: false,
  paid_generation: false,
  choices_or_answers_authored: false,
  whole_test_or_build_run: false,
  git_writes: false,
  database_writes: false,
  commits_pushes_merges_or_deploys: false,
  new_worker_chat_worktree_or_branch: false,
  own_existing_file_bindings: filesUnder(own).map(binding),
  freeze_policy: "All own regular output files are chmod 0444 after writing the report, author freeze, actual opens and final seal; directories remain traversable. No source/native output is modified after this freeze.",
});
const authorFreeze = write("author-freeze.json", {
  schema: "source-first-author/author-freeze@1",
  ticket: "STEMROBIN-181",
  role: "ONE-SHOT-FIRST-AUTHOR-ONLY",
  batch_root: own,
  status: "HOLD-NATIVE-FIRST-FAIL-ROW-COUNT",
  source_pass_claimed: false,
  independent_source_pass: false,
  independent_visual_pass: false,
  report,
  actual_opens: actualOpens,
  actual_image_opens: opens.length,
  native_command_receipt: binding(receiptFile),
  exact_native_invocation: receipt.exact_invocation,
  native_finalize_runs: 1,
  native_finalize_exit_code: receipt.exit_code,
  prepare_runs: 0,
  vectorize_runs: 0,
  author_repairs: 0,
  required_next_action: "Parent separately reviews the retained page and native PNGs and resolves the documented native footnote counter discrepancy. No canonical promotion or completion authorized here.",
  files: filesUnder(own).map(binding),
});
const seal = write("freeze-seal.json", {
  schema: "source-first-author/freeze-seal@1",
  ticket: "STEMROBIN-181",
  batch_root: own,
  report,
  author_freeze: authorFreeze,
  actual_opens: actualOpens,
  actual_image_opens: opens.length,
  expected_regular_file_mode: "0444",
});
const allFiles = filesUnder(own);
for (const file of allFiles) fs.chmodSync(file, 0o444);
for (const file of allFiles) {
  if ((fs.statSync(file).mode & 0o777) !== 0o444) {
    throw new Error(`Output not frozen: ${file}`);
  }
}
for (const entry of [report, authorFreeze, actualOpens, seal]) {
  if (sha(entry.path) !== entry.sha256) throw new Error("Frozen binding drifted.");
}
console.log(JSON.stringify({
  status: "HOLD-NATIVE-FIRST-FAIL-ROW-COUNT",
  report,
  author_freeze: authorFreeze,
  actual_opens: actualOpens,
  freeze_seal: seal,
  actual_image_opens: opens.length,
  frozen_regular_files: allFiles.length,
  verified_regular_file_mode: "0444",
  native_finalize_runs: 1,
  vectorize_runs: 0,
  author_repairs: 0,
}, null, 2));

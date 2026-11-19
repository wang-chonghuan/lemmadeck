import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = "/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck";
const OUT = path.join(ROOT, ".intentfold/tickets/STEMROBIN-181/tmp/d1817-source322325-review");
if (fs.realpathSync(OUT) !== OUT) throw new Error("Unexpected output directory");
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const read = (name) => JSON.parse(fs.readFileSync(path.join(OUT, name), "utf8"));
const ref = (file) => ({ path: file, sha256: hash(file) });
const localRef = (name) => ref(path.join(OUT, name));
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};
const save = (name, value) => {
  const target = path.join(OUT, name);
  assert(path.dirname(target) === OUT, "Write escaped authorized directory");
  fs.writeFileSync(target, JSON.stringify(value) + "\n", { flag: "wx", mode: 0o444 });
  fs.chmodSync(target, 0o444);
  return ref(target);
};
const nums = [322, 323, 324, 325];
const initialNames = nums.map((n) => `source${String(n).padStart(4, "0")}.freeze.json`);
const initial = initialNames.map(read);
for (let i = 0; i < initial.length; i++) {
  const file = path.join(OUT, initialNames[i]);
  assert((fs.statSync(file).mode & 0o777) === 0o444, `Not frozen: ${file}`);
  assert(hash(initial[i].source.path) === initial[i].source.sha256, "Source hash changed");
}
const pages = structuredClone(initial);
const c323 = read("source0323.clarification.freeze.json");
const c324 = read("source0324.clarification.freeze.json");
const c325 = read("source0325.clarification.freeze.json");
const c315 = read("source0315.right-strip.clarification.freeze.json");
const crops = read("crop-evidence.freeze.json").crops;
const block = (page, id) => page.blocks.find((b) => b.id === id);
for (const [page, clarification] of [[pages[1], c323], [pages[3], c325]]) {
  for (const change of clarification.line_changes) {
    const b = block(page, change.block);
    assert(b.lines[change.line - 1] === change.before, "Clarification before-text mismatch");
    b.lines[change.line - 1] = change.after;
  }
}
block(pages[1], "p0323#7").notes = [
  "Native crop confirms literal wording in source0323.clarification.freeze.json. Unusual printed run is retained, not grammar-corrected.",
];
block(pages[3], "p0325#2").notes = [
  "Literal years retained without historical correction.",
  "Name initials use Cyrillic code-point convention for visually indistinguishable uppercase homoglyphs. Native crop confirms smaller lowercase initial on line3 and uppercase on line6; surname unchanged.",
];
block(pages[2], "p0324#5").under_dot_spans_certain = c324.observation.under_dot_spans_certain;
pages[2].typography.underdot_candidate = undefined;
pages[2].typography.underdot_inventory = {
  status: "complete",
  dotted_columns: c324.observation.dotted_columns,
  undotted_intervening_columns: c324.observation.undotted_intervening_columns,
  maximality: c324.observation.maximality,
};
pages[3].typography.held_run = undefined;
pages[3].typography.body_outside_listed_spans = "ordinary; complete heavy inventory, no additional heavy run";
pages[3].typography.body_outside_listed_or_held_spans = undefined;
pages[1].formula_shapes[1] = {
  block: "p0323#4",
  line: 2,
  shape: c323.formula_observation.shape,
  latex_candidate: c323.formula_observation.latex_candidate,
  confirmed_latex_subexpression: c323.formula_observation.confirmed_latex_subexpression,
  glyph_hold: "323-frequency-glyph-nu-v",
  transcription_status: "Only glyph before equals is held; stored line uses explicitly unapproved nu candidate",
};
pages[0].holds = [];
pages[1].holds = c323.remaining_scoped_holds;
pages[2].holds = [];
pages[3].holds = initial[3].holds.filter((h) => h.id === "325-right-open");
pages[0].boundaries[1].status = "resolved_by_actual_p0323#1";
pages[0].boundaries[1].continuation = "p0323#1";
pages[1].boundaries[3].status = "resolved_by_actual_p0324#4_number125_heading";
pages[1].boundaries[3].end_block = "p0324#3";
pages[1].boundaries[3].end_line = 10;
pages[2].boundaries[3].status = "continued_on_p0325; final125_boundary_remains_open";
for (let i = 0; i < pages.length; i++) {
  pages[i].initial_snapshot = localRef(initialNames[i]);
  pages[i].observation_basis = "First frozen observation plus only hash-bound affected clarification; initial bytes remain immutable";
  if (i > 0) pages[i].clarification = localRef(`source${String(nums[i]).padStart(4, "0")}.clarification.freeze.json`);
}
const checkSpan = (b, span) => {
  assert(span.start.block === b.id && span.end.block === b.id, "Invalid span owner");
  const rows = b.lines.slice(span.start.line - 1, span.end.line).map((row) => Array.from(row));
  assert(rows.length > 0, "Empty span");
  const start = span.start.column_1based - 1;
  const end = span.end.column_1based_inclusive;
  assert(start >= 0 && start < rows[0].length, "Span start out of bounds");
  assert(end >= 1 && end <= rows.at(-1).length, "Span end out of bounds");
  const text = rows.length === 1
    ? rows[0].slice(start, end).join("")
    : rows.map((row, i) => i === 0 ? row.slice(start).join("")
      : i === rows.length - 1 ? row.slice(0, end).join("") : row.join("")).join("\n");
  assert(text === span.text, `Span text mismatch ${b.id}`);
};
const lineChecks = [];
for (const page of pages) {
  let sum = 0;
  let same = 0;
  for (const b of page.blocks) {
    assert(b.line_count === b.lines.length, `Row array mismatch ${b.id}`);
    sum += b.line_count;
    if (b.flags.samerow) same += b.kind === "cap" ? b.line_count : 1;
    for (const span of [...b.heavy_spans_certain, ...b.under_dot_spans_certain]) checkSpan(b, span);
    if (b.kind === "fig" || b.kind === "cap") assert(page.figures.some((f) => f.id === b.figure_id), "Unbound figure");
    if (b.flags.footnote) assert(b.kind === "p" && b.owner_number && b.owner_marker.text === "①", "Footnote owner mismatch");
  }
  assert(sum === page.line_accounting.block_line_sum, "Block row accounting mismatch");
  assert(same === page.line_accounting.samerow_deduction, "Shared row mismatch");
  assert(sum - same === page.line_accounting.unique_physical_lines, "Unique physical row mismatch");
  for (const f of page.figures) {
    const [x, y, w, h] = f.approx_native_box_xywh;
    assert(x >= 0 && y >= 0 && w > 0 && h > 0 &&
      x + w <= page.source.width_px && y + h <= page.source.height_px, "Figure coarse box exceeds source");
  }
  lineChecks.push({
    physical_page: page.physical_page, printed_page: page.printed_page,
    block_line_sum: sum, samerow_deduction: same, unique_physical_lines: sum - same,
  });
}
for (const item of crops) {
  assert(hash(item.path) === item.sha256, "Crop hash changed");
  assert(hash(item.source.path) === item.source.sha256, "Crop source hash changed");
  const [x, y, w, h] = item.native_crop_box_xywh;
  assert(x >= 0 && y >= 0 && x + w <= item.source.width_px &&
    y + h <= item.source.height_px, "Crop out of bounds");
  assert(item.resampled === false, "Resampled evidence is forbidden");
}
assert(hash(c315.initial_snapshot.path) === c315.initial_snapshot.sha256, "Old315 snapshot changed");
const old315Clarification = ref(c315.prior_clarification.path);
const ledger = {
  schema: "stemrobin181/image-usage@1", batch: "D041", status: "CLOSED_8_OF_8",
  parent_context_images_received: 0,
  prior_parent_cumulative_images_24: "Human-supplied text only, no images inherited or reopened",
  prior_closed_batch_8_of_8: "Human-supplied checkpoint, exact artifacts retained",
  local_context_limit: 8, local_images_opened_total: 8,
  originals: 4, source315_right_strip: 1, new_page_targeted_crops: 3,
  original_reopens: 0, crop_reopens: 0, source315_full_page_opens: 0,
  source_prepare_calls: 0, paid_calls: 0, other_page_image_opens: 0,
  model_image_open_definition: "Each view_image load into this fresh context; shell metadata/hash/crop preparation is not another visual load",
  ledger: [
    ...initial.map((page, i) => ({
      ordinal: i + 1, physical_page: page.physical_page, kind: "original",
      ...page.source, reopened: false, frozen_first_observation: localRef(initialNames[i]),
    })),
    ...crops.map((item) => ({
      ordinal: item.planned_image_open_ordinal, physical_page: item.physical_page,
      kind: item.physical_page === 315 ? "315_affected_native_strip" : "new_page_targeted_crop",
      path: item.path, sha256: item.sha256,
      native_crop_box_xywh: item.native_crop_box_xywh, output_size_wh: item.output_size_wh,
      source: item.source, resampled: false, reopened: false,
    })),
  ],
  further_images: false, further_batch: false, return_payload: "TEXT_ONLY",
};
const ledgerRef = save("image-usage.freeze.json", ledger);
const boundaries = [
  {
    number: 123, title: "稳定态存在的实验证据",
    start: { block: "p0321#5", basis: "Direct human text-only previous-page tail, not reread" },
    last_main: { block: "p0323#4", line: 5, after: "量子。" },
    next_heading: { block: "p0323#5", number: 124, source_sha256: pages[1].source.sha256 },
    owned_figures: ["fig-252", "fig-253"], owned_footnotes: ["p0323#8"],
    boundary_status: "COMPLETE_ACTUAL_NUMBERED_BOUNDARY",
    usable_complete_source_object: false,
    reason: "Earlier p0321 content remains parent evidence; this batch closes its actual tail. Single frequency-glyph nu/v HOLD prevents an unconditional source-content pass.",
  },
  {
    number: 124, title: "玻尔理论的困难　量子力学",
    start: { block: "p0323#5", line: 1 },
    main_blocks: ["p0323#6", "p0323#7", "p0324#1", "p0324#2", "p0324#3"],
    last_main: { block: "p0324#3", line: 10, after: "描写。" },
    next_heading: { block: "p0324#4", number: 125, source_sha256: pages[2].source.sha256 },
    owned_footnotes: ["p0324#6"], literal_clarification: localRef("source0323.clarification.freeze.json"),
    boundary_status: "COMPLETE_ACTUAL_NUMBERED_BOUNDARY",
    usable_complete_source_object: true, content_holds: [],
    approval: "SOURCE_ONLY; not RAW/modern/card approval",
  },
  {
    number: 125, title: "量子光源——激光器",
    start: { block: "p0324#4", line: 1 },
    tail: { block: "p0325#9", line: 2, after: "能" },
    boundary_status: "OPEN_ACTUAL_PRINTED_SENTENCE_AND_UNIT",
    usable_complete_source_object: false, next_source_read_authorized: false,
  },
];
const phase = {
  schema: "stemrobin181/phase1-observation@1", phase: 1, batch: "D041",
  book: "10p", physical_range: [322, 325], printed_range: [312, 315],
  status: "FROZEN_SOURCE_ONLY_WITH_NARROW_GLYPH_AND_OPEN_BOUNDARY",
  column_convention: "1-based Unicode code points in stored lines, including LaTeX delimiters and explicit spacing; inclusive end",
  pages, initial_snapshots: initialNames.map(localRef),
  evidence: [
    ...initial.map((page) => ({ ...page.source, role: "prepared_original_not_regenerated" })),
    ...crops.map((item) => ({
      path: item.path, sha256: item.sha256, role: item.id,
      native_crop_box_xywh: item.native_crop_box_xywh, resampled: false,
    })),
    ...["source0315.right-strip.clarification.freeze.json", "source0323.clarification.freeze.json",
      "source0324.clarification.freeze.json", "source0325.clarification.freeze.json"].map(localRef),
  ],
  source315_coverage_overlay: {
    ...localRef("source0315.right-strip.clarification.freeze.json"),
    resolves_only: ["315-body-right-clipped"], status: "RESOLVED_ORDINARY_NONE",
    prior_visible_passes_preserved: true, initial_snapshot: c315.initial_snapshot,
    prior_clarification: old315Clarification, no_other_oldsource_hold_replay: true,
  },
  holds: pages.flatMap((page) => page.holds), boundaries,
  hold_dispositions: [
    { id: "322-right-open", resolution: "p0323#1 actual continuation closes paragraph" },
    { id: "323-right-unit-open", resolution: "p0324#4 actual125 heading closes124 after p0324#3" },
    { id: "324-underdot-left-endpoint", resolution: "Native crop confirms three maximal dotted runs with undotted comma/or connective" },
    { id: "324-right-unit-open", resolution: "Continues into325; only final125 right-open is retained" },
    { id: "325-p2-weight", resolution: "Targeted crop confirms ordinary body weight, no extra bold run" },
    { id: "325-name-initial-strokes", resolution: "Native crop confirms lowercase on line3, uppercase on line6; literal surname retained" },
    { id: "315-body-right-clipped", resolution: "Only clipped suffix coverage repaired; all18 suffix rows ordinary, no underdots" },
  ],
  image_usage: ledger, image_usage_evidence: ledgerRef,
  verification: {
    source_and_crop_hashes: "PASS", initial_permissions_0444: "PASS",
    block_line_lengths: "PASS", physical_line_accounting: lineChecks,
    maximal_span_bounds_and_exact_text: "PASS", figure_boxes_in_native_bounds: "PASS",
    figure_caption_bindings: "PASS", footnote_marker_owners: "PASS",
    no_additional_visual_verification: true,
  },
  forbidden_operations_executed: [],
  approval: "SOURCE observation only; no RAW, modern, choice, answer, whole-card, publish or deploy approval",
};
const phaseRef = save("phase1-observation.json", phase);
const report = {
  schema: "stemrobin181/source-batch-report@1", batch: "D041", book: "10p",
  status: "CLOSED_TEXT_ONLY_8_OF_8", phase1: phaseRef, image_usage: ledgerRef,
  unique_physical_lines: lineChecks,
  complete_numbered_boundaries: [123, 124], usable_complete_source_objects: [124],
  scope_limited_held_complete_boundary: { number: 123, hold: "323-frequency-glyph-nu-v" },
  open_numbered_object: { number: 125, block: "p0325#9", line: 2, after: "能" },
  holds: phase.holds,
  source315: phase.source315_coverage_overlay,
  clarifications: [
    localRef("source0323.clarification.freeze.json"),
    localRef("source0324.clarification.freeze.json"),
    localRef("source0325.clarification.freeze.json"),
  ],
  evidence_manifest: path.join(OUT, "evidence-hashes.freeze.json"),
  next_actions_authorized: [], raw_modern_card_approval: false,
};
const reportRef = save("report.json", report);
const fileNames = fs.readdirSync(OUT).filter((name) => name !== "evidence-hashes.freeze.json").sort();
for (const name of fileNames) fs.chmodSync(path.join(OUT, name), 0o444);
const manifestRef = save("evidence-hashes.freeze.json", {
  schema: "stemrobin181/evidence-hashes@1", batch: "D041", book: "10p",
  files: fileNames.map((name) => ({
    ...localRef(name), mode: "0444", bytes: fs.statSync(path.join(OUT, name)).size,
  })),
  referenced_originals: initial.map((page) => page.source),
  referenced_old315: [c315.initial_snapshot, old315Clarification],
  no_image_payload: true,
});
console.log(JSON.stringify({
  status: "CLOSED", phase1: phaseRef, report: reportRef, image_usage: ledgerRef,
  manifest: manifestRef, files: fileNames.length + 1,
  holds: phase.holds, source315_resolved_only: ["315-body-right-clipped"],
  image_total: 8, unique_physical_lines_total: lineChecks.reduce((n, row) => n + row.unique_physical_lines, 0),
}));

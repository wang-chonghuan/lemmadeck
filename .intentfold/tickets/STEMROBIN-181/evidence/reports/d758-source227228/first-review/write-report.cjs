const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");

const root = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
assert.equal(process.cwd(), root);
const own = path.join(root, ".intentfold/tickets/STEMROBIN-181/tmp/d749-source227228-first-review");
const authorPath = path.join(root, ".intentfold/tickets/STEMROBIN-181/tmp/d741-source227228-first-author/reports/report.json");
const authorHash = "c05cac21ee715ff642871580138c82c71ed1573f8efdd153959fbf8f66075e0f";
const sha = (data) => crypto.createHash("sha256").update(data).digest("hex");
const file = (p) => {
  assert.ok(p.startsWith(root + "/"), `Outside sole checkout: ${p}`);
  const bytes = fs.readFileSync(p);
  return { path: p, sha256: sha(bytes), bytes: bytes.length };
};
assert.equal(file(authorPath).sha256, authorHash);
const author = JSON.parse(fs.readFileSync(authorPath, "utf8"));
const bindings = new Map();
function bind(p, expected) {
  const entry = file(p);
  assert.equal(entry.sha256, expected, `Changed input: ${p}`);
  bindings.set(p, entry);
  return entry;
}
function walk(value) {
  if (!value || typeof value !== "object") return;
  if (value.path && value.sha256) bind(value.path, value.sha256);
  if (value.tool && value.tool_sha256) bind(value.tool, value.tool_sha256);
  for (const k of ["stdout", "stderr", "audit"]) {
    if (typeof value[k] === "string" && value[k + "_sha256"]) {
      bind(value[k], value[k + "_sha256"]);
    }
  }
  for (const child of Object.values(value)) if (typeof child === "object") walk(child);
}
walk(author);
bind(author.source.pdf_path, author.source.pdf_sha256_from_native_finalization);
assert.equal(bindings.size, 40);
const authorBinding = bind(authorPath, authorHash);

const expectedRows = {
  227: [2, 1, 3, 9, 4, 0, 1, 5, 1],
  228: [2, 2, 1, 4, 5, 0, 1, 2, 5, 3, 1],
};
const pages = author.pages.map((p) => {
  const json = JSON.parse(fs.readFileSync(p.page_json.path, "utf8"));
  const audit = JSON.parse(fs.readFileSync(p.audit.path, "utf8"));
  const md = fs.readFileSync(p.page_md.path, "utf8");
  const literal = fs.readFileSync(p.literal_authored_snapshot.path, "utf8");
  const body = (text) => text.split(/^---\s*$/m).slice(2).join("---").trim();
  const textAndFlags = (text) => body(text)
    .replace(/(<!-- fig [^\n]*?\bbox )[\d,]+/g, "$1<native-box>")
    .replace(/^!\[[^\n]*\]\([^\n]*\)\n?/gm, "")
    .replace(/\n{3,}/g, "\n\n");
  assert.equal(textAndFlags(md), textAndFlags(literal), `Changed literal text/flags on ${p.physical_page}`);
  const rows = json.blocks.map((b) => b.lines.length);
  assert.deepEqual(rows, expectedRows[p.physical_page]);
  const counted = json.blocks.reduce((n, b) => n + (b.samerow ? 0 : b.lines.length), 0);
  assert.equal(counted, 25);
  assert.equal(audit.lines_printed, 25);
  assert.equal(audit.lines_md, 25);
  for (const k of ["errors", "normalizations", "unknown_chars", "katex_warnings"]) {
    assert.deepEqual(audit[k], []);
  }
  assert.equal(json.meta.printed_page, p.physical_page - 10);
  assert.equal(json.meta.source.pdf_sha256, author.source.pdf_sha256_from_native_finalization);
  const prepared = author.source.prepared_inputs.find((x) => x.page === p.physical_page);
  const getPrepared = (name) => prepared.files.find((x) => path.basename(x.path) === name);
  assert.equal(json.meta.render.sha256, getPrepared("page.png").sha256);
  const h3 = json.blocks.find((b) => b.kind === "h3");
  assert.equal(h3.lines[0], p.physical_page === 227 ? "85. 牛顿环" : "86. 光的波长");
  assert.equal(json.blocks[0].cont, false);
  assert.equal(json.blocks[0].open, false);
  const open = json.blocks[4];
  const cont = json.blocks[7];
  assert.equal(open.open, true);
  assert.equal(cont.cont, true);
  assert.equal(cont.open, false);
  assert.equal(json.blocks[6].samerow, true);
  const f = p.figure_inventory[0];
  const inventory = p.physical_page === 227 ? {
    subfigures: 1,
    objects: [
      "One hatched plano-convex lens: straight upper surface, curved lower surface.",
      "One horizontal hatched glass plate with central lens contact.",
      "One vertical downward incident ray and two oblique upward emerging rays.",
    ],
    labels: [{ text: "1", count: 1 }, { text: "2", count: 1 }],
    arrowheads: 3,
    relationships: [
      "Incident ray reaches the left selected lens/air gap.",
      "The two emerging ray paths are distinct and retain their source intersections and directions.",
      "Lens and plate touch centrally while the selected left gap remains visible.",
    ],
  } : {
    subfigures: 1,
    objects: [
      "One hatched plano-convex lens over a horizontal hatched plate with central contact.",
      "One slanted radius and one vertical radius meeting at a common upper vertex.",
      "One horizontal radial-distance segment reaching the vertical radius.",
      "One short thickness indicator/leader at the selected left air gap.",
    ],
    labels: [{ text: "R", count: 2 }, { text: "r_k", count: 1 }, { text: "h_k", count: 1 }],
    arrowheads: 0,
    relationships: [
      "Slanted radius reaches the left selected curved-surface point.",
      "Vertical radius reaches central lens/plate contact.",
      "r_k extends horizontally from the selected left point to the vertical radius.",
      "h_k identifies the thickness between the curved lens surface and plate at the selected left point.",
    ],
  };
  Object.assign(inventory, { table_rows: null, table_columns: null, grid_rows: null, grid_columns: null });
  const preview = file(path.join(own, `${f.id}.svg-preview.png`));
  const provenance = {
    prepared_page: getPrepared("page.png"),
    inspected_grid: getPrepared("page.grid.png"),
    page_md: p.page_md,
    page_json: p.page_json,
    audit: p.audit,
    authored_literal_snapshot: p.literal_authored_snapshot,
    raw: f.png,
    svg: f.svg,
    preview,
  };
  return {
    physical_page: p.physical_page,
    printed_page: p.printed_page,
    inputs: provenance,
    gates: {
      SOURCE: {
        status: "PASS",
        basis: "Independent original-resolution source-grid inspection preceded authored candidate text; every candidate printed row was then compared against those source pixels.",
        literal_prose: "PASS",
        punctuation: "PASS: source ASCII sentence periods, Chinese commas and parentheses, colon, terminal formula comma, and printed dotted k enumeration retained.",
        emphasis: p.physical_page === 227
          ? "PASS: only the parenthetical 干涉 emphasis is bold; the actual numbered heading is h3."
          : "PASS: actual numbered heading is h3; no prose bold emphasis invented.",
        formula_tokens: "PASS: printed variables, superscripts, subscripts, operators, delimiters, and equation number preserved literally; no scientific correction applied.",
        rows_by_block_including_samerow_caption: rows,
        independent_counted_printed_rows: counted,
        native_rows_receipt_reused: { printed: audit.lines_printed, md: audit.lines_md },
        blocks: json.blocks.map((b, i) => ({
          ref: `p${String(p.physical_page).padStart(4, "0")}#${i + 1}`,
          kind: b.kind,
          label: b.label,
          open: b.open,
          cont: b.cont,
          samerow: b.samerow,
          rows: b.lines,
        })),
      },
      RAW: {
        status: "PASS",
        basis: "Opened the exact hash-bound RAW crop once and compared its content to the prior source-grid observation.",
        figure_id: f.id,
        native_box_xywh: f.native_box_xywh,
        dimensions_px: p.physical_page === 227 ? [459, 295] : [573, 318],
        source_inventory: inventory,
        completeness: "All observed lens/plate geometry, hatching, intersections, and labels retained.",
        intrusion: "No caption, adjacent prose, source inspection grid, or neighbouring figure intrusion.",
      },
      SVG: {
        status: "PASS",
        basis: "Opened one preview generated from this exact SVG by the existing repository resvg helper; compared to the prior source and RAW inspections.",
        source_raw: f.png,
        svg: f.svg,
        preview,
        visual_fidelity: "All inventory items, labels, hatching and defining intersections retained; no filled holes, clipped content, added geometry or blank canvas.",
        native_mismatch_percent_receipt_reused: f.native_mismatch_percent_reported,
        native_limit_percent: 2,
        native_vectorize_replays: 0,
        new_pixel_metric_claim: false,
      },
    },
  };
});

const context = fs.readFileSync(author.source.source226_context.path, "utf8");
assert.ok(context.includes("家，甚至也是很有才华的体操家."));
const note = file(path.join(own, "source-first-observations.md"));
const helper = file(path.join(root, ".claude/skills/ld-s10y-lesson/tools/svg_raster.js"));
const report = {
  schema: "d749/source-raw-svg-independent-review@1",
  ticket: "STEMROBIN-181",
  reviewer: "d749",
  batch: "source227228",
  date: "2026-11-18",
  sole_checkout: root,
  owned_directory: own,
  status: "PASS",
  gates: { SOURCE: "PASS", RAW: "PASS", SVG: "PASS" },
  authorization: "Offline independent review only; no fullcard review, publication, canonical promotion or prior/future page approval.",
  author_report: authorBinding,
  input_hash_verification: {
    status: "PASS",
    report_sha256_matches_direct_instruction: true,
    unique_report_referenced_files_verified: 40,
    total_including_author_report: bindings.size,
    verified_before_visual_review_and_rechecked_when_writing_report: true,
    exact_inputs: [...bindings.values()],
  },
  independence: {
    source_first_observations: note,
    order: "Report/rules/hash checks; grid227; grid228; persist source-only observations; candidate227/228 and text-only source226/receipts; RAW199; RAW200; resvg previews; SVG199; SVG200.",
    authored_semantic_claims_are_not_evidence: true,
    receipt_reuse_is_not_visual_approval: true,
    source226_mode: "text_only",
    source229_read: false,
  },
  pages,
  inventory_and_joins: {
    numbered_figures: ["fig-199", "fig-200"],
    no_exercise_or_table_in_authorized_pages: true,
    colour_plate_references: {
      literal: ["彩图 III，1", "彩图 III，2及3"],
      new_visible_figures_in_these_pages: false,
      plate_pixels_read: false,
      scope: "References retained; unseen plate availability and fidelity not approved.",
    },
    incoming_source226: {
      input: author.source.source226_context,
      status: "PASS",
      evidence: "The source226 biography p cont closes with 家，甚至也是很有才华的体操家. Source227 begins a visibly indented, distinct Young conclusion paragraph, not a continuation. Unit context continues; paragraph does not.",
      no_prior_page_visual_approval: true,
    },
    within_source227: {
      status: "PASS",
      join: ["p0227#5 open", "p0227#8 cont"],
      exact_join: "思路的 + 基础），",
      caption: "p0227#7 samerow",
      paragraph_closed_on_page: true,
    },
    source227_to_source228: {
      status: "PASS",
      evidence: "Source227 closes with the complete sentence about wave2's longer path. Source228 begins an indented new paragraph and retains it as p, neither open nor cont.",
    },
    within_source228: {
      status: "PASS",
      join: ["p0228#5 open", "p0228#8 cont"],
      exact_join: "因为透 + 镜的曲率半径",
      caption: "p0228#7 samerow",
      equation_number: "(7.6)",
    },
    source84_right: {
      confirmed_locally: true,
      last_block: "p0227#1",
      following_heading: "p0227#2: 85. 牛顿环",
      entire_unit84_approved: false,
    },
    source85: {
      left: "p0227#2: 85. 牛顿环",
      right_main_prose: "p0228#2, before p0228#3: 86. 光的波长",
      boundaries_observed_in_pixels: true,
      late_footnote: "p0228#10: p footnote",
      footnote_owner: "Unit85 p0228#1 via unique printed ①; not unit86 despite physical placement.",
      locally_bounded_source_segment: true,
      fullcard_reviewed: false,
      assembled: false,
    },
    source86: {
      left: "p0228#3: 86. 光的波长",
      left_observed_in_pixels: true,
      final_main_block: "p0228#9 is a closed paragraph/formula statement, not a unit boundary.",
      right_boundary: "UNREAD / UNCONFIRMED",
      complete: false,
      fullcard_reviewed: false,
      source229_read: false,
    },
  },
  usage: {
    image_batches: 1,
    reviewer_image_opens: 6,
    reviewer_context_image_total: 6,
    batch_limit: 8,
    grids: 2,
    raw_crops: 2,
    svg_previews: 2,
    detail_images: 0,
    reopens: 0,
    image_ledger: [
      { ordinal: 1, kind: "source_grid", ...pages[0].inputs.inspected_grid },
      { ordinal: 2, kind: "source_grid", ...pages[1].inputs.inspected_grid },
      { ordinal: 3, kind: "raw", ...pages[0].inputs.raw },
      { ordinal: 4, kind: "raw", ...pages[1].inputs.raw },
      { ordinal: 5, kind: "svg_preview", ...pages[0].inputs.preview },
      { ordinal: 6, kind: "svg_preview", ...pages[1].inputs.preview },
    ],
    reviewer_calls: {
      prepare: 0, finalize: 0, vectorize: 0, assemble: 0,
      reindex: 0, paid: 0, resvg_preview: 2, passed_stage_replays: 0,
    },
    reused_author_calls: {
      finalize: 2, finalize_by_page: { 227: 1, 228: 1 },
      vectorize: 2, vectorize_by_page: { 227: 1, 228: 1 },
      author_image_opens_reported: 6,
      author_images_not_replayed_or_loaded_from_history: true,
    },
    preview_generation: {
      helper,
      runtime: "Existing .claude/skills/ld-s10y-lesson/node_modules/@resvg/resvg-js; no install, external documentation, alternate renderer, or vectorization.",
      commands: pages.map((p) => ({
        cwd: root,
        argv: ["node", helper.path, p.inputs.svg.path, p.inputs.preview.path],
        status: "PASS",
        dimensions_px: p.gates.RAW.dimensions_px,
      })),
    },
  },
  stop_rule: {
    first_defect: null,
    dependent_gate_skipped: false,
    rule: "Any first SOURCE or RAW defect would stop that input's dependent gates; no content defects found.",
  },
  scope: {
    candidate_edits: 0, canonical_writes: 0, evidence_writes: 0,
    meter_writes: 0, index_writes: 0, source_finalize_calls: 0,
    vectorize_calls: 0, reassembly_calls: 0, git_commands: 0,
    database_calls: 0, external_calls: 0, chats: 0, subagents: 0,
    whole_tests: 0, fullcard_reviews: 0,
    writes_only_in_owned_directory: true,
    others_preserved: true,
  },
  report_writer: file(__filename),
};
const out = path.join(own, "report.json");
fs.writeFileSync(out, JSON.stringify(report, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify({ report: file(out), status: report.status, gates: report.gates, image_opens: 6, native_stage_replays: 0 }, null, 2));

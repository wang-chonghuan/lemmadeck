import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const workspace = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const owned = path.join(workspace, ".intentfold/tickets/STEMROBIN-181/tmp/d560-source202-first-independent-review");
const source = path.join(workspace, ".intentfold/tickets/STEMROBIN-181/tmp/d554-source202-first-author/source/10p/pages/0202");
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const inventory = read(path.join(owned, "sourceinventory.json"));
const page = read(path.join(source, "page.json"));
const audit = read(path.join(source, "audit.json"));
const md = fs.readFileSync(path.join(source, "page.md"), "utf8").split("\n");
const bodyStart = md.indexOf("---", md.indexOf("---") + 1) + 1;
const markdownBlocks = [];
for (let index = bodyStart; index < md.length; index += 1) {
  const match = md[index].match(/^<!-- (.+) -->$/);
  if (!match) continue;
  const rows = [];
  for (let row = index + 1; row < md.length && md[row].trim() && !md[row].startsWith("<!--"); row += 1) {
    rows.push({ md_line: row + 1, literal: md[row] });
  }
  markdownBlocks.push({ declaration: match[1], declaration_md_line: index + 1, rows });
}
const plain = (value) => value.replace(/\$([^$]+)\$/g, "$1").replaceAll("*", "");
const punctuation = new Map([["，", ","], ["（", "("], ["）", ")"], ["：", ":"], ["；", ";"]]);
const comparable = (value) => Array.from(plain(value)).map((letter) => punctuation.get(letter) ?? letter).join("").replace(/\s/g, "");
const rowGroups = [
  { block: 0, source_id: "heading", rows: [inventory.heading.literal] },
  { block: 1, source_id: "P1", rows: inventory.paragraphs[0].printed_rows },
  { block: 4, source_id: "fig-177 caption", rows: [inventory.figures[0].caption.literal] },
  { block: 5, source_id: "fig-178 caption", rows: [inventory.figures[1].caption.literal] },
  { block: 6, source_id: "P2", rows: inventory.paragraphs[1].printed_rows },
  { block: 7, source_id: "P3", rows: inventory.paragraphs[2].printed_rows },
  { block: 8, source_id: "P4 open", rows: inventory.paragraphs[3].printed_rows },
  { block: 9, source_id: "footer numeral and two dot ornaments", rows: ["• 192 •"] }
];
const rows = rowGroups.flatMap((group) => group.rows.map((literal, index) => {
  const candidate = page.blocks[group.block].lines[index];
  const mdRow = markdownBlocks[group.block]?.rows[index];
  const supplement = group.block === 1 && index === 4 ? "S1" : null;
  const adjudicated = supplement
    ? "所示符号来表示会聚透镜, 而发散透镜用图.178所示的符号"
    : literal;
  return {
    source_group: group.source_id,
    printed_row_in_group: index + 1,
    native_ref: `p0202#${group.block + 1}`,
    json_pointer: `/blocks/${group.block}/lines/${index}`,
    md_line: mdRow?.md_line ?? null,
    frozen_inventory_literal: literal,
    candidate_literal: candidate,
    markdown_literal: mdRow?.literal ?? null,
    exact_md_json_match: candidate === mdRow?.literal,
    exact_inventory_candidate_match: literal === candidate,
    inventory_candidate_match_with_declared_markup_punctuation_spacing_comparison: comparable(literal) === comparable(candidate),
    source_crop_adjudication: supplement,
    source_adjudicated_literal: adjudicated,
    source_adjudicated_candidate_match: comparable(adjudicated) === comparable(candidate),
    status: comparable(adjudicated) === comparable(candidate) && candidate === mdRow?.literal ? "PASS" : "HOLD"
  };
}));
const expectedKinds = ["h3", "p", "fig", "fig", "cap", "cap", "p", "p", "p", "foot"];
const expectedLengths = [1, 6, 0, 0, 1, 1, 3, 7, 2, 1];
const structure = page.blocks.map((block, index) => ({
  native_ref: `p0202#${index + 1}`,
  json_pointer: `/blocks/${index}`,
  expected_kind: expectedKinds[index],
  actual_kind: block.kind,
  expected_text_rows: expectedLengths[index],
  actual_text_rows: block.lines.length,
  open: block.open,
  expected_open: index === 8,
  cont: block.cont,
  expected_cont: false,
  samerow: block.samerow,
  expected_samerow: index === 5,
  matches_inventory_structure: block.kind === expectedKinds[index]
    && block.lines.length === expectedLengths[index]
    && block.open === (index === 8)
    && block.cont === false
    && block.samerow === (index === 5)
}));
const figures = audit.figures.map((figure, index) => ({
  id: figure.id,
  audit_box: figure.box,
  page_json_block_box: page.blocks[index + 2].box,
  page_json_meta_box: page.meta.figures[index].box,
  all_candidate_boxes_identical: JSON.stringify(figure.box) === JSON.stringify(page.blocks[index + 2].box)
    && JSON.stringify(figure.box) === JSON.stringify(page.meta.figures[index].box),
  visual_crop_completeness: "See independent per-figure decisions in report.json, not the component count.",
  components_mechanical_only: figure.components
}));
const evidence = {
  schema: "d560/line-by-line-comparison-evidence@1",
  compared_at_utc: new Date().toISOString(),
  purpose: "Read-only exact row and declared representation comparison, not any source-pipeline validator or replay.",
  files: ["page.md", "page.json", "audit.json"].map((name) => ({
    path: path.join(source, name), sha256: hash(fs.readFileSync(path.join(source, name)))
  })),
  independent_inventory: {
    path: path.join(owned, "sourceinventory.json"),
    sha256: hash(fs.readFileSync(path.join(owned, "sourceinventory.json"))),
    unchanged_expected_sha256: "bd278fee221fc14fa32c3f4f13fb09c287e71bb1138fee9b8782ef808d7cc7eb"
  },
  comparison_policy: {
    exact_md_json_match_required: true,
    whitespace_only_for_source_typesetting_gaps_ignored: true,
    declared_equivalent_punctuation: Object.fromEntries(punctuation),
    periods_not_removed_or_normalized_away: true,
    candidate_markup_removed_for_literal_comparison: ["$AB$", "$A$", "$AC$", "paired emphasis asterisks in P2"],
    markup_source_fidelity: "Separately observed in source lower-prose crop; see supplementary-observations.json S2 and report.",
    sourceinventory_first_observation_omission_explicitly_retained: "P1 row 5 omits the printed dot; only source crop observation S1 adjudicates it.",
    sourceinventory_not_rewritten: true
  },
  rows,
  structure,
  figures,
  row_counts: {
    independently_observed_prose_rows: inventory.row_accounting.prose_rows,
    candidate_prose_rows: page.blocks.filter((block) => block.kind === "p").reduce((count, block) => count + block.lines.length, 0),
    independently_observed_physical_text_rows: inventory.row_accounting.physical_nonfigure_text_rows_including_heading_captions_footer,
    independently_observed_logical_text_rows: rows.length,
    candidate_logical_text_rows: page.blocks.reduce((count, block) => count + block.lines.length, 0),
    candidate_physical_rows_from_samerow: page.blocks.reduce((count, block) => count + block.lines.length - (block.samerow ? 1 : 0), 0),
    audit_lines_printed: audit.lines_printed,
    audit_lines_md: audit.lines_md,
    metadata_printed_lines: page.meta.printed_lines
  },
  audit_observations: {
    errors: audit.errors,
    unknown_chars: audit.unknown_chars,
    normalizations: audit.normalizations,
    katex_warnings: audit.katex_warnings,
    errata: audit.errata,
    authoritative_visual_truth: false
  },
  summary: {
    compared_literal_rows: rows.length,
    md_json_mismatch_count: rows.filter((row) => !row.exact_md_json_match).length,
    frozen_inventory_literal_disagreements_after_declared_representation_comparison: rows.filter((row) => !row.inventory_candidate_match_with_declared_markup_punctuation_spacing_comparison).length,
    explicit_source_crop_adjudications: rows.filter((row) => row.source_crop_adjudication).length,
    unresolved_row_count: rows.filter((row) => row.status !== "PASS").length,
    structure_mismatch_count: structure.filter((block) => !block.matches_inventory_structure).length,
    candidate_block_count: page.blocks.length,
    assemble_invocations: 0
  }
};
const target = path.join(owned, "line-comparison-evidence.json");
fs.writeFileSync(target, `${JSON.stringify(evidence, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ path: target, sha256: hash(fs.readFileSync(target)), ...evidence.summary, row_counts: evidence.row_counts }, null, 2));

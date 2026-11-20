import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { isDeepStrictEqual } from "node:util";

const root = "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck";
if (process.cwd() !== root) throw new Error("Unexpected cwd");
const out = path.join(root, ".intentfold/tickets/STEMROBIN-188/tmp/n46-note-source175176-review-02");
const manifest = JSON.parse(fs.readFileSync(path.join(root, ".intentfold/tickets/STEMROBIN-188/tmp/source175176-review-inputs-01/manifest.json"), "utf8"));
const sha = p => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const expectedRows = new Map([[175, 18], [176, 15]]);
const pages = [];
for (const entry of manifest.pages) {
  const md = fs.readFileSync(entry.candidateMD.path, "utf8");
  const json = JSON.parse(fs.readFileSync(entry.candidateJSON.path, "utf8"));
  const audit = JSON.parse(fs.readFileSync(entry.audit.path, "utf8"));
  const front = md.match(/^---\n([\s\S]*?)\n---\n/);
  if (!front) throw new Error("Missing JSON frontmatter");
  const meta = JSON.parse(front[1]);
  const body = md.slice(front[0].length);
  const segments = [...body.matchAll(/<!-- ([^>]+) -->\n([\s\S]*?)(?=\n<!-- |$)/g)];
  const comparisons = segments.map((match, i) => {
    const header = match[1].trim();
    const kind = header.split(" ")[0];
    const j = json.blocks[i];
    const lines = match[2].trimEnd().split("\n");
    const flags = Object.fromEntries(["open", "cont", "samerow"].map(f => [f, header.split(" ").includes(f)]));
    const label = kind === "ex" ? header.split(" ")[1]
      : ["fig", "cap"].includes(kind) ? header.match(/^\\?(?:fig|cap) (图 \d+)/)?.[1] : null;
    const box = kind === "fig" ? header.match(/\bbox (\d+),(\d+),(\d+),(\d+)/)?.slice(1).map(Number) : null;
    const imageMatch = kind === "fig" ? lines[0]?.match(/^!\[(图 \d+)\]\(figures\/(fig-g10-\d+)\.png\)$/) : null;
    return {
      one_based_block: i + 1,
      kind,
      label,
      flags,
      body_rows: kind === "fig" ? 0 : lines.length,
      md_json_equal: !!j && kind === j.kind && label === j.label
        && isDeepStrictEqual(box, j.box)
        && Object.entries(flags).every(([f, value]) => value === j[f])
        && (kind === "fig" ? imageMatch?.[1] === j.label && imageMatch?.[2] === j.id : isDeepStrictEqual(lines, j.lines))
    };
  });
  const rows = json.blocks.reduce((n, b) => n + b.lines.length - (b.samerow && b.lines.length ? 1 : 0), 0);
  const refs = json.blocks.flatMap((b, i) => ["ex", "p"].includes(b.kind)
    ? [...b.lines.join("").matchAll(/图\s*(\d+)/g)].map(m => ({ block: i + 1, kind: b.kind, exercise: b.label, figure: `fig-g10-${m[1]}` }))
    : []);
  const formulas = json.blocks.flatMap((b, i) => b.lines.flatMap((line, row) =>
    [...line.matchAll(/\$([^$]*)\$/g)].map(m => ({ block: i + 1, printed_row_within_block: row + 1, latex: m[1] }))));
  pages.push({
    page: entry.page,
    bindings: [entry.original, entry.candidateMD, entry.candidateJSON, entry.audit].map(b => ({ path: b.path, raw_sha256: sha(b.path) })),
    metadata_equal: isDeepStrictEqual(meta, json.meta),
    render_hash_matches_original: meta.render.sha256 === entry.original.sha256,
    blocks_equal: comparisons.length === json.blocks.length && comparisons.every(b => b.md_json_equal),
    block_comparisons: comparisons,
    printed_rows_from_blocks: rows,
    FIRST_independent_expected_rows: expectedRows.get(entry.page),
    recorded_audit: { lines_printed: audit.lines_printed, lines_md: audit.lines_md, unknown_chars: audit.unknown_chars, katex_warnings: audit.katex_warnings, errors: audit.errors, count_exclusions: audit.count_exclusions },
    row_counts_agree: [meta.printed_lines, audit.lines_printed, audit.lines_md, expectedRows.get(entry.page)].every(n => n === rows),
    figures_agree: entry.figures.every(f => isDeepStrictEqual(meta.figures.find(m => m.id === f.id)?.box, f.exactBox) && isDeepStrictEqual(audit.figures.find(m => m.id === f.id)?.box, f.exactBox)),
    prose_and_exercise_references: refs,
    formula_inventory: formulas,
    dollar_delimiters_balanced_by_row: json.blocks.every(b => b.lines.every(line => (line.match(/\$/g)?.length ?? 0) % 2 === 0)),
    prohibited_math_minus_or_superscript_unicode: formulas.some(f => /[\u2212\u00b2\u00b3]/u.test(f.latex)),
    cyrillic_subpart_sequence_applicable: false,
    native_finalize_or_validator_rerun: false,
    fresh_katex_render: false
  });
}
const p175 = JSON.parse(fs.readFileSync(manifest.pages[0].candidateJSON.path, "utf8"));
const p176 = JSON.parse(fs.readFileSync(manifest.pages[1].candidateJSON.path, "utf8"));
const start = p175.blocks.find(b => b.kind === "ex" && b.label === "62");
const continuation = p176.blocks[0];
const predecessor = JSON.parse(fs.readFileSync(manifest.predecessor.candidateJSON.path, "utf8"));
const predecessorTail = predecessor.blocks.filter(b => !["fig", "cap", "foot"].includes(b.kind)).at(-1);
const result = {
  scope: "Independent textual/structural comparison only; does not close localized ink/glyph HOLDs",
  pages,
  boundary_join: {
    before: { exercise: start.label, open: start.open, literal_suffix: start.lines.at(-1).slice(-8) },
    after: { exercise: continuation.label, cont: continuation.cont, open: continuation.open, literal_prefix: continuation.lines[0].slice(0, 2) },
    same_exercise_open_cont_closes: start.open && continuation.cont && !continuation.open && start.label === continuation.label,
    joined_text: [...start.lines, ...continuation.lines].join(""),
    printed_number_not_inserted_on_176: !/^\d+\./.test(continuation.lines[0]),
    predecessor_text_only: {
      binding: manifest.predecessor.candidateJSON,
      last_exercise: predecessorTail.label,
      last_exercise_open: predecessorTail.open,
      next_actual_exercise: p175.blocks[0].label,
      textual_number_sequence_58_to_59: predecessorTail.label === "58" && !predecessorTail.open && p175.blocks[0].label === "59",
      whole_predecessor_approval: false,
      predecessor_pixel_loads: 0
    },
    page176_last_body_paragraph_open: p176.blocks.filter(b => !["fig", "cap", "foot"].includes(b.kind)).at(-1).open,
    next_page_not_read: true,
    n48_completion_inferred: false,
    n49_completion_inferred: false
  },
  source_mathematical_tasks_recomputed: 0,
  native_source_changed: false
};
const output = path.join(out, "source-comparison.json");
fs.writeFileSync(output, JSON.stringify(result, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify({ path: output, pages: pages.map(p => ({ page: p.page, metadata_equal: p.metadata_equal, blocks_equal: p.blocks_equal, row_counts_agree: p.row_counts_agree, figures_agree: p.figures_agree })), boundary_join: result.boundary_join }, null, 2));
if (pages.some(p => !p.metadata_equal || !p.blocks_equal || !p.row_counts_agree || !p.figures_agree)) process.exitCode = 1;

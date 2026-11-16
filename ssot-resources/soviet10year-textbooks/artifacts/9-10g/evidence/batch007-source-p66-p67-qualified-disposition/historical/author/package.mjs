import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = "/Users/yong/.codex/worktrees/a07e/lemmadeck";
const evidence = path.dirname(new URL(import.meta.url).pathname);
const ticketTmp = path.dirname(evidence);
const reportPath = path.join(ticketTmp, "source-9g-p66-p67-author-report.md");
const manifestPath = path.join(ticketTmp, "source-9g-p66-p67-author-manifest.json");
const hash = (b) => crypto.createHash("sha256").update(b).digest("hex");
const read = (p) => fs.readFileSync(p);
const json = (p) => JSON.parse(read(p).toString("utf8"));
const putJson = (p, o) => fs.writeFileSync(p, JSON.stringify(o, null, 2) + "\n", { flag: "wx" });
const binding = (p) => {
  const bytes = read(p);
  return { path: p, bytes: bytes.length, sha256: hash(bytes) };
};
const before = json(path.join(evidence, "preservation-before.json"));
const observations = json(path.join(evidence, "source-observations.json"));
const cropObservations = json(path.join(evidence, "official-crop-observations.json"));
const imageBudget = json(path.join(evidence, "image-loads.json"));
const finalizations = [];
const pages = [];
const crops = [];
const firstFailure = fs.existsSync(path.join(evidence, "first-failure.json"))
  ? json(path.join(evidence, "first-failure.json")) : null;

// Report creation is mechanical: every block and row comes from retained bytes.
for (const n of [66, 67]) {
  const padded = String(n).padStart(4, "0");
  const pdir = path.join(root, "ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages", padded);
  const cdir = path.join(evidence, "commands", `${n === 66 ? "018" : "019"}-finalize-${padded}`);
  const result = json(path.join(cdir, "result.json"));
  const rawPath = path.join(cdir, "before-finalize", "ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages", padded, "page.md");
  const pageJson = json(path.join(pdir, "page.json"));
  const audit = json(path.join(pdir, "audit.json"));
  const rows = [];
  let ordinal = 0;
  const rowEnds = [];
  const fullBlocks = pageJson.blocks.map((block, i) => {
    const physicalRows = [];
    if (block.kind !== "fig") {
      for (const line of block.lines) {
        for (const segment of line.split("↵")) {
          ordinal += 1;
          const codepoints = [...segment];
          const row = {
            ordinal, block_ref: `p${padded}#${i + 1}`, kind: block.kind,
            label: block.label, cont: block.cont, open: block.open,
            samerow: block.samerow, text: segment,
            final_codepoints: codepoints.slice(-24),
            trailing_ascii_spaces: segment.length - segment.trimEnd().length
          };
          rows.push(row);
          physicalRows.push(row);
          rowEnds.push({ ordinal, block_ref: row.block_ref, text: segment, last24_codepoints: row.final_codepoints, trailing_ascii_spaces: row.trailing_ascii_spaces });
        }
      }
    }
    return { block_ref: `p${padded}#${i + 1}`, ...block, physical_rows: physicalRows };
  });
  const assembledText = pageJson.blocks.filter((b) => b.kind !== "fig").map((b) => b.lines.join("").replaceAll("↵", "")).join("\n");
  const math = [...assembledText.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g)].map((m) => ({ tex: m[1] ?? m[2], display: !!m[1] }));
  const pageRecord = {
    physical_page: n, printed_page: pageJson.meta.printed_page,
    original_target_exists: false, raw_author_binding: binding(rawPath),
    raw_author_md: read(rawPath).toString("utf8"),
    final_md_binding: binding(path.join(pdir, "page.md")),
    final_md: read(path.join(pdir, "page.md")).toString("utf8"),
    page_json_binding: binding(path.join(pdir, "page.json")),
    audit_binding: binding(path.join(pdir, "audit.json")),
    metadata: pageJson.meta, full_final_blocks: fullBlocks,
    full_physical_rows: rows, full_row_ends: rowEnds,
    all_math_spans: math, audit,
    first_finalize: result, pipeline_exit: result.exit_code
  };
  putJson(path.join(evidence, `page-${padded}.full-body-and-rows.json`), pageRecord);
  pages.push(pageRecord);
  finalizations.push({
    physical_page: n, actual_argv: result.actual_argv,
    started_at: result.started_at, ended_at: result.ended_at,
    exit_code: result.exit_code, signal: result.signal,
    start: binding(path.join(cdir, "start.json")),
    result: binding(path.join(cdir, "result.json")),
    stdout: binding(path.join(cdir, "stdout.raw")),
    stderr: binding(path.join(cdir, "stderr.raw")),
    before_full_byte_snapshot: binding(path.join(cdir, "before-finalize.json")),
    after_full_byte_snapshot: binding(path.join(cdir, "after-finalize.json"))
  });
  for (const figure of audit.figures) {
    const crop = path.join(root, ".tmp/ld-s10y-lesson/9-10g/pages", padded, "figures", `${figure.id}.png`);
    const bytes = read(crop);
    const destination = path.join(evidence, `${figure.id}.official-crop.png`);
    fs.writeFileSync(destination, bytes, { flag: "wx" });
    const width = bytes.readUInt32BE(16);
    const height = bytes.readUInt32BE(20);
    const cropRecord = {
      schema: "source-author-official-crop@1",
      id: figure.id, physical_page: n,
      source: before.records.filter((r) => r.category === "source-input" && r.path.includes(`/pages/${padded}/`)),
      crop: binding(crop), retained_copy: binding(destination),
      actual_machine_geometry: figure, padding: 12,
      dimensions: { width, height },
      semantic_inventory: observations.figures[figure.id],
      crop_observation: cropObservations.figures[figure.id],
      owner_exercise: null,
      inspected_once: true,
      pixel_comparison: { performed: false, status: "NOT_RUN", no_pixel_pass_claim: true }
    };
    putJson(path.join(evidence, `${figure.id}.official-crop.json`), cropRecord);
    crops.push(cropRecord);
  }
}

const currentBindings = before.records.filter((r) => ["source-input", "book-guard", "tool-identity", "python-identity", "toc-identity-only"].includes(r.category)).map((r) => {
  const current = binding(path.join(root, r.path));
  return { ...current, expected_sha256: r.sha256, unchanged: current.sha256 === r.sha256 };
});
const moduleBindings = json(path.join(evidence, "tool-inputs-before.json")).map((r) => {
  const current = binding(path.join(root, r.path));
  return { ...current, expected_sha256: r.sha256, unchanged: current.sha256 === r.sha256 };
});
const nestedToolFiles = [
  ".claude/skills/ld-s10y-lesson/tools/katex_check.js",
  ".claude/skills/ld-s10y-lesson/node_modules/katex/package.json",
  ".claude/skills/ld-s10y-lesson/node_modules/katex/dist/katex.js"
].map((rel) => {
  const bytes = read(path.join(root, rel));
  const dest = path.join(evidence, "observed-tools-after", rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, bytes, { flag: "wx" });
  return { ...binding(path.join(root, rel)), raw_copy: dest, timing: "observed after first finalizations; not claimed a pre-finalize snapshot" };
});
const commands = fs.readdirSync(path.join(evidence, "commands")).sort().map((name) => {
  const directory = path.join(evidence, "commands", name);
  const start = json(path.join(directory, "start.json"));
  const resultPath = path.join(directory, "result.json");
  return {
    directory, start,
    result: fs.existsSync(resultPath) ? json(resultPath) : null,
    stdout: fs.existsSync(path.join(directory, "stdout.raw")) ? binding(path.join(directory, "stdout.raw")) : null,
    stderr: fs.existsSync(path.join(directory, "stderr.raw")) ? binding(path.join(directory, "stderr.raw")) : null
  };
});
const report = [
  "# SOURCE AUTHOR: 9-10g physical66/67",
  "",
  "Ticket STEMROBIN-184; active same invocation; independent fresh author, not reviewer.",
  "Inputs: only the two page grids, two original PNGs, two layout JSON files, two templates; TOC used only after the actual §18 heading was seen, for identities §17/§18.",
  "No old transcription/review/answer/choice/modern/SVG/spec/other-page pixels were opened. No prepare, backend, Git, DB, build/test, production, publish, deploy, assemble, vectorize, adapt, promote, merge or close action was run.",
  "Both durable target directories were absent before writing. Complete source/tool/book input bytes, absence records, raw authored bytes and after-finalize bytes are retained.",
  "",
  "## First finalizations",
  ...finalizations.map((f) => `- physical${f.physical_page}: exit ${f.exit_code}; ${f.started_at} to ${f.ended_at}; argv ${JSON.stringify(f.actual_argv)}; full stdout/stderr/start/result and before/after tree snapshots in ${path.dirname(f.start.path)}.`),
  "No first actual pipeline/helper failure occurred; no retry, repair, counter adjustment, count exclusion or count override was made.",
  "",
  "## Full source observations",
  "```json",
  JSON.stringify(observations, null, 2),
  "```",
  "",
  "## Official crops",
  "Both official crops were inspected once. The only geometries used are the first-finalize audit boxes, with actual padding 12. No pixel comparison was performed and no pixel PASS is claimed.",
  "Each per-crop JSON file is a dictionary, not an aggregate list treated as a crop dictionary.",
  "```json",
  JSON.stringify(crops, null, 2),
  "```",
  "",
  "## Full input and tool byte bindings",
  "```json",
  JSON.stringify({ preserved_before: before, current: currentBindings, helper_modules: moduleBindings, observed_nested_tools: nestedToolFiles }, null, 2),
  "```",
  "",
  "## Image budget",
  "```json",
  JSON.stringify(imageBudget, null, 2),
  "```",
  "",
  "## Commands and audit limits",
  read(path.join(evidence, "initial-command-log.md")).toString("utf8"),
  "Exact bootstrap command:",
  "```text",
  read(path.join(evidence, "bootstrap-command.txt")).toString("utf8"),
  "```",
  "All later subprocess argv were durably recorded before launch by the wrapper. Initial instruction outputs are recoverable from preserved bytes plus recorded sed ranges.",
  "The nested KaTeX command is `node .claude/skills/ld-s10y-lesson/tools/katex_check.js` with skill-directory cwd, invoked by unchanged mathcheck.py. The pipeline captures that child's stdout/stderr internally; they are not separately exposed by p2c. Its contract/code identity is retained; no separately timestamped nested child record is invented.",
  "The packaging command's start record is included below; its stdout/stderr/result are written by the wrapper after this generated manifest/report. Those post-package log files remain in the evidence directory and are outside the self-referential hash inventory.",
  "```json",
  JSON.stringify(commands, null, 2),
  "```"
];
for (const page of pages) {
  report.push(
    "",
    `## Physical${page.physical_page}: Full raw authored page`,
    "```markdown", page.raw_author_md, "```",
    `## Physical${page.physical_page}: Full finalized page`,
    "```markdown", page.final_md, "```",
    `## Physical${page.physical_page}: All blocks, rows, row ends, math, audit`,
    "```json",
    JSON.stringify({
      metadata: page.metadata, full_final_blocks: page.full_final_blocks,
      full_physical_rows: page.full_physical_rows, full_row_ends: page.full_row_ends,
      all_math_spans: page.all_math_spans, audit: page.audit
    }, null, 2),
    "```"
  );
}
report.push("", "## Freeze", "Source author batch stops here. §17 and exercises174-178 are closed by this source batch; §18 remains OPEN, with the last physical67 paragraph ending exactly in 映射成. No next-page inference is supplied.", "Parent may disclose the full package only after the independent Stage A freeze; no reviewer output was read.", "");
fs.writeFileSync(reportPath, report.join("\n"), { flag: "wx" });
const files = [];
function inventory(dir) {
  for (const name of fs.readdirSync(dir).sort()) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) inventory(p);
    else files.push(binding(p));
  }
}
inventory(evidence);
const manifest = {
  schema: "source-author-manifest@1",
  frozen_at: new Date().toISOString(),
  role: "SOURCE AUTHOR",
  cwd: root, ticket: "STEMROBIN-184", book: "9-10g",
  physical_pages: [66, 67], printed_pages: [59, 60],
  outputs: { report: binding(reportPath), evidence_directory: evidence },
  target_before: before.records.filter((r) => r.category === "target-before"),
  current_source_tool_book_bindings: currentBindings,
  current_helper_bindings: moduleBindings,
  first_finalizations: finalizations,
  first_failure: firstFailure,
  pages: pages.map((p) => ({
    physical_page: p.physical_page, printed_page: p.printed_page,
    raw_author: p.raw_author_binding, final_md: p.final_md_binding,
    page_json: p.page_json_binding, audit: p.audit_binding,
    full_body_rows_math: binding(path.join(evidence, `page-${String(p.physical_page).padStart(4, "0")}.full-body-and-rows.json`))
  })),
  per_crop_dictionaries: crops.map((c) => binding(path.join(evidence, `${c.id}.official-crop.json`))),
  image_budget: imageBudget,
  source_observations: binding(path.join(evidence, "source-observations.json")),
  all_actual_recorded_commands: commands,
  initial_command_log: binding(path.join(evidence, "initial-command-log.md")),
  byte_inventory: files,
  exclusions_from_recursive_hash_inventory: ["manifest itself", "wrapper packaging result/stdout/stderr written after package generation"],
  audit_limits: [
    "Initial pwd was not pre-recorded; later initial reads/preservation were pre-announced but lacked durable command-start records.",
    "Initial command start/end timestamps and separate stderr bytes were not exposed by the tool; no fabricated records.",
    "Nested KaTeX subprocess output is captured inside unchanged pipeline, not separately exposed.",
    "Nested KaTeX tool files were identified and copied after finalizations, not claimed pre-finalize bindings."
  ],
  prohibitions: { prepare_calls: 0, retry_calls: 0, other_page_pixels: 0, reviewer_output_reads: 0, test_build_calls: 0, backend_calls: 0, git_calls: 0, db_calls: 0, production_calls: 0, vectorize_assemble_adapt_promote_calls: 0, book_changed_by_author: false },
  publication: { parent_disclosure: "only after independent Stage A freeze", source_batch_stopped: true }
};
putJson(manifestPath, manifest);
console.log(JSON.stringify({
  report: binding(reportPath), manifest: binding(manifestPath),
  preservation: binding(path.join(evidence, "preservation-before.json")),
  pages: manifest.pages, crops: manifest.per_crop_dictionaries,
  book_guard: currentBindings.find((r) => r.path.endsWith("/book.json")),
  budget: { images_loaded: imageBudget.images_loaded, batch_limit: 8, context_images: imageBudget.context_images, context_limit: 24 },
  input_tool_drift: [...currentBindings, ...moduleBindings].filter((r) => !r.unchanged)
}, null, 2));

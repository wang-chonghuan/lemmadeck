const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");

const cwd = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
assert.equal(process.cwd(), cwd);
const scratch = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13/source251-258-author";
const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const save = (name, value) => fs.writeFileSync(
  path.join(scratch, name),
  `${JSON.stringify(value, null, 2)}\n`,
  { flag: "wx" },
);
const refs = [];
const addRef = (file, role) => refs.push({ path: file, role, sha256: hash(file) });
const pages = [];
const images = [];

for (let page = 251; page <= 258; page += 1) {
  const id = String(page).padStart(4, "0");
  const durable = `ssot-resources/soviet10year-textbooks/artifacts/7a/pages/${id}`;
  const work = `.tmp/ld-s10y-lesson/7a/pages/${id}`;
  const source = `${scratch}/page${id}.first-source.md`;
  const grid = `${work}/page.grid.png`;
  const view = readJson(`${durable}/page.json`);
  const audit = readJson(`${durable}/audit.json`);
  const receipt = readJson(`${scratch}/finalize${id}.receipt.json`);
  const ex = view.blocks.filter((block) => block.kind === "ex");
  pages.push({
    page,
    printed_page: view.meta.printed_page,
    blocks: view.blocks.length,
    lines_md: audit.lines_md,
    lines_printed: audit.lines_printed,
    figures: audit.figures,
    exercise_fragment_count: ex.length,
    exercise_fragments: ex.map((block) => ({
      number: block.number,
      label: block.label,
      open: block.open,
      cont: block.cont,
      source_ref: block.source_ref,
      lines: block.lines,
    })),
    open_or_cont_blocks: view.blocks
      .map((block, index) => ({ ...block, blockIndex: index + 1 }))
      .filter((block) => block.open || block.cont)
      .map((block) => ({
        blockIndex: block.blockIndex,
        kind: block.kind,
        number: block.number,
        label: block.label,
        open: block.open,
        cont: block.cont,
      })),
    errors: audit.errors,
    normalizations: audit.normalizations.length,
    finalize_calls: 1,
    finalize_exit: receipt.exit,
    startedAt: receipt.startedAt,
    finishedAt: receipt.finishedAt,
    command: receipt.command,
    source_pdf: view.meta.source,
    render: view.meta.render,
    first_source_md: source,
    durable_dir: durable,
    receipt: `${scratch}/finalize${id}.receipt.json`,
  });
  images.push({
    path: grid,
    detail: "original",
    visual_opens: 1,
    before: page - 251,
    after: page - 250,
    sha256: hash(grid),
  });
  addRef(grid, "single-view-source-grid");
  addRef(source, "frozen-first-source-md");
  for (const name of ["page.md", "page.json", "audit.json"]) {
    addRef(`${durable}/${name}`, "first-finalize-durable-output");
  }
  for (const suffix of ["start.json", "stdout", "stderr", "receipt.json"]) {
    addRef(`${scratch}/finalize${id}.${suffix}`, "first-finalize-execution-evidence");
  }
}

const report = {
  schema: "STEMROBIN-182/source251-258-author-report@1",
  generatedAt: new Date().toISOString(),
  cwd,
  branch: "codex/STEMROBIN-182-textbooks",
  independent_source_review: "pending; no source-content PASS",
  image_reads: {
    fresh_counter_before: 0,
    final_counter: 8,
    reopen_count: 0,
    extra_figure_or_crop_views: 0,
    additional_binding_views: 0,
  },
  finalize_calls: 8,
  finalize_pass_pages: pages.filter((p) => p.finalize_exit === 0).map((p) => p.page),
  finalize_failed_pages: pages.filter((p) => p.finalize_exit !== 0).map((p) => p.page),
  totals: {
    lines_md: pages.reduce((n, p) => n + p.lines_md, 0),
    lines_printed: pages.reduce((n, p) => n + p.lines_printed, 0),
    figures: pages.reduce((n, p) => n + p.figures.length, 0),
    exercise_fragments: pages.reduce((n, p) => n + p.exercise_fragment_count, 0),
  },
  first251_binding: {
    status: "technically resolved by direct user text-only 250 tail; first finalize failed row reconciliation",
    first_visible_exercise: "843, new, no cont",
    predecessor_tail: "842 complete, footer 244, no open block",
    toc_context: "n41 until n42 starts at physical 252 / printed 246",
    historical_hold: `${scratch}/binding0251.md`,
    resolution: `${scratch}/binding0251.resolution.md`,
  },
  final258_boundary: {
    completes_unit43: "example 3 root set {-4/3,5}; exercises 855,856; review exercise 857",
    starts_unit44: "44. 二次方程的根的公式, printed 252 / physical 258",
    equation1: "ax^2+bx+c=0, a!=0",
    equation2: "x^2+(b/a)x+c/a=0; complete final printed equation ending with a period",
    unit44_status: "boundary only, incomplete in this authorized range; no assembly/promotion",
    figures: 0,
    unresolved_margin_marks: true,
  },
  prohibited_actions_performed: [],
  pages,
};

save("image-ledger.json", images);
save("hashes.json", refs);
save("report.json", report);
console.log(JSON.stringify({
  pages: pages.map((p) => ({
    page: p.page,
    printed: p.printed_page,
    rows: `${p.lines_md}/${p.lines_printed}`,
    figures: p.figures.length,
    exercise_fragments: p.exercise_fragment_count,
    finalize_exit: p.finalize_exit,
  })),
  totals: report.totals,
  report_sha256: hash(`${scratch}/report.json`),
  hashes_sha256: hash(`${scratch}/hashes.json`),
  image_ledger_sha256: hash(`${scratch}/image-ledger.json`),
}, null, 2));

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const base = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d731-source225226-first-author");
if (process.cwd() !== repo) throw new Error(`Wrong cwd: ${process.cwd()}`);
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const describe = (file) => ({ path: file, sha256: hash(file), bytes: fs.statSync(file).size });
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const target = path.join(base, "reports/source225226-author-report.json");
if (fs.existsSync(target)) throw new Error(`Report already exists: ${target}`);
const observationsPath = path.join(base, "source-observations.json");
const observations = read(observationsPath);
const pageReports = [225, 226].map((page) => {
  const file = path.join(base, "reports", `p${String(page).padStart(4, "0")}-author.json`);
  return { file, report: read(file) };
});
if (observations.image_batch.opens.length > 8 || observations.image_batch.opens.length > 24) {
  throw new Error("Image batch/context bound exceeded.");
}
for (const { report } of pageReports) {
  for (const output of report.outputs) {
    if (hash(output.path) !== output.sha256) throw new Error(`Changed output: ${output.path}`);
  }
}
const pages = pageReports.map(({ file, report }) => ({
  physical_page: report.physical_page,
  printed_page: observations.pages[String(report.physical_page)].printed_page,
  page_report: describe(file),
  execution_status: report.execution_status,
  native_counts: report.native_counts,
  source_boundary: report.source_boundary,
  actual_source_images: report.prepared_inputs.filter((item) =>
    ["page.png", "page.grid.png"].includes(path.basename(item.path))),
  literal_author_input: report.literal_author_input,
  source_figures: report.source_figure_inventory.map((figure) => ({
    ...figure,
    native_geometry: report.snapped_figures.find((item) => item.id === figure.id),
    native_vectorize: report.vectorize_results_from_native_stdout.find((item) => item.id === figure.id),
    actual_outputs: report.outputs.filter((item) =>
      [figure.id + ".png", figure.id + ".svg"].includes(path.basename(item.path))),
  })),
}));
const allPassed = pageReports.every(({ report }) => report.execution_status === "pass");
const final = {
  schema: "d731/source225226-first-author@1",
  ticket: "STEMROBIN-181",
  role: "short-lived source author",
  checkout: repo,
  output_owner: base,
  book: "10p",
  execution_status: allPassed ? "pass" : "failed",
  approval_status: "NOT_APPROVED",
  hold: "Independent SOURCE/RAW/SVG review required; no self-approval.",
  scope: "Offline literal cap1 for physical source225226 only. Finalize and vectorize each ran once.",
  source_pdf: pageReports[0].report.source,
  pages,
  totals: {
    native_blocks: pageReports.reduce((sum, item) => sum + item.report.native_counts.blocks, 0),
    native_lines_printed: pageReports.reduce((sum, item) => sum + item.report.native_counts.lines_printed, 0),
    native_lines_md: pageReports.reduce((sum, item) => sum + item.report.native_counts.lines_md, 0),
    source_figures: pageReports.reduce((sum, item) => sum + item.report.native_counts.figures, 0),
    native_normalizations: pageReports.reduce((sum, item) => sum + item.report.native_counts.normalizations, 0),
    native_vectorize_pass: pageReports.reduce((sum, item) => sum + item.report.native_counts.vectorize_pass, 0),
    native_vectorize_fail: pageReports.reduce((sum, item) => sum + item.report.native_counts.vectorize_fail, 0),
    finalize_calls: 2,
    vectorize_calls: 2,
  },
  image_batch: {
    batch: 1,
    images_opened: observations.image_batch.opens.length,
    context_images_opened: observations.image_batch.opens.length,
    limit_per_batch: 8,
    limit_per_context: 24,
    opens: observations.image_batch.opens.map((item) => ({
      ...item,
      ...describe(path.join(base, item.path)),
    })),
  },
  source_observations: describe(observationsPath),
  author_scripts: ["author-run.mjs", "finish-report.mjs"].map((file) => describe(path.join(base, file))),
  source_boundary_summary: {
    source83: "Source225 questions1-3 occur before the actual printed heading84.",
    source84: "84. 光的干涉 begins on source225 / printed215, continues on source226 / printed216.",
    source225_to226: "Source225 final p cont open joins source226 initial p cont; that paragraph closes after five source226 rows.",
    last_paragraph: "Source226 biography closes on this page.",
    right_unit_boundary: "Unconfirmed; no following h3 within the authorized pixels; source84 not declared complete.",
    toc_used: false,
  },
  prohibited_stages_not_run: [
    "assemble / raw lesson generation",
    "modernization",
    "answers",
    "canonical promotion",
    "meter or index updates",
    "backend or DB access",
    "paid calls",
    "new agents or other chats",
    "freshness updates",
    "full tests",
  ],
  first_failure: pageReports.map((item) => item.report.first_failure).find((item) => item !== null) ?? null,
  review_requests: [
    "SOURCE: independently compare literal lines, punctuation, native rows, source83 questions, h3 source84 boundary, continuations and figure inventory against actual source pixels.",
    "RAW: independently review finalized page.md/page.json candidates and their flags; no raw lessons were assembled.",
    "SVG: independently compare fig-198 and unnumbered portrait tbl-p0226-01 against source crops; native raster mismatches are execution evidence, not approval.",
  ],
};
fs.writeFileSync(target, `${JSON.stringify(final, null, 2)}\n`);
console.log(JSON.stringify({
  report: describe(target),
  page_reports: pages.map((page) => page.page_report),
  native_counts: final.totals,
  image_opens: final.image_batch.images_opened,
  figures: pages.flatMap((page) => page.source_figures.map((figure) => ({
    id: figure.id,
    outputs: figure.actual_outputs,
  }))),
  approval_status: final.approval_status,
}, null, 2));

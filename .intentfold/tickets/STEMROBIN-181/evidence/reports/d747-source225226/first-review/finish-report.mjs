import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
assert.equal(process.cwd(), repo);
const output = dirname(fileURLToPath(import.meta.url));
const authorRoot = join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d731-source225226-first-author");
const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const bind = (path) => {
  const bytes = readFileSync(path);
  return { path, sha256: hash(bytes), bytes: bytes.length };
};
const verifyRecorded = (record) => {
  assert.ok(record.path.startsWith(authorRoot + "/"));
  const actual = bind(record.path);
  assert.equal(actual.sha256, record.sha256, record.path);
  assert.equal(actual.bytes, record.bytes, record.path);
  return actual;
};
const authorPath = join(authorRoot, "reports/source225226-author-report.json");
const author = readJson(authorPath);
const observationsPath = join(output, "reviewer-observations.json");
const observations = readJson(observationsPath);
const inputManifest = [bind(authorPath)];
const imageOpens = [];
const pages = [];

for (const observation of observations.pages) {
  const physical = observation.physical_page;
  const padded = String(physical).padStart(4, "0");
  const saved = author.pages.find((page) => page.physical_page === physical);
  assert.ok(saved);
  const pageAuthorRef = verifyRecorded(saved.page_report);
  const pageAuthor = readJson(pageAuthorRef.path);
  inputManifest.push(pageAuthorRef);
  const rootPage = join(authorRoot, "root/10p/pages", padded);
  const workPage = join(authorRoot, "work/10p/pages", padded);
  const candidateRefs = ["page.md", "page.json", "audit.json"].map((name) => {
    const path = join(rootPage, name);
    const recorded = pageAuthor.outputs.find((entry) => entry.path === path);
    assert.ok(recorded, path);
    return verifyRecorded(recorded);
  });
  const page = readJson(join(rootPage, "page.json"));
  const audit = readJson(join(rootPage, "audit.json"));
  const sourcePath = join(workPage, "page.png");
  const source = verifyRecorded(saved.actual_source_images.find((entry) => entry.path === sourcePath));
  assert.equal(source.sha256, page.meta.render.sha256);
  assert.equal(page.meta.source.pdf_sha256, author.source_pdf.pdf_sha256);
  assert.equal(page.meta.source.pdf_page, physical);
  assert.equal(page.meta.printed_page, observation.printed_page);
  const rows = page.blocks.reduce((sum, block) => {
    if (block.kind === "fig") return sum;
    return sum + block.lines.length - (block.samerow ? (block.kind === "cap" ? block.lines.length : 1) : 0);
  }, 0);
  assert.equal(observation.row_inventory.reduce((sum, item) => sum + item.rows, 0), observation.independent_printed_rows);
  for (const count of [rows, page.meta.printed_lines, audit.lines_printed, audit.lines_md]) {
    assert.equal(count, observation.independent_printed_rows);
  }
  for (const field of ["errors", "unknown_chars", "katex_warnings", "normalizations"]) {
    assert.deepEqual(audit[field], []);
  }
  const figure = observation.figure.id;
  const figuresDir = join(workPage, "figures");
  const figureInputs = readdirSync(figuresDir, { withFileTypes: true }).filter((entry) => entry.isFile()).map((entry) => {
    const path = join(figuresDir, entry.name);
    const recorded = pageAuthor.outputs.find((item) => item.path === path);
    assert.ok(recorded, path);
    return verifyRecorded(recorded);
  });
  const raw = figureInputs.find((entry) => entry.path.endsWith(`/${figure}.png`));
  const svg = figureInputs.find((entry) => entry.path.endsWith(`/${figure}.svg`));
  assert.ok(raw && svg);
  assert.deepEqual(page.meta.figures[0].box, audit.figures[0].box);
  assert.equal(page.meta.figures[0].id, figure);
  assert.deepEqual(audit.figures[0], saved.source_figures[0].native_geometry);
  const receiptRefs = pageAuthor.receipts.map(verifyRecorded);
  const native = receiptRefs.map((ref) => {
    const receipt = readJson(ref.path);
    assert.equal(receipt.attempt, 1);
    assert.equal(receipt.exit_code, 0);
    assert.equal(receipt.execution_error, null);
    assert.equal(receipt.cwd, repo);
    for (const [flag, value] of [
      ["--book", "10p"], ["--page", String(physical)],
      ["--root", join(authorRoot, "root")], ["--work", join(authorRoot, "work")]
    ]) {
      assert.equal(receipt.command[receipt.command.indexOf(flag) + 1], value);
    }
    assert.ok(receipt.command.includes(receipt.stage));
    if (receipt.stage === "finalize") {
      assert.ok(receipt.stdout.includes(`${rows} 行（印刷 ${rows}）`));
      assert.ok(receipt.stdout.includes("✓ 通过"));
    } else {
      assert.equal(receipt.stage, "vectorize");
      const mismatch = saved.source_figures[0].native_vectorize.native_mismatch_percent;
      assert.ok(receipt.stdout.includes(`${mismatch.toFixed(3)}%`));
      assert.ok(receipt.stdout.includes("1 张通过, 0 张不匹配超限"));
    }
    return { stage: receipt.stage, status: "PASS_REUSED", attempt: 1, receipt: ref, stdout: receipt.stdout };
  });
  const previewReceiptPath = join(output, "previews", `${figure}.preview-receipt.json`);
  const previewReceipt = readJson(previewReceiptPath);
  const preview = bind(previewReceipt.output.path);
  assert.equal(previewReceipt.input.sha256, svg.sha256);
  assert.equal(previewReceipt.output.sha256, preview.sha256);
  inputManifest.push(source, ...candidateRefs, ...figureInputs, ...receiptRefs);
  for (const [stage, ref] of [["SOURCE", source], ["RAW", raw], ["SVG", preview]]) {
    imageOpens.push({ sequence: imageOpens.length + 1, physical_page: physical, stage, ...ref });
  }
  pages.push({
    ...observation,
    inputs: { source, candidates: candidateRefs, raw, svg },
    native_first_receipt: { status: "PASS_REUSED", receipts: native, replayed: false },
    evidence: { svg_preview: preview, preview_receipt: bind(previewReceiptPath) },
    row_check: { status: "PASS", independent_pixel_rows: observation.independent_printed_rows, structured_rows: rows, native_printed_rows: audit.lines_printed, native_md_rows: audit.lines_md }
  });
}

const p225 = readJson(join(authorRoot, "root/10p/pages/0225/page.json"));
const p226 = readJson(join(authorRoot, "root/10p/pages/0226/page.json"));
assert.deepEqual(p225.blocks.filter((block) => block.kind === "ex").map((block) => block.label), ["1", "2", "3"]);
assert.equal(p225.blocks.findIndex((block) => block.kind === "h3"), 4);
assert.equal(p225.blocks[7].open, true);
assert.equal(p225.blocks[9].samerow, true);
assert.equal(p225.blocks[10].cont, true);
assert.equal(p225.blocks[10].open, true);
assert.equal(p226.blocks[0].cont, true);
assert.equal(p226.blocks[0].open, false);
assert.equal(p226.blocks[0].lines.length, 5);
assert.equal(p226.blocks[5].open, true);
assert.equal(p226.blocks[7].cont, true);
assert.equal(p226.blocks[7].open, false);
assert.equal(p226.blocks.some((block) => block.kind.startsWith("h")), false);
assert.equal(p226.blocks.some((block) => block.samerow), false);
assert.equal(p226.blocks[6].label, null);
assert.equal(p226.blocks.some((block) => block.kind === "cap"), false);
assert.equal(imageOpens.length, observations.image_batch.images_opened);
assert.equal(imageOpens.length, 6);
for (const entry of inputManifest) assert.equal(bind(entry.path).sha256, entry.sha256, entry.path);

const report = {
  schema: "d739/source225226-first-review@1",
  ticket: "STEMROBIN-181",
  role: "short-lived independent SOURCE/RAW/SVG reviewer",
  checkout: repo,
  output_owner: output,
  reviewed_at: new Date().toISOString(),
  status: "PASS",
  stages: { native_first_receipt: "PASS_REUSED", SOURCE: "PASS", RAW: "PASS", SVG: "PASS" },
  findings: observations.findings,
  scope: "Offline literal review of physical source225226 / printed215216 only. No product or candidate edits.",
  source_identity: { ...author.source_pdf, validation: "Existing prepared-source hashes verified against both page metadata and author receipts; no PDF rerender or native replay." },
  hash_binding: {
    status: "PASS",
    inputs_match_recorded_author_hashes: true,
    inputs_unchanged_during_report: true,
    input_manifest_sha256: hash(Buffer.from(JSON.stringify(inputManifest))),
    inputs: inputManifest
  },
  pages,
  image_batch: { ...observations.image_batch, opens: imageOpens },
  boundary: {
    source83_questions_end_before_actual_h84: true,
    source84_complete: false,
    next_actual_heading_on_source226: null,
    hold: "Source84 unit boundary remains unconfirmed beyond the authorized two pages; SOURCE PASS is not a completeness or publishing verdict."
  },
  reviewer_evidence: {
    observations: bind(observationsPath),
    scripts: [bind(join(output, "render-preview.mjs")), bind(fileURLToPath(import.meta.url))]
  },
  preservation: { candidate_edits: 0, writes_limited_to_output_owner: true, other_edits_preserved: true },
  prohibited_actions_run: [],
  native_finalize_calls_this_review: 0,
  vectorize_calls_this_review: 0,
  resvg_preview_calls_this_review: 2,
  modern_SCI_approval: "NOT_GRANTED",
  backend_DB_paid_agents_freshness_Git_fulltests: "NOT_RUN"
};
const reportPath = join(output, "source225226-review-report.json");
writeFileSync(reportPath, JSON.stringify(report, null, 2) + "\n", { flag: "wx" });
const reportRef = bind(reportPath);
const text = [
  "# d739 independent source225226 review",
  "",
  "Native first receipts: PASS_REUSED. SOURCE: PASS. RAW: PASS. SVG: PASS.",
  "No actionable defects found. Scope is literal source fidelity only; modern SCI approval NOT_GRANTED.",
  "Physical225 / printed215: 24/24 rows; all three source83 questions end before actual heading84.",
  "Physical226 / printed216: 27/27 rows; first paragraph continues source225 and closes after five rows.",
  "Figure198: eye, rays1/2 and film complete; source caption remains text with samerow.",
  "Unnumbered tbl-p0226-01: complete source bust portrait, no biography/definition contamination.",
  "Source84 NOT COMPLETE: no actual next heading appears on source226. Biography closure is not a unit boundary.",
  "Actual images opened: SOURCE2 + RAW2 + SVG2 = 6. Extras0, crops0, reopens0; one batch, context6/24.",
  "Native finalize/vectorize replays0. Existing resvg previews2. Candidate edits0.",
  "No canonical, meter, index, Git, backend, DB, paid, agents, freshness, other chats or whole tests.",
  "",
  `Report: ${reportRef.path}`,
  `Report SHA256: ${reportRef.sha256}`,
  `Input manifest SHA256: ${report.hash_binding.input_manifest_sha256}`,
  "",
  "Bound inputs:",
  ...inputManifest.map((entry) => `${entry.sha256}  ${entry.path}`),
  "",
  "Viewed SVG evidence:",
  ...pages.map((page) => `${page.evidence.svg_preview.sha256}  ${page.evidence.svg_preview.path}`),
  ""
].join("\n");
const textPath = join(output, "review-summary.md");
writeFileSync(textPath, text, { flag: "wx" });
console.log(JSON.stringify({
  status: report.status,
  stages: report.stages,
  report: reportRef,
  summary: bind(textPath),
  input_manifest_sha256: report.hash_binding.input_manifest_sha256,
  images_opened: imageOpens.length,
  source84_complete: false
}, null, 2));

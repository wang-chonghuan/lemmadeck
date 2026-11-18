import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const base = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d731-source225226-first-author");
const root = path.join(base, "root");
const work = path.join(base, "work");
const reports = path.join(base, "reports");
const prepared = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d729-source225226-first-preparation/work");
const python = path.join(repo, ".claude/skills/ld-s10y-lesson/.venv/bin/python");
const tool = path.join(repo, ".claude/skills/ld-s10y-lesson/tools/p2c.py");
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const describe = (file) => ({ path: file, sha256: hash(file), bytes: fs.statSync(file).size });
const json = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const save = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);

if (process.cwd() !== repo) throw new Error(`Wrong cwd: ${process.cwd()}`);
const page = Number(process.argv[2]);
if (![225, 226].includes(page)) throw new Error("Only pages225 and226 are authorized.");
const name = String(page).padStart(4, "0");
const persistent = path.join(root, "10p/pages", name);
const preparedPage = path.join(work, "10p/pages", name);
const reportPath = path.join(reports, `p${name}-author.json`);
if (fs.existsSync(reportPath)) throw new Error(`Attempt already recorded: ${reportPath}`);
if (page === 226) {
  const previous = json(path.join(reports, "p0225-author.json"));
  if (previous.execution_status !== "pass") throw new Error("Page225 failed; dependent page226 is stopped.");
}

const inputFiles = ["page.png", "page.grid.png", "layout.json", "page.template.md"];
const preparedInputs = inputFiles.map((file) => {
  const copied = path.join(preparedPage, file);
  const original = path.join(prepared, "10p/pages", name, file);
  if (hash(copied) !== hash(original)) throw new Error(`Prepared input mismatch: ${copied}`);
  return { ...describe(copied), original_path: original, original_sha256: hash(original) };
});
const authored = path.join(persistent, "sourcepage.md");
const md = path.join(persistent, "page.md");
if (fs.existsSync(md)) throw new Error(`Refusing to replace an existing candidate: ${md}`);
fs.copyFileSync(authored, md, fs.constants.COPYFILE_EXCL);

const receipts = [];
function run(stage) {
  const receiptPath = path.join(reports, `p${name}-${stage}-once.json`);
  if (fs.existsSync(receiptPath)) throw new Error(`Refusing repeated ${stage}: ${receiptPath}`);
  const args = [tool, stage, "--book", "10p", "--page", String(page), "--root", root, "--work", work];
  const started = new Date().toISOString();
  const result = spawnSync(python, args, {
    cwd: repo,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1", TMPDIR: path.join(base, "runtime-tmp") },
    encoding: "utf8",
    maxBuffer: 8 * 1024 * 1024,
  });
  const receipt = {
    schema: "d731/command-receipt@1",
    stage,
    attempt: 1,
    command: [python, ...args],
    cwd: repo,
    started,
    ended: new Date().toISOString(),
    exit_code: result.status,
    signal: result.signal,
    execution_error: result.error?.message ?? null,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
  };
  save(receiptPath, receipt);
  receipts.push(describe(receiptPath));
  process.stdout.write(receipt.stdout);
  process.stderr.write(receipt.stderr);
  return receipt;
}

const finalized = run("finalize");
const auditPath = path.join(persistent, "audit.json");
const audit = fs.existsSync(auditPath) ? json(auditPath) : null;
const finalizePass = finalized.exit_code === 0 && audit !== null && audit.errors.length === 0;
const vectorized = finalizePass ? run("vectorize") : null;
const machine = fs.existsSync(path.join(persistent, "page.json")) ? json(path.join(persistent, "page.json")) : null;
const observed = json(path.join(base, "source-observations.json")).pages[String(page)];
const vectorCounts = vectorized?.stdout.match(/\[vectorize\] (\d+) 张通过, (\d+) 张不匹配超限/);
const vectorItems = Array.from(vectorized?.stdout.matchAll(/([✓✗]) (\d{4})\/((?:fig-|tbl-)[^\s]+)  不匹配 ([\d.]+)%/g) ?? []).map((m) => ({
  id: m[3],
  ok: m[1] === "✓",
  native_mismatch_percent: Number(m[4]),
  evidence_precision: "Native p2c stdout: percent printed to 3 decimal places; no more precise pixel counts exposed.",
}));
const generatedFiles = ["sourcepage.md", "page.md", "page.json", "audit.json"]
  .map((file) => path.join(persistent, file)).filter((file) => fs.existsSync(file)).map(describe);
const figureFiles = machine?.meta.figures.flatMap((figure) => [".png", ".svg"].map((ext) =>
  path.join(preparedPage, "figures", `${figure.id}${ext}`))) ?? [];
const outputFigures = figureFiles.filter((file) => fs.existsSync(file)).map(describe);
const toolFiles = ["p2c.py", "production.py", "blocks.py", "layout.py", "normalize.py", "mathcheck.py", "vectorize.py", "svg_raster.js"]
  .map((file) => path.join(repo, ".claude/skills/ld-s10y-lesson/tools", file));
const executionPass = finalizePass && vectorized?.exit_code === 0 && vectorCounts !== null &&
  Number(vectorCounts[2]) === 0 && Number(vectorCounts[1]) === machine.meta.figures.length;
const report = {
  schema: "d731/source-page-author@1",
  book: "10p",
  physical_page: page,
  execution_status: executionPass ? "pass" : "failed",
  approval: "none; independent SOURCE/RAW/SVG review required",
  source_boundary: observed?.boundary ?? null,
  source_figure_inventory: observed?.figures ?? [],
  prepared_inputs: preparedInputs,
  literal_author_input: describe(authored),
  source: machine?.meta.source ?? null,
  native_counts: {
    blocks: machine?.blocks.length ?? null,
    lines_printed: audit?.lines_printed ?? null,
    lines_md: audit?.lines_md ?? null,
    figures: audit?.figures.length ?? null,
    normalizations: audit?.normalizations.length ?? null,
    unknown_characters: audit?.unknown_chars.length ?? null,
    katex_warnings: audit?.katex_warnings.length ?? null,
    errors: audit?.errors ?? null,
    vectorize_pass: vectorCounts ? Number(vectorCounts[1]) : null,
    vectorize_fail: vectorCounts ? Number(vectorCounts[2]) : null,
  },
  snapped_figures: audit?.figures ?? null,
  vectorize_results_from_native_stdout: vectorItems,
  receipts,
  outputs: [...generatedFiles, ...outputFigures],
  existing_tools: [...toolFiles, path.join(repo, ".claude/skills/ld-s10y-lesson/profiles/soviet-cn.json")].map(describe),
  existing_runtime_reference: { python, real_python: fs.realpathSync(python), node: process.execPath },
  stopped_dependent_stages: !finalizePass ? ["vectorize", "next source page"] : !executionPass ? ["next source page"] : [],
  first_failure: !finalizePass ? {
    stage: "finalize",
    exit_code: finalized.exit_code,
    diagnosis: audit?.errors ?? [finalized.execution_error ?? finalized.stderr],
    content_fudged: false,
    rerun: false,
  } : !executionPass ? {
    stage: "vectorize",
    exit_code: vectorized?.exit_code,
    diagnosis: vectorized?.stdout,
    content_fudged: false,
    rerun: false,
  } : null,
};
save(reportPath, report);
console.log(JSON.stringify(describe(reportPath), null, 2));
if (!executionPass) process.exitCode = 1;

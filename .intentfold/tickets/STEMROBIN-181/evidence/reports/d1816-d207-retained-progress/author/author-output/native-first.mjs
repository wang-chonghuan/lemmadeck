import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

const repo = "/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck";
if (process.cwd() !== repo) throw new Error("Wrong cwd");
const inputPath = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d207-10p-source71-73-author/input-freeze.json");
const output = path.join(path.dirname(inputPath), "author-output");
const root = path.join(repo, ".tmp/STEMROBIN-181/d1816-d207/root");
const work = path.join(repo, ".tmp/STEMROBIN-181/d1816-d207/source-work");
const python = path.join(repo, ".claude/skills/ld-s10y-lesson/.venv/bin/python");
const tools = path.join(repo, ".claude/skills/ld-s10y-lesson/tools");
const profile = path.join(repo, ".claude/skills/ld-s10y-lesson/profiles/soviet-cn.json");
const sha = data => crypto.createHash("sha256").update(data).digest("hex");
const binding = file => {
  const data = fs.readFileSync(file);
  return { path: file, bytes: data.length, sha256: sha(data) };
};
const writeNew = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, typeof value === "string" ? value : JSON.stringify(value, null, 2) + "\n", { flag: "wx" });
};
const verify = expected => {
  const actual = binding(expected.path);
  if (actual.bytes !== expected.bytes || actual.sha256 !== expected.sha256) {
    throw new Error(`Input changed: ${expected.path}`);
  }
  return actual;
};
const inputBinding = binding(inputPath);
if (inputBinding.sha256 !== "e57a03a312d7e71be4a580de58a68163679c1330c80fde16ad7d9c58bfe30a89") {
  throw new Error("Input-freeze mismatch");
}
const input = JSON.parse(fs.readFileSync(inputPath, "utf8"));
const preparedBindings = input.pages.flatMap(page => [page.source, page.grid, page.template, page.layout]);
for (const expected of [...preparedBindings, input.preparation, input.precedingCandidateText, input.toc]) verify(expected);
if (fs.existsSync(path.join(output, "draft-freeze.json")) || fs.existsSync(path.join(output, "native-state.json"))) {
  throw new Error("First-native invocation already exists; never rerun");
}
for (const page of input.pages) {
  const dir = path.join(root, "10p/pages", String(page.page).padStart(4, "0"));
  if (fs.existsSync(dir)) throw new Error(`Operative page already exists: ${dir}`);
  const figures = path.join(path.dirname(page.source.path), "figures");
  if (fs.existsSync(figures)) throw new Error(`Native crop directory already exists: ${figures}`);
}

// The repository's block parser creates independent full-text candidates, not a native gate.
const parser = [
  "import json,sys",
  "from pathlib import Path",
  "sys.path.insert(0,sys.argv[1])",
  "import blocks",
  "meta,items=blocks.parse(Path(sys.argv[2]).read_text(encoding='utf-8'))",
  "print(json.dumps({'meta':meta,'blocks':items,'author_printed_lines':blocks.printed_lines(items)},ensure_ascii=False))",
].join("\n");
const drafts = [];
for (const page of input.pages) {
  const key = String(page.page).padStart(4, "0");
  const md = path.join(output, "original-drafts", key, "page.md");
  const parsedPath = path.join(output, "original-drafts", key, "page.json");
  const result = spawnSync(python, ["-B", "-c", parser, tools, md], { cwd: repo, encoding: "utf8" });
  writeNew(path.join(output, "candidate-parser", `${key}.stdout`), result.stdout || "");
  writeNew(path.join(output, "candidate-parser", `${key}.stderr`), result.stderr || "");
  if (result.status !== 0 || result.error) throw new Error(`Candidate parser failed p${key}: ${result.stderr}`);
  const parsed = JSON.parse(result.stdout);
  const inventory = JSON.parse(fs.readFileSync(path.join(output, "source-inventory", `${key}.json`), "utf8"));
  if (parsed.meta.page !== page.page || parsed.meta.printed_page !== page.printedPage ||
      parsed.author_printed_lines !== inventory.observedPrintedTextRows) {
    throw new Error(`Author row inventory mismatch p${key}`);
  }
  writeNew(parsedPath, parsed);
  fs.chmodSync(md, 0o444);
  fs.chmodSync(parsedPath, 0o444);
  drafts.push({
    page: page.page,
    printedPage: page.printedPage,
    immutableMarkdown: binding(md),
    immutableParsedCandidate: binding(parsedPath),
    observedPrintedTextRows: parsed.author_printed_lines,
  });
}
const sourceManifest = path.join(repo, "ssot-resources/soviet10year-textbooks/sources/manifest.json");
const manifest = JSON.parse(fs.readFileSync(sourceManifest, "utf8"));
const catalog = manifest.catalogs.find(item => item.book === "10p");
const sourceRecord = manifest.pdfs.find(item => item.book === catalog.sourcePdf);
const pdf = path.join(repo, manifest.pdfRoot, sourceRecord.file);
if (binding(pdf).sha256 !== sourceRecord.sha256) throw new Error("Source PDF hash mismatch");
const runtimeInputs = [
  "p2c.py", "blocks.py", "layout.py", "normalize.py", "mathcheck.py",
  "vectorize.py", "svg_raster.js", "katex_check.js",
].map(file => binding(path.join(tools, file)));
const draftFreeze = {
  schema: "STEMROBIN-181/immutable-source-draft-freeze@1",
  batch: "D207",
  ticket: "STEMROBIN-181",
  createdAt: new Date().toISOString(),
  inputFreeze: inputBinding,
  preFinalizeDraftEvidenceRule: "All historical draft bindings point ONLY to immutable original-drafts files; operative output paths are intentionally not bound to pre-finalize hashes.",
  drafts,
  preparedSourceInputs: input.pages,
  sourcePdf: binding(pdf),
  sourceManifest: binding(sourceManifest),
  exerciseNumbering: catalog.exerciseNumbering,
  profile: binding(profile),
  runtimeInputs,
  sourceApproval: false,
  courseApproval: false,
};
const draftFreezePath = path.join(output, "draft-freeze.json");
writeNew(draftFreezePath, draftFreeze);
fs.chmodSync(draftFreezePath, 0o444);
for (const draft of drafts) {
  const key = String(draft.page).padStart(4, "0");
  const dir = path.join(root, "10p/pages", key);
  fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(draft.immutableMarkdown.path, path.join(dir, "page.md"), fs.constants.COPYFILE_EXCL);
  fs.copyFileSync(draft.immutableParsedCandidate.path, path.join(dir, "page.json"), fs.constants.COPYFILE_EXCL);
  // Only newly owned operative copies become writable; prepared files and evidence stay untouched.
  fs.chmodSync(path.join(dir, "page.md"), 0o644);
  fs.chmodSync(path.join(dir, "page.json"), 0o644);
}

const stages = [];
let firstFailure = null;
for (const draft of drafts) {
  const key = String(draft.page).padStart(4, "0");
  for (const stage of ["finalize", "vectorize"]) {
    if (firstFailure) {
      stages.push({ page: draft.page, stage, status: "NOT_ATTEMPTED_DEPENDENT_RANGE_HOLD", causedBy: firstFailure });
      continue;
    }
    for (const expected of preparedBindings) verify(expected);
    for (const expected of runtimeInputs) verify(expected);
    verify(draftFreeze.profile);
    verify(draft.immutableMarkdown);
    verify(draft.immutableParsedCandidate);
    const receiptDir = path.join(output, "native", `${key}-${stage}-first`);
    const args = [
      "-B", path.join(tools, "p2c.py"), stage, "--book", "10p",
      "--page", String(draft.page), "--root", root, "--work", work,
      "--books", path.join(repo, "ssot-resources/soviet10year-textbooks/sources"),
      "--pdf", pdf,
    ];
    const startedAt = new Date().toISOString();
    const started = Date.now();
    const result = spawnSync(python, args, { cwd: repo, encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });
    const stdoutPath = path.join(receiptDir, "stdout.txt");
    const stderrPath = path.join(receiptDir, "stderr.txt");
    writeNew(stdoutPath, result.stdout || "");
    writeNew(stderrPath, result.stderr || "");
    const receipt = {
      schema: "STEMROBIN-181/native-first-receipt@1",
      batch: "D207", page: draft.page, stage, invocation: 1,
      cwd: repo, command: [python, ...args], startedAt,
      finishedAt: new Date().toISOString(), elapsedMs: Date.now() - started,
      exitCode: result.status, signal: result.signal, error: result.error?.message || null,
      immutableSourceDraft: draft,
      immutableDraftFreeze: binding(draftFreezePath),
      profile: draftFreeze.profile, runtimeInputs,
      stdout: binding(stdoutPath), stderr: binding(stderrPath),
      sourceApproval: false, contentApproval: false,
    };
    const receiptPath = path.join(receiptDir, "receipt.json");
    writeNew(receiptPath, receipt);
    const passed = result.status === 0 && !result.error;
    const row = { page: draft.page, stage, status: passed ? "NATIVE_MECHANICAL_PASS" : "NATIVE_FAILURE_HOLD", receipt: binding(receiptPath) };
    stages.push(row);
    console.log(JSON.stringify(row));
    console.log(result.stdout || "");
    if (result.stderr) console.error(result.stderr);
    if (!passed) firstFailure = { page: draft.page, stage, receipt: binding(receiptPath), classification: "NATIVE_EXECUTION_OR_MECHANICAL_GATE_FAILURE_NOT_SOURCE_VERDICT" };
  }
}
for (const expected of preparedBindings) verify(expected);
for (const draft of drafts) {
  verify(draft.immutableMarkdown);
  verify(draft.immutableParsedCandidate);
}
writeNew(path.join(output, "native-state.json"), {
  schema: "STEMROBIN-181/native-range-state@1",
  batch: "D207", inputFreeze: inputBinding, immutableDraftFreeze: binding(draftFreezePath),
  stages, firstFailure,
  actualFinalizeInvocations: stages.filter(item => item.stage === "finalize" && item.receipt).length,
  actualVectorizeInvocations: stages.filter(item => item.stage === "vectorize" && item.receipt).length,
  preparedInputsUnchanged: true,
  completeTextCandidates: 3,
  nativeRetries: 0,
  contentRepairs: 0,
  sourceApproval: false,
  courseApproval: false,
});

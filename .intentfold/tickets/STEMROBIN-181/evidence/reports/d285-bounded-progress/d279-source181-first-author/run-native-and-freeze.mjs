import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const workspace = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const prepared = path.join(workspace, ".intentfold/tickets/STEMROBIN-181/tmp/d278-source181-preparation");
const native = path.join(root, "native/0181");
const hash = p => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const read = p => JSON.parse(fs.readFileSync(p, "utf8"));
const binding = p => ({path: p, sha256: hash(p), bytes: fs.statSync(p).size});
const writeNewJSON = (p, v) => fs.writeFileSync(p, JSON.stringify(v, null, 2) + "\n", {flag: "wx"});

function verifyInputs() {
  const manifestPath = path.join(prepared, "manifest.json");
  assert.equal(hash(manifestPath), "5bb48f138c8f0d5b77b57cb1242a36aad1ba2664944a2d62293065ce65fb5158");
  const manifest = read(manifestPath);
  for (const item of [...manifest.inputs, manifest.receipt, manifest.previousPage]) {
    const p = path.resolve(workspace, item.path);
    assert.equal(hash(p), item.sha256, p);
  }
  for (const item of manifest.inputs) {
    const copied = path.join(root, "work/10p/pages/0181", path.basename(item.path));
    assert.equal(hash(copied), item.sha256, copied);
  }
  const context = read(path.join(root, "input-context.json"));
  assert.equal(hash(context.previousObjectTextOnly.d275Report), context.previousObjectTextOnly.d275ReportSHA256);
  assert.equal(hash(context.completedBeforeAuthorWork.d276Report), context.completedBeforeAuthorWork.d276ReportSHA256);
  const ledger = read(path.join(root, "actual-opens.json"));
  assert.equal(hash(ledger.inheritedLedger.path), ledger.inheritedLedger.sha256);
  assert.equal(ledger.cumulative, 24);
  assert.equal(ledger.opens.length, 2);
  assert.deepEqual(ledger.opens.map(x => x.ordinal), [23, 24]);
  for (const item of ledger.opens) assert.equal(hash(item.path), item.sha256);
}

function runNative(command) {
  const receiptPath = path.join(native, `${command}.receipt.json`);
  assert(!fs.existsSync(receiptPath), `${command} must run only once`);
  const executable = path.join(workspace, ".claude/skills/ld-s10y-lesson/.venv/bin/python");
  const args = ["-B", path.join(workspace, ".claude/skills/ld-s10y-lesson/tools/p2c.py"),
    command, "--book", "10p", "--page", "181", "--root", path.join(root, "source"),
    "--work", path.join(root, "work")];
  const startedUtc = new Date().toISOString();
  const result = spawnSync(executable, args, {
    cwd: workspace, encoding: "utf8",
    env: {...process.env, PYTHONDONTWRITEBYTECODE: "1", TMPDIR: path.join(native, "tmp")}
  });
  const stdoutPath = path.join(native, `${command}.stdout.txt`);
  const stderrPath = path.join(native, `${command}.stderr.txt`);
  fs.writeFileSync(stdoutPath, result.stdout || "", {flag: "wx"});
  fs.writeFileSync(stderrPath, result.stderr || "", {flag: "wx"});
  const receipt = {
    schema: "source181-first-author-native-receipt@1", ticket: "STEMROBIN-181",
    command: [executable, ...args], startedUtc, finishedUtc: new Date().toISOString(),
    invocationCount: 1, exitCode: result.status, signal: result.signal,
    error: result.error?.message || null, stdout: binding(stdoutPath), stderr: binding(stderrPath),
    newImageOpens: 0, independentSourceOrRawPASS: false
  };
  writeNewJSON(receiptPath, receipt);
  console.log(JSON.stringify(receipt, null, 2));
  console.log(result.stdout || "");
  if (result.stderr) console.error(result.stderr);
  return result.status;
}

function listFiles(directory) {
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap(entry => {
    const p = path.join(directory, entry.name);
    if (entry.isDirectory()) return listFiles(p);
    assert(entry.isFile(), "Unexpected nonfile in author output");
    return [p];
  }).sort();
}

verifyInputs();
const mode = process.argv[2];
if (mode === "native") {
  assert(!fs.existsSync(native), "Native stage already exists; no reruns");
  fs.mkdirSync(path.join(native, "tmp"), {recursive: true});
  fs.copyFileSync(path.join(root, "source/10p/pages/0181/page.md"),
    path.join(native, "before-finalize.md"), fs.constants.COPYFILE_EXCL);
  const finalizeExit = runNative("finalize");
  if (finalizeExit === 0) process.exitCode = runNative("vectorize") ?? 1;
  else process.exitCode = finalizeExit ?? 1;
  verifyInputs();
} else if (mode === "freeze") {
  const freezePath = path.join(root, "author-freeze.json");
  assert(!fs.existsSync(freezePath), "Freeze is immutable");
  const report = read(path.join(root, "report.json"));
  const audit = read(path.join(root, "source/10p/pages/0181/audit.json"));
  const page = read(path.join(root, "source/10p/pages/0181/page.json"));
  assert.equal(report.native.finalizeExit, read(path.join(native, "finalize.receipt.json")).exitCode);
  assert.equal(report.native.vectorizeExit, read(path.join(native, "vectorize.receipt.json")).exitCode);
  assert.equal(report.native.linesPrinted, audit.lines_printed);
  assert.equal(report.native.linesMD, audit.lines_md);
  assert.equal(report.native.figureCount, page.meta.figures.length);
  for (const item of Object.values(report.bindings)) assert.equal(hash(path.resolve(root, item.path)), item.sha256);
  const files = listFiles(root).filter(p => p !== freezePath);
  const freeze = {
    schema: "source181-first-author-freeze@1", ticket: "STEMROBIN-181",
    date: "2026-11-18", frozenUtc: new Date().toISOString(),
    status: report.status, writeDomain: root, immutablePolicy: "Create once; never edit frozen author bytes.",
    preparedManifest: binding(path.join(prepared, "manifest.json")),
    artifacts: files.map(binding), report: binding(path.join(root, "report.json")),
    candidatePageMD: binding(path.join(root, "source/10p/pages/0181/page.md")),
    candidatePageJSON: binding(path.join(root, "source/10p/pages/0181/page.json")),
    nativeAudit: binding(path.join(root, "source/10p/pages/0181/audit.json")),
    actualOpens: binding(path.join(root, "actual-opens.json")),
    native: report.native, imageBudget: report.imageBudget,
    authorIsIndependentReviewer: false, SOURCE181IndependentPASS: false,
    RAW137IndependentPASS: false, RAW138IndependentPASS: false, n69Complete: false
  };
  writeNewJSON(freezePath, freeze);
  for (const p of [...files, freezePath]) fs.chmodSync(p, 0o444);
  console.log(JSON.stringify({freeze: binding(freezePath), report: binding(path.join(root, "report.json")),
    artifacts: files.length, mode: "0444", imageBudget: report.imageBudget}, null, 2));
} else {
  throw new Error("Expected native or freeze");
}

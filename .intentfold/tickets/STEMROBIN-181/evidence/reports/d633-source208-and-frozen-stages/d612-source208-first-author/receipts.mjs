import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const own = path.dirname(fileURLToPath(import.meta.url));
const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const preparation = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d609-source208-first-preparation/manifest.json");
const expectedManifest = "d1b60280123a3425ad30dc5c7c0f247da8b6d89981d085ed4cc07c14d0d26210";
const tool = path.join(repo, ".claude/skills/ld-s10y-lesson/tools/p2c.py");
const python = path.join(repo, ".claude/skills/ld-s10y-lesson/.venv/bin/python");
const page = path.join(own, "source/10p/pages/0208/page.md");
const sha = (p) => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const put = (p, data) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + "\n", { flag: "wx" });
};
function files(root) {
  return fs.readdirSync(root, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name)).flatMap((entry) => {
    const p = path.join(root, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Symlink forbidden: ${p}`);
    return entry.isDirectory() ? files(p) : [p];
  });
}
function snapshot(root) {
  return files(root).map((p) => ({ path: p, sha256: sha(p), bytes: fs.statSync(p).size }));
}
const native = path.join(own, "native");
const mode = process.argv[2];
if (mode === "init") {
  if (sha(preparation) !== expectedManifest) throw new Error("Preparation manifest hash mismatch");
  const manifest = JSON.parse(fs.readFileSync(preparation, "utf8"));
  if (manifest.book !== "10p" || JSON.stringify(manifest.pages) !== "[208]") throw new Error("Wrong page scope");
  const roots = ["sourceRoot", "sourceWork"].map((key) => path.resolve(repo, manifest[key]));
  for (const item of manifest.inputs) {
    if (sha(path.resolve(repo, item.path)) !== item.sha256) throw new Error(`Prepared hash mismatch: ${item.path}`);
  }
  const entries = roots.flatMap(snapshot);
  if (entries.length !== manifest.inputs.length) throw new Error("Unexpected files in scoped preparation roots");
  for (const item of entries) {
    if (!manifest.inputs.some((input) => path.resolve(repo, input.path) === item.path)) throw new Error("Unmanifested prepared file");
  }
  for (const [index, name] of ["source", "work"].entries()) {
    const dst = path.join(own, name);
    if (fs.existsSync(dst)) throw new Error(`Destination already exists: ${dst}`);
    fs.cpSync(roots[index], dst, { recursive: true, errorOnExist: true, force: false });
  }
  const copies = manifest.inputs.map((item) => {
    const p = path.join(own, "work", path.relative(roots[1], path.resolve(repo, item.path)));
    if (sha(p) !== item.sha256) throw new Error("Copied input hash mismatch");
    fs.chmodSync(p, 0o444);
    return { path: p, sha256: sha(p), bytes: fs.statSync(p).size };
  });
  put(path.join(own, "prepared-verification.json"), {
    preparation, sha256: expectedManifest, status: "HASH-MATCH",
    sourceRootFileCount: snapshot(roots[0]).length, copies,
    prepareInvocations: 0, outsideWrites: 0,
  });
  fs.chmodSync(path.join(own, "prepared-verification.json"), 0o444);
  console.log(JSON.stringify({ status: "HASH-MATCH", copiedFiles: copies.length, own }));
} else if (mode === "seal") {
  const inventory = path.join(own, "source-inventory.json");
  const seal = path.join(own, "pre-native-seal.json");
  fs.mkdirSync(path.join(own, "first-input"), { recursive: true });
  fs.copyFileSync(page, path.join(own, "first-input/page.md"), fs.constants.COPYFILE_EXCL);
  put(seal, {
    schema: "source208-first/pre-native@1",
    timestamp: new Date().toISOString(),
    page: 208, preparationSha256: expectedManifest,
    sourceInventory: { path: inventory, sha256: sha(inventory) },
    firstPageMd: { path: path.join(own, "first-input/page.md"), sha256: sha(page) },
    firstWork: snapshot(path.join(own, "work")),
    tool: { path: tool, sha256: sha(tool) },
    status: "SEALED-BEFORE-NATIVE-INDEPENDENT-PENDING",
  });
  for (const p of [inventory, seal, path.join(own, "first-input/page.md")]) fs.chmodSync(p, 0o444);
  console.log(JSON.stringify({ seal, sha256: sha(seal), inventorySha256: sha(inventory), firstPageSha256: sha(page) }));
} else if (mode === "run") {
  const command = process.argv[3];
  if (!["finalize", "vectorize", "svg-preview"].includes(command)) throw new Error("Out-of-scope native command");
  if (!fs.existsSync(path.join(own, "pre-native-seal.json"))) throw new Error("Pre-native seal absent");
  if (command === "vectorize") {
    const prior = JSON.parse(fs.readFileSync(path.join(native, "finalize/status.json"), "utf8"));
    if (prior.exitStatus !== 0) throw new Error("Finalize failed; vectorize frozen");
  }
  const dir = path.join(native, command);
  if (fs.existsSync(dir)) throw new Error("Native command already attempted; rerun forbidden");
  fs.mkdirSync(dir, { recursive: true });
  const tmp = path.join(native, "tmp");
  fs.mkdirSync(tmp, { recursive: true });
  const args = command === "svg-preview"
    ? [path.join(repo, ".claude/skills/ld-s10y-lesson/tools/svg_raster.js"),
      path.join(own, "work/10p/pages/0208/figures/fig-182.svg"),
      path.join(own, "work/10p/pages/0208/figures/fig-182.svg.preview.png")]
    : [tool, command, "--book", "10p", "--page", "208", "--root", path.join(own, "source"), "--work", path.join(own, "work")];
  const executable = command === "svg-preview" ? "node" : python;
  put(path.join(dir, "command.json"), { executable, args, cwd: repo, envOverrides: { PYTHONDONTWRITEBYTECODE: "1", TMPDIR: tmp }, startedAt: new Date().toISOString() });
  const before = [...snapshot(path.join(own, "source")), ...snapshot(path.join(own, "work"))];
  put(path.join(dir, "before.json"), before);
  const result = spawnSync(executable, args, { cwd: repo, env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1", TMPDIR: tmp }, maxBuffer: 16 * 1024 * 1024 });
  fs.writeFileSync(path.join(dir, "stdout.txt"), result.stdout ?? Buffer.alloc(0), { flag: "wx" });
  fs.writeFileSync(path.join(dir, "stderr.txt"), result.stderr ?? Buffer.alloc(0), { flag: "wx" });
  const after = [...snapshot(path.join(own, "source")), ...snapshot(path.join(own, "work"))];
  put(path.join(dir, "after.json"), after);
  fs.mkdirSync(path.join(dir, "output"), { recursive: true });
  for (const item of after) {
    if (before.some((old) => old.path === item.path && old.sha256 === item.sha256)) continue;
    const dst = path.join(dir, "output", path.relative(own, item.path));
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.copyFileSync(item.path, dst, fs.constants.COPYFILE_EXCL);
  }
  put(path.join(dir, "status.json"), {
    exitStatus: result.status, signal: result.signal, spawnError: result.error?.message ?? null,
    finishedAt: new Date().toISOString(),
    stdoutSha256: sha(path.join(dir, "stdout.txt")), stderrSha256: sha(path.join(dir, "stderr.txt")),
    processStatus: result.status === 0 ? "EXIT-0-INDEPENDENT-PENDING" : "FIRST-FAILURE-PRESERVED",
  });
  for (const p of files(dir)) fs.chmodSync(p, 0o444);
  console.log(result.stdout?.toString() ?? "");
  if (result.stderr?.length) console.error(result.stderr.toString());
  console.log(JSON.stringify({ command, dir, exitStatus: result.status, statusSha256: sha(path.join(dir, "status.json")) }));
} else if (mode === "check") {
  const report = JSON.parse(fs.readFileSync(path.join(own, "report.json"), "utf8"));
  const inventory = JSON.parse(fs.readFileSync(path.join(own, "source-inventory.json"), "utf8"));
  const ledger = JSON.parse(fs.readFileSync(path.join(own, "opens-ledger.json"), "utf8"));
  const seal = JSON.parse(fs.readFileSync(path.join(own, "pre-native-seal.json"), "utf8"));
  const parsed = JSON.parse(fs.readFileSync(path.join(own, "source/10p/pages/0208/page.json"), "utf8"));
  const preparationData = JSON.parse(fs.readFileSync(preparation, "utf8"));
  if (sha(preparation) !== expectedManifest) throw new Error("Prepared manifest drift");
  for (const item of preparationData.inputs) {
    if (sha(path.resolve(repo, item.path)) !== item.sha256) throw new Error("Original prepared input drift");
    const copy = path.join(own, "work", path.relative(path.resolve(repo, preparationData.sourceWork), path.resolve(repo, item.path)));
    if (sha(copy) !== item.sha256) throw new Error("Copied prepared input drift");
  }
  for (const item of [...report.outputs, ...ledger.entries]) {
    if (sha(item.path) !== item.sha256) throw new Error(`Evidence hash mismatch: ${item.path}`);
  }
  for (const item of [seal.sourceInventory, seal.firstPageMd, seal.tool]) {
    if (sha(item.path) !== item.sha256) throw new Error(`Sealed evidence drift: ${item.path}`);
  }
  for (const row of inventory.textRows) {
    const indices = row.pointer0based.split("/");
    const actual = parsed.blocks[Number(indices[2])].lines[Number(indices[4])];
    if (actual !== row.text) throw new Error(`Pixel inventory row mismatch: ${row.pointer0based}`);
    if (row.nativeRef1based !== `p0208#${Number(indices[2]) + 1}`) throw new Error("One-based reference mismatch");
  }
  const tokens = parsed.blocks.filter((block) => block.kind === "p").flatMap((block) => block.lines.flatMap((line) => line.match(/\$[^$]*\$/g) ?? []));
  if (JSON.stringify(tokens) !== JSON.stringify(inventory.mathematicalTokens.rawBodySpansInOrder)) throw new Error("Raw mathematical token mismatch");
  if (parsed.blocks.length !== 7 || parsed.meta.printed_lines !== 13 || !parsed.blocks[2].cont || !parsed.blocks[5].open) throw new Error("Native count/boundary mismatch");
  if (ledger.entries.length !== 4 || ledger.imageOpensThisBatch > 8 || ledger.imageOpensThisFreshContext > 24 || ledger.oldImageBudgetReset) throw new Error("Image budget mismatch");
  for (const command of ["finalize", "vectorize", "svg-preview"]) {
    const dir = path.join(native, command);
    const receipt = JSON.parse(fs.readFileSync(path.join(dir, "status.json"), "utf8"));
    if (receipt.exitStatus !== 0 || sha(path.join(dir, "stdout.txt")) !== receipt.stdoutSha256 || sha(path.join(dir, "stderr.txt")) !== receipt.stderrSha256) throw new Error("Native receipt mismatch");
  }
  const result = {
    schema: "source208-first/mechanical-integrity@1",
    status: "CHECK-EXIT-0-NOT-INDEPENDENT-REVIEW",
    preparedInputsAndCopiesHashMatched: 4, firstInventoryAndInputHashMatched: true,
    nativeTextRowsComparedToFirstInventory: 13, nativeBlocks: 7,
    rawBodyMathTokens: tokens, sourceFigures: 1, imageOpens: 4,
    incomingContAndOutgoingOpenPreserved: true,
    SOURCE: "INDEPENDENT-PENDING", RAW: "INDEPENDENT-PENDING", SVG: "INDEPENDENT-PENDING",
    rightBoundary: "HOLD-UNREAD-NEXT-PAGE",
    scopeDeviation: report.scope.scopeDeviation,
  };
  put(path.join(own, "integrity.json"), result);
  console.log(JSON.stringify({ path: path.join(own, "integrity.json"), sha256: sha(path.join(own, "integrity.json")), status: result.status }));
} else if (mode === "freeze") {
  const manifest = path.join(own, "frozen-files.json");
  const all = snapshot(own);
  for (const item of all) fs.chmodSync(item.path, 0o444);
  put(manifest, {
    schema: "source208-first/frozen-files@1", timestamp: new Date().toISOString(),
    status: "SOURCE-RAW-SVG-INDEPENDENT-PENDING-RIGHT-BOUNDARY-HOLD",
    files: all.map((item) => ({ ...item, mode: "0444" })),
    reviewedByIndependentAgent: false, completeCardsAdded: 0, canonicalWrites: 0,
  });
  fs.chmodSync(manifest, 0o444);
  const checked = snapshot(own);
  if (checked.some((item) => (fs.statSync(item.path).mode & 0o777) !== 0o444)) throw new Error("Freeze mode mismatch");
  console.log(JSON.stringify({ manifest, sha256: sha(manifest), fileCount: checked.length, report: path.join(own, "report.json"), reportSha256: sha(path.join(own, "report.json")), inventorySha256: sha(path.join(own, "source-inventory.json")), opensLedgerSha256: sha(path.join(own, "opens-ledger.json")) }));
} else {
  throw new Error("Unknown receipt mode");
}

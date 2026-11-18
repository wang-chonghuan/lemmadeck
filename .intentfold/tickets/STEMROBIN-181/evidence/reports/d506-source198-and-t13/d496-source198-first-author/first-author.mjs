import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const root = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d496-source198-first-author");
const prepared = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d494-source198-first-preparation");
const source = path.join(root, "source/10p/pages/0198");
const work = path.join(root, "work/10p/pages/0198");
const python = path.join(repo, ".claude/skills/ld-s10y-lesson/.venv/bin/python");
const p2c = path.join(repo, ".claude/skills/ld-s10y-lesson/tools/p2c.py");
const manifestSHA = "7635b15844db27733174db54142644016fda6b51e591bcc07e83d8f4b7376d39";
const observationSHA = "3ae0b0a1a180166ccda8879e4d2a5b74bd1da9e07ae8094e6ef0e18540d03cfe";

function binding(file) {
  const bytes = fs.readFileSync(file);
  return { path: file, sha256: crypto.createHash("sha256").update(bytes).digest("hex"), bytes: bytes.length };
}
function safe(file) {
  if (!file.startsWith(root + path.sep)) throw new Error("Write outside authorized d496");
}
function writeNew(file, data) {
  safe(file);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, typeof data === "string" ? data : JSON.stringify(data, null, 2) + "\n", { flag: "wx" });
}
function copyNew(from, to) {
  safe(to);
  if (fs.existsSync(to)) throw new Error("Destination already exists");
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.cpSync(from, to, { recursive: true, force: false, errorOnExist: true });
}
function tree(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? tree(file) : entry.isFile() ? [binding(file)] : [];
  });
}
function verifyObservation() {
  const file = path.join(root, "source-observation-freeze.json");
  const seal = binding(file);
  if (seal.sha256 !== observationSHA || (fs.statSync(file).mode & 0o777) !== 0o444) {
    throw new Error("Source observation seal changed or not 0444");
  }
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  for (const item of data.files) {
    if (binding(item.path).sha256 !== item.sha256 ||
        fs.statSync(item.path).size !== item.bytes ||
        (fs.statSync(item.path).mode & 0o777) !== 0o444) {
      throw new Error("Frozen original observation changed");
    }
  }
  const ledger = JSON.parse(fs.readFileSync(path.join(root, "actual-opens.json"), "utf8"));
  if (ledger.totals.old !== 23 || ledger.totals.new !== 1 || ledger.totals.cumulative !== 24) {
    throw new Error("Image ledger mismatch");
  }
  return seal;
}
function verifiedInputs() {
  const manifest = binding(path.join(prepared, "manifest.json"));
  if (manifest.sha256 !== manifestSHA) throw new Error("Preparation manifest changed");
  const data = JSON.parse(fs.readFileSync(manifest.path, "utf8"));
  if (JSON.stringify(data.pages) !== "[198]" || data.inputs.length !== 4) {
    throw new Error("Unexpected preparation scope");
  }
  return [manifest, ...data.inputs.map(item => {
    const file = path.resolve(repo, item.path);
    if (!file.startsWith(prepared + path.sep)) throw new Error("Input outside d494");
    const b = binding(file);
    if (b.sha256 !== item.sha256) throw new Error("Prepared bytes changed");
    return b;
  })];
}
function init() {
  const observation = verifyObservation();
  const originals = verifiedInputs();
  const copies = [];
  for (const item of originals.slice(1)) {
    for (const dir of [source, work]) {
      const file = path.join(dir, path.basename(item.path));
      copyNew(item.path, file);
      const copied = binding(file);
      if (copied.sha256 !== item.sha256) throw new Error("Copy mismatch");
      copies.push({ ...copied, original: item.path });
    }
  }
  copyNew(originals[0].path, path.join(root, "inputs/manifest.json"));
  writeNew(path.join(root, "input-bindings.json"), {
    schema: "stemrobin181/source198-isolated-prepared-copy@1",
    recorded_at: new Date().toISOString(),
    observation,
    originals,
    copies,
    image_decodes_or_opens: 0,
    prepare_runs: 0,
    canonical_writes: 0
  });
  fs.chmodSync(path.join(root, "input-bindings.json"), 0o444);
  console.log(JSON.stringify({ init: "complete", observation, originals_unchanged: true }));
}
function native(command) {
  if (!["finalize", "vectorize"].includes(command)) throw new Error("Unauthorized native command");
  const observation = verifyObservation();
  const dir = path.join(root, "native", `${command}-198-first`);
  if (fs.existsSync(dir)) throw new Error("First attempt already exists; no rerun authorized");
  if (command === "vectorize") {
    const receipt = JSON.parse(fs.readFileSync(path.join(root, "native/finalize-198-first/receipt.json"), "utf8"));
    if (receipt.exit_code !== 0) throw new Error("Cannot vectorize after failed first finalize");
  }
  const originals = verifiedInputs();
  copyNew(source, path.join(dir, "before/source"));
  copyNew(work, path.join(dir, "before/work"));
  const tmp = path.join(root, "runtime-tmp");
  fs.mkdirSync(tmp, { recursive: true });
  const argv = [p2c, command, "--book", "10p", "--page", "198",
    "--root", path.join(root, "source"), "--work", path.join(root, "work")];
  const started = new Date().toISOString();
  writeNew(path.join(dir, "started.json"), {
    command, phase: "first", started_at: started, executable: python, argv, cwd: repo,
    observation, source_before: tree(source), work_before: tree(work),
    originals_before: originals,
    tools: [binding(p2c), binding(path.join(root, "first-author.mjs"))],
    environment_overrides: { PYTHONDONTWRITEBYTECODE: "1", TMPDIR: tmp },
    reviewer_image_opens: 0
  });
  const run = spawnSync(python, argv, {
    cwd: repo, encoding: "utf8", maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1", TMPDIR: tmp }
  });
  writeNew(path.join(dir, "stdout.txt"), run.stdout ?? "");
  writeNew(path.join(dir, "stderr.txt"), run.stderr ?? "");
  copyNew(source, path.join(dir, "after/source"));
  copyNew(work, path.join(dir, "after/work"));
  writeNew(path.join(dir, "receipt.json"), {
    command, phase: "first", started_at: started, finished_at: new Date().toISOString(),
    executable: python, argv, cwd: repo, exit_code: run.status, signal: run.signal,
    error: run.error?.message ?? null,
    stdout: binding(path.join(dir, "stdout.txt")), stderr: binding(path.join(dir, "stderr.txt")),
    source_after: tree(source), work_after: tree(work), originals_after: verifiedInputs(),
    all_first_attempt_bytes_retained: true,
    source_content_independent_gate: "HOLD-NOT-REVIEWED",
    RAW_SVG_independent_gate: "PENDING-NO-PREVIEW-OPEN",
    native_is_not_source_truth: true, image_opens: 0
  });
  console.log(JSON.stringify({ command, phase: "first", exit_code: run.status,
    stdout: run.stdout, stderr: run.stderr, receipt: path.join(dir, "receipt.json") }, null, 2));
}
function seal() {
  const observation = verifyObservation();
  const originals = verifiedInputs();
  const files = tree(root);
  const final = path.join(root, "author-freeze.json");
  for (const item of files) fs.chmodSync(item.path, 0o444);
  writeNew(final, {
    schema: "stemrobin181/source198-first-author-freeze@1",
    ticket: "STEMROBIN-181", batch: "d496-source198-first-author", root,
    frozen_at: new Date().toISOString(), mode: "0444", self_hash_excluded: true,
    report: binding(path.join(root, "report.json")),
    actual_opens: binding(path.join(root, "actual-opens.json")),
    source_observation_freeze: observation,
    originals_unchanged: originals,
    files: files.map(item => ({ ...item, mode: "0444" })),
    SOURCE198_complete_fidelity: "HOLD",
    independent_text_style_RAW_SVG_reviews: "PENDING",
    n75_complete: false, fullcard: false,
    image_totals: { old: 23, new: 1, cumulative: 24, budget_reset: false },
    all_first_native_attempt_bytes_and_historical_FAIL_HOLD_preserved: true
  });
  fs.chmodSync(final, 0o444);
  for (const item of [...files, binding(final)]) {
    if ((fs.statSync(item.path).mode & 0o777) !== 0o444 || binding(item.path).sha256 !== item.sha256) {
      throw new Error("Final seal verification failed");
    }
  }
  for (const file of ["report.json", "author-freeze.json", "actual-opens.json",
    "sourceinventory.json", "source-observation-freeze.json", "input-bindings.json"]) {
    console.log(JSON.stringify({ ...binding(path.join(root, file)), mode: "0444" }));
  }
}

const command = process.argv[2];
if (command === "init") init();
else if (command === "finalize" || command === "vectorize") native(command);
else if (command === "seal") seal();
else throw new Error("Unknown authorized finite operation");

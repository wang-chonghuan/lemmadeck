import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const root = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d467-source197-first-author");
const prepared = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d465-source197-first-preparation");
const expected = "b4746e686dfe51fe3f0d56965ed29e24c4c00d299241a05563a15f0e30aff9f7";
const python = path.join(repo, ".claude/skills/ld-s10y-lesson/.venv/bin/python");
const p2c = path.join(repo, ".claude/skills/ld-s10y-lesson/tools/p2c.py");
const source = path.join(root, "source/10p/pages/0197");
const work = path.join(root, "work/10p/pages/0197");
const inventory = path.join(root, "source-inventory-197.md");

function binding(file) {
  const bytes = fs.readFileSync(file);
  return { path: file, sha256: crypto.createHash("sha256").update(bytes).digest("hex"), bytes: bytes.length };
}
function safe(file) {
  if (!file.startsWith(root + path.sep)) throw new Error("Write outside authorized root");
}
function writeNew(file, data) {
  safe(file);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, typeof data === "string" ? data : JSON.stringify(data, null, 2) + "\n", { flag: "wx" });
}
function copyNew(from, to) {
  safe(to);
  if (fs.existsSync(to)) throw new Error("Existing copy destination");
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
function verifiedInputs() {
  const manifest = binding(path.join(prepared, "manifest.json"));
  if (manifest.sha256 !== expected) throw new Error("Manifest changed");
  const data = JSON.parse(fs.readFileSync(manifest.path, "utf8"));
  if (JSON.stringify(data.pages) !== "[197]" || data.inputs.length !== 4) throw new Error("Unexpected source scope");
  return [manifest, ...data.inputs.map(item => {
    const file = path.resolve(repo, item.path);
    if (!file.startsWith(prepared + path.sep)) throw new Error("Input outside authorized preparation");
    const record = binding(file);
    if (record.sha256 !== item.sha256) throw new Error("Prepared input changed");
    return record;
  })];
}
function init() {
  const originals = verifiedInputs();
  const prior = binding(path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d458-n71-q3-first-choice-author/actual-opens.json"));
  if (prior.sha256 !== "f69b78d4e56a96e4541bc36ff46284b53f9e8cf2ae8a55a96a077652f5b55e71" ||
      JSON.parse(fs.readFileSync(prior.path, "utf8")).context_cumulative_opens !== 16) throw new Error("Prior ledger changed");
  const copies = [];
  for (const item of originals.slice(1)) {
    for (const directory of [source, work]) {
      const file = path.join(directory, path.basename(item.path));
      copyNew(item.path, file);
      const copied = binding(file);
      if (copied.sha256 !== item.sha256) throw new Error("Copy mismatch");
      copies.push({ ...copied, original: item.path });
    }
  }
  copyNew(originals[0].path, path.join(root, "inputs/manifest.json"));
  writeNew(path.join(root, "input-bindings.json"), {
    schema: "d467-prepared-byte-copy@1", recorded_at: new Date().toISOString(),
    originals, copies, prepare_runs: 0
  });
  writeNew(path.join(root, "actual-opens.json"), {
    schema: "d467-actual-image-opens@1", ticket: "STEMROBIN-181",
    helper: "same-original-source-author-finite-batch", prior_record: prior,
    prior_actual_opens: 16, batch_actual_opens: 2, batch_limit: 2,
    context_cumulative_opens: 18, context_cumulative_limit: 24, no_budget_reset: true,
    crops_opened: 0, candidate_images_opened: 0, reopens: 0, images_returned_to_parent: 0,
    entries: originals.slice(1, 3).map((item, i) => ({
      ...item, batch_ordinal: i + 1, cumulative_ordinal: 17 + i,
      tool: "functions.view_image", detail: "original",
      role: i === 0 ? "first-source197-page" : "first-source197-grid"
    })),
    source_inventory: binding(inventory), d463_revoked_not_executed: true,
    batch_complete: true, next_action: "no-further-image-opens-this-batch"
  });
  if (fs.existsSync(path.join(source, "page.md"))) throw new Error("Inventory must precede transcription");
  for (const file of [inventory, path.join(root, "input-bindings.json"), path.join(root, "actual-opens.json")]) fs.chmodSync(file, 0o444);
  writeNew(path.join(root, "pretranscription-freeze.json"), {
    schema: "d467-source-inventory-freeze@1", frozen_at: new Date().toISOString(),
    inventory: binding(inventory), actual_opens: binding(path.join(root, "actual-opens.json")),
    inventory_mode: "0444", page_md_absent: true, native_runs: 0,
    cumulative_opens: 18, independent_review: "PENDING"
  });
  fs.chmodSync(path.join(root, "pretranscription-freeze.json"), 0o444);
  console.log(JSON.stringify(binding(inventory)));
}
function native(command, phase = "first") {
  if (!["finalize", "vectorize"].includes(command) ||
      !["first", "affected"].includes(phase) ||
      (phase === "affected" && (command !== "finalize" || !fs.existsSync(path.join(root, "local-repair.json"))))) {
    throw new Error("Unauthorized native attempt");
  }
  const directory = path.join(root, "native", `${command}-197-${phase}`);
  if (fs.existsSync(directory)) throw new Error("Attempt already retained");
  const originals = verifiedInputs();
  copyNew(source, path.join(directory, "before/source"));
  copyNew(work, path.join(directory, "before/work"));
  const tmp = path.join(root, "runtime-tmp");
  fs.mkdirSync(tmp, { recursive: true });
  const argv = [p2c, command, "--book", "10p", "--page", "197", "--root", path.join(root, "source"), "--work", path.join(root, "work")];
  const started = new Date().toISOString();
  writeNew(path.join(directory, "started.json"), {
    command, phase, started_at: started, executable: python, argv, cwd: repo,
    source_before: tree(source), work_before: tree(work), originals_before: originals,
    source_inventory_freeze: binding(path.join(root, "pretranscription-freeze.json")),
    tools: [binding(p2c), binding(fs.realpathSync(python)), binding(path.join(root, "first-author.mjs"))],
    environment_overrides: { PYTHONDONTWRITEBYTECODE: "1", TMPDIR: tmp }
  });
  const run = spawnSync(python, argv, { cwd: repo, encoding: "utf8",
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1", TMPDIR: tmp }, maxBuffer: 16 * 1024 * 1024 });
  writeNew(path.join(directory, "stdout.txt"), run.stdout ?? "");
  writeNew(path.join(directory, "stderr.txt"), run.stderr ?? "");
  copyNew(source, path.join(directory, "after/source"));
  copyNew(work, path.join(directory, "after/work"));
  writeNew(path.join(directory, "receipt.json"), {
    command, phase, started_at: started, finished_at: new Date().toISOString(),
    executable: python, argv, cwd: repo, exit_code: run.status, signal: run.signal,
    error: run.error?.message ?? null, stdout: binding(path.join(directory, "stdout.txt")),
    stderr: binding(path.join(directory, "stderr.txt")), source_after: tree(source),
    work_after: tree(work), originals_after: verifiedInputs(), all_attempt_bytes_retained: true,
    independent_source_raw_svg_review: "PENDING"
  });
  console.log(JSON.stringify({ command, phase, exit_code: run.status, stdout: run.stdout,
    stderr: run.stderr, receipt: path.join(directory, "receipt.json") }, null, 2));
}
function seal() {
  const files = tree(root);
  const final = path.join(root, "author-freeze.json");
  writeNew(final, {
    schema: "d467-source197-first-author-freeze@1", ticket: "STEMROBIN-181", root,
    frozen_at: new Date().toISOString(), report: binding(path.join(root, "report.json")),
    actual_opens: binding(path.join(root, "actual-opens.json")), source_inventory: binding(inventory),
    originals_unchanged: verifiedInputs(), files, all_final_files_mode: "0444",
    independent_reviews: "PENDING", historical_fail_hold_preserved: true, no_budget_reset: true
  });
  for (const item of [...files, binding(final)]) fs.chmodSync(item.path, 0o444);
  for (const name of ["report.json", "author-freeze.json", "actual-opens.json",
    "source-inventory-197.md", "pretranscription-freeze.json"]) console.log(JSON.stringify(binding(path.join(root, name))));
}
const [command, phase] = process.argv.slice(2);
if (command === "init") init();
else if (["finalize", "vectorize"].includes(command)) native(command, phase);
else if (command === "seal") seal();
else throw new Error("Unknown finite operation");

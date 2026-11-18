import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const root = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d453-source196-first-author");
const prepared = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d451-source196-first-preparation");
const expected = "fdaac8dc347f8ac442b14dacc8ad21de1910a65b5fe9f5c47f65470a88001e06";
const prior = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d435-source193195-first-author/actual-opens.json");
const python = path.join(repo, ".claude/skills/ld-s10y-lesson/.venv/bin/python");
const p2c = path.join(repo, ".claude/skills/ld-s10y-lesson/tools/p2c.py");
const source = path.join(root, "source/10p/pages/0196");
const work = path.join(root, "work/10p/pages/0196");
const inventory = path.join(root, "source-inventory-196.md");

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
  if (manifest.sha256 !== expected) throw new Error("Prepared manifest changed");
  const records = JSON.parse(fs.readFileSync(manifest.path, "utf8")).inputs.map(item => {
    const record = binding(path.resolve(repo, item.path));
    if (record.sha256 !== item.sha256) throw new Error("Prepared bytes changed");
    return record;
  });
  if (records.length !== 4) throw new Error("Expected four prepared inputs");
  return [manifest, ...records];
}
function init() {
  const records = verifiedInputs();
  const priorBinding = binding(prior);
  if (priorBinding.sha256 !== "4ed986c1d56bd5b766fc1aaee76222aa7e6b702ac2d48f58316bf3a70f03164e" ||
      JSON.parse(fs.readFileSync(prior, "utf8")).context_cumulative_opens !== 14) {
    throw new Error("Inherited actual-open record mismatch");
  }
  const copies = [];
  for (const record of records.slice(1)) {
    for (const destination of [source, work]) {
      const target = path.join(destination, path.basename(record.path));
      copyNew(record.path, target);
      const copied = binding(target);
      if (copied.sha256 !== record.sha256) throw new Error("Byte-copy mismatch");
      copies.push({ ...copied, original: record.path });
    }
  }
  copyNew(records[0].path, path.join(root, "inputs/manifest.json"));
  writeNew(path.join(root, "input-bindings.json"), {
    schema: "d453-prepared-byte-copy@1", recorded_at: new Date().toISOString(),
    prepared_manifest_sha256: expected, originals: records, copies, prepare_runs: 0
  });
  writeNew(path.join(root, "actual-opens.json"), {
    schema: "d453-actual-image-opens@1", ticket: "STEMROBIN-181",
    helper: "same-existing-helper-finite-d453-source196-first-author",
    prior_actual_opens: 14, prior_record: priorBinding, no_image_history_reset: true,
    batch_actual_opens: 2, batch_limit: 3, context_cumulative_opens: 16,
    context_cumulative_limit: 24, source_page_and_grid_opens: 2,
    necessary_source_detail_crop_opens: 0, candidate_raw_or_svg_preview_opens: 0,
    reopens: 0, images_returned_to_parent: 0,
    entries: records.slice(1, 3).map((record, index) => ({
      ...record, batch_ordinal: index + 1, cumulative_ordinal: 15 + index,
      tool: "functions.view_image", detail: "original",
      role: index === 0 ? "first-source-page-before-compaction" : "first-source-grid-after-compaction",
      observation_timestamp: null, timestamp_note: "Tool observation order retained; wall-clock time not reconstructed."
    })),
    source_inventory: binding(inventory), batch_complete: true,
    remaining_batch_allowance_unused: 1, next_action: "no-more-image-opens-in-d453"
  });
  for (const file of [inventory, path.join(root, "actual-opens.json"), path.join(root, "input-bindings.json")]) {
    fs.chmodSync(file, 0o444);
  }
  if (fs.existsSync(path.join(source, "page.md")) || fs.existsSync(path.join(work, "page.md"))) {
    throw new Error("Transcription must not precede inventory freeze");
  }
  writeNew(path.join(root, "pretranscription-freeze.json"), {
    schema: "d453-source-inventory-freeze@1", frozen_at: new Date().toISOString(),
    inventory: binding(inventory), actual_opens: binding(path.join(root, "actual-opens.json")),
    mode: "0444", page_md_absent_at_freeze: true, native_runs_at_freeze: 0,
    cumulative_opens: 16, independent_reviews: "PENDING"
  });
  fs.chmodSync(path.join(root, "pretranscription-freeze.json"), 0o444);
  console.log(JSON.stringify({ inventory: binding(inventory), cumulative_opens: 16 }));
}
function native(command) {
  if (!["finalize", "vectorize"].includes(command)) throw new Error("Unauthorized native operation");
  const directory = path.join(root, "native", `${command}-196-first`);
  if (fs.existsSync(directory)) throw new Error("First native attempt already exists; no retry");
  const originals = verifiedInputs();
  copyNew(source, path.join(directory, "before/source"));
  copyNew(work, path.join(directory, "before/work"));
  const tmp = path.join(root, "runtime-tmp");
  fs.mkdirSync(tmp, { recursive: true });
  const argv = [p2c, command, "--book", "10p", "--page", "196",
    "--root", path.join(root, "source"), "--work", path.join(root, "work")];
  const started = new Date().toISOString();
  writeNew(path.join(directory, "started.json"), {
    command, page: 196, attempt: 1, started_at: started, executable: python, argv,
    cwd: repo, prepared_bindings_before: originals,
    source_before: tree(source), work_before: tree(work),
    inventory_freeze: binding(path.join(root, "pretranscription-freeze.json")),
    tools: [binding(p2c), binding(fs.realpathSync(python)), binding(path.join(root, "first-author.mjs"))],
    environment_overrides: { PYTHONDONTWRITEBYTECODE: "1", TMPDIR: tmp }
  });
  const run = spawnSync(python, argv, {
    cwd: repo, env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1", TMPDIR: tmp },
    encoding: "utf8", maxBuffer: 16 * 1024 * 1024
  });
  writeNew(path.join(directory, "stdout.txt"), run.stdout ?? "");
  writeNew(path.join(directory, "stderr.txt"), run.stderr ?? "");
  copyNew(source, path.join(directory, "after/source"));
  copyNew(work, path.join(directory, "after/work"));
  writeNew(path.join(directory, "receipt.json"), {
    command, page: 196, attempt: 1, started_at: started, finished_at: new Date().toISOString(),
    executable: python, argv, cwd: repo, exit_code: run.status, signal: run.signal,
    error: run.error?.message ?? null, stdout: binding(path.join(directory, "stdout.txt")),
    stderr: binding(path.join(directory, "stderr.txt")), source_after: tree(source),
    work_after: tree(work), prepared_bindings_after: verifiedInputs(),
    first_attempt_all_bytes_retained: true, retries: 0, independent_reviews: "PENDING"
  });
  console.log(JSON.stringify({ command, exit_code: run.status, stdout: run.stdout,
    stderr: run.stderr, receipt: path.join(directory, "receipt.json") }, null, 2));
}
function seal() {
  const files = tree(root);
  const final = path.join(root, "author-freeze.json");
  writeNew(final, {
    schema: "d453-source196-first-author-freeze@1", ticket: "STEMROBIN-181",
    root, frozen_at: new Date().toISOString(), report: binding(path.join(root, "report.json")),
    actual_opens: binding(path.join(root, "actual-opens.json")),
    source_inventory: binding(inventory), originals_unchanged: verifiedInputs(),
    files, final_file_mode: "0444", independent_reviews: "PENDING",
    historical_fail_hold_untouched: true, no_budget_reset: true
  });
  for (const item of [...files, binding(final)]) fs.chmodSync(item.path, 0o444);
  for (const name of ["report.json", "author-freeze.json", "actual-opens.json",
    "source-inventory-196.md", "pretranscription-freeze.json"]) {
    console.log(JSON.stringify(binding(path.join(root, name))));
  }
}
const [command] = process.argv.slice(2);
if (command === "init") init();
else if (["finalize", "vectorize"].includes(command)) native(command);
else if (command === "seal") seal();
else throw new Error("Unknown finite operation");

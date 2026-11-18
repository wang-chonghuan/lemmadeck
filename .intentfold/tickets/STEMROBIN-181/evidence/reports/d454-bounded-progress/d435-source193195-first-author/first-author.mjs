import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const root = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d435-source193195-first-author");
const prepared = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d425-source193195-first-preparation");
const manifestHash = "c93512b59fd4c126025436a22a07afa67e06ac6bf9d5b041a1f11985c8a89550";
const python = path.join(repo, ".claude/skills/ld-s10y-lesson/.venv/bin/python");
const p2c = path.join(repo, ".claude/skills/ld-s10y-lesson/tools/p2c.py");
const pages = [193, 194, 195];

function binding(file) {
  const bytes = fs.readFileSync(file);
  return { path: file, sha256: crypto.createHash("sha256").update(bytes).digest("hex"), bytes: bytes.length };
}

function writeNew(file, data) {
  if (!file.startsWith(root + path.sep)) throw new Error("Write outside authorized root");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n", { flag: "wx" });
}

function copyNew(from, to) {
  if (!to.startsWith(root + path.sep) || fs.existsSync(to)) throw new Error("Unsafe copy destination");
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.cpSync(from, to, { recursive: true, errorOnExist: true, force: false });
}

function tree(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? tree(file) : entry.isFile() ? [binding(file)] : [];
  });
}

function verifiedInputs() {
  const manifestPath = path.join(prepared, "manifest.json");
  if (binding(manifestPath).sha256 !== manifestHash) throw new Error("Prepared manifest changed");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const records = [binding(manifestPath)];
  for (const item of [...manifest.inputs, ...manifest.receipts]) {
    const record = binding(path.resolve(repo, item.path));
    if (record.sha256 !== item.sha256) throw new Error("Prepared input changed: " + record.path);
    records.push(record);
  }
  return records;
}

function env() {
  const tmp = path.join(root, "runtime-tmp");
  fs.mkdirSync(tmp, { recursive: true });
  return { ...process.env, PYTHONDONTWRITEBYTECODE: "1", TMPDIR: tmp, PWDEBUG: "0", PLAYWRIGHT_HTML_OPEN: "never" };
}

function init() {
  const original = verifiedInputs();
  copyNew(path.join(prepared, "work"), path.join(root, "work"));
  copyNew(path.join(prepared, "work"), path.join(root, "source"));
  for (const name of ["manifest.json", ...pages.map(page => `prepare-${page}.receipt.json`)]) {
    copyNew(path.join(prepared, name), path.join(root, "inputs", name));
  }
  const copies = [];
  for (const record of original.filter(item => item.path.startsWith(path.join(prepared, "work") + path.sep))) {
    const relative = path.relative(path.join(prepared, "work"), record.path);
    for (const directory of ["work", "source"]) {
      const copied = binding(path.join(root, directory, relative));
      if (copied.sha256 !== record.sha256) throw new Error("Copy mismatch");
      copies.push({ ...copied, original: record.path });
    }
  }
  writeNew(path.join(root, "input-bindings.json"), {
    schema: "d435-prepared-byte-copy@1", started_at: new Date().toISOString(),
    root, prepared, manifest_sha256: manifestHash,
    original, copies, preparation_runs: 0, cumulative_image_start: 6
  });
  console.log("Prepared source/work copies verified; no prepare invocation.");
}

function crop(page, name, box) {
  if (!pages.includes(page) || !/^[a-z0-9-]+$/.test(name) || box.length !== 4 || box.some(value => !Number.isInteger(value) || value < 0)) {
    throw new Error("Invalid crop");
  }
  const output = path.join(root, "source-details", name + ".png");
  if (fs.existsSync(output)) throw new Error("Crop already exists");
  fs.mkdirSync(path.dirname(output), { recursive: true });
  const input = path.join(root, "source/10p/pages", String(page).padStart(4, "0"), "page.png");
  const code = "from PIL import Image; import sys; im=Image.open(sys.argv[1]); x,y,w,h=map(int,sys.argv[3:]); im.crop((x,y,x+w,y+h)).save(sys.argv[2])";
  const argv = ["-c", code, input, output, ...box.map(String)];
  const run = spawnSync(python, argv, { cwd: repo, env: env(), encoding: "utf8" });
  writeNew(path.join(root, "source-details", name + ".receipt.json"), {
    operation: "machine-only-source-detail-crop", page, box_xywh: box,
    executable: python, argv, input: binding(input), output: fs.existsSync(output) ? binding(output) : null,
    exit_code: run.status, signal: run.signal, error: run.error?.message ?? null,
    stdout: run.stdout, stderr: run.stderr, image_open: false
  });
  if (run.status !== 0) throw new Error("Crop failed");
  console.log(output);
}

function native(command, page, phase = "first") {
  if (!["finalize", "vectorize"].includes(command) || !pages.includes(page) || !["first", "affected"].includes(phase)) {
    throw new Error("Unauthorized native command");
  }
  if (phase === "affected" && command !== "finalize") throw new Error("No repeated vectorize");
  const key = `${command}-${page}-${phase}`;
  const directory = path.join(root, "native", key);
  if (fs.existsSync(directory)) throw new Error("This native attempt is already retained");
  const number = String(page).padStart(4, "0");
  const source = path.join(root, "source/10p/pages", number);
  const work = path.join(root, "work/10p/pages", number);
  const original = verifiedInputs();
  copyNew(source, path.join(directory, "before", "source"));
  copyNew(work, path.join(directory, "before", "work"));
  const argv = [p2c, command, "--book", "10p", "--page", String(page), "--root", path.join(root, "source"), "--work", path.join(root, "work")];
  const started = new Date().toISOString();
  writeNew(path.join(directory, "started.json"), {
    command, page, phase, started_at: started, executable: python, argv, cwd: repo,
    tool_bindings: [binding(p2c), binding(fs.realpathSync(python)), binding(path.join(root, "first-author.mjs"))],
    prepared_bindings_before: original, source_before: tree(source), work_before: tree(work),
    environment_overrides: { PYTHONDONTWRITEBYTECODE: "1", TMPDIR: path.join(root, "runtime-tmp"), PWDEBUG: "0", PLAYWRIGHT_HTML_OPEN: "never" }
  });
  const run = spawnSync(python, argv, { cwd: repo, env: env(), encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });
  fs.writeFileSync(path.join(directory, "stdout.txt"), run.stdout ?? "", { flag: "wx" });
  fs.writeFileSync(path.join(directory, "stderr.txt"), run.stderr ?? "", { flag: "wx" });
  copyNew(source, path.join(directory, "after", "source"));
  copyNew(work, path.join(directory, "after", "work"));
  const unchanged = verifiedInputs();
  writeNew(path.join(directory, "receipt.json"), {
    command, page, phase, started_at: started, finished_at: new Date().toISOString(),
    executable: python, argv, cwd: repo, exit_code: run.status, signal: run.signal, error: run.error?.message ?? null,
    stdout: binding(path.join(directory, "stdout.txt")), stderr: binding(path.join(directory, "stderr.txt")),
    source_after: tree(source), work_after: tree(work), prepared_bindings_after: unchanged,
    snapshots_preserved: true, no_retry: true, independent_source_raw_svg_review: "PENDING"
  });
  console.log(JSON.stringify({ command, page, phase, exit_code: run.status, stdout: run.stdout, stderr: run.stderr, receipt: path.join(directory, "receipt.json") }, null, 2));
}

function seal() {
  const final = path.join(root, "author-freeze.json");
  if (fs.existsSync(final)) throw new Error("Already frozen");
  const originals = verifiedInputs();
  const files = tree(root);
  writeNew(final, {
    schema: "d435-source193195-first-author-freeze@1", ticket: "STEMROBIN-181", root,
    frozen_at: new Date().toISOString(), frozen: true, report: binding(path.join(root, "report.json")),
    actual_opens: binding(path.join(root, "actual-opens.json")), original_prepared_bindings: originals,
    files, history_preserved: true, independent_reviews: "PENDING",
    no_assemble_modern_db_git_deploy_index_meter_paidgen: true
  });
  for (const name of ["report.json", "author-freeze.json", "actual-opens.json"]) fs.chmodSync(path.join(root, name), 0o444);
  for (const name of ["report.json", "author-freeze.json", "actual-opens.json"]) console.log(JSON.stringify(binding(path.join(root, name))));
}

const [command, ...args] = process.argv.slice(2);
if (command === "init") init();
else if (command === "crop") crop(Number(args[0]), args[1], args.slice(2).map(Number));
else if (["finalize", "vectorize"].includes(command)) native(command, Number(args[0]), args[1]);
else if (command === "seal") seal();
else throw new Error("Unknown bounded operation");

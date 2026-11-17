import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const previous = path.dirname(here);
const root = "/Users/yong/.codex/worktrees/a07e/lemmadeck";
const python = path.join(root, ".claude/skills/ld-s10y-lesson/.venv/bin/python");
const production = path.join(root, ".claude/skills/ld-s10y-lesson/tools/layout.py");
const released = path.join(root, ".intentfold/tickets/STEMROBIN-184/tmp/counter-vector-rows/report.md");
const v3SHA = "97b320b016afdf1a5deca0e5d1c89d06cf95914b1ace61d1a7c4b811e6df35e6";
const baselineSHA = "eb6fca6d9a62663ed7e97d7f39cda32d803375f61bf71adbf9aac84b4c335c3d";
const reportSHA = "534986e4919a34cb448dfa0a9497cf5f75785f82bc201bfd24e41868bccd60bb";
const sha = bytes => crypto.createHash("sha256").update(bytes).digest("hex");

function save(file, bytes) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, bytes, { flag: "wx" });
}

function json(file, value) {
  save(file, JSON.stringify(value, null, 2) + "\n");
}

function identity(file) {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length, sha256: sha(bytes) };
}

function inventory(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    if (file === here) return [];
    return entry.isDirectory() ? inventory(file) : [identity(file)];
  }).sort((first, second) => first.path.localeCompare(second.path));
}

function protect() {
  if (identity(production).sha256 !== baselineSHA || identity(released).sha256 !== reportSHA
    || identity(path.join(previous, "candidate/layout.py")).sha256 !== v3SHA) {
    throw new Error("Frozen production/report/v3 identity changed");
  }
  const before = path.join(here, "before.json");
  if (fs.existsSync(before)) {
    const saved = JSON.parse(fs.readFileSync(before));
    const actual = inventory(previous);
    if (JSON.stringify(saved.previous_inventory) !== JSON.stringify(actual)) {
      throw new Error("A previous v1-v3 file changed; no repair or overwrite permitted");
    }
  }
}

function retain(file, relative, files) {
  const target = path.join(here, relative);
  save(target, fs.readFileSync(file));
  files.push({ ...identity(file), retained_path: target, retained_sha256: identity(target).sha256 });
}

const [mode, label, script, ...args] = process.argv.slice(2);
protect();
if (mode === "bootstrap") {
  if (fs.existsSync(path.join(here, "before.json"))) throw new Error("Already captured");
  const patch = ["*** Begin Patch"];
  for (const [source, target] of [
    ["candidate/layout.py", "v3/layout.py"],
    ["candidate/layout.py", "candidate/layout.py"],
    ["baseline/layout.py", "baseline/layout.py"],
    ["test_contracts.py", "test_contracts.py"],
  ]) {
    const bytes = fs.readFileSync(path.join(previous, source));
    patch.push(`*** Add File: ${path.join(here, target)}`,
      ...bytes.toString().trimEnd().split("\n").map(line => `+${line}`));
  }
  patch.push("*** End Patch", "");
  const started = new Date().toISOString();
  const result = spawnSync("apply_patch", [], { cwd: root, input: patch.join("\n") });
  const directory = path.join(here, "commands/bootstrap-copy");
  save(path.join(directory, "stdout.raw"), result.stdout ?? Buffer.alloc(0));
  save(path.join(directory, "stderr.raw"), result.stderr ?? Buffer.alloc(0));
  json(path.join(directory, "result.json"), {
    command: ["apply_patch"], cwd: root, started_at: started,
    finished_at: new Date().toISOString(), exit: result.status,
    signal: result.signal, error: result.error?.message ?? null,
    patch_sha256: sha(Buffer.from(patch.join("\n"))),
    stdout: identity(path.join(directory, "stdout.raw")),
    stderr: identity(path.join(directory, "stderr.raw")),
  });
  if (result.status !== 0) throw new Error("apply_patch copy failed");
  for (const name of ["v3/layout.py", "candidate/layout.py"]) {
    if (identity(path.join(here, name)).sha256 !== v3SHA) throw new Error("Not exact v3");
  }
  if (identity(path.join(here, "baseline/layout.py")).sha256 !== baselineSHA) {
    throw new Error("Not exact eb6 baseline");
  }
  const files = [];
  retain(production, "protected/production-layout.py", files);
  retain(released, "protected/released-report.md", files);
  for (const name of ["report.md", "manifest.json", "baseline-to-candidate.diff",
    "tests-v3.json", "test_contracts.py", "residual-geometry.json",
    "commands/candidate-v3-contracts/result.json",
    "commands/candidate-v3-contracts/stdout.raw",
    "commands/candidate-v3-contracts/stderr.raw"]) {
    retain(path.join(previous, name), `protected/v3/${name}`, files);
  }
  const previous_inventory = inventory(previous);
  json(path.join(here, "before.json"), {
    captured_at: new Date().toISOString(), previous_inventory, files,
    v3_sha256: v3SHA, production_sha256: baselineSHA, report_sha256: reportSHA,
  });
  protect();
  console.log(JSON.stringify({ mode, protected_prior_files: previous_inventory.length,
    v3_sha256: v3SHA, baseline_sha256: baselineSHA }));
} else if (mode === "run") {
  if (!/^[a-z0-9-]+$/.test(label ?? "")) throw new Error("Invalid evidence label");
  const directory = path.join(here, "commands", label);
  if (fs.existsSync(directory)) throw new Error("Command evidence already retained");
  const target = path.join(here, script);
  save(path.join(directory, "sources/layout.py"), fs.readFileSync(path.join(here, "candidate/layout.py")));
  save(path.join(directory, "sources/script.py"), fs.readFileSync(target));
  const command = [python, "-B", target, ...args];
  const started = new Date().toISOString();
  const result = spawnSync(command[0], command.slice(1), { cwd: root, maxBuffer: 32 * 1024 * 1024 });
  save(path.join(directory, "stdout.raw"), result.stdout ?? Buffer.alloc(0));
  save(path.join(directory, "stderr.raw"), result.stderr ?? Buffer.alloc(0));
  json(path.join(directory, "result.json"), {
    command, cwd: root, started_at: started, finished_at: new Date().toISOString(),
    exit: result.status, signal: result.signal, error: result.error?.message ?? null,
    candidate: identity(path.join(here, "candidate/layout.py")),
    script: identity(target),
    stdout: identity(path.join(directory, "stdout.raw")),
    stderr: identity(path.join(directory, "stderr.raw")),
  });
  protect();
  console.log(JSON.stringify({ label, exit: result.status,
    result_path: path.join(directory, "result.json") }));
  process.exitCode = result.status ?? 1;
} else {
  throw new Error("Expected bootstrap or run");
}

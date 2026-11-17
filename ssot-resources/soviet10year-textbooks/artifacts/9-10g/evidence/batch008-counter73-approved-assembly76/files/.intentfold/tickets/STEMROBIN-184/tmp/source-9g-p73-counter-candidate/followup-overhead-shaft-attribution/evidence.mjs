import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const parent = path.dirname(here);
const v5 = path.join(parent, "followup-original-glyph-attribution");
const root = "/Users/yong/.codex/worktrees/a07e/lemmadeck";
const production = path.join(root, ".claude/skills/ld-s10y-lesson/tools/layout.py");
const released = path.join(root, ".intentfold/tickets/STEMROBIN-184/tmp/counter-vector-rows/report.md");
const python = path.join(root, ".claude/skills/ld-s10y-lesson/.venv/bin/python");
const v5SHA = "5215ec429c4382036c70ef0e0bd86970048f5c1ea4f7dacef8840ab9b8a7688e";
const productionSHA = "eb6fca6d9a62663ed7e97d7f39cda32d803375f61bf71adbf9aac84b4c335c3d";
const releasedSHA = "534986e4919a34cb448dfa0a9497cf5f75785f82bc201bfd24e41868bccd60bb";
const sha = bytes => crypto.createHash("sha256").update(bytes).digest("hex");

function identity(file) {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length, sha256: sha(bytes) };
}

function save(file, bytes) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, bytes, { flag: "wx" });
}

function json(file, value) {
  save(file, JSON.stringify(value, null, 2) + "\n");
}

function inventory(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    if (file === here) return [];
    return entry.isDirectory() ? inventory(file) : [identity(file)];
  }).sort((a, b) => a.path.localeCompare(b.path));
}

function protect() {
  if (identity(production).sha256 !== productionSHA || identity(released).sha256 !== releasedSHA
    || identity(path.join(v5, "candidate/layout.py")).sha256 !== v5SHA) {
    throw new Error("Frozen production/released/v5 changed");
  }
  const beforePath = path.join(here, "before.json");
  if (fs.existsSync(beforePath)) {
    const before = JSON.parse(fs.readFileSync(beforePath));
    if (JSON.stringify(inventory(parent)) !== JSON.stringify(before.previous_inventory)) {
      throw new Error("A v1-v5 file changed; never overwrite or repair it");
    }
    for (const name of ["test_contracts.py", "test_carriers.py"]) {
      if (!fs.readFileSync(path.join(here, name)).equals(fs.readFileSync(path.join(v5, name)))) {
        throw new Error("Frozen test bytes changed");
      }
    }
  }
}

const [mode, label, script, ...args] = process.argv.slice(2);
protect();
if (mode === "bootstrap") {
  if (fs.existsSync(path.join(here, "before.json"))) throw new Error("Already bootstrapped");
  const lines = ["*** Begin Patch"];
  for (const [source, target] of [
    [path.join(v5, "candidate/layout.py"), "v5/layout.py"],
    [path.join(v5, "candidate/layout.py"), "candidate/layout.py"],
    [path.join(v5, "baseline/layout.py"), "baseline/layout.py"],
    [path.join(v5, "test_contracts.py"), "test_contracts.py"],
    [path.join(v5, "test_carriers.py"), "test_carriers.py"],
  ]) {
    const bytes = fs.readFileSync(source);
    lines.push(`*** Add File: ${path.join(here, target)}`,
      ...bytes.toString().trimEnd().split("\n").map(line => `+${line}`));
  }
  lines.push("*** End Patch", "");
  const started = new Date().toISOString();
  const patch = Buffer.from(lines.join("\n"));
  const result = spawnSync("apply_patch", [], { cwd: root, input: patch });
  const directory = path.join(here, "commands/bootstrap-copy");
  save(path.join(directory, "patch.txt"), patch);
  save(path.join(directory, "stdout.raw"), result.stdout ?? Buffer.alloc(0));
  save(path.join(directory, "stderr.raw"), result.stderr ?? Buffer.alloc(0));
  json(path.join(directory, "result.json"), {
    command: ["apply_patch"], cwd: root, started_at: started, finished_at: new Date().toISOString(),
    exit: result.status, signal: result.signal, error: result.error?.message ?? null,
    patch: identity(path.join(directory, "patch.txt")),
    stdout: identity(path.join(directory, "stdout.raw")), stderr: identity(path.join(directory, "stderr.raw")),
  });
  if (result.status !== 0) throw new Error("Exact-copy apply_patch failed");
  const files = [];
  for (const [source, target] of [
    [production, "protected/production-layout.py"],
    [released, "protected/released-report.md"],
    ...["report.md", "manifest.json", "baseline-to-followup.diff", "v3-to-followup.diff",
      "tests-v4.json", "tests-v5.json", "carrier-tests-v4.json", "carrier-tests-v5.json",
      "commands/candidate-v4-contracts/result.json",
      "commands/candidate-v4-contracts/stdout.raw", "commands/candidate-v4-contracts/stderr.raw",
      "commands/candidate-v5-contracts/result.json",
      "commands/candidate-v5-contracts/stdout.raw", "commands/candidate-v5-contracts/stderr.raw",
      "commands/candidate-v4-carrier-contracts/result.json",
      "commands/candidate-v4-carrier-contracts/stdout.raw", "commands/candidate-v4-carrier-contracts/stderr.raw",
    ].map(name => [path.join(v5, name), `protected/v5/${name}`]),
  ]) {
    const destination = path.join(here, target);
    save(destination, fs.readFileSync(source));
    files.push({ ...identity(source), retained: identity(destination) });
  }
  json(path.join(here, "before.json"), {
    captured_at: new Date().toISOString(), production_sha256: productionSHA,
    released_sha256: releasedSHA, v5_sha256: v5SHA,
    previous_inventory: inventory(parent), files,
    frozen_tests: ["test_contracts.py", "test_carriers.py"].map(name => identity(path.join(here, name))),
  });
  protect();
  if (identity(path.join(here, "candidate/layout.py")).sha256 !== v5SHA) throw new Error("Not exact v5");
  console.log(JSON.stringify({ previous_files_preserved: inventory(parent).length, v5_sha256: v5SHA }));
} else if (mode === "run") {
  if (!/^[a-z0-9-]+$/.test(label ?? "")) throw new Error("Invalid evidence label");
  const directory = path.join(here, "commands", label);
  if (fs.existsSync(directory)) throw new Error("A retained command cannot be rerun");
  const target = path.join(here, script);
  save(path.join(directory, "sources/layout.py"), fs.readFileSync(path.join(here, "candidate/layout.py")));
  save(path.join(directory, "sources/script.py"), fs.readFileSync(target));
  for (const name of ["test_contracts.py", "test_carriers.py"]) {
    save(path.join(directory, "sources", name), fs.readFileSync(path.join(here, name)));
  }
  const command = [python, "-B", target, ...args];
  const started = new Date().toISOString();
  const result = spawnSync(command[0], command.slice(1), { cwd: root, maxBuffer: 32 * 1024 * 1024 });
  save(path.join(directory, "stdout.raw"), result.stdout ?? Buffer.alloc(0));
  save(path.join(directory, "stderr.raw"), result.stderr ?? Buffer.alloc(0));
  json(path.join(directory, "result.json"), {
    command, cwd: root, started_at: started, finished_at: new Date().toISOString(),
    exit: result.status, signal: result.signal, error: result.error?.message ?? null,
    candidate: identity(path.join(here, "candidate/layout.py")), script: identity(target),
    frozen_tests: ["test_contracts.py", "test_carriers.py"].map(name => identity(path.join(here, name))),
    stdout: identity(path.join(directory, "stdout.raw")), stderr: identity(path.join(directory, "stderr.raw")),
  });
  protect();
  console.log(JSON.stringify({ label, exit: result.status, result: path.join(directory, "result.json") }));
  process.exitCode = result.status ?? 1;
} else {
  throw new Error("Expected bootstrap or run");
}

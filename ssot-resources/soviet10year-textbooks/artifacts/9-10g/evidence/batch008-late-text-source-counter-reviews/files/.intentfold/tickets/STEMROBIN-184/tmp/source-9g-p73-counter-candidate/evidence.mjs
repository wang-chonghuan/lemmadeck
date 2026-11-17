import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = "/Users/yong/.codex/worktrees/a07e/lemmadeck";
const diagnostic = path.join(root, ".intentfold/tickets/STEMROBIN-184/tmp/source-9g-p73-first-counter-diagnostic");
const production = path.join(root, ".claude/skills/ld-s10y-lesson/tools/layout.py");
const released = path.join(root, ".intentfold/tickets/STEMROBIN-184/tmp/counter-vector-rows/report.md");
const python = path.join(root, ".claude/skills/ld-s10y-lesson/.venv/bin/python");
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

function protect() {
  if (identity(production).sha256 !== baselineSHA || identity(released).sha256 !== reportSHA) {
    throw new Error("Protected production/report identity changed");
  }
}

function capture(source, relative, files) {
  const bytes = fs.readFileSync(source);
  const target = path.join(here, relative);
  save(target, bytes);
  files.push({ ...identity(source), retained_path: target, retained_sha256: sha(bytes) });
}

const [mode, label, script, ...args] = process.argv.slice(2);
protect();
if (mode === "bootstrap") {
  const beforeFile = path.join(here, "before.json");
  if (fs.existsSync(beforeFile)) throw new Error("Bootstrap already captured");
  const baseline = fs.readFileSync(path.join(diagnostic, "protected/layout.py"));
  if (sha(baseline) !== baselineSHA) throw new Error("Frozen baseline changed");
  const patch = ["*** Begin Patch"];
  for (const name of ["baseline/layout.py", "candidate/layout.py"]) {
    patch.push(`*** Add File: ${path.join(here, name)}`);
    patch.push(...baseline.toString("utf8").trimEnd().split("\n").map(line => `+${line}`));
  }
  patch.push("*** End Patch", "");
  const command = ["apply_patch"];
  const started = new Date().toISOString();
  const result = spawnSync(command[0], command.slice(1), {
    cwd: root, input: patch.join("\n"),
  });
  const log = path.join(here, "commands/bootstrap-copy");
  save(path.join(log, "stdout.raw"), result.stdout ?? Buffer.alloc(0));
  save(path.join(log, "stderr.raw"), result.stderr ?? Buffer.alloc(0));
  json(path.join(log, "result.json"), {
    command, cwd: root, started_at: started, finished_at: new Date().toISOString(),
    exit: result.status, signal: result.signal, error: result.error?.message ?? null,
    patch_sha256: sha(Buffer.from(patch.join("\n"))),
    stdout: identity(path.join(log, "stdout.raw")),
    stderr: identity(path.join(log, "stderr.raw")),
  });
  if (result.status !== 0) throw new Error("Baseline apply_patch failed");
  for (const name of ["baseline/layout.py", "candidate/layout.py"]) {
    if (identity(path.join(here, name)).sha256 !== baselineSHA) throw new Error("Copy not exact");
  }
  const files = [];
  capture(production, "protected/production-layout.py", files);
  capture(released, "protected/released-report.md", files);
  for (const name of ["report.md", "cause.json", "manifest.json",
    "source-facts/p73-source-first.txt",
    "first-finalize/0073.result.json",
    "first-finalize/finalize-0073.command.json",
    "first-finalize/finalize-0073.stdout.txt",
    "first-finalize/finalize-0073.stderr.txt"]) {
    capture(path.join(diagnostic, name), `protected/diagnostic/${name}`, files);
  }
  for (let page = 68; page <= 75; page++) {
    const id = String(page).padStart(4, "0");
    for (const name of ["page.png", "layout.json"]) {
      capture(path.join(root, `.tmp/ld-s10y-lesson/9-10g/pages/${id}/${name}`),
        `inputs/${id}/${name}`, files);
    }
    for (const name of ["page.md", "page.json", "audit.json"]) {
      capture(path.join(root, `ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/${id}/${name}`),
        `inputs/${id}/${name}`, files);
    }
  }
  json(beforeFile, { captured_at: new Date().toISOString(), files, baseline_sha256: baselineSHA });
  console.log(JSON.stringify({ mode, files: files.length, baseline_sha256: baselineSHA }));
} else if (mode === "run") {
  if (!/^[a-zA-Z0-9-]+$/.test(label ?? "")) throw new Error("Invalid evidence label");
  const target = path.join(here, script);
  const log = path.join(here, "commands", label);
  if (fs.existsSync(log)) throw new Error("Command evidence already exists");
  const command = [python, "-B", target, ...args];
  save(path.join(log, "sources/layout.py"), fs.readFileSync(path.join(here, "candidate/layout.py")));
  save(path.join(log, "sources/script.py"), fs.readFileSync(target));
  const started = new Date().toISOString();
  const result = spawnSync(command[0], command.slice(1), {
    cwd: root, maxBuffer: 16 * 1024 * 1024,
  });
  save(path.join(log, "stdout.raw"), result.stdout ?? Buffer.alloc(0));
  save(path.join(log, "stderr.raw"), result.stderr ?? Buffer.alloc(0));
  json(path.join(log, "result.json"), {
    command, cwd: root, started_at: started, finished_at: new Date().toISOString(),
    exit: result.status, signal: result.signal, error: result.error?.message ?? null,
    script: identity(target), candidate: identity(path.join(here, "candidate/layout.py")),
    baseline: identity(path.join(here, "baseline/layout.py")),
    stdout: identity(path.join(log, "stdout.raw")),
    stderr: identity(path.join(log, "stderr.raw")),
  });
  protect();
  console.log(JSON.stringify({ label, exit: result.status,
    result_path: path.join(log, "result.json") }));
  process.exitCode = result.status ?? 1;
} else {
  throw new Error("Expected bootstrap or run");
}

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

const root = "/Users/yong/.codex/worktrees/a07e/lemmadeck";
const evidence = path.dirname(new URL(import.meta.url).pathname);
const sha256 = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const before = JSON.parse(fs.readFileSync(path.join(evidence, "preservation-before.json"), "utf8"));
const [mode, id, ...args] = process.argv.slice(2);
const commandDir = path.join(evidence, "commands", id);
fs.mkdirSync(commandDir, { recursive: true });
const write = (name, value) => fs.writeFileSync(path.join(commandDir, name), JSON.stringify(value, null, 2) + "\n", { flag: "wx" });
const command = mode === "finalize"
  ? [".claude/skills/ld-s10y-lesson/.venv/bin/python", "-B", ".claude/skills/ld-s10y-lesson/tools/p2c.py", "finalize", "--book", "9-10g", "--page", args[0]]
  : args;

function capture(rel, destination, records) {
  const absolute = path.join(root, rel);
  if (!fs.existsSync(absolute)) {
    records.push({ path: rel, exists: false });
    return;
  }
  const stat = fs.lstatSync(absolute);
  if (stat.isDirectory()) {
    records.push({ path: rel, exists: true, type: "directory", mode: stat.mode });
    for (const name of fs.readdirSync(absolute).sort()) capture(path.join(rel, name), destination, records);
    return;
  }
  const bytes = fs.readFileSync(absolute);
  const copy = path.join(destination, rel);
  fs.mkdirSync(path.dirname(copy), { recursive: true });
  fs.writeFileSync(copy, bytes, { flag: "wx" });
  records.push({ path: rel, exists: true, type: "file", size: bytes.length, sha256: sha256(bytes), raw_copy: path.relative(root, copy), mode: stat.mode });
}

function snapshot(label) {
  const records = [];
  for (const page of ["0066", "0067"]) {
    capture(`ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/${page}`, path.join(commandDir, label), records);
    capture(`.tmp/ld-s10y-lesson/9-10g/pages/${page}/figures`, path.join(commandDir, label), records);
  }
  capture(before.book_guard, path.join(commandDir, label), records);
  for (const record of before.records.filter((r) => r.category === "source-input")) {
    capture(record.path, path.join(commandDir, label), records);
  }
  write(`${label}.json`, { captured_at: new Date().toISOString(), records });
}

const start = { id, mode, cwd: root, wrapper_argv: process.argv, actual_argv: command, started_at: new Date().toISOString(), wrapper_sha256: sha256(fs.readFileSync(new URL(import.meta.url))) };
write("start.json", start);
if (fs.existsSync(path.join(evidence, "first-failure.json"))) throw new Error("STOP: first failure already retained");
if (mode === "finalize") {
  if (!["66", "67"].includes(args[0])) throw new Error("Out-of-scope page");
  for (const record of before.records.filter((r) => ["source-input", "book-guard"].includes(r.category))) {
    if (sha256(fs.readFileSync(path.join(root, record.path))) !== record.sha256) throw new Error(`Concurrent drift: ${record.path}`);
  }
  snapshot("before-finalize");
}
const result = spawnSync(command[0], command.slice(1), { cwd: root, encoding: null, maxBuffer: 64 * 1024 * 1024 });
fs.writeFileSync(path.join(commandDir, "stdout.raw"), result.stdout ?? Buffer.alloc(0), { flag: "wx" });
fs.writeFileSync(path.join(commandDir, "stderr.raw"), result.stderr ?? Buffer.alloc(0), { flag: "wx" });
const end = { ...start, ended_at: new Date().toISOString(), exit_code: result.status, signal: result.signal, error: result.error ? String(result.error) : null, stdout_sha256: sha256(result.stdout ?? Buffer.alloc(0)), stderr_sha256: sha256(result.stderr ?? Buffer.alloc(0)) };
write("result.json", end);
if (mode === "finalize") snapshot("after-finalize");
if (result.status !== 0 || result.error) fs.writeFileSync(path.join(evidence, "first-failure.json"), JSON.stringify(end, null, 2) + "\n", { flag: "wx" });
process.stdout.write(result.stdout ?? Buffer.alloc(0));
process.stderr.write(result.stderr ?? Buffer.alloc(0));
console.log(JSON.stringify(end));
process.exitCode = result.status ?? 1;

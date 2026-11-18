const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { spawnSync } = require("node:child_process");

const [label, executable, ...args] = process.argv.slice(2);
if (!/^[a-z0-9-]+$/.test(label || "") || !executable) {
  throw new Error("Expected a safe evidence label and an executable.");
}
const root = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const owned = path.resolve(root, ".intentfold/tickets/STEMROBIN-181/tmp/d620-n77-first-choice-author");
if (__dirname !== owned) throw new Error("Recorder must remain in the owned directory.");
const started = new Date().toISOString();
const result = spawnSync(executable, args, {
  cwd: root,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
  maxBuffer: 16 * 1024 * 1024,
});
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const outputs = {};
for (const name of ["stdout", "stderr"]) {
  const bytes = result[name] || Buffer.alloc(0);
  const file = path.join(owned, `${label}.${name}.txt`);
  fs.writeFileSync(file, bytes, { flag: "wx" });
  outputs[name] = { path: file, bytes: bytes.length, sha256: hash(bytes) };
}
const record = {
  schema: "STEMROBIN-181/d620-actual-command-evidence@1",
  label,
  executable,
  args,
  cwd: root,
  environment_override: { PYTHONDONTWRITEBYTECODE: "1" },
  started_utc: started,
  finished_utc: new Date().toISOString(),
  status: result.status,
  signal: result.signal,
  spawn_error: result.error ? result.error.message : null,
  ...outputs,
};
const file = path.join(owned, `${label}.status.json`);
fs.writeFileSync(file, `${JSON.stringify(record, null, 2)}\n`, { flag: "wx" });
console.log(`status=${record.status} record=${file}`);
process.stdout.write(result.stdout || Buffer.alloc(0));
process.stderr.write(result.stderr || Buffer.alloc(0));
if (result.error) console.error(result.error.message);
process.exitCode = result.status === null ? 1 : result.status;

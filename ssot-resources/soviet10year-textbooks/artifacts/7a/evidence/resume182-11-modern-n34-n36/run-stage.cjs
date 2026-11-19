const fs = require("node:fs");
const path = require("node:path");
const cp = require("node:child_process");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
const cwd = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
assert.equal(process.cwd(), cwd);
const [label, command, ...args] = process.argv.slice(2);
assert(label && command);
const base = `.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/stages/${label}`;
const digest = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const save = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
fs.mkdirSync(path.dirname(base), { recursive: true });
const start = { cwd, command: [command, ...args], startedAt: new Date().toISOString() };
save(`${base}.start.json`, start);
const stdout = fs.openSync(`${base}.stdout`, "wx");
const stderr = fs.openSync(`${base}.stderr`, "wx");
const result = cp.spawnSync(command, args, { cwd, stdio: ["ignore", stdout, stderr] });
fs.closeSync(stdout);
fs.closeSync(stderr);
const receipt = {
  ...start, finishedAt: new Date().toISOString(), exit: result.status,
  signal: result.signal, error: result.error?.message ?? null,
  streams: ["stdout", "stderr"].map((name) => ({ path: `${base}.${name}`, sha256: digest(`${base}.${name}`) })),
};
save(`${base}.receipt.json`, receipt);
console.log(JSON.stringify(receipt));
console.log(fs.readFileSync(`${base}.stdout`, "utf8"));
console.error(fs.readFileSync(`${base}.stderr`, "utf8"));
process.exitCode = result.status ?? 1;

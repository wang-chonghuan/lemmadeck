import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const cwd = "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck";
assert.equal(process.cwd(), cwd);
const [directory, executable, ...args] = process.argv.slice(2);
const own = path.resolve(cwd, directory);
assert(own.startsWith(path.join(cwd, ".intentfold/tickets/STEMROBIN-188/tmp/")));
const receipt = path.join(own, "command.json");
assert(!fs.existsSync(receipt), "Never overwrite a recorded attempt.");
fs.mkdirSync(own, { recursive: true });
const started = new Date().toISOString();
const result = spawnSync(executable, args, {
  cwd, timeout: 180000, maxBuffer: 16 * 1024 * 1024,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
});
const streams = {};
for (const [name, bytes] of [["stdout", result.stdout], ["stderr", result.stderr]]) {
  const file = path.join(own, name);
  fs.writeFileSync(file, bytes ?? Buffer.alloc(0), { flag: "wx", mode: 0o444 });
  streams[name] = {
    path: file, sha256: createHash("sha256").update(fs.readFileSync(file)).digest("hex"),
  };
}
fs.writeFileSync(receipt, JSON.stringify({
  cwd, argv: [executable, ...args], exitCode: result.status, signal: result.signal,
  error: result.error ? { name: result.error.name, message: result.error.message } : null,
  started, ended: new Date().toISOString(), streams,
}, null, 2) + "\n", { flag: "wx", mode: 0o444 });
process.stdout.write(result.stdout ?? Buffer.alloc(0));
process.stderr.write(result.stderr ?? Buffer.alloc(0));
console.log(JSON.stringify({ receipt }));
process.exitCode = result.status ?? 1;

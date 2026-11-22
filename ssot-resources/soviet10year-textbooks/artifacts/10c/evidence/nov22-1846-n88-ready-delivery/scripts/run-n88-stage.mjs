import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = "/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck";
assert.equal(process.cwd(), root);
const [stage, command, ...argv] = process.argv.slice(2);
assert.match(stage ?? "", /^[a-z0-9-]+$/);
assert.ok(command);
const output = `.tmp/stemrobin-184-six/n88-stage-executions/${stage}`;
assert.ok(!fs.existsSync(output), "Existing stage must not be replayed");
fs.mkdirSync(output, { recursive: true });
const bind = (file) => {
  const bytes = fs.readFileSync(file);
  return { path: path.resolve(file), bytes: bytes.length,
    sha256: crypto.createHash("sha256").update(bytes).digest("hex") };
};
const startedAt = new Date().toISOString();
const result = spawnSync(command, argv, { cwd: root, encoding: "utf8", maxBuffer: 8 * 1024 * 1024 });
const streams = {};
for (const name of ["stdout", "stderr"]) {
  const file = `${output}/${name}.txt`;
  fs.writeFileSync(file, result[name] ?? "", { flag: "wx" });
  streams[name] = bind(file);
}
fs.writeFileSync(`${output}/execution.json`, JSON.stringify({
  schema: "stemrobin1846/scoped-native-execution@1",
  startedAt, finishedAt: new Date().toISOString(), cwd: root, command, argv,
  exitCode: result.status, signal: result.signal,
  launchError: result.error ? String(result.error) : null, streams,
  parentImageViews: 0, paidCalls: 0,
}, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify({ receipt: bind(`${output}/execution.json`), exitCode: result.status, streams }));
console.log(result.stdout ?? "");
console.error(result.stderr ?? "");
process.exitCode = result.status ?? 1;

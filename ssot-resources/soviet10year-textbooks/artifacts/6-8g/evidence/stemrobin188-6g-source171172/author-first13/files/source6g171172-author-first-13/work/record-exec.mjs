import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const own = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cwd = "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck";
const [name, ...argv] = process.argv.slice(2);
if (!name || !argv.length || process.cwd() !== cwd) {
  throw new Error("An execution name, argv, and exact active checkout cwd are required.");
}
const receiptDir = resolve(own, "work", "receipts");
mkdirSync(receiptDir, { recursive: true });
const startedAt = new Date().toISOString();
const result = spawnSync(argv[0], argv.slice(1), {
  cwd,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
  maxBuffer: 64 * 1024 * 1024,
});
const streams = {};
for (const stream of ["stdout", "stderr"]) {
  const path = resolve(receiptDir, `${name}.${stream}`);
  writeFileSync(path, result[stream] ?? Buffer.alloc(0), { flag: "wx" });
  const bytes = readFileSync(path);
  streams[stream] = {
    path,
    sha256: createHash("sha256").update(bytes).digest("hex"),
    bytes: bytes.length,
  };
}
const receipt = {
  schema: "source-author/execution@1",
  cwd,
  argv,
  startedAt,
  finishedAt: new Date().toISOString(),
  exitCode: result.status,
  signal: result.signal,
  error: result.error?.message ?? null,
  environmentOverrides: { PYTHONDONTWRITEBYTECODE: "1" },
  streams,
};
const path = resolve(receiptDir, `${name}.execution.json`);
writeFileSync(path, JSON.stringify(receipt, null, 2) + "\n", { flag: "wx" });
process.stdout.write(result.stdout ?? Buffer.alloc(0));
process.stderr.write(result.stderr ?? Buffer.alloc(0));
console.log(JSON.stringify({ receipt: path, exitCode: result.status }));
process.exitCode = result.status ?? 1;

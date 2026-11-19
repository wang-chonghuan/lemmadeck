import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const workdir = "/Users/yong/.codex/worktrees/a07e/lemmadeck";
const root = join(workdir, ".tmp/s10y-choice/batch015-ana9-n2-repair");
const [name, executable, ...args] = process.argv.slice(2);
if (!name || !/^[a-z0-9-]+$/.test(name) || !executable) {
  throw new Error("Expected a receipt name, executable, and arguments.");
}
const receipts = join(root, "commands");
mkdirSync(receipts, { recursive: true });
const paths = ["stdout", "stderr", "json"].map((suffix) =>
  join(receipts, `${name}.${suffix}`),
);
if (paths.some(existsSync)) {
  throw new Error("Receipt already exists; use a new name without overwriting.");
}
const started = new Date().toISOString();
const result = spawnSync(executable, args, {
  cwd: workdir,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
  encoding: "utf8",
  maxBuffer: 16 * 1024 * 1024,
});
const stdout = result.stdout ?? "";
const stderr = result.stderr ?? "";
writeFileSync(paths[0], stdout, { flag: "wx" });
writeFileSync(paths[1], stderr, { flag: "wx" });
const hash = (value) => createHash("sha256").update(value).digest("hex");
const receipt = {
  workdir,
  argv: [executable, ...args],
  started,
  ended: new Date().toISOString(),
  exit_code: result.status,
  signal: result.signal,
  error: result.error ? String(result.error) : null,
  child_execution_finished: result.status !== null || result.signal !== null,
  stdout_closed: result.status !== null || result.signal !== null,
  stderr_closed: result.status !== null || result.signal !== null,
  stdout_path: paths[0],
  stdout_sha256: hash(stdout),
  stderr_path: paths[1],
  stderr_sha256: hash(stderr),
};
writeFileSync(paths[2], `${JSON.stringify(receipt, null, 2)}\n`, { flag: "wx" });
process.stdout.write(stdout);
process.stderr.write(stderr);
console.log(`receipt=${paths[2]}`);
process.exitCode = result.status ?? 1;

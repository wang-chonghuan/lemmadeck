import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const own = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(own, "../../../../../..");
const prefix = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const inputs = {
  seed: `${prefix}/n42-choice-author/seed.json`,
  draft: `${prefix}/n42-choice-author/draft.json`,
  review: `${prefix}/n42-choice-review/review.json`,
};
const expected = {
  seed: "fa5f3a648841b17ea459a3bad31a5701b9d89746d86d70ef35bc58187a53ead5",
  draft: "a5b99ab1364e2c268e11b7cab6f076ae3281647d148e0be4ba7da8990d775fb6",
  review: "e2f9b28d0586c53d08ce41bdc7019486c128ad9ef0bb760f33749099da88048e",
};

for (const [name, file] of Object.entries(inputs)) {
  assert.equal(hash(fs.readFileSync(path.resolve(root, file))), expected[name]);
}
for (const name of ["validation-start.json", "validation.json", "validation.stdout.txt", "validation.stderr.txt"]) {
  assert.equal(fs.existsSync(path.join(own, name)), false, `Refusing a duplicate validator run: ${name} already exists`);
}

const executable = "python3";
const args = [
  ".agents/skills/ld-s10y-choice/scripts/validate.py",
  "--repo", ".",
  "--seed", inputs.seed,
  "--draft", inputs.draft,
  "--review", inputs.review,
];
const started = Date.now();
const start = {
  schema: "s10y-choice-validator-start-v1",
  invocation: 1,
  cwd: root,
  executable,
  args,
  started_at: new Date(started).toISOString(),
  input_sha256: expected,
  policy: "Exactly one official validator invocation in this reviewer Stage3. Exclusive start receipt prevents rerun; no repair/retry is automatic.",
};
fs.writeFileSync(path.join(own, "validation-start.json"), `${JSON.stringify(start, null, 2)}\n`, { flag: "wx" });

const result = spawnSync(executable, args, { cwd: root, encoding: "utf8", maxBuffer: 8 * 1024 * 1024 });
const finished = Date.now();
const stdout = Buffer.from(result.stdout ?? "", "utf8");
const stderr = Buffer.from(result.stderr ?? "", "utf8");
fs.writeFileSync(path.join(own, "validation.stdout.txt"), stdout, { flag: "wx" });
fs.writeFileSync(path.join(own, "validation.stderr.txt"), stderr, { flag: "wx" });

const receipt = {
  ...start,
  schema: "s10y-choice-validator-receipt-v1",
  finished_at: new Date(finished).toISOString(),
  duration_ms: finished - started,
  pid: result.pid,
  exit_code: result.status,
  signal: result.signal,
  spawn_error: result.error ? { name: result.error.name, message: result.error.message, code: result.error.code ?? null } : null,
  stdout: { path: "validation.stdout.txt", bytes: stdout.length, sha256: hash(stdout) },
  stderr: { path: "validation.stderr.txt", bytes: stderr.length, sha256: hash(stderr) },
  passing: result.status === 0 && !result.error,
  retry_performed: false,
};
fs.writeFileSync(path.join(own, "validation.json"), `${JSON.stringify(receipt, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify(receipt, null, 2));
if (stdout.length) process.stdout.write(stdout);
if (stderr.length) process.stderr.write(stderr);
process.exitCode = result.status ?? 1;

import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import { spawnSync } from "node:child_process";

const workdir = "/Users/yong/.codex/worktrees/a07e/lemmadeck";
assert.equal(process.cwd(), workdir);
const owned = ".tmp/s10y-choice/batch015-geo910-n12-independent";
const repair = ".tmp/s10y-choice/batch015-geo910-n12-repair";
const comparison = JSON.parse(fs.readFileSync(`${owned}/phase3-internal-comparison.json`, "utf8"));
const sha = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
for (const [file, expected] of Object.entries(comparison.input_file_hashes)) {
  assert.equal(sha(fs.readFileSync(file)), expected, `Input changed before validation: ${file}`);
}
const command = "python3";
const args = [
  ".agents/skills/ld-s10y-choice/scripts/validate.py",
  "--repo", ".",
  "--seed", `${repair}/seed.json`,
  "--draft", `${repair}/draft.json`,
  "--review", `${owned}/review.json`,
];
const invocation = {
  record_type: "official-validator-single-invocation",
  workdir,
  command,
  args,
  review_file_sha256_before: sha(fs.readFileSync(`${owned}/review.json`)),
  python_bytecode_writes_disabled: true,
  started_at: new Date().toISOString(),
};
// Exclusive creation prevents accidentally running this validator twice.
fs.writeFileSync(`${owned}/validation-invocation.json`, JSON.stringify(invocation, null, 2) + "\n", { flag: "wx" });
const result = spawnSync(command, args, {
  cwd: workdir,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
  maxBuffer: 8 * 1024 * 1024,
  stdio: ["ignore", "pipe", "pipe"],
});
const stdout = result.stdout ?? Buffer.alloc(0);
const stderr = result.stderr ?? Buffer.alloc(0);
fs.writeFileSync(`${owned}/validation.stdout.log`, stdout, { flag: "wx" });
fs.writeFileSync(`${owned}/validation.stderr.log`, stderr, { flag: "wx" });
const receipt = {
  ...invocation,
  finished_at: new Date().toISOString(),
  actual_exit_code: result.status,
  signal: result.signal,
  spawn_error: result.error ? { code: result.error.code, message: result.error.message } : null,
  stdout_path: `${owned}/validation.stdout.log`,
  stdout_bytes: stdout.length,
  stdout_sha256: sha(stdout),
  stderr_path: `${owned}/validation.stderr.log`,
  stderr_bytes: stderr.length,
  stderr_sha256: sha(stderr),
  review_file_sha256_after: sha(fs.readFileSync(`${owned}/review.json`)),
  classification:
    result.status === 3
      ? "Mechanical checks passed; semantic blocked outcome, not a tool fault."
      : result.status === 2
        ? "Official structural/input contract error; do not call a semantic blocked result."
        : result.status === 0
          ? "Official exit zero; inspect the saved review outcome before claiming semantic approval."
          : "Execution failure or unexpected exit; preserve the actual result.",
  official_validator_invocations: 1,
};
fs.writeFileSync(`${owned}/validation-result.json`, JSON.stringify(receipt, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify(receipt, null, 2));

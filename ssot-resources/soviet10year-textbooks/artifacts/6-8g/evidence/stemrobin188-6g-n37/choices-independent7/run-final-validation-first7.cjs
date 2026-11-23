const fs = require("node:fs");
const path = require("node:path");
const { createHash } = require("node:crypto");
const { spawnSync } = require("node:child_process");

const W = "/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188";
const own = path.join(W, ".intentfold/tickets/STEMROBIN-188/tmp/n37-choices-independent7");
const retained = path.join(W, "ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-n37/choices-author7");
const review = path.join(own, "review.json");
const output = (suffix) => path.join(own, "final-validation-first7." + suffix);
const sha = (bytes) => createHash("sha256").update(bytes).digest("hex");

if (process.cwd() !== W) throw new Error("Wrong working directory");
for (const suffix of ["execution.json", "stdout", "stderr"]) {
  if (fs.existsSync(output(suffix))) throw new Error("Refusing to overwrite " + output(suffix));
}
if ((fs.statSync(review).mode & 0o777) !== 0o444) throw new Error("Review is not sealed 0444");

const argv = [
  path.join(W, ".agents/skills/ld-s10y-choice/scripts/validate.py"),
  "--repo", W,
  "--seed", path.join(retained, "seed.json"),
  "--draft", path.join(retained, "draft.json"),
  "--review", review
];
const startedAt = new Date().toISOString();
const reviewBytes = fs.readFileSync(review);
const result = spawnSync("python3", argv, {
  cwd: W,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
  maxBuffer: 8 * 1024 * 1024
});
const stdout = result.stdout || Buffer.alloc(0);
const stderr = result.stderr || Buffer.alloc(0);
fs.writeFileSync(output("stdout"), stdout, { flag: "wx" });
fs.writeFileSync(output("stderr"), stderr, { flag: "wx" });
const receipt = {
  schema: "n37-final-native-validation-execution-v1",
  command: "python3",
  argv,
  cwd: W,
  exitCode: result.status,
  signal: result.signal,
  error: result.error ? { code: result.error.code, message: result.error.message } : null,
  started_at: startedAt,
  finished_at: new Date().toISOString(),
  native_validation_attempts: 1,
  review_file_sha256: sha(reviewBytes),
  review_mode: "0444",
  declared_review_outcome: JSON.parse(reviewBytes).outcome,
  streams: {
    stdout: { path: output("stdout"), sha256: sha(stdout), bytes: stdout.length },
    stderr: { path: output("stderr"), sha256: sha(stderr), bytes: stderr.length }
  },
  interpretation: "Native mechanical result is distinct from the independently reasoned semantic review. Nonzero is not approval. No retry or author edit is performed."
};
fs.writeFileSync(output("execution.json"), JSON.stringify(receipt, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify(receipt, null, 2));
process.exitCode = result.status === null ? 1 : result.status;

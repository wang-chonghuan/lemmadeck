import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const cwd = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
assert.equal(process.cwd(), cwd);
const relativeRoot = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n47-choice-review/stage3-FIRST";
const root = path.join(cwd, relativeRoot);
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const snapshot = (relativePath) => {
  const file = path.join(cwd, relativePath);
  const bytes = fs.readFileSync(file);
  return {
    path: relativePath,
    sha256: hash(bytes),
    bytes: bytes.length,
    mode: (fs.statSync(file).mode & 0o777).toString(8).padStart(4, "0"),
  };
};
const writeGenerated = (name, value) => {
  const bytes = Buffer.isBuffer(value) ? value : Buffer.from(`${JSON.stringify(value, null, 2)}\n`);
  fs.writeFileSync(path.join(root, name), bytes, { flag: "wx", mode: 0o444 });
};

// An existing command marker prevents a second validator launch after interruption.
const reserved = ["validation-command.json", "validation-stdout.txt", "validation-stderr.txt", "validation-receipt.json"];
for (const name of reserved) {
  assert.equal(fs.existsSync(path.join(root, name)), false, `Refuse to repeat validation: ${name}`);
}
const review = snapshot(`${relativeRoot}/review.json`);
const comparison = snapshot(`${relativeRoot}/comparison.json`);
assert.equal(review.sha256, "6bf1174164d50a78c273912faceab8c4c8970de94b3c5f438596ba287c5d83e4");
assert.equal(comparison.sha256, "03eb38855625a57717853a526efd7c6edddaf04eaa2c5c14d2de3c143cf81165");
assert.equal(review.mode, "0444");
assert.equal(comparison.mode, "0444");
const ledger = JSON.parse(fs.readFileSync(path.join(root, "comparison.json"), "utf8"));
const boundInputs = [...ledger.author_bindings, ...ledger.historical_bindings];
const before = boundInputs.map((binding) => {
  const current = snapshot(binding.path);
  assert.equal(current.sha256, binding.sha256, binding.path);
  assert.equal(current.mode, "0444", binding.path);
  return current;
});
const executable = "python3";
const args = [
  ".agents/skills/ld-s10y-choice/scripts/validate.py",
  "--repo", ".",
  "--seed", ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n47-choice-affected-author/seed.json",
  "--draft", ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n47-choice-affected-author/draft.json",
  "--review", `${relativeRoot}/review.json`,
];
const command = {
  schema: "stemrobin182-choice-final-validation-command-v1",
  cwd,
  executable,
  args,
  shell_command: [executable, ...args].join(" "),
  requested_invocations: 1,
  stand_alone_structure_run: false,
  frozen_before_validation: [review, comparison],
  validator_script: snapshot(args[0]),
  started_at: new Date().toISOString(),
};
writeGenerated("validation-command.json", command);
const result = spawnSync(executable, args, {
  cwd,
  encoding: null,
  timeout: 300000,
  maxBuffer: 8 * 1024 * 1024,
});
writeGenerated("validation-stdout.txt", result.stdout ?? Buffer.alloc(0));
writeGenerated("validation-stderr.txt", result.stderr ?? Buffer.alloc(0));
const after = before.map((binding) => snapshot(binding.path));
const inputBytesAndModesUnchanged = before.every((binding, index) =>
  binding.sha256 === after[index].sha256 && binding.mode === after[index].mode
);
const reviewAfter = snapshot(review.path);
const comparisonAfter = snapshot(comparison.path);
const frozenReviewUnchanged = reviewAfter.sha256 === review.sha256 && reviewAfter.mode === "0444";
const frozenComparisonUnchanged = comparisonAfter.sha256 === comparison.sha256 && comparisonAfter.mode === "0444";
const receipt = {
  schema: "stemrobin182-choice-first-stage3-final-validation-receipt-v1",
  cwd,
  command: snapshot(`${relativeRoot}/validation-command.json`),
  validator_invocations: 1,
  exit_code: result.status,
  signal: result.signal,
  spawn_error: result.error ? { code: result.error.code, message: result.error.message } : null,
  finished_at: new Date().toISOString(),
  stdout: snapshot(`${relativeRoot}/validation-stdout.txt`),
  stderr: snapshot(`${relativeRoot}/validation-stderr.txt`),
  frozen_before_validation: [review, comparison],
  frozen_after_validation: [reviewAfter, comparisonAfter],
  bound_inputs_before: before,
  bound_inputs_after: after,
  all_bound_input_bytes_and_modes_unchanged: inputBytesAndModesUnchanged,
  canonical_review_and_comparison_unchanged: frozenReviewUnchanged && frozenComparisonUnchanged,
  counts: ledger.counts,
  source_or_view_resolving: 0,
  images_opened: 0,
  status: result.status === 0 && !result.error && inputBytesAndModesUnchanged &&
    frozenReviewUnchanged && frozenComparisonUnchanged ? "pass" : "not_pass",
  scope: "Exactly one final validate.py invocation with review; no extra structural, course, browser, image or test run.",
};
writeGenerated("validation-receipt.json", receipt);
process.stdout.write(`${JSON.stringify({
  status: receipt.status,
  exit_code: receipt.exit_code,
  validator_invocations: receipt.validator_invocations,
  stdout: result.stdout?.toString("utf8") ?? "",
  stderr: result.stderr?.toString("utf8") ?? "",
  receipt: `${relativeRoot}/validation-receipt.json`,
  all_bound_inputs_unchanged: inputBytesAndModesUnchanged,
}, null, 2)}\n`);
process.exitCode = result.status ?? 1;

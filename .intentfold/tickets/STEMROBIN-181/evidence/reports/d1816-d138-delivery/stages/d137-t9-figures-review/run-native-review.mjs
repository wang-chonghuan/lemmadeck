import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

const root = "/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck";
assert.equal(process.cwd(), root);
const directory = path.join(root, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d137-t9-figures-review");
const report = JSON.parse(fs.readFileSync(path.join(directory, "report.json"), "utf8"));
const selected = JSON.parse(fs.readFileSync(path.join(root, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d137-t9-figures-review-input/candidate-only.json"), "utf8"));
const id = process.argv[2];
const figure = selected.figures.find(f => f.figure === id);
const review = report.figures.find(f => f.figure === id);
assert(figure && review && review.semanticStatus === "pass");
const output = path.join(directory, `${id}.review.json`);
assert(!fs.existsSync(output), "Preserve any existing review output");
const args = [
  "-B", ".agents/skills/ld-s10y-image/scripts/record_review.py",
  "--spec", figure.spec.path, "--render", figure.nativeRender.path,
  "--output", output, "--status", "pass", "--notes", review.nativeReviewNotes
];
const result = spawnSync("python3", args, {
  cwd: root, encoding: "utf8",
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" }
});
fs.writeFileSync(path.join(directory, `${id}.record-review.receipt.json`), JSON.stringify({
  schema: "d137/native-review-command-receipt@1", cwd: root,
  command: "python3", args, exitCode: result.status, signal: result.signal,
  error: result.error?.message ?? null, stdout: result.stdout, stderr: result.stderr,
  renderingRerun: false, importedValidationIsRecordToolPrecondition: true,
  noPycacheWrites: true, output
}, null, 2) + "\n", { flag: "wx" });
process.stdout.write(result.stdout ?? "");
process.stderr.write(result.stderr ?? "");
if (result.status !== 0) process.exit(result.status ?? 1);

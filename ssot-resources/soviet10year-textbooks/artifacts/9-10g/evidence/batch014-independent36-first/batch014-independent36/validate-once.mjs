import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

const cwd = "/Users/yong/.codex/worktrees/a07e/lemmadeck";
const root = path.join(cwd, ".tmp/s10y-choice/batch014-independent36");
if (process.cwd() !== cwd) throw new Error("Wrong command cwd");
const receiptPath = path.join(root, "validation.json");
const stdoutPath = path.join(root, "validation.stdout.txt");
const stderrPath = path.join(root, "validation.stderr.txt");
for (const file of [receiptPath, stdoutPath, stderrPath]) {
  if (fs.existsSync(file)) throw new Error("Validation already recorded; do not rerun");
}

const args = [
  ".agents/skills/ld-s10y-choice/scripts/validate.py",
  "--repo", ".",
  "--seed", ".tmp/s10y-choice/batch014-author36/seed.json",
  "--draft", ".tmp/s10y-choice/batch014-repair36-option-order/draft.json",
  "--review", ".tmp/s10y-choice/batch014-independent36/review.json",
];
const startedAt = new Date().toISOString();
const result = spawnSync("python3", args, {
  cwd,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
  encoding: "utf8",
});
if (result.error) throw result.error;
fs.writeFileSync(stdoutPath, result.stdout, { flag: "wx" });
fs.writeFileSync(stderrPath, result.stderr, { flag: "wx" });
const sha = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const entry = (file) => ({ path: path.relative(cwd, file), sha256: sha(file) });
const receipt = {
  schema: "s10y-choice-native-validation-receipt@1",
  cwd,
  command: ["python3", ...args],
  runs: 1,
  startedAt,
  endedAt: new Date().toISOString(),
  exit_code: result.status,
  signal: result.signal,
  stdout: result.stdout,
  stderr: result.stderr,
  stdout_file: entry(stdoutPath),
  stderr_file: entry(stderrPath),
  input_files: [args[4], args[6], args[8]].map((file) => entry(path.join(cwd, file))),
  image_opens: 0,
  limitation: "Mechanical validation records the review's revise outcome; it does not prove semantic correctness.",
};
fs.writeFileSync(receiptPath, JSON.stringify(receipt, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify(receipt, null, 2));

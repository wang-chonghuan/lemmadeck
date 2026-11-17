import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";

const language = process.argv[2];
if (!["zh", "en"].includes(language)) {
  throw new Error("Expected zh or en");
}

const ticketTmp = "/Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp";
const outputRoot = `${ticketTmp}/d173-t16-text-only-choice-review`;
const repo = `${ticketTmp}/d171-t16-choice-inputs/${language}-repo`;
const seed = `${repo}/.tmp/seed.json`;
const draft = `${ticketTmp}/d172-t16-text-only-choice-author/${language}.draft.json`;
const review = `${outputRoot}/${language}.review.json`;
const validator = "/Users/yong/.codex/worktrees/00b1/lemmadeck/.agents/skills/ld-s10y-choice/scripts/validate.py";
const command = ["python3", validator, "--repo", repo, "--seed", seed, "--draft", draft, "--review", review];
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const bindings = [seed, draft, review, validator].map((path) => ({
  path,
  sha256: hash(readFileSync(path)),
}));
const startedAt = new Date().toISOString();
const result = spawnSync(command[0], command.slice(1), {
  cwd: "/Users/yong/.codex/worktrees/00b1/lemmadeck",
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
  encoding: "utf8",
  timeout: 60000,
  maxBuffer: 2 * 1024 * 1024,
});
const stdout = result.stdout ?? "";
const stderr = result.stderr ?? "";
const stdoutPath = `${outputRoot}/${language}-validate.stdout.txt`;
const stderrPath = `${outputRoot}/${language}-validate.stderr.txt`;
writeFileSync(stdoutPath, stdout, { flag: "wx" });
writeFileSync(stderrPath, stderr, { flag: "wx" });
const receipt = {
  schema: "STEMROBIN-181/choice-review-validation-receipt@1",
  language,
  command,
  cwd: "/Users/yong/.codex/worktrees/00b1/lemmadeck",
  environmentOverrides: { PYTHONDONTWRITEBYTECODE: "1" },
  reviewSupplied: true,
  runs: 1,
  startedAt,
  finishedAt: new Date().toISOString(),
  bindings,
  exitCode: result.status,
  signal: result.signal,
  error: result.error ? String(result.error) : null,
  stdout: { path: stdoutPath, sha256: hash(stdout), text: stdout },
  stderr: { path: stderrPath, sha256: hash(stderr), text: stderr },
  imagesOpened: 0,
  cumulativeImageCount: 24,
};
const receiptPath = `${outputRoot}/${language}-validate.receipt.json`;
writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({
  receiptPath,
  receiptSHA256: hash(readFileSync(receiptPath)),
  exitCode: result.status,
  stdout,
  stderr,
}, null, 2));
process.exit(result.status ?? 1);

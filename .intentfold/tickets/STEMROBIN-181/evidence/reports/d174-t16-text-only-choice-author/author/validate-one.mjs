import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

const language = process.argv[2];
if (!["zh", "en"].includes(language)) {
  throw new Error("Expected zh or en");
}
const workspace = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const output = `${workspace}/.intentfold/tickets/STEMROBIN-181/tmp/d172-t16-text-only-choice-author`;
const input = `${workspace}/.intentfold/tickets/STEMROBIN-181/tmp/d171-t16-choice-inputs`;
const args = [
  `${workspace}/.agents/skills/ld-s10y-choice/scripts/validate.py`,
  "--repo", `${input}/${language}-repo`,
  "--seed", `${input}/${language}-repo/.tmp/seed.json`,
  "--draft", `${output}/${language}.draft.json`,
];
const startedAt = new Date().toISOString();
const result = spawnSync("python3", args, {
  cwd: workspace,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
  encoding: "utf8",
  timeout: 120_000,
  maxBuffer: 4_000_000,
});
const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");
const stdout = result.stdout ?? "";
const stderr = result.stderr ?? "";
const stdoutPath = path.join(output, `${language}-validate.stdout.txt`);
const stderrPath = path.join(output, `${language}-validate.stderr.txt`);
fs.writeFileSync(stdoutPath, stdout, { flag: "wx" });
fs.writeFileSync(stderrPath, stderr, { flag: "wx" });
const receipt = {
  language,
  startedAt,
  finishedAt: new Date().toISOString(),
  command: ["python3", ...args],
  envOverrides: { PYTHONDONTWRITEBYTECODE: "1" },
  exitCode: result.status,
  signal: result.signal,
  error: result.error?.message ?? null,
  stdout: { path: stdoutPath, sha256: sha256(stdout) },
  stderr: { path: stderrPath, sha256: sha256(stderr) },
  seed: { path: `${input}/${language}-repo/.tmp/seed.json`, sha256: sha256(fs.readFileSync(`${input}/${language}-repo/.tmp/seed.json`)) },
  draft: { path: `${output}/${language}.draft.json`, sha256: sha256(fs.readFileSync(`${output}/${language}.draft.json`)) },
  runsForThisLanguage: 1,
  reviewSupplied: false,
  semanticIndependentReview: "pending",
  imageOpensOrGeneration: 0,
};
fs.writeFileSync(
  path.join(output, `${language}-validate.receipt.json`),
  JSON.stringify(receipt, null, 2) + "\n",
  { flag: "wx" },
);
console.log(JSON.stringify(receipt, null, 2));
console.log(stdout);
if (stderr) console.error(stderr);
process.exitCode = result.status ?? 1;

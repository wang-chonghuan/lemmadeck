import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {spawnSync} from "node:child_process";

const repo = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
const own = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n38-choice-author";
const sha = relative => crypto.createHash("sha256")
  .update(fs.readFileSync(path.join(repo, relative))).digest("hex");
const args = [
  ".agents/skills/ld-s10y-choice/scripts/validate.py",
  "--repo", repo, "--seed", `${own}/source.json`, "--draft", `${own}/draft.json`,
];
const name = process.argv[2] ?? "structural-first";
if (!/^[a-z0-9-]+$/.test(name)) throw new Error("Invalid receipt name");
const receipt = path.join(repo, own, `${name}.json`);
if (fs.existsSync(receipt)) throw new Error("Keep prior receipts; use a new affected-repair receipt name");
const started = new Date().toISOString();
const result = spawnSync("python3", args, {
  cwd: repo,
  env: {...process.env, PYTHONDONTWRITEBYTECODE: "1"},
  encoding: "utf8",
});
const record = {
  schema: "n38-structural-check-receipt-v1",
  started_at: started,
  finished_at: new Date().toISOString(),
  cwd: repo,
  command: ["PYTHONDONTWRITEBYTECODE=1", "python3", ...args],
  seed_file_sha256: sha(`${own}/source.json`),
  draft_file_sha256: sha(`${own}/draft.json`),
  checker_file_sha256: sha(args[0]),
  prepare_file_sha256: sha(".agents/skills/ld-s10y-choice/scripts/prepare.py"),
  exit_code: result.status,
  signal: result.signal,
  execution_error: result.error?.message ?? null,
  stdout: result.stdout ?? "",
  stderr: result.stderr ?? "",
  semantic_review: "NOT_PERFORMED_INDEPENDENT_REVIEW_REQUIRED",
};
fs.writeFileSync(receipt, `${JSON.stringify(record, null, 2)}\n`, {flag: "wx"});
process.stdout.write(record.stdout);
process.stderr.write(record.stderr);
console.log(`Preserved receipt: ${receipt}`);
process.exitCode = result.status ?? 2;

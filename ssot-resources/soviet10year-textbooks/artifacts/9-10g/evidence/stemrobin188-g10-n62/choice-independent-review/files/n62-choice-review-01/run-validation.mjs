import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repo = "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck";
const output = "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n62-choice-review-01";
if (path.dirname(fileURLToPath(import.meta.url)) !== output) {
  throw new Error("Unexpected evidence directory");
}
const seed = `${repo}/.intentfold/tickets/STEMROBIN-188/tmp/n62-choice-author/seed.json`;
const draft = `${repo}/.intentfold/tickets/STEMROBIN-188/tmp/n62-choice-author/draft.json`;
const args = [
  "-B",
  ".agents/skills/ld-s10y-choice/scripts/validate.py",
  "--repo", ".",
  "--seed", seed,
  "--draft", draft,
  "--review", `${output}/review.json`
];
const command = `python3 ${args.join(" ")}`;
fs.writeFileSync(`${output}/validation-command.txt`, `${command}\n`, { flag: "wx" });
const started = new Date().toISOString();
// -B prevents imported local Python modules from writing outside the review directory.
const result = spawnSync("python3", args, { cwd: repo, encoding: null });
fs.writeFileSync(`${output}/validation-stdout.txt`, result.stdout ?? Buffer.alloc(0), { flag: "wx" });
fs.writeFileSync(`${output}/validation-stderr.txt`, result.stderr ?? Buffer.alloc(0), { flag: "wx" });
const record = {
  cwd: repo,
  executable: "python3",
  argv: args,
  command,
  invocations: 1,
  started,
  finished: new Date().toISOString(),
  exit: result.status,
  signal: result.signal,
  spawn_error: result.error?.message ?? null
};
fs.writeFileSync(`${output}/validation-result.json`, `${JSON.stringify(record, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify(record, null, 2));
console.log("STDOUT:");
process.stdout.write(result.stdout ?? Buffer.alloc(0));
console.log("STDERR:");
process.stdout.write(result.stderr ?? Buffer.alloc(0));
process.exitCode = result.status ?? 1;

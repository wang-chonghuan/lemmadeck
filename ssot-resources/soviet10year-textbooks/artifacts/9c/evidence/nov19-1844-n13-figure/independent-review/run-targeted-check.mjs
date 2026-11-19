import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const repo = "/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck";
const out = path.join(repo, ".tmp/stemrobin-184-resume/n13-figure-independent-review");
const argv = [process.execPath, path.join(out, "targeted-check.mjs")];
const result = spawnSync(argv[0], argv.slice(1), { cwd: repo, encoding: "utf8", maxBuffer: 4 * 1024 * 1024 });
for (const [name, contents] of [
  ["targeted-check.stdout.txt", result.stdout ?? ""],
  ["targeted-check.stderr.txt", result.stderr ?? ""],
]) fs.writeFileSync(path.join(out, name), contents, { flag: "wx", mode: 0o444 });
const receipt = {
  schema: "actual-command-receipt@1",
  argv, cwd: repo, exitCode: result.status, signal: result.signal,
  stdoutPath: path.join(out, "targeted-check.stdout.txt"),
  stderrPath: path.join(out, "targeted-check.stderr.txt"),
  stdout: result.stdout ?? "", stderr: result.stderr ?? "",
  executionError: result.error?.message ?? null,
  officialRendererInvocations: 0, officialValidatorInvocations: 0,
  priorCheckReplays: 0, candidateWrites: 0, sourceVisualReopens: 0,
};
fs.writeFileSync(path.join(out, "targeted-check.receipt.json"), `${JSON.stringify(receipt, null, 2)}\n`, { flag: "wx", mode: 0o444 });
console.log(result.stdout ?? "");
if (result.stderr) console.error(result.stderr);
console.log(JSON.stringify({ exitCode: result.status, receipt: path.join(out, "targeted-check.receipt.json") }));
process.exitCode = result.status ?? 1;

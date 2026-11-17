import { existsSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const page = Number(process.argv[2]);
if (![280, 281, 282, 283].includes(page)) throw new Error("Outside owned batch");
const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const batch = resolve(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d030-source280-283-author");
const work = resolve(repo, `.tmp/ld-s10y-lesson/9p/pages/${String(page).padStart(4, "0")}`);
const receipt = resolve(batch, `${page}.prepare-receipt.json`);
if (existsSync(work) || existsSync(receipt)) throw new Error("Refusing repeated preparation");
const args = [
  ".claude/skills/ld-s10y-lesson/tools/p2c.py", "prepare",
  "--book", "9p", "--page", String(page),
];
const started = new Date().toISOString();
const result = spawnSync(".claude/skills/ld-s10y-lesson/.venv/bin/python", args, {
  cwd: repo, encoding: "utf8", env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
});
writeFileSync(receipt, JSON.stringify({
  page, started, finished: new Date().toISOString(),
  executable: ".claude/skills/ld-s10y-lesson/.venv/bin/python", args,
  status: result.status, signal: result.signal,
  stdout: result.stdout, stderr: result.stderr, error: result.error?.message ?? null,
  sourceApproval: false,
}, null, 2) + "\n", { flag: "wx" });
process.stdout.write(result.stdout ?? "");
process.stderr.write(result.stderr ?? "");
process.exit(result.status ?? 1);

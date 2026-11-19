import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const R = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const OUT = path.join(R, ".intentfold/tickets/STEMROBIN-181/tmp/d885-n87-first-choice-author");
const script = path.join(OUT, "validate-projected.py");
for (const locale of ["zh", "en"]) {
  if (fs.existsSync(path.join(OUT, locale, "validation.json"))) {
    throw new Error(`Refusing a repeated structural invocation for ${locale}`);
  }
}
let failed = false;
for (const locale of ["zh", "en"]) {
  const started = new Date().toISOString();
  const command = ["python3", "-B", script, "--locale", locale];
  const child = spawnSync(command[0], command.slice(1), {
    cwd: R,
    encoding: "utf8",
    env: { PATH: process.env.PATH, PYTHONDONTWRITEBYTECODE: "1" },
    timeout: 60000
  });
  const record = {
    schema: "d885-n87-structural-invocation-v1",
    stage: "FIRST",
    locale,
    invocation_count: 1,
    command,
    workdir: R,
    started_at_utc: started,
    ended_at_utc: new Date().toISOString(),
    exit_code: child.status,
    signal: child.signal,
    error: child.error ? String(child.error) : null,
    stdout: child.stdout ?? "",
    stderr: child.stderr ?? "",
    result: child.status === 0 ? JSON.parse(child.stdout) : null,
    semantic_review_run: false,
    semantic_approval: false
  };
  fs.writeFileSync(path.join(OUT, locale, "validation.json"), `${JSON.stringify(record, null, 2)}\n`, { flag: "wx" });
  if (child.status !== 0) failed = true;
  console.log(`${locale}: projected structural validator invoked once, exit ${child.status}; semantic review not run`);
  if (child.stderr) console.error(child.stderr);
}
if (failed) process.exitCode = 2;

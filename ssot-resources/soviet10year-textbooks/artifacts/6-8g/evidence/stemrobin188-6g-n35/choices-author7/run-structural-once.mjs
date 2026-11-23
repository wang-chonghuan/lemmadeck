import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { chmod, copyFile, readFile, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import { resolve } from "node:path";

const root = "/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188";
const directory = ".intentfold/tickets/STEMROBIN-188/tmp/n35-choices7";
assert.equal(process.cwd(), root);
const hash = bytes => createHash("sha256").update(bytes).digest("hex");
const draft = resolve(root, directory, "draft.json");
const snapshot = resolve(root, directory, "draft.candidate-01.json");
const stdoutPath = resolve(root, directory, "validation.first.stdout.txt");
const stderrPath = resolve(root, directory, "validation.first.stderr.txt");
const receiptPath = resolve(root, directory, "validation.first.json");
await copyFile(draft, snapshot, constants.COPYFILE_EXCL);
await chmod(snapshot, 0o444);
const before = hash(await readFile(draft));
const argv = [
  "python3",
  ".agents/skills/ld-s10y-choice/scripts/validate.py",
  "--repo", ".",
  "--seed", `${directory}/seed.json`,
  "--draft", `${directory}/draft.json`,
];
const started = new Date().toISOString();
const child = spawnSync(argv[0], argv.slice(1), { cwd: root, encoding: "utf8" });
const finished = new Date().toISOString();
const stdout = child.stdout ?? "";
const stderr = child.stderr ?? "";
await writeFile(stdoutPath, stdout, { flag: "wx" });
await writeFile(stderrPath, stderr, { flag: "wx" });
const receipt = {
  cwd: root,
  argv,
  started_at: started,
  finished_at: finished,
  exit_code: child.status,
  signal: child.signal,
  execution_error: child.error?.message ?? null,
  stdout_path: stdoutPath,
  stderr_path: stderrPath,
  stdout_sha256: hash(stdout),
  stderr_sha256: hash(stderr),
  candidate_snapshot: snapshot,
  draft_sha256_before: before,
  draft_sha256_after: hash(await readFile(draft)),
  structural_invocations: 1,
  semantic_review_invocations: 0,
  first_failure_preserved: child.status !== 0,
  status: child.status === 0 ? "structural-only-success-semantic-pending" : "structural-first-failure",
};
await writeFile(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, { flag: "wx" });
await chmod(stdoutPath, 0o444);
await chmod(stderrPath, 0o444);
await chmod(receiptPath, 0o444);
console.log(JSON.stringify({ ...receipt, stdout, stderr }, null, 2));

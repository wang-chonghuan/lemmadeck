import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

const cwd = "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck";
const owned = path.join(cwd, ".intentfold/tickets/STEMROBIN-188/tmp/n29-choice-independent-review-07");
const seed = path.join(cwd, ".intentfold/tickets/STEMROBIN-188/tmp/n29-choice-author-first-07/seed.json");
const draft = path.join(cwd, ".intentfold/tickets/STEMROBIN-188/tmp/n29-choice370-definition-author-07/merged-draft.json");
const first = path.join(owned, "FIRST.md");
const review = path.join(owned, "review.json");
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const expected = {
  seed: "18511d118efbb0fab5b322bd15976c7288cc68ec6af2c8d3b8707fe2d05ec77a",
  draft: "8d4c76c556acd9a20ed2a50e35c16a17caef7dd72bb81019db5253c3d44ce6e0",
  first: "8d31af9abc6aada0bebe934fe568303cfdbdb3c561d8dc405e894a8043736a6c"
};
const outputs = ["validator.stdout.txt", "validator.stderr.txt", "validation-receipt.json"];
for (const name of outputs) {
  if (fs.existsSync(path.join(owned, name))) throw new Error(`Refuse overwrite: ${name}`);
}
const before = { seed: hash(seed), draft: hash(draft), first: hash(first), review: hash(review) };
for (const [name, value] of Object.entries(expected)) {
  if (before[name] !== value) throw new Error(`Input hash changed: ${name}`);
}
if ((fs.statSync(first).mode & 0o777) !== 0o444) throw new Error("FIRST is not 0444");
const verdict = JSON.parse(fs.readFileSync(review, "utf8")).outcome;
if (verdict !== "revise") throw new Error("Substantive verdict missing or changed");
const argv = [
  "python3", "-B", ".agents/skills/ld-s10y-choice/scripts/validate.py",
  "--repo", ".", "--seed", seed, "--draft", draft, "--review", review
];
const startedAt = new Date().toISOString();
const result = spawnSync(argv[0], argv.slice(1), { cwd, encoding: "utf8", maxBuffer: 8 * 1024 * 1024 });
const endedAt = new Date().toISOString();
const stdoutPath = path.join(owned, outputs[0]);
const stderrPath = path.join(owned, outputs[1]);
fs.writeFileSync(stdoutPath, result.stdout ?? "", { flag: "wx" });
fs.writeFileSync(stderrPath, result.stderr ?? "", { flag: "wx" });
const after = { seed: hash(seed), draft: hash(draft), first: hash(first), review: hash(review) };
const receipt = {
  schema: "same188-n29-independent-choice-validator-receipt-v1",
  cwd, argv, started_at: startedAt, ended_at: endedAt,
  exit_code: result.status, signal: result.signal,
  error: result.error ? String(result.error) : null,
  streams: {
    stdout: { path: stdoutPath, sha256: hash(stdoutPath), bytes: fs.statSync(stdoutPath).size },
    stderr: { path: stderrPath, sha256: hash(stderrPath), bytes: fs.statSync(stderrPath).size }
  },
  substantive_outcome_before_execution: verdict,
  with_review_checker_invocations: 1,
  no_review_checker_invocations: 0,
  hashes_before: before, hashes_after: after,
  inputs_preserved: Object.keys(before).every((name) => before[name] === after[name]),
  images_opened: 0,
  open_sessions_created: 0
};
fs.writeFileSync(path.join(owned, outputs[2]), JSON.stringify(receipt, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify(receipt, null, 2));
if (result.stdout) console.log(result.stdout);
if (result.stderr) console.error(result.stderr);
if (result.error || result.signal || !receipt.inputs_preserved) process.exitCode = 1;

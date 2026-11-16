import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

const root = ".intentfold/tickets/STEMROBIN-182/tmp/6a-n31";
const seedPath = path.join(root, "seed.json");
const draftPath = path.join(root, "draft.json");
const sourcePath = path.join(root, "source-solutions.json");
const viewPath = path.join(root, "view.json");
const validationPath = path.join(root, "validation-result.json");
const readyPath = path.join(root, "ready.json");
for (const target of [viewPath, validationPath, readyPath]) {
  assert.ok(!fs.existsSync(target), `Refusing repetition or overwrite: ${target}`);
}
const source = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const seed = JSON.parse(fs.readFileSync(seedPath, "utf8"));
const draft = JSON.parse(fs.readFileSync(draftPath, "utf8"));
assert.equal(source.stage_complete, true);
assert.equal(source.options_constructed_before_this_record, false);
assert.equal(seed.source.lesson, "alg6-c4-s1-n31");
assert.equal(seed.exercises.length, 9);
assert.equal(source.solutions.length, 9);
assert.equal(seed.figures.length, 0);

function digest(file) {
  const run = spawnSync("python3", [
    ".agents/skills/ld-s10y-choice/scripts/prepare.py", "digest", file,
  ], { encoding: "utf8" });
  assert.equal(run.status, 0, run.stderr);
  const result = run.stdout.trim();
  assert.match(result, /^[a-f0-9]{64}$/);
  return result;
}
const seedDigest = digest(seedPath);
const draftDigest = digest(draftPath);
assert.equal(seedDigest, source.seed_sha256);
assert.equal(seedDigest, draft.seed_sha256);

const command = [
  "python3", ".agents/skills/ld-s10y-choice/scripts/validate.py",
  "--repo", ".", "--seed", seedPath, "--draft", draftPath,
];
const startedAt = new Date().toISOString();
const run = spawnSync(command[0], command.slice(1), { encoding: "utf8" });
const finishedAt = new Date().toISOString();
fs.writeFileSync(validationPath, JSON.stringify({
  stage: "standalone-structural-only",
  command,
  command_text: command.join(" "),
  execution_count: 1,
  exit_code: run.status,
  signal: run.signal,
  error: run.error ? String(run.error) : null,
  stdout: run.stdout,
  stderr: run.stderr,
  started_at: startedAt,
  finished_at: finishedAt,
  seed_sha256: seedDigest,
  draft_sha256: draftDigest,
  review_used: false,
  canonical_executions: 0,
  semantic_approval: false,
  model: null,
  usage: null,
}, null, 2) + "\n", { flag: "wx" });
assert.equal(run.status, 0, run.stderr || run.stdout);

const projection = {
  questions: draft.questions.map(({ id, source_numbers, view }) => ({
    id, source_numbers, view,
  })),
};
fs.writeFileSync(viewPath, JSON.stringify(projection, null, 2) + "\n", { flag: "wx" });
const ready = {
  stage: "frozen-awaiting-parent-independent-source-and-pure-view-review",
  lesson: seed.source.lesson,
  source_count: seed.exercises.length,
  question_count: projection.questions.length,
  option_count: projection.questions.reduce((sum, q) => sum + q.view.options.length, 0),
  definitions: seed.concepts.map(c => c.block),
  source_path: sourcePath,
  seed_path: seedPath,
  draft_path: draftPath,
  view_path: viewPath,
  seed_sha256: seedDigest,
  draft_sha256: draftDigest,
  view_sha256: digest(viewPath),
  view_byte_sha256: crypto.createHash("sha256").update(fs.readFileSync(viewPath)).digest("hex"),
  source_solutions_sha256: digest(sourcePath),
  figures: [],
  blockers: [],
  production_losses: {
    all_sources: "Selecting full results does not certify independently writing transformations or proofs.",
    "570": "Selecting valid factorizations does not certify freely producing four choices; non-uniqueness is preserved and is not a source blocker.",
    "573": "Actual table lookup operation is not certified; no referenced table image asset is supplied.",
    "575": "Selecting all-real identities does not certify independently constructing and proving them including c=0.",
  },
  parameter_notice: "Full symbolic identities use the supplied natural-exponent rule and preserve the original N labels; no fixed-parameter data or enumeration is required.",
  structural_exit_code: run.status,
  structural_executions: 1,
  canonical_executions: 0,
  browser_executions: 0,
  in_flight_operations: [],
  durable_writes: false,
  model: null,
  usage: null,
};
fs.writeFileSync(readyPath, JSON.stringify(ready, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify(ready, null, 2));

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

const root = ".intentfold/tickets/STEMROBIN-182/tmp/6a-n30";
const seedPath = path.join(root, "seed.json");
const draftPath = path.join(root, "draft.json");
const sourcePath = path.join(root, "source-solutions.json");
const viewPath = path.join(root, "view.json");
const resultPath = path.join(root, "validation-result.json");
const readyPath = path.join(root, "ready.json");
for (const target of [viewPath, resultPath, readyPath]) {
  assert.ok(!fs.existsSync(target), `Refusing to repeat or overwrite: ${target}`);
}

const source = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const seed = JSON.parse(fs.readFileSync(seedPath, "utf8"));
const draft = JSON.parse(fs.readFileSync(draftPath, "utf8"));
assert.equal(source.stage_complete, true);
assert.equal(source.options_constructed_before_this_record, false);
assert.equal(seed.source.lesson, "alg6-c4-s1-n30");
assert.equal(seed.exercises.length, 19);
assert.equal(seed.figures.length, 0);
assert.equal(source.solutions.length, seed.exercises.length);

function digest(file) {
  const run = spawnSync(
    "python3",
    [".agents/skills/ld-s10y-choice/scripts/prepare.py", "digest", file],
    { encoding: "utf8" },
  );
  assert.equal(run.status, 0, run.stderr);
  const value = run.stdout.trim();
  assert.match(value, /^[a-f0-9]{64}$/);
  return value;
}

const seedDigest = digest(seedPath);
const draftDigest = digest(draftPath);
assert.equal(seedDigest, draft.seed_sha256);
assert.equal(seedDigest, source.seed_sha256);
const command = [
  "python3",
  ".agents/skills/ld-s10y-choice/scripts/validate.py",
  "--repo", ".",
  "--seed", seedPath,
  "--draft", draftPath,
];
const startedAt = new Date().toISOString();
const validation = spawnSync(command[0], command.slice(1), { encoding: "utf8" });
const finishedAt = new Date().toISOString();
fs.writeFileSync(resultPath, JSON.stringify({
  stage: "standalone-structural-only",
  command,
  command_text: command.join(" "),
  execution_count: 1,
  exit_code: validation.status,
  signal: validation.signal,
  error: validation.error ? String(validation.error) : null,
  stdout: validation.stdout,
  stderr: validation.stderr,
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

assert.equal(validation.status, 0, validation.stderr || validation.stdout);
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
  unresolved_source_branches: [
    { source_number: "550", subtask: "j if N includes zero", reason: "N zero convention and zero-power definition absent; visible unit only covers k=1 and k>1." },
    { source_number: "560", subtask: "f if k=0 belongs to N", reason: "Zero-power definition absent; visible classification explicitly covers positive k only." },
    { source_number: "564", subtask: "full-N zero-exponent branch", reason: "Positive-integer branches solved; no silent N convention or zero-power extension." },
  ],
  production_losses: {
    all_sources: "Independent written production and proofs are not certified by selecting complete results.",
    "557": "Actual square/cube table lookup operation is not certified; no interactive table asset is supplied.",
    "567": "No drawing loss: source explicitly asks not to draw.",
  },
  structural_exit_code: validation.status,
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

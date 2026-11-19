import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const R = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const T = path.join(R, ".intentfold/tickets/STEMROBIN-181/tmp");
const OUT = path.join(T, "d885-n87-first-choice-author");
const sha256 = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const canonical = (value) => {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value !== null && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${canonical(key)}:${canonical(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value).replace(/[\u0080-\uffff]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`);
};
const write = (target, data) => {
  if (!target.startsWith(`${OUT}/`)) throw new Error("Output escaped bounded scratch");
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${JSON.stringify(data, null, 2)}\n`, { flag: "wx" });
};
const checkpointPath = path.join(OUT, "pre-options-checkpoint.json");
const bytes = fs.readFileSync(checkpointPath);
const checkpoint = JSON.parse(bytes);
if (checkpoint.solutions.length !== 6 || checkpoint.solutions.some((s) => "options" in s || "key" in s)) {
  throw new Error("Checkpoint must contain six option-free solutions");
}
const freeze = {
  schema: "d885-n87-checkpoint-freeze-v1",
  frozen_at_utc: new Date().toISOString(),
  phase: "pre-options",
  checkpoint_path: checkpointPath,
  checkpoint_bytes_sha256: sha256(bytes),
  checkpoint_canonical_sha256: sha256(canonical(checkpoint)),
  options_created: false,
  reviewer: null,
  semantic_approval: false,
  seeds: {},
  solutions: {}
};
for (const locale of ["zh", "en"]) {
  const sourceSeed = path.join(T, `d884-n87-first-choice-preparation/${locale}/source/.intentfold/tickets/STEMROBIN-181/tmp/seed.json`);
  const seedBytes = fs.readFileSync(sourceSeed);
  const seed = JSON.parse(seedBytes);
  if (sha256(canonical(seed)) !== checkpoint.seed_sha256[locale]) throw new Error("Seed binding changed");
  for (const row of checkpoint.solutions) {
    if (seed.exercises.find((s) => s.number === row.source_number)?.text !== row.written_task[locale]) {
      throw new Error("Written task differs from approved seed");
    }
  }
  const seedPath = path.join(OUT, locale, "seed.json");
  fs.mkdirSync(path.dirname(seedPath), { recursive: true });
  fs.writeFileSync(seedPath, seedBytes, { flag: "wx" });
  const solutions = {
    schema: "d885-n87-written-solutions-v1",
    stage: "FIRST",
    locale,
    seed_sha256: checkpoint.seed_sha256[locale],
    pre_options_checkpoint_sha256: freeze.checkpoint_canonical_sha256,
    role: "author-derived, frozen before options; not an independent review",
    native_finalization: "pending",
    written_tasks_preserved_separately: true,
    solutions: checkpoint.solutions.map((s) => ({
      source_number: s.source_number,
      written_task: s.written_task[locale],
      task: s.task[locale],
      source_solution: s.solution[locale],
      conditions: s.conditions[locale],
      conceptual_distinction: s.distinction[locale],
      concept_blocks: s.concept_blocks,
      production_loss: s.production_loss[locale]
    }))
  };
  const solutionsPath = path.join(OUT, locale, "solutions.json");
  write(solutionsPath, solutions);
  freeze.seeds[locale] = { path: seedPath, bytes_sha256: sha256(seedBytes), canonical_sha256: sha256(canonical(seed)) };
  freeze.solutions[locale] = { path: solutionsPath, bytes_sha256: sha256(fs.readFileSync(solutionsPath)), canonical_sha256: sha256(canonical(solutions)) };
  fs.chmodSync(seedPath, 0o444);
  fs.chmodSync(solutionsPath, 0o444);
}
write(path.join(OUT, "checkpoint-freeze.json"), freeze);
fs.chmodSync(checkpointPath, 0o444);
fs.chmodSync(path.join(OUT, "checkpoint-freeze.json"), 0o444);
console.log(JSON.stringify(freeze, null, 2));

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const R = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const OUT = path.join(R, ".intentfold/tickets/STEMROBIN-181/tmp/d885-n87-first-choice-author");
const sha256 = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const canonical = (value) => {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value !== null && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${canonical(key)}:${canonical(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value).replace(/[\u0080-\uffff]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`);
};
const read = (name) => JSON.parse(fs.readFileSync(path.join(OUT, name), "utf8"));
const write = (name, value) => {
  const target = path.join(OUT, name);
  if (!target.startsWith(`${OUT}/`)) throw new Error("Output escaped bounded scratch");
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
};
const checkpoint = read("pre-options-checkpoint.json");
const freeze = read("checkpoint-freeze.json");
if (sha256(canonical(checkpoint)) !== freeze.checkpoint_canonical_sha256) throw new Error("Frozen checkpoint changed");
const units = read("authored-units.json").units;
if (units.length !== 6) throw new Error("Expected six complete response units");
for (const locale of ["zh", "en"]) {
  const draft = {
    schema: "s10y-choice-draft-v1",
    seed_sha256: checkpoint.seed_sha256[locale],
    new_figures: [],
    questions: units.map((unit) => {
      const source = checkpoint.solutions.find((s) => s.source_number === unit.source_number);
      return {
        id: unit.id,
        source_numbers: [unit.source_number],
        view: {
          mode: unit.mode,
          stem: unit.stem[locale],
          figure_ids: [],
          options: unit.options.map((option) => ({ id: option.id, text: option.text[locale], figure_ids: [] }))
        },
        intent: {
          task: source.task[locale],
          source_solution: source.solution[locale],
          unit_reason: unit.unit_reason[locale],
          concept_blocks: source.concept_blocks,
          limitations: [source.production_loss[locale]],
          figure_observations: []
        },
        key: {
          correct: unit.options.filter((o) => o.truth === "correct").map((o) => o.id),
          rationales: unit.options.map((o) => ({
            option_id: o.id,
            truth: o.truth,
            derivation: o.derivation[locale],
            misconception: o.misconception === null ? null : o.misconception[locale]
          }))
        }
      };
    }),
    coverage: units.map((unit) => {
      const source = checkpoint.solutions.find((s) => s.source_number === unit.source_number);
      return {
        source_number: unit.source_number,
        question_ids: [unit.id],
        omitted_tasks: [source.production_loss[locale]],
        reason: unit.coverage_reason[locale]
      };
    })
  };
  write(`${locale}/draft.json`, draft);
  // Export only the contract's view subtree, never internal source links or keys.
  write(`${locale}/client-views.json`, draft.questions.map((question) => question.view));
  console.log(`${locale}: six FIRST units; four single, two multiple; 26 options; no images; semantic review pending`);
}

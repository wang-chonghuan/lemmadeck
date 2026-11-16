import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";

const scratch = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(scratch, "../../../../..");
const read = (name) => JSON.parse(fs.readFileSync(path.join(scratch, name), "utf8"));
const write = (name, value) => fs.writeFileSync(
  path.join(scratch, name), `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" },
);
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const sorted = (value) => Array.isArray(value)
  ? value.map(sorted)
  : value !== null && typeof value === "object"
    ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, sorted(value[key])]))
    : value;
const digest = (value) => hash(JSON.stringify(sorted(value)).replace(
  /[\u007f-\uffff]/g, (character) =>
    `\\u${character.charCodeAt(0).toString(16).padStart(4, "0")}`,
));

for (const name of [
  "view.json", "structural-invocation.json", "structural-result.json", "ready.json",
]) {
  if (fs.existsSync(path.join(scratch, name))) {
    throw new Error(`Frozen or previously started finalization: ${name}`);
  }
}

const seed = read("seed.json");
const draft = read("draft.json");
const view = {
  questions: draft.questions.map(({ id, source_numbers, view }) =>
    ({ id, source_numbers, view })),
};
write("view.json", view);

const args = [
  ".agents/skills/ld-s10y-choice/scripts/validate.py",
  "--repo", ".",
  "--seed", path.relative(repo, path.join(scratch, "seed.json")),
  "--draft", path.relative(repo, path.join(scratch, "draft.json")),
];
write("structural-invocation.json", {
  executable: "python3", args, cwd: repo, maximum_runs: 1,
  semantic_review_requested: false, canonical_requested: false,
});
const result = spawnSync("python3", args, {
  cwd: repo,
  encoding: "utf8",
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
});
write("structural-result.json", {
  executable: "python3", args, cwd: repo,
  exit_code: result.status,
  signal: result.signal,
  error: result.error?.message ?? null,
  stdout: result.stdout ?? "",
  stderr: result.stderr ?? "",
  semantic_review: "pending separate independent source-first review",
});
if (result.status !== 0) {
  console.log(result.stdout);
  console.error(result.stderr);
  process.exitCode = result.status ?? 1;
} else {
  const files = [
    "seed.json", "source-solutions.md", "draft.json", "view.json",
    "structural-invocation.json", "structural-result.json", "finalize.mjs",
  ].map((name) => ({
    path: path.relative(repo, path.join(scratch, name)),
    bytes: fs.statSync(path.join(scratch, name)).size,
    sha256: hash(fs.readFileSync(path.join(scratch, name))),
  }));
  const ready = {
    status: "frozen author snapshot; independent review pending",
    lesson: seed.source.lesson,
    source_numbers: seed.exercises.map(({ number }) => number),
    concept_blocks: seed.concepts.map(({ block }) => block),
    excluded_concept_blocks: [
      { block: 0, reason: "Contains completed example divisor inventories." },
    ],
    counts: {
      sources: seed.exercises.length,
      questions: draft.questions.length,
      single: draft.questions.filter(({ view }) => view.mode === "single").length,
      multiple: draft.questions.filter(({ view }) => view.mode === "multiple").length,
      options: draft.questions.reduce((count, { view }) => count + view.options.length, 0),
      coverage_records: draft.coverage.length,
      concepts: seed.concepts.length,
      source_figures: seed.figures.length,
      new_figures: draft.new_figures.length,
      deferred_sources: draft.coverage.filter(({ question_ids }) => !question_ids.length).length,
    },
    canonical_json_digests: {
      seed: digest(seed),
      draft: digest(draft),
      pure_view: digest(view),
    },
    allowed_source_trace: seed.trace,
    structural_exit_code: result.status,
    structural_runs: 1,
    canonical_runs: 0,
    semantic_approval_claimed: false,
    essential_source_blockers: [],
    source_uncertainties: [
      "Natural-number inclusion of zero is not defined by the selected prose; q749 uses only an invariant conclusion and does not invent the convention.",
      "Exercise 751's average-daily-stock phrasing is interpreted explicitly as the original daily allocation, retaining all numerical stock conditions.",
    ],
    production_losses: [
      "Choice recognition does not demonstrate independent enumeration, proof production, factor discovery, equation formulation, or written arithmetic.",
      "All requested substantive numerical and judgment units remain represented; no construction or graphical task is present.",
    ],
    files,
  };
  write("ready.json", ready);
  console.log(JSON.stringify({
    lesson: ready.lesson,
    counts: ready.counts,
    digests: ready.canonical_json_digests,
    structural_exit_code: result.status,
    pure_view_path: path.join(scratch, "view.json"),
    essential_source_blockers: ready.essential_source_blockers,
  }, null, 2));
}

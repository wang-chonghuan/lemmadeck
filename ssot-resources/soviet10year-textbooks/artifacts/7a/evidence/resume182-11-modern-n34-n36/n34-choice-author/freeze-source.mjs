import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const cwd = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
if (process.cwd() !== cwd) throw new Error("Only the authorized cwd is allowed.");
const own = dirname(fileURLToPath(import.meta.url));
const expectedOwn = resolve(cwd, ".intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-choice-author");
if (own !== expectedOwn) throw new Error("Unexpected output ownership.");
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const canonical = (value) => {
  if (Array.isArray(value)) return value.map(canonical);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])]));
  }
  return value;
};
const canonicalBytes = (value) => JSON.stringify(canonical(value))
  .replace(/[\u0080-\uffff]/g, (character) => `\\u${character.charCodeAt(0).toString(16).padStart(4, "0")}`);
const solutions = JSON.parse(readFileSync(join(own, "source-solutions.json"), "utf8"));
const readAuthority = (path, expected) => {
  const bytes = readFileSync(resolve(cwd, path));
  if (hash(bytes) !== expected) throw new Error(`Authority changed before freeze: ${path}`);
  return JSON.parse(bytes.toString("utf8"));
};
const lesson = readAuthority(solutions.authority.lesson_path, solutions.authority.lesson_sha256);
const exercises = readAuthority(solutions.authority.exercises_path, solutions.authority.exercises_sha256);
const selected = new Set(solutions.selected_exercises);
const projected = exercises.exercises.filter((exercise) => selected.has(exercise.number)).map((exercise) => ({
  number: exercise.number,
  text: exercise.text,
  figure_ids: [...new Set([
    ...(exercise.figure_refs ?? []),
    ...(exercise.figures ?? []).map((figure) => figure.id),
  ])],
}));
if (projected.length !== 8) throw new Error("All eight authorized source exercises are required.");
const snapshot = {
  schema: "n34-written-authority-snapshot-v1",
  status: "pre-adapt-finalize, not a prepared formal seed",
  source: solutions.authority,
  exercises: projected,
  concepts: solutions.selected_concept_blocks.map((block) => {
    const prose = lesson.prose[block];
    if (prose.kind !== "p" || !prose.text) throw new Error(`Invalid concept block ${block}`);
    return { block, text: prose.text };
  }),
  concept_figure_ids: [],
};
const writeOwned = (name, value) => {
  writeFileSync(join(own, name), `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
};
writeOwned("source-snapshot.json", snapshot);
const names = ["source-snapshot.json", "source-solutions.json", "source-solutions.md", "image-use.json"];
const artifacts = names.map((name) => {
  const bytes = readFileSync(join(own, name));
  return {
    path: join(own, name),
    sha256: hash(bytes),
    ...(name.endsWith(".json") ? {
      canonical_sha256: hash(canonicalBytes(JSON.parse(bytes.toString("utf8")))),
    } : {}),
  };
});
const ready = {
  schema: "n34-choice-author-ready-v1",
  status: "frozen_source_solve_ready_waiting_for_parent_adapt_finalize",
  cwd,
  artifact_count: artifacts.length,
  artifacts,
  source_exercise_count: 8,
  solved_source_numbers: solutions.selected_exercises,
  definition_block_count: solutions.selected_concept_blocks.length,
  image_view_count: 4,
  image_reopen_count: 0,
  authored_option_count: 0,
  formal_seed_prepared: false,
  draft_completed: false,
  structural_checker_run: false,
  semantic_self_review_performed: false,
  independent_figure_gate_claimed: false,
  next_required_input: "Explicit parent adapt-finalize notice. Do not run formal seed prepare before that notice.",
};
writeOwned("source-ready.json", ready);
console.log(JSON.stringify(ready, null, 2));

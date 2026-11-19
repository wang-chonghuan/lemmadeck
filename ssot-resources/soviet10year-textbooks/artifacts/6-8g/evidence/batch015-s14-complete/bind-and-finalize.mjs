import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const repo = "/Users/yong/.codex/worktrees/a07e/lemmadeck";
assert.equal(process.cwd(), repo);
const book = "ssot-resources/soviet10year-textbooks/artifacts/6-8g";
const id = "geo68-c1-s14";
const original = `${book}/lessons/${id}`;
const modern = `${book}/editions/modern-us-neutral/lessons/${id}`;
const root = ".tmp/s10y-modern/batch015-geo68-s14";
const load = file => JSON.parse(fs.readFileSync(file));
const hash = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const binding = file => ({ path: file, sha256: hash(file) });
const source = load(`${original}/lesson.json`);
const lesson = load(`${modern}/lesson.json`);
assert.deepEqual(lesson.source.data, source);
assert.equal(lesson.source.sha256, hash(`${original}/lesson.json`));
assert.equal(source.exercise_count, 0);
assert.equal(lesson.exercise_count, 0);
assert.equal(load(`${original}/exercises.json`).exercises.length, 0);
assert.equal(load(`${modern}/exercises.json`).exercises.length, 0);
assert.equal(source.prose.length, lesson.prose.length);
for (let index = 0; index < source.prose.length; index++) {
  const a = source.prose[index];
  const b = lesson.prose[index];
  for (const key of ["kind", "id", "label", "printed_page", "source_refs"]) {
    assert.deepEqual(b[key], a[key], `${index}:${key}`);
  }
  assert.equal(b.source_text, a.text);
  assert.deepEqual(b.numeric_changes, []);
  assert.deepEqual(b.text.match(/\$[^$]+\$/g) ?? [], a.text.match(/\$[^$]+\$/g) ?? []);
}
assert.equal(load(`${modern}/adaptation.audit.json`).status, "pass");
const figures = load(`${modern}/figures.json`).figures;
assert.equal(figures.length, 5);
const figureBindings = [];
for (const figure of figures) {
  const reviewPath = `${book}/editions/modern-us-neutral/${figure.review}`;
  const review = load(reviewPath);
  assert.equal(review.status, "pass");
  const production = figure.mode === "generated" ? review.generation : review.render;
  for (const entry of [review.source, review.spec, production, ...Object.values(review.outputs)]) {
    assert.equal(entry.sha256, hash(entry.path), entry.path);
  }
  figureBindings.push(binding(reviewPath));
}
const args = [".claude/skills/ld-s10y-answer/tools/lesson_answers.py", "finalize",
  "--book", "6-8g", "--edition", "modern-us-neutral", "--lesson", id];
const result = spawnSync("python3", args, { cwd: repo, encoding: "utf8" });
const receipt = {
  ticket: "STEMROBIN-184",
  lesson: id,
  stage: "existing text binding and first zero-answer finalization",
  text_review: binding(`${root}/text-review.md`),
  source: binding(`${original}/lesson.json`),
  modern: binding(`${modern}/lesson.json`),
  prose_objects: source.prose.length,
  paragraph_objects: source.prose.filter(block => block.kind === "p").length,
  figures: figureBindings,
  choice_stage: { status: "not_applicable", reason: "No original or modern written exercises" },
  answer_finalize: { command: ["python3", ...args], exit: result.status,
    stdout: result.stdout, stderr: result.stderr },
  parent_images: 0, paid_calls: 0, database_writes: 0,
  recovered_fault: binding(`${root}/first-failure.json`),
  display: "pending"
};
fs.writeFileSync(path.join(root, "binding-and-finalize.json"), JSON.stringify(receipt, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify({ exit: result.status, objects: source.prose.length, stdout: result.stdout }));
process.exitCode = result.status;

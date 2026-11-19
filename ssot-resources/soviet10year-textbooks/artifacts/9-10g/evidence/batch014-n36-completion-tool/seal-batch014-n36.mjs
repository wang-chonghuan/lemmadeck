import assert from "node:assert/strict";
import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";

assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/a07e/lemmadeck");
const book = "ssot-resources/soviet10year-textbooks/artifacts/9-10g";
const edition = `${book}/editions/modern-us-neutral`;
const id = "geo910-c1-s3-n36";
const root = `${edition}/lessons/${id}`;
const evidence = `${book}/evidence`;
const display = `${evidence}/batch014-display36-affected`;
const load = filename => JSON.parse(fs.readFileSync(filename));
const sha = filename => crypto.createHash("sha256").update(fs.readFileSync(filename)).digest("hex");
const record = filename => ({ path: filename, sha256: sha(filename) });
const answers = load(`${root}/answer-keys.json`);
const draft = load(`${root}/choice-set/draft.json`);
assert.equal(answers.status, "ready");
assert.equal(sha(`${root}/answer-keys.json`), "d048af24108f2fd52d07770dc9a2a2d043befdded3abafd71c8a06583075a4df");
assert.equal(load(`${root}/answer-keys.audit.json`).status, "pass");
assert.equal(load(`${root}/choice-set/review.json`).outcome, "pass");
assert.equal(sha(`${root}/choice-set/draft.json`), "2b0b69aed672bfceea6788b0c25f714ba3d93a74692de4d94e2ea11dbf01a55e");
const result = load(`${display}/${id}/result.json`);
const affected = load(`${display}/affected/visual-review.json`);
const first = load(`${evidence}/batch014-display36-first-failure/batch014-observer36/visual-review.json`);
assert.equal(result.status, "pass");
assert.equal(affected.status, "pass");
assert.equal(affected.native_checks.result_sha256, sha(`${display}/${id}/result.json`));
assert.equal(result.draft.sha256, sha(`${root}/choice-set/draft.json`));
assert.equal(affected.candidate_sha256, result.draft.sha256);
assert.equal(result.results.length, 6);
assert.equal(new Set(result.results.map(item => `${item.view}:${item.viewport.width}`)).size, 6);
for (const item of result.results) {
  assert.equal(item.status, "pass");
  const screenshot = `${display}/${id}/${path.basename(item.screenshot)}`;
  assert.ok(fs.existsSync(screenshot));
  if (item.view === "choices") {
    assert.equal(item.choiceGeometry.length, 50);
    assert.ok(item.choiceGeometry.every(option => option.endReachable && option.fontSize >= 16));
  } else {
    const old = first.screenshot_checks.find(check => path.basename(check.path) === path.basename(screenshot));
    assert.ok(old, "each reused visual pass must have original evidence");
    assert.equal(old.status, "pass");
    assert.equal(old.sha256, sha(screenshot));
  }
}
const figures = load(`${root}/figures.json`).figures;
assert.equal(figures.length, 4);
const totals = {
  lessons: 1, answers: answers.answers.length,
  auto: answers.answers.filter(answer => answer.grading === "auto").length,
  ungraded: answers.answers.filter(answer => answer.grading === "ungraded").length,
  choices: draft.questions.length,
  options: draft.questions.reduce((sum, question) => sum + question.view.options.length, 0),
  figures: figures.length,
};
assert.deepEqual(totals, { lessons: 1, answers: 11, auto: 2, ungraded: 9, choices: 12, options: 50, figures: 4 });
const output = `${evidence}/batch014-n36-completion.json`;
const document = {
  schema: "s10y-offline-batch-completion@1",
  ticket: "STEMROBIN-184", createdAt: new Date().toISOString(), status: "pass",
  scope: "One completed offline modern lesson; not publication, live-product acceptance or ticket completion",
  totals,
  historical_totals_arithmetic_only: { lessons: 36, answers: 294, choices: 273, options: 1166 },
  lessons: [{
    lesson: id,
    artifacts: fs.readdirSync(root).filter(name => name.endsWith(".json")).map(name => record(`${root}/${name}`))
      .concat(["seed", "draft", "review"].map(name => record(`${root}/choice-set/${name}.json`))),
    offline_acceptance: record(`${display}/${id}/result.json`),
    visual_review: record(`${display}/affected/visual-review.json`),
    screenshots: result.results.map(item => record(`${display}/${id}/${path.basename(item.screenshot)}`))
      .concat(record(`${display}/${id}/choices-q3-390.png`)),
  }],
  figures: figures.map(figure => ({
    figure: figure.id,
    files: ["spec.json", "svg", "render.json", "review.json"].map(suffix =>
      record(`${edition}/figures/${figure.id}.${suffix}`)),
  })),
  evidence: [
    "batch014-independent36-first", "batch014-choice-internal-evidence-repair",
    "batch014-independent36-affected", "batch014-answer-finalize36",
    "batch014-display36-first-failure", "batch014-display36-affected",
  ].map(name => record(`${evidence}/${name}/retention.json`)),
  qualifications: [
    "Original failed internal-evidence review remains unchanged; only two affected internal rationale fields were repaired and reviewed. Learner-facing views did not change.",
    "The first mobile clipping inference was caused by viewer reduction ambiguity, not confirmed native clipping. Original failure preserved; new native Q3 capture and both strengthened choice viewport checks pass.",
    "Four original text/exercise visual passes were reused with exact screenshot hashes. Only two affected choice views reran.",
    "Answer finalization changed status/count only; no exact candidates, so no actual MathLive editor transaction is claimed for this lesson.",
    "Historical totals are prior35 plus this one lesson, not a fresh corpus recount.",
    "Source37/38 remains in progress. Full mechanical defence/build remains for formal handoff; no publication or ticket completion is claimed.",
  ],
  parent_image_opens: 0, new_paid_calls: 0, database_writes: 0, published: false,
};
fs.writeFileSync(output, JSON.stringify(document, null, 2) + "\n", { flag: "wx", mode: 0o444 });
console.log(JSON.stringify({ output, sha256: sha(output), totals }));

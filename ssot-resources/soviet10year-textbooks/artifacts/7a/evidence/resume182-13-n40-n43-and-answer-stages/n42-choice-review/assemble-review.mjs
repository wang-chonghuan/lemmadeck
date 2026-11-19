import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const own = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(own, "../../../../../..");
const author = path.resolve(own, "../n42-choice-author");
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const ordered = (value) =>
  Array.isArray(value)
    ? value.map(ordered)
    : value && typeof value === "object"
      ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, ordered(value[key])]))
      : value;
const digest = (value) =>
  hash(
    JSON.stringify(ordered(value)).replace(
      /[\u007f-\uffff]/g,
      (character) => `\\u${character.charCodeAt(0).toString(16).padStart(4, "0")}`,
    ),
  );

const comparison = read(path.join(own, "stage3-comparison.json"));
const source = read(path.join(own, "source-solutions.json"));
const fidelity = read(path.join(own, "stage2-fidelity.json"));
const mathematics = read(path.join(own, "stage2-mathematics.json"));
const observations = read(path.join(own, "stage2-figure-observations.json"));
const newFigureReviews = read(path.join(own, "new-figure-reviews.json"));
const seed = read(path.join(author, "seed.json"));
const draft = read(path.join(author, "draft.json"));

for (const input of comparison.inputs) {
  assert.equal(hash(fs.readFileSync(path.resolve(root, input.path))), input.sha256);
}
assert.equal(digest(seed), source.seed_binding.canonical_sha256);
assert.equal(digest(draft), comparison.inputs.find((input) => input.path.endsWith("/draft.json")).canonical_sha256);
assert.equal(comparison.outcome, "pass");

const review = {
  schema: "s10y-choice-review-v1",
  seed_sha256: digest(seed),
  draft_sha256: digest(draft),
  reviewer: fidelity.reviewer,
  source_reviews: source.source_reviews.map((sourceReview) => {
    const visible = fidelity.visible_source_coverage.find((item) => item.source_number === sourceReview.source_number);
    const authorCheck = comparison.source_coverage_comparisons.find((item) => item.source_number === sourceReview.source_number);
    assert.equal(authorCheck.verdict, "pass");
    return {
      source_number: sourceReview.source_number,
      independent_solution: sourceReview.independent_solution,
      coverage: {
        verdict: visible.coverage.verdict,
        evidence: `${visible.coverage.evidence} Author comparison: ${authorCheck.evidence}`,
      },
    };
  }),
  figure_checks: draft.new_figures.map((figure) => {
    const opened = observations.figure_checks.find((item) => item.figure_id === figure.id);
    const frozen = newFigureReviews.find((item) => item.figure_id === figure.id);
    assert.equal(figure.sha256, frozen.asset_sha256);
    assert.equal(hash(fs.readFileSync(path.resolve(root, figure.path))), figure.sha256);
    return {
      figure_id: figure.id,
      asset_path: figure.path,
      asset_sha256: figure.sha256,
      observation: `${opened.observation} The registered SVG was inspected through its corresponding full PNG, actually opened at ${opened.asset_path}, SHA-256 ${opened.asset_sha256}. The canonical asset path/hash binds the current registered SVG; it is not a claim of a direct SVG image open. Its unchanged spec/render/SVG correspondence and independent figure approval are preserved in the frozen Stage2 records.`,
    };
  }),
  new_figure_reviews: newFigureReviews,
  question_reviews: draft.questions.map((question) => {
    const visible = fidelity.question_reviews.find((item) => item.question_id === question.id);
    const frozen = mathematics.question_reviews.find((item) => item.question_id === question.id).mathematics;
    const authorCheck = comparison.question_comparisons.find((item) => item.question_id === question.id);
    assert.equal(authorCheck.verdict, "pass");
    assert.deepEqual(question.key.correct, frozen.correct);
    return {
      question_id: question.id,
      task_fidelity: {
        verdict: visible.task_fidelity.verdict,
        evidence: `${visible.task_fidelity.evidence} Author intent/declared-loss comparison: ${authorCheck.evidence}`,
      },
      redundancy: visible.redundancy,
      answer_leakage: visible.answer_leakage,
      mathematics: {
        ...frozen,
        option_checks: frozen.option_checks.map((check) => {
          const rationale = comparison.rationale_checks.find(
            (item) => item.question_id === question.id && item.option_id === check.option_id,
          );
          assert.equal(rationale.verdict, "pass");
          assert.equal(rationale.truth, check.truth);
          return {
            ...check,
            evidence: `${check.evidence} Author derivation/misconception comparison: ${rationale.evidence}`,
          };
        }),
      },
    };
  }),
  outcome: "pass",
};

assert.equal(review.source_reviews.length, 4);
assert.equal(review.question_reviews.length, 5);
assert.equal(review.question_reviews.reduce((sum, question) => sum + question.mathematics.option_checks.length, 0), 22);
assert.equal(review.new_figure_reviews.length, 2);
assert.deepEqual(review.new_figure_reviews, newFigureReviews);

const output = path.join(own, "review.json");
fs.writeFileSync(output, `${JSON.stringify(review, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ output, sha256: hash(fs.readFileSync(output)), canonical_sha256: digest(review), seed_sha256: review.seed_sha256, draft_sha256: review.draft_sha256, source_reviews: 4, questions: 5, option_checks: 22, new_figure_reviews: 2 }));

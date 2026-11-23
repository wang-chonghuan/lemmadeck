const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = path.resolve('.tmp/stemrobin-184-six/c6-resume');
const reviewer = path.join(root, 'reviewer');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const read = name => JSON.parse(fs.readFileSync(path.join(reviewer, name), 'utf8'));
const source = read('source-first.json');
const visible = read('view-first.json');
const comparison = read('internal-comparison.json');
const coverage = new Map(comparison.coverage_comparisons.map(c => [c.source_number, c]));
const updates = new Map(comparison.fidelity_updates.map(c => [c.question_id, c]));
const internals = new Map(comparison.question_comparisons.map(c => [c.question_id, c]));

// Reuse the immutable independent judgments; internal comparisons only append evidence.
const questionReviews = visible.question_reviews.map(frozen => {
  const q = structuredClone(frozen);
  const update = updates.get(q.question_id);
  const internal = internals.get(q.question_id);
  if (update) q.task_fidelity = { verdict: update.verdict, evidence: update.evidence };
  const rationaleMap = new Map(internal.rationale_comparisons.map(c => [c.option_id, c]));
  q.mathematics = {
    verdict: internal.rationale_comparisons.some(c => c.verdict === 'revise') ? 'revise' : 'pass',
    independent_solution: frozen.mathematics.independent_solution,
    correct: [...frozen.mathematics.correct],
    option_checks: frozen.mathematics.option_checks.map(c => ({
      option_id: c.option_id,
      truth: c.truth,
      evidence: `${c.evidence} Internal comparison: ${rationaleMap.get(c.option_id).evidence}`,
    })),
  };
  return q;
});

const review = {
  schema: 's10y-choice-review-v1',
  seed_sha256: comparison.binding.seed_sha256,
  draft_sha256: comparison.binding.draft_sha256,
  reviewer: source.reviewer,
  source_reviews: source.source_reviews.map(s => ({
    source_number: s.source_number,
    independent_solution: s.independent_solution,
    coverage: {
      verdict: coverage.get(s.source_number).verdict,
      evidence: coverage.get(s.source_number).evidence,
    },
  })),
  figure_checks: [],
  new_figure_reviews: [],
  question_reviews: questionReviews,
  outcome: comparison.outcome,
};

const output = path.join(root, 'review.json');
fs.writeFileSync(output, `${JSON.stringify(review, null, 2)}\n`, { flag: 'wx' });
const freezePaths = ['source-first.md', 'source-first.json', 'view-first.md', 'view-first.json'];
const frozenHashes = Object.fromEntries(
  freezePaths.map(name => [name, sha(fs.readFileSync(path.join(reviewer, name)))]),
);
console.log(JSON.stringify({
  operation: 'Mechanical composition of the requested official review from immutable evidence, not validation or re-review',
  output,
  outcome: review.outcome,
  sources: review.source_reviews.length,
  questions: review.question_reviews.length,
  option_checks: review.question_reviews.reduce((n, q) => n + q.mathematics.option_checks.length, 0),
  source_revise: review.source_reviews.filter(s => s.coverage.verdict === 'revise').map(s => s.source_number),
  fidelity_revise: review.question_reviews.filter(q => q.task_fidelity.verdict === 'revise').map(q => q.question_id),
  leakage_revise: review.question_reviews.filter(q => q.answer_leakage.verdict === 'revise').map(q => q.question_id),
  mathematics_revise: review.question_reviews.filter(q => q.mathematics.verdict === 'revise').map(q => q.question_id),
  frozen_file_sha256: frozenHashes,
}, null, 2));

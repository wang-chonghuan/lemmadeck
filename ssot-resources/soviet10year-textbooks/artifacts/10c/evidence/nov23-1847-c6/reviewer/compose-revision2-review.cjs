const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = path.resolve('.tmp/stemrobin-184-six/c6-resume');
const read = name => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const original = read('revision1/review.json');
const affected = read('reviewer/second-affected-view-first.json');
const comparison = read('reviewer/final-internal-comparison.json');
const review = structuredClone(original);
const changedViews = new Map(affected.question_reviews.map(q => [q.question_id, q]));
const sourceUpdates = new Map(comparison.source_coverage_updates.map(s => [s.source_number, s]));
const rationales = new Map(comparison.rationale_comparisons.map(r => [
  `${r.question_id}/${r.option_id}`, r,
]));
const originalQuestions = new Map(original.question_reviews.map(q => [q.question_id, q]));

review.draft_sha256 = comparison.binding.draft_sha256;
review.outcome = comparison.outcome;
for (const source of review.source_reviews) {
  const update = sourceUpdates.get(source.source_number);
  if (update) source.coverage = { verdict: update.verdict, evidence: update.evidence };
}
for (const q of review.question_reviews) {
  const view = changedViews.get(q.question_id);
  if (!view) continue;
  q.task_fidelity = structuredClone(view.task_fidelity);
  q.redundancy = structuredClone(view.redundancy);
  q.answer_leakage = structuredClone(view.answer_leakage);
  const visibleOptions = new Map(view.mathematics.option_checks.map(c => [c.option_id, c]));
  q.mathematics.option_checks = q.mathematics.option_checks.map(c => {
    const internal = rationales.get(`${q.question_id}/${c.option_id}`);
    if (!internal) return c;
    return {
      ...c,
      evidence: `${visibleOptions.get(c.option_id).evidence} Final internal comparison: ${internal.evidence}`,
    };
  });
}

const output = path.join(root, 'revision2/review.json');
fs.writeFileSync(output, `${JSON.stringify(review, null, 2)}\n`, { flag: 'wx' });
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const protectedPaths = [
  'review.json', 'revision1/review.json',
  'reviewer/source-first.md', 'reviewer/source-first.json',
  'reviewer/view-first.md', 'reviewer/view-first.json',
  'reviewer/affected-view-first.md', 'reviewer/affected-view-first.json',
  'reviewer/second-affected-view-first.md', 'reviewer/second-affected-view-first.json',
];
console.log(JSON.stringify({
  operation: 'Mechanical composition from retained semantic evidence, not validation or repeated review',
  output,
  seed_sha256: review.seed_sha256,
  draft_sha256: review.draft_sha256,
  outcome: review.outcome,
  source_reviews: review.source_reviews.length,
  question_reviews: review.question_reviews.length,
  option_checks: review.question_reviews.reduce((n, q) => n + q.mathematics.option_checks.length, 0),
  source_coverage_pass: review.source_reviews.filter(s => s.coverage.verdict === 'pass').length,
  task_fidelity_pass: review.question_reviews.filter(q => q.task_fidelity.verdict === 'pass').length,
  redundancy_pass: review.question_reviews.filter(q => q.redundancy.verdict === 'pass').length,
  answer_leakage_pass: review.question_reviews.filter(q => q.answer_leakage.verdict === 'pass').length,
  mathematics_pass: review.question_reviews.filter(q => q.mathematics.verdict === 'pass').length,
  preservation: {
    all_source_solution_strings_preserved: review.source_reviews.every((s, i) =>
      s.independent_solution === original.source_reviews[i].independent_solution),
    all_visible_solution_strings_preserved: review.question_reviews.every(q =>
      q.mathematics.independent_solution === originalQuestions.get(q.question_id).mathematics.independent_solution),
    all_complete_true_sets_preserved: review.question_reviews.every(q =>
      same(q.mathematics.correct, originalQuestions.get(q.question_id).mathematics.correct)),
    all_option_truth_labels_preserved: review.question_reviews.every(q =>
      same(q.mathematics.option_checks.map(c => [c.option_id, c.truth]),
        originalQuestions.get(q.question_id).mathematics.option_checks.map(c => [c.option_id, c.truth]))),
    other_question_review_records_copied_unchanged: review.question_reviews.filter(q =>
      !changedViews.has(q.question_id) && same(q, originalQuestions.get(q.question_id))).length,
    source_350_record_unchanged: same(
      review.source_reviews.find(s => s.source_number === '350'),
      original.source_reviews.find(s => s.source_number === '350')),
  },
  protected_byte_sha256: Object.fromEntries(protectedPaths.map(name => [
    name, sha(fs.readFileSync(path.join(root, name))),
  ])),
}, null, 2));

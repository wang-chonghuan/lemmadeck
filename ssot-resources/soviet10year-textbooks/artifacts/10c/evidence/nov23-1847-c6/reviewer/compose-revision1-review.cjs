const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = path.resolve('.tmp/stemrobin-184-six/c6-resume');
const read = name => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const original = read('review.json');
const affected = read('reviewer/affected-view-first.json');
const comparison = read('reviewer/affected-internal-comparison.json');
const frozenVisible = read('reviewer/view-first.json');
const review = structuredClone(original);
const metadata = new Map(comparison.metadata_comparisons.map(c => [c.question_id, c]));
const sourceMetadata = new Map(comparison.metadata_comparisons.map(c => [c.source_number, c]));
const changedViews = new Map(affected.question_reviews.map(q => [q.question_id, q]));
const originalQuestions = new Map(original.question_reviews.map(q => [q.question_id, q]));
const changedIds = new Set([...metadata.keys(), ...changedViews.keys(), 'c6-389']);

review.draft_sha256 = comparison.binding.draft_sha256;
review.outcome = 'revise';
for (const source of review.source_reviews) {
  const update = sourceMetadata.get(source.source_number);
  if (update) source.coverage = structuredClone(update.coverage);
  const view = changedViews.get(`c6-${source.source_number}`);
  if (view) {
    source.coverage = {
      verdict: 'revise',
      evidence: `The mathematical values remain covered, but the accepted revised view still bypasses the source's decisive inverse/proof inference. ${view.answer_leakage.evidence}`,
    };
  }
}

for (const q of review.question_reviews) {
  const update = metadata.get(q.question_id);
  if (update) q.task_fidelity = structuredClone(update.task_fidelity);
  const view = changedViews.get(q.question_id);
  if (view) {
    q.task_fidelity = structuredClone(view.task_fidelity);
    q.redundancy = structuredClone(view.redundancy);
    q.answer_leakage = structuredClone(view.answer_leakage);
    const optionEvidence = new Map(view.mathematics.option_checks.map(c => [c.option_id, c.evidence]));
    q.mathematics.option_checks = q.mathematics.option_checks.map(c => ({
      ...c,
      evidence: optionEvidence.get(c.option_id),
    }));
  }
  if (q.question_id === 'c6-389') {
    const frozen = frozenVisible.question_reviews.find(f => f.question_id === q.question_id);
    const originalOption = frozen.mathematics.option_checks.find(c => c.option_id === 'a');
    q.mathematics.verdict = 'pass';
    q.mathematics.option_checks = q.mathematics.option_checks.map(c => c.option_id === 'a' ? {
      ...c,
      evidence: `${originalOption.evidence} Revised internal comparison: ${comparison.misconception_comparison.evidence}`,
    } : c);
  }
}

const output = path.join(root, 'revision1/review.json');
fs.writeFileSync(output, `${JSON.stringify(review, null, 2)}\n`, { flag: 'wx' });
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const preservation = {
  source_solution_strings_preserved: review.source_reviews.every((s, i) =>
    s.independent_solution === original.source_reviews[i].independent_solution),
  visible_solution_strings_preserved: review.question_reviews.every(q =>
    q.mathematics.independent_solution === originalQuestions.get(q.question_id).mathematics.independent_solution),
  complete_true_sets_preserved: review.question_reviews.every(q =>
    same(q.mathematics.correct, originalQuestions.get(q.question_id).mathematics.correct)),
  all_option_truth_labels_preserved: review.question_reviews.every(q =>
    same(q.mathematics.option_checks.map(c => [c.option_id, c.truth]),
      originalQuestions.get(q.question_id).mathematics.option_checks.map(c => [c.option_id, c.truth]))),
  unaffected_question_records_copied_unchanged: review.question_reviews.filter(q =>
    !changedIds.has(q.question_id) && same(q, originalQuestions.get(q.question_id))).length,
  source_350_record_unchanged: same(
    review.source_reviews.find(s => s.source_number === '350'),
    original.source_reviews.find(s => s.source_number === '350')),
};
const freezeNames = [
  'source-first.md', 'source-first.json', 'view-first.md', 'view-first.json',
  'affected-view-first.md', 'affected-view-first.json',
];
console.log(JSON.stringify({
  operation: 'Mechanical composition from retained evidence, not validation or repeated semantic review',
  output,
  draft_sha256: review.draft_sha256,
  outcome: review.outcome,
  source_reviews: review.source_reviews.length,
  question_reviews: review.question_reviews.length,
  option_checks: review.question_reviews.reduce((n, q) => n + q.mathematics.option_checks.length, 0),
  source_coverage_pass: review.source_reviews.filter(s => s.coverage.verdict === 'pass').length,
  source_coverage_revise: review.source_reviews.filter(s => s.coverage.verdict === 'revise').map(s => s.source_number),
  fidelity_revise: review.question_reviews.filter(q => q.task_fidelity.verdict === 'revise').map(q => q.question_id),
  leakage_revise: review.question_reviews.filter(q => q.answer_leakage.verdict === 'revise').map(q => q.question_id),
  mathematics_pass: review.question_reviews.filter(q => q.mathematics.verdict === 'pass').length,
  preservation,
  frozen_byte_sha256: Object.fromEntries(freezeNames.map(name => [
    name, sha(fs.readFileSync(path.join(root, 'reviewer', name))),
  ])),
}, null, 2));

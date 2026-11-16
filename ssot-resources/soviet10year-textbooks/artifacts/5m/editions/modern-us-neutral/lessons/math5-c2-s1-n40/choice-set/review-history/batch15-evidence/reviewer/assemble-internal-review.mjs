import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const repo = '/Users/yong/.codex/worktrees/d9b1/lemmadeck';
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-182/tmp');
const own = path.join(tmp, 'reviewer-5m-n40');
const author = path.join(tmp, '5m-n40');
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const sorted = value => value === null || typeof value !== 'object' ? value :
  Array.isArray(value) ? value.map(sorted) :
    Object.fromEntries(Object.keys(value).sort().map(key => [key, sorted(value[key])]));
const canonical = value => JSON.stringify(sorted(value)).replace(
  /[\u007f-\uffff]/g, char => '\\u' + char.charCodeAt(0).toString(16).padStart(4, '0'));
const digest = value => sha(canonical(value));
const inputPaths = {
  seed: path.join(author, 'seed.json'),
  draft: path.join(author, 'draft.json'),
  source: path.join(own, 'source-solutions.json'),
  initial_view_review: path.join(own, 'view-checks.json'),
  final_view_review: path.join(own, 'view-checks-final.json'),
  final_view_snapshot: path.join(own, 'view-reviewed-final-snapshot.json'),
  internal_notes: path.join(own, 'internal-check-notes.json'),
};
const inputBytes = Object.fromEntries(Object.entries(inputPaths).map(
  ([name, file]) => [name, fs.readFileSync(file)]));
const input = Object.fromEntries(Object.entries(inputBytes).map(
  ([name, bytes]) => [name, JSON.parse(bytes)]));
const { seed, draft, source, final_view_review: visible, final_view_snapshot: snapshot,
  internal_notes: notes } = input;
const seedDigest = digest(seed);
const draftDigest = digest(draft);
assert.equal(seedDigest, '548aad7db92181a4586891478d12b30276ede2f315153277e845821e687fb456');
assert.equal(draftDigest, '204e3b6898a8a5927b90d8d307b9df6178323fc8c26aaa97dcd38fb7e26b2447');
assert.equal(digest(snapshot), 'a5c7c78aaf340b0367d104967921cc6f6c61cb61eb1c1e08c23961586c501cb3');
assert.equal(sha(inputBytes.source), 'bb04f7b69f5b6d509c3f236985c1c0fa4fc85df3e5b5f46cb1ba2523d1ee5d62');
assert.equal(sha(inputBytes.initial_view_review), '0961eb9c1c4a9b299bef8b5db79e21015e7e0954e8383c26bece2090e87f8926');
assert.equal(sha(inputBytes.final_view_review), '5022c73586f1538a654e258cb5ea1496dd611b2a35dfd1fc2d686cdf39d0138f');
assert.equal(source.seed_sha256, seedDigest);
assert.equal(draft.seed_sha256, seedDigest);
assert.deepEqual({ questions: draft.questions.map(({ id, source_numbers, view }) =>
  ({ id, source_numbers, view })) }, snapshot);
assert.equal(seed.figures.length, 0);
assert.equal(draft.new_figures.length, 0);
assert.equal(source.figure_checks.length, 0);
assert.equal(draft.questions.length, 28);
assert.equal(draft.coverage.length, 24);
assert.equal(notes.questions.length, 28);

const reviewer = {
  kind: 'independent_agent',
  identity: 'fresh n40 source reviewer, separate from author Chandrasekhar; source and all112initial visible-option truths independently saved before internal exposure; five-question repair fragments disclosed later, before the authorized full internal comparison',
};
const comparisons = [];
const questionReviews = [];
for (let index = 0; index < draft.questions.length; index++) {
  const authored = draft.questions[index];
  const independent = visible.question_reviews[index];
  const manual = notes.questions[index];
  assert.equal(authored.id, independent.question_id);
  assert.equal(manual.id, authored.id);
  assert.deepEqual(authored.source_numbers, independent.source_numbers);
  assert.deepEqual(authored.key.correct, independent.mathematics.correct);
  assert.deepEqual(Object.keys(manual.option_evidence).sort(),
    authored.view.options.map(option => option.id).sort());
  const optionComparisons = authored.view.options.map(option => {
    const saved = independent.mathematics.option_checks.find(item => item.option_id === option.id);
    const rationale = authored.key.rationales.find(item => item.option_id === option.id);
    assert.ok(saved && rationale);
    assert.equal(rationale.truth, saved.truth);
    assert.equal(rationale.misconception === null, saved.truth === 'correct');
    return {
      option_id: option.id,
      candidate_text: option.text,
      candidate_figure_ids: option.figure_ids,
      initial_independent_truth_after_label_rebinding: saved.truth,
      initial_independent_truth_evidence: saved.evidence,
      author_truth: rationale.truth,
      author_derivation: rationale.derivation,
      author_misconception: rationale.misconception,
      key_and_truth_agreement: { verdict: 'pass', evidence: saved.evidence },
      derivation_and_program: {
        verdict: 'pass',
        kind: saved.truth === 'correct' ? 'true-proof-comparison' : 'complete-false-option-generation',
        evidence: manual.option_evidence[option.id],
      },
    };
  });
  assert.equal(optionComparisons.length, 4);
  comparisons.push({
    question_id: authored.id,
    source_numbers: authored.source_numbers,
    author_intent: authored.intent,
    independent_source_numbers: authored.source_numbers,
    source_solution_task_and_limitations: {
      verdict: 'pass',
      evidence: manual.intent_evidence,
      source_review_path: path.relative(repo, inputPaths.source),
      coverage_evidence: authored.source_numbers.map(number => notes.source_coverage_evidence[number]),
    },
    author_correct: authored.key.correct,
    independent_correct: independent.mathematics.correct,
    every_option_comparison: optionComparisons,
  });
  questionReviews.push({
    question_id: authored.id,
    task_fidelity: {
      verdict: independent.task_fidelity.verdict,
      evidence: independent.task_fidelity.evidence + ' Internal task/source/limitation comparison: ' +
        manual.intent_evidence,
    },
    redundancy: independent.redundancy,
    answer_leakage: {
      verdict: independent.answer_leakage.verdict,
      evidence: independent.answer_leakage.evidence +
        ' Final package candidate variation and repaired position relations were saved before full internal disclosure; no author key was used to derive initial truths.',
    },
    mathematics: {
      verdict: 'pass',
      independent_solution: independent.mathematics.independent_solution +
        ' Complete final correct set and all option truths agree with author key; each full proof/wrong program compared below.',
      correct: independent.mathematics.correct,
      option_checks: independent.mathematics.option_checks.map(option => ({
        option_id: option.option_id,
        truth: option.truth,
        evidence: option.evidence + ' Authorized author proof/program comparison: ' +
          manual.option_evidence[option.option_id],
      })),
    },
  });
}
const coverageComparisons = [];
const sourceReviews = seed.exercises.map(exercise => {
  const number = exercise.number;
  const independent = source.source_reviews.find(item => item.source_number === number);
  const authored = draft.coverage.find(item => item.source_number === number);
  const questionIds = draft.questions.filter(question =>
    question.source_numbers.includes(number)).map(question => question.id);
  assert.ok(independent && authored);
  assert.deepEqual(authored.question_ids, questionIds);
  assert.ok(notes.source_coverage_evidence[number]);
  const verdict = number === '721' ? 'blocked' : 'pass';
  const evidence = notes.source_coverage_evidence[number];
  coverageComparisons.push({
    source_number: number,
    original_task: independent.task,
    recorded_original_task_groups: independent.subtasks.length,
    author_coverage: authored,
    actual_question_ids: questionIds,
    verdict,
    evidence,
    independent_conditions: independent.conditions ?? [],
    independent_notices: independent.notices ?? [],
    independent_blockers: independent.mathematical_blockers,
    author_source_solutions_read: [...new Set(draft.questions.filter(question =>
      question.source_numbers.includes(number)).map(question => question.intent.source_solution))],
  });
  return {
    source_number: number,
    independent_solution: independent.independent_solution +
      '\nPreserved source-only task details: ' + JSON.stringify(independent.subtasks) +
      '\nOriginal conditions: ' + (independent.conditions ?? []).join(' ') +
      (independent.notices?.length ? '\nSource-only notices: ' + independent.notices.join(' ') : ''),
    coverage: { verdict, evidence },
  };
});
assert.equal(sourceReviews.length, 24);
assert.equal(sourceReviews.filter(item => item.coverage.verdict === 'blocked').length, 1);
const allOptions = comparisons.flatMap(question => question.every_option_comparison);
assert.equal(allOptions.length, 112);
assert.equal(allOptions.filter(option => option.author_truth === 'correct').length, 28);
assert.equal(allOptions.filter(option => option.author_truth === 'incorrect').length, 84);
assert.equal(coverageComparisons.reduce((total, row) => total + row.recorded_original_task_groups, 0), 103);
const review = {
  schema: 's10y-choice-review-v1',
  seed_sha256: seedDigest,
  draft_sha256: draftDigest,
  reviewer,
  source_reviews: sourceReviews,
  figure_checks: [],
  new_figure_reviews: [],
  question_reviews: questionReviews,
  outcome: 'blocked',
};
const authorComparison = {
  schema: 'independent-author-comparison-v1',
  book: seed.source.book,
  lesson: seed.source.lesson,
  seed_sha256: seedDigest,
  draft_sha256: draftDigest,
  final_view_sha256: digest(snapshot),
  reviewer,
  independence: {
    source_first_completed: true,
    all112_initial_option_truths_saved_before_internal_exposure: true,
    initial_source_and_view_evidence_preserved: true,
    earlier_fragment_exposure: visible.independence.repair_payload_exposure_notice,
    full_author_internal_access: 'Explicitly authorized after final pure-view review was saved.',
    full_draft_read: true,
    all28_intents_read: true,
    all112_full_rationales_read: true,
    all24_source_coverage_rows_read: true,
    other_answers_choices_interactions_reviewers_or_parent_solutions_read: false,
    initial_author_seed_and_final_author_seed_canonical_equal: true,
    own_seed_reprepare_or_source_recomputation: false,
    model_usage: null,
  },
  preserved_input_bindings: Object.fromEntries(Object.entries(inputPaths).map(([name, file]) => [
    name, { path: path.relative(repo, file), byte_sha256: sha(inputBytes[name]) },
  ])),
  counts: {
    sources: 24, original_recorded_task_groups: 103, questions: 28, options: 112,
    correct_proofs_compared: 28, actual_false_programs_compared: 84,
    source_coverage_pass: 23, source_coverage_blocked: 1, questions_mathematics_pass: 28,
    actual_referenced_figures: 0, new_figures: 0,
  },
  author_question_comparisons: comparisons,
  source_coverage_comparisons: coverageComparisons,
  package_checks: {
    task_fidelity: visible.package_checks.task_fidelity,
    redundancy: visible.package_checks.redundancy,
    cross_question_leakage: visible.package_checks.cross_question_leakage,
    target_variation: {
      verdict: 'pass',
      evidence: 'All required result components have competing candidate contents, inherited from original complete checks and exact content-preserving permutations. Final724domain false all-real claim is A,not historical C;737reciprocal alternative Bvaries8/9;734directions and incidence compete. Given target denominators and legal free-Mwitness are not inferred results.',
    },
    position_leakage: visible.package_checks.position_leakage,
    declared_production_losses: {
      verdict: 'pass',
      evidence: 'All28intents and24coverage rows record independent writing/calculation losses.734expressly records actual protractor use, free point selection and compass/straightedge construction of both perpendiculars;732retains complete conversion/calculation chains. These are acknowledged production losses, not fabricated missing source conditions.',
    },
    source_scope: { verdict: 'blocked', source_number: '721', evidence: notes.source_coverage_evidence['721'] },
    full_internal_key_and_generation_comparison: {
      verdict: 'pass',
      evidence: 'All28correct sets and112truth declarations agree with saved independent mathematical results. All84wrong procedures produce their actual false complete options, including partly correct compound records. All28true proofs agree with saved source results.',
    },
  },
  findings: notes.findings,
  additional_author_repair_required: false,
  resolved_prior_position_findings: visible.resolved_prior_findings,
  outcome: 'blocked',
  conclusion: notes.conclusion,
  execution_evidence: {
    canonical_validation_run: false, structural_validation_run: false,
    author_files_modified: false, source_or_durable_files_modified: false,
    browser_started: false, browser_or_sessions_running_after_command: false,
    DB_network_model_service_or_dependency_calls: false,
    writes: 'Only reviewer-5m-n40 scratch manual notes, mechanical assembly script and two review records.',
    next_stage: 'Frozen final review ready for parent-only canonical validation once; no reviewer approval of unresolved original721scope.',
  },
};
const outputs = [
  ['author-comparison.json', authorComparison],
  ['review.json', review],
];
for (const [name, file] of Object.entries(inputPaths)) {
  assert.deepEqual(fs.readFileSync(file), inputBytes[name]);
}
for (const [name] of outputs) assert.equal(fs.existsSync(path.join(own, name)), false);
for (const [name, value] of outputs) {
  fs.writeFileSync(path.join(own, name), JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
}
console.log(JSON.stringify({
  saved: outputs.map(([name]) => {
    const file = path.join(own, name);
    return { path: file, byte_sha256: sha(fs.readFileSync(file)) };
  }),
  seed_sha256: seedDigest, draft_sha256: draftDigest,
  counts: authorComparison.counts,
  outcome: review.outcome, sole_blocker: 'original721sign-unqualified complete divisor-collection scope',
  additional_author_repair_required: false, canonical_validation_run: false,
  structural_validation_run: false, browser_started: false,
}, null, 2));

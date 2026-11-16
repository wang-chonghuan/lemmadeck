import fs from "node:fs";
import crypto from "node:crypto";
import assert from "node:assert/strict";

const base = ".intentfold/tickets/STEMROBIN-182/tmp";
const directory = `${base}/reviewer-5m-n42`;
const paths = {
  seed: `${base}/5m-n42/seed.json`,
  draft: `${base}/5m-n42/draft.json`,
  author_source: `${base}/5m-n42/source-solutions.json`,
  view: `${base}/5m-n42/view.json`,
  own_source: `${directory}/source-solutions.json`,
  own_initial_view: `${directory}/view-checks.json`,
  own_revised_view: `${directory}/view-checks-revised.json`,
  own_truth_delta: `${directory}/truth-delta.json`,
  own_internal_assessments: `${directory}/internal-assessments.json`,
};
const bytes = Object.fromEntries(Object.entries(paths).map(([name, path]) => [name, fs.readFileSync(path)]));
const input = Object.fromEntries(Object.entries(bytes).map(([name, value]) => [name, JSON.parse(value.toString("utf8"))]));
const sha = value => crypto.createHash("sha256").update(value).digest("hex");
const sort = value => Array.isArray(value)
  ? value.map(sort)
  : value && typeof value === "object"
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, sort(value[key])]))
    : value;
const canonical = value => JSON.stringify(sort(value)).replace(
  /[\u007f-\uffff]/g,
  character => `\\u${character.charCodeAt(0).toString(16).padStart(4, "0")}`,
);
const bindings = Object.fromEntries(Object.entries(paths).map(([name, path]) => [name, {
  path,
  file_sha256: sha(bytes[name]),
  canonical_sha256: sha(canonical(input[name])),
}]));
const { seed, draft, author_source: authorSource, own_source: ownSource, own_revised_view: ownView } = input;
const manual = input.own_internal_assessments;
const truthDelta = input.own_truth_delta;
const manualQuestions = new Map(manual.question_assessments.map(question => [question.question_id, question]));
const manualCoverage = new Map(manual.coverage_assessments.map(source => [source.source_number, source]));
const independentSources = new Map(ownSource.source_reviews.map(source => [source.source_number, source]));
const independentQuestions = new Map(ownView.question_reviews.map(question => [question.question_id, question]));
const authorSources = new Map(authorSource.sources.map(source => [source.source_number, source]));
const authorCoverage = new Map(draft.coverage.map(source => [source.source_number, source]));

// Bind the manually completed comparison to the frozen independently reviewed view.
assert.equal(bindings.seed.canonical_sha256, "a4ea637912f8944e8e8450444f4d2afd1f29308b02a5d018853d8b62057c8d35");
assert.equal(bindings.draft.canonical_sha256, "2930945efdb0ec65e291452a6c38c2ebab840b4a2e9b45bd91500a6c761ebdae");
assert.equal(bindings.view.canonical_sha256, ownView.bindings.view_sha256);
assert.equal(bindings.view.file_sha256, ownView.bindings.view_file_sha256);
assert.equal(bindings.own_source.file_sha256, "36872c7604c37c8c9b79dd5d8c9d1df47a552f1e51a27a3651ef787fd81b5ff0");
assert.equal(bindings.own_initial_view.file_sha256, "e06ab49c1929f255c4259fc7084f9fa0b427dc0b90ea2c632018783e1faf7dd5");
assert.equal(bindings.own_revised_view.file_sha256, "e1d6ba2f1dab062fecfd7770468436babfeb70dcec429f5aae29cb75835cc631");
assert.equal(
  canonical({ questions: draft.questions.map(question => ({
    id: question.id, source_numbers: question.source_numbers, view: question.view,
  })) }),
  canonical(input.view),
);

const exposure = {
  ...structuredClone(ownView.independence_disclosure),
  author_program_comparison_gate: "All22 full intents,68 rationales and20 source-coverage rows now read and manually compared after explicit user authorization; no complete internal material was read during the original source/initial pure-view stages.",
  full_internal_disclosure_inputs: [paths.draft, paths.author_source, paths.seed],
  frozen_source_and_initial_truth_records_unchanged: true,
};
const reviewer = {
  kind: "independent_agent",
  identity: "STEMROBIN-182 separate independent n42 reviewer, not author. Own source and all68 initial truths frozen before any rationale exposure. Authorized repair delta accidentally exposed8 rationale fragments before changed8 rechecks; full internals disclosed only after revised-view freeze. Detailed chronology: reviewer-5m-n42/author-comparison.json.",
};

const questionComparisons = draft.questions.map(question => {
  const independent = independentQuestions.get(question.id);
  const assessment = manualQuestions.get(question.id);
  assert.deepEqual(question.key.correct, independent.mathematics.correct);
  const optionComparisons = question.key.rationales.map(rationale => {
    const independentCheck = independent.mathematics.option_checks.find(check => check.option_id === rationale.option_id);
    const internalCheck = assessment.option_assessments.find(check => check.option_id === rationale.option_id);
    assert.equal(rationale.truth, independentCheck.truth);
    assert.equal(internalCheck.verdict, "pass");
    return {
      option_id: rationale.option_id,
      actual_visible_text: question.view.options.find(option => option.id === rationale.option_id).text,
      independently_frozen_truth: independentCheck.truth,
      independent_visible_evidence: independentCheck.evidence,
      author_truth: rationale.truth,
      author_derivation: rationale.derivation,
      author_misconception: rationale.misconception,
      author_proof_or_actual_wrong_program_check: structuredClone(internalCheck),
    };
  });
  return {
    question_id: question.id,
    source_numbers: question.source_numbers,
    source_and_visible_solution_comparison: { verdict: "pass", evidence: assessment.source_solution_comparison },
    unit_and_each_local_production_limitation: {
      verdict: "pass",
      author_task: question.intent.task,
      author_unit_reason: question.intent.unit_reason,
      author_limitations: question.intent.limitations,
      evidence: assessment.unit_and_local_production,
    },
    author_source_solution: question.intent.source_solution,
    author_concept_blocks: question.intent.concept_blocks,
    author_figure_observations: question.intent.figure_observations,
    independent_correct_set: independent.mathematics.correct,
    author_correct_set: question.key.correct,
    complete_key_comparison: "pass",
    retained_fidelity: independent.task_fidelity,
    retained_redundancy: independent.redundancy,
    retained_answer_leakage: independent.answer_leakage,
    option_comparisons: optionComparisons,
  };
});
const sourceComparisons = seed.exercises.map(exercise => {
  const own = independentSources.get(exercise.number);
  const coverage = manualCoverage.get(exercise.number);
  return {
    source_number: exercise.number,
    independently_frozen_solution: own.independent_solution,
    independently_frozen_status_label: own.status,
    author_source_record: authorSources.get(exercise.number),
    author_coverage: authorCoverage.get(exercise.number),
    independent_coverage_assessment: { verdict: coverage.verdict, evidence: coverage.evidence },
    source_record_difference: manual.source_record_differences.find(
      difference => difference.source_number === exercise.number,
    ) ?? null,
  };
});

const residualFindings = truthDelta.residual_midpoint_vectors.map(record => ({
  id: `n42-residual-leakage-${record.question_id}`,
  verdict: "revise",
  question_id: record.question_id,
  source_numbers: record.source_numbers,
  evidence: independentQuestions.get(record.question_id).answer_leakage.evidence,
  actual_visible_median_vectors: record.columns,
  remaining_fields: record.other_fields,
  disposition: "Targeted option repair exhausted. Retain current rejected snapshot; no further author option edits requested or approval.",
}));
const findings = [
  ...residualFindings,
  {
    id: "n42-original-772-singular-speed-reference",
    verdict: "blocked",
    source_number: "772",
    question_id: "river-distance-and-all-speed-frames",
    evidence: manualCoverage.get("772").evidence,
    author_classification_difference: "Author source_blockers=[] and coverage.omitted_tasks=[] are not adopted as resolving the original singular speed referent. The explicit fixed model remains mathematically pass.",
    disposition: "Retain the original reference gap; no invented algebraic/model underdetermination and no source/author edit.",
  },
];

const counts = {
  original_sources: seed.exercises.length,
  questions: draft.questions.length,
  options: draft.questions.reduce((count, question) => count + question.view.options.length, 0),
  intents_read_and_compared: questionComparisons.length,
  full_rationales_read_and_compared: questionComparisons.reduce((count, question) => count + question.option_comparisons.length, 0),
  correct_option_proofs_compared: questionComparisons.flatMap(question => question.option_comparisons).filter(option => option.author_truth === "correct").length,
  false_option_programs_compared: questionComparisons.flatMap(question => question.option_comparisons).filter(option => option.author_truth === "incorrect").length,
  coverage_rows_read_and_compared: sourceComparisons.length,
  local_limitations_rows_checked: questionComparisons.length,
  nonempty_local_limitations_rows: questionComparisons.filter(question => question.unit_and_each_local_production_limitation.author_limitations.length > 0).length,
  empty_local_limitations_rows: questionComparisons.filter(question => question.unit_and_each_local_production_limitation.author_limitations.length === 0).length,
  mathematics_pass_questions: ownView.question_reviews.filter(question => question.mathematics.verdict === "pass").length,
  residual_answer_leakage_revise_questions: residualFindings.length,
  original_source_coverage_blocked: sourceComparisons.filter(source => source.independent_coverage_assessment.verdict === "blocked").length,
  observed_seed_figures_reused: seed.figures.length,
  new_figures: draft.new_figures.length,
};
const comparison = {
  schema: "independent-author-comparison-v1",
  reviewer,
  stage: "Own source -> own initial/revised pure views -> authorized complete current internals. Rejected/blocked disposition, no approval.",
  bindings,
  counts,
  independence_disclosure: exposure,
  access: {
    original_source_and_initial_truths_precede_all_author_rationale_exposure: true,
    changed8_truth_rechecks_followed_accidental8_fragment_exposure: true,
    full_author_internals_opened_after_revised_view_freeze_and_user_authorization: true,
    parent_math_notes_or_other_answers_history_read: false,
    canonical_or_structural_command_run: false,
    browser_launched: false,
    asset_rerender_or_observation_rerun: false,
    durable_or_author_writes: false,
    db_network_model_services_or_dependency_changes: false,
    model_usage: null,
  },
  selected_concept_comparison: {
    block: 7,
    verdict: "pass",
    evidence: "Author seed and own source binding are identical. Selected uniqueness definition is not a solved numbered exercise. It supplies no extra a-domain or boat-speed referent. Full observed factor tree210=21*10=3*7*2*5 agrees with author source observations; no new pixel observation is claimed.",
  },
  actual_figure_observations_reused: ownSource.figure_checks,
  package_checks_inherited_from_revised_visible_stage: ownView.package_checks,
  source_comparisons: sourceComparisons,
  question_comparisons: questionComparisons,
  findings,
  new_internal_math_or_wrong_program_defects: [],
  disposition: manual.disposition,
  outcome: "blocked",
  stop: "Final review saved only in reviewer scratch. No canonical/structural command, no durable retention/promotion or approval. No further author repair authorized or requested.",
};

const review = {
  schema: "s10y-choice-review-v1",
  seed_sha256: bindings.seed.canonical_sha256,
  draft_sha256: bindings.draft.canonical_sha256,
  reviewer,
  source_reviews: seed.exercises.map(exercise => {
    const independent = independentSources.get(exercise.number);
    const coverage = manualCoverage.get(exercise.number);
    return {
      source_number: exercise.number,
      independent_solution: independent.independent_solution + (
        exercise.number === "761"
          ? " Review clarification already frozen at initial pure-view stage before full internals: for any allowed domainD the complete sets areD intersect P/23 andD intersect C/23. These complete parametric criteria solve the available task; the earlier broad status label is preserved in source-solutions.json but is not carried forward as an invented missing-math blocker."
          : exercise.number === "772"
            ? " Original singular requested speed reference remains unresolved; the numerical model has a unique complete speed triple. Do not introduce arbitrary-changing-own-speed parameters as alleged original missing data."
            : ""
      ),
      coverage: { verdict: coverage.verdict, evidence: coverage.evidence },
    };
  }),
  figure_checks: seed.figures.map(figure => {
    const observed = ownSource.figure_checks.find(check => check.figure_id === figure.id);
    const original = ownSource.figure_checks.find(check => check.figure_id === `${figure.id}-original`);
    return {
      figure_id: figure.id,
      asset_path: observed.asset_path,
      asset_sha256: observed.asset_sha256,
      observation: `${observed.observation} Observations inherited from independently frozen source-only record. Opened render:${observed.opened_render_path}, SHA256:${observed.opened_render_sha256}. Origin:${observed.render_origin} Original:${original.asset_path}, SHA256:${original.asset_sha256}; ${original.observation} No fresh browser/render/image check during final comparison.`,
    };
  }),
  new_figure_reviews: [],
  question_reviews: draft.questions.map(question => {
    const independent = independentQuestions.get(question.id);
    const assessment = manualQuestions.get(question.id);
    return {
      question_id: question.id,
      task_fidelity: {
        verdict: independent.task_fidelity.verdict,
        evidence: `${independent.task_fidelity.evidence} Local production-loss/unit comparison:${assessment.unit_and_local_production}`,
      },
      redundancy: structuredClone(independent.redundancy),
      answer_leakage: structuredClone(independent.answer_leakage),
      mathematics: {
        verdict: independent.mathematics.verdict,
        independent_solution: independent.mathematics.independent_solution,
        correct: [...independent.mathematics.correct],
        option_checks: independent.mathematics.option_checks.map(check => ({
          option_id: check.option_id,
          truth: check.truth,
          evidence: `${check.evidence} Authorized author proof/program comparison:${assessment.option_assessments.find(option => option.option_id === check.option_id).evidence}`,
        })),
      },
    };
  }),
  outcome: "blocked",
};

const output = {
  [`${directory}/seed-reviewed-snapshot.json`]: bytes.seed,
  [`${directory}/draft-reviewed-snapshot.json`]: bytes.draft,
  [`${directory}/author-source-reviewed-snapshot.json`]: bytes.author_source,
  [`${directory}/author-comparison.json`]: `${JSON.stringify(comparison, null, 2)}\n`,
  [`${directory}/findings.json`]: `${JSON.stringify({
    schema: "independent-n42-final-findings-v1",
    seed_sha256: review.seed_sha256,
    draft_sha256: review.draft_sha256,
    reviewer,
    independence_disclosure: exposure,
    counts,
    findings,
    outcome: review.outcome,
    disposition: manual.disposition,
  }, null, 2)}\n`,
  [`${directory}/review.json`]: `${JSON.stringify(review, null, 2)}\n`,
};
for (const filename of Object.keys(output)) {
  assert.equal(fs.existsSync(filename), false, `Preserve existing review/history: ${filename}`);
}
for (const [name, filename] of Object.entries(paths)) {
  assert.equal(sha(fs.readFileSync(filename)), bindings[name].file_sha256, `Input changed during review: ${filename}`);
}
for (const [filename, content] of Object.entries(output)) {
  fs.writeFileSync(filename, content, { flag: "wx" });
}
console.log(JSON.stringify({
  saved: Object.keys(output),
  seed_sha256: review.seed_sha256,
  draft_sha256: review.draft_sha256,
  counts,
  outcome: review.outcome,
  retained_leakage_verdicts: review.question_reviews.filter(question => question.answer_leakage.verdict === "revise").map(question => question.question_id),
  retained_source_blockers: review.source_reviews.filter(source => source.coverage.verdict === "blocked").map(source => source.source_number),
  canonical_or_structural_command_run: false,
  browser_launched: false,
  original_evidence_and_author_files_unchanged: true,
}, null, 2));

import fs from "node:fs";
import crypto from "node:crypto";
import assert from "node:assert/strict";

const directory = ".intentfold/tickets/STEMROBIN-182/tmp/reviewer-5m-n42";
const readBytes = filename => fs.readFileSync(filename);
const readJson = filename => JSON.parse(readBytes(filename).toString("utf8"));
const sha = value => crypto.createHash("sha256").update(value).digest("hex");
const priorPath = `${directory}/view-checks.json`;
const truthPath = `${directory}/truth-delta.json`;
const bytePath = `${directory}/revised-view-byte-delta.json`;
const snapshotPath = `${directory}/revised-view-snapshot.json`;
const outputPath = `${directory}/view-checks-revised.json`;
const prior = readJson(priorPath);
const truthDelta = readJson(truthPath);
const byteDelta = readJson(bytePath);
const revisedView = readJson(snapshotPath);
const oldView = readJson(byteDelta.inputs.old_view.path);
const changedChecks = new Map(truthDelta.changed_option_checks.map(check => [check.question_id, check]));
const expectedLeaves = [
  "/questions/0/view/options/1/text",
  "/questions/1/view/options/2/text",
  "/questions/4/view/options/2/text",
  "/questions/5/view/options/1/text",
  "/questions/15/view/options/0/text",
  "/questions/16/view/options/1/text",
  "/questions/17/view/options/2/text",
  "/questions/18/view/options/2/text",
];
assert.deepEqual(byteDelta.leaf_deltas.map(delta => delta.path), expectedLeaves);
assert.equal(byteDelta.unchanged_question_count, 14);
assert.equal(byteDelta.changed_question_count, 8);
assert.equal(byteDelta.all_non_text_metadata_unchanged, true);
assert.equal(sha(readBytes(priorPath)), byteDelta.inputs.own_prior_view_checks.file_sha256);
assert.equal(
  sha(readBytes(byteDelta.inputs.own_source_solutions.path)),
  byteDelta.inputs.own_source_solutions.file_sha256,
);
assert.equal(sha(readBytes(snapshotPath)), byteDelta.inputs.revised_view.file_sha256);
assert.equal(
  sha(readBytes(byteDelta.inputs.revised_view.path)),
  byteDelta.inputs.revised_view.file_sha256,
);

const revised = structuredClone(prior);
revised.stage = "Revised pure-view review; original source and all68 initial truths frozen before author rationale exposure. Eight authorized delta fragments were accidentally exposed before this changed-eight recheck; full author draft remains unread.";
revised.bindings = {
  ...prior.bindings,
  view_sha256: byteDelta.inputs.revised_view.canonical_sha256,
  view_file_sha256: byteDelta.inputs.revised_view.file_sha256,
  revised_view_snapshot_path: snapshotPath,
  prior_author_view_path: byteDelta.inputs.old_view.path,
  prior_author_view_sha256: byteDelta.inputs.old_view.canonical_sha256,
  prior_author_view_file_sha256: byteDelta.inputs.old_view.file_sha256,
  prior_view_checks_path: priorPath,
  prior_view_checks_file_sha256: byteDelta.inputs.own_prior_view_checks.file_sha256,
  truth_delta_path: truthPath,
  truth_delta_file_sha256: sha(readBytes(truthPath)),
  revised_view_byte_delta_path: bytePath,
  revised_view_byte_delta_file_sha256: sha(readBytes(bytePath)),
};
revised.independence_disclosure = structuredClone(truthDelta.independence_disclosure);
revised.access = {
  ...prior.access,
  n42_mathematical_inputs_read: [
    ...prior.access.n42_mathematical_inputs_read,
    "revised view.json",
    "explicitly authorized midpoint-repair-delta.json, which unexpectedly contains8 author rationale fragments",
    "own frozen source-solutions.json/view-checks.json and own revised truth/byte-delta records",
  ],
  author_internal_files_read: ["midpoint-repair-delta.json: unexpected draft_deltas rationale fragments only"],
  full_author_draft_opened: false,
  author_source_solutions_or_source_math_opened: false,
  author_ready_or_validation_opened: false,
  complete_author_program_comparison_performed: false,
  canonical_or_structural_command_run: false,
  reviewer_scratch_byte_comparison_and_record_assembly_run: true,
  new_browser_or_asset_observation_performed: false,
};

const targetVariation = {
  "seven-prime-power-decompositions": "Each complete decomposition still has differing candidate results; all seven newB products differ from their source. No full target is identical across all alternatives.",
  "seven-mixed-prime-decompositions": "The180 component now coincides inA/C, butB gives90. Every other complete decomposition also varies; no whole original target is fixed across all candidates.",
  "prime-decomposition-and-common-factor-record": "All eight complete coefficient factorizations coincide inA/C but differ inB. All four extracted identities vary; shared first bracket coefficients are not independent source targets. The repeated complementary-field median is separately recorded as leakage.",
  "four-factor-and-reduce-records": "Each numerator/denominator factorization still has at least two different candidates, and each reduction has different results. NewB reciprocal RHS values do not remove the unchanged decisive left-factorization median.",
  "five-large-prime-factorizations": "The1500 component now coincides inA/B, butC gives3000. Every other full decomposition varies; the complete exponent-vector median, not a fixed target, is the leakage finding.",
  "four-mixed-large-prime-factorizations": "Each complete decomposition varies. Two false records remove different prime occurrences; their complementary fields still leakC through a complete exponent-vector median.",
  "four-reduced-fractions": "All four reduced values vary across the alternatives; the new reciprocal list does not fix any original target in every candidate.",
  "river-distance-and-all-speed-frames": "Distance and all three explicitly labeled speeds differ in every alternative. All quantities are visible, and the source-reference notice is not replaced by a made-up missing parameter.",
};

const optionReuse = [];
for (let index = 0; index < revised.question_reviews.length; index += 1) {
  const question = revised.question_reviews[index];
  const visible = revisedView.questions[index];
  const oldVisible = oldView.questions[index];
  assert.equal(question.question_id, visible.id);
  assert.deepEqual(question.source_numbers, visible.source_numbers);
  const changed = changedChecks.get(question.question_id);
  if (changed) {
    const optionCheck = question.mathematics.option_checks.find(check => check.option_id === changed.option_id);
    assert.equal(optionCheck.truth, changed.before_truth);
    optionCheck.truth = changed.after_truth;
    optionCheck.evidence = changed.evidence;
    question.answer_leakage = structuredClone(changed.answer_leakage);
    question.target_variation = targetVariation[question.question_id];
    question.revision_evidence = {
      changed_option_id: changed.option_id,
      correct_set_unchanged: true,
      source_solution_fidelity_and_redundancy_inherited: true,
      current_truth_check_basis: "Frozen independent source math and current visible expression; not blinded to the accidentally exposed authorized-delta fragments.",
      truth_delta_path: truthPath,
      byte_delta_path: bytePath,
    };
  }
  assert.deepEqual(question.mathematics.correct, prior.question_reviews[index].mathematics.correct);
  for (const check of question.mathematics.option_checks) {
    const oldOption = oldVisible.view.options.find(option => option.id === check.option_id);
    const newOption = visible.view.options.find(option => option.id === check.option_id);
    const inherited = !changed || check.option_id !== changed.option_id;
    if (inherited) {
      assert.deepEqual(newOption, oldOption);
      const original = prior.question_reviews[index].mathematics.option_checks.find(
        optionCheck => optionCheck.option_id === check.option_id,
      );
      assert.deepEqual(check, original);
    } else {
      assert.notEqual(newOption.text, oldOption.text);
    }
    optionReuse.push({
      question_id: question.question_id,
      option_id: check.option_id,
      old_option_text_sha256: sha(oldOption.text),
      revised_option_text_sha256: sha(newOption.text),
      evidence_status: inherited ? "unchanged expression and exact prior proof inherited" : "changed expression checked against own frozen source math",
      truth_before: prior.question_reviews[index].mathematics.option_checks.find(
        optionCheck => optionCheck.option_id === check.option_id,
      ).truth,
      truth_after: check.truth,
    });
  }
  if (!changed) assert.deepEqual(question, prior.question_reviews[index]);
}

revised.counts = {
  ...prior.counts,
  answer_leakage_revise_questions: 4,
  changed_questions: 8,
  physical_byte_identical_questions: 14,
  fresh_changed_option_checks: 8,
  inherited_unchanged_option_checks: 60,
  changed_true_sets: 0,
  changed_option_truth_labels: 0,
  original_convention_gaps_resolved_by_revision: 0,
};
revised.package_checks.candidate_midpoint_leakage = {
  verdict: "revise",
  evidence: truthDelta.package_recheck.evidence,
  residual_question_ids: truthDelta.package_recheck.residual_question_ids,
  prior_shortcut_broken_question_ids: truthDelta.package_recheck.prior_shortcut_broken_question_ids,
  visible_vector_evidence_path: truthPath,
};
revised.package_checks.independent_target_variation = {
  verdict: "pass",
  evidence: "All unchanged target-variation evidence is inherited. In756 part2,180 is equal inA/C but differs inB; in770 part1,1500 is equal inA/B but differs inC. In759,A/C share complete coefficient decompositions butB changes every one; each extracted expression still differs.760 retains variation in all numerator/denominator factorizations and reductions. No original independent complete target becomes correctly fixed in every option. This necessary check does not remove the four residual median shortcuts.",
};
revised.package_checks.changed_units_and_dependencies = {
  verdict: "revise",
  evidence: "Exact comparison finds only8 option-text leaves. All22 stems, native modes, option IDs/order, source-number mappings and figure references remain unchanged;14 whole question objects are physically byte-identical. Reuse original fidelity, full20-source visible coverage, redundancy, label-position sequence and construction losses. Shared3240 in760/770 remains the source repetition already documented; it supplies no newly added stem answer. Candidate-level correct coincidences are not whole-record truths. Four residual middle relationships still defeat the package gate.",
};
revised.findings = [{
  id: "n42-residual-componentwise-middle-shortcut",
  verdict: "revise",
  affected_question_ids: [...truthDelta.package_recheck.residual_question_ids],
  evidence: "The candidate-only median still selectsA for759, C for760, B for770 part1 andC for770 part2.759 uses complementary outside-factor/second-bracket errors;760's unchanged left numerator/denominator factorization vectors retain the entire median even though RHS values changed.770's altered prime bases or omitted terminal prime leave complementary exponent-vector errors. Full explicit per-row median tables are preserved in truth-delta.json.",
  minimal_repair: truthDelta.package_recheck.minimal_repair,
  not_a_claim: "A median is not inferred as valid mathematics from the source. The defect is the repeatable candidate-content relationship that permits correct answering without the original factorization/extraction/reduction.",
  evidence_path: truthPath,
}];
revised.evidence_reuse = {
  original_records_retained_byte_unchanged: true,
  original_source_file_sha256: byteDelta.inputs.own_source_solutions.file_sha256,
  original_view_review_file_sha256: byteDelta.inputs.own_prior_view_checks.file_sha256,
  physical_question_byte_checks: byteDelta.physical_question_byte_checks,
  option_check_reuse: optionReuse,
  complete_correct_sets: revised.question_reviews.map(question => ({
    question_id: question.question_id,
    correct: question.mathematics.correct,
  })),
  original_figure_observations: "Frozen source-solutions.json actual original/full modern fig138 observations reused; no images/browser opened anew.",
  single_position_sequence_unchanged: "CABCACBABCACABCBABC",
  mathematical_recalculation_of_unchanged_options: false,
};
revised.pure_view_outcome = "revise";
revised.next_stage = "Freeze this revised pure-view record. Four residual visible candidate-content relationships need narrow repair. Stop before full draft, author source-solutions/source-math, ready, validation or complete internal comparison. No canonical or structural command run; no 8a assignment assumed.";

assert.equal(revised.question_reviews.length, 22);
assert.equal(optionReuse.length, 68);
assert.equal(optionReuse.filter(check => check.evidence_status.startsWith("unchanged")).length, 60);
assert.equal(revised.question_reviews.filter(question => question.answer_leakage.verdict === "revise").length, 4);
assert.equal(revised.question_reviews.every(question => question.mathematics.verdict === "pass"), true);
assert.equal(optionReuse.every(check => check.truth_before === check.truth_after), true);
assert.equal(fs.existsSync(outputPath), false, "Preserve any previously saved revised review.");
fs.writeFileSync(outputPath, `${JSON.stringify(revised, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({
  saved: outputPath,
  file_sha256: sha(readBytes(outputPath)),
  canonical_or_structural_command_run: false,
  counts: revised.counts,
  pure_view_outcome: revised.pure_view_outcome,
  residual_question_ids: revised.findings[0].affected_question_ids,
  full_author_draft_opened: false,
  accidental_fragment_exposure_recorded: true,
}, null, 2));

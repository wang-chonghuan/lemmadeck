import fs from "node:fs";
import crypto from "node:crypto";
import assert from "node:assert/strict";

const directory = ".intentfold/tickets/STEMROBIN-182/tmp/reviewer-5m-n42";
const authorDirectory = ".intentfold/tickets/STEMROBIN-182/tmp/5m-n42";
const history = `${directory}/history/unused-concept-figure-contract-before`;
const beforePath = `${history}/review.json`;
const afterPath = `${directory}/review.json`;
const failurePath = `${history}/canonical-validation.json`;
const seedPath = `${authorDirectory}/seed.json`;
const draftPath = `${authorDirectory}/draft.json`;
const outputPath = `${directory}/figure-checks-serialization-delta.json`;
const readBytes = path => fs.readFileSync(path);
const read = path => JSON.parse(readBytes(path).toString("utf8"));
const sha = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const beforeBytes = readBytes(beforePath);
const afterBytes = readBytes(afterPath);
const before = JSON.parse(beforeBytes.toString("utf8"));
const after = JSON.parse(afterBytes.toString("utf8"));
const seed = read(seedPath);
const draft = read(draftPath);
const exercises = new Map(seed.exercises.map(exercise => [exercise.number, exercise]));
const questionReferences = draft.questions.map(question => ({
  question_id: question.id,
  stem_figure_ids: question.view.figure_ids,
  option_figure_ids: question.view.options.flatMap(option => option.figure_ids),
  source_exercise_figure_ids: question.source_numbers.flatMap(number => exercises.get(number).figure_ids),
}));
const used = [...new Set(questionReferences.flatMap(question => [
  ...question.stem_figure_ids, ...question.option_figure_ids, ...question.source_exercise_figure_ids,
]))].sort();
const nonFigureFields = value => Object.fromEntries(
  Object.entries(value).filter(([key]) => key !== "figure_checks"),
);
assert.deepEqual(used, []);
assert.deepEqual(before.figure_checks.map(check => check.figure_id), ["fig-138"]);
assert.deepEqual(after.figure_checks, []);
assert.deepEqual(nonFigureFields(before), nonFigureFields(after));

// The one property replacement must leave every other physical byte unchanged.
const beforeText = beforeBytes.toString("utf8");
const propertyStart = beforeText.indexOf('  "figure_checks": [');
const nextProperty = beforeText.indexOf('  "new_figure_reviews":', propertyStart);
assert.ok(propertyStart >= 0 && nextProperty > propertyStart);
const expectedAfter = beforeText.slice(0, propertyStart)
  + '  "figure_checks": [],\n'
  + beforeText.slice(nextProperty);
assert.equal(afterBytes.toString("utf8"), expectedAfter);
assert.equal(sha(beforeBytes), "1f14055c97d2e54d63b0ed4f093e441fc9b705e22a1f6f7ec80e8b8c521bac11");
assert.ok(readBytes(`${authorDirectory}/canonical-validation.json`).equals(readBytes(failurePath)));
assert.ok(readBytes(seedPath).equals(readBytes(`${directory}/seed-reviewed-snapshot.json`)));
assert.ok(readBytes(draftPath).equals(readBytes(`${directory}/draft-reviewed-snapshot.json`)));

const retainedEvidence = [
  `${directory}/source-solutions.json`,
  `${directory}/view-checks.json`,
  `${directory}/view-checks-revised.json`,
  `${directory}/author-comparison.json`,
  `${directory}/findings.json`,
].map(path => ({ path, file_sha256: sha(readBytes(path)) }));
const evidence = {
  schema: "n42-figure-checks-serialization-repair-v1",
  scope: "Serialization only; no new mathematics, image observation, structural/canonical invocation or author changes.",
  diagnosis: {
    contract: ".agents/skills/ld-s10y-choice/references/contract.md:103: exactly one figure check per used figure",
    implemented_used_set: ".agents/skills/ld-s10y-choice/scripts/validate.py:82-84 and199-201",
    formula: "Union over questions of view.figure_ids, option.figure_ids, and figure_ids of their cited source exercises. seed.source.concept_figure_ids is not an additional member.",
    seed_concept_figure_ids: seed.source.concept_figure_ids,
    seed_asset_ids: seed.figures.map(figure => figure.id),
    source_exercise_references: seed.exercises.map(exercise => ({
      source_number: exercise.number, figure_ids: exercise.figure_ids,
    })),
    question_references: questionReferences,
    actual_used_set: used,
    extra_before: ["fig-138"],
    missing_before: [],
    cause: "Reviewer serialized the independently observed concept-only fig138 as a question-used figure, although no question or cited source exercise uses it. The original observation remains genuine and retained outside this exact-set field.",
  },
  archived_before: {
    review: { path: beforePath, file_sha256: sha(beforeBytes) },
    canonical_failure: { path: failurePath, file_sha256: sha(readBytes(failurePath)), recorded_exit: read(failurePath).exit_code },
    failure_archive_is_byte_identical_to_parent_record: true,
  },
  field_deltas: [{ path: "/figure_checks", before: before.figure_checks, after: after.figure_checks }],
  after: {
    path: afterPath,
    file_sha256: sha(afterBytes),
    seed_sha256: after.seed_sha256,
    draft_sha256: after.draft_sha256,
    outcome: after.outcome,
  },
  exact_delta_assertions: {
    only_figure_checks_field_changed: true,
    every_other_physical_byte_unchanged: true,
    seed_and_draft_byte_identical_to_reviewed_snapshots: true,
    all_source_coverage_question_math_and_verdict_records_unchanged: true,
    residual_leakage_revise: after.question_reviews.filter(question => question.answer_leakage.verdict === "revise").map(question => question.question_id),
    original_source_blocked: after.source_reviews.filter(source => source.coverage.verdict === "blocked").map(source => source.source_number),
    source_count: after.source_reviews.length,
    question_count: after.question_reviews.length,
    option_checks: after.question_reviews.reduce((count, question) => count + question.mathematics.option_checks.length, 0),
  },
  preserved_image_and_semantic_evidence: retainedEvidence,
  observation_retention: "Original full fig138 PNG and modern full pixel-render observations, paths/hashes remain in source-solutions.json and author-comparison.json. Removed complete canonical-field record is also retained verbatim in the history review and this field delta.",
  canonical_or_structural_command_run: false,
  browser_or_fresh_review_performed: false,
  durable_author_or_tool_edits: false,
  disposition: "Corrected contract serialization only. Parent may run the corrected final review once; no reviewer validation execution or approval claim.",
};
assert.equal(fs.existsSync(outputPath), false, "Preserve prior serialization repair evidence.");
fs.writeFileSync(outputPath, `${JSON.stringify(evidence, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({
  delta_path: outputPath,
  new_review: evidence.after,
  used_set: used,
  field_delta: "/figure_checks: one fig-138 record -> []",
  every_other_physical_byte_unchanged: true,
  archived_failure_exit: evidence.archived_before.canonical_failure.recorded_exit,
  no_canonical_or_structural_execution: true,
}, null, 2));

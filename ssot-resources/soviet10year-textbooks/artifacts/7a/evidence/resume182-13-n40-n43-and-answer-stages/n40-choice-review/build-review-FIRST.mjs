import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const directory = path.dirname(fileURLToPath(import.meta.url));
const authorDirectory = path.join(directory, "../n40-choice-author");
const expectedDraftDigest =
  "c4272440edc36ddf65a7a35cbff5b365f0ab35cfbcc2ee111ea358e748f5fa90";
const affectedIds = [
  "n40-lookup-method-comparison",
  "n40-table-ready-plan",
  "n40-radius-and-area",
];

const sort = (value) => {
  if (Array.isArray(value)) return value.map(sort);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value).sort().map((key) => [key, sort(value[key])]),
    );
  }
  return value;
};
const ascii = (text) =>
  text.replace(/[\u007f-\uffff]/g, (char) =>
    "\\u" + char.charCodeAt(0).toString(16).padStart(4, "0"),
  );
const canonical = (value) => ascii(JSON.stringify(sort(value)));
const digest = (value) =>
  crypto.createHash("sha256").update(value).digest("hex");
const load = (file) => {
  const bytes = fs.readFileSync(file);
  return { bytes, value: JSON.parse(bytes) };
};
const local = (name) => load(path.join(directory, name));

const stage1Receipt = local("freeze-receipt.json");
const stage2Receipt = local("stage2-freeze-receipt.json");
const sources = local("source-solutions.json");
const gate = local("view-review.json");
const truth = local("every-option-true-sets.json");
const comparisons = local("key-comparison-FIRST.json");
const draft = load(path.join(authorDirectory, "draft.json"));
const seed = load(path.join(authorDirectory, "seed.json"));

assert.equal(digest(canonical(draft.value)), expectedDraftDigest);
assert.equal(comparisons.value.draft_sha256, expectedDraftDigest);
assert.equal(digest(draft.bytes), comparisons.value.draft_file_sha256);
assert.equal(
  stage2Receipt.value.allowed_new_content_input.declared_draft_sha256,
  expectedDraftDigest,
);
assert.equal(
  digest(sources.bytes),
  stage1Receipt.value.frozen_source_solutions.file_sha256,
);
assert.equal(
  digest(canonical(sources.value)),
  stage1Receipt.value.frozen_source_solutions.canonical_sha256,
);
assert.equal(
  digest(stage1Receipt.bytes),
  stage2Receipt.value.frozen_stage1_basis.stage1_receipt_file_sha256,
);
for (const artifact of stage2Receipt.value.frozen_artifacts) {
  const snapshot = local(artifact.path);
  assert.equal(digest(snapshot.bytes), artifact.file_sha256);
  assert.equal(digest(canonical(snapshot.value)), artifact.canonical_sha256);
}
assert.equal(
  digest(canonical(seed.value)),
  stage1Receipt.value.allowed_content_input.canonical_sha256,
);
assert.equal(
  digest(seed.bytes),
  stage1Receipt.value.allowed_content_input.file_sha256,
);
assert.equal(
  digest(truth.bytes),
  comparisons.value.frozen_true_sets_file_sha256,
);
assert.equal(draft.value.seed_sha256, sources.value.seed_sha256);
assert.equal(draft.value.new_figures.length, 0);
assert.equal(seed.value.figures.length, 0);
assert.equal(gate.value.outcome, "blocked");

const draftQuestions = draft.value.questions;
const expectedIds = draftQuestions.map((question) => question.id);
for (const rows of [
  gate.value.question_reviews,
  truth.value.question_reviews,
  comparisons.value.question_comparisons,
]) {
  assert.deepEqual(rows.map((row) => row.question_id), expectedIds);
}
assert.equal(new Set(expectedIds).size, 20);
assert.equal(
  draftQuestions.reduce((total, q) => total + q.view.options.length, 0),
  87,
);

const coverage = new Map(
  gate.value.source_coverage_inferred.map((row) => [row.source_number, row]),
);
const authorCoverage = new Map(
  draft.value.coverage.map((row) => [row.source_number, row]),
);
assert.equal(authorCoverage.size, 14);
for (const source of sources.value.source_reviews) {
  const inferred = coverage.get(source.source_number);
  const authored = authorCoverage.get(source.source_number);
  assert.ok(inferred && authored);
  const actualIds = draftQuestions
    .filter((q) => q.source_numbers.includes(source.source_number))
    .map((q) => q.id);
  assert.deepEqual(inferred.question_ids, actualIds);
  assert.deepEqual(authored.question_ids, actualIds);
}

const detailedSourceEvidence = (source) => {
  const details = Object.fromEntries(
    Object.entries(source).filter(([key]) =>
      !["source_number", "status", "independent_solution"].includes(key),
    ),
  );
  return source.independent_solution +
    " Reused frozen Stage1 details (not a new source solve): " +
    canonical(details);
};

const review = {
  schema: "s10y-choice-review-v1",
  seed_sha256: sources.value.seed_sha256,
  draft_sha256: expectedDraftDigest,
  reviewer: {
    kind: "independent_agent",
    identity: "STEMROBIN-182 n40-choice-review staged FIRST reviewer",
  },
  source_reviews: sources.value.source_reviews.map((source) => {
    const inferred = coverage.get(source.source_number);
    const authored = authorCoverage.get(source.source_number);
    return {
      source_number: source.source_number,
      independent_solution: detailedSourceEvidence(source),
      coverage: {
        verdict: inferred.verdict,
        evidence: inferred.evidence +
          " Original author source mapping matches the frozen inferred mapping." +
          " Author-recorded omissions: " + authored.omitted_tasks.join(" | ") +
          " These labels do not authorize approving essential lookup removal.",
      },
    };
  }),
  figure_checks: [],
  new_figure_reviews: [],
  question_reviews: draftQuestions.map((question, index) => {
    const prior = gate.value.question_reviews[index];
    const independent = truth.value.question_reviews[index];
    const comparison = comparisons.value.question_comparisons[index];
    const authoredRationales = new Map(
      question.key.rationales.map((row) => [row.option_id, row]),
    );
    const optionIds = question.view.options.map((option) => option.id);
    assert.deepEqual(Object.keys(comparison.options), optionIds);
    assert.equal(authoredRationales.size, optionIds.length);
    assert.deepEqual(
      [...question.key.correct].sort(),
      [...independent.correct].sort(),
    );
    const relatedFindings = gate.value.findings.filter((finding) =>
      finding.question_ids.includes(question.id),
    );
    const fidelityEvidence = prior.task_fidelity.evidence +
      relatedFindings.map((finding) =>
        " Preserved " + finding.id + " (" + finding.verdict + "): " +
        finding.evidence + " Required resolution: " +
        finding.required_resolution,
      ).join("");
    return {
      question_id: question.id,
      task_fidelity: {
        verdict: prior.task_fidelity.verdict,
        evidence: fidelityEvidence,
      },
      redundancy: prior.redundancy,
      answer_leakage: prior.answer_leakage,
      mathematics: {
        verdict: "pass",
        independent_solution: independent.independent_solution +
          " This solution and true set were frozen before author keys." +
          " Original-FIRST author comparison: " +
          comparison.source_solution_comparison +
          " All original key memberships and all per-option truths agree.",
        correct: independent.correct,
        option_checks: independent.option_checks.map((option) => {
          const authored = authoredRationales.get(option.option_id);
          assert.ok(authored);
          assert.equal(authored.truth, option.truth);
          if (option.truth === "correct") {
            assert.equal(authored.misconception, null);
          } else {
            assert.equal(typeof authored.misconception, "string");
            assert.ok(authored.misconception.trim());
          }
          assert.equal(typeof authored.derivation, "string");
          assert.ok(authored.derivation.trim());
          assert.ok(comparison.options[option.option_id].trim());
          return {
            option_id: option.option_id,
            truth: option.truth,
            evidence: option.evidence +
              " Original-FIRST key, derivation and misconception comparison: " +
              comparison.options[option.option_id],
          };
        }),
      },
    };
  }),
  outcome: "blocked",
};

const exactFields = (value, fields) =>
  assert.deepEqual(Object.keys(value).sort(), [...fields].sort());
const checkVerdict = (value) => {
  exactFields(value, ["verdict", "evidence"]);
  assert.ok(["pass", "revise", "blocked"].includes(value.verdict));
  assert.equal(typeof value.evidence, "string");
  assert.ok(value.evidence.trim());
};
exactFields(review, [
  "schema", "seed_sha256", "draft_sha256", "reviewer", "source_reviews",
  "figure_checks", "new_figure_reviews", "question_reviews", "outcome",
]);
exactFields(review.reviewer, ["kind", "identity"]);
for (const source of review.source_reviews) {
  exactFields(source, ["source_number", "independent_solution", "coverage"]);
  assert.ok(source.independent_solution.trim());
  checkVerdict(source.coverage);
}
for (const question of review.question_reviews) {
  exactFields(question, [
    "question_id", "task_fidelity", "redundancy", "answer_leakage", "mathematics",
  ]);
  checkVerdict(question.task_fidelity);
  checkVerdict(question.redundancy);
  checkVerdict(question.answer_leakage);
  exactFields(question.mathematics, [
    "verdict", "independent_solution", "correct", "option_checks",
  ]);
  for (const option of question.mathematics.option_checks) {
    exactFields(option, ["option_id", "truth", "evidence"]);
  }
}

const questionVerdict = (question) => {
  const verdicts = [
    question.task_fidelity.verdict,
    question.redundancy.verdict,
    question.answer_leakage.verdict,
    question.mathematics.verdict,
  ];
  return verdicts.includes("blocked") ? "blocked" :
    verdicts.includes("revise") ? "revise" : "pass";
};
const approvedIds = review.question_reviews
  .filter((question) => questionVerdict(question) === "pass")
  .map((question) => question.question_id);
const blockedIds = review.question_reviews
  .filter((question) => questionVerdict(question) === "blocked")
  .map((question) => question.question_id);
assert.equal(approvedIds.length, 17);
assert.deepEqual(blockedIds, affectedIds);
assert.equal(review.question_reviews.length, 20);
assert.equal(
  review.question_reviews.reduce(
    (count, q) => count + q.mathematics.option_checks.length, 0,
  ),
  87,
);
assert.equal(
  review.source_reviews.filter((source) =>
    source.coverage.verdict === "blocked",
  ).length,
  3,
);

const summary = {
  schema: "s10y-choice-stage3-first-summary-v1",
  ticket: "STEMROBIN-182",
  stage: "Stage3 original FIRST draft only",
  draft_sha256: expectedDraftDigest,
  draft_file_sha256: digest(draft.bytes),
  review_sha256: digest(canonical(review)),
  mathematics: {
    question_count: 20,
    option_count: 87,
    keys_and_all_option_truths_match_frozen_sets: true,
    derivations_and_misconceptions: "All 87 manually checked against frozen evidence.",
    new_independent_source_solves: 0,
  },
  unaffected_17_approvals: approvedIds,
  affected_3: blockedIds.map((id) => {
    const question = review.question_reviews.find((q) => q.question_id === id);
    return {
      question_id: id,
      task_fidelity: question.task_fidelity,
      mathematics: "pass for the original disclosed algebraic view only",
      original_findings: gate.value.findings.filter((finding) =>
        finding.question_ids.includes(id),
      ),
    };
  }),
  preserved_findings: gate.value.findings,
  outcome: review.outcome,
  omitted_task_rule: "Documenting loss does not restore or approve an essential original task.",
  scope: {
    original_draft_only: true,
    no_actual_bradis_values_or_keys_read: true,
    repaired_draft_or_changed_views_or_changed_keys_read: false,
    no_images_network_db_app_dependencies_publish_or_finalize: true,
    no_author_notes_or_separate_source_solves_needed: true,
  },
  validator: "Exact contract fields, identifiers, original snapshot, source mapping, complete key agreement and preserved staged verdicts checked locally. validate.py was not run because it refreshes source files outside the staged content whitelist.",
  next: "Stop. Parent must disclose changed views before changed keys for affected-only review.",
};
assert.deepEqual(summary.preserved_findings, gate.value.findings);

// Only transform already reviewed evidence; never inspect a repair or source table.
assert.equal(
  digest(canonical(load(path.join(authorDirectory, "draft.json")).value)),
  expectedDraftDigest,
);
for (const [name, value] of [
  ["review-FIRST.json", review],
  ["FIRST-summary.json", summary],
]) {
  fs.writeFileSync(
    path.join(directory, name),
    ascii(JSON.stringify(sort(value), null, 2)) + "\n",
    { flag: "wx" },
  );
}
console.log(JSON.stringify({
  contract_checks: "PASS; semantic outcome remains blocked",
  draft_sha256: expectedDraftDigest,
  review_sha256: digest(canonical(review)),
  unaffected_17_approvals: approvedIds,
  affected_3: blockedIds,
  option_comparisons: 87,
  preserved_findings: gate.value.findings.map((finding) => ({
    id: finding.id, verdict: finding.verdict,
  })),
}, null, 2));

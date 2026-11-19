import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";

const workdir = "/Users/yong/.codex/worktrees/a07e/lemmadeck";
assert.equal(process.cwd(), workdir);
const owned = ".tmp/s10y-choice/batch015-geo910-n12-independent";
const repair = ".tmp/s10y-choice/batch015-geo910-n12-repair";
const historical =
  "ssot-resources/soviet10year-textbooks/artifacts/9-10g/evidence/batch007-n12-choice-rejected";
const paths = {
  seed: `${repair}/seed.json`,
  view: `${repair}/view-only.json`,
  draft: `${repair}/draft.json`,
  sourceRepair: `${repair}/source-repair.md`,
  original: `${historical}/geo910-n12-choice-draft.json`,
  prior: `${historical}/geo910-n12-choice-independent-review-rejected.json`,
  phase1: `${owned}/phase1-source-first-freeze.md`,
  phase1Receipt: `${owned}/phase1-input-hashes.json`,
  preMath: `${owned}/phase2-pre-math-gates.md`,
  phase2: `${owned}/phase2-view-freeze.json`,
  phase2Text: `${owned}/phase2-view-freeze.md`,
};
const expectedFileHashes = {
  seed: "b902a808e1fbe32a89e0060b8091f1970c717083b6d40ca3f82616029feedf17",
  view: "a1cfdef76cea0e6a45275d2fbe85090554235ece59d683d0643454ed85651d2f",
  draft: "3a4dfad2d320b59cb020e23e70a8d82c0d6d649c52065dde97b64e7495d8bf3c",
  sourceRepair: "0765551bb65ab0a72043755259fc41e43e293e8be5dde96c835b41d7600b3f82",
  original: "aa2aa67d4e467cc5749683d8d52ad3bbe1d1038a1c4c9279f3314a65302f1397",
  prior: "fe11b7ea3e8b6493278f8c0d318ca644c7fa44c3aba1aaf271152578c8dce7a0",
  phase1: "8dcd8366f6fb103c8687971de62da2d0a0e041c04023460c92dfe4bddac87d0a",
  phase1Receipt: "6147bce4b8b131278c892a7c688573a83e29598da2c5e7f84f0adc1b599892d4",
  preMath: "89043b34d6c4ccaa3f5a9f635ef67a69d6e58513f65bc535b1ac86c6a87402b4",
  phase2: "2b0407047f696caccc994cee4cbfe40e8a96c2b6041cd3e334e4c6f62917d6a4",
  phase2Text: "5e97193b40ab60d42b4fd055efd7960d4b83771c193499a28f2c5e2603f6ab4b",
};
const sha = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
function sorted(value) {
  if (Array.isArray(value)) return value.map(sorted);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, sorted(value[key])]));
  }
  return value;
}
function digest(value) {
  return sha(
    JSON.stringify(sorted(value)).replace(
      /[\u007f-\uffff]/g,
      (character) => "\\u" + character.charCodeAt(0).toString(16).padStart(4, "0"),
    ),
  );
}
const buffers = {};
for (const [name, file] of Object.entries(paths)) {
  buffers[name] = fs.readFileSync(file);
  assert.equal(sha(buffers[name]), expectedFileHashes[name], `Input changed: ${file}`);
}
const json = (name) => JSON.parse(buffers[name].toString("utf8"));
const seed = json("seed");
const view = json("view");
const draft = json("draft");
const original = json("original");
const prior = json("prior");
const phase2 = json("phase2");
const clone = (value) => structuredClone(value);
const seedDigest = digest(seed);
const draftDigest = digest(draft);
assert.equal(seedDigest, "e4a23600dcc57983ae486b56ef88280f79707dbe0b5a0d8ad0f0265f27facdcd");
assert.equal(draftDigest, "af64293261b4bc0d41da3cac247a0106dad71bc888d9a3a29c160a6618f53ac9");
assert.equal(prior.seed_sha256, seedDigest);
assert.equal(prior.draft_sha256, digest(original));
assert.deepEqual(
  { questions: draft.questions.map(({ id, view: visible }) => ({ id, view: visible })), new_figures: draft.new_figures },
  view,
);
assert.equal(digest(view), phase2.inputs.view_snapshot_canonical_sha256);

function changedPaths(a, b, prefix = "") {
  if (isDeepStrictEqual(a, b)) return [];
  if (a && b && typeof a === "object" && typeof b === "object") {
    return [...new Set([...Object.keys(a), ...Object.keys(b)])].flatMap((key) =>
      changedPaths(a[key], b[key], prefix ? `${prefix}.${key}` : key),
    );
  }
  return [prefix];
}
const oldQuestionChanges = original.questions.flatMap((question) =>
  changedPaths(question, draft.questions.find((current) => current.id === question.id), question.id),
);
assert.deepEqual(oldQuestionChanges, [
  "n12-q04.intent.source_solution",
  "n12-q04.intent.limitations.0",
  "n12-q07.intent.source_solution",
  "n12-q07.intent.limitations.1",
]);
const coverageChanges = original.coverage.flatMap((row) =>
  changedPaths(
    row,
    draft.coverage.find((current) => current.source_number === row.source_number),
    `coverage.${row.source_number}`,
  ),
);
assert.deepEqual(coverageChanges, [
  "coverage.99.question_ids.0",
  "coverage.99.omitted_tasks.0",
  "coverage.99.reason",
  "coverage.101.omitted_tasks.0",
  "coverage.101.omitted_tasks.1",
  "coverage.101.reason",
  "coverage.104.question_ids.1",
  "coverage.104.omitted_tasks.1",
  "coverage.104.reason",
]);
for (const name of ["schema", "seed_sha256", "new_figures"]) {
  assert.deepEqual(draft[name], original[name]);
}
assert.deepEqual(
  draft.questions.filter((question) => !original.questions.some((old) => old.id === question.id)).map((question) => question.id),
  ["n12-q10", "n12-q11"],
);

const provenance =
  `REUSED, not rerun: ${paths.prior}, canonical SHA-256 ${digest(prior)}, ` +
  `reviewer ${prior.reviewer.identity}. `;
const internalNotes = {
  "n12-q04":
    "Affected internal comparison only: source_solution and limitations now distinguish the explicit two-DIFFERENT-image predicate from source101's broad parallelism, including coincident noncollapsed lines. The old view/key/rationales remain exact; no new source/math/view/figure review. Source101's unelicited broad judgment is assessed separately in source coverage.",
  "n12-q07":
    "Affected internal comparison only: the 104(2) HOLD references are replaced by the separately reviewed n12-q11 conditional construction. This item's source solution/limitation now says q07 covers 104(1), not 104(2) on its own. The old view/key/rationales remain exact; no new math or figure review.",
};
const oldQuestionReviews = original.questions.map((question) => {
  const current = draft.questions.find((row) => row.id === question.id);
  assert.deepEqual(current.view, question.view);
  assert.deepEqual(current.key, question.key);
  assert.deepEqual(current.source_numbers, question.source_numbers);
  const oldReview = prior.question_reviews.find((row) => row.question_id === question.id);
  const row = clone(oldReview);
  for (const gate of ["task_fidelity", "redundancy", "answer_leakage"]) {
    assert.equal(row[gate].verdict, "pass");
    row[gate].evidence = provenance + row[gate].evidence;
  }
  assert.equal(row.mathematics.verdict, "pass");
  row.mathematics.independent_solution =
    provenance +
    "The existing correct set and every option_checks record below are copied unchanged from that passed stage, not re-solved. " +
    row.mathematics.independent_solution;
  assert.deepEqual(row.mathematics.option_checks, oldReview.mathematics.option_checks);
  if (internalNotes[question.id]) {
    row.task_fidelity.evidence += " " + internalNotes[question.id];
  }
  return row;
});

const rationaleEvidence = {
  "n12-q10": {
    A: "Author rank-at-least-one derivation agrees with the frozen false option. Its mistaken fiber-merging procedure treats all source directions as the one kernel direction, which would produce the rejected point conclusion.",
    B: "Author rank-one derivation and y=0 example agree with the frozen true complete-line option; misconception is correctly null.",
    C: "Author rank-two derivation and z=1 example agree with the frozen true entire-alpha option; misconception is correctly null.",
    D: "Author affine-subspace derivation agrees with the frozen false half-plane option. The stated source truncation/one-sided-region substitution is the error producing a half-plane, not projection of the whole source plane. A bounded drawing patch alone would not produce an unbounded half-plane; the stated one-sided source replacement is the relevant misconception.",
  },
  "n12-q11": {
    A: "Author derivation agrees with the frozen branch reversal: equal direction planes have no transverse direction, while unequal ones admit valid choices. Its stated feasibility reversal and missing transversality check explain the false complete scheme.",
    B: "Author derivation agrees with the frozen collapse counterexample and the unavailable-direction case when a is tangent to alpha. Its misuse of direction preservation after deleting the nonparallel-to-projector hypothesis explains the false scheme.",
    C: "Author nonzero quotient-direction, transversality, existence, and skew-distinctness derivation agrees with the complete frozen conditional solution; misconception is correctly null.",
    D: "Author outside-span injectivity argument agrees with the frozen independent-image-directions proof. Its reversed rank-one versus injective restriction is the stated procedure behind the false scheme.",
  },
};
const rationaleComparisons = [];
const newQuestionReviews = phase2.question_reviews.map((frozen) => {
  const question = draft.questions.find((row) => row.id === frozen.question_id);
  assert.deepEqual(question.key.correct, frozen.mathematics.correct);
  const row = {
    question_id: frozen.question_id,
    task_fidelity: { verdict: frozen.task_fidelity.verdict, evidence: frozen.task_fidelity.evidence },
    redundancy: clone(frozen.redundancy),
    answer_leakage: clone(frozen.answer_leakage),
    mathematics: clone(frozen.mathematics),
  };
  row.task_fidelity.evidence +=
    ` Reused own completed Phase2 local gates, ${paths.phase2}, file SHA-256 ${expectedFileHashes.phase2}; ` +
    "Phase3 compares internals only, without redoing the source/view review. " +
    (question.id === "n12-q10"
      ? "The author's limitations explicitly name lost independent example construction/proof and unresolved 99(2)/(3)."
      : "The author's limitations explicitly name lost auxiliary-plane/direction production and necessity/sufficiency proof. Coverage preserves the fixed-alpha no-solution branch rather than assuming universal existence.");
  row.mathematics.independent_solution =
    `Reused independent pre-key Phase2 freeze ${paths.phase2}; no new solution run. ` +
    row.mathematics.independent_solution +
    " Phase3: current author set and all four rationale truths agree with that frozen set.";
  for (const check of row.mathematics.option_checks) {
    const rationale = question.key.rationales.find((entry) => entry.option_id === check.option_id);
    assert.equal(rationale.truth, check.truth);
    assert.equal(rationale.misconception === null, check.truth === "correct");
    const evidence = rationaleEvidence[question.id][check.option_id];
    check.evidence += " Internal comparison: " + evidence;
    rationaleComparisons.push({
      question_id: question.id,
      option_id: check.option_id,
      verdict: "pass",
      frozen_truth: check.truth,
      author_truth: rationale.truth,
      evidence,
    });
  }
  return row;
});

const sourceReviews = prior.source_reviews.map((old) => {
  const row = clone(old);
  row.independent_solution =
    provenance +
    "Reused completed source reasoning, consistent with own Phase1 freeze; no source re-solve in Phase3. " +
    row.independent_solution;
  if (row.source_number === "99") {
    row.coverage = {
      verdict: "blocked",
      evidence:
        "Affected-only coverage update: n12-q10 retains the fully determined 99(1) plane/line classification with frozen set B,C and explicitly records independent instance/proof loss. The old 99(1) omission is repaired, not still a HOLD. Current coverage and q10 limitations honestly retain the two separate HOLDs: 99(2) half-plane boundary/endpoint ownership and 99(3) angle as rays/region plus zero/reflex range. Neither source-repair.md nor new rationales invent those conventions. Thus source99 coverage and aggregate remain blocked; a partial pass does not resolve the other two source units.",
    };
  } else if (row.source_number === "101") {
    row.coverage = {
      verdict: "revise",
      evidence:
        "Qualified affected-source coverage finding, not an old key/view/math failure: the internal correction itself passes. q04 source_solution, its first limitation, source-repair.md, and coverage now correctly state that coincident noncollapsed line images remain parallel under the book convention; only collapse removes line images. q04 still elicits the stronger two-DIFFERENT-image classification, and coverage explicitly admits that the original broad-parallel judgment is not separately asked. Retain that definite scope omission as a qualified coverage revision rather than claim fully elicited source101. The prior four-option AB math and local view gates remain passed and reusable; the earlier false internal equivalence is no longer present.",
    };
  } else if (row.source_number === "104") {
    row.coverage = {
      verdict: "pass",
      evidence:
        provenance +
        "Unchanged q07 retains passed source104(1) counterexample/converse work. Affected 104(2) coverage is now n12-q11: its frozen C whole scheme retains the fixed-input feasibility condition, direction-plane restriction, exclusions of both source directions and alpha-tangent directions, and the equal-direction-plane no-solution branch. Phase3 source_solution/rationales/source-repair.md agree with the existing source and view freezes. The q07 changed references correctly route 104(2) to q11, and coverage honestly records recognition instead of independent auxiliary-plane/direction/proof production. This closes the old missing-view HOLD without claiming universal construction or repeating q07's passed math.",
    };
  } else {
    const oldCoverage = original.coverage.find((entry) => entry.source_number === row.source_number);
    const currentCoverage = draft.coverage.find((entry) => entry.source_number === row.source_number);
    assert.deepEqual(currentCoverage, oldCoverage);
    assert.equal(row.coverage.verdict, "pass");
    row.coverage.evidence = provenance + row.coverage.evidence;
  }
  return row;
});

const review = {
  schema: "s10y-choice-review-v1",
  seed_sha256: seedDigest,
  draft_sha256: draftDigest,
  reviewer: {
    kind: "independent_agent",
    identity:
      "STEMROBIN-184 worker184-3 independent affected-only reviewer; same staged invocation, not author; prior unchanged passes explicitly attributed per record",
  },
  source_reviews: sourceReviews,
  figure_checks: clone(prior.figure_checks),
  new_figure_reviews: clone(prior.new_figure_reviews),
  question_reviews: [...oldQuestionReviews, ...newQuestionReviews],
  outcome: "blocked",
};
assert.deepEqual(review.figure_checks, []);
assert.deepEqual(review.new_figure_reviews, []);
assert.equal(review.source_reviews.length, 10);
assert.equal(review.question_reviews.length, 11);
assert.equal(review.question_reviews.reduce((sum, row) => sum + row.mathematics.option_checks.length, 0), 50);
assert.equal(oldQuestionReviews.reduce((sum, row) => sum + row.mathematics.option_checks.length, 0), 42);
assert.equal(rationaleComparisons.length, 8);

const comparison = {
  record_type: "phase3-internal-comparison-and-reuse-receipt",
  ticket: "STEMROBIN-184",
  reviewer: "worker184-3",
  phase: 3,
  workdir,
  input_file_hashes: Object.fromEntries(
    Object.entries(paths).map(([name, file]) => [file, expectedFileHashes[name]]),
  ),
  seed_canonical_sha256: seedDigest,
  draft_canonical_sha256: draftDigest,
  original_draft_canonical_sha256: digest(original),
  prior_review_canonical_sha256: digest(prior),
  phase2_view_canonical_sha256: digest(view),
  review_path: `${owned}/review.json`,
  review_canonical_sha256: digest(review),
  prior_reviewer: prior.reviewer,
  unchanged_views_keys_and_rationales: original.questions.map((row) => row.id),
  reused_prior_passed_option_count: 42,
  new_option_internal_comparison_count: 8,
  current_question_count: 11,
  current_source_count: 10,
  current_option_count: 50,
  exact_old_question_changed_leaf_paths: oldQuestionChanges,
  exact_coverage_changed_leaf_paths: coverageChanges,
  draft_top_level_changes_except_question_additions_and_coverage: [],
  new_question_ids: ["n12-q10", "n12-q11"],
  new_rationale_comparisons: rationaleComparisons,
  source99: {
    plane_subtask: "Local pass; old omission repaired by q10.",
    half_plane_subtask: "Blocked; genuine boundary/endpoint convention unresolved.",
    angle_subtask: "Blocked; genuine point-set/range conventions unresolved.",
    coverage_verdict: "blocked",
  },
  source101: {
    internal_reasoning_and_honest_scope_correction: "pass",
    original_broad_judgment_separately_elicited: false,
    coverage_verdict: "revise",
    qualification: "Definite explicit scope omission only; unchanged strict q04 view/math pass is preserved.",
  },
  source104: {
    unchanged_104_1: "Prior passed q07 work reused.",
    conditional_104_2: "Pass; q11 retains full feasibility and no-solution scheme with documented production loss.",
    changed_q07_references_only: true,
    coverage_verdict: "pass",
  },
  repeated_source_math_figure_or_view_reviews: 0,
  new_image_opens_decodes_or_rois: 0,
  new_figure_reviews: 0,
  promotion_or_canonical_edits: 0,
  aggregate: "blocked",
  next_step: "Exactly one official validation with seed/draft/review; save actual stdout, stderr and exit.",
};
for (const [name, file] of Object.entries(paths)) {
  assert.equal(sha(fs.readFileSync(file)), expectedFileHashes[name], `Input changed before write: ${file}`);
}
for (const [name, value] of [["review.json", review], ["phase3-internal-comparison.json", comparison]]) {
  fs.writeFileSync(path.join(owned, name), JSON.stringify(value, null, 2) + "\n", { flag: "wx" });
}
console.log(JSON.stringify({
  outcome: review.outcome,
  review_path: comparison.review_path,
  review_canonical_sha256: comparison.review_canonical_sha256,
  counts: { questions: 11, options: 50, sources: 10, reused_options: 42, new_rationales_compared: 8 },
  source_coverage: sourceReviews.map((row) => ({ source_number: row.source_number, verdict: row.coverage.verdict })),
  official_validator_calls: 0,
}, null, 2));

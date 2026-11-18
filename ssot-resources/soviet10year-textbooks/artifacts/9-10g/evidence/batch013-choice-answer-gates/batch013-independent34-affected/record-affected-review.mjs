import fs from "node:fs";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";

const root = "/Users/yong/.codex/worktrees/a07e/lemmadeck";
const own = ".tmp/s10y-choice/batch013-independent34-affected";
const seedPath = ".tmp/s10y-choice/batch013-author3435/n34.seed.json";
const oldDraftPath = ".tmp/s10y-choice/batch013-author3435/n34.draft.json";
const draftPath = ".tmp/s10y-choice/batch013-repair34/draft.json";
const oldReviewPath = ".tmp/s10y-choice/batch013-independent34/review.json";
const viewPath = `${own}/view-only-reasoning.json`;
const reviewPath = `${own}/review.json`;
const read = (p) => fs.readFileSync(`${root}/${p}`);
const load = (p) => JSON.parse(read(p));
const sha = (v) => crypto.createHash("sha256").update(v).digest("hex");
const fileSha = (p) => sha(read(p));
const sorted = (v) => Array.isArray(v) ? v.map(sorted) :
  v && typeof v === "object" ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, sorted(v[k])])) : v;
const canonical = (v) => JSON.stringify(sorted(v)).replace(/[\u007f-\uffff]/g,
  (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`);
const digest = (v) => sha(canonical(v));
const save = (name, value) => {
  const path = `${root}/${own}/${name}`;
  if (fs.existsSync(path)) {
    assert.equal(canonical(JSON.parse(fs.readFileSync(path))), canonical(value),
      `Existing owned evidence differs; preserve rather than overwrite: ${name}`);
    return;
  }
  fs.writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, {flag: "wx"});
};
const seed = load(seedPath);
const oldDraft = load(oldDraftPath);
const draft = load(draftPath);
const oldReview = load(oldReviewPath);
const visible = load(viewPath);
const oldReviewHash = "3742596006d326d62f471e4066f09f8e59db27e6118da0ed697bc8e48bd4e9ac";
const originalAuthorHash = "d00ed16c63bd4df74697aed2f5c229d1909b784beec0d6843baad7e1678b796a";
assert.equal(fileSha(oldReviewPath), oldReviewHash);
assert.equal(fileSha(oldDraftPath), originalAuthorHash);
assert.equal(oldReview.outcome, "revise");
assert.equal(digest(seed), oldReview.seed_sha256);
assert.equal(digest(oldDraft), oldReview.draft_sha256);
assert.equal(digest(draft), visible.draft_sha256);
assert.equal(fileSha(draftPath), visible.draft_file_sha256);
assert.equal(draft.seed_sha256, oldReview.seed_sha256);
assert.equal(seed.exercises.length, 13);
assert(!seed.exercises.some((e) => e.number === "313"));
assert.equal(draft.questions.length, 15);
assert(!draft.questions.some((q) => ["q319", "q320"].includes(q.id)));
assert.deepEqual(draft.new_figures, oldDraft.new_figures);
assert.equal(draft.new_figures.length, 0);
const merged = draft.questions.find((q) => q.id === "q319320");
assert(merged);
assert.deepEqual(merged.source_numbers, ["319", "320"]);
assert.equal(digest(merged.view), visible.merged_view_sha256);
assert.equal(merged.view.mode, "multiple");
assert.equal(merged.view.options.length, 6);
assert.deepEqual([...merged.key.correct].sort(), [...visible.question_review.mathematics.correct].sort());
for (const checked of visible.question_review.mathematics.option_checks) {
  assert.equal(merged.key.rationales.find((r) => r.option_id === checked.option_id).truth, checked.truth);
}
const unchanged = oldDraft.questions.filter((q) => !["q319", "q320"].includes(q.id));
assert.equal(unchanged.length, 14);
for (const q of unchanged) {
  assert.equal(canonical(q), canonical(draft.questions.find((r) => r.id === q.id)),
    `Unrelated question changed: ${q.id}`);
}
for (const row of oldDraft.coverage.filter((r) => !["319", "320"].includes(r.source_number))) {
  assert.equal(canonical(row), canonical(draft.coverage.find((r) => r.source_number === row.source_number)),
    `Unrelated coverage changed: ${row.source_number}`);
}
for (const number of ["319", "320"]) {
  const row = draft.coverage.find((r) => r.source_number === number);
  assert.deepEqual(row.question_ids, ["q319320"]);
  assert.deepEqual(row.omitted_tasks, oldDraft.coverage.find((r) => r.source_number === number).omitted_tasks);
}
const reuseReference = `Reused unchanged evidence from ${oldReviewPath} (file SHA-256 ${oldReviewHash}); source/item content and applicable assets unchanged, not re-reviewed. `;
const mergedReview = structuredClone(visible.question_review);
mergedReview.answer_leakage.evidence += " Affected package stem scan confirms none of the other 14 stems supplies the two offset planes, open slab or open exterior union as a declared answer. q321's equal-distance-to-two-planes task and q322's half-turn-axis task have a median plane, not this one-plane fixed-distance classification; the new question does not disclose either of those tasks' solutions.";
mergedReview.redundancy.evidence += " Package relationships remain distinct: the median plane for two equal distances (q321) is not the two offset planes for one fixed distance; half-turn axes (q322) still require direction and position. Unchanged theorem, triangle, cube and projection computations remain separate response units.";
mergedReview.mathematics.independent_solution += " After saved view-only reasoning, compared the actual repaired source_solution and rationales: all six derivations agree. B results from solving |t|=l with only t=l; C replaces > by >=; F adds an unjustified strictly-positive-distance condition. These procedures produce the printed false options and fail respectively on t=-l, t=l and t=0.";
const sourceReviews = oldReview.source_reviews.map((row) => {
  const reused = structuredClone(row);
  if (row.source_number === "319") {
    reused.coverage = {
      verdict: "pass",
      evidence: `Independent source solution reused verbatim from ${oldReviewPath}. Newly reviewed q319320 options B/D require deciding one versus both signed levels for the complete equality locus. Its stem does not assume either result; source319 is not dropped. Coverage binds only q319320. Explicit l>0 retains the previously declared omission of l=0/l<0 and independent drawing; no additional source loss.`
    };
  } else if (row.source_number === "320") {
    reused.coverage = {
      verdict: "pass",
      evidence: `Independent source solution reused verbatim from ${oldReviewPath}. Newly reviewed q319320 A/F check the whole strict near region including alpha, and C/E check the entire strict far region with both boundary exclusions. Thus both source320 subquestions survive in one shared classification, and coverage binds only q319320. Previously declared nonpositive-parameter and independent-drawing losses are unchanged.`
    };
  } else {
    reused.coverage.evidence = reuseReference + reused.coverage.evidence;
  }
  return reused;
});
const questionReviews = draft.questions.map((q) => {
  if (q.id === "q319320") return mergedReview;
  const reused = structuredClone(oldReview.question_reviews.find((r) => r.question_id === q.id));
  assert(reused);
  for (const k of ["task_fidelity", "redundancy", "answer_leakage"]) {
    assert.equal(reused[k].verdict, "pass");
    reused[k].evidence = reuseReference + reused[k].evidence;
  }
  assert.equal(reused.mathematics.verdict, "pass");
  reused.mathematics.independent_solution = reuseReference + reused.mathematics.independent_solution;
  return reused;
});
const review = {
  schema: "s10y-choice-review-v1",
  seed_sha256: digest(seed),
  draft_sha256: digest(draft),
  reviewer: {
    kind: "independent_agent",
    identity: "Same184-3 original independent Codex reviewer; affected-only follow-up batch013-independent34-affected, with explicitly reused first-review evidence"
  },
  source_reviews: sourceReviews,
  figure_checks: structuredClone(oldReview.figure_checks),
  new_figure_reviews: structuredClone(oldReview.new_figure_reviews),
  question_reviews: questionReviews,
  outcome: "pass"
};
assert.equal(review.figure_checks.length, 0);
assert.equal(review.new_figure_reviews.length, 0);
save("review.json", review);
const answerReportPath = ".tmp/s10y-choice/batch013-independent34/answerGate-review.json";
const answerKeysPath = "ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c1-s3-n34/answer-keys.json";
const answerReportHash = "1ab7e77d1188bac4cfb1f4d761092f7e67be2eb06e02b01b53d0d70c1530a969";
const answerKeysHash = "d8b42735a56c1cad8fa38b8c2f061adbfca3925de913822bcc2e15815f49e160";
assert.equal(fileSha(answerReportPath), answerReportHash);
const currentAnswerKeysHash = fileSha(answerKeysPath);
const provenance = {
  stage: "affected-only-after-actual-author-repair",
  seed_path: seedPath, seed_sha256: review.seed_sha256,
  draft_path: draftPath, draft_sha256: review.draft_sha256,
  old_draft_path: oldDraftPath, old_draft_sha256: oldReview.draft_sha256,
  old_draft_file_sha256: originalAuthorHash,
  first_review_path: oldReviewPath, first_review_file_sha256: oldReviewHash,
  first_review_outcome: "revise",
  first_failure_preserved: true,
  saved_view_reasoning_path: viewPath, saved_view_reasoning_file_sha256: fileSha(viewPath),
  disclosure_limit: visible.disclosure_limit,
  repaired_unit: {
    id: "q319320", sources: ["319", "320"], native_mode: "multiple",
    freshly_checked_options: 6, independently_proved_correct: ["A", "D", "E"],
    freshly_checked_scopes: ["merged view fidelity", "all six option truths", "source_solution/rationales/misconceptions comparison", "affected 319/320 coverage", "incoming/outgoing package leakage and redundancy"],
    author_comparison: "The shared |t| model, all three positive-l loci, omitted nonpositive branches and construction/proof losses match previous source solutions. B is unsigned-as-signed; C closes a strict inequality; F incorrectly excludes zero distance. All author derivations produce their stated alternatives and agree with fresh proofs."
  },
  reused_questions: unchanged.map((q) => ({
    question_id: q.id, canonical_item_sha256: digest(q),
    full_item_content_identical_to_original: true,
    review_origin: oldReviewPath,
    action: "Reuse all original item evidence, no new item solve/re-review."
  })),
  reused_source_solutions: seed.exercises.map((e) => e.number),
  unaffected_source_coverage_content_identical: oldDraft.coverage.filter((r) => !["319", "320"].includes(r.source_number)).map((r) => r.source_number),
  figure_reuse: {
    new_image_opens: 0,
    used_question_figures: [],
    explanation: "Question-used figure sets remain empty, and no new images exist. Seed-definition fig125 observation remains in the original blind-solutions.json; the original figure evidence is reused without reopen or new visual judgment."
  },
  answer_reuse: {
    substantive_status: "pass-reused-all14",
    report_path: answerReportPath, report_file_sha256: answerReportHash,
    answer_keys_path: answerKeysPath, reviewed_answer_keys_file_sha256: answerKeysHash,
    observed_current_answer_keys_file_sha256: currentAnswerKeysHash,
    prior_report_unchanged: true,
    current_answer_bytes_match_prior_review: currentAnswerKeysHash === answerKeysHash,
    action: "Only hashed existing evidence and current key bytes; no answer content reread, new answer review, edits, or mechanical gate execution. Reuse the prior all14 answer pass as evidence for its original hash only.",
    remaining_limit: "Current answer bytes differ from the earlier reviewed snapshot. This choice-only follow-up makes no claim about their changed contents or finalization status and does not rebind the historical answer pass to the current hash."
  },
  capacity_losses: "Only explicit l>0; l=0/l<0 and independent three-dimensional drawing/proof production are still declared omissions. No equality, near or far source task was removed.",
  scope: "Writes only new affected directory; no new images, answer edits, finalize, DB, env, publish, install, paid calls, Git, chats or descendants."
};
save("provenance.json", provenance);
const args = [
  ".agents/skills/ld-s10y-choice/scripts/validate.py", "--repo", ".",
  "--seed", seedPath, "--draft", draftPath, "--review", reviewPath
];
const validation = spawnSync("python3", args, {
  cwd: root, encoding: "utf8", env: {...process.env, PYTHONDONTWRITEBYTECODE: "1"}
});
save("validation-receipt.json", {
  command: ["python3", ...args], workdir: root, invocation_count: 1,
  exit_code: validation.status, stdout: validation.stdout, stderr: validation.stderr,
  validation_scope: "Strict original seed/new draft/new full current review, once only."
});
assert.equal(validation.status, 0);
assert.match(validation.stdout, /mechanical checks passed; declared semantic review: pass/);
assert.equal(fileSha(oldReviewPath), oldReviewHash);
assert.equal(fileSha(oldDraftPath), originalAuthorHash);
assert.equal(digest(load(draftPath)), review.draft_sha256);
assert.equal(fileSha(answerKeysPath), currentAnswerKeysHash);
const report = {
  ticket: "Same184-3",
  lesson: "geo910-c1-s3-n34",
  scope: "affected-only choice repair",
  checked_at: new Date().toISOString(),
  workdir: root,
  status: "pass",
  finding_resolution: "Original q320-stem disclosure of q319 is removed. New q319320 requires a unified complete equality/near/far classification; both source tasks and strict boundary distinctions remain.",
  seed_sha256: review.seed_sha256,
  draft_path: draftPath, draft_sha256: review.draft_sha256,
  draft_file_sha256: fileSha(draftPath),
  review_path: reviewPath, review_sha256: digest(review),
  review_file_sha256: fileSha(reviewPath),
  seed_exercises: 13, current_questions: 15, current_option_checks: 62,
  fresh_option_checks: 6, reused_option_checks: 56,
  fresh_correct_set: ["A", "D", "E"],
  unchanged_questions_reused: 14,
  strict_validator_invocations: 1, strict_validator_exit_code: validation.status,
  first_failure_review_preserved: true,
  first_failure_review_file_sha256: oldReviewHash,
  all14_answer_semantic_pass: "prior evidence reused for its original snapshot only; no answer rereview",
  previously_reviewed_answer_keys_file_sha256: answerKeysHash,
  observed_current_answer_keys_file_sha256: currentAnswerKeysHash,
  new_image_opens: 0,
  image_payloads_to_parent: false,
  limitations: ["Positive-l recognition still does not prove independent drawing/derivation; omissions declared.", "Human instruction already stated the claimed key; actual draft internals were disclosed only after saved six-option reasoning.", "No MathLive/ComputeEngine/finalize or publication performed.", "Durable answer bytes changed since the original answer review; that historical pass is not newly bound to the current answer hash."],
  output_files: [viewPath, reviewPath, `${own}/provenance.json`, `${own}/validation-receipt.json`],
  writes: `${own}/ only`
};
assert.equal(review.question_reviews.reduce((n, q) => n + q.mathematics.option_checks.length, 0), 62);
save("report.json", report);
console.log(JSON.stringify(report, null, 2));

import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";

const root = "/Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp";
const outputRoot = `${root}/d176-t16-choice-q1-affected-review`;
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const load = (path) => JSON.parse(readFileSync(path, "utf8"));
const fragmentPath = `${outputRoot}/q1-review.fragment.json`;
const fragment = load(fragmentPath);
const languageBindings = {
  zh: {
    seed: "1da0ffc520b6b22b056e185b8db1ee56bd549e8ebca308017cfa31e1a6a3cbbb",
    before: "303f458a6195cd40989151e86336103ffdcc240bf5a68742c914406ef63fe9e0",
    after: "b8c0255ce18e25737be3ee428c5836e435007802e2aff10a2d6d382df867a796",
    priorReview: "c5cbbffc884d1d6ab4eefcfe8df6d186ef60ad2a4b15943ee2de810ad022979c",
    canonicalDraft: "78068fcdf252ccd322fcb3339f518d54cbd3399eea55e321adb33e63f1e8e510",
  },
  en: {
    seed: "04874525e399d1cf7044fa29d09b1c22373edf184901ba11830d59f1f019c31a",
    before: "10e8735742e2f45e68b265089cce35e5ed675286d323e0ebc878ed2ae84cd459",
    after: "e4e5bf621352404a109d2da193950fb9a811f535818dfe4ac9644626f05d2545",
    priorReview: "139948170a308e4f966880789106c93c7e9527fece8cd4da174a402db0a01141",
    canonicalDraft: "7ea8f47fa60acbf14f60b4b4c4e23735d54b582a15ab3d985b090d8959678c91",
  },
};
const receipt = {
  schema: "STEMROBIN-181/choice-affected-review-inheritance-receipt@1",
  manualFragment: { path: fragmentPath, sha256: hash(readFileSync(fragmentPath)) },
  languages: [],
  inheritedSources: ["2", "5"],
  unchangedSourcesReSolvedOrReReviewed: false,
  imagesOpened: 0,
  cumulativeImageCount: 24,
};

for (const language of ["zh", "en"]) {
  const expected = languageBindings[language];
  const paths = {
    seed: `${root}/d171-t16-choice-inputs/${language}-repo/.tmp/seed.json`,
    before: `${root}/d172-t16-text-only-choice-author/${language}.draft.json`,
    after: `${root}/d175-t16-choice-q1-repair/${language}.draft.json`,
    priorReview: `${root}/d173-t16-text-only-choice-review/${language}.review.json`,
  };
  const bindings = Object.entries(paths).map(([role, path]) => {
    const sha256 = hash(readFileSync(path));
    assert.equal(sha256, expected[role], `${language} ${role} snapshot changed`);
    return { role, path, sha256 };
  });
  const before = load(paths.before);
  const after = load(paths.after);
  const prior = load(paths.priorReview);
  assert.deepStrictEqual(Object.keys(after).sort(), Object.keys(before).sort());
  assert.deepStrictEqual(after.questions.slice(1), before.questions.slice(1));
  assert.deepStrictEqual(after.coverage.slice(1), before.coverage.slice(1));
  for (const key of Object.keys(before).filter((key) => !["questions", "coverage"].includes(key))) {
    assert.deepStrictEqual(after[key], before[key]);
  }
  assert.equal(after.questions[0].id, "t16-frame-reason");
  assert.deepStrictEqual(after.questions[0].source_numbers, ["1"]);
  assert.equal(after.coverage[0].source_number, "1");
  assert.equal(prior.outcome, "revise");
  const sourceReviews = prior.source_reviews.map((row) => row.source_number === "1"
    ? { ...row, coverage: fragment.source_coverage }
    : row);
  const questionReviews = prior.question_reviews.map((row) => row.question_id === "t16-frame-reason"
    ? fragment.question_review
    : row);
  const review = {
    ...prior,
    draft_sha256: expected.canonicalDraft,
    reviewer: {
      kind: "independent_agent",
      identity: "Jason-existing-bounded-reviewer; distinct from parent-existing-agent q1 repair and Dewey original author",
    },
    source_reviews: sourceReviews,
    question_reviews: questionReviews,
    outcome: "pass",
  };
  assert.deepStrictEqual(review.source_reviews.slice(1), prior.source_reviews.slice(1));
  assert.deepStrictEqual(review.question_reviews.slice(1), prior.question_reviews.slice(1));
  assert.equal(review.source_reviews[0].independent_solution, prior.source_reviews[0].independent_solution);
  const reviewPath = `${outputRoot}/${language}.review.json`;
  writeFileSync(reviewPath, `${JSON.stringify(review, null, 2)}\n`, { flag: "wx" });
  receipt.languages.push({
    language,
    bindings,
    q2q5QuestionsAndCoverageStructurallyIdentical: true,
    inheritedSourceAndQuestionReviewValuesExactlyEqual: true,
    source1IndependentSolutionRetainedExactly: true,
    affectedFields: ["source_reviews[source_number=1].coverage", "question_reviews[question_id=t16-frame-reason]"],
    review: { path: reviewPath, sha256: hash(readFileSync(reviewPath)) },
    unchangedSourceReReviewCount: 0,
  });
}
const receiptPath = `${outputRoot}/inheritance.receipt.json`;
writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ receiptPath, sha256: hash(readFileSync(receiptPath)), languages: receipt.languages }, null, 2));

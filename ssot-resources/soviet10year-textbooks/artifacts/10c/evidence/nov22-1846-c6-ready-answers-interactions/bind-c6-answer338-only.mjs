import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = "/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck";
assert.equal(process.cwd(), root);
const scratch = path.join(root, ".tmp/stemrobin-184-six");
const hash = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const read = (file, expected) => {
  const bytes = fs.readFileSync(file);
  const sha256 = hash(bytes);
  if (expected) assert.equal(sha256, expected);
  return { path: file, bytes: bytes.length, sha256, document: JSON.parse(bytes) };
};
const before = read(path.join(scratch, "c6-supplement-answer-350-repair/answer-keys.json"),
  "956a0a02f0ada0719c65945d970625a5f342cc708ea03db9d3b15540af8aa058");
const after = read(path.join(scratch,
  "c6-answer-reviewed-working-copy/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c6-ex/answer-keys.json"));
const exercises = read(path.join(scratch,
  "c6-answer-reviewed-working-copy/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c6-ex/exercises.json"),
  "485c156b1896f531f54fa39fe15f805eb49af309c0d442f2bb7b7274c5861d8d");
const sourceReview = read(path.join(root,
  "ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/nov22-1846-c6-held-context-review-phaseB/retention.json"),
  "aeec81c6ff165fd7b7a2ad04a8c4d4dbf0213c1f92a5765caed1b2282b67ead2");
assert.equal(before.document.answers.length, 57);
assert.equal(after.document.answers.length, 57);
const changes = before.document.answers.flatMap((answer, index) =>
  JSON.stringify(answer) === JSON.stringify(after.document.answers[index]) ? [] : [answer.exercise]);
assert.deepEqual(changes, ["338"]);
const metadata = document => Object.fromEntries(Object.entries(document).filter(([key]) => key !== "answers"));
assert.deepEqual(metadata(before.document), metadata(after.document));
const old338 = before.document.answers.find(answer => answer.exercise === "338");
const new338 = after.document.answers.find(answer => answer.exercise === "338");
assert.deepEqual(Object.keys(new338), Object.keys(old338));
const changedFields = Object.keys(new338).filter(key =>
  JSON.stringify(old338[key]) !== JSON.stringify(new338[key]));
assert.deepEqual(changedFields, ["grading", "source", "displayAnswer", "notes"]);
assert.equal(new338.grading, "ungraded");
assert.equal(new338.source, "derived");
assert.deepEqual(new338.parts, []);
assert.ok(new338.displayAnswer.trim());
assert.equal(exercises.document.exercises.find(item => item.number === "338").text,
  "338. $y=2x\\sin x-(x^2-2.3)\\cos(x+2)$.");
const receipt = {
  status: "ANSWER338_ONLY_CANDIDATE_BOUND_NOT_MATH_APPROVAL",
  cwd: root,
  before: { path: before.path, bytes: before.bytes, sha256: before.sha256 },
  candidate: { path: after.path, bytes: after.bytes, sha256: after.sha256 },
  editionSha256: exercises.sha256,
  retainedSourceComparisonSha256: sourceReview.sha256,
  changedExercises: changes,
  changedFields,
  unchangedReviewedAnswerEntries: 56,
  metadataUnchanged: true,
  priorSourceMathAnswersDisplayReplayed: false,
  independent338MathReview: "PENDING",
  finalizerRun: false,
  parentImageOpsPaidCallsCompleteLessons: [0, 0, 0],
};
const file = path.join(scratch, "c6-answer-reviewed-working-copy/answer338-scope-proof.json");
fs.writeFileSync(file, JSON.stringify(receipt, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify({
  receipt: file, sha256: hash(fs.readFileSync(file)),
  candidateSha256: after.sha256, changedExercises: changes, unchangedAnswers: 56,
}));

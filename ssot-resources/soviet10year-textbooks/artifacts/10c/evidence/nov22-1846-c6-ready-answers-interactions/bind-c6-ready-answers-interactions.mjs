import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = "/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck";
assert.equal(process.cwd(), root);
const base = path.join(root, ".tmp/stemrobin-184-six/c6-answer-reviewed-working-copy");
const lesson = path.join(base, "artifacts/10c/editions/modern-us-neutral/lessons/ana10-c6-ex");
const hash = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const bind = (file, expected) => {
  const bytes = fs.readFileSync(file);
  const sha256 = hash(bytes);
  if (expected) assert.equal(sha256, expected);
  return { path: file, bytes: bytes.length, sha256, document: JSON.parse(bytes) };
};
const before = bind(path.join(base, "answer-candidate-before-first-finalizer.json"),
  "61496802538c7216a8f2b113d0731d243ca3d74c164b2c80e45f9539e5062f5e");
const ready = bind(path.join(lesson, "answer-keys.json"));
const audit = bind(path.join(lesson, "answer-keys.audit.json"));
const interactions = bind(path.join(lesson, "interactions.json"));
const exercises = bind(path.join(lesson, "exercises.json"),
  "485c156b1896f531f54fa39fe15f805eb49af309c0d442f2bb7b7274c5861d8d");
assert.equal(ready.document.status, "ready");
assert.equal(ready.document.count, 57);
assert.deepEqual(ready.document.answers, before.document.answers);
assert.equal(audit.document.status, "pass");
assert.equal(audit.document.answerCount, 57);
assert.equal(audit.document.auto, 0);
assert.equal(audit.document.ungraded, 57);
assert.equal(interactions.document.status, "ready");
assert.equal(interactions.document.count, 57);
assert.deepEqual(interactions.document.interactions.map(item => String(item.exercise)),
  exercises.document.exercises.map(item => String(item.number)));
assert.ok(interactions.document.interactions.every(item =>
  item.widget === "free" && item.derivation && !item.needsAuthoring));
const forbidden = new Set(["expected", "displayAnswer", "accept", "correct_index"]);
const inspect = value => {
  if (Array.isArray(value)) return value.forEach(inspect);
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    assert.ok(!forbidden.has(key), `Interaction must not expose ${key}`);
    inspect(child);
  }
};
inspect(interactions.document);
const receipt = {
  status: "FIRST_ANSWER_AND_INTERACTION_FINALIZERS_PASS_NOT_WHOLE_LESSON",
  cwd: root,
  outputs: [ready, audit, interactions].map(({ document, ...binding }) => binding),
  candidateBeforeFinalizerSha256: before.sha256,
  editionSha256: exercises.sha256,
  finalizerAnswerContentChanges: 0,
  readyAnswers: 57,
  ungradedAnswers: 57,
  readyFreeInteractions: 57,
  needsAuthoring: 0,
  interactionAnswerFields: 0,
  prior56MathAndNew338ReviewReusedNotReplayed: true,
  source338DecimalAnd371373CommandHolds: "SETTLED_BY_RETAINED_NARROW_SOURCE_REVIEW",
  physicalRasterEncodingAndSource218Membership: "UNKNOWN",
  wholeLessonCredit: 0,
  remainingAcceptance: "Canonical integration and remaining course acceptance are not established by these answer stages",
  dbPublishMergeDeployCommitPush: false,
  parentImageOpsPaidCalls: [0, 0],
};
const file = path.join(base, "ready-answers-interactions-bindings.json");
fs.writeFileSync(file, JSON.stringify(receipt, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify({
  receipt: file, sha256: hash(fs.readFileSync(file)),
  outputs: receipt.outputs, readyAnswers: 57, readyInteractions: 57,
  finalizerAnswerContentChanges: 0, newCompleteLessons: 0,
}));

import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = "/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck";
assert.equal(process.cwd(), root);
const scratch = path.join(root, ".tmp/stemrobin-184-six");
const target = path.join(scratch, "c6-supplement-answer-350-repair");
const original = path.join(scratch, "c6-supplement-answer-author/answer-keys.json");
const candidate = path.join(target, "answer-keys.json");
const phaseA = path.join(scratch, "c6-supplement-math-review/phaseA");
const bind = file => {
  const bytes = fs.readFileSync(file);
  return {
    path: file, bytes: bytes.length,
    sha256: crypto.createHash("sha256").update(bytes).digest("hex"),
  };
};
const write = (name, value) => fs.writeFileSync(
  path.join(target, name), JSON.stringify(value, null, 2) + "\n", { flag: "wx" },
);
const mode = process.argv[2];
assert.ok(["prepare", "verify"].includes(mode));
if (mode === "prepare") {
  assert.ok(!fs.existsSync(target), "Do not replay candidate preparation");
  const source = bind(original);
  assert.equal(source.sha256, "310e25715d88089e71d8637d45333ae91160723c1d0583ff0356688cab5a364e");
  const inputs = [
    source,
    bind(path.join(phaseA, "source-first-solutions.md")),
    bind(path.join(phaseA, "final-seal.json")),
  ];
  fs.mkdirSync(target);
  fs.copyFileSync(original, candidate, fs.constants.COPYFILE_EXCL);
  write("before.json", {
    schema: "stemrobin1846/c6-answer350-repair-before@1",
    cwd: root, inputs, candidateBefore: bind(candidate),
    affectedExercise: "350",
    permittedFields: ["displayAnswer", "notes"],
    contentReview: "pending",
  });
  console.log(JSON.stringify({ candidate: bind(candidate), before: bind(path.join(target, "before.json")) }));
} else {
  const before = JSON.parse(fs.readFileSync(path.join(target, "before.json"), "utf8"));
  for (const input of before.inputs) assert.equal(bind(input.path).sha256, input.sha256);
  const oldKey = JSON.parse(fs.readFileSync(original, "utf8"));
  const newKey = JSON.parse(fs.readFileSync(candidate, "utf8"));
  assert.equal(newKey.status, "draft");
  const index = oldKey.answers.findIndex(answer => answer.exercise === "350");
  assert.equal(index, 15);
  const changes = Object.keys(oldKey.answers[index]).filter(
    field => JSON.stringify(oldKey.answers[index][field]) !== JSON.stringify(newKey.answers[index][field]),
  );
  assert.deepEqual(changes.sort(), ["displayAnswer", "notes"]);
  const restored = structuredClone(newKey);
  for (const field of changes) restored.answers[index][field] = oldKey.answers[index][field];
  assert.deepEqual(restored, oldKey, "Only the two permitted 350 fields may change");
  assert.ok(newKey.answers[index].displayAnswer.startsWith(oldKey.answers[index].displayAnswer));
  assert.equal(newKey.answers[index].grading, "ungraded");
  assert.equal(newKey.answers[index].source, "derived");
  assert.deepEqual(newKey.answers[index].parts, []);
  const receipt = {
    schema: "stemrobin1846/c6-answer350-scoped-diff-proof@1",
    cwd: root, original: bind(original), candidate: bind(candidate),
    inputsUnchanged: before.inputs,
    changedExercise: "350", changedFields: changes,
    other56EntriesAndPackageMetadataUnchanged: true,
    hold338Unchanged: true, originalODEAnswerPreserved: true,
    originalCandidateAndPhaseAUnchanged: true,
    scopeProof: "PASS", mathematicalReview: "pending-affected-only",
    images: 0, paidCalls: 0, finalized: false, newCompleteLessons: 0,
  };
  write("scope-proof.json", receipt);
  console.log(JSON.stringify({ proof: bind(path.join(target, "scope-proof.json")), candidate: receipt.candidate }));
}

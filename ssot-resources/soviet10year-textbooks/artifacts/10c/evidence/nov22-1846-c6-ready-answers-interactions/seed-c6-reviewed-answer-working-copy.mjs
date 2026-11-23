import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = "/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck";
assert.equal(process.cwd(), root);
const scratch = path.join(root, ".tmp/stemrobin-184-six");
const output = path.join(scratch, "c6-answer-reviewed-working-copy");
assert.ok(!fs.existsSync(output), "Do not replay this missing working-copy stage");
const hash = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const read = (file, expected) => {
  const bytes = fs.readFileSync(file);
  const sha256 = hash(bytes);
  if (expected) assert.equal(sha256, expected);
  return { file, bytes, sha256, document: JSON.parse(bytes) };
};
const answers = read(path.join(scratch, "c6-supplement-answer-350-repair/answer-keys.json"),
  "956a0a02f0ada0719c65945d970625a5f342cc708ea03db9d3b15540af8aa058");
const template = read(path.join(scratch,
  "c6-answer-first-preparation/work/10c/modern-us-neutral/lessons/ana10-c6-ex/answer-keys.template.json"),
  "cfb6a7dbdaecbd1954503aa4a36323f02c046e19d50f236d6c0536f15c05a1a6");
const editionPath = path.join(scratch,
  "c6-modern-representation-repair/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c6-ex/exercises.json");
const retainedEdition = read(path.join(root,
  "ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/nov22-1846-c6-edition-affected-finalization/retention.json"),
  "d44790175cfb97b7992eaf4d5d73e1f53658fed57603960bc7c112fc92a71e82");
const editionBinding = retainedEdition.document.retained.find(item => item.origin === editionPath);
assert.ok(editionBinding, "Reuse the retained finalized edition, not an unbound prompt copy");
const edition = read(editionPath, editionBinding.sha256);
for (const document of [answers.document, template.document]) {
  assert.equal(document.book, "10c");
  assert.equal(document.lesson, "ana10-c6-ex");
  assert.equal(document.edition, "modern-us-neutral");
  assert.equal(document.status, "draft");
}
assert.equal(answers.document.answers.length, 57);
assert.deepEqual(answers.document.answers.map(item => item.exercise),
  template.document.answers.map(item => item.exercise));
assert.deepEqual(template.document.answers.map(item => [item.exercise, item.prompt]),
  edition.document.exercises.map(item => [String(item.number), item.text]));
assert.ok(edition.document.exercises.every(item => item.figures.length === 0));
const held = answers.document.answers.filter(item => !item.displayAnswer);
assert.deepEqual(held.map(item => item.exercise), ["338"]);
assert.equal(held[0].grading, null);
assert.equal(held[0].source, null);
assert.deepEqual(held[0].parts, []);

const lesson = path.join(output,
  "artifacts/10c/editions/modern-us-neutral/lessons/ana10-c6-ex");
fs.mkdirSync(lesson, { recursive: true });
const copies = [
  [answers, "answer-keys.json"],
  [edition, "exercises.json"],
];
const bindings = copies.map(([input, name]) => {
  const destination = path.join(lesson, name);
  fs.copyFileSync(input.file, destination, fs.constants.COPYFILE_EXCL);
  assert.equal(hash(fs.readFileSync(destination)), input.sha256);
  return { origin: input.file, destination, bytes: input.bytes.length, sha256: input.sha256 };
});
const receipt = {
  status: "FIRST_REVIEWED_ANSWER_WORKING_COPY_56_REUSED_338_STILL_BLANK",
  cwd: root,
  bindings,
  officialTemplateSha256: template.sha256,
  retainedEditionManifestSha256: retainedEdition.sha256,
  orderedPromptBindings: 57,
  answerEntriesChanged: 0,
  priorReviewedAnswersReSolvedOrReviewed: 0,
  source338AndInstructionOwnershipHolds: "UNCHANGED",
  finalizerExecuted: false,
  imagesHeadersDecodesNativeJobsPaidCallsNewCompleteLessons: [0, 0, 0, 0, 0, 0],
};
const receiptPath = path.join(output, "working-copy-receipt.json");
fs.writeFileSync(receiptPath, JSON.stringify(receipt, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify({
  receipt: receiptPath, sha256: hash(fs.readFileSync(receiptPath)),
  status: receipt.status, unchangedAnswers: 57, held: "338",
}));

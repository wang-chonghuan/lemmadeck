import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(root, "../../../../..");
const inputRoot = path.resolve(root, "../d199-t16-q4-inputs");
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const load = (file) => {
  const bytes = readFileSync(file);
  return { value: JSON.parse(bytes), sha256: hash(bytes) };
};
const manifest = load(path.join(inputRoot, "manifest.json"));
assert.equal(manifest.sha256, "c22e0a3a879c0022b638a6bd37e7ed9aa1e64e594c724b1b5b493002b28f0254");
const input = load(path.join(inputRoot, "answer-inputs.json"));
assert.equal(input.sha256, "d668a71960981ce6802f7d69087905f83ca2c9cb0dfec3d729196022c70fe6ce");
assert.equal(input.sha256, manifest.value.answerInputs.sha256);
assert.equal(path.resolve(repo, manifest.value.answerInputs.path), path.join(inputRoot, "answer-inputs.json"));
assert.deepEqual(manifest.value.selected, ["4"]);
assert.deepEqual(input.value.selected, ["4"]);
assert.equal(input.value.qualifiedTextMustNotBecomeUnconditionalBookAnswer, true);
assert.equal(input.value.answerInputs.length, 2);
assert.deepEqual(input.value.answerInputs.map((entry) => entry.language).sort(), ["en", "zh"]);
for (const entry of input.value.answerInputs) {
  assert.equal(entry.question.number, "4");
  assert.equal(entry.question.source_number, "4");
  assert.equal(entry.question.group_id, "g0");
  assert.deepEqual(entry.question.figure_refs, ["fig-127"]);
  assert.equal(entry.question.lines.length, 2);
  assert.equal(entry.bookRaw.exercise, 4);
  assert.equal(entry.bookRaw.lesson, input.value.card);
}

const draft = load(path.join(root, "draft.json"));
const ledger = load(path.join(root, "actual-opens.json"));
const reasoning = load(path.join(root, "reasoning-evidence.json"));
assert.equal(draft.value.schema, "ld-s10y-answer/lesson-answers@1");
assert.equal(draft.value.status, "draft");
assert.equal(draft.value.book, "10p");
assert.equal(draft.value.edition, "modern-us-neutral");
assert.equal(draft.value.lesson, input.value.card);
assert.equal(draft.value.answers.length, 1);
const answer = draft.value.answers[0];
assert.equal(answer.exercise, "4");
assert.equal(answer.grading, "ungraded");
assert.equal(answer.source, "derived");
for (const entry of input.value.answerInputs) {
  assert.equal(answer.bookRaw, entry.bookRaw.raw);
  assert.equal(reasoning.value.bookRaw, entry.bookRaw.raw);
  assert.ok(Buffer.from(answer.bookRaw, "utf8").equals(Buffer.from(entry.bookRaw.raw, "utf8")));
}
assert.equal(hash(Buffer.from(answer.bookRaw, "utf8")), reasoning.value.bookRawUtf8Sha256);
assert.equal(reasoning.value.bookRawUtf8Sha256, "d71872b483e7d546c4f591f5b71e85e12ff2ea3df3effe03bfb847bcc6598f4e");
for (const field of ["displayAnswer", "displayAnswerEn", "notes", "notesEn"]) {
  assert.equal(typeof answer[field], "string");
  assert.ok(answer[field].length > 0);
}
assert.ok(answer.displayAnswer.startsWith("仅凭图 127，不能断言"));
assert.ok(answer.displayAnswerEn.startsWith("Figure 127 alone does not establish"));
assert.ok(answer.conditions.length > 0);
assert.equal(answer.conditions.length, answer.conditionsEn.length);
assert.ok(answer.authorDerivation.conditionalVerticalConclusion.additionalAssumptions.length > 0);
const rejectJudgingKeys = (value) => {
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    assert.ok(!["parts", "expected"].includes(key), `Forbidden judging key: ${key}`);
    rejectJudgingKeys(child);
  }
};
rejectJudgingKeys(draft.value);

const evidence = {};
for (const role of ["original", "modernPreview", "spec"]) {
  const declared = input.value.figure[role];
  const file = path.resolve(repo, declared.path);
  const sha256 = hash(readFileSync(file));
  assert.equal(sha256, declared.sha256, `${role} changed`);
  evidence[role] = { path: file, sha256 };
}
assert.equal(ledger.value.events.length, 2);
assert.equal(ledger.value.inheritedCumulativeImages, 2);
for (const [index, role] of ["original", "modernPreview"].entries()) {
  const event = ledger.value.events[index];
  assert.equal(event.batchSequence, index + 1);
  assert.equal(event.contextSequence, index + 3);
  assert.equal(event.role, role);
  assert.equal(event.tool, "functions.view_image");
  assert.equal(event.path, evidence[role].path);
  assert.equal(event.sha256, evidence[role].sha256);
  assert.equal(event.actualOpens, 1);
}
assert.equal(ledger.value.specRead.sha256, evidence.spec.sha256);
assert.equal(ledger.value.counts.newOriginalOpens, 1);
assert.equal(ledger.value.counts.newModernPreviewOpens, 1);
assert.equal(ledger.value.counts.newBatchImages, 2);
assert.equal(ledger.value.counts.inheritedCumulativeImages, 2);
assert.equal(ledger.value.counts.D032CumulativeImages, 4);
assert.equal(ledger.value.counts.currentContextCumulativeImages, 4);
assert.equal(ledger.value.counts.reopens, 0);
assert.equal(ledger.value.counts.crops, 0);
assert.ok(ledger.value.counts.newBatchImages <= 8);
assert.ok(ledger.value.counts.currentContextCumulativeImages <= 24);
assert.equal(ledger.value.imagePayloadReturnedToParent, false);
assert.equal(reasoning.value.input.sha256, input.sha256);
assert.equal(reasoning.value.manifest.sha256, manifest.sha256);
assert.equal(reasoning.value.witnessesAreConstructedNotFigureData, true);

const dot = (u, v) => u.reduce((sum, component, index) => sum + component * v[index], 0);
const cross = (u, v) => [
  u[1] * v[2] - u[2] * v[1],
  u[2] * v[0] - u[0] * v[2],
  u[0] * v[1] - u[1] * v[0],
].map((component) => component === 0 ? 0 : component);
const isVertical = (u) => u[0] === 0 && u[1] === 0 && u[2] !== 0;
const axis = [1, 0, 0];
// These dimensionless examples test logical sufficiency, not measured antenna data.
const cases = [
  { id: "horizontal-propagation-matched", k: [0, 1, 0], E: [1, 0, 0] },
  { id: "tilted-propagation-matched", k: [0, 1, 1], E: [1, 0, 0] },
  { id: "horizontal-propagation-unmatched", k: [0, 1, 0], E: [1, 0, 1] },
  { id: "reversed-propagation-matched", k: [0, -1, 0], E: [1, 0, 0] },
].map((entry, index) => {
  const Bdirection = cross(entry.k, entry.E);
  const recorded = reasoning.value.cases[index];
  assert.equal(recorded.id, entry.id);
  assert.deepEqual(recorded.k, entry.k);
  assert.deepEqual(recorded.E, entry.E);
  assert.deepEqual(recorded.Bdirection, Bdirection);
  assert.equal(dot(entry.k, entry.E), 0);
  assert.equal(recorded.kDotE, 0);
  assert.equal(dot(Bdirection, entry.k), 0);
  assert.equal(dot(Bdirection, entry.E), 0);
  assert.equal(recorded.antennaAxisDotE, dot(axis, entry.E));
  assert.ok(dot(axis, entry.E) > 0);
  const energyDirection = cross(entry.E, Bdirection);
  assert.equal(dot(energyDirection, entry.k) > 0, true);
  return { ...entry, Bdirection, vertical: isVertical(Bdirection) };
});
assert.equal(reasoning.value.cases.length, cases.length);
assert.deepEqual(cases.map((entry) => entry.vertical), [true, false, false, true]);
assert.deepEqual(cases[3].Bdirection.map((component) => component === 0 ? 0 : -component), cases[0].Bdirection);
assert.ok(cross(axis, cases[2].E).some((component) => component !== 0));

const output = {
  status: "author-mechanical-and-vector-checks-completed",
  independentReview: "pending-parent-dispatch",
  manifestSha256: manifest.sha256,
  inputSha256: input.sha256,
  artifacts: {
    "draft.json": draft.sha256,
    "actual-opens.json": ledger.sha256,
    "reasoning-evidence.json": reasoning.sha256,
    "verify.mjs": hash(readFileSync(fileURLToPath(import.meta.url))),
  },
  evidence,
  cases,
  bookRawUtf8Sha256: reasoning.value.bookRawUtf8Sha256,
  bookRawExact: true,
  source: answer.source,
  grading: answer.grading,
  forbiddenJudgingKeysAbsent: true,
  imageOpens: { inherited: 2, newOriginal: 1, newModernPreview: 1, newBatch: 2, D032Cumulative: 4, currentContextCumulative: 4 },
  imageProvenance: "Actual view_image calls are recorded in the ledger; file hashing is not evidence of an image open.",
};
if (process.argv.includes("--frozen")) {
  const report = load(path.join(root, "report.json"));
  const freeze = load(path.join(root, "author-freeze.json"));
  assert.equal(report.value.independentReview.status, "pending-parent-dispatch");
  assert.equal(report.value.independentReview.selfSignedPass, false);
  assert.equal(freeze.value.status, "authored-frozen-awaiting-independent-review");
  assert.equal(freeze.value.selfSignedPass, false);
  assert.deepEqual(freeze.value.selected, ["4"]);
  assert.equal(freeze.value.input.sha256, input.sha256);
  assert.equal(freeze.value.manifest.sha256, manifest.sha256);
  for (const [file, sha256] of Object.entries(output.artifacts)) {
    assert.equal(report.value.artifacts[file], sha256);
    assert.equal(freeze.value.files[file], sha256);
  }
  assert.equal(freeze.value.files["report.json"], report.sha256);
  assert.equal(report.value.imageBudget.inheritedCumulativeImages, 2);
  assert.equal(report.value.imageBudget.currentContextCumulativeImages, 4);
  assert.equal(freeze.value.actualImages.currentContextCumulative, 4);
  output.artifacts["report.json"] = report.sha256;
  output.artifacts["author-freeze.json"] = freeze.sha256;
  output.freezeBindingsChecked = true;
}
console.log(JSON.stringify(output, null, 2));

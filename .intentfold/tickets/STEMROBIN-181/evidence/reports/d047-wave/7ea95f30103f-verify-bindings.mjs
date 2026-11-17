import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Read-only checks; stdout is the sole output. Semantic review remains manual.
const evidenceRoot = path.dirname(fileURLToPath(import.meta.url));
const tmpRoot = path.dirname(evidenceRoot);
const authorRoot = path.join(tmpRoot, "d047-n39-answer-author");
const lesson = "phy10-c1-s5-n39";
const json = (file) => JSON.parse(readFileSync(file, "utf8"));
const hash = (file) =>
  createHash("sha256").update(readFileSync(file)).digest("hex");
const expected = {
  result: "95b7c9a13793c0439de01a9e3b70a6667c6c1d57267339f1cc0742754db76ccf",
  raw: "0b9a844e43ef2900a63eacf0cb97a5c1dee1cc57a6dccef37af9ad3cb90638af",
  prepare: "79f21a4e45c23ce7f5be01a03974c676ba0ee620fd6ebc3ce5e10aa2fffd464f",
  en: "8d9cdc71cf7bf43ad4db05f4c44e806ef635445e44d1ac5b565cf23a58b4a46f",
  zh: "5f758862da351416a95db53ff975ed6a0ff757b203f31469ff63fb6d08d86e00",
};
assert.equal(hash(path.join(authorRoot, "result.json")), expected.result);
assert.equal(
  hash(path.join(evidenceRoot, "independent-raw-solutions.md")),
  expected.raw,
);
assert.equal(hash(path.join(authorRoot, "prepare-receipt.json")), expected.prepare);
const result = json(path.join(authorRoot, "result.json"));
const prepared = json(path.join(authorRoot, "prepare-receipt.json"));
assert.equal(prepared.inputs.length, 48);
assert.equal(result.inputChecks.length, 48);
for (const binding of prepared.inputs) {
  assert.equal(hash(binding.source.path), binding.source.sha256);
  assert.equal(hash(binding.snapshot.path), binding.snapshot.sha256);
  assert.equal(binding.source.sha256, binding.snapshot.sha256);
}
for (const binding of result.inputChecks) {
  assert.equal(hash(binding.path), binding.preparedSha256);
  assert.equal(binding.currentSha256, binding.preparedSha256);
  assert.equal(binding.snapshotUnchanged, true);
}
assert.equal(prepared.canonicalAnswerEvidence.matchingN39, 0);
const summary = [];
for (const language of result.languages) {
  const locale = language.language;
  const draft = json(language.frozenDraft.path);
  assert.equal(hash(language.frozenDraft.path), expected[locale]);
  assert.equal(hash(language.draft.path), expected[locale]);
  assert.equal(draft.schema, "ld-s10y-answer/lesson-answers@1");
  assert.equal(draft.book, "10p");
  assert.equal(draft.lesson, lesson);
  assert.equal(draft.edition, "modern-us-neutral");
  assert.equal(draft.status, "draft");
  assert.equal(draft.count, 6);
  assert.equal(draft.answers.length, 6);
  const editionRoot = path.join(
    authorRoot, locale, "root/10p/editions/modern-us-neutral",
  );
  const lessonRoot = path.join(editionRoot, "lessons", lesson);
  const tasks = json(path.join(lessonRoot, "exercises.json"));
  const command = prepared.commands.find((entry) => entry.language === locale);
  assert.equal(command.exitCode, 0);
  assert.equal(hash(command.template.path), command.template.sha256);
  const template = json(command.template.path);
  assert.deepEqual(
    draft.answers.map((answer) => answer.exercise),
    tasks.exercises.map((task) => task.number),
  );
  assert.deepEqual(
    template.answers.map((answer) => answer.exercise),
    tasks.exercises.map((task) => task.number),
  );
  assert.equal(new Set(draft.answers.map((answer) => answer.exercise)).size, 6);
  for (const [index, answer] of draft.answers.entries()) {
    assert.equal(tasks.exercises[index].group_id, "g1");
    assert.equal(tasks.exercises[index].source_number, String(index + 1));
    assert.equal(template.answers[index].prompt, tasks.exercises[index].text);
    assert.equal(answer.grading, "ungraded");
    assert.equal(answer.source, "derived");
    assert.deepEqual(answer.parts, []);
    assert.equal(typeof answer.displayAnswer, "string");
    assert.ok(answer.displayAnswer.trim());
    assert.deepEqual(
      Object.keys(answer).sort(),
      ["exercise", "grading", "source", "displayAnswer", "parts"].sort(),
    );
  }
  assert.equal(existsSync(path.join(lessonRoot, "interactions.json")), false);
  const figureEvidence = template.answers[5].figureEvidence;
  assert.equal(figureEvidence.length, 1);
  assert.equal(figureEvidence[0].id, "fig-70");
  assert.equal(
    hash(figureEvidence[0].originalPng),
    "8cf1965d548aad41c46aa2a6c77017789a078b1aab470306ce9ecdd96bb75d65",
  );
  assert.equal(
    hash(figureEvidence[0].editionAsset),
    "4bae69e25800526c2b16adca5af0d6c71bb013159e240e6d4474e72cd15fba9f",
  );
  assert.equal(
    hash(figureEvidence[0].figureSpec),
    "dcdf95bb6d3e4b47e184400c369efc376947e9eed77432423cd4c5f0bb4f1e36",
  );
  const spec = json(figureEvidence[0].figureSpec);
  assert.equal(hash(spec.source.image.path), spec.source.image.sha256);
  const points = new Map(
    spec.objects.filter((object) => object.type === "point")
      .map((object) => [object.id, object.at]),
  );
  const x = (row, number) =>
    points.get(`source-${row}-ball-${String(number).padStart(2, "0")}`)[0];
  const adjacent = x("e", 2) - x("e", 1);
  const wavelength = x("e", 13) - x("e", 1);
  assert.equal(adjacent, 56);
  assert.equal(wavelength, 672);
  assert.equal(wavelength / adjacent, 12);
  assert.equal(x("f", 14) - x("f", 2), wavelength);
  assert.equal(x("f", 15) - x("f", 3), wavelength);
  summary.push({
    language: locale,
    answers: 6,
    ungraded: 6,
    derived: 6,
    parts: 0,
    auto: 0,
    bookRaw: 0,
    interactions: 0,
    draftSha256: expected[locale],
    adjacentIntervalsPerWavelength: 12,
  });
}
const reportPath = path.join(tmpRoot, "d047-n39-answer-review.json");
if (existsSync(reportPath)) {
  const report = json(reportPath);
  assert.equal(report.semanticGate, "PASS");
  assert.equal(report.defects.length, 0);
  assert.equal(report.imageOpens.count, 2);
  for (const image of report.imageOpens.images) {
    assert.equal(hash(image.path), image.sha256);
  }
  assert.equal(hash(report.independentSolutions.path), report.independentSolutions.sha256);
  assert.equal(hash(report.authorResult.path), report.authorResult.sha256);
  assert.equal(hash(report.preparedReceipt.path), report.preparedReceipt.sha256);
}
console.log(JSON.stringify({
  status: "PASS",
  preparedSourceSnapshotPairsVerified: prepared.inputs.length,
  authorInputChecksVerified: result.inputChecks.length,
  originalBookN39Answers: 0,
  summary,
  writes: 0,
  finalizeInvocations: 0,
}, null, 2));

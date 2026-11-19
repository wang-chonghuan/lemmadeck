import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const own = dirname(fileURLToPath(import.meta.url));
const expectedOwn = resolve(
  root,
  ".intentfold/tickets/STEMROBIN-181/tmp/d849-n87-first-written-answer-author",
);
assert.equal(own, expectedOwn);
assert.equal(process.cwd(), root);
const target = (name) => resolve(own, name);
const digest = (path) =>
  createHash("sha256").update(readFileSync(path)).digest("hex");
const load = (path) => JSON.parse(readFileSync(path, "utf8"));
const saveFirst = (name, data) =>
  writeFileSync(target(name), `${JSON.stringify(data, null, 2)}\n`, { flag: "wx" });

// Refuse to overwrite a previous FIRST receipt, including a failed one.
assert.equal(existsSync(target("checks-FIRST.json")), false);
assert.equal(existsSync(target("output-hashes.json")), false);
const errors = [];
const observedInputs = [];
const localeChecks = [];
try {
  const manifest = load(target("input-hashes.json"));
  for (const input of manifest.inputs) {
    const sha256 = digest(resolve(root, input.path));
    observedInputs.push({ path: input.path, sha256, matches: sha256 === input.sha256 });
  }
  assert.ok(observedInputs.every((input) => input.matches), "Input hash drift");
  const prepBase = resolve(
    root,
    ".intentfold/tickets/STEMROBIN-181/tmp/d836-source233-consume-n87-prepare",
  );
  const source = load(resolve(prepBase, "root/10p/lessons/phy10-c2-s3-n87/exercises.json"));
  const book = load(resolve(prepBase, "root/10p/book.json"));
  const preparation = load(resolve(prepBase, "n87-preparation.json"));
  const requirements = load(resolve(prepBase, "n87-preauthor-source-requirements.json"));
  assert.equal(book.exercise_numbering, "lesson");
  assert.equal(source.count, 6);
  assert.equal(preparation.sourceQuestions, 6);
  assert.equal(requirements.sourceQuestions, 6);
  for (const [key, input] of [
    ["requirements", "n87-preauthor-source-requirements.json"],
    ["rawLesson", "root/10p/lessons/phy10-c2-s3-n87/lesson.json"],
    ["rawExercises", "root/10p/lessons/phy10-c2-s3-n87/exercises.json"],
  ]) {
    assert.equal(preparation[key].sha256, digest(resolve(prepBase, input)));
  }
  for (const locale of ["zh", "en"]) {
    const modernPath = resolve(
      root,
      `.intentfold/tickets/STEMROBIN-181/tmp/d837-n87-first-bilingual-text-author/candidate/${locale}/exercises.template.json`,
    );
    const modern = load(modernPath);
    const document = load(target(`candidate/${locale}/answer-keys.candidate.json`));
    assert.equal(modern.locale, locale);
    assert.equal(modern.source.sha256, preparation.rawExercises.sha256);
    assert.equal(modern.edition, "modern-us-neutral");
    assert.equal(document.schema, "ld-s10y-answer/lesson-answers@1");
    assert.equal(document.book, "10p");
    assert.equal(document.lesson, source.lesson);
    assert.equal(document.edition, modern.edition);
    assert.equal(document.status, "draft");
    assert.deepEqual(Object.keys(document).sort(),
      ["schema", "book", "lesson", "edition", "status", "answers"].sort());
    assert.equal(document.answers.length, 6);
    assert.equal(modern.exercises.length, 6);
    const identities = [];
    for (const [index, answer] of document.answers.entries()) {
      const raw = source.exercises[index];
      const prompt = modern.exercises[index];
      for (const field of ["number", "source_number", "group", "group_id", "pages", "figure_refs", "figures"]) {
        assert.deepEqual(prompt[field], raw[field], `${locale}/${index + 1}/${field}`);
      }
      assert.equal(answer.exercise, String(raw.number));
      assert.equal(answer.prompt, prompt.text);
      assert.equal(answer.grading, "ungraded");
      assert.equal(answer.source, "derived");
      assert.deepEqual(answer.parts, []);
      assert.deepEqual(answer.figureEvidence, []);
      assert.deepEqual(answer.historical_entities, []);
      assert.ok(typeof answer.displayAnswer === "string" && answer.displayAnswer.trim());
      assert.deepEqual(Object.keys(answer).sort(),
        ["exercise", "prompt", "figureEvidence", "grading", "source", "displayAnswer", "parts", "historical_entities"].sort());
      identities.push({
        exercise: answer.exercise,
        source_number: raw.source_number,
        group: raw.group,
        group_id: raw.group_id,
        pages: raw.pages,
      });
    }
    localeChecks.push({ locale, answers: 6, nativeStatus: document.status, identities });
  }
} catch (error) {
  errors.push({ name: error.name, message: error.message });
}

saveFirst("checks-FIRST.json", {
  stage: "FIRST-written-answer-author",
  scope: "bounded JSON/identity/hash checks only; not independent review or native gate approval",
  structuralStatus: errors.length ? "FAIL" : "PASS",
  selfApproval: false,
  inputHashes: observedInputs,
  locales: localeChecks,
  errors,
});
const names = [
  "candidate/zh/answer-keys.candidate.json",
  "candidate/en/answer-keys.candidate.json",
  "derivations.md",
  "input-hashes.json",
  "usage.json",
  "report.json",
  "record-FIRST.mjs",
  "checks-FIRST.json",
];
const outputs = names.map((path) => ({ path, sha256: digest(target(path)) }));
saveFirst("output-hashes.json", { algorithm: "sha256", ownedRoot: own, outputs });
console.log(JSON.stringify({ structuralStatus: errors.length ? "FAIL" : "PASS", errors, outputs }, null, 2));
process.exitCode = errors.length ? 1 : 0;

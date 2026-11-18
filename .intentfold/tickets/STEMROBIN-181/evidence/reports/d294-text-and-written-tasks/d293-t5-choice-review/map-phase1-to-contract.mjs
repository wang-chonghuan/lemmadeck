import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(root, "../../../../..");
const authorRoot = path.resolve(root, "../d291-t5-choice-author");
const sha = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const readBound = (filename, expected, immutable = false) => {
  const bytes = fs.readFileSync(filename);
  assert.equal(sha(bytes), expected, filename);
  if (immutable) assert.equal(fs.statSync(filename).mode & 0o777, 0o444, filename);
  return JSON.parse(bytes);
};
const ordered = (value) => {
  if (Array.isArray(value)) return value.map(ordered);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, ordered(value[key])]));
  }
  return value;
};
const digest = (value) => sha(Buffer.from(JSON.stringify(ordered(value))
  .replace(/[\u007f-\uffff]/g, (character) =>
    `\\u${character.charCodeAt(0).toString(16).padStart(4, "0")}`)));
const writeNew = (filename, value) => {
  fs.mkdirSync(path.dirname(filename), { recursive: true });
  const bytes = Buffer.from(`${JSON.stringify(value, null, 2)}\n`);
  fs.writeFileSync(filename, bytes, { flag: "wx" });
  return { path: filename, sha256: sha(bytes), bytes: bytes.length };
};

const phase1Path = path.join(root, "phase1-visible-review.json");
const phase1Hash = "7c1a68513436820a129a290319cbee0462c171fe03fd648ba825b89cd3fbce01";
const phase1 = readBound(phase1Path, phase1Hash, true);
const manifest = readBound(phase1.snapshotBindings.manifest.path,
  phase1.snapshotBindings.manifest.sha256);
const freezePath = path.join(authorRoot, "author-freeze.json");
const freezeHash = "cb31333b33c746d8223f14e70b2a947d35593b7b5791383324718c73662f28cd";
const freeze = readBound(freezePath, freezeHash, true);
readBound(freeze.report.path, "3e2f9f5b8ea9c6043f34a105ef2a6fb9e82cb081c54e27d7cf009f8266d71f60", true);
const reviewer = {
  kind: "independent_agent",
  identity: "Raman, same existing SOURCE reviewer; independent of Galileo's d291 choice author. One sequential review, phase1 frozen before key disclosure; d288 answers are not the authority."
};
const check = ({ verdict, evidence }) => ({ verdict, evidence });
const outputs = [];

for (const language of phase1.snapshotBindings.languages) {
  const entry = manifest.results.find((item) => item.language === language.language);
  const author = freeze.outputs.find((item) => item.language === language.language);
  assert.ok(entry && author);
  assert.equal(path.resolve(repo, entry.repository), language.repo);
  assert.equal(path.resolve(repo, entry.seed.path), language.seed.path);
  const seed = readBound(language.seed.path, language.seed.sha256);
  const visible = readBound(language.visible.path, language.visible.sha256, true);
  const draft = readBound(author.draft.path, author.draft.sha256, true);
  assert.deepEqual(draft.questions.map((question) => question.view), visible);
  assert.deepEqual(draft.new_figures, []);
  assert.deepEqual(seed.figures, []);
  assert.deepEqual(seed.exercises.map((exercise) => exercise.number),
    phase1.packageReview.seedSourceNumbers);
  assert.equal(digest(seed), author.canonicalSeedDigest);
  assert.equal(digest(draft), author.canonicalDraftDigest);
  assert.equal(draft.seed_sha256, digest(seed));
  assert.equal(draft.questions.length, phase1.questionReviews.length);
  const mappings = [];
  let optionTruthMatches = 0;

  const questionReviews = draft.questions.map((question, index) => {
    const frozen = phase1.questionReviews[index];
    assert.equal(frozen.visiblePointers[language.language], `/${index}`);
    assert.deepEqual(question.source_numbers, frozen.sourceNumbers);
    assert.equal(question.view.mode, frozen.mode);
    assert.deepEqual([...question.key.correct].sort(), [...frozen.mathematics.correct].sort());
    assert.equal(question.key.rationales.length, frozen.mathematics.optionChecks.length);
    for (const rationale of question.key.rationales) {
      const option = frozen.mathematics.optionChecks.find((item) => item.optionId === rationale.option_id);
      assert.ok(option);
      assert.equal(rationale.truth, option.truth);
      optionTruthMatches += 1;
    }
    const coverage = draft.coverage.find((row) => row.source_number === frozen.sourceNumbers[0]);
    assert.ok(coverage);
    assert.deepEqual(coverage.question_ids, [question.id]);
    mappings.push({
      index,
      phase1Ref: frozen.questionRef,
      questionId: question.id,
      sourceNumbers: question.source_numbers,
      visibleProjectionUnchanged: true,
      keyMatchesFrozenIndependentSet: true,
      optionTruthMatches: question.key.rationales.length
    });
    return {
      question_id: question.id,
      task_fidelity: check(frozen.taskFidelity),
      redundancy: check(frozen.redundancy),
      answer_leakage: check(frozen.answerLeakage),
      mathematics: {
        verdict: frozen.mathematics.verdict,
        independent_solution: frozen.mathematics.independentSolution,
        correct: frozen.mathematics.correct,
        option_checks: frozen.mathematics.optionChecks.map((option) => ({
          option_id: option.optionId,
          truth: option.truth,
          evidence: option.evidence
        }))
      }
    };
  });
  const review = {
    schema: "s10y-choice-review-v1",
    seed_sha256: digest(seed),
    draft_sha256: digest(draft),
    reviewer,
    source_reviews: phase1.sourceReviews.map((source) => ({
      source_number: source.sourceNumber,
      independent_solution: source.independentSolution,
      coverage: check(source.coverage)
    })),
    figure_checks: [],
    new_figure_reviews: [],
    question_reviews: questionReviews,
    outcome: phase1.outcome
  };
  const output = writeNew(path.join(root, language.language, "review.json"), review);
  outputs.push({
    language: language.language,
    repo: language.repo,
    seed: language.seed,
    draft: author.draft,
    review: output,
    canonicalSeedDigest: review.seed_sha256,
    canonicalDraftDigest: review.draft_sha256,
    mappings,
    optionTruthMatches,
    outcome: review.outcome
  });
}

const receipt = writeNew(path.join(root, "mapping.receipt.json"), {
  schema: "d293-phase1-contract-mapping-receipt@1",
  phase1: { path: phase1Path, sha256: phase1Hash, unchanged: true },
  authorFreeze: { path: freezePath, sha256: freezeHash },
  reviewer,
  method: "Mechanical schema projection of frozen semantic evidence; map IDs/source_numbers only after exact visible-array equality. No source solving, option re-evaluation or bilingual view review.",
  canonicalDigestsIndependentlyComputedAndMatchFreeze: true,
  newImages: 0,
  cumulativeImages: 24,
  outputs,
  exitCode: 0
});
console.log(JSON.stringify({ receipt, outputs: outputs.map(({ language, review }) => ({ language, review })) }, null, 2));

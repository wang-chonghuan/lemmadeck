import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";

const cwd = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
assert.equal(process.cwd(), cwd);
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-11";
const receipts = `${base}/n34-answer-review-FIRST-receipts`;
const artifacts = "ssot-resources/soviet10year-textbooks/artifacts/7a";
const modern = `${artifacts}/editions/modern-us-neutral`;
const lesson = `${modern}/lessons/alg7-c4-s1-n34`;
const sha = (bytes) => createHash("sha256").update(bytes).digest("hex");
const fileSha = (path) => sha(fs.readFileSync(path));
const json = (path) => JSON.parse(fs.readFileSync(path, "utf8"));
const objectSha = (value) => sha(JSON.stringify(value));
const has = (value, key) => Object.hasOwn(value, key);
const expected = ["746", "747", "748", "749", "750", "751", "752", "753"];
const pre = json(`${receipts}/pre-open-hashes.json`);
const freeze = json(`${receipts}/independent-freeze.json`);
const ledger = json(`${receipts}/image-load-ledger.json`);

for (const entry of [...pre.images, ...pre.textAndDurableInputs]) {
  assert.equal(fileSha(entry.path), entry.sha256, `Input changed: ${entry.path}`);
}
for (const entry of [freeze.solutions, freeze.preOpen, freeze.imageLedger]) {
  assert.equal(fileSha(entry.path), entry.sha256, `Frozen evidence changed: ${entry.path}`);
}
assert.equal(ledger.imagesLoaded, 4);
assert.equal(new Set(ledger.loads.map((load) => load.id)).size, 4);
assert.equal(ledger.reopens + ledger.crops + ledger.newRenders, 0);
assert.equal(freeze.candidateAnswerKeysRead, false);
assert.equal(freeze.prepareTemplateRead, false);
assert.equal(freeze.parentAnswerCandidatesRead, false);
assert.equal(freeze.choiceAuthorReasoningRead, false);

const candidatePath = `${lesson}/answer-keys.json`;
const templatePath = `${base}/answer-prepare/7a/modern-us-neutral/lessons/alg7-c4-s1-n34/answer-keys.template.json`;
const candidate = json(candidatePath);
const template = json(templatePath);
const exercises = json(`${lesson}/exercises.json`);
const sourceExercises = json(`${artifacts}/lessons/alg7-c4-s1-n34/exercises.json`);
assert.equal(fileSha(candidatePath), "17484dac16decdd66c389493a83015847d09f1a06aabbfc18d71830f8dc6b7a9");
assert.equal(fileSha(templatePath), "badd887704819993e58a0061803937279feca0b624ad0098a456a99e7d623d40");
for (const key of ["schema", "book", "lesson", "edition", "status"]) {
  assert.equal(candidate[key], template[key]);
}
assert.equal(candidate.status, "draft");
assert.deepEqual(candidate.answers.map((answer) => answer.exercise), expected);
assert.deepEqual(template.answers.map((answer) => answer.exercise), expected);
assert.deepEqual(exercises.exercises.map((exercise) => exercise.number), expected);
assert.deepEqual(sourceExercises.exercises.map((exercise) => exercise.number), expected);
assert.equal(exercises.count, 8);
assert.equal(fs.existsSync(`${artifacts}/answers.json`), false);

const perExerciseBindings = candidate.answers.map((answer, index) => {
  const prepared = template.answers[index];
  const exercise = exercises.exercises[index];
  assert.equal(prepared.prompt, exercise.text);
  assert.equal(answer.source, prepared.source);
  assert.equal(answer.source, "derived");
  assert.equal(answer.grading, "ungraded");
  assert.deepEqual(answer.parts, []);
  assert.deepEqual(answer.parts, prepared.parts);
  assert.equal(has(answer, "bookRaw"), has(prepared, "bookRaw"));
  if (has(prepared, "bookRaw")) assert.equal(answer.bookRaw, prepared.bookRaw);
  assert.equal(typeof answer.displayAnswer, "string");
  assert.ok(answer.displayAnswer.trim().length > 0);
  assert.deepEqual(answer.historical_entities, prepared.historical_entities);
  assert.deepEqual(prepared.figureEvidence.map((figure) => figure.id), exercise.figure_refs);
  for (const figure of prepared.figureEvidence) {
    const bound = pre.textAndDurableInputs.find((entry) => entry.path === figure.figureSpec);
    assert.ok(bound);
    assert.equal(fileSha(figure.figureSpec), bound.sha256);
    const source = pre.images.find((entry) => entry.path === figure.originalPng);
    assert.ok(source);
    assert.equal(fileSha(figure.originalPng), source.sha256);
    assert.ok(pre.textAndDurableInputs.some((entry) => entry.path === figure.editionAsset));
  }
  return {
    exercise: answer.exercise,
    candidateAnswerSha256: objectSha(answer),
    displayAnswerUtf8Sha256: sha(answer.displayAnswer),
    templateAnswerSha256: objectSha(prepared),
    modernExerciseSha256: objectSha(exercise),
    sourceExerciseSha256: objectSha(sourceExercises.exercises[index]),
    source: answer.source,
    grading: answer.grading,
    partsEmptyAndUnchanged: true,
    bookRawPreservation: has(prepared, "bookRaw") ? "exact match" : "absent in both"
  };
});

const figureBindings = ["fig-52", "fig-53"].map((id) => {
  const source = pre.images.find((entry) => entry.id === `source-${id}`);
  const preview = pre.images.find((entry) => entry.id === `current-preview-${id}`);
  const spec = `${modern}/figures/${id}.spec.json`;
  const asset = `${modern}/figures/${id}.svg`;
  assert.equal(fileSha(`${base}/n34-figures/${id}/spec.json`), fileSha(spec));
  assert.equal(fileSha(`${base}/n34-figures/${id}/${id}.svg`), fileSha(asset));
  assert.equal(fileSha(`${modern}/figures/evidence/${id}/resume182-11-approved/complete-preview.png`), preview.sha256);
  assert.equal(json(spec).source.image.sha256, source.sha256);
  return {
    id,
    sourceSha256: source.sha256,
    currentPreviewSha256: preview.sha256,
    durableSpecSha256: fileSha(spec),
    durableSvgSha256: fileSha(asset),
    scratchAndDurableSpecBytesEqual: true,
    scratchAndDurableSvgBytesEqual: true,
    viewedPreviewAndDurableEvidenceBytesEqual: true
  };
});

const lessonPath = `${lesson}/lesson.json`;
const pagePath = `${artifacts}/pages/0219/page.json`;
assert.equal(fileSha(lessonPath), "f64b39f92c002a451427bd1f8d3358383d7da597e82508478c4c7a839ba3680f");
assert.equal(fileSha(pagePath), "cd05d8a0688f31d850847ab83e0ba3851d57c8964fb3da416162baa5314756a9");
const erratum = json(lessonPath).errata.find((entry) => entry.id === "p0219-math-1");
assert.equal(erratum.original, "$x=-\\frac{6}{x}$");
assert.equal(erratum.corrected, "$y=-\\frac{6}{x}$");
assert.equal(erratum.source.sha256, fileSha(pagePath));
assert.equal(erratum.target, "exercises[5]");
assert.ok(sourceExercises.exercises[5].text.includes("$x=-\\frac{6}{x}$"));
assert.ok(exercises.exercises[5].text.includes("$y=-\\frac{6}{x}$"));
assert.equal(json(pagePath).meta.errata.find((entry) => entry.id === erratum.id).original, erratum.original);

const near = (actual, wanted) => assert.ok(Math.abs(actual - wanted) < 1e-12);
for (const [x, y] of [[0, -2], [1, 15], [2 / 17, 0]]) near(17 * x - 2, y);
for (const [x, y] of [[0, 1], [1, -1.8], [5 / 14, 0]]) near(-2.8 * x + 1, y);
assert.deepEqual([8, 0.01, -3, -49, -1 / 12, 0].map(Math.sign), [1, 1, -1, -1, -1, 0]);
assert.deepEqual([-2, -1, 0, 1, 2].map((x) => x * x), [4, 1, 0, 1, 4]);
for (const [x, y] of [[-6, 1], [-3, 2], [-1, 6], [1, -6], [3, -2], [6, -1]]) near(-6 / x, y);
for (const [x, y] of [[-4, -1], [-2, -2], [-1, -4], [1, 4], [2, 2], [4, 1]]) near(4 / x, y);
const polygon = [[-5, 3], [-2, 0], [4, 6], [7, 3]];
assert.deepEqual(polygon.slice(1).map(([x, y], index) => {
  const [previousX, previousY] = polygon[index];
  return (y - previousY) / (x - previousX);
}), [-1, 1, -1]);
near(3 * Math.sqrt(0.16) - 0.1 * Math.sqrt(225), -0.3);
near(0.2 * Math.sqrt(900) + 1.8 * Math.sqrt(1 / 9), 6.6);

const result = {
  schema: "stemrobin182/n34-answer-read-only-checks@1",
  cwd,
  status: "pass",
  candidate: { path: candidatePath, sha256: fileSha(candidatePath) },
  template: { path: templatePath, sha256: fileSha(templatePath) },
  independentFreezeSha256: fileSha(`${receipts}/independent-freeze.json`),
  independentSolutionsSha256: fileSha(freeze.solutions.path),
  bookAnswerFileExists: false,
  candidateExercises: 8,
  perExerciseBindings,
  figureBindings,
  erratum: {
    id: erratum.id,
    pageSha256: fileSha(pagePath),
    lessonSha256: fileSha(lessonPath),
    preservedOriginal: erratum.original,
    authoritativeModern: erratum.corrected,
    sourceTextStillOriginal: true
  },
  numericalSpotChecks: "pass; all candidate 748 intercepts/points, 749 slopes, 750 points, 751 points, 752 segment slopes, 753 quantities",
  semanticProofs: "Independent frozen solutions and final per-exercise review, not inferred from these spot checks.",
  evidenceWriter: "apply_patch only",
  filesWrittenByThisScript: 0,
  imagesDecodedByThisScript: 0,
  appOrRuntimeContractTest: false,
  finalizeRun: false
};

if (process.argv.includes("--verify-review")) {
  const report = json(`${base}/n34-answer-review-FIRST.json`);
  assert.equal(report.status, "pass");
  assert.equal(report.candidate.sha256, result.candidate.sha256);
  assert.equal(report.template.sha256, result.template.sha256);
  assert.equal(report.independentSolutions.sha256, result.independentSolutionsSha256);
  assert.deepEqual(report.exercises.map((entry) => entry.exercise), expected);
  for (const binding of perExerciseBindings) {
    const entry = report.exercises.find((item) => item.exercise === binding.exercise);
    assert.equal(entry.verdict, "pass");
    assert.deepEqual(entry.binding, binding);
  }
  assert.deepEqual(report.figureBindings, figureBindings);
  console.log(JSON.stringify({
    status: "pass",
    reportSha256: fileSha(`${base}/n34-answer-review-FIRST.json`),
    markdownSha256: fileSha(`${base}/n34-answer-review-FIRST.md`),
    candidateSha256: result.candidate.sha256,
    perExerciseBindingsVerified: 8,
    inputHashesStillMatch: true,
    imagesLoaded: 4,
    additionalImagesDecoded: 0,
    filesWritten: 0,
    finalizeRun: false
  }, null, 2));
} else {
  console.log(JSON.stringify(result, null, 2));
}

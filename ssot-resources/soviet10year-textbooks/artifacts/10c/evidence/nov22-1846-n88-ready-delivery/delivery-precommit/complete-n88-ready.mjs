import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";

const root = "/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck";
assert.equal(process.cwd(), root);
const [recoveryReport, recoveryHash] = process.argv.slice(2);
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const bind = file => ({ path: file, sha256: hash(fs.readFileSync(file)) });
assert.equal(bind(recoveryReport).sha256, recoveryHash);
const scratch = ".tmp/stemrobin-184-six";
const book = "ssot-resources/soviet10year-textbooks/artifacts/10c";
const lesson = "ana10-c6-s3-n88";
const directory = `${book}/editions/modern-us-neutral/lessons/${lesson}`;
const evidence = `${book}/evidence/nov22-1846-n88-ready-delivery`;
const target = `${evidence}/completion.json`;
assert.ok(!fs.existsSync(target), "Do not replay completed lesson sealing");
const read = file => JSON.parse(fs.readFileSync(file));
assert.equal(read(recoveryReport).status, "PASS");
const draft = read(`${directory}/choice-set/draft.json`);
const result = {
  schema: "stemrobin1846/offline-review-ready-lesson@1",
  status: "OFFLINE_REVIEW_READY", date: "2026-11-22",
  cwd: root, book: "10c", lesson, edition: "modern-us-neutral", finish: "review",
  sourceExercises: read(`${directory}/exercises.json`).exercises.length,
  figures: read(`${directory}/figures.json`).figures.length,
  answers: read(`${directory}/answer-keys.json`).count,
  interactions: read(`${directory}/interactions.json`).count,
  choiceQuestions: draft.questions.length,
  choiceOptions: draft.questions.reduce((sum, question) => sum + question.view.options.length, 0),
  canonical: [
    "lesson.json", "exercises.json", "figures.json", "adaptation.audit.json",
    "answer-keys.json", "answer-keys.audit.json", "interactions.json",
    "choice-set/seed.json", "choice-set/draft.json", "choice-set/review.json",
  ].map(name => bind(`${directory}/${name}`)),
  missingSourceCropStage: bind(`${evidence}/original-crop-review/report.md`),
  canonicalFinalization: bind(`${evidence}/native-executions/canonical-finalize-first/execution.json`),
  choiceBindingAndInternalRetention: {
    representationOnly: bind(`${evidence}/choice-binding-refresh.json`),
    retention: bind(`${evidence}/native-executions/current-choice-retention-first/execution.json`),
    originalReviewedQuestionCoverageSolutionAndViewObjectsExact: true,
  },
  affectedProseDisplay: {
    firstReport: bind(`${evidence}/affected-display-first/findings.json`),
    recoveryReport: bind(recoveryReport),
    firstScopeDomAndMetadataPassReused: true,
    onlyNewObservations: ["desktop5/8/boundary1", "mobileboundary2 rule"],
    flowItems: 50, paragraphs: 42, figures: 4, captions: 4,
  },
  readyWrittenDisplayByteExactOldPass: {
    sha256: "b9777739bc5dbeb59befcfc0e1e55ce174b6a5bd933da4142357e089078deb85",
    replayed: false,
  },
  existingScienceModernFigureAnswerChoiceAndDisplayReviewsReused: true,
  retention: ["base", "display-first", "display"].map(mode =>
    bind(`${evidence}/retention-${mode}.json`)),
  limitations: [
    "Offline review-ready is not publication, runtime grading, or full ticket handoff.",
    "Original encoding, decorative/faint ink and offscale intent remain qualified UNKNOWN.",
    "Existing choice bundling, response-unit and writing/drawing production limitations remain explicit.",
    "All unrelated source count, glyph, figure and lesson HOLDs remain unchanged.",
  ],
  newCompletedOfflineReviewReadyLessons: 1,
  parentPermanentImageAllowance: "24/24 exhausted",
  parentNewImageViewsOrPixelDecodes: 0, knownCharges: 74,
  explicitPaidGenerationCalls: 0, fees: "UNKNOWN",
  databaseWritesPublicationsMergesDeployments: 0,
  productionContinuationRequired: true,
};
assert.equal(result.sourceExercises, 34);
assert.equal(result.figures, 4);
assert.equal(result.answers, 34);
assert.equal(result.interactions, 34);
assert.equal(result.choiceQuestions, 18);
assert.equal(result.choiceOptions, 72);
fs.writeFileSync(target, JSON.stringify(result, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify({ completion: bind(target), sourceExercises: 34,
  answers: 34, interactions: 34, choiceQuestions: 18, choiceOptions: 72,
  completedOfflineReviewReadyLessons: 1, production: "ACTIVE" }));

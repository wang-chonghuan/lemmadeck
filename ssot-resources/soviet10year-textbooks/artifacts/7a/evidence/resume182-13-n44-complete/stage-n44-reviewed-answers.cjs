const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const lesson = "alg7-c4-s3-n44";
const target = `ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons/${lesson}`;
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const sha = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const ref = file => ({ path: file, sha256: sha(file) });
const reviewFile = `${base}/n44-answer-comparison/results0444.json`;
const freezeFile = `${base}/n44-answer-comparison/freeze0444.json`;
const review = read(reviewFile);
const freeze = read(freezeFile);
assert.equal(review.status, "MATCH_ALL_15_WRITTEN_ANSWERS_AND_REQUESTED_METHODS");
assert.deepEqual(review.issue_units, []);
assert.equal(review.coverage.exercise_tasks_matched, 120);
assert.equal(review.coverage.actual_table_methods_matched, 4);
for (const file of freeze.files) {
  assert.equal(sha(`${path.dirname(freezeFile)}/${file.path}`), file.sha256);
}
assert.equal(sha(`${target}/exercises.json`), review.input_bindings.durable_exercises.sha256);
const candidateFile = `${base}/n44-answer-author/FINAL/answer-keys.json`;
const original = read(candidateFile);
assert.equal(sha(candidateFile), freeze.end_of_comparison_input_hash_check.candidate_sha256);
assert(!fs.existsSync(`${target}/answer-keys.json`));
assert(!fs.existsSync(`${target}/answer-evidence`));
const evidence = `${target}/answer-evidence`;
fs.mkdirSync(evidence);
const retained = [];
const unique = new Map();
for (const directory of ["n44-answer-author/FINAL", "n44-answer-review",
  "n44-answer-comparison", "n44-original-root-capture"]) {
  for (const entry of fs.readdirSync(`${base}/${directory}`, { withFileTypes: true })) {
    if (!entry.isFile()) continue;
    const source = `${base}/${directory}/${entry.name}`;
    const digest = sha(source);
    let destination = unique.get(digest);
    if (!destination) {
      const name = directory === "n44-answer-author/FINAL"
        && ["answer-methods.md", "same-book-source-cells.json"].includes(entry.name)
        ? entry.name.replace(/\.json$/, ".record")
        : `${directory.replaceAll("/", "-")}-${entry.name.replace(/\.json$/, ".record")}`;
      destination = `${evidence}/${name}`;
      fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL);
      assert.equal(sha(destination), digest);
      unique.set(digest, destination);
    }
    retained.push({ historicalOrigin: `${directory}/${entry.name}`, retained: ref(destination) });
  }
}
const provenanceFile = `${evidence}/provenance.json`;
fs.writeFileSync(provenanceFile, `${JSON.stringify({
  lesson, writtenAnswers: 15, independentlyComparedExerciseTasks: 120,
  independentSourceTasksReused: 132, actualTableMethods: 4, retained,
  originalSourceAndReviewBytesUnchanged: true, parentNewImagesOrSolves: 0,
  authorityClarification: "Parent-agent delegated comparison under the live human-authorized ticket; not a new direct human mathematical assertion.",
  historicalOriginsAreNotRuntimeDependencies: true,
  databaseWritesPublicationApplicationIntegration: false,
}, null, 2)}\n`, { flag: "wx" });
const bound = structuredClone(original);
for (const answer of bound.answers) {
  answer.notes = answer.notes
    .replaceAll("evidence-inputs.json", "answer-evidence/provenance.json")
    .replaceAll("answer-methods.md", "answer-evidence/answer-methods.md")
    .replaceAll("same-book-source-cells.json", "answer-evidence/same-book-source-cells.record");
}
const math = document => document.answers.map(({ notes, ...answer }) => answer);
assert.deepEqual(math(bound), math(original));
assert.equal(bound.status, original.status);
assert(bound.answers.every(answer => answer.grading === "ungraded" && answer.parts.length === 0));
fs.writeFileSync(`${target}/answer-keys.json`, `${JSON.stringify(bound, null, 2)}\n`, { flag: "wx" });
fs.writeFileSync(`${base}/n44-answer-stage.json`, `${JSON.stringify({
  candidate: ref(candidateFile), review: ref(reviewFile), freeze: ref(freezeFile),
  retainedEvidence: ref(provenanceFile), target: ref(`${target}/answer-keys.json`),
  mathFieldsUnchanged: true, changes: "Only three stable evidence filename replacements in notes.",
  finalizePending: true, originalAnswers: 15, fullCourseCredit: false,
}, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ stagedReviewedAnswers: 15, mathFieldsUnchanged: true,
  uniqueEvidenceFiles: unique.size, finalizePending: true }));

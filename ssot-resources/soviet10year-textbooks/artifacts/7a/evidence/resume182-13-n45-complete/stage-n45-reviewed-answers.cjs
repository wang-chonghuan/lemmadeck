const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const id = "alg7-c4-s3-n45";
const target = `ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons/${id}`;
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const hash = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const ref = file => ({ path: file, sha256: hash(file) });
const reviewFile = `${base}/n45-answer-comparison/comparison.json`;
const review = read(reviewFile);
const freezeFile = `${base}/n45-answer-comparison/manifest.json`;
const freeze = read(freezeFile);
assert.equal(review.verdict, "MATCH/PASS");
assert.deepEqual(review.issue_units, []);
assert.equal(review.counts.mathematical_tasks_matched, 57);
for (const file of freeze.outputs) assert.equal(hash(`${path.dirname(freezeFile)}/${file.file}`), file.sha256);
const candidateFile = `${base}/n45-answer-author/FINAL/answer-keys.json`;
assert.equal(hash(candidateFile), review.author_answer_keys_sha256);
assert.equal(hash(`${base}/n45-answer-review/freeze-manifest.json`), review.source_math_freeze_sha256);
assert.equal(read(`${target}/lesson.json`).status, "ready");
assert.equal(read(`${target}/exercises.json`).exercises.length, 19);
assert(!fs.existsSync(`${target}/answer-keys.json`));
assert(!fs.existsSync(`${target}/answer-evidence`));
const candidate = read(candidateFile);
assert.equal(candidate.answers.length, 19);
assert(candidate.answers.every(answer => answer.grading === "ungraded" && answer.parts.length === 0));
const evidence = `${target}/answer-evidence`;
fs.mkdirSync(evidence);
const retained = [];
const unique = new Map();
for (const folder of ["n45-answer-author/FINAL", "n45-answer-review", "n45-answer-comparison"]) {
  for (const entry of fs.readdirSync(`${base}/${folder}`, { withFileTypes: true })) {
    if (!entry.isFile()) continue;
    const source = `${base}/${folder}/${entry.name}`;
    const digest = hash(source);
    let destination = unique.get(digest);
    if (!destination) {
      destination = `${evidence}/${folder.replaceAll("/", "-")}-${entry.name.replace(/\.json$/, ".record")}`;
      fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL);
      assert.equal(hash(destination), digest);
      unique.set(digest, destination);
    }
    retained.push({ historicalOrigin: `${folder}/${entry.name}`, retained: ref(destination) });
  }
}
const provenance = `${evidence}/provenance.json`;
fs.writeFileSync(provenance, `${JSON.stringify({
  lesson: id, writtenAnswers: 19, independentlyMatchedTasks: 57, retained,
  originalSourceAndReviewBytesUnchanged: true, mathematicalAndImageReviewRepeated: false,
  conditionalConventionsPreserved: ["880", "890"],
  historicalOriginsAreNotRuntimeDependencies: true, parentNewImagesOrSolves: 0,
  databasePublishAppIntegration: false,
}, null, 2)}\n`, { flag: "wx" });
fs.copyFileSync(candidateFile, `${target}/answer-keys.json`, fs.constants.COPYFILE_EXCL);
fs.chmodSync(`${target}/answer-keys.json`, 0o644);
assert.equal(hash(`${target}/answer-keys.json`), hash(candidateFile));
fs.writeFileSync(`${base}/n45-answer-stage.json`, `${JSON.stringify({
  candidate: ref(candidateFile), review: ref(reviewFile), freeze: ref(freezeFile),
  retainedEvidence: ref(provenance), target: ref(`${target}/answer-keys.json`),
  exactAuthorBytesUnchanged: true, originalAnswers: 19, uniqueEvidenceFiles: unique.size,
  finalizePending: true, completedOfflineCourseCredit: false,
}, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ stagedReviewedAnswers: 19, uniqueEvidenceFiles: unique.size, finalizePending: true }));

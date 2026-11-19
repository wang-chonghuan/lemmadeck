const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const book = "ssot-resources/soviet10year-textbooks/artifacts/7a";
const edition = `${book}/editions/modern-us-neutral`;
const out = `${book}/evidence/resume182-13-n40-n43-and-answer-stages`;
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const sha = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const ref = file => ({ path: file, sha256: sha(file) });
const ids = ["alg7-c4-s2-n40", "alg7-c4-s2-n41", "alg7-c4-s3-n42", "alg7-c4-s3-n43"];
const completed = [];
const partial = [];
for (const id of ids) {
  const dir = `${edition}/lessons/${id}`;
  assert.equal(read(`${dir}/lesson.json`).status, "ready");
  const exercises = read(`${dir}/exercises.json`);
  const answersFile = `${dir}/answer-keys.json`;
  const reviewFile = `${dir}/choice-set/review.json`;
  const answerPass = fs.existsSync(answersFile)
    && read(answersFile).status === "ready"
    && read(`${dir}/answer-keys.audit.json`).status === "pass";
  const choicePass = fs.existsSync(reviewFile) && read(reviewFile).outcome === "pass";
  if (answerPass && choicePass) {
    const answers = read(answersFile);
    const draft = read(`${dir}/choice-set/draft.json`);
    assert.equal(answers.answers.length, exercises.exercises.length);
    assert(answers.answers.every(answer => answer.grading === "ungraded" && answer.parts.length === 0));
    completed.push({
      id, exercises: exercises.exercises.length, answers: answers.answers.length,
      questions: draft.questions.length,
      options: draft.questions.reduce((total, item) => total + item.view.options.length, 0),
      originalFigures: read(`${dir}/figures.json`).figures.length,
      newChoiceFigures: draft.new_figures.length,
    });
  } else {
    partial.push({ id, modernReady: true, answersReady: answerPass, choicesReady: choicePass });
  }
}
assert(completed.length >= 3, "Retain a completed small course batch, not only source facts");
assert.equal(read(`${base}/display/current-batch-FIRST/result.json`).status, "pass");
assert.equal(read(`${base}/display/current-batch-FIRST/pixel-review/result.json`).status, "pass");
assert(!fs.existsSync(out));
const files = new Set();
const excluded = [];
const collect = (folder, extensions) => {
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    const file = `${folder}/${entry.name}`;
    if (entry.isDirectory()) {
      if (!/^(runtime|node_modules|\.cache|\.config|\.home|source-repo)$/.test(entry.name)
        && !entry.name.includes("profile")) collect(file, extensions);
    } else if (entry.isFile() && extensions.test(file)) {
      if (/\.(py|patch)$/.test(file)
        && /(?:^|\n)[+ ]?def _fraction_baselines\(/.test(fs.readFileSync(file, "utf8"))) {
        excluded.push({ origin: path.relative(base, file), sha256: sha(file),
          reason: "Preexisting user helper snapshot, excluded from this delivery" });
      } else files.add(file);
    }
  }
};
for (const entry of fs.readdirSync(base, { withFileTypes: true })) {
  if (entry.isFile() && /\.(json|cjs|mjs|py|md)$/.test(entry.name)) files.add(`${base}/${entry.name}`);
}
collect(`${base}/stages`, /\.(start\.json|receipt\.json|stdout|stderr)$/);
for (const folder of [
  "source243-250-author", "source243-250-review", "source251-258-author", "source251-258-review",
  "counter-owned", "counter-affected", "counter-review", "n40-modern-author", "n40-modern-review",
  "n40-answer-author", "n40-answer-review", "n40-table-cell-author", "n40-table-cell-review",
  "n40-choice-author", "n40-choice-review", "n40-choice-affected-author",
  "n40-choice-affected-review", "n40-choice-path-bound",
  "n41-n42-modern-author", "n41-n43-modern-review", "n41-n42-normalized-binding",
  "n41-n42-figure-author", "n41-n42-figure-review", "n41-table-cell-source",
  "n41-answer-author", "n41-answer-review", "n41-choice-author", "n41-choice-review",
  "n42-n43-answer-author", "n42-n43-answer-review", "n42-choice-author", "n42-choice-review",
  "n42-choice-path-bound", "n43-modern-author", "n43-choice-author", "n43-choice-review",
  "n43-choice-path-bound",
]) {
  if (fs.existsSync(`${base}/${folder}`)) {
    collect(`${base}/${folder}`, /\.(json|md|sha256|stdout|stderr|py|patch|cjs|mjs|svg)$/);
  }
}
collect(`${base}/display/current-batch-FIRST`, /\.(json|md|png|sha256)$/);
const byHash = new Map();
const durableByHash = new Map();
const seedRetainedHashes = folder => {
  if (!fs.existsSync(folder)) return;
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    const file = `${folder}/${entry.name}`;
    if (entry.isDirectory()) seedRetainedHashes(file);
    else if (entry.isFile() && !durableByHash.has(sha(file))) durableByHash.set(sha(file), file);
  }
};
seedRetainedHashes(`${book}/evidence/resume182-13-bradis-table-method`);
seedRetainedHashes(`${edition}/figures/evidence`);
for (const id of ids) {
  seedRetainedHashes(`${edition}/lessons/${id}/choice-set/evidence`);
  seedRetainedHashes(`${edition}/lessons/${id}/answer-evidence`);
}
const reusedDurableEvidence = new Set();
const retained = [];
for (const file of [...files].sort()) {
  const digest = sha(file);
  let destination = byHash.get(digest);
  if (!destination && durableByHash.has(digest)) {
    destination = durableByHash.get(digest);
    reusedDurableEvidence.add(destination);
  }
  if (!destination) {
    destination = `${out}/${path.relative(base, file).replace(/\.json$/, ".record")}`;
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(file, destination, fs.constants.COPYFILE_EXCL);
    assert.equal(sha(destination), digest);
  }
  byHash.set(digest, destination);
  retained.push({ historicalOriginRelativeToBatch: path.relative(base, file),
    retained: ref(destination) });
}
fs.writeFileSync(`${out}/manifest.json`, `${JSON.stringify({
  ticket: "STEMROBIN-182", completed, completedOfflineCourses: completed.length,
  partial,
  retainedAnswerStages: ["alg7-c4-s2-n38", "alg7-c4-s2-n39"],
  sharedTableEvidence: ref(`${book}/evidence/resume182-13-bradis-table-method/provenance.json`),
  sourcePages: Array.from({ length: 16 }, (_, i) => 243 + i),
  nextPages259266: {
    stage: "source-FIRST-reviewed-partial",
    authoredRows: 179, independentRows: 179,
    countFailures: [261, 264], sourceRevision: [264],
    includedInThisBatch: false, completeCourseCredit: false,
  },
  nextPages267274PreparedOnly: true,
  retained, excluded, uniqueEvidenceFiles: byHash.size,
  reusedDurableEvidenceFiles: reusedDurableEvidence.size,
  newlyCopiedEvidenceFiles: byHash.size - reusedDurableEvidence.size,
  imagesOpenedDuringRetention: 0, firstFailuresPreserved: true,
  historicalOriginPathsAreNotRuntimeDependencies: true,
  costs: "unknown", hostTokens: "unknown", activeTime: "unknown",
  fullMechanicalDefenceDeferredToFinalHandoff: true,
  databaseWritesPublishAppChangesMergeDeployClosure: false,
}, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ completedOfflineCourses: completed.length,
  uniqueEvidenceFiles: byHash.size, excludedUnrelatedSnapshots: excluded.length }));

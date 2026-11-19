const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const book = "ssot-resources/soviet10year-textbooks/artifacts/7a";
const edition = `${book}/editions/modern-us-neutral`;
const out = `${book}/evidence/resume182-13-n38-n39-n41-complete`;
const ids = ["alg7-c4-s2-n38", "alg7-c4-s2-n39", "alg7-c4-s2-n41"];
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const hash = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const ref = file => ({ path: file, sha256: hash(file) });
assert(!fs.existsSync(out));
const completed = ids.map(id => {
  const directory = `${edition}/lessons/${id}`;
  const exercises = read(`${directory}/exercises.json`).exercises;
  const answers = read(`${directory}/answer-keys.json`);
  const draft = read(`${directory}/choice-set/draft.json`);
  assert.equal(read(`${directory}/lesson.json`).status, "ready");
  assert.equal(read(`${directory}/adaptation.audit.json`).status, "pass");
  assert.equal(answers.status, "ready");
  assert.equal(read(`${directory}/answer-keys.audit.json`).status, "pass");
  assert.equal(read(`${directory}/choice-set/review.json`).outcome, "pass");
  assert.equal(answers.answers.length, exercises.length);
  assert(answers.answers.every(answer => answer.grading === "ungraded" && answer.parts.length === 0));
  assert.equal(draft.new_figures.length, 0);
  return { id, originals: exercises.length, answers: answers.answers.length,
    questions: draft.questions.length,
    options: draft.questions.reduce((count, question) => count + question.view.options.length, 0) };
});
for (const name of ["next-batch-choices-FIRST", "next-batch-n41-source-FIRST"]) {
  assert.equal(read(`${base}/display/${name}/result.json`).status, "pass");
}
assert.equal(read(`${base}/display/next-batch-pixel-review/result.json`).status, "pass");
const files = new Set();
const excluded = [];
const collect = directory => {
  if (!fs.existsSync(directory)) return;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = `${directory}/${entry.name}`;
    if (entry.isDirectory()) {
      if (!/^(node_modules|runtime|source-repo|cache|\.cache|\.config|\.home)$/.test(entry.name)
        && !entry.name.includes("profile")) collect(file);
    } else if (entry.isFile() && /\.(json|record|md|sha256|stdout|stderr|py|patch|cjs|mjs|png|svg)$/.test(file)
      || entry.isFile() && entry.name.includes("SHA256SUMS")) {
      if (/\.(py|patch)$/.test(file)
        && /(?:^|\n)[+ ]?def _fraction_baselines\(/.test(fs.readFileSync(file, "utf8"))) {
        excluded.push({ historicalOriginRelativeToBatch: path.relative(base, file), sha256: hash(file),
          reason: "Preexisting uncommitted user helper/guard snapshot excluded." });
      } else files.add(file);
    }
  }
};
for (const folder of [
  "n38-choice-author", "n38-choice-affected-author", "n38-choice-review", "n38-choice-approved",
  "n39-choice-author", "n39-choice-affected-author", "n39-choice-review",
  "n39-choice-reference-affected", "n39-choice-reference-review", "n39-choice-approved",
  "n41-choice-author", "n41-choice-position-affected", "n41-choice-review", "n41-choice-approved", "n41-choice-path-bound",
  "counter-supported-owned-FIRST", "counter-supported-owned-RECOVERY1",
  "counter-supported-owned-RECOVERY2", "counter-supported-affected-review",
  "source259-266-author", "source259-266-review",
  "stages", "display/next-batch-choices-FIRST", "display/next-batch-n41-source-FIRST",
  "display/next-batch-pixel-review",
  "display/n39-q24-affected-FIRST", "display/n39-q24-affected-RECOVERY1",
  "display/n41-affected-FIRST",
]) collect(`${base}/${folder}`);
for (const entry of fs.readdirSync(base, { withFileTypes: true })) {
  if (!entry.isFile() || !/\.(json|cjs|mjs|py|md)$/.test(entry.name)) continue;
  const file = `${base}/${entry.name}`;
  if (entry.name === "delivery-excluded-user-test-snapshot.py"
    || /\.(py|patch)$/.test(file)
      && /(?:^|\n)[+ ]?def _fraction_baselines\(/.test(fs.readFileSync(file, "utf8"))) {
    excluded.push({ historicalOriginRelativeToBatch: entry.name, sha256: hash(file),
      reason: "Preexisting uncommitted user helper/guard/test snapshot excluded." });
  } else files.add(file);
}
const durableByHash = new Map();
const seedExisting = directory => {
  if (!fs.existsSync(directory)) return;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = `${directory}/${entry.name}`;
    if (entry.isDirectory()) seedExisting(file);
    else if (entry.isFile()) {
      const digest = hash(file);
      if (!durableByHash.has(digest)) durableByHash.set(digest, file);
    }
  }
};
seedExisting(`${book}/evidence`);
seedExisting(`${edition}/figures/evidence`);
for (const id of ids) {
  seedExisting(`${edition}/lessons/${id}/choice-set/evidence`);
  seedExisting(`${edition}/lessons/${id}/answer-evidence`);
}
const retained = [];
const byHash = new Map();
const reused = new Set();
for (const file of [...files].sort()) {
  const digest = hash(file);
  let destination = byHash.get(digest);
  if (!destination && durableByHash.has(digest)) {
    destination = durableByHash.get(digest);
    reused.add(destination);
  }
  if (!destination) {
    destination = `${out}/${path.relative(base, file).replace(/\.json$/, ".record")}`;
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(file, destination, fs.constants.COPYFILE_EXCL);
    assert.equal(hash(destination), digest);
  }
  byHash.set(digest, destination);
  retained.push({ historicalOriginRelativeToBatch: path.relative(base, file), retained: ref(destination) });
}
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(`${out}/manifest.json`, `${JSON.stringify({
  ticket: "STEMROBIN-182", completed, completedOfflineCourses: completed.length,
  originalModernAndAnswerStagesReused: true,
  newlyCompletedStages: "n38/n39 choices; n41 choices plus first full text/written/choice display",
  counterRepairIndependentPass: true, helperFreeCandidateTests: 71, skippedPixelSubcases: 4,
  userHelperGuardAndWrappedBaselineTestExcluded: true,
  n44AndLaterPages: { completeCourseCredit: false, sourceSnapshotsAreHistoricalEvidenceOnly: true },
  retained, excluded, uniqueEvidenceFiles: byHash.size,
  reusedDurableEvidenceFiles: reused.size, newlyCopiedEvidenceFiles: byHash.size - reused.size,
  imagesOpenedDuringRetention: 0, firstFailuresPreserved: true,
  historicalOriginPathsAreNotRuntimeDependencies: true,
  costs: "unknown", hostTokens: "unknown", activeTime: "unknown",
  fullMechanicalDefenceDeferredToFinalHandoff: true,
  databaseWritesPublishAppChangesMergeDeployClosure: false,
}, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ completed, uniqueEvidenceFiles: byHash.size,
  newlyCopiedEvidenceFiles: byHash.size - reused.size, excluded: excluded.length }));

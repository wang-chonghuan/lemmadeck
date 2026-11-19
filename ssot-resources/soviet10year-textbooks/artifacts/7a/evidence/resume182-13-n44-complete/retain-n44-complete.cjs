const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const book = "ssot-resources/soviet10year-textbooks/artifacts/7a";
const edition = `${book}/editions/modern-us-neutral`;
const id = "alg7-c4-s3-n44";
const lesson = `${edition}/lessons/${id}`;
const output = `${book}/evidence/resume182-13-n44-complete`;
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const hash = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const ref = file => ({ path: file, sha256: hash(file) });
assert(!fs.existsSync(output));
assert.equal(read(`${lesson}/lesson.json`).status, "ready");
assert.equal(read(`${lesson}/adaptation.audit.json`).status, "pass");
assert.equal(read(`${lesson}/answer-keys.json`).status, "ready");
assert.equal(read(`${lesson}/answer-keys.audit.json`).status, "pass");
assert.equal(read(`${lesson}/choice-set/review.json`).outcome, "pass");
const exercises = read(`${lesson}/exercises.json`).exercises;
const answers = read(`${lesson}/answer-keys.json`).answers;
const draft = read(`${lesson}/choice-set/draft.json`);
assert.equal(exercises.length, 15);
assert.equal(answers.length, 15);
assert(answers.every(answer => answer.grading === "ungraded" && answer.parts.length === 0));
assert.equal(draft.questions.length, 33);
assert.equal(draft.questions.reduce((count, question) => count + question.view.options.length, 0), 144);
assert.equal(read(`${base}/display/n44-complete-RECOVERY1/result.json`).status, "pass");
assert.equal(read(`${base}/display/n44-pixel-review/result.json`).status, "pass");
const files = new Set();
const collect = directory => {
  if (!fs.existsSync(directory)) return;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = `${directory}/${entry.name}`;
    if (entry.isDirectory()) {
      if (!/^(node_modules|runtime|source-repo|cache|\.cache|\.config|\.home)$/.test(entry.name)) collect(file);
    } else if (entry.isFile()
      && (/\.(json|record|md|sha256|stdout|stderr|txt|py|patch|cjs|mjs|png|svg)$/.test(file)
        || entry.name.includes("SHA256SUMS"))) {
      assert(!/\.(py|patch)$/.test(file)
        || !/(?:^|\n)[+ ]?def _fraction_baselines\(/.test(fs.readFileSync(file, "utf8")));
      files.add(file);
    }
  }
};
for (const folder of [
  "n44-source-stage", "n44-modern-author", "n44-modern-review", "n44-choice-author",
  "n44-choice-review", "n44-choice-approved", "n44-answer-review", "n44-answer-author",
  "n44-answer-comparison", "n44-original-root-capture", "display/n44-complete-FIRST",
  "display/n44-complete-RECOVERY1",
  "display/n44-mobile-gaps-FIRST", "display/n44-edge-diagnosis-FIRST",
  "display/n44-right-frames-FIRST", "display/n44-right-frames-RECOVERY1",
  "display/n44-pixel-review",
]) collect(`${base}/${folder}`);
for (const entry of fs.readdirSync(`${base}/stages`, { withFileTypes: true })) {
  if (entry.isFile() && /^(n44-|live-(ticket|comments)-resume0706)/.test(entry.name)) {
    files.add(`${base}/stages/${entry.name}`);
  }
}
for (const entry of fs.readdirSync(base, { withFileTypes: true })) {
  if (entry.isFile() && /n44/.test(entry.name)
    && /\.(json|cjs|mjs|py)$/.test(entry.name)) files.add(`${base}/${entry.name}`);
}
const existing = new Map();
const inventory = directory => {
  if (!fs.existsSync(directory)) return;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = `${directory}/${entry.name}`;
    if (entry.isDirectory()) inventory(file);
    else if (entry.isFile() && !existing.has(hash(file))) existing.set(hash(file), file);
  }
};
inventory(`${book}/evidence`);
inventory(`${lesson}/answer-evidence`);
inventory(`${lesson}/choice-set/evidence`);
const byHash = new Map();
const reused = new Set();
const retained = [];
for (const file of [...files].sort()) {
  const digest = hash(file);
  let destination = byHash.get(digest);
  if (!destination && existing.has(digest)) {
    destination = existing.get(digest);
    reused.add(destination);
  }
  if (!destination) {
    destination = `${output}/${path.relative(base, file).replace(/\.json$/, ".record")}`;
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(file, destination, fs.constants.COPYFILE_EXCL);
    assert.equal(hash(destination), digest);
  }
  byHash.set(digest, destination);
  retained.push({ historicalOriginRelativeToBatch: path.relative(base, file), retained: ref(destination) });
}
fs.mkdirSync(output, { recursive: true });
fs.writeFileSync(`${output}/manifest.json`, `${JSON.stringify({
  ticket: "STEMROBIN-182", completed: [{ id, originals: 15, answers: 15, questions: 33, options: 144 }],
  completedOfflineCourses: 1, batchReason: "Large equation task set; ticket permits a one-course batch.",
  sourceTasksReused: 132, actualTableRoutes: 4, retained,
  uniqueEvidenceFiles: byHash.size, reusedDurableEvidenceFiles: reused.size,
  newlyCopiedEvidenceFiles: byHash.size - reused.size,
  historicalOriginPathsAreNotRuntimeDependencies: true, firstFailuresPreserved: true,
  sourceAndMathematicsReviewsRepeated: false, imagesOpenedDuringRetention: 0,
  n45AndLaterPagesExcluded: true, userHelperGuardTestExcluded: true,
  cost: "unknown", hostTokens: "unknown", activeTime: "unknown",
  fullMechanicalDefenceDeferredToFinalHandoff: true,
  databasePublishAppDependenciesMergeDeployClosure: false,
}, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ course: id, uniqueEvidenceFiles: byHash.size,
  reused: reused.size, newFiles: byHash.size - reused.size }));

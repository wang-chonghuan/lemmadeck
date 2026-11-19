const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const book = "ssot-resources/soviet10year-textbooks/artifacts/7a";
const id = "alg7-c4-s3-n45";
const lesson = `${book}/editions/modern-us-neutral/lessons/${id}`;
const output = `${book}/evidence/resume182-13-n45-complete`;
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const hash = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const ref = file => ({ path: file, sha256: hash(file) });
assert(!fs.existsSync(output));
assert.equal(read(`${lesson}/adaptation.audit.json`).status, "pass");
assert.equal(read(`${lesson}/answer-keys.audit.json`).status, "pass");
assert.equal(read(`${lesson}/choice-set/review.json`).outcome, "pass");
const answers = read(`${lesson}/answer-keys.json`).answers;
const draft = read(`${lesson}/choice-set/draft.json`);
assert.equal(read(`${lesson}/exercises.json`).exercises.length, 19);
assert.equal(answers.length, 19);
assert(answers.every(answer => answer.grading === "ungraded" && answer.parts.length === 0));
assert.equal(draft.questions.length, 48);
assert.equal(draft.questions.reduce((sum, question) => sum + question.view.options.length, 0), 152);
assert.equal(read(`${base}/display/n45-source-pixel-review/result.json`).status, "pass");
assert.equal(read(`${base}/display/n45-n46-choices-pixel-review/result.json`).status, "pass");
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
      if (/\.(py|patch)$/.test(file))
        assert(!/(?:^|\n)[+ ]?def _fraction_baselines\(/.test(fs.readFileSync(file, "utf8")));
      files.add(file);
    }
  }
};
for (const directory of fs.readdirSync(base, { withFileTypes: true })) {
  if (directory.isDirectory() && /^n45-(?:source|modern|answer|choice)/.test(directory.name))
    collect(`${base}/${directory.name}`);
  if (directory.isFile() && /n45/.test(directory.name) && /\.(json|cjs|mjs)$/.test(directory.name))
    files.add(`${base}/${directory.name}`);
}
collect(`${base}/display/n45-source-FIRST`);
collect(`${base}/display/n45-source-pixel-review`);
collect(`${base}/display/n45-n46-choices-pixel-review`);
collect(`${base}/source267-274-review`);
const capture = `${base}/display/n45-n46-choices-FIRST/result.json`;
files.add(capture);
for (const check of read(capture).checks.filter(item => item.lesson === id))
  for (const image of [check.screenshot, ...check.rightEnds.map(item => item.screenshot)])
    files.add(image.path);
for (const entry of fs.readdirSync(`${base}/stages`, { withFileTypes: true }))
  if (entry.isFile() && /^(n45-|source267-)/.test(entry.name)) files.add(`${base}/stages/${entry.name}`);
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
inventory(lesson);
inventory(`${book}/editions/modern-us-neutral/figures/evidence/n45-independent`);
const byHash = new Map();
const retained = [];
const reused = new Set();
for (const file of [...files].sort()) {
  const digest = hash(file);
  let target = byHash.get(digest) || existing.get(digest);
  if (target && !target.startsWith(`${output}/`)) reused.add(target);
  if (!target) {
    target = `${output}/${path.relative(base, file).replace(/\.json$/, ".record")}`;
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(file, target, fs.constants.COPYFILE_EXCL);
    assert.equal(hash(target), digest);
  }
  byHash.set(digest, target);
  retained.push({ historicalOriginRelativeToBatch: path.relative(base, file), retained: ref(target) });
}
fs.mkdirSync(output, { recursive: true });
fs.writeFileSync(`${output}/manifest.json`, `${JSON.stringify({
  ticket: "STEMROBIN-182", completed: [{ id, originals: 19, answers: 19, questions: 48, options: 152 }],
  completedOfflineCourses: 1, batchReason: "Large equation problem set; one-course batch permitted.",
  sourceTasksReused: 57, sourceDisplayCombinations: 4, choiceDisplayCombinations: 2,
  sourceDisplayImages: 15, choiceDisplayImages: 11, retained,
  uniqueEvidenceFiles: byHash.size, reusedDurableEvidenceFiles: reused.size,
  historicalOriginsAreNotRuntimeDependencies: true, firstFailuresPreserved: true,
  imagesOpenedDuringRetention: 0, sourceAndMathematicsReviewsRepeated: false,
  userHelperGuardTestAndUnapprovedCounterExcluded: true, n46AndLaterNotCredited: true,
  cost: "unknown", hostTokens: "unknown", activeTime: "unknown",
  fullMechanicalDefenceDeferredToFinalHandoff: true,
  databasePublishAppDependenciesMergeDeployClosure: false,
}, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ course: id, uniqueEvidenceFiles: byHash.size, reused: reused.size }));

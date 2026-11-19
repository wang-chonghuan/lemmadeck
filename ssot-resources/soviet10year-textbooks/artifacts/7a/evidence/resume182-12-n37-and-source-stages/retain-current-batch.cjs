const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");

assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-12";
const book = "ssot-resources/soviet10year-textbooks/artifacts/7a";
const edition = `${book}/editions/modern-us-neutral`;
const output = `${book}/evidence/resume182-12-n37-and-source-stages`;
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const ref = (file) => ({ path: file, sha256: hash(file) });
assert(!fs.existsSync(output));

const completed = "alg7-c4-s2-n37";
const folder = `${edition}/lessons/${completed}`;
const lesson = read(`${folder}/lesson.json`);
const exercises = read(`${folder}/exercises.json`);
const answers = read(`${folder}/answer-keys.json`);
const draft = read(`${folder}/choice-set/draft.json`);
assert.equal(lesson.status, "ready");
assert.equal(exercises.status, "ready");
assert.equal(answers.status, "ready");
assert.equal(read(`${folder}/answer-keys.audit.json`).status, "pass");
assert.equal(read(`${folder}/choice-set/review.json`).outcome, "pass");
assert.equal(answers.answers.length, exercises.exercises.length);
assert(answers.answers.every((item) => item.grading === "ungraded" && item.parts.length === 0));
assert.equal(read(`${base}/display/n37-n38-affected-pixel-review/result.json`).status, "pass");
const choicesFirst = read(`${base}/display/n37-choices-FIRST/pixel-review/result.json`);
assert.equal(choicesFirst.status, "revise");
assert.equal(choicesFirst.findings.length, 1);
assert.equal(choicesFirst.findings[0].id, "PIXEL-01");
assert.equal(choicesFirst.findings[0].candidateDefectEstablished, false);
assert.equal(read(`${base}/display/n37-q31-mobile-affected1/result.json`).status, "pass");
assert.equal(read(`${base}/display/n37-q31-mobile-affected1/pixel-review/result.json`).status, "pass");
assert.equal(read(`${base}/display/n39-mobile-text-affected1/pixel-review/review.json`).status, "pass");

const files = new Set();
const excluded = [];
const walk = (dir, predicate) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = `${dir}/${entry.name}`;
    if (entry.isDirectory()) {
      if (!/^(runtime|node_modules|\.cache|\.config|\.home)$/.test(entry.name)
        && !entry.name.includes("profile")) walk(file, predicate);
    } else if (entry.isFile() && predicate(file)) {
      if (/\.(py|patch)$/.test(file) && /(?:^|\n)[+ ]?def _fraction_baselines\(/.test(fs.readFileSync(file, "utf8"))) {
        excluded.push({ historicalOriginRelativeToBatch: path.relative(base, file),
          sha256: hash(file), reason: "Preexisting uncommitted helper bytes are not part of this delivery." });
      } else {
        files.add(file);
      }
    }
  }
};
for (const entry of fs.readdirSync(base, { withFileTypes: true })) {
  if (entry.isFile() && /\.(json|md|cjs|mjs|py|patch)$/.test(entry.name)) files.add(`${base}/${entry.name}`);
}
walk(`${base}/stages`, (file) =>
  /\.(start\.json|receipt\.json|stdout|stderr)$/.test(file));
for (const name of [
  "source228-234-author", "source228-234-review", "source232-affected-review",
  "counter-repair", "counter229-233-review", "source235-242-author",
  "source235-242-review", "source239-arbitration", "source237-241-affected-review",
  "numbering-affected-review", "numbering-start-order-affected-review", "source-FIRST-snapshots",
  "n37-modern-author", "n37-modern-review", "n37-answer-review", "n37-choice-author",
  "n37-choice-review", "n37-choice-figure-review", "n37-choice-path-bound",
  "n38-n39-modern-author", "n38-n39-modern-review", "n38-answer-review",
  "n39-fig55-author", "n39-fig55-render", "n39-fig55-review", "owned-layout-review",
  "staged-layout",
]) {
  if (fs.existsSync(`${base}/${name}`)) {
    walk(`${base}/${name}`, (file) =>
      /\.(json|md|stdout|stderr|txt|raw|cjs|mjs|py|patch)$/.test(file)
      || /(?:FIRST|failed|repair1-before).*\.svg$/.test(file));
  }
}
walk(`${base}/display`, (file) => /\.(json|md|png|cjs|mjs)$/.test(file));

const byHash = new Map();
const retained = [];
for (const file of [...files].sort()) {
  const relative = path.relative(base, file);
  assert(!relative.startsWith(".."));
  const digest = hash(file);
  let destination = byHash.get(digest);
  if (!destination) {
    destination = `${output}/${relative.replace(/\.json$/, ".record")}`;
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(file, destination, fs.constants.COPYFILE_EXCL);
    assert.equal(hash(destination), digest);
    byHash.set(digest, destination);
  }
  retained.push({ historicalOriginRelativeToBatch: relative, originalSha256: digest,
    retained: ref(destination) });
}
const current = [];
for (const id of ["alg7-c4-s2-n37", "alg7-c4-s2-n38", "alg7-c4-s2-n39"]) {
  const dir = `${edition}/lessons/${id}`;
  current.push({
    id, wholeCourseComplete: id === completed,
    files: ["lesson.json", "exercises.json", "figures.json", "adaptation.audit.json",
      "answer-keys.json", "answer-keys.audit.json", "choice-set/seed.json",
      "choice-set/draft.json", "choice-set/review.json"]
      .filter((name) => fs.existsSync(`${dir}/${name}`)).map((name) => ref(`${dir}/${name}`)),
  });
}
fs.writeFileSync(`${output}/manifest.json`, `${JSON.stringify({
  ticket: "STEMROBIN-182", book: "7a", edition: "modern-us-neutral",
  completed: [{
    id: completed, exercises: exercises.exercises.length, answers: answers.answers.length,
    questions: draft.questions.length,
    options: draft.questions.reduce((total, question) => total + question.view.options.length, 0),
    originalFigures: 0, newChoiceFigures: draft.new_figures.length,
  }],
  completedOfflineCourses: 1,
  retainedPartialStages: [
    { id: "alg7-c4-s2-n38", stages: ["RAW", "modern-text", "offline-text-and-exercises-display"],
      blocked: "18 correction-table readings in799/800/801 require authoritative table evidence.",
      answersPromoted: false, choicesComplete: false },
    { id: "alg7-c4-s2-n39", stages: ["RAW", "modern-text", "figure55", "offline-text-and-exercises-display"],
      answersComplete: false, choicesComplete: false },
  ],
  sourcePages: Array.from({ length: 15 }, (_, index) => 228 + index),
  n40BoundaryOnlyNotDelivered: true, current, retained, excluded,
  choicePixelGate: {
    first: ref(byHash.get(hash(`${base}/display/n37-choices-FIRST/pixel-review/result.json`))),
    affected: ref(byHash.get(hash(`${base}/display/n37-q31-mobile-affected1/pixel-review/result.json`))),
    onlyAffectedFinding: "PIXEL-01: q31 absent from the tall mobile capture",
    candidateChanged: false,
    unchangedDesktopAndEarlierMobilePixelsReused: true,
  },
  uniqueEvidenceFiles: byHash.size, imagesOpenedDuringRetention: 0,
  firstFailuresPreserved: true, historicalOriginPathsAreNotRuntimeDependencies: true,
  noDBPublisherAppInteractionCap3MergeDeployClosure: true,
  fullMechanicalDefenceDeferredToFinalHandoff: true,
  costs: "unknown", hostTokens: "unknown", activeTime: "unknown",
}, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ output, completeCourses: 1, uniqueEvidenceFiles: byHash.size,
  excludedUncommittedHelperSnapshots: excluded.length }));

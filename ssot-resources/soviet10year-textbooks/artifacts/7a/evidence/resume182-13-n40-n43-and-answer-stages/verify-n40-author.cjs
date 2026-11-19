const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const folder = `${base}/n40-answer-author`;
const candidate = `${folder}/answer-keys.json`;
const source = `${base}/n40-adapt-work/adapt/7a/modern-us-neutral/lessons/alg7-c4-s2-n40/exercises.template.json`;
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const sha = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const data = read(candidate);
const exercises = read(source).exercises;
assert.deepEqual(data.answers.map(answer => answer.exercise), exercises.map(ex => ex.number));
const katex = require(path.resolve(".claude/skills/ld-s10y-lesson/node_modules/katex"));
let formulas = 0;
for (const answer of data.answers) {
  assert.equal(answer.grading, "ungraded");
  assert.deepEqual(answer.parts, []);
  assert.equal(answer.source, "derived");
  assert(answer.displayAnswer.trim());
  for (const match of answer.displayAnswer.matchAll(/\$([^$]+)\$/g)) {
    katex.renderToString(match[1], { throwOnError: true, strict: "error" });
    formulas++;
  }
}
const references = {
  "829": [Math.sqrt(.3333), 6 * Math.sqrt(.3333), Math.sqrt(12)],
  "830": [Math.sqrt(80), Math.sqrt(450), Math.sqrt(28), Math.sqrt(120)],
  "831": [Math.sqrt(12.5 / 3.14), Math.sqrt(8.24 / 3.14)],
};
for (const [exercise, values] of Object.entries(references)) {
  const answer = data.answers.find(item => item.exercise === exercise);
  assert(answer.displayAnswer.includes("HOLD"));
  for (const value of values) assert(answer.displayAnswer.includes(value.toFixed(8)));
}
fs.copyFileSync(candidate, `${folder}/answer-keys.frozen.json`, fs.constants.COPYFILE_EXCL);
fs.writeFileSync(`${folder}/author-binding.json`, JSON.stringify({
  candidate: { path: candidate, sha256: sha(candidate) },
  frozen: { path: `${folder}/answer-keys.frozen.json`, sha256: sha(`${folder}/answer-keys.frozen.json`) },
  source: { path: source, sha256: sha(source) },
  exercises: data.answers.length, formulas,
  referenceOnlyChecks: references,
  tableValueReads: 0, tableExercisesHold: ["829", "830", "831"],
  firstDraftRetained: { path: `${folder}/answer-keys.FIRST.json`, sha256: sha(`${folder}/answer-keys.FIRST.json`) },
  firstDraftCorrection: "829 first-route direct product eighth decimal corrected from40 to41 before independent comparison.",
  independentReview: false, answerFinalize: false, fullLessonCredit: false,
}, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify({ exercises: data.answers.length, formulas, status: "author-structure-and-reference-only-pass" }));

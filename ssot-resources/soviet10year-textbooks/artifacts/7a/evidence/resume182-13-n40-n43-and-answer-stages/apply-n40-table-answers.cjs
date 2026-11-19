const fs = require("node:fs");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const katex = require("../../../../../.claude/skills/ld-s10y-lesson/node_modules/katex");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const author = `${base}/n40-answer-author`;
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const sha = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const ref = file => ({ path: file, sha256: sha(file) });
const original = read(`${author}/answer-keys.frozen.json`);
assert.equal(sha(`${author}/answer-keys.frozen.json`),
  "a3ff6ba29e58d7f7ff8ea875b0d39417c80afffa41672de6683a19a63e26d7e4");
const overrides = read(`${author}/table-overrides-FIRST.json`);
const candidate = structuredClone(original);
for (const override of overrides.answers) {
  const answer = candidate.answers.find(item => item.exercise === override.exercise);
  assert(answer);
  answer.displayAnswer = override.displayAnswer;
  answer.notes = override.notes;
  for (const match of answer.displayAnswer.matchAll(/\$([^$]+)\$/g)) {
    katex.renderToString(match[1], { throwOnError: true, strict: "error" });
  }
}
assert.deepEqual(candidate.answers.filter(item => !["829", "830", "831"].includes(item.exercise)),
  original.answers.filter(item => !["829", "830", "831"].includes(item.exercise)));
const captures = `${base}/n40-table-cell-author/captures.json`;
assert.equal(sha(captures), "ad91b77f81f4949cf6b4bdd5eda0d8690eaa6879cfa04e3e127208e0002fd2e8");
const values = read(`${base}/n40-table-cell-author/derived.json`).outputs;
assert.deepEqual(values.map(item => item.derived_table_output),
  ["5.774", "3.464", "8.944", "2.121", "5.292", "1.095", "1.995", "1.620"]);
assert.equal(5774*6, 34644);
assert.equal(Math.round((625/157)*1000), 3981);
assert.equal(Math.round((412/157)*1000), 2624);
const output = `${author}/answer-keys.table-candidate.json`;
fs.writeFileSync(output, `${JSON.stringify(candidate, null, 2)}\n`, { flag: "wx" });
fs.copyFileSync(output, `${author}/answer-keys.table-frozen.json`, fs.constants.COPYFILE_EXCL);
fs.writeFileSync(`${author}/table-candidate-binding.json`, `${JSON.stringify({
  status: "author-check-pass-independent-table-and-method-approval-pending",
  originalFrozen: ref(`${author}/answer-keys.frozen.json`),
  independentArithmeticPass: ref(`${base}/n40-answer-review/stage2-review.json`),
  candidate: ref(output), frozen: ref(`${author}/answer-keys.table-frozen.json`),
  overrides: ref(`${author}/table-overrides-FIRST.json`),
  cells: ref(captures), tableDerivations: ref(`${base}/n40-table-cell-author/derived.json`),
  generalRules: ref(`${base}/bradis-method-rules/source-rules.json`),
  tableRules: ref(`${base}/bradis-tables-source-review/source-rules.corrected.json`),
  changedExercises: ["829", "830", "831"], unaffectedExercisesUnchanged: 11,
  imagesOpened: 0, fullLessonCredit: false,
}, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ candidateExercises: 14, changed: 3, independentApproval: false }));

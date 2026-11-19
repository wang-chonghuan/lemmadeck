const fs = require("node:fs");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const hash = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const original = `${base}/n45-choice-affected-author/RECOVERY1/draft.json`;
assert.equal(hash(original), "e636bab3a05571695c76698376afce1547e1c94edf155d0885238875574aab02");
const review = `${base}/n45-choice-review/stage3/canonical-review.json`;
assert.equal(fs.statSync(review).mode & 0o777, 0o444);
assert.equal(read(review).outcome, "revise");
const input = read(original);
const draft = structuredClone(input);
const repairs = [
  {
    question: "q877f", option: "B",
    before: "Multiply the squared term by 5 and the left side by 8 but leave (y-2)/4 as (y-2); obtain 5y^2-11y-24=0.",
    after: "Clear denominators by 40, but incorrectly distribute 10(y-2) as y-20. Then 8(3-y)=y-20+5(y-2)^2 gives 5y^2-11y-24=0 and roots (11+-sqrt(601))/10. Dropping the multiplier on y changes the linear coefficient, so these are not roots of the original equation.",
  },
  {
    question: "q885a", option: "C",
    before: "Count only the initial 4 h for the first machine, omitting its additional joint 8 h: 4/(t+8)+8/t=1 yields t=4, first 12.",
    after: "Ignore the second machine's contribution and mistake the first machine's observed running time 4+8=12 h for its solo completion time. Apply the stated 8 h difference to get second 12-8=4 h. This generates (12,4), but their actual work would be 12/12+8/4=3 fields, not one.",
  },
];
for (const repair of repairs) {
  const question = draft.questions.find(item => item.id === repair.question);
  const rationale = question.key.rationales.find(item => item.option_id === repair.option);
  assert.equal(rationale.derivation, repair.before);
  assert.equal(rationale.misconception, repair.before);
  rationale.derivation = repair.after;
  rationale.misconception = repair.after;
}
const restored = structuredClone(draft);
for (const repair of repairs) {
  const rationale = restored.questions.find(item => item.id === repair.question)
    .key.rationales.find(item => item.option_id === repair.option);
  rationale.derivation = repair.before;
  rationale.misconception = repair.before;
}
assert.deepEqual(restored, input);
const output = `${base}/n45-choice-key-affected-author`;
assert(!fs.existsSync(output));
fs.mkdirSync(output);
const seed = `${base}/n45-choice-affected-author/seed.json`;
fs.copyFileSync(seed, `${output}/seed.json`, fs.constants.COPYFILE_EXCL);
fs.writeFileSync(`${output}/draft.json`, JSON.stringify(draft, null, 2) + "\n", { flag: "wx" });
fs.writeFileSync(`${output}/binding.json`, JSON.stringify({
  original: { path: original, sha256: hash(original) },
  firstReview: { path: review, sha256: hash(review) },
  draft: { path: `${output}/draft.json`, sha256: hash(`${output}/draft.json`) },
  repairs, changedStrings: 4, viewsKeysSourceSolutionsCoverageAndFiguresUnchanged: true,
  sourceOrStage2ReviewsRepeated: false, imageOpens: 0,
}, null, 2) + "\n", { flag: "wx" });
for (const file of ["seed.json", "draft.json", "binding.json"]) fs.chmodSync(`${output}/${file}`, 0o444);
console.log(JSON.stringify({ output, changedQuestions: 2, changedStrings: 4, viewsOrKeysChanged: false }));

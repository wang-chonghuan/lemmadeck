const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-12";
const source = `${base}/n37-source-stage-affected/artifacts/7a`;
const target = "ssot-resources/soviet10year-textbooks/artifacts/7a";
const id = "alg7-c4-s2-n37";
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const ref = (file) => ({ path: file, sha256: hash(file) });
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  assert.equal(hash(from), hash(to));
};
const reviews = [
  [`${base}/numbering-affected-review/numbering-binding-affected-review/numbering-binding-affected-review.md`,
    "8a08684b21378ac279764077ef641194350167d4335bc88d614e1420bfdaf95b"],
  [`${base}/numbering-start-order-affected-review/numbering-start-order-affected-review.md`,
    "8fa688e2d4a0a018546790fedb8c002cdd30376711213bcdd360cec41072780b"],
];
for (const [file, expected] of reviews) assert.equal(hash(file), expected);
for (const input of read(`${base}/n37-source-stage-affected/inputs.json`).inputs) {
  assert.equal(hash(input.path), input.sha256);
}
assert.equal(hash(`${source}/lessons/${id}/exercises.json`),
  read(`${base}/n37-source-stage-affected/candidate-binding.json`).exerciseFile.sha256);
assert(!fs.existsSync(`${target}/lessons/${id}`));
const previous = read(`${target}/book.json`);
assert(!previous.lessons.some((item) => item.id === id));
const selected = read(`${source}/book.json`).lessons.filter((item) => item.id === id);
assert.equal(selected.length, 1);
copy(`${target}/book.json`, `${base}/n37-raw-index-before.json`);
const outputs = [];
for (const name of ["lesson.md", "lesson.json", "exercises.json"]) {
  const file = `${target}/lessons/${id}/${name}`;
  copy(`${source}/lessons/${id}/${name}`, file);
  outputs.push(ref(file));
}
const next = structuredClone(previous);
next.lessons.push(...selected);
next.pages += 7;
next.audit.exercise_count += 22;
next.audit.exercise_range[1] = Math.max(next.audit.exercise_range[1], 798);
next.audit.warnings.push(
  "Appended only complete RAW n37 from227-234 through798. Printed736/737/738 remain source labels; bound logical786/787/788 follow independently verified numbering errata. Partial n38 on234 is not promoted. Modern text, answers, choices and display require their own gates."
);
assert.deepEqual(next.lessons.slice(0, previous.lessons.length), previous.lessons);
fs.writeFileSync(`${target}/book.json`, `${JSON.stringify(next, null, 2)}\n`);
fs.writeFileSync(`${base}/n37-raw-promotion.json`, `${JSON.stringify({
  selected, reviews: reviews.map(([file]) => ref(file)), outputs,
  beforeIndex: ref(`${base}/n37-raw-index-before.json`),
  currentIndex: ref(`${target}/book.json`), priorRowsUnchanged: true,
  neighboringLessonsPromoted: false, modernApproval: false, fullLessonCredit: false,
}, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ selected, promotedRaw: true, fullLessonCredit: false }));

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-12";
const source = `${base}/n38-n39-source-stage/artifacts/7a`;
const target = "ssot-resources/soviet10year-textbooks/artifacts/7a";
const ids = ["alg7-c4-s2-n38", "alg7-c4-s2-n39"];
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const ref = (file) => ({ path: file, sha256: hash(file) });
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  assert.equal(hash(from), hash(to));
};
const inputs = read(`${base}/n38-n39-source-stage/inputs.json`);
assert.equal(inputs.affectedReview.sha256, "92e3af25824812c9b6f4b0282d72471aaeb4911755fd8e36ad8abfe74dc270d4");
for (const input of [...inputs.inputs, inputs.crop, inputs.affectedReview]) {
  assert.equal(hash(input.path), input.sha256);
}
const binding = read(`${base}/n38-n39-source-stage/candidate-binding.json`);
for (const item of binding.selected) {
  assert(ids.includes(item.id));
  for (const output of item.outputs) assert.equal(hash(output.path), output.sha256);
}
const previous = read(`${target}/book.json`);
const selected = read(`${source}/book.json`).lessons.filter((item) => ids.includes(item.id));
assert.equal(selected.length, 2);
for (const id of ids) {
  assert(!previous.lessons.some((item) => item.id === id));
  assert(!fs.existsSync(`${target}/lessons/${id}`));
}
copy(`${target}/book.json`, `${base}/n38-n39-raw-index-before.json`);
const outputs = [];
for (const id of ids) {
  for (const name of ["lesson.md", "lesson.json", "exercises.json"]) {
    const file = `${target}/lessons/${id}/${name}`;
    copy(`${source}/lessons/${id}/${name}`, file);
    outputs.push(ref(file));
  }
}
assert.equal(hash(`${source}/figures/fig-55.png`),
  "0923bc94f6867f6e07c0551fbf5fd92d40daa6823096675d1bb99de78cf8546f");
copy(`${source}/figures/fig-55.png`, `${target}/figures/fig-55.png`);
outputs.push(ref(`${target}/figures/fig-55.png`));
const next = structuredClone(previous);
next.lessons.push(...selected);
next.pages += 8;
next.audit.exercise_count += 21;
next.audit.exercise_range[1] = Math.max(next.audit.exercise_range[1], 819);
next.audit.figure_numbers = [...new Set([...next.audit.figure_numbers, 55])].sort((a, b) => a - b);
next.audit.warnings.push(
  "Appended only complete RAW n38/n39 from234-242 through819. Figure55 belongs only to819 and its continuation on242 is complete. Partial n40 on242 is not promoted. Modern text, figure, answers, choices and display require their own gates."
);
assert.deepEqual(next.lessons.slice(0, previous.lessons.length), previous.lessons);
fs.writeFileSync(`${target}/book.json`, `${JSON.stringify(next, null, 2)}\n`);
fs.writeFileSync(`${base}/n38-n39-raw-promotion.json`, `${JSON.stringify({
  selected, outputs, sourceReview: inputs.affectedReview,
  beforeIndex: ref(`${base}/n38-n39-raw-index-before.json`),
  currentIndex: ref(`${target}/book.json`), priorRowsUnchanged: true,
  n40Promoted: false, modernApproval: false, fullLessonCredit: false,
}, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ selected, promotedRaw: true, fullLessonCredit: false }));

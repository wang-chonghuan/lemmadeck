const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const target = "ssot-resources/soviet10year-textbooks/artifacts/7a";
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const sha = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const ref = file => ({ path: file, sha256: sha(file) });
const sources = [
  { stage: "n40-source-stage", binding: "candidate-binding.json" },
  { stage: "n41-n43-source-stage", binding: "candidate-binding.json" },
];
const selected = [];
const outputs = [];
const inputs = read(`${base}/n41-n43-source-stage/inputs.json`);
for (const input of [...inputs.inputs, ...inputs.sourceReviews]) {
  assert.equal(sha(input.path), input.sha256);
}
assert.equal(read(`${base}/source251-258-review/receipt.json`).all_page_source_verdicts, "pass");
assert.equal(read(`${base}/stages/n40-assembly-FIRST.receipt.json`).exit, 0);
assert.equal(read(`${base}/stages/n41-n43-assembly-FIRST.receipt.json`).exit, 0);
const previous = read(`${target}/book.json`);
for (const { stage, binding } of sources) {
  const root = `${base}/${stage}/artifacts/7a`;
  for (const item of read(`${base}/${stage}/${binding}`).selected) {
    assert(!previous.lessons.some(row => row.id === item.id));
    assert(!fs.existsSync(`${target}/lessons/${item.id}`));
    const row = read(`${root}/book.json`).lessons.find(row => row.id === item.id);
    assert(row);
    selected.push(row);
    for (const input of item.outputs) assert.equal(sha(input.path), input.sha256);
  }
}
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  assert.equal(sha(from), sha(to));
  outputs.push(ref(to));
};
copy(`${target}/book.json`, `${base}/n40-n43-raw-index-before.json`);
for (const { stage, binding } of sources) {
  const root = `${base}/${stage}/artifacts/7a`;
  for (const item of read(`${base}/${stage}/${binding}`).selected) {
    for (const name of ["lesson.md", "lesson.json", "exercises.json"]) {
      copy(`${root}/lessons/${item.id}/${name}`, `${target}/lessons/${item.id}/${name}`);
    }
  }
}
const newFigures = [];
for (const row of selected) {
  const lesson = read(`${target}/lessons/${row.id}/lesson.json`);
  for (const figure of lesson.figures) {
    if (!newFigures.includes(figure.id)) newFigures.push(figure.id);
  }
}
for (const id of newFigures) {
  copy(`${base}/n41-n43-source-stage/artifacts/7a/figures/${id}.png`,
    `${target}/figures/${id}.png`);
}
const next = structuredClone(previous);
next.lessons.push(...selected);
next.pages += 16;
next.audit.exercise_count += selected.reduce((count, row) => count + row.exercises, 0);
const exerciseNumbers = selected.flatMap(row =>
  read(`${target}/lessons/${row.id}/exercises.json`).exercises.map(item => Number(item.number)));
next.audit.exercise_range[1] = Math.max(next.audit.exercise_range[1], ...exerciseNumbers);
next.audit.figure_numbers = [...new Set([
  ...next.audit.figure_numbers, ...newFigures.map(id => Number(id.slice(4))),
])].sort((a, b) => a - b);
next.audit.warnings.push(
  "Appended only complete RAW n40-n43 through857 from reviewed243-258; n44 boundary excluded. RAW is faithful, including confirmed source printing errors. Modern, answers, choices and display remain separately approved stages.",
);
assert.deepEqual(next.lessons.slice(0, previous.lessons.length), previous.lessons);
fs.writeFileSync(`${target}/book.json`, `${JSON.stringify(next, null, 2)}\n`);
fs.writeFileSync(`${base}/n40-n43-raw-promotion.json`, `${JSON.stringify({
  selected, outputs, sourceReviews: inputs.sourceReviews,
  beforeIndex: ref(`${base}/n40-n43-raw-index-before.json`),
  index: ref(`${target}/book.json`), priorRowsUnchanged: true,
  n44Promoted: false, modernApproval: false, fullLessonCredit: false,
}, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ rawLessonIds: selected.map(row => row.id), fullLessonCredit: false }));

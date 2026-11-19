const fs = require("node:fs");
const crypto = require("node:crypto");
const cp = require("node:child_process");
const assert = require("node:assert/strict");

assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-12";
const source = `${base}/n38-n39-source-stage/artifacts/7a/editions/modern-us-neutral`;
const final = "ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral";
const id = "alg7-c4-s2-n39";
const templates = `${base}/n38-n39-modern-work/adapt/7a/modern-us-neutral/lessons/${id}`;
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const ref = (file) => ({ path: file, sha256: hash(file) });
const approvedText = read(`${base}/n38-n39-modern-review/reports/affected-R1-return.json`);
assert.equal(approvedText.verdict, "PASS");
assert.equal(hash(`${templates}/lesson.template.json`), approvedText.currentLessonSha256);
assert.equal(hash(`${templates}/exercises.template.json`), approvedText.exercise819HashBinding.sha256);
assert.equal(read(`${source}/lessons/${id}/adaptation.audit.json`).status, "pass");
for (const name of ["lesson", "exercises", "figures"]) {
  const template = read(`${templates}/${name}.template.json`);
  template.status = "ready";
  assert.deepEqual(read(`${source}/lessons/${id}/${name}.json`), template);
}
const exercises = read(`${source}/lessons/${id}/exercises.json`);
const spec = read(`${final}/figures/fig-55.spec.json`);
const exercise819 = exercises.exercises.find((item) => item.number === "819");
assert.equal(exercise819.text, spec.source.authoritativeText[0].text);
assert.equal(read(`${final}/figures/fig-55.review.json`).status, "pass");
assert(!fs.existsSync(`${final}/lessons/${id}`));
const before = read(`${final}/book.json`);
fs.copyFileSync(`${final}/book.json`, `${base}/n39-modern-index-before.json`, fs.constants.COPYFILE_EXCL);
fs.mkdirSync(`${final}/lessons/${id}`, { recursive: true });
const outputs = [];
for (const name of ["lesson.json", "exercises.json", "figures.json", "adaptation.audit.json"]) {
  const from = `${source}/lessons/${id}/${name}`;
  const to = `${final}/lessons/${id}/${name}`;
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  assert.equal(hash(from), hash(to));
  outputs.push(ref(to));
}
const result = cp.spawnSync(".claude/skills/ld-s10y-lesson/.venv/bin/python", [
  `${base}/update-modern-index.py`, `${source}/book.json`, id,
], { cwd: process.cwd(), stdio: "inherit" });
assert.equal(result.status, 0);
assert.deepEqual(read(`${final}/book.json`).lessons.filter((item) => item.id !== id), before.lessons);
fs.writeFileSync(`${base}/n39-modern-promotion.json`, `${JSON.stringify({
  outputs, statusOnlyFinalizationTextChange: true, exercise819TextUnchanged: true,
  textReview: ref(`${base}/n38-n39-modern-review/reports/affected-R1-return.json`),
  figureReview: ref(`${final}/figures/fig-55.review.json`),
  index: ref(`${final}/book.json`), priorRowsUnchanged: true,
  fullLessonCredit: false, answersAndChoicesPending: true,
}, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ promotedModern: id, exercise819TextUnchanged: true, fullLessonCredit: false }));

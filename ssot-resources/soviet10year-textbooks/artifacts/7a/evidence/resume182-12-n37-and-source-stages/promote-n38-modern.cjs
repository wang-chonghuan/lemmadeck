const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const cp = require("node:child_process");
const assert = require("node:assert/strict");

assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-12";
const source = `${base}/n38-n39-source-stage/artifacts/7a/editions/modern-us-neutral`;
const target = "ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral";
const id = "alg7-c4-s2-n38";
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const ref = (file) => ({ path: file, sha256: hash(file) });
const reviewPath = `${base}/n38-n39-modern-review/reports/return.json`;
const review = read(reviewPath);
assert.equal(review.n38.verdict, "PASS");
assert.equal(review.n38.textMathApproval, true);
assert(!fs.existsSync(`${target}/lessons/${id}`));
const before = read(`${target}/book.json`);
fs.copyFileSync(`${target}/book.json`, `${base}/n38-modern-index-before.json`, fs.constants.COPYFILE_EXCL);
const outputs = [];
for (const name of ["lesson.json", "exercises.json", "figures.json", "adaptation.audit.json"]) {
  const from = `${source}/lessons/${id}/${name}`;
  const to = `${target}/lessons/${id}/${name}`;
  const binding = review.n38.currentFileBindings.find((item) => item.path === path.resolve(from));
  assert(binding, `No reviewed binding for ${name}`);
  assert.equal(hash(from), binding.sha256);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  assert.equal(hash(to), binding.sha256);
  outputs.push(ref(to));
}
const result = cp.spawnSync(".claude/skills/ld-s10y-lesson/.venv/bin/python", [
  `${base}/update-modern-index.py`, `${source}/book.json`, id,
], { cwd: process.cwd(), stdio: "inherit" });
assert.equal(result.status, 0);
assert.deepEqual(read(`${target}/book.json`).lessons.filter((item) => item.id !== id), before.lessons);
assert(!fs.existsSync(`${target}/lessons/${id}/answer-keys.json`));
fs.writeFileSync(`${base}/n38-modern-promotion.json`, `${JSON.stringify({
  review: ref(reviewPath), outputs, index: ref(`${target}/book.json`),
  priorIndex: ref(`${base}/n38-modern-index-before.json`),
  priorRowsUnchanged: true, exactOutputBytesReused: true,
  blockedAnswersPromoted: false, fullLessonCredit: false,
}, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ id, promotedModern: true, blockedAnswersPromoted: false, fullLessonCredit: false }));

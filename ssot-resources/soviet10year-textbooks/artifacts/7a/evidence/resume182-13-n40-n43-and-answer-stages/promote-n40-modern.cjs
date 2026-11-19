const fs = require("node:fs");
const path = require("node:path");
const cp = require("node:child_process");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const source = `${base}/n40-source-stage-affected/artifacts/7a/editions/modern-us-neutral`;
const target = "ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral";
const id = "alg7-c4-s2-n40";
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const sha = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const ref = file => ({ path: file, sha256: sha(file) });
const review = read(`${base}/n40-modern-review/final-binding.json`);
assert.equal(review.status, "pass");
for (const item of [...review.finalBindings, ...review.templateBindings]) {
  assert.equal(sha(item.path), item.sha256);
}
assert.equal(read(`${source}/lessons/${id}/adaptation.audit.json`).status, "pass");
assert(!fs.existsSync(`${target}/lessons/${id}`));
const previous = read(`${target}/book.json`);
fs.copyFileSync(`${target}/book.json`, `${base}/n40-modern-index-before.json`, fs.constants.COPYFILE_EXCL);
fs.mkdirSync(`${target}/lessons/${id}`, { recursive: true });
const outputs = [];
for (const name of ["lesson.json", "exercises.json", "figures.json", "adaptation.audit.json"]) {
  const from = `${source}/lessons/${id}/${name}`;
  const to = `${target}/lessons/${id}/${name}`;
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  assert.equal(sha(from), sha(to));
  outputs.push(ref(to));
}
const result = cp.spawnSync(".claude/skills/ld-s10y-lesson/.venv/bin/python", [
  ".intentfold/tickets/STEMROBIN-182/tmp/resume182-12/update-modern-index.py",
  `${source}/book.json`, id,
], { cwd: process.cwd(), stdio: "inherit" });
assert.equal(result.status, 0);
assert.deepEqual(read(`${target}/book.json`).lessons.filter(row => row.id !== id), previous.lessons);
fs.writeFileSync(`${base}/n40-modern-promotion.json`, `${JSON.stringify({
  outputs, textReview: ref(`${base}/n40-modern-review/final-binding.json`),
  previousIndex: ref(`${base}/n40-modern-index-before.json`),
  index: ref(`${target}/book.json`), priorRowsUnchanged: true,
  allReviewedOutputBytesPreserved: true,
  answersApproved: false, choicesApproved: false, fullLessonCredit: false,
}, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ promotedModern: id, fullLessonCredit: false }));

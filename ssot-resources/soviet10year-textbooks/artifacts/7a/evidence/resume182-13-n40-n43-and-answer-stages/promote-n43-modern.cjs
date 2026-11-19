const fs = require("node:fs");
const cp = require("node:child_process");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const source = `${base}/n43-source-stage-affected/artifacts/7a/editions/modern-us-neutral`;
const target = "ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral";
const id = "alg7-c4-s3-n43";
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const sha = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const ref = file => ({ path: file, sha256: sha(file) });
const reviewPath = `${base}/n41-n43-modern-review/n43-finalized-binding-review-1.json`;
const review = read(reviewPath);
assert.equal(review.verdict, "PASS");
assert.deepEqual(review.defects, []);
for (const item of review.outputs) assert.equal(sha(`${base}/${item.path}`), item.sha256);
assert(!fs.existsSync(`${target}/lessons/${id}`));
const previous = read(`${target}/book.json`);
fs.copyFileSync(`${target}/book.json`, `${base}/n43-modern-index-before.json`, fs.constants.COPYFILE_EXCL);
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
  `${base}/../resume182-12/update-modern-index.py`, `${source}/book.json`, id,
], { cwd: process.cwd(), stdio: "inherit" });
assert.equal(result.status, 0);
assert.deepEqual(read(`${target}/book.json`).lessons.filter(row => row.id !== id), previous.lessons);
fs.writeFileSync(`${base}/n43-modern-promotion.json`, `${JSON.stringify({
  outputs, textReview: ref(reviewPath), index: ref(`${target}/book.json`),
  previousIndex: ref(`${base}/n43-modern-index-before.json`), priorRowsUnchanged: true,
  allReviewedOutputBytesPreserved: true,
  answersApproved: false, choicesApproved: false, fullLessonCredit: false,
}, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ promotedModern: id, fullLessonCredit: false }));

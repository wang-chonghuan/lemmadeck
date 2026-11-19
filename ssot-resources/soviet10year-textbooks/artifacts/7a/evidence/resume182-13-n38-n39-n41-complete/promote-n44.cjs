const fs = require("node:fs");
const path = require("node:path");
const cp = require("node:child_process");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const target = "ssot-resources/soviet10year-textbooks/artifacts/7a";
const source = `${base}/n44-source-stage/artifacts/7a`;
const id = "alg7-c4-s3-n44";
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const sha = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const ref = file => ({ path: file, sha256: sha(file) });
const reviewFile = `${base}/n44-modern-review/output-binding/report.json`;
const review = read(reviewFile);
assert.equal(review.decision, "PASS");
assert.deepEqual(review.findings, []);
for (const [name, digest] of Object.entries(review.output_hashes)) {
  assert.equal(sha(`${review.output_root}/${name}`), digest);
}
for (const file of [review.approved_review, review.producer_receipt]) assert.equal(sha(file.path), file.sha256);
assert.equal(read(review.producer_receipt.path).exit, 0);
assert.equal(read(`${base}/stages/n44-assembly-FIRST.receipt.json`).exit, 0);
const rawBefore = read(`${target}/book.json`);
const modernBefore = read(`${target}/editions/modern-us-neutral/book.json`);
assert(!rawBefore.lessons.some(row => row.id === id));
assert(!modernBefore.lessons.some(row => row.id === id));
const outputs = [];
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  assert.equal(sha(from), sha(to));
  outputs.push(ref(to));
};
copy(`${target}/book.json`, `${base}/n44-raw-index-before.json`);
copy(`${target}/editions/modern-us-neutral/book.json`, `${base}/n44-modern-index-before.json`);
for (const name of ["lesson.json", "lesson.md", "exercises.json"]) {
  copy(`${source}/lessons/${id}/${name}`, `${target}/lessons/${id}/${name}`);
}
for (const name of Object.keys(review.output_hashes)) {
  copy(`${review.output_root}/${name}`, `${target}/editions/modern-us-neutral/lessons/${id}/${name}`);
}
const row = read(`${source}/book.json`).lessons.find(item => item.id === id);
assert.equal(row.exercises, 15);
assert.equal(row.figures, 0);
const next = structuredClone(rawBefore);
next.lessons.push(row);
next.pages += 8;
next.audit.exercise_count += row.exercises;
next.audit.exercise_range[1] = 872;
next.audit.warnings.push("Appended only complete RAW n44 through872 from reviewed258-266; n45 boundary excluded. Printed errors remain faithful. Modern text approved separately; answers, choices and display are not yet complete.");
assert.deepEqual(next.lessons.slice(0, rawBefore.lessons.length), rawBefore.lessons);
fs.writeFileSync(`${target}/book.json`, `${JSON.stringify(next, null, 2)}\n`);
const result = cp.spawnSync(".claude/skills/ld-s10y-lesson/.venv/bin/python", [
  `${base}/../resume182-12/update-modern-index.py`,
  `${source}/editions/modern-us-neutral/book.json`, id,
], { stdio: "inherit" });
assert.equal(result.status, 0);
assert.deepEqual(read(`${target}/editions/modern-us-neutral/book.json`).lessons.filter(item => item.id !== id),
  modernBefore.lessons);
fs.writeFileSync(`${base}/n44-promotion.json`, `${JSON.stringify({
  lesson: id, outputs, review: ref(reviewFile),
  rawIndex: ref(`${target}/book.json`),
  modernIndex: ref(`${target}/editions/modern-us-neutral/book.json`),
  previousRowsUnchanged: true, sourceAndModernBytesUnchanged: true,
  originalExercises: 15, figures: 0, fullCourseCredit: false,
  databasePublishApplicationMergeDeployClosure: false,
}, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ retained: id, originalExercises: 15, fullCourseCredit: false }));

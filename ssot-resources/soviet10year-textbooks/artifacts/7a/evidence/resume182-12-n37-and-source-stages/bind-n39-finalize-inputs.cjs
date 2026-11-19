const fs = require("node:fs");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");

assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-12";
const durable = "ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/figures";
const isolated = `${base}/n38-n39-source-stage/artifacts/7a/editions/modern-us-neutral/figures`;
const templates = `${base}/n38-n39-modern-work/adapt/7a/modern-us-neutral/lessons/alg7-c4-s2-n39`;
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const ref = (file) => ({ path: file, sha256: hash(file) });
const textReview = read(`${base}/n38-n39-modern-review/reports/affected-R1-return.json`);
assert.equal(textReview.verdict, "PASS");
assert.equal(hash(`${templates}/lesson.template.json`), textReview.currentLessonSha256);
assert.equal(hash(`${templates}/exercises.template.json`), textReview.exercise819HashBinding.sha256);
const review = read(`${durable}/fig-55.review.json`);
assert.equal(review.status, "pass");
assert.equal(hash(`${durable}/fig-55.spec.json`), review.spec.sha256);
assert.equal(hash(`${durable}/fig-55.render.json`), review.render.sha256);
assert.equal(hash(`${durable}/fig-55.svg`), review.outputs.svg.sha256);
fs.mkdirSync(isolated, { recursive: true });
const files = ["spec.json", "render.json", "svg", "review.json"].map((suffix) => `fig-55.${suffix}`);
for (const name of files) {
  fs.copyFileSync(`${durable}/${name}`, `${isolated}/${name}`, fs.constants.COPYFILE_EXCL);
  assert.equal(hash(`${isolated}/${name}`), hash(`${durable}/${name}`));
}
fs.writeFileSync(`${base}/n39-finalize-input-binding.json`, `${JSON.stringify({
  textReview: ref(`${base}/n38-n39-modern-review/reports/affected-R1-return.json`),
  templates: ["lesson.template.json", "exercises.template.json", "figures.template.json"].map((name) => ref(`${templates}/${name}`)),
  figures: files.map((name) => ref(`${durable}/${name}`)),
  identicalFigureCopiesForIsolatedFinalizer: true,
  finalFigureMetadataReferencesDurableFilesOnly: true,
}, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ ready: true, textAndFigureApprovalsBound: true }));

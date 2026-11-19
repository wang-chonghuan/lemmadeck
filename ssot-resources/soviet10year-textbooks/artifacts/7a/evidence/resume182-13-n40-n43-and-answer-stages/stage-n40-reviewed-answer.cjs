const fs = require("node:fs");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const sha = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const reviewPath = `${base}/n40-table-cell-review/method-review.json`;
const review = read(reviewPath);
assert.equal(review.status, "PASS_8_OF_8_AFFECTED_TABLE_METHOD_ANSWER_ROUTES");
assert.deepEqual(review.findings, []);
assert.equal(review.previousEvidence.priorStage2.nonTablePassTasksReused, 59);
const candidate = review.authorBindings.candidate;
assert.equal(sha(candidate.path), candidate.sha256);
assert.equal(sha(review.sourceAuthority.path), review.sourceAuthority.sha256);
const target = "ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons/alg7-c4-s2-n40/answer-keys.json";
assert(!fs.existsSync(target));
fs.copyFileSync(candidate.path, target, fs.constants.COPYFILE_EXCL);
fs.chmodSync(target, 0o644);
assert.equal(sha(target), candidate.sha256);
fs.writeFileSync(`${base}/n40-answer-stage.json`, `${JSON.stringify({
  candidate, target: { path: target, sha256: sha(target) },
  review: { path: reviewPath, sha256: sha(reviewPath) },
  sourceAuthority: review.sourceAuthority, reviewedTasks: 67, finalizePending: true,
}, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ stagedReviewedAnswer: "alg7-c4-s2-n40", reviewedTasks: 67 }));

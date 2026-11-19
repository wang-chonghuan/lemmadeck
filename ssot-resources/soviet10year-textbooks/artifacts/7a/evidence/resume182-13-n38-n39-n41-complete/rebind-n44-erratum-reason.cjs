const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const stage = `${base}/n44-source-stage`;
const target = `${stage}/artifacts/7a/pages/0262`;
const current = "ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0262";
const lessonFile = `${base}/n44-adapt-work/adapt/7a/modern-us-neutral/lessons/alg7-c4-s3-n44/lesson.template.json`;
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const hash = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const ref = file => ({ path: file, sha256: hash(file) });
const before = read(lessonFile);
const oldPage = read(`${target}/page.json`);
const page = read(`${current}/page.json`);
assert.deepEqual(page.blocks, oldPage.blocks);
assert.equal(before.errata.length, 1);
assert.equal(before.errata[0].source.sha256, hash(`${target}/page.json`));
assert.equal(before.errata[0].reason, oldPage.meta.errata[0].reason);
assert.equal(before.errata[0].original, page.meta.errata[0].original);
assert.equal(before.errata[0].corrected, "$c=-1.21$");
for (const name of ["page.md", "page.json", "audit.json"]) {
  const backup = `${stage}/metadata-erratum-FIRST/0262/${name}`;
  fs.mkdirSync(path.dirname(backup), { recursive: true });
  fs.copyFileSync(`${target}/${name}`, backup, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(backup, 0o444);
  fs.copyFileSync(`${current}/${name}`, `${target}/${name}`);
  assert.equal(hash(`${current}/${name}`), hash(`${target}/${name}`));
}
const bound = structuredClone(before);
bound.errata[0].source.sha256 = hash(`${target}/page.json`);
bound.errata[0].reason = page.meta.errata[0].reason;
const restored = structuredClone(bound);
restored.errata = before.errata;
assert.deepEqual(restored, before);
fs.writeFileSync(lessonFile, `${JSON.stringify(bound, null, 2)}\n`);
fs.writeFileSync(`${base}/n44-reason-binding.json`, `${JSON.stringify({
  authorFirstCandidate: ref(`${base}/n44-modern-author/candidate-FINAL/lesson.template.json`),
  workingCandidate: ref(lessonFile), sourcePage: ref(`${target}/page.json`),
  changedFieldsOnly: ["errata[0].source.sha256", "errata[0].reason"],
  sourceBlocksAndModernMathUnchanged: true, firstSnapshotsPreserved: true,
  independentModernReviewPending: true,
}, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ reasonOnlyBinding: true, sourceAndModernMathUnchanged: true }));

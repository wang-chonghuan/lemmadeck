const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const cp = require("node:child_process");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const [name, lesson, seed, draft, review, recordsDirectory] = process.argv.slice(2);
assert(name && lesson && seed && draft && review);
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const output = `${base}/${name}-choice-approved`;
const stable = `ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons/${lesson}/choice-set/evidence`;
const hash = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const ref = file => ({ path: file, sha256: hash(file) });
assert.equal(read(review).outcome, "pass");
assert.equal(read(draft).new_figures.length, 0);
assert.equal(read(seed).source.lesson, lesson);
assert(!fs.existsSync(output));
fs.mkdirSync(output);
const records = [];
for (const file of [seed, draft, review]) assert.equal(fs.statSync(file).mode & 0o777, 0o444);
for (const entry of fs.readdirSync(recordsDirectory || path.dirname(review), { withFileTypes: true })) {
  if (!entry.isFile() || !/\.(json|md|mjs|py|sha256)$/.test(entry.name)
    && !entry.name.includes("SHA256SUMS")) continue;
  const source = path.join(recordsDirectory || path.dirname(review), entry.name);
  const target = `${stable}/${entry.name.replace(/\.json$/, ".record")}`;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL);
  assert.equal(hash(source), hash(target));
  records.push({ original: ref(source), retained: ref(target) });
}
for (const [source, name] of [[seed, "seed.json"], [draft, "draft.json"], [review, "review.json"]]) {
  fs.copyFileSync(source, `${output}/${name}`, fs.constants.COPYFILE_EXCL);
  assert.equal(hash(source), hash(`${output}/${name}`));
}
const unchangedReview = fs.readFileSync(review, "utf8");
assert(!/\.intentfold\/|\.tmp\/|\/Users\//.test(unchangedReview),
  "Review has explicit transient citations; use a separately reviewed path-only binding.");
const receipt = {
  lesson, output, approvedInputs: [seed, draft, review].map(ref), records,
  seedDraftReviewBytesUnchanged: true, evidencePathsChangedInsideReview: false,
  originalNamedRecordsRemainHistoricalEvidence: true,
  imagesOpened: 0, mathematicsRepeated: false, fullCourseDisplayPending: true,
};
fs.writeFileSync(`${base}/${name}-choice-retention-binding.json`, `${JSON.stringify(receipt, null, 2)}\n`, { flag: "wx" });
const result = cp.spawnSync("node", [
  `${base}/run-stage.cjs`, `${name}-choice-retain-FIRST`,
  ".claude/skills/ld-s10y-lesson/.venv/bin/python",
  ".claude/skills/ld-s10y-lesson/tools/retain_choices.py",
  "--repo", ".", "--book", "7a", "--lesson", lesson, "--source", output,
], { stdio: "inherit" });
process.exitCode = result.status ?? 1;

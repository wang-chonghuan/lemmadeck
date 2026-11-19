const fs = require("node:fs");
const path = require("node:path");
const cp = require("node:child_process");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");

assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-12";
const author = `${base}/n37-choice-author`;
const reviewer = `${base}/n37-choice-review`;
const output = `${base}/n37-choice-path-bound`;
const final = "ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons/alg7-c4-s2-n37/choice-set/figures";
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const ref = (file) => ({ path: file, sha256: hash(file) });
const digest = (file) => {
  const result = cp.spawnSync(".claude/skills/ld-s10y-lesson/.venv/bin/python", [
    ".agents/skills/ld-s10y-choice/scripts/prepare.py", "digest", file,
  ], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
};
const seed = `${author}/seed.json`;
const draftFile = `${author}/draft.json`;
const reviewFile = `${reviewer}/review.json`;
const review = read(reviewFile);
const draft = read(draftFile);
assert.equal(review.outcome, "pass");
assert.equal(review.seed_sha256, digest(seed));
assert.equal(review.draft_sha256, digest(draftFile));
assert.equal(draft.new_figures.length, 8);
assert.equal(draft.questions.length, 31);
assert.equal(draft.questions.reduce((total, question) => total + question.view.options.length, 0), 124);
assert.equal(read(`${base}/n37-choice-figure-review/path-binding-result.json`).status, "pass");
assert(!fs.existsSync(output));

const before = structuredClone(draft);
const records = [];
for (const figure of draft.new_figures) {
  const file = `${final}/${figure.id}.svg`;
  const approval = read(`${final}/${figure.id}.review.json`);
  assert.equal(approval.status, "pass");
  assert.equal(hash(figure.path), figure.sha256);
  assert.equal(hash(file), figure.sha256);
  assert.equal(approval.outputs.svg.sha256, figure.sha256);
  const check = review.figure_checks.find((item) => item.figure_id === figure.id);
  assert(check);
  assert.equal(check.asset_path, figure.path);
  assert.equal(check.asset_sha256, figure.sha256);
  records.push({
    id: figure.id, original: ref(figure.path), final: ref(file),
    finalFigureReview: ref(`${final}/${figure.id}.review.json`),
  });
  check.asset_path = file;
  figure.path = file;
}
assert.deepEqual(draft.questions, before.questions);
assert.deepEqual(draft.coverage, before.coverage);
assert.deepEqual(draft.new_figures.map(({ path: ignored, ...figure }) => figure),
  before.new_figures.map(({ path: ignored, ...figure }) => figure));

fs.mkdirSync(output);
fs.copyFileSync(seed, `${output}/seed.json`, fs.constants.COPYFILE_EXCL);
fs.writeFileSync(`${output}/draft.json`, `${JSON.stringify(draft, null, 2)}\n`, { flag: "wx" });
review.draft_sha256 = digest(`${output}/draft.json`);
fs.writeFileSync(`${output}/review.inherited.json`, `${JSON.stringify(review, null, 2)}\n`, { flag: "wx" });
fs.writeFileSync(`${base}/n37-choice-path-binding.json`, `${JSON.stringify({
  original: [seed, draftFile, reviewFile].map(ref),
  candidate: ["seed.json", "draft.json", "review.inherited.json"].map((name) => ref(`${output}/${name}`)),
  records, sourceAndQuestionsAndCoverageUnchanged: true, figureBytesAndBasisUnchanged: true,
  scope: "Eight asset paths and their review references only; independent snapshot binder pending.",
  imagesOpened: 0, independentPathBindingPending: true,
}, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ boundAssets: records.length, output, independentPathBindingPending: true }));

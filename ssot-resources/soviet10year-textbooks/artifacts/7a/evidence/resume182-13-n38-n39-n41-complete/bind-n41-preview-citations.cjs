const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const output = `${base}/n41-choice-path-bound`;
const evidence = "ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons/alg7-c4-s2-n41/choice-set/evidence";
const originalFile = `${base}/n41-choice-review/review.json`;
const hash = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const ref = file => ({ path: file, sha256: hash(file) });
const original = JSON.parse(fs.readFileSync(originalFile, "utf8"));
assert.equal(original.outcome, "pass");
assert.equal(hash(originalFile), "69349f61d7059b0ad200b0c9aff8bfe7f9c32ac3fd6be80244476018f44dff49");
assert(!fs.existsSync(output));
fs.mkdirSync(output);
const sources = [
  [`${base}/n41-n42-figure-author/fig-56/fig-56-width640-REPAIR-1.png`, "fig-56-current-preview.png",
    "c33620eab37e416985daa2f33ed661ba1daf4a75d94dabceb28c5cbcec7aad4d"],
  [`${base}/n41-n42-figure-author/fig-57/fig-57-width640-ASSOCIATION-2.png`, "fig-57-current-preview.png",
    "9a1f2205d05fcb6d02c19d40a4a611718e96ddacf05411e6e3694117a4d73f62"],
];
const substitutions = sources.map(([from, name, expected]) => {
  assert.equal(hash(from), expected);
  const to = `${evidence}/${name}`;
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  assert.equal(hash(to), expected);
  return { from: ref(from), to: ref(to) };
});
const transform = value => {
  if (Array.isArray(value)) return value.map(transform);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, transform(item)]));
  }
  if (typeof value !== "string") return value;
  for (const item of substitutions) value = value.replaceAll(item.from.path, item.to.path);
  return value;
};
const bound = transform(original);
assert.equal(bound.seed_sha256, original.seed_sha256);
assert.equal(bound.draft_sha256, original.draft_sha256);
for (const name of ["seed.json", "draft.json"]) {
  const from = `${base}/n41-choice-position-affected/${name}`;
  fs.copyFileSync(from, `${output}/${name}`, fs.constants.COPYFILE_EXCL);
  assert.equal(hash(from), hash(`${output}/${name}`));
  fs.chmodSync(`${output}/${name}`, 0o444);
}
fs.writeFileSync(`${output}/review.inherited.json`, `${JSON.stringify(bound, null, 2)}\n`, { flag: "wx" });
fs.writeFileSync(`${output}/binding.json`, `${JSON.stringify({
  originalReview: ref(originalFile), inheritedReview: ref(`${output}/review.inherited.json`),
  substitutions, seedDraftBytesUnchanged: true,
  onlyPreviewCitationPathsChanged: true, imagesOpened: 0,
  independentPathOnlyReviewPending: true,
}, null, 2)}\n`, { flag: "wx" });
fs.chmodSync(`${output}/review.inherited.json`, 0o444);
fs.chmodSync(`${output}/binding.json`, 0o444);
console.log(JSON.stringify({ output, unchangedMathematics: true, previewBytesRetained: 2 }));

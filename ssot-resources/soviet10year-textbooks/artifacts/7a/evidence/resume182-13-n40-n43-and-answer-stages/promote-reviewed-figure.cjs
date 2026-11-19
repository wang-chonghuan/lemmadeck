const fs = require("node:fs");
const path = require("node:path");
const cp = require("node:child_process");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const id = process.argv[2];
assert(["fig-56", "fig-57", "fig-58"].includes(id));
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const sha = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const ref = file => ({ path: file, sha256: sha(file) });
const reviewPath = `${base}/n41-n42-figure-review/independent-figure-review.json`;
const approved = read(reviewPath).figures.find(row => row.figure === id);
let affectedPath;
if (id === "fig-57") {
  affectedPath = `${base}/n41-n42-figure-review/fig-57-association-2-affected-review.json`;
  const affected = read(affectedPath);
  assert.equal(approved.status, "fail");
  assert.equal(affected.status, "pass");
  assert.equal(affected.changeIsolation.specDiffOnlyAffectedTickLabel, true);
  assert.equal(affected.changeIsolation.sourceAndOtherObjectsAndAssertionsUnchanged, true);
  assert.equal(affected.retainedReview.inheritedFig57MathSourceCulturalStatus, "pass");
  for (const binding of affected.bindings) assert.equal(sha(binding.path), binding.sha256);
  for (const role of ["spec", "svg", "render"]) {
    approved.hashes[role] = affected.bindings.find(item => item.role === role);
  }
} else {
  assert.equal(approved.status, "pass");
}
for (const item of Object.values(approved.hashes)) assert.equal(sha(item.path), item.sha256);
const target = "ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/figures";
const retainedReview = `${target}/evidence/fig56-58-independent-FIRST.record`;
fs.mkdirSync(path.dirname(retainedReview), { recursive: true });
if (fs.existsSync(retainedReview)) assert.equal(sha(retainedReview), sha(reviewPath));
else fs.copyFileSync(reviewPath, retainedReview, fs.constants.COPYFILE_EXCL);
const retainedAffected = affectedPath
  ? `${target}/evidence/fig57-association-2-affected.record` : undefined;
if (retainedAffected) {
  fs.copyFileSync(affectedPath, retainedAffected, fs.constants.COPYFILE_EXCL);
  assert.equal(sha(affectedPath), sha(retainedAffected));
}
fs.mkdirSync(target, { recursive: true });
const specFile = `${target}/${id}.spec.json`;
const svgFile = `${target}/${id}.svg`;
const renderFile = `${target}/${id}.render.json`;
const finalReviewFile = `${target}/${id}.review.json`;
for (const [from, to] of [[approved.hashes.spec.path, specFile], [approved.hashes.svg.path, svgFile]]) {
  assert(!fs.existsSync(to));
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  assert.equal(sha(from), sha(to));
}
const render = read(approved.hashes.render.path);
render.spec.path = specFile;
render.output.svg.path = svgFile;
fs.writeFileSync(renderFile, `${JSON.stringify(render, null, 2)}\n`, { flag: "wx" });
const result = cp.spawnSync("python3", [
  ".agents/skills/ld-s10y-image/scripts/record_review.py",
  "--spec", specFile, "--render", renderFile, "--output", finalReviewFile,
  "--status", "pass", "--notes",
  `Independent source, math, cultural and 640px visual PASS for ${id}; evidence ${retainedReview}, SHA256=${sha(retainedReview)}.${retainedAffected ? ` FIRST visual failure resolved by affected-only review ${retainedAffected}, SHA256=${sha(retainedAffected)}; source/coordinates unchanged.` : ""} Spec/SVG bytes unchanged from approved snapshot; render output paths rebound only.`,
], { stdio: "inherit" });
assert.equal(result.status, 0);
const lesson = id === "fig-58" ? "alg7-c4-s3-n42" : "alg7-c4-s2-n41";
const template = `${base}/n41-n43-adapt-work/adapt/7a/modern-us-neutral/lessons/${lesson}/figures.template.json`;
const manifest = read(template);
const entry = manifest.figures.find(row => row.id === id);
assert(entry);
Object.assign(entry, {
  mode: "deterministic", svg: `figures/${id}.svg`, spec: `figures/${id}.spec.json`,
  render: `figures/${id}.render.json`, review: `figures/${id}.review.json`,
});
fs.writeFileSync(template, `${JSON.stringify(manifest, null, 2)}\n`);
fs.writeFileSync(`${base}/${id}-promotion.json`, `${JSON.stringify({
  id, outputs: [specFile, svgFile, renderFile, finalReviewFile].map(ref),
  independentReview: ref(retainedReview),
  affectedReview: retainedAffected ? ref(retainedAffected) : null, template: ref(template),
  specAndSvgBytesUnchanged: true, renderPathOnlyRebinding: true, fullLessonCredit: false,
}, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ promotedFigure: id, fullLessonCredit: false }));

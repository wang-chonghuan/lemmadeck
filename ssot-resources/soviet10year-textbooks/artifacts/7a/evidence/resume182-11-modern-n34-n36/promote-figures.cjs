const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const cp = require("node:child_process");
const assert = require("node:assert/strict");
const cwd = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
assert.equal(process.cwd(), cwd);
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-11";
const edition = "ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral";
const [name, reportPath] = process.argv.slice(2);
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const ref = (file) => ({ path: file, sha256: hash(file) });
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
};
const copy = (source, target) => {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL);
  assert.equal(hash(source), hash(target));
};
const report = read(reportPath);
assert.equal(report.status, "pass");
assert(report.figures.length);
for (const figure of report.figures) {
  assert.equal(figure.status, "pass");
  for (const field of ["source", "spec", "render", "svg", "preview"]) {
    assert.equal(hash(figure[field].path), figure[field].sha256, `${figure.id}/${field} drift`);
  }
}
const receipts = [];
for (const figure of report.figures) {
  const { id } = figure;
  const final = `${edition}/figures/${id}`;
  const evidence = `${edition}/figures/evidence/${id}/resume182-11-approved`;
  const render = read(figure.render.path);
  assert.equal(render.status, "pass");
  assert.equal(render.spec.sha256, figure.spec.sha256);
  assert.equal(render.output.svg.sha256, figure.svg.sha256);
  copy(figure.spec.path, `${evidence}/spec.json`);
  copy(figure.render.path, `${evidence}/render.json`);
  copy(figure.preview.path, `${evidence}/complete-preview.png`);
  copy(figure.spec.path, `${final}.spec.json`);
  copy(figure.svg.path, `${final}.svg`);
  render.spec.path = `${final}.spec.json`;
  render.output.svg.path = `${final}.svg`;
  save(`${final}.render.json`, render);
  const result = cp.spawnSync("node", [`${base}/run-stage.cjs`, `${name}-${id}-durable-review-binding`,
    "python3", ".agents/skills/ld-s10y-image/scripts/record_review.py",
    "--spec", `${final}.spec.json`, "--render", `${final}.render.json`,
    "--output", `${final}.review.json`, "--status", "pass",
    "--notes", `Independent visual approval ${reportPath}, SHA256 ${hash(reportPath)}. Source, specification and SVG bytes unchanged; only render output paths rebound. No images reopened during promotion.`],
    { cwd, encoding: "utf8" });
  process.stdout.write(result.stdout || "");
  process.stderr.write(result.stderr || "");
  assert.equal(result.status, 0, `${id} binding failed`);
  receipts.push({ id, source: figure.source, approvedSpec: figure.spec, approvedSvg: figure.svg,
    finalSpec: ref(`${final}.spec.json`), finalSvg: ref(`${final}.svg`),
    finalRender: ref(`${final}.render.json`), finalReview: ref(`${final}.review.json`) });
}
const manifestPath = `${edition}/lessons/${report.lesson}/figures.json`;
const manifest = read(manifestPath);
assert.deepEqual(new Set(manifest.figures.map((f) => f.id)), new Set(report.figures.map((f) => f.id)));
copy(manifestPath, `${base}/${name}-figures-manifest-before.json`);
for (const figure of manifest.figures) {
  for (const field of ["png", "generation", "artwork"]) delete figure[field];
  for (const field of ["spec", "render", "review"]) figure[field] = `figures/${figure.id}.${field}.json`;
  figure.svg = `figures/${figure.id}.svg`;
}
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
save(`${base}/${name}-figure-promotion.json`, {
  report: ref(reportPath), imagesReopened: 0, unchangedSpecAndSvg: true,
  renderMetadataPathOnlyRebinding: true, receipts, manifest: ref(manifestPath),
});
console.log(JSON.stringify({ figuresPromoted: receipts.map((r) => r.id), lessonFinalized: false }));

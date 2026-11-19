const fs = require("node:fs");
const cp = require("node:child_process");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const cwd = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
assert.equal(process.cwd(), cwd);
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-11";
const reportPath = process.argv[2];
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const hash = (p) => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const report = read(reportPath);
assert.equal(report.status, "pass");
assert.equal(report.figures.length, 2);
const destination = "ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons/alg7-c4-s2-n36/choice-set/figures";
fs.mkdirSync(destination, { recursive: true });
for (const figure of report.figures) {
  assert.equal(figure.status, "pass");
  assert(figure.id.startsWith("fig-choice-n36-774-"));
  for (const field of ["spec", "render", "svg", "preview"]) {
    assert.equal(hash(figure[field].path), figure[field].sha256, `${figure.id}/${field}`);
  }
  const spec = read(figure.spec.path);
  assert(spec.source.authoredBasis);
  assert(!spec.source.image);
  const prefix = `${destination}/${figure.id}`;
  fs.copyFileSync(figure.spec.path, `${prefix}.spec.json`, fs.constants.COPYFILE_EXCL);
  fs.copyFileSync(figure.svg.path, `${prefix}.svg`, fs.constants.COPYFILE_EXCL);
  const render = read(figure.render.path);
  assert.equal(render.status, "pass");
  assert.equal(render.spec.sha256, hash(`${prefix}.spec.json`));
  assert.equal(render.output.svg.sha256, hash(`${prefix}.svg`));
  render.spec.path = `${prefix}.spec.json`;
  render.output.svg.path = `${prefix}.svg`;
  fs.writeFileSync(`${prefix}.render.json`, `${JSON.stringify(render, null, 2)}\n`, { flag: "wx" });
  const r = cp.spawnSync("node", [`${base}/run-stage.cjs`, `${figure.id}-durable-review-binding`,
    "python3", ".agents/skills/ld-s10y-image/scripts/record_review.py",
    "--spec", `${prefix}.spec.json`, "--render", `${prefix}.render.json`,
    "--output", `${prefix}.review.json`, "--status", "pass",
    "--notes", `Independent authored-geometry visual gate ${reportPath}, SHA256 ${hash(reportPath)}. Spec/SVG copied byte-identically; only durable render paths changed. No original scan fabricated, no answer marker added, no images reopened during promotion.`],
    { cwd, encoding: "utf8" });
  process.stdout.write(r.stdout || "");
  process.stderr.write(r.stderr || "");
  assert.equal(r.status, 0, `${figure.id} review binding failed`);
}
fs.writeFileSync(`${base}/n36-choice-figure-promotion.json`, `${JSON.stringify({
  report: { path: reportPath, sha256: hash(reportPath) }, destination,
  specAndSvgByteIdentical: true, renderOutputPathsOnlyChanged: true,
  imagesOpened: 0, semanticQuestionGatePending: true,
}, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ promoted: report.figures.map((f) => f.id) }));

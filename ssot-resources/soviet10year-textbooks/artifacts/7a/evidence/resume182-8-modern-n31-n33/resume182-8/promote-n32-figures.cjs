const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const cp = require("node:child_process");
const assert = require("node:assert/strict");
const cwd = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
assert.equal(process.cwd(), cwd);
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-8";
const edition = "ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral";
const ids = ["fig-44", "fig-45", "tbl-p0209-02", "tbl-p0210-01"];
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
const independentReport = `${base}/n32-figures-review.md`;
assert.equal(hash(independentReport), process.argv[2]);
const receipts = [];
for (const id of ids) {
  const candidate = `${base}/n32-figures/${id}/${id}`;
  const final = `${edition}/figures/${id}`;
  const oldReview = read(`${candidate}.review.json`);
  const oldRender = read(`${candidate}.render.json`);
  assert.equal(oldReview.status, "pass");
  assert.equal(oldRender.status, "pass");
  assert.equal(oldReview.spec.sha256, hash(`${candidate}.spec.json`));
  assert.equal(oldReview.render.sha256, hash(`${candidate}.render.json`));
  assert.equal(oldReview.outputs.svg.sha256, hash(`${candidate}.svg`));
  const evidence = `${edition}/figures/evidence/${id}/n32-author`;
  for (const name of ["spec", "render", "review"]) copy(`${candidate}.${name}.json`, `${evidence}/${id}.${name}.json`);
  copy(`${candidate}.spec.json`, `${final}.spec.json`);
  copy(`${candidate}.svg`, `${final}.svg`);
  const bound = structuredClone(oldRender);
  bound.spec.path = `${final}.spec.json`;
  bound.output.svg.path = `${final}.svg`;
  assert.equal(bound.spec.sha256, hash(bound.spec.path));
  assert.equal(bound.output.svg.sha256, hash(bound.output.svg.path));
  save(`${final}.render.json`, bound);
  const result = cp.spawnSync("node", [`${base}/run-stage.cjs`, `n32-${id}-durable-review-binding`,
    "python3", ".agents/skills/ld-s10y-image/scripts/record_review.py",
    "--spec", `${final}.spec.json`, "--render", `${final}.render.json`,
    "--output", `${final}.review.json`, "--status", "pass",
    "--notes", `Independent actual-image review ${independentReport} SHA256 ${process.argv[2]}; source, FigureSpec and SVG copied unchanged. Render metadata paths only rebound to durable outputs; original producer/review evidence retained under figures/evidence/${id}/n32-author.`],
    { cwd, encoding: "utf8" });
  process.stdout.write(result.stdout || "");
  process.stderr.write(result.stderr || "");
  assert.equal(result.status, 0, `Stop promotion after failed ${id} binding`);
  receipts.push({ id, candidateSpec: ref(`${candidate}.spec.json`), candidateSvg: ref(`${candidate}.svg`),
    finalSpec: ref(`${final}.spec.json`), finalSvg: ref(`${final}.svg`),
    finalRender: ref(`${final}.render.json`), finalReview: ref(`${final}.review.json`) });
}
save(`${base}/n32-figure-promotion.json`, {
  independentReport: ref(independentReport), imagesReopened: 0,
  unchangedSpecAndSvg: true, renderMetadataPathOnlyRebinding: true, receipts,
});
console.log(JSON.stringify({ figuresPromoted: ids, lessonFinalized: false }));

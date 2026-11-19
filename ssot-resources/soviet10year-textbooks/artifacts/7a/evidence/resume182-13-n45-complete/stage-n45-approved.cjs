const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
const cwd = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
assert.equal(process.cwd(), cwd);
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const id = "alg7-c4-s3-n45";
const root = `${base}/n45-source-stage/artifacts/7a`;
const target = "ssot-resources/soviet10year-textbooks/artifacts/7a";
const edition = `${target}/editions/modern-us-neutral`;
const figures = `${edition}/figures`;
const templates = `${base}/n45-adapt-work/adapt/7a/modern-us-neutral/lessons/${id}`;
const approved = `${base}/n45-modern-author/FINAL/${id}`;
const reviewer = `${base}/n45-modern-review`;
const hash = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const ref = file => ({ path: file, sha256: hash(file) });
const save = (file, data) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, { flag: "wx" });
};
const copy = (source, destination) => {
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  if (fs.existsSync(destination)) assert.equal(hash(destination), hash(source));
  else fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL);
  assert.equal(hash(source), hash(destination));
};
const review = read(`${reviewer}/review.json`);
const freeze = read(`${reviewer}/freeze.json`);
assert.equal(review.status, "pass");
assert.deepEqual(review.findings, []);
assert.equal(freeze.independentVerdict, "pass");
for (const item of freeze.outputFiles) {
  assert.equal(hash(item.path), item.sha256);
  assert.equal(fs.statSync(item.path).mode & 0o777, 0o444);
}
assert.equal(read(`${base}/n45-source-stage/assembly-FIRST.receipt.json`).exit, 0);
assert.equal(read(`${base}/n45-source-stage/candidate-binding.json`).complete, true);
const evidence = `${figures}/evidence/n45-independent`;
copy(`${reviewer}/review.json`, `${evidence}/review.record`);
copy(`${reviewer}/report.md`, `${evidence}/report.md`);
copy(`${reviewer}/freeze.json`, `${evidence}/freeze.record`);
const bindings = [];
const manifest = read(`${approved}/figures.template.json`);
for (const row of review.figures) {
  const figure = row.figure;
  const original = `${base}/n45-modern-figure-author/FINAL/${figure}`;
  const sourceFile = `${root}/figures/${figure}.png`;
  assert.equal(hash(sourceFile), row.sourceSha256);
  assert.equal(hash(`${original}/${figure}.spec.json`), row.specSha256);
  assert.equal(hash(`${original}/${figure}.svg`), row.svgSha256);
  assert.equal(hash(`${original}/${figure}.render.json`), row.renderSha256);
  assert.equal(hash(`${original}/${figure}.preview.png`), row.previewSha256);
  copy(sourceFile, `${target}/figures/${figure}.png`);
  copy(`${original}/${figure}.svg`, `${figures}/${figure}.svg`);
  copy(`${original}/${figure}.preview.png`, `${evidence}/${figure}.preview.png`);
  copy(`${reviewer}/${figure}.review.json`, `${evidence}/${figure}.original-review.record`);
  const specFile = `${figures}/${figure}.spec.json`;
  const renderFile = `${figures}/${figure}.render.json`;
  const reviewFile = `${figures}/${figure}.review.json`;
  const sourceSpec = read(`${original}/${figure}.spec.json`);
  const spec = structuredClone(sourceSpec);
  spec.source.image.path = `${target}/figures/${figure}.png`;
  const restoredSpec = structuredClone(spec);
  restoredSpec.source.image.path = sourceSpec.source.image.path;
  assert.deepEqual(restoredSpec, sourceSpec);
  save(specFile, spec);
  const sourceRender = read(`${original}/${figure}.render.json`);
  assert.equal(sourceRender.status, "pass");
  const render = structuredClone(sourceRender);
  render.spec = ref(specFile);
  render.output.svg = ref(`${figures}/${figure}.svg`);
  const restoredRender = structuredClone(render);
  restoredRender.spec = sourceRender.spec;
  restoredRender.output.svg = sourceRender.output.svg;
  assert.deepEqual(restoredRender, sourceRender);
  save(renderFile, render);
  const originalReview = read(`${reviewer}/${figure}.review.json`);
  assert.equal(originalReview.status, "pass");
  assert.equal(originalReview.spec.sha256, row.specSha256);
  assert.equal(originalReview.render.sha256, row.renderSha256);
  const boundReview = structuredClone(originalReview);
  boundReview.source = ref(`${target}/figures/${figure}.png`);
  boundReview.spec = ref(specFile);
  boundReview.render = ref(renderFile);
  boundReview.outputs.svg = ref(`${figures}/${figure}.svg`);
  boundReview.notes = originalReview.notes.replace(
    "n45-modern-review/review.json", `${evidence}/review.record`
  );
  const restoredReview = structuredClone(boundReview);
  for (const name of ["source", "spec", "render", "outputs", "notes"]) {
    restoredReview[name] = originalReview[name];
  }
  assert.deepEqual(restoredReview, originalReview);
  save(reviewFile, boundReview);
  for (const suffix of ["spec.json", "svg", "render.json", "review.json"]) {
    copy(`${figures}/${figure}.${suffix}`,
      `${root}/editions/modern-us-neutral/figures/${figure}.${suffix}`);
  }
  const entry = manifest.figures.find(item => item.id === figure);
  assert(entry);
  Object.assign(entry, {
    mode: "deterministic", spec: `figures/${figure}.spec.json`,
    svg: `figures/${figure}.svg`, render: `figures/${figure}.render.json`,
    review: `figures/${figure}.review.json`,
  });
  bindings.push({
    figure, sourceSpec: ref(`${original}/${figure}.spec.json`),
    sourceRender: ref(`${original}/${figure}.render.json`),
    sourceReview: ref(`${reviewer}/${figure}.review.json`),
    spec: ref(specFile), render: ref(renderFile), review: ref(reviewFile),
    source: ref(`${target}/figures/${figure}.png`),
    svg: ref(`${figures}/${figure}.svg`), preview: ref(`${evidence}/${figure}.preview.png`),
    onlySourcePathAndMetadataBindingsChanged: true,
  });
}
const before = `${base}/n45-adapt-work/BEFORE-FINALIZE/${id}`;
for (const name of ["lesson.template.json", "exercises.template.json"]) {
  const source = `${approved}/${name}`;
  assert.equal(hash(source), name.startsWith("lesson")
    ? review.text.lessonSha256 : review.text.exercisesSha256);
  fs.copyFileSync(source, `${templates}/${name}`);
  fs.chmodSync(`${templates}/${name}`, 0o644);
  assert.equal(hash(source), hash(`${templates}/${name}`));
  copy(source, `${before}/${name}`);
  fs.chmodSync(`${before}/${name}`, 0o444);
}
fs.writeFileSync(`${templates}/figures.template.json`, `${JSON.stringify(manifest, null, 2)}\n`);
fs.chmodSync(`${templates}/figures.template.json`, 0o644);
copy(`${templates}/figures.template.json`, `${before}/figures.template.json`);
fs.chmodSync(`${before}/figures.template.json`, 0o444);
save(`${base}/n45-approved-binding.json`, {
  schema: "n45-approved-path-only-binding@1", lesson: id,
  independentReview: ref(`${reviewer}/review.json`), bindings,
  templates: ["lesson.template.json", "exercises.template.json", "figures.template.json"]
    .map(name => ref(`${templates}/${name}`)),
  specGeometryAndSVGUnchanged: true, figuresSourcePathOnly: true,
  recordReviewCallsRepeated: 0, imagesOpened: 0, sourceReviewsRepeated: 0,
  fullCourseCredit: false, missingStages: ["adapt-finalize", "output-binding-review", "answers", "choices", "display"],
});
console.log(JSON.stringify({ lesson: id, boundFigures: bindings.length, fullCourseCredit: false }));

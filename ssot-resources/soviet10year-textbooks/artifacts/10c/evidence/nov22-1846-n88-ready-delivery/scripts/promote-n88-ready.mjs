import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = "/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck";
assert.equal(process.cwd(), root);
const [cropReport, cropReportHash] = process.argv.slice(2);
assert.ok(path.isAbsolute(cropReport ?? ""), "Received crop review required");
assert.match(cropReportHash ?? "", /^[a-f0-9]{64}$/);
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
assert.equal(hash(fs.readFileSync(cropReport)), cropReportHash);

const scratch = ".tmp/stemrobin-184-six";
const raw = `${scratch}/n88-raw-assembly/artifacts/10c`;
const book = "ssot-resources/soviet10year-textbooks/artifacts/10c";
const edition = "editions/modern-us-neutral";
const lesson = "ana10-c6-s3-n88";
const work = `${scratch}/n88-canonical-ready`;
assert.ok(!fs.existsSync(work), "Do not replay N88 promotion");
fs.mkdirSync(work);
const bindings = [];
const bind = (file) => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length, sha256: hash(bytes) };
};
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n", { flag: "wx" });
};
const copy = (source, target) => {
  const bytes = fs.readFileSync(source);
  if (fs.existsSync(target)) {
    assert.deepEqual(fs.readFileSync(target), bytes, `Existing bytes differ: ${target}`);
  } else {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL);
  }
  bindings.push({ source: bind(source), retained: bind(target) });
};

for (const name of ["book.json", `${edition}/book.json`]) {
  if (fs.existsSync(`${book}/${name}`)) {
    copy(`${book}/${name}`, `${work}/before/${name}`);
  }
}
for (let page = 67; page <= 73; page++) {
  const folder = `pages/${String(page).padStart(4, "0")}`;
  for (const name of ["page.md", "page.json", "audit.json"]) {
    copy(`${raw}/${folder}/${name}`, `${book}/${folder}/${name}`);
  }
}
for (const name of ["lesson.json", "lesson.md", "exercises.json"]) {
  copy(`${raw}/lessons/${lesson}/${name}`, `${book}/lessons/${lesson}/${name}`);
}
for (const id of [38, 39, 40, 41]) {
  for (const ext of ["png", "svg"]) {
    copy(`${raw}/figures/fig-${id}.${ext}`, `${book}/figures/fig-${id}.${ext}`);
  }
}

const promotedFigures = [];
for (const id of [38, 39, 40, 41]) {
  const figure = `fig-${id}`;
  const sourceFolder = `${raw}/${edition}/figures`;
  const destination = `${book}/${edition}/figures/${figure}`;
  const specSource = `${sourceFolder}/${figure}.spec.json`;
  const renderSource = `${sourceFolder}/${figure}.render.json`;
  const reviewSource = `${sourceFolder}/${figure}.review.json`;
  const svgSource = `${sourceFolder}/${figure}.svg`;
  const spec = read(specSource);
  const render = read(renderSource);
  const review = read(reviewSource);
  assert.equal(render.status, "pass");
  assert.equal(review.status, "pass");
  assert.equal(render.spec.sha256, bind(specSource).sha256);
  assert.equal(review.spec.sha256, bind(specSource).sha256);
  assert.equal(review.render.sha256, bind(renderSource).sha256);
  assert.equal(render.output.svg.sha256, bind(svgSource).sha256);
  const oldSpec = structuredClone(spec);
  spec.source.image.path = `${book}/figures/${figure}.png`;
  assert.equal(spec.source.image.sha256, bind(spec.source.image.path).sha256);
  const comparable = structuredClone(spec);
  comparable.source.image.path = oldSpec.source.image.path;
  assert.deepEqual(comparable, oldSpec);
  save(`${destination}.spec.json`, spec);
  copy(svgSource, `${destination}.svg`);
  render.spec = { path: `${destination}.spec.json`, sha256: bind(`${destination}.spec.json`).sha256 };
  render.output.svg.path = `${destination}.svg`;
  render.promotion = {
    originalRender: bind(renderSource),
    originalSpec: bind(specSource),
    sourceCropReview: bind(cropReport),
    changedSpecFields: ["/source/image/path"],
    originalGeometryLabelsInventoryAssertionsAndSvgExact: true,
    producerOrVisualReviewReplayed: false,
  };
  save(`${destination}.render.json`, render);
  review.source.path = spec.source.image.path;
  review.spec = render.spec;
  review.render = { path: `${destination}.render.json`, sha256: bind(`${destination}.render.json`).sha256 };
  review.outputs.svg.path = `${destination}.svg`;
  review.promotion = {
    originalReview: bind(reviewSource),
    originalContentReviewAndDisplayEvidenceReused: true,
    sourceCropReview: bind(cropReport),
    pathBindingOnly: true,
    mathematicalOrVisualContentChanges: 0,
  };
  save(`${destination}.review.json`, review);
  promotedFigures.push({
    figure,
    originalSpec: bind(specSource),
    spec: bind(`${destination}.spec.json`),
    svg: bind(`${destination}.svg`),
    render: bind(`${destination}.render.json`),
    review: bind(`${destination}.review.json`),
    onlySourceImagePathChanged: true,
  });
}
for (const name of [
  "lesson.json", "exercises.json", "figures.json", "adaptation.audit.json",
  "answer-keys.json", "answer-keys.audit.json", "interactions.json",
]) {
  copy(`${raw}/${edition}/lessons/${lesson}/${name}`, `${book}/${edition}/lessons/${lesson}/${name}`);
}
for (const name of ["lesson.template.json", "exercises.template.json", "figures.template.json"]) {
  copy(
    `${scratch}/n88-raw-assembly/work/adapt/10c/modern-us-neutral/lessons/${lesson}/${name}`,
    `${work}/work/adapt/10c/modern-us-neutral/lessons/${lesson}/${name}`,
  );
}
save(`${work}/promotion.json`, {
  lesson,
  sourceCropReview: { path: cropReport, sha256: cropReportHash },
  bindings,
  promotedFigures,
  newFigureRendersOrModelImages: 0,
  choiceSemanticAndChoiceDisplayUnchanged: true,
  canonicalFinalizationAndCurrentChoiceBindingPending: true,
  completedLessons: 0,
  databaseWrites: 0,
});
console.log(JSON.stringify({ promotion: bind(`${work}/promotion.json`), figures: 4, copiedFiles: bindings.length }));

const fs = require("node:fs");
const path = require("node:path");
const cp = require("node:child_process");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
const cwd = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
assert.equal(process.cwd(), cwd);
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const author = `${base}/n42-choice-author`;
const reviewer = `${base}/n42-choice-review`;
const output = `${base}/n42-choice-path-bound`;
const stable = "ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons/alg7-c4-s3-n42/choice-set";
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const sha = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const ref = file => ({ path: file, sha256: sha(file) });
const digest = file => cp.execFileSync(".claude/skills/ld-s10y-lesson/.venv/bin/python", [
  ".agents/skills/ld-s10y-choice/scripts/prepare.py", "digest", file,
], { encoding: "utf8" }).trim();
const originalReview = read(`${reviewer}/review.json`);
const originalDraft = read(`${author}/draft.json`);
assert.equal(originalReview.outcome, "pass");
assert.equal(originalReview.seed_sha256, digest(`${author}/seed.json`));
assert.equal(originalReview.draft_sha256, digest(`${author}/draft.json`));
assert.equal(originalDraft.questions.length, 5);
assert.equal(originalDraft.new_figures.length, 2);
assert.equal(originalDraft.questions.reduce((n, q) => n + q.view.options.length, 0), 22);
assert(!fs.existsSync(output));
fs.mkdirSync(output);
const records = [];
for (const name of ["source-solutions.json", "stage1-freeze.json", "stage2-fidelity.json",
  "stage2-mathematics.json", "stage2-figure-observations.json", "new-figure-reviews.json",
  "stage2-freeze.json", "review.json"]) {
  const source = `${reviewer}/${name}`;
  const retained = `${stable}/evidence/${name.replace(/\.json$/, ".record")}`;
  fs.mkdirSync(path.dirname(retained), { recursive: true });
  fs.copyFileSync(source, retained, fs.constants.COPYFILE_EXCL);
  assert.equal(sha(source), sha(retained));
  records.push({ original: ref(source), retained: ref(retained) });
}
const stage2 = read(`${reviewer}/stage2-freeze.json`);
const figureReviews = read(`${reviewer}/new-figure-reviews.json`);
const figures = [];
for (const figure of originalDraft.new_figures) {
  const binding = stage2.authorized_input_bindings.authored_figures.find(row => row.figure_id === figure.id);
  const approval = figureReviews.find(row => row.figure_id === figure.id);
  assert(binding && approval);
  assert.equal(approval.verdict, "pass");
  assert.equal(approval.reviewer.kind, "independent_agent");
  assert.equal(sha(figure.path), figure.sha256);
  assert.equal(figure.sha256, approval.asset_sha256);
  assert.equal(figure.sha256, binding.svg_sha256);
  const spec = `${stable}/figures/${figure.id}.spec.json`;
  const svg = `${stable}/figures/${figure.id}.svg`;
  const render = `${stable}/figures/${figure.id}.render.json`;
  const review = `${stable}/figures/${figure.id}.review.json`;
  fs.mkdirSync(path.dirname(spec), { recursive: true });
  const sourceSpec = `${binding.base_path}.spec.json`;
  const sourceRender = `${binding.base_path}.render.json`;
  const sourcePng = `${binding.base_path}.png`;
  assert.equal(sha(sourceSpec), binding.spec_sha256);
  assert.equal(sha(sourceRender), binding.render_sha256);
  assert.equal(sha(sourcePng), binding.actually_opened_png_sha256);
  fs.copyFileSync(sourceSpec, spec, fs.constants.COPYFILE_EXCL);
  fs.copyFileSync(figure.path, svg, fs.constants.COPYFILE_EXCL);
  const metadata = read(sourceRender);
  assert.equal(metadata.status, "pass");
  assert.deepEqual(Object.keys(metadata.output), ["svg"]);
  metadata.spec.path = spec;
  metadata.output.svg.path = svg;
  fs.writeFileSync(render, `${JSON.stringify(metadata, null, 2)}\n`, { flag: "wx" });
  const retainedPng = `${stable}/evidence/${figure.id}.png`;
  fs.copyFileSync(sourcePng, retainedPng, fs.constants.COPYFILE_EXCL);
  records.push({ original: ref(sourcePng), retained: ref(retainedPng) });
  const retainedApproval = `${stable}/evidence/new-figure-reviews.record`;
  cp.execFileSync("python3", [
    ".agents/skills/ld-s10y-image/scripts/record_review.py",
    "--spec", spec, "--render", render, "--output", review, "--status", "pass",
    "--notes", `Independent authored-basis, visual, mathematical and cultural PASS retained at ${retainedApproval}, SHA256=${sha(retainedApproval)}. Actual opened preview ${retainedPng}, SHA256=${sha(retainedPng)}. Spec/SVG bytes unchanged; render paths rebound only. No source or image review repeated.`,
  ], { stdio: "inherit" });
  figures.push({ id: figure.id, original: ref(figure.path), retained: ref(svg),
    spec: ref(spec), render: ref(render), review: ref(review),
    specBytesUnchanged: sha(spec) === binding.spec_sha256, svgBytesUnchanged: true });
}
const replacements = [...records, ...figures.map(row => ({
  original: row.original, retained: row.retained,
}))];
const bind = value => {
  if (Array.isArray(value)) return value.map(bind);
  if (value && typeof value === "object") return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, bind(item)]));
  if (typeof value !== "string") return value;
  for (const row of replacements) {
    value = value.replaceAll(path.join(cwd, row.original.path), row.retained.path);
    value = value.replaceAll(row.original.path, row.retained.path);
  }
  return value;
};
const draft = structuredClone(originalDraft);
for (const figure of draft.new_figures) {
  figure.path = figures.find(row => row.id === figure.id).retained.path;
}
assert.deepEqual(draft.questions, originalDraft.questions);
assert.deepEqual(draft.coverage, originalDraft.coverage);
assert.deepEqual(draft.new_figures.map(({ path: omitted, ...row }) => row),
  originalDraft.new_figures.map(({ path: omitted, ...row }) => row));
fs.copyFileSync(`${author}/seed.json`, `${output}/seed.json`, fs.constants.COPYFILE_EXCL);
fs.writeFileSync(`${output}/draft.json`, `${JSON.stringify(draft, null, 2)}\n`, { flag: "wx" });
const review = bind(originalReview);
review.draft_sha256 = digest(`${output}/draft.json`);
fs.writeFileSync(`${output}/review.inherited.json`, `${JSON.stringify(review, null, 2)}\n`, { flag: "wx" });
fs.writeFileSync(`${base}/n42-choice-path-binding.json`, `${JSON.stringify({
  original: ["seed.json", "draft.json"].map(name => ref(`${author}/${name}`)),
  originalReview: ref(`${reviewer}/review.json`),
  candidate: ["seed.json", "draft.json", "review.inherited.json"].map(name => ref(`${output}/${name}`)),
  records, figures, questionsCoverageFigureBasisAndBytesUnchanged: true,
  renderPathsAndCitationPathsOnlyChanged: true, imagesOpened: 0,
  independentPathBindingPending: true,
}, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ boundFigures: figures.length, retainedEvidence: records.length, output }));

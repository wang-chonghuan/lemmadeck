const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");

assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-12";
const final = "ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons/alg7-c4-s2-n37/choice-set/figures";
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const ref = (file) => ({ path: file, sha256: hash(file) });
const requests = read(`${base}/n37-choice-author/figure-requests.repair1.json`);
const manifest = read(`${base}/n37-choice-figure-review/report-manifest.json`);
assert.equal(manifest.outcome, "pass");
assert.equal(requests.length, 8);
const approvals = manifest.files.filter((item) => item.path.endsWith(".review.json")).map((item) => {
  assert.equal(hash(item.path), item.sha256);
  return { file: item.path, review: read(item.path) };
});
assert.equal(approvals.length, 8);
const records = [];
fs.mkdirSync(final, { recursive: true });
for (const request of requests) {
  const approval = approvals.find((item) => item.review.figure === request.id);
  assert(approval);
  assert.equal(approval.review.status, "pass");
  assert.equal(hash(request.spec_path), approval.review.spec.sha256);
  assert.equal(hash(request.svg_path), approval.review.outputs.svg.sha256);
  assert.equal(hash(request.render_path), approval.review.render.sha256);
  const spec = `${final}/${request.id}.spec.json`;
  const svg = `${final}/${request.id}.svg`;
  const render = `${final}/${request.id}.render.json`;
  fs.copyFileSync(request.spec_path, spec, fs.constants.COPYFILE_EXCL);
  fs.copyFileSync(request.svg_path, svg, fs.constants.COPYFILE_EXCL);
  const originalRender = read(request.render_path);
  assert.deepEqual(Object.keys(originalRender.output), ["svg"]);
  const metadata = structuredClone(originalRender);
  metadata.spec.path = spec;
  metadata.output.svg.path = svg;
  fs.writeFileSync(render, `${JSON.stringify(metadata, null, 2)}\n`, { flag: "wx" });
  assert.equal(hash(spec), approval.review.spec.sha256);
  assert.equal(hash(svg), approval.review.outputs.svg.sha256);
  records.push({
    id: request.id, basis: request.basis, approval: ref(approval.file),
    candidate: [request.spec_path, request.render_path, request.svg_path].map(ref),
    final: [spec, render, svg].map(ref),
    byteIdenticalSpecAndSvg: true, changedRenderPathsOnly: true,
    finalReviewPath: `${final}/${request.id}.review.json`,
  });
}
fs.writeFileSync(`${base}/n37-choice-figure-path-promotion.json`, `${JSON.stringify({
  records, imagesOpened: 0, wholeChoiceApproval: false, pathBindingReviewPending: true,
}, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ copiedIndependentApprovedFigures: records.length, questionApproval: false }));

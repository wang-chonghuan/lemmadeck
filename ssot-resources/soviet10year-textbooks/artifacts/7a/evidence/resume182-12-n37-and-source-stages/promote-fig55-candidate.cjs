const fs = require("node:fs");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");

assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-12";
const candidate = `${base}/n39-fig55-render`;
const final = "ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/figures";
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const ref = (file) => ({ path: file, sha256: hash(file) });
const approved = `${base}/n39-fig55-review/fig-55.review.json`;
assert.equal(hash(approved), "b51f7ddb70c4c621bf0b89ca226781b02edb6cdd8b3cddb3520ee79c2ac58906");
const review = read(approved);
assert.equal(review.status, "pass");
assert.equal(hash(`${candidate}/spec.json`), review.spec.sha256);
assert.equal(hash(`${candidate}/fig-55.render.json`), review.render.sha256);
assert.equal(hash(`${candidate}/fig-55.svg`), review.outputs.svg.sha256);
const render = read(`${candidate}/fig-55.render.json`);
assert.equal(render.status, "pass");
const specPath = `${final}/fig-55.spec.json`;
const svgPath = `${final}/fig-55.svg`;
fs.mkdirSync(final, { recursive: true });
fs.copyFileSync(`${candidate}/spec.json`, specPath, fs.constants.COPYFILE_EXCL);
fs.copyFileSync(`${candidate}/fig-55.svg`, svgPath, fs.constants.COPYFILE_EXCL);
render.spec.path = specPath;
render.output.svg.path = svgPath;
fs.writeFileSync(`${final}/fig-55.render.json`, `${JSON.stringify(render, null, 2)}\n`, { flag: "wx" });
const normalized = structuredClone(render);
normalized.spec.path = read(`${candidate}/fig-55.render.json`).spec.path;
normalized.output.svg.path = read(`${candidate}/fig-55.render.json`).output.svg.path;
assert.deepEqual(normalized, read(`${candidate}/fig-55.render.json`));
fs.writeFileSync(`${base}/n39-fig55-path-promotion.json`, `${JSON.stringify({
  independentApproval: ref(approved),
  final: [specPath, svgPath, `${final}/fig-55.render.json`].map(ref),
  exactSpecAndSvgBytes: true, renderChanges: ["spec.path", "output.svg.path"],
  pending: ["independent-path-only-review", "edition-finalization-text-binding", "offline-display"],
}, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ copiedApprovedFigureBytes: true, independentPathOnlyReviewPending: true }));

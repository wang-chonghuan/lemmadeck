import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck";
assert.equal(process.cwd(), root);
const ticketTmp = path.join(root, ".intentfold/tickets/STEMROBIN-188/tmp");
const authorDir = path.join(ticketTmp, "n42-fig02-collision-repair-02");
const oldReportPath = path.join(ticketTmp, "n42-modern-figure-review/report.json");
const load = file => JSON.parse(fs.readFileSync(file, "utf8"));
const hash = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, sha256: hash(bytes), bytes: bytes.length };
};
const old = load(oldReportPath);
const author = load(path.join(authorDir, "report.json"));
const deliverables = load(path.join(authorDir, "deliverables.json"));
const bindings = {};
function verify(id, expected) {
  const actual = bind(expected.path);
  assert.equal(actual.sha256, expected.sha256, expected.path);
  if (expected.bytes !== undefined) assert.equal(actual.bytes, expected.bytes);
  bindings[id] = actual;
}
verify("oldReport", author.defect.provenance);
for (const [id, expected] of Object.entries(deliverables.outputs)) verify(id, expected);
for (const [id, expected] of Object.entries(deliverables.reports)) verify(`author-${id}`, expected);
for (const [id, expected] of Object.entries(author.evidence)) verify(`authorEvidence-${id}`, expected);
for (const [id, expected] of Object.entries(author.oldProvenance)) verify(`historical-${id}`, expected);
for (const id of [
  "lesson", "exercises", "authorInventory", "authorContext", "authorReport",
  "authorNormalWidth", "authorRepairLedger", "displayReceipt", "f02Source",
  "f02Spec", "f02Svg", "f02Render", "f02Preview", "skill", "qualityGate",
]) verify(`old-${id}`, old.bindings[id]);
bindings.authorDeliverables = bind(path.join(authorDir, "deliverables.json"));
bindings.productionResume = bind(path.join(root,
  ".claude/skills/ld-s10y-lesson/references/production-resume.md"));

const before = load(bindings.beforeSpec.path);
const candidate = load(bindings.candidateSpec.path);
assert.equal(bindings.beforeSpec.sha256, old.bindings.f02Spec.sha256);
assert.deepEqual(before, load(old.bindings.f02Spec.path));
const changes = [];
function diff(a, b, pointer = "") {
  if (JSON.stringify(a) === JSON.stringify(b)) return;
  if (a === null || b === null || typeof a !== "object" || typeof b !== "object") {
    changes.push({ pointer, before: a, after: b });
    return;
  }
  for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
    diff(a[key], b[key], `${pointer}/${key}`);
  }
}
diff(before, candidate);
assert.deepEqual(changes, [
  { pointer: "/objects/29/from/1", before: 179, after: 163 },
  { pointer: "/objects/29/to/1", before: 179, after: 163 },
  { pointer: "/objects/36/at/1", before: 154, after: 138 },
  { pointer: "/assertions/46/from/1", before: 179, after: 163 },
  { pointer: "/assertions/46/to/1", before: 179, after: 163 },
]);
assert.equal(candidate.objects[29].id, "vector-mark-box-k-label");
assert.equal(candidate.objects[36].id, "box-k-label");
assert.equal(candidate.assertions[46].id, "connects-vector-mark-box-k-label");
assert.deepEqual(candidate.source, before.source);
assert.equal(candidate.source.image.sha256, bindings["old-f02Source"].sha256);
const render = load(bindings.candidateRender.path);
assert.equal(render.status, "pass");
assert.equal(render.spec.sha256, bindings.candidateSpec.sha256);
assert.equal(render.output.svg.sha256, bindings.candidateSvg.sha256);
assert.equal(path.resolve(root, render.spec.path), bindings.candidateSpec.path);
assert.equal(path.resolve(root, render.output.svg.path), bindings.candidateSvg.path);
assert.deepEqual(render.collisions, []);
assert.ok(render.displayChecks.every(check => check.status === "pass"));

const lesson = load(old.bindings.lesson.path);
const exercises = load(old.bindings.exercises.path);
const context = load(old.bindings.authorContext.path);
const semantic = [
  ...lesson.prose.filter(item => ["p", "cap"].includes(item.kind))
    .map(item => ({ lesson: lesson.id, text: item.text })),
  ...exercises.exercises.map(item =>
    ({ lesson: lesson.id, exercise: String(item.number), text: item.text })),
];
const semanticTextSha256 = hash(JSON.stringify(semantic));
assert.equal(semanticTextSha256, old.textBinding.semanticTextSha256);
assert.deepEqual(semantic, context.authoritativeText);
assert.deepEqual(semantic, candidate.source.authoritativeText);
bindings.currentFiguresTemplate = bind(context.templates.find(item => item.name === "figures").path);
const currentF02Entry = load(bindings.currentFiguresTemplate.path).figures
  .find(item => item.id === "fig-g10-02");
assert.equal(currentF02Entry.source.png.sha256, bindings["old-f02Source"].sha256);

const svg = bindings.candidateSvg.path;
const oldSvg = old.bindings.f02Svg.path;
const xpath = (expression, file = svg) => execFileSync("xmllint",
  ["--xpath", expression, file], { cwd: root, encoding: "utf8" }).trim();
const prefix = "ld-fig-g10-02_ld-";
const head = `//*[@data-arrowhead-for='${prefix}vector-mark-box-k-label']`;
const shaft = `//*[@id='${prefix}vector-mark-box-k-label']`;
const edge = `//*[@id='${prefix}box-xy-x']`;
const attr = (selector, name) => xpath(`string(${selector}/@${name})`);
const numeric = (selector, name) => {
  const value = parseFloat(attr(selector, name));
  assert.ok(Number.isFinite(value), `${selector}/@${name}`);
  return value;
};
const transform = attr(head, "transform");
const headPath = xpath(`string(${head}/*[local-name()='path']/@d)`);
assert.equal(headPath, "M 0,0 L 10,5 L 0,10 z");
const match = transform.match(
  /^translate\(([-\d.e]+) ([-\d.e]+)\) rotate\(([-\d.e]+)\) scale\(([-\d.e]+)\) translate\(([-\d.e]+) ([-\d.e]+)\)$/,
);
assert.ok(match);
const [tx, ty, degrees, scale, dx, dy] = match.slice(1).map(Number);
const radians = degrees * Math.PI / 180;
const triangle = [[0, 0], [10, 5], [0, 10]].map(([x, y]) => {
  const u = (x + dx) * scale;
  const v = (y + dy) * scale;
  return [tx + u * Math.cos(radians) - v * Math.sin(radians),
    ty + u * Math.sin(radians) + v * Math.cos(radians)];
});
const line = selector => Object.fromEntries(
  ["x1", "y1", "x2", "y2", "stroke-width"].map(name => [name, numeric(selector, name)]),
);
const hiddenEdge = { ...line(edge), dash: attr(edge, "stroke-dasharray"), cap: attr(edge, "stroke-linecap") };
const notationShaft = line(shaft);
assert.equal(hiddenEdge.y1, hiddenEdge.y2);
assert.equal(hiddenEdge.y1, 217);
assert.equal(hiddenEdge["stroke-width"], 2.5);
assert.equal(hiddenEdge.dash, "5,5");
assert.equal(hiddenEdge.cap, "butt");
assert.equal(notationShaft.y1, notationShaft.y2);
assert.equal(notationShaft.y1, 237);
const footprintTop = Math.min(...triangle.map(point => point[1]),
  notationShaft.y1 - notationShaft["stroke-width"] / 2);
const edgeBottom = hiddenEdge.y1 + hiddenEdge["stroke-width"] / 2;
const clearance480 = footprintTop - edgeBottom;
assert.ok(clearance480 > 0);
const collision = {
  method: "Independent XML extraction and affine transformation of the filled triangle plus shaft envelope, compared with the entire continuous hidden-edge stroke envelope.",
  headPath, transform, triangle, hiddenEdge, notationShaft,
  footprintTop, edgeBottom, clearance480, clearance300: clearance480 * 300 / 480,
  positiveFilledIntersection: false,
};

const attributed = "//*[count(@*) > 0]";
const count = Number(xpath(`count(${attributed})`));
assert.equal(count, Number(xpath(`count(${attributed})`, oldSvg)));
const svgChangedNodes = [];
for (let index = 1; index <= count; index++) {
  const selector = `(${attributed})[${index}]`;
  const identity = `concat(name(${selector}), '|', ${selector}/@id, '|', ${selector}/@data-arrowhead-for, '|', ${selector}/@data-label-id)`;
  const key = xpath(identity);
  assert.equal(key, xpath(identity, oldSvg));
  if (xpath(`${selector}/@*`) !== xpath(`${selector}/@*`, oldSvg)) svgChangedNodes.push(key);
}
assert.deepEqual(svgChangedNodes.sort(), [
  `ellipse|ld-fig-g10-02_jxgBoard1P36||`,
  `ellipse|ld-fig-g10-02_jxgBoard1P37||`,
  `g||${prefix}vector-mark-box-k-label|`,
  `line|${prefix}vector-mark-box-k-label||`,
  "text|||box-k-label-label",
].sort());
assert.equal(xpath("string(/*)"), xpath("string(/*)", oldSvg));
const helpers = ["ld-fig-g10-02_jxgBoard1P36", "ld-fig-g10-02_jxgBoard1P37"];
for (const id of helpers) assert.equal(attr(`//*[@id='${id}']`, "display"), "none");
const textY = numeric("//*[@data-label-id='box-k-label-label']", "y");
assert.equal(textY, 262);
const pngDimensions = {};
for (const id of ["new480", "new300"]) {
  const bytes = fs.readFileSync(bindings[id].path);
  assert.equal(bytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  pngDimensions[id] = [bytes.readUInt32BE(16), bytes.readUInt32BE(20)];
}
assert.deepEqual(pngDimensions, { new480: [480, 400], new300: [300, 250] });
const priorCounter = load(old.bindings.authorRepairLedger.path);
assert.equal(priorCounter.contentRepairsUsedPerFigure, 1);
assert.deepEqual(author.contentRevisionCounter, deliverables.contentRevisionCounter);
assert.equal(author.contentRevisionCounter.prior, 1);
assert.equal(author.contentRevisionCounter.newDelta, 1);
assert.equal(author.contentRevisionCounter.cumulative, 2);
assert.equal(author.contentRevisionCounter.reset, false);
bindings.diagnostics = bind(new URL(import.meta.url).pathname);
console.log(JSON.stringify({
  status: "pass", bindings, changes, semanticTextSha256,
  currentTemplatesByteIdenticalToOld: { lesson: true, exercises: true },
  currentF02Entry, renderExactBinding: true, renderChecksReused: render.displayChecks,
  collision, svgAttributedNodesCompared: count, svgChangedNodes,
  svgTextContentExactlyUnchanged: true, pngDimensions, kTextScreenBaselineY: textY,
  contentRevisionCounter: author.contentRevisionCounter,
  io: { writes: 0, imagePayloadLoads: 0, rerenders: 0, browsers: 0, network: 0 },
}, null, 2));

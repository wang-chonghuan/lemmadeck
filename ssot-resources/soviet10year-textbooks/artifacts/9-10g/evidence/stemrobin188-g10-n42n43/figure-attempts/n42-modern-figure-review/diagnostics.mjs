import fs from "node:fs";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import path from "node:path";

const root = "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck";
if (process.cwd() !== root) throw new Error("Unexpected cwd");
const author = ".intentfold/tickets/STEMROBIN-188/tmp/n42-image-author";
const display = ".intentfold/tickets/STEMROBIN-188/tmp/n42-current-display";
const textRoot = ".intentfold/tickets/STEMROBIN-188/tmp/g10-n42n43/work/adapt/9-10g/modern-us-neutral/lessons/geo910-c2-s1-n42";
const load = p => JSON.parse(fs.readFileSync(p, "utf8"));
const hash = b => crypto.createHash("sha256").update(b).digest("hex");
const bindings = {};
function bind(id, p) {
  const bytes = fs.readFileSync(p);
  bindings[id] = { path: path.resolve(p), sha256: hash(bytes), bytes: bytes.length };
}
bind("lesson", `${textRoot}/lesson.template.json`);
bind("exercises", `${textRoot}/exercises.template.json`);
for (const [id, filename] of Object.entries({
  authorInventory: "source-inventory.md",
  authorContext: "context-binding.json",
  authorReport: "author-report.md",
  authorNormalWidth: "normal-width-evidence.json",
  authorRepairLedger: "label-repair-attempts.json",
})) bind(id, `${author}/${filename}`);
bind("displayReceipt", `${display}/display.json`);
bind("display300", `${display}/width-300.png`);
for (const n of ["01", "02"]) {
  bind(`f${n}Source`, `ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-g10-${n}.png`);
  for (const [kind, suffix] of Object.entries({
    Spec: "spec.json", Svg: "svg", Render: "render.json", Preview: "preview.png",
  })) bind(`f${n}${kind}`, `${author}/fig-g10-${n}.label-repair.${suffix}`);
}

const lesson = load(bindings.lesson.path);
const exercises = load(bindings.exercises.path);
const context = load(bindings.authorContext.path);
const semanticText = [
  ...lesson.prose.filter(x => ["p", "cap"].includes(x.kind)).map(x => ({ lesson: lesson.id, text: x.text })),
  ...exercises.exercises.map(x => ({ lesson: lesson.id, exercise: String(x.number), text: x.text })),
];
const textBinding = {
  currentLessonSha256: bindings.lesson.sha256,
  authorLessonSha256: context.templates.find(x => x.name === "lesson").sha256,
  currentExercisesEqualAuthorHash: bindings.exercises.sha256 === context.templates.find(x => x.name === "exercises").sha256,
  semanticTextSha256: hash(JSON.stringify(semanticText)),
  semanticTextExactlyEqualsAuthorContext: JSON.stringify(semanticText) === JSON.stringify(context.authoritativeText),
  prose8Changes: lesson.prose[8].changes,
  metadataOnlyDifference: "User-supplied closed-text-review premise; prior full template bytes not reconstructed.",
};

const dot = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0);
const subtract = (a, b) => a.map((v, i) => v - b[i]);
const close = (a, b) => JSON.stringify(a) === JSON.stringify(b) ||
  (Array.isArray(a) ? a.every((v, i) => Math.abs(v - b[i]) < 1e-6) : Math.abs(a - b) < 1e-6);
const checks = {};
for (const n of ["01", "02"]) {
  const spec = load(bindings[`f${n}Spec`].path);
  const render = load(bindings[`f${n}Render`].path);
  const objects = new Map(spec.objects.map(o => [o.id, o]));
  const point = p => Array.isArray(p) ? p : objects.get(p).at;
  const failures = [];
  for (const a of spec.assertions) {
    let pass;
    if (a.type === "connects") {
      const o = objects.get(a.arrow);
      pass = Boolean(o) && close(point(o.from), point(a.from)) && close(point(o.to), point(a.to));
    } else if (a.type === "displacement") {
      pass = close(subtract(point(a.to), point(a.from)), [a.dx, a.dy]);
    } else if (a.type === "parallel" || a.type === "collinear") {
      const u = subtract(point(a.b), point(a.a));
      const v = a.type === "parallel" ? subtract(point(a.d), point(a.c)) : subtract(point(a.c), point(a.a));
      pass = Math.abs(u[0] * v[1] - u[1] * v[0]) < 1e-6;
    } else {
      throw new Error(`Unexpected assertion type ${a.type}`);
    }
    if (!pass) failures.push(a.id);
  }
  const inventory = spec.source.inventory.find(g => g.requires?.includes("pointRelationships"));
  const groupObjects = new Set(inventory.objects);
  const groupAssertions = spec.assertions.filter(a => inventory.assertions.includes(a.id));
  const uncoveredPoints = inventory.objects.filter(id => objects.get(id).type === "point").filter(id =>
    !groupAssertions.some(a => a.type === "connects" && (a.from === id || a.to === id) &&
      typeof a.from === "string" && typeof a.to === "string" && groupObjects.has(a.from) && groupObjects.has(a.to)));
  checks[`f${n}`] = {
    sourceHashMatches: spec.source.image.sha256 === bindings[`f${n}Source`].sha256,
    specHashMatchesRender: render.spec.sha256 === bindings[`f${n}Spec`].sha256,
    svgHashMatchesRender: render.output.svg.sha256 === bindings[`f${n}Svg`].sha256,
    specTextEqualsCurrent: JSON.stringify(spec.source.authoritativeText) === JSON.stringify(semanticText),
    assertionCount: spec.assertions.length,
    assertionFailures: failures,
    uncoveredSourceGroupPoints: uncoveredPoints,
    forbidden2dMetricAssertions: spec.assertions.filter(a => ["perpendicular", "equalLength", "distance"].includes(a.type)).map(a => a.id),
    textLabels: spec.objects.filter(o => o.type === "text").map(o => o.text),
    independentScaledFontPx: spec.display.widths.map(width => ({
      width, minTextPx: Math.min(...spec.objects.filter(o => o.type === "text").map(o => o.fontSize)) * width / spec.canvas.width,
    })),
    existingMachineStatus: render.status,
  };
}
const box = load(bindings.f02Spec.path);
const sourceEdges = [
  "box-x-component", "box-y-component", "box-z-component", "box-y-yz",
  "box-yz-z", "box-z-xz", "box-xz-x", "box-yz-xyz", "box-xyz-xz",
  "box-y-xy", "box-xy-x", "box-xy-xyz",
].map(id => box.objects.find(o => o.id === id));
const degrees = {};
for (const e of sourceEdges) for (const p of [e.from, e.to]) degrees[p] = (degrees[p] ?? 0) + 1;
checks.f02.cuboid = {
  edgeCount: sourceEdges.length,
  solidEdges: sourceEdges.filter(e => e.dash === 0).map(e => e.id),
  hiddenEdges: sourceEdges.filter(e => e.dash === 2).map(e => e.id),
  vertexDegrees: degrees,
  diagonal: box.objects.find(o => o.id === "box-a"),
};

const basis3d = {
  gramMatrix: context.basis3d.map(a => context.basis3d.map(b => dot(a, b))),
  f01ScreenOrigin: [203, 246],
  f01ScreenProjectionOfUnitBasis: [[-124, 104], [190, 0], [0, -189]],
  f01Interpretation: "A linear projection of an orthonormal spatial basis, not three independent or perpendicular 2D vectors.",
  f02ProjectionResiduals: Object.entries(context.box3d).map(([id, p]) => {
    const screen = [0, 1].map(j => [300, 322][j] + p.reduce((s, v, i) => s + v * context.projection[i][j], 0));
    const at = box.objects.find(o => o.id === id).at;
    return { id, residual: subtract(screen, [at[0], 400 - at[1]]) };
  }),
  f02SpatialDiagonal: subtract(context.box3d["box-xyz"], context.box3d["box-o"]),
  f02ConstructionParametersAreNotSourceGivens: true,
};

// Read the actual exported SVG through a structured XML parser, without a browser or renderer.
function xpath(expression) {
  return execFileSync("xmllint", ["--xpath", expression, bindings.f02Svg.path], { encoding: "utf8", cwd: root }).trim();
}
const headSelector = "//*[@data-arrowhead-for='ld-fig-g10-02_ld-vector-mark-box-k-label']";
const edgeSelector = "//*[@id='ld-fig-g10-02_ld-box-xy-x']";
const transform = xpath(`string(${headSelector}/@transform)`);
const headPath = xpath(`string(${headSelector}/*[local-name()='path']/@d)`);
if (headPath !== "M 0,0 L 10,5 L 0,10 z") throw new Error("Unexpected arrowhead path");
const match = transform.match(/^translate\(([-\d.e]+) ([-\d.e]+)\) rotate\(([-\d.e]+)\) scale\(([-\d.e]+)\) translate\(([-\d.e]+) ([-\d.e]+)\)$/);
if (!match) throw new Error("Unexpected exported transform");
const [tx, ty, rotation, scale, dx, dy] = match.slice(1).map(Number);
const angle = rotation * Math.PI / 180;
const triangle = [[0, 0], [10, 5], [0, 10]].map(([x, y]) => {
  const u = scale * (x + dx), v = scale * (y + dy);
  return [tx + u * Math.cos(angle) - v * Math.sin(angle), ty + u * Math.sin(angle) + v * Math.cos(angle)];
});
const attr = name => xpath(`string(${edgeSelector}/@${name})`);
const edge = {
  x1: Number(attr("x1")), y1: Number(attr("y1")),
  x2: Number(attr("x2")), y2: Number(attr("y2")),
  strokeWidth: parseFloat(attr("stroke-width")), dashArray: attr("stroke-dasharray"), cap: attr("stroke-linecap"),
};
if (edge.y1 !== edge.y2 || edge.dashArray !== "5,5" || edge.cap !== "butt" || attr("stroke-dashoffset") !== "") {
  throw new Error("Unexpected hidden edge geometry");
}
const clip = (poly, axis, bound, keepGreater) => {
  const out = [];
  const inside = p => keepGreater ? p[axis] >= bound : p[axis] <= bound;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    if (inside(a)) out.push(a);
    if (inside(a) !== inside(b)) {
      const t = (bound - a[axis]) / (b[axis] - a[axis]);
      out.push(a.map((v, j) => v + t * (b[j] - v)));
    }
  }
  return out;
};
const area = p => Math.abs(p.reduce((s, a, i) => {
  const b = p[(i + 1) % p.length];
  return s + a[0] * b[1] - b[0] * a[1];
}, 0)) / 2;
const intersections = [];
for (let start = edge.x1; start < edge.x2; start += 10) {
  const rect = [start, Math.min(start + 5, edge.x2), edge.y1 - edge.strokeWidth / 2, edge.y1 + edge.strokeWidth / 2];
  let p = triangle;
  for (const [axis, bound, greater] of [[0, rect[0], true], [0, rect[1], false], [1, rect[2], true], [1, rect[3], false]]) p = clip(p, axis, bound, greater);
  if (p.length >= 3 && area(p) > 0) intersections.push({
    dashRectCanvas: rect,
    intersectionPolygonCanvas: p,
    areaCanvasPx2: area(p),
    areaAt300Px2: area(p) * (300 / 480) ** 2,
  });
}
const collision = {
  method: "Exact exported filled triangle clipped against each actual 5-on/5-off butt-capped hidden-edge stroke rectangle; no raster or geometry regeneration.",
  exportedArrowheadTransform: transform,
  exportedArrowheadPath: headPath,
  arrowheadTriangleCanvas: triangle,
  hiddenEdge: edge,
  scale300: 300 / 480,
  arrowheadTop300: Math.min(...triangle.map(p => p[1])) * 300 / 480,
  hiddenEdgeBottom300: (edge.y1 + edge.strokeWidth / 2) * 300 / 480,
  verticalFootprintOverlap300: ((edge.y1 + edge.strokeWidth / 2) - Math.min(...triangle.map(p => p[1]))) * 300 / 480,
  intersections,
  positiveFilledIntersection: intersections.length > 0,
  disposition: intersections.length > 0
    ? "HOLD retained; author bounding-box concern independently supported by actual filled geometry."
    : "Filled intersection absent; visual concern requires reassessment, not automatic approval.",
};
const integrityPass = textBinding.currentExercisesEqualAuthorHash &&
  textBinding.semanticTextExactlyEqualsAuthorContext &&
  Object.values(checks).every(c => c.sourceHashMatches && c.specHashMatchesRender &&
    c.svgHashMatchesRender && c.specTextEqualsCurrent &&
    c.assertionFailures.length === 0 && c.uncoveredSourceGroupPoints.length === 0);
console.log(JSON.stringify({
  schema: "n42-independent-modern-figure-diagnostics@1",
  cwd: root, integrityPass, bindings, textBinding, checks, basis3d, collision,
  io: { writes: 0, imageLoads: 0, rendererCalls: 0, validatorCalls: 0, networkCalls: 0 },
}, null, 2));
if (!integrityPass) process.exitCode = 2;

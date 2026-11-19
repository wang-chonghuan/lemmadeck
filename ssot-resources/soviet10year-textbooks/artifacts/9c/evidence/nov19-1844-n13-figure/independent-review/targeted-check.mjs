import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const repo = "/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck";
const out = path.join(repo, ".tmp/stemrobin-184-resume/n13-figure-independent-review");
const author = ".tmp/stemrobin-184-resume/n13-figure-author/";
const intended = ".tmp/stemrobin-184-resume/n13-figure-promotion-candidate/";
const current = ".tmp/ld-s10y-lesson/adapt/9c/modern-us-neutral/lessons/ana9-c3-s1-n13/";
const retained = "ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov19-1844-n13-figure/independent-first/FIRST.json";
const paths = {
  source: "ssot-resources/soviet10year-textbooks/artifacts/9c/figures/tbl-p0056-01.png",
  lesson: `${current}lesson.template.json`,
  exercises: `${current}exercises.template.json`,
  independentFIRST: retained,
  spec: `${author}tbl-p0056-01.spec.json`,
  originalReport: `${author}tbl-p0056-01.render.json`,
  svg: `${author}tbl-p0056-01.svg`,
  naturalRaster: `${author}tbl-p0056-01.png`,
  unviewed350Raster: `${author}tbl-p0056-01.mobile-350.png`,
  authorResult: `${author}author-result.first.json`,
  authorInventory: `${author}source-inventory.first.json`,
  intendedReport: `${intended}tbl-p0056-01.render.json`,
  intendedReceipt: `${intended}receipt.json`,
};
const sha = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const absolute = (relative) => path.join(repo, relative);
const readJson = (relative) => JSON.parse(fs.readFileSync(absolute(relative), "utf8"));
const writeNew = (name, value) => fs.writeFileSync(path.join(out, name), `${JSON.stringify(value, null, 2)}\n`, { flag: "wx", mode: 0o444 });
const snapshot = () => Object.entries(paths).map(([role, relative]) => {
  const bytes = fs.readFileSync(absolute(relative));
  return { role, path: absolute(relative), bytes: bytes.length, sha256: sha(bytes) };
});
const pngHeader = (filename) => {
  const bytes = fs.readFileSync(filename);
  assert.equal(bytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
};
const near = (actual, expected, tolerance = 0.001) => assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} differs from ${expected}`);
const newBindings = snapshot();
writeNew("image-ledger.pre-stageB.json", {
  schema: "bounded-image-ledger@1", stage: "B", recordedAt: new Date().toISOString(),
  sameReviewerAsStageA: true, cumulativeBefore: 1, maximum: 4, reset: false,
  sourceReopens: 0, crops: 0, parentPermanent: 24, parentMaximum: 24,
  plannedViews: [
    { path: absolute(paths.naturalRaster), once: true, projectedCumulativeAfter: 2 },
    { path: path.join(out, "tbl-p0056-01.smallest-331.png"), once: true, projectedCumulativeAfter: 3 },
  ],
  inputs: newBindings,
});

const first = readJson(paths.independentFIRST);
assert.equal(newBindings.find((item) => item.role === "independentFIRST").sha256, "1cbe6768ce2678f1ab8285e65d3c3b1a2bbdacae1e1cf3e5ccfc9bf9b466f638");
assert.equal(fs.statSync(absolute(paths.independentFIRST)).mode & 0o777, 0o444);
for (const role of ["source", "lesson", "exercises"]) {
  const binding = newBindings.find((item) => item.role === role);
  const old = first.inputs.find((item) => item.path === binding.path);
  assert.ok(old, `Missing StageA binding for ${role}`);
  assert.equal(binding.sha256, old.sha256, `Current ${role} changed since StageA`);
  assert.equal(binding.bytes, old.bytes);
}
const spec = readJson(paths.spec);
const originalReport = readJson(paths.originalReport);
const intendedReport = readJson(paths.intendedReport);
const receipt = readJson(paths.intendedReceipt);
const lesson = readJson(paths.lesson);
const authorResult = readJson(paths.authorResult);
const binding = (role) => newBindings.find((item) => item.role === role);
assert.equal(spec.source.image.sha256, binding("source").sha256);
assert.equal(spec.source.image.path, paths.source);
const paragraph = lesson.prose.find((item) => item.source_refs?.includes("p0056#2"));
assert.equal(spec.source.authoritativeText[0].text, paragraph.text);
assert.equal(spec.source.authoritativeText[0].lesson, first.lesson);
assert.equal(originalReport.spec.sha256, binding("spec").sha256);
assert.equal(originalReport.output.svg.sha256, binding("svg").sha256);
assert.equal(originalReport.spec.path, paths.spec);
assert.equal(originalReport.output.svg.path, paths.svg);
assert.equal(receipt.original.sha256, binding("originalReport").sha256);
assert.equal(receipt.projected.sha256, binding("intendedReport").sha256);
assert.equal(receipt.original.path, paths.originalReport);
assert.equal(receipt.projected.path, paths.intendedReport);
assert.deepEqual(receipt.changes, ["spec.path", "output.svg.path"]);
assert.equal(receipt.currentContext.sha256, binding("lesson").sha256);
assert.equal(receipt.rendererReruns, 0);
assert.equal(receipt.exactSourceSpecSvgAndMathUnchanged, true);
for (const [role, name] of [["spec", "spec"], ["originalReport", "render"], ["svg", "svg"], ["naturalRaster", "naturalRaster"], ["unviewed350Raster", "mobileRaster"]]) {
  assert.equal(authorResult.artifacts[name].sha256, binding(role).sha256);
  assert.equal(authorResult.artifacts[name].bytes, binding(role).bytes);
}

function differences(a, b, prefix = "") {
  if (JSON.stringify(a) === JSON.stringify(b)) return [];
  if (a && b && typeof a === "object" && typeof b === "object" && !Array.isArray(a) && !Array.isArray(b)) {
    return [...new Set([...Object.keys(a), ...Object.keys(b)])].flatMap((key) => differences(a[key], b[key], prefix ? `${prefix}.${key}` : key));
  }
  return [{ field: prefix, original: a, intended: b }];
}
const metadataDiff = differences(originalReport, intendedReport);
assert.deepEqual(metadataDiff.map((item) => item.field).sort(), ["output.svg.path", "spec.path"]);
const futureRoot = "ssot-resources/soviet10year-textbooks/artifacts/9c/editions/modern-us-neutral/figures/";
assert.equal(intendedReport.spec.path, `${futureRoot}tbl-p0056-01.spec.json`);
assert.equal(intendedReport.output.svg.path, `${futureRoot}tbl-p0056-01.svg`);
assert.equal(intendedReport.spec.sha256, binding("spec").sha256);
assert.equal(intendedReport.output.svg.sha256, binding("svg").sha256);
const expectedProjection = structuredClone(originalReport);
expectedProjection.spec.path = intendedReport.spec.path;
expectedProjection.output.svg.path = intendedReport.output.svg.path;
assert.deepEqual(intendedReport, expectedProjection);

const objects = new Map(spec.objects.map((item) => [item.id, item]));
assert.equal(objects.size, spec.objects.length);
assert.equal(spec.objects.length, 34);
const assertions = new Map(spec.assertions.map((item) => [item.id, item]));
assert.equal(assertions.size, 65);
const labeled = spec.objects.filter((item) => typeof item.label === "string");
assert.equal(labeled.length, 25);
assert.deepEqual(spec.canvas.boundingBox, [0, 424, 360, 0]);
assert.equal(spec.display.purpose, "instructional");
assert.equal(spec.display.layout, "inline");
assert.equal(spec.display.maxWidthPx, 360);
assert.deepEqual(spec.display.widths, [331, 350, 360]);
assert.equal(spec.display.minTextPx, 16);

const sourceRows = first.inventory.numberRows;
const sourceMappings = [
  ["src-r0-quotient", ["division-header-quotient-0", "division-header-decimal", "division-header-quotient-1", "division-header-quotient-2", "division-header-quotient-3"]],
  ["src-r1-divisor-dividend", ["division-header-divisor-0", "division-header-divisor-1", "digit-columns-dividend-0", "digit-columns-dividend-1"]],
  ["src-r2-110", ["digit-columns-first-product-0", "digit-columns-first-product-1", "digit-columns-first-product-2"]],
  ["src-r3-100", ["digit-columns-second-dividend-0", "digit-columns-second-dividend-1", "digit-columns-second-dividend-2"]],
  ["src-r4-55", ["digit-columns-second-product-0", "digit-columns-second-product-1"]],
  ["src-r5-450", ["digit-columns-third-dividend-0", "digit-columns-third-dividend-1", "digit-columns-third-dividend-2"]],
  ["src-r6-440", ["digit-columns-third-product-0", "digit-columns-third-product-1", "digit-columns-third-product-2"]],
  ["src-r7-10", ["digit-columns-remainder-0", "digit-columns-remainder-1"]],
];
const columnX = { D0: 24, D1: 48, C0: 98, C1: 144, C2: 190, C3: 236, C4: 282, "between-C1-C2-decimal-point": 164 };
const sourceCoverage = sourceMappings.map(([sourceId, ids], index) => {
  const row = sourceRows.find((item) => item.id === sourceId);
  assert.equal(ids.length, row.glyphs.length);
  const glyphs = row.glyphs.map((glyph, i) => {
    const object = objects.get(ids[i]);
    assert.ok(object);
    assert.equal(object.type, "point");
    assert.equal(object.visible, false);
    assert.equal(object.label, glyph.value);
    near(object.at[0], columnX[glyph.column]);
    near(object.at[1], 392 - index * 50);
    assert.equal(object.fontSize, 28);
    return { sourceGlyph: glyph.id, value: glyph.value, sourceColumn: glyph.column, object: object.id, candidateAt: object.at };
  });
  return { sourceRow: sourceId, sourceLiteral: row.text, candidateLiteral: glyphs.map((item) => item.value).join(""), glyphs };
});
assert.deepEqual(new Set(sourceCoverage.flatMap((row) => row.glyphs.map((item) => item.object))), new Set(labeled.map((item) => item.id)));
assert.equal(sourceCoverage.flatMap((row) => row.glyphs).filter((item) => item.value !== ".").length, 24);
assert.equal(sourceCoverage.flatMap((row) => row.glyphs).filter((item) => item.value === ".").length, 1);

function point(reference) {
  const coordinate = Array.isArray(reference) ? reference : objects.get(reference)?.at;
  assert.ok(Array.isArray(coordinate) && coordinate.length === 2, `Unresolved coordinate: ${JSON.stringify(reference)}`);
  assert.ok(coordinate.every(Number.isFinite));
  return coordinate;
}
const assertionAudit = spec.assertions.map((item) => {
  const tolerance = item.tolerance ?? 0.001;
  assert.ok(tolerance > 0 && tolerance <= 0.001);
  let observed;
  if (item.type === "displacement") {
    const a = point(item.from);
    const b = point(item.to);
    observed = { dx: b[0] - a[0], dy: b[1] - a[1] };
    near(observed.dx, item.dx, tolerance);
    near(observed.dy, item.dy, tolerance);
  } else if (item.type === "connects") {
    const object = objects.get(item.arrow);
    assert.ok(object && ["segment", "arrow"].includes(object.type));
    const a = point(object.from), b = point(object.to);
    observed = { from: a, to: b, objectType: object.type };
    point(item.from).forEach((value, index) => near(a[index], value, tolerance));
    point(item.to).forEach((value, index) => near(b[index], value, tolerance));
  } else if (item.type === "pointOnLine") {
    const p = point(item.point), a = point(item.a), b = point(item.b);
    const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
    assert.ok(length > 0);
    const distance = Math.abs((b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0])) / length;
    near(distance, 0, tolerance);
    const t = ((p[0] - a[0]) * (b[0] - a[0]) + (p[1] - a[1]) * (b[1] - a[1])) / length ** 2;
    assert.ok(t >= 0 && t <= 1);
    observed = { distance, finiteTrackParameter: t };
  } else {
    assert.fail(`Unexpected assertion type: ${item.type}`);
  }
  return { id: item.id, type: item.type, expected: item, observed, status: "pass", groups: spec.source.inventory.filter((group) => group.assertions.includes(item.id)).map((group) => group.id) };
});
const allGroupAssertionIds = new Set(spec.source.inventory.flatMap((group) => group.assertions));
assert.deepEqual(allGroupAssertionIds, new Set(assertions.keys()));
const groupCoverage = spec.source.inventory.map((group) => {
  for (const id of group.objects) assert.ok(objects.has(id), `Unresolved group object ${id}`);
  for (const id of group.assertions) assert.ok(assertions.has(id), `Unresolved group assertion ${id}`);
  const pointEvidence = group.objects.filter((id) => objects.get(id).type === "point").map((id) => {
    const coverage = group.assertions.filter((assertionId) => {
      const item = assertions.get(assertionId);
      const references = ["from", "to", "point", "a", "b"].map((key) => item[key]).filter((value) => typeof value === "string");
      return references.includes(id) && references.every((ref) => group.objects.includes(ref));
    });
    assert.ok(coverage.length, `No wholly in-group relation for ${group.id}/${id}`);
    return { point: id, mappedRelationshipAssertions: coverage };
  });
  return { group: group.id, objectCount: group.objects.length, mappedAssertionCount: group.assertions.length, pointEvidence };
});
assert.deepEqual(groupCoverage.map((group) => group.mappedAssertionCount), [10, 29, 15, 11]);
for (const object of spec.objects.filter((item) => ["segment", "arrow"].includes(item.type))) {
  assert.ok(spec.assertions.some((item) => item.type === "connects" && item.arrow === object.id), `No fixed endpoint relation for ${object.id}`);
}
for (const arrow of ["recurrence-upper", "recurrence-lower"]) {
  const object = objects.get(arrow);
  assert.equal(object.type, "arrow");
  assert.ok(point(object.to)[0] > point(object.from)[0]);
  near(point(object.to)[1], point(object.from)[1]);
}
assert.equal(objects.get("recurrence-track-vertical").type, "segment");
const arithmetic = [];
let remainder = 12;
for (let index = 0; index < 3; index++) {
  const expanded = remainder * 10;
  const quotientDigit = Math.floor(expanded / 55);
  const product = quotientDigit * 55;
  const nextRemainder = expanded - product;
  arithmetic.push({ incomingRemainder: remainder, expanded, quotientDigit, product, nextRemainder, note: "Internal worked-example check only; no labels added to output." });
  remainder = nextRemainder;
}
assert.deepEqual(arithmetic.map((item) => item.quotientDigit), [2, 1, 8]);
assert.deepEqual(arithmetic.map((item) => item.product), [110, 55, 440]);
assert.equal(arithmetic[0].nextRemainder, arithmetic[2].nextRemainder);
assert.equal(arithmetic[0].nextRemainder, 10);

const runtime = fs.mkdtempSync(path.join(out, ".headless-runtime-"));
process.env.TMPDIR = runtime;
process.env.XDG_CACHE_HOME = runtime;
process.env.XDG_CONFIG_HOME = runtime;
const require = createRequire(path.join(repo, "app/package.json"));
const { chromium } = require("playwright");
let browser;
let dom;
try {
  browser = await chromium.launch({ headless: true, env: { ...process.env }, args: ["--disable-breakpad", "--disable-crash-reporter"] });
  const context = await browser.newContext({ viewport: { width: 331, height: 390 }, deviceScaleFactor: 1 });
  await context.route("**/*", (route) => route.abort());
  const page = await context.newPage();
  const svg = fs.readFileSync(absolute(paths.svg), "utf8");
  await page.setContent("<!doctype html><html><head><style>html,body{margin:0;padding:0;background:#fff}svg{width:331px;height:auto}</style></head><body></body></html>");
  await page.evaluate((source) => {
    const parsed = new DOMParser().parseFromString(source, "image/svg+xml");
    if (parsed.querySelector("parsererror")) throw new Error("SVG XML parse error");
    document.body.append(document.importNode(parsed.documentElement, true));
  }, svg);
  await page.evaluate(() => document.fonts.ready);
  dom = await page.evaluate(() => {
    const svg = document.querySelector("svg");
    const rect = (r) => ({ x: r.x, y: r.y, width: r.width, height: r.height, right: r.right, bottom: r.bottom });
    const labels = [...svg.querySelectorAll("text")].map((node) => ({
      id: node.getAttribute("data-label-id"), text: node.textContent,
      x: +node.getAttribute("x"), y: +node.getAttribute("y"),
      fontSize: parseFloat(getComputedStyle(node).fontSize),
      screenScale: node.getScreenCTM().a,
      finalTextPx: parseFloat(getComputedStyle(node).fontSize) * node.getScreenCTM().a,
      box: rect(node.getBoundingClientRect()), fill: getComputedStyle(node).fill,
    }));
    const lines = [...svg.querySelectorAll("line")].map((node) => ({
      id: node.id,
      x1: +node.getAttribute("x1"), y1: +node.getAttribute("y1"),
      x2: +node.getAttribute("x2"), y2: +node.getAttribute("y2"),
      width: parseFloat(getComputedStyle(node).strokeWidth), stroke: getComputedStyle(node).stroke,
      dash: getComputedStyle(node).strokeDasharray,
      markerStart: node.getAttribute("marker-start"), markerEnd: node.getAttribute("marker-end"),
      box: rect(node.getBoundingClientRect()),
    }));
    const heads = [...svg.querySelectorAll("[data-arrowhead-for]")].map((group) => {
      const local = group.transform.baseVal.consolidate().matrix;
      const vertices = [[0, 0], [10, 5], [0, 10]].map(([x, y]) => {
        const p = new DOMPoint(x, y).matrixTransform(local);
        return { x: p.x, y: p.y };
      });
      const p = group.querySelector("path");
      return {
        forLine: group.getAttribute("data-arrowhead-for"), transform: group.getAttribute("transform"),
        path: p.getAttribute("d"), vertices, box: rect(group.getBoundingClientRect()),
        fill: getComputedStyle(group).fill, display: getComputedStyle(group).display,
        opacity: getComputedStyle(group).opacity,
      };
    });
    const visibleEllipses = [...svg.querySelectorAll("ellipse")].filter((node) => getComputedStyle(node).display !== "none" && getComputedStyle(node).visibility !== "hidden").map((node) => node.id);
    return {
      viewport: { width: innerWidth, height: innerHeight, devicePixelRatio },
      canvas: rect(svg.getBoundingClientRect()), viewBox: svg.getAttribute("viewBox"),
      labels, lines, heads, visibleEllipses,
      scripts: svg.querySelectorAll("script").length, images: svg.querySelectorAll("image").length,
      unexpectedPaths: [...svg.querySelectorAll("path")].filter((node) => !node.closest("defs") && !node.closest("[data-arrowhead-for]") && getComputedStyle(node).display !== "none" && getComputedStyle(node).visibility !== "hidden").map((node) => node.id),
    };
  });
  assert.equal(dom.canvas.width, 331);
  near(dom.canvas.height, 424 * 331 / 360, 0.02);
  assert.equal(dom.labels.length, 25);
  assert.equal(dom.lines.length, 9);
  assert.equal(dom.heads.length, 2);
  assert.deepEqual(dom.visibleEllipses, []);
  assert.deepEqual(dom.unexpectedPaths, []);
  assert.equal(dom.scripts, 0);
  assert.equal(dom.images, 0);
  const labelMap = new Map(dom.labels.map((item) => [item.id, item]));
  for (const object of labeled) {
    const label = labelMap.get(`${object.id}-label`);
    assert.ok(label);
    assert.equal(label.text, object.label);
    near(label.x, object.at[0]);
    near(label.y, 424 - object.at[1]);
    assert.ok(label.finalTextPx >= 16);
    assert.ok(label.box.x > 0 && label.box.y > 0 && label.box.right < dom.canvas.right && label.box.bottom < dom.canvas.bottom, `Clipped label ${object.id}`);
  }
  const labelCollisions = [];
  for (let i = 0; i < dom.labels.length; i++) for (let j = i + 1; j < dom.labels.length; j++) {
    const a = dom.labels[i], b = dom.labels[j];
    if (Math.min(a.box.right, b.box.right) > Math.max(a.box.x, b.box.x) && Math.min(a.box.bottom, b.box.bottom) > Math.max(a.box.y, b.box.y)) labelCollisions.push([a.id, b.id]);
  }
  assert.deepEqual(labelCollisions, []);
  const lineMap = new Map(dom.lines.map((item) => [item.id, item]));
  for (const object of spec.objects.filter((item) => ["segment", "arrow"].includes(item.type))) {
    const line = lineMap.get(`ld-tbl-p0056-01_ld-${object.id}`);
    assert.ok(line);
    near(line.x1, object.from[0]);
    near(line.y1, 424 - object.from[1]);
    near(line.y2, 424 - object.to[1]);
    assert.equal(line.dash, "none");
    if (object.type === "segment") {
      near(line.x2, object.to[0]);
      assert.equal(line.markerStart, null);
      assert.equal(line.markerEnd, null);
    }
    const halfStroke = line.width * (331 / 360) / 2;
    assert.ok(line.box.x - halfStroke > 0 && line.box.right + halfStroke < 331);
    assert.ok(line.box.y - halfStroke > 0 && line.box.bottom + halfStroke < dom.canvas.bottom);
  }
  const arrowHeads = dom.heads.map((head) => {
    assert.equal(head.path, "M 0,0 L 10,5 L 0,10 z");
    assert.equal(head.opacity, "1");
    assert.notEqual(head.display, "none");
    const objectId = head.forLine.replace("ld-tbl-p0056-01_ld-", "");
    const object = objects.get(objectId);
    assert.equal(object.type, "arrow");
    const [upperBase, tip, lowerBase] = head.vertices;
    assert.ok(tip.x > upperBase.x && tip.x > lowerBase.x);
    near(upperBase.x, lowerBase.x);
    near(tip.y, 424 - object.to[1], 0.1);
    near(tip.x, object.to[0], 0.1);
    const sourceArrow = first.inventory.arrows.find((item) => item.id === (objectId === "recurrence-upper" ? "src-arrow-to-100" : "src-arrow-to-10"));
    assert.equal(sourceArrow.direction, "RIGHT");
    const targetObject = objects.get(objectId === "recurrence-upper" ? "digit-columns-second-dividend-0" : "digit-columns-remainder-0");
    const targetLabel = labelMap.get(`${targetObject.id}-label`);
    assert.ok(tip.x < targetObject.at[0]);
    near(tip.y, 424 - targetObject.at[1], 0.1);
    assert.ok(head.box.right < targetLabel.box.x, "Arrowhead overlaps target glyph");
    assert.ok(head.box.x > 0 && head.box.y > 0 && head.box.right < 331 && head.box.bottom < dom.canvas.bottom);
    return { sourceArrow: sourceArrow.id, objectId, direction: "RIGHT", actualTip: tip, targetObject: targetObject.id, targetAt: targetObject.at, screenGapToGlyphPx: targetLabel.box.x - head.box.right };
  });
  dom.arrowHeadAudit = arrowHeads;
  dom.labelCollisions = labelCollisions;
  dom.minTextPx = Math.min(...dom.labels.map((item) => item.finalTextPx));
  dom.boundaryEvidence = {
    fullCanvasIncluded: true, all25TextBoxesInside: true, all9StrokeBoxesInside: true, bothHeadBoxesInside: true,
    rightmostStrokeX: Math.max(...dom.lines.map((item) => item.box.right + item.width * 331 / 360 / 2)),
    lowestTextBottom: Math.max(...dom.labels.map((item) => item.box.bottom)),
    rightClearancePx: 331 - Math.max(...dom.lines.map((item) => item.box.right + item.width * 331 / 360 / 2)),
    bottomClearancePx: dom.canvas.bottom - Math.max(...dom.labels.map((item) => item.box.bottom)),
  };
  const fullScreenshot = await page.screenshot({
    path: path.join(out, "tbl-p0056-01.smallest-331.png"),
    fullPage: true,
    animations: "disabled",
  });
  assert.equal(pngHeader(path.join(out, "tbl-p0056-01.smallest-331.png")).width, 331);
  dom.projection = {
    method: "Isolated headless Chromium, parsed unchanged SVG, full-canvas 331px CSS projection at DPR1; not official renderer, no SVG regeneration.",
    sha256: sha(fullScreenshot),
    raster: pngHeader(path.join(out, "tbl-p0056-01.smallest-331.png")),
    sourceSvgSha256: binding("svg").sha256,
    observedByReviewer: false,
  };
} finally {
  if (browser) await browser.close();
  fs.rmSync(runtime, { recursive: true, force: true });
}
assert.deepEqual(snapshot(), newBindings, "An input changed during targeted review");
assert.deepEqual(pngHeader(absolute(paths.naturalRaster)), { width: 360, height: 424 });
const result = {
  schema: "independent-targeted-figure-check@1",
  stage: "B",
  status: "pass-mechanical-only-pending-two-visual-views",
  recordedAt: new Date().toISOString(),
  inputs: newBindings,
  sourceBasis: { path: absolute(retained), sha256: binding("independentFIRST").sha256, stageAReplayed: false, sourceReopened: false },
  currentContext: { fullStageATextStillBound: true, figureParagraphExact: true, currentLessonSha256: binding("lesson").sha256, currentExercisesSha256: binding("exercises").sha256 },
  metadataProjection: { originalSha256: binding("originalReport").sha256, intendedSha256: binding("intendedReport").sha256, differences: metadataDiff, sameActualSpecAndSvg: true, intendedOnlyNotPromoted: true },
  sourceCoverage,
  assertionAudit,
  groupCoverage,
  arithmetic,
  svgDom: dom,
  untouchedPassStages: "No official validator, renderer, record_review, publisher or prior-stage check invoked. Independent executable check evaluated the 65 existing relationships once.",
  imageUsageAtCommandEnd: { cumulativeLoadedIntoReviewer: 1, pendingVisualViews: 2, expectedFinal: 3, maximum: 4, reset: false },
};
writeNew("targeted-check.result.json", result);
console.log(JSON.stringify({
  status: result.status,
  inputBindings: newBindings,
  rows: sourceCoverage.map((row) => ({ source: row.sourceRow, literal: row.candidateLiteral, columns: row.glyphs.map((glyph) => glyph.sourceColumn) })),
  assertions: assertionAudit.map((item) => ({ id: item.id, type: item.type, groups: item.groups, status: item.status })),
  groupCoverage,
  metadataProjection: result.metadataProjection,
  arrowHeads: dom.arrowHeadAudit,
  minTextAtActual331Px: dom.minTextPx,
  fullBoundaryEvidence: dom.boundaryEvidence,
  projection: dom.projection,
  imageUsage: result.imageUsageAtCommandEnd,
}, null, 2));

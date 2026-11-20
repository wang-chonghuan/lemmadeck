import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";

const root = "/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck";
assert.equal(process.cwd(), root);
const output = path.join(root, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d137-t9-figures-review");
const input = path.join(root, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d137-t9-figures-review-input");
const read = p => JSON.parse(fs.readFileSync(p, "utf8"));
const digest = b => crypto.createHash("sha256").update(b).digest("hex");
const binding = p => {
  const bytes = fs.readFileSync(p);
  return { path: path.resolve(p), bytes: bytes.length, sha256: digest(bytes) };
};
const textBinding = (locator, text) => ({
  locator, encoding: "UTF-8", bytes: Buffer.byteLength(text), sha256: digest(Buffer.from(text))
});
const save = (name, data) => fs.writeFileSync(path.join(output, name), JSON.stringify(data, null, 2) + "\n", { flag: "wx" });
const original = read(path.join(input, "source-only.json"));
const visible = read(path.join(input, "visible-bilingual-and-labels.json"));
const selected = read(path.join(input, "candidate-only.json"));
const verifiedBindings = [];
const verify = record => {
  const current = binding(record.path);
  assert.equal(current.sha256, record.sha256, record.path);
  assert.equal(current.bytes, record.bytes, record.path);
  verifiedBindings.push(current);
  return current;
};
const suppliedFiles = [
  ...original.images.map(x => x.source), original.originalDefinitionFile,
  ...visible.newLabels.map(x => x.binding),
  ...selected.figures.flatMap(f => Object.values(f).filter(v => v && typeof v === "object" && v.path && v.sha256 && v.bytes)),
  selected.authorFreezeOpaqueProvenance
];
for (const r of suppliedFiles) verify(r);
const definitions = read(original.originalDefinitionFile.path).prose;
for (const p of original.originalDefinitionParagraphs) assert(definitions.some(x => JSON.stringify(x) === JSON.stringify(p)));
const zhQ2 = original.originalT9Questions.split("\n\n")[1].replace(/^2\. /, "");
const enQ2 = visible.fullText.en.split("\n\n")[1].replace(/^2\. /, "");
assert.equal(visible.fullText.zh, original.originalT9Questions);
const exercises = read(visible.newLabels.find(x => x.name === "exercises").binding.path);
const q2 = exercises.exercises.find(x => String(x.number) === "2");
assert.equal(q2.text, enQ2);
assert.equal(q2.source_text, zhQ2);
const expectedLabels = [{ id: "fig-24", label: "Figure 24" }, { id: "fig-30", label: "Figure 30" }];
assert.deepEqual(q2.figures.map(({ id, label }) => ({ id, label })), expectedLabels);
assert.deepEqual(read(visible.newLabels.find(x => x.name === "figures").binding.path).figures.map(({ id, label }) => ({ id, label })), expectedLabels);
assert.deepEqual(q2.figure_refs, ["fig-24", "fig-30"]);

// Parse the actual XML with the standard-library XML parser, without a browser or render.
const xmlParser = `import sys,json,xml.etree.ElementTree as E
r=E.parse(sys.argv[1]).getroot()
ns="{http://www.w3.org/2000/svg}"
print(json.dumps({"root":r.attrib,"paths":[p.attrib for p in r.iter(ns+"path")],"lines":[p.attrib for p in r.iter(ns+"line")],"arrowheads":[{"attributes":g.attrib,"paths":[p.attrib for p in g.iter(ns+"path")]} for g in r.iter(ns+"g") if "data-arrowhead-for" in g.attrib],"texts":[{"text":"".join(t.itertext()),"attributes":t.attrib} for t in r.iter(ns+"text")]}))`;
const parsedSvg = p => JSON.parse(execFileSync("python3", ["-B", "-c", xmlParser, p], { cwd: root, encoding: "utf8" }));
const close = (a, b, eps = 1e-8) => assert(Math.abs(a - b) <= eps, `${a} != ${b}`);
const cubicPaths = d => {
  const tokens = d.match(/[A-Za-z]|[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/g);
  assert.equal(tokens.shift(), "M");
  let start = [Number(tokens.shift()), Number(tokens.shift())];
  const segments = [];
  while (tokens.length) {
    assert.equal(tokens.shift(), "C");
    const p = Array.from({ length: 3 }, () => [Number(tokens.shift()), Number(tokens.shift())]);
    assert(p.flat().every(Number.isFinite));
    segments.push([start, ...p]);
    start = p[2];
  }
  return segments;
};
const evaluate = (s, t) => [0, 1].map(k => (1-t)**3*s[0][k] + 3*(1-t)**2*t*s[1][k] + 3*(1-t)*t*t*s[2][k] + t**3*s[3][k]);
const atX = (segments, x) => {
  const s = segments.find(s => x >= s[0][0]-1e-8 && x <= s[3][0]+1e-8);
  assert(s);
  let lo = 0, hi = 1;
  for (let i = 0; i < 70; i++) {
    const mid = (lo+hi)/2;
    if (evaluate(s, mid)[0] < x) lo = mid; else hi = mid;
  }
  return evaluate(s, (lo+hi)/2);
};
const results = [];
for (const f of selected.figures) {
  const spec = read(f.spec.path);
  const svg = parsedSvg(f.svg.path);
  const objects = new Map(spec.objects.map(o => [o.id, o]));
  const assertions = new Map(spec.assertions.map(a => [a.id, a]));
  const p = id => objects.get(id).at;
  const render = read(f.nativeRender.path);
  assert.equal(render.status, "pass");
  assert.equal(render.spec.sha256, f.spec.sha256);
  assert.equal(render.output.svg.sha256, f.svg.sha256);
  const validationReceipt = read(f.nativeValidationReceipt.path);
  const renderingReceipt = read(f.nativeRenderReceipt.path);
  assert.equal(validationReceipt.exitCode, 0);
  assert.equal(renderingReceipt.exitCode, 0);
  assert.equal(JSON.parse(validationReceipt.stdout).status, "pass");
  assert.equal(validationReceipt.cwd, root);
  assert.equal(renderingReceipt.cwd, root);
  const inheritedGeometry = read(f.executableGeometry.path);
  const previewReceipt = read(f.previewReceipt.path);
  assert.equal(inheritedGeometry.status, "pass");
  assert.equal(inheritedGeometry.spec.sha256, f.spec.sha256);
  assert.equal(previewReceipt.status, "pass");
  assert.equal(previewReceipt.spec.sha256, f.spec.sha256);
  assert.equal(previewReceipt.nativeSvg.sha256, f.svg.sha256);
  assert.equal(previewReceipt.preview.sha256, f.preview.sha256);
  assert.equal(previewReceipt.width, 640);
  assert.equal(svg.root.width, "640");
  assert.deepEqual(spec.display.widths, [640]);
  assert.equal(spec.display.purpose, "instructional");
  assert.equal(spec.display.layout, "scroll");
  const imageBytes = fs.readFileSync(f.preview.path);
  assert.equal(imageBytes.readUInt32BE(16), 640);
  assert.equal(imageBytes.readUInt32BE(20), spec.canvas.height);
  const group = spec.source.inventory[0];
  assert(group.requires.includes("pointRelationships"));
  for (const id of group.objects) assert(objects.has(id));
  for (const id of group.assertions) assert(assertions.has(id));
  const groupPoints = group.objects.filter(id => objects.get(id).type === "point");
  for (const id of groupPoints) {
    assert(group.assertions.some(aid => {
      const a = assertions.get(aid);
      const refs = ["from", "to", "a", "b", "c", "d", "point"].map(k => a[k]).filter(x => objects.get(x)?.type === "point");
      return a.type !== "objectCount" && new Set(refs).size >= 2 && refs.includes(id) && refs.every(x => groupPoints.includes(x));
    }), `uncovered point ${id}`);
  }
  const semanticEdges = spec.objects.filter(o => ["arrow", "segment"].includes(o.type));
  for (const edge of semanticEdges) assert(spec.assertions.some(a => a.type === "connects" && a.arrow === edge.id && a.from === edge.from && a.to === edge.to));
  const actualArrowheads = [];
  for (const edge of semanticEdges) {
    const u = p(edge.from), v = p(edge.to);
    const line = svg.lines.find(l => l.id === `ld-${f.figure}_ld-${edge.id}`);
    assert(line, edge.id);
    close(Number(line.x1), u[0]); close(Number(line.y1), spec.canvas.height-u[1]);
    assert.equal(Boolean(line["stroke-dasharray"]), edge.dash === 2, edge.id);
    if (edge.type === "segment") {
      close(Number(line.x2), v[0]); close(Number(line.y2), spec.canvas.height-v[1]);
    } else {
      const head = svg.arrowheads.find(h => h.attributes["data-arrowhead-for"] === line.id);
      assert(head, edge.id);
      assert.equal(head.paths[0].d, "M 0,0 L 10,5 L 0,10 z");
      const numbers = head.attributes.transform.match(/[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/g).map(Number);
      assert.equal(numbers.length, 6);
      const [tx, ty, degrees, scale, dx, dy] = numbers;
      const radians = degrees*Math.PI/180;
      const x = scale*(10+dx), y = scale*(5+dy);
      const tip = [tx+x*Math.cos(radians)-y*Math.sin(radians), ty+x*Math.sin(radians)+y*Math.cos(radians)];
      const error = Math.hypot(tip[0]-v[0], tip[1]-(spec.canvas.height-v[1]));
      assert(error < 0.15);
      const directedAngle = Math.atan2(u[1]-v[1], v[0]-u[0])*180/Math.PI;
      close(degrees, directedAngle, 0.001);
      actualArrowheads.push({ id: edge.id, degrees, tipErrorPx: error });
    }
  }
  assert.equal(spec.source.authoritativeText[0].text, zhQ2);
  assert.equal(spec.source.authoritativeText[1].text, enQ2);
  const pseudo = spec.source.authoritativeText.map((v, index) => ({ v, index })).filter(({ v }) => v.text.startsWith("Input context and full bilingual T9 text locators:"));
  assert.equal(pseudo.length, 1);
  assert.equal(pseudo[0].index, 2);
  const result = {
    figure: f.figure, status: "pass", inheritedGatesVerifiedNotRerun: true,
    nativeAssertionCount: spec.assertions.length,
    groupPointCount: groupPoints.length, semanticEdgesWithConnects: semanticEdges.length,
    authoritativeText: {
      zhQ2: textBinding("source.authoritativeText/0/text", spec.source.authoritativeText[0].text),
      enQ2: textBinding("source.authoritativeText/1/text", spec.source.authoritativeText[1].text),
      provenanceOnlyEntry: { index: 2, removeBeforeDurableInstall: true, ...textBinding("source.authoritativeText/2/text", pseudo[0].v.text) },
      learnerTextUnchanged: true,
      objectsUnchangedProjection: { bytes: Buffer.byteLength(JSON.stringify(spec.objects)), sha256: digest(Buffer.from(JSON.stringify(spec.objects))) },
      assertionsUnchangedProjection: { bytes: Buffer.byteLength(JSON.stringify(spec.assertions)), sha256: digest(Buffer.from(JSON.stringify(spec.assertions))) }
    },
    finalWidth: 640,
    svgTextCount: svg.texts.length,
    actualSvgMinimumFontPx: Math.min(...svg.texts.map(t => Number(t.attributes["font-size"]))),
    actualSvgText: svg.texts.map(t => t.text),
    previewDimensions: [imageBytes.readUInt32BE(16), imageBytes.readUInt32BE(20)]
  };
  result.actualSvgSemanticEdges = { shaftsAndSegmentsMatch: true, actualArrowheads };
  if (f.figure === "fig-24") {
    for (const [i, def] of original.originalDefinitionParagraphs.entries()) {
      assert(spec.source.authoritativeText[i+3].text.endsWith("\n"+def.text));
    }
    const [ox, oy] = p("origin");
    const a = p("state-1"), b = p("state-2"), c = p("state-1-prime");
    close(a[1], c[1]);
    assert(ox < a[0] && a[0] < b[0] && b[0] < c[0]);
    assert(oy < a[1] && a[1] < b[1]);
    const paths = {};
    for (const id of ["lower-curve", "upper-curve"]) {
      const object = objects.get(id);
      assert(svg.paths.some(q => q.d === object.d && q["stroke-width"] === "2.8" && !q["stroke-dasharray"]));
      paths[id] = cubicPaths(object.d);
      for (const s of paths[id]) {
        // Ordered cubic controls give an exact derivative sign and convex-hull bounds.
        for (let i = 1; i < 4; i++) assert(s[i][0] > s[i-1][0] && s[i][1] > s[i-1][1]);
        assert(s.flatMap(p => p).every(Number.isFinite));
        for (const v of s) assert(v[0] >= 0 && v[0] <= 640 && v[1] >= 0 && v[1] <= 576);
      }
    }
    for (const [curve, ids] of [
      ["lower-curve", ["lower-start", "state-1", "lower-at-volume-2", "lower-at-volume-prime", "lower-end"]],
      ["upper-curve", ["upper-start", "state-2", "state-1-prime", "upper-end"]]
    ]) {
      for (const id of ids) {
        const value = atX(paths[curve], p(id)[0]);
        close(value[1], 576-p(id)[1]);
      }
    }
    const k = (b[0]-ox)*(b[1]-oy);
    const primeProduct = (c[0]-ox)*(c[1]-oy);
    close(k, primeProduct);
    let maxRelativeProductError = 0, samples = 0, minCurveSeparation = Infinity;
    for (const s of paths["upper-curve"].filter(s => s[0][0] >= b[0] && s[3][0] <= c[0])) {
      for (let i = 0; i <= 100; i++) {
        const v = evaluate(s, i/100);
        const product = (v[0]-ox)*(576-v[1]-oy);
        maxRelativeProductError = Math.max(maxRelativeProductError, Math.abs(product-k)/k);
        samples++;
      }
    }
    assert(maxRelativeProductError < 1e-6);
    for (let i = 0; i <= 1000; i++) {
      const x = 234+(580-234)*i/1000;
      const separation = atX(paths["lower-curve"], x)[1]-atX(paths["upper-curve"], x)[1];
      minCurveSeparation = Math.min(minCurveSeparation, separation);
    }
    assert(minCurveSeparation > 0);
    const hs = p("horizontal-arrow-start"), he = p("horizontal-arrow-end");
    assert(a[0] < hs[0] && hs[0] < he[0] && he[0] < c[0]);
    close(hs[1], a[1]); close(he[1], a[1]);
    const cs = p("curve-arrow-start"), ce = p("curve-arrow-end");
    assert(b[0] < ce[0] && ce[0] < cs[0] && cs[0] < c[0] && ce[1] > cs[1]);
    const arrowPathOffsetPx = Math.max(...[cs, ce].map(v => Math.abs(atX(paths["upper-curve"], v[0])[1]-(576-v[1]))));
    assert(arrowPathOffsetPx < 0.001);
    assert.equal(spec.objects.filter(o => o.type === "segment" && o.dash === 2).length, 5);
    result.independentRelationships = {
      fixedPressureState1AndIntermediate: true,
      increasingVolumeOrder1Then2ThenPrime: true,
      higherPressureState2: true,
      bothWholeCurvePathsAndAllMappedJoinsMatchActualSvg: true,
      cubicControlsProveStrictMonotoneAndFiniteBounds: true,
      sharedRangeSeparationSampling: { samples: 1001, minScreenPx: minCurveSeparation },
      processEndpointProductEquality: { diagramCoordinateProduct: k, unit: "unscaled display coordinates only" },
      upperQueriedSegmentProductSampling: { samples, maxRelativeProductError, tolerance: 1e-6 },
      arrowHeadsDirection: ["right", "up-left"],
      curveArrowEndpointDeviationPx: arrowPathOffsetPx,
      labelledDashedProjections: 5,
      exactAnalyticEqualityOfCubicInteriorProved: false,
      sourcePhysicalMeasurementsInferred: false,
      entireLowerOrEntireUpperCurveIsothermClaimed: false
    };
  } else {
    const o = p("origin"), a = p("state-1"), b = p("state-2"), c = p("state-3");
    close(a[1], c[1]); close(b[0], c[0]);
    assert(o[0] < a[0] && a[0] < b[0] && o[1] < a[1] && a[1] < b[1]);
    const cross = (a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);
    close(cross, 0);
    const arrowChecks = [];
    for (const [prefix, u, v, direction] of [
      ["diagonal", a, b, "up-right"], ["vertical", b, c, "down"], ["horizontal", c, a, "left"]
    ]) {
      for (const suffix of ["start", "end"]) {
        const w = p(prefix+"-arrow-"+suffix);
        close((w[0]-u[0])*(v[1]-u[1])-(w[1]-u[1])*(v[0]-u[0]), 0);
        const t = ((w[0]-u[0])*(v[0]-u[0])+(w[1]-u[1])*(v[1]-u[1]))/((v[0]-u[0])**2+(v[1]-u[1])**2);
        assert(t > 0 && t < 1);
        arrowChecks.push({ arrow: prefix, endpoint: suffix, processParameter: t });
      }
      const last = arrowChecks.slice(-2);
      assert(last[1].processParameter > last[0].processParameter);
    }
    assert.equal(svg.lines.filter(l => l["stroke-dasharray"]).length, 1);
    result.independentRelationships = {
      origin1And2Collinear: { crossProductDisplayCoordinates: cross },
      state1And3ShareVolume: true, state2And3ShareTemperature: true,
      positiveOrderedStateCoordinates: true,
      everyActualSvgEdgeEndpointAndDashMatchesSpec: true,
      allSemanticArrowheadsPresentInActualSvg: true,
      directionOrder: ["up-right", "down", "left"],
      arrowsInsideDirectedSegments: arrowChecks,
      extensionIsDashedNotCycleLeg: true,
      sourcePhysicalMeasurementsInferred: false
    };
  }
  results.push(result);
}
const sourceTexts = [
  textBinding("source-only.json#/originalT9Questions", original.originalT9Questions),
  ...original.originalDefinitionParagraphs.map((p, i) => textBinding(`source-only.json#/originalDefinitionParagraphs/${i}/text`, p.text)),
  textBinding("visible-bilingual-and-labels.json#/fullText/zh", visible.fullText.zh),
  textBinding("visible-bilingual-and-labels.json#/fullText/en", visible.fullText.en)
];
if (process.argv[2] === "audit") {
  save("independent-geometry-and-bindings.json", {
    schema: "d137/independent-geometry-and-bindings@1",
    cwd: root, status: "pass", actualImageOpens: 4,
    noRenderingRerun: true, noDependenciesLoaded: true,
    authorFreeze: { ...binding(selected.authorFreezeOpaqueProvenance.path), contentInterpreted: false },
    suppliedFiles: [...new Map(verifiedBindings.map(b => [b.path, b])).values()],
    suppliedSourceTexts: sourceTexts,
    explicitLabelsOnly: { status: "pass", checkedCount: 4, expected: expectedLabels },
    figures: results
  });
} else if (process.argv[2] === "freeze") {
  const report = read(path.join(output, "report.json"));
  assert.equal(report.figures.length, 2);
  assert(report.figures.every(f => f.semanticStatus === "pass"));
  for (const f of selected.figures) {
    const review = read(path.join(output, `${f.figure}.review.json`));
    assert.equal(review.schema, "ld-s10y-image/review@1");
    assert.equal(review.status, "pass");
    assert.equal(review.figure, f.figure);
    assert.equal(review.source.sha256, f.source.sha256);
    assert.equal(review.spec.sha256, f.spec.sha256);
    assert.equal(review.render.sha256, f.nativeRender.sha256);
    assert.equal(review.outputs.svg.sha256, f.svg.sha256);
    assert.equal(read(path.join(output, `${f.figure}.record-review.receipt.json`)).exitCode, 0);
  }
  const files = [
    ...verifiedBindings.map(b => b.path),
    ...["source-only.json", "visible-bilingual-and-labels.json", "candidate-only.json"].map(n => path.join(input, n)),
    ...["source-first-inventory.json", "independent-geometry-and-bindings.json", "report.json", "verify-evidence.mjs", "run-native-review.mjs", "fig-24.review.json", "fig-30.review.json"].map(n => path.join(output, n)),
    ...report.reviewToolReceipts.map(r => r.path),
    path.join(output, "audit-first-failure.receipt.json"),
    path.join(output, "audit-second-failure.receipt.json"),
    ...report.instructionsRead.map(r => r.path)
  ];
  save("review-freeze.json", {
    schema: "d137/review-freeze@1", reviewer: "D137", lesson: "9p/phy9-c1-s3-t9",
    cwd: root, createdAt: new Date().toISOString(),
    status: "semantic-pass-offline-only",
    actualImageOpens: 4, originalImageOpens: 2, candidatePreviewOpens: 2,
    batchImageLimit: 8, contextImageLimit: 24,
    contentRepairsAlreadyUsed: { "fig-24": 1, "fig-30": 0 }, newRepairs: 0,
    authorFreezeOpaque: true, noRenderingRerun: true,
    wholeCourseApproved: false, promotionAuthorized: false,
    productSurfaceApproved: false, durableInstallApproved: false,
    newCourseCount: 0, newSourceCount: 0,
    sourceTexts, perFigureScopeAndGates: report.figures,
    bindings: [...new Set(files)].map(binding),
    note: "All bindings are current bytes, not durable promotion. Hashing the author freeze did not interpret its content. Removing a pseudo-text entry changes the spec hash and requires affected evidence rebinding, even with unchanged geometry."
  });
} else {
  throw new Error("Expected audit or freeze");
}
console.log(JSON.stringify({ status: "pass", mode: process.argv[2], output, figures: results }, null, 2));

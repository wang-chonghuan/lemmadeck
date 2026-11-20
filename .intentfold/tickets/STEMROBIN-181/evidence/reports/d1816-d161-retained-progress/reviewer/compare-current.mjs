import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const root = "/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck";
assert.equal(process.cwd(), root);
const dir = path.join(root, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d161-fig11-independent-review");
const bind = (p) => {
  const b = fs.readFileSync(p);
  return { path: p, bytes: b.length, sha256: crypto.createHash("sha256").update(b).digest("hex") };
};
const load = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const inventoryPath = path.join(dir, "independent-inventory.json");
const inventoryBinding = bind(inventoryPath);
assert.equal(inventoryBinding.sha256, "62eaba5251cd60d3104c384fbac3eba35998ea780ce7197c821ec733892f66db");
const inventory = load(inventoryPath);
const inputs = load(path.join(dir, "after-inventory.json"));
const spec = load(inputs.selected.spec.path);
const markerToSpec = (id) => {
  if (id === "R-C-M-slot") return null;
  const [plane, column, row] = id.split("-");
  return `${{ F: "front", M: "middle", R: "back" }[plane]}-r${{ T: 0, M: 1, B: 2 }[row]}-c${{ L: 0, C: 1, R: 2 }[column]}`;
};
const objects = new Map(spec.objects.map((o) => [o.id, o]));
const assertions = new Map(spec.assertions.map((a) => [a.id, a]));
const points = spec.objects.filter((o) => o.type === "point" && o.visible !== false);
assert.equal(points.length, inventory.markers.length);
const pointEvidence = inventory.markers.map((marker) => {
  const id = markerToSpec(marker.id);
  const object = objects.get(id);
  assert.equal(object.type, "point");
  const sourcePx = [object.at[0], 420 - object.at[1]];
  const deltaPx = sourcePx.map((v, i) => v - marker.atPx[i]);
  assert.ok(deltaPx.every((v) => Math.abs(v) <= 4), `${marker.id}: pixel-center discrepancy`);
  const appearance = marker.appearance.includes("mostly black") ? "ink" : "paper";
  assert.equal(object.fill, appearance, `${marker.id}: marker appearance mismatch`);
  return { sourceId: marker.id, candidateId: id, independentCenterPx: marker.atPx, candidateInSourcePixels: sourcePx, deltaPx, appearanceMatches: true };
});
assert.equal(objects.has("back-r1-c1"), false);
const segments = spec.objects.filter((o) => o.type === "segment");
const expectedEdges = [];
for (const [direction, chains] of Object.entries(inventory.connectorChains)) {
  if (!Array.isArray(chains)) continue;
  for (const chain of chains) {
    if (direction === "depth") {
      for (let i = 0; i < 2; i++) expectedEdges.push({ direction, sourceFrom: chain[i], sourceTo: chain[i + 1], from: markerToSpec(chain[i]), to: markerToSpec(chain[i + 1]) });
    } else {
      const visible = chain.filter((id) => markerToSpec(id));
      for (let i = 0; i < visible.length - 1; i++) expectedEdges.push({ direction, sourceFrom: visible[i], sourceTo: visible[i + 1], from: markerToSpec(visible[i]), to: markerToSpec(visible[i + 1]), spansUnresolvedSlot: chain.includes("R-C-M-slot") });
    }
  }
}
assert.equal(segments.length, expectedEdges.length);
const edgeEvidence = expectedEdges.map((edge) => {
  const matches = segments.filter((o) => o.from === edge.from && (edge.to ? o.to === edge.to : Array.isArray(o.to)));
  assert.equal(matches.length, 1, `${edge.sourceFrom} to ${edge.sourceTo}: connector mismatch`);
  const segment = matches[0];
  const connect = assertions.get(`${segment.id}-connects`);
  const displacement = assertions.get(`${segment.id}-projected-displacement`);
  assert.equal(connect.arrow, segment.id);
  assert.deepEqual([connect.from, connect.to], [segment.from, segment.to]);
  const from = objects.get(segment.from).at;
  const to = Array.isArray(segment.to) ? segment.to : objects.get(segment.to).at;
  assert.deepEqual([displacement.dx, displacement.dy], [to[0] - from[0], to[1] - from[1]]);
  const endpointPx = Array.isArray(segment.to) ? [segment.to[0], 420 - segment.to[1]] : null;
  if (endpointPx) {
    const [x1, y1, x2, y2] = inventory.unresolved[0].approximateRegionPx;
    assert.ok(endpointPx[0] >= x1 && endpointPx[0] <= x2 && endpointPx[1] >= y1 && endpointPx[1] <= y2);
  }
  return { ...edge, candidateId: segment.id, candidateTo: segment.to, endpointPx, connects: connect.id, displacement: displacement.id, dash: segment.dash ?? 0 };
});
for (const group of spec.source.inventory.filter((g) => g.requires?.includes("pointRelationships"))) {
  const groupObjects = new Set(group.objects);
  const relations = group.assertions.map((id) => assertions.get(id)).filter((a) => typeof a?.from === "string" && typeof a?.to === "string" && groupObjects.has(a.from) && groupObjects.has(a.to));
  for (const id of group.objects.filter((id) => objects.get(id)?.type === "point")) assert.ok(relations.some((a) => a.from === id || a.to === id), `${group.id}: uncovered point ${id}`);
}
assert.deepEqual(segments.filter((s) => s.dash).map((s) => s.id).sort(), ["column-back-0-1", "column-back-0-2"]);
const approved = load(inputs.approvedBilingualText.path);
assert.deepEqual(spec.source.authoritativeText.map((x) => x.text), [approved.languages.zh.fullText, approved.languages.en.fullText]);
const require = createRequire(path.join(root, "app/package.json"));
const { chromium } = require("playwright");
const browser = await chromium.launch({ headless: true });
let browserEvidence;
let browserClosed = false;
try {
  const page = await browser.newPage({ viewport: { width: 800, height: 800 }, deviceScaleFactor: 1 });
  await page.setContent(`<html><head><title>D161 fig-11 immutable artifact</title><style>body{margin:0;background:white}#artifact{width:640px;height:720px;margin:0}#artifact>svg{width:640px;height:720px}</style></head><body><div id="artifact">${fs.readFileSync(inputs.selected.svg.path, "utf8")}</div></body></html>`);
  browserEvidence = await page.evaluate(() => {
    const svg = document.querySelector("#artifact > svg");
    const bounds = svg.getBoundingClientRect();
    const labels = [...svg.querySelectorAll("text")].map((el) => {
      const b = el.getBoundingClientRect();
      return { id: el.getAttribute("data-label-id"), text: el.textContent, fontPx: Number.parseFloat(getComputedStyle(el).fontSize), bounds: { x: b.x, y: b.y, width: b.width, height: b.height } };
    });
    const rear = svg.querySelector("#ld-fig-11_ld-back-r2-c1");
    const near = svg.querySelector("#ld-fig-11_ld-column-front-2-1");
    const painted = [...svg.querySelectorAll("*")];
    const cx = Number(rear.getAttribute("cx")), cy = Number(rear.getAttribute("cy"));
    const rx = Number(rear.getAttribute("rx")), ry = Number(rear.getAttribute("ry"));
    const x1 = Number(near.getAttribute("x1")), y1 = Number(near.getAttribute("y1"));
    const x2 = Number(near.getAttribute("x2")), y2 = Number(near.getAttribute("y2"));
    const lineXAtRearCenter = x1 + (x2 - x1) * (cy - y1) / (y2 - y1);
    return {
      mediaWidthPx: bounds.width,
      mediaHeightPx: bounds.height,
      labels,
      visibleSites: [...svg.querySelectorAll('ellipse[id*="_ld-front-"],ellipse[id*="_ld-middle-"],ellipse[id*="_ld-back-"]')].length,
      visibleSegments: [...svg.querySelectorAll("line")].filter((el) => getComputedStyle(el).display !== "none").length,
      dashedSegments: [...svg.querySelectorAll("line[stroke-dasharray]")].map((el) => ({ id: el.id, dash: el.getAttribute("stroke-dasharray") })),
      rearBottomCenterOcclusion: {
        rearId: rear.id,
        nearLineId: near.id,
        rearCenter: [cx, cy],
        rearRadii: [rx, ry],
        nearLine: [x1, y1, x2, y2],
        lineXAtRearCenter,
        lineCrossesRearDisk: Math.abs(lineXAtRearCenter - cx) < rx,
        rearIsPaintedAfterNearLine: painted.indexOf(rear) > painted.indexOf(near),
        rearFill: getComputedStyle(rear).fill,
        rearFillOpacity: getComputedStyle(rear).fillOpacity,
        sourceReference: "Independent R-C-B observation: right/lower disk region partly covered by heavy nearer vertical and larger F-R-M marker."
      }
    };
  });
  assert.equal(browserEvidence.mediaWidthPx, 640);
  assert.equal(browserEvidence.visibleSites, 26);
  assert.equal(browserEvidence.visibleSegments, 52);
  assert.equal(browserEvidence.dashedSegments.length, 2);
  assert.ok(browserEvidence.labels.every((l) => l.fontPx >= 16 && l.bounds.x >= 0 && l.bounds.y >= 0 && l.bounds.x + l.bounds.width <= 640 && l.bounds.y + l.bounds.height <= 720));
  await page.locator("#artifact").screenshot({ path: path.join(dir, "current-svg-640.png") });
} finally {
  await browser.close();
  browserClosed = true;
}
const result = {
  schema: "d161/independent-current-comparison@1",
  figure: "fig-11",
  independentInventory: inventoryBinding,
  currentSpec: bind(inputs.selected.spec.path),
  currentSvg: bind(inputs.selected.svg.path),
  approvedText: bind(inputs.approvedBilingualText.path),
  basis: "D161 frozen pixel inventory, not author object list",
  mathematicalAndSlotComparison: "pass",
  pointEvidence,
  edgeEvidence,
  noExtraMarker: true,
  nativeGroupsCoverAllMappedPoints: true,
  approvedFullTextByteExactWithinSpec: true,
  approvedTextScienceOrTranslationRereview: false,
  browserEvidence,
  screenshot: bind(path.join(dir, "current-svg-640.png")),
  browserClosed,
  artifactOnly: true,
  productAcceptance: false,
  nativeValidationOrRenderingInvoked: false,
  observedAt: new Date().toISOString()
};
fs.writeFileSync(path.join(dir, "current-comparison.json"), JSON.stringify(result, null, 2) + "\n");
console.log(JSON.stringify({ mathematicalAndSlotComparison: result.mathematicalAndSlotComparison, counts: { points: points.length, expectedEdges: expectedEdges.length, segments: segments.length }, browserEvidence, browserClosed, evidence: bind(path.join(dir, "current-comparison.json")) }, null, 2));

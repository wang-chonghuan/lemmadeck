import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const out = path.dirname(fileURLToPath(import.meta.url));
const author = path.resolve(out, '../d257-n67-fig134-first-author');
const load = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const bind = p => ({
  path: p,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'),
});
const specPath = path.join(author, 'repair-1/fig-134.spec.json');
const geometryPath = path.join(author, 'geometry-evidence.json');
const s = load(specPath), model = load(geometryPath).model;
const objects = new Map(s.objects.map(o => [o.id, o]));
const assertions = new Map(s.assertions.map(a => [a.id, a]));
const near = (a, b, tolerance = 1e-9) => assert(Math.abs(a - b) < tolerance);
const norm = v => Math.hypot(...v);
const dot = (a, b) => a.reduce((sum, x, i) => sum + x * b[i], 0);
const project = v => [
  model.screenCenter[0] + dot(v, model.screenHorizontal),
  s.canvas.height - model.screenCenter[1] + dot(v, model.screenVertical),
];
const scaled = (v, t) => v.map(x => x * t);
const onSphere = v => scaled(v, model.sphereRadius / norm(v));
const checkPoint = (id, expected) => objects.get(id).at.forEach((x, i) => near(x, expected[i]));
const point = id => objects.get(id).at;
const origin = point('source-vertex');
assert.deepEqual(model.origin, [0, 0, 0]);
checkPoint('source-vertex', project(model.origin));
assert.equal(objects.get('modern-sphere').center, 'source-vertex');
near(objects.get('modern-sphere').radius, model.sphereRadius);
for (const v of [model.screenHorizontal, model.screenVertical, model.cameraFacing]) near(norm(v), 1);
near(dot(model.screenHorizontal, model.screenVertical), 0);
near(dot(model.cameraFacing, model.screenHorizontal), 0);
near(dot(model.cameraFacing, model.screenVertical), 0);

const group = s.source.inventory.find(g => g.id === 'source-common-vertex-and-six-rays');
assert(group.requires.includes('pointRelationships'));
const covered = new Set();
for (const id of group.assertions) {
  const a = assertions.get(id);
  assert(a);
  if (a.type === 'connects') {
    for (const id of [a.arrow, a.from, a.to]) assert(group.objects.includes(id));
    covered.add(a.from);
    covered.add(a.to);
  }
}
const sourcePoints = group.objects.filter(id => objects.get(id).type === 'point');
assert.equal(sourcePoints.length, 7);
for (const id of sourcePoints) assert(covered.has(id));
assert.equal(model.dimensionlessBoundaryVertices.length, 6);
const boundary = objects.get('source-arbitrary-boundary');
assert.deepEqual(boundary.points, Array.from({ length: 6 }, (_, i) => `source-boundary-${i + 1}`));
const rays = [];
for (let i = 0; i < 6; i++) {
  const n = i + 1, v = model.dimensionlessBoundaryVertices[i];
  const endpoint = `source-boundary-${n}`;
  const start = `modern-arrow-start-${n}`, end = `modern-arrow-end-${n}`;
  checkPoint(endpoint, project(scaled(v, model.arbitraryBoundaryPlaneX)));
  checkPoint(start, project(scaled(v, model.arbitraryBoundaryPlaneX * 0.52)));
  checkPoint(end, project(scaled(v, model.arbitraryBoundaryPlaneX * 0.69)));
  checkPoint(`modern-sphere-intercept-${n}`, project(onSphere(v)));
  assert.deepEqual(
    [objects.get(`source-ray-${n}`).from, objects.get(`source-ray-${n}`).to],
    ['source-vertex', endpoint],
  );
  assert.deepEqual(
    [objects.get(`source-outward-arrow-${n}`).from, objects.get(`source-outward-arrow-${n}`).to],
    [start, end],
  );
  const direction = point(endpoint).map((x, j) => x - origin[j]);
  const delta = point(end).map((x, j) => x - point(start)[j]);
  assert(dot(direction, delta) > 0);
  rays.push({ sourceRole: `M134-RAY-${n}`, endpoint, ray: `source-ray-${n}`, arrow: `source-outward-arrow-${n}`, outward: true });
}

const samples = [];
for (let i = 0; i < 6; i++) {
  const a = model.dimensionlessBoundaryVertices[i], b = model.dimensionlessBoundaryVertices[(i + 1) % 6];
  for (let j = 0; j < 40; j++) samples.push(onSphere(a.map((x, k) => x + (b[k] - x) * j / 40)));
}
const pathData = points => points.map((v, i) => {
  const p = project(v);
  return `${i ? 'L' : 'M'}${p[0].toFixed(4)} ${(s.canvas.height - p[1]).toFixed(4)}`;
}).join(' ') + ' Z';
assert.equal(objects.get('modern-spherical-patch').d, pathData(samples));
assert.equal(objects.get('source-angle-domain-mark').d, pathData(samples.map(v => scaled(v, 65 / model.sphereRadius))));
checkPoint('modern-patch-target', project(samples[5]));
const maxRadiusError = Math.max(...samples.map(v => Math.abs(norm(v) - model.sphereRadius)));
const minFacingDot = Math.min(...samples.map(v => dot(v, model.cameraFacing)));
assert(maxRadiusError < 1e-10);
assert(minFacingDot > 0);
const uniqueX = new Set(samples.map(v => v[0].toFixed(5)));
assert(uniqueX.size > 2);
const radiusEndpoint3d = [-74.4, 124, -55.8];
near(norm(radiusEndpoint3d), model.sphereRadius);
near(dot(radiusEndpoint3d, model.cameraFacing), 0);
checkPoint('modern-radius-end', project(radiusEndpoint3d));
near(norm(point('modern-radius-end').map((x, i) => x - origin[i])), model.sphereRadius);

const results = [];
for (const a of s.assertions) {
  if (a.type === 'connects') {
    const o = objects.get(a.arrow);
    assert.equal(o.from, a.from);
    assert.equal(o.to, a.to);
  } else if (a.type === 'collinear') {
    const u = point(a.b).map((x, i) => x - point(a.a)[i]);
    const v = point(a.c).map((x, i) => x - point(a.a)[i]);
    near(u[0] * v[1] - u[1] * v[0], 0, 1e-7);
  } else if (a.type === 'objectCount') {
    assert.equal(s.objects.filter(o => o.type === a.objectType).length, a.count);
  } else if (a.type === 'distance') {
    near(norm(point(a.a).map((x, i) => x - point(a.b)[i])), a.value);
  } else if (a.type === 'pointOnCircle') {
    near(norm(point(a.point).map((x, i) => x - point(a.center)[i])), a.radius);
  } else {
    throw new Error(`Unreviewed assertion ${a.id}`);
  }
  results.push({ id: a.id, type: a.type, status: 'PASS' });
}
const labels = s.objects.filter(o => o.type === 'text').map(o => ({ id: o.id, text: o.text }));
assert.equal(labels.length, 9);
assert.equal(objects.get('modern-origin-description').text, 'O: vertex = center');
assert.equal(objects.get('modern-area-description').text, 'S: curved area');
assert.equal(objects.get('modern-equation').text, '\u03a9 = S / R\u00b2');
const report = {
  schema: 'd263-independent-geometry-check@1', date: '2026-11-18', status: 'PASS',
  spec: bind(specPath), frozenModelInput: bind(geometryPath),
  sourceGroupPoints: sourcePoints, whollyInternalRelationshipCoverage: [...covered],
  rays, assertionResults: results, labels,
  recomputed: {
    samples: samples.length, maxRadiusError, minFacingDot,
    nonconstantPatchXCoordinates: uniqueX.size,
    sphericalPathMatchesCurrentSpec: true, nearVertexDirectionLoopMatches: true,
    patchLeaderTargetsSphericalBoundary: true, radiusHasNormRAndProjectsToSilhouette: true,
  },
  interpretation: 'The noncircular outer boundary selects directions; radially projected S is curved sphere area, not the outer plane. The sphere is centered at the common vertex; Omega=S/R^2 imposes no circular-boundary restriction. Coordinate values are construction scale, not printed givens.',
  authorComputedErrorNumbersUsedAsProof: false,
  newImages: 0, nativeRenders: 0, outputRenders: 0, oldFilesModified: 0,
};
const destination = path.join(out, 'independent-geometry-check.json');
fs.writeFileSync(destination, JSON.stringify(report, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ output: bind(destination), status: report.status, assertions: results.length, recomputed: report.recomputed }));

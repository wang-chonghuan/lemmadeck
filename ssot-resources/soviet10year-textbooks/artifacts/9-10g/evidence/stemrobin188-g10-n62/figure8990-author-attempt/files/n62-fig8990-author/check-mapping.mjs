import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const number = process.argv[2];
if (!['89', '90'].includes(number)) throw new Error('Outside authorized figures');
const id = `fig-g10-${number}`;
const spec = JSON.parse(fs.readFileSync(path.join(root, `${id}.FIRST.spec.json`)));
const mapping = JSON.parse(fs.readFileSync(path.join(root, `${id}.relationship-mapping.json`)));
const FIRST = JSON.parse(fs.readFileSync(path.join(root, `${id}-FIRST.json`)));
const objects = new Map(spec.objects.map(o => [o.id, o]));
const height = spec.canvas.height;
const screen = id => {
  const at = objects.get(id).at;
  return [at[0], height - at[1]];
};
const close = (actual, expected, message) => assert.ok(Math.abs(actual - expected) < 1e-7, `${message}: ${actual} != ${expected}`);
const sphere = mapping.sphere;
const cosine = Math.sqrt(1 - sphere.sinTilt ** 2);
const spatial = {...mapping.spatialUnitPoints};
if (mapping.MProjected) {
  const {x, up, depthBranch} = mapping.MProjected;
  const depth = depthBranch * Math.sqrt(1 - x*x - up*up);
  spatial.M = [x, cosine*up - sphere.sinTilt*depth, sphere.sinTilt*up + cosine*depth];
}
const spatialDistance = (a, b) => Math.hypot(...spatial[a].map((v, i) => v - spatial[b][i]));
const checks = [];
for (const [name, p] of Object.entries(spatial)) {
  const expected = [sphere.center[0] + sphere.radius*p[0], sphere.center[1] - sphere.radius*(cosine*p[1] + sphere.sinTilt*p[2])];
  const actual = screen(name);
  close(actual[0], expected[0], `${name} projected x`);
  close(actual[1], expected[1], `${name} projected y`);
}
checks.push({id: 'declared-orthographic-projection', status: 'SATISFIED', points: Object.keys(spatial)});
assert.equal(FIRST.inventory.subfigures.length, number === '89' ? 1 : 2);
assert.deepEqual(FIRST.inventory.numbers, []);
assert.deepEqual(spec.display.widths, [480, 300]);
assert.equal(spec.display.purpose, 'instructional');
assert.equal(spec.display.minTextPx, 16);
assert.deepEqual(mapping.native, spec.assertions);
assert.deepEqual(mapping.sourceInventoryCoverage, spec.source.inventory);
for (const check of mapping.externalAssertions) {
  if (check.type === 'ellipseHalfPaths') {
    const [cx, cy] = check.center;
    assert.equal(objects.get(check.upper).d, `M ${cx-check.rx} ${cy} A ${check.rx} ${check.ry} 0 0 1 ${cx+check.rx} ${cy}`);
    assert.equal(objects.get(check.lower).d, `M ${cx+check.rx} ${cy} A ${check.rx} ${check.ry} 0 0 1 ${cx-check.rx} ${cy}`);
    close(check.rx, sphere.radius, 'equatorial horizontal radius');
    close(check.ry, sphere.radius*sphere.sinTilt, 'equatorial projected vertical radius');
  } else if (check.type === 'pointOnEllipse') {
    for (const point of check.points) {
      const [x, y] = screen(point);
      close(((x-check.center[0])/check.rx)**2 + ((y-check.center[1])/check.ry)**2, 1, `${point} ellipse incidence`);
    }
  } else if (check.type === 'spatialUnitSphere') {
    for (const point of check.points) close(Math.hypot(...spatial[point]), 1, `${point} spatial sphere incidence`);
  } else if (check.type === 'spatialDiameterAndRadius') {
    close(spatialDistance(check.a, check.b), 2, 'AB spatial diameter');
    close(spatialDistance(check.center, check.radiusPoint), 1, 'OM spatial radius');
    for (let i=0; i<3; i++) close((spatial[check.a][i]+spatial[check.b][i])/2, spatial[check.center][i], 'O spatial midpoint');
  } else if (check.type === 'segmentEllipseCrossing') {
    const segment = objects.get(check.segment);
    const p = screen(segment.from), q = screen(segment.to);
    const px=(p[0]-check.center[0])/check.rx, py=(p[1]-check.center[1])/check.ry;
    const dx=(q[0]-p[0])/check.rx, dy=(q[1]-p[1])/check.ry;
    const a=dx*dx+dy*dy, b=2*(px*dx+py*dy), c=px*px+py*py-1;
    const discriminant=b*b-4*a*c;
    assert.ok(discriminant>0);
    const roots=[(-b-Math.sqrt(discriminant))/(2*a), (-b+Math.sqrt(discriminant))/(2*a)].filter(t => t>0 && t<1);
    const crossings=roots.map(t => [p[0]+t*(q[0]-p[0]),p[1]+t*(q[1]-p[1])]);
    assert.equal(crossings.length, check.crossings);
    if (check.screenHalf==='upper') assert.ok(crossings.every(p=>p[1]<check.center[1]));
    if (check.screenHalf==='both') assert.ok(crossings.some(p=>p[1]<check.center[1]) && crossings.some(p=>p[1]>check.center[1]));
    assert.ok(crossings.every(p => spec.objects.filter(o=>o.type==='point').every(o => Math.hypot(screen(o.id)[0]-p[0],screen(o.id)[1]-p[1])>8)));
  } else if (check.type === 'projectedInterior') {
    for (const point of check.points) {
      const p=screen(point);
      assert.ok(Math.hypot(p[0]-check.center[0],p[1]-check.center[1]) < check.radius-12);
    }
  } else if (check.type === 'semicircleArc') {
    const arc=objects.get(check.object), center=objects.get(check.center).at;
    assert.deepEqual(arc.center, center);
    assert.deepEqual(arc.start, objects.get(check.bottom).at);
    assert.deepEqual(arc.end, objects.get(check.top).at);
    close(arc.start[0], center[0], 'semicircle axis x');
    close(arc.end[0], center[0], 'semicircle axis x');
    close(arc.start[1], center[1]-check.radius, 'semicircle bottom');
    close(arc.end[1], center[1]+check.radius, 'semicircle top');
  } else if (check.type === 'upperRadiusLabel') {
    const label=screen(check.object), center=screen(check.center), top=screen(check.top);
    assert.equal(objects.get(check.object).text, 'R');
    assert.ok(label[0]>center[0] && label[1]>top[1]+32 && label[1]<center[1]-32);
  } else if (check.type === 'inventoryStyles') {
    assert.equal(spec.objects.filter(o=>o.type==='point' && o.visible!==false).length, check.pointCount);
    for (const [name, label] of Object.entries(check.labels)) assert.equal(objects.get(name).label || objects.get(name).text, label);
    for (const name of check.dashed) assert.ok(objects.get(name).dash>0);
    for (const name of check.solid) assert.equal(objects.get(name).dash || 0, 0);
    assert.equal(spec.objects.filter(o=>o.type==='arrow').length, 0);
    assert.equal(spec.objects.filter(o=>o.type==='image').length, 0);
    const actualLabels=spec.objects.map(o=>o.label || o.text).filter(Boolean).sort();
    assert.deepEqual(actualLabels, Object.values(check.labels).sort());
    assert.equal(FIRST.inventory.labelsAsShapes.length, actualLabels.length);
  } else if (check.type === 'panelOrder') {
    assert.ok(screen(check.left)[0]<screen(check.right)[0]);
    assert.ok(mapping.leftCircle.center[0]+mapping.leftCircle.radius<sphere.center[0]-sphere.radius);
  } else throw new Error(`Unhandled executable relationship ${check.type}`);
  checks.push({id: check.id, type: check.type, status: 'SATISFIED'});
}
const receipt = {schema: 'author-executable-relationship-receipt@1', id, status: 'AUTHOR_MAPPING_EXECUTED_SATISFIED', checks, spatialUnitPoints: spatial, FIRSTReferencedNotReopened: true, nativeAssertionsExecutedSeparately: true, semanticApproval: false, independentReview: false};
fs.writeFileSync(path.join(root, `${id}.FIRST.relationship-receipt.json`), JSON.stringify(receipt,null,2)+'\n', {flag:'wx'});
console.log(JSON.stringify(receipt));

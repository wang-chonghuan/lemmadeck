import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const root = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184';
assert.equal(process.cwd(), root);
const output = '.tmp/stemrobin-184-six/n82-resume';
mkdirSync(output, { recursive: true });
const book = 'ssot-resources/soviet10year-textbooks/artifacts/10c';
const lessonPath = `${book}/editions/modern-us-neutral/lessons/ana10-c6-s2-n82`;
const read = file => JSON.parse(readFileSync(file, 'utf8'));
const sha = file => createHash('sha256').update(readFileSync(file)).digest('hex');
const save = (name, value) => {
  const file = path.join(output, name);
  assert(!existsSync(file), `Existing output must not be replayed: ${file}`);
  writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
  return file;
};
const lesson = read(`${lessonPath}/lesson.json`);
const exercises = read(`${lessonPath}/exercises.json`);
const originA = [0, 0];
const originB = [7, 0];
const polar = (radius, degrees) => [
  radius * Math.cos(degrees * Math.PI / 180),
  radius * Math.sin(degrees * Math.PI / 180),
];
const p0 = polar(2.4, 130);
const pt = polar(2.4, 330);
const p1 = [7.8, 0.15];
const p2 = [7.6, 1.7];
const sum = [p1[0] + p2[0] - 7, p1[1] + p2[1]];
const objects = [];
const assertions = [];
const text = (id, at, value, position = 'CENTER') => objects.push({
  id, type: 'text', at, text: value, fontSize: 26, labelColor: 'ink',
  labelPlacement: { position },
});
const point = (id, at, label, position) => objects.push({
  id, type: 'point', at, label, visible: false, fontSize: 26,
  labelColor: 'ink', labelPlacement: { position, offset: [9, 9] },
});
const edge = (id, from, to, type = 'arrow', extra = {}) => {
  objects.push({ id, type, from, to, stroke: 'ink', strokeWidth: 2, ...extra });
  assertions.push({ id: `${id}-connects`, type: 'connects', arrow: id, from, to });
};
for (const [prefix, center] of [['a', originA], ['b', originB]]) {
  edge(`${prefix}-x`, [center[0] - 2.9, 0], [center[0] + 3, 0]);
  edge(`${prefix}-y`, [center[0], -2.9], [center[0], 3]);
  text(`${prefix}-x-label`, [center[0] + 3.12, -0.23], 'x');
  text(`${prefix}-y-label`, [center[0] + 0.27, 3], 'y');
  point(`${prefix}-O`, center, 'O', 'SW');
  text(`${prefix}-panel`, [center[0], -3.27], prefix);
}
objects.push({ id: 'a-circle', type: 'circle', center: 'a-O', radius: 2.4,
  stroke: 'ink', strokeWidth: 2 });
point('a-P0', p0, 'P0', 'NW');
point('a-Pt', pt, 'P(t)', 'SE');
point('a-x0', [p0[0], 0], 'x0', 'SW');
point('a-xt', [pt[0], 0], 'x(t)', 'NW');
edge('a-initial', 'a-O', 'a-P0');
edge('a-current', 'a-O', 'a-Pt');
edge('a-projection0', 'a-P0', 'a-x0', 'segment', { dash: 2, stroke: 'muted' });
edge('a-projectiont', 'a-Pt', 'a-xt', 'segment', { dash: 2, stroke: 'muted' });
text('a-radius-label', [0.3, 2.56], 'A');
objects.push({ id: 'a-initial-angle', type: 'arc', center: 'a-O',
  start: polar(0.8, 0), end: polar(0.8, 130), stroke: 'muted', strokeWidth: 2 });
text('a-phi', [0.7, 0.8], 'phi');
objects.push({ id: 'a-motion-arc', type: 'arc', center: 'a-O',
  start: polar(0.8, 130), end: polar(0.8, 312), stroke: 'ink', strokeWidth: 2 });
edge('a-motion-direction', polar(0.8, 295), polar(0.8, 312));
for (const [id, pointAt] of [['P1', p1], ['P2', p2], ['P', sum]]) {
  const radius = Math.hypot(pointAt[0] - 7, pointAt[1]);
  objects.push({ id: `b-circle-${id}`, type: 'circle', center: 'b-O', radius,
    stroke: 'muted', strokeWidth: 2 });
}
point('b-P1', p1, 'P1(t)', 'SE');
point('b-P2', p2, 'P2(t)', 'NW');
point('b-P', sum, 'P(t)', 'NE');
edge('b-v1', 'b-O', 'b-P1');
edge('b-v2', 'b-O', 'b-P2');
edge('b-v', 'b-O', 'b-P');
edge('b-join1', 'b-P1', 'b-P', 'segment', { stroke: 'muted' });
edge('b-join2', 'b-P2', 'b-P', 'segment', { stroke: 'muted' });
assertions.push(
  { id: 'a-initial-on-circle', type: 'pointOnCircle', point: 'a-P0', center: 'a-O', radius: 2.4 },
  { id: 'a-current-on-circle', type: 'pointOnCircle', point: 'a-Pt', center: 'a-O', radius: 2.4 },
  { id: 'a-x0-vertical', type: 'displacement', from: 'a-x0', to: 'a-P0', dx: 0, dy: p0[1] },
  { id: 'a-xt-vertical', type: 'displacement', from: 'a-xt', to: 'a-Pt', dx: 0, dy: pt[1] },
  { id: 'a-projections-on-axis', type: 'collinear', points: ['a-x0', 'a-O', 'a-xt'] },
  { id: 'b-sum-from-first', type: 'displacement', from: 'b-P1', to: 'b-P', dx: p2[0] - 7, dy: p2[1] },
  { id: 'b-sum-from-second', type: 'displacement', from: 'b-P2', to: 'b-P', dx: p1[0] - 7, dy: p1[1] },
  { id: 'b-sum-join1-parallel', type: 'parallel', a: 'b-O', b: 'b-P2', c: 'b-P1', d: 'b-P' },
  { id: 'b-sum-join2-parallel', type: 'parallel', a: 'b-O', b: 'b-P1', c: 'b-P2', d: 'b-P' },
);
for (const [id, pointAt] of [['P1', p1], ['P2', p2], ['P', sum]]) {
  assertions.push({ id: `b-${id}-on-circle`, type: 'pointOnCircle',
    point: `b-${id}`, center: 'b-O', radius: Math.hypot(pointAt[0] - 7, pointAt[1]) });
}
const inventory = [
  { id: 'a-frame', description: 'Independent left frame, one radius-A circle and x/y labels. O is editorial origin naming.',
    objects: ['a-x', 'a-y', 'a-x-label', 'a-y-label', 'a-circle', 'a-radius-label', 'a-O'],
    assertions: ['a-x-connects', 'a-y-connects'] },
  { id: 'a-points-projections', description: 'P0 quadrantII and P(t) quadrantIV on same circle; vertical projections x0<0 and x(t)>0.',
    requires: ['pointRelationships'], objects: ['a-O', 'a-P0', 'a-Pt', 'a-x0', 'a-xt', 'a-initial', 'a-current', 'a-projection0', 'a-projectiont'],
    assertions: ['a-initial-on-circle', 'a-current-on-circle', 'a-x0-vertical', 'a-xt-vertical', 'a-projections-on-axis',
      'a-initial-connects', 'a-current-connects', 'a-projection0-connects', 'a-projectiont-connects'] },
  { id: 'a-angle-motion', description: 'Initial phi upper arc and counterclockwise lower sweep arrow. Unlabelled representative arc endpoints are modern composition, not source numerical givens.',
    objects: ['a-initial-angle', 'a-phi', 'a-motion-arc', 'a-motion-direction'],
    assertions: ['a-motion-direction-connects'] },
  { id: 'b-frame-circles', description: 'Independent right x/y frame and three concentric circles, no numerical radii.',
    objects: ['b-x', 'b-y', 'b-x-label', 'b-y-label', 'b-circle-P1', 'b-circle-P2', 'b-circle-P'],
    assertions: ['b-x-connects', 'b-y-connects'] },
  { id: 'b-vector-sum', description: 'Inner shallow P1, middle steep P2, outer P; outward radii and two component-to-resultant connections preserve the source vector-sum topology.',
    requires: ['pointRelationships'], objects: ['b-O', 'b-P1', 'b-P2', 'b-P', 'b-v1', 'b-v2', 'b-v', 'b-join1', 'b-join2'],
    assertions: ['b-P1-on-circle', 'b-P2-on-circle', 'b-P-on-circle', 'b-sum-from-first', 'b-sum-from-second',
      'b-sum-join1-parallel', 'b-sum-join2-parallel', 'b-v1-connects', 'b-v2-connects', 'b-v-connects',
      'b-join1-connects', 'b-join2-connects'] },
];
const spec = {
  schema: 'ld-s10y-image/figure-spec@2', id: 'fig-21', mode: 'deterministic',
  description: 'Circular-motion x projections and addition of common-angular-speed rotating vectors. Source topology preserved; representative unlabelled coordinates are modern composition, not measured source data. No answers added.',
  source: { image: { path: `${book}/figures/fig-21.png`, sha256: sha(`${book}/figures/fig-21.png`) },
    authoritativeText: [...lesson.prose.map(p => ({ lesson: lesson.id, text: p.text })),
      ...exercises.exercises.map(e => ({ lesson: lesson.id, text: e.text }))],
    inventory },
  canvas: { width: 960, height: 480, boundingBox: [-3.3, 3.2, 10.3, -3.6],
    background: 'paper', keepAspectRatio: true },
  display: { purpose: 'instructional', layout: 'scroll', minTextPx: 16, widths: [640] },
  objects, assertions, layout: { minLabelGap: 4, avoidRegions: [] },
};
const file = save('fig-21.spec.json', spec);
console.log(JSON.stringify({ file, sha256: sha(file), objects: objects.length, assertions: assertions.length }));

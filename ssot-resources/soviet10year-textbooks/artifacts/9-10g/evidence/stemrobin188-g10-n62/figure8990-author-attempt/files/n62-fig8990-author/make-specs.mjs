import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
const root = path.dirname(fileURLToPath(import.meta.url));
const input = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n62-fig8990-author-inputs-01');
const before = JSON.parse(fs.readFileSync(path.join(root, 'bindings-before.json')));
if (before.status !== 'MATCH' || before.FIRSTs.some(f => f.mode !== '444')) throw new Error('FIRST/binding gate');
const sphere89 = {center: [240, 240], radius: 180, sinTilt: 84 / 180};
const sphere90 = {center: [416, 240], radius: 160, sinTilt: 0.5};
const point = (id, at, label, position, fontSize) => ({id, type: 'point', at, label, visible: true, size: 4, stroke: 'ink', fill: 'ink', fontSize, fontWeight: 500, labelPlacement: {position}});
const curve = (id, d, dash = 0) => ({id, type: 'svgPath', d, stroke: 'ink', strokeWidth: 3, dash});
const segment = (id, from, to, dash = 0) => ({id, type: 'segment', from, to, stroke: 'ink', strokeWidth: 3, dash});
const group = (id, description, objects, assertions, relationships = false) => ({id, description, objects, assertions, ...(relationships ? {requires: ['pointRelationships']} : {})});
const connects = (id, arrow, from, to) => ({id, type: 'connects', arrow, from, to});
const axisSymmetry = (id, center, a, b) => ({id, type: 'centralSymmetry', center, pairs: [{a, b}]});
const native89 = [
  connects('diagonal-endpoints', 'diagonal', 'A', 'B'),
  {id: 'diagonal-through-O', type: 'collinear', a: 'A', b: 'O', c: 'B'},
  connects('OM-endpoints', 'rising-ray', 'O', 'M'),
  axisSymmetry('opposite-projected-AB', 'O', 'A', 'B'),
  {id: 'equal-projected-halves', type: 'equalDistance', a: 'O', b: 'A', c: 'O', d: 'B'},
  {id: 'four-source-markers', type: 'objectCount', objectType: 'point', count: 4}
];
const native90 = [
  connects('left-axis-endpoints', 'left-straight', 'left-A', 'left-B'),
  {id: 'left-axis-through-O', type: 'collinear', a: 'left-A', b: 'left-O', c: 'left-B'},
  axisSymmetry('left-opposite-AB', 'left-O', 'left-A', 'left-B'),
  {id: 'left-A-on-circle', type: 'pointOnCircle', point: 'left-A', center: 'left-O', radius: 160},
  {id: 'left-B-on-circle', type: 'pointOnCircle', point: 'left-B', center: 'left-O', radius: 160},
  connects('right-axis-endpoints', 'right-straight', 'right-A', 'right-B'),
  {id: 'right-axis-through-O', type: 'collinear', a: 'right-A', b: 'right-O', c: 'right-B'},
  axisSymmetry('right-opposite-projected-AB', 'right-O', 'right-A', 'right-B'),
  {id: 'six-source-markers', type: 'objectCount', objectType: 'point', count: 6},
  {id: 'three-nonpoint-labels', type: 'objectCount', objectType: 'text', count: 3}
];
const layouts = {
  '89': {
    canvas: {width: 480, height: 480, boundingBox: [0, 480, 480, 0], background: 'paper', keepAspectRatio: true},
    objects: [
      {id: 'outer-outline', type: 'circle', center: [240, 240], radius: 180, stroke: 'ink', strokeWidth: 3},
      curve('internal-upper', 'M 60 240 A 180 84 0 0 1 420 240', 2),
      curve('internal-lower', 'M 420 240 A 180 84 0 0 1 60 240'),
      point('A', [132, 307.2], 'A', 'NW', 26),
      point('O', [240, 240], 'O', 'SW', 26),
      point('B', [348, 172.8], 'B', 'S', 26),
      point('M', [324, 350], 'M', 'E', 26),
      segment('diagonal', 'A', 'B', 2),
      segment('rising-ray', 'O', 'M', 2)
    ],
    inventory: [
      group('single-sphere-structure', 'FIRST only subfigure: outer closed outline and paired internal upper-dashed/lower-solid arcs. Smooth circle/ellipse regularization is not a source numeric measurement.', ['outer-outline', 'internal-upper', 'internal-lower'], []),
      group('all-four-source-points-and-strokes', 'FIRST A-like/O-like/B-like diagonal and O-like/M-like rising segment, four visible point marks and their modern English labels. Unlabelled arc crossing remains unlabelled.', ['A', 'O', 'B', 'M', 'diagonal', 'rising-ray'], native89.map(a => a.id), true)
    ],
    assertions: native89,
    mapping: {
      sphere: sphere89,
      sourceGroups: ['single-sphere-structure', 'all-four-source-points-and-strokes'],
      projection: 'screen x = cx + radius*x; screen y = cy - radius*(sqrt(1-sinTilt^2)*y + sinTilt*z)',
      spatialUnitPoints: {A: [-0.6, 0, 0.8], B: [0.6, 0, -0.8], O: [0, 0, 0]},
      MProjected: {x: (324 - 240) / 180, up: (240 - 130) / 180, depthBranch: 1},
      externalAssertions: [
        {id: 'equator-halves-exact', type: 'ellipseHalfPaths', upper: 'internal-upper', lower: 'internal-lower', rx: 180, ry: 84, center: [240, 240]},
        {id: 'A-and-B-on-projected-equator', type: 'pointOnEllipse', points: ['A', 'B'], center: [240, 240], rx: 180, ry: 84},
        {id: 'sphere-surface-ABM', type: 'spatialUnitSphere', points: ['A', 'B', 'M']},
        {id: 'diameter-through-center-and-radius', type: 'spatialDiameterAndRadius', a: 'A', b: 'B', center: 'O', radiusPoint: 'M'},
        {id: 'OM-unmarked-upper-arc-crossing', type: 'segmentEllipseCrossing', segment: 'rising-ray', center: [240, 240], rx: 180, ry: 84, screenHalf: 'upper', crossings: 1},
        {id: 'M-inside-silhouette-not-on-outline', type: 'projectedInterior', points: ['M'], center: [240, 240], radius: 180},
        {id: 'source-stroke-and-label-inventory', type: 'inventoryStyles', labels: {A: 'A', O: 'O', B: 'B', M: 'M'}, dashed: ['internal-upper', 'diagonal', 'rising-ray'], solid: ['outer-outline', 'internal-lower'], pointCount: 4, panelLabels: []}
      ],
      roleAuthority: ['p0222#2', 'p0222#3', 'p0222#4'],
      sourceNumbers: [],
      sourceGlyphHolds: ['Original A/O/B/M script and font identity remain unapproved.'],
      regularization: ['Exact circle and ellipse; midpoint-balanced diameter; arbitrary orthographic layout coordinates, not source numeric givens.'],
      additions: []
    }
  },
  '90': {
    canvas: {width: 600, height: 500, boundingBox: [0, 500, 600, 0], background: 'paper', keepAspectRatio: true},
    objects: [
      {id: 'left-arc', type: 'arc', center: [72, 260], start: [72, 100], end: [72, 420], stroke: 'ink', strokeWidth: 3},
      {id: 'right-outline', type: 'circle', center: [416, 260], radius: 160, stroke: 'ink', strokeWidth: 3},
      curve('right-upper-oval', 'M 256 240 A 160 80 0 0 1 576 240', 2),
      curve('right-lower-oval', 'M 576 240 A 160 80 0 0 1 256 240'),
      point('left-A', [72, 420], 'A', 'N', 32),
      point('left-O', [72, 260], 'O', 'E', 32),
      point('left-B', [72, 100], 'B', 'S', 32),
      point('right-A', [416, 260 + 160 * Math.sqrt(3) / 2], 'A', 'E', 32),
      point('right-O', [416, 260], 'O', 'W', 32),
      point('right-B', [416, 260 - 160 * Math.sqrt(3) / 2], 'B', 'E', 32),
      segment('left-straight', 'left-A', 'left-B'),
      segment('right-straight', 'right-A', 'right-B', 2),
      {id: 'left-radius-label', type: 'text', at: [104, 352], text: 'R', fontSize: 32, fontWeight: 500, labelPlacement: {position: 'CENTER'}, labelColor: 'ink'},
      {id: 'left-panel-label', type: 'text', at: [140, 30], text: '(a)', fontSize: 32, fontWeight: 500, labelPlacement: {position: 'CENTER'}, labelColor: 'ink'},
      {id: 'right-panel-label', type: 'text', at: [416, 30], text: '(b)', fontSize: 32, fontWeight: 500, labelPlacement: {position: 'CENTER'}, labelColor: 'ink'}
    ],
    inventory: [
      group('left-source-panel-geometry', 'FIRST left near-vertical solid stroke and right-bowing half-circle-like arc with A-like, O-like, B-like point marks. Exact semicircle and diameter roles come from admitted prose; R-like label retains upper-segment association.', ['left-arc', 'left-straight', 'left-A', 'left-O', 'left-B', 'left-radius-label'], native90.slice(0, 5).map(a => a.id), true),
      group('right-source-panel-geometry', 'FIRST right closed outline and upper-dashed/lower-solid oval with dashed A-like/O-like/B-like axis. Endpoint marks stay inside the silhouette and oval crossings stay unmarked.', ['right-outline', 'right-upper-oval', 'right-lower-oval', 'right-straight', 'right-A', 'right-O', 'right-B'], native90.slice(5, 8).map(a => a.id), true),
      group('two-source-panel-designators', 'FIRST two letter-plus-parenthesis designators become ordinal English (a), (b); exact historical codepoints remain HOLD, not source facts.', ['left-panel-label', 'right-panel-label'], ['six-source-markers', 'three-nonpoint-labels'])
    ],
    assertions: native90,
    mapping: {
      sphere: sphere90,
      leftCircle: {center: [72, 240], radius: 160},
      sourceGroups: ['left-source-panel-geometry', 'right-source-panel-geometry', 'two-source-panel-designators'],
      projection: 'screen x = cx + radius*x; screen y = cy - radius*(sqrt(1-sinTilt^2)*y + sinTilt*z)',
      spatialUnitPoints: {'right-A': [0, 1, 0], 'right-B': [0, -1, 0], 'right-O': [0, 0, 0]},
      externalAssertions: [
        {id: 'left-right-bowing-half-circle', type: 'semicircleArc', object: 'left-arc', center: 'left-O', top: 'left-A', bottom: 'left-B', radius: 160},
        {id: 'right-oval-halves-exact', type: 'ellipseHalfPaths', upper: 'right-upper-oval', lower: 'right-lower-oval', rx: 160, ry: 80, center: [416, 240]},
        {id: 'right-axis-surface-poles', type: 'spatialUnitSphere', points: ['right-A', 'right-B']},
        {id: 'right-axis-inside-silhouette', type: 'projectedInterior', points: ['right-A', 'right-B'], center: [416, 240], radius: 160},
        {id: 'right-axis-unmarked-oval-crossings', type: 'segmentEllipseCrossing', segment: 'right-straight', center: [416, 240], rx: 160, ry: 80, screenHalf: 'both', crossings: 2},
        {id: 'upper-half-radius-label-association', type: 'upperRadiusLabel', object: 'left-radius-label', center: 'left-O', top: 'left-A'},
        {id: 'source-stroke-and-label-inventory', type: 'inventoryStyles', labels: {'left-A': 'A', 'left-O': 'O', 'left-B': 'B', 'right-A': 'A', 'right-O': 'O', 'right-B': 'B', 'left-radius-label': 'R', 'left-panel-label': '(a)', 'right-panel-label': '(b)'}, dashed: ['right-upper-oval', 'right-straight'], solid: ['left-arc', 'left-straight', 'right-outline', 'right-lower-oval'], pointCount: 6, panelLabels: ['left-panel-label', 'right-panel-label']},
        {id: 'panels-ordinal-and-disjoint', type: 'panelOrder', left: 'left-panel-label', right: 'right-panel-label'}
      ],
      roleAuthority: ['p0222#9', 'p0222#10'],
      sourceNumbers: [],
      sourceGlyphHolds: ['Original panel alphabet/codepoints and mathematical font identity remain unapproved.'],
      regularization: ['Vertical axes replace slight scan tilt.', 'Same illustrative radius in both panels; right spatial poles project inside the silhouette.', 'Smooth circle, semicircle and paired ellipse halves.', 'English ordinal panel labels replace source designator shapes without decoding historic script.'],
      additions: []
    }
  }
};
for (const [number, layout] of Object.entries(layouts)) {
  const id = `fig-g10-${number}`;
  const context = JSON.parse(fs.readFileSync(path.join(input, `${id}.context.json`)));
  const spec = {
    schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic',
    description: number === '89' ? 'Sphere center, dashed diameter and radius; preserve the original projected sphere-surface point layout.' : 'Two source panels: semicircle with solid diameter and radius label, then its sphere with dashed projected axis.',
    source: {
      image: {path: path.relative(repo, context.sourceImage.path), sha256: context.sourceImage.sha256},
      authoritativeText: [
        ...context.completeEditionProse.filter(p => p.text).map(p => ({lesson: context.lesson, text: p.text})),
        ...context.completeEditionExercises.map(e => ({lesson: context.lesson, exercise: e.number, text: e.text}))
      ],
      inventory: layout.inventory
    },
    canvas: layout.canvas,
    display: {purpose: 'instructional', layout: 'inline', widths: [480, 300], maxWidthPx: 480, minTextPx: 16},
    objects: layout.objects, assertions: layout.assertions, layout: {minLabelGap: 6}
  };
  fs.writeFileSync(path.join(root, `${id}.FIRST.spec.json`), JSON.stringify(spec, null, 2) + '\n', {flag: 'wx'});
  fs.writeFileSync(path.join(root, `${id}.relationship-mapping.json`), JSON.stringify({
    schema: 'source-FIRST-executable-relationship-mapping@1', id, FIRST: `${id}-FIRST.json`,
    spec: `${id}.FIRST.spec.json`, native: layout.assertions, ...layout.mapping,
    sourceInventoryCoverage: layout.inventory,
    approval: 'Author mapping only; independent content review not performed.'
  }, null, 2) + '\n', {flag: 'wx'});
}
console.log(JSON.stringify({specs: ['fig-g10-89.FIRST.spec.json', 'fig-g10-90.FIRST.spec.json'], contentRepairCounters: [0, 0], modelCalls: 0}));

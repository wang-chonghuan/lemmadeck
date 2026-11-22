import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
const owned = path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp/n32-fig207208-author-first-10');
const textRoot = path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp/n32-text-candidate-10');
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const load = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const expected = {
  'lesson.template.json': '8cfdd2b2d53487af12c2099acebcd5f020db8522aa38e3ee49e10bb2d1d23cd4',
  'exercises.template.json': 'd1e21063eae94fe2e63dd0434f484081337a8249a15ec8d0f7cb40980688499a',
  'record.json': 'ec41479a2e7166be2e3b5a22374d7eac82abc2fe8ad5b6e593147bb417c04fc1',
};
for (const [name, sha] of Object.entries(expected)) {
  if (hash(path.join(textRoot, name)) !== sha) throw new Error(`Text binding drift: ${name}`);
}
const lesson = load(path.join(textRoot, 'lesson.template.json'));
const exercises = load(path.join(textRoot, 'exercises.template.json'));
const theoremIndex = lesson.prose.findIndex(p => p.text.startsWith('42 '));
if (theoremIndex < 0) throw new Error('Missing theorem 42');
const theorem = lesson.prose.slice(theoremIndex - 1).filter(p => p.kind === 'p')
  .map(p => ({ lesson: lesson.id, text: p.text }));
const task438 = exercises.exercises.find(e => e.number === '438');
if (!task438 || task438.lines.length !== 11) throw new Error('Incomplete ten-part task context');
const display = { layout: 'inline', purpose: 'instructional', maxWidthPx: 640, minTextPx: 16, widths: [300, 358, 640] };
const canvas = height => ({ width: 640, height, boundingBox: [0, height, 640, 0], background: 'paper', keepAspectRatio: true });
const text = (id, at, value) => ({
  id, type: 'text', at, text: value, fontSize: 38, fontWeight: 500,
  labelColor: 'ink', labelPlacement: { position: 'CENTER', offset: [0, 0] },
});
const segment = (id, from, to, strokeWidth = 3) => ({
  id, type: 'segment', from, to, stroke: 'ink', strokeWidth, dash: 0,
});
const assertion = (id, type, fields) => ({ id, type, ...fields });
const point = (id, at, label, position, offset) => ({
  id, type: 'point', at, label, visible: true, size: 3.5,
  stroke: 'ink', fill: 'ink', strokeWidth: 1.5,
  fontSize: 38, fontWeight: 500, labelColor: 'ink',
  labelPlacement: { position, offset },
});

function freezeBinding(id) {
  const p = path.join(owned, `fig-${id}.FIRST.json`);
  const expectedHash = id === 207
    ? '3e4ca9f87097ecb1fb4771d5ab86ac041e76897d5d13ed1cf3a7999e9055da46'
    : '21bb6ba71d2253d06a2b7c1e2d7e3e6b7ebe2a224e12bbfafc075c907d50b3f0';
  if ((fs.statSync(p).mode & 0o777) !== 0o444 || hash(p) !== expectedHash) {
    throw new Error('FIRST is not the completed immutable observation');
  }
  const first = load(p);
  if (hash(path.join(root, first.source.path)) !== first.source.sha256) throw new Error('Source hash drift');
  return { first, binding: { path: p, sha256: hash(p), mode: '0444' } };
}

function write(id, description, height, authoritativeText, objects, assertions) {
  const { first, binding } = freezeBinding(id);
  const context = {
    schema: 'same188-6/figure-author-context@1', figure: `fig-${id}`,
    scope: first.scope, first: binding,
    source: first.source,
    textPaths: Object.entries(expected).map(([name, sha256]) => ({ path: path.join(textRoot, name), sha256 })),
    authoritativeText,
    modernRegularization: first.modernPossibleRegularization,
    identityLimits: first.identityLimits,
    status: 'AUTHOR_ONLY', independentReview: 'NOT_RUN', canonicalPromotion: false,
  };
  const inventory = first.pixelInventory.map(item => ({
    id: item.id, description: item.fact,
    objects: item.plannedObjects, assertions: item.plannedAssertions,
    ...(item.id === '207-points' ? { requires: ['pointRelationships'] } : {}),
  }));
  const spec = {
    schema: 'ld-s10y-image/figure-spec@2', id: `fig-${id}`, mode: 'deterministic',
    description,
    source: { image: { path: first.source.path, sha256: first.source.sha256 }, authoritativeText, inventory },
    canvas: canvas(height), display, objects, assertions,
  };
  for (const [suffix, value] of [['context', context], ['spec', spec]]) {
    const p = path.join(owned, `fig-${id}.${suffix}.json`);
    if (fs.existsSync(p)) throw new Error('Do not overwrite the first content candidate');
    fs.writeFileSync(p, `${JSON.stringify(value, null, 2)}\n`);
    console.log(`${p} ${hash(p)}`);
  }
}

const A = '207-point-A', O = '207-point-O', A1 = '207-point-A1';
const aL = [50, 290], aR = [590, 290], bL = [50, 90], bR = [590, 90];
const connectorEnd = [379.2, 110];
const tickUpper = [[266, 227.42], [300, 252.58]];
const tickLower = [[340, 127.42], [374, 152.58]];
write(207, 'Theorem 42: parallel lines centrally symmetric about midpoint O. Source connector gap and both single equality ticks retained; no operator-subscript inference.',
  380, theorem, [
    segment('207-line-a', aL, aR),
    segment('207-line-b', bL, bR),
    segment('207-connector', A, connectorEnd, 2),
    segment('207-tick-upper', ...tickUpper, 2),
    segment('207-tick-lower', ...tickLower, 2),
    point(A, [246, 290], 'A', 'NW', [-6, -14]),
    point(O, [320, 190], 'O', 'W', [-18, 8]),
    point(A1, [394, 90], 'A\u2081', 'S', [0, 20]),
    text('207-label-a', [563, 326], 'a'),
    text('207-label-b', [563, 124], 'b'),
  ], [
    assertion('207-parallel', 'parallel', { a: aL, b: aR, c: bL, d: bR }),
    assertion('207-lines-central', 'centralSymmetry', { center: O, pairs: [{ a: aL, b: bR }, { a: aR, b: bL }] }),
    assertion('207-A-on-a', 'pointOnLine', { point: A, a: aL, b: aR }),
    assertion('207-A1-on-b', 'pointOnLine', { point: A1, a: bL, b: bR }),
    assertion('207-collinear', 'collinear', { a: A, b: O, c: A1 }),
    assertion('207-equal-halves', 'equalDistance', { a: A, b: O, c: O, d: A1 }),
    assertion('207-AA1-central', 'centralSymmetry', { center: O, pairs: [{ a: A, b: A1 }] }),
    assertion('207-connector-connects', 'connects', { arrow: '207-connector', from: A, to: connectorEnd }),
    assertion('207-connector-collinear', 'collinear', { a: A, b: O, c: connectorEnd }),
    assertion('207-ticks-central', 'centralSymmetry', { center: O, pairs: [{ a: tickUpper[0], b: tickLower[1] }, { a: tickUpper[1], b: tickLower[0] }] }),
  ]);

const U = [312, 480], L = [210, 194.4];
const aEnds = [[40, 330.4], [572, 623]];
const bEnds = [[54, 108.6], [612, 415.5]];
const cEnds = [[150, 26.4], [390, 698.4]];
const angleA = Math.atan(0.55), angleC = Math.atan(2.8);
const polar = (center, radius, theta) => [center[0] + radius * Math.cos(theta), center[1] + radius * Math.sin(theta)];
const sectors = [
  { name: 'ne', start: angleA, end: angleC, radii: [72] },
  { name: 'nw', start: angleC, end: angleA + Math.PI, radii: [44, 58] },
  { name: 'sw', start: angleA + Math.PI, end: angleC + Math.PI, radii: [72] },
  { name: 'se', start: angleC + Math.PI, end: angleA + 2 * Math.PI, radii: [44, 58] },
];
const objects208 = [
  segment('208-line-a', ...aEnds),
  segment('208-line-b', ...bEnds),
  segment('208-line-c', ...cEnds, 2.5),
];
const assertions208 = [
  assertion('208-parallel', 'parallel', { a: aEnds[0], b: aEnds[1], c: bEnds[0], d: bEnds[1] }),
  assertion('208-lines-count', 'objectCount', { objectType: 'segment', count: 3 }),
  ...[['a', aEnds], ['b', bEnds], ['c', cEnds]].map(([letter, ends]) =>
    assertion(`208-${letter}-connects`, 'connects', { arrow: `208-line-${letter}`, from: ends[0], to: ends[1] })),
  assertion('208-upper-on-a', 'pointOnLine', { point: U, a: aEnds[0], b: aEnds[1] }),
  assertion('208-upper-on-c', 'pointOnLine', { point: U, a: cEnds[0], b: cEnds[1] }),
  assertion('208-lower-on-b', 'pointOnLine', { point: L, a: bEnds[0], b: bEnds[1] }),
  assertion('208-lower-on-c', 'pointOnLine', { point: L, a: cEnds[0], b: cEnds[1] }),
  assertion('208-crossings-on-c', 'collinear', { a: cEnds[0], b: U, c: L }),
  assertion('208-arcs-count', 'objectCount', { objectType: 'arc', count: 12 }),
  assertion('208-text-count', 'objectCount', { objectType: 'text', count: 11 }),
  assertion('208-letter-label-count', 'objectCount', { objectType: 'text', count: 11 }),
];
for (const [level, center] of [['upper', U], ['lower', L]]) {
  for (const sector of sectors) {
    for (const radius of sector.radii) {
      const suffix = radius === 44 ? 'inner' : 'outer';
      const id = `208-${level}-${sector.name}-${suffix}`;
      const start = polar(center, radius, sector.start);
      const end = polar(center, radius, sector.end);
      objects208.push({ id, type: 'arc', center, start, end, stroke: 'ink', strokeWidth: 1.7, dash: 0 });
      assertions208.push(
        assertion(`${id}-start-radius`, 'pointOnCircle', { point: start, center, radius }),
        assertion(`${id}-end-radius`, 'pointOnCircle', { point: end, center, radius }),
        assertion(`${id}-start-ray`, 'pointOnLine', { point: start, a: center, b: polar(center, 100, sector.start) }),
        assertion(`${id}-end-ray`, 'pointOnLine', { point: end, a: center, b: polar(center, 100, sector.end) }),
      );
    }
  }
}
// Construction positions are regularized; the visible sector identity is checked from FIRST, not these arrays.
for (const [level, center, digits] of [['upper', U, [1, 6, 5, 2]], ['lower', L, [8, 4, 3, 7]]]) {
  sectors.forEach((sector, i) => {
    const radius = ['ne', 'sw'].includes(sector.name) ? 103 : 100;
    objects208.push(text(`208-angle-${digits[i]}`, polar(center, radius, (sector.start + sector.end) / 2), String(digits[i])));
  });
}
objects208.push(
  text('208-label-a', [543, 661], 'a'),
  text('208-label-b', [586, 451], 'b'),
  text('208-label-c', [344, 711], 'c'),
);
write(208, 'Exercise 438 diagram: parallel oblique lines a and b cut by steeper transversal c. All eight source sectors and single/double angle arcs retained, with no solution annotations.',
  744, [{ lesson: lesson.id, exercise: '438', text: task438.text }], objects208, assertions208);

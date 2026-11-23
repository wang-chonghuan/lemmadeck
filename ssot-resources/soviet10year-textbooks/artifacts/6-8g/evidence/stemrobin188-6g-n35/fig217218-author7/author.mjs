import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const cwd = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188';
const own = path.join(cwd, '.intentfold/tickets/STEMROBIN-188/tmp/n35-fig217218-author7');
const book = 'ssot-resources/soviet10year-textbooks/artifacts/6-8g';
const E = `${book}/editions/modern-us-neutral`;
const approved = `${book}/evidence/stemrobin188-6g-n35/text-author7`;
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const fileHash = p => hash(fs.readFileSync(p));
const write = (p, j) => fs.writeFileSync(p, `${JSON.stringify(j, null, 2)}\n`);
const asciiJSON = j => JSON.stringify(j).replace(/[^\x00-\x7f]/g,
  c => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`);
if (process.cwd() !== cwd) throw new Error('Wrong cwd');
const provenance = ['lesson', 'exercises'].map(name => {
  const p = `${approved}/${name}.template.json`;
  const text = fs.readFileSync(path.join(cwd, p), 'utf8');
  return { lesson: 'geo68-c3-s2-n35', text: asciiJSON({
    path: p, sha256: hash(text), text,
  }) };
});
const point = (id, at, label, position = 'NE', visible = false) => ({
  id, type: 'point', at, label, visible, size: 2.6, strokeWidth: 1.2,
  stroke: 'ink', fill: 'ink', fontSize: 22, fontWeight: 500,
  labelPlacement: { position, offset: [5, -5] },
});
const segment = (id, from, to, strokeWidth = 2.5, stroke = 'ink') => ({
  id, type: 'segment', from, to, strokeWidth, stroke,
});
const assertion = (id, type, values) => ({ id, type, ...values });
const group = (id, description, objects, assertions, relationships = true) => ({
  id, description, objects, assertions,
  ...(relationships ? { requires: ['pointRelationships'] } : {}),
});
const specs = [];

const A = [430, 245], A1 = [210, 181], O = [320, 213];
const d = [118, -111], k = 112 / 118;
const B = [A[0] + d[0], A[1] + d[1]];
const B1 = [A1[0] - k * d[0], A1[1] - k * d[1]];
const boundaryY = x => O[1] + (A[1] - O[1]) / (A[0] - O[0]) * (x - O[0]);
const left = [26, boundaryY(26)], right = [612, boundaryY(612)];
const rayEnd = [605, A[1] + (605 - A[0]) * d[1] / d[0]];
const oppositeEnd = [36, A1[1] + (36 - A1[0]) * d[1] / d[0]];
const hatch = [];
for (let x0 = -45, index = 0; x0 <= 612; x0 += 15, index++) {
  const slope = (A[1] - O[1]) / (A[0] - O[0]);
  const topY = (slope * (x0 - .21 * 28 - O[0]) + O[1]) / (1 - slope * .21);
  let lowerY = Math.max(28, 28 + (26 - x0) / .21);
  let upperY = Math.min(topY, 28 + (612 - x0) / .21);
  if (lowerY >= upperY) continue;
  const parts = [];
  const intersectsLabel = y => {
    const x = x0 + .21 * (y - 28);
    return x >= 301 && x <= 368 && y >= 76 && y <= 130;
  };
  // Reserve whitespace beneath the alpha label without changing the halfplane.
  if ([76, 102, 130].some(intersectsLabel)) {
    if (lowerY < 76) parts.push([lowerY, Math.min(76, upperY)]);
    if (upperY > 130) parts.push([Math.max(130, lowerY), upperY]);
  } else parts.push([lowerY, upperY]);
  for (const [part, [lo, hi]] of parts.entries()) {
    if (lo >= hi) continue;
    hatch.push(segment(`f217-hatch-${index}-${part}`,
      [x0 + .21 * (lo - 28), lo], [x0 + .21 * (hi - 28), hi], 1, 'grid'));
  }
}
const f217Objects = [
  { id: 'f217-alpha-region', type: 'polygon',
    points: [[26, 28], [612, 28], right, left],
    fill: 'paper', fillOpacity: 0, stroke: 'paper', strokeWidth: .01 },
  { id: 'f217-alpha1-region', type: 'polygon',
    points: [left, right, [612, 358], [26, 358]],
    fill: 'paper', fillOpacity: 0, stroke: 'paper', strokeWidth: .01 },
  ...hatch,
  point('f217-A', A, 'A', 'N'),
  point('f217-A1', A1, 'A\u2081', 'N'),
  point('f217-O', O, 'O', 'N', true),
  point('f217-B', B, 'B', 'NE'),
  point('f217-B1', B1, 'B\u2081', 'NE'),
  segment('f217-boundary', left, right, 2.2),
  segment('f217-ray-AB', 'f217-A', rayEnd, 2.7),
  segment('f217-ray-A1B1', 'f217-A1', oppositeEnd, 2.7),
  { id: 'f217-alpha', type: 'text', at: [335, 103], text: '\u03b1',
    fontSize: 24, fontWeight: 500, labelPlacement: { position: 'CENTER' } },
  { id: 'f217-alpha1', type: 'text', at: [307, 336], text: '\u03b1\u2081',
    fontSize: 24, fontWeight: 500, labelPlacement: { position: 'CENTER' } },
];
const f217Assertions = [
  assertion('f217-origin-midpoint', 'centralSymmetry', {
    center: 'f217-O', pairs: [{ a: 'f217-A', b: 'f217-A1' }],
  }),
  assertion('f217-origin-center-collinear', 'collinear',
    { a: 'f217-A1', b: 'f217-O', c: 'f217-A' }),
  assertion('f217-equal-origin-halves', 'equalDistance',
    { a: 'f217-A', b: 'f217-O', c: 'f217-A1', d: 'f217-O' }),
  assertion('f217-boundary-connects', 'connects',
    { arrow: 'f217-boundary', from: left, to: right }),
  assertion('f217-A-on-boundary', 'pointOnLine', { point: 'f217-A', a: left, b: right }),
  assertion('f217-A1-on-boundary', 'pointOnLine', { point: 'f217-A1', a: left, b: right }),
  assertion('f217-ray-supports-parallel', 'parallel',
    { a: 'f217-A', b: 'f217-B', c: 'f217-A1', d: 'f217-B1' }),
  assertion('f217-AB-on-displayed-ray', 'collinear',
    { a: 'f217-A', b: 'f217-B', c: rayEnd }),
  assertion('f217-A1B1-on-displayed-ray', 'collinear',
    { a: 'f217-A1', b: 'f217-B1', c: oppositeEnd }),
  assertion('f217-AB-connects', 'connects',
    { arrow: 'f217-ray-AB', from: 'f217-A', to: rayEnd }),
  assertion('f217-A1B1-connects', 'connects',
    { arrow: 'f217-ray-A1B1', from: 'f217-A1', to: oppositeEnd }),
  assertion('f217-alpha-inside', 'inside', { point: 'f217-alpha', container: 'f217-alpha-region', margin: 10 }),
  assertion('f217-alpha1-inside', 'inside', { point: 'f217-alpha1', container: 'f217-alpha1-region', margin: 10 }),
  assertion('f217-B-in-alpha', 'inside', { point: 'f217-B', container: 'f217-alpha-region' }),
  assertion('f217-B1-in-alpha1', 'inside', { point: 'f217-B1', container: 'f217-alpha1-region' }),
];
specs.push({
  id: 'fig-217',
  description: 'Theorem 43: opposite ray SETS map by central symmetry about O; A/A1 are opposite origins. B/B1 only define directions, not an asserted opposite point pair. Boundary AA1 is invariant and its alpha/alpha1 halfplanes exchange. No metric given.',
  objects: f217Objects, assertions: f217Assertions,
  inventory: [
    group('f217-boundary-origin-center',
      'Rising boundary with A1, O, A in source order; approved prose supplies midpoint, no length values.',
      ['f217-A1', 'f217-O', 'f217-A', 'f217-boundary'],
      f217Assertions.slice(0, 6).map(a => a.id)),
    group('f217-opposite-ray-supports',
      'A through B goes lower/right; A1 through B1 goes upper/left. Parallel supports. No B/B1 metric correspondence.',
      ['f217-A', 'f217-B', 'f217-A1', 'f217-B1', 'f217-ray-AB', 'f217-ray-A1B1'],
      f217Assertions.slice(6, 11).map(a => a.id)),
    group('f217-halfplane-regions',
      'alpha is lower/right hatched halfplane; alpha1 is upper/left unfilled halfplane. Hatching regularized, original dash/glyph/script/printing identities UNKNOWN.',
      ['f217-alpha-region', 'f217-alpha1-region', 'f217-alpha', 'f217-alpha1', ...hatch.map(o => o.id)],
      f217Assertions.slice(11).map(a => a.id), false),
  ],
  canvas: { width: 640, height: 380, boundingBox: [0, 380, 640, 0], background: 'paper' },
  semanticAssertions: [
    { id: 'f217-ray-set-bijection', type: 'raySetSymmetry', center: 'f217-O',
      first: ['f217-A', 'f217-B'], second: ['f217-A1', 'f217-B1'],
      rays: ['f217-ray-AB', 'f217-ray-A1B1'] },
    { id: 'f217-boundary-and-halfplane-map', type: 'halfplaneExchange',
      center: 'f217-O', boundary: ['f217-A1', 'f217-A'],
      positive: ['f217-B1', 'f217-alpha1'], negative: ['f217-B', 'f217-alpha'],
      regions: ['f217-alpha-region', 'f217-alpha1-region'],
      hatchIds: hatch.map(o => o.id) },
    { id: 'f217-origin-order', type: 'ordered', points: ['f217-A1', 'f217-O', 'f217-A'] },
  ],
});

const f218Points = [
  point('f218-A', [90, 300], 'A', 'N', true),
  point('f218-B', [586, 300], 'B', 'N', true),
  point('f218-C', [44, 130], 'C', 'N', true),
  point('f218-D', [480, 130], 'D', 'N', true),
  point('f218-P', [227, 130], 'P', 'SE', true),
  point('f218-Q', [365, 300], 'Q', 'SE', true),
  point('f218-E', [429, 300 + 64 * 170 / 138], 'E', 'E', true),
  point('f218-F', [171, 130 - 56 * 170 / 138], 'F', 'SE', true),
];
const f218Edges = [
  segment('f218-upper-support', [76, 300], 'f218-B', 2.7),
  segment('f218-lower-support', [25, 130], [520, 130], 2.7),
  segment('f218-diagonal-support', [153, 130 - 74 * 170 / 138],
    [446, 300 + 81 * 170 / 138], 2.7),
];
const f218Assertions = [
  assertion('f218-upper-collinearity', 'collinear', { a: 'f218-A', b: 'f218-Q', c: 'f218-B' }),
  assertion('f218-lower-collinearity', 'collinear', { a: 'f218-C', b: 'f218-P', c: 'f218-D' }),
  assertion('f218-diagonal-FPQ', 'collinear', { a: 'f218-F', b: 'f218-P', c: 'f218-Q' }),
  assertion('f218-diagonal-PQE', 'collinear', { a: 'f218-P', b: 'f218-Q', c: 'f218-E' }),
  assertion('f218-given-AB-parallel-CD', 'parallel',
    { a: 'f218-A', b: 'f218-B', c: 'f218-C', d: 'f218-D' }),
  ...f218Edges.map(o => assertion(`${o.id}-connects`, 'connects', { arrow: o.id, from: o.from, to: o.to })),
  assertion('f218-only-three-supports', 'objectCount', { objectType: 'segment', count: 3 }),
  assertion('f218-eight-named-points', 'objectCount', { objectType: 'point', count: 8 }),
];
specs.push({
  id: 'fig-218',
  description: 'Exercise 450 question diagram only: parallel AB and CD supports cut by EF at Q and P. Retain A-Q-B, C-P-D and F-P-Q-E, all displayed continuations and eight points. No answer annotations or off-diagram joins; no metric given.',
  objects: [...f218Points, ...f218Edges], assertions: f218Assertions,
  inventory: [
    group('f218-upper-support', 'Upper horizontal support A-Q-B; slight continuation before A and B at right end.',
      ['f218-A', 'f218-Q', 'f218-B', 'f218-upper-support'],
      ['f218-upper-collinearity', 'f218-upper-support-connects']),
    group('f218-lower-support', 'Lower horizontal support C-P-D with short extensions before C and after D.',
      ['f218-C', 'f218-P', 'f218-D', 'f218-lower-support'],
      ['f218-lower-collinearity', 'f218-lower-support-connects']),
    group('f218-diagonal-support', 'One rising support F-P-Q-E with small displayed continuations at both ends.',
      ['f218-F', 'f218-P', 'f218-Q', 'f218-E', 'f218-diagonal-support'],
      ['f218-diagonal-FPQ', 'f218-diagonal-PQE', 'f218-diagonal-support-connects']),
    group('f218-shared-intersections', 'P and Q are shared intersections; eight source labels, exactly three supports. Original glyph/script/printing/dash identities UNKNOWN.',
      f218Points.map(o => o.id).concat(f218Edges.map(o => o.id)),
      f218Assertions.map(a => a.id)),
  ],
  canvas: { width: 640, height: 420, boundingBox: [0, 420, 640, 0], background: 'paper' },
  semanticAssertions: [
    { id: 'f218-upper-order', type: 'ordered', points: ['f218-A', 'f218-Q', 'f218-B'], support: 'f218-upper-support' },
    { id: 'f218-lower-order', type: 'ordered', points: ['f218-C', 'f218-P', 'f218-D'], support: 'f218-lower-support' },
    { id: 'f218-diagonal-order', type: 'ordered', points: ['f218-F', 'f218-P', 'f218-Q', 'f218-E'], support: 'f218-diagonal-support' },
    { id: 'f218-P-intersection', type: 'intersection', point: 'f218-P', supports: ['f218-lower-support', 'f218-diagonal-support'] },
    { id: 'f218-Q-intersection', type: 'intersection', point: 'f218-Q', supports: ['f218-upper-support', 'f218-diagonal-support'] },
    { id: 'f218-complete-support-set', type: 'exactSupports', supports: f218Edges.map(o => o.id),
      labels: ['A', 'B', 'C', 'D', 'P', 'Q', 'E', 'F'] },
  ],
});

for (const draft of specs) {
  const { inventory, semanticAssertions, ...rest } = draft;
  const spec = {
    schema: 'ld-s10y-image/figure-spec@2', mode: 'deterministic', ...rest,
    source: { image: { path: `${book}/figures/${draft.id}.png`,
      sha256: fileHash(path.join(cwd, `${book}/figures/${draft.id}.png`)) },
      authoritativeText: provenance, inventory },
    display: { purpose: 'instructional', layout: 'scroll', widths: [640], minTextPx: 16 },
    layout: { minLabelGap: 5, metadata: {
      root: E, spec: `figures/${draft.id}.spec.json`,
      svg: `figures/${draft.id}.svg`, render: `figures/${draft.id}.render.json`,
      candidateOnly: true, originalIdentities: {
        glyph: 'UNKNOWN', script: 'UNKNOWN', printing: 'UNKNOWN', dash: 'UNKNOWN' },
      displayBasis: { authority: 'Direct assignment, prior stable offline contract',
        desktopUsablePx: 640, mobileUsablePx: 358, fixedScrollMediaPx: 640 },
      contextEncoding: 'Lossless ASCII JSON envelope; envelope.text is the exact original complete JSON text, hash checked.',
      semanticAssertions,
    } },
  };
  const specPath = path.join(own, `${draft.id}.spec.json`);
  if (fs.existsSync(specPath)) throw new Error(`Refusing to redo ${draft.id}`);
  write(specPath, spec);
  const result = spawnSync(process.execPath, [path.join(own, 'render-candidate.mjs'),
    '--spec', specPath, '--svg', path.join(own, `${draft.id}.svg`),
    '--report', path.join(own, `${draft.id}.render.json`)], {
    cwd, encoding: 'utf8',
  });
  fs.writeFileSync(path.join(own, `${draft.id}.native.stdout.txt`), result.stdout || '');
  fs.writeFileSync(path.join(own, `${draft.id}.native.stderr.txt`), result.stderr || '');
  write(path.join(own, `${draft.id}.execution.json`), {
    exitCode: result.status, signal: result.signal, error: result.error?.message || null,
    rendererInvocation: 1, sourceOpens: 1, candidateOnly: true,
  });
  console.log(`${draft.id}: native renderer exit ${result.status}`);
}

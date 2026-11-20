import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
const root = path.dirname(fileURLToPath(import.meta.url));
if (process.cwd() !== repo) throw new Error('Wrong authorized checkout');
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const save = (name, data) => {
  const file = path.join(root, name);
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', { flag: 'wx' });
  fs.chmodSync(file, 0o444);
  return { path: name, sha256: sha(file), bytes: fs.statSync(file).size };
};
const manifest = JSON.parse(fs.readFileSync(path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n61-fig8788-author-inputs-01/manifest.json')));
if (process.argv[2] === 'bindings-before') {
  const bindings = manifest.bindings.map(b => ({ ...b, actualSha256: sha(b.path), bytes: fs.statSync(b.path).size, matchesExpected: sha(b.path) === b.sha256 }));
  if (bindings.length !== 12 || bindings.some(b => !b.matchesExpected)) throw new Error('Input binding mismatch');
  console.log(JSON.stringify(save('bindings.before.json', { observation: 'All 12 actual digests matched on initial pre-image command and this persisted pre-draft command.', bindings })));
  process.exit(0);
}
const figure = Number(process.argv[2]);
if (![87, 88].includes(figure)) throw new Error('Only authorized figures');
const id = `fig-g10-${figure}`;
const contextPath = path.join(repo, `.intentfold/tickets/STEMROBIN-188/tmp/n61-fig8788-author-inputs-01/${id}.context.json`);
const context = JSON.parse(fs.readFileSync(contextPath));
const firstFile = path.join(root, `${id}.FIRST-inventory.json`);
const firstHashes = {
  87: 'b5ee58d5d12712d0346e643471f1c8d0002ba2ff7905450ab69f8ce845e9fd6f',
  88: '7463cd99cbfad58af0ac4b72f4f09b2699dba68722e686be2f94f2d3fdea8f0b',
};
if (sha(firstFile) !== firstHashes[figure] || (fs.statSync(firstFile).mode & 0o777) !== 0o444) throw new Error('FIRST seal changed');
const prose = context.completeEditionProse.filter(p => p.kind === 'p');
const relevant = prose.filter(p => p.text.includes('图 87') || p.text.includes('图 88') || p.text.includes('圆台的底面'));
const authoritativeText = relevant.map(p => ({ lesson: context.lesson, text: p.text }));
if (figure === 88) authoritativeText.push(...context.completeEditionExercises.filter(e => e.number === '215').map(e => ({ exercise: e.number, text: e.text })));
const display = { purpose: 'instructional', layout: 'inline', maxWidthPx: 480, widths: [480, 300], minTextPx: 16 };
const objects = [], assertions = [], mapping = [];
const point = (id, at, label, placement) => {
  objects.push({ id, type: 'point', at, visible: Boolean(!label), ...(label ? { label, fontSize: 30, labelPlacement: { position: placement } } : { size: 3, strokeWidth: 1 }), stroke: 'ink', fill: 'ink' });
};
const relation = (id, type, fields) => { assertions.push({ id, type, ...fields }); return id; };
const segment = (id, from, to, dash = 0) => {
  objects.push({ id, type: 'segment', from, to, dash, stroke: 'ink', strokeWidth: 3 });
  return relation(`${id}-connects`, 'connects', { arrow: id, from, to });
};
const circle = (id, center, radius) => objects.push({ id, type: 'circle', center, radius, stroke: 'ink', strokeWidth: 3 });
const nearly = (a, b, what) => { if (Math.abs(a - b) > 1e-9) throw new Error(`Construction relationship failed: ${what}`); };
let canvas, inventory, regularization, construction;

if (figure === 87) {
  canvas = { width: 480, height: 600, boundingBox: [-4.8, 9.8, 4.8, -2.2], background: 'paper', keepAspectRatio: true };
  const radius = 3, height = 8, depth = 0.4, k = 0.5;
  const spatial = { S: [0, 0, height], O: [0, 0, 0], A: [-2.4, -1.8, 0], B: [2.4, 1.8, 0] };
  for (const name of ['O', 'A', 'B']) spatial[`${name}1`] = spatial.S.map((s, i) => s + k * (spatial[name][i] - s));
  const project = v => [v[0], v[2] + depth * v[1]];
  const xy = Object.fromEntries(Object.entries(spatial).map(([name, value]) => [name, project(value)]));
  const placement = { S: 'N', O: 'S', A: 'SW', B: 'E', O1: 'E', A1: 'W', B1: 'NE' };
  for (const name of ['S', 'A', 'O', 'B', 'A1', 'O1', 'B1']) point(`G87-${name}`, xy[name], name.replace('1', '\u2081'), placement[name]);
  const p = name => `G87-${name}`;
  for (const name of ['A', 'O', 'B']) {
    relation(`G87-${name}-ray`, 'collinear', { a: p('S'), b: p(`${name}1`), c: p(name) });
    const d = xy[`${name}1`].map((v, i) => v - xy.S[i]);
    relation(`G87-${name}-projected-half`, 'displacement', { from: p('S'), to: p(`${name}1`), dx: d[0], dy: d[1] });
    relation(`G87-${name}-projected-full`, 'displacement', { from: p('S'), to: p(name), dx: d[0] / k, dy: d[1] / k });
    for (let i = 0; i < 2; i++) nearly(xy[`${name}1`][i] - xy.S[i], k * (xy[name][i] - xy.S[i]), `${name} homothety projection`);
  }
  relation('G87-base-center-incidence', 'collinear', { a: p('A'), b: p('O'), c: p('B') });
  relation('G87-section-center-incidence', 'collinear', { a: p('A1'), b: p('O1'), c: p('B1') });
  relation('G87-parallel-diameters', 'parallel', { a: p('A'), b: p('B'), c: p('A1'), d: p('B1') });
  const tangentY = radius * radius * depth / height;
  const tangentX = Math.sqrt(radius * radius - tangentY * tangentY);
  for (const sign of [-1, 1]) {
    const t = [sign * tangentX, depth * tangentY];
    segment(`G87-silhouette-${sign < 0 ? 'left' : 'right'}`, p('S'), t);
    nearly(t[0] ** 2 / radius ** 2 + t[1] ** 2 / (depth * radius) ** 2, 1, 'silhouette endpoint on projected circle');
    nearly(height * tangentY, depth * radius * radius, 'projection silhouette tangency');
  }
  segment('G87-A-generator', p('S'), p('A'));
  segment('G87-B-upper-generator', p('S'), p('B1'));
  segment('G87-B-lower-generator', p('B1'), p('B'), 2);
  segment('G87-axis-upper', p('S'), p('O1'));
  segment('G87-axis-lower', p('O1'), p('O'), 2);
  segment('G87-base-diameter', p('A'), p('B'), 2);
  segment('G87-section-diameter', p('A1'), p('B1'));
  const screen = v => [v[0] - canvas.boundingBox[0], canvas.boundingBox[1] - v[1]];
  const ellipse = (id, center, rx, ry, half, dash = 0) => {
    const l = screen([center[0] - rx, center[1]]);
    const r = screen([center[0] + rx, center[1]]);
    const d = half === 'full'
      ? `M ${l.join(' ')} A ${rx} ${ry} 0 0 0 ${r.join(' ')} A ${rx} ${ry} 0 0 0 ${l.join(' ')}`
      : `M ${l.join(' ')} A ${rx} ${ry} 0 0 ${half === 'front' ? 0 : 1} ${r.join(' ')}`;
    objects.push({ id, type: 'svgPath', d, stroke: 'ink', strokeWidth: 3, dash, fill: 'paper', fillOpacity: 0 });
    mapping.push({ id, formula: '(x-cx)^2/rx^2 + (y-cy)^2/ry^2 = 1; exact SVG elliptical arc; source-screen=(x-xMin,yMax-y)', center, rx, ry, half, dash });
  };
  ellipse('G87-base-front', xy.O, radius, radius * depth, 'front');
  ellipse('G87-base-rear', xy.O, radius, radius * depth, 'rear', 2);
  ellipse('G87-section-rim', xy.O1, k * radius, k * radius * depth, 'full');
  for (const name of ['A', 'B', 'A1', 'B1']) {
    const upper = name.endsWith('1'), center = upper ? xy.O1 : xy.O;
    const rx = upper ? radius * k : radius, ry = rx * depth;
    nearly((xy[name][0] - center[0]) ** 2 / rx ** 2 + (xy[name][1] - center[1]) ** 2 / ry ** 2, 1, `${name} projected rim membership`);
  }
  const allPoints = objects.filter(o => o.type === 'point').map(o => o.id);
  const rayAssertions = assertions.filter(a => /ray|projected|incidence|parallel/.test(a.id)).map(a => a.id);
  inventory = [
    { id: 'G87-cone', description: 'FIRST G87-cone: original seven labels in one cone/parallel-section frame. Shared A1/O1/B1 included for closed homothety relations. Base rear arc, AB, lower axis and B generator dashed; all defining coordinates are projected, not spatial lengths.', objects: objects.filter(o => !o.id.startsWith('G87-section-')).map(o => o.id), assertions: assertions.map(a => a.id), requires: ['pointRelationships'] },
    { id: 'G87-section', description: 'FIRST G87-section: A1/O1/B1 and solid circular section with solid diameter; shared S/A/O/B are the source homothety endpoints, not new labels.', objects: [...allPoints, 'G87-section-rim', 'G87-section-diameter', 'G87-A-generator', 'G87-B-upper-generator', 'G87-axis-upper'], assertions: [...rayAssertions, 'G87-section-diameter-connects', 'G87-A-generator-connects', 'G87-B-upper-generator-connects', 'G87-axis-upper-connects'], requires: ['pointRelationships'] },
  ];
  regularization = {
    statement: 'Arbitrary spatial right-cone parameters R=3, H=8, k=1/2 and depth projection coefficient 0.4 are author layout choices, not printed values, exercise givens or answers. Exact elliptical regularization is a projection of circular planes. No added measurement labels, equality ticks or symmetry claim.',
    projection: 'P(x,y,z)=[x,z+0.4*y]. Spatial section is S+k*(basePoint-S). P is linear, so homologous projected rays remain collinear and scale by k. Projected chord/generator lengths are NOT spatial diameters/generator lengths.',
    visibility: 'Source upper rim remains fully solid despite conventional occlusion alternatives; lower source rear components remain dashed.',
  };
  construction = { spatial, projected: xy, radius, height, k, depth, silhouetteSpatialY: tangentY, ellipseChecks: mapping };
} else {
  canvas = { width: 480, height: 520, boundingBox: [-4.8, 5.4, 4.8, -5], background: 'paper', keepAspectRatio: true };
  const theta = 50 * Math.PI / 180, outer = 4.2, inner = 2.4;
  const apex = [0, 4.5];
  const at = (radius, sign) => [sign * radius * Math.sin(theta), apex[1] - radius * Math.cos(theta)];
  const outerLeft = at(outer, -1), outerRight = at(outer, 1), innerLeft = at(inner, -1), innerRight = at(inner, 1);
  const innerContact = [0, apex[1] - inner], outerContact = [0, apex[1] - outer];
  const smallRadius = inner * theta / Math.PI, largeRadius = outer * theta / Math.PI;
  const smallCenter = [0, innerContact[1] + smallRadius], largeCenter = [0, outerContact[1] - largeRadius];
  point('G88-upper-center', smallCenter);
  point('G88-lower-center', largeCenter);
  const upper = 'G88-upper-center', lower = 'G88-lower-center';
  objects.push({ id: 'G88-inner-arc', type: 'arc', center: apex, start: innerLeft, end: innerRight, stroke: 'ink', strokeWidth: 3 });
  objects.push({ id: 'G88-outer-arc', type: 'arc', center: apex, start: outerLeft, end: outerRight, stroke: 'ink', strokeWidth: 3 });
  segment('G88-left-side', outerLeft, innerLeft);
  segment('G88-right-side', innerRight, outerRight);
  segment('G88-left-apex-extension', innerLeft, apex, 2);
  segment('G88-right-apex-extension', apex, innerRight, 2);
  circle('G88-upper-base', upper, smallRadius);
  circle('G88-lower-base', lower, largeRadius);
  relation('G88-centers-shared-net-placement', 'displacement', { from: upper, to: lower, dx: 0, dy: largeCenter[1] - smallCenter[1] });
  for (const [name, p, radius] of [['inner-left', innerLeft, inner], ['inner-right', innerRight, inner], ['outer-left', outerLeft, outer], ['outer-right', outerRight, outer], ['inner-contact', innerContact, inner], ['outer-contact', outerContact, outer]]) {
    relation(`G88-${name}-on-sector-circle`, 'pointOnCircle', { point: p, center: apex, radius });
    nearly(Math.hypot(p[0] - apex[0], p[1] - apex[1]), radius, `${name} on concentric sector circle`);
  }
  relation('G88-left-common-ray', 'collinear', { a: apex, b: innerLeft, c: outerLeft });
  relation('G88-right-common-ray', 'collinear', { a: apex, b: innerRight, c: outerRight });
  relation('G88-left-band-width', 'distance', { a: innerLeft, b: outerLeft, value: outer - inner });
  relation('G88-right-band-width', 'distance', { a: innerRight, b: outerRight, value: outer - inner });
  relation('G88-upper-contact', 'pointOnCircle', { point: innerContact, center: upper, radius: smallRadius });
  relation('G88-lower-contact', 'pointOnCircle', { point: outerContact, center: lower, radius: largeRadius });
  relation('G88-upper-contact-common-normal', 'collinear', { a: apex, b: innerContact, c: upper });
  relation('G88-lower-contact-common-normal', 'collinear', { a: apex, b: outerContact, c: lower });
  nearly(2 * theta * inner, 2 * Math.PI * smallRadius, 'inner arc equals upper circumference');
  nearly(2 * theta * outer, 2 * Math.PI * largeRadius, 'outer arc equals lower circumference');
  const refs = objects.map(o => o.id), aids = assertions.map(a => a.id);
  inventory = [
    { id: 'G88-annular-sector', description: 'FIRST annular-sector: two concentric arcs, two solid sides and two dashed apex extensions, with shared unlabeled base-center dots to execute coupled net placement. Literal apex/endpoints/contact coordinates are local construction points, not new printed letters.', objects: refs, assertions: aids, requires: ['pointRelationships'] },
    { id: 'G88-upper-base', description: 'FIRST small solid base circle and its center dot, meeting inner arc at its lowest point. Both source center dots are mapped as the shared placement frame; no given or measurement label added.', objects: refs, assertions: aids, requires: ['pointRelationships'] },
    { id: 'G88-lower-base', description: 'FIRST large solid base circle and its center dot, meeting outer arc at its highest point. Shared center frame explicitly binds both circle contacts to the same annular net.', objects: refs, assertions: aids, requires: ['pointRelationships'] },
  ];
  regularization = {
    statement: 'Generic unlabelled net with author-only outer=4.2, inner=2.4, half-angle=50 degrees. These are arbitrary composition values, not source dimensions and NOT the solution of exercise 215. Both circle radii derive from arc-length/circumference compatibility, not raster-length measurement. Apparent centered layout is regularized explicitly, not admitted as a source symmetry given.',
    exactNet: 'innerArcLength=2*theta*inner=2*pi*smallRadius; outerArcLength=2*theta*outer=2*pi*largeRadius; bandWidth=outer-inner. Corresponding coaxial frustum exists with slant=bandWidth and height=sqrt(bandWidth^2-(largeRadius-smallRadius)^2)>0.',
    sharedExercise215: 'Preserve shared prose total-surface net including BOTH base disks. Exercise 215(1) states base radii 5 cm and 2 cm, height 4 cm, and asks net radii and arc values. Exercise 215(2) states bucket base diameters 28 cm and 20 cm, height 24 cm, asks net size and square meters of material ignoring seams. None of those givens belongs to the unlabeled source crop; do not add either problem instance or requested results to this shared figure.',
    labels: 'No source labels exist, so no radius, angle, point-letter or measurement labels are introduced.',
  };
  construction = {
    apex, innerLeft, innerRight, outerLeft, outerRight, innerContact, outerContact,
    smallCenter, largeCenter, inner, outer, thetaRadians: theta, smallRadius, largeRadius,
    innerArcLength: 2 * theta * inner, upperCircumference: 2 * Math.PI * smallRadius,
    outerArcLength: 2 * theta * outer, lowerCircumference: 2 * Math.PI * largeRadius,
    slant: outer - inner, correspondingFrustumHeight: Math.sqrt((outer - inner) ** 2 - (largeRadius - smallRadius) ** 2),
  };
}
const spec = {
  schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic',
  description: figure === 87 ? 'Projected spatial cone and its parallel circular section: S is the homothety center, A1-A the frustum generator, O1-O its height. No projected length is asserted equal to a spatial length.' : 'Shared unlabelled full frustum surface net: annular lateral band plus both base disks, also referenced by exercise 215 without revealing its requested net measurements.',
  source: { image: { path: context.sourceImage.path, sha256: context.sourceImage.sha256 }, authoritativeText, inventory },
  canvas, display, objects, assertions, layout: { minLabelGap: 8 },
};
const receipts = [
  save(`${id}.FIRST.spec.json`, spec),
  save(`${id}.FIRST.relationship-mapping.json`, {
    schema: 'bounded-author-relationship-mapping@1', figure: id, first: { path: `${id}.FIRST-inventory.json`, sha256: sha(firstFile), mode: '0444' },
    context: { path: contextPath, sha256: sha(contextPath), completeProseCountRead: context.completeEditionProse.length, completeExerciseCountRead: context.completeEditionExercises.length, answersRead: false },
    route: { mode: 'deterministic', engine: 'existing JSXGraph renderer', purpose: 'instructional', semanticArtworkNeeded: false, paidCalls: 0 },
    inventoryGroups: inventory, regularization, construction,
    executableRelationshipEvidence: 'Construction command computes and rejects violated homothety, projected ellipse incidence, tangent silhouette, net-circle circumference and shared-contact relationships; native FigureSpec assertions additionally execute all mapped point/line/radius/connectivity relationships on this actual draft.',
    validation: 'NOT YET RUN', review: 'NONE',
  }),
];
console.log(JSON.stringify({ figure: id, receipts, constructionRelationships: 'AUTHOR_CONSTRUCTION_SATISFIED_ONLY', assertionCount: assertions.length, objectCount: objects.length }));

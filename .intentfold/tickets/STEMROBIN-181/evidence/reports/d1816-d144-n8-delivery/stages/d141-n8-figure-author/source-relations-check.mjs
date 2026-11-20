import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
const home = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d141-n8-figure-author');
assert.equal(process.cwd(), repo);
const [candidate] = process.argv.slice(2);
assert(candidate && path.resolve(candidate).startsWith(path.join(repo, '.tmp/STEMROBIN-181/d1816-d141/figure05/')));
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const specPath = path.join(candidate, 'fig-05.spec.json');
const modelPath = path.join(candidate, 'schematic-construction.json');
const outputPath = path.join(candidate, 'source-relations.assertions.json');
assert(!fs.existsSync(outputPath), 'Do not overwrite assertion evidence');
const spec = read(specPath);
const model = read(modelPath);
const inventory = read(path.join(home, 'source-pixel-inventory.json'));
const context = read(path.join(home, 'fig-05.input-context.json'));
const objects = new Map(spec.objects.map(item => [item.id, item]));
const checks = [];
const check = (id, fn, evidence) => {
  try {
    fn();
    checks.push({ id, status: 'pass', evidence });
  } catch (error) {
    checks.push({ id, status: 'fail', error: error.message, evidence });
  }
};
const near = (a, b, tolerance = 0.000003) => assert(Math.abs(a - b) <= tolerance, `${a} != ${b}`);
const pairNear = (a, b) => { near(a[0], b[0]); near(a[1], b[1]); };
const parsePath = id => {
  const object = objects.get(id);
  assert.equal(object.type, 'svgPath');
  const tokens = object.d.match(/[ML]|-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?/gi);
  assert.equal(tokens.join(' ').replaceAll(' ', ''), object.d.replaceAll(' ', ''));
  assert.equal(tokens.length % 3, 0);
  const points = [];
  for (let i = 0; i < tokens.length; i += 3) {
    assert.equal(tokens[i], i ? 'L' : 'M');
    points.push([Number(tokens[i + 1]), Number(tokens[i + 2])]);
  }
  return points;
};
const curve = Object.fromEntries(['repulsion', 'attraction', 'net'].map(kind => [kind, parsePath(`${kind}-curve`)]));
const thick = parsePath('net-equilibrium-thick-segment');
const { zeroY, r0X, axisX, width, height } = model.frame;
const user = ([x, y]) => [x, height - y];
const force = ([, y]) => zeroY - y;
const byX = points => new Map(points.map(point => [point[0], point]));
const maps = Object.fromEntries(Object.entries(curve).map(([kind, points]) => [kind, byX(points)]));
const modeled = x => {
  const delta = x - r0X;
  const a = model.magnitudePx * Math.exp(-delta / model.attractionDecayPx);
  const q = model.tailRatio + (1 - model.tailRatio) * Math.exp(-delta / model.differenceDecayPx);
  return { repulsion: a * q, attraction: -a, net: a * (q - 1) };
};
const common = curve.net.filter(([x]) => maps.repulsion.has(x) && maps.attraction.has(x));

check('single-frame', () => {
  assert.equal(spec.objects.filter(item => item.type === 'arrow').length, 2);
  assert.equal(spec.objects.filter(item => ['grid', 'axis', 'polygon', 'circle'].includes(item.type)).length, 0);
  pairNear(objects.get('force-axis').from, user([axisX, 495]));
  pairNear(objects.get('force-axis').to, user([axisX, 25]));
  pairNear(objects.get('distance-axis').from, user([20, zeroY]));
  pairNear(objects.get('distance-axis').to, user([620, zeroY]));
}, 'Exactly two arrows define the one common uncalibrated coordinate frame.');
check('orthogonal-axes', () => {
  const f = objects.get('force-axis'), r = objects.get('distance-axis');
  near((f.to[0] - f.from[0]) * (r.to[0] - r.from[0]) + (f.to[1] - f.from[1]) * (r.to[1] - r.from[1]), 0);
}, 'Dot product of the actual spec axis vectors is zero.');
check('origin-zero', () => {
  assert.equal(objects.get('origin-label').text, '0');
  assert(objects.get('origin-label').at[0] < axisX);
  assert(objects.get('origin-label').at[1] < height - zeroY);
}, 'Origin is labelled zero, below-left of the axes intersection.');
check('no-calibration', () => {
  assert.deepEqual(spec.objects.filter(item => item.type === 'text').map(item => item.text).sort(), ['0', 'Attraction', 'F', 'Net force', 'Repulsion', 'r', 'r\u2080'].sort());
  assert(spec.objects.every(item => !item.ticks && !item.label));
  assert.equal(model.coordinateMeaning, 'Unlabelled screen pixels only; no physical numbers, units or named force law.');
}, 'Only source axis symbols, zero, equilibrium symbol and translated force names are visible.');
for (const kind of ['repulsion', 'attraction', 'net']) {
  check(`${kind}-solid`, () => assert.equal(objects.get(`${kind}-curve`).dash, 0), 'Source force curve remains solid.');
  check(`${kind}-callout`, () => {
    const leader = objects.get(`${kind}-callout-leader`);
    const screenTo = user(leader.to);
    const point = maps[kind].get(screenTo[0]);
    assert(point, 'Leader endpoint must occur on the actual curve mesh');
    pairNear(point, screenTo);
    assert(spec.assertions.some(item => item.type === 'connects' && item.arrow === leader.id));
    assert.equal(objects.get(`${kind}-callout`).text, kind === 'net' ? 'Net force' : kind === 'repulsion' ? 'Repulsion' : 'Attraction');
  }, 'Actual leader endpoint lies on the matching curve and has native connects coverage.');
}
check('repulsion-positive', () => assert(curve.repulsion.every(point => force(point) > 0)), `${curve.repulsion.length} vertices, hence every linear segment, are above zero.`);
check('repulsion-decreasing', () => assert(curve.repulsion.every((p, i, a) => !i || force(p) < force(a[i - 1]))), 'Every consecutive repulsion vertex decreases with distance.');
check('attraction-negative', () => assert(curve.attraction.every(point => force(point) < 0)), `${curve.attraction.length} vertices, hence every linear segment, are below zero.`);
check('attraction-increasing', () => assert(curve.attraction.every((p, i, a) => !i || force(p) > force(a[i - 1]))), 'Every consecutive attraction vertex rises toward zero.');
check('net-signed-sum', () => {
  assert(common.length > 1000);
  for (const p of common) near(force(p), force(maps.repulsion.get(p[0])) + force(maps.attraction.get(p[0])));
  for (const [kind, points] of Object.entries(curve)) {
    for (const p of points) near(force(p), modeled(p[0])[kind]);
    assert(points.every((p, i, a) => !i || p[0] - a[i - 1][0] === model.stepPx));
  }
}, `${common.length} common vertices share a mesh; signed addition holds on the intervening line segments too. Every path vertex is bound to the explicit screen regularizer.`);
check('net-zero-r0', () => {
  near(force(maps.net.get(r0X)), 0);
  assert.equal(curve.net.filter(p => Math.abs(force(p)) < 0.000001).length, 1);
}, 'Exactly one actual net-curve vertex is zero, at r0.');
check('net-left-positive', () => assert(curve.net.filter(p => p[0] < r0X).every(p => force(p) > 0)), 'All drawn net vertices left of r0 are strictly positive.');
check('net-right-negative', () => assert(curve.net.filter(p => p[0] > r0X).every(p => force(p) < 0)), 'All drawn net vertices right of r0 are strictly negative.');
check('net-between-components', () => {
  for (const p of common) {
    assert(force(maps.attraction.get(p[0])) < force(p));
    assert(force(p) < force(maps.repulsion.get(p[0])));
  }
}, 'At every common mesh vertex, attraction < net < repulsion; interpolation preserves ordering.');
const minimumIndex = curve.net.reduce((index, p, i, a) => force(p) < force(a[index]) ? i : index, 0);
check('net-negative-minimum', () => {
  assert(curve.net[minimumIndex][0] > r0X);
  assert(force(curve.net[minimumIndex]) < 0);
  assert(minimumIndex > 0 && minimumIndex < curve.net.length - 1);
  assert(curve.net.every((p, i, a) => !i || (i <= minimumIndex ? force(p) < force(a[i - 1]) : force(p) > force(a[i - 1]))));
}, { negativeMinimumScreenPoint: curve.net[minimumIndex], monotoneBranches: 'One decreasing branch followed by one increasing branch.' });
for (const kind of ['repulsion', 'attraction', 'net']) {
  check(`${kind}-${kind === 'repulsion' ? 'positive' : 'negative'}-tail`, () => {
    const tail = curve[kind].at(-1);
    assert.equal(tail[0], model.drawDomainPx[1]);
    assert(kind === 'repulsion' ? force(tail) > 0 : force(tail) < 0);
    assert(Math.abs(force(tail)) < 12);
    assert(Math.abs(force(tail)) < Math.abs(force(maps[kind].get(500))));
  }, { tailScreenPoint: curve[kind].at(-1), noFiniteZeroEndpoint: true });
}
check('infinite-limit-and-no-cutoff', () => {
  assert(model.magnitudePx > 0);
  assert(model.attractionDecayPx > 0 && model.differenceDecayPx > 0);
  assert(model.tailRatio > 0 && model.tailRatio < 1);
  // Positive decay rates certify exp(-delta/scale) -> 0. Their coefficients
  // are finite; q tends to a positive value below 1, preserving the tail signs.
  const logAttraction = delta => Math.log(model.magnitudePx) - delta / model.attractionDecayPx;
  const logRepulsion = delta => logAttraction(delta) + Math.log(
    model.tailRatio + (1 - model.tailRatio) * Math.exp(-delta / model.differenceDecayPx)
  );
  const logNetMagnitude = delta => logAttraction(delta) + Math.log(
    (1 - model.tailRatio) * -Math.expm1(-delta / model.differenceDecayPx)
  );
  for (const fn of [logAttraction, logRepulsion, logNetMagnitude]) {
    assert(fn(1e6) < fn(1e4));
    assert(fn(1e9) < -1e6);
  }
}, 'Analytic positive-rate decay certificate plus log-space extension checks; the finite rendering never claims a finite zero cutoff. Formula constants are screen-space regularization, not physical data.');
check('near-distance-repulsion-grows-faster', () => {
  const left = modeled(295), eq = modeled(300);
  assert(left.repulsion - eq.repulsion > -left.attraction + eq.attraction);
}, 'Uncalibrated near-equilibrium screen component changes preserve the approved qualitative growth ordering.');
check('equilibrium-components-equal', () => near(force(maps.repulsion.get(r0X)), -force(maps.attraction.get(r0X))), 'Opposite components have equal magnitude at the actual net crossing.');
check('equilibrium-label-aligned', () => {
  pairNear(objects.get('equilibrium-label').at, user(maps.net.get(r0X)));
  assert.equal(objects.get('equilibrium-label').labelPlacement.position, 'NW');
}, 'Label anchor is the net crossing; above-left placement preserves the source convention.');
check('thick-segment-on-net', () => {
  for (const p of thick) pairNear(p, maps.net.get(p[0]));
  assert(objects.get('net-equilibrium-thick-segment').strokeWidth > objects.get('net-curve').strokeWidth);
  assert.equal(objects.get('net-equilibrium-thick-segment').stroke, objects.get('net-curve').stroke);
}, 'Every thick-segment vertex is byte-equivalent to the net curve vertex, with a wider same-role stroke.');
check('thick-segment-straddles-r0', () => assert(thick[0][0] < r0X && thick.at(-1)[0] > r0X && thick.some(p => p[0] === r0X)), 'Thick segment covers both signs and the zero crossing.');
check('thick-segment-short', () => assert((thick.at(-1)[0] - thick[0][0]) / (curve.net.at(-1)[0] - curve.net[0][0]) < 0.03), 'Emphasized horizontal span is less than 3% of the drawn net-curve span; this is a layout constraint, not source numerical calibration.');
const [thickStart, thickEnd] = [thick[0], thick.at(-1)];
const maxDeviation = Math.max(...thick.map(([x, y]) => Math.abs(y - (
  thickStart[1] + (thickEnd[1] - thickStart[1]) * (x - thickStart[0]) / (thickEnd[0] - thickStart[0])
))));
check('thick-segment-nearly-straight', () => assert(maxDeviation < 1.5), { maxScreenDeviationPx: maxDeviation, boundPx: 1.5 });
const guides = Object.fromEntries(['left', 'right'].flatMap(side => ['upper', 'lower'].map(position => [
  `${side}-${position}`, parsePath(`guide-${side}-${position}`),
])));
check('dashed-guides-retained', () => {
  assert.equal(Object.keys(guides).length, 4);
  for (const id of Object.keys(guides)) {
    assert.equal(objects.get(`guide-${id}`).dash, 2);
    assert.equal(objects.get(`guide-${id}`).stroke, 'muted');
  }
}, 'Four dashed guide branches retain the source distinction from all three solid force curves.');
check('dashed-guide-endpoints', () => {
  pairNear(guides['left-upper'][0], [55, 135]);
  pairNear(guides['left-lower'][0], [55, 385]);
  for (const position of ['upper', 'lower']) {
    pairNear(guides[`left-${position}`].at(-1), [180, 260]);
    pairNear(guides[`right-${position}`][0], [180, 260]);
    pairNear(guides[`right-${position}`].at(-1), [420, 260]);
  }
}, 'Left branches start on F axis; upper/lower branches share the left zero junction and the right zero closure.');
check('dashed-guide-reflection', () => {
  for (const side of ['left', 'right']) {
    assert.equal(guides[`${side}-upper`].length, guides[`${side}-lower`].length);
    guides[`${side}-upper`].forEach((p, i) => {
      near(p[0], guides[`${side}-lower`][i][0]);
      near(p[1] + guides[`${side}-lower`][i][1], 2 * zeroY);
    });
  }
}, 'Every paired guide vertex reflects across the one shared horizontal axis.');
check('dashed-guide-extrema-aligned', () => {
  pairNear(guides['right-upper'][100], [r0X, 135]);
  pairNear(guides['right-lower'][100], [r0X, 385]);
  assert(guides['right-upper'].every(p => p[1] >= 135));
  assert(guides['right-lower'].every(p => p[1] <= 385));
}, 'Opposite source guide extrema share the equilibrium horizontal position.');
check('all-finite-geometry-inside', () => {
  for (const points of [...Object.values(curve), thick, ...Object.values(guides)]) {
    assert(points.every(([x, y]) => Number.isFinite(x) && Number.isFinite(y) && x >= 0 && x <= width && y >= 0 && y <= height));
  }
}, 'Explicitly covers raw svgPath geometry that the native finite-geometry check excludes.');
check('complete-authoritative-text', () => {
  assert.deepEqual(spec.source.authoritativeText, ['zh', 'en'].map(lang => ({ lesson: context.lesson, text: context.fullText[lang] })));
  assert(spec.source.authoritativeText.every(item => !item.text.includes('/Users/') && !item.text.includes('.tmp/')));
  assert.equal(hash(context.sourceImage.path), context.sourceImage.sha256);
  assert.equal(hash(spec.source.image.path), context.sourceImage.sha256);
}, 'Full actual approved bilingual learner text, not scratch locators; original and durable PNG hashes agree.');
check('semantic-colors-and-display', () => {
  const allowed = ['ink', 'muted', 'accent', 'accentSoft', 'grid', 'paper', 'none'];
  for (const item of spec.objects) for (const key of ['stroke', 'fill', 'labelColor']) if (item[key]) assert(allowed.includes(item[key]));
  assert.deepEqual(spec.display, { purpose: 'instructional', layout: 'scroll', widths: [640], minTextPx: 16 });
}, 'Instructional scroll at actual 640px media width, with semantic color roles only.');
const requiredIds = inventory.observations.flatMap(item => item.requiredChecks);
check('all-pixel-claims-executable', () => {
  const checkIds = new Set(checks.map(item => item.id));
  assert(requiredIds.length > 30);
  for (const id of requiredIds) assert(checkIds.has(id), `Missing source assertion: ${id}`);
}, { sourceRequirementIds: requiredIds });
const failures = checks.filter(item => item.status === 'fail');
const report = {
  schema: 'STEMROBIN-181/source-relations-assertions@1',
  status: failures.length ? 'fail' : 'pass',
  independentApproval: false,
  spec: { path: path.resolve(specPath), sha256: hash(specPath) },
  construction: { path: path.resolve(modelPath), sha256: hash(modelPath) },
  sourceInventory: { path: path.join(home, 'source-pixel-inventory.json'), sha256: hash(path.join(home, 'source-pixel-inventory.json')) },
  sourceImage: context.sourceImage,
  nativeAssertions: spec.assertions.length,
  objectCountOnlyAssertions: spec.assertions.filter(item => item.type === 'objectCount').length,
  totalChecks: checks.length,
  checks,
  failures,
};
fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ status: report.status, totalChecks: checks.length, failures, report: path.resolve(outputPath) }));
process.exitCode = failures.length ? 2 : 0;

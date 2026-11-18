import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const own = '.tmp/s10y-choice/batch013-independent35/';
const root = 'ssot-resources/soviet10year-textbooks/artifacts/9-10g/';
const modern = root + 'editions/modern-us-neutral/';
const lesson = modern + 'lessons/geo910-c1-s3-n35/';
const load = (path) => JSON.parse(readFileSync(path, 'utf8'));
const hash = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
const sub = (a, b) => a.map((x, i) => x - b[i]);
const add = (a, b) => a.map((x, i) => x + b[i]);
const scale = (a, t) => a.map((x) => x * t);
const dot = (a, b) => a.reduce((sum, x, i) => sum + x * b[i], 0);
const length = (a) => Math.sqrt(dot(a, a));
const midpoint = (a, b) => scale(add(a, b), 0.5);
const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-10, `${a} != ${b}`);
const cross = (a, b) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const lineDistance = (p, u, q, v) => {
  const normal = cross(u, v);
  return Math.abs(dot(sub(q, p), normal)) / length(normal);
};
const perpendicular = (connector, u, v) => {
  close(dot(connector, u), 0);
  close(dot(connector, v), 0);
};
const checks = [];
const keys = load(lesson + 'answer-keys.json');
const exercises = load(lesson + 'exercises.json');
const raw = load(root + 'lessons/geo910-c1-s3-n35/exercises.json');
const prose = load(lesson + 'lesson.json');
const answer = (number) => keys.answers.find((a) => a.exercise === number);
assert.equal(exercises.exercises.length, 7);
assert.deepEqual(keys.answers.map((a) => a.exercise), exercises.exercises.map((e) => e.number));
assert.equal(new Set(keys.answers.map((a) => a.exercise)).size, 7);
for (const a of keys.answers) {
  assert.equal(a.source, 'derived');
  assert.ok(a.displayAnswer.length > 0);
  assert.deepEqual(a.historical_entities, []);
}
assert.deepEqual(keys.answers.filter((a) => a.grading === 'auto').map((a) => a.exercise), ['324', '328', '330']);
for (const number of ['325', '326', '327', '329']) {
  assert.equal(answer(number).grading, 'ungraded');
  assert.deepEqual(answer(number).parts, []);
}
checks.push({ check: 'one-to-one completeness and semantic grading classification', status: 'pass', exercises: keys.answers.map((a) => a.exercise) });

const prism = load(modern + 'figures/fig-129.spec.json');
const point = (spec, id) => spec.objects.find((o) => o.id === id).spatialAt;
const p = (id) => point(prism, id);
for (const [first, second, endpoints] of [
  [['A1', 'D1'], ['B', 'B1'], ['A1', 'B1']],
  [['D', 'C'], ['B1', 'C1'], ['C', 'C1']],
  [['C', 'C1'], ['A', 'B'], ['B', 'C']],
]) {
  const connector = sub(p(endpoints[1]), p(endpoints[0]));
  const u = sub(p(first[1]), p(first[0]));
  const v = sub(p(second[1]), p(second[0]));
  perpendicular(connector, u, v);
  close(length(connector), lineDistance(p(first[0]), u, p(second[0]), v));
}
const allowedNames = [
  ['A_1B_1', 'B_1A_1'],
  ['CC_1', 'C_1C'],
  ['BC', 'CB'],
];
assert.equal(answer('324').parts.length, 3);
answer('324').parts.forEach((part, i) => {
  assert.equal(part.judge, 'exact');
  assert.deepEqual(new Set(part.expected), new Set([
    ...allowedNames[i],
    ...allowedNames[i].map((name) => `\\left(${name}\\right)`),
  ]));
});
checks.push({ check: '324 actual FigureSpec spatial geometry and forward/reverse endpoint names', status: 'pass', runtimeSerializationTested: false });

const origin = [0, 0, 0];
for (const a of [1, Math.SQRT2, 3]) {
  const A = origin, B = [a, 0, 0], D = [0, a, 0], A1 = [0, 0, a], C1 = [a, a, a];
  const O = [a / 2, a / 2, 0];
  perpendicular(sub(O, A), sub(A1, A), sub(D, B));
  close(length(sub(O, A)), a / Math.SQRT2);
  close(lineDistance(A, sub(A1, A), B, sub(D, B)), a / Math.SQRT2);
  const P = midpoint(A1, D), Q = midpoint(B, C1);
  perpendicular(sub(Q, P), sub(D, A1), sub(C1, B));
  close(length(sub(Q, P)), a);
  close(lineDistance(A1, sub(D, A1), B, sub(C1, B)), a);
}
checks.push({ check: '326 and 327 cube midpoint constructions and line-distance cross-checks', status: 'pass', faceArea2DistanceCm: Math.SQRT2 });

for (const a of [1, 2, 3]) {
  const s = a / (2 * Math.SQRT2);
  const vertices = [[s, s, s], [s, -s, -s], [-s, s, -s], [-s, -s, s]];
  for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) close(length(sub(vertices[i], vertices[j])), a);
  const [A, B, C, D] = vertices;
  const U = midpoint(A, B), V = midpoint(C, D);
  perpendicular(sub(V, U), sub(B, A), sub(D, C));
  close(length(sub(V, U)), a / Math.SQRT2);
  close(lineDistance(A, sub(B, A), C, sub(D, C)), a / Math.SQRT2);
}
assert.equal(answer('328').parts[0].judge, 'expression');
assert.deepEqual(answer('328').parts[0].expected, ['\\frac{a}{\\sqrt{2}}']);
checks.push({ check: '328 independent regular-tetrahedron coordinates, all six equal edges and opposite-edge distance', status: 'pass', expressionRuntimeTested: false });

for (const t of [-3, 0, 1, 5]) for (const u of [-4, 0, 2]) {
  const P = [t, 0, -1], Q = [u, 2 * u, 1];
  close(midpoint(P, Q)[2], 0);
  assert.ok(P[2] * Q[2] < 0);
}
checks.push({ check: '329 opposite constant heights imply every connector midpoint lies in gamma', status: 'pass', note: 'Finite coordinate examples supplement, not replace, the general affine-height proof in answerGate.json.' });

const vectors = load(modern + 'figures/fig-130.spec.json');
for (const [prefix, sign] of [['a', 1], ['b', -1]]) {
  const A = point(vectors, prefix + '-A'), M = point(vectors, prefix + '-M');
  const N = point(vectors, prefix + '-N'), B = point(vectors, prefix + '-B');
  const m = sub(M, A), d = sub(N, M), n = sub(B, N), AB = sub(B, A);
  perpendicular(d, m, n);
  add(add(m, d), n).forEach((x, i) => close(x, AB[i]));
  close(dot(m, n), sign * length(m) * length(n) * 0.5);
  close(dot(AB, AB), dot(m, m) + dot(d, d) + dot(n, n) + 2 * dot(m, n));
}
let cases330 = 0;
for (const m of [0, 1, 3]) for (const n of [0, 2]) for (const d of [0.5, 2]) {
  for (const phi of [Math.PI / 6, Math.PI / 3, Math.PI / 2]) for (const sign of [1, -1]) {
    const A = [m, 0, d], B = [-sign * n * Math.cos(phi), n * Math.sin(phi), 0];
    const squared = m * m + d * d + n * n + sign * 2 * m * n * Math.cos(phi);
    close(dot(sub(B, A), sub(B, A)), squared);
    assert.ok(squared >= d * d - 1e-10);
    cases330++;
  }
}
const original330 = raw.exercises.find((e) => e.number === '330').text;
assert.equal(answer('330').bookRaw, original330.slice(original330.indexOf('解.')));
assert.ok(answer('330').bookRaw.endsWith('$|AB|=\\sqrt{m^2+n^2\\pm2mn\\cos\\varphi}$.'));
assert.ok(exercises.exercises.find((e) => e.number === '330').text.endsWith('$|AB|=\\sqrt{m^2+d^2+n^2\\pm2mn\\cos\\varphi}$.'));
assert.equal(prose.errata[0].target, 'exercises[6]');
assert.equal(prose.errata[0].corrected, '$|AB|=\\sqrt{m^2+d^2+n^2\\pm2mn\\cos\\varphi}$');
assert.deepEqual(answer('330').parts.map((part) => part.expected), [
  ['\\sqrt{m^2+d^2+n^2+2mn\\cos\\varphi}'],
  ['\\sqrt{m^2+d^2+n^2-2mn\\cos\\varphi}'],
]);
checks.push({ check: '330 actual spatial vectors, directed signs, nonzero d^2, complete original inline solution and modern correction', status: 'pass', coordinateCases: cases330, omittedD2Counterexample: { m: 1, n: 1, d: 1, phiDegrees: 90, actualSquared: 3, originalPrintedSquared: 2 }, expressionRuntimeTested: false });

const files = [
  own + 'blind-solutions.md', own + 'blind-view-review.md', own + 'review.json',
  '.tmp/s10y-choice/batch013-author3435/n35.seed.json',
  '.tmp/s10y-choice/batch013-author3435/n35.draft.json',
  lesson + 'answer-keys.json', lesson + 'lesson.json', lesson + 'exercises.json', lesson + 'figures.json',
  root + 'lessons/geo910-c1-s3-n35/exercises.json',
  modern + 'figures/fig-128.svg',
  ...['fig-129', 'fig-130'].flatMap((id) => [
    modern + `figures/${id}.svg`, modern + `figures/${id}.spec.json`, root + `figures/${id}.png`,
  ]),
  '.tmp/s10y-image/batch012-n35-129130/fig-129/initial/full-preview.png',
  '.tmp/s10y-image/batch013-repair125130/fig-130/clearance-r2/preview.png',
  own + 'fig-128.current.png',
];
const report = {
  schema: 'same184-3/independent-semantic-checks@1',
  scope: 'n35 choices and standard answers only; not MathLive, ComputeEngine or finalize',
  checks,
  inputHashes: files.map((path) => ({ path, sha256: hash(path) })),
};
writeFileSync(own + 'semantic-checks.json', JSON.stringify(report, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ status: 'pass', checkGroups: checks.length, coordinateCases330: cases330, output: own + 'semantic-checks.json' }));

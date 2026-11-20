import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
const home = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d141-n8-figure-author');
const first = path.join(repo, '.tmp/STEMROBIN-181/d1816-d141/figure05/candidate-1');
const second = path.join(repo, '.tmp/STEMROBIN-181/d1816-d141/figure05/candidate-2');
assert.equal(process.cwd(), repo);
assert(!fs.existsSync(second), 'Do not overwrite repaired candidate');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const binding = file => ({ path: file, sha256: hash(file) });
const spec = read(path.join(first, 'fig-05.spec.json'));
const model = read(path.join(first, 'schematic-construction.json'));
const firstRelations = read(path.join(first, 'source-relations.assertions.json'));
assert.equal(firstRelations.status, 'fail');
assert.deepEqual(firstRelations.failures.map(item => item.id), ['repulsion-callout', 'thick-segment-nearly-straight']);
const nativeReceipt = path.join(home, 'native/fig05-c1-native-validate/receipt.json');
assert.equal(read(nativeReceipt).exitCode, 2);
const round = n => Number(n.toFixed(6));
const user = ([x, y]) => [round(x), round(model.frame.height - y)];
const repulsionAt = x => {
  const delta = x - model.frame.r0X;
  return model.magnitudePx * Math.exp(-delta / model.attractionDecayPx) * (
    model.tailRatio + (1 - model.tailRatio) * Math.exp(-delta / model.differenceDecayPx)
  );
};
for (const object of spec.objects) {
  if (object.type === 'svgPath') delete object.fill;
  if (object.id === 'repulsion-callout-leader') object.to = user([290, model.frame.zeroY - repulsionAt(290)]);
  if (object.id === 'net-equilibrium-thick-segment') {
    const points = object.d.match(/[ML]|-?(?:\d+(?:\.\d*)?|\.\d+)/g);
    const retained = [];
    for (let i = 0; i < points.length; i += 3) {
      const x = Number(points[i + 1]);
      if (x >= 297 && x <= 303) retained.push([x, Number(points[i + 2])]);
    }
    object.d = retained.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');
  }
}
const leader = spec.objects.find(item => item.id === 'repulsion-callout-leader');
const emphasis = spec.objects.find(item => item.id === 'net-equilibrium-thick-segment').d.match(/[ML]|-?(?:\d+(?:\.\d*)?|\.\d+)/g);
const start = user([Number(emphasis[1]), Number(emphasis[2])]);
const end = user([Number(emphasis.at(-2)), Number(emphasis.at(-1))]);
for (const assertion of spec.assertions) {
  if (assertion.id === 'repulsion-callout-connects') assertion.to = leader.to;
  if (assertion.id === 'thick-segment-straddles-zero') {
    assertion.from = start;
    assertion.to = end;
    assertion.dx = 6;
    assertion.dy = round(end[1] - start[1]);
  }
}
model.emphasisDomainPx = [297, 303];
fs.mkdirSync(second, { recursive: true });
const repair = {
  schema: 'STEMROBIN-181/figure-author-repair@1',
  contentRepairOrdinal: 1,
  contentRepairLimit: 1,
  firstCandidatePreserved: true,
  firstFailure: [
    binding(nativeReceipt),
    binding(path.join(home, 'native/fig05-c1-native-validate/stdout.txt')),
    binding(path.join(home, 'native/fig05-c1-source-relations/receipt.json')),
    binding(path.join(first, 'source-relations.assertions.json')),
    binding(path.join(first, 'fig-05.spec.json')),
  ],
  changes: [
    'Omit svgPath.fill so the native renderer uses its no-fill default without an invalid semantic role token.',
    'Move only the repulsion leader endpoint onto the retained visible curve at screen x=290, and bind its connects assertion.',
    'Narrow the unchanged net-curve emphasis from screen x=296..304 to x=297..303, retaining both signs and zero while satisfying the existing 1.5px straightness bound.',
  ],
  mathematicsChanged: false,
  forceCurvesChanged: false,
  guidesChanged: false,
  textChanged: false,
  imagesOpenedBeforeRepair: 1,
  paidCalls: 0,
  nativeFirstRenderSkipped: 'Dependent stage stopped at native validation/content assertion failure.',
};
for (const [name, data] of [
  ['fig-05.spec.json', spec],
  ['schematic-construction.json', model],
  ['input-verification.json', read(path.join(first, 'input-verification.json'))],
  ['repair.json', repair],
]) fs.writeFileSync(path.join(second, name), `${JSON.stringify(data, null, 2)}\n`);
console.log(JSON.stringify({ status: 'one-repair-authored', candidate: second, specSha256: hash(path.join(second, 'fig-05.spec.json')) }));

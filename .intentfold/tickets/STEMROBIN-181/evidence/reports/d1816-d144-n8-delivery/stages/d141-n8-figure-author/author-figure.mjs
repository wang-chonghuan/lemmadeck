import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
const home = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d141-n8-figure-author');
const out = path.join(repo, '.tmp/STEMROBIN-181/d1816-d141/figure05/candidate-1');
assert.equal(process.cwd(), repo);
assert(!fs.existsSync(out), 'First candidate must not overwrite existing work');
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const contextPath = path.join(home, 'fig-05.input-context.json');
const freezePath = path.join(home, 'input-freeze.json');
assert.equal(hash(contextPath), 'af49fd69408b6bb2b3e4d480a1766f8f12df42924b3b8c19a91fc28d82fb80d1');
assert.equal(hash(freezePath), 'a7fd3f97f1b89bfccc110a40e45a8b37f34a41a2da5fc982de4be83ed39a2651');
const context = read(contextPath);
const freeze = read(freezePath);
const inventoryPath = path.join(home, 'source-pixel-inventory.json');
assert.equal(read(inventoryPath).inspection.imageOpenOrdinal, 1);
for (const binding of [
  context.sourceImage, context.durableSourceImage,
  context.originalLesson, context.originalExercises,
  ...Object.values(context.nativeContexts),
  ...Object.values(context.textBindings).map(item => item.lesson),
  freeze.authorFreeze, freeze.textReviewCollected,
  ...freeze.drafts.flatMap(item => Object.values(item)),
]) assert.equal(hash(binding.path), binding.sha256, `Changed input: ${binding.path}`);
assert.equal(context.originalTasks, 0);
assert.equal(context.answers, 0);
assert.equal(context.choices, 0);
for (const lang of ['zh', 'en']) {
  assert.equal(context.fullText[lang], context.textBindings[lang].fullModernText);
  assert.deepEqual(read(context.nativeContexts[lang].path).lessons[0].exercises, []);
}

// These are screen-space regularizers only, not a physical force law or calibration.
const model = {
  schema: 'STEMROBIN-181/schematic-curve-construction@1',
  coordinateMeaning: 'Unlabelled screen pixels only; no physical numbers, units or named force law.',
  frame: { width: 640, height: 520, axisX: 55, zeroY: 260, r0X: 300 },
  magnitudePx: 130,
  attractionDecayPx: 110,
  differenceDecayPx: 25,
  tailRatio: 0.15,
  drawDomainPx: [250, 580],
  stepPx: 0.25,
  emphasisDomainPx: [296, 304],
  extension: 'Smooth screen regularization continues toward zero at increasing x; drawn paths end above/below zero, never at an asserted finite cutoff.',
};
const { zeroY, r0X, height } = model.frame;
const round = n => Number(n.toFixed(6));
const values = x => {
  const delta = x - r0X;
  const attraction = model.magnitudePx * Math.exp(-delta / model.attractionDecayPx);
  const repulsion = attraction * (
    model.tailRatio + (1 - model.tailRatio) * Math.exp(-delta / model.differenceDecayPx)
  );
  return { repulsion, attraction, net: repulsion - attraction };
};
const screen = (x, kind) => {
  const v = values(x);
  return [round(x), round(zeroY - (
    kind === 'attraction' ? -v.attraction : v[kind]
  ))];
};
const user = ([x, y]) => [round(x), round(height - y)];
const domain = [];
for (let x = model.drawDomainPx[0]; x <= model.drawDomainPx[1]; x += model.stepPx) domain.push(x);
const pathData = points => points.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');
const curves = Object.fromEntries(['repulsion', 'attraction', 'net'].map(kind => [
  kind, domain.map(x => screen(x, kind)).filter(([, y]) => y >= 30 && y <= 490),
]));
const emphasis = domain.filter(x => x >= 296 && x <= 304).map(x => screen(x, 'net'));
const objects = [];
const assertions = [];
const inventory = [];
const addAssertion = (id, type, rest) => {
  assertions.push({ id, type, ...rest });
  return id;
};
const addPath = (id, points, style) => {
  objects.push({ id, type: 'svgPath', d: pathData(points), fill: 'none', ...style });
};
const addText = (id, at, text, placement = { position: 'CENTER' }, color = 'ink') => {
  objects.push({ id, type: 'text', at: user(at), text, fontSize: 20, labelColor: color, labelPlacement: placement });
};
const addLeader = (kind, from, x) => {
  const to = screen(x, kind);
  const id = `${kind}-callout-leader`;
  objects.push({ id, type: 'segment', from: user(from), to: user(to), stroke: kind === 'net' ? 'accent' : 'ink', strokeWidth: 1.5 });
  return addAssertion(`${kind}-callout-connects`, 'connects', { arrow: id, from: user(from), to: user(to) });
};
objects.push(
  { id: 'force-axis', type: 'arrow', from: user([55, 495]), to: user([55, 25]), stroke: 'ink', strokeWidth: 2 },
  { id: 'distance-axis', type: 'arrow', from: user([20, 260]), to: user([620, 260]), stroke: 'ink', strokeWidth: 2 },
);
addText('force-axis-label', [30, 26], 'F');
addText('distance-axis-label', [619, 282], 'r');
addText('origin-label', [37, 280], '0');
addText('equilibrium-label', [300, 260], 'r\u2080', { position: 'NW', gap: 20, offset: [-3, -13] });
inventory.push({
  id: 'shared-frame',
  description: 'One upward F axis and rightward r axis, with origin 0 and r0 at the net zero; no calibrated ticks, units or extra panels.',
  objects: ['force-axis', 'distance-axis', 'force-axis-label', 'distance-axis-label', 'origin-label', 'equilibrium-label'],
  assertions: [
    addAssertion('frame-orthogonal', 'perpendicular', { a: user([55, 495]), b: user([55, 25]), c: user([20, 260]), d: user([620, 260]) }),
    addAssertion('net-zero-on-axis', 'pointOnLine', { point: user(screen(300, 'net')), a: user([20, 260]), b: user([620, 260]) }),
  ],
});

const guideLeft = [];
const guideRight = [];
for (let i = 0; i <= 200; i++) {
  const t = i / 200;
  guideLeft.push([round(55 + 125 * Math.sin(t * Math.PI / 2)), round(260 - 125 * Math.cos(t * Math.PI / 2))]);
  guideRight.push([round(300 - 120 * Math.cos(t * Math.PI)), round(260 - 125 * Math.sin(t * Math.PI))]);
}
const reflect = points => points.map(([x, y]) => [x, round(2 * zeroY - y)]);
for (const [id, points] of [
  ['guide-left-upper', guideLeft], ['guide-left-lower', reflect(guideLeft)],
  ['guide-right-upper', guideRight], ['guide-right-lower', reflect(guideRight)],
]) addPath(id, points, { stroke: 'muted', strokeWidth: 1.8, dash: 2 });
inventory.push({
  id: 'dashed-guides',
  description: 'Source dashed upper/lower branches join on the zero axis at the left junction, then form opposite lobes closing on the right. No additional physical interpretation is assigned.',
  objects: ['guide-left-upper', 'guide-left-lower', 'guide-right-upper', 'guide-right-lower'],
  assertions: [
    addAssertion('guide-junctions-on-zero', 'collinear', { a: user([55, 260]), b: user([180, 260]), c: user([420, 260]) }),
    addAssertion('guide-opposite-extrema', 'equalDistance', { a: user([300, 260]), b: user([300, 135]), c: user([300, 260]), d: user([300, 385]) }),
  ],
});
for (const kind of ['repulsion', 'attraction', 'net']) {
  addPath(`${kind}-curve`, curves[kind], { stroke: kind === 'net' ? 'accent' : 'ink', strokeWidth: kind === 'net' ? 2.8 : 2.2, dash: 0 });
  const x = kind === 'repulsion' ? 285 : kind === 'net' ? 278 : 330;
  const leaderStart = kind === 'repulsion' ? [390, 80] : kind === 'net' ? [195, 76] : [405, 401];
  addText(`${kind}-callout`, kind === 'repulsion' ? [448, 66] : kind === 'net' ? [145, 62] : [462, 415], kind === 'net' ? 'Net force' : kind === 'repulsion' ? 'Repulsion' : 'Attraction');
  const callout = addLeader(kind, leaderStart, x);
  const witnessX = kind === 'attraction' ? 330 : kind === 'net' ? 295 : 300;
  const witness = user(screen(witnessX, kind));
  const onAxis = user([witnessX, zeroY]);
  const tail = user(curves[kind].at(-1));
  inventory.push({
    id: kind,
    description: kind === 'net'
      ? 'Middle signed solid curve: positive left of r0, zero at r0, negative with a rounded minimum to the right, rising toward zero from below. Dense path assertions in source-relations-check.mjs bind all curve claims to this path.'
      : kind === 'repulsion'
        ? 'Upper positive solid curve descends steeply near the left, then tends toward zero from above; the English callout replaces source Chinese.'
        : 'Lower negative solid curve rises toward zero from below; the English callout replaces source Chinese.',
    objects: [`${kind}-curve`, `${kind}-callout`, `${kind}-callout-leader`],
    assertions: [
      callout,
      addAssertion(`${kind}-signed-witness`, 'displacement', { from: onAxis, to: witness, dx: 0, dy: round(witness[1] - onAxis[1]) }),
      addAssertion(`${kind}-nonzero-tail`, 'displacement', { from: user([tail[0], zeroY]), to: tail, dx: 0, dy: round(tail[1] - (height - zeroY)) }),
    ],
  });
}
addPath('net-equilibrium-thick-segment', emphasis, { stroke: 'accent', strokeWidth: 6, dash: 0 });
inventory.push({
  id: 'equilibrium-emphasis',
  description: 'Short source thick net segment straddles r0 and is nearly straight locally. Component magnitudes are equal at the same r0.',
  objects: ['net-equilibrium-thick-segment', 'net-curve', 'equilibrium-label', 'repulsion-curve', 'attraction-curve'],
  assertions: [
    addAssertion('equilibrium-components-equal', 'equalDistance', {
      a: user([300, 260]), b: user(screen(300, 'repulsion')),
      c: user([300, 260]), d: user(screen(300, 'attraction')),
    }),
    addAssertion('thick-segment-straddles-zero', 'displacement', {
      from: user(emphasis[0]), to: user(emphasis.at(-1)),
      dx: 8, dy: round(user(emphasis.at(-1))[1] - user(emphasis[0])[1]),
    }),
  ],
});
const spec = {
  schema: 'ld-s10y-image/figure-spec@2',
  id: 'fig-05',
  mode: 'deterministic',
  description: 'Inspect the three signed force curves in one schematic F-r frame, their net zero at r0, sign and limiting relationships, source dashed guides and short thick near-equilibrium net segment. Screen coordinates are not calibrated physical numbers; no named physical law is introduced.',
  source: {
    image: { path: context.durableSourceImage.path, sha256: context.durableSourceImage.sha256 },
    authoritativeText: ['zh', 'en'].map(lang => ({ lesson: context.lesson, text: context.fullText[lang] })),
    inventory,
  },
  canvas: { width: 640, height: 520, boundingBox: [0, 520, 640, 0], background: 'paper', keepAspectRatio: true },
  display: { purpose: 'instructional', layout: 'scroll', widths: [640], minTextPx: 16 },
  objects,
  assertions,
};
fs.mkdirSync(out, { recursive: true });
for (const [name, data] of [
  ['fig-05.spec.json', spec],
  ['schematic-construction.json', model],
  ['input-verification.json', {
    status: 'pass', inputFreeze: { path: freezePath, sha256: hash(freezePath) },
    context: { path: contextPath, sha256: hash(contextPath) },
    pixelInventory: { path: inventoryPath, sha256: hash(inventoryPath) },
    protectedBindingsVerified: true, completeLearnerTextVerified: ['zh', 'en'],
    sourcePngHeader: { width: 542, height: 496 },
    imagesOpened: 1, paidCalls: 0, tasks: 0, answers: 0, choices: 0,
  }],
]) fs.writeFileSync(path.join(out, name), `${JSON.stringify(data, null, 2)}\n`);
console.log(JSON.stringify({ status: 'candidate-authored', output: out, specSha256: hash(path.join(out, 'fig-05.spec.json')), nativeAssertions: assertions.length }));

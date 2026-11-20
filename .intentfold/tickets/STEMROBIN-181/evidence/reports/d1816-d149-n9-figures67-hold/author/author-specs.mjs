import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const home = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(repo, '.tmp/STEMROBIN-181/d1816-d149/figures');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const save = (p, v) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, `${JSON.stringify(v, null, 2)}\n`, { flag: 'wx' });
};
const freezePath = path.join(home, 'input-freeze.json');
assert.equal(hash(fs.readFileSync(freezePath)), '3ec39d874b9cdac9538fa748f8d205c17eb279986c8b49605fd5988ef5727773');
const verified = new Map();
function verify(value) {
  if (!value || typeof value !== 'object') return;
  if (value.path && value.sha256) {
    const bytes = fs.readFileSync(value.path);
    assert.equal(hash(bytes), value.sha256, value.path);
    if (value.bytes !== undefined) assert.equal(bytes.length, value.bytes, value.path);
    verified.set(value.path, { path: value.path, bytes: bytes.length, sha256: hash(bytes) });
  }
  for (const entry of Object.values(value)) verify(entry);
}
const freeze = read(freezePath);
verify(freeze);
const inventory = read(path.join(home, 'source-first-inventory.json'));
const contexts = {};
for (const id of ['fig-06', 'fig-07']) {
  contexts[id] = read(path.join(home, `${id}.input-context.json`));
  verify(contexts[id]);
  assert(contexts[id].fullText.zh && contexts[id].fullText.en);
}
assert.deepEqual(contexts['fig-06'].fullText, contexts['fig-07'].fullText);
save(path.join(home, 'input-bindings.verified.json'), {
  status: 'pass', inputFreeze: { path: freezePath, sha256: hash(fs.readFileSync(freezePath)) },
  bindings: [...verified.values()], sourceFirstInventory: { path: path.join(home, 'source-first-inventory.json'), sha256: hash(fs.readFileSync(path.join(home, 'source-first-inventory.json'))) },
  authoritativeText: 'Both complete approved learner texts copied verbatim from each immutable input context. OriginalZh is not an authority for modern limitations.',
});
const text = (id, at, value, fontSize = 20) => ({
  id, type: 'text', at, text: value, fontSize, color: 'ink',
  labelPlacement: { position: 'CENTER', offset: [0, 0] },
});
const polygon = (id, points, filled = false) => ({
  id, type: 'polygon', points, stroke: 'ink', strokeWidth: filled ? 1 : 3,
  fill: filled ? 'ink' : 'paper', fillOpacity: filled ? 1 : 0,
});
const rectangle = (id, x0, y0, x1, y1, filled = false) => polygon(id, [[x0,y0],[x1,y0],[x1,y1],[x0,y1]], filled);
function base(id, height, description) {
  const c = contexts[id];
  return {
    schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic', description,
    source: {
      image: { path: c.durableSourceImage.path, sha256: c.durableSourceImage.sha256 },
      authoritativeText: [
        { lesson: `${c.lesson}:modern-us-neutral`, text: c.fullText.zh },
        { lesson: `${c.lesson}:modern-us-neutral-en`, text: c.fullText.en },
      ], inventory: [],
    },
    canvas: { width: 640, height, boundingBox: [0,height,640,0], background: 'paper' },
    display: { purpose: 'instructional', layout: 'scroll', widths: [640], minTextPx: 16 },
    layout: { minLabelGap: 6 },
    objects: [], assertions: [],
  };
}
function addParticles(spec, points, prefix, container, hollow) {
  const ids = [], assertions = [];
  points.forEach((at, index) => {
    const id = `${prefix}-${String(index + 1).padStart(2, '0')}`;
    ids.push(id);
    spec.objects.push({ id, type: 'point', at, size: 6, strokeWidth: hollow ? 2 : 1, stroke: 'ink', fill: hollow ? 'paper' : 'ink' });
    const a = `${id}-inside`;
    spec.assertions.push({ id: a, type: 'inside', point: id, container, margin: 7 });
    assertions.push(a);
    if (index) {
      const relation = `${prefix}-layout-${index}`;
      spec.assertions.push({
        id: relation, type: 'displacement', from: ids[index - 1], to: id,
        dx: at[0] - points[index - 1][0], dy: at[1] - points[index - 1][1],
      });
      assertions.push(relation);
    }
  });
  return { ids, assertions };
}
const six = base('fig-06', 640, 'Dilute gas: fourteen separated filled particles and the original directed collision/reflection path topology in a single closed vessel. Motion is qualitative, not calibrated.');
const source6 = inventory.figures['fig-06'];
const transform6 = ([x,y]) => [44 + (x - 20) * 1.15, 60 + (500 - y) * 1.15];
six.objects.push(rectangle('gas-vessel', 44,60,596,566));
const sixParticles = addParticles(six, source6.particlesSourcePixels.map(transform6), 'gas-particle', 'gas-vessel', false);
six.assertions.push({ id: 'gas-particle-count', type: 'objectCount', objectType: 'point', count: 14 });
six.source.inventory.push({
  id: 'source-vessel-particles',
  description: 'Original pixels: one closed rectangular vessel, fourteen separated equal-size black filled dots at the listed irregular positions, not two piston panels. Source positions are cleaned illustration coordinates, not calibrated physical quantities.',
  objects: ['gas-vessel', ...sixParticles.ids],
  assertions: ['gas-particle-count', ...sixParticles.assertions], requires: ['pointRelationships'],
});
let arrowCount = 0;
for (const group of source6.trajectoryGroups) {
  const objects = [], assertions = [];
  group.legs.forEach(([fromPixel,toPixel], index) => {
    const id = `${group.id}-leg-${index + 1}`;
    const from = transform6(fromPixel), to = transform6(toPixel);
    const lerp = t => [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t];
    const arrowFrom = lerp(0.37), arrowTo = lerp(0.67);
    six.objects.push({ id: `${id}-trail`, type: 'segment', from, to, stroke: 'muted', strokeWidth: 1.6, dash: 2 });
    six.objects.push({ id: `${id}-direction`, type: 'arrow', from: arrowFrom, to: arrowTo, stroke: 'ink', strokeWidth: 2 });
    const relation = `${id}-connects`, direction = `${id}-directed`, aligned = `${id}-aligned`;
    six.assertions.push({ id: relation, type: 'connects', arrow: `${id}-trail`, from, to });
    six.assertions.push({ id: direction, type: 'connects', arrow: `${id}-direction`, from: arrowFrom, to: arrowTo });
    six.assertions.push({ id: aligned, type: 'collinear', a: from, b: arrowTo, c: to });
    objects.push(`${id}-trail`, `${id}-direction`);
    assertions.push(relation,direction,aligned);
    arrowCount++;
  });
  six.source.inventory.push({ id: `source-${group.id}`, description: group.description, objects, assertions });
}
assert.equal(arrowCount, 26);
six.assertions.push({ id: 'source-direction-count', type: 'objectCount', objectType: 'arrow', count: 26 });
six.source.inventory[1].assertions.push('source-direction-count');
six.objects.push(text('gas-title',[320,612],'Dilute gas',22), text('gas-schematic',[320,24],'Schematic motion paths',18));
six.source.inventory.push({ id: 'modern-additions', description: source6.modernAdditions.join(' '), objects: ['gas-title','gas-schematic'], assertions: [] });

const seven = base('fig-07', 520, 'Gas compression: two source piston vessels, sixteen hollow particles in each, the right piston lower with less gas space and unchanged particle radius. No deformation or quantitative calibration.');
const source7 = inventory.figures['fig-07'];
const panels = [
  { id: 'before', x0: 38, x1: 282, pistonBottom: 331, pistonTop: 361, frame: source7.leftFrameSourcePixels, particles: source7.leftParticlesSourcePixels, title: 'Before' },
  { id: 'after', x0: 358, x1: 602, pistonBottom: 139, pistonTop: 169, frame: source7.rightFrameSourcePixels, particles: source7.rightParticlesSourcePixels, title: 'After' },
];
for (const panel of panels) {
  const { id, x0, x1, pistonBottom, pistonTop, frame } = panel;
  const centerX = (x0+x1)/2;
  seven.objects.push(rectangle(`${id}-gas-space`,x0,72,x1,pistonBottom));
  seven.objects.push(rectangle(`${id}-vessel`,x0,72,x1,428));
  seven.objects.push(rectangle(`${id}-piston`,x0+2,pistonBottom,x1-2,pistonTop,true));
  seven.objects.push(rectangle(`${id}-rod`,centerX-7,pistonTop,centerX+7,461,true));
  const transform = ([x,y]) => [
    x0 + (x-frame[0]) * (x1-x0)/(frame[2]-frame[0]),
    72 + (frame[3]-y) * 356/(frame[3]-frame[1]),
  ];
  const result = addParticles(seven, panel.particles.map(transform), `${id}-particle`, `${id}-gas-space`, true);
  seven.source.inventory.push({
    id: `source-${id}-apparatus-particles`,
    description: `Original ${id === 'before' ? 'left' : 'right'} panel: one vessel, one horizontal ${id === 'before' ? 'high' : 'low'} piston, one rod above it, sixteen hollow same-size particle rings below it at irregular source positions. No particles above the piston.`,
    objects: [`${id}-gas-space`,`${id}-vessel`,`${id}-piston`,`${id}-rod`, ...result.ids],
    assertions: result.assertions, requires: ['pointRelationships'],
  });
  seven.objects.push(text(`${id}-title`,[centerX,492],panel.title,22));
}
seven.assertions.push(
  { id: 'same-sample-count', type: 'objectCount', objectType: 'point', count: 32 },
  { id: 'no-source-arrows', type: 'objectCount', objectType: 'arrow', count: 0 },
  { id: 'before-horizontal-piston', type: 'parallel', a: [38,331], b: [282,331], c: [38,72], d: [282,72] },
  { id: 'after-horizontal-piston', type: 'parallel', a: [358,139], b: [602,139], c: [358,72], d: [602,72] },
);
seven.source.inventory[0].assertions.push('same-sample-count','no-source-arrows','before-horizontal-piston');
seven.source.inventory[1].assertions.push('after-horizontal-piston');
seven.objects.push(text('size-unchanged',[320,42],'Molecular size unchanged',20),text('compression-schematic',[320,16],'Schematic, not to scale',16));
seven.source.inventory.push({
  id: 'modern-additions', description: source7.modernAdditions.join(' '),
  objects: ['before-title','after-title','size-unchanged','compression-schematic'], assertions: [],
});
for (const spec of [six,seven]) {
  const directory = path.join(out,spec.id,'candidate-1');
  save(path.join(directory,'spec.json'), spec);
  save(path.join(home,`${spec.id}.inventory-mapping.json`), {
    figure: spec.id, sourcePixelsInventory: source6 === inventory.figures[spec.id] ? source6 : source7,
    mappings: spec.source.inventory, noIndependentApproval: true,
    conceptualLimits: contexts[spec.id].sourceRequirementsFromTextOnly,
  });
}
console.log(JSON.stringify({ status: 'AUTHORED_DRAFTS', verifiedBindings: verified.size, figures: ['fig-06','fig-07'], imageOpensBeforeDraft: 3, nativeOrPaidCalls: 0 }));

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const out = path.dirname(fileURLToPath(import.meta.url));
assert.equal(out, path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d282-fig26-author'));
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: path.resolve(file), sha256: sha(file) });
const write = (file, value) => fs.writeFileSync(path.join(out, file), JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const inputRoot = '.tmp/STEMROBIN-181/d1816-d276/source-work/adapt/10p';
const lessonId = 'phy10-c1-s3-n17';
const templatePaths = ['modern-us-neutral', 'modern-us-neutral-en'].map(edition =>
  `${inputRoot}/${edition}/lessons/${lessonId}/lesson.template.json`);
const templates = templatePaths.map(file => JSON.parse(fs.readFileSync(file, 'utf8')));
const inventory = JSON.parse(fs.readFileSync(path.join(out, 'inventory.json'), 'utf8'));
const sourceFile = inventory.source.path;
assert.equal(sha(sourceFile), '5fb5fb18b75fa5ee2d2e8fa7da93099932e8d79dd5226c070e93eb27062f01b8');
assert.equal(inventory.source.sha256, sha(sourceFile));
const authoritativeText = templates.flatMap(lesson => {
  assert.equal(lesson.id, lessonId);
  const blocks = lesson.prose.filter(block => block.kind !== 'fig');
  assert.equal(blocks.length, 12);
  assert(blocks.every(block => typeof block.text === 'string' && block.text.trim()));
  return blocks.map(block => ({ lesson: lessonId, text: block.text }));
});
const context = {
  schema: 'd282/bilingual-authoritative-context@1',
  book: '10p', lesson: lessonId,
  templates: templatePaths.map(bind),
  entries: templates.map((lesson, i) => ({
    edition: lesson.edition, title: lesson.title, template: bind(templatePaths[i]),
    nonfig: lesson.prose.filter(block => block.kind !== 'fig').map(block => ({
      kind: block.kind, text: block.text, label: block.label, source_refs: block.source_refs,
    })),
  })),
  authoritativeText,
  authoritativeTextSha256: crypto.createHash('sha256').update(JSON.stringify(authoritativeText)).digest('hex'),
  image: bind(sourceFile),
  sourceNotAltered: true,
};
write('context.json', context);
console.log(JSON.stringify(context, null, 2));

const width = 420;
const height = 660;
// Keep source projection, with extra room for inspecting the lower apparatus.
const screen = ([x, y]) => [50 + 1.16 * x, 30 + (y <= 300 ? 0.9 * y : 270 + 1.3 * (y - 300))];
const user = position => {
  const [x, y] = screen(position);
  return [x, height - y];
};
const canvasUser = ([x, y]) => [x, height - y];
const objects = [];
const assertions = [];
const add = object => { objects.push(object); return object.id; };
const check = assertion => assertions.push(assertion);
const segment = (id, from, to, stroke = 'ink', strokeWidth = 2.5) =>
  add({ id, type: 'segment', from: user(from), to: user(to), stroke, strokeWidth });
const pathObject = (id, commands, style = {}) => {
  const d = commands.map(([command, ...positions]) => {
    if (command === 'Z') return 'Z';
    return command + positions.map(position => screen(position).map(number => Number(number.toFixed(4))).join(' ')).join(' ');
  }).join(' ');
  return add({ id, type: 'svgPath', d, stroke: 'ink', strokeWidth: 2.5, ...style });
};
const ellipse = (id, centre, rx, ry, style = {}) => {
  const [x, y] = centre;
  const k = 0.5522847498;
  return pathObject(id, [
    ['M', [x + rx, y]],
    ['C', [x + rx, y + k * ry], [x + k * rx, y + ry], [x, y + ry]],
    ['C', [x - k * rx, y + ry], [x - rx, y + k * ry], [x - rx, y]],
    ['C', [x - rx, y - k * ry], [x - k * rx, y - ry], [x, y - ry]],
    ['C', [x + k * rx, y - ry], [x + rx, y - k * ry], [x + rx, y]], ['Z'],
  ], style);
};
const polygon = (id, positions, style = {}) => add({
  id, type: 'polygon', points: positions.map(user),
  stroke: 'ink', strokeWidth: 2.5, fill: 'paper', fillOpacity: 1, ...style,
});
const text = (id, at, value) => add({
  id, type: 'text', at: canvasUser(at), text: value, fontSize: 21,
  fontWeight: 600, labelColor: 'ink', labelPlacement: { position: 'CENTER' },
});
const connects = (id, edge, from, to) => check({
  id, type: 'connects', arrow: edge, from: user(from), to: user(to),
});

// JSXGraph segments keep the exact rectangular projection and shaft constraints.
const A = [87, 352], B = [166, 330], C = [179, 402], D = [100, 424];
const frameCentre = [133, 377];
const ringLeft = [37, 401], ringRight = [72, 392.25];
const shaftLeft = [27, 403.5], shaftRight = [133, 377];
polygon('frame-boundary', [A, B, C, D], { fillOpacity: 0, stroke: 'muted', strokeWidth: 1.8 });
check({ id: 'frame-opposite-long-edges', type: 'parallel', a: user(A), b: user(B), c: user(D), d: user(C) });
check({ id: 'frame-opposite-short-edges', type: 'parallel', a: user(A), b: user(D), c: user(B), d: user(C) });
segment('axle-visible', shaftLeft, [106, 383.75], 'muted', 5);
connects('axle-visible-endpoints', 'axle-visible', shaftLeft, [106, 383.75]);
check({ id: 'ring-centres-on-axle', type: 'collinear', a: user(ringLeft), b: user(ringRight), c: user(shaftRight) });
check({ id: 'frame-centre-on-axle', type: 'pointOnLine', point: user(frameCentre), a: user(shaftLeft), b: user(shaftRight) });
polygon('pole-gap-envelope', [[79, 324], [185, 310], [200, 431], [92, 447]], { strokeWidth: 0.1, opacity: 0, fillOpacity: 0 });
check({ id: 'frame-in-pole-gap', type: 'inside', point: user(frameCentre), container: 'pole-gap-envelope' });
polygon('right-pole-label-face', [[190, 360], [215, 366], [204, 432], [155, 442], [170, 410]], { fillOpacity: 0, strokeWidth: 0.1, opacity: 0 });

// Smooth apparatus silhouettes are fresh vector surfaces, not a scan artwork layer.
pathObject('magnet-depth', [
  ['M', [143, 18]], ['L', [185, 14]],
  ['C', [235, 15], [274, 73], [274, 135]],
  ['L', [258, 448]], ['L', [207, 465]], ['L', [226, 135]],
  ['C', [228, 73], [188, 18], [143, 18]], ['Z'],
], { fill: 'paper', fillOpacity: 1 });
pathObject('magnet-front', [
  ['M', [77, 342]], ['L', [80, 98]],
  ['C', [82, 41], [106, 16], [143, 18]],
  ['C', [188, 18], [228, 73], [226, 135]],
  ['L', [207, 465]], ['L', [146, 440]], ['L', [170, 410]],
  ['L', [190, 360]], ['L', [204, 137]],
  ['C', [210, 78], [167, 38], [141, 44]],
  ['C', [116, 40], [107, 65], [107, 100]],
  ['L', [102, 324]], ['Z'],
], { fill: 'accentSoft', fillOpacity: 0.22 });
pathObject('far-pole-top', [
  ['M', [77, 307]], ['L', [137, 296]], ['L', [162, 313]],
  ['L', [103, 329]], ['Z'],
], { fill: 'accentSoft', fillOpacity: 0.38 });
pathObject('far-pole-face', [
  ['M', [70, 340]], ['L', [103, 329]], ['L', [105, 342]],
  ['L', [85, 351]], ['L', [90, 369]], ['L', [71, 375]], ['Z'],
], { fill: 'muted', fillOpacity: 0.35 });

// Only the exposed runs are authored; no hidden ring-to-coil wiring is guessed.
for (let index = 1; index <= 3; index++) {
  const inset = (index - 1) * 3;
  const p = [A[0] + inset, A[1] + inset];
  const q = [B[0] - inset, B[1] + inset];
  const r = [C[0] - inset, C[1] - inset];
  const s = [D[0] + inset, D[1] - inset];
  pathObject(`winding-run-${index}`, [
    ['M', p], ['L', q], ['L', r], ['L', s],
    ['L', [94 + inset, 402 - inset]], ['L', [99 + inset, 381 + inset]],
    ['L', [94 + inset, 373 + inset]], ['L', p],
  ], { stroke: 'accent', strokeWidth: 2.4 });
  check({
    id: `winding-${index}`, type: 'displacement', from: user(p), to: user(q),
    dx: user(q)[0] - user(p)[0], dy: user(q)[1] - user(p)[1],
  });
}
pathObject('axle-collar', [
  ['M', [84, 390]], ['L', [98, 387]], ['L', [104, 410]],
  ['L', [90, 415]], ['Z'],
], { fill: 'paper', fillOpacity: 1 });
ellipse('axle-end-face', shaftLeft, 4, 8, { fill: 'muted', fillOpacity: 0.15 });
for (const [side, centre] of [['left', ringLeft], ['right', ringRight]]) {
  const [x, y] = centre;
  pathObject(`ring-${side}-body`, [
    ['M', [x, y - 12]], ['L', [x + 12, y - 15]],
    ['C', [x + 20, y - 13], [x + 22, y + 8], [x + 13, y + 10]],
    ['L', [x, y + 13]], ['Z'],
  ], { fill: 'paper', fillOpacity: 0 });
  ellipse(`ring-${side}-end`, centre, 9, 13, { fill: 'paper', fillOpacity: 0 });
}
const leftTouch = [49, 411], rightTouch = [84, 402.25];
const leftRoot = [51, 420], rightRoot = [87, 412];
segment('contact-left', [46, 412], leftTouch, 'ink', 4);
segment('contact-right', [81, 403.25], rightTouch, 'ink', 4);
connects('left-contact-touch', 'contact-left', [46, 412], leftTouch);
connects('right-contact-touch', 'contact-right', [81, 403.25], rightTouch);
segment('lead-left-attachment', leftTouch, leftRoot, 'ink', 2.5);
segment('lead-right-attachment', rightTouch, rightRoot, 'ink', 2.5);
connects('left-lead-visible-attachment', 'lead-left-attachment', leftTouch, leftRoot);
connects('right-lead-visible-attachment', 'lead-right-attachment', rightTouch, rightRoot);
pathObject('lead-left-curve', [
  ['M', leftRoot], ['C', [52, 437], [57, 448], [65, 454]],
  ['C', [82, 459], [69, 466], [80, 474]],
  ['C', [91, 479], [78, 485], [91, 492]], ['L', [100, 504]],
], { strokeWidth: 2.5 });
pathObject('lead-right-curve', [
  ['M', rightRoot], ['C', [91, 430], [98, 440], [109, 446]],
  ['C', [127, 451], [108, 459], [124, 467]],
  ['C', [141, 472], [124, 480], [138, 495]],
], { strokeWidth: 2.5 });
check({
  id: 'lead-end-separation', type: 'displacement', from: user([100, 504]), to: user([138, 495]),
  dx: 44.08, dy: 11.7,
});
check({ id: 'source-free-leads', type: 'objectCount', objectType: 'image', count: 0 });

pathObject('rotation-curve', [
  ['M', [24, 423]], ['C', [12, 420], [8, 408], [12, 398]],
], { stroke: 'accent', strokeWidth: 2.8 });
segment('rotation-tangent-base', [12, 398], [13, 395], 'accent', 2.8);
add({ id: 'rotation-tip', type: 'arrow', from: user([13, 395]), to: user([16, 384]), stroke: 'accent', strokeWidth: 2.8 });
connects('rotation-tip-endpoints', 'rotation-tip', [13, 395], [16, 384]);
check({
  id: 'rotation-tip-direction', type: 'displacement', from: user([13, 395]), to: user([16, 384]),
  dx: 3.48, dy: 14.3,
});
text('north-pole-label', screen([183, 404]), 'N');
check({ id: 'pole-label-in-face', type: 'inside', point: 'north-pole-label', container: 'right-pole-label-face' });

for (const callout of [
  { id: 'magnet', at: [216, 20], label: 'Magnet', from: [216, 39], to: [219, 66] },
  { id: 'coil', at: [51, 330], label: 'Coil', from: [78, 330], to: screen([104, 351]) },
  { id: 'axle', at: [43, 377], label: 'Axle', from: [68, 377], to: screen([57, 396]) },
  { id: 'contacts', at: [61, 492], label: 'Contacts', from: [101, 477], to: screen([78, 407]) },
  { id: 'leads', at: [205, 612], label: 'Leads', from: [191, 594], to: screen([113, 459]) },
]) {
  text(`${callout.id}-callout`, callout.at, callout.label);
  add({
    id: `${callout.id}-leader`, type: 'segment',
    from: canvasUser(callout.from), to: canvasUser(callout.to), stroke: 'muted', strokeWidth: 1.2,
  });
  check({
    id: `${callout.id}-leader-endpoints`, type: 'connects', arrow: `${callout.id}-leader`,
    from: canvasUser(callout.from), to: canvasUser(callout.to),
  });
}

const spec = {
  schema: 'ld-s10y-image/figure-spec@2',
  id: 'fig-26', mode: 'deterministic',
  description: 'A modern instructional oblique depiction of the source horseshoe magnet and multi-turn rotating frame in its lower pole gap, with a leftward axle, source-shaped ring/contact zones, local rotation arrow and two hanging free leads. Only the supported N pole glyph is shown; no contact subtype, hidden netlist, meter or external circuit is invented. This is a source-bound apparatus projection, not a measured scale drawing.',
  source: {
    image: bind(sourceFile), authoritativeText,
    inventory: inventory.groups.map(({ id, description, objects, assertions }) => ({ id, description, objects, assertions })),
  },
  canvas: { width, height, boundingBox: [0, height, width, 0], background: 'paper', keepAspectRatio: true },
  display: { layout: 'inline', purpose: 'instructional', maxWidthPx: 420, widths: [420, 331], minTextPx: 16 },
  objects, assertions,
  layout: { minLabelGap: 3 },
};
write('fig-26.spec.json', spec);
const contracts = [
  '.agents/skills/ld-s10y-image/SKILL.md',
  '.agents/skills/ld-s10y-image/references/routing.md',
  '.agents/skills/ld-s10y-image/references/figure-spec.md',
  '.agents/skills/ld-s10y-image/references/quality-gate.md',
  '.claude/skills/ld-s10y-lesson/references/production-resume.md',
  '.agents/skills/ld-s10y-image/assets/figure-spec.schema.json',
  '.agents/skills/ld-s10y-image/scripts/validate_spec.py',
  '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
  '.agents/skills/ld-s10y-image/scripts/materialize_arrowheads.mjs',
  '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d280-fig2425-author/run-native.mjs',
  '.intentfold/tickets/STEMROBIN-181/tmp/d1816-recovery/preview-d118-n19-existing-svg.mjs',
  '.intentfold/tickets/STEMROBIN-181/tmp/d1816-recovery/recover-d261-n44-preview.mjs',
  '.intentfold/tickets/STEMROBIN-181/ticket.json',
];
write('inputs.json', {
  schema: 'd282/input-bindings@1', book: '10p', source: bind(sourceFile),
  templates: templatePaths.map(bind), contracts: contracts.map(bind),
  authorityEntries: authoritativeText.length, network: false, paidCalls: 0,
  sourceImageInspectionCount: 1, modifiedOutsideOwnedDirectory: false,
});
write('routing.json', {
  schema: 'd282/renderer-routing@1', figure: 'fig-26',
  decision: 'deterministic', renderer: 'existing ld-s10y-image render_spec.mjs / JSXGraph',
  reason: 'This manufactured apparatus is recognizable using smooth solid perspective magnet surfaces, deterministic straight frame edges, curved winding runs and projected ring/contact silhouettes. Exact projection, shaft alignment, poles, local rotation and visible attachment fragments must remain deterministic.',
  originalReopenedBeforeInventory: true, inventory: bind(path.join(out, 'inventory.json')),
  semanticIdentityGate: 'Must inspect first preview. If magnet, multi-turn frame or contacts cannot be faithful, hold with hybrid route. No generation authorized.',
  hybridPaidArtwork: 'not authorized', paidCalls: 0, rawScanAsModern: false,
  leftPoleGlyph: 'unresolved: no S inferred',
  contactNetlist: 'unresolved: no slip-ring/commutator classification or hidden netlist',
  schematicAdditions: 'No meter, load, external return, B vector, current arrows or fabricated electrical connections.',
  display: spec.display,
  fullAuthoritativeTextBound: authoritativeText.length === 24,
  candidateOnly: true, reviewAt1Created: false, promotionAuthorized: false,
});
console.log(JSON.stringify({
  inventory: bind(path.join(out, 'inventory.json')), context: bind(path.join(out, 'context.json')),
  spec: bind(path.join(out, 'fig-26.spec.json')), routing: bind(path.join(out, 'routing.json')),
  objects: objects.length, assertions: assertions.length, authoritativeEntries: authoritativeText.length,
}));

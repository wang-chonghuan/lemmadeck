import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const out = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d593-n25-figures-first';
const textRoot = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d591-n25-bilingual-author';
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const texts = ['zh', 'en'].map(locale => ({
  lesson: `phy10-c1-s3-n25:${locale}`,
  text: JSON.parse(fs.readFileSync(`${textRoot}/${locale}/lesson.template.json`)).prose
    .filter(block => block.kind !== 'fig').map(block => block.text).join('\n\n'),
}));
fs.mkdirSync(out, { recursive: true });
const sources = {
  'fig-40': 'ssot-resources/soviet10year-textbooks/artifacts/10p/pages/0067/figures/fig-40.png',
  'fig-41': 'ssot-resources/soviet10year-textbooks/artifacts/10p/pages/0067/figures/fig-41.png',
  'fig-42': '.tmp/STEMROBIN-181/d1816-d208/source-work/10p/pages/0069/figures/fig-42.png',
};
const notes = {
  'fig-40': 'Viewed original PNG: four external source terminals, six switch contact circles, two open blades coupled by a double crossbar, one crossed-circle lamp, one four-lobed coil with a separate core bar, and the outer return conductor. Labels are +, -, and ~. Modern regularization: orthogonal conductors and dashed mechanical coupling distinguish coupling from an electrical short; blades remain open between the throws.',
  'fig-41': 'Viewed original PNG: one rectangular wire loop interrupted at two right-hand AC terminals, a four-lobed coil on the left, no core bar or lamp, and one ~ symbol between the terminals. Modern regularization changes only spacing and stroke consistency.',
  'fig-42': 'Viewed original PNG: shared upward value and rightward time axes, no ticks or grid, one smaller-amplitude current curve initially at a positive crest, a larger-amplitude voltage curve initially at zero and decreasing, and two label leaders. Voltage ends descending below zero, current ends after its next crest. Source labels u_L/i_L, u_L(t)/i_L(t), t and a round origin glyph. Modern regularization uses ideal harmonic curves; labels u,i,u(t),i(t) consistently denote this coil, without a redundant L subscript. Origin O is editorial modern notation, not an adjudication of the held O/0 source glyph. Neither axis is a measured shared-unit scale.',
};
const base = id => ({
  schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic',
  description: notes[id],
  source: { image: { path: sources[id], sha256: sha(sources[id]) }, authoritativeText: texts, inventory: [] },
  canvas: { width: 640, height: 360, boundingBox: [0, 360, 640, 0], background: 'transparent' },
  display: { purpose: 'instructional', layout: 'inline', maxWidthPx: 640, widths: [331, 342, 640], minTextPx: 16 },
  objects: [], assertions: [],
});
const segment = (spec, id, from, to, extra = {}) => {
  spec.objects.push({ id, type: 'segment', from, to, stroke: 'ink', strokeWidth: 2.5, ...extra });
  spec.assertions.push({ id: `${id}-endpoints`, type: 'connects', arrow: id, from, to });
};
const wire = (spec, id, points) => {
  for (let index = 1; index < points.length; index++) segment(spec, `${id}-${index}`, points[index - 1], points[index]);
};
const circle = (spec, id, center, radius) => spec.objects.push({
  id, type: 'circle', center, radius, stroke: 'ink', strokeWidth: 2.5, fill: 'paper',
});
const label = (spec, id, at, text, fontSize = 34) => spec.objects.push({
  id, type: 'text', at, text, fontSize, stroke: 'ink', labelPlacement: { position: 'CENTER' },
});
const count = (spec, id, objectType, value) => spec.assertions.push({ id, type: 'objectCount', objectType, count: value });
const inventory = (spec, id, description, ids, assertionIds) => spec.source.inventory.push({ id, description, objects: ids, assertions: assertionIds });

const circuit = base('fig-40');
wire(circuit, 'dc-positive-wire', [[35, 305], [292, 305], [292, 235]]);
wire(circuit, 'dc-negative-wire', [[35, 235], [206, 235]]);
wire(circuit, 'ac-upper-wire', [[590, 305], [370, 305], [370, 280], [246, 280], [246, 235]]);
wire(circuit, 'ac-lower-wire', [[590, 235], [326, 235]]);
wire(circuit, 'return-wire', [[228, 175], [22, 175], [22, 55], [563, 55]]);
wire(circuit, 'lamp-left-wire', [[312, 175], [427, 175]]);
wire(circuit, 'lamp-right-wire', [[473, 175], [563, 175]]);
segment(circuit, 'left-switch-blade', [228, 175], [228, 250], { strokeWidth: 4 });
segment(circuit, 'right-switch-blade', [312, 175], [312, 250], { strokeWidth: 4 });
segment(circuit, 'mechanical-coupling-upper', [228, 208], [312, 208], { dash: 2, stroke: 'muted', strokeWidth: 2 });
segment(circuit, 'mechanical-coupling-lower', [228, 202], [312, 202], { dash: 2, stroke: 'muted', strokeWidth: 2 });
circuit.objects.push({ id: 'coil', type: 'svgPath',
  d: 'M 563 185 C 600 185 600 215 563 215 C 600 215 600 245 563 245 C 600 245 600 275 563 275 C 600 275 600 305 563 305',
  stroke: 'ink', strokeWidth: 3, fill: 'none' });
segment(circuit, 'coil-core', [611, 55], [611, 175], { strokeWidth: 5 });
for (const [index, at] of [[35, 305], [35, 235], [590, 305], [590, 235]].entries()) circle(circuit, `external-terminal-${index}`, at, 5);
for (const [index, at] of [[206, 235], [246, 235], [292, 235], [326, 235], [228, 175], [312, 175]].entries()) circle(circuit, `switch-contact-${index}`, at, 5);
circle(circuit, 'lamp-ring', [450, 175], 23);
segment(circuit, 'lamp-cross-a', [434, 159], [466, 191]);
segment(circuit, 'lamp-cross-b', [434, 191], [466, 159]);
label(circuit, 'dc-positive-label', [35, 336], '+');
label(circuit, 'dc-negative-label', [35, 210], '-');
label(circuit, 'ac-label', [590, 270], '~');
count(circuit, 'eleven-circles', 'circle', 11);
count(circuit, 'one-coil', 'svgPath', 1);
count(circuit, 'three-source-labels', 'text', 3);
inventory(circuit, 'source-complete-circuit', notes['fig-40'],
  circuit.objects.map(object => object.id), circuit.assertions.map(assertion => assertion.id));

const coil = base('fig-41');
coil.canvas = { width: 320, height: 360, boundingBox: [0, 360, 320, 0], background: 'transparent' };
coil.display = { purpose: 'instructional', layout: 'inline', maxWidthPx: 320, widths: [280, 320], minTextPx: 16 };
wire(coil, 'upper-wire', [[75, 285], [75, 325], [260, 325], [260, 235]]);
wire(coil, 'lower-wire', [[75, 105], [75, 35], [260, 35], [260, 125]]);
coil.objects.push({ id: 'coil', type: 'svgPath',
  d: 'M 75 75 C 25 75 25 120 75 120 C 25 120 25 165 75 165 C 25 165 25 210 75 210 C 25 210 25 255 75 255',
  stroke: 'ink', strokeWidth: 3, fill: 'none' });
circle(coil, 'upper-terminal', [260, 235], 5);
circle(coil, 'lower-terminal', [260, 125], 5);
label(coil, 'ac-label', [260, 180], '~');
count(coil, 'two-terminals', 'circle', 2);
count(coil, 'one-coil', 'svgPath', 1);
count(coil, 'one-source-label', 'text', 1);
inventory(coil, 'source-complete-ideal-coil', notes['fig-41'],
  coil.objects.map(object => object.id), coil.assertions.map(assertion => assertion.id));

const graph = base('fig-42');
const current = t => 175 + 60 * Math.cos(2 * Math.PI * t);
const voltage = t => 175 - 115 * Math.sin(2 * Math.PI * t);
const curve = (id, end, fn) => {
  const points = Array.from({ length: 361 }, (_, index) => {
    const t = end * index / 360;
    return [90 + 440 * t, 360 - fn(t)];
  });
  graph.objects.push({ id, type: 'svgPath', d: points.map(([x, y], index) =>
    `${index ? 'L' : 'M'} ${x.toFixed(5)} ${y.toFixed(5)}`).join(' '),
    stroke: 'ink', strokeWidth: 3, fill: 'none' });
};
graph.objects.push({ id: 'time-axis', type: 'arrow', from: [64, 175], to: [616, 175], stroke: 'ink', strokeWidth: 2.5 });
graph.objects.push({ id: 'value-axis', type: 'arrow', from: [90, 24], to: [90, 332], stroke: 'ink', strokeWidth: 2.5 });
curve('current-curve', 1.14, current);
curve('voltage-curve', 1.08, voltage);
graph.objects.push({ id: 'current-leader', type: 'arrow', from: [195, 263], to: [138.4, current(0.11)], stroke: 'ink', strokeWidth: 2 });
graph.objects.push({ id: 'voltage-leader', type: 'arrow', from: [453, 320], to: [428.8, voltage(0.77)], stroke: 'ink', strokeWidth: 2 });
label(graph, 'axis-value-label', [57, 324], 'u, i', 32);
label(graph, 'current-label', [225, 274], 'i(t)', 34);
label(graph, 'voltage-label', [480, 332], 'u(t)', 34);
label(graph, 'time-label', [607, 144], 't', 34);
label(graph, 'origin-label', [62, 147], 'O', 34);
graph.assertions.push({ id: 'perpendicular-axes', type: 'perpendicular', a: [64, 175], b: [616, 175], c: [90, 24], d: [90, 332] });
for (const id of ['time-axis', 'value-axis', 'current-leader', 'voltage-leader']) {
  const object = graph.objects.find(item => item.id === id);
  graph.assertions.push({ id: `${id}-connects`, type: 'connects', arrow: id, from: object.from, to: object.to });
}
count(graph, 'two-source-curves', 'svgPath', 2);
count(graph, 'two-axes-two-leaders', 'arrow', 4);
count(graph, 'five-label-groups', 'text', 5);
inventory(graph, 'source-axes-curves-and-leaders', notes['fig-42'],
  graph.objects.map(object => object.id), graph.assertions.map(assertion => assertion.id));
const quarterChecks = [0, 0.25, 0.5, 0.75, 1].map(t => ({
  t, current: (current(t) - 175) / 60, voltage: (voltage(t) - 175) / 115,
}));
assert(quarterChecks.every(({ t, current: i, voltage: u }) =>
  Math.abs(i - Math.cos(2 * Math.PI * t)) < 1e-12 && Math.abs(u + Math.sin(2 * Math.PI * t)) < 1e-12));
fs.writeFileSync(`${out}/source-observations.json`, JSON.stringify({
  imageOpens: 3, sourceObservations: Object.entries(notes).map(([id, observation]) => ({ id, image: sources[id], sha256: sha(sources[id]), observation })),
  regularizationDisclosed: true, sourceGlyphIdentityAdjudicated: false,
  normalizedQuarterCycleChecks: quarterChecks,
}, null, 2) + '\n', { flag: 'wx' });
for (const spec of [circuit, coil, graph]) {
  const specFile = `${out}/${spec.id}.spec.json`;
  fs.writeFileSync(specFile, JSON.stringify(spec, null, 2) + '\n', { flag: 'wx' });
  for (const [stage, executable, args] of [
    ['validate', 'python3', ['.agents/skills/ld-s10y-image/scripts/validate_spec.py', specFile, '--stage', 'draft']],
    ['render', 'node', ['.agents/skills/ld-s10y-image/scripts/render_spec.mjs', '--spec', specFile, '--svg', `${out}/${spec.id}.svg`, '--report', `${out}/${spec.id}.render.json`]],
  ]) {
    const result = spawnSync(executable, args, { cwd: repo, encoding: 'utf8' });
    fs.writeFileSync(`${out}/${spec.id}.${stage}.receipt.json`, JSON.stringify({ executable, args, exitCode: result.status, stdout: result.stdout, stderr: result.stderr }, null, 2) + '\n', { flag: 'wx' });
    console.log(result.stdout.trim() || result.stderr.trim());
    if (result.status !== 0) {
      process.exitCode = result.status || 1;
      break;
    }
  }
}

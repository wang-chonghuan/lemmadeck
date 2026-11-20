import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const root = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), root);
const own = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d054-n14-author');
const figdir = path.join(root, '.tmp/STEMROBIN-181/d1816-d054/n14-figure-author');
fs.mkdirSync(figdir, { recursive: true });
const read = file => JSON.parse(fs.readFileSync(file));
const save = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
if (process.argv.includes('--contract-repair')) {
  for (const id of ['fig-18','fig-19']) {
    const spec = path.join(figdir, `${id}.spec.json`);
    const before = path.join(own, `${id}.first-draft.json`);
    assert(!fs.existsSync(before));
    fs.copyFileSync(spec, before, fs.constants.COPYFILE_EXCL);
  }
}
const context = read(path.join(own, 'bilingual-context.json'));
const inventory = read(path.join(own, 'source-inventory.json'));
assert.equal(context.locales.length, 2);
const height = 640;
const screen = ([x, y]) => [x, height - y];
const pathFor = segments => segments.map((s, i) => (
  (i ? '' : `M ${screen(s[0]).join(' ')} `) +
  `C ${s.slice(1).map(p => screen(p).join(' ')).join(' ')}`
)).join(' ');
const bezier = (s, t) => [0, 1].map(axis =>
  (1-t)**3*s[0][axis] + 3*(1-t)**2*t*s[1][axis] + 3*(1-t)*t*t*s[2][axis] + t**3*s[3][axis]);
const text = (id, at, value, extra = {}) => ({
  id, type: 'text', at, text: value, fontSize: 34,
  labelPlacement: { position: 'CENTER', gap: 0 }, ...extra,
});
const point = (id, at) => ({ id, type: 'point', at, visible: false });
// Model regularization from the retained primary equation, not recovered data.
// Hermite controls include the exact maximum as a knot and its zero derivative.
function response(damping, ratio) {
  return 1 / Math.sqrt((1-ratio*ratio)**2 + (2*damping*ratio)**2);
}
function slope(damping, ratio) {
  const denominator = (1-ratio*ratio)**2 + (2*damping*ratio)**2;
  return -2*ratio*(ratio*ratio-1+2*damping*damping) / denominator**1.5;
}
function modelCurve(id, damping, role, leader) {
  const endRatio = 470/280;
  const peakRatio = Math.sqrt(1-2*damping*damping);
  const knots = [...new Set([0, peakRatio, endRatio, 1.14,
    ...Array.from({length: 140}, (_, i) => endRatio*i/140)])].sort((a,b) => a-b);
  const position = ratio => [90+280*ratio, 100+90*response(damping, ratio)];
  const segments = knots.slice(1).map((r, i) => {
    const l = knots[i], step = r-l, first = position(l), last = position(r);
    return [first, [first[0]+280*step/3, first[1]+90*slope(damping,l)*step/3],
      [last[0]-280*step/3, last[1]-90*slope(damping,r)*step/3], last];
  });
  return { id, dampingRegularization: damping, formulaBasis: 'UVA R1 retained linear sinusoidal-drive amplitude equation; no physical numbers supplied by source',
    segments, peak: position(peakRatio), role,
    ...(leader ? {leader: {...leader, ratio: 1.14, target: position(1.14)}} : {}) };
}
const definitions = {
  'fig-18': [modelCurve('curve-1', 0.10, 'ink')],
  'fig-19': [
    modelCurve('curve-1', 0.10, 'ink', {from: [460,430], label: [490,445]}),
    modelCurve('curve-2', 0.18, 'accent', {from: [476,339], label: [510,355]}),
    modelCurve('curve-3', 0.36, 'muted', {from: [482,245], label: [515,263]}),
  ],
};
const mappings = [];
for (const [id, curves] of Object.entries(definitions)) {
  const source = inventory.images.find(x => x.id === id);
  assert.equal(hash(path.join(root, source.path)), source.sha256);
  const objects = [
    point('origin', [90,100]), point('axis-x-end', [594,100]), point('axis-y-end', [90,575]),
    point('natural-frequency-base', [370,100]), point('natural-frequency-top', [370,535]),
    { id: 'frequency-axis', type: 'arrow', from: 'origin', to: 'axis-x-end', strokeWidth: 3, stroke: 'ink' },
    { id: 'amplitude-axis', type: 'arrow', from: 'origin', to: 'axis-y-end', strokeWidth: 3, stroke: 'ink' },
    { id: 'natural-frequency-guide', type: 'segment', from: 'natural-frequency-base', to: 'natural-frequency-top', dash: 2, strokeWidth: 2.4, stroke: 'muted' },
    text('origin-value', [65,73], '0'),
    text('amplitude-label', [195,610], 'Amplitude'),
    text('angular-frequency-label', [603,68], 'ω'),
    text('natural-frequency-label', [370,67], 'ω₀'),
    text('frequency-label', [342,22], 'Driving frequency'),
  ];
  const assertions = [
    { id: 'frequency-direction', type: 'connects', arrow: 'frequency-axis', from: 'origin', to: 'axis-x-end' },
    { id: 'amplitude-direction', type: 'connects', arrow: 'amplitude-axis', from: 'origin', to: 'axis-y-end' },
    { id: 'axes-perpendicular', type: 'perpendicular', a: 'origin', b: 'axis-x-end', c: 'origin', d: 'axis-y-end' },
    { id: 'guide-vertical', type: 'parallel', a: 'natural-frequency-base', b: 'natural-frequency-top', c: 'origin', d: 'axis-y-end' },
    { id: 'guide-on-frequency-axis', type: 'collinear', a: 'origin', b: 'natural-frequency-base', c: 'axis-x-end' },
    { id: 'solid-curve-count', type: 'objectCount', objectType: 'svgPath', count: curves.length },
  ];
  const groups = [
    { id: 'shared-axes-and-origin', description: 'Source axes share an origin; positive amplitude is up, increasing driving angular frequency is right. English label text is a modern clarification.',
      objects: ['frequency-axis','amplitude-axis','origin-value','amplitude-label','angular-frequency-label','frequency-label'],
      assertions: ['frequency-direction','amplitude-direction','axes-perpendicular'] },
    { id: 'natural-frequency-reference', description: 'Retained dashed vertical omega_0 guide. The source approximately aligns it with the resonance peak; current text distinguishes the damped displacement peak from undamped natural frequency.',
      objects: ['natural-frequency-guide','natural-frequency-label'],
      assertions: ['guide-vertical','guide-on-frequency-axis'] },
  ];
  for (const [index, curve] of curves.entries()) {
    const start = curve.segments[0][0], end = curve.segments.at(-1)[3];
    objects.push(point(`${curve.id}-start`, start), point(`${curve.id}-peak`, curve.peak), point(`${curve.id}-end`, end));
    objects.push({ id: curve.id, type: 'svgPath', d: pathFor(curve.segments), stroke: curve.role, strokeWidth: 4.5 });
    assertions.push(
      { id: `${curve.id}-rise`, type: 'displacement', from: `${curve.id}-start`, to: `${curve.id}-peak`, dx: curve.peak[0]-start[0], dy: curve.peak[1]-start[1] },
      { id: `${curve.id}-fall`, type: 'displacement', from: `${curve.id}-peak`, to: `${curve.id}-end`, dx: end[0]-curve.peak[0], dy: end[1]-curve.peak[1] },
    );
    const mapped = [curve.id];
    const mappedAssertions = [`${curve.id}-rise`,`${curve.id}-fall`,'solid-curve-count'];
    if (curve.leader) {
      const at = curve.leader.target;
      objects.push(point(`${curve.id}-leader-source`, curve.leader.from), point(`${curve.id}-leader-target`, at));
      objects.push({ id: `${curve.id}-leader`, type: 'arrow', from: `${curve.id}-leader-source`, to: `${curve.id}-leader-target`, stroke: curve.role, strokeWidth: 2.5 });
      objects.push(text(`${curve.id}-number`, curve.leader.label, String(index+1), { labelColor: curve.role }));
      assertions.push({ id: `${curve.id}-leader-connects`, type: 'connects', arrow: `${curve.id}-leader`, from: `${curve.id}-leader-source`, to: `${curve.id}-leader-target` });
      mapped.push(`${curve.id}-leader`, `${curve.id}-number`);
      mappedAssertions.push(`${curve.id}-leader-connects`);
    }
    groups.push({
      id: `${curve.id}-source-shape`,
      description: `Source solid amplitude response ${index+1}: positive low-frequency intercept, one peak, positive finite right endpoint. ${id === 'fig-19' ? ['Highest/sharpest, least friction.','Intermediate height/width and friction.','Lowest/broadest, greatest friction.'][index] : 'No numeric chart readings.'} Hidden anchors and path coordinates are modern drawing geometry, not source measurements.`,
      objects: mapped, assertions: mappedAssertions,
    });
  }
  const spec = {
    schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic',
    description: 'Instructional qualitative steady-displacement-amplitude response to sinusoidal driving for a linearly damped oscillator, with fixed drive amplitude. All curves share one frame. Modern regularization places damped peaks below the undamped natural-frequency guide; no numerical readings or answer annotations are added.',
    source: {
      image: { path: path.join(root, source.path), sha256: source.sha256 },
      authoritativeText: context.locales.map(x => ({ lesson: x.lesson, text: `[${x.locale}; ${x.edition}; ${x.title}]\n${x.completeText}` })),
      inventory: groups,
    },
    canvas: { width: 640, height: 640, boundingBox: [0,640,640,0], background: 'paper', keepAspectRatio: true },
    display: { layout: 'inline', purpose: 'instructional', minTextPx: 16, widths: [331,640], maxWidthPx: 640 },
    objects, assertions,
  };
  const specPath = path.join(figdir, `${id}.spec.json`);
  save(specPath, spec);
  mappings.push({ id, sourceImage: spec.source.image, spec: { path: specPath, sha256: hash(specPath) },
    groups, regularization: source.modernRegularization, curves,
    context: { path: path.join(own, 'bilingual-context.json'), sha256: hash(path.join(own, 'bilingual-context.json')) } });
}
save(path.join(own, 'source-inventory-mapping.json'), {
  role: 'AUTHOR', independentReview: 'pending', currentImageCount: 2,
  regularizationCoordinatesNotSourceData: true, figures: mappings,
});
console.log(JSON.stringify(mappings.map(x => ({ id: x.id, spec: x.spec }))));

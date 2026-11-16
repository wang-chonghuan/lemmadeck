import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const work = path.resolve('.tmp/STEMROBIN-181/9p-d020-n71-figures');
const ticket = path.resolve('.intentfold/tickets/STEMROBIN-181/tmp');
const scripts = path.resolve('.agents/skills/ld-s10y-image/scripts');
const python = path.resolve('.claude/skills/ld-s10y-lesson/.venv/bin/python');
const freezePath = path.join(ticket, '9p-n71-prose-freeze.json');
const sciencePath = path.join(ticket, '9p-n71-science-review.json');
const inventoryPath = path.join(work, 'source-inventory.json');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bind = file => ({ path: path.resolve(file), sha256: sha(fs.readFileSync(file)) });
const write = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
};
const frozen = read(freezePath);
const science = read(sciencePath);
const lessonPath = path.resolve(frozen.bindings.lessonTemplate.path);
const sourceLessonPath = path.resolve(frozen.bindings.sourceLesson.path);
const lesson = read(lessonPath);
const sourceLesson = read(sourceLessonPath);
const inventory = read(inventoryPath);
const ids = inventory.figures.map(figure => figure.id);
assert.equal(bind(freezePath).sha256, 'd0ca4f3e87c6cc35aa85ee32e680a388e438a81b40954d9360015a2dd8769e80');
assert.equal(bind(lessonPath).sha256, '4592e24862395730ad259c20cf0565f062c68b51e4cc327e050c5fd7db066518');
assert.equal(bind(lessonPath).sha256, science.bindings.lessonTemplate.sha256);
assert.equal(science.status, 'pass');
assert.deepEqual(lesson.source.data, sourceLesson);
assert.equal(lesson.exercise_count, 0);
assert.deepEqual(ids, sourceLesson.figures.map(figure => figure.id));
const text = [lesson.printed_title, ...lesson.prose.map(block => block.text)].join('\n\n');
delete process.env.PWDEBUG;
const env = { ...process.env, PYTHONDONTWRITEBYTECODE: '1', PYTHON: python, PLAYWRIGHT_HTML_OPEN: 'never' };
const run = (command, args, input) => {
  const result = spawnSync(command, args, { env, input, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
  return { code: result.status, stdout: result.stdout, stderr: result.stderr };
};
const folder = (id, stage = 'initial') => path.join(work, id, stage);
const file = (id, name, stage = 'initial') => path.join(folder(id, stage), name);
const source = id => inventory.figures.find(figure => figure.id === id);

function makeContext(id) {
  const item = source(id);
  assert.equal(item.originalOpens, 1);
  assert(item.actuallyOpened && item.detail === 'original');
  assert.equal(bind(item.source.path).sha256, item.source.sha256);
  const result = run(python, ['-B', '-c', String.raw`
import json,sys
from pathlib import Path
sys.path.insert(0,'.agents/skills/ld-s10y-image/scripts')
import build_context
p=json.load(sys.stdin)
w,h=build_context.png_size(Path(p['source']['path']))
near=build_context.prose_context(p['lesson']['prose'],p['id'])
assert near
print(json.dumps({
 'schema':'ld-s10y-image/context@1','book':'9p','edition':'modern-us-neutral',
 'figure':p['id'],'sourceImage':dict(p['source'],width=w,height=h),
 'suggestedSize':build_context.suggested_size(w,h),
 'authoritativeRule':'Complete frozen current n71 modern prose is authoritative. Original pixels supply source structure. Historical classical atomic diagrams are source-model illustrations, never measured quantum trajectories; ion-pair diagrams are not an entire NaCl lattice. No answers or new tasks.',
 'lessons':[{'lesson':p['lesson']['id'],'title':p['lesson']['printed_title'],
             'prose':near,'fullProse':p['lesson']['prose'],
             'authoritativeText':p['text'],'exercises':[]}],
 'fullSourceProse':p['sourceLesson']['prose'],'bindings':p['bindings']
},ensure_ascii=False))
`], JSON.stringify({ id, source: item.source, lesson, sourceLesson, text,
    bindings: { lesson: bind(lessonPath), sourceLesson: bind(sourceLessonPath),
      proseFreeze: bind(freezePath), science: bind(sciencePath), inventory: bind(inventoryPath) } }));
  assert.equal(result.code, 0, result.stderr);
  write(file(id, 'context.json'), JSON.parse(result.stdout));
}

function geometry(id, height, description) {
  const screen = ([x, y]) => [x, height - y];
  const spec = {
    schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic', description,
    source: { image: { path: source(id).source.path, sha256: source(id).source.sha256 },
      authoritativeText: [{ lesson: lesson.id, text }], inventory: [] },
    canvas: { width: 640, height, boundingBox: [0, height, 640, 0], background: 'paper' },
    display: { purpose: 'instructional', layout: 'inline', maxWidthPx: 640,
      widths: [640, 331, 342], minTextPx: 16 },
    objects: [], assertions: [], layout: { minLabelGap: 4 },
  };
  const point = (id, at, style = {}) => spec.objects.push({ id, type: 'point', at: screen(at), visible: false, ...style });
  const segment = (id, from, to, style = {}) => {
    spec.objects.push({ id, type: 'segment', from, to, stroke: 'ink', strokeWidth: 4, ...style });
    spec.assertions.push({ id: `${id}-connects`, type: 'connects', arrow: id, from, to });
  };
  const label = (id, at, value, fontSize = 36) => spec.objects.push({
    id, type: 'text', at: screen(at), text: value, fontSize, labelColor: 'ink',
    labelPlacement: { position: 'CENTER' },
  });
  const circle = (id, center, radius, style = {}) => spec.objects.push({
    id, type: 'circle', center, radius, stroke: 'ink', strokeWidth: 4, fillOpacity: 0, ...style,
  });
  const polygon = (id, points, style = {}) => spec.objects.push({
    id, type: 'polygon', points: points.map(screen), stroke: 'ink', strokeWidth: 4,
    fill: 'paper', fillOpacity: 1, ...style,
  });
  const curve = (id, d, style = {}) => spec.objects.push({ id, type: 'svgPath', d,
    stroke: 'ink', strokeWidth: 4, fill: 'paper', fillOpacity: 0, ...style });
  const group = (id, description, objects, assertions, requires = []) =>
    spec.source.inventory.push({ id, description, objects, assertions, ...(requires.length ? { requires } : {}) });
  return { spec, screen, point, segment, label, circle, polygon, curve, group };
}

function electroscope(id) {
  const glass = id === 'fig-129';
  const { spec, screen, point, segment, label, circle, polygon, curve, group } =
    geometry(id, 1040, `Source electroscope schematic${glass ? ' with separately held thick glass and decreased leaf opening' : ' with greater leaf opening'}. Preserve round housing, top plate, rod, neck, inclined internal member, uncalibrated fan, stem and spread feet. All dimensions and symbolic sign spacing are unmeasured modern regularization, not readings or physical charge counts. Frozen text makes this a read-only qualitative account under isolation, no metal/glass contact and negligible leakage.`);
  point('housing-center', [260, 560]);
  point('rod-top', [260, 200]);
  point('rod-bottom', [260, 705]);
  point('leaf-pivot', [260, 560]);
  point('leaf-upper', glass ? [281, 350] : [355, 360]);
  point('leaf-lower', glass ? [245, 710] : [188.75, 710]);
  polygon('metal-top-plate', [[140, 155], [385, 155], [385, 200], [140, 200]]);
  polygon('insulating-neck', [[236, 275], [284, 275], [284, 316], [236, 316]]);
  circle('round-housing', 'housing-center', 218, { strokeWidth: 15 });
  segment('central-rod', 'rod-top', 'rod-bottom', { strokeWidth: 6 });
  segment('inclined-member-upper', 'leaf-upper', 'leaf-pivot');
  segment('inclined-member-lower', 'leaf-pivot', 'leaf-lower');
  polygon('stand-stem', [[244, 779], [276, 779], [276, 903], [244, 903]],
    { fill: 'ink', strokeWidth: 2 });
  polygon('spread-foot-base', [[260, 883], [448, 953], [451, 978], [420, 978],
    [260, 922], [95, 980], [62, 980], [62, 953]],
    { fill: 'ink', strokeWidth: 2 });
  const plateSigns = [];
  for (let i = 0; i < 5; i++) {
    const name = `top-plate-plus-${i + 1}`;
    label(name, [164 + i * 49, 178], '+', 34);
    plateSigns.push(name);
  }
  const fan = [];
  for (let i = 0; i < 8; i++) {
    const a = (97 + i * 6.5) * Math.PI / 180;
    const inner = [260 + 160 * Math.cos(a), 560 + 160 * Math.sin(a)];
    const outer = [260 + 181 * Math.cos(a), 560 + 181 * Math.sin(a)];
    const name = `unnumbered-fan-stroke-${i + 1}`;
    segment(name, screen(inner), screen(outer), { strokeWidth: 3.2 });
    fan.push(name);
  }
  spec.assertions.push(
    { id: 'rod-remains-vertical', type: 'displacement', from: 'rod-top', to: 'rod-bottom', dx: 0, dy: -505 },
    { id: 'pivot-lies-on-rod', type: 'pointOnLine', point: 'leaf-pivot', a: 'rod-top', b: 'rod-bottom' },
    { id: 'inclined-member-remains-straight', type: 'collinear', a: 'leaf-upper', b: 'leaf-pivot', c: 'leaf-lower' },
    { id: 'one-round-source-housing', type: 'objectCount', objectType: 'circle', count: 1 },
  );
  group('source-electroscope-apparatus', source(id).facts[0],
    ['metal-top-plate', 'insulating-neck', 'round-housing', 'central-rod', 'stand-stem', 'spread-foot-base'],
    ['central-rod-connects', 'rod-remains-vertical', 'pivot-lies-on-rod', 'one-round-source-housing']);
  group('source-internal-member-and-uncalibrated-fan',
    `${source(id).facts[glass ? 4 : 2]} Fan spacing/stroke count is a declared modern schematic regularization, not calibrated source data.`,
    ['inclined-member-upper', 'inclined-member-lower', ...fan],
    ['inclined-member-upper-connects', 'inclined-member-lower-connects', 'inclined-member-remains-straight', ...fan.map(name => `${name}-connects`)]);
  group('source-symbolic-top-plate-signs', 'Five illustrated plus glyphs retained, with no quantitative charge count inferred.',
    plateSigns, []);
  if (glass) {
    polygon('glass-member', [[55, 55], [575, 55], [575, 135], [55, 135]]);
    const marks = [];
    for (let i = 0; i < 7; i++) {
      for (const [name, y, value] of [['upper', 78, '+'], ['lower', 115, '-']]) {
        const labelId = `glass-${name}-mark-${i + 1}`;
        label(labelId, [80 + i * 50, y], value, 34);
        marks.push(labelId);
      }
    }
    curve('holding-hand-outline', 'M 457 56 C 477 38 487 20 512 20 C 534 22 552 22 570 9 M 482 50 C 500 48 510 38 520 35 M 575 58 C 593 55 612 49 628 44 L 622 69 C 614 86 596 91 586 90 C 580 112 568 126 552 126 C 536 144 518 138 510 126 C 492 134 478 127 477 112 C 460 116 450 99 454 84 C 438 88 434 73 440 65 C 444 59 450 57 457 56');
    point('glass-gap-upper', [260, 135]);
    point('metal-gap-lower', [260, 155]);
    spec.assertions.push({ id: 'glass-metal-positive-gap', type: 'displacement',
      from: 'glass-gap-upper', to: 'metal-gap-lower', dx: 0, dy: -20 });
    label('modern-no-contact-label', [320, 1010], 'Glass (no contact)', 34);
    group('source-glass-hand-and-polarization-markings',
      `${source(id).facts[1]} ${source(id).facts[2]} Pair spacing and clean hand contour are modern, noncalibrated geometry.`,
      ['glass-member', 'holding-hand-outline', ...marks], ['glass-metal-positive-gap']);
    group('modern-text-qualified-no-contact-label', 'English label supported by complete frozen experiment conditions.',
      ['modern-no-contact-label'], ['glass-metal-positive-gap']);
  } else {
    label('modern-apparatus-label', [320, 1010], 'Electroscope', 34);
    group('modern-apparatus-label', 'English label identifies the preserved apparatus without operational instructions.',
      ['modern-apparatus-label'], []);
  }
  return spec;
}

function atom130() {
  const { spec, screen, point, segment, label, circle, group } = geometry('fig-130', 720,
    'Source classical hydrogen charge-distribution model, not a modern measured electron orbit. One central filled nucleus and one peripheral filled electron, solid circle, dashed opposite-point diameter, labels 1/2, -e and +q=e. Opposite endpoints and shared nucleus relationship are executable. Schematic circle size/positions are unmeasured modern regularization; no time/count/velocity answer is added.');
  const center = [320, 360], radius = 225;
  const polar = degree => [center[0] + radius * Math.cos(degree * Math.PI / 180),
    center[1] + radius * Math.sin(degree * Math.PI / 180)];
  point('nucleus', center, { visible: true, size: 17, fill: 'ink', stroke: 'ink' });
  point('electron', polar(-78), { visible: true, size: 13, fill: 'ink', stroke: 'ink' });
  point('opposite-location-1', polar(-40));
  point('opposite-location-2', polar(140));
  circle('classical-circle', 'nucleus', radius);
  segment('dashed-opposite-diameter', 'opposite-location-2', 'opposite-location-1', { dash: 2, strokeWidth: 4 });
  label('electron-charge-label', [410, 101], '-e', 40);
  label('nucleus-charge-label', [408, 414], '+q=e', 40);
  label('location-1-label', [538, 202], '1', 40);
  label('location-2-label', [108, 537], '2', 40);
  label('modern-model-notice', [320, 48], 'Source classical model', 34);
  spec.assertions.push(
    { id: 'electron-on-source-circle', type: 'pointOnCircle', point: 'electron', center: 'nucleus', radius },
    { id: 'point-1-on-source-circle', type: 'pointOnCircle', point: 'opposite-location-1', center: 'nucleus', radius },
    { id: 'point-2-on-source-circle', type: 'pointOnCircle', point: 'opposite-location-2', center: 'nucleus', radius },
    { id: 'diameter-passes-nucleus', type: 'collinear', a: 'opposite-location-1', b: 'nucleus', c: 'opposite-location-2' },
    { id: 'opposite-endpoint-central-symmetry', type: 'centralSymmetry', center: 'nucleus',
      pairs: [{ a: 'opposite-location-1', b: 'opposite-location-2' }] },
    { id: 'four-anchor-objects-with-only-two-visible-particles', type: 'objectCount', objectType: 'point', count: 4 },
  );
  group('source-nucleus-and-electron', source('fig-130').facts[0],
    ['nucleus', 'electron', 'classical-circle', 'electron-charge-label', 'nucleus-charge-label'],
    ['electron-on-source-circle', 'four-anchor-objects-with-only-two-visible-particles'], ['pointRelationships']);
  group('source-dashed-opposite-point-diameter', source('fig-130').facts[2],
    ['dashed-opposite-diameter', 'location-1-label', 'location-2-label'],
    ['dashed-opposite-diameter-connects', 'point-1-on-source-circle', 'point-2-on-source-circle', 'diameter-passes-nucleus', 'opposite-endpoint-central-symmetry']);
  group('modern-classical-model-notice', 'Frozen modern prose expressly denies determinate quantum paths.',
    ['modern-model-notice'], []);
  assert.equal(spec.objects.filter(object => object.type === 'point' && object.visible !== false).length, 2);
  return spec;
}

function atom131() {
  const { spec, screen, point, label, circle, group } = geometry('fig-131', 680,
    'Source classical average-charge-distribution model: twelve dashed negative position markers around one circular guide and a central filled positive nucleus. Markers represent source illustrated positions, not twelve simultaneous electrons or measured quantum trajectories. Their angular spacing is modern schematic regularization. Labels +q and -q remain, without invented periods, counts or probability scales.');
  point('nucleus', [300, 345], { visible: true, size: 17, fill: 'ink', stroke: 'ink' });
  circle('source-circular-guide', 'nucleus', 220);
  const markers = [], outlines = [], assertions = [];
  for (let i = 0; i < 12; i++) {
    const angle = (-90 + i * 30) * Math.PI / 180;
    const at = [300 + 220 * Math.cos(angle), 345 + 220 * Math.sin(angle)];
    const id = `negative-position-${i + 1}`;
    point(id, at, { visible: true, face: '-', size: 18, strokeWidth: 3.2, stroke: 'ink', fill: 'ink' });
    markers.push(id);
    for (const [half, start, end] of [
      ['upper', [at[0] - 24, at[1]], [at[0] + 24, at[1]]],
      ['lower', [at[0] + 24, at[1]], [at[0] - 24, at[1]]],
    ]) {
      const name = `${id}-${half}-dashed-outline`;
      spec.objects.push({ id: name, type: 'arc', center: id, start: screen(start),
        end: screen(end), dash: 2, stroke: 'ink', strokeWidth: 3 });
      outlines.push(name);
    }
    const name = `${id}-on-source-guide`;
    spec.assertions.push({ id: name, type: 'pointOnCircle', point: id, center: 'nucleus', radius: 220 });
    assertions.push(name);
  }
  label('positive-nucleus-label', [353, 401], '+q', 40);
  label('negative-position-charge-label', [588, 347], '-q', 40);
  label('modern-model-notice', [320, 47], 'Source classical model', 34);
  spec.assertions.push(
    { id: 'all-six-opposite-position-pairs', type: 'centralSymmetry', center: 'nucleus',
      pairs: markers.slice(0, 6).map((id, i) => ({ a: id, b: markers[i + 6] })) },
    { id: 'thirteen-source-points-nucleus-plus-twelve-symbolic-positions', type: 'objectCount',
      objectType: 'point', count: 13 },
    { id: 'one-source-guide-circle', type: 'objectCount', objectType: 'circle', count: 1 },
  );
  group('source-nucleus-and-twelve-negative-position-markers',
    `${source('fig-131').facts[0]} ${source('fig-131').facts[1]} Angular spacing regularized, not source angle data.`,
    ['nucleus', 'source-circular-guide', ...markers, ...outlines, 'positive-nucleus-label', 'negative-position-charge-label'],
    [...assertions, 'all-six-opposite-position-pairs', 'thirteen-source-points-nucleus-plus-twelve-symbolic-positions', 'one-source-guide-circle'],
    ['pointRelationships']);
  group('modern-classical-model-notice', 'Full frozen prose distinguishes the source positions from quantum trajectories.',
    ['modern-model-notice'], []);
  return spec;
}

function pair132() {
  const { spec, point, label, curve, group } = geometry('fig-132', 440,
    'Source Na/Cl isolated ion-pair illustration: one connected narrowed-waist two-lobed outline, positive left Na and negative right Cl. Not the structure of an entire solid NaCl crystal. No transfer arrow, extra ion, bond distance or answer. Lobe contours and separations are modern unmeasured schematic geometry.');
  point('positive-Na-location', [170, 205], { visible: true, face: '+', size: 22, strokeWidth: 4, stroke: 'ink' });
  point('negative-Cl-location', [470, 205], { visible: true, face: '-', size: 22, strokeWidth: 4, stroke: 'ink' });
  curve('connected-two-lobed-outline', 'M 320 167 C 260 167 263 85 170 85 C 95 85 55 136 55 205 C 55 278 100 320 170 320 C 254 320 267 243 320 243 C 373 243 386 320 470 320 C 540 320 585 278 585 205 C 585 136 545 85 470 85 C 377 85 380 167 320 167 Z', { strokeWidth: 5 });
  label('Na-label', [170, 366], 'Na', 40);
  label('Cl-label', [470, 366], 'Cl', 40);
  label('modern-pair-model-notice', [320, 40], 'Ion-pair model', 34);
  spec.assertions.push(
    { id: 'Na-positive-left-Cl-negative-right', type: 'displacement',
      from: 'positive-Na-location', to: 'negative-Cl-location', dx: 300, dy: 0 },
    { id: 'only-two-source-ion-locations', type: 'objectCount', objectType: 'point', count: 2 },
  );
  group('source-connected-ion-pair-and-sign-ownership',
    `${source('fig-132').facts[0]} ${source('fig-132').facts[1]}`,
    ['positive-Na-location', 'negative-Cl-location', 'connected-two-lobed-outline', 'Na-label', 'Cl-label'],
    ['Na-positive-left-Cl-negative-right', 'only-two-source-ion-locations'], ['pointRelationships']);
  group('modern-isolated-pair-notice', 'Full frozen text distinguishes this pair from the solid ionic lattice.',
    ['modern-pair-model-notice'], []);
  return spec;
}

function dipole133() {
  const { spec, point, segment, label, group } = geometry('fig-133', 320,
    'Source ideal dipole schematic with two filled equal-opposite point charges joined by a single non-arrow segment. Left +|q|, right -|q| and symbolic l above. No electric-field/dipole-moment arrow or numerical distance. Full frozen text restricts the source pair and its distant-field interpretation; drawing dimensions are not measurements.');
  point('positive-charge', [145, 160], { visible: true, size: 13, fill: 'ink', stroke: 'ink' });
  point('negative-charge', [495, 160], { visible: true, size: 13, fill: 'ink', stroke: 'ink' });
  segment('source-pair-joining-segment', 'positive-charge', 'negative-charge', { strokeWidth: 5 });
  label('positive-charge-label', [145, 237], '+|q|', 40);
  label('negative-charge-label', [495, 237], '-|q|', 40);
  label('symbolic-separation-label', [320, 112], 'l', 40);
  label('modern-ideal-model-notice', [320, 42], 'Ideal dipole', 34);
  spec.assertions.push(
    { id: 'positive-left-negative-right', type: 'displacement', from: 'positive-charge', to: 'negative-charge', dx: 350, dy: 0 },
    { id: 'two-source-charge-points', type: 'objectCount', objectType: 'point', count: 2 },
    { id: 'no-source-arrows', type: 'objectCount', objectType: 'arrow', count: 0 },
  );
  group('source-two-charges-and-symbolic-separation',
    source('fig-133').facts.join(' '),
    ['positive-charge', 'negative-charge', 'source-pair-joining-segment', 'positive-charge-label', 'negative-charge-label', 'symbolic-separation-label'],
    ['source-pair-joining-segment-connects', 'positive-left-negative-right', 'two-source-charge-points', 'no-source-arrows'],
    ['pointRelationships']);
  group('modern-ideal-dipole-notice', 'English ideal-model label adds no formula or answer.',
    ['modern-ideal-model-notice'], []);
  return spec;
}

function plan(id) {
  makeContext(id);
  const spec = id === 'fig-128' || id === 'fig-129' ? electroscope(id) :
    id === 'fig-130' ? atom130() : id === 'fig-131' ? atom131() :
      id === 'fig-132' ? pair132() : dipole133();
  const visible = spec.objects.filter(object => object.visible !== false).map(object => object.id);
  const mapped = new Set(spec.source.inventory.flatMap(group => group.objects));
  assert(visible.every(id => mapped.has(id)));
  write(file(id, 'spec.json'), spec);
  const validation = run(python, ['-B', path.join(scripts, 'validate_spec.py'), file(id, 'spec.json'), '--stage', 'draft', '--json']);
  write(file(id, 'preflight.json'), validation);
  console.log(JSON.stringify({ id, spec: bind(file(id, 'spec.json')), validation }));
}

function render(id, stage) {
  assert.equal(read(file(id, 'preflight.json', stage)).code, 0);
  for (const name of ['render.json', 'figure.svg', 'candidate.png']) assert(!fs.existsSync(file(id, name, stage)));
  const result = run('node', ['--import', path.join(work, 'width-previews.mjs'),
    path.join(scripts, 'render_spec.mjs'), '--spec', file(id, 'spec.json', stage),
    '--svg', file(id, 'figure.svg', stage), '--png', file(id, 'candidate.png', stage),
    '--report', file(id, 'render.json', stage)]);
  write(file(id, 'render-command.json', stage), {
    ...result, entrypoint: bind(path.join(scripts, 'render_spec.mjs')),
    previewHelper: bind(path.join(work, 'width-previews.mjs')),
    headless: true, PWDEBUGUnset: true, userProfileCDPOrVisibleUI: false,
    networkBlocked: true, nativeFinallyClosesBrowser: true,
  });
  console.log(JSON.stringify({ id, stage, result,
    report: fs.existsSync(file(id, 'render.json', stage)) ? read(file(id, 'render.json', stage)) : null }));
}

function repairClearance(id) {
  assert(['fig-128', 'fig-129'].includes(id));
  assert(!fs.existsSync(folder(id, 'repair')), 'One targeted repair maximum.');
  const report = read(file(id, 'render.json'));
  assert.equal(report.status, 'fail');
  const expected = Array.from({ length: 5 }, (_, i) => `top-plate-plus-${i + 1}-label`);
  if (id === 'fig-129') {
    for (let i = 1; i <= 7; i++) expected.push(`glass-upper-mark-${i}-label`, `glass-lower-mark-${i}-label`);
  }
  assert.deepEqual(report.collisions.map(item => item.id), expected);
  assert(report.displayChecks.every(check => check.status === 'pass'));
  const previous = read(file(id, 'spec.json'));
  const spec = structuredClone(previous);
  const object = name => spec.objects.find(item => item.id === name);
  const glass = id === 'fig-129';
  const plateTop = glass ? 170 : 144;
  const plateBottom = glass ? 238 : 212;
  object('metal-top-plate').points = [[140, 1040 - plateTop], [385, 1040 - plateTop],
    [385, 1040 - plateBottom], [140, 1040 - plateBottom]];
  object('rod-top').at = [260, 1040 - plateBottom];
  spec.assertions.find(item => item.id === 'rod-remains-vertical').dy = -(705 - plateBottom);
  if (glass) {
    for (let i = 1; i <= 5; i++) object(`top-plate-plus-${i}`).at[1] = 1040 - 204;
    object('glass-member').points = [[55, 1010], [575, 1010], [575, 890], [55, 890]];
    object('glass-gap-upper').at = [260, 890];
    object('metal-gap-lower').at = [260, 870];
  }
  const restored = structuredClone(spec);
  for (const old of previous.objects) {
    if (JSON.stringify(old) !== JSON.stringify(restored.objects.find(item => item.id === old.id))) {
      restored.objects[restored.objects.findIndex(item => item.id === old.id)] = old;
    }
  }
  restored.assertions = previous.assertions;
  assert.deepEqual(restored, previous);
  const changedObjects = spec.objects.filter(item =>
    JSON.stringify(item) !== JSON.stringify(previous.objects.find(old => old.id === item.id))).map(item => item.id);
  assert.deepEqual(spec.source, previous.source);
  assert.deepEqual(spec.display, previous.display);
  fs.mkdirSync(folder(id, 'repair'), { recursive: true });
  fs.copyFileSync(file(id, 'context.json'), file(id, 'context.json', 'repair'), fs.constants.COPYFILE_EXCL);
  write(file(id, 'spec.json', 'repair'), spec);
  write(file(id, 'repair-history.json', 'repair'), {
    ticket: 'STEMROBIN-181', batch: 'D020', figure: id,
    targetedAuthorRepair: 1, remainingAuthorRepairs: 0,
    actualFailure: bind(file(id, 'render.json')),
    reason: 'Native label bounding boxes touch plate/glass outline strokes. Increase only the modern rectangular-envelope clearance and keep the rod attached to the plate lower edge; preserve glyphs, source sign counts, housing, leaf geometry and glass-metal noncontact.',
    initialSpec: bind(file(id, 'spec.json')), currentSpec: bind(file(id, 'spec.json', 'repair')),
    initialContext: bind(file(id, 'context.json')), currentContext: bind(file(id, 'context.json', 'repair')),
    priorHelper: bind(path.join(work, 'author-figures.before-clearance-repair.mjs')),
    changedObjects, changedAssertion: 'rod-remains-vertical',
    sourceInventoryTextGlyphCountsLeafAnglesHousingAndFontsUnchanged: true,
    sourceAndDisplayDeepEqual: true, sourceOrTemplateOrSvgHandEdits: false,
  });
  const result = run(python, ['-B', path.join(scripts, 'validate_spec.py'),
    file(id, 'spec.json', 'repair'), '--stage', 'draft', '--json']);
  write(file(id, 'preflight.json', 'repair'), result);
  console.log(JSON.stringify({ id, changedObjects, validation: result }));
}

function freeze() {
  const observationsPath = path.join(work, 'author-pixel-observations.json');
  const observations = read(observationsPath);
  const figures = [];
  for (const id of ids) {
    const repaired = fs.existsSync(file(id, 'spec.json', 'repair'));
    const stage = repaired ? 'repair' : 'initial';
    const spec = read(file(id, 'spec.json', stage));
    const context = read(file(id, 'context.json', stage));
    const render = read(file(id, 'render.json', stage));
    const previews = read(file(id, 'width-previews.json', stage));
    const opened = observations.figures.find(item => item.id === id && item.stage === stage);
    assert.deepEqual(spec.source.authoritativeText, [{ lesson: lesson.id, text }]);
    assert.deepEqual(context.lessons[0].fullProse, lesson.prose);
    assert.deepEqual(context.fullSourceProse, sourceLesson.prose);
    assert.equal(render.spec.sha256, bind(file(id, 'spec.json', stage)).sha256);
    assert.equal(render.output.svg.sha256, bind(file(id, 'figure.svg', stage)).sha256);
    assert.deepEqual(opened.previews.map(item => item.width), [640, 331, 342]);
    for (const p of previews.outputs) {
      const view = opened.previews.find(v => v.width === p.width);
      assert(view.actuallyOpened && view.detail === 'original' && view.opens === 1);
      assert.equal(view.sha256, p.sha256);
      assert.equal(bind(p.path).sha256, p.sha256);
      assert(p.minimumTextPx >= 16);
    }
    const validation = run(python, ['-B', path.join(scripts, 'validate_spec.py'),
      file(id, 'spec.json', stage), '--stage', 'rendered', '--json']);
    write(file(id, 'rendered-validation.json', stage), validation);
    const ready = render.status === 'pass' && validation.code === 0 && opened.authorDisposition === 'ready-for-independent-review';
    const names = ['context.json', 'spec.json', 'figure.svg', 'render.json', 'candidate.png',
      'preflight.json', 'render-command.json', 'width-previews.json', 'rendered-validation.json'];
    const manifest = {
      ticket: 'STEMROBIN-181', batch: 'D020', figure: id, mode: 'deterministic',
      status: ready ? 'author-frozen-independent-review-pending' : 'author-blocked',
      bindings: { source: source(id).source, lesson: bind(lessonPath),
        sourceLesson: bind(sourceLessonPath), proseFreeze: bind(freezePath),
        inheritedScience: bind(sciencePath), inventory: bind(inventoryPath),
        context: bind(file(id, 'context.json', stage)), spec: bind(file(id, 'spec.json', stage)),
        svg: bind(file(id, 'figure.svg', stage)), render: bind(file(id, 'render.json', stage)) },
      outputs: Object.fromEntries(names.map(name => [name, bind(file(id, name, stage))])),
      previews: previews.outputs.map(item => ({ ...item, actuallyOpened: true, opens: 1, detail: 'original' })),
      authorPixelObservations: bind(observationsPath), authorDisposition: opened.authorDisposition,
      targetedRepairsUsed: repaired ? 1 : 0, targetedRepairsRemaining: repaired ? 0 : 1,
      independentReview: 'pending-not-performed', promoted: false,
    };
    if (repaired) {
      manifest.repairHistory = bind(file(id, 'repair-history.json', 'repair'));
      manifest.initial = Object.fromEntries(names.filter(name => fs.existsSync(file(id, name)))
        .map(name => [name, bind(file(id, name))]));
    }
    write(file(id, 'author-manifest.json', stage), manifest);
    figures.push({ id, ...manifest, authorManifest: bind(file(id, 'author-manifest.json', stage)) });
  }
  assert.equal(bind(lessonPath).sha256, frozen.bindings.lessonTemplate.sha256);
  assert.equal(bind(sourceLessonPath).sha256, frozen.bindings.sourceLesson.sha256);
  const payload = {
    ticket: 'STEMROBIN-181', batch: 'D020', lesson: lesson.id, role: 'modern-figure-author-only',
    status: figures.every(item => item.status === 'author-frozen-independent-review-pending') ?
      'author-frozen-independent-review-pending' : 'author-frozen-partial-blocked',
    bindings: { lesson: bind(lessonPath), sourceLesson: bind(sourceLessonPath),
      sourceMarkdown: frozen.bindings.sourceMarkdown, sourceExercises: frozen.bindings.sourceExercises,
      proseFreeze: bind(freezePath), inheritedScience: bind(sciencePath), inventory: bind(inventoryPath) },
    fullAuthoritativeTextSha256: sha(text), originalTasks: 0,
    originalPixelOpensPerFigure: 1, figures,
    helper: bind(path.join(work, 'author-figures.mjs')),
    previewHelper: bind(path.join(work, 'width-previews.mjs')),
    nativeTools: ['build_context.py', 'validate_spec.py', 'render_spec.mjs'].map(name => bind(path.join(scripts, name))),
    nativeSchema: bind(path.resolve('.agents/skills/ld-s10y-image/assets/figure-spec.schema.json')),
    independentApprovalOrScienceRepeat: false, promotionOrFinalize: false,
    sourceTemplateToolAppDependencyDatabaseIndexGitChanges: false,
    D019ScopeContamination: false, inFlightProcesses: [],
  };
  write(path.join(work, 'author-freeze.json'), payload);
  console.log(JSON.stringify({ freeze: bind(path.join(work, 'author-freeze.json')),
    status: payload.status, figures: figures.map(item => ({
      id: item.id, status: item.status, repairsUsed: item.targetedRepairsUsed, authorManifest: item.authorManifest,
    })), inFlightProcesses: [] }));
}

const [command, id, stage = 'initial'] = process.argv.slice(2);
assert(['plan-all', 'freeze'].includes(command) || ids.includes(id));
if (command === 'plan-all') ids.forEach(plan);
else if (command === 'render') render(id, stage);
else if (command === 'repair-clearance') repairClearance(id);
else if (command === 'freeze') freeze();
else throw new Error(`Unknown author-only command ${command}`);

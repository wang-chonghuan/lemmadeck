import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const work = '.tmp/STEMROBIN-181/9p-d017-n55-figures';
const tmp = '.intentfold/tickets/STEMROBIN-181/tmp';
const lessonId = 'phy9-c1-s7-n55';
const folder = `.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/${lessonId}`;
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python';
const renderer = '.agents/skills/ld-s10y-image/scripts/render_spec.mjs';
const widths = [640, 331, 342];
const [command, requested] = process.argv.slice(2);
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
const bind = file => ({ path: file, sha256: hash(fs.readFileSync(file)) });
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const verify = binding => assert.equal(bind(binding.path).sha256, binding.sha256, `Byte drift ${binding.path}`);
const save = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
const figures = read(`${work}/source-observations.json`).figures;
const env = { ...process.env, PYTHON: path.resolve(python), PYTHONDONTWRITEBYTECODE: '1', PLAYWRIGHT_HTML_OPEN: 'never' };
delete env.PWDEBUG;
function run(executable, args, input) {
  const result = spawnSync(executable, args, { input, env, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
  return { executable, args, exitCode: result.status, signal: result.signal, stdout: result.stdout, stderr: result.stderr };
}

function inputsFor(id) {
  const inventory = figures.find(figure => figure.id === id);
  assert.ok(inventory, 'Own92-98 only.');
  verify(inventory.source);
  assert.equal(inventory.source.actuallyOpened, true);
  const frozen = read(`${tmp}/9p-n55-prose-freeze.json`);
  const science = read(`${tmp}/9p-n55-science-review.json`);
  assert.equal(science.status, 'pass');
  assert.equal(frozen.lesson, lessonId);
  Object.values(frozen.templates).forEach(verify);
  verify(frozen.source.lesson);
  verify(frozen.source.exercises);
  for (const binding of Object.values(science.bindings)) verify(binding);
  verify(science.authorFreeze);
  const lesson = read(`${folder}/lesson.template.json`);
  assert.equal(lesson.id, lessonId);
  assert.deepEqual(lesson.source.data, read(frozen.source.lesson.path));
  assert.equal(lesson.prose.length, frozen.counts.source_prose_blocks);
  assert(lesson.prose.some(block => block.kind === 'fig' && block.id === id));
  const fullText = [lesson.printed_title, ...lesson.prose.map(block => block.text)].join('\n\n');
  const page = lesson.figures.find(figure => figure.id === id).page;
  const inputs = {
    template: bind(`${folder}/lesson.template.json`),
    exercisesTemplate: bind(`${folder}/exercises.template.json`),
    figuresTemplate: bind(`${folder}/figures.template.json`),
    proseFreeze: bind(`${tmp}/9p-n55-prose-freeze.json`),
    scienceReview: bind(`${tmp}/9p-n55-science-review.json`),
    sourceLesson: bind(frozen.source.lesson.path), sourceImage: bind(inventory.source.path),
    sourcePage: bind(`ssot-resources/soviet10year-textbooks/artifacts/9p/pages/${String(page).padStart(4, '0')}/page.json`),
    sourceInventory: bind(`${work}/source-observations.json`),
  };
  return { inventory, lesson, fullText, inputs };
}

function currentInputs(inputs) { Object.values(inputs).forEach(verify); }

function context(id, data) {
  const result = run(python, ['-B', '-c', `
import json,sys
from pathlib import Path
sys.path.insert(0,'.agents/skills/ld-s10y-image/scripts')
import build_context as B
p=json.load(sys.stdin)
image=Path(p['inputs']['sourceImage']['path'])
assert B.sha256(image)==p['inputs']['sourceImage']['sha256']
w,h=B.png_size(image)
near=B.prose_context([dict(b,label=b.get('label') or '') for b in p['lesson']['prose']],p['id'])
assert near
print(json.dumps({
 'schema':'ld-s10y-image/context@1','book':'9p','edition':'modern-us-neutral','figure':p['id'],
 'sourceImage':dict(p['inputs']['sourceImage'],width=w,height=h),'suggestedSize':B.suggested_size(w,h),
 'authoritativeRule':'Full current author-frozen n55 title, all25 prose/figure/caption blocks, SCI constraints and source PNG inventory. No answer-key use, calibration, new solution or unsafe procedure.',
 'lessons':[{'lesson':p['lesson']['id'],'title':p['lesson']['printed_title'],'prose':near,
 'fullProse':p['lesson']['prose'],'authoritativeText':p['fullText'],'exercises':[]}],
 'inputs':p['inputs'],'construction':'Existing native build_context API using the exact frozen scratch template.'
},ensure_ascii=False))
`], JSON.stringify({ id, ...data }));
  assert.equal(result.exitCode, 0, result.stderr);
  save(`${work}/${id}.context.json`, JSON.parse(result.stdout));
}

function construct(id, inventory, inputs, fullText) {
  const height = { 'fig-93': 470, 'fig-94': 340, 'fig-95': 320, 'fig-96': 360, 'fig-97': 330, 'fig-98': 480 }[id];
  const spec = {
    schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic',
    description: `Uncalibrated apparatus geometry faithful to original ${id}: ${inventory.sourceFacts.join(' ')} Modern regularization: ${inventory.modernRegularization.join(' ')}`,
    source: { image: inputs.sourceImage, authoritativeText: [{ lesson: lessonId, text: fullText }], inventory: [] },
    canvas: { width: 640, height, boundingBox: [0, height, 640, 0], background: 'paper', keepAspectRatio: true },
    display: { purpose: 'instructional', layout: 'inline', maxWidthPx: 640, minTextPx: 16, widths },
    objects: [], assertions: [], layout: { minLabelGap: 4 },
  };
  const at = ([x, y]) => [x, height - y];
  const positions = new Map();
  const group = (name, description, relationships = false) => {
    const g = { id: name, description, objects: [], assertions: [], ...(relationships ? { requires: ['pointRelationships'] } : {}) };
    spec.source.inventory.push(g);
    return g;
  };
  const add = (obj, g) => { spec.objects.push(obj); if (g) g.objects.push(obj.id); return obj.id; };
  const claim = (value, g) => { spec.assertions.push(value); if (g) g.assertions.push(value.id); };
  const point = (name, p, g) => {
    positions.set(name, p);
    return add({ id: name, type: 'point', at: at(p), visible: true, label: '',
      size: 0.2, fill: 'ink', stroke: 'ink', strokeWidth: 0.2 }, g);
  };
  const resolve = value => typeof value === 'string' ? value : at(value);
  const line = (name, a, b, g, style = {}) => add({
    id: name, type: 'segment', from: resolve(a), to: resolve(b), stroke: 'ink', strokeWidth: 3, ...style,
  }, g);
  const polygon = (name, pts, g, fill = 'paper', style = {}) =>
    add({ id: name, type: 'polygon', points: pts.map(resolve), fill, stroke: 'ink', strokeWidth: 3, ...style }, g);
  const circle = (name, center, radius, g, fill = 'paper', style = {}) =>
    add({ id: name, type: 'circle', center: resolve(center), radius, stroke: 'ink', strokeWidth: 3, fill, ...style }, g);
  const label = (name, p, text, g) => add({
    id: name, type: 'text', at: at(p), text, fontSize: 32, fontWeight: 500,
    labelPlacement: { position: 'CENTER' },
  }, g);
  const raw = (name, d, g, style = {}) => add({ id: name, type: 'svgPath', d, stroke: 'ink', strokeWidth: 3, ...style }, g);
  const connect = (name, a, b, g, style = {}) => {
    line(name, a, b, g, style);
    claim({ id: `${name}-joins`, type: 'connects', arrow: name, from: a, to: b }, g);
  };
  const displacement = (name, a, b, g) => {
    const pa = positions.get(a), pb = positions.get(b);
    claim({ id: name, type: 'displacement', from: a, to: b, dx: pb[0] - pa[0], dy: pa[1] - pb[1] }, g);
  };
  let proof;
  if (id === 'fig-93') {
    const support = group('source-empty-cradle-and-two-supports', inventory.sourceFacts[0], true);
    const base = [[42, 234], [499, 108], [584, 151], [127, 277]];
    polygon('source-cradle-base', base, support, 'accentSoft');
    polygon('source-cradle-base-front', [[42, 234], [127, 277], [127, 289], [42, 246]], support);
    polygon('source-cradle-base-long-side', [[127, 277], [584, 151], [584, 163], [127, 289]], support, 'grid');
    const farLeft = [77, 119], farRight = [497, 38];
    point('source-left-groove-bottom', [98, 170], support);
    point('source-right-groove-bottom', [521, 83], support);
    displacement('source-two-supports-separated-in-perspective', 'source-left-groove-bottom', 'source-right-groove-bottom', support);
    polygon('source-left-support', [[60, 234], farLeft, [105, 111], [156, 139], [170, 264], [119, 249]], support, 'grid');
    polygon('source-right-support', [[476, 116], farRight, [533, 37], [572, 56], [575, 150], [528, 159]], support, 'grid');
    raw('source-left-open-groove', 'M78,123 L98,170 L111,115 M98,170 L126,179', support, { strokeWidth: 4 });
    raw('source-right-open-groove', 'M497,41 L521,83 L535,39 M521,83 L549,91', support, { strokeWidth: 4 });
    line('source-channel-far-edge', [147, 149], [477, 80], support);
    line('source-channel-near-edge', [174, 230], [522, 140], support);
    const rod = group('source-detached-rod-pin-and-fastener', inventory.sourceFacts.slice(1).join(' '), true);
    const a = [147, 408], b = [552, 292];
    point('source-rod-left-hole', a, rod);
    point('source-rod-threaded-end', b, rod);
    connect('source-detached-iron-rod', 'source-rod-left-hole', 'source-rod-threaded-end', rod, { strokeWidth: 11 });
    point('source-pin-first-end', [134, 383], rod);
    point('source-pin-second-end', [160, 433], rod);
    connect('source-cast-iron-transverse-pin', 'source-pin-first-end', 'source-pin-second-end', rod, { strokeWidth: 7 });
    claim({ id: 'source-pin-through-rod-hole', type: 'collinear', a: 'source-pin-first-end', b: 'source-rod-left-hole', c: 'source-pin-second-end' }, rod);
    circle('source-rod-eye-outline', a, 11, rod, 'paper');
    circle('source-wing-nut-center', b, 10, rod, 'grid');
    raw('source-wing-nut-pair', 'M551,281 C537,259 529,268 543,287 M560,292 C590,296 583,310 563,303', rod, { strokeWidth: 7 });
    for (let k = 0; k < 4; k++) line(`source-screw-thread-${k}`, [526 + k * 5, 291 - k * 1.5], [531 + k * 5, 305 - k * 1.5], rod, { strokeWidth: 2 });
    proof = { subfigures: 2, endSupports: 2, detachedRods: 1, transversePins: 1,
      installedRodAdded: false, fractureAdded: false, apparatusGapPx: 65,
      sourceProjectionNotPhysicalDimensions: true };
  } else if (id === 'fig-94') {
    const pipe = group('source-continuous-pipe-and-upward-loop', inventory.sourceFacts.slice(0, 2).join(' '));
    raw('source-continuous-pipe-wall',
      'M30,252 L212,252 C229,252 235,248 224,232 C189,180 178,148 194,110 C215,58 259,35 320,35 C381,35 425,58 446,110 C462,148 451,180 416,232 C405,248 411,252 428,252 L610,252 L610,273 L425,273 C375,273 377,246 401,213 C431,169 441,143 427,118 C408,77 370,57 320,57 C270,57 232,77 213,118 C199,143 209,169 239,213 C263,246 265,273 215,273 L30,273 Z',
      pipe, { fill: 'accentSoft', strokeWidth: 3 });
    const clamps = group('source-two-end-collars', inventory.sourceFacts.slice(2).join(' '));
    const clampPart = (name, left, top, right, bottom) => raw(name,
      `M${left},${top} L${right},${top} L${right},${bottom} L${left},${bottom} Z`,
      clamps, { fill: 'ink', strokeWidth: 1 });
    for (const [i, x] of [128, 512].entries()) {
      clampPart(`source-clamp-${i + 1}-body`, x - 8, 242, x + 8, 283);
      clampPart(`source-clamp-${i + 1}-upper-bolt`, x - 16, 233, x + 16, 242);
      clampPart(`source-clamp-${i + 1}-lower-bolt`, x - 16, 283, x + 16, 292);
    }
    claim({ id: 'source-exact-two-collars-six-outline-parts', type: 'objectCount', objectType: 'svgPath', count: 7 }, clamps);
    proof = { continuousPipe: 1, loop: 1, collars: 2, endRuns: 2, branches: 0,
      sourceLoopIsUncalibrated: true, physicalDimensionsAdded: false };
  } else if (id === 'fig-95' || id === 'fig-96') {
    const layers = group('source-copper-outer-and-iron-inner', inventory.sourceFacts[0] + ' ' + inventory.sourceFacts[1]);
    const rivets = group('source-five-corresponding-rivet-stations', inventory.sourceFacts.slice(1).join(' '), true);
    const stations = [];
    if (id === 'fig-95') {
      polygon('source-copper-layer', [[40, 130], [600, 130], [600, 160], [40, 160]], layers, 'accentSoft');
      polygon('source-iron-layer', [[40, 160], [600, 160], [600, 190], [40, 190]], layers, 'grid');
      label('source-copper-label', [320, 80], 'Cu', layers);
      label('source-iron-label', [320, 240], 'Fe', layers);
      for (const x of [100, 210, 320, 430, 540]) stations.push({ outer: [x, 119], inner: [x, 201] });
      proof = { straightLayers: 2, copperAboveIron: true, interfaceScreenY: 160 };
    } else {
      const center = [320, 512], outerRadius = 390, interfaceRadius = 360, innerRadius = 330;
      const lo = -134, hi = -46;
      const position = (radius, degrees) => {
        const a = degrees * Math.PI / 180;
        return [center[0] + radius * Math.cos(a), center[1] + radius * Math.sin(a)];
      };
      const arc = radius => Array.from({ length: 45 }, (_, i) => position(radius, lo + (hi - lo) * i / 44));
      polygon('source-copper-layer', [...arc(outerRadius), ...arc(interfaceRadius).reverse()], layers, 'accentSoft');
      polygon('source-iron-layer', [...arc(interfaceRadius), ...arc(innerRadius).reverse()], layers, 'grid');
      label('source-copper-label', [320, 60], 'Cu', layers);
      label('source-iron-label', [320, 236], 'Fe', layers);
      const angles = [-128, -109, -90, -71, -52];
      for (const angle of angles) stations.push({ outer: position(outerRadius + 10, angle), inner: position(innerRadius - 10, angle) });
      assert(outerRadius > interfaceRadius && interfaceRadius > innerRadius);
      const radians = (hi - lo) * Math.PI / 180;
      assert(outerRadius * radians > innerRadius * radians);
      proof = { center, outerRadius, interfaceRadius, innerRadius, angularBoundsDegrees: [lo, hi],
        angles, copperOnLongerOutsideArc: true, ironOnShorterInsideArc: true,
        noQuantitativeCurvatureOrExpansionInference: true,
        drawnArcLengths: { outer: outerRadius * radians, inner: innerRadius * radians },
        sourceRadiiNotPhysicalData: true };
    }
    for (const [i, station] of stations.entries()) {
      const first = `source-rivet-${i + 1}-outer-center`, second = `source-rivet-${i + 1}-inner-center`;
      point(first, station.outer, rivets);
      point(second, station.inner, rivets);
      connect(`source-rivet-${i + 1}-shaft`, first, second, rivets, { strokeWidth: 5 });
      circle(`source-rivet-${i + 1}-outer-head`, first, 9, rivets, 'ink');
      circle(`source-rivet-${i + 1}-inner-head`, second, 9, rivets, 'ink');
      displacement(`source-rivet-${i + 1}-matched-heads`, first, second, rivets);
    }
    claim({ id: 'source-exact-ten-heads-five-stations', type: 'objectCount', objectType: 'circle', count: 10 }, rivets);
    proof.rivetStations = stations;
    proof.physicalCalibration = false;
    assert.equal(stations.length, inventory.counts.rivetStations);
  } else if (id === 'fig-97') {
    const concrete = group('source-concrete-member-right-and-cutaway-front', inventory.sourceFacts[0] + ' ' + inventory.sourceFacts[4]);
    const rearTop = x => [x, 127 - x * 0.14];
    const nearTop = x => [x + 55, 164 - x * 0.14];
    const rearBottom = x => [x, 237 - x * 0.14];
    const nearBottom = x => [x + 55, 274 - x * 0.14];
    polygon('source-concrete-top', [rearTop(260), rearTop(555), nearTop(555), nearTop(260)], concrete, 'paper', { fillOpacity: 1 });
    polygon('source-concrete-visible-front', [nearTop(260), nearTop(555), nearBottom(555), nearBottom(260)], concrete, 'accentSoft', { fillOpacity: 1 });
    polygon('source-concrete-end', [rearTop(555), nearTop(555), nearBottom(555), rearBottom(555)], concrete, 'grid', { fillOpacity: 1 });
    const bars = group('source-four-visible-longitudinal-traces', inventory.sourceFacts[2] + ' ' + inventory.sourceFacts[3], true);
    const barFunctions = [rearTop, nearTop, rearBottom, nearBottom];
    for (const [i, position] of barFunctions.entries()) {
      const a = `source-longitudinal-${i + 1}-left`, b = `source-longitudinal-${i + 1}-cutaway-end`;
      point(a, position(25), bars); point(b, position(455), bars);
      connect(`source-longitudinal-${i + 1}`, a, b, bars, { strokeWidth: 6 });
      displacement(`source-longitudinal-${i + 1}-perspective`, a, b, bars);
    }
    raw('source-left-upper-return', 'M80,160 C62,160 59,169 77,171 L90,168', bars, { strokeWidth: 6 });
    raw('source-left-lower-return', 'M80,270 C64,282 79,291 99,278', bars, { strokeWidth: 6 });
    raw('source-transition-upper-return', 'M230,150 C211,150 208,163 226,162 L239,159', bars, { strokeWidth: 6 });
    const stirrups = group('source-eight-visible-transverse-stirrups', inventory.sourceFacts[1], true);
    const stations = [50, 102, 154, 206, 282, 334, 386, 438];
    const vertices = [];
    for (const [i, x] of stations.entries()) {
      const corners = [rearTop(x), nearTop(x), nearBottom(x), rearBottom(x)];
      const ids = corners.map((p, j) => point(`source-stirrup-${i + 1}-corner-${j + 1}`, p, stirrups));
      for (let j = 0; j < 4; j++) connect(`source-stirrup-${i + 1}-edge-${j + 1}`, ids[j], ids[(j + 1) % 4], stirrups,
        { stroke: 'ink', strokeWidth: 3 });
      claim({ id: `source-stirrup-${i + 1}-opposite-edges`, type: 'parallel', a: ids[0], b: ids[1], c: ids[3], d: ids[2] }, stirrups);
      vertices.push(corners);
    }
    assert.equal(stations.length, inventory.counts.visibleStirrups);
    assert.equal(stations.filter(x => x < 260).length, inventory.counts.exposedStirrups);
    assert.equal(stations.filter(x => x > 260).length, inventory.counts.cutawayStirrups);
    assert(stations.at(-1) < 555 && stations.every((x, i) => !i || x > stations[i - 1]));
    proof = { visibleStirrups: stations.length, exposedStirrups: 4, cutawayStirrups: 4,
      visibleLongitudinalTraces: barFunctions.length, visibleReturnStrokes: 3, vertices,
      sourceScreenPerspectiveNotMeasuredReinforcement: true, inferredHiddenRodCount: null,
      noConstructionSpecificationOrLoadCalibration: true };
  } else if (id === 'fig-98') {
    const ring = group('source-annular-ring-with-one-bore', inventory.sourceFacts[1]);
    const ball = group('source-single-ball-above-and-occluding-rear-rim', inventory.sourceFacts[0]);
    const center = [320, 337], outer = [225, 88], inner = [150, 52];
    const ellipse = (radii, first, last) => Array.from({ length: 33 }, (_, i) => {
      const a = (first + (last - first) * i / 32) * Math.PI / 180;
      return [center[0] + radii[0] * Math.cos(a), center[1] + radii[1] * Math.sin(a)];
    });
    polygon('source-ring-rear-half', [...ellipse(outer, 180, 360), ...ellipse(inner, 360, 180)], ring, 'grid', { fillOpacity: 1, opacity: 0 });
    polygon('source-ring-front-half', [...ellipse(outer, 0, 180), ...ellipse(inner, 180, 0)], ring, 'grid', { fillOpacity: 1, opacity: 0 });
    const ballCenter = [320, 185], radius = 140;
    circle('source-metal-ball', ballCenter, radius, ball, 'accentSoft', { strokeWidth: 3, fillOpacity: 1 });
    claim({ id: 'source-exact-one-ball', type: 'objectCount', objectType: 'circle', count: 1 }, ball);
    claim({ id: 'source-bore-centered-left-right', type: 'equalDistance',
      a: at(center), b: at([center[0] - inner[0], center[1]]),
      c: at(center), d: at([center[0] + inner[0], center[1]]) }, ring);
    assert(ballCenter[0] === center[0] && ballCenter[1] + radius < center[1]);
    assert(radius < inner[0] && ballCenter[1] + radius > center[1] - inner[1]);
    assert(outer[0] > inner[0] && outer[1] > inner[1]);
    proof = { balls: 1, rings: 1, holes: 1, ballCenter, ballRadius: radius, ringCenter: center,
      outerProjectedRadii: outer, innerProjectedRadii: inner,
      rearRimOccludedByBall: true, frontBoreCrescentVisible: true,
      projectedDrawingSpaceOnly: true, thermalStatePanelsAdded: 0, numericClearanceAdded: false,
      noPassFailSolutionLabels: true };
  } else throw new Error('Blocked92 is context-only; do not guess source geometry.');
  assert(spec.objects.filter(obj => obj.type === 'text').length === inventory.printedLabels.length);
  assert(spec.objects.filter(obj => obj.type === 'text').every(obj => !/[\u0400-\u04ff\u3400-\u9fff]/u.test(obj.text) && obj.fontSize === 32));
  return { spec, proof };
}

function plan(id) {
  const data = inputsFor(id);
  assert(!fs.existsSync(`${work}/${id}.context.json`), 'Do not repeat initial author plan.');
  context(id, data);
  if (data.inventory.hardBlockers.length) {
    save(`${work}/${id}.blocked-author.json`, {
      figure: id, status: 'author-blocked-source-detail', inputs: data.inputs,
      context: bind(`${work}/${id}.context.json`), hardBlockers: data.inventory.hardBlockers,
      initialRenderAttempts: 0, targetedRepairs: 0, maximumRepairs: 1,
      independentReview: 'not-performed', promoted: false,
    });
    console.log(`${id} blocked: no drawing/render/repair, full context bound.`);
    return;
  }
  const { spec, proof } = construct(id, data.inventory, data.inputs, data.fullText);
  save(`${work}/${id}.author-assertions.json`, { figure: id, inputs: data.inputs,
    status: 'author-construction-not-independent-approval', proof, nativeAssertions: spec.assertions,
    sourceGroups: spec.source.inventory, minimumLabelPxAt331: 32 * 331 / 640,
    constructionNodes: 'Unlabelled0.2px nodes coincide with apparatus strokes; no new labelled source points.' });
  save(`${work}/${id}.initial.spec.json`, spec);
  save(`${work}/${id}.spec.json`, spec);
  currentInputs(data.inputs);
  console.log(JSON.stringify({ figure: id, spec: bind(`${work}/${id}.spec.json`) }));
}

function render(id, corrected = false) {
  const data = inputsFor(id), base = `${work}/${id}`;
  assert.equal(data.inventory.hardBlockers.length, 0);
  currentInputs(read(`${base}.context.json`).inputs);
  const commandFile = `${base}.${corrected ? 'corrected' : 'initial'}-render-command.json`;
  assert(!fs.existsSync(commandFile), 'This native attempt already ran.');
  if (corrected) {
    assert(fs.existsSync(`${base}.rejected-initial/preservation.json`));
    assert(!fs.existsSync(`${base}.repair-evidence.json`));
    assert.notEqual(bind(`${base}.initial.spec.json`).sha256, bind(`${base}.spec.json`).sha256);
  }
  const result = run('node', [renderer, '--spec', `${base}.spec.json`, '--svg', `${base}.svg`, '--png', `${base}.png`, '--report', `${base}.render.json`]);
  save(commandFile, result);
  const native = fs.existsSync(`${base}.render.json`) ? read(`${base}.render.json`) : null;
  const initial = corrected ? read(`${base}.attempts.json`) : null;
  save(`${base}.${corrected ? 'repair-evidence' : 'attempts'}.json`, {
    figure: id, initialRenderAttempts: 1, initialFailureCount: initial?.initialFailureCount ?? Number(result.exitCode !== 0),
    targetedRepairs: Number(corrected), maximumRepairs: 1, remainingRepairs: Number(!corrected),
    command: bind(commandFile), spec: bind(`${base}.spec.json`),
    nativeStatus: native?.status ?? 'not-rendered', nativeReport: native ? bind(`${base}.render.json`) : null,
    independentReview: 'pending-main-or-Mencius',
  });
  currentInputs(data.inputs);
  console.log(JSON.stringify({ figure: id, exitCode: result.exitCode, nativeStatus: native?.status,
    collisions: native?.collisions, stderr: result.stderr }));
  if (result.exitCode !== 0) process.exitCode = 1;
}

function preserve(id) {
  const base = `${work}/${id}`, dest = `${base}.rejected-initial`;
  assert(!fs.existsSync(dest) && !fs.existsSync(`${base}.repair-evidence.json`));
  const attempts = read(`${base}.attempts.json`);
  fs.mkdirSync(dest);
  const files = [];
  for (const suffix of ['spec.json', 'svg', 'png', 'render.json', 'attempts.json', 'initial-render-command.json',
    'preview-manifest.json', 'w640.png', 'w331.png', 'w342.png']) {
    const file = `${base}.${suffix}`;
    if (!fs.existsSync(file)) continue;
    fs.copyFileSync(file, `${dest}/${path.basename(file)}`, fs.constants.COPYFILE_EXCL);
    files.push(bind(`${dest}/${path.basename(file)}`));
  }
  save(`${dest}/preservation.json`, { id, files, initialFailureCount: attempts.initialFailureCount, maximumRepairs: 1 });
}

function correctAppearance(id) {
  assert(['fig-94', 'fig-97', 'fig-98'].includes(id));
  const base = `${work}/${id}`, data = inputsFor(id);
  assert(fs.existsSync(`${base}.rejected-initial/preservation.json`));
  assert(!fs.existsSync(`${base}.repair-evidence.json`) && !fs.existsSync(`${base}.correction.json`));
  const before = read(`${base}.initial.spec.json`);
  const { spec, proof } = construct(id, data.inventory, data.inputs, data.fullText);
  assert.deepEqual(spec.canvas, before.canvas);
  assert.deepEqual(spec.source, before.source);
  assert.deepEqual(spec.objects.map(obj => obj.id), before.objects.map(obj => obj.id));
  if (id !== 'fig-94') {
    assert.deepEqual(spec.assertions, before.assertions);
    const stripped = value => value.map(({ fillOpacity, opacity, ...obj }) => obj);
    assert.deepEqual(stripped(spec.objects), stripped(before.objects));
  } else {
    assert.deepEqual(spec.objects[0], before.objects[0]);
    assert.equal(spec.objects.length, before.objects.length);
  }
  fs.writeFileSync(`${base}.spec.json`, `${JSON.stringify(spec, null, 2)}\n`);
  save(`${base}.corrected-author-assertions.json`, { figure: id, inputs: data.inputs, proof,
    nativeAssertions: spec.assertions, sourceGroups: spec.source.inventory,
    status: 'author-construction-not-independent-approval', minimumLabelPxAt331: 32 * 331 / 640 });
  const defects = {
    'fig-94': 'Native raw pipe path covered native polygon collar centers. Draw the same six collar rectangles after the pipe in the native raw-path layer; retain exact coordinates, two collars and complete pipe.',
    'fig-97': 'Native polygon default0.15 fill left concrete almost indistinguishable from the empty steel cage. Set only three original concrete faces to fillOpacity1.',
    'fig-98': 'Native circle default0 fill made the rear rim visible through the ball. Set ball/ring fills opaque and remove the two artificial radial tessellation seams with border opacity0. Same ball, annulus, bore and coordinates.',
  };
  const initialManifest = read(`${base}.rejected-initial/${id}.preview-manifest.json`);
  save(`${base}.correction.json`, {
    figure: id, initialNativeFailureCount: 0, initialVisualFailureCount: 1,
    defect: defects[id], initialSpec: bind(`${base}.initial.spec.json`), correctedSpec: bind(`${base}.spec.json`),
    initialPreviewsActuallyOpened: initialManifest.previews.map(item => ({ path: `${base}.rejected-initial/${path.basename(item.path)}`,
      sha256: item.sha256, width: item.width, actuallyOpened: true })),
    correctedAssertions: bind(`${base}.corrected-author-assertions.json`), maximumRepairs: 1,
  });
  for (const suffix of ['preview-manifest.json', 'w640.png', 'w331.png', 'w342.png']) fs.unlinkSync(`${base}.${suffix}`);
}

function correct95Canvas() {
  const id = 'fig-95', base = `${work}/${id}`;
  const data = inputsFor(id);
  assert(fs.existsSync(`${base}.rejected-initial/preservation.json`));
  assert(!fs.existsSync(`${base}.repair-evidence.json`) && !fs.existsSync(`${base}.correction.json`));
  const before = read(`${base}.initial.spec.json`);
  assert.equal(before.canvas.height, 250);
  const { spec, proof } = construct(id, data.inventory, data.inputs, data.fullText);
  assert.equal(spec.canvas.height, 320);
  assert.deepEqual(spec.source, before.source);
  assert.deepEqual(spec.assertions, before.assertions);
  assert.deepEqual(spec.objects.map(({ id, type }) => ({ id, type })), before.objects.map(({ id, type }) => ({ id, type })));
  fs.writeFileSync(`${base}.spec.json`, `${JSON.stringify(spec, null, 2)}\n`);
  save(`${base}.corrected-author-assertions.json`, { figure: id, inputs: data.inputs, proof,
    nativeAssertions: spec.assertions, sourceGroups: spec.source.inventory,
    status: 'author-construction-not-independent-approval', minimumLabelPxAt331: 32 * 331 / 640 });
  save(`${base}.correction.json`, {
    figure: id, defect: 'Native draft schema requires canvas.height >=320; initial250px rejected before rendering.',
    onlyChange: 'Canvas250->320 and common35px drawing recenter; two layers, five stations, ten heads, Cu/Fe identities, source/context and native assertions unchanged.',
    initialSpec: bind(`${base}.initial.spec.json`), correctedSpec: bind(`${base}.spec.json`),
    correctedAssertions: bind(`${base}.corrected-author-assertions.json`), maximumRepairs: 1,
  });
}

async function previews(id) {
  const data = inputsFor(id), base = `${work}/${id}`;
  assert(!fs.existsSync(`${base}.preview-manifest.json`), 'No repeated preview generation.');
  const native = read(`${base}.render.json`);
  assert.equal(native.status, 'pass');
  verify(native.spec); verify(native.output.svg);
  const require = createRequire(path.resolve('.agents/skills/package.json'));
  const { chromium } = require('playwright-core');
  const executablePath = [chromium.executablePath(), '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(fs.existsSync);
  assert(executablePath, 'Existing native runtime only; no dependency install.');
  const browser = await chromium.launch({ executablePath, headless: true });
  const outputs = [];
  try {
    const page = await browser.newPage({ deviceScaleFactor: 1 });
    await page.route('**/*', route => route.abort());
    await page.setContent(`<style>html,body{margin:0;background:white}#media,svg{display:block}</style><div id="media">${fs.readFileSync(`${base}.svg`, 'utf8')}</div>`);
    const canvas = read(`${base}.spec.json`).canvas;
    for (const width of widths) {
      const height = canvas.height * width / 640;
      await page.setViewportSize({ width, height: Math.ceil(height) });
      await page.evaluate(({ width, height }) => {
        const media = document.querySelector('#media'), svg = document.querySelector('svg');
        media.style.width = `${width}px`; media.style.height = `${height}px`;
        svg.setAttribute('width', width); svg.setAttribute('height', height);
        svg.style.width = `${width}px`; svg.style.height = `${height}px`;
      }, { width, height });
      const metrics = await page.evaluate(() => {
        const box = document.querySelector('#media').getBoundingClientRect();
        return { width: box.width, height: box.height,
          horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
          labels: [...document.querySelectorAll('svg text')].map(node => {
            const m = node.getScreenCTM(), b = node.getBoundingClientRect();
            return { text: node.textContent, px: Number(node.getAttribute('font-size')) * Math.hypot(m.a, m.b),
              inside: b.left >= box.left && b.right <= box.right && b.top >= box.top && b.bottom <= box.bottom };
          }) };
      });
      assert.equal(metrics.width, width);
      assert(!metrics.horizontalOverflow && metrics.labels.every(label => label.px >= 16 && label.inside));
      const file = `${base}.w${width}.png`;
      assert(!fs.existsSync(file));
      await page.screenshot({ path: file, animations: 'disabled' });
      outputs.push({ ...bind(file), width, metrics });
    }
  } finally { await browser.close(); }
  currentInputs(data.inputs);
  save(`${base}.preview-manifest.json`, { figure: id, inputs: data.inputs,
    spec: bind(`${base}.spec.json`), context: bind(`${base}.context.json`), svg: bind(`${base}.svg`),
    nativeRender: bind(`${base}.render.json`), previews: outputs,
    isolatedNativePreview: true, browserClosed: true, networkDisabled: true, userBrowser: false,
    independentReview: 'pending-main-or-Mencius' });
  console.log(JSON.stringify({ figure: id, previews: outputs.map(({ path, sha256, width }) => ({ path, sha256, width })) }));
}

function recordObservations() {
  const notes = read(`${work}/author-observations.json`);
  for (const note of notes.figures) {
    const id = note.figure, base = `${work}/${id}`;
    const { inputs } = inputsFor(id);
    const manifest = read(`${base}.preview-manifest.json`);
    assert.deepEqual(note.actuallyOpenedWidths, widths);
    manifest.previews.forEach(verify);
    currentInputs(manifest.inputs);
    save(`${base}.author-pixel-observations.json`, {
      ...note, author: 'Einstein', role: notes.role, inputs,
      context: bind(`${base}.context.json`), spec: bind(`${base}.spec.json`),
      inspected: manifest.previews.map(item => ({
        path: item.path, sha256: item.sha256, width: item.width, actuallyOpened: true,
      })),
      manuallyAuthoredObservations: bind(`${work}/author-observations.json`),
      independentReview: 'pending-main-or-Mencius', nativeReviewRecorded: false, promoted: false,
    });
  }
}

function freeze() {
  const outputs = figures.map(({ id }) => {
    const data = inputsFor(id), base = `${work}/${id}`;
    const context = read(`${base}.context.json`);
    currentInputs(context.inputs);
    assert.equal(context.lessons[0].authoritativeText, data.fullText);
    assert.deepEqual(context.lessons[0].fullProse, data.lesson.prose);
    if (fs.existsSync(`${base}.blocked-author.json`)) {
      const blocked = read(`${base}.blocked-author.json`);
      return { ...blocked, evidence: bind(`${base}.blocked-author.json`) };
    }
    const spec = read(`${base}.spec.json`), native = read(`${base}.render.json`);
    assert.equal(spec.source.authoritativeText[0].text, data.fullText);
    verify(native.spec); verify(native.output.svg);
    const manifest = read(`${base}.preview-manifest.json`);
    manifest.previews.forEach(verify);
    const observations = read(`${base}.author-pixel-observations.json`);
    assert.deepEqual(observations.inspected.map(item => item.width), widths);
    for (const item of observations.inspected) { verify(item); assert.equal(item.actuallyOpened, true); }
    const initial = read(`${base}.attempts.json`);
    const repair = fs.existsSync(`${base}.repair-evidence.json`) ? read(`${base}.repair-evidence.json`) : null;
    const repairs = repair?.targetedRepairs ?? initial.targetedRepairs;
    assert(repairs <= 1);
    return { figure: id, status: observations.hardBlockers.length ? 'author-blocked' : 'author-frozen-independent-review-pending',
      inputs: data.inputs, fullAuthoritativeTextSha256: hash(data.fullText),
      context: bind(`${base}.context.json`), spec: bind(`${base}.spec.json`), initialSpec: bind(`${base}.initial.spec.json`),
      nativeRender: bind(`${base}.render.json`), nativeStatus: native.status,
      svg: bind(`${base}.svg`), canvasPng: bind(`${base}.png`),
      authorAssertions: bind(`${base}.${repair ? 'corrected-author-assertions' : 'author-assertions'}.json`),
      previewManifest: bind(`${base}.preview-manifest.json`), previews: manifest.previews,
      authorPixelObservations: bind(`${base}.author-pixel-observations.json`),
      initialNativeFailureCount: initial.initialFailureCount,
      initialVisualFailureCount: repair && id !== 'fig-95' ? 1 : 0,
      targetedRepairs: repairs, maximumRepairs: 1,
      remainingRepairs: 1 - repairs, hardBlockers: observations.hardBlockers,
      correction: repair ? bind(`${base}.correction.json`) : null,
      repairEvidence: repair ? bind(`${base}.repair-evidence.json`) : null,
      independentReview: 'pending-main-or-Mencius', promoted: false };
  });
  const output = `${tmp}/d017-n55-figures-author-freeze.json`;
  save(output, { ticket: 'STEMROBIN-181', batch: 'D017', author: 'Einstein',
    lesson: lessonId, status: outputs.some(item => item.status.startsWith('author-blocked'))
      ? 'author-frozen-with-source-blocker' : 'author-frozen-independent-review-pending',
    figures: outputs, helper: bind(`${work}/author.mjs`), sourceObservations: bind(`${work}/source-observations.json`),
    renderer: bind(renderer), contextAPI: bind('.agents/skills/ld-s10y-image/scripts/build_context.py'),
    actualWidths: widths, modelWidth: 640, labelPxWherePresent: 32, minimumDisplayedTextPx: 16,
    maximumNativeOrVisualRepairsPerFigure: 1, modelCalls: 0, newExpenseUsd: 0,
    nativeReviewRecordedByAuthor: false, independentReview: 'pending-main-or-Mencius', promoted: false,
    inFlightProcesses: [],
    limits: 'Owned author scratch only. No D016 change, source/prose/tool/app/dependency/DB/git change, network, user-browser/batch check, independent review, promotion, native review recording or finalize.' });
  console.log(JSON.stringify(bind(output)));
}

if (command === 'plan') plan(requested);
else if (command === 'render') render(requested);
else if (command === 'preserve') preserve(requested);
else if (command === 'correct-95-canvas') correct95Canvas();
else if (command === 'correct-appearance') correctAppearance(requested);
else if (command === 'repair-render') render(requested, true);
else if (command === 'previews') await previews(requested);
else if (command === 'record-author-observations') recordObservations();
else if (command === 'freeze') freeze();
else throw new Error('Use plan/render/preserve/repair-render/previews/freeze; figures92-98 only.');

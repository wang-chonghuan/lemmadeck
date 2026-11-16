import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const work = '.tmp/STEMROBIN-181/9p-d017-t4-figures';
const ticket = '.intentfold/tickets/STEMROBIN-181/tmp';
const lessonId = 'phy9-c1-s7-t4';
const folder = `.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/${lessonId}`;
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python';
const renderer = '.agents/skills/ld-s10y-image/scripts/render_spec.mjs';
const inventoryPath = `${ticket}/d017-t4-figure-source-inventory.json`;
const widths = [640, 331, 342];
const ids = ['fig-101', 'fig-102'];
const [command, id] = process.argv.slice(2);
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bind = file => ({ path: file, sha256: hash(fs.readFileSync(file)) });
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const verify = binding => assert.equal(bind(binding.path).sha256, binding.sha256, `Byte drift: ${binding.path}`);
const save = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
const env = { ...process.env, PYTHON: path.resolve(python), PYTHONDONTWRITEBYTECODE: '1', PLAYWRIGHT_HTML_OPEN: 'never' };
delete env.PWDEBUG;
const run = (executable, args, input) => {
  const result = spawnSync(executable, args, { env, input, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
  return { executable, args, exitCode: result.status, signal: result.signal, stdout: result.stdout, stderr: result.stderr };
};

function inputsFor(figure) {
  assert(ids.includes(figure), 'Own101/102 only.');
  const inventory = read(inventoryPath).figures.find(item => item.id === figure);
  verify(inventory.source); verify(inventory.sourcePage);
  assert.equal(inventory.source.actuallyOpened, true);
  assert.equal(inventory.hardSourceBlockers.length, 0);
  const freezePath = `${ticket}/9p-t4-prose-freeze.json`;
  const sciencePath = `${ticket}/9p-t4-science-review.json`;
  const frozen = read(freezePath), science = read(sciencePath);
  assert.equal(science.status, 'pass');
  assert.equal(science.lesson, lessonId);
  for (const key of ['template', 'source', 'exercisesTemplate', 'exercisesSource', 'authorFreeze']) {
    verify(science.bindings[key]);
  }
  Object.values(frozen.templates).forEach(verify);
  const lesson = read(`${folder}/lesson.template.json`);
  const exercises = read(`${folder}/exercises.template.json`);
  assert.equal(lesson.id, lessonId);
  assert.equal(exercises.lesson, lessonId);
  assert.deepEqual(exercises.source.data, read(science.bindings.exercisesSource.path));
  assert.equal(exercises.exercises.length, frozen.counts.modern_written_tasks);
  const sourceCount = read(science.bindings.exercisesSource.path).exercises.length;
  assert.equal(exercises.exercises.length, sourceCount);
  const owner = exercises.exercises.find(item => item.figure_refs.includes(figure));
  assert(owner);
  const fullText = [lesson.printed_title, ...exercises.exercises.map(item => item.text)].join('\n\n');
  const authoritativeText = exercises.exercises.map(item => ({ lesson: lessonId, exercise: item.number, text: item.text }));
  const inputs = {
    lessonTemplate: bind(`${folder}/lesson.template.json`),
    exercisesTemplate: bind(`${folder}/exercises.template.json`),
    figuresTemplate: bind(`${folder}/figures.template.json`),
    sourceLesson: bind(science.bindings.source.path), sourceExercises: bind(science.bindings.exercisesSource.path),
    proseFreeze: bind(freezePath), scienceReview: bind(sciencePath),
    sourceImage: bind(inventory.source.path), sourcePage: bind(inventory.sourcePage.path),
    sourceInventory: bind(inventoryPath),
  };
  return { inventory, lesson, exercises, owner, fullText, authoritativeText, inputs };
}
const currentInputs = inputs => Object.values(inputs).forEach(verify);

function context(figure, data) {
  const result = run(python, ['-B', '-c', `
import json,sys
from pathlib import Path
sys.path.insert(0,'.agents/skills/ld-s10y-image/scripts')
import build_context as B
p=json.load(sys.stdin)
image=Path(p['inputs']['sourceImage']['path'])
assert B.sha256(image)==p['inputs']['sourceImage']['sha256']
w,h=B.png_size(image)
near=B.exercise_context(p['exercises']['exercises'],p['figure'])
assert near
print(json.dumps({
 'schema':'ld-s10y-image/context@1','book':'9p','edition':'modern-us-neutral','figure':p['figure'],
 'sourceImage':dict(p['inputs']['sourceImage'],width=w,height=h),'suggestedSize':B.suggested_size(w,h),
 'authoritativeRule':'Complete current frozen t4 title and all seven modern tasks, including all SCI model and safety constraints. Original PNG supplies static uncalibrated geometry/topology. No answer key, coefficient-order label, bent alternative, heat/current state or particle animation.',
 'lessons':[{'lesson':p['lesson']['id'],'title':p['lesson']['printed_title'],'prose':[],
 'exercises':near,'allExercises':p['exercises']['exercises'],'authoritativeText':p['fullText']}],
 'inputs':p['inputs'],'construction':'Existing native build_context exercise_context API with current author-frozen scratch templates.'
},ensure_ascii=False))
`], JSON.stringify({ figure, ...data }));
  assert.equal(result.exitCode, 0, result.stderr);
  save(`${work}/${figure}.context.json`, JSON.parse(result.stdout));
}

const cross = (a, b) => a[0] * b[1] - a[1] * b[0];
const subtract = (a, b) => [a[0] - b[0], a[1] - b[1]];
const interpolate = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

function construct(figure, data) {
  const height = figure === 'fig-101' ? 580 : 360;
  const spec = {
    schema: 'ld-s10y-image/figure-spec@2', id: figure, mode: 'deterministic',
    description: figure === 'fig-101'
      ? 'One uncalibrated circular disk with an upward missing sector, common radial apex, material hatching and a phi angle indicator. No numerical angle, dimension, center label, heated outline or answer. Modern regularization: clean circular contour and even material-hatch spacing, not source measurements.'
      : 'One static uncalibrated thermostat circuit: two left AC terminals, contact from above onto the free left-side portion of a straight bonded two-layer strip, right connected/fixed end and one series heater. Upper layer plain, lower layer hatched; only Heater and the AC mark are printed labels. No coefficient ranking, metal identities, bent alternative or inferred current/temperature state. Modern regularization: clean orthogonal wiring and uniform material-fill strokes.',
    source: { image: data.inputs.sourceImage, authoritativeText: data.authoritativeText, inventory: [] },
    canvas: { width: 640, height, boundingBox: [0, height, 640, 0], background: 'paper', keepAspectRatio: true },
    display: { purpose: 'instructional', layout: 'inline', maxWidthPx: 640, minTextPx: 16, widths },
    objects: [], assertions: [], layout: { minLabelGap: 4 },
  };
  const positions = new Map();
  const at = ([x, y]) => [x, height - y];
  const group = (name, description, relationships = false) => {
    const value = { id: name, description, objects: [], assertions: [], ...(relationships ? { requires: ['pointRelationships'] } : {}) };
    spec.source.inventory.push(value);
    return value;
  };
  const add = (object, g) => { spec.objects.push(object); g?.objects.push(object.id); return object.id; };
  const claim = (value, g) => { spec.assertions.push(value); g?.assertions.push(value.id); };
  const point = (name, p, g) => {
    positions.set(name, p);
    return add({ id: name, type: 'point', at: at(p), visible: true, label: '',
      size: 0.2, fill: 'ink', stroke: 'ink', strokeWidth: 0.2 }, g);
  };
  const resolve = p => typeof p === 'string' ? p : at(p);
  const line = (name, a, b, g, style = {}) => add({
    id: name, type: 'segment', from: resolve(a), to: resolve(b), stroke: 'ink', strokeWidth: 3, ...style,
  }, g);
  const join = (name, a, b, g, style = {}) => {
    line(name, a, b, g, style);
    claim({ id: `${name}-connects`, type: 'connects', arrow: name, from: a, to: b }, g);
  };
  const polygon = (name, points, g, fill = 'paper', style = {}) => add({
    id: name, type: 'polygon', points: points.map(resolve), fill, fillOpacity: 1,
    stroke: 'ink', strokeWidth: 3, ...style,
  }, g);
  const circle = (name, center, radius, g) => add({
    id: name, type: 'circle', center: resolve(center), radius, stroke: 'ink',
    strokeWidth: 3, fill: 'paper', fillOpacity: 0,
  }, g);
  const text = (name, p, value, g) => add({
    id: name, type: 'text', at: at(p), text: value, fontSize: 32, fontWeight: 500,
    labelPlacement: { position: 'CENTER' },
  }, g);
  const displacement = (name, a, b, g) => {
    const pa = positions.get(a), pb = positions.get(b);
    claim({ id: name, type: 'displacement', from: a, to: b, dx: pb[0] - pa[0], dy: pa[1] - pb[1] }, g);
  };
  let proof;
  if (figure === 'fig-101') {
    const disk = group('source-disk-with-one-open-sector', 'One circular remainder, two radii meeting at the common apex and an upward open missing sector; no measured angle or center label.', true);
    const center = [320, 290], radius = 222, leftAngle = -112, rightAngle = -73;
    const position = (r, degrees) => {
      const a = degrees * Math.PI / 180;
      return [center[0] + r * Math.cos(a), center[1] + r * Math.sin(a)];
    };
    const left = position(radius, leftAngle), right = position(radius, rightAngle);
    point('source-common-apex', center, disk);
    point('source-left-sector-edge-end', left, disk);
    point('source-right-sector-edge-end', right, disk);
    const contour = Array.from({ length: 129 }, (_, i) =>
      position(radius, leftAngle - (360 - (rightAngle - leftAngle)) * i / 128));
    polygon('source-circular-disk-remainder', [center, ...contour], disk);
    join('source-left-sector-radius', 'source-common-apex', 'source-left-sector-edge-end', disk);
    join('source-right-sector-radius', 'source-common-apex', 'source-right-sector-edge-end', disk);
    for (const point of ['source-left-sector-edge-end', 'source-right-sector-edge-end']) {
      claim({ id: `${point}-on-source-circle`, type: 'pointOnCircle', point, center: 'source-common-apex', radius }, disk);
    }
    assert(contour.every(p => Math.abs(Math.hypot(...subtract(p, center)) - radius) < 1e-8));
    assert(Math.hypot(...subtract(contour[0], left)) < 1e-8 && Math.hypot(...subtract(contour.at(-1), right)) < 1e-8);
    const inWedge = p => {
      const angle = Math.atan2(p[1] - center[1], p[0] - center[0]) * 180 / Math.PI;
      return angle > leftAngle + 1e-8 && angle < rightAngle - 1e-8;
    };
    const fill = group('source-material-hatching-not-a-grid', 'Diagonal fill belongs only to the remaining disk. Hatch spacing is a clean modern fill convention, never calibrated source intervals.');
    const pieces = [], rootTwo = Math.sqrt(2);
    for (let offset = -210; offset <= 210; offset += 18) {
      const extent = Math.sqrt(radius * radius - offset * offset);
      const base = [center[0] + offset / rootTwo, center[1] + offset / rootTwo];
      const a = [base[0] - extent / rootTwo, base[1] + extent / rootTwo];
      const b = [base[0] + extent / rootTwo, base[1] - extent / rootTwo];
      const direction = subtract(b, a), cuts = [0, 1];
      for (const edge of [left, right]) {
        const ray = subtract(edge, center), denominator = cross(direction, ray);
        if (Math.abs(denominator) < 1e-9) continue;
        const delta = subtract(center, a);
        const t = cross(delta, ray) / denominator, u = cross(delta, direction) / denominator;
        if (t > 0 && t < 1 && u >= 0 && u <= 1) cuts.push(t);
      }
      cuts.sort((a, b) => a - b);
      for (let i = 1; i < cuts.length; i++) {
        if (cuts[i] - cuts[i - 1] < 1e-8) continue;
        if (inWedge(interpolate(a, b, (cuts[i] + cuts[i - 1]) / 2))) continue;
        const from = interpolate(a, b, cuts[i - 1]), to = interpolate(a, b, cuts[i]);
        line(`source-material-hatch-${pieces.length + 1}`, from, to, fill, { stroke: 'muted', strokeWidth: 1.7 });
        pieces.push({ from, to });
      }
    }
    assert(pieces.length > 0);
    for (const piece of pieces) {
      for (const t of [0.01, 0.25, 0.5, 0.75, 0.99]) {
        const p = interpolate(piece.from, piece.to, t);
        assert(Math.hypot(...subtract(p, center)) <= radius + 1e-8 && !inWedge(p));
      }
    }
    const marker = group('source-phi-angle-indicator', 'Phi above a short double-ended angle arc within the single missing sector; no numerical angle or thermal-change annotation.', true);
    marker.objects.push('source-common-apex');
    const markerRadius = 146;
    const markerLeft = position(markerRadius, leftAngle), markerRight = position(markerRadius, rightAngle);
    point('source-phi-left-end', markerLeft, marker);
    point('source-phi-right-end', markerRight, marker);
    add({ id: 'source-phi-angle-arc', type: 'arc', center: 'source-common-apex',
      start: 'source-phi-right-end', end: 'source-phi-left-end', stroke: 'ink', strokeWidth: 3 }, marker);
    for (const [side, angle, p, direction] of [['left', leftAngle, markerLeft, 1], ['right', rightAngle, markerRight, -1]]) {
      const theta = angle * Math.PI / 180;
      const tangent = [-Math.sin(theta), Math.cos(theta)];
      const tail = [p[0] + direction * tangent[0] * 12, p[1] + direction * tangent[1] * 12];
      point(`source-phi-${side}-head-tail`, tail, marker);
      const arrow = `source-phi-${side}-head`;
      add({ id: arrow, type: 'arrow', from: `source-phi-${side}-head-tail`, to: `source-phi-${side}-end`,
        stroke: 'ink', strokeWidth: 2.5 }, marker);
      claim({ id: `${arrow}-connects`, type: 'connects', arrow,
        from: `source-phi-${side}-head-tail`, to: `source-phi-${side}-end` }, marker);
      claim({ id: `source-phi-${side}-on-angle-arc`, type: 'pointOnCircle',
        point: `source-phi-${side}-end`, center: 'source-common-apex', radius: markerRadius }, marker);
    }
    text('source-phi-label', [320, 108], '\u03c6', marker);
    proof = {
      disks: 1, removedSectors: 1, sharedApex: center, contourRadiusDrawingPx: radius,
      sectorBoundaryDrawingAngles: [leftAngle, rightAngle], contour, hatchPieces: pieces,
      contourAllOnOneCircle: true, fillClippedToCircleAndOutOfMissingSector: true,
      angleMarkerRadiusDrawingPx: markerRadius, printedNumericAngle: null,
      calibration: 'Drawing-space circular regularization only, not a measured source angle or a physical quantity.',
      extraCenterLabelOrDot: false, addedHeatedState: false,
    };
  } else {
    const terminals = group('source-two-ac-terminals', 'Two open left terminals and the printed AC mark between them; no battery, voltage number or source-body addition.', true);
    point('source-upper-terminal-wire-end', [64, 112], terminals);
    point('source-lower-terminal-wire-end', [64, 223], terminals);
    circle('source-upper-ac-terminal', [64, 120], 8, terminals);
    circle('source-lower-ac-terminal', [64, 215], 8, terminals);
    line('source-upper-terminal-slash', [54, 130], [74, 110], terminals, { strokeWidth: 2.5 });
    line('source-lower-terminal-slash', [54, 225], [74, 205], terminals, { strokeWidth: 2.5 });
    text('source-ac-mark', [64, 167], '~', terminals);
    displacement('source-two-separated-left-terminal-wire-ends', 'source-upper-terminal-wire-end', 'source-lower-terminal-wire-end', terminals);
    claim({ id: 'source-upper-terminal-rim-connection', type: 'pointOnCircle', point: 'source-upper-terminal-wire-end', center: at([64, 120]), radius: 8 }, terminals);
    claim({ id: 'source-lower-terminal-rim-connection', type: 'pointOnCircle', point: 'source-lower-terminal-wire-end', center: at([64, 215]), radius: 8 }, terminals);
    const contact = group('source-upper-wire-and-contact-over-free-part', 'Upper terminal wire turns across the top and descends to a contact on top of the straight strip, to the left of the right connected/fixed end. Strip extends left of the contact.', true);
    contact.objects.push('source-upper-terminal-wire-end');
    point('source-top-left-turn', [64, 42], contact);
    point('source-top-right-turn', [464, 42], contact);
    point('source-contact-base', [464, 116], contact);
    point('source-contact-tip', [464, 134], contact);
    point('source-strip-upper-left', [350, 134], contact);
    point('source-strip-upper-right', [580, 134], contact);
    join('source-upper-terminal-rise', 'source-upper-terminal-wire-end', 'source-top-left-turn', contact);
    join('source-top-horizontal-wire', 'source-top-left-turn', 'source-top-right-turn', contact);
    join('source-contact-vertical-wire', 'source-top-right-turn', 'source-contact-base', contact);
    polygon('source-upper-contact-tip', [[457, 116], [471, 116], 'source-contact-tip'], contact, 'ink', { strokeWidth: 1 });
    claim({ id: 'source-contact-tip-aligned-with-upper-wire', type: 'collinear', a: 'source-top-right-turn', b: 'source-contact-base', c: 'source-contact-tip' }, contact);
    claim({ id: 'source-contact-meets-upper-layer-outline', type: 'pointOnLine', point: 'source-contact-tip', a: 'source-strip-upper-left', b: 'source-strip-upper-right' }, contact);
    const layers = group('source-two-straight-bonded-layers', 'Unhatched upper rectangle and diagonally hatched lower rectangle share one horizontal interface; neither layer has a metal name or coefficient label.');
    const upper = [[350, 134], [580, 134], [580, 154], [350, 154]];
    const lower = [[350, 154], [580, 154], [580, 174], [350, 174]];
    polygon('source-upper-layer', upper, layers);
    polygon('source-lower-layer', lower, layers);
    line('source-layer-interface', [350, 154], [580, 154], layers);
    claim({ id: 'source-upper-layer-horizontal-and-bonded', type: 'parallel', a: at(upper[0]), b: at(upper[1]), c: at(lower[0]), d: at(lower[1]) }, layers);
    claim({ id: 'source-lower-layer-horizontal-and-bonded', type: 'parallel', a: at(lower[0]), b: at(lower[1]), c: at(lower[3]), d: at(lower[2]) }, layers);
    const lowerHatches = [];
    for (let x = 330; x < 580; x += 16) {
      const start = [Math.max(x, 350), 174 - Math.max(350 - x, 0)];
      const end = [Math.min(x + 20, 580), 154 + Math.max(x + 20 - 580, 0)];
      if (end[0] <= start[0]) continue;
      assert(start[0] >= 350 && end[0] <= 580 && start[1] >= 154 && end[1] <= 174);
      line(`source-lower-layer-hatch-${lowerHatches.length + 1}`, start, end, layers, { strokeWidth: 1.8 });
      lowerHatches.push({ start, end });
    }
    const right = group('source-right-fixed-connection-to-series-heater', 'The strip right-end connection goes right, down, then left to the heater. No separate mechanical wall or invented clamp.', true);
    point('source-right-strip-connection', [580, 154], right);
    point('source-right-upper-turn', [610, 154], right);
    point('source-right-lower-turn', [610, 300], right);
    point('source-heater-right-port', [320, 300], right);
    join('source-strip-right-connection-wire', 'source-right-strip-connection', 'source-right-upper-turn', right);
    join('source-right-vertical-return', 'source-right-upper-turn', 'source-right-lower-turn', right);
    join('source-right-bottom-heater-wire', 'source-right-lower-turn', 'source-heater-right-port', right);
    const heater = group('source-one-series-heater', 'One bottom rectangular heater, with the source heater label translated to Heater. No rating or solution label.', true);
    heater.objects.push('source-heater-right-port');
    point('source-heater-left-port', [135, 300], heater);
    polygon('source-heater-body', [[135, 270], [320, 270], [320, 330], [135, 330]], heater);
    text('source-heater-label', [227.5, 300], 'Heater', heater);
    displacement('source-heater-opposite-midpoint-ports', 'source-heater-left-port', 'source-heater-right-port', heater);
    claim({ id: 'source-heater-label-inside-symbol', type: 'inside', point: 'source-heater-label', container: 'source-heater-body', margin: 8 }, heater);
    const back = group('source-heater-left-return-to-lower-terminal', 'Heater left port returns to the lower AC terminal; one series route only, with no added bypass or parallel heater.', true);
    back.objects.push('source-heater-left-port', 'source-lower-terminal-wire-end');
    point('source-left-lower-turn', [64, 300], back);
    join('source-heater-left-wire', 'source-heater-left-port', 'source-left-lower-turn', back);
    join('source-lower-terminal-return', 'source-left-lower-turn', 'source-lower-terminal-wire-end', back);
    assert(350 < 464 && 464 < 580);
    assert.equal(upper[2][1], lower[1][1]);
    assert.equal(spec.objects.filter(obj => obj.type === 'circle').length, 2);
    proof = {
      acTerminals: 2, upperContacts: 1, layers: 2, heaters: 1, sourceViews: 1,
      freeStripLeftDrawingX: 350, contactDrawingX: 464, fixedRightDrawingX: 580,
      contactOverFreePortionNotExtremeTip: true, upperPlainLowerHatched: true, lowerHatches,
      topology: ['upperAC -> topWire -> upperContact -> bondedStripRight',
        'bondedStripRight -> rightReturn -> heaterRight',
        'heaterLeft -> lowerLeftReturn -> lowerAC'],
      parallelHeaterBranches: 0, metalOrCoefficientLabelsAdded: [],
      sourceContactSymbolNotCurrentArrow: true, addedBentOrThermalState: false,
      particleOrCurrentAnimation: false, calibration: 'No physical circuit value or thermal state is supplied.',
    };
  }
  const expectedLabels = figure === 'fig-101' ? ['\u03c6'] : ['~', 'Heater'];
  assert.deepEqual(spec.objects.filter(obj => obj.type === 'text').map(obj => obj.text), expectedLabels);
  assert(spec.objects.filter(obj => obj.type === 'text').every(obj => obj.fontSize === 32 && !/[\u0400-\u04ff\u3400-\u9fff]/u.test(obj.text)));
  return { spec, proof };
}

function plan(figure) {
  const data = inputsFor(figure), base = `${work}/${figure}`;
  assert(!fs.existsSync(`${base}.context.json`), 'Do not repeat initial author plan.');
  context(figure, data);
  const { spec, proof } = construct(figure, data);
  save(`${base}.author-assertions.json`, { figure, inputs: data.inputs, proof,
    nativeAssertions: spec.assertions, sourceGroups: spec.source.inventory,
    status: 'author-construction-only-not-independent-approval',
    sourceInventory: bind(inventoryPath), minimumLabelPxAt331: 32 * 331 / 640,
    constructionNodes: 'Unlabelled0.2px nodes sit on source stroke junctions, not added data-point/center labels.',
  });
  save(`${base}.initial.spec.json`, spec);
  save(`${base}.spec.json`, spec);
  currentInputs(data.inputs);
  console.log(JSON.stringify({ figure, context: bind(`${base}.context.json`), spec: bind(`${base}.spec.json`) }));
}

function render(figure, corrected = false) {
  const data = inputsFor(figure), base = `${work}/${figure}`;
  currentInputs(read(`${base}.context.json`).inputs);
  const commandFile = `${base}.${corrected ? 'corrected' : 'initial'}-render-command.json`;
  assert(!fs.existsSync(commandFile), 'This native render attempt already ran.');
  if (corrected) {
    assert(fs.existsSync(`${base}.rejected-initial/preservation.json`));
    assert(fs.existsSync(`${base}.correction.json`) && !fs.existsSync(`${base}.repair-evidence.json`));
    assert.notEqual(bind(`${base}.spec.json`).sha256, bind(`${base}.initial.spec.json`).sha256);
  }
  const result = run('node', [renderer, '--spec', `${base}.spec.json`, '--svg', `${base}.svg`, '--png', `${base}.png`, '--report', `${base}.render.json`]);
  save(commandFile, result);
  const native = fs.existsSync(`${base}.render.json`) ? read(`${base}.render.json`) : null;
  const initial = corrected ? read(`${base}.attempts.json`) : null;
  save(`${base}.${corrected ? 'repair-evidence' : 'attempts'}.json`, {
    figure, initialRenderAttempts: 1, initialNativeFailureCount: initial?.initialNativeFailureCount ?? Number(result.exitCode !== 0),
    targetedRepairs: Number(corrected), maximumRepairs: 1, remainingRepairs: Number(!corrected),
    command: bind(commandFile), spec: bind(`${base}.spec.json`),
    nativeStatus: native?.status ?? 'not-rendered', nativeRender: native ? bind(`${base}.render.json`) : null,
    independentReview: 'pending-main-or-Mencius',
  });
  currentInputs(data.inputs);
  console.log(JSON.stringify({ figure, exitCode: result.exitCode, nativeStatus: native?.status, collisions: native?.collisions, stderr: result.stderr }));
  if (result.exitCode !== 0) process.exitCode = 1;
}

function preserve(figure) {
  const base = `${work}/${figure}`, dest = `${base}.rejected-initial`;
  assert(!fs.existsSync(dest) && !fs.existsSync(`${base}.repair-evidence.json`));
  fs.mkdirSync(dest);
  const files = [];
  for (const suffix of ['spec.json', 'svg', 'png', 'render.json', 'initial-render-command.json', 'attempts.json',
    'preview-manifest.json', 'w640.png', 'w331.png', 'w342.png']) {
    const from = `${base}.${suffix}`;
    if (!fs.existsSync(from)) continue;
    const to = `${dest}/${path.basename(from)}`;
    fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
    assert.equal(bind(from).sha256, bind(to).sha256);
    files.push(bind(to));
  }
  save(`${dest}/preservation.json`, { figure, files, maximumRepairs: 1, independentReview: 'not-performed' });
}

function correctShortAngleHeads(figure) {
  assert.equal(figure, 'fig-101', 'Only the observed101 marker failure is authorized.');
  const base = `${work}/${figure}`;
  assert(fs.existsSync(`${base}.rejected-initial/preservation.json`));
  assert(!fs.existsSync(`${base}.correction.json`) && !fs.existsSync(`${base}.repair-evidence.json`));
  const attempts = read(`${base}.attempts.json`);
  assert.equal(attempts.initialNativeFailureCount, 1);
  const command = read(`${base}.initial-render-command.json`);
  assert(command.stderr.includes('Unsupported arrow marker aspect ratio:'));
  const spec = read(`${base}.initial.spec.json`);
  const marker = spec.source.inventory.find(group => group.id === 'source-phi-angle-indicator');
  const triangles = [];
  for (const side of ['left', 'right']) {
    const head = spec.objects.find(object => object.id === `source-phi-${side}-head`);
    assert.equal(head.type, 'arrow');
    const tip = spec.objects.find(object => object.id === head.to).at;
    const tail = spec.objects.find(object => object.id === head.from).at;
    const delta = subtract(tail, tip);
    const length = Math.hypot(...delta);
    assert(Math.abs(length - 12) < 1e-8);
    const normal = [-delta[1] / length, delta[0] / length];
    const vertices = [
      tip,
      [tail[0] + 3 * normal[0], tail[1] + 3 * normal[1]],
      [tail[0] - 3 * normal[0], tail[1] - 3 * normal[1]],
    ];
    head.type = 'segment';
    const triangle = {
      id: `source-phi-${side}-native-triangle`, type: 'polygon',
      points: vertices, fill: 'ink', fillOpacity: 1, stroke: 'ink', strokeWidth: 0.5,
    };
    spec.objects.splice(spec.objects.indexOf(head) + 1, 0, triangle);
    marker.objects.push(triangle.id);
    assert.deepEqual(triangle.points[0], tip);
    triangles.push({ side, tip, baseCenter: tail, vertices, sourceAngleEndpointUnchanged: true });
  }
  assert.deepEqual(spec.assertions, read(`${base}.initial.spec.json`).assertions);
  fs.writeFileSync(`${base}.spec.json`, `${JSON.stringify(spec, null, 2)}\n`);
  const originalProof = read(`${base}.author-assertions.json`);
  save(`${base}.corrected-author-assertions.json`, {
    ...originalProof,
    proof: { ...originalProof.proof, shortAngleHeads: triangles,
      correctionScope: 'Marker-free native triangle heads on unchanged angle endpoints only.' },
    sourceGroups: spec.source.inventory,
    correctedSpec: bind(`${base}.spec.json`),
    initialAuthorAssertions: bind(`${base}.author-assertions.json`),
  });
  save(`${base}.correction.json`, {
    figure, initialNativeFailureCount: 1, initialVisualFailureCount: 0,
    targetedRepairs: 1, maximumRepairs: 1, remainingRepairs: 0,
    failure: 'Native export rejected the short phi-arrow marker aspect ratio before producing media.',
    change: 'Replace exactly two short arrow objects with native segments and filled triangular heads at their unchanged endpoints. Preserve circle, sector, hatching, phi arc, labels and all source relationships.',
    initialCommand: bind(`${base}.initial-render-command.json`),
    preservation: bind(`${base}.rejected-initial/preservation.json`),
    initialSpec: bind(`${base}.initial.spec.json`), correctedSpec: bind(`${base}.spec.json`),
    authorAssertions: bind(`${base}.corrected-author-assertions.json`),
    independentReview: 'pending-main-or-Mencius',
  });
  console.log(JSON.stringify({ figure, correctedSpec: bind(`${base}.spec.json`), targetedRepairs: 1, remainingRepairs: 0 }));
}

async function previews(figure) {
  const data = inputsFor(figure), base = `${work}/${figure}`;
  assert(!fs.existsSync(`${base}.preview-manifest.json`), 'No repeated preview generation.');
  const native = read(`${base}.render.json`);
  assert.equal(native.status, 'pass');
  verify(native.spec); verify(native.output.svg);
  const require = createRequire(path.resolve('.agents/skills/package.json'));
  const { chromium } = require('playwright-core');
  const executablePath = [chromium.executablePath(), '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(fs.existsSync);
  assert(executablePath, 'Existing native runtime only.');
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
        const b = document.querySelector('#media').getBoundingClientRect();
        return { width: b.width, height: b.height, horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
          labels: [...document.querySelectorAll('svg text')].map(node => {
            const m = node.getScreenCTM(), r = node.getBoundingClientRect();
            return { text: node.textContent, px: Number(node.getAttribute('font-size')) * Math.hypot(m.a, m.b),
              inside: r.left >= b.left && r.right <= b.right && r.top >= b.top && r.bottom <= b.bottom };
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
  save(`${base}.preview-manifest.json`, {
    figure, inputs: data.inputs, source: data.inputs.sourceImage,
    spec: bind(`${base}.spec.json`), context: bind(`${base}.context.json`),
    svg: bind(`${base}.svg`), nativeRender: bind(`${base}.render.json`), previews: outputs,
    isolatedNativePreview: true, browserClosed: true, networkDisabled: true, userBrowser: false,
    independentReview: 'pending-main-or-Mencius',
  });
  console.log(JSON.stringify({ figure, previews: outputs.map(({ path, sha256, width }) => ({ path, sha256, width })) }));
}

function recordObservations() {
  const notes = read(`${work}/author-observations.json`);
  for (const note of notes.figures) {
    const base = `${work}/${note.figure}`, data = inputsFor(note.figure);
    const manifest = read(`${base}.preview-manifest.json`);
    manifest.previews.forEach(verify);
    assert.deepEqual(note.actuallyOpenedWidths, widths);
    save(`${base}.author-pixel-observations.json`, { ...note, inputs: data.inputs,
      author: 'Einstein', role: 'Author observations only, not an independent figure/SCI gate',
      source: data.inputs.sourceImage, context: bind(`${base}.context.json`), spec: bind(`${base}.spec.json`),
      inspected: manifest.previews.map(item => ({ path: item.path, sha256: item.sha256, width: item.width, actuallyOpened: true })),
      manuallyAuthoredObservations: bind(`${work}/author-observations.json`),
      independentReview: 'pending-main-or-Mencius', nativeReviewRecorded: false, promoted: false,
    });
  }
}

function freeze() {
  const outputs = ids.map(figure => {
    const data = inputsFor(figure), base = `${work}/${figure}`;
    const context = read(`${base}.context.json`), spec = read(`${base}.spec.json`);
    currentInputs(context.inputs);
    assert.equal(context.lessons[0].authoritativeText, data.fullText);
    assert.deepEqual(context.lessons[0].allExercises, data.exercises.exercises);
    assert.deepEqual(spec.source.authoritativeText, data.authoritativeText);
    const native = read(`${base}.render.json`), preview = read(`${base}.preview-manifest.json`);
    assert.equal(native.status, 'pass'); verify(native.spec); verify(native.output.svg);
    preview.previews.forEach(verify);
    const observations = read(`${base}.author-pixel-observations.json`);
    assert.deepEqual(observations.inspected.map(item => item.width), widths);
    for (const item of observations.inspected) { verify(item); assert.equal(item.actuallyOpened, true); }
    const initial = read(`${base}.attempts.json`);
    const repair = fs.existsSync(`${base}.repair-evidence.json`) ? read(`${base}.repair-evidence.json`) : null;
    const repairs = repair?.targetedRepairs ?? initial.targetedRepairs;
    assert(repairs <= 1);
    const correction = repair ? read(`${base}.correction.json`) : null;
    return { figure, lesson: lessonId, sourceExercise: data.owner.number,
      status: observations.hardBlockers.length ? 'author-blocked' : 'author-frozen-independent-review-pending',
      inputs: data.inputs, fullAuthoritativeTextSha256: hash(data.fullText),
      context: bind(`${base}.context.json`), spec: bind(`${base}.spec.json`), initialSpec: bind(`${base}.initial.spec.json`),
      svg: bind(`${base}.svg`), canvasPng: bind(`${base}.png`), nativeRender: bind(`${base}.render.json`), nativeStatus: native.status,
      authorAssertions: bind(`${base}.${repair ? 'corrected-author-assertions' : 'author-assertions'}.json`),
      attempts: bind(`${base}.attempts.json`), initialNativeFailureCount: initial.initialNativeFailureCount,
      initialVisualFailureCount: correction?.initialVisualFailureCount ?? 0,
      targetedRepairs: repairs, remainingRepairs: 1 - repairs, maximumRepairs: 1,
      correction: repair ? bind(`${base}.correction.json`) : null,
      repairEvidence: repair ? bind(`${base}.repair-evidence.json`) : null,
      previewManifest: bind(`${base}.preview-manifest.json`), previews: preview.previews,
      authorPixelObservations: bind(`${base}.author-pixel-observations.json`), hardBlockers: observations.hardBlockers,
      independentReview: 'pending-main-or-Mencius', promoted: false };
  });
  const output = `${ticket}/d017-t4-figures-author-freeze.json`;
  save(output, { ticket: 'STEMROBIN-181', batch: 'D017', author: 'Einstein', lesson: lessonId,
    status: outputs.some(item => item.status === 'author-blocked') ? 'author-frozen-with-blockers' : 'author-frozen-independent-review-pending',
    figures: outputs, helper: bind(`${work}/author.mjs`), sourceInventory: bind(inventoryPath),
    renderer: bind(renderer), contextAPI: bind('.agents/skills/ld-s10y-image/scripts/build_context.py'),
    actualWidths: widths, modelWidth: 640, labelModelPx: 32, minimumDisplayedTextPx: 16,
    maximumNativeOrVisualRepairsPerFigure: 1, modelCalls: 0, newExpenseUsd: 0,
    nativeReviewRecordedByAuthor: false, independentReview: 'pending-main-or-Mencius', promoted: false,
    n55StatusUnchanged: '92 source-blocked;93-98 remain ungated and unapproved; no complete-card claim',
    inFlightProcesses: [],
    limits: 'Author scratch only. No answer-key construction, independent approval, promotion, native review recording, adapt-finalize, source/template/tool/app/dependency/DB/git change, network, classroom/user-browser batch, particle loops or invented thermal/current state.' });
  console.log(JSON.stringify(bind(output)));
}

if (command === 'plan') plan(id);
else if (command === 'render') render(id);
else if (command === 'preserve') preserve(id);
else if (command === 'correct-short-angle-heads') correctShortAngleHeads(id);
else if (command === 'repair-render') render(id, true);
else if (command === 'previews') await previews(id);
else if (command === 'record-author-observations') recordObservations();
else if (command === 'freeze') freeze();
else throw new Error('Use plan/render/preserve/correct-short-angle-heads/repair-render/previews/record-author-observations/freeze;101/102 only.');

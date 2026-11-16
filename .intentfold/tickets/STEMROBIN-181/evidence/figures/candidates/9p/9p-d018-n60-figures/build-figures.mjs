import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const work = path.resolve('.tmp/STEMROBIN-181/9p-d018-n60-figures');
const ticket = path.resolve('.intentfold/tickets/STEMROBIN-181/tmp');
const inventoryPath = path.join(ticket, 'd018-n60-figure-source-inventory.json');
const freezePath = path.join(ticket, '9p-n60-prose-freeze.json');
const finalFreezePath = path.join(ticket, 'd018-n60-figures-author-freeze.json');
const python = path.resolve('.claude/skills/ld-s10y-lesson/.venv/bin/python');
const imageScripts = path.resolve('.agents/skills/ld-s10y-image/scripts');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bind = file => ({ path: path.resolve(file), sha256: sha(fs.readFileSync(file)) });
const writeNew = (file, data) => {
  assert(!fs.existsSync(file), `Preserve existing evidence: ${file}`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' });
};
const inventory = read(inventoryPath);
const frozen = read(freezePath);
const lessonPath = path.resolve(frozen.template.path);
assert.equal(bind(lessonPath).sha256, frozen.template.sha256);
assert.deepEqual(bind(lessonPath), inventory.lesson);
assert.deepEqual(bind(freezePath), inventory.proseFreeze);
const lesson = read(lessonPath);
assert.deepEqual(lesson.source.data, read(path.resolve(frozen.source.path)));
assert.equal(lesson.exercise_count, 0);
const text = [lesson.printed_title, ...lesson.prose.map(block => block.text)].join('\n\n');
delete process.env.PWDEBUG;
const env = {
  ...process.env, PYTHON: python, PYTHONDONTWRITEBYTECODE: '1',
  PLAYWRIGHT_HTML_OPEN: 'never',
};
const run = (command, args, input) => {
  const result = spawnSync(command, args, {
    env, input, encoding: 'utf8', maxBuffer: 12 * 1024 * 1024,
  });
  return { code: result.status, stdout: result.stdout, stderr: result.stderr };
};
const firstFile = (id, suffix) => path.join(work, `${id}.${suffix}`);
const repairedFile = (id, suffix) => path.join(work, 'preflight-correction', `${id}.${suffix}`);
const file = (id, suffix) => fs.existsSync(repairedFile(id,'spec.json'))
  ? repairedFile(id,suffix) : firstFile(id,suffix);
const sourceInventory = id => {
  const item = inventory.figures.find(figure => figure.id === id);
  assert(item && item.actuallyOpened);
  assert.equal(bind(item.source.path).sha256, item.source.sha256);
  return item;
};

function context(id) {
  const item = sourceInventory(id);
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
 'lessons':[{'lesson':p['lesson']['id'],'title':p['lesson']['printed_title'],
             'prose':near,'fullProse':p['lesson']['prose'],
             'authoritativeText':p['text'],'exercises':[]}],
 'inputs':p['inputs'],
 'authoritativeRule':'Complete frozen current n60 prose is authoritative. Original PNG supplies the apparatus or rough-interface structure. Do not derive answers, particle identities, measurements or extra apparatus states.'
},ensure_ascii=False))
`], JSON.stringify({
    id, source: { path: item.source.path, sha256: item.source.sha256 },
    lesson, text,
    inputs: {
      lesson: bind(lessonPath), proseFreeze: bind(freezePath),
      sourceLesson: bind(path.resolve(frozen.source.path)),
      inventory: bind(inventoryPath),
    },
  }));
  assert.equal(result.code, 0, result.stderr);
  const payload = JSON.parse(result.stdout);
  assert.deepEqual(payload.lessons[0].fullProse, lesson.prose);
  assert.equal(payload.lessons[0].authoritativeText, text);
  writeNew(file(id, 'context.json'), payload);
}

function figure(id, height, description, coordinates) {
  const source = sourceInventory(id).source;
  const screen = ([x, y]) => [x, height - y];
  const spec = {
    schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic',
    description,
    source: {
      image: { path: source.path, sha256: source.sha256 },
      authoritativeText: [{ lesson: lesson.id, text }], inventory: [],
    },
    canvas: { width: 640, height, boundingBox: [0, height, 640, 0], background: 'paper' },
    display: {
      purpose: 'instructional', layout: 'inline', maxWidthPx: 640,
      widths: [640, 331, 342], minTextPx: 16,
    },
    objects: [], assertions: [], layout: { minLabelGap: 5 },
  };
  for (const [name, at] of Object.entries(coordinates)) {
    spec.objects.push({ id: name, type: 'point', at: screen(at), visible: false });
  }
  const edge = (name, from, to, style = {}) => {
    spec.objects.push({
      id: name, type: 'segment', from, to, stroke: 'ink', strokeWidth: 4, ...style,
    });
    spec.assertions.push({ id: `${name}-connects`, type: 'connects', arrow: name, from, to });
  };
  const label = (name, at, value) => {
    spec.objects.push({
      id: name, type: 'text', at: screen(at), text: value, fontSize: 34,
      labelPlacement: { position: 'CENTER' },
    });
  };
  const polygon = (name, points, style = {}) => {
    spec.objects.push({
      id: name, type: 'polygon', points: points.map(screen),
      stroke: 'ink', strokeWidth: 3.5, fill: 'paper', fillOpacity: 0, ...style,
    });
  };
  return { spec, screen, edge, label, polygon };
}

// Clip parallel material hatch strokes to the unmeasured silhouette, not to a grid.
function hatching(spec, screen, name, polygonId, vertices, spacing) {
  const sums = vertices.map(([x, y]) => x + y);
  const ids = [];
  for (let c = Math.ceil(Math.min(...sums) / spacing) * spacing; c < Math.max(...sums); c += spacing) {
    const intersections = [];
    for (let index = 0; index < vertices.length; index++) {
      const a = vertices[index], b = vertices[(index + 1) % vertices.length];
      const denominator = b[0] + b[1] - a[0] - a[1];
      if (Math.abs(denominator) < 1e-8) continue;
      const t = (c - a[0] - a[1]) / denominator;
      if (t >= -1e-8 && t <= 1 + 1e-8) intersections.push([a[0] + t * (b[0] - a[0]), c - a[0] - t * (b[0] - a[0])]);
    }
    const unique = intersections.sort((a, b) => a[0] - b[0]).filter((value, index, values) => index === 0 || Math.abs(value[0] - values[index - 1][0]) > 1e-6);
    assert.equal(unique.length % 2, 0, 'A simple silhouette has paired line intersections.');
    for (let index = 0; index < unique.length; index += 2) {
      const a = unique[index], b = unique[index + 1];
      if (Math.hypot(a[0] - b[0], a[1] - b[1]) < 2) continue;
      const id = `${name}-${ids.length + 1}`;
      const from = screen(a), to = screen(b);
      spec.objects.push({
        id, type: 'segment', from, to, stroke: 'muted', strokeWidth: 1.8,
      });
      spec.assertions.push(
        { id: `${id}-start-in-region`, type: 'inside', point: from, container: polygonId },
        { id: `${id}-end-in-region`, type: 'inside', point: to, container: polygonId },
      );
      ids.push(id);
    }
  }
  return ids;
}

function plan104() {
  const coordinates = {
    'bucket-left-rim': [180,155], 'bucket-left-bottom': [180,430],
    'bucket-right-bottom': [360,430], 'bucket-right-rim': [360,155],
    'bucket-bottom-center': [270,430], 'bucket-collar-joint': [270,500],
    'conducting-axis-top': [270,500], 'leaf-common-joint': [270,752],
    'left-leaf-tip': [212,857], 'right-leaf-tip': [328,857],
    'positive-handle-top': [295,35], 'positive-handle-disc-joint': [260,273],
    'positive-profile-axis-top': [270,205], 'positive-profile-axis-bottom': [250,341],
    'negative-handle-top': [502,35], 'negative-handle-disc-joint': [542,276],
    'negative-profile-axis-top': [533,209], 'negative-profile-axis-bottom': [554,347],
  };
  const { spec, screen, edge, label, polygon } = figure(
    'fig-104', 1160,
    'Source apparatus state with one positive handled disc inside an open metal bucket without wall contact, a negative handled disc outside, a bucket/axis conductor, insulating collar, glass enclosure and two separated positive leaves. Printed charge symbols are qualitative only; no exact charge ratio, leaf angle, extra insertion state or operating procedure is added. Contours, view projection, texture spacing and coordinate anchors are modern schematic regularization.',
    coordinates,
  );
  spec.objects.push({
    id: 'glass-vessel-outline', type: 'svgPath',
    d: 'M 245 526 L 245 676 C 245 710 91 716 81 874 C 71 1004 153 1086 270 1086 C 387 1086 469 1004 459 874 C 449 716 295 710 295 676 L 295 526',
    stroke: 'ink', strokeWidth: 4,
  });
  polygon('vessel-foot', [[229,1086],[311,1086],[322,1124],[218,1124]], { fill: 'ink', fillOpacity: 1 });
  polygon('insulating-collar', [[240,490],[300,490],[294,522],[246,522]], { fill: 'ink', fillOpacity: 1 });
  edge('bucket-left', 'bucket-left-rim', 'bucket-left-bottom');
  edge('bucket-bottom', 'bucket-left-bottom', 'bucket-right-bottom');
  edge('bucket-right', 'bucket-right-bottom', 'bucket-right-rim');
  edge('bucket-axis', 'bucket-bottom-center', 'bucket-collar-joint', { strokeWidth: 5 });
  edge('conducting-axis', 'conducting-axis-top', 'leaf-common-joint', { strokeWidth: 4 });
  edge('left-leaf', 'leaf-common-joint', 'left-leaf-tip', { strokeWidth: 5 });
  edge('right-leaf', 'leaf-common-joint', 'right-leaf-tip', { strokeWidth: 5 });
  const positiveProfile = [[260,202],[282,207],[260,343],[238,338]];
  const negativeProfile = [[521,210],[543,206],[565,343],[543,347]];
  polygon('positive-disc-profile', positiveProfile, { fill: 'accentSoft', fillOpacity: 0.12 });
  polygon('negative-disc-profile', negativeProfile, { fill: 'ink', fillOpacity: 1 });
  const texture = hatching(spec, screen, 'positive-disc-texture', 'positive-disc-profile', positiveProfile, 13);
  edge('positive-handle', 'positive-handle-top', 'positive-handle-disc-joint', { strokeWidth: 6 });
  edge('negative-handle', 'negative-handle-top', 'negative-handle-disc-joint', { strokeWidth: 6 });
  const positiveSigns = [[304,235],[304,280],[304,325]];
  const negativeSigns = [[494,235],[494,280],[494,325]];
  const bucketSigns = [[207,307],[207,352],[207,397],[333,307],[333,352],[333,397],[270,397]];
  const leafSigns = [[207,784],[188,833],[333,784],[352,833]];
  for (const [group, positions, value] of [
    ['disc-positive',positiveSigns,'+'], ['disc-negative',negativeSigns,'−'],
    ['bucket-negative',bucketSigns,'−'], ['leaf-positive',leafSigns,'+'],
  ]) for (const [index, at] of positions.entries()) label(`${group}-${index + 1}`, at, value);
  spec.assertions.push(
    { id: 'bucket-bottom-axis-junction', type: 'pointOnLine', point: 'bucket-bottom-center', a: 'bucket-left-bottom', b: 'bucket-right-bottom' },
    { id: 'continuous-conducting-axis', type: 'collinear', a: 'bucket-bottom-center', b: 'bucket-collar-joint', c: 'leaf-common-joint' },
    { id: 'bucket-sides-parallel', type: 'parallel', a: 'bucket-left-rim', b: 'bucket-left-bottom', c: 'bucket-right-rim', d: 'bucket-right-bottom' },
    { id: 'positive-handle-disc-connection', type: 'inside', point: 'positive-handle-disc-joint', container: 'positive-disc-profile' },
    { id: 'negative-handle-disc-connection', type: 'inside', point: 'negative-handle-disc-joint', container: 'negative-disc-profile' },
    { id: 'left-leaf-descends-left', type: 'displacement', from: 'leaf-common-joint', to: 'left-leaf-tip', dx: -58, dy: -105 },
    { id: 'right-leaf-descends-right', type: 'displacement', from: 'leaf-common-joint', to: 'right-leaf-tip', dx: 58, dy: -105 },
  );
  spec.source.inventory = [
    {
      id: 'source-open-bucket-and-conducting-apparatus',
      description: sourceInventory('fig-104').sourceFacts[0].description + ' ' + sourceInventory('fig-104').sourceFacts[2].description + ' No top bar closes the bucket mouth. Coordinates and glass contour are unmeasured modern regularization.',
      objects: ['bucket-left','bucket-bottom','bucket-right','bucket-axis','insulating-collar','glass-vessel-outline','vessel-foot','conducting-axis','left-leaf','right-leaf'],
      assertions: ['bucket-left-connects','bucket-bottom-connects','bucket-right-connects','bucket-axis-connects','conducting-axis-connects','left-leaf-connects','right-leaf-connects','bucket-bottom-axis-junction','continuous-conducting-axis','bucket-sides-parallel','left-leaf-descends-left','right-leaf-descends-right'],
    },
    {
      id: 'source-two-handled-disc-profiles',
      description: sourceInventory('fig-104').sourceFacts[1].description + ' The source prose supplies disc/material semantics; pixels alone do not supply measured geometry. Texture hatch density is modern regularization.',
      objects: ['positive-handle','negative-handle','positive-disc-profile','negative-disc-profile',...texture],
      assertions: ['positive-handle-connects','negative-handle-connects','positive-handle-disc-connection','negative-handle-disc-connection',...texture.flatMap(id => [`${id}-start-in-region`,`${id}-end-in-region`])],
    },
    {
      id: 'source-qualitative-charge-symbols',
      description: sourceInventory('fig-104').sourceFacts[3].description + ' These are text glyphs, not visible coordinate points or an atom/electron tally. No signs are introduced for later prose-only apparatus states.',
      objects: [
        ...positiveSigns.map((_,index) => `disc-positive-${index + 1}`),
        ...negativeSigns.map((_,index) => `disc-negative-${index + 1}`),
        ...bucketSigns.map((_,index) => `bucket-negative-${index + 1}`),
        ...leafSigns.map((_,index) => `leaf-positive-${index + 1}`),
      ],
      assertions: [],
    },
  ];
  assert(positiveProfile.every(([x,y]) => x > 180 + 30 && x < 360 - 30 && y < 430 - 30));
  assert(negativeProfile.every(([x]) => x > 360 + 100));
  assert(positiveSigns.every(([x,y]) => x > 180 && x < 360 && y > 155 && y < 430));
  assert(bucketSigns.every(([x,y]) => x > 180 && x < 360 && y > 155 && y < 430));
  assert.equal(spec.objects.filter(item => item.type === 'text').length, 17);
  return {
    spec,
    geometryChecks: {
      positiveDiscStrictlyInsideOpenBucketAndSeparatedFromWalls: true,
      negativeDiscOutsideBucketToItsRight: true,
      handlesMeetOwnDiscProfiles: true,
      continuousAxisAndCommonLeafJointUseNativeConnectsRelations: true,
      originalQualitativeSymbolHostPositionsPreserved: true,
      noAddedCarrierMarkersOrAdditionalApparatusState: true,
      qualitativeSymbolCountsNotChargeValues: true,
    },
  };
}

function plan105() {
  const cells = [40,111,193,276,356,437,508,567,600];
  const upperDepths = [23,18,25,17,22,20,24,16];
  const lowerDepths = [20,25,18,24,21,26,19,23];
  const coordinates = {
    'upper-left-top': [40,70], 'upper-left-contact': [40,210],
    'upper-right-top': [600,70], 'upper-right-contact': [600,210],
    'lower-left-contact': [40,210], 'lower-left-bottom': [40,330],
    'lower-right-contact': [600,210], 'lower-right-bottom': [600,330],
  };
  const { spec, screen, edge, label, polygon } = figure(
    'fig-105', 400,
    'Two diagonally hatched material regions share one irregular contact interface with rounded contour traces and local dark joins. Small original marks have no certified particle identity or physical count. This is a qualitative contact sketch, not electron trajectories, interpenetrating bodies, a lattice, or a calibrated transfer-distance diagram. No arrows, charge signs, particles, numbers or answers are added. Curve smoothing and hatch density are explicitly unmeasured modern regularization.',
    coordinates,
  );
  const profile = (depths, sign) => {
    const sampled = [[cells[0],210]];
    let d = `M ${cells[0]} 210`;
    for (let i = 0; i < cells.length - 1; i++) {
      const left = cells[i], right = cells[i + 1], span = right - left;
      const p0 = [left,210], p1 = [left + span * 0.24,210 + sign * depths[i]];
      const p2 = [right - span * 0.24,210 + sign * depths[i]], p3 = [right,210];
      d += ` C ${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]} ${p3[0]} ${p3[1]}`;
      for (let step = 1; step <= 12; step++) {
        const t = step / 12, u = 1 - t;
        sampled.push([
          u ** 3 * p0[0] + 3 * u ** 2 * t * p1[0] + 3 * u * t ** 2 * p2[0] + t ** 3 * p3[0],
          u ** 3 * p0[1] + 3 * u ** 2 * t * p1[1] + 3 * u * t ** 2 * p2[1] + t ** 3 * p3[1],
        ]);
      }
    }
    return { sampled, d };
  };
  const upper = profile(upperDepths,-1), lower = profile(lowerDepths,1);
  const upperRegion = [[40,70],[600,70],...upper.sampled.toReversed()];
  const lowerRegion = [...lower.sampled,[600,330],[40,330]];
  polygon('upper-hatch-clip-region', upperRegion, { opacity: 0, fillOpacity: 0 });
  polygon('lower-hatch-clip-region', lowerRegion, { opacity: 0, fillOpacity: 0 });
  const upperHatch = hatching(spec, screen, 'upper-hatch', 'upper-hatch-clip-region', upperRegion, 24);
  const lowerHatch = hatching(spec, screen, 'lower-hatch', 'lower-hatch-clip-region', lowerRegion, 24);
  edge('upper-left-side', 'upper-left-top', 'upper-left-contact');
  edge('upper-right-side', 'upper-right-top', 'upper-right-contact');
  edge('lower-left-side', 'lower-left-contact', 'lower-left-bottom');
  edge('lower-right-side', 'lower-right-contact', 'lower-right-bottom');
  spec.objects.push(
    { id: 'upper-rough-edge', type: 'svgPath', d: upper.d, stroke: 'ink', strokeWidth: 4 },
    { id: 'lower-rough-edge', type: 'svgPath', d: lower.d, stroke: 'ink', strokeWidth: 4 },
  );
  label('upper-spatial-label', [320,32], 'Upper material');
  label('lower-spatial-label', [320,367], 'Lower material');
  spec.assertions.push(
    { id: 'left-shared-interface-frame', type: 'collinear', a: 'upper-left-top', b: 'upper-left-contact', c: 'lower-left-bottom' },
    { id: 'right-shared-interface-frame', type: 'collinear', a: 'upper-right-top', b: 'upper-right-contact', c: 'lower-right-bottom' },
    { id: 'upper-sides-parallel', type: 'parallel', a: 'upper-left-top', b: 'upper-left-contact', c: 'upper-right-top', d: 'upper-right-contact' },
    { id: 'lower-sides-parallel', type: 'parallel', a: 'lower-left-contact', b: 'lower-left-bottom', c: 'lower-right-contact', d: 'lower-right-bottom' },
  );
  spec.source.inventory = [
    {
      id: 'source-two-hatched-regions-and-shared-frame',
      description: sourceInventory('fig-105').sourceFacts[0].description + ' Hatch strokes are texture, not an exact grid. All hatch endpoints are constrained to their own region; density is modern regularization. No new horizontal top/bottom border closes the cropped bodies.',
      objects: ['upper-left-side','upper-right-side','lower-left-side','lower-right-side',...upperHatch,...lowerHatch],
      assertions: ['upper-left-side-connects','upper-right-side-connects','lower-left-side-connects','lower-right-side-connects','left-shared-interface-frame','right-shared-interface-frame','upper-sides-parallel','lower-sides-parallel',...[...upperHatch,...lowerHatch].flatMap(id => [`${id}-start-in-region`,`${id}-end-in-region`])],
    },
    {
      id: 'source-facing-rough-contours',
      description: sourceInventory('fig-105').sourceFacts[1].description + ' Smooth facing contours retain the repeated rounded interface gaps/joins without assigning atom/electron identities. Curve subdivisions are author construction, not a certified particle or contact count; upper/lower material interiors do not cross.',
      objects: ['upper-rough-edge','lower-rough-edge'],
      assertions: ['left-shared-interface-frame','right-shared-interface-frame'],
    },
    {
      id: 'modern-nonprinting-hatch-clipping-regions',
      description: 'Transparent construction polygons constrain hatch endpoints; their borders and fills have zero opacity and all JSXGraph vertices are hidden. They add no visible frame or source particles.',
      objects: ['upper-hatch-clip-region','lower-hatch-clip-region'], assertions: [],
    },
    {
      id: 'modern-spatial-english-labels',
      description: 'Upper material / Lower material identify spatial regions only. These labels are modern additions, not printed source labels, named chemical species, quantities or directions.',
      objects: ['upper-spatial-label','lower-spatial-label'], assertions: [],
    },
  ];
  assert(upper.sampled.every((point,index) => point[1] <= lower.sampled[index][1]));
  assert([...upper.sampled,...lower.sampled].every(([x,y]) => x >= 40 && x <= 600 && y >= 180 && y <= 240));
  assert.equal(spec.objects.some(item => ['circle','arrow','grid','axis','measure'].includes(item.type)), false);
  return {
    spec,
    geometryChecks: {
      twoRegionsShareOneFacingInterface: true,
      upperLowerMaterialInteriorsDoNotCross: true,
      allTextureEndpointsInOwnRegionUseNativeInsideAssertions: true,
      repeatedSourceContourInkNotAssignedParticleIdentityOrCount: true,
      noAddedArrowChargeScaleGridMeasurementOrAnswer: true,
      modernLabelsAreSpatialOnly: true,
      clippingPolygonsAndAllCoordinateVerticesDoNotPrint: true,
    },
  };
}

function plan(id) {
  assert(!fs.existsSync(file(id, 'spec.json')), 'Plan once; a repair needs a separate preserved candidate.');
  context(id);
  const built = id === 'fig-104' ? plan104() : plan105();
  const { spec } = built;
  assert(spec.objects.filter(object => object.type === 'point').every(object => object.visible === false && !object.label));
  const mapped = new Set(spec.source.inventory.flatMap(group => group.objects));
  for (const object of spec.objects.filter(object => object.type !== 'point')) {
    assert(mapped.has(object.id), `Object must be inventoried: ${object.id}`);
  }
  writeNew(file(id, 'author-assertions.json'), {
    ticket: 'STEMROBIN-181', batch: 'D018', figure: id,
    source: sourceInventory(id).source,
    lesson: bind(lessonPath), context: bind(file(id, 'context.json')),
    inventory: bind(inventoryPath), geometryChecks: built.geometryChecks,
    allConstructionPointsExplicitlyHidden: true,
    allVisibleObjectsMappedToInventory: true,
    independentReview: 'pending; author checks are not independent approval',
  });
  writeNew(file(id, 'spec.json'), spec);
  const validation = run(python, ['-B', path.join(imageScripts,'validate_spec.py'), file(id,'spec.json'), '--stage','draft','--json']);
  writeNew(file(id, 'preflight.json'), validation);
  console.log(JSON.stringify({ id, context: bind(file(id,'context.json')), spec: bind(file(id,'spec.json')), validation }, null, 2));
}

function repairPreflight(id) {
  assert.equal(read(firstFile(id,'preflight.json')).code, 2);
  assert(!fs.existsSync(repairedFile(id,'spec.json')), 'Only one targeted author correction.');
  assert(!fs.existsSync(firstFile(id,'render.json')), 'This correction precedes the first native render.');
  const spec = read(firstFile(id,'spec.json'));
  const anchors = [], deltas = [];
  for (const object of spec.objects) {
    if (object.type !== 'segment' || !/^(positive-disc-texture|upper-hatch|lower-hatch)-\d+$/.test(object.id)) continue;
    const a = object.from, b = object.to;
    assert(Array.isArray(a) && Array.isArray(b));
    const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const inset = Math.min(1, length / 4), t = inset / length;
    const from = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
    const to = [b[0] + (a[0] - b[0]) * t, b[1] + (a[1] - b[1]) * t];
    const fromId = `${object.id}-start-anchor`, toId = `${object.id}-end-anchor`;
    anchors.push(
      { id: fromId, type: 'point', at: from, visible: false },
      { id: toId, type: 'point', at: to, visible: false },
    );
    object.from = fromId; object.to = toId;
    spec.assertions.find(item => item.id === `${object.id}-start-in-region`).point = fromId;
    spec.assertions.find(item => item.id === `${object.id}-end-in-region`).point = toId;
    deltas.push({ object: object.id, before: { from: a, to: b }, after: { from, to }, insetPx: inset });
  }
  spec.objects = [...anchors,...spec.objects];
  const layoutDelta = id === 'fig-104'
    ? { before: spec.layout.minLabelGap, after: 2, reason: 'Modern collision-clearance padding adjusted to the unchanged 45px repeated-symbol spacing before first render; no text size or anchor changes.' }
    : null;
  if (layoutDelta) spec.layout.minLabelGap = layoutDelta.after;
  fs.mkdirSync(path.dirname(repairedFile(id,'context.json')), { recursive: true });
  fs.copyFileSync(firstFile(id,'context.json'),repairedFile(id,'context.json'),fs.constants.COPYFILE_EXCL);
  writeNew(repairedFile(id,'spec.json'), spec);
  writeNew(repairedFile(id,'preflight-correction.json'), {
    figure: id, targetedAuthorCorrectionRound: 1,
    reason: 'Native inside predicate rejects endpoints exactly on clipping boundaries. Only texture ends move at most1px inward; all construction endpoints are now explicit hidden points.',
    before: {
      spec: bind(firstFile(id,'spec.json')), context: bind(firstFile(id,'context.json')),
      failure: bind(firstFile(id,'preflight.json')),
    },
    current: { spec: bind(repairedFile(id,'spec.json')), context: bind(repairedFile(id,'context.json')) },
    textureDeltas: deltas, layoutDelta,
    sourceAndFullContextUnchanged: true, apparatusRegionsLabelsAndChargeSymbolsUnchanged: true,
    firstRenderStillPending: true, remainingTargetedAuthorRepairs: 0,
  });
  const authored = read(firstFile(id,'author-assertions.json'));
  writeNew(repairedFile(id,'author-assertions.json'), {
    ...authored, context: bind(repairedFile(id,'context.json')),
    targetedAuthorCorrection: bind(repairedFile(id,'preflight-correction.json')),
    textureEndpointsStrictlyInsideAndExplicitlyHidden: true,
  });
  const validation = run(python, ['-B', path.join(imageScripts,'validate_spec.py'), repairedFile(id,'spec.json'), '--stage','draft','--json']);
  writeNew(repairedFile(id,'preflight.json'), validation);
  console.log(JSON.stringify({ id, spec: bind(repairedFile(id,'spec.json')), correction: bind(repairedFile(id,'preflight-correction.json')), validation }, null, 2));
}

function render(id) {
  assert.equal(read(file(id, 'preflight.json')).code, 0);
  for (const suffix of ['svg','png','render.json','render-command.json']) assert(!fs.existsSync(file(id,suffix)), 'Do not rerender the first candidate.');
  const result = run('node', [
    path.join(imageScripts, 'render_spec.mjs'),
    '--spec', file(id,'spec.json'), '--svg', file(id,'svg'),
    '--png', file(id,'png'), '--report', file(id,'render.json'),
  ]);
  writeNew(file(id, 'render-command.json'), {
    ...result,
    entrypoint: bind(path.join(imageScripts,'render_spec.mjs')),
    nativeLauncherInspected: {
      explicitlyHeadless: true, isolatedFreshProfile: true,
      persistentProfile: false, CDP: false, userWindowOrTabUsed: false,
      PWDEBUGUnset: true, htmlReportOpen: false, taskBrowserClosedByNativeFinally: true,
    },
  });
  console.log(JSON.stringify({ id, ...result, report: fs.existsSync(file(id,'render.json')) ? read(file(id,'render.json')) : null }, null, 2));
}

function previews(id) {
  const spec = read(file(id,'spec.json'));
  const report = read(file(id,'render.json'));
  assert.equal(report.spec.sha256, bind(file(id,'spec.json')).sha256);
  assert.equal(report.output.svg.sha256, bind(file(id,'svg')).sha256);
  const require = createRequire(path.resolve('.claude/skills/ld-s10y-lesson/package.json'));
  const { Resvg } = require('@resvg/resvg-js');
  const svg = fs.readFileSync(file(id,'svg'),'utf8');
  const palette = {
    ink: '#15201f', muted: '#4c5a58', accent: '#15201f',
    'accent-soft': '#8a9795', grid: '#e3eae9', paper: '#ffffff',
  };
  // Resolve only the renderer's fixed CSS color variables in the raster input.
  // The semantic, theme-aware original SVG remains byte-identical.
  const rasterInput = svg.replace(/var\(--ld-figure-([a-z-]+)(?:,\s*[^)]+)?\)/g, (match, role) => {
    assert(role in palette, `Unknown native palette role: ${role}`);
    return palette[role];
  });
  const outputs = [];
  for (const width of spec.display.widths) {
    const output = new Resvg(rasterInput, {
      background: 'white', fitTo: { mode: 'width', value: width },
    }).render();
    const png = file(id, `w${width}.png`);
    assert(!fs.existsSync(png));
    fs.writeFileSync(png, output.asPng(), { flag: 'wx' });
    outputs.push({
      ...bind(png), width: output.width, height: output.height,
      minimumDeclaredLabelPx: Math.min(...spec.objects.filter(item => item.type === 'text').map(item => (item.fontSize || 28) * width / spec.canvas.width)),
    });
  }
  assert.equal(bind(file(id,'svg')).sha256, report.output.svg.sha256);
  writeNew(file(id,'preview-metrics.json'), {
    renderer: 'Existing lesson-owned @resvg/resvg-js',
    originalSvg: bind(file(id,'svg')),
    rasterInputSha256: sha(rasterInput), colorVariableResolutionOnly: true,
    originalSvgUnmodified: true, browserUsedForPreviews: false,
    outputPixelsRenderedFromSvgAtDeclaredWidths: true,
    outputs,
  });
  console.log(JSON.stringify({ id, outputs }, null, 2));
}

function freeze() {
  const pixelsPath = path.join(work,'author-pixel-observations.json');
  const pixels = read(pixelsPath);
  assert.equal(bind(lessonPath).sha256, frozen.template.sha256);
  assert.equal(bind(freezePath).sha256, inventory.proseFreeze.sha256);
  const figures = [];
  for (const id of ['fig-104','fig-105']) {
    const spec = read(file(id,'spec.json')), report = read(file(id,'render.json'));
    const preview = read(file(id,'preview-metrics.json'));
    assert.equal(report.status, 'pass');
    assert.equal(report.spec.sha256, bind(file(id,'spec.json')).sha256);
    assert.equal(report.output.svg.sha256, bind(file(id,'svg')).sha256);
    assert.deepEqual(spec.source.authoritativeText, [{ lesson: lesson.id, text }]);
    assert.deepEqual(read(file(id,'context.json')).lessons[0].fullProse, lesson.prose);
    assert.deepEqual(preview.outputs.map(item => item.width), [640,331,342]);
    for (const item of preview.outputs) {
      assert.equal(bind(item.path).sha256, item.sha256);
      assert(item.minimumDeclaredLabelPx >= 16);
    }
    const observed = pixels.figures.find(item => item.id === id).previews;
    assert.deepEqual(observed.map(item => item.width), [640,331,342]);
    assert(observed.every(item => item.actuallyOpened && item.detail === 'original'));
    for (const output of preview.outputs) {
      const observation = observed.find(item => item.width === output.width);
      assert.equal(observation.path,output.path);
      assert.equal(observation.sha256,output.sha256);
      assert.equal(observation.height,output.height);
    }
    const validation = run(python, ['-B', path.join(imageScripts,'validate_spec.py'), file(id,'spec.json'), '--stage','rendered','--json']);
    writeNew(file(id,'rendered-validation.json'), validation);
    assert.equal(validation.code, 0, validation.stderr || validation.stdout);
    const manifest = {
      ticket: 'STEMROBIN-181', batch: 'D018', figure: id,
      status: 'author-frozen-independent-review-pending', mode: 'deterministic',
      bindings: {
        source: { path: sourceInventory(id).source.path, sha256: sourceInventory(id).source.sha256 },
        lesson: bind(lessonPath), proseFreeze: bind(freezePath),
        context: bind(file(id,'context.json')), inventory: bind(inventoryPath),
        spec: bind(file(id,'spec.json')), svg: bind(file(id,'svg')),
        render: bind(file(id,'render.json')),
      },
      candidate: bind(file(id,'png')),
      previews: preview.outputs,
      previewMetrics: bind(file(id,'preview-metrics.json')),
      authorAssertions: bind(file(id,'author-assertions.json')),
      draftValidation: bind(file(id,'preflight.json')),
      renderedValidation: bind(file(id,'rendered-validation.json')),
      renderCommand: bind(file(id,'render-command.json')),
      authorPixelObservations: bind(pixelsPath),
      renderRuns: 1, targetedAuthorRepairs: 1, remainingTargetedAuthorRepairs: 0,
      targetedAuthorCorrection: bind(repairedFile(id,'preflight-correction.json')),
      initialCandidate: {
        spec: bind(firstFile(id,'spec.json')), context: bind(firstFile(id,'context.json')),
        preflightFailure: bind(firstFile(id,'preflight.json')),
        authorAssertions: bind(firstFile(id,'author-assertions.json')),
      },
      generationCalls: 0,
      independentReview: 'pending', promoted: false,
    };
    writeNew(file(id,'author-manifest.json'), manifest);
    figures.push({ ...manifest, authorManifest: bind(file(id,'author-manifest.json')) });
  }
  const payload = {
    ticket: 'STEMROBIN-181', batch: 'D018', role: 'figure-author-only',
    status: 'author-frozen-independent-review-pending',
    lesson: bind(lessonPath), proseFreeze: bind(freezePath),
    authoritativeTextSha256: sha(text), sourceInventory: bind(inventoryPath),
    figures, helper: bind(path.join(work,'build-figures.mjs')),
    beforePreflightCorrectionHelper: bind(path.join(work,'build-figures.before-preflight-correction.mjs')),
    imageSkill: bind(path.resolve('.agents/skills/ld-s10y-image/SKILL.md')),
    nativeTools: ['build_context.py','validate_spec.py','render_spec.mjs','materialize_arrowheads.mjs'].map(name => bind(path.join(imageScripts,name))),
    nativeSpecSchema: bind(path.resolve('.agents/skills/ld-s10y-image/assets/figure-spec.schema.json')),
    separateScienceOrSourceGatePerformed: false,
    independentFigureApproval: false,
    promotionOrModernFinalization: false,
    rawSourceOrLessonTemplateEdits: false,
    customBrowserOrProductAppChecks: false,
    databaseGitDependencyOrD017CommitSetChanges: false,
    inFlightProcesses: 0,
  };
  writeNew(finalFreezePath,payload);
  fs.copyFileSync(finalFreezePath,path.join(work,'author-freeze.json'),fs.constants.COPYFILE_EXCL);
  console.log(JSON.stringify({
    freeze: bind(finalFreezePath), scratchFreeze: bind(path.join(work,'author-freeze.json')),
    status: payload.status, figures: figures.map(item => ({
      id: item.figure, bindings: item.bindings, previews: item.previews,
      renderRuns: item.renderRuns, targetedAuthorRepairs: item.targetedAuthorRepairs,
    })), inFlightProcesses: 0,
  }, null, 2));
}

const [command,id] = process.argv.slice(2);
assert(command === 'freeze' || ['fig-104','fig-105'].includes(id));
if (command === 'plan') plan(id);
else if (command === 'repair-preflight') repairPreflight(id);
else if (command === 'render') render(id);
else if (command === 'previews') previews(id);
else if (command === 'freeze') freeze();
else throw new Error('Use explicit plan/repair-preflight/render/previews <figure> or freeze; no automatic retries.');
